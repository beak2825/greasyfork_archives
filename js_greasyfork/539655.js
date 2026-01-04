// ==UserScript==
// @name         HH++ Download Images
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Télécharge les images des personnages dans Harem Heroes
// @author       You
// @match           https://*.hentaiheroes.com/*
// @match           https://*.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://nutaku.comixharem.com/*
// @match        https://www.hentaiheroes.com/characters/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539655/HH%2B%2B%20Download%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/539655/HH%2B%2B%20Download%20Images.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Nouvelle taille du panneau
    const PANEL_WIDTH = '260px';
    const PANEL_HEIGHT = 'auto';

    // Log global pour export
    let exportLog = [];

    // Fonction pour créer l'icône flottante (SVG moderne, style GitHub)
    function createFloatingIcon() {
        const icon = document.createElement('div');
        icon.id = 'hh-download-icon';
        icon.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#fff" stroke="#d0d7de"/>
                <path d="M8 3v6m0 0l-3-3m3 3l3-3" stroke="#24292f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="5" y="12" width="6" height="1.5" rx="0.5" fill="#24292f"/>
            </svg>
        `;
        icon.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            background: #fff;
            border: 1px solid #d0d7de;
            border-radius: 50%;
            box-shadow: 0 4px 16px rgba(27,31,35,0.07);
            transition: box-shadow 0.2s;
        `;
        icon.addEventListener('mouseenter', () => {
            icon.style.boxShadow = '0 8px 24px rgba(27,31,35,0.15)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.boxShadow = '0 4px 16px rgba(27,31,35,0.07)';
        });
        icon.addEventListener('click', function() {
            const panel = document.getElementById('hh-download-panel');
            if (panel) {
                panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
            }
        });
        document.body.appendChild(icon);
    }

    // Fonction pour créer le panneau de contrôle (style GitHub)
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'hh-download-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 16px;
            width: ${PANEL_WIDTH};
            background: linear-gradient(180deg, #3b0f17 0%, #2e0710 100%);
            border: 1px solid rgba(212,162,41,0.95);
            border-radius: 10px;
            padding: 14px 14px 10px 14px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            font-family: 'Segoe UI', 'Liberation Sans', Arial, sans-serif;
            font-size: 14px;
            color: #f1e6d0;
            display: none;
        `;

        // Titre du panneau
        const title = document.createElement('div');
        title.textContent = 'Download Character Scenes';
    title.style.fontWeight = '700';
    title.style.fontSize = '16px';
    title.style.marginBottom = '8px';
    title.style.letterSpacing = '0.02em';
    title.style.color = '#ffd97d';
        panel.appendChild(title);

        // Informations du personnage
        const infoDiv = document.createElement('div');
        infoDiv.id = 'character-info';
    infoDiv.style.marginBottom = '12px';
    infoDiv.style.fontSize = '13px';
    infoDiv.style.color = '#ffeecf';
        panel.appendChild(infoDiv);

        // Contrôles
        const controlsDiv = document.createElement('div');
        controlsDiv.style.marginBottom = '10px';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.flexDirection = 'column';
        controlsDiv.style.gap = '8px';

        // Première rangée : Checkboxes
        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.gap = '10px';
        topRow.style.alignItems = 'center';
        topRow.style.fontSize = '14px';

        function makeCheckbox(id, label, checked = false) {
            const container = document.createElement('label');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '8px';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = checked;
            checkbox.style.width = '14px';
            checkbox.style.height = '14px';
            checkbox.style.accentColor = '#ffd97d';
            const labelSpan = document.createElement('span');
            labelSpan.textContent = label;
            labelSpan.style.color = '#ffeecf';
            labelSpan.style.fontSize = '13px';
            container.appendChild(checkbox);
            container.appendChild(labelSpan);
            return container;
        }

        topRow.appendChild(makeCheckbox('dl-scenes', 'Scenes', true));
        const avatarCheckbox = makeCheckbox('dl-avatars', 'Avatars', !window.location.hostname.includes('comixharem.com'));
        if (window.location.hostname.includes('comixharem.com')) {
            avatarCheckbox.querySelector('input').disabled = true;
        }
        topRow.appendChild(avatarCheckbox);
        topRow.appendChild(makeCheckbox('dl-data', 'Data'));
        controlsDiv.appendChild(topRow);

        // Deuxième rangée : Préfixe et boutons
        const bottomRow = document.createElement('div');
        bottomRow.style.display = 'flex';
        bottomRow.style.gap = '8px';
        bottomRow.style.alignItems = 'center';

        // Input pour le préfixe
        const startInput = document.createElement('input');
        startInput.type = 'text';
        startInput.id = 'start-number';
        startInput.placeholder = 'Prefix (e.g. 011)';
        startInput.style.width = '70px';
        startInput.style.fontSize = '13px';
        startInput.style.padding = '6px 8px';
        startInput.style.border = '1px solid rgba(212,162,41,0.9)';
        startInput.style.borderRadius = '6px';
        startInput.style.background = 'linear-gradient(180deg,#3b0f17,#2e0710)';
        startInput.style.color = '#ffd97d';
        startInput.style.outline = 'none';
        startInput.style.transition = 'border 0.12s, transform 0.06s';
        startInput.addEventListener('focus', () => {
            startInput.style.border = '1.5px solid #ffd97d';
            startInput.style.transform = 'translateY(-1px)';
        });
        startInput.addEventListener('blur', () => {
            startInput.style.border = '1px solid rgba(212,162,41,0.9)';
            startInput.style.transform = 'none';
        });
        bottomRow.appendChild(startInput);

        // Boutons stylés façon GitHub
        function makeButton(label, onClick) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = onClick;
            btn.style.flex = '1';
            btn.style.fontSize = '13px';
            btn.style.padding = '6px 6px';
            btn.style.background = 'linear-gradient(180deg, #4a0d12 0%, #38060b 100%)';
            btn.style.color = '#ffd97d';
            btn.style.border = '1px solid rgba(212,162,41,0.95)';
            btn.style.borderRadius = '6px';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = '600';
            btn.style.transition = 'transform 0.08s, box-shadow 0.12s';
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 6px 14px rgba(0,0,0,0.45)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'none';
                btn.style.boxShadow = 'none';
            });
            return btn;
        }
        bottomRow.appendChild(makeButton('↻', refreshInfo));
        bottomRow.appendChild(makeButton('DL', downloadSelected));
        bottomRow.appendChild(makeButton('Log', downloadLogFile));
        controlsDiv.appendChild(bottomRow);
        panel.appendChild(controlsDiv);

        // Log stylé façon GitHub
        const logDiv = document.createElement('div');
        logDiv.id = 'download-log';
        logDiv.style.cssText = `
            height: 90px;
            overflow-y: auto;
            border: 1px solid rgba(212,162,41,0.9);
            padding: 8px 10px;
            font-size: 12px;
            background: linear-gradient(180deg,#321014,#2a0a0f);
            color: #ffd97d;
            border-radius: 6px;
            font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;
        `;
        panel.appendChild(logDiv);

        document.body.appendChild(panel);
        refreshInfo();
    }

    // Fonction pour ajouter un message au log
    function addLogMessage(message, isError = false, raw = null) {
        const logDiv = document.getElementById('download-log');
        if (!logDiv) return;
        const now = new Date().toLocaleTimeString();
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `[${now}] ${message}`;
    messageDiv.style.color = isError ? '#ff6b6b' : '#ffd97d';
        logDiv.appendChild(messageDiv);
        logDiv.scrollTop = logDiv.scrollHeight;
        // Ajout au log exportable
        exportLog.push(`[${now}] ${message}` + (raw ? `\n${raw}` : ''));
    }

    // Improved getCharacterInfo for all platforms
    function getCharacterInfo() {
        // Step 1: Find harem_right or fallback for HH
        let haremRight = document.querySelector('#harem_right');
        if (haremRight) addLogMessage('Found #harem_right');
        if (!haremRight) {
            haremRight = document.querySelector('.harem_right, [id*=harem_right]');
            if (haremRight) addLogMessage('Found .harem_right or [id*=harem_right]');
        }
        // NEW: Fallback for hentaiheroes.com (no #harem_right)
        if (!haremRight && window.location.hostname.includes('hentaiheroes.com')) {
            // Try to find the opened girl panel in #harem_whole or .global-container
            let openedDiv = document.querySelector('#harem_whole .opened[girl], .global-container .opened[girl], #harem_whole [girl].opened, .global-container [girl].opened');
            if (openedDiv) {
                addLogMessage('Found .opened[girl] in #harem_whole or .global-container (HH fallback)');
                haremRight = { children: [openedDiv] }; // fake haremRight for compatibility
            }
        }
        if (!haremRight) {
            addLogMessage('Could not find harem_right panel.', true);
            return null;
        }

        // Step 2: Find opened girl div
        let openedDiv = haremRight.querySelector ? haremRight.querySelector('.opened') : haremRight.children[0];
        if (openedDiv) addLogMessage('Found .opened');
        if (!openedDiv && haremRight.querySelector) {
            openedDiv = haremRight.querySelector('[girl]');
            if (openedDiv) addLogMessage('Found [girl] attribute');
        }
        // Step 3: Fallback: first child with name and scenes
        if (!openedDiv) {
            addLogMessage('Trying fallback: first child with name and scenes');
            const candidates = Array.from(haremRight.children);
            for (const cand of candidates) {
                if (
                    (cand.querySelector('h3') || cand.querySelector('h2') || cand.querySelector('.name')) &&
                    cand.querySelector('.girl_quests a, [class*=girl_quests] a')
                ) {
                    openedDiv = cand;
                    addLogMessage('Fallback: found candidate with name and scenes');
                    break;
                }
            }
        }
        if (!openedDiv) {
            addLogMessage('Could not find any opened/selected girl block.', true);
            return null;
        }

        // Step 4: Get girl id
        const girlId = openedDiv.getAttribute('girl') || openedDiv.getAttribute('data-girl-id') || '';
        addLogMessage('Girl ID: ' + girlId);
        // Step 5: Get name
        let name = '';
        if (openedDiv.querySelector('h3')) name = openedDiv.querySelector('h3').textContent;
        else if (openedDiv.querySelector('h2')) name = openedDiv.querySelector('h2').textContent;
        else if (openedDiv.querySelector('.name')) name = openedDiv.querySelector('.name').textContent;
        name = name.trim();
        addLogMessage('Girl name: ' + name);
        const folderName = name.replace(/\s+/g, '-').replace(/\./g, '').toLowerCase();

        // Step 6: Get scene links
        let quests = [];
        if (window.location.hostname.includes('hentaiheroes.com')) {
            quests = Array.from(openedDiv.querySelectorAll('.girl_quests a, [class*=girl_quests] a'));
            addLogMessage('Found ' + quests.length + ' scene links (HH)');
        } else {
            let questsDiv = openedDiv.querySelector('.girl_quests');
            if (!questsDiv) questsDiv = openedDiv.querySelector('[class*=girl_quests]');
            if (!questsDiv) {
                addLogMessage('Could not find girl_quests block.', true);
                return null;
            }
            quests = Array.from(questsDiv.querySelectorAll('a'));
            addLogMessage('Found ' + quests.length + ' scene links');
        }
        const nbQuests = quests.length;

        // Step 7: Get quest number and session token
        let questNumber = '';
        let sessToken = '';
        if (quests.length > 0) {
            const firstQuest = quests[0].getAttribute('href');
            const questMatch = firstQuest.match(/quest\/(\d+)/);
            if (questMatch) questNumber = questMatch[1];
            const sessMatch = firstQuest.match(/sess=([^&]+)/);
            if (sessMatch) sessToken = sessMatch[1];
            addLogMessage('First quest: ' + questNumber + ', sess: ' + sessToken);
        }

        return {
            girlId,
            name,
            folderName,
            nbQuests,
            firstQuest: questNumber,
            sessToken,
            quests
        };
    }

    // English refreshInfo
    function refreshInfo() {
        const info = getCharacterInfo();
        const infoDiv = document.getElementById('character-info');
        if (!infoDiv) return;

        if (!info) {
            infoDiv.innerHTML = '<p style="color: red;">No character detected. Please select a character in your harem.</p>';
            addLogMessage('No character detected.', true);
            return;
        }

        infoDiv.innerHTML = `
            <p><strong>Name:</strong> ${info.name}</p>
            <p><strong>ID:</strong> ${info.girlId}</p>
            <p><strong>Scenes:</strong> ${info.nbQuests}</p>
            <p><strong>First quest:</strong> ${info.firstQuest}</p>
        `;

        addLogMessage('Character info refreshed.');
    }

    // Fonction pour télécharger selon les options sélectionnées
    function downloadSelected() {
        const info = getCharacterInfo();
        if (!info) {
            addLogMessage('No character detected. Please refresh and select a character.', true);
            return;
        }

        const dlScenes = document.getElementById('dl-scenes').checked;
        const dlAvatars = document.getElementById('dl-avatars').checked;
        const dlData = document.getElementById('dl-data').checked;

        if (dlScenes) {
            // Télécharger les images des scènes
            let prefix = document.getElementById('start-number').value || '';
            prefix = prefix.trim();
            if (prefix) prefix = `(${prefix}) `;
            let displayName = info.name.replace(/\s+/g, ' ').replace(/\./g, '').trim();
            let questLinks = [];
            if (window.location.hostname.includes('hentaiheroes.com')) {
                questLinks = info.quests;
            } else {
                const questsDiv = document.querySelector('#harem_right .girl_quests, .harem_right .girl_quests, [id*=harem_right] .girl_quests, [id*=harem_right] [class*=girl_quests]');
                questLinks = questsDiv ? questsDiv.querySelectorAll('a') : [];
            }
            addLogMessage(`Starting download for ${displayName}`);
            if (questLinks.length === 0) {
                addLogMessage('No scene links found for this character.', true);
            } else {
                questLinks.forEach((a, idx) => {
                    const href = a.getAttribute('href');
                    const match = href.match(/quest\/(\d+)/);
                    const questNum = match ? match[1] : null;
                    let url = '';
                    if (window.location.hostname.includes('hentaiheroes.com')) {
                        if (!questNum) {
                            addLogMessage(`Invalid quest link: ${href}`, true);
                            return;
                        }
                        url = `https://www.hentaiheroes.com/img/quests/${questNum}/1/800x450cut/${questNum}-1.jpg`;
                    } else if (window.location.hostname.includes('nutaku.haremheroes.com')) {
                        const sessMatch = href.match(/sess=([^&]+)/);
                        const sessToken = sessMatch ? sessMatch[1] : info.sessToken;
                        if (!questNum || !sessToken) {
                            addLogMessage(`Invalid quest link: ${href}`, true);
                            return;
                        }
                        url = `https://nutaku.haremheroes.com/img/quests/${questNum}/1/1600x900cut/${questNum}.jpg?sess=${sessToken}`;
                    } else if (window.location.hostname.includes('comixharem.com')) {
                        const sessMatch = href.match(/sess=([^&]+)/);
                        const sessToken = sessMatch ? sessMatch[1] : info.sessToken;
                        if (!questNum || !sessToken) {
                            addLogMessage(`Invalid quest link: ${href}`, true);
                            return;
                        }
                        url = `https://nutaku.comixharem.com/img/quests/${questNum}/1/1600x900cut/${questNum}.jpg?sess=${sessToken}`;
                    } else {
                        addLogMessage(`Unsupported site: ${window.location.hostname}`, true);
                        return;
                    }
                    const filename = `${prefix}${displayName} ${idx+1}.jpg`;
                    addLogMessage(`Trying: ${url} => ${filename}`);
                    GM_download({
                        url: url,
                        name: filename,
                        onload: function(resp) {
                            addLogMessage(`Downloaded: ${filename} (success)`, false, `URL: ${url}`);
                        },
                        onerror: function(error) {
                            addLogMessage(`Error downloading ${filename}: ${error}`, true, `URL: ${url}`);
                        }
                    });
                });
            }
        }

        if (dlAvatars && !window.location.hostname.includes('comixharem.com')) {
            // Télécharger les images ava
            for (let i = 0; i <= info.nbQuests; i++) {
                const url = `https://hh.hh-content.com/pictures/girls/${info.girlId}/ava${i}-1200x.webp`;
                const filename = `star${i}.png`;
                addLogMessage(`Trying: ${url} => ${filename}`);
                GM_download({
                    url: url,
                    name: filename,
                    onload: function(resp) {
                        addLogMessage(`Downloaded: ${filename} (success)`, false, `URL: ${url}`);
                    },
                    onerror: function(error) {
                        addLogMessage(`Error downloading ${filename}: ${error}`, true, `URL: ${url}`);
                    }
                });
            }
            // Télécharger l'icône
            const iconUrl = `https://hh.hh-content.com/pictures/girls/${info.girlId}/ico0-300x.webp?v=2`;
            const iconFilename = `icon.png`;
            addLogMessage(`Trying: ${iconUrl} => ${iconFilename}`);
            GM_download({
                url: iconUrl,
                name: iconFilename,
                onload: function(resp) {
                    addLogMessage(`Downloaded: ${iconFilename} (success)`, false, `URL: ${iconUrl}`);
                },
                onerror: function(error) {
                    addLogMessage(`Error downloading ${iconFilename}: ${error}`, true, `URL: ${iconUrl}`);
                }
            });
        }

        if (dlData) {
            // Extraire et télécharger la bio
            const bioDiv = document.querySelector('div.girl_line[data-block="bio"]');
            if (!bioDiv) {
                addLogMessage('Bio div not found.', true);
            } else {
                const ul = bioDiv.querySelector('ul');
                if (!ul) {
                    addLogMessage('Bio ul not found.', true);
                } else {
                    const lis = Array.from(ul.querySelectorAll('li'));
                    let bio = {};
                    let about = '';
                    for (const li of lis) {
                        const charSpan = li.querySelector('span.characteristic');
                        const valueSpan = li.querySelector('span:not(.characteristic)');
                        if (charSpan && valueSpan) {
                            let key = charSpan.textContent.trim().replace(/:$/, '');
                            const value = valueSpan.textContent.trim();
                            if (key === '') {
                                about = value.replace(/^About her:/, '');
                            } else {
                                // Normalize key to match example format
                                key = key.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                                bio[key] = value;
                            }
                        } else {
                            const descSpan = li.querySelector('span.desc');
                            if (descSpan) {
                                about = descSpan.textContent.trim().replace(/^About her:/, '');
                            }
                        }
                    }
                    const data = {
                        parody: '',
                        bio: {
                            "About her": about,
                            ...bio
                        }
                    };
                    const jsonStr = JSON.stringify(data, null, 4);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const jsonUrl = URL.createObjectURL(blob);
                    GM_download({
                        url: jsonUrl,
                        name: 'data.json',
                        onload: function() {
                            addLogMessage('Downloaded: data.json (success)');
                        },
                        onerror: function(error) {
                            addLogMessage('Error downloading data.json: ' + error, true);
                        }
                    });
                }
            }
        }
    }

    // Fonction pour télécharger le log
    function downloadLogFile() {
        const blob = new Blob([exportLog.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hh_download_debug.log';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // Attendre que la page soit chargée
    window.addEventListener('load', function() {
        setTimeout(() => {
            createFloatingIcon();
            createControlPanel();
        }, 2000);
    });
})();