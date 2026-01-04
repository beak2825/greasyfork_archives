// ==UserScript==
// @name         Change_YouTube_Logo_Text
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Changes YouTube logo text to whatever is stored in the "text" variable
// @author       David Balian
// @match        https://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/1384/1384060.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433738/Change_YouTube_Logo_Text.user.js
// @updateURL https://update.greasyfork.org/scripts/433738/Change_YouTube_Logo_Text.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //CHANGE THE TEXT BELOW
    let text = 'David';


    let replacement = document.getElementById("logo");
    replacement.removeAttribute('id');
    replacement.innerHTML = `<a href="https://www.youtube.com/" style="text-decoration: none;"><div style="display:flex; justify-content:center; align-items:center;"><img src="https://cdn-icons-png.flaticon.com/32/1384/1384060.png" style="margin-left:10px;"/><h1 style="color:white; margin-left:4px;">${text}</h1></div></a>`;
    let useless = document.getElementById("logo-icon");
    useless.remove();
    
})();