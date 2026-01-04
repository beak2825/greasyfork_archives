// ==UserScript==
// @name         Doceru Premium Ilimitado
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Torna o acesso premium ilimitado e remove restrições de download no Doceru
// @author       Script Generator
// @match        https://doceru.com/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536548/Doceru%20Premium%20Ilimitado.user.js
// @updateURL https://update.greasyfork.org/scripts/536548/Doceru%20Premium%20Ilimitado.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Função para aguardar elementos carregarem no DOM
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elemento ${selector} não encontrado no tempo limite`));
            }, timeout);
        });
    }
    
    // Tornar o acesso premium ilimitado (interrompe o contador)
    function setUnlimitedAccess() {
        // Intercepta e substitui os métodos de timer para impedir atualizações do contador
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        const originalClearTimeout = window.clearTimeout;
        const originalClearInterval = window.clearInterval;
        
        // Lista para armazenar os IDs de todos os timers
        const timerIds = [];
        
        // Substitui setTimeout
        window.setTimeout = function(callback, delay, ...args) {
            // Se a função estiver relacionada ao contador, não a execute
            if (callback.toString().includes('getting-started')) {
                console.log("Bloqueando setTimeout relacionado ao contador");
                return -1;
            }
            
            // Caso contrário, execute normalmente
            const id = originalSetTimeout(callback, delay, ...args);
            timerIds.push(id);
            return id;
        };
        
        // Substitui setInterval
        window.setInterval = function(callback, delay, ...args) {
            // Se a função estiver relacionada ao contador, não a execute
            if (callback.toString().includes('getting-started')) {
                console.log("Bloqueando setInterval relacionado ao contador");
                return -1;
            }
            
            // Caso contrário, execute normalmente
            const id = originalSetInterval(callback, delay, ...args);
            timerIds.push(id);
            return id;
        };
        
        // Substitui clearTimeout e clearInterval para manter rastreamento
        window.clearTimeout = function(id) {
            const index = timerIds.indexOf(id);
            if (index > -1) {
                timerIds.splice(index, 1);
            }
            return originalClearTimeout(id);
        };
        
        window.clearInterval = function(id) {
            const index = timerIds.indexOf(id);
            if (index > -1) {
                timerIds.splice(index, 1);
            }
            return originalClearInterval(id);
        };
        
        // Limpa qualquer timer existente
        for (let i = 0; i < 10000; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
        }
        
        // Agora modifica o elemento do contador e mantém monitoramento
        waitForElement('#getting-started').then(element => {
            // Substitui o texto por "∞" (símbolo de infinito)
            element.textContent = "∞";
            
            // Impede que qualquer script original altere o valor
            Object.defineProperty(element, 'textContent', {
                get: function() { return "∞"; },
                set: function() { /* Não faz nada para impedir alterações */ }
            });
            
            // Monitora continuamente o elemento para garantir que o valor permaneça
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        element.textContent = "∞";
                    }
                });
            });
            
            observer.observe(element, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            console.log("Acesso premium definido como ilimitado!");
        }).catch(err => {
            console.error("Erro ao definir acesso premium ilimitado:", err);
        });
    }
    
    // Remover restrições de download
    function enableUnlimitedDownload() {
        // Intercepta o comportamento nativo de janelas de diálogo
        window.alert = function() { return true; };
        window.confirm = function() { return true; };
        window.prompt = function() { return true; };
        
        // Bloqueia proativamente código que possa mostrar popups de pagamento
        // Injetar CSS para ocultar qualquer modal de pagamento
        const style = document.createElement('style');
        style.textContent = `
            #payment_show, 
            stripe-buy-button,
            .payment-modal, 
            .payment-alert, 
            .payment-container, 
            .payment-overlay, 
            .payment-popup, 
            div[id*="payment"], 
            div[class*="payment"],
            iframe[src*="stripe"],
            .modal-backdrop,
            .smart-alert.alert-warning,
            [id^="stripe"],
            [class^="stripe"],
            .btnn-large[onclick*="window.location"],
            .smart-alert {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -9999 !important;
                height: 0 !important;
                width: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
            }
            
            body:has(stripe-buy-button) .modal-backdrop {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove quaisquer scripts relacionados a pagamento
        document.querySelectorAll('script').forEach(script => {
            if (script.src && (
                script.src.includes('payment') || 
                script.src.includes('stripe') || 
                script.src.includes('checkout') ||
                script.src.includes('pay'))) {
                script.remove();
                console.log("Removido script relacionado a pagamento:", script.src);
            }
        });
        
        // Desativa verificações de tamanho de arquivo
        function disableSizeCheck() {
            // Sobrescreve funções que poderiam verificar o tamanho
            if (window.jQuery) {
                // Sobrescreve qualquer função jQuery relacionada a download
                const jQueryFunctions = ['ajax', 'get', 'post'];
                jQueryFunctions.forEach(funcName => {
                    if (jQuery[funcName]) {
                        const original = jQuery[funcName];
                        jQuery[funcName] = function(url, data, callback, type) {
                            // Se a URL contiver algo relacionado a verificação de tamanho/pagamento
                            if (typeof url === 'string' && (
                                url.includes('download') || 
                                url.includes('payment') || 
                                url.includes('check') || 
                                url.includes('verify') ||
                                url.includes('size')
                            )) {
                                console.log(`Interceptada chamada jQuery.${funcName} para: ${url}`);
                                
                                // Se for uma verificação, retorne resultado bem-sucedido
                                if (callback) {
                                    setTimeout(() => callback({success: true, status: 'ok', size: 0}), 10);
                                }
                                
                                // Não prossegue com a chamada real
                                return jQuery.Deferred().resolve({success: true, status: 'ok', size: 0}).promise();
                            }
                            
                            // Caso contrário, comportamento normal
                            return original.apply(this, arguments);
                        };
                    }
                });
            }
            
            // Intercepta XMLHttpRequest para bloquear verificações
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                // Se for uma URL de verificação relacionada a download/tamanho
                if (typeof url === 'string' && (
                    url.includes('download') || 
                    url.includes('payment') || 
                    url.includes('check') || 
                    url.includes('verify') ||
                    url.includes('size')
                )) {
                    console.log(`Interceptada XHR para: ${url}`);
                    // Define URL para uma inexistente para evitar verificação
                    arguments[1] = 'https://doceru.com/bypass-check';
                }
                
                // Continua com o comportamento normal
                return originalXHROpen.apply(this, arguments);
            };
            
            // Intercepta Fetch API
            const originalFetch = window.fetch;
            window.fetch = function(resource, options) {
                if (typeof resource === 'string' && (
                    resource.includes('download') || 
                    resource.includes('payment') || 
                    resource.includes('check') || 
                    resource.includes('verify') ||
                    resource.includes('size')
                )) {
                    console.log(`Interceptada fetch para: ${resource}`);
                    // Retorna uma promessa resolvida com uma resposta falsa bem-sucedida
                    return Promise.resolve(new Response(JSON.stringify({
                        success: true,
                        status: 'ok',
                        size: 0,
                        allow: true
                    }), { 
                        status: 200, 
                        headers: {'Content-Type': 'application/json'} 
                    }));
                }
                
                // Comportamento normal para outras requisições
                return originalFetch.apply(this, arguments);
            };
            
            // Desativa verificações baseadas em variáveis globais de tamanho
            try {
                // Busca variáveis que possam conter tamanho do arquivo
                const globals = Object.keys(window);
                globals.forEach(key => {
                    if (typeof window[key] === 'number' && (
                        key.toLowerCase().includes('size') || 
                        key.toLowerCase().includes('limit') || 
                        key.toLowerCase().includes('max')
                    )) {
                        // Define como valor pequeno para passar nas verificações
                        console.log(`Redefinido ${key} de ${window[key]} para 0`);
                        window[key] = 0;
                    }
                });
            } catch (e) {
                console.error("Erro ao modificar variáveis de tamanho:", e);
            }
        }
        
        // Observa quaisquer mudanças no DOM para remover elementos de pagamento
        const paymentObserver = new MutationObserver(mutations => {
            let removedPayment = false;
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // Verifica se é um elemento DOM
                        if (node.nodeType === 1) {
                            // Verifica vários atributos para determinar se é um elemento de pagamento
                            const id = node.id ? node.id.toLowerCase() : '';
                            const className = node.className ? node.className.toString().toLowerCase() : '';
                            const innerHTML = node.innerHTML ? node.innerHTML.toLowerCase() : '';
                            const nodeStr = node.outerHTML ? node.outerHTML.toLowerCase() : '';
                            
                            const paymentTerms = [
                                'payment', 'pay', 'stripe', 'checkout', 'premium', 
                                'pagamento', 'pague', 'comprar', 'compra', 'crédito',
                                'cartão', 'preço', 'acesso', 'smart-alert', 'mb exige',
                                'taxas', 'transferência', 'custos'
                            ];
                            
                            // Verifica se algum dos termos de pagamento está presente
                            const isPaymentElement = paymentTerms.some(term => 
                                id.includes(term) || 
                                className.includes(term) || 
                                innerHTML.includes(term) ||
                                nodeStr.includes(term)
                            );
                            
                            if (isPaymentElement || node.tagName === 'STRIPE-BUY-BUTTON') {
                                node.style.display = 'none';
                                node.style.visibility = 'hidden';
                                node.style.height = '0';
                                node.style.width = '0';
                                node.style.overflow = 'hidden';
                                node.style.position = 'absolute';
                                node.style.top = '-9999px';
                                node.style.left = '-9999px';
                                node.remove(); // Remove completamente do DOM
                                console.log("Removido elemento de pagamento detectado:", node.tagName || 'Unknown element');
                                removedPayment = true;
                            }
                            
                            // Também remove qualquer backdrop ou overlay
                            if (className.includes('backdrop') || className.includes('overlay') || id.includes('backdrop') || id.includes('overlay')) {
                                node.style.display = 'none';
                                node.style.visibility = 'hidden';
                                node.remove();
                                console.log("Removido backdrop/overlay:", node.tagName || 'Unknown element');
                            }
                        }
                    });
                }
            });
            
            // Se removemos um elemento de pagamento, verificamos se o botão de download ainda está funcionando
            if (removedPayment) {
                const downloadBtn = document.querySelector('#dwn_btn');
                if (downloadBtn) {
                    setupDownloadButton(downloadBtn);
                }
            }
        });
        
        paymentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Manipulação específica dos botões de download usando método alternativo
        function setupDownloadButton(button) {
            // Primeiro, desativa completamente o comportamento original
            button.onclick = null;
            const buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            button = buttonClone;
            
            // Limpa todos os atributos de dados que possam ser usados para verificações
            button.setAttribute('data-login_alert', '0');
            button.setAttribute('data-info', '');
            
            // Extrai o ID do documento
            const docId = button.getAttribute('data-id');
            if (!docId) {
                console.error("ID do documento não encontrado no botão de download");
                return;
            }
            
            // Estiliza o botão para indicar que está usando nosso método alternativo
            button.style.background = '#5D5CDE';
            button.style.color = 'white';
            button.style.fontWeight = 'bold';
            
            // Cria uma função que usará um método alternativo para download
            const downloadWithFetch = async function() {
                try {
                    // Mostra feedback visual
                    const originalText = button.innerHTML;
                    button.innerHTML = '⬇️ Iniciando download...';
                    
                    // Tenta fazer o download usando o método fetch (contorna verificações)
                    const downloadUrl = `https://doceru.com/pdf/${docId}.pdf`;
                    console.log("Tentando download direto via fetch:", downloadUrl);
                    
                    // Primeiro método - usando fetch diretamente para baixar o conteúdo binário
                    const response = await fetch(downloadUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/pdf',
                            'Cache-Control': 'no-cache',
                            // Adiciona headers para fazer parecer uma navegação normal
                            'Referer': window.location.href,
                            'User-Agent': navigator.userAgent
                        },
                        // Importante: usar credentials para enviar cookies de autenticação
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    // Converte a resposta para blob
                    const blob = await response.blob();
                    
                    // Cria URL para o blob
                    const blobUrl = window.URL.createObjectURL(blob);
                    
                    // Cria um link para download e clica nele
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = `${docId}.pdf`;
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink);
                    
                    // Dispara o clique
                    downloadLink.click();
                    
                    // Limpa após o download
                    setTimeout(() => {
                        window.URL.revokeObjectURL(blobUrl);
                        document.body.removeChild(downloadLink);
                        button.innerHTML = originalText;
                    }, 2000);
                    
                    console.log("Download via fetch completado com sucesso!");
                } catch (error) {
                    console.error("Erro no download via fetch:", error);
                    
                    // Se fetch falhou, tenta método alternativo usando iframe
                    try {
                        console.log("Tentando método alternativo via iframe...");
                        button.innerHTML = '⬇️ Tentando método alternativo...';
                        
                        // Cria um iframe para carregar o PDF diretamente
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = `https://doceru.com/pdf/${docId}.pdf`;
                        
                        // Adiciona o iframe ao documento
                        document.body.appendChild(iframe);
                        
                        // Aviso para usar a função de download do navegador
                        setTimeout(() => {
                            button.innerHTML = ' Baixe o arquivo *.pdf';
                            alert("O PDF está sendo carregado em segundo plano. Use a função 'Salvar como' do seu navegador quando ele aparecer.");
                        }, 3000);
                        
                        // Opcionalmente, tenta uma terceira abordagem usando window.open
                        window.open(`https://doceru.com/pdf/${docId}.pdf`, '_blank');
                    } catch (secondError) {
                        console.error("Também falhou o método alternativo:", secondError);
                        button.innerHTML = ' Baixe o arquivo *.pdf';
                        alert("Não foi possível iniciar o download automaticamente. Tente usar a URL direta: https://doceru.com/pdf/" + docId + ".pdf");
                    }
                }
            };
            
            // Adiciona o evento de clique personalizado para nosso método alternativo
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Executa nosso método alternativo
                downloadWithFetch();
            });
            
            console.log("Botão de download configurado com método alternativo!");
        }
        
        // Remover controles de tamanho de arquivo
        disableSizeCheck();
        
        // Configura botões de download atuais
        document.querySelectorAll('#dwn_btn').forEach(button => {
            setupDownloadButton(button);
        });
        
        // Observe também a criação futura de botões de download
        waitForElement('#dwn_btn').then(button => {
            setupDownloadButton(button);
        }).catch(err => {
            console.error("Erro ao encontrar botão de download:", err);
        });
        
        // Remove ou oculta todos os elementos de pagamento conhecidos
        const paymentSelectors = [
            '#payment_show',
            '.stripe-buy-button',
            'stripe-buy-button',
            '[id*="payment"]',
            '[class*="payment"]',
            '[id*="stripe"]',
            '[class*="stripe"]',
            '.smart-alert',
            '.smart-alert.alert-warning',
            '.modal-backdrop',
            '.modal.fade'
        ];
        
        paymentSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    try {
                        el.remove(); // Tenta remover completamente
                    } catch (e) {
                        console.log(`Não foi possível remover ${selector}, apenas ocultando`);
                    }
                    console.log(`Ocultado elemento de pagamento: ${selector}`);
                });
            } catch (e) {
                console.error(`Erro ao ocultar ${selector}:`, e);
            }
        });
        
        // Monitora a adição do elemento stripe-buy-button específico
        const stripeObserver = new MutationObserver(mutations => {
            const stripeButtons = document.querySelectorAll('stripe-buy-button');
            if (stripeButtons.length > 0) {
                console.log("Detectado botão Stripe, removendo...");
                stripeButtons.forEach(button => {
                    button.remove();
                });
                
                // Também remove qualquer backdrop
                document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
                    backdrop.remove();
                });
            }
        });
        
        stripeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Detecta e desativa o script countdown.js específico do site
    function disableCountdownScript() {
        // Procura por scripts relacionados ao contador
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && (script.src.includes('countdown') || script.src.includes('timer'))) {
                console.log("Encontrado script de contador:", script.src);
                // Remove o script
                script.remove();
            }
        });
        
        // Verifica se há objetos globais do countdown e tenta desativá-los
        if (window.countdown || window.timer || window.counter) {
            console.log("Tentando desativar objeto countdown global");
            try {
                if (window.countdown) window.countdown = function() { return false; };
                if (window.timer) window.timer = function() { return false; };
                if (window.counter) window.counter = function() { return false; };
            } catch(e) {
                console.error("Erro ao substituir objeto countdown:", e);
            }
        }
        
        // Tenta encontrar e modificar a função específica do contador
        waitForElement('#getting-started').then(element => {
            // Define um valor alto para qualquer variável de tempo que possa existir
            try {
                // Tenta encontrar variáveis de tempo no escopo global
                const globals = Object.keys(window);
                globals.forEach(key => {
                    if ((typeof window[key] === 'number') && 
                        (key.toLowerCase().includes('time') || 
                         key.toLowerCase().includes('count') || 
                         key.toLowerCase().includes('remaining'))) {
                        console.log("Encontrada possível variável de tempo:", key);
                        window[key] = 9999999999; // Um valor muito alto
                    }
                });
            } catch(e) {
                console.error("Erro ao modificar variáveis de tempo:", e);
            }
        });
    }
    
    // Executa as funções quando a página estiver carregada
    window.addEventListener('load', function() {
        setTimeout(() => {
            setUnlimitedAccess();
            enableUnlimitedDownload();
            disableCountdownScript();
            
            // Nova abordagem: substitui diretamente a função jQuery countdown
            if (window.jQuery && jQuery.fn.countdown) {
                jQuery.fn.countdown = function() {
                    return this.each(function() {
                        jQuery(this).text("∞");
                    });
                };
                console.log("Função jQuery countdown substituída");
            }
            
            // Verifica especificamente o script countdown.js do site
            const countdownScript = document.querySelector('script[src*="countdown.js"]');
            if (countdownScript) {
                console.log("Removendo script countdown.js específico");
                countdownScript.remove();
            }
        }, 1000); // Pequeno atraso para garantir que os elementos estejam disponíveis
    });
    
    // Também executa imediatamente caso a página já esteja carregada
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            setUnlimitedAccess();
            enableUnlimitedDownload();
            disableCountdownScript();
        }, 1000);
    }
})();