// ==UserScript==
// @name         block zhihu banner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  block zhihu.com banner
// @author       IanYet
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437065/block%20zhihu%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/437065/block%20zhihu%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href

    if(!url.includes('zhihu.com')) return

    const closeEl = document.querySelector('#root > div > main > div > div:nth-child(2) > div > svg')

    const ev = document.createEvent('Event')
    ev.initEvent('click', true,true)

    closeEl.dispatchEvent(ev)

    // Your code here...
})();