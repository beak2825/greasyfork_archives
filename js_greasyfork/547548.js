// ==UserScript==
// @name         Instagram DM Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rola automaticamente para o topo das conversas do Instagram até carregar tudo
// @author       Você
// @match        https://www.instagram.com/direct/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547548/Instagram%20DM%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/547548/Instagram%20DM%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey: Instagram Auto Scroll carregado!");

    // tempo em milissegundos entre cada rolagem (2000 = 2s)
    const intervalo = 2000;

    function autoScroll() {
        let chatBox = document.querySelector("div[role='dialog'] div[role='main']"); 

        if (chatBox) {
            chatBox.scrollTop = 0; // sobe para o topo
            console.log("Subindo para carregar mensagens antigas...");
        } else {
            console.log("Chat não encontrado, abra uma conversa.");
        }
    }

    // repete a rolagem automaticamente
    setInterval(autoScroll, intervalo);

})();