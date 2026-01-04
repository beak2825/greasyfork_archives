// ==UserScript==
// @name         Medal prompt remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the annoying "Join Medal" prompt when visiting medal links
// @author       SamSN
// @match        https://medal.tv/games/*/clips/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medal.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481635/Medal%20prompt%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/481635/Medal%20prompt%20remover.meta.js
// ==/UserScript==

if (!location.href.endsWith("?mobilebypass=true")) {
    location.replace(`${location.href}?mobilebypass=true`);
}