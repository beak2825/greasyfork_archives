// ==UserScript==
// @name         CacheFunctions
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Operações de CACHE
// @author       @josias-soares
// @license      MIT
// ==/UserScript==

const TAG_ALONG = "TAG_ALONG_"

// Função para armazenar uma string no cache do navegador
function salvarNoCache(chave, valor) {
    localStorage.setItem(chave, valor);
}

// Função para buscar uma string no cache do navegador
function buscarDoCache(chave) {
    return localStorage.getItem(chave);
}

// Deletar uma chave do cache local
function deletarChaveDoCache(chave) {
    localStorage.removeItem(chave);
}