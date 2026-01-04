// ==UserScript==
// @name         Doceru PDF Simple Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona um botão personalizado para baixar PDFs diretamente do Doceru.com
// @author       Você
// @match        https://doceru.com/doc/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536567/Doceru%20PDF%20Simple%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536567/Doceru%20PDF%20Simple%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Extrair o ID do documento da URL atual
    function getDocumentId() {
        // Pega da URL (geralmente em formato doceru.com/doc/ID_AQUI)
        const urlMatch = window.location.pathname.match(/\/doc\/([^\/]+)/);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }
        
        // Fallback: procura por data-id no conteúdo da página
        const dataIdElements = document.querySelectorAll('[data-id]');
        for (const el of dataIdElements) {
            const id = el.getAttribute('data-id');
            if (id) return id;
        }
        
        return null;
    }
    
    // Função para criar nosso botão personalizado
    function createCustomButton(documentId) {
        // Criar o botão estilizado
        const button = document.createElement('div');
        button.id = 'custom-pdf-download-button';
        button.innerHTML = '📥 BAIXAR PDF DIRETAMENTE';
        
        // Estilizar o botão para ficar bem visível
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#FF4500', // Cor laranja vibrante
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            border: '2px solid white'
        });
        
        // Adicionar efeitos de hover
        button.onmouseover = function() {
            this.style.backgroundColor = '#FF6347';
            this.style.transform = 'scale(1.05)';
        };
        
        button.onmouseout = function() {
            this.style.backgroundColor = '#FF4500';
            this.style.transform = 'scale(1)';
        };
        
        // Adicionar a ação de download quando clicado
        button.onclick = function() {
            if (documentId) {
                // URL direta para download do PDF
                const downloadUrl = `https://stream.doceru.com/getpdf/${documentId}`;
                
                // Abrir em nova aba
                window.open(downloadUrl, '_blank');
                
                // Feedback visual para o usuário
                this.innerHTML = '✅ PDF ABERTO!';
                setTimeout(() => {
                    this.innerHTML = '📥 BAIXAR PDF DIRETAMENTE';
                }, 2000);
            } else {
                alert('Não foi possível identificar o ID do documento. Por favor, tente atualizar a página.');
            }
        };
        
        // Adicionar o botão à página
        document.body.appendChild(button);
    }
    
    // Função principal
    function init() {
        // Obter o ID do documento
        const documentId = getDocumentId();
        
        // Se encontrou o ID, cria o botão de download
        if (documentId) {
            console.log(`ID do documento identificado: ${documentId}`);
            createCustomButton(documentId);
        } else {
            console.error('Não foi possível identificar o ID do documento');
            
            // Adiciona um botão de erro
            const errorButton = document.createElement('div');
            errorButton.id = 'pdf-download-error';
            errorButton.innerHTML = '❌ ERRO: ID NÃO ENCONTRADO';
            
            Object.assign(errorButton.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999',
                backgroundColor: '#FF0000',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            });
            
            document.body.appendChild(errorButton);
        }
    }
    
    // Executar o script após um pequeno atraso para garantir que a página carregou
    setTimeout(init, 1000);
})();