// ==UserScript==
// @name         Agario Last Man Standing mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CLick "Last Man Standing" button to play Last Man standing
// @author       You
// @match        https://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387671/Agario%20Last%20Man%20Standing%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/387671/Agario%20Last%20Man%20Standing%20mode.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML = '<button type="button" onclick="core.disableIntegrityChecks(true); core.connect(`wss://autumn-plot.glitch.me`);"><h1>Last Man Standing</h1></button>'
