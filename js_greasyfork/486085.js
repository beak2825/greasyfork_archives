// ==UserScript==
// @name         Neopets Middle/Right-Click Quest Log Button
// @namespace    https://greasyfork.org/en/users/977735-naud
// @version      0.1
// @description  Turns the Quest Log button into a normal link that you can middle- or right-click.
// @author       Naud
// @license      MIT
// @match        *://www.neopets.com/*
// @downloadURL https://update.greasyfork.org/scripts/486085/Neopets%20MiddleRight-Click%20Quest%20Log%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/486085/Neopets%20MiddleRight-Click%20Quest%20Log%20Button.meta.js
// ==/UserScript==

var icon = document.querySelector(".nav-quest-icon__2020");
icon.removeAttribute("onclick");
icon.setAttribute("style", "display: block");

var wrapper = document.createElement("a");
wrapper.setAttribute("href", "/questlog/");

icon.parentNode.insertBefore(wrapper, icon);
wrapper.appendChild(icon);
