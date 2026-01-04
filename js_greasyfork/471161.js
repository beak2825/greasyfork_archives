// ==UserScript==
// @name         Excel数据复制脚本
// @namespace    ...
// @version      2.7.2
// @description  当前支持(mabang,shopee)在网页表格的input元素上双击后弹出输入框，并复制Excel数据到当前位置的input对应的输入
// @author       nitianlihui@foxmail.com
// @match        https://www.mabangerp.com/index.php*
// @match        https://publish.mabangerp.com/*
// @match        https://seller.scs.shopee.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471161/Excel%E6%95%B0%E6%8D%AE%E5%A4%8D%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/471161/Excel%E6%95%B0%E6%8D%AE%E5%A4%8D%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //等待操作完成
    async function code(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(code())
            }, 100);

        })
    }

    // 添加 Layer 的 CSS 和 JS 文件，使用 CDN 的链接
    var layerCSS = document.createElement('link');
    layerCSS.rel = 'stylesheet';
    layerCSS.href = 'https://www.layuicdn.com/layui-v2.8.0/css/layui.css';

    var layerJS = document.createElement('script');
    layerJS.src = 'https://www.layuicdn.com/layui-v2.8.0/layui.js';
    // 添加 Layer 的 CSS 和 JS 文件，使用 CDN 的链接
    document.head.appendChild(layerCSS);
    document.head.appendChild(layerJS);
    // 双击事件处理函数
    async function handleDoubleClick(event) {
        var inputElement = event.target;
        var tableElement = inputElement.closest('table');
        // 判断是否为input元素，以及是否在table内部
        if (inputElement.nodeName === 'INPUT' && tableElement) {
            let excelData = null;
            var now_rowIndex = inputElement.closest('tr').rowIndex; // 当前input所在行的索引
            var now_columnIndex = inputElement.closest('td').cellIndex; // 当前input所在列的索引
            // console.log(now_rowIndex+"@"+now_columnIndex)
            layer.prompt({
                formType: 2, // 输入框类型，2 表示多行输入框
                title: '粘贴来自excel的数据', // 弹窗标题
                value: '', // 输入框默认值
                area: ['500px', '300px'], // 输入框大小
                btn: ['确定', '取消'], // 按钮
            }, async function (value, index) { // 点击确定按钮的回调函数
                layer.close(index); // 关闭弹窗
                excelData = value; // 调用主方法进行数据处理                
                // 示例：假设excelData是以制表符分隔的文本数据
                var rows = excelData.split('\n');
                //遍历每行数据
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    //每行切割数据
                    var columns = rows[rowIndex].split('\t');
                    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                        try {
                            var celltarget = tableElement.rows[now_rowIndex + rowIndex].cells[now_columnIndex + columnIndex];
                            var value = columns[columnIndex]
                            // 触发input的回车事件
                            let evt = document.createEvent('HTMLEvents');
                            evt.initEvent('input', true, true);
                            var element = await fill_input(celltarget)
                            element.value = value
                            element.dispatchEvent(evt)

                        } catch (error) {
                            console.log("没找到!!" + (now_rowIndex + rowIndex) + "行" + (now_columnIndex + columnIndex) + "列" + error)
                        }

                    }
                }
            });

        }
    }

    async function fill_input(celltarget) {

        if (celltarget.querySelector('input')) {
            return celltarget.querySelector('input')
        }
        else if (celltarget.querySelector('.input-mirroring div.content')) {
            var targetInput = celltarget.querySelector('.input-mirroring div.content')
            let event = new Event('click', { "bubbles": true, "cancelable": true });
            targetInput.dispatchEvent(event);
            return await code(() => {
                return document.activeElement;
            })
        }

    }

    // 监听全局的双击事件
    document.addEventListener('dblclick', handleDoubleClick);
})();