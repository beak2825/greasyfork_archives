// ==UserScript==
// @name         ElPais Register Remover
// @namespace    http://tampermonkey.net/
// @version      2025-04-02
// @description  Script para quitar el modal molesto de que necesitas registrarte para ver el artículo
// @author       Una persona que no le paga a diarios hegemónicos de izquierda
// @match        https://www.elpais.com.uy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elpais.com.uy
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/531551/ElPais%20Register%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/531551/ElPais%20Register%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Override del scroll choto
    window.scrollTo = () => {};
    window.scrollBy = () => {};

    Element.prototype.scrollIntoView = function() {};

    setTimeout(() => {
        const modal  = document.getElementById("floatingContainer");
        const body = document.getElementsByTagName('body')[0];

        if(modal){
            modal.parentNode.removeChild(modal);

            body.setAttribute("style","overflow: visible");
            document.body.style.overflow = 'auto';
        }
    }, 2000);
})();