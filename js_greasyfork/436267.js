// ==UserScript==
// @name         steelseries领取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  疯狂点击
// @author       alep
// @match        https://games.steelseries.com/giveaway/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436267/steelseries%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436267/steelseries%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function go(){
        while(1){
            var elem = document.querySelector('span.MuiButton-label');
            if(elem != null && elem.innerText == 'GET KEY'){
                elem.click();
            }
        }
    }

    var root = document.querySelector(".css-716jez-GiveawayGetKeyRoot")
    var btn = document.createElement('input');
    btn.type = "button";
	btn.value = "GOOOOOOOO!";
    btn.addEventListener('click',function(){
        go()
	},false)
    root.appendChild(btn);

    // Your code here...
})();