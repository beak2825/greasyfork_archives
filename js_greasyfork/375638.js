// ==UserScript==
// @name         Removing ugly blue border after click button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removing ugly blue border after click button from all browser
// @author       Zimek
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375638/Removing%20ugly%20blue%20border%20after%20click%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/375638/Removing%20ugly%20blue%20border%20after%20click%20button.meta.js
// ==/UserScript==

$(`<style>button{outline: none;}body{outline: none;}</style>`).appendTo('head');