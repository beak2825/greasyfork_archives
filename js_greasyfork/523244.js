// ==UserScript==
// @name         Agar.io Custom skin Uploader v2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Upload your picture as custom skin on agar.io
// @author       Dhal x Chat GPT
// @match        *://*.agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523244/Agario%20Custom%20skin%20Uploader%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/523244/Agario%20Custom%20skin%20Uploader%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Définir les chaînes pour différentes langues
    const messages = {
        en: {
            buttonText: 'Convert and Inject Image',
            selectFile: 'No file selected.',
            convertSuccess: 'Image successfully converted to Base64!',
            injectConfirmation: 'Do you want to inject the image into the canvas (#skin-editor-canvas)?',
            resizeConfirmation: 'The image is too large. It will be resized to 512x512.',
            injectSuccess: 'Image successfully injected into the canvas!',
            resizeSuccess: 'Image resized to 512x512. Do you want to inject it?',
            base64Alert: 'Here is your Base64:',
            error: 'Error while loading the image. Please check your Base64.'
        },
        fr: {
            buttonText: 'Convertir et Injecter Image',
            selectFile: 'Aucun fichier sélectionné.',
            convertSuccess: 'Image convertie avec succès en Base64 !',
            injectConfirmation: 'Voulez-vous injecter l’image dans le canvas (#skin-editor-canvas) ?',
            resizeConfirmation: 'L’image est trop grande. Elle sera redimensionnée à 512x512.',
            injectSuccess: 'Image injectée avec succès dans le canvas !',
            resizeSuccess: 'Image redimensionnée à 512x512. Voulez-vous l’injecter ?',
            base64Alert: 'Voici votre Base64 :',
            error: 'Erreur lors du chargement de l’image. Vérifiez votre Base64.'
        },
        es: {
            buttonText: 'Convertir e Inyectar Imagen',
            selectFile: 'Ningún archivo seleccionado.',
            convertSuccess: '¡Imagen convertida con éxito a Base64!',
            injectConfirmation: '¿Quieres inyectar la imagen en el lienzo (#skin-editor-canvas)?',
            resizeConfirmation: 'La imagen es demasiado grande. Se redimensionará a 512x512.',
            injectSuccess: '¡Imagen inyectada con éxito en el lienzo!',
            resizeSuccess: 'Imagen redimensionada a 512x512. ¿Quieres inyectarla?',
            base64Alert: 'Aquí está tu Base64:',
            error: 'Error al cargar la imagen. Verifica tu Base64.'
        },
        // Ajouter d'autres langues ici si nécessaire
    };

    // Détection de la langue du navigateur
    const lang = navigator.language.split('-')[0] || 'en'; // Utilise la première partie de la langue (ex : "en", "fr")
    const currentMessages = messages[lang] || messages.en; // Si la langue n'est pas définie, utilise l'anglais par défaut

    // Crée un bouton flottant pour démarrer les actions
    const button = document.createElement('button');
    button.innerText = currentMessages.buttonText;
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        convertImageFileToBase64();
    });

    // Fonction pour convertir un fichier image en Base64
    function convertImageFileToBase64() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                alert(currentMessages.selectFile);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                const image = new Image();
                image.onload = () => {
                    // Vérifier si l'image dépasse 512x512 et redimensionner si nécessaire
                    if (image.width > 512 || image.height > 512) {
                        alert(currentMessages.resizeConfirmation);
                        resizeImage(image);
                    } else {
                        const confirmInjection = confirm(
                            currentMessages.injectConfirmation
                        );
                        if (confirmInjection) {
                            injectBase64(base64, image.width, image.height);
                        } else {
                            alert(currentMessages.base64Alert + '\n' + base64);
                        }
                    }
                };
                image.onerror = () => {
                    alert(currentMessages.error);
                };
                image.src = base64;
            };
            reader.onerror = () => {
                alert(currentMessages.error);
            };
            reader.readAsDataURL(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    // Fonction pour redimensionner l'image à 512x512
    function resizeImage(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calcul des nouvelles dimensions
        const maxDimension = 512;
        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxDimension) {
                height = Math.floor((maxDimension / width) * height);
                width = maxDimension;
            }
        } else {
            if (height > maxDimension) {
                width = Math.floor((maxDimension / height) * width);
                height = maxDimension;
            }
        }

        // Redimensionner l'image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        // Convertir en Base64 après redimensionnement
        const resizedBase64 = canvas.toDataURL();

        // Injecter l'image redimensionnée dans le canvas
        const confirmInjection = confirm(
            currentMessages.resizeSuccess
        );
        if (confirmInjection) {
            injectBase64(resizedBase64, width, height);
        } else {
            alert(currentMessages.base64Alert + '\n' + resizedBase64);
        }
    }

    // Fonction pour injecter une image Base64 dans le canvas
    function injectBase64(base64, width, height) {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) {
            alert('Canvas "skin-editor-canvas" introuvable sur cette page.');
            return;
        }

        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie le canvas avant l'injection
            ctx.drawImage(image, 0, 0, 512, 512);
            ctx.save();
            alert(currentMessages.injectSuccess);
        };
        image.onerror = () => {
            alert(currentMessages.error);
        };
        image.src = base64;
    }
})();
