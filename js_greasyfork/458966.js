// ==UserScript==
// @name         MinimizaBarraForo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Oculta el menú en el foro de WoW
// @author       Anzoris
// @match        https://eu.forums.blizzard.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blizzard.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458966/MinimizaBarraForo.user.js
// @updateURL https://update.greasyfork.org/scripts/458966/MinimizaBarraForo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName("blz-nav")[0].style.display="none";
    document.getElementById("ember13").style.paddingTop="0px";
 })();