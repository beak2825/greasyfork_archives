// ==UserScript==
// @name Moomoo.io Death text
// @namespace http://tampermonkey.net/
// @version 0.6
// @description Death text input in moomoo.io
// @author Nathaniel_Scripts11
// @match *://*.moomoo.io/*
// @icon https://www.linkpicture.com/q/hat_45-2.png
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/408933/Moomooio%20Death%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/408933/Moomooio%20Death%20text.meta.js
// ==/UserScript==
var deathTextInput=prompt('Death text')
var deathText=document.getElementById('diedText')
deathText.innerHTML=(deathTextInput);