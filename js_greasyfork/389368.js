// ==UserScript==
// @name         反-软件No1去广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.rjno1.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389368/%E5%8F%8D-%E8%BD%AF%E4%BB%B6No1%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/389368/%E5%8F%8D-%E8%BD%AF%E4%BB%B6No1%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var boddy;
    var aaa;
    var bbb;
boddy=document.getElementById("body");
aaa= document.getElementById("rjno1checkaaa");
bbb=document.getElementById("rjno1checkbbb");
boddy.removeChild(aaa);
boddy.removeChild(bbb);
    // Your code here...
})();