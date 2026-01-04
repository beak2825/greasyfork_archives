// ==UserScript==
// @name        Barra de Botões Ferramentas Youtube
// @namespace   https://t.me/virumaniaa
// @version     1.2.54
// @license     MIT
// @description Barra multifuncional fixa com ferramentas para YouTube com download de thumbnails, legendas, transcrições, tem encurtador de url, visualização de urls inteiras, rolagem rápida, remoção de bloqueios, cópia de imagens e links e modo leitura; dispõe de tradução via Google Translate, tenta desbloquear paywalls, download de livros do Scribd/Z-Library, busca Searx, visualizador de dados vazados pelo navegador e Turbo Loader que acelera o carregamento de sites; atalho CONTROL+F12.
// @author
// @match       *://*/*
// @icon        https://www.youtube.com/favicon.ico
// @grant       GM_setClipboard
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM.cookie
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     is.gd
// @connect     translate.googleapis.com
// @connect     https://searx.bndkt.io/*
// @connect     *
// @require     https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.2/Readability.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@2.3.10/dist/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/527780/Barra%20de%20Bot%C3%B5es%20Ferramentas%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/527780/Barra%20de%20Bot%C3%B5es%20Ferramentas%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
        console.log('Script iniciado para:', window.location.href);

        if (window.top !== window.self) {
            console.log('Barra não exibida em iframe');
            return;
        }

        // Adicione este evento no início do seu script, com a flag "capture" como true
// Adicione este evento no início do seu script, com a flag "capture" como true
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Atalho CTRL+F12 detectado na fase de captura!');
        if (typeof barHidden !== 'undefined') {
            if (barHidden) {
                showBar();
                showOverlayConfirmationAutoClose("Barra Exibida", "A barra foi restaurada via atalho (CTRL+F12).");
            } else {
                hideBar();
                showOverlayConfirmationAutoClose("Barra Ocultada", "A barra foi ocultada via atalho (CTRL+F12).");
            }
        }
    }
}, true); // true indica a fase de captura

        // Configurações Searx
        const SEARX_CONFIG = {
            instanceUrl: 'https://searx.bndkt.io',
            animationDuration: 300, // ms
            safeSearch: 0,          // 0 = desativada
            imageProxy: 1,          // 1 = ativado
            urlTrackingRemove: 1    // 1 = ativado
        };

        // Categorias e Motores Searx
        const SEARX_CATEGORIES = {
            general: 'Geral',
            images: 'Imagens',
            videos: 'Vídeos',
            news: 'Notícias',
            map: 'Mapas',
            files: 'Arquivos',
            it: 'Tecnologia',
            science: 'Ciência',
            socialmedia: 'Redes Sociais',
            music: 'Música'
        };

        const SEARX_ENGINES = {
            // Principais
            duckduckgo: 'DuckDuckGo',
            google: 'Google',
            bing: 'Bing',
            brave: 'Brave',
            startpage: 'Startpage',
            mojeek: 'Mojeek',
            yahoo: 'Yahoo',
            qwant: 'Qwant',
            ecosia: 'Ecosia',

            // Conteúdo
            wikipedia: 'Wikipedia',
            reddit: 'Reddit',
            youtube: 'YouTube',

            // Idiomas
            dictzone: 'DictZone',
            libretranslate: 'LibreTranslate',
            lingva: 'Lingva',
            mozhi: 'Mozhi',
            'mymemory translated': 'MyMemory',

            // Alternativos
            presearch: 'Presearch',
            'presearch videos': 'Presearch Videos',
            wiby: 'Wiby',
            seznam: 'Seznam',
            goo: 'Goo',
            naver: 'Naver',

            // Wiki
            wikibooks: 'WikiBooks',
            wikiquote: 'WikiQuote',
            wikisource: 'WikiSource',
            wikispecies: 'WikiSpecies',
            wikiversity: 'WikiVersity',
            wikivoyage: 'WikiVoyage',
            wikidata: 'WikiData',

            // Outros
            '360search': '360 Search',
            alexandria: 'Alexandria',
            ask: 'Ask',
            cloudflareai: 'Cloudflare AI',
            crowdview: 'CrowdView',
            curlie: 'Curlie',
            currency: 'Currency',
            'ddg definitions': 'DDG Definitions',
            encyclosearch: 'EncycloSearch',
            mwmbl: 'Mwmbl',
            'right dao': 'Right DAO',
            searchmysite: 'SearchMySite',
            sogou: 'Sogou',
            stract: 'Stract',
            tineye: 'TinEye',
            wolframalpha: 'WolframAlpha',
            yacy: 'YaCy',
            yep: 'Yep',
            bpb: 'BPB',
            tagesschau: 'Tagesschau',
            wikimini: 'WikiMini'
        };

        const zlConfig = {
            domains: [
                'https://singlelogin.re',
                'https://zlibrary-global.se',
                'https://zlibrary-east.se',
                'https://zlibrary-au.se'
            ],
            retryDelay: 3000,
            maxAttempts: 5,
            stealthMode: true
        };

        const downloadManager = {
            attempts: 0,
            currentDomainIndex: 0,
            getDomain() {
                return zlConfig.domains[this.currentDomainIndex];
            },
            rotateDomain() {
                this.currentDomainIndex = (this.currentDomainIndex + 1) % zlConfig.domains.length;
                this.attempts = 0;
            },
            async fetchBook(bookId) {
                const domain = this.getDomain();
                const url = `${domain}/download/${bookId}?rand=${Math.random().toString(36).substr(2)}`;
                try {
                    const response = await this._makeRequest(url);
                    if (response.redirected) return response.url;
                    throw new Error('Redirecionamento falhou');
                } catch (error) {
                    this.attempts++;
                    if (this.attempts >= zlConfig.maxAttempts) this.rotateDomain();
                    return this.fetchBook(bookId);
                }
            },
            _makeRequest(url) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        anonymous: true,
                        onload: function(response) {
                            if (response.status === 200) resolve(response);
                            else reject(new Error(`Status ${response.status}`));
                        },
                        onerror: reject
                    });
                });
            }
        };

        function generateStealthLink(baseUrl) {
            const params = new URLSearchParams({
                ts: Date.now(),
                ref: document.referrer || 'direct',
                rand: Math.random().toString(36).substr(2, 8)
            });
            return `${baseUrl}&${params.toString()}`;
        }

        async function startDownload(bookId) {
            try {
                const downloadUrl = await downloadManager.fetchBook(bookId);
                const finalUrl = generateStealthLink(downloadUrl);
                if (zlConfig.stealthMode) {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = finalUrl;
                    document.body.appendChild(iframe);
                } else {
                    window.open(finalUrl, '_blank');
                }
            } catch (error) {
                showStatus('Erro: Tente novamente em alguns minutos', 'red');
            }
        }

        function showStatus(message, color = '#28a745') {
            const existing = document.getElementById('download-status');
            if (existing) existing.remove();

            const status = document.createElement('div');
            status.id = 'download-status';
            Object.assign(status.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: color,
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                zIndex: '1000000'
            });
            status.textContent = message;
            document.body.appendChild(status);

            setTimeout(() => status.remove(), 3000);
        }

        function createButton(text, onClick, color = '#007bff') {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.backgroundColor = color;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '8px 16px';
            btn.style.margin = '5px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '14px';
            btn.addEventListener('click', onClick);
            return btn;
        }

        let originalTextNodes = [];

        function toggleGoogleTranslate() {
            if (document.body.getAttribute('data-translated') === 'true') {
                originalTextNodes.forEach(({ node, originalText }) => {
                    node.textContent = originalText;
                });
                document.body.removeAttribute('data-translated');
                showOverlayConfirmationAutoClose("Sucesso", "Texto original restaurado!");
                updateGoogleTradButtonStyle(btnGoogleTrad);
            } else {
                translatePage();
            }
        }

        async function translatePage() {
            try {
                console.log('Iniciando tradução da página');
                const elements = document.body.getElementsByTagName('*');
                originalTextNodes = [];
                for (let element of elements) {
                    if (element.nodeType === 1 && window.getComputedStyle(element).display !== 'none' && !element.closest('#userToolbar')) {
                        for (let node of element.childNodes) {
                            if (node.nodeType === 3 && node.textContent.trim()) {
                                originalTextNodes.push({ node, originalText: node.textContent.trim() });
                            }
                        }
                    }
                }

                if (originalTextNodes.length === 0) {
                    showOverlayConfirmationAutoClose("Erro", "Nenhum texto encontrado para traduzir.");
                    console.log('Nenhum texto encontrado para traduzir');
                    return;
                }

                console.log(`Encontrados ${originalTextNodes.length} nós de texto para traduzir`);
                const texts = originalTextNodes.map(t => t.originalText);
                const batchSize = 5000;
                let translatedTexts = [];

                for (let i = 0; i < texts.length; i += batchSize) {
                    const batch = texts.slice(i, i + batchSize).join('\n');
                    console.log(`Traduzindo lote de ${i} a ${Math.min(i + batchSize, texts.length)}`);
                    const translatedBatch = await translateText(batch);
                    translatedTexts = translatedTexts.concat(translatedBatch.split('\n'));
                }

                console.log(`Aplicando ${translatedTexts.length} textos traduzidos`);
                originalTextNodes.forEach((nodeObj, index) => {
                    if (translatedTexts[index]) {
                        nodeObj.node.textContent = translatedTexts[index];
                    }
                });

                document.body.setAttribute('data-translated', 'true');
                showOverlayConfirmationAutoClose("Sucesso", "Página traduzida para português!");
                updateGoogleTradButtonStyle(btnGoogleTrad);
            } catch (error) {
                console.error('Erro ao traduzir a página:', error);
                showOverlayConfirmationAutoClose("Erro", "Falha ao traduzir a página: " + error.message);
            }
        }

        async function translateText(text) {
            return new Promise((resolve, reject) => {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text)}`;
                console.log('Enviando requisição para:', url);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        console.log('Resposta recebida:', response.status, response.responseText);
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const translated = data[0].map(item => item[0]).join('');
                                resolve(translated);
                            } catch (e) {
                                console.error('Erro ao parsear resposta:', e);
                                reject(new Error("Erro ao processar a resposta da tradução: " + e.message));
                            }
                        } else {
                            reject(new Error(`Erro na requisição: Status ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('Erro na requisição GM_xmlhttpRequest:', error);
                        reject(new Error("Falha na requisição de tradução: " + error.message));
                    }
                });
            });
        }

        function updateGoogleTradButtonStyle(btn) {
            if (document.body.getAttribute('data-translated') === 'true') {
                btn.textContent = 'Trad. OFF';
                btn.className = 'btn-default';
                btn.style.backgroundColor = '#00ff00';
                btn.style.color = '#000';
                btn.setAttribute("data-active", "true");
            } else {
                btn.textContent = 'Google trad.';
                btn.className = 'btn-default btn-googletrad';
                btn.style.backgroundColor = '#4285F4';
                btn.style.color = 'white';
                btn.removeAttribute("data-active");
            }
        }

        const barOriginalHeight = 40;
        const marginValue = `${barOriginalHeight}px`;
        const hostname = location.hostname;

        let youtubeApp = null,
            youtubeMasthead = null,
            protonHeader = null,
            protonMain = null;

        if (hostname.includes('youtube.com')) {
            console.log('Detectado YouTube, buscando elementos');
            youtubeApp = document.querySelector('ytd-app');
            youtubeMasthead = document.querySelector('ytd-masthead#masthead');
            console.log('youtubeApp:', youtubeApp, 'youtubeMasthead:', youtubeMasthead);
        } else if (hostname.includes('proton.me')) {
            protonHeader = document.querySelector('header');
            protonMain = document.querySelector('main');
        }

        const updateMargin = (elements, value) => {
            elements.forEach(el => {
                if (el) el.style.marginTop = value;
            });
        };

        function applyPushDown() {
            console.log('Aplicando push down');
            if (youtubeApp && youtubeMasthead) {
                youtubeMasthead.style.setProperty('margin-top', marginValue, 'important');
                console.log('Masthead ajustado para margin-top:', marginValue);
                const miniGuide = youtubeApp.querySelector('ytd-mini-guide-renderer, ytd-guide-renderer');
                if (miniGuide) {
                    miniGuide.style.setProperty('margin-top', marginValue, 'important');
                    console.log('Mini-guide ajustado para margin-top:', marginValue);
                }
                const content = youtubeApp.querySelector('#content');
                if (content) {
                    content.style.setProperty('margin-top', `calc(${marginValue} + 56px)`, 'important');
                    console.log('Content ajustado para margin-top: calc(40px + 56px)');
                }
                youtubeApp.style.paddingTop = '0';
            } else if (protonHeader && protonMain) {
                updateMargin([protonHeader, protonMain], marginValue);
            } else {
                updateMargin([document.body], marginValue);
            }
        }

        function removePushDown() {
            console.log('Removendo push down');
            if (youtubeMasthead) {
                youtubeMasthead.style.setProperty('margin-top', '0px', 'important');
                const miniGuide = youtubeApp ? youtubeApp.querySelector('ytd-mini-guide-renderer, ytd-guide-renderer') : null;
                if (miniGuide) {
                    miniGuide.style.setProperty('margin-top', '0px', 'important');
                }
                const content = youtubeApp ? youtubeApp.querySelector('#content') : null;
                if (content) {
                    content.style.setProperty('margin-top', '0px', 'important');
                }
            }
            updateMargin([youtubeApp, protonHeader, protonMain, document.body], '0px');
        }

        const customStyle = document.createElement('style');
        customStyle.textContent = `
            .btn-default {
                background-color: #ff0000 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-default:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-default[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-toggle {
                background-color: #ffff00 !important;
                color: black !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-toggle:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-toggle[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-blue {
                background-color: #007bff !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 3px 8px !important;
                font-size: 10px !important;
                cursor: pointer !important;
            }
            .btn-blue:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-blue[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-green {
                background-color: #28a745 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-green:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-green[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-scribd {
                background-color: #2e9fa2 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-scribd:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-scribd[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-googletrad {
                background-color: #4285F4 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-googletrad:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-searx {
                background-color: #006400 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-searx:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-searx[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-data-exposed {
                background-color: #000000 !important;
                color: white !important;
                border: 2px solid red !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-data-exposed:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-data-exposed[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
                border: 2px solid red !important;
            }
            .btn-reading-mode {
                background-color: rgba(26, 115, 232, 0.9) !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 5px 8px !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .btn-reading-mode:hover {
                background-color: rgba(26, 115, 232, 1) !important;
            }
            .btn-reading-mode:active {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .btn-reading-mode[data-active="true"] {
                background-color: #00ff00 !important;
                color: black !important;
            }
            .draggable-menu {
                position: fixed;
                zIndex: 1000000;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 20px;
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                cursor: move;
            }
            .thumbnail-menu {
                width: 960px;
                height: 540px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
            }
            .draggable-menu h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: yellow;
                cursor: move;
            }
            .draggable-menu .image-container {
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                max-height: 460px;
                overflow: hidden;
            }
            .draggable-menu .button-container {
                display: flex;
                justify-content: center;
                gap: 10px;
                padding-top: 10px;
            }
            .draggable-menu .container {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                justify-content: center;
                overflow: auto;
            }
            /* Estilos Searx */
            .searx-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 99999999;
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(4px);
                opacity: 0;
                transition: opacity ${SEARX_CONFIG.animationDuration}ms ease;
            }
            .searx-modal {
                background: #1a1a2e;
                border-radius: 8px;
                width: 90%;
                max-width: 850px;
                max-height: 85vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transform: translateY(20px);
                transition: transform ${SEARX_CONFIG.animationDuration}ms ease;
                color: #f0f0f0;
                position: absolute;
            }
            .searx-header {
                padding: 20px;
                background: #292945;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: move;
                display: flex;
                flex-direction: column;
                user-select: none;
            }
            .searx-header h3 {
                margin: 0 0 15px 0;
                font-size: 1.4rem;
                color: #f0f0f0;
                user-select: none;
            }
            .searx-search-container {
                display: flex;
                gap: 10px;
                width: 100%;
                position: relative;
                z-index: 5;
            }
            .searx-search-container input {
                flex-grow: 1;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: #f0f0f0;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            .searx-search-container input:focus {
                outline: none;
                border-color: #6c5ce7;
                box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3);
            }
            .searx-content {
                padding: 0 20px;
                overflow-y: auto;
                flex-grow: 1;
            }
            .searx-section {
                margin: 15px 0;
                position: relative;
            }
            .searx-collapsible-header {
                padding: 12px 15px;
                background: #292945;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.2s ease;
                user-select: none;
            }
            .searx-collapsible-header:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            .searx-collapsible-header .searx-section-title {
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
            }
            .searx-collapsible-header .searx-toggle-icon {
                transition: transform 0.3s ease;
            }
            .searx-collapsible-header.active .searx-toggle-icon {
                transform: rotate(180deg);
            }
            .searx-collapsible-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 0 0 8px 8px;
            }
            .searx-collapsible-content.open {
                max-height: 500px;
                overflow-y: auto;
            }
            .searx-section-title span {
                margin-left: 8px;
                font-size: 0.8rem;
                color: #b8b8b8;
                font-weight: normal;
            }
            .searx-checkbox-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 8px;
                padding: 15px;
            }
            .searx-checkbox-item {
                display: flex;
                align-items: center;
                padding: 6px 10px;
                background: #292945;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            .searx-checkbox-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .searx-checkbox-item label {
                margin-left: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                user-select: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex-grow: 1;
            }
            .searx-checkbox {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                position: relative;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            .searx-checkbox:checked {
                background: #6c5ce7;
                border-color: #6c5ce7;
            }
            .searx-checkbox:checked::after {
                content: '';
                position: absolute;
                top: 3px;
                left: 6px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            .searx-footer {
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #292945;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .searx-switcher {
                display: flex;
                align-items: center;
            }
            .searx-switcher label {
                font-size: 0.9rem;
                margin-left: 8px;
                user-select: none;
            }
            .searx-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 22px;
            }
            .searx-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .searx-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.2);
                transition: .4s;
                border-radius: 22px;
            }
            .searx-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            .searx-switch input:checked + .searx-slider {
                background-color: #6c5ce7;
            }
            .searx-switch input:checked + .searx-slider:before {
                transform: translateX(18px);
            }
            .searx-btn-group {
                display: flex;
                gap: 10px;
            }
            .searx-button {
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .searx-button-primary {
                background: #6c5ce7;
                color: white;
            }
            .searx-button-primary:hover {
                background: #5b4bc9;
            }
            .searx-button-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #f0f0f0;
            }
            .searx-button-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .searx-button-danger {
                background: #e74c3c;
                color: white;
            }
            .searx-button-danger:hover {
                background: #c0392b;
            }
            .searx-search-history {
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .searx-history-item {
                padding: 5px 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .searx-history-item:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .searx-toast {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            .searx-toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            .searx-fade-in {
                opacity: 1;
            }
            .searx-move-up {
                transform: translateY(0);
            }
            .searx-shortcut {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                font-size: 0.8rem;
                margin-left: 8px;
            }
            @keyframes searx-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .searx-search-btn {
                animation: searx-pulse 1.5s infinite;
            }
            /* Estilos do Modo de Leitura */
            #speedreader-overlay {
                contain: strict;
                z-index: 2147483647;
            }
            #reader-loading-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2147483647;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                font-family: system-ui, sans-serif;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            #reader-error-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2147483647;
                background: rgba(220, 53, 69, 0.9);
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                font-family: system-ui, sans-serif;
                font-size: 16px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            @keyframes reader_spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @media print {
                #speedreader-overlay {
                    position: relative !important;
                    height: auto !important;
                }
                #speedreader-overlay .controls {
                    display: none !important;
                }
            }
            `;
        document.head.appendChild(customStyle);
        console.log('Estilos personalizados adicionados');

        function updateLayoutAfterUrlBar() {
            if (!urlBarActive && urlBarContainer) {
                urlBarContainer.style.display = 'none';
                applyPushDown(); // Restaura o layout padrão sem a barra de URL
            }
        }

        function makeDraggable(element) {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            const setFixedSize = () => {
                const rect = element.getBoundingClientRect();
                element.style.width = `${rect.width}px`;
                element.style.height = `${rect.height}px`;
            };
            setTimeout(setFixedSize, 0);

            element.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = element.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                element.style.transition = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                element.style.left = `${initialX + deltaX}px`;
                element.style.top = `${initialY + deltaY}px`;
                element.style.transform = 'none';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    element.style.transition = 'opacity 0.2s';
                }
            });
        }

        // Função para tornar um elemento arrastável (Searx modal)
        function makeSearxDraggable(element, handle) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            handle.addEventListener('mousedown', function(e) {
                // Não iniciar arrasto se o clique foi em elementos interativos
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    return;
                }

                e.preventDefault();
                isDragging = true;
                element.classList.add('dragging');

                // Posição inicial do mouse
                startX = e.clientX;
                startY = e.clientY;

                // Posição inicial do elemento
                const rect = element.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
            });

            function drag(e) {
                if (!isDragging) return;

                // Calcular o deslocamento
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Aplicar nova posição
                element.style.left = (initialLeft + dx) + 'px';
                element.style.top = (initialTop + dy) + 'px';
            }

            function stopDrag() {
                if (isDragging) {
                    isDragging = false;
                    element.classList.remove('dragging');

                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', stopDrag);
                }
            }
        }

        const toolbar = document.createElement('div');
        toolbar.id = 'userToolbar';
        toolbar.title = 'Para ocultar ou mostrar a barra use o atalho CONTROL+F12';
        Object.assign(toolbar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: `${barOriginalHeight}px`,
            zIndex: '10000000',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        });
        console.log('Toolbar criada');

        const toolbarStyle = document.createElement('style');
        toolbarStyle.textContent = `
            #userToolbar button {
                cursor: pointer !important;
            }`;
        document.head.appendChild(toolbarStyle);

        function showOverlayConfirmationAutoClose(titulo, mensagem, timeout = 4000) {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '1000000',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '20px',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                minWidth: '300px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            });

            const tituloElement = document.createElement('h3');
            Object.assign(tituloElement.style, {
                marginTop: '0',
                marginBottom: '10px',
                color: 'yellow'
            });
            tituloElement.textContent = titulo;
            overlay.appendChild(tituloElement);

            const mensagemElement = document.createElement('p');
            mensagemElement.style.margin = '0';
            mensagemElement.textContent = mensagem;
            overlay.appendChild(mensagemElement);

            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), timeout);
        }

        function getToolbarStateGlobal() {
            return GM_getValue("toolbar_hidden_global", false);
        }

        function setToolbarStateGlobal(hidden) {
            GM_setValue("toolbar_hidden_global", hidden);
        }

        let barHidden = getToolbarStateGlobal();
        let urlBarActive = false;
        let urlBarContainer = null;
        const DRAG_THRESHOLD = 5;

        function hideBar() {
    console.log('Ocultando barra, estado anterior:', barHidden);
    barHidden = true;
    if (toolbar) toolbar.style.display = 'none';
    if (urlBarContainer) {
        urlBarContainer.style.display = 'none';
    }
    removePushDown();
    setToolbarStateGlobal(true);
    console.log('Barra ocultada, novo estado:', barHidden);
}

