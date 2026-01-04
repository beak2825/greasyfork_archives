// ==UserScript==
// @name         获取阿里云token
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取阿里云的token
// @author       You
// @license      MIT
// @match        https://www.aliyundrive.com/drive
// @match        https://www.aliyundrive.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470260/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91token.user.js
// @updateURL https://update.greasyfork.org/scripts/470260/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91token.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let box = document.createElement('div')
    box.class = 'my_aliyundrive_box'
    box.style.zIndex = 100000
    box.style.backgroundColor = '#48D1CC'
    // box.style.width = '220px'
    // box.style.height = '200px'
    box.style.position = 'fixed'
    box.style.top = '90px'
    box.style.right = '10px'
    box.style.padding = '5px'
    box.style.color = "#000"
    box.style.fontSize = "12px"
    box.style.textAlign = "left"

    const token = JSON.parse(localStorage.token).refresh_token
    console.log("token === ", JSON.parse(localStorage.token).refresh_token);

    let hideBtn = document.createElement('button')
    hideBtn.textContent = "关闭"
    hideBtn.onclick = function () {
        box.style.display = "none"
    }

    let tokenHtml = document.createElement('p')
    tokenHtml.id = 'my_token'
    tokenHtml.innerHTML = 'token: ' + token

    box.appendChild(tokenHtml)

    box.appendChild(hideBtn)

    document.body.appendChild(box)
})();

