// ==UserScript==
// @name         Doceru PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove anúncios e automatiza o download de arquivos PDF do Doceru.com
// @author       AppCreator
// @match        https://doceru.com/doc/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536563/Doceru%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536563/Doceru%20PDF%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("Doceru PDF Downloader iniciado");
    
    // Função para remover anúncios
    function removeAds() {
        // Remove todos os iframes (geralmente anúncios)
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.remove();
        });
        
        // Remove divs de anúncios
        const adDivs = document.querySelectorAll('.ad-750, .ad-300, .ad-1, .ad-2, [id^="square-"], [id^="doublebillboard-"], .spolecznoscinet');
        adDivs.forEach(div => {
            div.remove();
        });
        
        // Remove scripts relacionados a anúncios
        const scripts = document.querySelectorAll('script[src*="ads"], script[src*="adserver"], script[src*="vidoomy"], script[src*="viads"], script[src*="webshark"]');
        scripts.forEach(script => {
            script.remove();
        });
        
        console.log("Anúncios removidos");
    }
    
    // Função para obter o ID do documento da URL
    function getDocumentId() {
        const path = window.location.pathname;
        const matches = path.match(/\/doc\/([a-zA-Z0-9]+)/);
        if (matches && matches[1]) {
            return matches[1];
        }
        return null;
    }
    
    // Função para iniciar o download automaticamente
    function initiateDownload() {
        // Remover camada de recaptcha se existir
        const recaptchaDiv = document.getElementById('recap-show');
        if (recaptchaDiv) {
            recaptchaDiv.style.display = 'none';
        }
        
        // Verificar se há botão de download e clicar
        const downloadBtn = document.getElementById('dwn_btn');
        if (downloadBtn) {
            console.log("Botão de download encontrado, iniciando download...");
            // Espera um momento para garantir que o site carregou completamente
            setTimeout(() => {
                downloadBtn.click();
            }, 1500);
        } else {
            console.log("Botão de download não encontrado, tentando método alternativo...");
            
            // Método alternativo - tentar obter o PDF diretamente via API
            const docId = getDocumentId();
            if (docId) {
                // Criando um link invisível para download direto
                const directLink = document.createElement('a');
                directLink.href = `https://doceru.com/pdf/${docId}`;
                directLink.setAttribute('download', '');
                directLink.style.display = 'none';
                document.body.appendChild(directLink);
                directLink.click();
                document.body.removeChild(directLink);
                console.log("Tentativa de download direto iniciada");
            }
        }
    }
    
    // Executar as funções após um curto intervalo para garantir que a página carregou
    setTimeout(() => {
        removeAds();
        initiateDownload();
    }, 2000);
    
    // Adicionar um botão visível para download manual caso o automático falhe
    function addManualDownloadButton() {
        const docId = getDocumentId();
        if (!docId) return;
        
        const manualBtn = document.createElement('button');
        manualBtn.textContent = "Download PDF Manual";
        manualBtn.style.cssText = "position: fixed; top: 10px; right: 10px; z-index: 9999; background: #5D5CDE; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;";
        
        manualBtn.addEventListener('click', function() {
            window.location.href = `https://doceru.com/pdf/${docId}`;
        });
        
        document.body.appendChild(manualBtn);
    }
    
    // Adicionar botão manual após 3 segundos
    setTimeout(addManualDownloadButton, 3000);
})();