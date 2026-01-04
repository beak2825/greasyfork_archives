// ==UserScript==
// @name         Popmundo - Extrator de ID e Nome de Músicas (Anti-Logout)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Extrai IDs e nomes das músicas de forma sequencial e com pausas para evitar logout automático pelo servidor. Formata a saída como [songid=ID name="Nome da Música"].
// @author       Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/Artist/Record/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/545443/Popmundo%20-%20Extrator%20de%20ID%20e%20Nome%20de%20M%C3%BAsicas%20%28Anti-Logout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545443/Popmundo%20-%20Extrator%20de%20ID%20e%20Nome%20de%20M%C3%BAsicas%20%28Anti-Logout%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÃO ---
    // Aumente este valor (em milissegundos) se ainda estiver enfrentando logouts.
    // 300ms é um valor seguro. 1000 = 1 segundo.
    const DELAY_BETWEEN_REQUESTS_MS = 300;

    // --- CRIAÇÃO DA INTERFACE DO USUÁRIO ---
    const panel = document.createElement('div');
    panel.style.backgroundColor = '#f0f0f0';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '15px';
    panel.style.margin = '10px 0';
    panel.style.borderRadius = '5px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.color = '#333';

    const title = document.createElement('h3');
    title.textContent = 'Extrator de IDs e Nomes de Músicas';
    title.style.marginTop = '0';
    title.style.borderBottom = '1px solid #ddd';
    title.style.paddingBottom = '5px';
    panel.appendChild(title);

    const extractButton = document.createElement('button');
    extractButton.textContent = 'Extrair IDs e Nomes (Formatado)';
    extractButton.style.padding = '8px 12px';
    extractButton.style.cursor = 'pointer';
    extractButton.style.border = '1px solid #bbb';
    extractButton.style.borderRadius = '3px';
    extractButton.style.backgroundColor = '#e9e9e9';
    panel.appendChild(extractButton);

    const resultTextArea = document.createElement('textarea');
    resultTextArea.rows = 15;
    resultTextArea.style.width = '100%';
    resultTextArea.style.marginTop = '10px';
    resultTextArea.style.boxSizing = 'border-box';
    resultTextArea.readOnly = true;
    resultTextArea.placeholder = 'A saída formatada [songid=... name="..."] aparecerá aqui...';
    panel.appendChild(resultTextArea);

    const contentArea = document.getElementById('ppm-content');
    if (contentArea) {
        contentArea.prepend(panel);
    } else {
        document.body.prepend(panel);
    }

    // --- LÓGICA PRINCIPAL (MODIFICADA) ---

    // Função auxiliar para criar uma pausa (delay)
    const delay = ms => new Promise(res => setTimeout(res, ms));

    /**
     * Busca uma URL em segundo plano, extrai o ID e o NOME da música.
     * @param {string} trackPageUrl - A URL da página de detalhes da faixa.
     * @returns {Promise<{id: string, name: string}|null>} Um objeto com id e nome, ou null se falhar.
     */
    async function getSongInfoFromTrackPage(trackPageUrl) {
        try {
            const response = await fetch(trackPageUrl);
            if (!response.ok) {
                console.error(`Falha ao buscar ${trackPageUrl}: ${response.statusText}`);
                return null;
            }
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const songLink = doc.querySelector('a[href*="/Character/Song/"]');
            const id = songLink ? songLink.getAttribute('href').split('/').pop() : null;

            const h1 = doc.querySelector('h1');
            const name = h1 ? h1.firstChild.textContent.trim() : null;

            if (id && name) {
                return { id, name };
            } else {
                console.warn(`ID ou Nome não encontrado em: ${trackPageUrl}. A página pode ter retornado um erro de login.`);
                return null;
            }
        } catch (error) {
            console.error(`Erro ao processar a URL ${trackPageUrl}:`, error);
            return null;
        }
    }

    /**
     * Função principal que processa as faixas de forma sequencial.
     */
    async function main() {
        extractButton.disabled = true;
        resultTextArea.value = ''; // Limpa a área de texto

        const trackLinks = document.querySelectorAll('#tabletracks tbody tr a[href*="/Artist/Track/"]');
        const totalTracks = trackLinks.length;

        if (totalTracks === 0) {
            resultTextArea.value = 'Nenhuma faixa encontrada na tabela.';
            extractButton.disabled = false;
            extractButton.textContent = 'Extrair IDs e Nomes (Formatado)';
            return;
        }

        let successCount = 0;
        // Usamos um loop for...of para processar um de cada vez
        for (let i = 0; i < totalTracks; i++) {
            const link = trackLinks[i];
            extractButton.textContent = `Extraindo... (${i + 1}/${totalTracks})`;

            const info = await getSongInfoFromTrackPage(link.href);

            if (info) {
                const formattedString = `[songid=${info.id} name="${info.name}"]`;
                resultTextArea.value += formattedString + '\n';
                successCount++;
            } else {
                resultTextArea.value += `--- FALHA AO EXTRAIR A MÚSICA: ${link.textContent.trim()} ---\n`;
            }

            // Pausa entre as requisições para não sobrecarregar o servidor
            await delay(DELAY_BETWEEN_REQUESTS_MS);
        }

        // Finalização
        extractButton.disabled = false;
        extractButton.textContent = 'Extrair IDs e Nomes (Formatado)';

        resultTextArea.value += `\n--- Concluído! ${successCount} de ${totalTracks} músicas extraídas com sucesso. ---`;
        resultTextArea.select();
    }

    extractButton.addEventListener('click', main);

})();