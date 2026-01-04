// ==UserScript==
// @name         Page Visit Counter
// @namespace    http://user-script.yunser.com/
// @version      0.1
// @description  Show a counter of page visit on bottom right of page./网页访问计数器,在网页右下角显示页面的访问次数
// @author       Yunser
// @match        */*
// @icon
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.location
// @downloadURL https://update.greasyfork.org/scripts/434302/Page%20Visit%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/434302/Page%20Visit%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sValue = GM_getValue('__counter-' + window.location.href)
    let count = sValue ? (parseInt(sValue) + 1) : 1
    GM_setValue('__counter-' + window.location.href, count)
    const root = document.createElement('DIV')
    root.innerHTML = '' + count
    root.style = `
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 100000000;
    background-color: #f00;
    color: #fff;
    padding: 8px;
`
    const body = document.querySelector('body')
    body.appendChild(root)
})();
