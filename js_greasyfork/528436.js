// ==UserScript==
// @name         Cambiar Orden por defecto de los bundles de Fanatical
// @name:en      Change default sorting on bundles page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fanatical lo pone por defecto como "Más vendidos". No, no, quiero ver lo más reciente, que si no no me entero de qué hay nuevo
// @description:en By default Fanatical sorts by Popular. I'd like to see what's new so this does it. No more missing bundles.
// @author       LinxESP
// @match        *://www.fanatical.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528436/Cambiar%20Orden%20por%20defecto%20de%20los%20bundles%20de%20Fanatical.user.js
// @updateURL https://update.greasyfork.org/scripts/528436/Cambiar%20Orden%20por%20defecto%20de%20los%20bundles%20de%20Fanatical.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Valores predeterminados
    const defaultConfig = {
        sortValue: "latest_deals",
        delayTime: 100
    };

    // Obtener la configuración guardada o usar valores predeterminados
    function getConfig() {
        return {
            sortValue: GM_getValue('sortValue', defaultConfig.sortValue),
            delayTime: GM_getValue('delayTime', defaultConfig.delayTime)
        };
    }

    // Guardar configuración
    function setConfig(config) {
        GM_setValue('sortValue', config.sortValue);
        GM_setValue('delayTime', config.delayTime);
    }

    // Configuración actual
    const config = getConfig();

    // Registrar comandos de menú para cambiar la configuración
    GM_registerMenuCommand('⚙️ Configurar valor de ordenamiento', function() {
        const options = [
            {value: "", label: "Top Sellers"},
            {value: "price_asc", label: "Price: Low to High"},
            {value: "price_desc", label: "Price: High to Low"},
            {value: "name", label: "Alphabetical"},
            {value: "discount", label: "Top Discount"},
            {value: "latest_deals", label: "Latest Deals"},
            {value: "ending_soon", label: "Ending Soon"},
            {value: "most_wanted", label: "Most Wanted"},
            {value: "release_date_desc", label: "Release: Newest"}
        ];
        
        let optionsText = "Selecciona el orden por defecto:\n";
        options.forEach((opt, index) => {
            optionsText += `${index}. ${opt.label}\n`;
        });
        
        const selection = prompt(optionsText, config.sortValue);
        if (selection !== null) {
            // Comprobar si es un número (índice) o un valor directo
            if (!isNaN(selection) && selection >= 0 && selection < options.length) {
                config.sortValue = options[parseInt(selection)].value;
            } else {
                // Verificar si el valor ingresado es válido
                const validOption = options.find(opt => opt.value === selection);
                if (validOption) {
                    config.sortValue = selection;
                } else {
                    alert('Valor no válido. Por favor selecciona una opción válida.');
                    return;
                }
            }
            setConfig(config);
            alert(`Valor de ordenamiento cambiado a: ${config.sortValue}`);
        }
    });

    GM_registerMenuCommand('⏱️ Configurar tiempo de retraso (ms)', function() {
        const newDelay = prompt('Ingresa el tiempo de retraso en milisegundos:', config.delayTime);
        if (newDelay !== null) {
            const delay = parseInt(newDelay);
            if (!isNaN(delay) && delay >= 0) {
                config.delayTime = delay;
                setConfig(config);
                alert(`Tiempo de retraso cambiado a: ${delay}ms`);
            } else {
                alert('Por favor ingresa un número válido mayor o igual a 0.');
            }
        }
    });

    // Función para cambiar el valor del menú desplegable
    function changeDropdownValue() {
        const selectElement = document.querySelector('.dropdown-container.sort-by select');
        
        if (selectElement) {
            // Usar el valor de configuración
            selectElement.value = config.sortValue;
            
            // Disparar evento de cambio para asegurar que el sitio detecte el cambio
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log(`La opción de ordenamiento ha sido cambiada a: ${config.sortValue}`);
            return true;
        }
        return false;
    }

    // Esperar a que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        // Intento inicial
        if (!changeDropdownValue()) {
            console.log('No se encontró el elemento del menú desplegable, reintentando...');
            
            // Intentar después del retraso configurado
            setTimeout(function() {
                if (!changeDropdownValue()) {
                    console.log('No se pudo encontrar el elemento después del retraso configurado');
                }
            }, config.delayTime);
        }
    });
})();