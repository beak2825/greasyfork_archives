// ==UserScript==
// @name         Bring back the Apply Style Button in AUTOMATIC1111
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get Back Motherfucker
// @author       s0updev
// @match        http://192.168.0.100:7860/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.100
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/474710/Bring%20back%20the%20Apply%20Style%20Button%20in%20AUTOMATIC1111.user.js
// @updateURL https://update.greasyfork.org/scripts/474710/Bring%20back%20the%20Apply%20Style%20Button%20in%20AUTOMATIC1111.meta.js
// ==/UserScript==

let moveStyleButtonTimer;

function tryMovingTheButton () {

    if (document.querySelector('#txt2img_tools div.form')) {
        document
            .querySelector('#txt2img_tools div.form')
            .appendChild(
            document.querySelector('#txt2img_style_apply')
        );
        clearInterval(moveStyleButtonTimer);
        console.log('The Apply Style Button has been moved');
    }
}

(function() {
    'use strict';
    moveStyleButtonTimer = setInterval(tryMovingTheButton, 300);
})();

