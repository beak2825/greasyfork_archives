// ==UserScript==
// @name         Dokkan Battle Fandom Wiki Garbage Remover
// @namespace    http://tampermonkey.net/
// @namespace    https://x.com/aizen_ceo
// @version      1.2
// @description  Use this for removing unnecessary elements from the Dokkan Battle fandom Wiki
// @author       Ignacio
// @match        https://dbz-dokkanbattle.fandom.com/
// @match        https://dbz-dokkanbattle.fandom.com/*
// @match        https://dbz-dokkanbattle.fandom.com/wiki/*
// @icon         https://cdn.discordapp.com/attachments/889902248245731382/1241680383561699398/unnamed.png?ex=664b1478&is=6649c2f8&hm=5b4daa9263c082145817d23c8e41c117465befc47622a484e8313120e9c21b11&
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495496/Dokkan%20Battle%20Fandom%20Wiki%20Garbage%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/495496/Dokkan%20Battle%20Fandom%20Wiki%20Garbage%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de clases a ocultar
    const classesToHide = [
        'rail-module recent-images-module',
        'main-page-tag-rcs',
        'page-footer',
        'license-description',
        'mixed-content-footer',
        'global-footer',
        'page-header__meta'
    ];

    // Lista de IDs a ocultar
    const idsToHide = [
        'mixed-content-footer',
    ];

    // Lista de rutas XPath a ocultar
    const xpathsToHide = [
        '/html/body/div[4]/div[4]/div[2]/main/div[3]/div/div[1]/div[1]/div/div[8]',
        '/html/body/div[4]/div[4]/div[2]/main/div[3]/div/div[1]/div[1]/div/div[9]'
        // Añade aquí más rutas XPath si es necesario
    ];

    // Ocultar los elementos con las clases especificadas
    classesToHide.forEach(className => {
        let elements = document.getElementsByClassName(className);
        for (let element of elements) {
            element.style.display = 'none';
        }
    });

    function boldElementsWithClass() {
        const elements = document.getElementsByClassName('mw-page-title-main');
        for (let element of elements) {
            element.style.fontWeight = '400';
        }
    }
    // Ejecutar la función
    boldElementsWithClass();

    // Ocultar los elementos con los IDs especificados
    idsToHide.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Ocultar los elementos con las rutas XPath especificadas
    xpathsToHide.forEach(xpath => {
        let elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < elements.snapshotLength; i++) {
            let element = elements.snapshotItem(i);
            element.style.display = 'none';
        }
    });
})();