// ==UserScript==
// @name        GitHub Reader New
// @namespace   Violentmonkey Scripts
// @match       https://*.github.com/*
// @grant       none
// @version     1.7
// @author      EmersonxD
// @description Ajusta automaticamente a largura do GitHub para melhorar a visualização.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464300/GitHub%20Reader%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/464300/GitHub%20Reader%20New.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verifica se o estilo já existe antes de criar um novo
    if (!document.querySelector('#github-reader-enhancer-style')) {
        const style = document.createElement('style');
        style.id = 'github-reader-enhancer-style';
        document.head.appendChild(style);
    }

    // Define variáveis para valores repetidos
    const maxWidth = '100%';
    const containerMaxWidth = '90%';

    // Aplica o CSS personalizado
    document.querySelector('#github-reader-enhancer-style').textContent = `
        .timeline-new-comment,
        .markdown-body {
            max-width: ${maxWidth};
        }
        .markdown-body {
            font-size: 1.4em;
        }
        .discussion-timeline,
        .container-lg,
        .container-xl {
            max-width: ${containerMaxWidth};
        }
    `;

    // Função para validar endereços de e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Função para enviar e-mails
    function sendEmail(subject, body, recipient) {
        if (!validateEmail(recipient)) {
            alert('O destinatário deve ser um endereço de e-mail válido.');
            return;
        }

        if (body.trim() === '') {
            alert('O corpo do e-mail não pode estar vazio.');
            return;
        }

        const link = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        if (confirm('Tem certeza de que deseja enviar o e-mail?')) {
            window.location.href = link;
        }
    }

    // Cria o botão de "Salvar e Enviar E-mail"
    const saveAndSendBtn = document.createElement('button');
    saveAndSendBtn.textContent = 'Salvar e Enviar E-mail';
    saveAndSendBtn.style.position = 'fixed';
    saveAndSendBtn.style.bottom = '20px';
    saveAndSendBtn.style.right = '20px';
    saveAndSendBtn.style.zIndex = '9999';
    saveAndSendBtn.style.backgroundColor = '#4CAF50';
    saveAndSendBtn.style.color = '#fff';
    saveAndSendBtn.style.padding = '10px 20px';
    saveAndSendBtn.style.borderRadius = '5px';
    saveAndSendBtn.style.border = 'none';

    saveAndSendBtn.addEventListener('click', function() {
        const subject = 'Texto salvo do GitHub Reader New';
        const body = document.body.innerText;
        const recipient = 'testando001245@gmail.com';
        sendEmail(subject, body, recipient);
    });

    document.body.appendChild(saveAndSendBtn);
})();