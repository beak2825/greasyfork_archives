// ==UserScript==
// @name         Drawaria Art Prompt-to-Picture: On!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Drawing Art Prompt-to-Picture: On!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536160/Drawaria%20Art%20Prompt-to-Picture%3A%20On%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536160/Drawaria%20Art%20Prompt-to-Picture%3A%20On%21.meta.js
// ==/UserScript==

(function() {
    'use strict';



// (function() { /*
//   'use strict';

    // Function to get the user's language
    function getUserLanguage() {
        const navigatorLanguage = navigator.language || navigator.userLanguage;
        return navigatorLanguage.split('-')[0]; // Get the primary language code
    }

    // Translations for the warning message and character's speech
    const translations = {
        en: {
            title: 'Everything is blocked',
            message: 'You should not play right now, you have important things to do.',
            characterSpeech: 'Hey! Go outside.'
        },
        es: {
            title: 'Todo está bloqueado',
            message: 'No debes jugar en este momento, tienes cosas importantes que hacer ahora mismo.',
            characterSpeech: '¡Oye! Sal afuera.'
        },
        fr: {
            title: 'Tout est bloqué',
            message: 'Vous ne devriez pas jouer en ce moment, vous avez des choses importantes à faire.',
            characterSpeech: 'Hé ! Sors dehors.'
        },
        de: {
            title: 'Alles ist blockiert',
            message: 'Du solltest im Moment nicht spielen, du hast wichtige Dinge zu tun.',
            characterSpeech: 'Hey! Geh nach draußen.'
        },
        it: {
            title: 'Tutto è bloccato',
            message: 'Non dovresti giocare in questo momento, hai cose importanti da fare.',
            characterSpeech: 'Ehi! Esci fuori.'
        },
        pt: {
            title: 'Tudo está bloqueado',
            message: 'Você não deveria jogar agora, você tem coisas importantes para fazer.',
            characterSpeech: 'Ei! Vá para fora.'
        },
        ru: {
            title: 'Все заблокировано',
            message: 'Вы не должны играть сейчас, у вас есть важные дела.',
            characterSpeech: 'Эй! Иди на улицу.'
        },
        ja: {
            title: 'すべてブロックされています',
            message: '今はプレイすべきではありません。重要なことがあります。',
            characterSpeech: 'ねえ！外に出ようよ。'
        },
        zh: {
            title: '一切都被阻止了',
            message: '您现在不应该玩，您有重要的事情要做。',
            characterSpeech: '嘿！出去外面。'
        },
        // Add more languages as needed
    };
//*

































    // Estilos CSS para la opción de simetría
    const symmetryStyle = `
        #option-symmetry {
            display: flex;
            flex-direction: column;
            margin-bottom: 1em;
        }
        #option-symmetry > div {
            margin-bottom: 0.5em;
        }
        #option-symmetry > select {
            pointer-events: auto;
            display: block;
            position: relative;
            z-index: 1000;
        }
    `;

    // Inyectar los estilos CSS en la página
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = symmetryStyle;
    document.head.appendChild(styleSheet);

    // Función para agregar la opción de simetría
    function addSymmetryOption() {
        // Verificar si el elemento de simetría ya existe
        if (document.querySelector('#option-symmetry')) {
            return;
        }

        // Crear el contenedor de la opción de simetría
        const symmetryContainer = document.createElement('div');
        symmetryContainer.className = 'drawcontrols-selectoption';
        symmetryContainer.id = 'option-symmetry';
        symmetryContainer.innerHTML = `
            <div>Simetría:</div>
            <select class="form-control form-control-sm" data-extprop="2">
                <option value="0" class="option-symmetry-common">-</option>
                <option value="1" class="option-symmetry-common">Espejo horizontal</option>
                <option value="2" class="option-symmetry-common">Espejo vertical</option>
                <option value="3" class="option-symmetry-common">Espejo diagonal</option>
                <option value="102">2 sectores radiales</option>
                <option value="202">2 sectores radiales + reflejo</option>
                <option value="103">3 sectores radiales</option>
                <option value="203">3 sectores radiales + reflejo</option>
                <option value="104">4 sectores radiales</option>
                <option value="204">4 sectores radiales + reflejo</option>
                <option value="105">5 sectores radiales</option>
                <option value="205">5 sectores radiales + reflejo</option>
                <option value="106">6 sectores radiales</option>
                <option value="206">6 sectores radiales + reflejo</option>
                <option value="107">7 sectores radiales</option>
                <option value="207">7 sectores radiales + reflejo</option>
                <option value="108">8 sectores radiales</option>
                <option value="208">8 sectores radiales + reflejo</option>
                <option value="109">9 sectores radiales</option>
                <option value="209">9 sectores radiales + reflejo</option>
            </select>
        `;

        // Agregar el contenedor de simetría al contenedor de opciones de dibujo
        const drawSettingsContainer = document.querySelector('.drawcontrols-settingscontainer');
        if (drawSettingsContainer) {
            drawSettingsContainer.appendChild(symmetryContainer);
        }
    }

    // Observar cambios en el DOM para agregar la opción de simetría cuando sea necesario
    const observer = new MutationObserver(addSymmetryOption);
    observer.observe(document.body, { childList: true, subtree: true });

    // Agregar la opción de simetría inicialmente
    addSymmetryOption();

    // Activar los listeners necesarios para la opción de simetría
    function activateSymmetryListeners() {
        const symmetrySelect = document.querySelector('#option-symmetry select');
        if (symmetrySelect) {
            symmetrySelect.addEventListener('change', function() {
                const selectedValue = symmetrySelect.value;
                // Aquí puedes agregar la lógica para aplicar la simetría seleccionada
                console.log('Simetría seleccionada:', selectedValue);
                // Ejemplo: Aplicar la simetría al canvas
                applySymmetry(selectedValue);
            });
        }
    }

    // Función para aplicar la simetría al canvas
    function applySymmetry(value) {
        // Aquí puedes agregar la lógica para aplicar la simetría al canvas
        // Esta es una implementación de ejemplo
        const canvas = document.querySelector('#canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.save();
            switch (value) {
                case '1':
                    ctx.translate(canvas.width / 2, 0);
                    ctx.scale(-1, 1);
                    break;
                case '2':
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.scale(1, -1);
                    break;
                case '3':
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(Math.PI / 4);
                    break;
                // Agregar más casos según sea necesario
                default:
                    ctx.restore();
                    break;
            }
            ctx.restore();
        }
    }

    // Activar los listeners inicialmente
    activateSymmetryListeners();

    // Observar cambios en el DOM para activar los listeners cuando sea necesario
    const listenerObserver = new MutationObserver(activateSymmetryListeners);
    listenerObserver.observe(document.body, { childList: true, subtree: true });
})();
