// ==UserScript==
// @name         GreasyFork Busca Avançada (em Português, Ordenado por Atualização)
// @namespace    https://greasyfork.org/
// @version      3.5
// @description  Mostra todos os scripts do GreasyFork para o domínio atual, organizados por atualização, separados por novos e antigos, com textos em português 🇧🇷🆕📅♾️
// @author       Você
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/538919/GreasyFork%20Busca%20Avan%C3%A7ada%20%28em%20Portugu%C3%AAs%2C%20Ordenado%20por%20Atualiza%C3%A7%C3%A3o%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538919/GreasyFork%20Busca%20Avan%C3%A7ada%20%28em%20Portugu%C3%AAs%2C%20Ordenado%20por%20Atualiza%C3%A7%C3%A3o%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dominio = window.location.hostname.replace(/^www\./, '');
    const baseURL = `https://greasyfork.org/pt-BR/scripts?filter_locale=0&q=${encodeURIComponent(dominio)}`;
    const HOJE = new Date();
    const LIMITE_DIAS = 30;

    function formatarDataBR(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        if (!(data instanceof Date) || isNaN(data.getTime())) return '';
        return data.toLocaleDateString('pt-BR');
    }

    function legendaAtualizacao(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        if (!(data instanceof Date) || isNaN(data.getTime())) return '';
        const dias = Math.floor((HOJE - data) / (1000 * 60 * 60 * 24));

        if (dias === 0) return '<b style="color:#28a745;">🆕 Atualizado hoje</b>';
        if (dias === 1) return '<b style="color:#28a745;">🆕 Atualizado ontem</b>';
        if (dias <= 7) return `<b style=\"color:#28a745;\">🆕 Atualizado há ${dias} dias</b>`;
        if (dias <= 30) return `Atualizado há ${dias} dias`;
        return `Atualizado em ${formatarDataBR(dataISO)}`;
    }

    const estilo = document.createElement('style');
    estilo.textContent = `
        #gf-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0073e6;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 22px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        #gf-btn:hover { background: #005bb5; }
        #gf-painel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 420px;
            max-height: 80vh;
            overflow-y: auto;
            background: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 16px;
            font-family: "Segoe UI", sans-serif;
            font-size: 14px;
            color: #222;
            z-index: 9999;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            display: none;
        }
        .gf-card {
            background: white;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            border-left: 4px solid transparent;
        }
        .gf-card.recent { border-left-color: #28a745; }
        .gf-card a.title {
            color: #0073e6;
            font-weight: bold;
            text-decoration: none;
            font-size: 15px;
        }
        .gf-card a.install {
            display: inline-block;
            margin-top: 6px;
            color: white;
            background: #28a745;
            padding: 4px 10px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 13px;
        }
        .gf-card small {
            color: #555;
            display: block;
            margin-top: 4px;
        }
        @media (prefers-color-scheme: dark) {
            #gf-painel { background: #1e1e1e; border: 1px solid #444; color: #ddd; }
            .gf-card { background: #2b2b2b; box-shadow: 0 2px 6px rgba(0,0,0,0.5); }
            .gf-card a.title { color: #58a6ff; }
            .gf-card a.install { background: #2ea043; }
            #gf-btn { background: #005bb5; }
            #gf-btn:hover { background: #0073e6; }
        }
    `;
    document.head.appendChild(estilo);

    const botao = document.createElement('button');
    botao.id = 'gf-btn';
    botao.textContent = '🔍';
    document.body.appendChild(botao);

    const painel = document.createElement('div');
    painel.id = 'gf-painel';
    document.body.appendChild(painel);

    function renderizarCartao(scriptEl) {
        const nameEl = scriptEl.querySelector('a[href^="/pt-BR/scripts/"]');
        const descEl = scriptEl.querySelector('.script-description');
        const link = nameEl ? 'https://greasyfork.org' + nameEl.getAttribute('href') : '#';
        const nome = nameEl?.textContent || 'Sem título';
        const descricao = descEl?.textContent || '';
        const installURL = link + '/code/script.user.js';
        const rawUpdated = scriptEl.getAttribute('data-script-updated-at') || scriptEl.getAttribute('data-script-created-at');
        const dias = (HOJE - new Date(rawUpdated)) / (1000 * 60 * 60 * 24);

        const card = document.createElement('div');
        card.className = 'gf-card' + (dias <= LIMITE_DIAS ? ' recent' : '');
        card.innerHTML = `
            <a class="title" href="${link}" target="_blank">${nome}</a>
            <div>${descricao}</div>
            <small>${legendaAtualizacao(rawUpdated)}</small>
            <a class="install" href="${installURL}" target="_blank">📥 Instalar</a>
        `;
        painel.appendChild(card);
    }

    botao.addEventListener('click', () => {
        if (painel.style.display === 'block') {
            painel.style.display = 'none';
            return;
        }

        painel.style.display = 'block';
        painel.innerHTML = `<p>🔍 Buscando scripts para <strong>${dominio}</strong>...</p>`;

        let pagina = 1;
        let todosScripts = [];

        function buscarPagina() {
            const url = `${baseURL}&page=${pagina}`;
            painel.innerHTML = `<p>🔄 Carregando página ${pagina}...</p>`;

            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function (res) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(res.responseText, 'text/html');
                    const scriptItems = Array.from(doc.querySelectorAll('#browse-script-list li'));

                    if (!scriptItems.length) {
                        renderizarTodos(todosScripts);
                        return;
                    }

                    todosScripts.push(...scriptItems);
                    pagina++;
                    buscarPagina();
                },
                onerror: function () {
                    painel.innerHTML = `<p style="color:red;">❌ Erro ao buscar página ${pagina}.</p>`;
                }
            });
        }

        function renderizarTodos(scripts) {
            if (!scripts.length) {
                painel.innerHTML = `<p>❌ Nenhum script encontrado para <strong>${dominio}</strong>.</p>`;
                return;
            }

            scripts.sort((a, b) => {
                const dA = new Date(a.getAttribute('data-script-updated-at') || a.getAttribute('data-script-created-at'));
                const dB = new Date(b.getAttribute('data-script-updated-at') || b.getAttribute('data-script-created-at'));
                return dB - dA;
            });

            const recentes = [];
            const antigos = [];

            scripts.forEach(scriptEl => {
                const updated = scriptEl.getAttribute('data-script-updated-at') || scriptEl.getAttribute('data-script-created-at');
                const dias = (HOJE - new Date(updated)) / (1000 * 60 * 60 * 24);
                (dias <= LIMITE_DIAS ? recentes : antigos).push(scriptEl);
            });

            painel.innerHTML = `<h3 style="margin-top:0;">📜 ${scripts.length} scripts encontrados para <strong>${dominio}</strong></h3>`;

            if (recentes.length) {
                const titulo = document.createElement('h4');
                titulo.textContent = '🆕 Scripts atualizados recentemente';
                painel.appendChild(titulo);
                recentes.forEach(renderizarCartao);
            }

            if (antigos.length) {
                const titulo = document.createElement('h4');
                titulo.textContent = '📂 Scripts mais antigos';
                painel.appendChild(titulo);
                antigos.forEach(renderizarCartao);
            }
        }

        buscarPagina();
    });
})();
