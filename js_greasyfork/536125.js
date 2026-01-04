// ==UserScript==
// @name         Doceru Premium Ilimitado
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Torna o acesso premium ilimitado e remove restrições de download no Doceru
// @author       Script Generator
// @match        https://doceru.com/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536125/Doceru%20Premium%20Ilimitado.user.js
// @updateURL https://update.greasyfork.org/scripts/536125/Doceru%20Premium%20Ilimitado.meta.js
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
    
    // Tornar o acesso premium ilimitado (modifica o contador)
    function setUnlimitedAccess() {
        // Observa o elemento do contador
        waitForElement('#getting-started').then(element => {
            // Substitui o texto por "∞" (símbolo de infinito)
            element.textContent = "∞";
            
            // Impede que qualquer script original altere o valor
            Object.defineProperty(element, 'textContent', {
                get: function() { return "∞"; },
                set: function() { /* Não faz nada para impedir alterações */ }
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
    
    // Executa as funções quando a página estiver carregada
    window.addEventListener('load', function() {
        setTimeout(() => {
            setUnlimitedAccess();
            enableUnlimitedDownload();
        }, 1000); // Pequeno atraso para garantir que os elementos estejam disponíveis
    });
    
    // Também executa imediatamente caso a página já esteja carregada
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            setUnlimitedAccess();
            enableUnlimitedDownload();
        }, 1000);
    }
})();