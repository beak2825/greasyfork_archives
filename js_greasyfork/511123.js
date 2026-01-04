// ==UserScript==
// @name        Oneko Killer
// @namespace   Violentmonkey Scripts
// @match       https://tchan.lol/b/*
// @author      Anônimo
// @description Gato maldito
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511123/Oneko%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/511123/Oneko%20Killer.meta.js
// ==/UserScript==

const element = document.getElementById("oneko");
element.remove();