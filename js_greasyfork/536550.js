// ==UserScript==
// @name         Doceru Document Downloader
// @namespace    https://doceru.com/
// @version      1.0
// @description  Remove anúncios e permite download direto de documentos no Doceru.com
// @author       App-Creator
// @match        https://doceru.com/doc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536550/Doceru%20Document%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536550/Doceru%20Document%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações e variáveis
    const DEBUG = false;
    let documentId = window.location.pathname.split('/').pop();

    // Função de log para depuração
    function log(message) {
        if (DEBUG) {
            console.log(`[Doceru Helper] ${message}`);
        }
    }

    // Remover anúncios
    function removeAds() {
        const adSelectors = [
            '.ad-750', '.ad-300', '.ad-1', '.ad-2', 
            '.spolecznoscinet', '.frame_shadow', '#v108459',
            '[id^="doublebillboard"]', '[id^="square"]'
        ];
        
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                log(`Removido anúncio: ${selector}`);
            });
        });
    }

    // Ativar o botão de download sem restrições
    function enableDirectDownload() {
        const downloadBtn = document.getElementById('dwn_btn');
        if (!downloadBtn) {
            log('Botão de download não encontrado');
            return;
        }

        // Remover atributos que possam restringir o download
        downloadBtn.removeAttribute('data-login_alert');
        downloadBtn.removeAttribute('data-info');
        
        // Obter informações do documento
        const documentTitle = document.querySelector('h1').textContent || documentId;
        const fileExtension = document.querySelector('.extension').textContent.trim() || 'pdf';
        
        // Substituir o evento de clique do botão
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const downloadUrl = `https://doceru.com/download/${documentId}`;
            log(`Iniciando download de: ${downloadUrl}`);
            
            // Método 1: Download direto (funciona na maioria dos navegadores)
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.setAttribute('download', `${documentTitle}.${fileExtension}`);
            downloadLink.setAttribute('target', '_blank');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Método 2: Usar GM_download para Tampermonkey (fallback)
            if (typeof GM_download !== 'undefined') {
                GM_download({
                    url: downloadUrl,
                    name: `${documentTitle}.${fileExtension}`,
                    onload: () => log('Download concluído via GM_download'),
                    onerror: (error) => log(`Erro no download via GM_download: ${error}`)
                });
            }
            
            return false;
        }, true);
        
        // Atualizar estilo do botão para indicar que está pronto
        downloadBtn.style.backgroundColor = '#4CAF50';
        downloadBtn.style.color = 'white';
        downloadBtn.innerHTML = '<i class="icon icon_download"></i> Download Direto';
        
        log('Download direto ativado');
    }

    // Remover limitações de captcha
    function bypassCaptcha() {
        const captchaElements = [
            '#recap-show', '#show-cap-div', '#download-cap-div'
        ];
        
        captchaElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                log(`Removido elemento captcha: ${selector}`);
            }
        });
    }

    // Melhorar a interface
    function enhanceUI() {
        // Remover modal de pagamento
        const paymentShow = document.getElementById('payment_show');
        if (paymentShow) {
            paymentShow.style.display = 'none';
            log('Modal de pagamento removido');
        }
        
        // Expandir descrição completa
        const descriptionText = document.getElementById('description-text');
        if (descriptionText) {
            descriptionText.style.maxHeight = 'none';
            log('Descrição expandida');
        }
        
        // Remover botão "mostrar mais"
        const showMoreBtn = document.getElementById('show-more');
        if (showMoreBtn) {
            showMoreBtn.style.display = 'none';
            log('Botão "mostrar mais" removido');
        }
        
        // Adicionar barra de informações
        const infoBar = document.createElement('div');
        infoBar.style.backgroundColor = '#4CAF50';
        infoBar.style.color = 'white';
        infoBar.style.padding = '10px';
        infoBar.style.textAlign = 'center';
        infoBar.style.marginBottom = '15px';
        infoBar.style.borderRadius = '4px';
        infoBar.innerHTML = 'Doceru Helper está ativo - Downloads diretos habilitados';
        
        const headerFileBox = document.querySelector('.header-file-box');
        if (headerFileBox) {
            headerFileBox.parentNode.insertBefore(infoBar, headerFileBox);
            log('Barra de informações adicionada');
        }
    }

    // Inicializar o script
    function init() {
        log('Script iniciado para documento: ' + documentId);
        
        // Executar as funções principais
        removeAds();
        bypassCaptcha();
        enhanceUI();
        enableDirectDownload();
        
        log('Inicialização completa');
    }

    // Executar após pequeno atraso para garantir que a página foi carregada
    setTimeout(init, 1000);
})();