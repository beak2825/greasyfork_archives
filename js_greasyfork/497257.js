// ==UserScript==
// @name         Drawaria Change Text Color to the Game!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the text color of the entire game to the selected color
// @author       YouTubeDrawaria
// @match        https://drawaria.online/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497257/Drawaria%20Change%20Text%20Color%20to%20the%20Game%21.user.js
// @updateURL https://update.greasyfork.org/scripts/497257/Drawaria%20Change%20Text%20Color%20to%20the%20Game%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Agregar el botón y el men� desplegable
    var buttonContainer = document.querySelector("#continueautosaved-run").parentNode;
    var dropdownButton = document.createElement("button");
    dropdownButton.textContent = "Change Text Color";
    dropdownButton.className = "btn btn-outline-info";
    dropdownButton.style.color = "#f5deb3";
    dropdownButton.setAttribute("data-toggle", "dropdown");
    dropdownButton.setAttribute("aria-haspopup", "true");
    dropdownButton.setAttribute("aria-expanded", "false");
    buttonContainer.appendChild(dropdownButton);

    var dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.style.display = "none";
    dropdownButton.appendChild(dropdownMenu);

    // Traducir los nombres de los colores
    var colorTranslations = {
        "en": ["Red", "Green", "Blue", "Black", "White", "Yellow", "Orange", "Purple", "Cyan", "Pink", "Gray", "Brown", "Beige", "Turquoise", "Violet"],
        "ru": ["Красный", "Зеленый", "Синий", "Черный", "Белый", "Желтый", "Оранжевый", "Фиолетовый", "Голубой", "Розовый", "Серый", "Коричневый", "Бежевый", "Бирюзовый", "Фиолетовый"],
        "es": ["Rojo", "Verde", "Azul", "Negro", "Blanco", "Amarillo", "Naranja", "Morado", "Celeste", "Rosa", "Gris", "Marrón", "Beige", "Turquesa", "Violeta"]
    };

    // Agregar opciones de color al men� desplegable
    var colorOptions = colorTranslations["en"];
    var colorCodes = [
        "#FF0000", "#008000", "#0000FF", "#000000", "#FFFFFF",
        "#FFFF00", "#FFA500", "#800080", "#00FFFF", "#FFC0CB",
        "#808080", "#964B00", "#F5DEB3", "#40E0D0", "#EE82EE"
    ];

    for (var i = 0; i < colorOptions.length; i++) {
        var colorOption = document.createElement("a");
        colorOption.className = "dropdown-item";
        colorOption.textContent = colorOptions[i];
        colorOption.style.color = colorCodes[i];
        colorOption.addEventListener("click", function(color) {
            return function() {
                changeTextColor(color);
            };
        }(colorCodes[i]));
        dropdownMenu.appendChild(colorOption);
    }

    // Función para cambiar el color de texto
    function changeTextColor(color) {
        // Seleccionar los elementos relevantes para cambiar el color de texto
        var elements = document.querySelectorAll("body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, label, select, textarea");
        elements.forEach(function(element) {
            element.style.color = color;
        });
    }

    // Función para actualizar el idioma
    function updateLanguage(lang) {
        // Actualizar los nombres de los colores
        var colorOptions = colorTranslations[lang];
        dropdownMenu.innerHTML = ''; // Limpiar el men� desplegable

        for (var i = 0; i < colorOptions.length; i++) {
            var colorOption = document.createElement("a");
            colorOption.className = "dropdown-item";
            colorOption.textContent = colorOptions[i];
            colorOption.style.color = colorCodes[i];
            colorOption.addEventListener("click", function(color) {
                return function() {
                    changeTextColor(color);
                };
            }(colorCodes[i]));
            dropdownMenu.appendChild(colorOption);
        }
    }

    // Detectar cambios en el selector de idioma
    var langSelector = document.getElementById('langselector');
    langSelector.addEventListener('change', function() {
        var lang = langSelector.value;
        updateLanguage(lang);
    });

    // Mostrar/ocultar el men� desplegable al hacer clic en el botón
    dropdownButton.addEventListener("click", function() {
        if (dropdownMenu.style.display === "none") {
            dropdownMenu.style.display = "block";
        } else {
            dropdownMenu.style.display = "none";
        }
    });
})();