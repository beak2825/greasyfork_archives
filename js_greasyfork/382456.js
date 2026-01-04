// ==UserScript==
// @name         funonline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nathan Price
// @match        https://watch-dbz48.funonline.co.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382456/funonline.user.js
// @updateURL https://update.greasyfork.org/scripts/382456/funonline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var player = document.querySelector('#content')
    if(typeof player !== 'undefined'){
        player.style.width ='100%'
        player.style.height ='100vh'
        player.style.left ='0'
        player.style.top ='0'
        player.style.float =''
        player.style.width ='100%'
        player.style.position ='absolute'
    }
    // Your code here...
})();