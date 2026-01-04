// ==UserScript==
// @name         Auto Carregar Matérias - Globo.com
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Carrega automaticamente todo o conteúdo das matérias clicando em "Continuar lendo"
// @author       Você
// @match        *://*.globo.com/*
// @match        *://*.extra.globo.com/*
// @match        *://*.g1.globo.com/*
// @match        *://*.oglobo.globo.com/*
// @grant        none
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/543781/Auto%20Carregar%20Mat%C3%A9rias%20-%20Globocom.user.js
// @updateURL https://update.greasyfork.org/scripts/543781/Auto%20Carregar%20Mat%C3%A9rias%20-%20Globocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações
    const config = {
        autoStart: true,        // Iniciar automaticamente
        clickDelay: 800,        // Delay após clicar (ms)
        checkInterval: 300,     // Intervalo para verificar o botão (ms)
        maxAttempts: 5,         // Máximo de tentativas
        showProgress: true,     // Mostrar indicador de progresso
        scrollAfterClick: true, // Rolar após clicar
        removePaywall: true     // Tentar remover paywall
    };

    let attempts = 0;
    let isRunning = false;
    let progressDiv = null;
    let observer = null;

    // Seletores específicos do Globo.com baseados no HTML analisado
    const selectors = {
        // Seletores principais do botão "Continuar lendo"
        continueButton: [
            '#mc-read-more-btn',
            '.mc-read-more-btn',
            'button[class*="read-more"]',
            'button[id*="read-more"]'
        ],
        
        // Container do artigo
        articleContainer: [
            '#mc-article-body',
            '.mc-article-body',
            '.mrf-article-body'
        ],
        
        // Wrapper do botão
        buttonWrapper: [
            '#mc-read-more-wrapper',
            '.mc-read-more-wrapper'
        ],
        
        // Conteúdo protegido/cortado
        protectedContent: [
            '.wall.protected-content',
            '.cropped-block',
            '.paywall'
        ]
    };

    // Criar indicador de progresso
    function createProgressIndicator() {
        if (progressDiv) return;

        progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,123,255,0.3);
            max-width: 280px;
            line-height: 1.4;
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(progressDiv);

        // Adicionar estilo de animação
        if (!document.querySelector('#globo-auto-loader-styles')) {
            const style = document.createElement('style');
            style.id = 'globo-auto-loader-styles';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .globo-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Atualizar indicador de progresso
    function updateProgress(message, type = 'loading') {
        if (!config.showProgress) return;
        
        if (!progressDiv) createProgressIndicator();
        
        let icon = '';
        let bgColor = '#007bff';
        
        switch(type) {
            case 'loading':
                icon = '<div class="globo-spinner"></div>';
                bgColor = '#007bff';
                break;
            case 'success':
                icon = '✅';
                bgColor = '#28a745';
                break;
            case 'warning':
                icon = '⚠️';
                bgColor = '#ffc107';
                break;
            case 'error':
                icon = '❌';
                bgColor = '#dc3545';
                break;
        }
        
        progressDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div>${icon}</div>
                <div>${message}</div>
            </div>
        `;
        
        progressDiv.style.background = `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`;
    }

    // Remover indicador de progresso
    function removeProgress(delay = 3000) {
        if (progressDiv) {
            setTimeout(() => {
                if (progressDiv && progressDiv.parentNode) {
                    progressDiv.style.opacity = '0';
                    progressDiv.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        if (progressDiv && progressDiv.parentNode) {
                            progressDiv.parentNode.removeChild(progressDiv);
                            progressDiv = null;
                        }
                    }, 300);
                }
            }, delay);
        }
    }

    // Encontrar elemento por múltiplos seletores
    function findElement(selectorArray) {
        for (const selector of selectorArray) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }
        return null;
    }

    // Verificar se elemento está visível
    function isElementVisible(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        return (
            rect.width > 0 && 
            rect.height > 0 && 
            style.display !== 'none' && 
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            !element.hasAttribute('disabled')
        );
    }

    // Rolar suavemente até o elemento
    function scrollToElement(element, offset = -100) {
        if (!element) return;
        
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = elementTop + offset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Remover paywall/conteúdo protegido
    function removePaywallElements() {
        if (!config.removePaywall) return;
        
        // Remover elementos de paywall
        const paywallElements = document.querySelectorAll('.paywall, .wall, .subscription-required');
        paywallElements.forEach(el => {
            el.style.display = 'none';
        });

        // Remover classe 'cropped' do artigo
        const article = findElement(selectors.articleContainer);
        if (article) {
            article.classList.remove('cropped');
        }

        // Mostrar conteúdo protegido
        const protectedContent = document.querySelectorAll('.protected-content, .cropped-block');
        protectedContent.forEach(el => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
        });
    }

    // Função principal para carregar conteúdo
    function loadMoreContent() {
        if (isRunning) return;
        
        isRunning = true;
        attempts++;

        updateProgress(`Procurando mais conteúdo... (${attempts}/${config.maxAttempts})`, 'loading');

        // Procurar pelo botão "Continuar lendo"
        const continueButton = findElement(selectors.continueButton);
        
        if (continueButton) {
            updateProgress(`Carregando conteúdo... (${attempts}/${config.maxAttempts})`, 'loading');
            
            // Rolar até o botão se configurado
            if (config.scrollAfterClick) {
                scrollToElement(continueButton, -50);
            }

            // Simular clique no botão
            setTimeout(() => {
                try {
                    // Tentar vários métodos de clique
                    continueButton.click();
                    
                    // Backup: dispatch event
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    continueButton.dispatchEvent(clickEvent);
                    
                    // Remover elementos de paywall
                    setTimeout(() => {
                        removePaywallElements();
                    }, 100);
                    
                    console.log('🔄 Globo Auto-Loader: Botão clicado, conteúdo carregado');
                    
                } catch (error) {
                    console.error('Erro ao clicar no botão:', error);
                }
                
                // Aguardar e tentar novamente
                setTimeout(() => {
                    isRunning = false;
                    
                    if (attempts < config.maxAttempts) {
                        loadMoreContent();
                    } else {
                        updateProgress('Todo o conteúdo foi carregado!', 'success');
                        removeProgress();
                        console.log('✅ Globo Auto-Loader: Processo finalizado');
                    }
                }, config.clickDelay);
                
            }, 200);
            
        } else {
            // Não encontrou botão
            if (attempts < config.maxAttempts) {
                setTimeout(() => {
                    isRunning = false;
                    loadMoreContent();
                }, config.checkInterval);
            } else {
                updateProgress('Conteúdo totalmente carregado!', 'success');
                removeProgress();
                isRunning = false;
                console.log('✅ Globo Auto-Loader: Nenhum botão encontrado, conteúdo completo');
            }
        }
    }

    // Resetar e tentar novamente
    function resetAndRetry() {
        attempts = 0;
        isRunning = false;
        if (observer) {
            observer.disconnect();
        }
        startAutoLoader();
    }

    // Criar botão de controle manual
    function createControlButton() {
        const controlBtn = document.createElement('button');
        controlBtn.innerHTML = '📖 Auto-Load';
        controlBtn.title = 'Clique para recarregar automaticamente o conteúdo da matéria';
        controlBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 999998;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,123,255,0.4);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
        `;

        controlBtn.addEventListener('mouseenter', () => {
            controlBtn.style.transform = 'scale(1.05) translateY(-2px)';
            controlBtn.style.boxShadow = '0 6px 20px rgba(0,123,255,0.5)';
        });

        controlBtn.addEventListener('mouseleave', () => {
            controlBtn.style.transform = 'scale(1) translateY(0)';
            controlBtn.style.boxShadow = '0 4px 15px rgba(0,123,255,0.4)';
        });

        controlBtn.addEventListener('click', () => {
            controlBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                controlBtn.style.transform = 'scale(1)';
                resetAndRetry();
            }, 150);
        });
        
        document.body.appendChild(controlBtn);
    }

    // Observar mudanças na página
    function createPageObserver() {
        observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Verificar se foi adicionado novo conteúdo
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && (
                                node.matches('.cropped-block') ||
                                node.matches('.mc-read-more-wrapper') ||
                                node.matches('[class*="content"]')
                            )) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
            });
            
            if (shouldCheck && !isRunning) {
                setTimeout(() => {
                    if (!isRunning) {
                        loadMoreContent();
                    }
                }, 500);
            }
        });

        // Observar mudanças no corpo da página
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Verificar se é uma página de artigo
    function isArticlePage() {
        return (
            findElement(selectors.articleContainer) !== null ||
            document.querySelector('article') !== null ||
            window.location.pathname.includes('/noticia/') ||
            window.location.pathname.includes('/materia/')
        );
    }

    // Iniciar o auto-loader
    function startAutoLoader() {
        if (!isArticlePage()) {
            console.log('🔍 Globo Auto-Loader: Não é uma página de artigo');
            return;
        }

        console.log('🚀 Globo Auto-Loader: Script iniciado');
        
        createPageObserver();
        
        if (config.autoStart) {
            // Aguardar um pouco para a página carregar completamente
            setTimeout(() => {
                loadMoreContent();
            }, 1000);
        }
    }

    // Inicialização principal
    function init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(startAutoLoader, 500);
            });
        } else {
            setTimeout(startAutoLoader, 500);
        }

        // Adicionar botão de controle
        setTimeout(createControlButton, 1500);

        // Adicionar atalhos de teclado
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + L para recarregar
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                resetAndRetry();
            }
        });

        console.log('📖 Globo Auto-Loader v2.0 carregado! Use Ctrl+Shift+L para recarregar manualmente.');
    }

    // Iniciar script
    init();

})();