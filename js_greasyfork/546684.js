// ==UserScript==
// @name         Painel de Atalhos Inteligente (v3.2 - Final)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Detecta a aba atual via seletores e texto, e navega de forma inteligente.
// @author       Pejota e IA Gemini
// @match        http://10.72.200.50/sede/paginas/index.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546684/Painel%20de%20Atalhos%20Inteligente%20%28v32%20-%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546684/Painel%20de%20Atalhos%20Inteligente%20%28v32%20-%20Final%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- 1. CONFIGURAÇÃO FINAL DAS ABAS ---
    // Mapeia o ID do botão de ação ao nome da aba, sua ordem, e o seletor do seu cabeçalho.
    const VIEW_CONFIG = {
        'loadNadirBtn':   { name: 'NADIR',   index: 0, headerSelector: '.nadir-header' },
        'loadObliqueBtn': { name: 'BACK',    index: 1, headerSelector: '.back-header' },
        'loadRightBtn':   { name: 'RIGHT',   index: 2, headerSelector: '.obliqua-header' },
        'loadForwardBtn': { name: 'FORWARD', index: 3, headerSelector: '.obliqua-header' },
        'loadLeftBtn':    { name: 'LEFT',    index: 4, headerSelector: '.obliqua-header' }
    };
    const VIEW_SEQUENCE = ['NADIR', 'BACK', 'RIGHT', 'FORWARD', 'LEFT'];


    // --- 2. ESTILO E HTML (SEM MUDANÇAS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #meu-painel-container { position: fixed; z-index: 9999; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); font-family: sans-serif; }
        #meu-painel-handle { padding: 10px 15px; cursor: grab; background-color: #e0e0e0; border-bottom: 1px solid #ccc; border-radius: 8px 8px 0 0; user-select: none; }
        #meu-painel-handle:active { cursor: grabbing; }
        #meu-painel-conteudo { display: flex; flex-direction: column; gap: 8px; padding: 10px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out; }
        #meu-painel-container.painel-aberto #meu-painel-conteudo { max-height: 300px; padding: 10px; }
        #meu-painel-conteudo button { cursor: pointer; padding: 8px 12px; border: 1px solid #aaa; border-radius: 5px; background-color: #fff; text-align: left; }
        #meu-painel-conteudo button:hover { background-color: #e9e9e9; }
        #meu-painel-container .status-message { padding: 5px; font-size: 0.8em; text-align: center; background-color: #fffbe6; border-top: 1px solid #ccc; display: none; }
    `;
    document.head.appendChild(style);
    const painelContainer = document.createElement('div');
    painelContainer.id = 'meu-painel-container';
    painelContainer.innerHTML = `
        <div id="meu-painel-handle">☰ Atalhos</div>
        <div id="meu-painel-conteudo">
            <button data-target-id="loadNadirBtn">1. Imagem Nadir</button>
            <button data-target-id="loadObliqueBtn">2. Imagem Oblíqua (BACK)</button>
            <button data-target-id="loadRightBtn">3. Imagem Direita (RIGHT)</button>
            <button data-target-id="loadForwardBtn">4. Imagem Frontal (FORWARD)</button>
            <button data-target-id="loadLeftBtn">5. Imagem Esquerda (LEFT)</button>
        </div>
        <div class="status-message" id="meu-painel-status"></div>
    `;
    document.body.appendChild(painelContainer);


    // --- 3. FUNÇÕES AUXILIARES ---
    const statusDisplay = document.getElementById('meu-painel-status');
    function showStatus(message) { statusDisplay.textContent = message; statusDisplay.style.display = 'block'; }
    function hideStatus() { statusDisplay.style.display = 'none'; }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // Agora temos duas funções de busca: uma para um elemento, outra para múltiplos
    async function findElementInFrames(selector) { const e=document.querySelector(selector);if(e)return e;const t=document.querySelectorAll("iframe");for(const o of t)try{const r=o.contentDocument||o.contentWindow.document,n=r.querySelector(selector);if(n)return n}catch(e){}return null}
    async function findElementsInFrames(selector) { let e=Array.from(document.querySelectorAll(selector));const t=document.querySelectorAll("iframe");for(const o of t)try{const r=o.contentDocument||o.contentWindow.document;e=e.concat(Array.from(r.querySelectorAll(selector)))}catch(e){}return e}
    async function waitForElement(selector, timeout = 7000) { return new Promise(async(e,t)=>{const o=Date.now();let r=await findElementInFrames(selector);if(r)return e(r);const n=setInterval(async()=>{r=await findElementInFrames(selector);if(r){clearInterval(n);e(r)}else if(Date.now()-o>timeout){clearInterval(n);t(new Error(`Elemento "${selector}" não encontrado`))}},200)})}

    // FUNÇÃO DE DETECÇÃO ATUALIZADA - A mais precisa de todas
    async function getCurrentView() {
        for (const config of Object.values(VIEW_CONFIG)) {
            const potentialHeaders = await findElementsInFrames(config.headerSelector);
            for (const header of potentialHeaders) {
                if (header.textContent.trim().toUpperCase() === config.name && header.offsetParent !== null) {
                    console.log('Aba atual detectada:', config.name);
                    return config.name;
                }
            }
        }
        console.error('Não foi possível detectar a aba atual.');
        return null;
    }


    // --- 4. LÓGICA PRINCIPAL (STATE MACHINE) ---
    const conteudo = document.getElementById('meu-painel-conteudo');
    let isActionRunning = false;

    conteudo.addEventListener('click', async (event) => {
        if (event.target.tagName !== 'BUTTON' || isActionRunning) return;

        isActionRunning = true;
        hideStatus();
        const targetId = event.target.getAttribute('data-target-id');
        const targetView = VIEW_CONFIG[targetId];

        try {
            showStatus('Detectando aba atual...');
            const currentViewName = await getCurrentView();
            if (!currentViewName) {
                throw new Error("Não foi possível identificar a aba atual. Verifique a configuração do script.");
            }
            const currentIndex = VIEW_SEQUENCE.indexOf(currentViewName);
            const targetIndex = targetView.index;
            const diff = targetIndex - currentIndex;

            if (diff !== 0) {
                const clicksNeeded = Math.abs(diff);
                const buttonSelector = diff > 0 ? 'button[onclick="carregarProximo()"]' : 'button[onclick="carregarAnterior()"]';
                const direction = diff > 0 ? 'Próximo' : 'Anterior';
                for (let i = 0; i < clicksNeeded; i++) {
                    showStatus(`Passo ${i + 1}/${clicksNeeded}: Clicando em "${direction}"`);
                    const navButton = await waitForElement(buttonSelector);
                    navButton.click();
                    await sleep(500);
                }
            }

            showStatus(`Na aba ${targetView.name}. Aguardando para carregar...`);
            await sleep(1000);

            showStatus(`Carregando imagem de ${targetView.name}...`);
            const finalButton = await waitForElement(`#${targetId}`);
            finalButton.click();
            showStatus('Ação concluída com sucesso!');
        } catch (error) {
            console.error(error);
            alert(`Ocorreu um erro: ${error.message}`);
            hideStatus();
        } finally {
            isActionRunning = false;
        }
    });

    // --- LÓGICA DE UI DO PAINEL (Arrastar, salvar, etc) ---
    const handle = document.getElementById('meu-painel-handle');
    handle.addEventListener('click', (e) => { if (painelContainer.wasDragged) { painelContainer.wasDragged = false; return; } painelContainer.classList.toggle('painel-aberto'); });
    let offsetX, offsetY, isDragging = false; handle.addEventListener('mousedown', (e) => { isDragging = true; painelContainer.wasDragged = false; offsetX = e.clientX - painelContainer.getBoundingClientRect().left; offsetY = e.clientY - painelContainer.getBoundingClientRect().top; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); }); function onMouseMove(e) { if (!isDragging) return; painelContainer.wasDragged = true; let newX = e.clientX - offsetX; let newY = e.clientY - offsetY; const w = window.innerWidth, h = window.innerHeight, pW = painelContainer.offsetWidth, pH = painelContainer.offsetHeight; newX = Math.max(0, Math.min(newX, w - pW)); newY = Math.max(0, Math.min(newY, h - pH)); painelContainer.style.left = `${newX}px`; painelContainer.style.top = `${newY}px`; } async function onMouseUp() { if (isDragging) { isDragging = false; await GM_setValue('painelPosX', painelContainer.style.left); await GM_setValue('painelPosY', painelContainer.style.top); document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); } } const savedX = await GM_getValue('painelPosX', '20px'); const savedY = await GM_getValue('painelPosY', '20px'); painelContainer.style.right = ''; painelContainer.style.bottom = ''; painelContainer.style.left = savedX; painelContainer.style.top = savedY;
})();