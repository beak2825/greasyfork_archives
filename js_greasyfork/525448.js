// ==UserScript==
// @name         Mejoras para Novelcool+
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Este es un script simple donde modifica la parte donde ves manwha y arregla unos errores y te permite elegir la cantidad de imagenes de los capitulos ejemplos hasta 50 siempre y cuando tenga 50 y si no tiene 50 solo cargara la cantidad de imagenes disponibles
// @author       AviDevs
// @license MIT
// @match        https://www.naturecaptions.com/statuses/*
// @match        https://www.mastertheenglish.com/statuses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naturecaptions.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525448/Mejoras%20para%20Novelcool%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/525448/Mejoras%20para%20Novelcool%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuración global
    const config = {
        defaultImageLoad: 10, // Valor predeterminado para cargar imágenes
        observerConfig: { childList: true, subtree: true }, // Configuración del MutationObserver
    };

    // Función para ocultar todos los botones dentro de la clase ".btn"
    function hideAllButtons() {
        const buttonsContainers = document.querySelectorAll('.btn');
        buttonsContainers.forEach(container => {
            container.style.display = 'none'; // Oculta todo el contenedor
        });
    }

    // Función para mejorar el elemento select existente
    function enhanceSelect() {
        const select = document.querySelector(".change_pic_no");
        if (!select) return;

        // Opciones para el selector
        const options = [
            { value: 1, text: "Cargar imágenes: 1" },
            { value: 2, text: "Cargar imágenes: 2" },
            { value: 3, text: "Cargar imágenes: 3" },
            { value: 4, text: "Cargar imágenes: 4" },
            { value: 5, text: "Cargar imágenes: 5" },
            { value: 6, text: "Cargar imágenes: 6" },
            { value: 7, text: "Cargar imágenes: 7" },
            { value: 8, text: "Cargar imágenes: 8" },
            { value: 9, text: "Cargar imágenes: 9" },
            { value: 10, text: "Cargar imágenes: 10" },
            { value: 15, text: "Cargar imágenes: 15" },
            { value: 20, text: "Cargar imágenes: 20" },
            { value: 30, text: "Cargar imágenes: 30" },
            { value: 40, text: "Cargar imágenes: 40" },
            { value: 50, text: "Cargar imágenes: 50" }
        ];

        // Limpia las opciones existentes
        select.innerHTML = '';

        // Agrega las nuevas opciones
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.text = option.text;
            if (option.value === config.defaultImageLoad) {
                opt.selected = true; // Establece el valor predeterminado
            }
            select.appendChild(opt);
        });

        // Mejora el estilo del elemento select
        select.style.padding = "5px";
        select.style.borderRadius = "5px";
        select.style.border = "1px solid #007bff";
        select.style.backgroundColor = "#f9f9f9";
        select.style.color = "#333";
        select.style.cursor = "pointer";
        select.style.fontSize = "14px";
        select.style.transition = "border-color 0.3s, box-shadow 0.3s";

        // Agrega efectos de hover y focus
        select.addEventListener('mouseover', () => {
            select.style.borderColor = "#0056b3";
            select.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
        });

        select.addEventListener('mouseout', () => {
            select.style.borderColor = "#007bff";
            select.style.boxShadow = "none";
        });

        select.addEventListener('focus', () => {
            select.style.borderColor = "#0056b3";
            select.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
        });

        select.addEventListener('blur', () => {
            select.style.borderColor = "#007bff";
            select.style.boxShadow = "none";
        });

        // Escucha cambios en el selector
        select.addEventListener('change', () => {
            showNotification(`Cargando ${select.value} imágenes...`);
            hideAllButtons(); // Asegura que los botones permanezcan ocultos
        });
    }

    // Función para agregar información de episodios
   // function addEpisodeInfo() {
     //   const episodeInfo = document.createElement('div');
       // episodeInfo.id = 'episode-info';
       // episodeInfo.style.position = 'fixed';
       // episodeInfo.style.top = '20px';
       // episodeInfo.style.left = '20px';
       // episodeInfo.style.backgroundColor = '#fff';
       // episodeInfo.style.padding = '10px';
       // episodeInfo.style.border = '1px solid #ccc';
       // episodeInfo.style.borderRadius = '5px';
       // episodeInfo.style.zIndex = '1000';
       // episodeInfo.innerHTML = '<strong>Episodios:</strong> Información de episodios aquí.';
       // document.body.appendChild(episodeInfo);
    //}

    // Función para mostrar notificaciones visuales
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#007bff';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Elimina la notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Función para agregar un botón de alternar visibilidad
    //function addToggleButton() {
      //  const toggleButton = document.createElement('button');
        //toggleButton.textContent = 'Mostrar/Ocultar Botones';
        //toggleButton.style.position = 'fixed';
        //toggleButton.style.bottom = '20px';
        //toggleButton.style.left = '20px';
        //toggleButton.style.padding = '10px';
        //toggleButton.style.backgroundColor = '#007bff';
        //toggleButton.style.color = '#fff';
        //toggleButton.style.border = 'none';
        //toggleButton.style.borderRadius = '5px';
        //toggleButton.style.cursor = 'pointer';
        //toggleButton.style.zIndex = '1000';

     //   toggleButton.addEventListener('click', () => {
       //     const buttons = document.querySelectorAll('.btn');
         //   buttons.forEach(button => {
           //     button.style.display = button.style.display === 'none' ? 'block' : 'none';
           // });
       // });

     //   document.body.appendChild(toggleButton);
   // }

    // Observa cambios en el DOM para asegurarse de que los botones permanezcan ocultos
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            hideAllButtons(); // Vuelve a ocultar los botones si aparecen
        });

        observer.observe(document.body, config.observerConfig);
    }

    // Inicialización del script
    function init() {
        hideAllButtons();
        enhanceSelect();
       // addEpisodeInfo();
       // addToggleButton();
        observeDOMChanges();
    }

    // Ejecuta las funciones cuando la página haya cargado completamente
    window.addEventListener('load', init);
})();