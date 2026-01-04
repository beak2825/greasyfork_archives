// ==UserScript==
// @name         minecraftshader.com allow ad blocker
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  allow ad blocker on site
// @author       Paper Folding
// @license MIT 
// @match        https://minecraftshader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minecraftshader.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496530/minecraftshadercom%20allow%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/496530/minecraftshadercom%20allow%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ic = setInterval(()=>{
        if(document.querySelector('.fc-ab-root')) {
            document.querySelector('.fc-ab-root').remove();
            document.body.style.overflow='';
        } else {
            //clearInterval(ic);
        }
    },1000);
})();