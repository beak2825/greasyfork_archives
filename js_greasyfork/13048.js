// ==UserScript==
// @name         MacApp.so_Show_Download_Button
// @namespace    http://your.homepage/
// @version      0.99.2
// @description  show downlaod button on macapp.so
// @author       ooops
// @match        http://www.macapp.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13048/MacAppso_Show_Download_Button.user.js
// @updateURL https://update.greasyfork.org/scripts/13048/MacAppso_Show_Download_Button.meta.js
// ==/UserScript==

window.onload = function() {
    // 得到提取码
    var captcha = document.querySelector('#code').innerHTML;
    // 构建下载按钮
    var downloadButton = document.createElement('a');
    downloadButton.innerHTML = '下载 [';
    var span = document.createElement('span');
    span.innerHTML = captcha;
    downloadButton.appendChild(span);
    var rightParenthesis = document.createTextNode(']');
    downloadButton.appendChild(rightParenthesis);
    // 调整样式
    span.style.color = '#000';
    downloadButton.style.width = '90px';
    // 设置下载链接
    var href = window.location.protocol + '//' + window.location.host + '/go' + window.location.pathname;
    downloadButton.setAttribute('href', href);
    downloadButton.setAttribute('target', '_blank');
    // 添加到HTML中
    var downloadDiv = document.querySelector('.download');
    downloadDiv.insertBefore(downloadButton, downloadDiv.childNodes[0]);
};