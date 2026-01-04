
// ==UserScript==
// @name         test
// @namespace    https://blog.csdn.net/qq_42951560
// @version      0.1
// @description  oooooooo
// @author       ghgxj
// @match        *://*.douyu.com/topic/*
// @match        *://*.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414621/test.user.js
// @updateURL https://update.greasyfork.org/scripts/414621/test.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var test = setInterval(function(){ var elements = document.getElementsByClassName("PlayerToolbar");
    elements[0].parentNode.removeChild(elements[0]); }, 2000);
	setTimeout(function(){ clearInterval(test); }, 30000);

})();