// ==UserScript==
// @name         Remove Confirm Popup from Simpli.fi
// @version      0.1
// @description  removes confirm dialog, useful for mass deleting ads
// @author       Cody Carrell (nysos3)
// @match        https://app.simpli.fi/platforms/*/companies/*/clients/*/campaigns/*/workflow
// @grant        none
// @namespace https://greasyfork.org/users/12021
// @downloadURL https://update.greasyfork.org/scripts/10264/Remove%20Confirm%20Popup%20from%20Simplifi.user.js
// @updateURL https://update.greasyfork.org/scripts/10264/Remove%20Confirm%20Popup%20from%20Simplifi.meta.js
// ==/UserScript==

window.confirm = function (e) { return true; };