// ==UserScript==
// @name         b站首页添加“观看列表/当前在线”按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  适用于2019-2021版本的首页，请先使用脚本 “B站自动回到旧版（by 深蓝之亘）”
// @author       Earmo
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492181/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E2%80%9C%E8%A7%82%E7%9C%8B%E5%88%97%E8%A1%A8%E5%BD%93%E5%89%8D%E5%9C%A8%E7%BA%BF%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492181/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E2%80%9C%E8%A7%82%E7%9C%8B%E5%88%97%E8%A1%A8%E5%BD%93%E5%89%8D%E5%9C%A8%E7%BA%BF%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var div = document.createElement('div');
    div.style.textAlign = 'center';
    div.style.width = 'auto';
    div.style.cursor = 'pointer';

    // “当前在线”按钮，根据需要可自行修改title和innerText的字符
    var a = document.createElement('a');
    a.href = 'https://www.bilibili.com/video/online.html';
    a.target = '_blank'; // Open link in new tab
    a.title = '在线列表';
    a.innerText = '在线列表';

    // 样式根据需要可自行修改backgroundColor的色码
    div.style.display = 'inline-block';
    div.style.padding = '10px 20px';
    div.style.backgroundColor = '#00AEEC';
    div.style.color = '#fff';
    div.style.borderRadius = '5px';
    div.style.textDecoration = 'none';
    div.style.fontWeight = 'bold';

    div.appendChild(a);

    // 新标签打开
    div.addEventListener('click', function() {
        window.open('https://www.bilibili.com/video/online.html', '_blank');
    });

    // 将创建的按钮添加到主页main标签下的第二个section下
    var main = document.querySelector('main');
    if (main) {
        var section = main.querySelectorAll('section')[1];
        if (section) {
            section.insertBefore(div, section.firstChild);
        }
    }
})();