// ==UserScript==
// @name         美剧天堂复制下载地址
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给美剧天堂的 `复制下载地址` 按钮添加点击事件
// @author       Chen
// @match        https://www.meijutt.com/content/*
// @match        https://www.meijutt.tv/content/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377463/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377463/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const copyButtons = document.getElementsByClassName("copy");
    Array.prototype.forEach.call(copyButtons, function (copyButton) {
        copyButton.onclick = function () {
            const currentDisplayTabList = Array.prototype.filter.call(document.getElementsByClassName("tabs-list"), function (element) {
                return element.style.display != "none";
            });
            try {
                const currentTab = currentDisplayTabList[0];
                const lines = currentTab.getElementsByClassName("down_list")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
                const downloadUrls = [];
                Array.prototype.forEach.call(lines, function (line) {
                    const checkBox = line.getElementsByTagName("input")[0];
                    if (checkBox.checked) {
                        downloadUrls.push(checkBox.value);
                    }
                })
                if (downloadUrls.length > 0) {
                    const urlsInOne = downloadUrls.join("\r\n");
                    copyToClipboard(urlsInOne);
                }
            } catch (error) {
                console.log("出错了");
            }
        }
    });
})();

function copyToClipboard(value) {
    const textarea = document.createElement('textarea');
    textarea.readOnly = "true"
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand('copy')) {
        alert('复制成功');
    } else {
        alert("复制失败,请打开开发者工具手动复制!");
        console.log(textarea.value);
    }
    document.body.removeChild(textarea);
}