// ==UserScript==
// @name         有道写作快捷键
// @namespace    https://write.youdao.com/
// @version      2024-10-24-2
// @description  给有道写作增加快捷键Ctrl+[ 是开闭翻译
// @author       YUN
// @match        https://write.youdao.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513793/%E6%9C%89%E9%81%93%E5%86%99%E4%BD%9C%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/513793/%E6%9C%89%E9%81%93%E5%86%99%E4%BD%9C%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 获取按钮元素
        var translateButton = document.querySelector('#index-page > div.wrap > div.editor-area > div.comp-editor-top-bar > div.bar-content-wrapper > div > div.editor-tool-box > div.editor-right > div.tool-wrapper.tool-compare-translate > span > a');
        var Esc=document.querySelector('#index-page > div:nth-child(11) > div > div > div.translateBtn');
        var a=0;

        // 监听键盘事件
        document.addEventListener('keydown', (event) => {

            // 检查是否按下 Ctrl+[
            if (event.ctrlKey && event.key === '[') {
                // 点击按钮
                translateButton = document.querySelector('#index-page > div.wrap > div.editor-area > div.comp-editor-top-bar > div.bar-content-wrapper > div > div.editor-tool-box > div.editor-right > div.tool-wrapper.tool-compare-translate > span > a');
                Esc=document.querySelector('#index-page > div:nth-child(11) > div > div > div.translateBtn');
                console.log(translateButton);
                if(a==0)
                {
                    translateButton.click();
                    a=1;
                }else
                {
                    Esc.click();
                    a=0;
                }
            }
            if (event.key === 'Escape') {
                Esc=document.querySelector('#index-page > div:nth-child(11) > div > div > div.translateBtn');
                Esc.click();
                a=0;
            }

        });
})();