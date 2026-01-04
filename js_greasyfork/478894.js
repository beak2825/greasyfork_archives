// ==UserScript==
// @name         sacocheio.tv
// @namespace    #
// @version      1.6
// @description  Permite ver o SCTV free
// @author       Kartel
// @match        *://sacocheio.tv/*
// @match        *://www.sacocheio.tv/*
// @match        https://www.sacocheio.tv/*
// @match        *sacocheio.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478894/sacocheiotv.user.js
// @updateURL https://update.greasyfork.org/scripts/478894/sacocheiotv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para substituir o script e alterar o Local Storage
    function substituirScriptEAlterarLocalStorage() {
        // Remove o script original
        // Altera o tipo de usuário no Local Storage
        localStorage.setItem("@sctv/userType", "USER_ASSINANTE");
        // Altera o valor de userId no Local Storage
        localStorage.setItem("@sctv/userId", "1");
        // Altera o valor de userId no Local Storage
        localStorage.setItem("@sctv/userName", "Pétry?");
        // Altera o valor de token no Local Storage
        localStorage.setItem("@sctv/token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIyMSwiZW1haWwiOiJtYXRoZXVzdXBickBnbWFpbC5jb20iLCJpYXQiOjE2OTg5NDgyNDZ9.qbedr643SBTDgmJ3sdXOhxiQ0ixE48wzsBBV1VwvbEc");
    }

    // Aguarda o evento 'DOMContentLoaded' para garantir que o DOM esteja pronto
    document.addEventListener('DOMContentLoaded', substituirScriptEAlterarLocalStorage);
})();