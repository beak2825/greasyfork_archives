// ==UserScript==
// @name         Neopets font changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419375/Neopets%20font%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/419375/Neopets%20font%20changer.meta.js
// ==/UserScript==

$('<div style="z-index: 3; font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt;position: fixed;padding: 5px; opacity: 80%; width: 220px; text-align: left; right: 5px; top: 250px; background-color: #000000; color: #FFFFFF;" id="floating"></div>').appendTo("body");

let floatingText = `
    <div style="z-index: 3; font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt;position: fixed;padding: 5px; opacity: 80%; width: 220px; text-align: left; right: 5px; top: 250px; background-color: #000000; color: #FFFFFF;" id="floating">
    <div style="color: #ffff00; text-align:right;">
      <span style="cursor: pointer;" id="floating-close">Close [X]</span>
    </div>
    <br>
    <select>
      <option selected value="0">Font</option>
    </select>
    <br><br>
    <i style="font-size: 7pt;">Font changer WIP</i>
    </div>`;


const $floating = $("#floating");
$floating.html(floatingText);
$("#floating-close").on("click", () => $floating.hide(500));