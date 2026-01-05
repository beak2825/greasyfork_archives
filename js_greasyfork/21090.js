// ==UserScript==
// @name         Fanfiction.net Highlight Enable
// @namespace    https://github.com/ynx0/highlight-enable
// @version      0.1.6
// @description  Lets you highlight things on fanfiction.net
// @author       Yaseen S./ThePhantomGamer
// @match        http://www.fanfiction.net/*
// @match        https://www.fanfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21090/Fanfictionnet%20Highlight%20Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/21090/Fanfictionnet%20Highlight%20Enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = window.setTimeout(
    function(){
        console.log("working...");
        document.getElementById("storytextp").setAttribute("style", "padding: 0px 0.5em");
    }, 150);
    
})();


