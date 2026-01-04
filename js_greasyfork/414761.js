// ==UserScript==
// @name         Tank Changer Script
// @namespace    ht// ==UserScript==
// @name         Tank Changer Script
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Auto Changes Tank And Auto Build
// @author       Veddy
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414761/Tank%20Changer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/414761/Tank%20Changer%20Script.meta.js
// ==/UserScript==

setInterval(()=>{input.keyDown(220);
                 input.keyUp(220);
                 input.keyDown(52);
                 input.keyUp(52);
                 input.keyDown(53);
                 input.keyUp(53);
                 input.keyDown(54);
                 input.keyUp(54);
                 input.keyDown(56);
                 input.keyUp(56);
                 input.keyDown(55);
                 input.keyUp(55);
                 input.keyDown(77);
                 input.keyDown(32);
                },1)