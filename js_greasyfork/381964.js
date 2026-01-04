// ==UserScript==
// @name         CenterIt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.cse.iitb.ac.in/~soumen/*
// @match        https://en.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381964/CenterIt.user.js
// @updateURL https://update.greasyfork.org/scripts/381964/CenterIt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.screen.width < 1920){
        document.body.setAttribute('style', 'width: 900px; position: absolute; top: 0px; left: 0; right: 0; margin-left: auto; margin-right: auto;');
    }else{
        document.body.setAttribute('style', 'width: 1200px; position: absolute; top: 0px; left: 0; right: 0; margin-left: auto; margin-right: auto;');
    }
})();