function showBar() {
    console.log('Exibindo barra, estado anterior:', barHidden);
    barHidden = false;
    if (toolbar) toolbar.style.display = 'flex';
    if (urlBarActive && urlBarContainer) {
        urlBarContainer.style.display = 'block';
        urlBarContainer.querySelector('#fullUrlInput').value = window.location.href;
        applyPushDownWithUrlBar();
    } else {
        if (urlBarContainer) urlBarContainer.style.display = 'none';
        applyPushDown();
    }
    setToolbarStateGlobal(false);
    console.log('Barra exibida, novo estado:', barHidden);
}

        const centerContainer = document.createElement('div');
        Object.assign(centerContainer.style, {
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
        });
        toolbar.appendChild(centerContainer);
        console.log('Container central adicionado à toolbar');

        function setupKeyboardShortcut() {
    function handleKeyDown(e) {
        if (e.ctrlKey && e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            console.log('Atalho CTRL+F12 detectado!');
            if (barHidden) {
                showBar();
                showOverlayConfirmationAutoClose("Barra Exibida", "A barra foi restaurada via atalho (CTRL+F12).");
            } else {
                hideBar();
                showOverlayConfirmationAutoClose("Barra Ocultada", "A barra foi ocultada via atalho (CTRL+F12).");
            }
        }
    }
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
}

            window.addEventListener('popstate', () => {
            console.log('Navegação detectada via histórico (voltar/avançar)');
            if (getToolbarStateGlobal()) {
                hideBar();
            } else {
                showBar();
            }
        });

        let lastUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                updateUrlBarOnNavigation();
            }
        }, 500);

        function updateComentariosButtonStyle(btn, isActive) {
            if (isActive) {
                btn.style.backgroundColor = "#00ff00";
                btn.style.color = "#000";
                btn.setAttribute("data-active", "true");
            } else {
                btn.style.backgroundColor = "#ff0000";
                btn.style.color = "#fff";
                btn.removeAttribute("data-active");
            }
        }

        function toggleComentarios() {
            if (!location.href.includes("youtube.com/watch")) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no YouTube.");
                return;
            }
            const videoContainer = document.getElementById("player") || document.querySelector("ytd-player");
            const commentsContainer = document.getElementById("comments") || document.querySelector("ytd-comments");
            if (!videoContainer || !commentsContainer) {
                showOverlayConfirmationAutoClose("Erro", "Não foi possível localizar o player ou os comentários.");
                return;
            }
            if (!toggleComentarios.ativado) {
                toggleComentarios.originalDisplay = window.getComputedStyle(videoContainer).display;
                videoContainer.style.display = "none";
                toggleComentarios.originalParent = commentsContainer.parentNode;
                toggleComentarios.originalNext = commentsContainer.nextSibling;
                videoContainer.parentNode.insertBefore(commentsContainer, videoContainer);
                toggleComentarios.ativado = true;
                updateComentariosButtonStyle(this, true);
            } else {
                videoContainer.style.display = toggleComentarios.originalDisplay;
                if (toggleComentarios.originalParent) {
                    if (toggleComentarios.originalNext) {
                        toggleComentarios.originalParent.insertBefore(commentsContainer, toggleComentarios.originalNext);
                    } else {
                        toggleComentarios.originalParent.appendChild(commentsContainer);
                    }
                }
                toggleComentarios.ativado = false;
                updateComentariosButtonStyle(this, false);
            }
        }

        function createComentariosButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Comentários';
            btn.className = 'btn-default';
            btn.style.cursor = 'pointer';
            btn.title = 'Mostra comentários e oculta vídeo';
            btn.addEventListener('click', function(e) {
                toggleComentarios.call(this, e);
            });
            return btn;
        }

        function createIsgdButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Encurtador-is.gd';
            btn.className = 'btn-default';
            btn.title = 'Encurta link com o is.gd';
            btn.addEventListener('click', shortenWithIsgd);
            return btn;
        }

        function shortenWithIsgd() {
            const originalUrl = window.location.href;
            const apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(originalUrl)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                nocache: true,
                onload: (response) => {
                    if (response.status === 200) {
                        if (response.responseText.startsWith('Error:')) {
                            showOverlayConfirmationAutoClose("Erro ao Encurtar", response.responseText);
                        } else {
                            const shortenedUrl = response.responseText.trim();
                            GM_setClipboard(shortenedUrl, 'text');
                            showOverlayConfirmationAutoClose("URL Encurtada!", `A URL foi encurtada e copiada:\n${shortenedUrl}`);
                        }
                    } else {
                        showOverlayConfirmationAutoClose("Erro ao Encurtar", `Código de status HTTP: ${response.status}`);
                    }
                },
                onerror: () => {
                    showOverlayConfirmationAutoClose("Erro ao Encurtar", "Falha na requisição GM_xmlhttpRequest.");
                }
            });
        }

        async function copyTranscript() {
            if (!location.hostname.includes('youtube.com')) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no YouTube.");
                return;
            }
            try {
                const transcript = await getTranscript();
                if (transcript) {
                    GM_setClipboard(transcript, 'text');
                    showOverlayConfirmationAutoClose("Transcrição Copiada!", "O texto completo foi copiado.");
                }
            } catch (error) {
                showOverlayConfirmationAutoClose("Erro na Transcrição", error.message);
            }
        }

        async function getTranscript() {
            try {
                const transcriptButton = document.querySelector('button[aria-label*="transcrição"]');
                if (transcriptButton && !transcriptButton.getAttribute('aria-pressed')) {
                    transcriptButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                const startTime = Date.now();
                return await new Promise((resolve, reject) => {
                    const interval = setInterval(() => {
                        const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
                        if (segments.length > 0) {
                            clearInterval(interval);
                            const transcriptText = Array.from(segments)
                                .map(segment => {
                                    const time = segment.querySelector('.segment-timestamp')?.textContent?.trim() || '[00:00]';
                                    const text = segment.querySelector('.segment-text')?.textContent?.trim() || '';
                                    return `${time} ${text}`;
                                })
                                .join('\n');
                            if (transcriptButton) transcriptButton.click();
                            resolve(transcriptText);
                        } else if (Date.now() - startTime > 5000) {
                            clearInterval(interval);
                            reject(new Error("Tempo limite excedido ao carregar a transcrição"));
                        }
                    }, 500);
                });
            } catch (error) {
                throw new Error(`Erro: ${error.message}`);
            }
        }

        function createLegendasMenu(subtitles) {
            const menu = document.createElement('div');
            menu.className = 'draggable-menu';
            Object.assign(menu.style, {
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                minWidth: '300px'
            });
            const h3 = document.createElement('h3');
            h3.textContent = 'Legendas Disponíveis';
            Object.assign(h3.style, {
                fontSize: '12px'
            });
            menu.appendChild(h3);
            const container = document.createElement('div');
            container.className = 'container';
            subtitles.forEach(subtitle => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                const label = document.createElement('span');
                label.textContent = subtitle.languageName + (subtitle.kind ? " (ASR)" : " (Dono)");
                Object.assign(label.style, {
                    display: 'block',
                    marginBottom: '5px',
                    color: ((subtitle.languageName.toLowerCase().includes("português") && !subtitle.kind) ||
                            subtitle.languageName.toLowerCase().includes("inglês"))
                            ? "yellow"
                            : "white",
                    fontSize: '10px'
                });
                div.appendChild(label);
                const btnDownOrig = document.createElement('button');
                btnDownOrig.textContent = 'Baixar Original';
                btnDownOrig.className = 'btn-default';
                btnDownOrig.addEventListener('click', event => {
                    event.stopPropagation();
                    downloadSubtitle(subtitle);
                });
                div.appendChild(btnDownOrig);
                const btnDownTrad = document.createElement('button');
                btnDownTrad.textContent = 'Traduzido (PT-BR)';
                btnDownTrad.className = 'btn-blue';
                btnDownTrad.addEventListener('click', event => {
                    event.stopPropagation();
                    downloadTranslatedSubtitle(subtitle);
                });
                div.appendChild(btnDownTrad);
                container.appendChild(div);
            });
            menu.appendChild(container);
            const btnFechar = document.createElement('button');
            btnFechar.textContent = 'Fechar';
            Object.assign(btnFechar.style, {
                background: '#ffff00',
                border: 'none',
                color: '#000',
                padding: '3px 8px',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '10px',
                marginTop: '10px'
            });
            btnFechar.addEventListener('click', () => menu.remove());
            menu.appendChild(btnFechar);
            makeDraggable(menu);
            return menu;
        }

        async function showLegendasMenu() {
            if (!location.hostname.includes('youtube.com')) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no YouTube.");
                return;
            }
            try {
                const subtitles = await getAvailableSubtitles();
                if (!subtitles.length) {
                    alert("Nenhuma legenda disponível para este vídeo.");
                    return;
                }
                const menu = createLegendasMenu(subtitles);
                document.body.appendChild(menu);
            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        }

        function decodeHTMLEntities(text) {
            if (typeof text !== 'string') {
                console.error('Entrada inválida para decodeHTMLEntities:', text);
                return '';
            }
            console.log('Texto bruto para decodificar:', text);

            const entities = {
                '&': '&',
                '<': '<',
                '>': '>',
                '"': '"',
                '\'': '\'',  // Apóstrofo escapado
                '\u00A0': ' ',  // Espaço não separável
                '&quot;': '"',  // Aspas duplas
                '&apos;': '\'',  // Apóstrofo
                '&nbsp;': ' ',  // Espaço não separável
                '&amp;': '&',  // E comercial
                '&lt;': '<',  // Menor que
                '&gt;': '>',  // Maior que
                '&iexcl;': '¡',
                '&cent;': '¢',
                '&pound;': '£',
                '&curren;': '¤',
                '&yen;': '¥',
                '&brvbar;': '¦',
                '&sect;': '§',
                '&uml;': '¨',
                '&copy;': '©',
                '&ordf;': 'ª',
                '&raquo;': '»',
                '&not;': '¬',
                '&shy;': '­',
                '&reg;': '®',
                '&macr;': '¯',
                '&deg;': '°',
                '&plusmn;': '±',
                '&sup2;': '²',
                '&sup3;': '³',
                '&acute;': '´',
                '&micro;': 'µ',
                '&para;': '¶',
                '&middot;': '·',
                '&cedil;': '¸',
                '&sup1;': '¹',
                '&ordm;': 'º',
                '&laquo;': '«',
                '&frac14;': '¼',
                '&frac12;': '½',
                '&frac34;': '¾',
                '&iquest;': '¿',
                '&times;': '×',
                '&divide;': '÷'
            };

            try {
                let decoded = text.replace(/<[^>]+>/g, ""); // Remove todas as tags HTML primeiro
                decoded = decoded.replace(/&(?:[a-zA-Z0-9]+|#x?[0-9A-Fa-f]+);/g, match => {
                    const result = entities[match] || match;
                    console.log(`Entidade ${match} decodificada como: ${result}`);
                    return result;
                });

                // Trata entidades numéricas e hexadecimais manualmente, caso não estejam no mapeamento
                decoded = decoded.replace(/&#(\d+);/g, (_, num) => {
                    const result = String.fromCharCode(parseInt(num, 10)) || match;
                    console.log(`Entidade numérica &#${num}; decodificada como: ${result}`);
                    return result;
                });
                decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/gi, (_, hex) => {
                    const result = String.fromCharCode(parseInt(hex, 16)) || match;
                    console.log(`Entidade hexadecimal &#x${hex}; decodificada como: ${result}`);
                    return result;
                });

                console.log('Texto decodificado:', decoded);
                return decoded.trim();
            } catch (error) {
                console.error('Erro ao decodificar entidades:', error);
                return text.trim() || ''; // Retorna o texto original limpo se houver erro
            }
        }

        function convertXmlToSrt(xmlContent) {
            console.log('XML para SRT:', xmlContent.slice(0, 200));
            const lines = [];
            let index = 1;
            const textRegex = /<text start="([\d.]+)" dur="([\d.]+)">([\s\S]*?)<\/text>/gi;
            let match;
            while ((match = textRegex.exec(xmlContent)) !== null) {
                const start = parseFloat(match[1]);
                const duration = parseFloat(match[2]);
                const end = start + duration;
                const startTime = formatTime(start);
                const endTime = formatTime(end);
                const rawText = match[3] || '';
                const text = decodeHTMLEntities(rawText.replace(/<[^>]+>/g, "").trim());
                if (text) {
                    lines.push(`${index}\n${startTime} --> ${endTime}\n${text}\n\n`);
                    console.log(`Linha ${index}: ${text}`);
                    index++;
                }
            }
            const result = lines.join('');
            if (!result) console.log('Nenhuma legenda encontrada no XML');
            return result;
        }

        function convertXmlToPlainText(xmlContent) {
            console.log('XML para TXT:', xmlContent.slice(0, 200));
            const textSegments = [];
            const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
            let match;
            while ((match = textRegex.exec(xmlContent)) !== null) {
                const rawText = match[1] || '';
                const cleanText = decodeHTMLEntities(rawText.replace(/<[^>]+>/g, "").replace(/\n/g, " ").trim());
                if (cleanText) {
                    textSegments.push(cleanText);
                    console.log('Segmento TXT:', cleanText);
                }
            }
            const result = textSegments.join(" ").trim();
            if (!result) console.log('Nenhum texto puro extraído do XML');
            return result;
        }

        function formatTime(seconds) {
            const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            const millis = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
            return `${hours}:${minutes}:${secs},${millis}`;
        }

        async function downloadSubtitle(subtitle) {
            try {
                const response = await fetch(subtitle.baseUrl);
                if (!response.ok) throw new Error('Falha ao buscar legenda');
                const xmlContent = await response.text();
                const srtContent = convertXmlToSrt(xmlContent);
                const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                GM_download({ url, name: `${subtitle.languageName}.srt`, saveAs: true });
            } catch (error) {
                alert(`Erro ao baixar legenda: ${error.message}`);
            }
        }

        async function downloadTranslatedSubtitle(subtitle) {
            try {
                const translatedUrl = `${subtitle.baseUrl}&tlang=pt`;
                const response = await fetch(translatedUrl);
                if (!response.ok) throw new Error('Falha ao buscar legenda traduzida');
                const xmlContent = await response.text();
                const srtContent = convertXmlToSrt(xmlContent);
                const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                GM_download({ url, name: `${subtitle.languageName}_PT-BR.srt`, saveAs: true });
            } catch (error) {
                alert(`Erro ao baixar legenda traduzida: ${error.message}`);
            }
        }

        async function getAvailableSubtitles() {
            let playerResponse = window.ytInitialPlayerResponse;

            if (location.hostname.includes('youtube.com')) {
                const player = document.querySelector('#movie_player') || document.querySelector('ytd-player');
                if (player && player.getPlayerResponse) {
                    playerResponse = player.getPlayerResponse();
                } else {
                    const videoId = getVideoIdFromUrl();
                    if (videoId) {
                        try {
                            const response = await fetch(`/watch?v=${videoId}`, { method: 'GET' });
                            const html = await response.text();
                            const match = html.match(/ytInitialPlayerResponse\s*=\s*({.*?});/);
                            if (match && match[1]) {
                                playerResponse = JSON.parse(match[1]);
                            }
                        } catch (e) {
                            console.log("Erro ao tentar atualizar playerResponse:", e);
                        }
                    }
                }
            }

            if (!playerResponse || !playerResponse.captions) {
                throw new Error("Nenhuma legenda encontrada para o vídeo atual.");
            }
            const captions = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
            return captions.map(track => ({
                languageCode: track.languageCode,
                languageName: track.name.simpleText,
                baseUrl: track.baseUrl,
                kind: track.kind
            }));
        }

        async function downloadSubtitleTxt(subtitle) {
            try {
                console.log('Tentando baixar TXT puro para:', subtitle.baseUrl);
                const response = await fetch(subtitle.baseUrl);
                if (!response.ok) throw new Error(`Falha ao buscar legenda: Status ${response.status}`);
                const xmlContent = await response.text();
                console.log('XML recebido:', xmlContent.slice(0, 100)); // Log parcial para debug
                const plainText = convertXmlToPlainText(xmlContent);
                if (!plainText) throw new Error('Nenhum texto puro gerado a partir do XML');
                console.log('Texto puro gerado:', plainText.slice(0, 100)); // Log parcial
                const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const fileName = subtitle.languageName ? `${subtitle.languageName}_txt-puro.txt` : 'subtitulo_txt-puro.txt';
                GM_download({ url, name: fileName, saveAs: true });
                console.log('Download iniciado para:', fileName);
            } catch (error) {
                console.error('Erro em downloadSubtitleTxt:', error);
                showOverlayConfirmationAutoClose("Erro ao baixar legenda TXT-puro", error.message);
            }
        }

        async function getThumbnailUrl() {
            if (!location.hostname.includes('youtube.com')) {
                throw new Error("Somente no YouTube.");
            }
            const videoId = getVideoIdFromUrl();
            if (!videoId) {
                throw new Error("Nenhum ID de vídeo encontrado na URL.");
            }
            const thumbnailUrls = [
                `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/default.jpg`,
                `https://i.ytimg.com/vi/${videoId}/maxresdefault_v.jpg`,
                `https://i.ytimg.com/vi/${videoId}/sddefault_v.jpg`,
                `https://i.ytimg.com/vi/${videoId}/hqdefault_v.jpg`,
                `https://i.ytimg.com/vi/${videoId}/mqdefault_v.jpg`
            ];
            let thumbnailUrl = null;
            for (const url of thumbnailUrls) {
                const resp = await fetch(url, { method: 'HEAD' });
                if (resp.ok) {
                    thumbnailUrl = url;
                    break;
                }
            }
            if (!thumbnailUrl) {
                throw new Error("Nenhuma thumbnail disponível para este vídeo.");
            }
            return { thumbnailUrl, videoId };
        }

        async function showThumbnailMenu() {
            try {
                const { thumbnailUrl, videoId } = await getThumbnailUrl();
                const menu = document.createElement('div');
                menu.className = 'draggable-menu thumbnail-menu';
                Object.assign(menu.style, {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                });

                const h3 = document.createElement('h3');
                h3.textContent = 'Thumbnail';
                menu.appendChild(h3);

                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const img = document.createElement('img');
                img.src = thumbnailUrl;
                img.onload = () => {
                    const naturalWidth = img.naturalWidth;
                    const naturalHeight = img.naturalHeight;
                    h3.textContent = `Thumbnail melhor qualidade ${naturalWidth}x${naturalHeight}`;
                    if (naturalWidth <= 960 && naturalHeight <= 460) {
                        img.style.width = `${naturalWidth}px`;
                        img.style.height = `${naturalHeight}px`;
                    } else {
                        const aspectRatio = naturalWidth / naturalHeight;
                        if (naturalWidth > 960) {
                            img.style.width = '960px';
                            img.style.height = `${960 / aspectRatio}px`;
                        }
                        if (parseInt(img.style.height) > 460) {
                            img.style.height = '460px';
                            img.style.width = `${460 * aspectRatio}px`;
                        }
                    }
                };
                Object.assign(img.style, {
                    maxWidth: '960px',
                    maxHeight: '460px'
                });
                imageContainer.appendChild(img);
                menu.appendChild(imageContainer);

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Baixar';
                downloadBtn.className = 'btn-default';
                downloadBtn.addEventListener('click', () => {
                    GM_download({
                        url: thumbnailUrl,
                        name: `thumbnail_${videoId}.jpg`,
                        saveAs: true
                    });
                });
                buttonContainer.appendChild(downloadBtn);

                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Fechar';
                closeBtn.className = 'btn-toggle';
                closeBtn.addEventListener('click', () => menu.remove());
                buttonContainer.appendChild(closeBtn);

                menu.appendChild(buttonContainer);

                document.body.appendChild(menu);
                makeDraggable(menu);
            } catch (error) {
                showOverlayConfirmationAutoClose("Aviso", error.message);
            }
        }

        async function downloadThumbnail() {
            try {
                const { thumbnailUrl, videoId } = await getThumbnailUrl();
                GM_download({
                    url: thumbnailUrl,
                    name: `thumbnail_${videoId}.jpg`,
                    saveAs: true
                });
                showOverlayConfirmationAutoClose("Thumbnail Baixada!", "A thumbnail foi baixada com sucesso.");
            } catch (error) {
                showOverlayConfirmationAutoClose("Aviso", error.message);
            }
        }

        async function copyThumbnailImage() {
            if (!location.hostname.includes('youtube.com')) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no YouTube.");
                return;
            }
            try {
                const { thumbnailUrl } = await getThumbnailUrl();
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = thumbnailUrl;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
                const clipboardItem = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([clipboardItem]);
                showOverlayConfirmationAutoClose("Thumbnail Copiada!", "A imagem foi copiada para a área de transferência.");
            } catch (error) {
                showOverlayConfirmationAutoClose("Aviso", error.message);
            }
        }

        function getVideoIdFromUrl() {
            const url = new URL(window.location.href);
            if (url.pathname.includes('/shorts/')) {
                return url.pathname.split('/shorts/')[1]?.split('?')[0];
            }
            const urlParams = new URLSearchParams(url.search);
            return urlParams.get('v');
        }

        async function scribdDownLogic() {
            if (!location.hostname.includes('scribd.com')) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no Scribd.");
                return;
            }
            const url = window.location.href;
            const match = url.match(/\/document\/(\d+)\/([^\/]+)/);
            if (match) {
                const [, documentId, documentName] = match;
                const newUrl = `https://scribd.downloader.tips/document/${documentId}/${documentName}`;
                window.open(newUrl, '_blank');
            } else {
                showOverlayConfirmationAutoClose("Erro", "Não foi possível encontrar o ID/nome do documento na URL.");
            }
        }

        function createScribdDownButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Scribd down';
            btn.className = 'btn-default';
            btn.title = 'Estando na página de leitura, baixa o livro';
            btn.addEventListener('click', scribdDownLogic);
            return btn;
        }

        function createZLibraryButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Z-Library';
            btn.className = 'btn-default';
            btn.title = 'Baixa o livro';
            btn.addEventListener('click', () => {
                const originalDownloadLink = document.querySelector('a.addDownloadedBook')?.href;
                if (originalDownloadLink) {
                    window.open(originalDownloadLink, '_blank');
                } else {
                    showOverlayConfirmationAutoClose("Erro", "Link de download da Z-Library não encontrado.");
                }
            });
            return btn;
        }

        function createYoutubeCopyLinkYTButton() {
            const btn = document.createElement('button');
            btn.textContent = 'copy-link-yt';
            btn.className = 'btn-default';
            btn.title = 'Copia o link do YouTube já com o comando de download';
            btn.addEventListener('click', () => {
                const url = window.location.href;
                if (location.hostname.includes('youtube.com')) {
                    const command = `yt-dlp -f "136+140" ${url}`;
                    GM_setClipboard(command, 'text');
                    showOverlayConfirmationAutoClose("Link Copiado!", "O link com comando yt-dlp foi copiado para a área de transferência.");
                } else {
                    GM_setClipboard(url, 'text');
                    showOverlayConfirmationAutoClose("Aviso", "Não é YouTube. Link simples foi copiado para a área de transferência.");
                }
            });
            return btn;
        }

        function createCopyLinkButton() {
            const btn = document.createElement('button');
            btn.textContent = 'copy-link';
            btn.className = 'btn-default';
            btn.title = 'Copia o link normal atual';
            btn.addEventListener('click', () => {
                GM_setClipboard(window.location.href, 'text');
                showOverlayConfirmationAutoClose("Link Copiado!", "O link foi copiado para a área de transferência.");
            });
            return btn;
        }

        function createActivateClickCopyButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Ativa click-copy';
            btn.className = 'btn-default';
            btn.title = 'Remove bloqueio de selecionar e copiar';
            btn.addEventListener('click', activateClickCopy);
            return btn;
        }

        function activateClickCopy() {
            const styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.textContent = `* { -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important; }`;
            document.head.appendChild(styleElement);
            document.oncontextmenu = null;
            document.onselectstart = null;
            document.ondragstart = null;
            document.onmousedown = null;
            if (document.body) {
                document.body.oncontextmenu = null;
                document.body.onselectstart = null;
                document.body.ondragstart = null;
                document.body.onmousedown = null;
                document.body.oncut = null;
                document.body.oncopy = null;
                document.body.onpaste = null;
            }
            ['copy', 'cut', 'paste', 'select', 'selectstart'].forEach(eventType => {
                document.addEventListener(eventType, e => e.stopPropagation(), true);
            });
            showOverlayConfirmationAutoClose("Ativa click-copy", "Agora pode selecionar e copiar!");
        }

        function togglePaywallOff() {
            if (window.location.href.includes("page.ke/urls/read")) {
                const params = new URLSearchParams(window.location.search);
                const originalUrl = params.get("url");
                if (originalUrl) {
                    window.location.href = originalUrl;
                }
            } else {
                const currentUrl = window.location.href;
                const pageTitle = document.title;
                const noPaywallUrl = `https://page.ke/urls/read?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(pageTitle)}`;
                window.location.href = noPaywallUrl;
            }
        }

        function updatePaywallOffButtonStyle(btn) {
            if (window.location.href.includes("page.ke/urls/read")) {
                btn.style.backgroundColor = "#00ff00";
                btn.style.color = "#000";
                btn.textContent = "Paywall OFF";
                btn.setAttribute("data-active", "true");
            } else {
                btn.style.backgroundColor = "#ff0000";
                btn.style.color = "#fff";
                btn.textContent = "Paywall";
                btn.removeAttribute("data-active");
            }
        }

        function createPaywallOffButton() {
            const btn = document.createElement('button');
            btn.setAttribute('translate', 'no');
            btn.className = 'btn-default';
            btn.title = 'Tenta remover o bloqueio que exige assinatura em sites de notícias';
            btn.addEventListener('click', togglePaywallOff);
            updatePaywallOffButtonStyle(btn);
            setInterval(() => updatePaywallOffButtonStyle(btn), 500);
            return btn;
        }

        function createSubsTxtPuroButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Subs → txt-puro';
            btn.className = 'btn-default';
            btn.title = 'Copia transcrição em texto puro e em linha única';
            btn.addEventListener('click', showSubsTxtMenu);
            return btn;
        }

        async function showSubsTxtMenu() {
            if (!location.hostname.includes('youtube.com')) {
                showOverlayConfirmationAutoClose("Aviso", "Somente no YouTube.");
                return;
            }
            try {
                const subtitles = await getAvailableSubtitles();
                if (subtitles.length === 0) {
                    alert("Nenhuma legenda disponível para este vídeo.");
                    return;
                }
                const menu = createSubsTxtMenu(subtitles);
                document.body.appendChild(menu);
            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        }

        function createSubsTxtMenu(subtitles) {
            const menu = document.createElement('div');
            menu.className = 'draggable-menu';
            Object.assign(menu.style, {
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                minWidth: '300px'
            });
            const header = document.createElement('h3');
            header.textContent = 'Legendas TXT-puro Disponíveis';
            Object.assign(header.style, {
                fontSize: '12px'
            });
            menu.appendChild(header);
            const container = document.createElement('div');
            container.className = 'container';
            subtitles.forEach(subtitle => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                const label = document.createElement('span');
                label.textContent = subtitle.languageName + (subtitle.kind ? " (ASR)" : " (Dono)");
                Object.assign(label.style, {
                    display: 'block',
                    marginBottom: '5px',
                    color: ((subtitle.languageName.toLowerCase().includes("português") && !subtitle.kind) ||
                            subtitle.languageName.toLowerCase().includes("inglês"))
                            ? "yellow"
                            : "white",
                    fontSize: '10px'
                });
                div.appendChild(label);
                const btnDownload = document.createElement('button');
                btnDownload.textContent = 'Baixar TXT-puro';
                btnDownload.className = 'btn-default';
                btnDownload.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await downloadSubtitleTxt(subtitle);
                });
                div.appendChild(btnDownload);
                container.appendChild(div);
            });
            menu.appendChild(container);
            const btnFechar = document.createElement('button');
            btnFechar.textContent = 'Fechar';
            Object.assign(btnFechar.style, {
                background: '#ffff00',
                border: 'none',
                color: '#000',
                padding: '3px 8px',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '10px',
                marginTop: '10px'
            });
            btnFechar.addEventListener('click', () => menu.remove());
            menu.appendChild(btnFechar);
            makeDraggable(menu);
            return menu;
        }

        function createYoutubeTranscriptButton() {
            const btn = document.createElement('button');
            btn.textContent = '📥 Transcrição';
            btn.className = 'btn-default';
            btn.title = 'Copia a transcrição';
            btn.addEventListener('click', copyTranscript);
            return btn;
        }

        function createYoutubeLegendasButton() {
            const btn = document.createElement('button');
            btn.textContent = '📖 Legendas';
            btn.className = 'btn-default';
            btn.title = 'Copia legendas';
            btn.addEventListener('click', showLegendasMenu);
            return btn;
        }

        function createYoutubeThumbnailButton() {
            const btn = document.createElement('button');
            btn.textContent = '🖼️ Thumbnail';
            btn.className = 'btn-default';
            btn.title = 'Veja a thumbnail e baixe';
            btn.addEventListener('click', showThumbnailMenu);
            return btn;
        }

        function createYoutubeCopyThumbButton() {
            const btn = document.createElement('button');
            btn.textContent = '📋 Copy Thumb';
            btn.className = 'btn-default';
            btn.title = 'Copia a thumbnail diretamente';
            btn.addEventListener('click', copyThumbnailImage);
            return btn;
        }

        function createYoutubeMenuButton() {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';

            const mainBtn = document.createElement('button');
            mainBtn.textContent = 'YOUTUBE';
            mainBtn.className = 'btn-default';
            mainBtn.title = 'Menu com funções do YouTube';
            mainBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (submenu.style.visibility === 'visible') {
                    submenu.style.visibility = 'hidden';
                    submenu.style.opacity = '0';
                    mainBtn.removeAttribute("data-active");
                } else {
                    submenu.style.visibility = 'visible';
                    submenu.style.opacity = '1';
                    mainBtn.setAttribute("data-active", "true");
                }
            });
            container.appendChild(mainBtn);

            const submenu = document.createElement('div');
            submenu.style.position = 'fixed';
            submenu.style.visibility = 'hidden';
            submenu.style.opacity = '0';
            submenu.style.backgroundColor = '#000';
            submenu.style.border = '1px solid #fff';
            submenu.style.borderRadius = '4px';
            submenu.style.padding = '8px';
            submenu.style.zIndex = '10000001';
            submenu.style.transition = 'opacity 0.2s';
            submenu.style.minWidth = '120px';
            submenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

            const btnComentarios = createComentariosButton();
            const btnTranscript = createYoutubeTranscriptButton();
            const btnLegendas = createYoutubeLegendasButton();
            const btnSubsTxtPuro = createSubsTxtPuroButton();
            const btnThumbnail = createYoutubeThumbnailButton();
            const btnCopyThumb = createYoutubeCopyThumbButton();
            const btnCopyLinkYT = createYoutubeCopyLinkYTButton();


            [btnComentarios, btnTranscript, btnLegendas, btnSubsTxtPuro, btnThumbnail, btnCopyThumb, btnCopyLinkYT].forEach(btn => {
                btn.style.display = 'block';
                btn.style.width = '100%';
                btn.style.margin = '4px 0';
                submenu.appendChild(btn);
            });

            mainBtn.addEventListener('click', (e) => {
                const rect = mainBtn.getBoundingClientRect();
                submenu.style.top = (rect.bottom + 5) + 'px';
                submenu.style.left = rect.left + 'px';
            });

            document.body.appendChild(submenu);

            document.addEventListener('click', function(event) {
                if (event.target !== mainBtn && !submenu.contains(event.target)) {
                    submenu.style.visibility = 'hidden';
                    submenu.style.opacity = '0';
                    mainBtn.removeAttribute("data-active");
                }
            });

            return container;
        }

        // Função para criar o menu PDFs (submenu)
        function createPDFsMenuButton() {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';

            const mainBtn = document.createElement('button');
            mainBtn.textContent = 'PDFs';
            mainBtn.className = 'btn-default';
            mainBtn.title = 'Menu com opções de downloads de PDFs';
            mainBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (submenu.style.visibility === 'visible') {
                    submenu.style.visibility = 'hidden';
                    submenu.style.opacity = '0';
                    mainBtn.removeAttribute("data-active");
                } else {
                    submenu.style.visibility = 'visible';
                    submenu.style.opacity = '1';
                    mainBtn.setAttribute("data-active", "true");
                }
            });
            container.appendChild(mainBtn);

            const submenu = document.createElement('div');
            submenu.style.position = 'fixed';
            submenu.style.visibility = 'hidden';
            submenu.style.opacity = '0';
            submenu.style.backgroundColor = '#000';
            submenu.style.border = '1px solid #fff';
            submenu.style.borderRadius = '4px';
            submenu.style.padding = '8px';
            submenu.style.zIndex = '10000001';
            submenu.style.transition = 'opacity 0.2s';
            submenu.style.minWidth = '120px';
            submenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

            const btnScribdDown = createScribdDownButton();
            const btnZLibrary = createZLibraryButton();

            [btnScribdDown, btnZLibrary].forEach(btn => {
                btn.style.display = 'block';
                btn.style.width = '100%';
                btn.style.margin = '4px 0';
                submenu.appendChild(btn);
            });

            mainBtn.addEventListener('click', (e) => {
                const rect = mainBtn.getBoundingClientRect();
                submenu.style.top = (rect.bottom + 5) + 'px';
                submenu.style.left = rect.left + 'px';
            });

            document.body.appendChild(submenu);

            document.addEventListener('click', function(event) {
                if (event.target !== mainBtn && !submenu.contains(event.target)) {
                    submenu.style.visibility = 'hidden';
                    submenu.style.opacity = '0';
                    mainBtn.removeAttribute("data-active");
                }
            });

            return container;
        }

        // Turbo Loader
        function createTurboLoaderButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Turbo Loader';
            btn.className = 'btn-default';
            btn.title = 'Acelera o carregamento de sites e imagens';
            btn.id = 'btnTurboLoader';

            // Verificar estado salvo
            const isTurboActive = GM_getValue('turbo_loader_active', false);
            if (isTurboActive) {
                btn.setAttribute("data-active", "true");
                btn.style.backgroundColor = '#00ff00';
                btn.style.color = '#000';
            }

            btn.addEventListener('click', toggleTurboLoader);
            return btn;
        }

        let turboLoaderActive = GM_getValue('turbo_loader_active', false);
        let turboObserver = null;
        let activeRequests = 0;
        const TURBO_CONFIG = {
            maxThreads: 8,
            requestDelay: 50,
            chunkSize: 10,
            maxActiveRequests: 20
        };

        function toggleTurboLoader() {
            const btn = document.getElementById('btnTurboLoader');
            turboLoaderActive = !turboLoaderActive;

            if (turboLoaderActive) {
                // Não ativar no YouTube
                if (window.location.hostname.includes('youtube.com')) {
                    showOverlayConfirmationAutoClose("Aviso", "Turbo Loader não funciona no YouTube");
                    turboLoaderActive = false;
                    GM_setValue('turbo_loader_active', false);
                    return;
                }

                btn.setAttribute("data-active", "true");
                btn.style.backgroundColor = '#00ff00';
                btn.style.color = '#000';
                initTurboLoader();
                showOverlayConfirmationAutoClose("Turbo Loader Ativado", "Carregamento acelerado está ligado");
            } else {
                btn.removeAttribute("data-active");
                btn.style.backgroundColor = '#ff0000';
                btn.style.color = '#fff';
                disableTurboLoader();
                showOverlayConfirmationAutoClose("Turbo Loader Desativado", "Carregamento acelerado está desligado");
            }

            // Salvar estado
            GM_setValue('turbo_loader_active', turboLoaderActive);
        }

        function initTurboLoader() {
            if (window.location.hostname.includes('youtube.com')) return;

            if (turboObserver) turboObserver.disconnect();

            // Primeiro, aceleramos as imagens e recursos já existentes
            accelerateExistingResources();

            // Observer para novos elementos
            turboObserver = new MutationObserver(mutations => {
                if (!turboLoaderActive) return;

                mutations.forEach(({addedNodes}) => {
                    addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            accelerateElement(node);

                            // Procurar por elementos dentro do nó adicionado
                            if (node.querySelectorAll) {
                                node.querySelectorAll('img, link[rel="stylesheet"], script[src]').forEach(el => {
                                    accelerateElement(el);
                                });
                            }
                        }
                    });
                });
            });

            turboObserver.observe(document, {
                childList: true,
                subtree: true
            });

            // Interceptar fetch e XMLHttpRequest
            setupFetchInterceptor();
        }

        function disableTurboLoader() {
            if (turboObserver) {
                turboObserver.disconnect();
                turboObserver = null;
            }

            // Restaurar os interceptadores originais
            if (window.originalFetch) {
                window.fetch = window.originalFetch;
            }
        }

        function accelerateExistingResources() {
            // Acelerar imagens
            document.querySelectorAll('img:not([data-turbo-accelerated])').forEach(img => {
                accelerateElement(img);
            });

            // Acelerar CSS
            document.querySelectorAll('link[rel="stylesheet"]:not([data-turbo-accelerated])').forEach(link => {
                accelerateElement(link);
            });

            // Acelerar scripts (com cuidado)
            document.querySelectorAll('script[src]:not([data-turbo-accelerated])').forEach(script => {
                accelerateElement(script);
            });
        }

        function accelerateElement(element) {
            if (!element || element.hasAttribute('data-turbo-accelerated')) return;

            element.setAttribute('data-turbo-accelerated', 'true');

            if (element.tagName === 'IMG' && element.src && !element.src.startsWith('data:')) {
                accelerateImage(element);
            }
            else if (element.tagName === 'LINK' && element.rel === 'stylesheet' && element.href) {
                prefetchResource(element.href, 'style');
            }
            else if (element.tagName === 'SCRIPT' && element.src) {
                prefetchResource(element.src, 'script');
            }
        }

        function accelerateImage(img) {
            if (!img.src || img.complete || img.src.startsWith('data:')) return;

            // Não mexer com vídeos ou YouTube
            if (
                img.closest('video') ||
                window.location.hostname.includes('youtube.com') ||
                img.src.includes('youtube.com') ||
                img.src.includes('youtu.be')
            ) return;

            // Para imagens, vamos fazer um fetch em chunks
            if (activeRequests < TURBO_CONFIG.maxActiveRequests) {
                activeRequests++;

                const originalSrc = img.src;

                // Adicionar parâmetro para evitar cache
                const turboSrc = originalSrc.includes('?')
                    ? `${originalSrc}&turbo_nocache=${Date.now()}`
                    : `${originalSrc}?turbo_nocache=${Date.now()}`;

                fetchInChunks(turboSrc)
                    .then(blob => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const newImg = new Image();
                            newImg.onload = () => {
                                if (img.parentNode) {
                                    img.src = url;
                                }
                                URL.revokeObjectURL(url);
                            };
                            newImg.src = url;
                        }
                    })
                    .catch(() => {})
                    .finally(() => {
                        activeRequests--;
                    });
            }
        }

        function fetchInChunks(url) {
            return new Promise((resolve, reject) => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = 'blob';

                    // Configurar para receber em chunks
                    xhr.onprogress = function(event) {
                        if (event.lengthComputable && event.loaded === event.total) {
                            // Já temos tudo!
                            resolve(xhr.response);
                        }
                    };

                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error(`Status ${xhr.status}`));
                        }
                    };

                    xhr.onerror = reject;
                    xhr.send();
                } catch (e) {
                    reject(e);
                }
            });
        }

        function prefetchResource(url, type) {
            if (activeRequests >= TURBO_CONFIG.maxActiveRequests) return;

            activeRequests++;

            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = type;
            link.href = url;

            link.onload = link.onerror = () => {
                activeRequests--;
                setTimeout(() => link.remove(), 5000);
            };

            document.head.appendChild(link);
        }

        function setupFetchInterceptor() {
            // Salvar o fetch original
            if (!window.originalFetch) {
                window.originalFetch = window.fetch;
            }

            // Substituir o fetch
            window.fetch = function(...args) {
                if (!turboLoaderActive) {
                    return window.originalFetch.apply(this, args);
                }

                const [resource, config] = args;

                // Não interferir com requisições para o YouTube
                if (typeof resource === 'string' && (
                    resource.includes('youtube.com') ||
                    resource.includes('youtu.be') ||
                    window.location.hostname.includes('youtube.com'))) {
                    return window.originalFetch.apply(this, args);
                }

                // Para outras requisições, adicionar cabeçalhos de performance
                const newConfig = {...config};
                if (!newConfig.headers) {
                    newConfig.headers = {};
                }

                // Isto ajuda a obter respostas mais rápidas
                if (newConfig.headers instanceof Headers) {
                    newConfig.headers.append('Cache-Control', 'no-store');
                    newConfig.headers.append('Pragma', 'no-cache');
                } else {
                    newConfig.headers['Cache-Control'] = 'no-store';
                    newConfig.headers['Pragma'] = 'no-cache';
                }

                // Adicionar timestamp para evitar cache
                let url = resource;
                if (typeof url === 'string') {
                    url = url.includes('?')
                        ? `${url}&_turbo=${Date.now()}`
                        : `${url}?_turbo=${Date.now()}`;
                }

                // Criar promise com timeout mais curto
                return Promise.race([
                    window.originalFetch.call(this, url, newConfig),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 15000)
                    )
                ]).catch(() => window.originalFetch.apply(this, args));
            };
        }

        function createUrlBar() {
            if (!urlBarContainer) {
                urlBarContainer = document.createElement('div');
                urlBarContainer.id = 'urlBarContainer';
                Object.assign(urlBarContainer.style, {
                    position: 'fixed',
                    top: `${barOriginalHeight}px`,
                    left: '0',
                    width: '100%',
                    backgroundColor: '#d3d3d3',
                    zIndex: '9999999',
                    padding: '5px 10px',
                    boxSizing: 'border-box',
                    borderBottom: '4px solid #000',
                    display: 'none'
                });

                const urlInput = document.createElement('input');
                urlInput.type = 'text';
                urlInput.id = 'fullUrlInput';
                Object.assign(urlInput.style, {
                    width: '100%',
                    border: '1px solid #ccc',
                    padding: '5px',
                    fontSize: '10px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff',
                    color: '#000'
                });
                urlInput.value = window.location.href;
                urlInput.addEventListener('click', () => urlInput.select());
                urlInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        let newUrl = urlInput.value.trim();
                        if (!newUrl.match(/^https?:\/\//)) {
                            newUrl = 'https://' + newUrl;
                        }
                        try {
                            window.location.href = newUrl;
                        } catch (err) {
                            console.error('Erro ao navegar para o URL:', err);
                            showOverlayConfirmationAutoClose("Erro", "URL inválido. Verifique e tente novamente.");
                        }
                    }
                });

                urlBarContainer.appendChild(urlInput);
                document.body.appendChild(urlBarContainer);
                console.log('Barra de URL criada e adicionada ao DOM');
            }
            return urlBarContainer;
        }

        function toggleUrlBar() {
            const btnUrlFull = document.getElementById('btnUrlFull');
            if (!urlBarActive) {
                if (!urlBarContainer) {
                    createUrlBar();
                }
                urlBarContainer.style.display = 'block';
                urlBarContainer.querySelector('#fullUrlInput').value = window.location.href;
                btnUrlFull.style.backgroundColor = '#00ff00';
                btnUrlFull.style.color = '#000';
                btnUrlFull.setAttribute('data-active', 'true');
                urlBarActive = true;
                if (!barHidden) applyPushDownWithUrlBar();
                console.log('Barra de URL exibida');
            } else {
                urlBarContainer.style.display = 'none';
                btnUrlFull.style.backgroundColor = '#ff0000';
                btnUrlFull.style.color = '#fff';
                btnUrlFull.removeAttribute('data-active');
                urlBarActive = false;
                if (!barHidden) applyPushDown();
                console.log('Barra de URL oculta');
            }
        }

        function applyPushDownWithUrlBar() {
            console.log('Aplicando push down com barra de URL');
            if (youtubeApp && youtubeMasthead) {
                const urlBarHeight = '80px'; // Altura da barra fixa (40px) + barra de URL (40px)
                youtubeMasthead.style.setProperty('margin-top', urlBarHeight, 'important');
                console.log('Masthead ajustado para margin-top com URL bar:', urlBarHeight);
                const miniGuide = youtubeApp.querySelector('ytd-mini-guide-renderer, ytd-guide-renderer');
                if (miniGuide) {
                    miniGuide.style.setProperty('margin-top', urlBarHeight, 'important');
                    console.log('Mini-guide ajustado para margin-top com URL bar:', urlBarHeight);
                }
                const content = youtubeApp.querySelector('#content');
                if (content) {
                    content.style.setProperty('margin-top', `calc(${urlBarHeight} + 56px)`, 'important');
                    console.log('Content ajustado para margin-top com URL bar: calc(80px + 56px)');
                }
                youtubeApp.style.paddingTop = '0';
            } else if (protonHeader && protonMain) {
                updateMargin([protonHeader, protonMain], '80px');
            } else {
                updateMargin([document.body], '80px');
            }
        }

        function updateUrlBarOnNavigation() {
            if (urlBarActive && urlBarContainer) {
                urlBarContainer.querySelector('#fullUrlInput').value = window.location.href;
                console.log('URL atualizada na barra:', window.location.href);
            }
        }

        function createUrlFullButton() {
            const btn = document.createElement('button');
            btn.id = 'btnUrlFull';
            btn.textContent = 'URL-FULL';
            btn.className = 'btn-default';
            btn.title = 'Veja o link inteiro';
            btn.addEventListener('click', toggleUrlBar);
            return btn;
        }

        let btnIMGs;
        let imgsActive = false;

        function getBestSrcset(img) {
            if (img.srcset) {
                const srcsetEntries = img.srcset.split(',').map(entry => entry.trim().split(' '));
                let bestUrl = img.src;
                let maxWidth = 0;
                for (const [url, descriptor] of srcsetEntries) {
                    if (descriptor) {
                        const width = parseFloat(descriptor.replace('w', ''));
                        if (width > maxWidth) {
                            maxWidth = width;
                            bestUrl = url;
                        }
                    } else {
                        bestUrl = url;
                    }
                }
                return bestUrl;
            }
            return img.src;
        }

        function blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }

        function addImgOverlays() {
            const allImgs = document.querySelectorAll("img");
            allImgs.forEach(img => {
                const parent = img.parentElement;
                if (window.getComputedStyle(parent).position === "static") {
                    parent.style.position = "relative";
                }
                if (!parent.querySelector(".img-overlay-container")) {
                    const overlayContainer = document.createElement("div");
                    overlayContainer.classList.add("img-overlay-container");
                    Object.assign(overlayContainer.style, {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        gap: "10px",
                        zIndex: "10000"
                    });

                    const overlayLink = document.createElement("div");
                    overlayLink.textContent = "🔗";
                    Object.assign(overlayLink.style, {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        padding: "2px 4px",
                        fontSize: "12px",
                        cursor: "pointer"
                    });
                    overlayLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = getBestSrcset(img);
                        console.log("Tentando copiar URL direto da imagem:", url);
                        if (url) {
                            navigator.clipboard.writeText(url).then(() => {
                                overlayLink.style.backgroundColor = "#01cd5d";
                                setTimeout(() => overlayLink.style.backgroundColor = "rgba(0,0,0,0.5)", 500);
                            }).catch(err => {
                                console.error("Falha ao copiar o link da imagem:", err);
                                showOverlayConfirmationAutoClose("Erro", "Não foi possível copiar o link da imagem.");
                            });
                        } else {
                            console.error("Nenhum URL direto encontrado para a imagem.");
                            showOverlayConfirmationAutoClose("Erro", "Imagem sem URL direto disponível.");
                        }
                    });
                    overlayContainer.appendChild(overlayLink);

                    const overlayCopy = document.createElement("div");
                    overlayCopy.textContent = "📋";
                    Object.assign(overlayCopy.style, {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        padding: "2px 4px",
                        fontSize: "12px",
                        cursor: "pointer"
                    });
                    overlayCopy.addEventListener("click", async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = getBestSrcset(img);
                        console.log("Tentando copiar imagem da URL:", url);

                        const tryStandardMethod = () => {
                            return new Promise((resolve, reject) => {
                                const image = new Image();
                                image.crossOrigin = "Anonymous";
                                image.src = url;
                                image.onload = () => resolve(image);
                                image.onerror = () => reject(new Error("Falha ao carregar a imagem (CORS ou outro erro)"));
                            });
                        };

                        const tryGMXmlHttpRequest = () => {
                            return new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: url,
                                    headers: { "Referer": window.location.origin + "/" },
                                    responseType: "blob",
                                    onload: (response) => {
                                        if (response.status === 200) {
                                            blobToBase64(response.response).then(base64 => {
                                                const image = new Image();
                                                image.src = base64;
                                                image.onload = () => resolve(image);
                                                image.onerror = () => reject(new Error("Falha ao carregar a imagem do base64"));
                                            }).catch(err => reject(err));
                                        } else {
                                            reject(new Error(`Falha na requisição GM_xmlhttpRequest: Status ${response.status}`));
                                        }
                                    },
                                    onerror: () => reject(new Error("Erro na requisição GM_xmlhttpRequest"))
                                });
                            });
                        };

                        try {
                            let image;
                            try {
                                image = await tryStandardMethod();
                            console.log("Método padrão bem-sucedido para:", url);
                        } catch (err) {
                            console.log("Método padrão falhou, tentando GM_xmlhttpRequest:", err);
                            image = await tryGMXmlHttpRequest();
                            console.log("Método GM_xmlhttpRequest bem-sucedido para:", url);
                        }

                        const canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);
                        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
                        const item = new ClipboardItem({ "image/png": blob });
                        await navigator.clipboard.write([item]);
                        overlayCopy.style.backgroundColor = "#01cd5d";
                        setTimeout(() => overlayCopy.style.backgroundColor = "rgba(0,0,0,0.5)", 500);
                    } catch (err) {
                        console.error("Erro ao copiar imagem:", err);
                        showOverlayConfirmationAutoClose("Erro", "Não foi possível copiar a imagem: " + err.message);
                    }
                });
                overlayContainer.appendChild(overlayCopy);
                parent.appendChild(overlayContainer);
            }
        });
    }

    function removeImgOverlays() {
        const allContainers = document.querySelectorAll(".img-overlay-container");
        allContainers.forEach(el => el.remove());
    }

    function toggleImgs() {
        imgsActive = !imgsActive;
        if (imgsActive) {
            btnIMGs.setAttribute("data-active", "true");
            addImgOverlays();
        } else {
            btnIMGs.removeAttribute("data-active");
            removeImgOverlays();
        }
    }

        let btnDataExposed;
        let dataExposedActive = false;
        let dataExposedMenu = null;

        async function collectExposedData() {
            const startTime = performance.now();
            const availableData = [];
            const unavailableData = [];

            let ipAddress = "Não disponível diretamente (requer API externa)";
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                ipAddress = ipData.ip;
            } catch (e) {
                console.log("Erro ao obter IP:", e);
            }
            if (ipAddress === "Não disponível diretamente (requer API externa)") {
                unavailableData.push(`Endereço IP: ${ipAddress} - Identifica sua conexão na internet.`);
            } else {
                availableData.push(`Endereço IP: ${ipAddress} - Identifica sua conexão na internet.`);
            }

            let geolocation = "Não disponível (permissão não concedida)";
            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    geolocation = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                } catch (e) {
                    console.log("Erro ao obter geolocalização:", e);
                }
            }
            if (geolocation === "Não disponível (permissão não concedida)") {
                unavailableData.push(`Localização geográfica: ${geolocation} - Rastreia sua posição física.`);
            } else {
                availableData.push(`Localização geográfica: ${geolocation} - Rastreia sua posição física.`);
            }

            const userAgent = navigator.userAgent;
            let browserName = "Desconhecido";
            if (navigator.brave && await navigator.brave.isBrave()) {
                browserName = "Brave";
            } else if (userAgent.includes("Vivaldi")) {
                browserName = "Vivaldi";
            } else if (userAgent.includes("UCBrowser")) {
                browserName = "UC Browser";
            } else if (userAgent.includes("SamsungBrowser")) {
                browserName = "Samsung Internet";
            } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
                browserName = "Opera";
            } else if (userAgent.includes("Edg")) {
                browserName = "Microsoft Edge";
            } else if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey")) {
                browserName = "Firefox";
            } else if (userAgent.includes("Chrome") && !userAgent.includes("Chromium")) {
                browserName = "Google Chrome";
            } else if (userAgent.includes("Chromium")) {
                browserName = "Chromium";
            } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium")) {
                browserName = "Safari";
            } else if (userAgent.includes("Seamonkey")) {
                browserName = "SeaMonkey";
            } else if (userAgent.includes("Tor")) {
                browserName = "Tor Browser";
            }
            availableData.push(`Navegador detectado: ${browserName} - Identificado a partir do User Agent: ${userAgent}`);

            const osMatch = navigator.userAgent.match(/(Windows|Mac OS|Linux|Android|iOS)/i);
            const os = osMatch ? osMatch[0] : "Desconhecido";
            availableData.push(`Sistema operacional: ${os} - Revela o SO em uso.`);

            availableData.push(`Resolução da tela: ${window.screen.width}x${window.screen.height} - Tamanho da tela.`);

            availableData.push(`Idioma do navegador: ${navigator.language || navigator.userLanguage} - Idioma preferido.`);

            availableData.push(`Cookies: ${document.cookie || "Nenhum cookie visível"} - Armazena informações de sessão.`);

            const sessionData = Object.entries(sessionStorage).map(([key, value]) => `${key}: ${value}`).join("; ") || "Nenhum dado";
            availableData.push(`Dados de sessão (sessionStorage): ${sessionData} - Informações temporárias.`);

            const localData = Object.entries(localStorage).map(([key, value]) => `${key}: ${value}`).join("; ") || "Nenhum dado";
            availableData.push(`Armazenamento local (localStorage): ${localData} - Informações persistentes.`);

            availableData.push(`URL atual: ${window.location.href} - Página visitada.`);

            availableData.push(`URL de referência: ${document.referrer || "Direto"} - Origem da navegação.`);

            const formData = Array.from(document.querySelectorAll('input, textarea')).map(input => `${input.name || input.id || "sem nome"}: ${input.value || "vazio"}`).join("; ") || "Nenhum formulário";
            availableData.push(`Dados de formulários preenchidos: ${formData} - Campos preenchidos na página.`);

            let batteryInfo = "Não disponível (API Battery Status não suportada)";
            if (navigator.getBattery) {
                try {
                    const battery = await navigator.getBattery();
                    batteryInfo = `Nível: ${(battery.level * 100).toFixed(0)}%, Carregando: ${battery.charging ? "Sim" : "Não"}`;
                } catch (e) {
                    console.log("Erro ao obter bateria:", e);
                }
            }
            if (batteryInfo === "Não disponível (API Battery Status não suportada)") {
                unavailableData.push(`Bateria do dispositivo: ${batteryInfo} - Estado da bateria.`);
            } else {
                availableData.push(`Bateria do dispositivo: ${batteryInfo} - Estado da bateria.`);
            }

            let usbDevices = "Não disponível (sem permissão ou suporte)";
            if (navigator.usb) {
                try {
                    const devices = await navigator.usb.getDevices();
                    usbDevices = devices.length > 0 ? devices.map(d => `${d.productName || "Desconhecido"} (ID: ${d.productId})`).join("; ") : "Nenhum dispositivo USB detectado";
                    if (usbDevices === "Nenhum dispositivo USB detectado") {
                        usbDevices += " - Acesso bloqueado pelas Big Techs! Dispositivos como pen drives, mouse e teclado estão ocultos por padrão, exigindo permissão explícita.";
                    }
                } catch (e) {
                    console.log("Erro ao obter dispositivos USB:", e);
                    usbDevices = "Erro ao acessar dispositivos USB - Controle restrito pelas Big Techs!";
                }
            }
            if (usbDevices === "Não disponível (sem permissão ou suporte)") {
                unavailableData.push(`Dispositivos USB conectados: ${usbDevices} - Dispositivos USB detectados.`);
            } else {
                availableData.push(`Dispositivos USB conectados: ${usbDevices} - Dispositivos USB detectados.`);
            }

            let bluetoothDevices = "Não disponível (sem permissão ou suporte)";
            if (navigator.bluetooth) {
                try {
                    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
                    bluetoothDevices = device.name || "Dispositivo Bluetooth genérico";
                } catch (e) {
                    console.log("Erro ao obter dispositivos Bluetooth:", e);
                    bluetoothDevices = "Permissão negada ou erro";
                }
            }
            if (bluetoothDevices === "Não disponível (sem permissão ou suporte)" || bluetoothDevices === "Permissão negada ou erro") {
                unavailableData.push(`Dispositivos Bluetooth conectados: ${bluetoothDevices} - Dispositivos Bluetooth detectados.`);
            } else {
                availableData.push(`Dispositivos Bluetooth conectados: ${bluetoothDevices} - Dispositivos Bluetooth detectados.`);
            }

            const cpuCores = navigator.hardwareConcurrency || "Desconhecido";
            if (cpuCores === "Desconhecido") {
                unavailableData.push(`Número de CPUs: ${cpuCores} - Núcleos disponíveis (As Big Techs escondem isso, mas ainda podem acessar seus dados de hardware para lucrar!).`);
            } else {
                availableData.push(`Número de CPUs: ${cpuCores} - Núcleos disponíveis (Vazado para as Big Techs sem seu consentimento, usado para rastreamento e lucro!).`);
            }
            const deviceMemory = navigator.deviceMemory || "Não disponível";
            if (deviceMemory === "Não disponível") {
                unavailableData.push(`Memória do dispositivo: ${deviceMemory} GB - Estimativa de RAM (As Big Techs limitam o que você vê, mas ainda coletam seus dados de memória para venda!).`);
            } else {
                availableData.push(`Memória do dispositivo: ${deviceMemory} GB - Estimativa de RAM (Exposto às Big Techs sem permissão, comercializado para lucrar com seu perfil!).`);
            }

            let webrtcLeaks = "Não disponível";
            if (window.RTCPeerConnection) {
                try {
                    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                    pc.createDataChannel("");
                    await pc.createOffer().then(offer => pc.setLocalDescription(offer));
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const sdp = pc.localDescription.sdp;
                    const ipRegex = /(\d+\.\d+\.\d+\.\d+)/g;
                    const ips = sdp.match(ipRegex) || [];
                    webrtcLeaks = ips.length > 0 ? ips.join(", ") : "Nenhum IP detectado diretamente";
                    pc.close();
                } catch (e) {
                    console.log("Erro ao obter WebRTC Leaks:", e);
                }
            }
            if (webrtcLeaks === "Não disponível") {
                unavailableData.push(`WebRTC Leaks: ${webrtcLeaks} - IPs locais/públicos expostos.`);
            } else {
                availableData.push(`WebRTC Leaks: ${webrtcLeaks} - IPs locais/públicos expostos.`);
            }

            const dnsPrefetch = Array.from(document.querySelectorAll('link[rel="dns-prefetch"]')).map(link => link.href).join("; ") || "Nenhum detectado";
            availableData.push(`DNS Prefetching: ${dnsPrefetch} - Domínios pré-carregados.`);

            const fontCheck = ["Arial", "Times New Roman", "Comic Sans MS"].map(font => {
                const span = document.createElement("span");
                span.style.fontFamily = font;
                document.body.appendChild(span);
                const available = window.getComputedStyle(span).fontFamily.includes(font);
                span.remove();
                return available ? font : null;
            }).filter(Boolean).join(", ") || "Nenhum teste conclusivo";
            availableData.push(`Fontes instaladas (exemplo): ${fontCheck} - Usado para fingerprinting.`);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = "14px Arial";
            ctx.fillText("Fingerprint Test", 2, 20);
            const canvasFingerprint = canvas.toDataURL();
            availableData.push(`Canvas Fingerprinting: ${canvasFingerprint.slice(0, 50)}... - Hash único de renderização.`);

            let webglInfo = "Não disponível";
            if (canvas.getContext('webgl')) {
                const gl = canvas.getContext('webgl');
                webglInfo = `Vendor: ${gl.getParameter(gl.VENDOR)}, Renderer: ${gl.getParameter(gl.RENDERER)}`;
            }
            if (webglInfo === "Não disponível") {
                unavailableData.push(`WebGL Fingerprinting: ${webglInfo} - Detalhes da GPU.`);
            } else {
                availableData.push(`WebGL Fingerprinting: ${webglInfo} - Detalhes da GPU.`);
            }

            let audioFingerprint = "Não disponível";
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                oscillator.type = "sine";
                oscillator.frequency.value = 440;
                const analyser = audioCtx.createAnalyser();
                oscillator.connect(analyser);
                analyser.connect(audioCtx.destination);
                oscillator.start();
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);
                audioFingerprint = dataArray.join(",").slice(0, 50) + "...";
                oscillator.stop();
                audioCtx.close();
            } catch (e) {
                console.log("Erro ao obter AudioContext Fingerprint:", e);
            }
            if (audioFingerprint === "Não disponível") {
                unavailableData.push(`AudioContext Fingerprinting: ${audioFingerprint} - Variações de áudio.`);
            } else {
                availableData.push(`AudioContext Fingerprinting: ${audioFingerprint} - Variações de áudio.`);
            }

            let connectionType = "Não disponível";
            let connectionSpeed = "Não disponível";
            if (navigator.connection) {
                connectionType = navigator.connection.effectiveType || "Desconhecido";
                connectionSpeed = `${navigator.connection.downlink || "N/A"} Mbps`;
            }
            if (connectionType === "Não disponível") {
                unavailableData.push(`Tipo de conexão: ${connectionType} - Tipo de rede (Wi-Fi, 4G, etc.).`);
            } else {
                availableData.push(`Tipo de conexão: ${connectionType} - Tipo de rede (Wi-Fi, 4G, etc.).`);
            }
            if (connectionSpeed === "Não disponível") {
                unavailableData.push(`Velocidade de conexão: ${connectionSpeed} - Largura de banda estimada.`);
            } else {
                availableData.push(`Velocidade de conexão: ${connectionSpeed} - Largura de banda estimada.`);
            }

            const networkInfo = webrtcLeaks !== "Não disponível" ? "Detectável via WebRTC" : "Não disponível";
            if (networkInfo === "Não disponível") {
                unavailableData.push(`Informações de rede (NAT/Firewall): ${networkInfo} - Configurações de rede.`);
            } else {
                availableData.push(`Informações de rede (NAT/Firewall): ${networkInfo} - Configurações de rede.`);
            }

            const screenOrientation = screen.orientation?.type || "Desconhecido";
            availableData.push(`Orientação da tela: ${screenOrientation} - Retrato ou paisagem.`);

            let sensorData = "Não disponível";
            try {
                window.addEventListener('deviceorientation', (event) => {
                    sensorData = `Alpha: ${event.alpha || "N/A"}, Beta: ${event.beta || "N/A"}, Gamma: ${event.gamma || "N/A"}`;
                }, { once: true });
            } catch (e) {
                console.log("Erro ao obter dados de sensores:", e);
            }
            if (sensorData === "Não disponível") {
                unavailableData.push(`Sensores do dispositivo (Acelerômetro/Giroscópio): ${sensorData} - Movimentos do dispositivo.`);
            } else {
                availableData.push(`Sensores do dispositivo (Acelerômetro/Giroscópio): ${sensorData} - Movimentos do dispositivo.`);
            }

            let lightData = "Não disponível";
            if (window.AmbientLightSensor) {
                try {
                    const sensor = new AmbientLightSensor();
                    sensor.start();
                    await new Promise(resolve => sensor.onreading = resolve);
                    lightData = `${sensor.illuminance} lux`;
                    sensor.stop();
                } catch (e) {
                    console.log("Erro ao obter sensor de luz:", e);
                }
            }
            if (lightData === "Não disponível") {
                unavailableData.push(`Sensor de luz ambiente: ${lightData} - Nível de luminosidade.`);
            } else {
                availableData.push(`Sensor de luz ambiente: ${lightData} - Nível de luminosidade.`);
            }

            let proximityData = "Não disponível";
            if (window.ProximitySensor) {
                try {
                    const sensor = new ProximitySensor();
                    sensor.start();
                    await new Promise(resolve => sensor.onreading = resolve);
                    proximityData = `${sensor.distance} cm`;
                    sensor.stop();
                } catch (e) {
                    console.log("Erro ao obter sensor de proximidade:", e);
                }
            }
            if (proximityData === "Não disponível") {
                unavailableData.push(`Sensor de proximidade: ${proximityData} - Distância de objetos.`);
            } else {
                availableData.push(`Sensor de proximidade: ${proximityData} - Distância de objetos.`);
            }

            const timing = performance.now();
            availableData.push(`Tempo de resposta do sistema: ${timing.toFixed(2)}ms - Precisão de timers.`);

            unavailableData.push(`HTTP/3 e QUIC: Não detectável diretamente via JavaScript - Protocolos de conexão modernos.`);

            unavailableData.push(`TLS Fingerprinting: Não disponível (requer análise de handshake TLS) - Assinatura única de SSL/TLS.`);

            const hsts = document.location.protocol === "https:" ? "Possível via HSTS" : "Não detectado";
            availableData.push(`HSTS Super Cookies: ${hsts} - Rastreamento via HSTS.`);

            unavailableData.push(`ETag Tracking: Não disponível diretamente (requer análise de headers) - Identificadores persistentes.`);

            unavailableData.push(`Cache Timing Attacks: Não implementado (requer teste específico) - Inferência de histórico.`);

            let keyDynamics = "Não disponível";
            try {
                let keyTimes = [];
                document.addEventListener('keydown', (e) => {
                    keyTimes.push(performance.now());
                    if (keyTimes.length > 2) keyTimes.shift();
                    keyDynamics = keyTimes.length > 1 ? `Diferença média: ${((keyTimes[1] - keyTimes[0]) / 1000).toFixed(3)}s` : "Insuficiente";
                }, { once: true });
            } catch (e) {
                console.log("Erro ao obter keyboard dynamics:", e);
            }
            if (keyDynamics === "Não disponível") {
                unavailableData.push(`Keyboard Dynamics: ${keyDynamics} - Padrões de digitação.`);
            } else {
                availableData.push(`Keyboard Dynamics: ${keyDynamics} - Padrões de digitação.`);
            }

            let mouseDynamics = "Não disponível";
            try {
                let lastMove = 0;
                document.addEventListener('mousemove', (e) => {
                    const now = performance.now();
                    if (lastMove) mouseDynamics = `Velocidade: ${((e.clientX - lastMove) / (now - lastMove)).toFixed(2)} px/ms`;
                    lastMove = now;
                }, { once: true });
            } catch (e) {
                console.log("Erro ao obter mouse dynamics:", e);
            }
            if (mouseDynamics === "Não disponível") {
                unavailableData.push(`Mouse Dynamics: ${mouseDynamics} - Padrões de movimento do cursor.`);
            } else {
                availableData.push(`Mouse Dynamics: ${mouseDynamics} - Padrões de movimento do cursor.`);
            }

            const permissionsCamera = await navigator.permissions.query({ name: "camera" }).then(res => `Câmera: ${res.state}`).catch(() => "Câmera: Não verificado");
            const permissionsMic = await navigator.permissions.query({ name: "microphone" }).then(res => `Microfone: ${res.state}`).catch(() => "Microfone: Não verificado");
            availableData.push(`Permissões concedidas: ${permissionsCamera}; ${permissionsMic} - Permissões do usuário.`);

            const webAuthn = navigator.credentials ? "Disponível (biometria/hardware)" : "Não disponível";
            if (webAuthn === "Não disponível") {
                unavailableData.push(`WebAuthn Credentials: ${webAuthn} - Autenticação avançada.`);
            } else {
                availableData.push(`WebAuthn Credentials: ${webAuthn} - Autenticação avançada.`);
            }

            const crossOrigin = Array.from(document.querySelectorAll('script[src], img[src], link[href]')).map(el => el.src || el.href).filter(src => src && !src.includes(window.location.hostname)).join("; ") || "Nenhum detectado";
            availableData.push(`Cross-Origin Requests: ${crossOrigin} - Solicitações a terceiros.`);

            const serviceWorkers = navigator.serviceWorker ? "Disponível" : "Não disponível";
            if (serviceWorkers === "Não disponível") {
                unavailableData.push(`Service Workers: ${serviceWorkers} - Scripts em background.`);
            } else {
                availableData.push(`Service Workers: ${serviceWorkers} - Scripts em background.`);
            }

            unavailableData.push(`Autofill/Password Managers: Não detectável diretamente - Dados preenchidos automaticamente.`);

            const webSocket = window.WebSocket ? "Disponível" : "Não disponível";
            if (webSocket === "Não disponível") {
                unavailableData.push(`WebSocket Negotiation: ${webSocket} - Comunicação em tempo real.`);
            } else {
                availableData.push(`WebSocket Negotiation: ${webSocket} - Comunicação em tempo real.`);
            }

            unavailableData.push(`CSP Violations: Não disponível (requer relatório do navegador) - Violações de segurança.`);

            unavailableData.push(`Browser Extensions: Não detectável diretamente (pode vazar via recursos) - Extensões instaladas.`);

            availableData.push(`Time Zone Offset: ${new Date().getTimezoneOffset()} minutos - Diferença horária.`);

            unavailableData.push(`Redes sociais logadas: Não detectável diretamente (ex.: Facebook Connect) - Rastreamento de login.`);

            let webglErrors = "Não disponível";
            if (canvas.getContext('webgl')) {
                try {
                    const gl = canvas.getContext('webgl');
                    gl.getError();
                    webglErrors = "Detectável via erros específicos";
                } catch (e) {
                    webglErrors = e.message;
                }
            }
            if (webglErrors === "Não disponível") {
                unavailableData.push(`WebGL Errors: ${webglErrors} - Erros de renderização GPU.`);
            } else {
                availableData.push(`WebGL Errors: ${webglErrors} - Erros de renderização GPU.`);
            }

            const protocolHandlers = navigator.registerProtocolHandler ? "Disponível" : "Não disponível";
            if (protocolHandlers === "Não disponível") {
                unavailableData.push(`Protocol Handlers: ${protocolHandlers} - Aplicativos padrão (mailto:, tel:).`);
            } else {
                availableData.push(`Protocol Handlers: ${protocolHandlers} - Aplicativos padrão (mailto:, tel:).`);
            }

            const resources = performance.getEntriesByType('resource').map(entry => `${entry.name}: ${entry.duration.toFixed(2)}ms`).join("; ") || "Nenhum recurso";
            availableData.push(`Resource Timing API: ${resources} - Tempos de carregamento.`);

            unavailableData.push(`X-Client-Data Headers: Não disponível (Chrome-specific, via headers) - Dados de experimentos.`);

            availableData.push(`Prefers Color Scheme: ${window.matchMedia('(prefers-color-scheme: dark)').matches ? "Escuro" : "Claro"} - Tema do sistema.`);

            availableData.push(`Reduced Motion: ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? "Sim" : "Não"} - Preferência de acessibilidade.`);

            unavailableData.push(`COOP Leaks: Não disponível diretamente - Política de abertura cross-origin.`);

            const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition ? "Disponível" : "Não disponível";
            if (speechRecognition === "Não disponível") {
                unavailableData.push(`Speech Recognition Data: ${speechRecognition} - Dados de voz.`);
            } else {
                availableData.push(`Speech Recognition Data: ${speechRecognition} - Dados de voz.`);
            }

            let gamepadData = "Não disponível";
