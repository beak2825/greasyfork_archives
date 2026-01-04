// ==UserScript==
// @name         SHZU_THEOL_Download
// @namespace    https://gitee.com/likaifeng012/shzu_theol_download
// @version      1.1
// @description  石河子大学THEOL在线教育平台文档下载，可无视下载权限，直接下载为PDF文件。
// @author       likaifeng
// @match        https://eol.shzu.edu.cn/meol/common/script/preview/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/492687/SHZU_THEOL_Download.user.js
// @updateURL https://update.greasyfork.org/scripts/492687/SHZU_THEOL_Download.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // 定义下载按钮样式
    const iconStyle = {
        fontSize: '32px',
        position: 'fixed',
        top: '50%',
        right: '100px',
        transform: 'translateY(-50%)',
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '50%',
        padding: '15px',
        textDecoration: 'none',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: '9999'
    };

    // 创建下载按钮函数
    const createIcon = style => {
        const downloadIcon = document.createElement('a');
        downloadIcon.innerHTML = '&#x2B07;';
        Object.assign(downloadIcon.style, style);
        return downloadIcon;
    };

    // 获取页面标题和链接参数
    const pageTitle = document.title;
    const urlParams = new URLSearchParams(window.location.search);
    const resId = urlParams.get('resid');
    const lid = urlParams.get('lid');

    // 如果资源ID和LID存在，则进行下载操作
    if (resId && lid) {
        try {
            // 构建下载链接
            const downloadLink = `https://eol.shzu.edu.cn/meol/analytics/resPdfShow.do?resId=${resId}&lid=${lid}`;
            // 使用 fetch API 获取文件数据
            const response = await fetch(downloadLink);
            // 将文件数据转换为 Blob 对象
            const blob = await response.blob();
            // 创建下载按钮
            const downloadIcon = createIcon(iconStyle);
            // 生成 Blob URL
            const objectURL = URL.createObjectURL(blob);
            // 设置下载按钮链接和文件名
            downloadIcon.href = objectURL;
            downloadIcon.setAttribute('download', `${pageTitle}.pdf`);
            // 将下载按钮添加到页面
            document.body.appendChild(downloadIcon);
        } catch (error) {
            console.error('下载失败:', error);
        }
    } else {
        console.error('资源ID或LID参数缺失');
    }
})();
