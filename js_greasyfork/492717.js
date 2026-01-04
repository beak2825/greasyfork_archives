// ==UserScript==
// @name         提取BT磁力链接
// @namespace    http://tampermonkey.net/
// @version      2024-04-17
// @description  从www.btdx8.vip网页中提取并显示BT磁力链接
// @author       可乐虎
// @match        *://www.btdx8.vip/torrent/*
// @match        *://btdx8.vip/torrent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btdx8.vip
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492717/%E6%8F%90%E5%8F%96BT%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/492717/%E6%8F%90%E5%8F%96BT%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    var floatButton = document.createElement('div');
    floatButton.innerHTML = '<button id="extractButton" style="position: fixed; left: 10px; top: 50%; transform: translateY(-50%); z-index: 9999; background-color: blue; color: white; border: none; padding: 10px; cursor: pointer;">提取磁链</button>';
    document.body.appendChild(floatButton);

    // 点击按钮触发提取磁力链接操作
    document.getElementById('extractButton').addEventListener('click', function() {
        // 提取磁力链接并显示在弹窗中
        var magnetLinks = extractMagnetLinks();
        showPopup(magnetLinks);
    });

    // 提取磁力链接的函数
    function extractMagnetLinks() {
        var links = document.querySelectorAll('a[href^="magnet:?"]');
        var magnetLinks = [];
        links.forEach(function(link) {
            magnetLinks.push(link.href);
        });
        return magnetLinks;
    }

    // 显示弹窗的函数
    function showPopup(links) {
        var popup = document.createElement('div');
        popup.innerHTML = '<div style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 9999;">' +
            '<h2>提取的磁力链接：</h2>' +
            '<textarea id="magnetLinks" style="width: 100%; height: 200px;">' + links.join('\n') + '</textarea>' +
            '<button id="copyButton" style="margin-top: 10px;">复制</button>' +
            '<button id="closeButton" style="margin-top: 10px; margin-left: 10px;">关闭</button>' +
            '</div>';
        document.body.appendChild(popup);

        // 复制按钮的点击事件
        document.getElementById('copyButton').addEventListener('click', function() {
            var textarea = document.getElementById('magnetLinks');
            textarea.select();
            document.execCommand('copy');
            alert('结果已经复制到剪切板上！');
        });

        // 关闭按钮的点击事件
        document.getElementById('closeButton').addEventListener('click', function() {
            document.body.removeChild(popup);
        });
    }
})();