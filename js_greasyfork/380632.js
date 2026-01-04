// ==UserScript==
// @name         FUCK YOU YUNTECH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SmallYue
// @match        https://webapp.yuntech.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380632/FUCK%20YOU%20YUNTECH.user.js
// @updateURL https://update.greasyfork.org/scripts/380632/FUCK%20YOU%20YUNTECH.meta.js
// ==/UserScript==

var Match;

function find_and_click()
{
    Match = document.getElementById('SkipButton-btnInnerEl');
    if(Match != null)
    {
        Match.click();
    }
}

(function() {
    'use strict';
    setInterval(find_and_click,1000);
    // Your code here...
})();