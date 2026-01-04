// ==UserScript==
// @name        Redirect to wiki.nixos.org - Tampermonkey
// @namespace   Tampermonkey Scripts
// @match       https://nixos.wiki/*
// @grant       none
// @version     1.0
// @author      ProfDoof
// @author      Artoria2e5
// @description the nixos.org people have a new wiki
// @license     CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/510766/Redirect%20to%20wikinixosorg%20-%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/510766/Redirect%20to%20wikinixosorg%20-%20Tampermonkey.meta.js
// ==/UserScript==
window.location.replace('https://wiki.nixos.org' + window.location.href.replace(/^http?s:\/\/nixos\.wiki/, ''))