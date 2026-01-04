// ==UserScript==
// @name         Droits - Cascade Toggle
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Un script permettant d' "Ouvrir tout" les droits. Page Configuration + Page Droits Mobile
// @license MIT
// @author       Guillaume Ayad
// @match        *eu*.praxedo.com/eTech/configuration/rules.do?action=consult
// @match        *eu*.praxedo.com/eTech/mobileVersionPermissions.do?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxedo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499492/Droits%20-%20Cascade%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/499492/Droits%20-%20Cascade%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Page Droits - Compte
    document.querySelectorAll('.icon-angle-right').forEach(x=>x.click())

    //Page Droits - Mobile
    document.querySelector('.euiButtonEmpty__text').click()
})();