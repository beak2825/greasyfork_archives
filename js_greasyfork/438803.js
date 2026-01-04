// ==UserScript==
// @name        RealPython Registartion Pop-up Bypass
// @description Remove registration / login pop-up on realpython.com.
// @namespace   https://github.com/MichaelYochpaz/User-Scripts
// @homepageURL https://github.com/MichaelYochpaz/User-Scripts
// @supportURL  https://github.com/MichaelYochpaz/User-Scripts/issues
// @icon        https://cdn.realpython.com/static/favicon.ico
// @author      Michael Yochpaz
// @license     MIT
// @version     1.0.4
// @include     *://realpython.com/*
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/438803/RealPython%20Registartion%20Pop-up%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/438803/RealPython%20Registartion%20Pop-up%20Bypass.meta.js
// ==/UserScript==

document.getElementsByClassName("modal-backdrop")[0].remove(); // Remove Backdrop (black background)
GM_addStyle (`.modal {display: none !important}`); // Remove Modal (registration pop-up)
GM_addStyle (`.modal-open {overflow: scroll !important}`); // Restore Scrolling