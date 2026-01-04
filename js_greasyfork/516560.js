// ==UserScript==
// @name         CuePrompter speed to number box
// @namespace    https://lai-0602.com
// @version      1.0
// @description  This script replaces the speed slider in CuePrompter to a number box, letting the user change the speed by pressing up and down arrow keys when not selected any text box.
// @author       Lai0602
// @match        https://cueprompter.com/teleprompter.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cueprompter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516560/CuePrompter%20speed%20to%20number%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/516560/CuePrompter%20speed%20to%20number%20box.meta.js
// ==/UserScript==

document.getElementById("speed").type = Number;