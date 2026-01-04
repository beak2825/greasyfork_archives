// ==UserScript==
// @name         Gran Rateios Acesso Direto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simula um pagamento PIX concluído com sucesso
// @author       App-Creator
// @match        https://granrateios.com/obrigado/
// @match        https://granrateios.com/obrigado
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536562/Gran%20Rateios%20Acesso%20Direto.user.js
// @updateURL https://update.greasyfork.org/scripts/536562/Gran%20Rateios%20Acesso%20Direto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Espera um momento para garantir que a página esteja carregada
    setTimeout(function() {
        // Identificar e remover a seção de QR Code PIX
        const pixContainer = document.querySelector('.wcpix-container');
        if (pixContainer) {
            pixContainer.style.display = 'none';
            
            // Criar elementos para mensagem de sucesso
            const successDiv = document.createElement('div');
            successDiv.className = 'payment-success-message';
            successDiv.style.textAlign = 'center';
            successDiv.style.padding = '20px';
            successDiv.style.margin = '20px 0';
            successDiv.style.backgroundColor = '#e7f7e7';
            successDiv.style.border = '2px solid #46b450';
            successDiv.style.borderRadius = '5px';
            
            // Adicionar ícone de sucesso
            const successIcon = document.createElement('div');
            successIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#46b450" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            `;
            successDiv.appendChild(successIcon);
            
            // Adicionar texto de confirmação
            const successText = document.createElement('h2');
            successText.style.color = '#46b450';
            successText.style.margin = '15px 0';
            successText.textContent = 'Pagamento Aprovado!';
            successDiv.appendChild(successText);
            
            // Adicionar detalhes
            const successDetails = document.createElement('p');
            successDetails.style.fontSize = '16px';
            successDetails.style.margin = '10px 0';
            successDetails.innerHTML = 'Seu pagamento foi processado com sucesso. <br>O acesso ao conteúdo foi liberado em sua conta.';
            successDiv.appendChild(successDetails);
            
            // Adicionar botão de acesso
            const accessButton = document.createElement('a');
            accessButton.href = 'https://granrateios.com/minha-conta/';
            accessButton.className = 'button';
            accessButton.style.display = 'inline-block';
            accessButton.style.padding = '10px 20px';
            accessButton.style.margin = '15px 0';
            accessButton.style.backgroundColor = '#46b450';
            accessButton.style.color = 'white';
            accessButton.style.textDecoration = 'none';
            accessButton.style.borderRadius = '30px';
            accessButton.style.fontWeight = 'bold';
            accessButton.textContent = 'Acessar Meu Conteúdo';
            successDiv.appendChild(accessButton);
            
            // Inserir mensagem de sucesso no lugar do container PIX
            pixContainer.parentNode.insertBefore(successDiv, pixContainer);
            
            // Alterar título e descrição da página para refletir o status
            const pageTitle = document.querySelector('.elementor-heading-title');
            if (pageTitle) {
                pageTitle.textContent = 'Seu Acesso Foi Liberado!';
            }
            
            const pageDescription = document.querySelector('.elementor-element-a5f579e .elementor-widget-container p');
            if (pageDescription) {
                pageDescription.innerHTML = 'Parabéns! Seu pagamento foi confirmado e <strong>seu acesso já está disponível</strong>. Você pode acessar o conteúdo na sua área de cliente.';
            }
            
            // Modificar o ícone superior para check
            const thumbsUpIcon = document.querySelector('.elementor-icon svg');
            if (thumbsUpIcon) {
                thumbsUpIcon.outerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                `;
            }
        }
        
        // Modificar status do pedido se existir
        const orderStatus = document.querySelector('.woocommerce-notice--success');
        if (orderStatus) {
            orderStatus.textContent = 'Seu pedido foi processado com sucesso e o acesso foi liberado!';
        }
        
        // Modificar ou remover quaisquer links para compartilhar comprovante
        const shareLinks = document.querySelectorAll('.wcpix-whatsapp, .wcpix-telegram, .wcpix-email');
        shareLinks.forEach(link => {
            link.style.display = 'none';
        });
        
        console.log('Gran Rateios Acesso Direto: Pagamento simulado com sucesso!');
        
    }, 1000); // Aguarda 1 segundo para garantir que a página esteja totalmente carregada
})();