// ==UserScript==
// @name        Script Obras Literárias Bernoulli
// @namespace   Script Obras Bernoulli
// @match       https://digital.bernoulli.dev.br/*
// @match       https://meu.bernoulli.com.br/estudodeobras/*
// @match       https://ativosdigitais.blob.core.windows.net/*
// @run-at      document-end
// @icon        https://ativosdigitais.blob.core.windows.net/arquivos-publicos/estudodeobras/amortequincas/images/favicon.png
// @version     1.0
// @author      -
// @license     MIT
// @description Habilita a opção de imprimir e selecionar o texto nas obras literárias do Guia Virtual
// @downloadURL https://update.greasyfork.org/scripts/530109/Script%20Obras%20Liter%C3%A1rias%20Bernoulli.user.js
// @updateURL https://update.greasyfork.org/scripts/530109/Script%20Obras%20Liter%C3%A1rias%20Bernoulli.meta.js
// ==/UserScript==

// Habilita a seleção de texto:
let body = document.querySelector("body");
if (body) {
    body.style.userSelect = "";
}

// Habilita a impressão:
let elementoStyle = document.querySelector('style[type="text/css"][media="print"]');
if (elementoStyle) {
    elementoStyle.remove();
}
