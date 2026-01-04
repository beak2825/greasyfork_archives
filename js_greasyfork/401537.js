// ==UserScript==
// @name         Fender Play - seek interval to 10 seconds with ArrowKey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Let use the arrow keys to go back and forth just by 10 seconds instead the default 60 seconds.
// @author       smark91
// @match        https://www.fender.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401537/Fender%20Play%20-%20seek%20interval%20to%2010%20seconds%20with%20ArrowKey.user.js
// @updateURL https://update.greasyfork.org/scripts/401537/Fender%20Play%20-%20seek%20interval%20to%2010%20seconds%20with%20ArrowKey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("Fender Play - seek interval to 10 seconds with ArrowKey ON");

    window.addEventListener('keydown', (event)=>{
        if (event.key == "ArrowLeft") {
            document.getElementsByClassName("skip-ten__button--back")[0].click();
        } else if (event.key == "ArrowRight") {
            document.getElementsByClassName("skip-ten__button--forward")[0].click();
        }
    })
})();