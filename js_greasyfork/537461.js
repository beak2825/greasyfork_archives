// ==UserScript==
// @name         Scholar Access Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add research access buttons to Scholar results (DOI-focused Sci-Hub, Sci-DB, and title-based searches)
// @author       Adelyn Maisie
// @match        https://scholar.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/537461/Scholar%20Access%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537461/Scholar%20Access%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const services = {
        SciDB: {
            name: 'Sci-DB',
            color: '#a83293',
            getUrl: (doi) => doi ? `https://annas-archive.org/scidb/${doi}` : null
        },
        AnnasArchive: {
            name: "Anna's Archive",
            color: '#FF5722',
            getUrl: (title) => title ? `https://annas-archive.org/search?index=journals&q=${encodeURIComponent(title)}` : null
        },
        SciHub: {
            name: 'Sci-Hub',
            color: '#2c7bb6',
            getUrl: (doi) => doi ? `https://sci-hub.st/${doi}` : null
        },
        LibGen: {
            name: 'LibGen',
            color: '#4CAF50',
            getUrl: (title) => title ? `https://libgen.is/search.php?req=${encodeURIComponent(title)}` : null
        }
    };

    // Settings system
    let settings = GM_getValue('settings', {
        SciDB: true,
        AnnasArchive: true,
        SciHub: true,
        LibGen: true
    });

    // Stylish CSS
    GM_addStyle(`
        .access-btns {
            display: flex;
            flex-wrap: wrap; /* Allow buttons to wrap on smaller screens/results */
            gap: 8px;
            margin-top: 10px;
        }
        .access-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 15px;
            color: white !important;
            cursor: pointer;
            font-size: 0.9em;
            text-decoration: none !important;
            text-align: center;
        }
        .settings-panel {
            /* Ensure you have styles for this panel, e.g.: */
            /* position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ccc; padding: 20px; z-index: 10000; display: none; box-shadow: 0 0 10px rgba(0,0,0,0.1); */
        }
        .settings-icon {
            /* Ensure you have styles for this icon, e.g., for FontAwesome <i class="fas fa-cog"></i> */
            /* position: fixed; top: 25px; right: 25px; font-size: 24px; cursor: pointer; z-index: 10001; color: #555; */
            /* If using innerHTML for icon, you might need to style the <i> tag if FontAwesome isn't available */
        }
    `);

    // Extract DOI
    const extractDOIFromText = (text) => {
        if (!text) return null;

        const doiRegex = /(?:doi:|(?:https?:\/\/)?(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/(?:[-._;()/:A-Za-z0-9]|%[0-9a-fA-F]{2})+)/i;
        const match = text.match(doiRegex);

        if (match && match[1]) {
            let potentialDoi = match[1];
            potentialDoi = potentialDoi.replace(/%252F/gi, '%2F');
            try {
                potentialDoi = decodeURIComponent(potentialDoi);
            } catch (e) {
                potentialDoi = potentialDoi.replace(/%2F/gi, '/');
            }

            potentialDoi = potentialDoi.split(/[?#]/)[0];
            potentialDoi = potentialDoi.replace(/(\/meta|\/pdf|\.pdf|\/html|\/full|\/fulltext|\/epdf|\/abstract|\/summary|\/xml)$/i, '');

            if (/^10\.\d{4,9}\/.+$/i.test(potentialDoi)) {
                return potentialDoi;
            }
        }
        return null;
    };

    // New comprehensive DOI finder for a Google Scholar result item
    const findDOIForResultItem = (resultItem) => {
        const explicitDoiLink = resultItem.querySelector('a[href*="doi.org/10."], a[href*="dx.doi.org/10."]');
        if (explicitDoiLink && explicitDoiLink.href) {
            const doi = extractDOIFromText(explicitDoiLink.href);
            if (doi) return doi;
        }

        const links = resultItem.querySelectorAll('a[href]');
        for (const link of links) {
            if (link.href) {
                const doi = extractDOIFromText(link.href);
                if (doi) return doi;
            }
        }

        const titleText = resultItem.querySelector('.gs_rt')?.innerText || '';
        const abstractText = resultItem.querySelector('.gs_rs')?.innerText || '';
        const metadataText = resultItem.querySelector('.gs_a')?.innerText || '';

        const combinedText = `${titleText} ${metadataText} ${abstractText}`;
        const doiFromTextContent = extractDOIFromText(combinedText);
        if (doiFromTextContent) return doiFromTextContent;

        const resourceLink = resultItem.querySelector('.gs_ggsd a, .gs_or_ggsm a');
        if (resourceLink && resourceLink.href) {
            const doi = extractDOIFromText(resourceLink.href);
            if (doi) return doi;
        }

        return null;
    };

    // Create settings panel using service keys
    const createSettingsPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '70px', right: '20px', background: 'white',
            border: '1px solid #ccc', padding: '20px', zIndex: '10000',
            display: 'none', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        });
        panel.innerHTML = `<h3 style="margin: 0 0 15px 0; font-size: 1.2em; color: #333;">Research Access Settings</h3>`;

        Object.entries(services).forEach(([key, service]) => {
            const div = document.createElement('div');
            div.style.margin = '10px 0';
            div.innerHTML = `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.95em;">
                    <input type="checkbox" ${settings[key] ? 'checked' : ''}
                           data-service="${key}" style="margin-right: 5px; transform: scale(1.1);">
                    ${service.name}
                </label>
            `;
            panel.appendChild(div);
        });

        document.body.appendChild(panel);
        return panel;
    };

    // Toggle settings panel
    const createSettingsIcon = () => {
        const icon = document.createElement('div');
        icon.className = 'settings-icon';
        Object.assign(icon.style, {
            position: 'fixed', top: '20px', right: '20px', background: '#f0f0f0',
            border: '1px solid #ccc', padding: '8px 10px', cursor: 'pointer',
            zIndex: '10001', borderRadius: '5px', userSelect: 'none', color: '#333'
        });
        icon.innerHTML = '⚙️ Settings';
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        });
        document.body.appendChild(icon);
        return icon;
    };

    const settingsPanel = createSettingsPanel();
    const settingsIcon = createSettingsIcon();

    // Handle settings changes
    settingsPanel.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            settings[e.target.dataset.service] = e.target.checked;
            GM_setValue('settings', settings);
            document.querySelectorAll('.access-btns').forEach(btnSet => btnSet.remove());
            addAccessButtons();
        });
    });

    // Main function to add buttons
    const addAccessButtons = () => {
        document.querySelectorAll('.gs_ri').forEach(result => {
            if (result.querySelector('.access-btns')) return;

            const titleElement = result.querySelector('.gs_rt a');
            const title = titleElement ? titleElement.innerText.trim() : (result.querySelector('.gs_rt')?.innerText.trim() || '');
            const doi = findDOIForResultItem(result);

            const btnContainer = document.createElement('div');
            btnContainer.className = 'access-btns';

            Object.entries(services).forEach(([key, service]) => {
                if (!settings[key]) return;

                let identifier;
                if (key === 'SciHub' || key === 'SciDB') {
                    identifier = doi;
                } else {
                    identifier = title;
                }

                if (!identifier) return;

                const url = service.getUrl(identifier);
                if (!url) return;

                const btn = document.createElement('a');
                btn.className = 'access-btn';
                btn.style.backgroundColor = service.color;
                btn.href = url;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.textContent = service.name;
                btnContainer.appendChild(btn);
            });

            if (btnContainer.hasChildNodes()) {
                result.appendChild(btnContainer);
            }
        });
    };

    let resultsContainer = document.getElementById('gs_res_ccl_mid') || document.getElementById('gs_res_ccl');
    if (!resultsContainer) {
        console.warn("Scholar Access Enhancer: Could not find specific results container. Observing document body.");
        resultsContainer = document.body;
    }

    const observer = new MutationObserver(mutations => {
        let needsButtonUpdate = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && (node.matches('.gs_ri') || node.querySelector('.gs_ri'))) {
                            needsButtonUpdate = true;
                            break;
                        }
                    }
                }
            }
            if (needsButtonUpdate) {
                break;
            }
        }

        if (needsButtonUpdate) {
            addAccessButtons();
        }
    });

    observer.observe(resultsContainer, {
        childList: true,
        subtree: true
    });

    addAccessButtons();

    document.addEventListener('click', (e) => {
        if (settingsPanel.style.display === 'block' && !settingsPanel.contains(e.target) && !settingsIcon.contains(e.target)) {
            settingsPanel.style.display = 'none';
        }
    });

})();