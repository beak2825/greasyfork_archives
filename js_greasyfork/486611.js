// ==UserScript==
// @name         Traductor Plus 3.0!
// @namespace    https://greasyfork.org/es/scripts/486611-traductor-plus-3-0
// @version      0.2
// @icon         data:image/png;base64,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
// @description  Traduce el texto seleccionado usando la API gratuita de Google Translate y muestra los resultados de manera mejorada con opciones de color personalizadas y configuración de idioma.
// @author       PutoElQueLoLea
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0-or-later

// @downloadURL https://update.greasyfork.org/scripts/486611/Traductor%20Plus%2030%21.user.js
// @updateURL https://update.greasyfork.org/scripts/486611/Traductor%20Plus%2030%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const languages = {
        "Afrikáans": "af",
        "Albanés": "sq",
        "Alemán": "de",
        "Amhárico": "am",
        "Árabe": "ar",
        "Armenio": "hy",
        "Azerbaiyano": "az",
        "Bengalí": "bn",
        "Bielorruso": "be",
        "Birmano": "my",
        "Bosnia": "bs",
        "Búlgaro": "bg",
        "Canarés": "kn",
        "Catalán": "ca",
        "Cebuano": "ceb",
        "Checo": "cs",
        "Chichewa": "ny",
        "Chino simplificado": "zh-CN",
        "Chino tradicional": "zh-TW",
        "Cingalés": "si",
        "Coreano": "ko",
        "Corso": "co",
        "Criollo haitiano": "ht",
        "Croata": "hr",
        "Danés": "da",
        "Eslovaco": "sk",
        "Esloveno": "sl",
        "Español": "es",
        "Esperanto": "eo",
        "Estonio": "et",
        "Euskera": "eu",
        "Finés": "fi",
        "Francés": "fr",
        "Frisón occidental": "fy",
        "Gaélico escocés": "gd",
        "Galés": "cy",
        "Gallego": "gl",
        "Georgiano": "ka",
        "Griego": "el",
        "Gujarati": "gu",
        "Hausa": "ha",
        "Hawaiano": "haw",
        "Hebreo": "iw",
        "Hindi": "hi",
        "Hmong": "hmn",
        "Holandés": "nl",
        "Húngaro": "hu",
        "Igbo": "ig",
        "Indonesio": "id",
        "Inglés": "en",
        "Irlandés": "ga",
        "Islandés": "is",
        "Italiano": "it",
        "Japonés": "ja",
        "Javanés": "jw",
        "Kazajo": "kk",
        "Kirguís": "ky",
        "Kurdo": "ku",
        "Laosiano": "lo",
        "Latín": "la",
        "Letón": "lv",
        "Lituano": "lt",
        "Luxemburgués": "lb",
        "Macedonio": "mk",
        "Malayo": "ms",
        "Malayalam": "ml",
        "Malgache": "mg",
        "Maltés": "mt",
        "Maorí": "mi",
        "Maratí": "mr",
        "Mongol": "mn",
        "Neerlandés": "nl",
        "Nepalí": "ne",
        "Noruego": "no",
        "Panyabí": "pa",
        "Pastún": "ps",
        "Persa": "fa",
        "Polaco": "pl",
        "Portugués": "pt",
        "Rumano": "ro",
        "Ruso": "ru",
        "Samoano": "sm",
        "Serbio": "sr",
        "Sesoto": "st",
        "Shona": "sn",
        "Sindi": "sd",
        "Somalí": "so",
        "Suajili": "sw",
        "Sueco": "sv",
        "Sundanés": "su",
        "Tagalo": "tl",
        "Tailandés": "th",
        "Tamil": "ta",
        "Tayiko": "tg",
        "Telugu": "te",
        "Turco": "tr",
        "Ucraniano": "uk",
        "Urdu": "ur",
        "Uzbeco": "uz",
        "Vietnamita": "vi",
        "Xhosa": "xh",
        "Yidis": "yi",
        "Yoruba": "yo",
        "Zulú": "zu"
    };

    let selectedTextCache = '';
    let translationBox = null;

    let selectedBackgroundColor = GM_getValue('selectedBackgroundColor', '#333');
    let selectedTextColor = GM_getValue('selectedTextColor', 'white');
    let targetLanguage = GM_getValue('config', { targetLanguage: 'es' }).targetLanguage;

    function translateText(text, targetLang) {
        return new Promise((resolve, reject) => {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURI(text)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const translatedText = data[0].map(sentence => sentence[0]).join(' '); // Unimos las traducciones individuales
                    resolve(translatedText);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    function createTranslationBox(translatedText) {
        translationBox = document.createElement('div');
        translationBox.style.position = 'fixed';
        translationBox.style.top = '50%';
        translationBox.style.left = '50%';
        translationBox.style.transform = 'translate(-50%, -50%)';
        translationBox.style.padding = '20px';
        translationBox.style.background = selectedBackgroundColor;
        translationBox.style.color = selectedTextColor;
        translationBox.style.borderRadius = '10px';
        translationBox.textContent = translatedText;

        document.body.appendChild(translationBox);
    }

    function clearSelection() {
        selectedTextCache = '';
        if (translationBox) {
            translationBox.remove();
            translationBox = null;
        }
    }

    document.addEventListener('mouseup', async function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText !== '') {
            selectedTextCache += selectedText + ';';

            try {
                const translatedText = await translateText(selectedTextCache, targetLanguage);

                // Guardar colores seleccionados
                saveColors();

                createTranslationBox(translatedText);
            } catch (error) {
                console.error('Error al traducir:', error);
            }
        }
    });

    document.addEventListener('click', clearSelection);

    // Configurador de colores y idioma
    GM_registerMenuCommand('Configurar Colores e Idioma', openConfigDialog);

    function openConfigDialog() {
        // Crear la ventana emergente
        const configDialog = document.createElement('div');
        configDialog.id = 'config-dialog';
        configDialog.innerHTML = `
            <h3>Configuración del traductor</h3>
            <div>
                Seleccione color de Fondo:
                <input type="color" id="color-picker-background" value="${selectedBackgroundColor}">
            </div></p></p>
            <div>
                Seleccione color de Texto:
                <input type="color" id="color-picker-text" value="${selectedTextColor}">
            </div></p></p>
            <div>
                <label for="languageList">Seleccione el idioma de traducción:</label><br>
               <center> <select id="languageList"></select></p>
            </div>
           <center> <button id="btnAceptar">Aceptar</button>
            <button id="btnCancelar">Cancelar</button></center>
        `;

        // Agregar opciones de idiomas al listbox
        const languageList = configDialog.querySelector('#languageList');
        for (const language in languages) {
            const option = document.createElement('option');
            option.value = languages[language];
            option.text = language;
            languageList.add(option);
        }

        // Establecer el idioma seleccionado en la configuración actual
        languageList.value = targetLanguage;

        // Establecer estilos
        GM_addStyle(`
            #config-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background: #333;
                color: #FFF;
                border: 2px solid #000;
                border-radius: 25px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }

            #btnAceptar, #btnCancelar {
                margin-top: 10px;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 25px;
            }

            #btnAceptar {
                background: #005200;
                color: #fff;
                border: none;
                margin-right: 10px;
            }

            #btnCancelar {
                background: #99c599;
                color: #fff;
                border: none;
            }
        `);

        // Agregar la ventana emergente al cuerpo del documento
        document.body.appendChild(configDialog);

        // Añadir eventos a los botones
        const btnAceptar = document.getElementById('btnAceptar');
        btnAceptar.addEventListener('click', () => {
            // Guardar la configuración
            targetLanguage = languageList.value;
            GM_setValue('config', { targetLanguage: targetLanguage });
            closeConfigDialog(); // Cierra la ventana después de aceptar
            // Actualizar colores en el cuadro de traducción
            updateTranslationBoxColors();
        });

        const btnCancelar = document.getElementById('btnCancelar');
        btnCancelar.addEventListener('click', () => {
            closeConfigDialog(); // Cierra la ventana después de cancelar
        });

        // Añadir evento onchange al selector de color de fondo para actualizar el color del cuadro
        const colorPickerBackground = document.getElementById('color-picker-background');
        colorPickerBackground.addEventListener('input', updateColorBackground);

        // Añadir evento onchange al selector de color de texto para actualizar el color del cuadro
        const colorPickerText = document.getElementById('color-picker-text');
        colorPickerText.addEventListener('input', updateColorText);
    }

    function closeConfigDialog() {
        // Eliminar la ventana emergente del cuerpo del documento
        const configDialog = document.getElementById('config-dialog');
        if (configDialog) {
            configDialog.remove();
        }
    }

    function updateColorBackground() {
        const colorPickerBackground = document.getElementById('color-picker-background');
        selectedBackgroundColor = colorPickerBackground.value;
    }

    function updateColorText() {
        const colorPickerText = document.getElementById('color-picker-text');
        selectedTextColor = colorPickerText.value;
    }

    function updateTranslationBoxColors() {
        if (translationBox) {
            translationBox.style.background = selectedBackgroundColor;
            translationBox.style.color = selectedTextColor;
        }
    }

    function saveColors() {
        GM_setValue('selectedBackgroundColor', selectedBackgroundColor);
        GM_setValue('selectedTextColor', selectedTextColor);
    }

    // Actualizar colores en el cuadro de traducción al inicio
    updateTranslationBoxColors();
})();