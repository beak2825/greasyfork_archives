// ==UserScript==
// @name         Swat's krunker cookie icon remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hides the cookie icon on krunker.
// @author       Swat
// @match        *://krunker.io/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415858/Swat%27s%20krunker%20cookie%20icon%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/415858/Swat%27s%20krunker%20cookie%20icon%20remover.meta.js
// ==/UserScript==

GM_addStyle (`.ot-floating-button__front {display:none}`);