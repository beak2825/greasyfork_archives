// ==UserScript==
// @name         Flickr: Commenters Summary
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       Isidro Vila Verde
// @description  Displays a panel showing commenters sorted by the number of comments made
// @match        https://www.flickr.com/*
// @match        https://flickr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537455/Flickr%3A%20Commenters%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/537455/Flickr%3A%20Commenters%20Summary.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configurações globais
    const STORAGE = {
        apiKey: 'flickr_api_key',
        darkMode: 'flickr_dark_mode',
        panelPos: 'flickr_panel_pos',
        sortMode: 'flickr_sort_mode'
    };

    // Elementos globais
    let btn = null;
    let panel = null;
    let isRunning = false;
    const validPathRegex = /^\/photos\/[^/]+(?:\/(?:with\/.+)?)?$/;

    // Verificador de URL
    function isValidPage() {
        return validPathRegex.test(window.location.pathname);
    }

    // Limpeza dos elementos
    function cleanUp() {
        if (btn) {
            btn.remove();
            btn = null;
        }
        if (panel) {
            panel.remove();
            panel = null;
        }
        isRunning = false;
    }

    // Cria o botão inicial
    function createStartButton() {
        if (btn) return;

        btn = document.createElement('button');
        btn.textContent = '📊 Comentadores';
        btn.style.position = 'fixed';
        btn.style.top = '5px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '9999';
        btn.style.padding = '2px';
        btn.style.background = '#0063dc';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.maxWidth = '10vw';
        btn.style.whiteSpace = 'nowrap';
        btn.style.overflow = 'hidden';
        btn.style.textOverflow = 'ellipsis';

        btn.addEventListener('click', run);
        document.body.appendChild(btn);
    }

    // Observador de mudanças de URL
    function setupUrlObserver() {
        let lastUrl = location.href;

        // Observa mudanças a cada 500ms
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        }, 500);

        // Captura navegações via History API
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            handleUrlChange();
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            handleUrlChange();
        };

        // Captura eventos de popstate (back/forward)
        window.addEventListener('popstate', handleUrlChange);
    }

    // Manipulador de mudança de URL
    function handleUrlChange() {
        if (isValidPage()) {
            console.log('isValidPage');
            if (!btn) {
                console.log('createButton');
                createStartButton();
            }
        } else {
            console.log('isNotValidPage=>CleanButton');
            cleanUp();
        }
    }

    // Funções auxiliares
    const log = (...args) => console.log('[FlickrResumo]', ...args);

    function getStored(key, fallback = null) {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    }

    function setStored(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getApiKey() {
        let key = getStored(STORAGE.apiKey);
        if (!key) {
            key = prompt("🔑 Introduz a tua API key do Flickr:");
            if (key) setStored(STORAGE.apiKey, key.trim());
            else return null;
        }
        return key;
    }

    async function resolveUserId(apiKey) {
        const path = window.location.pathname;
        const match = path.match(/^\/photos\/([^/]+)(?:\/(?:with\/.+)?)?$/);
        if (!match) return null;

        const identifier = match[1];
        if (/^\d+@N\d+$/.test(identifier)) {
            return identifier;
        }

        const fullUrl = `https://www.flickr.com/photos/${identifier}/`;
        const url = `https://www.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key=${apiKey}&url=${encodeURIComponent(fullUrl)}&format=json&nojsoncallback=1`;

        try {
            const data = await fetchJSON(url);
            return data.user?.id || null;
        } catch (e) {
            console.error("Erro ao resolver user_id via lookupUser:", e);
            return null;
        }
    }

    async function fetchJSON(url) {
        const res = await fetch(url);
        return res.json();
    }

    async function getPhotos(userId, apiKey, perPage = 100, maxPages = 2) {
        let photos = [];
        for (let page = 1; page <= maxPages; page++) {
            const url = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1&per_page=${perPage}&page=${page}`;
            log(`📷 A obter fotos da página ${page}...`);
            const data = await fetchJSON(url);
            if (!data.photos?.photo?.length) break;
            photos = photos.concat(data.photos.photo);
            if (page >= data.photos.pages) break;
        }
        log(`✅ Total de fotos obtidas: ${photos.length}`);
        return photos;
    }

    async function getComments(photoId, apiKey) {
        const url = `https://www.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
        const data = await fetchJSON(url);
        return (data.comments?.comment || []).map(c => ({
            user: c.authorname,
            username: c.realname || c.authorname,
            nsid: c.author,
            date: new Date(parseInt(c.datecreate, 10) * 1000)
        }));
    }

    function formatDate(date) {
        return date.toISOString().split("T")[0];
    }

    function createPanel(dataMap, totalPhotos) {
        let sortBy = getStored(STORAGE.sortMode, 'count');

        const sorted = () => {
            return Object.entries(dataMap).sort((a, b) => {
                if (sortBy === 'count') return b[1].count - a[1].count;
                return b[1].last - a[1].last;
            });
        };

        panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.width = "600px";
        panel.style.height = "400px";
        panel.style.overflow = "auto hidden";
        panel.style.resize = "both";
        panel.style.zIndex = "10000";
        panel.style.border = "2px solid #0063dc";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
        panel.style.fontFamily = "sans-serif";

        const savedPos = getStored(STORAGE.panelPos, { top: 100, left: 100 });
        panel.style.top = savedPos.top + 'px';
        panel.style.left = savedPos.left + 'px';

        let dark = getStored(STORAGE.darkMode, false);

        // Cabeçalho
        const header = document.createElement("div");
        header.style.background = "#0063dc";
        header.style.color = "#fff";
        header.style.padding = "6px 10px";
        header.style.cursor = "move";
        header.style.display = "flex";
        header.style.flexDirection = "column";
        header.style.gap = "4px";

        const titleRow = document.createElement("div");
        titleRow.style.display = "flex";
        titleRow.style.justifyContent = "space-between";
        titleRow.style.alignItems = "center";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = "Resumo de Comentadores";
        titleRow.appendChild(titleSpan);

        const controls = document.createElement("div");

        const makeBtn = (text, title, onclick) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.title = title;
            btn.style.marginLeft = "6px";
            btn.style.cursor = "pointer";
            btn.onclick = onclick;
            return btn;
        };

        const closeBtn = makeBtn("✖", "Fechar", () => {
            cleanUp();
            if (btn) btn.disabled = false;
        });
        const darkBtn = makeBtn("🌙", "Alternar tema", () => {
            dark = !dark;
            setStored(STORAGE.darkMode, dark);
            applyTheme();
        });
        const sortBtn = makeBtn("↕️", "Alternar ordenação", () => {
            sortBy = sortBy === 'count' ? 'date' : 'count';
            setStored(STORAGE.sortMode, sortBy);
            updateContent();
        });

        [sortBtn, darkBtn, closeBtn].forEach(btn => controls.appendChild(btn));
        titleRow.appendChild(controls);
        header.appendChild(titleRow);

        // Progresso no header
        const progressContainer = document.createElement("div");
        progressContainer.style.display = "flex";
        progressContainer.style.alignItems = "center";
        progressContainer.style.gap = "8px";
        progressContainer.style.fontSize = "0.85em";
        progressContainer.style.opacity = "0.9";

        const smallSpinner = document.createElement("div");
        smallSpinner.style.width = "14px";
        smallSpinner.style.height = "14px";
        smallSpinner.style.border = "2px solid rgba(255,255,255,0.3)";
        smallSpinner.style.borderRadius = "50%";
        smallSpinner.style.borderTop = "2px solid #fff";
        smallSpinner.style.animation = "spin 1s linear infinite";
        smallSpinner.style.display = "none";

        const progressText = document.createElement("span");
        progressContainer.appendChild(smallSpinner);
        progressContainer.appendChild(progressText);
        header.appendChild(progressContainer);

        panel.appendChild(header);

        // Container principal
        const mainContainer = document.createElement("div");
        mainContainer.style.position = "relative";
        mainContainer.style.height = "calc(100% - 60px)";
        mainContainer.style.overflow = "auto";

        // Spinner grande central
        const bigSpinner = document.createElement("div");
        bigSpinner.style.position = "absolute";
        bigSpinner.style.top = "50%";
        bigSpinner.style.left = "50%";
        bigSpinner.style.transform = "translate(-50%, -50%)";
        bigSpinner.style.width = "60px";
        bigSpinner.style.height = "60px";
        bigSpinner.style.border = "6px solid rgba(0,99,220,0.2)";
        bigSpinner.style.borderRadius = "50%";
        bigSpinner.style.borderTop = "6px solid #0063dc";
        bigSpinner.style.animation = "spin 1s linear infinite";
        bigSpinner.style.display = "none";

        // Conteúdo
        const content = document.createElement("div");
        content.style.padding = "10px";
        content.style.display = "grid";
        content.style.gridTemplateColumns = "1fr auto auto";
        content.style.gap = "8px";
        content.style.alignItems = "center";
        content.style.fontSize = "14px";
        content.style.minHeight = "100%";

        // Adicionar animação
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        mainContainer.appendChild(bigSpinner);
        mainContainer.appendChild(content);
        panel.appendChild(mainContainer);
        document.body.appendChild(panel);

        function applyTheme() {
            panel.style.background = dark ? "#1e1e1e" : "#fff";
            panel.style.color = dark ? "#ccc" : "#000";
            bigSpinner.style.border = dark ? "6px solid rgba(170,170,221,0.2)" : "6px solid rgba(0,99,220,0.2)";
            bigSpinner.style.borderTop = dark ? "6px solid #aad" : "6px solid #0063dc";
            smallSpinner.style.border = dark ? "2px solid rgba(170,170,221,0.3)" : "2px solid rgba(255,255,255,0.3)";
            smallSpinner.style.borderTop = dark ? "2px solid #aad" : "2px solid #fff";
        }

        function updateContent(processed = 0, total = totalPhotos) {
            if (processed === 0 && Object.keys(dataMap).length === 0) {
                bigSpinner.style.display = "block";
                content.style.display = "none";
            } else {
                bigSpinner.style.display = "none";
                content.style.display = "grid";
            }

            if (processed > 0 && processed < total) {
                smallSpinner.style.display = "block";
                progressText.textContent = `A processar: ${processed} / ${total} fotos`;
            } else if (processed > 0) {
                smallSpinner.style.display = "none";
                progressContainer.style.display = "none";
            } else {
                smallSpinner.style.display = "none";
                progressText.textContent = "";
            }

            content.innerHTML = "";

            ['Utilizador', 'Comentários', 'Último comentário'].forEach(h => {
                const el = document.createElement("div");
                el.textContent = h;
                el.style.fontWeight = "bold";
                el.style.position = "sticky";
                el.style.top = "0";
                el.style.background = dark ? "#1e1e1e" : "#fff";
                el.style.zIndex = "1";
                content.appendChild(el);
            });

            sorted().forEach(([user, info]) => {
                content.appendChild(userLink(info.username, info.nsid));
                content.appendChild(el(info.count));
                content.appendChild(el(formatDate(info.last)));
            });

            function el(text) {
                const d = document.createElement("div");
                d.textContent = text;
                return d;
            }

            function userLink(name, nsid) {
                const d = document.createElement("div");
                const a = document.createElement("a");
                a.href = `https://www.flickr.com/photos/${nsid}/`;
                a.textContent = name;
                a.target = "_blank";
                a.style.color = dark ? "#aad" : "#06c";
                a.style.textDecoration = "none";
                d.appendChild(a);
                return d;
            }
        }

        applyTheme();
        updateContent();

        // Função de arrastar
        let dragging = false, offsetX = 0, offsetY = 0;

        titleRow.onmousedown = e => {
            if (e.target.tagName === 'BUTTON') return;

            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            e.preventDefault();
        };

        document.onmousemove = e => {
            if (dragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
                setStored(STORAGE.panelPos, {
                    top: parseInt(panel.style.top),
                    left: parseInt(panel.style.left)
                });
            }
        };

        document.onmouseup = () => dragging = false;

        return { updateContent };
    }

    async function run() {
        if (!isValidPage()) return;
        if (isRunning) return;

        isRunning = true;
        if (btn) btn.disabled = true;

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                cleanUp();
                return;
            }

            const nsid = await resolveUserId(apiKey);
            if (!nsid) {
                alert("❌ Não foi possível obter o ID do utilizador.");
                cleanUp();
                return;
            }

            const photos = await getPhotos(nsid, apiKey, 100, 2);
            if (!photos.length) {
                alert("⚠️ Sem fotos públicas.");
                cleanUp();
                return;
            }

            const commenters = {};
            const { updateContent } = createPanel(commenters, photos.length);
            let updateCounter = 0;

            for (let i = 0; i < photos.length; i++) {
                if (!isValidPage()) {
                    cleanUp();
                    return;
                }

                const photo = photos[i];
                log(`💬 Comentários da foto ${i + 1}/${photos.length} (ID ${photo.id})...`);
                const comments = await getComments(photo.id, apiKey);

                for (const { user, username, nsid, date } of comments) {
                    if (!commenters[user]) {
                        commenters[user] = { count: 1, last: date, nsid, username };
                    } else {
                        commenters[user].count++;
                        if (date > commenters[user].last) {
                            commenters[user].last = date;
                        }
                    }
                }

                updateCounter++;
                if (updateCounter >= 10 || i === photos.length - 1) {
                    updateContent(i + 1, photos.length);
                    updateCounter = 0;
                }

                await new Promise(r => setTimeout(r, 500));
            }

            log("📊 Resultado final:", commenters);
        } catch (error) {
            console.error("Erro durante execução:", error);
            cleanUp();
        }
    }

    // Inicialização
    setupUrlObserver();
    if (isValidPage()) {
        createStartButton();
    }
})();