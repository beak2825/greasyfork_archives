// ==UserScript==
// @name         北京邮电大学云邮课件下载
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  下载云邮教学空间课件
// @author       Jiayu Yang
// @match        https://ucloud.bupt.edu.cn/uclass/course.html*
// @icon         https://ucloud.bupt.edu.cn/uclass/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512027/%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6%E4%BA%91%E9%82%AE%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/512027/%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6%E4%BA%91%E9%82%AE%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;
    if (url.length <= 75 || url.substring(45, 75) != '#/resourceLearn?onlinePreview=') return;

    document.styleSheets[0].insertRule('.btn{position:fixed;right:60px;bottom:80px;width:90px;height:45px;border-radius:10px;border:none;transition-duration:0.3s;color:white;font-size:18px;background-color:#007bff;box-shadow:0 4px 8px 0 rgba(0,0,0,0.2),0 3px 10px 0 rgba(0,0,0,0.19)}');
    document.styleSheets[0].insertRule('.btn:active{background-color:#55a7ff;transition:0.15s}');
    document.styleSheets[0].insertRule('.btn:hover{background-color:#258fff;box-shadow:0 6px 8px 0 rgba(0,0,0,0.24),0 8px 24px 0 rgba(0,0,0,0.19)}');

    var btn = document.createElement('button');
    btn.innerText = '重定向';
    btn.className = 'btn';

    btn.onclick = () => {
        btn.innerText = '跳转中…';
        var l = url.search('fileucloud.bupt.edu.cn');
        var r = url.search('Fresponse-content-disposition') - 2;
        window.location.href = 'https://' + url.substring(l, r).replaceAll('%2F', '/');
    };

    document.body.appendChild(btn);
})();