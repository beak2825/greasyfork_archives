// ==UserScript==
// @name         Detección de uso de scripts en el perfil de usuario en Menéame
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Detecta patrones de comportamiento que sugieren el uso de scripts cuando accedes a un perfil de usuario en Menéame
// @author       Tu Nombre
// @match        https://www.meneame.net/user/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518988/Detecci%C3%B3n%20de%20uso%20de%20scripts%20en%20el%20perfil%20de%20usuario%20en%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/518988/Detecci%C3%B3n%20de%20uso%20de%20scripts%20en%20el%20perfil%20de%20usuario%20en%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tiempoUltimaAccion = Date.now();
    let clicsRapidos = 0;
    let cambiosInusualesDOM = false;

    // Configuración para detectar clics rápidos
    const MIN_INTERVALO_CLIC = 500; // 0.5 segundo entre clics
    const MAX_CLICS_RAPIDOS = 3; // Si se detectan más de 3 clics rápidos seguidos, alerta

    // Función para mostrar mensajes de alerta
    function mostrarMensaje(tipo, mensaje) {
        console.log(`Detectado comportamiento inusual: ${tipo} - ${mensaje}`);
        let banner = document.createElement('div');
        banner.textContent = `${tipo}: ${mensaje}`;
        banner.style.position = 'fixed';
        banner.style.top = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = '#f8d7da';
        banner.style.color = '#721c24';
        banner.style.border = '1px solid #f5c6cb';
        banner.style.padding = '10px';
        banner.style.zIndex = '99999';
        banner.style.fontSize = '16px';
        banner.style.width = '80%';
        banner.style.textAlign = 'center';
        banner.style.borderRadius = '5px';
        document.body.appendChild(banner);

        setTimeout(() => {
            banner.remove();
        }, 5000); // El mensaje se elimina después de 5 segundos
    }

    // Comprobar intervalos de tiempo entre clics
    document.addEventListener('click', function () {
        const tiempoActual = Date.now();
        const intervalo = tiempoActual - tiempoUltimaAccion;
        tiempoUltimaAccion = tiempoActual;

        if (intervalo < MIN_INTERVALO_CLIC) {
            clicsRapidos++;
            if (clicsRapidos > MAX_CLICS_RAPIDOS) {
                mostrarMensaje('Clics rápidos', `Se detectaron ${clicsRapidos} clics rápidos seguidos en el perfil.`);
            }
        } else {
            clicsRapidos = 0; // Resetear si el intervalo es mayor que el umbral
        }
    });

    // Monitorear cambios inusuales en el DOM que podrían sugerir un script
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Si se agregan muchos elementos al DOM rápidamente (podría ser por un script)
                if (mutation.addedNodes.length > 5) {
                    cambiosInusualesDOM = true;
                }
            }
        });
    });

    // Observar el cuerpo del documento por cambios en el DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Mostrar un banner fijo en la parte superior del perfil
    function mostrarBannerDeEstado() {
        // Verificar si el usuario está utilizando un script según las acciones previas
        let mensaje = "El usuario no parece estar utilizando un script.";
        let color = "#d4edda"; // verde claro (sin scripts)
        let razones = [];

        if (clicsRapidos > MAX_CLICS_RAPIDOS) {
            razones.push(`Se detectaron ${clicsRapidos} clics rápidos seguidos.`);
        }

        if (cambiosInusualesDOM) {
            razones.push('Cambios rápidos e inusuales en el DOM.');
        }

        if (razones.length > 0) {
            mensaje = "El usuario parece estar utilizando un script.";
            color = "#f8d7da"; // rojo claro (con scripts)
        } else {
            // Si no se detecta nada sospechoso, no cambiamos el mensaje
            razones.push("Ninguno de los patrones sospechosos se detectó.");
        }

        // Crear un banner fijo que siempre esté visible
        let banner = document.createElement('div');
        banner.textContent = `${mensaje} Razones: ${razones.join(' ')}`;
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = color;
        banner.style.color = '#721c24';
        banner.style.border = '1px solid #f5c6cb';
        banner.style.padding = '10px';
        banner.style.zIndex = '99999';
        banner.style.fontSize = '16px';
        banner.style.width = '100%';
        banner.style.textAlign = 'center';
        banner.style.borderRadius = '5px';
        banner.style.fontWeight = 'bold';
        banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        document.body.appendChild(banner);
    }

    // Ejecutar la función para mostrar el banner
    mostrarBannerDeEstado();

})();