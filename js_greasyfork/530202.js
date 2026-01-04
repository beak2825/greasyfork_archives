// ==UserScript==
// @name         NuevoSF
// @namespace    http://tampermonkey.net/
// @version      2025-03-18
// @description  Nuevo SF
// @author       You
// @match        https://viesgo.my.site.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=site.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530202/NuevoSF.user.js
// @updateURL https://update.greasyfork.org/scripts/530202/NuevoSF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Estilos CSS que deseas aplicar
    const css = `
        .uiOutputRichText {display: none;}
        .slds-table th, .slds-table td {padding: 0px;}
    `;

    // Crear un elemento <style> e insertarlo en la página
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);

})();
