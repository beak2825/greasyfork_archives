// ==UserScript==

// @name         GitHub原始链接

// @namespace    Linxi

// @version      1.2

// @description  添加一个按钮来打开GitHub上的原始链接。Add a button to open the GitHub raw link.

// @author       林夕

// @match        https://github.com/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/474891/GitHub%E5%8E%9F%E5%A7%8B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474891/GitHub%E5%8E%9F%E5%A7%8B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function openRawLink() {

        var rawUrl = window.location.href.replace('/blob', '').replace('github.com', 'raw.githubusercontent.com');

        window.location.href = rawUrl;

    }

    var rawButton = document.createElement('button');

    rawButton.innerHTML = '打开raw';//按钮名字

    rawButton.style.transform = 'scale(1.5)';//按钮大小

    rawButton.style.position = 'fixed';

    rawButton.style.right = '130px';//按钮左右

    rawButton.style.bottom = '80px';//按钮上下

    rawButton.addEventListener('click', openRawLink);

    document.body.appendChild(rawButton);

})();
