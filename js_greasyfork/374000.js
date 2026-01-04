// ==UserScript==
// @name         批量调试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://gemini.mobifun365.net/gemini-offer-gemini/index?*
// @downloadURL https://update.greasyfork.org/scripts/374000/%E6%89%B9%E9%87%8F%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374000/%E6%89%B9%E9%87%8F%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cks=document.getElementsByName("selection[]");
    for(var i=0;i<19;i++)
    {
        cks[i].click();
    }
    // Your code here...
})();