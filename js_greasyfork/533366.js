// ==UserScript==
// @name         Pixiv Tag Filter (User Page) + Progreso + Export/Import + Multilenguaje
// @namespace    http://tampermonkey.net/
// @version      2025-04-19.2
// @description  Filtrado de ilustraciones por tags en páginas de usuario de Pixiv. Incluye progreso visual, exportar/importar lista de tags y soporte español/inglés. Optimizado para evitar penalizaciones del sitio.
// @author       Luis
// @match        https://www.pixiv.net/en/users/*/artworks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_xmlhttpRequest
// @connect      pixiv.net
// @downloadURL https://update.greasyfork.org/scripts/533366/Pixiv%20Tag%20Filter%20%28User%20Page%29%20%2B%20Progreso%20%2B%20ExportImport%20%2B%20Multilenguaje.user.js
// @updateURL https://update.greasyfork.org/scripts/533366/Pixiv%20Tag%20Filter%20%28User%20Page%29%20%2B%20Progreso%20%2B%20ExportImport%20%2B%20Multilenguaje.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const lang = navigator.language.startsWith('en') ? 'en' : 'es';
    const t = {
        es: {
            editTags: '✏️ Editar tags',
            filter: '🚫 Filtrar contenido',
            export: '📤 Exportar tags',
            import: '📥 Importar tags',
            prompt: 'Tags a excluir separados por comas:',
            updated: 'Lista actualizada.',
            filtering: (a, b) => `🔍 Filtrando ${a}/${b}...`,
            done: (n) => `✅ Filtrado completado. Coincidencias excluidas: ${n}`,
            importSuccess: 'Lista importada correctamente.',
            importError: 'Archivo inválido o con error.'
        },
        en: {
            editTags: '✏️ Edit tags',
            filter: '🚫 Filter content',
            export: '📤 Export tags',
            import: '📥 Import tags',
            prompt: 'Tags to exclude (comma-separated):',
            updated: 'Exclusion list updated.',
            filtering: (a, b) => `🔍 Filtering ${a}/${b}...`,
            done: (n) => `✅ Filtering complete. Matches excluded: ${n}`,
            importSuccess: 'List imported successfully.',
            importError: 'Invalid or broken file.'
        }
    }[lang];

    const STORAGE_KEY = 'pixivTagExclusions';
    const MAX_CONCURRENT = 4;
    const MIN_DELAY = 200;
    const MAX_DELAY = 400;

    function getExclusionList() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    function saveExclusionList(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function delayRandom() {
        return sleep(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
    }

    function createButton(text, topOffset, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.position = 'fixed';
        btn.style.top = `${topOffset}px`;
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px';
        btn.style.background = '#1e90ff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', onClick);
        document.body.appendChild(btn);
    }

    function showLoadingMessage(text) {
        let div = document.getElementById('pixiv-filter-msg');
        if (!div) {
            div = document.createElement('div');
            div.id = 'pixiv-filter-msg';
            div.style.position = 'fixed';
            div.style.top = '50%';
            div.style.left = '50%';
            div.style.transform = 'translate(-50%, -50%)';
            div.style.zIndex = '99999';
            div.style.backgroundColor = 'yellow';
            div.style.padding = '15px 25px';
            div.style.fontSize = '20px';
            div.style.boxShadow = '0 0 10px black';
            div.style.borderRadius = '10px';
            document.body.appendChild(div);
        }
        div.textContent = text;
    }

    function hideLoadingMessage(delay = 3000) {
        const div = document.getElementById('pixiv-filter-msg');
        if (div) {
            setTimeout(() => div.remove(), delay);
        }
    }

    const cache = new Map();

    function fetchTagsFromArtwork(id) {
        return new Promise(resolve => {
            if (cache.has(id)) return resolve(cache.get(id));

            delayRandom().then(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.pixiv.net/ajax/illust/${id}`,
                    responseType: 'json',
                    headers: {
                        'Referer': 'https://www.pixiv.net/'
                    },
                    onload: res => {
                        try {
                            const tags = res.response.body.tags.tags.map(t => t.tag.toLowerCase());
                            cache.set(id, tags);
                            resolve(tags);
                        } catch (err) {
                            console.error(`[${id}] Error parseando`, err);
                            resolve([]);
                        }
                    },
                    onerror: err => {
                        console.error(`[${id}] Error de red`, err);
                        resolve([]);
                    }
                });
            });
        });
    }

    async function fetchTagsAndFilter() {
        const excludeList = getExclusionList().map(t => t.toLowerCase());
        const thumbs = Array.from(document.querySelectorAll('a[href*="/artworks/"]'))
            .filter((a, i, arr) => arr.findIndex(b => b.href === a.href) === i);

        const queue = shuffle(thumbs.map(thumb => {
            const match = thumb.href.match(/artworks\/(\d+)/);
            return match ? { id: match[1], thumb } : null;
        }).filter(Boolean));

        let index = 0, active = 0, matched = 0, total = queue.length;

        showLoadingMessage(t.filtering(0, total));

        return new Promise(resolve => {
            function next() {
                if (index >= queue.length && active === 0) {
                    showLoadingMessage(t.done(matched));
                    hideLoadingMessage();
                    resolve();
                    return;
                }

                while (active < MAX_CONCURRENT && index < queue.length) {
                    const { id, thumb } = queue[index++];
                    active++;

                    fetchTagsFromArtwork(id).then(tags => {
                        const match = tags.some(tag => excludeList.includes(tag));
                        if (match) {
                            const li = thumb.closest('li');
                            if (li) li.style.display = 'none';
                            matched++;
                        }
                    }).finally(() => {
                        active--;
                        showLoadingMessage(t.filtering(index, total));
                        if (index % 10 === 0) {
                            sleep(2000 + Math.random() * 2000).then(next);
                        } else {
                            next();
                        }
                    });
                }
            }
            next();
        });
    }

    function exportTags() {
        const data = JSON.stringify(getExclusionList(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixiv_tag_exclusions.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importTags() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.addEventListener('change', () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const list = JSON.parse(reader.result);
                    if (Array.isArray(list)) {
                        saveExclusionList(list.map(t => t.trim()).filter(Boolean));
                        alert(t.importSuccess);
                    } else {
                        alert(t.importError);
                    }
                } catch {
                    alert(t.importError);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    window.addEventListener('load', () => {
        createButton(t.editTags, 100, () => {
            const input = prompt(t.prompt, getExclusionList().join(', '));
            if (input !== null) {
                const list = input.split(',').map(t => t.trim()).filter(Boolean);
                saveExclusionList(list);
                alert(t.updated);
            }
        });

        createButton(t.filter, 150, fetchTagsAndFilter);
        createButton(t.export, 200, exportTags);
        createButton(t.import, 250, importTags);
    });
})();
