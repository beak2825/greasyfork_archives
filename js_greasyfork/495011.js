// ==UserScript==
// @name        Redirect to wiki.nixos.org
// @namespace   Violentmonkey Scripts
// @match       https://nixos.wiki/*
// @grant       none
// @version     1.0
// @author      Artoria2e5
// @description the nixos.org people have a new wiki
// @license     CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/495011/Redirect%20to%20wikinixosorg.user.js
// @updateURL https://update.greasyfork.org/scripts/495011/Redirect%20to%20wikinixosorg.meta.js
// ==/UserScript==
unsafeWindow.document.location.href = 'https://wiki.nixos.org' + unsafeWindow.document.location.href.replace(/^http?s:\/\/nixos\.wiki/, '')
