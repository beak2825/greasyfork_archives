// ==UserScript==
// @name         Responde Aí - Boock
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Acesso responsável ao conteúdo educacional
// @author       EmersonxD
// @match        https://www.respondeai.com.br/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463863/Responde%20A%C3%AD%20-%20Boock.user.js
// @updateURL https://update.greasyfork.org/scripts/463863/Responde%20A%C3%AD%20-%20Boock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sistema de Consentimento Ético
    const showEthicalWarning = () => {
        if (!GM_getValue('termsAccepted', false)) {
            const message = `⚠️ AVISO ÉTICO ⚠️\n
Este script fornece acesso a conteúdo premium.\n
Por favor, considere:\n
1. Use apenas para estudo pessoal\n
2. Não compartilhe soluções completas\n
3. Apoie os criadores quando possível\n
Concorda com estes termos?`;

            if (!confirm(message)) {
                window.location.href = 'https://www.respondeai.com.br/planos';
                return false;
            }
            GM_setValue('termsAccepted', true);
        }
        return true;
    };

    // Sistema Anti-Abuso
    const abusePreventionSystem = () => {
        const usageCount = GM_getValue('usageCount', 0) + 1;
        GM_setValue('usageCount', usageCount);

        if (usageCount > 100) { // Limite de 100 usos
            GM_setValue('scriptEnabled', false);
            alert('Uso excessivo detectado! O script foi desativado.');
            window.location.reload();
            return false;
        }
        return true;
    };

    // Modo de Uso Responsável
    const responsibleUsageMode = () => {
        // Bloqueia features em datas/horários específicos
        const now = new Date();
        const blockedHours = [23, 0, 1, 2, 3, 4, 5]; // 23h às 6h
        
        if (blockedHours.includes(now.getHours())) {
            alert('Uso noturno bloqueado para saúde mental');
            window.location.href = 'https://www.respondeai.com.br';
            return false;
        }
        return true;
    };

    // Sistema de Apoio aos Criadores
    const supportCreators = () => {
        if (Math.random() < 0.2) { // 20% de chance de mostrar
            const supportMessage = document.createElement('div');
            supportMessage.innerHTML = `
                <div style="position:fixed;bottom:20px;right:20px;background:white;padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.2);z-index:9999">
                    <h3 style="margin:0 0 10px 0">Apoie os Criadores!</h3>
                    <p>Se encontrar útil, considere:</p>
                    <ul style="margin:10px 0">
                        <li>Comprar o plano premium</li>
                        <li>Compartilhar o site</li>
                        <li>Doar para projetos educacionais</li>
                    </ul>
                    <button onclick="this.parentElement.remove()" style="padding:5px 10px">Fechar</button>
                </div>
            `;
            document.body.appendChild(supportMessage);
        }
    };

    // Sistema Principal
    const main = () => {
        if (!showEthicalWarning()) return;
        if (!abusePreventionSystem()) return;
        if (!responsibleUsageMode()) return;
        
        // Seu código original aqui
        GM_addStyle(`
            .blur { filter: blur(0) !important; }
            .overlay { display: none !important; }
        `);
        
        supportCreators();
    };

    // Inicialização Segura
    if (GM_getValue('scriptEnabled', true)) {
        window.addEventListener('load', main);
    } else {
        alert('Script desativado por uso excessivo');
    }
})();