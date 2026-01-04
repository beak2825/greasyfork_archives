// ==UserScript==
// @name         Investing - Libera conteúdo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Oculta tela de bloqueio por bloqueador de propaganda e libera conteúdo do site Investing
// @author       Fernando Mendes Fonseca
// @match        https://br.investing.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/399217/Investing%20-%20Libera%20conte%C3%BAdo.user.js
// @updateURL https://update.greasyfork.org/scripts/399217/Investing%20-%20Libera%20conte%C3%BAdo.meta.js
// ==/UserScript==

//Função para atrasar a execução do código e executar após o carregamento e execução dos scripts do site
$(document).ready(function() { //Função a ser executada após o carregamento da página
setTimeout(function() { //Função que cria um Delay para aguardar o carregamento da página e os scripts dela não apagarem o conteúdo criado.

var adBox = document.getElementById("abPopup");
adBox.parentNode.removeChild(adBox);

adBox = document.getElementsByTagName('body')[0].getElementsByTagName('div')[4]
adBox.parentNode.removeChild(adBox);

    document.body.style.overflow = 'scroll';

}, 500); //Tempo de 0,6 segundos para carregar a página e o código executar, se não os scripts do ML apagam o conteúdo criado.
});