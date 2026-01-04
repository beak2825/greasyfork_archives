// ==UserScript==
// @name         Editor pro export do InCopy
// @namespace    urn:uuid:a1b2c3d4-e5f6-7890-1234-567890abcdef // Unikátní identifikátor
// @version      2.1
// @description  Vloží na WordPress lištu tlačítko pro spuštění editoru pro export textu do InCopy, s pokročilou správou greyboxů a funkcí stručného výtahu pomocí Gemini AI.
// @author       Ondřej Horník
// @match        https://denikn.cz/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siPjxwYXRoIGQ9Ik0zIDE3LjI1VjIxSDYuNzVMMTcuODEgOS45NEwxNC4wNiA2LjE5TDMgMTcuMjVabTE3LjcxLTguNDFjLjM5LS4zOS4zOS0xLjAyIDAtMS40MWwtMi4zNC0yLjM0YS45OTU5Ljk5NTkgMCAwIDAtMS40MSAwTDE2Ljg5IDYuMjhMMTQuMDYgOS45NEwxNS44OSA4LjExbDEuODMtMS44M1oiLz48L3N2Zz4=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540747/Editor%20pro%20export%20do%20InCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/540747/Editor%20pro%20export%20do%20InCopy.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function runInCopyEditor() {
        // --- NASTAVENÍ ---
        const ARTICLE_SELECTOR = 'div#content';
        const EXCERPT_SELECTOR = 'div.n3_excerpt';
        const HEADER_SELECTOR = 'header.b_single_h';
        const HEADER_CONTENT_SELECTOR = 'div.b_single_e';
        const GREYBOX_SELECTOR_CUTOFF = 'div.t_greybox.t_greybox__shorty';
        const TARGET_BLOCK_TAGS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'LI'];
        // CONTAINERS_TO_KEEP již nebudou použity pro zachování obsahu jako celku,
        // ale spíše pro identifikaci kontejnerů, které mají mít své vnitřní elementy zpracovány.
        const CONTAINERS_TO_PROCESS_INDIVIDUALLY = ['.t_greybox'];
        const ELEMENTS_TO_REMOVE = [
            'figure', 'article.tile.tile__link', 'iframe',
            '.twitter-tweet', '.fb-post', '.n3_end.e_end.t_thankyou',
            'aside',
            'div.n3_snippet'
        ];
        const EDITOR_ID = 'profi-editor-overlay';
        const GEMINI_API_MODEL = 'gemini-2.5-flash'; // Model pro Gemini API

        // --- KONTROLA ---
        if (document.getElementById(EDITOR_ID)) { return; }
        const sourceArticle = document.querySelector(ARTICLE_SELECTOR);
        if (!sourceArticle) { return alert('Na této stránce nebyl nalezen článek ke zpracování (div#content).'); }

        const pageTitle = document.querySelector('h1')?.textContent.trim() || 'Editor pro export do InCopy';

        function sanitizeFilename(text) {
            const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
            const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
            const p = new RegExp(a.split('').join('|'), 'g')
            return text.toString().toLowerCase().replace(/\s+/g, '-').replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, '-and-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').substring(0, 75);
        }
        const filenameBase = sanitizeFilename(pageTitle) || 'clanek';

        // --- 1. KROK: KLONOVÁNÍ A ČIŠTĚNÍ ---
        const articleClone = sourceArticle.cloneNode(true);

        const excerptElement = document.querySelector(EXCERPT_SELECTOR);
        let excerptClone = null;
        if (excerptElement) {
            excerptClone = excerptElement.cloneNode(true);
        }

        ELEMENTS_TO_REMOVE.forEach(selector => articleClone.querySelectorAll(selector).forEach(el => el.remove()));

        const header = articleClone.querySelector(HEADER_SELECTOR);
        if (header) { (header.querySelector(HEADER_CONTENT_SELECTOR) ? header.replaceWith(...header.querySelector(HEADER_CONTENT_SELECTOR).childNodes) : header.remove()); }

        const greyboxCutoff = articleClone.querySelector(GREYBOX_SELECTOR_CUTOFF);
        if (greyboxCutoff) {
            let nextSibling = greyboxCutoff.nextElementSibling;
            while (nextSibling) { let toRemove = nextSibling; nextSibling = nextSibling.nextElementSibling; toRemove.remove(); }
            greyboxCutoff.remove();
        }

        // --- 2. KROK: VYTVOŘENÍ UI EDITORU ---
        const styles = `
            #${EDITOR_ID} { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.75); z-index: 99999; display: flex; align-items: center; justify-content: center; }
            #profi-editor-panel { width: 90%; max-width: 800px; height: 90vh; background-color: #fdfdfd; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 5px 20px rgba(0,0,0,0.4); color: #333; } /* Přidáno: color: #333; */
            #profi-editor-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; font-family: sans-serif; font-size: 16px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; }
            #profi-editor-header > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .profi-editor-header-btn { flex-shrink: 0; margin-left: 15px; font-size: 12px; padding: 5px 10px; background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-weight: normal; color: #333; } /* Přidáno: color: #333; */
            #profi-editor-content { padding: 20px; overflow-y: scroll; flex-grow: 1; }

            .profi-greybox-wrapper {
                border: 2px solid #a0a0a0; /* Rámeček pro celý greybox */
                background-color: #e0e0e0; /* Podbarvení celého greyboxu */
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .profi-greybox-wrapper::before {
                content: "GREYBOX: ";
                font-weight: bold;
                color: #555;
                display: block;
                margin-bottom: 10px;
            }
            .profi-greybox-wrapper.is-deactivated {
                opacity: 0.5;
                text-decoration: line-through;
            }

            .profi-content-block {
                position: relative; padding: 10px; padding-right: 40px; margin-bottom: 10px; border: 1px solid #eee; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; background-color: #fff;
            }
            .profi-content-block.is-deactivated { opacity: 0.4; background-color: #f0f0f0; text-decoration: line-through; }
            .profi-content-block.is-question > :first-child { font-weight: bold; }
            .profi-toggle-question { position: absolute; top: 50%; right: 8px; transform: translateY(-50%); width: 24px; height: 24px; border: 1px solid #ccc; background-color: #f0f0f0; color: #888; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; line-height: 22px; text-align: center; }
            .profi-content-block.is-question .profi-toggle-question { background-color: #007bff; color: white; border-color: #007bff; }

            /* Styly pro bloky uvnitř greyboxu - menší mezera */
            .profi-greybox-wrapper .profi-content-block {
                margin-bottom: 5px;
            }

            #profi-editor-footer { padding: 15px 20px; border-top: 1px solid #ddd; background-color: #f7f7f7; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
            #profi-char-count-display { font-family: sans-serif; font-size: 14px; color: #333; margin-bottom: 5px;} /* Opraveno: color: #black; na color: #333; */
            .profi-editor-btn-group { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
            .profi-editor-btn { padding: 10px 15px; font-size: 14px; font-weight: bold; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; background-color: #fff; color: #333; } /* Přidáno: color: #333; */
            .profi-editor-btn.primary { background-color: #28a745; color: white; border-color: #28a745; }
            .profi-editor-btn.secondary { background-color: #007bff; color: white; border-color: #007bff; }
            .profi-editor-btn.close { background-color: #dc3545; color: white; border-color: #dc3545; }
            .profi-excerpt-block { border: 1px dashed #ced4da; }
            .profi-excerpt-block::before { content: "PEREX: "; font-weight: bold; color: #6c757d; display: block; margin-bottom: 5px; }

            /* NOVÉ STYLY PRO GEMINI OVERLAY */
            #profi-gemini-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.85); /* Tmavší, aby vynikl nad hlavním editorem */
                z-index: 999999; /* Vyšší z-index než EDITOR_ID */
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #profi-gemini-panel {
                width: 80%;
                max-width: 600px;
                max-height: 80vh; /* Povolit posouvání, pokud je obsah dlouhý */
                background-color: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            }
            #profi-gemini-header {
                padding: 10px 20px;
                font-family: sans-serif;
                font-size: 16px;
                font-weight: bold;
                color: #333;
                border-bottom: 1px solid #ddd;
            }
            #profi-gemini-content {
                padding: 20px;
                overflow-y: auto; /* Obsah bude posouvatelný */
                flex-grow: 1;
                font-family: sans-serif;
                color: #333; /* Přidáno pro jistotu */
                line-height: 1.6;
            }
            #profi-gemini-content ul {
                list-style: disc;
                padding-left: 20px;
                margin-top: 10px;
            }
            #profi-gemini-content li {
                margin-bottom: 8px;
            }
            #profi-gemini-footer {
                padding: 15px 20px;
                border-top: 1px solid #ddd;
                background-color: #f7f7f7;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .profi-gemini-btn {
                padding: 8px 12px;
                font-size: 13px;
                font-weight: bold;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                background-color: #fff;
                color: #333; /* Přidáno pro jistotu */
            }
            .profi-gemini-btn.primary {
                background-color: #007bff;
                color: white;
                border-color: #007bff;
            }
            .profi-gemini-btn.close {
                background-color: #dc3545;
                color: white;
                border-color: #dc3545;
            }
        `;
        const overlay = document.createElement('div');
        overlay.id = EDITOR_ID;
        overlay.innerHTML = `<style>${styles}</style><div id="profi-editor-panel"><div id="profi-editor-header"><span>${pageTitle}</span><button id="profi-btn-unmark-all" class="profi-editor-header-btn">Odznačit otázky</button></div><div id="profi-editor-content"></div><div id="profi-editor-footer"><span id="profi-char-count-display"></span><div class="profi-editor-btn-group"><button id="profi-btn-copy-incopy" class="profi-editor-btn primary">Kopírovat pro InCopy</button><button id="profi-btn-copy-plain" class="profi-editor-btn secondary">Kopírovat čistý text</button><button id="profi-btn-download-incopy" class="profi-editor-btn">Stáhnout pro InCopy</button><button id="profi-btn-download-plain" class="profi-editor-btn">Stáhnout čistý text</button><button id="profi-btn-summarize" class="profi-editor-btn secondary">Stručně</button><button id="profi-btn-close" class="profi-editor-btn close">Zavřít</button></div></div></div>`;
        document.body.appendChild(overlay);

        function isParagraphAQuestion(p) {
            function hasUnboldedText(element) {
                const BOLD_TAGS = ['STRONG', 'B'];
                for (const node of element.childNodes) {
                    if (node.nodeType === 3 && node.textContent.trim() !== '') { return true; }
                    if (node.nodeType === 1 && !BOLD_TAGS.includes(node.tagName)) {
                        if (hasUnboldedText(node)) { return true; }
                    }
                }
                return false;
            }
            return !hasUnboldedText(p);
        }

        // --- 3. KROK: NAPLNĚNÍ EDITORU ---
        const contentDiv = overlay.querySelector('#profi-editor-content');

        // Pomocná funkce pro vytvoření wrapperu pro blok textu
        function createContentBlockWrapper(blockElement, isExcerpt = false) {
            const wrapper = document.createElement('div');
            wrapper.className = 'profi-content-block';
            if (isExcerpt) {
                wrapper.classList.add('profi-excerpt-block');
            } else {
                const isInitiallyQuestion = (blockElement.tagName === 'P' && isParagraphAQuestion(blockElement));
                if (isInitiallyQuestion) { wrapper.classList.add('is-question'); }
            }
            wrapper.appendChild(blockElement.cloneNode(true)); // Klonujeme původní element

            // Přidáme toggle pro otázky pouze k <p> elementům (ne k perexu)
            if (blockElement.tagName === 'P' && !isExcerpt) {
                const questionToggle = document.createElement('button');
                questionToggle.className = 'profi-toggle-question';
                questionToggle.textContent = 'Q';
                wrapper.appendChild(questionToggle);
            }
            return wrapper;
        }

        // 1. Přidáme perex jako první blok
        if (excerptClone) {
            contentDiv.appendChild(createContentBlockWrapper(excerptClone, true));
        }

        // 2. Projdeme klonovaný článek a zpracujeme bloky včetně těch uvnitř greyboxů
        function processNode(node, targetContainer) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const blockTag = node.tagName;
                const isTargetBlock = TARGET_BLOCK_TAGS.includes(blockTag);
                const isContainerToProcess = CONTAINERS_TO_PROCESS_INDIVIDUALLY.some(selector => node.matches(selector));

                if (isContainerToProcess) {
                    // Pokud je to greybox (nebo jiný kontejner pro individuální zpracování)
                    const greyboxWrapper = document.createElement('div');
                    greyboxWrapper.className = 'profi-greybox-wrapper';
                    greyboxWrapper.dataset.originalBlockId = node.id || `gb-${Math.random().toString(36).substring(2, 9)}`; // Pro referenci

                    // Všechny děti greyboxu procházíme rekurzivně do tohoto wrapperu
                    Array.from(node.children).forEach(child => {
                        processNode(child, greyboxWrapper);
                    });

                    // Přidáme greybox wrapper do cílového kontejneru pouze pokud obsahuje nějaké bloky
                    if (greyboxWrapper.children.length > 0) {
                        targetContainer.appendChild(greyboxWrapper);
                    }
                } else if (isTargetBlock) {
                    // Pokud je to cílový blok textu (P, Hx, atd.) a má obsah
                    if (node.textContent.trim() !== '') {
                        targetContainer.appendChild(createContentBlockWrapper(node));
                    }
                } else {
                    // Jiné elementy (např. divy bez specifické třídy, spany atd.) procházíme dál
                    Array.from(node.children).forEach(child => {
                        processNode(child, targetContainer);
                    });
                }
            }
        }

        processNode(articleClone, contentDiv); // Spustíme zpracování od klonovaného článku

        // --- 4. KROK: PŘIDÁNÍ INTERAKTIVITY ---
        const getCleanText = () => {
            // Hledáme bloky v celém editoru, které nejsou deaktivované a nejsou kontejnerem
            const activeBlocks = contentDiv.querySelectorAll('.profi-content-block:not(.is-deactivated):not(.profi-greybox-wrapper)');
            const textParts = Array.from(activeBlocks).map(block => block.firstElementChild.textContent.replace(/\s+/g, ' ').trim());
            return textParts.filter(text => text).join('\n');
        };

        const updateCharacterCount = () => {
            const charCountElement = overlay.querySelector('#profi-char-count-display');
            if (!charCountElement) return;
            const count = getCleanText().length;
            charCountElement.textContent = `Počet znaků: ${count.toLocaleString('cs-CZ')}`;
        };

        overlay.querySelector('#profi-btn-unmark-all').addEventListener('click', () => {
            contentDiv.querySelectorAll('.profi-content-block.is-question').forEach(block => {
                block.classList.remove('is-question');
            });
        });

        contentDiv.addEventListener('click', (e) => {
            const block = e.target.closest('.profi-content-block');
            const greyboxWrapper = e.target.closest('.profi-greybox-wrapper');

            if (!block && !greyboxWrapper) return; // Klik mimo relevantní blok

            if (e.target.matches('.profi-toggle-question')) {
                e.stopPropagation();
                block.classList.toggle('is-question');
            } else if (block) { // Klik na běžný blok textu (včetně perexu a bloků uvnitř greyboxu)
                block.classList.toggle('is-deactivated');
                // Pokud deaktivujeme/aktivujeme blok uvnitř greyboxu,
                // zkontrolujeme stav celého greyboxu
                if (block.closest('.profi-greybox-wrapper')) {
                    const parentGreybox = block.closest('.profi-greybox-wrapper');
                    const allInnerBlocks = parentGreybox.querySelectorAll('.profi-content-block');
                    const allDeactivated = Array.from(allInnerBlocks).every(b => b.classList.contains('is-deactivated'));
                    if (allDeactivated) {
                        parentGreybox.classList.add('is-deactivated');
                    } else {
                        parentGreybox.classList.remove('is-deactivated');
                    }
                }
            } else if (greyboxWrapper) { // Klik na greybox wrapper samotný (mimo vnitřní blok)
                e.stopPropagation(); // Zabránit propagaci na vnitřní bloky
                const currentDeactivatedState = greyboxWrapper.classList.contains('is-deactivated');
                greyboxWrapper.classList.toggle('is-deactivated');
                // De/aktivovat všechny vnitřní bloky
                greyboxWrapper.querySelectorAll('.profi-content-block').forEach(innerBlock => {
                    if (currentDeactivatedState) { // Pokud se greybox aktivuje, aktivují se i vnitřní bloky
                        innerBlock.classList.remove('is-deactivated');
                    } else { // Pokud se greybox deaktivuje, deaktivují se i vnitřní bloky
                        innerBlock.classList.add('is-deactivated');
                    }
                });
            }
            updateCharacterCount();
        });

        const getInCopyText = () => {
            const textParts = [];
            // Procházíme DOM editoru pro zachování správného pořadí
            contentDiv.childNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList.contains('profi-greybox-wrapper')) {
                        // Zpracujeme vnitřní bloky greyboxu
                        node.querySelectorAll('.profi-content-block:not(.is-deactivated)').forEach(block => {
                            const content = block.firstElementChild;
                            const cleanText = content.textContent.replace(/\s+/g, ' ').trim();
                            if (content.tagName === 'H3') textParts.push(`<h3>${cleanText}</h3>`);
                            else if (block.classList.contains('is-question')) textParts.push(`<question>${cleanText}</question>`);
                            else textParts.push(cleanText);
                        });
                    } else if (node.classList.contains('profi-content-block') && !node.classList.contains('is-deactivated')) {
                        // Zpracujeme běžný blok (včetně perexu, který se chová jako běžný P)
                        const content = node.firstElementChild;
                        const cleanText = content.textContent.replace(/\s+/g, ' ').trim();
                        if (content.tagName === 'H3') textParts.push(`<h3>${cleanText}</h3>`);
                        else if (node.classList.contains('is-question')) textParts.push(`<question>${cleanText}</question>`);
                        else textParts.push(cleanText);
                    }
                }
            });
            return textParts.filter(text => text).join('\n');
        };

        const downloadTextAsFile = (text, filename) => {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        };

        const showCopiedFeedback = (btn, originalText) => {
            const originalColor = btn.style.backgroundColor;
            const originalBorderColor = btn.style.borderColor;
            btn.textContent = 'Zkopírováno!';
            btn.style.backgroundColor = '#198754';
            btn.style.borderColor = '#198754';
            setTimeout(() => { btn.textContent = originalText; btn.style.backgroundColor = originalColor; btn.style.borderColor = originalBorderColor; }, 2000);
        };

        overlay.querySelector('#profi-btn-copy-incopy').addEventListener('click', (e) => navigator.clipboard.writeText(getInCopyText()).then(() => showCopiedFeedback(e.target, 'Kopírovat pro InCopy')));
        overlay.querySelector('#profi-btn-copy-plain').addEventListener('click', (e) => navigator.clipboard.writeText(getCleanText()).then(() => showCopiedFeedback(e.target, 'Kopírovat čistý text')));
        overlay.querySelector('#profi-btn-download-incopy').addEventListener('click', () => downloadTextAsFile(getInCopyText(), `${filenameBase}_incopy.txt`));
        overlay.querySelector('#profi-btn-download-plain').addEventListener('click', () => downloadTextAsFile(getCleanText(), `${filenameBase}.txt`));
        overlay.querySelector('#profi-btn-close').addEventListener('click', () => overlay.remove());

        // --- NOVÁ FUNKČNOST: Tlačítko Stručně s Gemini AI ---

        async function getGeminiApiKey() {
            let apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                apiKey = prompt('Prosím, vložte svůj Gemini API klíč:');
                if (apiKey) {
                    localStorage.setItem('geminiApiKey', apiKey);
                    alert('Gemini API klíč byl uložen do paměti prohlížeče.');
                } else {
                    alert('Gemini API klíč nebyl zadán. Funkce "Stručně" nebude fungovat.');
                }
            }
            return apiKey;
        }

        function showGeminiProcessingOverlay() {
            const geminiOverlay = document.createElement('div');
            geminiOverlay.id = 'profi-gemini-overlay';
            geminiOverlay.innerHTML = `
                <div id="profi-gemini-panel">
                    <div id="profi-gemini-header">Stručnítko</div>
                    <div id="profi-gemini-content">
                        <p>Zpracovávám, čekej prosím...</p>
                    </div>
                    <div id="profi-gemini-footer">
                        <!-- Tlačítka budou přidána zde po zpracování -->
                    </div>
                </div>
            `;
            document.body.appendChild(geminiOverlay);
            return geminiOverlay;
        }

        overlay.querySelector('#profi-btn-summarize').addEventListener('click', async () => {
            const apiKey = await getGeminiApiKey();
            if (!apiKey) {
                return; // Uživatel zrušil nebo nezadal klíč
            }

            const cleanText = getCleanText();
            if (!cleanText.trim()) {
                alert('Článek neobsahuje žádný text ke shrnutí.');
                return;
            }

            const summaryPrompt = "Udělej z následujícího textu stručný, ale výstižný bodový výtah. Vytvoř tři až šest bodů, které vystihnou hlavní myšlenky a sdělení textu. Body by měly být stručné, každý v rozsahu jedné, maximálně dvou vět. Nevytvářej dlouhá a složitá souvětí, lepší je infromace rozdělit do více bodů. Dodržuj styl, ve kterém je článek napsaný. Vrať pouze tyto body, každý jako samostatný odstavec, žádný další text negeneruj.";
            const fullContent = `${summaryPrompt}\n\n${cleanText}`;

            const geminiOverlay = showGeminiProcessingOverlay();
            const geminiContentDiv = geminiOverlay.querySelector('#profi-gemini-content');
            const geminiFooterDiv = geminiOverlay.querySelector('#profi-gemini-footer');

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_API_MODEL}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: fullContent
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Gemini API chyba: ${response.status} - ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nebylo možné vygenerovat souhrn.';

                // Formátování souhrnu do UL/LI seznamu
                const summaryPoints = summaryText.split('\n')
                    .filter(line => line.trim() !== '')
                    .map(line => `<li>${line.trim().replace(/^- /,'').replace(/^\* /,'').replace(/^• /,'')}</li>`) // Odstraní případné úvodní odrážky
                    .join('');
                geminiContentDiv.innerHTML = `<ul>${summaryPoints}</ul>`;

                const copyButton = document.createElement('button');
                copyButton.className = 'profi-gemini-btn primary';
                copyButton.textContent = 'Kopírovat do schránky';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(summaryText).then(() => {
                        showCopiedFeedback(copyButton, 'Kopírovat do schránky');
                    });
                });

                const closeButton = document.createElement('button');
                closeButton.className = 'profi-gemini-btn close';
                closeButton.textContent = 'Zavřít';
                closeButton.addEventListener('click', () => {
                    geminiOverlay.remove();
                });

                geminiFooterDiv.appendChild(copyButton);
                geminiFooterDiv.appendChild(closeButton);

            } catch (error) {
                console.error('Chyba při komunikaci s Gemini API:', error);
                geminiContentDiv.innerHTML = `<p style="color: red;">Nastala chyba při získávání souhrnu: ${error.message}. Zkuste to prosím znovu nebo zkontrolujte API klíč.</p>`;

                const closeButton = document.createElement('button');
                closeButton.className = 'profi-gemini-btn close';
                closeButton.textContent = 'Zavřít';
                closeButton.addEventListener('click', () => {
                    geminiOverlay.remove();
                });
                geminiFooterDiv.appendChild(closeButton);
            }
        });

        // První výpočet hned po zobrazení
        updateCharacterCount();
    }

    // ===================================================================================
    // KÓD PRO TAMPERMONKEY
    // ===================================================================================
    function init() {
        const adminBar = document.getElementById('wpadminbar');
        if (!adminBar) {
            console.error('InCopy Editor Script: wpadminbar nebyla nalezena.');
            return;
        }

        const topSecondaryMenu = adminBar.querySelector('#wp-admin-bar-top-secondary');
        if (!topSecondaryMenu) {
            console.error('InCopy Editor Script: #wp-admin-bar-top-secondary nebylo nalezeno.');
            return;
        }

        const newMenuItem = document.createElement('li');
        newMenuItem.id = 'wp-admin-bar-incopy-export';

        const newButton = document.createElement('a');
        newButton.className = 'ab-item';
        newButton.href = '#';
        newButton.textContent = 'Export do InCopy';
        newButton.style.backgroundColor = '#28a745';
        newButton.style.color = 'white';

        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            runInCopyEditor();
        });

        newMenuItem.appendChild(newButton);
        topSecondaryMenu.appendChild(newMenuItem);
    }

    // Používáme DOMContentLoaded namísto load, protože stačí, aby byl DOM připraven,
    // nemusíme čekat na všechny obrázky atd., což zrychlí zobrazení tlačítka.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();