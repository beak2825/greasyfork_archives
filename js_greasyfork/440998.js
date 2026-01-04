// ==UserScript==
// @name         云邮教学空间资源文件一键下载
// @namespace    bupt_ucloud_helper
// @version      1.2
// @description  为云邮教学空间资源预览页面添加下载原文件按钮，支持各类型文件，绕过只允许在线查看的设置。
// @author       Zhiwei
// @license      GNU GPLv3
// @match        https://ucloud.bupt.edu.cn/uclass/course.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bupt.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440998/%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440998/%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href = window.location.href;
    var pattern = /resourceLearn.+&previewUrl=(.+?)&/;

    if (pattern.test(href) === true) {
        var url = pattern.exec(href)[1];
        var resourceDownloadURL = decodeURIComponent(url);
        console.log('File URL: ' + resourceDownloadURL);

        var button = document.createElement('button');
        var bodyTag = document.querySelector('body');

        bodyTag.appendChild(button);
        button.innerHTML = '下载资源';
        button.style = 'position: fixed; border: none; border-radius: 2em; top: 4em; right: 3em; padding: 1em 2em; margin: 1em 2em; text-align: center; color: white; background: #003399; opacity: 0.8; cursor: pointer;';
        button.onclick = function(){window.open(resourceDownloadURL);};
    }
})();
