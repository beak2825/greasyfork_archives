// ==UserScript==
// @name         liuli.se
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  磁链下载地址显示
// @author       aolose
// @include      /www\.liuli\.se\/wp\/\d+\.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402385/liulise.user.js
// @updateURL https://update.greasyfork.org/scripts/402385/liulise.meta.js
// ==/UserScript==

(function() {
   'use strict';
    const t = /[0-9a-z]{40,40}/;
    const a=[].find.call(document.querySelectorAll('.entry-content p'),p=>t.test(p.innerText));
    const r = 'magnet:?xt=urn:btih:'
    if(a)a.innerHTML=a.innerHTML.replace(/([0-9a-z]{40,40})/,`<a href="${r}$1" target="_blank">${r}$1</a>`);
})();