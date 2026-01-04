// ==UserScript==
// @name         Ouverture auto du PDF sur Moodle
// @description  Permet d'ouvrir automatiquement les PDF au lieu d'avoir juste un embed sur Moodle
// @version      2025-10-07
// @author       Lucie Delestre
// @license MIT
// @match        https://moodle.imt-atlantique.fr/mod/resource/view.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imt-atlantique.fr
// @grant        none
// @namespace https://greasyfork.org/users/769269
// @downloadURL https://update.greasyfork.org/scripts/539182/Ouverture%20auto%20du%20PDF%20sur%20Moodle.user.js
// @updateURL https://update.greasyfork.org/scripts/539182/Ouverture%20auto%20du%20PDF%20sur%20Moodle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        window.location.replace(document.getElementsByTagName("object")[0] && document.getElementsByTagName("object")[0].data || document.getElementsByTagName("iframe")[0].src);
    } catch (e) {
        console.log(e);
    }
})();