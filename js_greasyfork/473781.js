// ==UserScript==
// @name         自动新标签页打开链接-OPEN LINK WITH NEW TABS
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击链接后自动跳转到一个新的标签页而非替换原网页。-WHEN U CLICK A LINK, U WILL OPEN A NEW TAB INSTEAD OF REPLACING ORIGINAL PAGE.
// @author       shinnyou
// @grant        none
// @include      *
// @include      https://greasyfork.org/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473781/%E8%87%AA%E5%8A%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5-OPEN%20LINK%20WITH%20NEW%20TABS.user.js
// @updateURL https://update.greasyfork.org/scripts/473781/%E8%87%AA%E5%8A%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5-OPEN%20LINK%20WITH%20NEW%20TABS.meta.js
// ==/UserScript==




(function() {
    'use strict';
    
    newtab();
    function newtab(){
        document.addEventListener("click", function(event) {
        if (event.target.tagName === "A" || event.target.tagName === "span") {
            var href = event.target.href;
            window.open(href, "_blank");
            event.preventDefault();
            }
        });
    }
    
    
})();