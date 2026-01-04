// ==UserScript==
// @name         Cheat for zetamac
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow you to see the answer of the maths question
// @author       Anakojm
// @match        http*://arithmetic.zetamac.com/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zetamac.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/447556/Cheat%20for%20zetamac.user.js
// @updateURL https://update.greasyfork.org/scripts/447556/Cheat%20for%20zetamac.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create an input
    var button=document.createElement("input");
    // Turn the input into a button
    button.type='button';
    // Add the text "Answer" to the button
    button.value="Answer";
    // Append the button to the webpage
    document.querySelector("div#game div.banner div.start").append(button);
    // Add js to the button so that it resolve the operation
    document.getElementsByTagName("input").item(1).setAttribute("onclick","document.querySelector('div#game div.banner div.start input').value = eval(document.querySelector('div.start span.problem').textContent.replace(' ', '').replace(' ', '').replace('–', '-').replace('×', '*').replace('÷', '/'))");
})();