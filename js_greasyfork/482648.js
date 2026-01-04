// ==UserScript==
// @name         GC - Wheel Prize
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  Automatically show the wheel of mediocrity, excitement, misfortune and knowledge prizes without having to click the button.
// @author       Twiggies
// @match        *://www.grundos.cafe/*/wheel/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482648/GC%20-%20Wheel%20Prize.user.js
// @updateURL https://update.greasyfork.org/scripts/482648/GC%20-%20Wheel%20Prize.meta.js
// ==/UserScript==

const spinning = document.getElementById('spinning');
if (spinning != undefined) {
    spinning.style.display = 'none'
    document.getElementById('prize-container').style.display = 'block'
}