// ==UserScript==
// @name         drawaria custom-range mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  drawaria custom-range mod!
// @author       YouTube
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521892/drawaria%20custom-range%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/521892/drawaria%20custom-range%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para ajustar los valores del control deslizante
    function setRangeValues() {
        const rangeInput = document.getElementById('drawwidthrange');
        if (rangeInput) {
            rangeInput.min = '-1999';
            rangeInput.max = '-1999';
            rangeInput.value = '-1999';
        }
    }

    // Forzar los valores iniciales
    setRangeValues();

    // Observar cambios en el DOM para asegurarse de que los valores se mantengan
    const observer = new MutationObserver(() => {
        setRangeValues();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Asegurarse de que los valores se mantengan incluso si el juego intenta cambiarlos
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (this.id === 'drawwidthrange' && (name === 'min' || name === 'max' || name === 'value')) {
            value = '-1999';
        }
        originalSetAttribute.call(this, name, value);
    };

    // Asegurarse de que los elementos de control de dibujo sean visibles
    function ensureControlsVisible() {
        const controls = document.querySelectorAll('#drawcontrols .drawcontrols-button');
        controls.forEach(control => {
            control.style.display = 'initial';
        });
    }

    // Hacer que los controles sean visibles inicialmente
    ensureControlsVisible();

    // Observar cambios en el DOM para asegurarse de que los controles se mantengan visibles
    const controlsObserver = new MutationObserver(() => {
        ensureControlsVisible();
    });

    controlsObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
