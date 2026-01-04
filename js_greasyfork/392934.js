// ==UserScript==
// @name         Hide Stanley Bot
// @namespace    https://hackforums.net/
// @version      1.0
// @description  Name says it all
// @author       Pillows
// @match        https://hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392934/Hide%20Stanley%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/392934/Hide%20Stanley%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var postEl = document.getElementsByClassName("post_wrapper")
    var currentEl;
    for(var i = 0; i < postEl.length; i++){
    	currentEl = postEl[i];
    	if(currentEl.children[0].children[1].children[0].children[0].children[0].innerText === "Stanley")
    		currentEl.hidden = true;
    }
})();