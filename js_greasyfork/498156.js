// ==UserScript==
// @name         CheatCentral/KrunkerCentral Key System Bypass
// @namespace    http://tampermonkey.net/
// @version      2024-06-17
// @description  Breaks key system for all current CheatCentral/KrunkerCentral userscripts. To add support for new scripts just simply copy and paste their @match script meta info into this script :)
// @author       November2246
// @match        *://kour.io/*
// @match        *://*.moomoo.io/*
// @match        *://voxiom.io/*
// @match        *://1v1.lol/*
// @match        *://1v1.school/*
// @match        https://*.venge.io/*
// @match        https://kirka.io/*
// @match        *://krunker.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498156/CheatCentralKrunkerCentral%20Key%20System%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/498156/CheatCentralKrunkerCentral%20Key%20System%20Bypass.meta.js
// ==/UserScript==

crypto.subtle.verify = () => Promise.resolve(true);
localStorage.dogewareLicenseKey = btoa(`{"message":"${Date.now() * 2}"}`);