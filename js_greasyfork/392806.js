// ==UserScript==
// @name         thehentaiworld下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       wodexianghua
// @match        https://thehentaiworld.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392806/thehentaiworld%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392806/thehentaiworld%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function downloadFile(filename, content) {
        // 创建隐藏的可下载链接
        let eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.href = content;
        eleLink.style.display = 'none';
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }
    let link_a = document.querySelectorAll('#thumbContainer .thumb');
    let st = '<button class="download" style="background: #fff;text-align: left;position: absolute;margin: 2px;padding: 3px;-moz-border-radius: 0 0 5px;-webkit-border-radius: 0 0 5px 0;border-radius: 0 0 5px;bottom: 1px;right: 1px;z-index: 1;">下载</button>';
    for (let i = 0; i < link_a.length; i++) {
        link_a[i].style.position = 'relative';
        link_a[i].insertAdjacentHTML('afterbegin', st);
        link_a[i].onclick = function (event) {
            let link = link_a[i].querySelectorAll('.border')[0].getAttribute('src');
            if ((link.lastIndexOf('thumb') != -1)) {
                link = link.slice(0, (link.lastIndexOf('thumb') - 1)) + '.mp4';
            }
            else if ((link.lastIndexOf('-220x147')) != -1) {
                link = link.replace('-220x147', '');
            }
            console.log(link);
            let sz = link.split('/');
            downloadFile(sz[sz.length - 1], link);
        };
    }
    // Your code here...
})();