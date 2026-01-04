// ==UserScript==
// @name         Doceru PDF Direct Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona um botão para baixar PDFs diretamente do Doceru.com
// @author       Você
// @match        https://doceru.com/doc/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536565/Doceru%20PDF%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536565/Doceru%20PDF%20Direct%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Função para encontrar a URL do PDF na página
    function findPdfUrl() {
        // Verifica se existe algum elemento com data-pdf-url
        const elementsWithData = document.querySelectorAll('[data-pdf-url]');
        if (elementsWithData.length > 0) {
            return elementsWithData[0].getAttribute('data-pdf-url');
        }
        
        // Procura por URLs de PDF no HTML
        const pageSource = document.documentElement.outerHTML;
        const pdfUrlMatch = pageSource.match(/https:\/\/stream\.doceru\.com\/getpdf\/[^"'\s)]+/);
        if (pdfUrlMatch) {
            return pdfUrlMatch[0];
        }
        
        // Procura por IDs de documento que podem ser usados para construir a URL
        const docIdMatch = pageSource.match(/data-id="([^"]+)"/);
        if (docIdMatch) {
            const docId = docIdMatch[1];
            // Esta é uma suposição baseada no padrão comum de URLs
            return `https://stream.doceru.com/getpdf/${docId}`;
        }
        
        return null;
    }
    
    // Função para criar o botão de download
    function createDownloadButton(pdfUrl) {
        // Cria um novo botão
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '⬇️ Download Direto PDF';
        downloadBtn.style.position = 'fixed';
        downloadBtn.style.top = '100px';
        downloadBtn.style.right = '20px';
        downloadBtn.style.zIndex = '9999';
        downloadBtn.style.padding = '10px 15px';
        downloadBtn.style.backgroundColor = '#5D5CDE';
        downloadBtn.style.color = 'white';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '4px';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.fontWeight = 'bold';
        downloadBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        // Adiciona efeitos de hover
        downloadBtn.onmouseover = function() {
            this.style.backgroundColor = '#4a49b7';
        };
        downloadBtn.onmouseout = function() {
            this.style.backgroundColor = '#5D5CDE';
        };
        
        // Adiciona ação de clique
        downloadBtn.onclick = function() {
            if (pdfUrl) {
                // Abre a URL em uma nova aba
                window.open(pdfUrl, '_blank');
            } else {
                alert('URL do PDF não encontrada! Tente recarregar a página.');
            }
        };
        
        // Adiciona o botão ao corpo da página
        document.body.appendChild(downloadBtn);
    }
    
    // Função principal que executa quando a página carrega
    function init() {
        console.log('Doceru PDF Downloader iniciado...');
        
        // Espera um pouco para garantir que a página carregou completamente
        setTimeout(function() {
            const pdfUrl = findPdfUrl();
            
            if (pdfUrl) {
                console.log('URL do PDF encontrada:', pdfUrl);
                createDownloadButton(pdfUrl);
            } else {
                console.log('URL do PDF não encontrada automaticamente');
                
                // Cria um botão para procurar manualmente
                const searchBtn = document.createElement('button');
                searchBtn.innerText = '🔍 Procurar URL do PDF';
                searchBtn.style.position = 'fixed';
                searchBtn.style.top = '100px';
                searchBtn.style.right = '20px';
                searchBtn.style.zIndex = '9999';
                searchBtn.style.padding = '10px 15px';
                searchBtn.style.backgroundColor = '#5D5CDE';
                searchBtn.style.color = 'white';
                searchBtn.style.border = 'none';
                searchBtn.style.borderRadius = '4px';
                searchBtn.style.cursor = 'pointer';
                searchBtn.style.fontWeight = 'bold';
                searchBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                
                searchBtn.onclick = function() {
                    // Abre o console e mostra instruções
                    console.clear();
                    console.log('%c INSTRUÇÕES PARA ENCONTRAR O PDF', 'background: #5D5CDE; color: white; font-size: 16px; padding: 5px;');
                    console.log('1. Pressione F12 para abrir o console do desenvolvedor (se ainda não estiver aberto)');
                    console.log('2. Vá para a aba "Elementos" ou "Inspector"');
                    console.log('3. Pressione Ctrl+F para abrir a busca');
                    console.log('4. Digite "stream.doceru.com/getpdf/" ou "data-pdf-url" e pressione Enter');
                    console.log('5. Copie a URL completa que aparece e use-a para baixar o PDF');
                    
                    alert('Instruções exibidas no console! Pressione F12 para ver.');
                };
                
                document.body.appendChild(searchBtn);
            }
        }, 1500);
    }
    
    // Inicia o script
    init();
})();