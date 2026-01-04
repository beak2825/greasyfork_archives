// ==UserScript==
// @name         安徽86刷TS专用
// @namespace    http://tampermonkey.net/
// @version      0.212
// @description  方便批量刷TS使用
// @author       You
// @match        http://ngwf.cs.cmos/ngwf/src/module/basesr/query/SrProblemProcessComplexQuery.html?historyFlag=ngwf_history_page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487513/%E5%AE%89%E5%BE%BD86%E5%88%B7TS%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487513/%E5%AE%89%E5%BE%BD86%E5%88%B7TS%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换所有换行符的函数
    /*    function replaceAllNewLines(str) {
        let result = '';
        let parts = str.split('\n');
        for (let part of parts) {
            result += part.trim() + ' ';
        }
        return result.trim();
    }
*/
    function replaceAllNewLines(str) {
        let result = '';
        // Replace tabs with empty strings
        let noTabs = str.replace(/\t/g, '');
        let parts = noTabs.split('\n');
        for (let part of parts) {
            result += part.trim() + ' ';
        }
        return result.trim();
    }


    // 复制到剪贴板的函数
    function copyToClipboard(text) {
        var tempInput = document.createElement('textarea');
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // 添加按钮的函数
    function addButton() {
        console.error("我yi2直行")
        var targetContainer = document.querySelector("div.footer-btns");
        console.error(targetContainer);
        if (targetContainer) {
            var newButton = document.createElement("input");
            newButton.type = "button";
            newButton.value = "复制";
            newButton.className = "footer-b-btn";
            newButton.id = "myCopy";

            // 为按钮添加点击事件监听器
            newButton.addEventListener('click', function() {
                var iframeDocument = document;//.getElementById('uiTabIframe').contentDocument;
                let dataString = "";

                iframeDocument.querySelectorAll("#target_table > div > div.new-table.new-table-bordered.new-table-scrollable-x > div.new-table.is-scrolling-left > div.new-table-wrapper.new-table-body-wrapper > table > tbody > tr").forEach((row) => {
                    let seventhTd = row.cells[7]; // 索引从0开始
                    let eleventhTd = row.cells[11]; // 索引从0开始

                    let seventhText = seventhTd ? replaceAllNewLines(seventhTd.textContent) : '';
                    let eleventhText = eleventhTd ? replaceAllNewLines(eleventhTd.textContent) : '';

                    dataString += seventhText + '\t' + eleventhText + '\n';
                });

                // 复制到剪贴板
                copyToClipboard(dataString);
                alert('内容已复制到剪贴板');
            });

            targetContainer.appendChild(newButton);
        } else {
            console.error("目标容器未找到");
        }
    }

    // 在文档加载完毕后添加按钮
    function go() {
        setTimeout(addButton, 5000); // 5000毫秒等于5秒
    }
    go();
    console.error("我yi直行")
})();