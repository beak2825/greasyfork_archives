// ==UserScript==
// @name         Custom time for arithmetic.zetamac.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add an input for custom duration of the game
// @author       Anakojm
// @match        http*://arithmetic.zetamac.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zetamac.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/447512/Custom%20time%20for%20arithmeticzetamaccom.user.js
// @updateURL https://update.greasyfork.org/scripts/447512/Custom%20time%20for%20arithmeticzetamaccom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Remove dropdown
    document.querySelector("div#welcome form.game-options p select").remove()
    // Create a new input element
    let input=document.createElement("Input")
    input.placeholder="Time (s)";
    // The website is looking for the content of the duration element
    input.name="duration";
    // Append the new input to the wepbage
    document.querySelector("div#welcome form.game-options p").append(input)
})();