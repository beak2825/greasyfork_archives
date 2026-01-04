// ==UserScript==
// @name         PRIVATE SERVER KRYPTA
// @namespace     Krypta Kogama
// @version      1.2
// @description  Made to facilitate the creation of private servers
// @author       Krypta
// @match        https://kogama.com.br/games/play/*/?local=1&lang=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495912/PRIVATE%20SERVER%20KRYPTA.user.js
// @updateURL https://update.greasyfork.org/scripts/495912/PRIVATE%20SERVER%20KRYPTA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.kogama = function() {
        console.log("window.kogama = false");
    };

    function getObjectIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/\/games\/play\/(\d+)/);
        return match ? match[1] : null;
    }

    function getUserId() {
        return window.userId || 0;
    }

    function getLangFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang');
    }

    const lang = getLangFromUrl();
    if (!lang) {
        console.error('Idioma não especificado na URL');
        return;
    }

    const profileID = getUserId();

    const objectID = getObjectIdFromUrl();
    if (objectID === null) {
        console.error('Não foi possível obter o objectID da URL');
        return;
    }

    fetch(`https://kogama.com.br/locator/session/?objectID=${objectID}&profileID=${profileID}&lang=${lang}&type=local-play`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocorreu um erro ao acessar as informações: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const { id, sessionToken } = data;

            const newUrl = `https://kogama.com.br/locator/session/${id}/?token=${encodeURIComponent(sessionToken)}&plugin=STANDALONE&ssl=1&unityPacket=1`;

            const base64Url = btoa(newUrl);

            const finalUrl = `kogama2-br:kogamaPackage:${base64Url}`;

            window.location.href = finalUrl;
        })
        .catch(error => {
            console.error('Houve um problema com a operação de busca:', error);
        });
})();
