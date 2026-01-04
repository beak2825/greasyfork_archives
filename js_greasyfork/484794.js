// ==UserScript==
// @name         网页编辑
// @namespace    http://tampermonkey.net/
// @version      2024-01-14
// @description  用于编辑网站,可以在任何一个网站上添加或删除信息,效果和在控制台输入document.body.contentEditable = true;是一样的,点击开启可以开启,点击关闭可以关闭
// @author       超级大帅哥
// @license      超级大帅哥
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484794/%E7%BD%91%E9%A1%B5%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484794/%E7%BD%91%E9%A1%B5%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var enableButton = document.createElement('button');
    enableButton.innerHTML = '开启';

    enableButton.addEventListener('click', function() {
        document.body.contentEditable = true;
    });

    var disableButton = document.createElement('button');
    disableButton.innerHTML = '关闭';

    disableButton.addEventListener('click', function() {
        document.body.contentEditable = false;
    });
    //point
    enableButton.style.position = 'fixed';
    enableButton.style.bottom = '10px';
    enableButton.style.left = '10px';
    disableButton.style.position = 'fixed';
    disableButton.style.bottom = '50px';
    disableButton.style.left = '10px';

    document.body.appendChild(enableButton);
    document.body.appendChild(disableButton);
})();