// ==UserScript==
// @name         Fast.com Auto Config
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-enable settings on Fast.com
// @author       Luis123456xp
// @match        https://fast.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503485/Fastcom%20Auto%20Config.user.js
// @updateURL https://update.greasyfork.org/scripts/503485/Fastcom%20Auto%20Config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar a que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        // Activar la opción "Always show all metrics"
        const alwaysShowMetricsCheckbox = document.querySelector('#always-show-metrics-input');
        if (alwaysShowMetricsCheckbox && !alwaysShowMetricsCheckbox.checked) {
            alwaysShowMetricsCheckbox.click();
        }

        // Activar la opción "Save config for this device"
        const persistConfigCheckbox = document.querySelector('#persist-config-input');
        if (persistConfigCheckbox && !persistConfigCheckbox.checked) {
            persistConfigCheckbox.click();
        }

        // Guardar la configuración automáticamente
        const applyConfigButton = document.querySelector('#apply-config');
        if (applyConfigButton) {
            applyConfigButton.click();
        }
    });

})();
