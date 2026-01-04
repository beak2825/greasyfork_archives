// ==UserScript==
// @name         YouTube L to Search Focus
// @name         YouTube: Focus Search Bar with "L"
// @name:fr      YouTube : Mettre le focus sur la barre de recherche avec "L"
// @name:de      YouTube: Suchleiste mit "L" fokussieren
// @name:es      YouTube: Enfocar la barra de búsqueda con "L"
// @name:it      YouTube: Focalizza la barra di ricerca con "L"
// @name:pt      YouTube: Focar na barra de pesquisa com "L"
// @name:zh-CN   YouTube：使用 "L" 聚焦搜索栏
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Focus on YouTube's search bar when pressing "L" key, without disrupting comments or text inputs.
// @description         This script changes the behavior of the "L" key on YouTube to focus the search bar instead of skipping 10 seconds. It won't interfere when typing comments or using text fields.
// @description:fr      Ce script modifie le comportement de la touche "L" sur YouTube pour mettre le focus sur la barre de recherche au lieu d'avancer de 10 secondes. Il ne dérange pas lors de la rédaction de commentaires ou l'utilisation de champs texte.
// @description:de      Dieses Skript ändert das Verhalten der "L"-Taste auf YouTube, sodass die Suchleiste fokussiert wird, anstatt 10 Sekunden vorzuspringen. Es stört nicht beim Schreiben von Kommentaren oder der Nutzung von Textfeldern.
// @description:es      Este script modifica el comportamiento de la tecla "L" en YouTube para enfocar la barra de búsqueda en lugar de avanzar 10 segundos. No interfiere al escribir comentarios o usar campos de texto.
// @description:it      Questo script modifica il comportamento del tasto "L" su YouTube per focalizzare la barra di ricerca invece di avanzare di 10 secondi. Non interferisce durante la scrittura di commenti o l'uso di campi di testo.
// @description:pt      Este script altera o comportamento da tecla "L" no YouTube para focar na barra de pesquisa em vez de avançar 10 segundos. Não interfere ao digitar comentários ou usar campos de texto.
// @description:zh-CN   此脚本更改了 YouTube 上 "L" 键的行为，使其聚焦于搜索栏，而不是快进 10 秒。不会干扰您输入评论或使用文本字段。
// @author       MatVampir0
// @match        https://www.youtube.com/*
// @grant        none
// @license      GPL v2.0
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/519684/YouTube%20L%20to%20Search%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/519684/YouTube%20L%20to%20Search%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'l') {
            const activeElement = document.activeElement;
            if (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.getAttribute('contenteditable') === 'true'
            ) {
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            const searchBox = document.querySelector('ytd-searchbox form #search');
            if (searchBox) {
                searchBox.focus();
            }
        }
    }, true);
})();
