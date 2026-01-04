// ==UserScript==
// @name         Share Confluence Like Shimo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Share Confluence pages Like Shimo
// @author       lsdsjy
// @match        https://confluence.zhenguanyu.com/pages/viewpage.action?pageId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431052/Share%20Confluence%20Like%20Shimo.user.js
// @updateURL https://update.greasyfork.org/scripts/431052/Share%20Confluence%20Like%20Shimo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#shareContentLink')?.addEventListener('click', () => {
        const text = location.href.split('#')[0] + `《${document.querySelector('#title-text')?.innerText}》`
        navigator.clipboard.writeText(text)
    })
})();