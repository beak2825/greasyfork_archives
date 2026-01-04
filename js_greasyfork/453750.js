// ==UserScript==
// @name         Github open link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增加在线预览代码按钮
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453750/Github%20open%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/453750/Github%20open%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
const ul = document.querySelector('.pagehead-actions')

const button = document.createElement('li')
const a = document.createElement('A')
a.setAttribute('href', document.location.href.replace('github.com', 'github.dev'))
a.setAttribute('target', '_blank')
a.setAttribute('class', 'btn btn-sm')
a.innerText = 'OpenDev'
button.appendChild(a)

ul.prepend(button)
    // Your code here...
})();