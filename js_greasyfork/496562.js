// ==UserScript==
// @name         Random Avatar Changer by YoutubeDrawaria!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change your avatar to a random player's avatar and download your current avatar.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496562/Random%20Avatar%20Changer%20by%20YoutubeDrawaria%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496562/Random%20Avatar%20Changer%20by%20YoutubeDrawaria%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array de URLs de avatares disponibles
    const avatarUrls = [
    '86e33830-86ea-11ec-8553-bff27824cf71',
    'bfbe3620-1d5e-11ef-acaf-250da20bac69',
    '418e4160-cb1f-11ed-a71d-ab56d3db7ea6',
    '98bb4180-226a-11ed-9fd3-c3a00b129da4',
    'c8408150-dc14-11ec-9fd3-c3a00b129da4',
    'a272cd50-0d42-11ef-acaf-250da20bac69',
    '52bee980-1dee-11ef-acaf-250da20bac69',
    'e39f20a0-d3fc-11ee-bf00-7b802f1ca94b',
    '2b3925e0-0425-11ed-9fd3-c3a00b129da4',
    '331c1bb0-1e03-11ef-acaf-250da20bac69',
    'e728cb60-178e-11ef-acaf-250da20bac69',
    'c424c6c0-1138-11ef-acaf-250da20bac69',
    '6201c780-b7ed-11ee-a08e-793e831e2edc',
    '1a0dd6b0-477e-11ee-bc38-c361be163109',
    'dc8d83b0-1d13-11ee-9637-2101b993f0be',
    '96381160-9900-11ed-9fd3-c3a00b129da4',
    '1f400b90-8e8c-11ed-9fd3-c3a00b129da4',
    '741b5f10-6c14-11ed-9fd3-c3a00b129da4',
    '1c7c0480-5b37-11ea-bd0d-d982f110d7fd',
    '118e3ca0-5b5a-11ea-bd0d-d982f110d7fd',
    '1c7fea80-5c47-11ea-853a-9b17f47ac2d7',
    '1fba6650-665e-11ea-b39d-7bb8fda5d79f',
    '072e4930-699c-11ea-b44c-0b4dcf9d5ef1',
    'a5ecdb40-6af0-11ea-a73b-077bb29c1ee3',
    '7534cd80-71dc-11ea-94e4-a79c0e0066e1',
    '8e217470-7370-11ea-89ac-45c00dafd2e3',
    '09c4a3c0-77fb-11ea-9617-65edff98c927',
    '862b7dd0-808e-11ea-b257-69727f5f663c',
    '7c2d50a0-8594-11ea-bc11-f75950a68c24',
    'ad0554d0-8cd2-11ea-894b-cfb531386883',
    '2aea4e10-8efd-11ea-8268-f942a4e80c69',
    'e862ab90-91ff-11ea-8190-f74b0e427be6',
    '0b6627c0-9273-11ea-8733-693d00669271',
    '94721bb0-9777-11ea-aaa9-43cdc11ba2e8',
    '6fbfb880-9a9d-11ea-b554-87ab2604eb71',
    'c2cbc1f0-9c0e-11ea-b38f-318e6ebaac37',
    '1d1be460-9dda-11ea-a4e9-119510eef9db',
    '16bd8850-9e00-11ea-a4e9-119510eef9db',
    'f2989240-9f1b-11ea-a4e9-119510eef9db',
    '0b8b71d0-a04f-11ea-a4e9-119510eef9db',
    '45c4b230-a05e-11ea-a4e9-119510eef9db',
    '1c3d5c10-a0cb-11ea-a4e9-119510eef9db',
    'bd42cea0-a2d4-11ea-a4e9-119510eef9db',
    '724bf0e0-a31d-11ea-a4e9-119510eef9db',
    '69f9fad0-a346-11ea-a4e9-119510eef9db',
    'e93c2520-a657-11ea-a4e9-119510eef9db',
    '43526c60-a732-11ea-a4e9-119510eef9db',
    'f30dfd70-a8ec-11ea-86e2-6bb275999a37',
    '9472ec10-a9ac-11ea-86e2-6bb275999a37',
    'dcfa8c60-aa04-11ea-86e2-6bb275999a37',
    'd5f68df0-aa8c-11ea-86e2-6bb275999a37',
    '73be86c0-acac-11ea-86e2-6bb275999a37',
    'cee4ca90-acda-11ea-86e2-6bb275999a37',
    '0c46a310-ad56-11ea-86e2-6bb275999a37',
    '4ddc00c0-ae4d-11ea-bd8e-b5ddc2004258',
    '0927eb00-b245-11ea-bd8e-b5ddc2004258',
    '5e40b790-b62b-11ea-bd8e-b5ddc2004258',
    '4c9deac0-b87a-11ea-bd8e-b5ddc2004258',
    'eac1a240-b8a3-11ea-bd8e-b5ddc2004258',
    '467523c0-b947-11ea-bd8e-b5ddc2004258',
    '000634b0-ba78-11ea-bd8e-b5ddc2004258',
    '3e715060-bf94-11ea-bb8a-772444bea009',
    'e6a53d90-c035-11ea-bfe5-bd40acded5fc',
    'd0a47620-c0c9-11ea-a8bb-492bb09704a0',
    'b69ee820-c185-11ea-a442-f350118f438b',
    'df1fd310-c1ce-11ea-bc62-1fbf67bacde8',
    '4fbc7670-c63c-11ea-bdb2-fbeb1df24aa3',
    '7161eeb0-c86f-11ea-9dde-5d331b009956',
    '1f749f80-c91e-11ea-9dde-5d331b009956',
    '04628a90-cb3a-11ea-987f-fdc7163f6a11',
   'ca2657f0-cc72-11ea-be11-3b3954e3c6ff',
    'fdbcf5c0-ccf3-11ea-b8e1-6dea414a40d2',
    'bbd13510-cef9-11ea-a633-3dcc4e42db82',
    '34f08840-d019-11ea-a0fd-57615322c869',
    'd2e14e10-d2a1-11ea-a0fd-57615322c869',
    '22969bd0-d2e9-11ea-a0fd-57615322c869',
    'ba0d2920-d4e7-11ea-8908-092bf758cccf',
    'e4793880-d4ff-11ea-8908-092bf758cccf',
    'c9872860-db31-11ea-8c97-eb594e3396da',
    '23a40470-dcbe-11ea-887d-257476d63106',
    '315aa450-dd1f-11ea-b226-e795d004b597',
    'a50439e0-ddb8-11ea-a196-076ac93bef26',
    'e9a5a1d0-df2d-11ea-9392-eb461a14f3f4',
    '9ae632e0-df40-11ea-9392-eb461a14f3f4',
    '5aa9d230-e23e-11ea-aedc-7f1df046559d',
    'eb7b9910-e248-11ea-aedc-7f1df046559d',
    '4d50fb50-e2f1-11ea-b6b0-c70b04a9536a',
    '55bb6510-e3bd-11ea-8ebf-0f4eb4dcf389',
    '94369f40-ed6c-11ea-b0be-7db8e99a5df9',
    '32547810-efbf-11ea-ad90-85307ba45eb9',
    '7bea2aa0-f4c5-11ea-b3c8-69db88ee0c3b',
    '4bce5c00-f7c3-11ea-b33e-b18306721a5c',
    '546f53d0-f847-11ea-b33e-b18306721a5c',
    '6c945900-fa5f-11ea-a8a2-c977be6e2e24',
    '1a3f7310-fc3a-11ea-b046-41771ea9ec9d',
    'eab55a60-fc48-11ea-b046-41771ea9ec9d',
    'a1033ff0-fd05-11ea-85e2-cb5c49f82bdb',
    '51c85f70-fd18-11ea-85e2-cb5c49f82bdb',
    'd6af66f0-fdec-11ea-85e2-cb5c49f82bdb',
    'e0cf0af0-fe2d-11ea-85e2-cb5c49f82bdb',
    'af2313e0-ff11-11ea-85e2-cb5c49f82bdb',
    'c935f940-00cf-11eb-89b3-6313abcbf4ed',
    '7ecd0d30-0124-11eb-89b3-6313abcbf4ed',
    '224c8100-012c-11eb-89b3-6313abcbf4ed',
    '80a3ac10-019f-11eb-89b3-6313abcbf4ed',
    '51cb3570-0285-11eb-b470-e7b83d2f3b00',
    '741a16e0-0425-11eb-83be-fb1c764c820f',
    '8a1e9630-05b2-11eb-978a-81f37c20bb7a',
    '08e128e0-08c7-11eb-9c3f-2df35a2de16e',
    '20535dc0-08fb-11eb-9c3f-2df35a22c869',
    '187d69c0-0909-11eb-9c3f-2df35a22c869',
    '6e7e20c0-0a3b-11eb-be95-83af8123b41a',
    '3ff95460-0a9d-11eb-be95-83af8123b41a',
    '19042150-0bfb-11eb-82be-2f53796ccb77',
    'e8620b10-0cdc-11eb-a0ff-8d7c7b306a6a',
    'e13a5540-0ce6-11eb-a0ff-8d7c7b306a6a',
    'f306d280-0cfa-11eb-a0ff-8d7c7b306a6a',
    '7bd4a210-0f38-11eb-9133-6be283abf413',
    'a5914b90-10e5-11eb-9133-6be283abf413',
    'fdba73c0-120a-11eb-9133-6be283abf413',
    'a3d242e0-1258-11eb-9a25-330f162b87df',
    '8c8e3b50-1584-11eb-9a25-330f162b87df',
    'f4f5cdc0-15ac-11eb-9a25-330f162b87df',
    '74e68620-16d2-11eb-9a25-330f162b87df',
    '3aec1650-172d-11eb-a4be-43469d0e01d8',
    '1d119fb0-1732-11eb-a4be-43469d0e01d8',
    'e23d6e70-184c-11eb-a4be-43469d0e01d8',
    '0d72b9a0-1b78-11eb-8f81-51d911715ee9',
    '3133eb80-1de3-11eb-8f81-51d911715ee9',
    '8d1f86b0-1e07-11eb-8f81-51d911715ee9',
    '5542b8c0-1efc-11eb-8f81-51d911715ee9',
    '13eefaf0-22c6-11eb-9252-871853a7d8b1',
    '4dca98b0-22da-11eb-9252-871853a7d8b1',
    '5b6039e0-2379-11eb-9252-871853a7d8b1',
    '18a9b230-249a-11eb-96e9-e767e96c1453',
    '7f2b0630-24c7-11eb-a9b4-e7c2638120dd',
    '53325830-2503-11eb-a9b4-e7c2638120dd',
    '96ef6290-25d3-11eb-a9b4-e7c2638120dd',
    'e8bca7c0-2602-11eb-a9b4-e7c2638120dd',
    '91901ed0-262c-11eb-a9b4-e7c2638120dd',
    '1442aec0-2730-11eb-a9b4-e7c2638120dd',
    '802da3d0-28d2-11eb-a9b4-e7c2638120dd',
    '1dc45bc0-2937-11eb-a9b4-e7c2638120dd',
    '90e97350-29b5-11eb-a9b4-e7c2638120dd',
    '078ad110-29cb-11eb-a9b4-e7c2638120dd'
    ].map(id => `/avatar/cache/${id}.jpg`);

    // Función para cambiar el avatar al azar
    function changeAvatarRandomly() {
        const avatarImage = document.querySelector('#selfavatarimage');
        if (avatarImage) {
            const randomIndex = Math.floor(Math.random() * avatarUrls.length);
            const randomAvatarUrl = avatarUrls[randomIndex];
            avatarImage.src = randomAvatarUrl;
        } else {
            console.error('Not avatar picture found.');
        }
    }

    // Función para descargar el avatar actual
    function downloadCurrentAvatar() {
        const avatarImage = document.querySelector('#selfavatarimage');
        if (avatarImage) {
            const downloadLink = document.createElement('a');
            downloadLink.href = avatarImage.src;
            downloadLink.download = 'avatar.jpg'; // Nombre predeterminado para la descarga
            downloadLink.click();
        } else {
            console.error('Not avatar picture found.');
        }
    }

    // Función para abrir la imagen de tu avatar actual en una nueva pestaña
    function openCurrentAvatarInNewTab() {
        const avatarImage = document.querySelector('#selfavatarimage');
        if (avatarImage) {
            window.open(avatarImage.src, '_blank');
        } else {
            console.error('Not avatar picture found.');
        }
    }

    // Asigna los textos traducidos a cada idioma
    const translations = {
        en: {
            'Avatar Randomizer': 'Avatar Randomizer',
            'Download Avatar': 'Download Avatar',
            'Open in New Tab': 'Open in New Tab'
        },
        ru: {
            'Avatar Randomizer': 'Случайный аватар',
            'Download Avatar': 'Скачать аватар',
            'Open in New Tab': 'Открыть в новой вкладке'
        },
        es: {
            'Avatar Randomizer': 'Cambiar Avatar Aleatoriamente',
            'Download Avatar': 'Descargar Avatar',
            'Open in New Tab': 'Abrir en Nueva Pestaña'
        }
    };

    // Función para traducir los textos de los botones
    function translateButtonTexts() {
        const langSelector = document.querySelector('#langselector');
        if (langSelector) {
            const selectedLanguage = langSelector.value;
            const translationSet = translations[selectedLanguage];
            if (translationSet) {
                buttons.forEach((button) => {
                    const buttonElement = document.getElementById(button.id);
                    if (buttonElement) {
                        buttonElement.textContent = translationSet[button.text];
                    }
                });
            }
        }
    }

    // Crear los botones y agregarlos al DOM con la apariencia deseada
    const buttons = [
        { id: 'avatarRandomizerButton', text: 'Avatar Randomizer', clickHandler: changeAvatarRandomly },
        { id: 'downloadIconButton', text: 'Download Avatar', clickHandler: downloadCurrentAvatar },
        { id: 'openAvatarButton', text: 'Open in New Tab', clickHandler: openCurrentAvatarInNewTab }
    ];

    buttons.forEach((button) => {
        const newButton = document.createElement('button');
        newButton.id = button.id;
        newButton.type = 'button';
        newButton.role = 'button';
        newButton.classList.add('btn', 'btn-secondary', 'btn-block');
        newButton.textContent = button.text;
        newButton.addEventListener('click', button.clickHandler);

        const languageMenu = document.querySelector('#langselector');
        if (languageMenu) {
            languageMenu.parentNode.insertBefore(newButton, languageMenu.nextSibling);
        } else {
            console.error('Not avatar translatations found.');
        }
    });

    // Agrega un event listener para detectar cambios en el selector de idioma
    document.querySelector('#langselector').addEventListener('change', translateButtonTexts);

    // Ejecuta la función inicialmente para traducir los textos al cargar la página
    translateButtonTexts();
})();