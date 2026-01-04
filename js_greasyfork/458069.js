
// ==UserScript==
// @name         智慧树/知到|共享课课程资料下载按钮
// @namespace    https://chat.openai.com/chat
// @version      1.0
// @description  在智慧树/知到共享课的课程资料界面对每个文件提供下载按钮
// @author       ChatGPT
// @match        *://stuonline.zhihuishu.com/stuonline/*
// @grant        none
// @icon         https://www.zhihuishu.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458069/%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E5%88%B0%7C%E5%85%B1%E4%BA%AB%E8%AF%BE%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458069/%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E5%88%B0%7C%E5%85%B1%E4%BA%AB%E8%AF%BE%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var addDownloadBtn = setInterval(function() {
    var elements = document.getElementsByClassName('tm-file allfiles_one clear_float tm-items teacher-folder-list');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (!element.getElementsByClassName("docDownBtn")[0]) {
            var fileUrl = element.getElementsByTagName('a')[0].getAttribute('onclick');
            var fileName = fileUrl.split("'")[3];
            var fileId = fileUrl.split("'")[5];
            var downloadBtn = document.createElement("input");
            downloadBtn.setAttribute("type", "button");
            downloadBtn.setAttribute("class", "docDownBtn");
            downloadBtn.setAttribute("value", "下载");
            downloadBtn.setAttribute("style", "background-color: #3D84FF; color: #FFFFFF; border-radius: 10px; padding: 2px 10px;");
            downloadBtn.setAttribute("onclick", "downLoadFile(" + fileId + "," + "'" + fileName + "'" + ")");
            var td = document.createElement("td");
            td.appendChild(downloadBtn);
            element.appendChild(td);
        }
    }
}, 2000);


})();