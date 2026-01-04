// ==UserScript==
// @name         正方教务系统导出成绩详情
// @namespace    https://www.klaio.top/
// @version      1.0.0
// @description  绕过正方教务管理系统的权限限制，一键导出包含平时成绩、期末成绩以及最终成绩在内的完整成绩单。
// @author       NianBroken
// @match        *://*.edu.cn/cjcx/*
// @match        *://*.edu.cn/jwglxt/cjcx/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @icon         https://www.zfsoft.com/img/zf.ico
// @homepageURL  https://github.com/NianBroken/ZFAllGradeDetails
// @supportURL   https://github.com/NianBroken/ZFAllGradeDetails/issues
// @copyright    Copyright © 2025 NianBroken. All rights reserved.
// @license      Apache-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/542632/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%87%BA%E6%88%90%E7%BB%A9%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/542632/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%87%BA%E6%88%90%E7%BB%A9%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 从页面中获取“学年”(xnm)和“学期”(xqm)下拉框的选中值。
     * 如果任一元素不存在，则抛出错误，后续逻辑会被外层 catch 捕获并提示。
     *
     * @throws {Error} 找不到对应下拉框时抛出
     * @returns {{ xnm: string, xqm: string }} 返回包含学年和学期的对象
     */
    function getTermParams() {
        const xnmEl = document.getElementById('xnm'); // 页面上学年下拉框元素
        const xqmEl = document.getElementById('xqm'); // 页面上学期下拉框元素
        if (!xnmEl || !xqmEl) {
            throw new Error('页面中未找到“学年”或“学期”下拉框');
        }
        return {
            xnm: xnmEl.value,
            xqm: xqmEl.value
        };
    }

    /**
     * 根据学年和学期参数，构造符合后端要求的
     * application/x-www-form-urlencoded 编码请求体字符串。
     * 包含功能码、模板编号以及所有需要导出的字段列信息。
     *
     * @param {{ xnm: string, xqm: string }} param0 包含学年和学期的对象
     * @returns {string} 编码后的请求体字符串，可直接作为 fetch 的 body
     */
    function buildFormBody({ xnm, xqm }) {
        const params = new URLSearchParams();           // 用于累积各项表单字段
        params.append('gnmkdmKey', 'N305005');          // 后端接口所需功能码
        params.append('xnm', xnm);                      // 当前选中的学年
        params.append('xqm', xqm);                      // 当前选中的学期
        params.append('dcclbh', 'JW_N305005_GLY');       // 导出模板标识

        // 定义所有要导出的列：课程名称、学年、学期等
        const cols = [
            'xnmmc@学年',
            'xqmmc@学期',
            'jxb_id@教学班ID',
            'xf@学分',
            'kcmc@课程名称',
            'xmcj@成绩',
            'xmblmc@成绩分项',
        ];
        cols.forEach(col => {
            params.append('exportModel.selectCol', col);
        });

        params.append('exportModel.exportWjgs', 'xls');  // 导出格式设为 xls
        params.append('fileName', '成绩单');             // 默认下载文件名

        return params.toString();                       // 返回最终编码结果
    }

    /**
     * 主流程：依次尝试两种不同的请求路径进行成绩导出，
     * 若任一路径返回成功，则直接下载；两次均失败后弹窗提示错误信息。
     */
    async function exportGrades() {
        try {
            // 获取页面上学年和学期下拉框的值
            const { xnm, xqm } = getTermParams();
            // 根据学年学期构造请求体
            const body = buildFormBody({ xnm, xqm });

            // 定义不带前缀和带 /jwglxt 前缀的两条接口路径
            const paths = [
                '/cjcx/cjcx_dcXsKccjList.html',
                '/jwglxt/cjcx/cjcx_dcXsKccjList.html'
            ];

            let lastError = null;                         // 用于记录最后一次请求的错误
            for (const path of paths) {
                try {
                    // 以 POST 方式发送表单编码请求
                    const response = await fetch(path, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body
                    });
                    if (!response.ok) {
                        // 非 2xx 响应也视为失败，触发 catch 以便重试
                        throw new Error(`HTTP 错误，状态码：${response.status}`);
                    }
                    const blob = await response.blob();     // 解析返回的二进制文件流
                    downloadBlob(blob);                     // 调用下载方法
                    return;                                 // 成功后退出，不再继续重试
                } catch (err) {
                    lastError = err;                       // 保存本次错误，继续尝试下一条路径
                }
            }

            // 两次路径均尝试失败，抛出最后一次捕获的错误
            throw lastError;
        } catch (err) {
            // 捕获所有异常并通过浏览器弹窗向用户通报
            alert(`导出失败：${err.message}`);
            console.error('导出成绩详情时发生错误：', err);
        }
    }

    /**
     * 将后端返回的 Blob 对象转换为临时下载链接，
     * 自动创建隐藏 <a> 元素并触发点击完成文件保存，
     * 最后释放 URL 对象避免内存泄漏。
     *
     * @param {Blob} blob 后端返回的二进制文件数据
     */
    function downloadBlob(blob) {
        const url = URL.createObjectURL(blob);            // 创建指向 blob 的临时 URL
        const a = document.createElement('a');           // 动态生成一个 <a> 元素
        a.href = url;                                     // 指定下载地址
        a.download = `成绩单_${Date.now()}.xlsx`;           // 设置下载文件名，保证唯一性
        document.body.appendChild(a);                     // 插入 DOM，触发 click 需要元素在文档中
        a.click();                                        // 模拟用户点击，实现下载
        document.body.removeChild(a);                     // 下载后清理 DOM
        URL.revokeObjectURL(url);                         // 释放临时 URL，防止内存泄漏
    }

    // 在 Tampermonkey 脚本菜单中注册“导出成绩详情”命令，
    // 用户可通过菜单项或 Alt+e 快捷键触发导出功能
    GM_registerMenuCommand('导出成绩详情', exportGrades, 'e');

})();
