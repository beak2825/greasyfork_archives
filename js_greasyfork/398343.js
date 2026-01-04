// ==UserScript==
// @name         RemoveBanner
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Elimina banner de notificaciones
// @author       SStvAA!
// @match        https://render.figure-eight.io/*
// @match        https://tasks.figure-eight.work/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398343/RemoveBanner.user.js
// @updateURL https://update.greasyfork.org/scripts/398343/RemoveBanner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = elim;

    function elim(){document.querySelector("#global_banner").remove();document.querySelector("body").style.paddingTop="1%";console.log("RD");}
   
})();