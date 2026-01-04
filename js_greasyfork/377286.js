// ==UserScript==
// @name         Deluoodle
// @version      0.1
// @description  To complement userstyle: https://userstyles.org/styles/168379
// @author       thedonkeypie
// @match        https://*.google.com/
// @grant        none
// @namespace    https://greasyfork.org/users/243359
// @downloadURL https://update.greasyfork.org/scripts/377286/Deluoodle.user.js
// @updateURL https://update.greasyfork.org/scripts/377286/Deluoodle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("[name=q]").setAttribute("placeholder", "El Psy Kongroo");
    document.querySelector(".FPdoLc.VlcLAe [name=btnI]").setAttribute("value", "The choice of Steins;Gate");
    document.querySelector(".FPdoLc.VlcLAe [name=btnI]").setAttribute("aria-label", "The choice of Steins;Gate");
})();