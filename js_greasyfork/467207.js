// ==UserScript==
// @name         CNKI学术搜索注入复制DOI按钮
// @namespace    https://greasyfork.org/zh-CN/users/883114-lys-qs
// @version      0.22
// @description  CNKI学术搜索注入复制DOI按钮。
// @author       LYS
// @match        https://scholar.cnki.net/zn/Detail/index/*
// @run-at       document-end
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467207/CNKI%E5%AD%A6%E6%9C%AF%E6%90%9C%E7%B4%A2%E6%B3%A8%E5%85%A5%E5%A4%8D%E5%88%B6DOI%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/467207/CNKI%E5%AD%A6%E6%9C%AF%E6%90%9C%E7%B4%A2%E6%B3%A8%E5%85%A5%E5%A4%8D%E5%88%B6DOI%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (typeof jQuery == 'undefined') {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
    document.head.appendChild(script);

    script.onload = function () {
        // jQuery加载完成后执行的代码
        // 创建一个 <style> 标签
        var style = document.createElement('style');
        style.type = 'text/css';

        // 设置 CSS 样式内容
        var cssContent = '.copy-button {' +
            '  background-color: #fff;' +
            '  color: #007bff;' +
            '  border: 1px solid #007bff;' +
            '  border-radius: 5px;' +
            '  padding: 5px 10px;' +
            '  font-size: 14px;' +
            '  font-weight: bold;' +
            '  cursor: pointer;' +
            '}\n' +
            '.copy-button:hover {' +
            '  background-color: #007bff;' +
            '  color: #fff;' +
            '}';

        style.appendChild(document.createTextNode(cssContent));

        // 将 <style> 标签添加到 <head> 元素中
        document.head.appendChild(style);




        var doiElem = $('.detail_doc-doi__VX6o2 a');
        var button = $('<button/>', {
            text: 'Copy DOI',
            id: 'copyButton',
            class: 'copy-button'
        });
        doiElem.after(button);

        button.on('click', function (event) {
            var doiText = doiElem.text();
            navigator.clipboard.writeText(doiText).then(function () {
                console.log('DOI copy successful');
                alert('DOI copy successful');
            }, function () {
                console.error('Copy failed.');
                alert('Copy failed.');
            });
        });
    };
} else {
    // jQuery已经加载，可以直接执行代码
    $(document).ready(function () {
        // 创建一个 <style> 标签
        var style = document.createElement('style');
        style.type = 'text/css';

        // 设置 CSS 样式内容
        var cssContent = '.copy-button {' +
            '  background-color: #fff;' +
            '  color: #007bff;' +
            '  border: 1px solid #007bff;' +
            '  border-radius: 5px;' +
            '  padding: 5px 10px;' +
            '  font-size: 14px;' +
            '  font-weight: bold;' +
            '  cursor: pointer;' +
            '}\n' +
            '.copy-button:hover {' +
            '  background-color: #007bff;' +
            '  color: #fff;' +
            '}';

        style.appendChild(document.createTextNode(cssContent));

        // 将 <style> 标签添加到 <head> 元素中
        document.head.appendChild(style);


        var doiElem = $('.detail_doc-doi__VX6o2 a');
        var button = $('<button/>', {
            text: 'Copy DOI',
            id: 'copyButton',
            class: 'copy-button'
        });
        doiElem.after(button);

        button.on('click', function (event) {
            var doiText = doiElem.text();
            navigator.clipboard.writeText(doiText).then(function () {
                console.log('DOI copy successful');
                alert('DOI copy successful');
            }, function () {
                console.error('Copy failed.');
                alert('Copy failed.');
            });
        });
    });
}
})();