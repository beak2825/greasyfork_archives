// ==UserScript==
// @name         V2新标签页打开
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  从新标签页打开页面
// @author       You
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486557/V2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/486557/V2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function(){
        document.querySelectorAll("a[class='topic-link']").forEach(e => e.setAttribute("target","_blank"))
    })
})();