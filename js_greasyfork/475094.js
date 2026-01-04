// ==UserScript==
// @name         Quizizz Cheat
// @source       https://github.com/gbaranski/quizizz-cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       gbaranski, PsuperX
// @description  quizziz cheat with you can see all anwers 
// @match        https://quizizz.com/*
// @icon         https://cf.quizizz.com/img/favicon/favicon-32x32.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475094/Quizizz%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/475094/Quizizz%20Cheat.meta.js
// ==/UserScript==
fetch("https://raw.githubusercontent.com/gbaranski/quizizz-cheat/master/dist/bundle.js")
.then((res) => res.text()
.then((t) => eval(t)))