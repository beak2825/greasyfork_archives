// ==UserScript==
// @name         No HTTPS Security Warning
// @name:pt-BR   Aviso de Segurança sem HTTPS
// @namespace    about:addons
// @version      1.0.1
// @description  Displays a red bar as a security warning if the site does not have HTTPS
// @description:pt-BR Exibe uma barra vermelha como aviso de segurança caso o site não possua HTTPS
// @author       Diego Nascimento // greasyfork@nascimentodiego.com.br
// @license      MIT
// @match        *://*/*
// @grant        none
// @homepageURL  https://greasyfork.org/pt-BR/scripts/520671-no-https-security-warning
// @downloadURL https://update.greasyfork.org/scripts/520671/No%20HTTPS%20Security%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/520671/No%20HTTPS%20Security%20Warning.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // Verifica o idioma do navegador
    var userLang = (navigator.language || navigator.userLanguage).toLowerCase();
    
    // Define as mensagens com base no idioma
    var avisoTexto;
    var botaoTexto;
    if (userLang === 'pt-br') {
        avisoTexto = 'ALERTA DE SEGURANÇA: A página acessada não possui HTTPS. Os dados podem não estar protegidos!';
        botaoTexto = 'Fechar';
    } else {
        avisoTexto = 'SECURITY ALERT: You are accessing this page without HTTPS. Data may not be secure!';
        botaoTexto = 'Dismiss';
    }

    // Verifica o protocolo da página atual
    if (window.location.protocol !== 'https:') {
        // Cria o container do aviso
        var avisoContainer = document.createElement('div');
        avisoContainer.style.position = 'fixed';
        avisoContainer.style.top = '0';
        avisoContainer.style.left = '0';
        avisoContainer.style.width = '100%';
        avisoContainer.style.padding = '10px';
        avisoContainer.style.backgroundColor = 'red';
        avisoContainer.style.color = 'white';
        avisoContainer.style.fontSize = '16px';
        avisoContainer.style.fontWeight = 'bold';
        avisoContainer.style.textAlign = 'center';
        avisoContainer.style.zIndex = '9999';
        avisoContainer.style.display = 'flex';
        avisoContainer.style.alignItems = 'center';
        avisoContainer.style.justifyContent = 'center';
        avisoContainer.style.boxSizing = 'border-box';

        // Cria o texto do aviso
        var spanTexto = document.createElement('span');
        spanTexto.textContent = avisoTexto;
        spanTexto.style.marginRight = '20px';

        // Cria um botão para dispensar o aviso
        var botaoFechar = document.createElement('button');
        botaoFechar.textContent = botaoTexto;
        botaoFechar.style.backgroundColor = 'white';
        botaoFechar.style.color = 'red';
        botaoFechar.style.border = 'none';
        botaoFechar.style.padding = '5px 10px';
        botaoFechar.style.cursor = 'pointer';
        botaoFechar.style.fontWeight = 'bold';

        botaoFechar.addEventListener('click', function() {
            // Ao clicar no botão, remove o aviso e restaura a margem do body
            avisoContainer.remove();
            document.body.style.marginTop = '';
        });

        avisoContainer.appendChild(spanTexto);
        avisoContainer.appendChild(botaoFechar);

        // Adiciona o aviso ao body
        document.body.appendChild(avisoContainer);

        // Ajusta a margem superior do body de acordo com a altura do aviso, empurrando o conteúdo para baixo
        var avisoHeight = avisoContainer.offsetHeight;
        document.body.style.marginTop = avisoHeight + 'px';
    }
})();