if (navigator.getGamepads) {
    try {
        const gamepads = navigator.getGamepads();
        gamepadData = Array.from(gamepads).filter(g => g).map(g => `${g.id}`).join("; ") || "Nenhum conectado";
    } catch (e) {
        gamepadData = "Bloqueado pela política de permissões";
        console.log("Erro ao acessar Gamepad API:", e.message);
    }
}
if (gamepadData === "Não disponível" || gamepadData === "Bloqueado pela política de permissões") {
    unavailableData.push(`Gamepad API: ${gamepadData} - Controles conectados.`);
} else {
    availableData.push(`Gamepad API: ${gamepadData} - Controles conectados.`);
}

            const deviceMemoryAPI = navigator.deviceMemory || "Não disponível";
            if (deviceMemoryAPI === "Não disponível") {
                unavailableData.push(`Device Memory API: ${deviceMemoryAPI} GB - Capacidade de RAM.`);
            } else {
                availableData.push(`Device Memory API: ${deviceMemoryAPI} GB - Capacidade de RAM.`);
            }

            const networkQuality = navigator.connection?.rtt !== undefined ? `${navigator.connection.rtt} ms` : "Não disponível";
            if (networkQuality === "Não disponível") {
                unavailableData.push(`Network Quality Hint: ${networkQuality} - Latência estimada.`);
            } else {
                availableData.push(`Network Quality Hint: ${networkQuality} - Latência estimada.`);
            }

            const vibrationAPI = navigator.vibrate ? "Disponível" : "Não disponível";
            if (vibrationAPI === "Não disponível") {
                unavailableData.push(`Vibration API: ${vibrationAPI} - Suporte a vibração.`);
            } else {
                availableData.push(`Vibration API: ${vibrationAPI} - Suporte a vibração.`);
            }

            const presentationAPI = navigator.presentation ? "Disponível" : "Não disponível";
            if (presentationAPI === "Não disponível") {
                unavailableData.push(`Presentation API: ${presentationAPI} - Telas secundárias.`);
            } else {
                availableData.push(`Presentation API: ${presentationAPI} - Telas secundárias.`);
            }

            const credentialAPI = navigator.credentials ? "Disponível" : "Não disponível";
            if (credentialAPI === "Não disponível") {
                unavailableData.push(`Credential Management API: ${credentialAPI} - Credenciais salvas.`);
            } else {
                availableData.push(`Credential Management API: ${credentialAPI} - Credenciais salvas.`);
            }

            const paymentAPI = window.PaymentRequest ? "Disponível" : "Não disponível";
            if (paymentAPI === "Não disponível") {
                unavailableData.push(`Payment Request API: ${paymentAPI} - Métodos de pagamento.`);
            } else {
                availableData.push(`Payment Request API: ${paymentAPI} - Métodos de pagamento.`);
            }

            const idleAPI = window.IdleDetector ? "Disponível" : "Não disponível";
            if (idleAPI === "Não disponível") {
                unavailableData.push(`Idle Detection API: ${idleAPI} - Status de inatividade.`);
            } else {
                availableData.push(`Idle Detection API: ${idleAPI} - Status de inatividade.`);
            }

            const clipboardAPI = navigator.clipboard ? "Disponível" : "Não disponível";
            if (clipboardAPI === "Não disponível") {
                unavailableData.push(`Clipboard API: ${clipboardAPI} - Acesso ao clipboard.`);
            } else {
                availableData.push(`Clipboard API: ${clipboardAPI} - Acesso ao clipboard.`);
            }

            const fileSystemAPI = window.showOpenFilePicker ? "Disponível" : "Não disponível";
            if (fileSystemAPI === "Não disponível") {
                unavailableData.push(`File System Access API: ${fileSystemAPI} - Acesso a arquivos.`);
            } else {
                availableData.push(`File System Access API: ${fileSystemAPI} - Acesso a arquivos.`);
            }

            const midiAPI = navigator.requestMIDIAccess ? "Disponível" : "Não disponível";
            if (midiAPI === "Não disponível") {
                unavailableData.push(`Web MIDI API: ${midiAPI} - Dispositivos MIDI.`);
            } else {
                availableData.push(`Web MIDI API: ${midiAPI} - Dispositivos MIDI.`);
            }

            const hidAPI = navigator.hid ? "Disponível" : "Não disponível";
            if (hidAPI === "Não disponível") {
                unavailableData.push(`WebHID API: ${hidAPI} - Dispositivos HID.`);
            } else {
                availableData.push(`WebHID API: ${hidAPI} - Dispositivos HID.`);
            }

            const permissionsAPI = navigator.permissions ? "Disponível" : "Não disponível";
            if (permissionsAPI === "Não disponível") {
                unavailableData.push(`Permissions API: ${permissionsAPI} - Lista de permissões.`);
            } else {
                availableData.push(`Permissions API: ${permissionsAPI} - Lista de permissões.`);
            }

            const trustTokens = document.featurePolicy?.allowsFeature('trust-token-issuance') ? "Disponível" : "Não disponível";
            if (trustTokens === "Não disponível") {
                unavailableData.push(`Trust Tokens: ${trustTokens} - Tokens antifraude.`);
            } else {
                availableData.push(`Trust Tokens: ${trustTokens} - Tokens antifraude.`);
            }

            const storageAccessAPI = document.requestStorageAccess ? "Disponível" : "Não disponível";
            if (storageAccessAPI === "Não disponível") {
                unavailableData.push(`Storage Access API: ${storageAccessAPI} - Acesso a cookies.`);
            } else {
                availableData.push(`Storage Access API: ${storageAccessAPI} - Acesso a cookies.`);
            }

            unavailableData.push(`Reporting API: Não disponível diretamente - Relatórios de segurança.`);

            const userTimingAPI = performance.mark ? "Disponível" : "Não disponível";
            if (userTimingAPI === "Não disponível") {
                unavailableData.push(`User Timing API: ${userTimingAPI} - Marcadores de desempenho.`);
            } else {
                availableData.push(`User Timing API: ${userTimingAPI} - Marcadores de desempenho.`);
            }

            const webTransportAPI = window.WebTransport ? "Disponível" : "Não disponível";
            if (webTransportAPI === "Não disponível") {
                unavailableData.push(`WebTransport API: ${webTransportAPI} - Protocolos alternativos.`);
            } else {
                availableData.push(`WebTransport API: ${webTransportAPI} - Protocolos alternativos.`);
            }

            const broadcastChannelAPI = window.BroadcastChannel ? "Disponível" : "Não disponível";
            if (broadcastChannelAPI === "Não disponível") {
                unavailableData.push(`Broadcast Channel API: ${broadcastChannelAPI} - Comunicação entre abas.`);
            } else {
                availableData.push(`Broadcast Channel API: ${broadcastChannelAPI} - Comunicação entre abas.`);
            }

            const webLocksAPI = navigator.locks ? "Disponível" : "Não disponível";
            if (webLocksAPI === "Não disponível") {
                unavailableData.push(`Web Locks API: ${webLocksAPI} - Locks de recursos.`);
            } else {
                availableData.push(`Web Locks API: ${webLocksAPI} - Locks de recursos.`);
            }

            const wasmAPI = window.WebAssembly ? "Disponível" : "Não disponível";
            if (wasmAPI === "Não disponível") {
                unavailableData.push(`WebAssembly Capabilities: ${wasmAPI} - Suporte a WASM.`);
            } else {
                availableData.push(`WebAssembly Capabilities: ${wasmAPI} - Suporte a WASM.`);
            }

            const intersectionAPI = window.IntersectionObserver ? "Disponível" : "Não disponível";
            if (intersectionAPI === "Não disponível") {
                unavailableData.push(`Intersection Observer API: ${intersectionAPI} - Visibilidade de elementos.`);
            } else {
                availableData.push(`Intersection Observer API: ${intersectionAPI} - Visibilidade de elementos.`);
            }

            availableData.push(`Page Visibility API: ${document.visibilityState} - Estado da página.`);

            const pushAPI = navigator.serviceWorker && 'pushManager' in ServiceWorkerRegistration.prototype ? "Disponível" : "Não disponível";
            if (pushAPI === "Não disponível") {
                unavailableData.push(`Push API: ${pushAPI} - Notificações push.`);
            } else {
                availableData.push(`Push API: ${pushAPI} - Notificações push.`);
            }

            const notificationsAPI = window.Notification ? "Disponível" : "Não disponível";
            if (notificationsAPI === "Não disponível") {
                unavailableData.push(`Web Notifications: ${notificationsAPI} - Suporte a notificações.`);
            } else {
                availableData.push(`Web Notifications: ${notificationsAPI} - Suporte a notificações.`);
            }

            const backgroundSyncAPI = navigator.serviceWorker && 'sync' in ServiceWorkerRegistration.prototype ? "Disponível" : "Não disponível";
            if (backgroundSyncAPI === "Não disponível") {
                unavailableData.push(`Background Sync: ${backgroundSyncAPI} - Sincronização em segundo plano.`);
            } else {
                availableData.push(`Background Sync: ${backgroundSyncAPI} - Sincronização em segundo plano.`);
            }

            const webAudioAPI = window.AudioContext || window.webkitAudioContext ? "Disponível" : "Não disponível";
            if (webAudioAPI === "Não disponível") {
                unavailableData.push(`Web Audio API: ${webAudioAPI} - Processamento de áudio.`);
            } else {
                availableData.push(`Web Audio API: ${webAudioAPI} - Processamento de áudio.`);
            }

            const mediaCapabilitiesAPI = navigator.mediaCapabilities ? "Disponível" : "Não disponível";
            if (mediaCapabilitiesAPI === "Não disponível") {
                unavailableData.push(`Media Capabilities API: ${mediaCapabilitiesAPI} - Codecs suportados.`);
            } else {
                availableData.push(`Media Capabilities API: ${mediaCapabilitiesAPI} - Codecs suportados.`);
            }

            const mediaSessionAPI = navigator.mediaSession ? "Disponível" : "Não disponível";
            if (mediaSessionAPI === "Não disponível") {
                unavailableData.push(`Media Session API: ${mediaSessionAPI} - Metadados de mídia.`);
            } else {
                availableData.push(`Media Session API: ${mediaSessionAPI} - Metadados de mídia.`);
            }

            const wakeLockAPI = navigator.wakeLock ? "Disponível" : "Não disponível";
            if (wakeLockAPI === "Não disponível") {
                unavailableData.push(`Screen Wake Lock API: ${wakeLockAPI} - Manter tela ativa.`);
            } else {
                availableData.push(`Screen Wake Lock API: ${wakeLockAPI} - Manter tela ativa.`);
            }

            const webXRAPI = navigator.xr ? "Disponível" : "Não disponível";
            if (webXRAPI === "Não disponível") {
                unavailableData.push(`WebXR Device API: ${webXRAPI} - Realidade virtual/aumentada.`);
            } else {
                availableData.push(`WebXR Device API: ${webXRAPI} - Realidade virtual/aumentada.`);
            }

            unavailableData.push(`Geofencing API: Não disponível diretamente - Cercas virtuais.`);

            const contactPickerAPI = navigator.contacts ? "Disponível" : "Não disponível";
            if (contactPickerAPI === "Não disponível") {
                unavailableData.push(`Contact Picker API: ${contactPickerAPI} - Seleção de contatos.`);
            } else {
                availableData.push(`Contact Picker API: ${contactPickerAPI} - Seleção de contatos.`);
            }

            const badgingAPI = navigator.setAppBadge ? "Disponível" : "Não disponível";
            if (badgingAPI === "Não disponível") {
                unavailableData.push(`Badging API: ${badgingAPI} - Badges de aplicativos.`);
            } else {
                availableData.push(`Badging API: ${badgingAPI} - Badges de aplicativos.`);
            }

            const periodicSyncAPI = navigator.serviceWorker && 'periodicSync' in ServiceWorkerRegistration.prototype ? "Disponível" : "Não disponível";
            if (periodicSyncAPI === "Não disponível") {
                unavailableData.push(`Periodic Background Sync: ${periodicSyncAPI} - Atualizações regulares.`);
            } else {
                availableData.push(`Periodic Background Sync: ${periodicSyncAPI} - Atualizações regulares.`);
            }

            const webAuthnDetails = navigator.credentials ? "Disponível" : "Não disponível";
            if (webAuthnDetails === "Não disponível") {
                unavailableData.push(`WebAuthn Authenticator Details: ${webAuthnDetails} - Tipos de autenticadores.`);
            } else {
                availableData.push(`WebAuthn Authenticator Details: ${webAuthnDetails} - Tipos de autenticadores.`);
            }

            unavailableData.push(`Cross-Device Tracking: Não detectável diretamente - Vinculação de dispositivos.`);

            unavailableData.push(`DNS over HTTPS (DoH): Não detectável diretamente - DNS criptografado.`);

            unavailableData.push(`HTTP/2 Server Push: Não detectável diretamente - Recursos pré-empurrados.`);

            const thirdPartyScripts = crossOrigin ? "Detectado" : "Não detectado";
            availableData.push(`Third-Party Script Behavior: ${thirdPartyScripts} - Trackers de terceiros.`);

            unavailableData.push(`Inferred Privacy Settings: Não disponível (requer análise de headers) - Bloqueio de cookies.`);

            unavailableData.push(`Ad Blocker Presence: Não detectável diretamente - Bloqueadores de anúncios.`);

            availableData.push(`Browser Theme Detection: ${window.matchMedia('(prefers-color-scheme: dark)').matches ? "Escuro" : "Claro"} - Tema detectado.`);

            unavailableData.push(`Autoplay Policies: Não disponível diretamente - Comportamento de mídia.`);

            const contentIndexingAPI = navigator.serviceWorker && 'contentIndex' in ServiceWorkerRegistration.prototype ? "Disponível" : "Não disponível";
            if (contentIndexingAPI === "Não disponível") {
                unavailableData.push(`Content Indexing API: ${contentIndexingAPI} - Conteúdo offline.`);
            } else {
                availableData.push(`Content Indexing API: ${contentIndexingAPI} - Conteúdo offline.`);
            }

            let webglExtensions = "Não disponível";
            if (canvas.getContext('webgl')) {
                const gl = canvas.getContext('webgl');
                webglExtensions = gl.getSupportedExtensions().slice(0, 3).join(", ") + "...";
            }
            if (webglExtensions === "Não disponível") {
                unavailableData.push(`WebGL Extensions: ${webglExtensions} - Extensões suportadas.`);
            } else {
                availableData.push(`WebGL Extensions: ${webglExtensions} - Extensões suportadas.`);
            }

            let voices = "Não disponível";
            if (window.speechSynthesis) {
                voices = speechSynthesis.getVoices().map(v => v.name).slice(0, 3).join(", ") + "..." || "Carregando";
            }
            if (voices === "Não disponível") {
                unavailableData.push(`Speech Synthesis Voices: ${voices} - Vozes de TTS.`);
            } else {
                availableData.push(`Speech Synthesis Voices: ${voices} - Vozes de TTS.`);
            }

            const scanTime = ((performance.now() - startTime) / 1000).toFixed(2);
            availableData.push(`Tempo de execução do scan: ${scanTime} segundos - Duração do scan.`);

            return { availableData, unavailableData };
        }

        function createDataExposedMenu() {
            console.log('Criando popup do Data Exposed');
            const menu = document.createElement('div');
            menu.className = 'draggable-menu';
            Object.assign(menu.style, {
                position: 'fixed',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'left',
                width: '1280px',
                height: '720px',
                overflowY: 'auto',
                zIndex: '9999'
            });

            const headerContainer = document.createElement('div');
            headerContainer.style.display = 'flex';
            headerContainer.style.alignItems = 'center';
            headerContainer.style.justifyContent = 'space-between';
            headerContainer.style.marginBottom = '10px';

            const h3 = document.createElement('h3');
            h3.textContent = 'Dados Vazados pelo Seu Navegador para os Servidores das Big Techs';
            Object.assign(h3.style, {
                fontSize: '18px',
                margin: '0',
                color: 'yellow'
            });

            const copyIcon = document.createElement('span');
            copyIcon.textContent = '📋';
            Object.assign(copyIcon.style, {
                fontSize: '18px',
                marginLeft: '10px',
                cursor: 'pointer',
                position: 'relative'
            });
            copyIcon.title = 'Copie o texto';

            const btnFecharHeader = document.createElement('button');
            btnFecharHeader.textContent = 'Fechar';
            Object.assign(btnFecharHeader.style, {
                background: '#ffff00',
                border: 'none',
                color: '#000',
                padding: '3px 8px',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '10px',
                marginLeft: '10px'
            });
            btnFecharHeader.addEventListener('click', toggleDataExposed);

            headerContainer.appendChild(h3);
            headerContainer.appendChild(copyIcon);
            headerContainer.appendChild(btnFecharHeader);
            menu.appendChild(headerContainer);

            const availableList = document.createElement('ul');
            availableList.style.paddingLeft = '20px';

            const divider = document.createElement('hr');
            Object.assign(divider.style, {
                border: 'none',
                height: '4px',
                backgroundColor: 'yellow',
                margin: '20px 0'
            });

            const unavailableTitle = document.createElement('h4');
            unavailableTitle.textContent = 'Dados Secretamente Coletados pelas Big Techs Além do Alcance do Seu Navegador';
            Object.assign(unavailableTitle.style, {
                color: 'yellow',
                fontSize: '16px',
                margin: '10px 0'
            });

            const unavailableList = document.createElement('ul');
            unavailableList.style.paddingLeft = '20px';

            collectExposedData().then(({ availableData, unavailableData }) => {
                console.log('Dados coletados:', { availableData, unavailableData });

                availableData.forEach(item => {
                    const li = document.createElement('li');
                    li.style.marginBottom = '10px';
                    li.style.fontSize = '12px';
                    const colonIndex = item.indexOf(':');
                    if (colonIndex !== -1) {
                        const prefix = item.substring(0, colonIndex + 1);
                        const suffix = item.substring(colonIndex + 1).trim();
                        const prefixSpan = document.createElement('span');
                        prefixSpan.style.color = 'yellow';
                        prefixSpan.textContent = prefix;
                        const suffixText = document.createTextNode(suffix);
                        li.appendChild(prefixSpan);
                        li.appendChild(suffixText);
                    } else {
                        li.textContent = item;
                    }
                    availableList.appendChild(li);
                });

                unavailableData.forEach(item => {
                    const li = document.createElement('li');
                    li.style.marginBottom = '10px';
                    li.style.fontSize = '12px';
                    const colonIndex = item.indexOf(':');
                    if (colonIndex !== -1) {
                        const prefix = item.substring(0, colonIndex + 1);
                        const suffix = item.substring(colonIndex + 1).trim();
                        const prefixSpan = document.createElement('span');
                        prefixSpan.style.color = 'yellow';
                        prefixSpan.textContent = prefix;
                        const suffixText = document.createTextNode(suffix);
                        li.appendChild(prefixSpan);
                        li.appendChild(suffixText);
                    } else {
                        li.textContent = item;
                    }
                    unavailableList.appendChild(li);
                });

                copyIcon.addEventListener('click', () => {
                    const textToCopy = [
                        "Dados Disponíveis:\n" + availableData.join('\n'),
                        "\nDados Não Disponíveis Devido a Restrições do Navegador ou Servidor:\n" + unavailableData.join('\n')
                    ].join('\n');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showOverlayConfirmationAutoClose("Sucesso", "Texto copiado para a área de transferência!");
                    }).catch(err => {
                        console.error("Erro ao copiar texto:", err);
                        showOverlayConfirmationAutoClose("Erro", "Falha ao copiar o texto.");
                    });
                });
            }).catch(err => {
                console.error("Erro ao coletar dados expostos:", err);
                const li = document.createElement('li');
                li.textContent = `Erro ao coletar dados: ${err.message}`;
                availableList.appendChild(li);
            });

            menu.appendChild(availableList);
            menu.appendChild(divider);
            menu.appendChild(unavailableTitle);
            menu.appendChild(unavailableList);

            const btnFechar = document.createElement('button');
            btnFechar.textContent = 'Fechar';
            Object.assign(btnFechar.style, {
                background: '#ffff00',
                border: 'none',
                color: '#000',
                padding: '3px 8px',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '10px',
                marginTop: '10px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
            });
            btnFechar.addEventListener('click', toggleDataExposed);
            menu.appendChild(btnFechar);

            makeDraggable(menu);
            return menu;
        }

        function toggleDataExposed() {
            if (!dataExposedActive) {
                dataExposedMenu = createDataExposedMenu();
                document.body.appendChild(dataExposedMenu);
                btnDataExposed.setAttribute("data-active", "true");
                dataExposedActive = true;
            } else {
                if (dataExposedMenu) {
                    dataExposedMenu.remove();
                    dataExposedMenu = null;
                }
                btnDataExposed.removeAttribute("data-active");
                dataExposedActive = false;
            }
        }

        function createDataExposedButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Data Exposed';
            btn.className = 'btn-data-exposed';
            btn.title = 'Veja os dados reais que o site pode estar coletando sobre você';
            btn.addEventListener('click', toggleDataExposed);
            return btn;
        }

        // Modo Leitura - Variáveis e configurações
        let readerOverlay = null;
        let readerArticleData = null;
        let readerScrollPosition = 0;
        let readerLastScrollTime = 0;
        let readerIsUIVisible = true;

        const READER_CONFIG = {
            theme: GM_getValue('reader_theme', 'light'),
            fontSize: GM_getValue('reader_fontSize', 19),
            lineHeight: GM_getValue('reader_lineHeight', 1.7),
            maxWidth: GM_getValue('reader_maxWidth', 740),
            fontFamily: GM_getValue('reader_fontFamily', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'),
            paragraphSpacing: GM_getValue('reader_paragraphSpacing', 1.4),
            imageSize: GM_getValue('reader_imageSize', 'large'),
            enableFootnotes: GM_getValue('reader_enableFootnotes', true),
            autoHideUI: GM_getValue('reader_autoHideUI', true),
            readerMargin: GM_getValue('reader_readerMargin', 60),
            imageAlignment: GM_getValue('reader_imageAlignment', 'center'),
            animationSpeed: GM_getValue('reader_animationSpeed', 250)
        };

        function createReadingModeButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Modo Leitura';
            btn.className = 'btn-reading-mode';
            btn.title = 'Ativa o modo de leitura para melhorar a experiência de leitura';
            btn.addEventListener('click', toggleReadingMode);
            return btn;
        }

        function toggleReadingMode() {
            if (readerOverlay) {
                closeReaderOverlay();
            } else {
                showReaderLoadingIndicator();

                extractReaderContent().then(() => {
                    removeReaderLoadingIndicator();

                    if (readerArticleData && readerArticleData.content) {
                        createReaderOverlay();
                    } else {
                        showReaderErrorMessage("Não foi possível extrair o conteúdo desta página.");
                    }
                }).catch(error => {
                    removeReaderLoadingIndicator();
                    console.error('Erro no modo de leitura:', error);
                    showReaderErrorMessage("Erro ao processar a página: " + error.message);
                });
            }
        }

        function showReaderLoadingIndicator() {
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'reader-loading-indicator';
            loadingIndicator.innerHTML = `
                <div style="width: 24px; height: 24px; border: 3px solid #fff; border-top: 3px solid transparent; border-radius: 50%; animation: reader_spin 1s linear infinite;"></div>
                <span>Preparando modo de leitura...</span>
            `;
            document.body.appendChild(loadingIndicator);
        }

        function removeReaderLoadingIndicator() {
            const loadingIndicator = document.getElementById('reader-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }

        function showReaderErrorMessage(message) {
            const errorBox = document.createElement('div');
            errorBox.id = 'reader-error-message';
            errorBox.innerHTML = `
                <div style="margin-bottom: 15px; font-size: 24px;">⚠️</div>
                <div>${message}</div>
                <button style="margin-top: 15px; padding: 8px 16px; background: white; color: #dc3545; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Fechar</button>
            `;

            errorBox.querySelector('button').addEventListener('click', () => {
                errorBox.remove();
            });

            document.body.appendChild(errorBox);

            // Auto-remove após 5 segundos
            setTimeout(() => {
                if (document.body.contains(errorBox)) {
                    errorBox.remove();
                }
            }, 5000);
        }

        async function extractReaderContent() {
            try {
                // Clone do documento para evitar modificar o original
                const documentClone = document.cloneNode(true);

                // Extrair com Readability
                const reader = new Readability(documentClone);
                readerArticleData = reader.parse();

                // Se não conseguir extrair conteúdo adequado, tenta método alternativo
                if (!readerArticleData || !readerArticleData.content || readerArticleData.textContent.length < 500) {
                    console.log('Conteúdo extraído insuficiente, tentando alternativa');

                    // Aqui poderia implementar métodos alternativos de extração
                    // Por simplicidade, estamos apenas limpando o conteúdo melhor
                    if (readerArticleData && readerArticleData.content) {
                        readerArticleData.content = DOMPurify.sanitize(readerArticleData.content);
                    }
                }

                console.log('Conteúdo extraído:', readerArticleData);
                return readerArticleData;

            } catch (error) {
                console.error('Erro na extração:', error);
                throw error;
            }
        }

        function createReaderOverlay() {
            // Criar o overlay principal
            readerOverlay = document.createElement('div');
            readerOverlay.id = 'speedreader-overlay';
            readerOverlay.setAttribute('aria-label', 'Modo de leitura');

            // Usar shadow DOM para isolar os estilos
            const shadow = readerOverlay.attachShadow({ mode: 'open' });

            // CSS para o shadow DOM
            const style = document.createElement('style');
            style.textContent = generateReaderCss();
            shadow.appendChild(style);

            // Criar o conteúdo
            const containerOuter = document.createElement('div');
            containerOuter.className = 'container-outer';
            shadow.appendChild(containerOuter);

            // Barra de controles superior
            const controls = document.createElement('div');
            controls.className = 'controls';
            controls.innerHTML = `
                <div class="control-group">
                    <button class="control-btn close-btn" data-tooltip="Fechar (Esc)">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        Fechar
                    </button>
                </div>

                <div class="control-group secondary">
                    <button class="control-btn icon font-decrease-btn" data-tooltip="Diminuir fonte (-)">
                        <svg viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                    </button>
                    <button class="control-btn icon font-increase-btn" data-tooltip="Aumentar fonte (+)">
                        <svg viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                    </button>
                </div>

                <div class="control-group">
                    <button class="control-btn theme-btn" data-tooltip="Mudar tema (T)">
                        <svg viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>
                    </button>
                </div>
            `;
            containerOuter.appendChild(controls);

            // Container para o conteúdo
            const container = document.createElement('div');
            container.className = 'container';

            // Criar cabeçalho com meta informações
            let metaHTML = '';
            if (readerArticleData.byline || readerArticleData.siteName || readerArticleData.publishedTime) {
                metaHTML = `<div class="article-meta">`;

                if (readerArticleData.byline) {
                    metaHTML += `<span class="article-author">Por ${readerArticleData.byline}</span>`;
                }

                if (readerArticleData.publishedTime) {
                    const date = new Date(readerArticleData.publishedTime);
                    const formattedDate = isNaN(date.getTime())
                        ? readerArticleData.publishedTime
                        : date.toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });

                    metaHTML += `<span class="article-date">${formattedDate}</span>`;
                }

                if (readerArticleData.siteName) {
                    metaHTML += `<span class="article-site">${readerArticleData.siteName}</span>`;
                }

                metaHTML += `</div>`;
            }

            // Adicionar título, meta informações e conteúdo
            container.innerHTML = `
                ${readerArticleData.title ? `<h1>${readerArticleData.title}</h1>` : ''}
                ${metaHTML}
                <div class="article-content">
                    ${readerArticleData.content || '<p>Não foi possível extrair o conteúdo.</p>'}
                </div>
            `;
            containerOuter.appendChild(container);

            // Adicionar o overlay ao body
            document.body.appendChild(readerOverlay);

            // Adicionar listeners para controles
            addReaderControlListeners(shadow);

            // Animar a entrada do overlay
            containerOuter.style.opacity = '0';
            setTimeout(() => {
                containerOuter.style.opacity = '1';
            }, 10);

            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
        }

        function generateReaderCss() {
            const themeColors = getReaderThemeColors();

            return `
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 2147483647;
                    font-family: ${READER_CONFIG.fontFamily};
                }

                .container-outer {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: ${themeColors.background};
                    color: ${themeColors.text};
                    padding: 0;
                    margin: 0;
                    scroll-behavior: smooth;
                    opacity: 1;
                    transition: opacity ${READER_CONFIG.animationSpeed}ms ease;
                }

                .container {
                    max-width: ${READER_CONFIG.maxWidth}px;
                    margin: 0 auto;
                    padding: ${READER_CONFIG.readerMargin}px;
                    padding-top: 80px;
                    padding-bottom: 100px;
                    line-height: ${READER_CONFIG.lineHeight};
                    font-size: ${READER_CONFIG.fontSize}px;
                    box-sizing: border-box;
                }

                h1 {
                    font-size: 2.2em;
                    margin: 0 0 0.8em 0;
                    line-height: 1.2;
                    font-weight: 700;
                    color: ${themeColors.title};
                }

                h2 {
                    font-size: 1.6em;
                    margin: 1.4em 0 0.8em 0;
                    line-height: 1.3;
                }

                h3 {
                    font-size: 1.3em;
                    margin: 1.2em 0 0.6em 0;
                }

                p {
                    margin-bottom: ${READER_CONFIG.paragraphSpacing}em;
                    overflow-wrap: break-word;
                }

                a {
                    color: ${themeColors.link};
                    text-decoration: none;
                    border-bottom: 1px solid ${themeColors.linkUnderline};
                    transition: border-color 0.2s;
                }

                a:hover {
                    border-bottom-color: ${themeColors.linkHover};
                }

                img {
                    max-width: 100%;
                    height: auto;
                    margin: 2em auto;
                    display: block;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                figure {
                    margin: 2em 0;
                    text-align: center;
                }

                figcaption {
                    font-size: 0.9em;
                    color: ${themeColors.caption};
                    margin-top: 0.8em;
                    font-style: italic;
                }

                blockquote {
                    margin: 2em 0;
                    padding-left: 1.5em;
                    border-left: 4px solid ${themeColors.blockquoteBorder};
                    color: ${themeColors.blockquote};
                    font-style: italic;
                }

                pre, code {
                    background-color: ${themeColors.codeBackground};
                    font-family: monospace;
                    border-radius: 3px;
                    overflow-x: auto;
                }

                code {
                    padding: 0.2em 0.4em;
                    font-size: 0.9em;
                }

                pre {
                    padding: 1em;
                    margin: 1.5em 0;
                }

                pre code {
                    padding: 0;
                    background: none;
                }

                .controls {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    background: ${themeColors.controlsBackground || 'rgba(255, 255, 255, 0.9)'};
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    z-index: 10;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }

                .control-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .control-btn {
                    background: ${themeColors.buttonBackground || 'rgba(0, 0, 0, 0.05)'};
                    color: ${themeColors.buttonText || '#333'};
                    border: none;
                    border-radius: 4px;
                    padding: 8px 12px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: background-color 0.2s;
                }

                .control-btn:hover {
                    background: ${themeColors.buttonHover || 'rgba(0, 0, 0, 0.1)'};
                }

                .control-btn.icon {
                    width: 36px;
                    height: 36px;
                    padding: 0;
                    justify-content: center;
                }

                .control-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                .article-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 2em;
                    color: ${themeColors.meta || '#666'};
                    font-size: 0.9em;
                }

                .article-meta > span:not(:last-child)::after {
                    content: "•";
                    margin-left: 12px;
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 70px 20px 80px;
                    }

                    .controls {
                        padding: 0 10px;
                    }

                    .control-group.secondary {
                        display: none;
                    }

                    h1 {
                        font-size: 1.8em;
                    }
                }
            `;
        }

        function getReaderThemeColors() {
            const themes = {
                light: {
                    background: '#ffffff',
                    text: 'rgba(0, 0, 0, 0.87)',
                    title: '#121212',
                    link: '#1a73e8',
                    linkUnderline: 'rgba(26, 115, 232, 0.2)',
                    linkHover: 'rgba(26, 115, 232, 0.7)',
                    blockquote: '#555',
                    blockquoteBorder: '#ddd',
                    caption: '#666',
                    meta: '#666',
                    codeBackground: '#f5f5f5',
                    controlsBackground: 'rgba(255, 255, 255, 0.9)',
                    buttonBackground: 'rgba(0, 0, 0, 0.05)',
                    buttonText: '#333',
                    buttonHover: 'rgba(0, 0, 0, 0.1)'
                },
                dark: {
                    background: '#1a1a1a',
                    text: 'rgba(255, 255, 255, 0.87)',
                    title: '#fff',
                    link: '#81b4ff',
                    linkUnderline: 'rgba(129, 180, 255, 0.2)',
                    linkHover: 'rgba(129, 180, 255, 0.7)',
                    blockquote: '#aaa',
                    blockquoteBorder: '#444',
                    caption: '#999',
                    meta: '#999',
                    codeBackground: '#2d2d2d',
                    controlsBackground: 'rgba(26, 26, 26, 0.9)',
                    buttonBackground: 'rgba(255, 255, 255, 0.1)',
                    buttonText: '#eee',
                    buttonHover: 'rgba(255, 255, 255, 0.2)'
                },
                sepia: {
                    background: '#f4ecd8',
                    text: 'rgba(50, 40, 30, 0.87)',
                    title: '#442b1d',
                    link: '#a05d1e',
                    linkUnderline: 'rgba(160, 93, 30, 0.2)',
                    linkHover: 'rgba(160, 93, 30, 0.7)',
                    blockquote: '#7a6c62',
                    blockquoteBorder: '#d3c2a9',
                    caption: '#7a6c62',
                    meta: '#7a6c62',
                    codeBackground: '#ebe1c9',
                    controlsBackground: 'rgba(244, 236, 216, 0.9)',
                    buttonBackground: 'rgba(50, 40, 30, 0.05)',
                    buttonText: '#442b1d',
                    buttonHover: 'rgba(50, 40, 30, 0.1)'
                }
            };

            return themes[READER_CONFIG.theme] || themes.light;
        }

        function addReaderControlListeners(shadow) {
            // Botão fechar
            shadow.querySelector('.close-btn').addEventListener('click', () => {
                closeReaderOverlay();
            });

            // Botões de fonte
            shadow.querySelector('.font-decrease-btn').addEventListener('click', () => {
                changeReaderFontSize(-1);
            });

            shadow.querySelector('.font-increase-btn').addEventListener('click', () => {
                changeReaderFontSize(1);
            });

            // Botão de tema
            shadow.querySelector('.theme-btn').addEventListener('click', () => {
                cycleReaderTheme();
            });

            // Também adicionar atalhos de teclado
            document.addEventListener('keydown', handleReaderKeyboard);
        }

        function handleReaderKeyboard(e) {
            if (!readerOverlay) return;

            if (e.key === 'Escape') {
                closeReaderOverlay();
            } else if (e.key === '+' || e.key === '=') {
                changeReaderFontSize(1);
            } else if (e.key === '-') {
                changeReaderFontSize(-1);
            } else if (e.key.toLowerCase() === 't') {
                cycleReaderTheme();
            }
        }

        function changeReaderFontSize(delta) {
            READER_CONFIG.fontSize = Math.max(14, Math.min(26, READER_CONFIG.fontSize + delta));
            GM_setValue('reader_fontSize', READER_CONFIG.fontSize);

            const container = readerOverlay.shadowRoot.querySelector('.container');
            container.style.fontSize = `${READER_CONFIG.fontSize}px`;
        }

        function cycleReaderTheme() {
            const themes = ['light', 'sepia', 'dark'];
            const currentIndex = themes.indexOf(READER_CONFIG.theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            READER_CONFIG.theme = themes[nextIndex];
            GM_setValue('reader_theme', READER_CONFIG.theme);

            // Atualizar o CSS com o novo tema
            const style = readerOverlay.shadowRoot.querySelector('style');
            style.textContent = generateReaderCss();
        }

        function closeReaderOverlay() {
            if (readerOverlay) {
                // Animar saída
                const containerOuter = readerOverlay.shadowRoot.querySelector('.container-outer');
                containerOuter.style.opacity = '0';

                // Remover evento de teclado
                document.removeEventListener('keydown', handleReaderKeyboard);

                setTimeout(() => {
                    readerOverlay.remove();
                    readerOverlay = null;

                    // Restaurar scroll do body
                    document.body.style.overflow = '';
                }, READER_CONFIG.animationSpeed);
            }
        }

        function createSearxButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Searx';
    btn.className = 'btn-searx';
    btn.title = 'Abre o buscador Searx personalizado';
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Botão Searx clicado");
        showSearchModal();
    });
    return btn;
}

        // Searx - Carregar e salvar preferências
        function loadSearxPreferences() {
            try {
                return {
                    categories: JSON.parse(localStorage.getItem('searx_categories')) || Object.keys(SEARX_CATEGORIES).slice(0, 3),
                    engines: JSON.parse(localStorage.getItem('searx_engines')) || Object.keys(SEARX_ENGINES).slice(0, 5),
                    newTab: localStorage.getItem('searx_new_tab') !== 'false',
                    history: JSON.parse(localStorage.getItem('searx_history')) || []
                };
            } catch (error) {
                console.error("Erro ao carregar preferências do Searx:", error);
                return {
                    categories: Object.keys(SEARX_CATEGORIES).slice(0, 3),
                    engines: Object.keys(SEARX_ENGINES).slice(0, 5),
                    newTab: true,
                    history: []
                };
            }
        }

        function saveSearxPreferences(prefs) {
            try {
                localStorage.setItem('searx_categories', JSON.stringify(prefs.categories));
                localStorage.setItem('searx_engines', JSON.stringify(prefs.engines));
                localStorage.setItem('searx_new_tab', prefs.newTab);
                localStorage.setItem('searx_history', JSON.stringify(prefs.history));
            } catch (error) {
                console.error("Erro ao salvar preferências do Searx:", error);
                showOverlayConfirmationAutoClose("Erro", "Falha ao salvar preferências do Searx", 5000);
            }
        }

        // Searx - Salvar pesquisa no histórico
        function saveSearxToHistory(query) {
            const prefs = loadSearxPreferences();
            // Limitar histórico a 5 itens e remover duplicatas
            const history = [query, ...prefs.history.filter(item => item !== query)].slice(0, 5);
            saveSearxPreferences({...prefs, history});
        }

        // Searx - Exibir toast
        function showSearxToast(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.className = 'searx-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 10);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        // Searx - Modal de pesquisa
        function showSearchModal() {
            try {
                console.log("Iniciando showSearchModal");
                const prefs = loadSearxPreferences();
                const overlay = document.createElement('div');
                overlay.className = 'searx-overlay';

                // Template do modal
                overlay.innerHTML = `
                    <div class="searx-modal">
                        <div class="searx-header">
                            <h3>Pesquisa Personalizada Searx <span class="searx-shortcut">Alt+S</span></h3>
                            <div class="searx-search-container">
                                <input type="text" id="searx-query" placeholder="O que você deseja encontrar?" autofocus>
                                <button class="searx-button searx-button-primary searx-search-btn" id="searx-inline-search">Pesquisar</button>
                            </div>
                            <div class="searx-search-history" id="searx-history"></div>
                        </div>
                        <div class="searx-content">
                            <div class="searx-section">
                                <div class="searx-collapsible-header">
                                    <div class="searx-section-title">
                                        Categorias <span id="categories-counter"></span>
                                    </div>
                                    <div class="searx-toggle-icon">▼</div>
                                </div>
                                <div class="searx-collapsible-content">
                                    <div class="searx-checkbox-grid" id="categories-grid"></div>
                                </div>
                            </div>

                            <div class="searx-divider"></div>

                            <div class="searx-section">
                                <div class="searx-collapsible-header">
                                    <div class="searx-section-title">
                                        Motores de Busca <span id="engines-counter"></span>
                                    </div>
                                    <div class="searx-toggle-icon">▼</div>
                                </div>
                                <div class="searx-collapsible-content">
                                    <div class="searx-checkbox-grid" id="engines-grid"></div>
                                </div>
                            </div>
                        </div>
                        <div class="searx-footer">
                            <div class="searx-switcher">
                                <label class="searx-switch">
                                    <input type="checkbox" id="searx-new-tab" ${prefs.newTab ? 'checked' : ''}>
                                    <span class="searx-slider"></span>
                                </label>
                                <label for="searx-new-tab">Abrir em nova aba</label>
                            </div>
                            <div class="searx-btn-group">
                                <button class="searx-button searx-button-secondary" id="searx-save">Salvar Preferências</button>
                                <button class="searx-button searx-button-danger" id="searx-close">×</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);
                console.log("Overlay do Searx adicionado ao DOM");

                // Tornar a modal arrastável pelo cabeçalho
                const modal = overlay.querySelector('.searx-modal');
                const header = modal.querySelector('.searx-header');
                makeSearxDraggable(modal, header);

                // Posicionar a modal no centro inicialmente
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const modalWidth = modal.offsetWidth;
                const modalHeight = modal.offsetHeight;

                modal.style.top = `${(viewportHeight - modalHeight) / 2}px`;
                modal.style.left = `${(viewportWidth - modalWidth) / 2}px`;

                // Configurar seções colapsáveis
                const collapsibleHeaders = document.querySelectorAll('.searx-collapsible-header');
                collapsibleHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        header.classList.toggle('active');
                        const content = header.nextElementSibling;
                        content.classList.toggle('open');
                    });
                });

                // Preencher histórico
                const historyContainer = document.getElementById('searx-history');
                prefs.history.forEach(query => {
                    const item = document.createElement('div');
                    item.className = 'searx-history-item';
                    item.textContent = query;
                    item.addEventListener('click', () => {
                        document.getElementById('searx-query').value = query;
                    });
                    historyContainer.appendChild(item);
                });

                // Preencher categorias
                const categoriesGrid = document.getElementById('categories-grid');
                Object.entries(SEARX_CATEGORIES).forEach(([value, label]) => {
                    const item = document.createElement('div');
                    item.className = 'searx-checkbox-item';
                    item.innerHTML = `
                        <input type="checkbox" class="searx-checkbox searx-category"
                            value="${value}" id="cat-${value}" ${prefs.categories.includes(value) ? 'checked' : ''}>
                        <label for="cat-${value}">${label}</label>
                    `;
                    categoriesGrid.appendChild(item);
                });

                // Preencher motores
                const enginesGrid = document.getElementById('engines-grid');
                Object.entries(SEARX_ENGINES).forEach(([value, label]) => {
                    const item = document.createElement('div');
                    item.className = 'searx-checkbox-item';
                    item.innerHTML = `
                        <input type="checkbox" class="searx-checkbox searx-engine"
                            value="${value}" id="eng-${value}" ${prefs.engines.includes(value) ? 'checked' : ''}>
                        <label for="eng-${value}">${label}</label>
                    `;
                    enginesGrid.appendChild(item);
                });

                // Atualizar contadores
                updateSearxCounters();

                // Event Listeners
                document.getElementById('searx-save').addEventListener('click', () => {
                    const categories = Array.from(document.querySelectorAll('.searx-category:checked')).map(el => el.value);
                    const engines = Array.from(document.querySelectorAll('.searx-engine:checked')).map(el => el.value);
                    const newTab = document.getElementById('searx-new-tab').checked;

                    saveSearxPreferences({
                        categories,
                        engines,
                        newTab,
                        history: prefs.history
                    });

                    showSearxToast('Preferências salvas com sucesso!');
                });

                document.getElementById('searx-inline-search').addEventListener('click', performSearxSearch);
                document.getElementById('searx-close').addEventListener('click', closeSearxModal);

                // Fechar ao clicar fora
                overlay.addEventListener('click', e => {
                    if (e.target === overlay) closeSearxModal();
                });

                // Shortcuts
                document.getElementById('searx-query').addEventListener('keydown', e => {
                    if (e.key === 'Enter') performSearxSearch();
                    if (e.key === 'Escape') closeSearxModal();
                });

                // Adicionar animação com requestAnimationFrame para melhor performance
                requestAnimationFrame(() => {
                    overlay.classList.add('searx-fade-in');
                    modal.classList.add('searx-move-up');
                });

                // Função de fechar modal com animação
                function closeSearxModal() {
                    overlay.classList.remove('searx-fade-in');
                    overlay.querySelector('.searx-modal').classList.remove('searx-move-up');
                    setTimeout(() => overlay.remove(), SEARX_CONFIG.animationDuration);
                }

                // Realizar pesquisa
                function performSearxSearch() {
                    const query = document.getElementById('searx-query').value.trim();

                    if (!query) {
                        document.getElementById('searx-query').focus();
                        return;
                    }

                    // Obter categorias e motores selecionados
                    const categories = Array.from(document.querySelectorAll('.searx-category:checked')).map(el => el.value);
                    const engines = Array.from(document.querySelectorAll('.searx-engine:checked')).map(el => el.value);
                    const newTab = document.getElementById('searx-new-tab').checked;

                    // Salvar preferências e seleções
                    saveSearxPreferences({
                        categories,
                        engines,
                        newTab,
                        history: prefs.history
                    });

                    // Construir URL
                    const searchUrl = `${SEARX_CONFIG.instanceUrl}/?q=${encodeURIComponent(query)}&categories=${categories.join(',')}&engines=${engines.join(',')}&language=auto&safesearch=${SEARX_CONFIG.safeSearch}&image_proxy=${SEARX_CONFIG.imageProxy}&url_tracking_remove=${SEARX_CONFIG.urlTrackingRemove}`;

                    // Salvar no histórico
                    saveSearxToHistory(query);

                    // Abrir pesquisa
                    window.open(searchUrl, newTab ? '_blank' : '_self');

                    closeSearxModal();
                }

                // Atualizar contadores de seleção
                function updateSearxCounters() {
                    const catCount = document.querySelectorAll('.searx-category:checked').length;
                    const engCount = document.querySelectorAll('.searx-engine:checked').length;

                    document.getElementById('categories-counter').textContent =
                        `${catCount} de ${Object.keys(SEARX_CATEGORIES).length} selecionadas`;

                    document.getElementById('engines-counter').textContent =
                        `${engCount} de ${Object.keys(SEARX_ENGINES).length} selecionados`;
                }

                // Auto-foco na caixa de pesquisa
                setTimeout(() => document.getElementById('searx-query').focus(), 100);

            } catch (error) {
                console.error("Erro ao mostrar modal Searx:", error);
                showOverlayConfirmationAutoClose("Erro", "Falha ao abrir o Searx: " + error.message);
            }
        }

        const btnCopyLink = createCopyLinkButton();
    const btnUrlFull = createUrlFullButton();
    const btnIsgd = createIsgdButton();
    const btnActivateClickCopy = createActivateClickCopyButton();
    const btnPaywallOff = createPaywallOffButton();
    const btnGoogleTrad = (function createGoogleTradButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Google trad.';
    btn.className = 'btn-default btn-googletrad';
    btn.title = 'Traduza a página';
    btn.addEventListener('click', function() {
        toggleGoogleTranslate();
        updateGoogleTradButtonStyle(btn);
    });
    updateGoogleTradButtonStyle(btn);
    return btn;
})();
        const btnSearx = createSearxButton();
        const btnTopBottom = createButton("Topo/Fundo", toggleTopBottom);
        btnTopBottom.className = 'btn-default';
        btnTopBottom.title = 'Ativa/desativa o recurso de rolagem para o topo e fundo (apenas nesta página)';
        btnTopBottom.style.margin = "0";
        btnIMGs = createButton("IMGs", toggleImgs);
        btnIMGs.className = 'btn-default';
        btnIMGs.title = 'Ativa/desativa ícones para copiar imagem ou link em todas as imagens da página';
        btnIMGs.style.margin = "0";
        const btnReadingMode = createReadingModeButton();
        btnDataExposed = createDataExposedButton();
        const btnTurboLoader = createTurboLoaderButton();

        const youtubeMenuButton = createYoutubeMenuButton();
        const pdfMenuButton = createPDFsMenuButton();

        centerContainer.appendChild(youtubeMenuButton);
        centerContainer.appendChild(btnUrlFull);
        centerContainer.appendChild(btnCopyLink);
        centerContainer.appendChild(btnIsgd);
        centerContainer.appendChild(pdfMenuButton);
        centerContainer.appendChild(btnActivateClickCopy);
        centerContainer.appendChild(btnPaywallOff);
        centerContainer.appendChild(btnGoogleTrad);
        centerContainer.appendChild(btnSearx);
        centerContainer.appendChild(btnTopBottom);
        centerContainer.appendChild(btnIMGs);
        centerContainer.appendChild(btnReadingMode);
        centerContainer.appendChild(btnDataExposed);
        centerContainer.appendChild(btnTurboLoader);
        console.log('Botões adicionados ao container central');

        let topBottomElements = null;
        function initializeTopBottom() {
            if (location.hostname.includes('youtube.com')) {
                showOverlayConfirmationAutoClose("Aviso", "No YouTube não funciona devido a bloqueios internos.");
                return;
            }

            let scrollElement = document.documentElement;

            const buttonTop = document.createElement('div');
            buttonTop.className = 'GO_TO_TOP_button';
            buttonTop.innerHTML = `
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M825.568 555.328l-287.392-289.28C531.808 259.648 523.488 256.576 515.2 256.64 514.08 256.544 513.12 256 512 256c-4.672 0-9.024 1.088-13.024 2.88-4.032 1.536-7.872 3.872-11.136 7.136l-259.328 258.88c-12.512 12.48-12.544 32.736-0.032 45.248 6.24 6.272 14.432 9.408 22.656 9.408 8.192 0 16.352-3.136 22.624-9.344L480 364.288V928c0 17.696 14.336 32 32 32s32-14.304 32-32V362.72l236.192 237.728c6.24 6.272 14.496 9.44 22.688 9.44s16.32-3.104 22.56-9.312C838.016 588.128 838.048 567.84 825.568 555.328z"/>
                    <path d="M864 192H160C142.336 192 128 177.664 128 160s14.336-32 32-32h704c17.696 0 32 14.336 32 32S881.696 192 864 192z"/>
                </svg>`;
            Object.assign(buttonTop.style, {
                position: 'fixed',
                right: '14px',
                top: 'calc(50% - 40px)',
                width: '30px',
                height: '30px',
                borderRadius: '5px',
                backgroundColor: 'white',
                opacity: '0.8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: '10000001'
            });
            buttonTop.addEventListener('click', () => {
                console.log('Botão Topo clicado');
                if (scrollElement) {
                    scrollElement.scrollTop = 0;
                    console.log('Rolando para o topo do elemento:', scrollElement.tagName);
                } else {
                    console.error('Elemento de rolagem não encontrado');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });

            const buttonBottom = document.createElement('div');
            buttonBottom.className = 'GO_TO_BOTTOM_button';
            buttonBottom.innerHTML = `
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M198.4 468.352l287.392 289.28c6.368 6.4 14.688 9.472 22.976 9.408 1.12 0.096 2.08 0.64 3.2 0.64 4.672 0 9.024-1.088 13.024-2.88 4.032-1.536 7.872-3.872 11.136-7.136l259.328-258.88c12.512-12.48 12.544-32.736 0.032-45.248-6.24-6.272-14.432-9.408-22.656-9.408-8.192 0-16.352 3.136-22.624 9.344L544 659.712V96c0-17.696-14.336-32-32-32s-32 14.304-32 32v565.28L243.808 423.552c-6.24-6.272-14.496-9.44-22.688-9.44s-16.32 3.104-22.56 9.312c-12.48 12.512-12.512 32.8-0.032 45.312z"/>
                    <path d="M160 832h704c17.664 0 32 14.336 32 32s-14.336 32-32 32H160c-17.664 0-32-14.336-32-32s14.336-32 32-32z"/>
                </svg>`;
            Object.assign(buttonBottom.style, {
                position: 'fixed',
                right: '14px',
                top: 'calc(50% + 10px)',
                width: '30px',
                height: '30px',
                borderRadius: '5px',
                backgroundColor: 'white',
                opacity: '0.8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: '10000001'
            });
            let scrollingInterval;
            let isScrolling = false;
            buttonBottom.addEventListener('click', () => {
                console.log('Botão Fundo clicado');
                if (isScrolling) {
                    clearInterval(scrollingInterval);
                    buttonBottom.style.backgroundColor = 'white';
                    isScrolling = false;
                    console.log('Parando rolagem contínua');
                } else {
                    if (scrollElement) {
                        scrollingInterval = setInterval(() => {
                            const targetHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
                            scrollElement.scrollTop = targetHeight;
                            console.log('Rolando para o fundo do elemento:', scrollElement.scrollHeight);
                        }, 1000);
                        buttonBottom.style.backgroundColor = 'green';
                        isScrolling = true;
                        console.log('Iniciando rolagem contínua');
                    } else {
                        console.error('Elemento de rolagem não encontrado');
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                }
            });

            topBottomElements = { buttonTop, buttonBottom };
            document.body.appendChild(buttonTop);
            document.body.appendChild(buttonBottom);
        }

        function removeTopBottom() {
            if (topBottomElements) {
                topBottomElements.buttonTop.remove();
                topBottomElements.buttonBottom.remove();
                topBottomElements = null;
            }
        }

        function toggleTopBottom() {
            if (topBottomElements) {
                removeTopBottom();
                btnTopBottom.removeAttribute("data-active");
            } else {
                initializeTopBottom();
                if (!location.hostname.includes('youtube.com')) {
                    btnTopBottom.setAttribute("data-active", "true");
                }
            }
        }

        try {
    console.log('Tentando inicializar a barra');
    // Verificar o estado antes de adicionar ao DOM
    if (barHidden) {
        toolbar.style.display = 'none';
    }
    document.body.appendChild(toolbar); // Garante que a barra esteja no DOM
    // Configurar atalho de teclado
    setupKeyboardShortcut();

    // Aguarda o DOM carregar completamente antes de aplicar o layout
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (barHidden) {
                console.log('Barra iniciada como oculta devido ao estado global salvo');
                hideBar();
            } else {
                console.log('Barra exibida por padrão');
                showBar();
            }
        }, 100); // Reduzido para 100ms para minimizar a aparição momentânea
    });
} catch (error) {
    console.error('Erro ao inicializar a barra:', error);
    toolbar.style.display = 'flex';
    document.body.appendChild(toolbar);
    setupKeyboardShortcut(); // Também tenta configurar o atalho em caso de erro
    showOverlayConfirmationAutoClose("Erro", "Falha ao inicializar a barra: " + error.message);
}


        // Observador para reaplicar o layout após mudanças no <ytd-app>
        if (location.hostname.includes('youtube.com')) {
            const observer = new MutationObserver(() => {
                if (!barHidden) {
                    if (urlBarActive) {
                        applyPushDownWithUrlBar();
                    } else {
                        applyPushDown();
                    }
                }
            });
            const appElement = document.querySelector('ytd-app') || document.body;
            observer.observe(appElement, { childList: true, subtree: true });
            console.log('Observador de layout inicializado para ytd-app');
        }

        if (location.hostname.includes('youtube.com')) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    const newVideoId = getVideoIdFromUrl();
                    if (newVideoId && newVideoId !== lastVideoId) {
                        lastVideoId = newVideoId;
                    }
                });
            });

            let lastVideoId = getVideoIdFromUrl();
            observer.observe(document.querySelector('ytd-app') || document.body, {
                childList: true,
                subtree: true
            });
        }

        // Inicializar o Turbo Loader se estiver ativo
        if (turboLoaderActive && !window.location.hostname.includes('youtube.com')) {
            initTurboLoader();
        }

        console.log('Script finalizado');

})();