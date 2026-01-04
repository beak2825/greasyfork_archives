// ==UserScript==
// @name         AutoClick -Image Preference-
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click automatico para mostrar las imagenes en task especifica de appen.
// @author       gianfap
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442915/AutoClick%20-Image%20Preference-.user.js
// @updateURL https://update.greasyfork.org/scripts/442915/AutoClick%20-Image%20Preference-.meta.js
// ==/UserScript==

(function() {
    'use strict';
let boton = document.querySelectorAll('button.btn.btn-primary.start_button.before_click');
    for(let i = 0; i < boton.length; i++){
       setTimeout(()=>{boton[i].click()},1000);
    };
})();