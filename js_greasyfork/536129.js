// ==UserScript==
// @name         Doceru Premium Ilimitado1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Torna o acesso premium ilimitado e remove restrições de download no Doceru
// @author       Script Generator
// @match        https://doceru.com/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536129/Doceru%20Premium%20Ilimitado1.user.js
// @updateURL https://update.greasyfork.org/scripts/536129/Doceru%20Premium%20Ilimitado1.meta.js
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
        // Observa o botão de download
        waitForElement('#dwn_btn').then(button => {
            // Remove quaisquer listeners de evento existentes
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Adiciona novo listener de evento
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Extrai o ID do documento do botão
                const docId = newButton.getAttribute('data-id');
                if (!docId) {
                    console.error("ID do documento não encontrado");
                    return;
                }
                
                // Constrói a URL de download direta
                const downloadUrl = `https://doceru.com/pdf/${docId}.pdf`;
                
                // Cria um elemento  temporário para iniciar o download
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.setAttribute('download', `${docId}.pdf`);
                tempLink.setAttribute('target', '_blank');
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                
                // Clica no link para iniciar o download
                tempLink.click();
                
                // Remove o link temporário
                setTimeout(() => {
                    document.body.removeChild(tempLink);
                }, 100);
                
                console.log("Download iniciado para:", docId);
            });
            
            console.log("Download sem restrições ativado!");
        }).catch(err => {
            console.error("Erro ao ativar download sem restrições:", err);
        });
        
        // Oculta o aviso de pagamento
        waitForElement('#payment_show').then(element => {
            element.style.display = 'none';
            console.log("Aviso de pagamento ocultado!");
        }).catch(err => {
            console.error("Erro ao ocultar aviso de pagamento:", err);
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