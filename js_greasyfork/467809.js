// ==UserScript==
// @license MIT
// @name         Extractor Button
// @namespace    https://www.example.com
// @version      1.0.13
// @description  Agrega un botón de extractor a https://www.xvideos.com/profileslist
// @author       Tu Nombre
// @match        https://www.xvideos.com/profileslist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467809/Extractor%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/467809/Extractor%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para mostrar los resultados en una ventana emergente
    function showPopupResults(results) {
        var popup = window.open('', '_blank', 'width=400,height=300,resizable=yes,scrollbars=yes');
        var popupDocument = popup.document;

        var title = popupDocument.createElement('h3');
        title.textContent = 'Resultados:';
        popupDocument.body.appendChild(title);

        var list = popupDocument.createElement('ul');
        results.forEach(function(result) {
            var listItem = popupDocument.createElement('li');
            listItem.textContent = result;
            list.appendChild(listItem);
        });
        popupDocument.body.appendChild(list);
    }

    // Función para extraer los datos y verificar las palabras clave
    function extractData(event) {
        event.preventDefault();

        var form = event.target;
        var usernameKeywords = form.elements.usernameKeywords.value.trim().toLowerCase();
        var aboutMeKeywords = form.elements.aboutMeKeywords.value.trim().toLowerCase();

        var profileElements = document.querySelectorAll('.thumb-block-profile');

        var matchingUsernames = [];
        var matchingAboutMe = [];

        for (var i = 0; i < profileElements.length; i++) {
            var profileElement = profileElements[i];
            var usernameElement = profileElement.querySelector('.profile-name a');
            var aboutMeElement = profileElement.querySelector('.profile-aboutme-content p');

            if (usernameElement && aboutMeElement) {
                var username = usernameElement.textContent.trim();
                var aboutMe = aboutMeElement.textContent.trim();

                // Verificar si el nombre de usuario contiene las palabras clave
                if (usernameKeywords && username.toLowerCase().includes(usernameKeywords)) {
                    matchingUsernames.push(username);
                }

                // Verificar si el "about me" contiene las palabras clave
                if (aboutMeKeywords && aboutMe.toLowerCase().includes(aboutMeKeywords)) {
                    matchingAboutMe.push(aboutMe);
                }
            }
        }

        var results = [];

        if (matchingUsernames.length > 0) {
            results.push('Nombres de usuario encontrados:');
            results.push(...matchingUsernames);
        }

        if (matchingAboutMe.length > 0) {
            results.push('About Me encontrados:');
            results.push(...matchingAboutMe);
        }

        if (results.length > 0) {
            showPopupResults(results);
        }
    }

    // Crear el formulario
    var formContainer = document.createElement('div');
    formContainer.style.position = 'fixed';
    formContainer.style.top = '20px';
    formContainer.style.right = '20px';
    formContainer.style.zIndex = '9999';
    formContainer.style.display = 'flex';
    formContainer.style.background = '#fff';
    formContainer.style.padding = '10px';
    formContainer.style.border = '1px solid #ccc';
    formContainer.style.borderRadius = '4px';
    formContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    formContainer.style.fontFamily = 'Arial, sans-serif';
    formContainer.style.fontSize = '14px';

    var form = document.createElement('form');
    form.addEventListener('submit', extractData);

    var usernameInput = document.createElement('input');
    usernameInput.name = 'usernameKeywords';
    usernameInput.placeholder = 'Palabras clave para nombres de usuario';
    usernameInput.style.marginRight = '10px';
    form.appendChild(usernameInput);

    var aboutMeInput = document.createElement('input');
    aboutMeInput.name = 'aboutMeKeywords';
    aboutMeInput.placeholder = 'Palabras clave para "about me"';
    form.appendChild(aboutMeInput);

    var extractButton = document.createElement('button');
    extractButton.type = 'submit';
    extractButton.innerText = 'Extractor';
    extractButton.style.background = '#4285f4';
    extractButton.style.color = 'white';
    extractButton.style.border = 'none';
    extractButton.style.borderRadius = '4px';
    extractButton.style.padding = '10px 20px';
    extractButton.style.cursor = 'pointer';
    form.appendChild(extractButton);

    formContainer.appendChild(form);

    // Agregar el formulario al documento
    document.body.appendChild(formContainer);

})();