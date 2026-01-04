// ==UserScript==
// @name        Adicionar Elementos JS E CSS
// @namespace   elementosAtlas
// @description Adiciona os elementos que faltam no ponto sem precisar carrega-los via web
// @include     http://cs-loja15.ddns.net:84/menu.html*
// @include     http://cs-loja15.ddns.net:84/*
// @include     http://cs-loja15.ddns.net:84
// @exclude     http://cs-loja15.ddns.net*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369884/Adicionar%20Elementos%20JS%20E%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/369884/Adicionar%20Elementos%20JS%20E%20CSS.meta.js
// ==/UserScript==

// ==UserScript==
// @name        Carrega scripts para Relógios de Ponto Hexa e Prisma 
// @author  Djalma Santiago
// @include     http*
// @grant       none
// ==/UserScript ==

window.onload =  function() {
var elemento_pai = document.body;
var titulo = document.createElement('head');
elemento_pai.appendChild(titulo);
var a='<link rel="stylesheet" href="http://10.10.10.55/style.css" type="text/css">+<link rel="stylesheet" href="http://10.10.10.55/scripts.js" type="text/css">';
var texto  = titulo.innerHTML=[a];

}

