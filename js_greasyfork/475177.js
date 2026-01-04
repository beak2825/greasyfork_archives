// ==UserScript==
// @name            - Omega Helper
// @description     A script to help Omega 365 developers access info related to workflows between Appframe, Pims and Omega 365.
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @match           *://*/*
// @namespace       http://tampermonkey.net/
// @author          Simas Zikaras
// @run-at          document-start
// @license         MIT
// @grant           GM_addStyle
// @version 0.0.1.20251111074624
// @downloadURL https://update.greasyfork.org/scripts/475177/-%20Omega%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475177/-%20Omega%20Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Prevent running inside iframes

    let panel;

    if (window.top !== window.self) {
        setupShortcut();
        return;
    }else{
        window.addEventListener('message', (event) => {
            // Make sure the message is from the correct source
            if (event.origin !== window.location.origin) return; // Optional: verify origin for security

            if (event.data.action === 'togglePanel') {
                togglePanel();
            }
        });
    }

    GM_registerMenuCommand(`Open Omega Panel Alt+Shift+A`, togglePanel);

    function getSelectionText() {
        let selection = window.getSelection().toString();
        if (selection) return selection;

        for (const iframe of document.querySelectorAll('iframe')) {
            try {
                selection = iframe.contentWindow.getSelection().toString();
                if (selection) return selection;
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
        return '';
    }

    function OpenNewTab(url){
        GM_openInTab(url, { active: true, insert: true });
    }
    function getFullDomainFromUrl(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            console.error("Invalid URL:", url);
            return "";
        }
    }

    function OpenCurrentIn(hostname){
        let topUrl;

        try {
            topUrl = new URL(window.top.location.href); // top-level page URL
        } catch (e) {
            // If cross-origin iframe blocks access
            console.warn('Could not access top window location, falling back to current frame');
            topUrl = new URL(location.href);
        }
        let domain = getFullDomainFromUrl(hostname);
        const newUrl = `${topUrl.protocol}//${domain}${topUrl.pathname}${topUrl.search}${topUrl.hash}`;
        GM_openInTab(newUrl, { active: true, insert: true });
    }

    function togglePanel(){
        if (!panel || !document.body.contains(panel)) {
            createGroupedPanel(); // recreate if missing
        } else {
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        }
    }

    function setupShortcut() {
        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
                // Send message to parent (main page)
                window.top.postMessage({ action: 'togglePanel' }, '*');
            }
        });
    }

    setupShortcut();

    function addGroup(panel, groupName, links, attributes) {
        const dropdown = document.createElement('div');
        dropdown.style.marginBottom = '8px';

        const toggle = document.createElement('button');
        toggle.textContent = groupName + ' ▼';
        toggle.style.width = '100%';
        toggle.style.padding = '6px';
        toggle.style.marginBottom = '4px';
        toggle.style.cursor = 'pointer';
        if (attributes && attributes.color) {
            toggle.style.background = attributes.color;
        } else {
            toggle.style.background = '#e0e0e0';
        }
        toggle.style.border = 'none';
        toggle.style.borderRadius = '4px';
        toggle.style.fontWeight = 'bold';

        const container = document.createElement('div');
        container.style.display = 'none';
        container.style.flexDirection = 'column';

        toggle.onclick = () => {
            container.style.display = (container.style.display === 'none') ? 'flex' : 'none';
        };

        links.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.label;
            button.style.margin = '2px 0';
            button.style.padding = '4px 6px';
            button.style.cursor = 'pointer';
            button.style.border = '1px solid #ccc';
            button.style.borderRadius = '4px';
            button.style.background = '#fff';
            button.onclick = () => {
                const id = getSelectionText().trim();
                if (btn.url) {
                    if (id) {
                        GM_openInTab(btn.url(id), { active: true, insert: true });
                    } else {
                        alert('Select an ID on the page first.');
                        return;
                    }
                } else if (btn.action) {
                    btn.action(id); // Run custom function
                }
                togglePanel();
            };
            container.appendChild(button);
        });

        dropdown.appendChild(toggle);
        dropdown.appendChild(container);
        panel.appendChild(dropdown);
    }

    function makePanelResizable(panel) {
        const resizer = document.createElement('div');
        resizer.style.width = '10px';
        resizer.style.height = '10px';
        resizer.style.position = 'absolute';
        resizer.style.left = '0';
        resizer.style.bottom = '0';
        resizer.style.cursor = 'sw-resize';
        resizer.style.zIndex = '1001';
        resizer.style.borderRight = '16px solid transparent';
        resizer.style.borderBottom = '16px solid #e0e0e0'; // Triangle color
        resizer.style.backgroundSize = '100% 100%';

        panel.appendChild(resizer);

        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault();

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(window.getComputedStyle(panel).width, 10);
            const startHeight = parseInt(window.getComputedStyle(panel).height, 10);

            function doDrag(e) {
                const newWidth = startWidth - (e.clientX - startX);
                if (newWidth > 100) panel.style.width = newWidth + 'px';

                const newHeight = startHeight + (e.clientY - startY);
                if (newHeight > 100) panel.style.height = newHeight + 'px';
            }

            function stopDrag() {
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            }

            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });
    }

    const tabHeader = document.createElement('div');
    const tabContent = document.createElement('div');

    // Function to create tabs
    function createTab(name, contentElement) {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.flex = '1';
        btn.style.padding = '4px';
        btn.style.border = '1px solid #ccc';
        btn.style.background = '#eee';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', () => {
            [...tabHeader.children].forEach(b => (b.style.background = '#eee'));
            [...tabContent.children].forEach(c => (c.style.display = 'none'));

            btn.style.background = '#fff';
            contentElement.style.display = 'block';
        });

        tabHeader.appendChild(btn);

        contentElement.style.display = 'none';
        contentElement.style.height = '100%';
        tabContent.appendChild(contentElement);

        return contentElement;
    }

    function createGroupedPanel() {
        panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '9999';
        panel.style.background = '#f9f9f9';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px 8px 8px 0px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        panel.style.fontFamily = 'sans-serif';
        panel.style.minWidth = '300px';
        panel.style.overflow = 'auto';
        panel.style.maxHeight = '90vh';
        document.body.appendChild(panel);

        // Header with title and close button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '8px';

        const title = document.createElement('div');
        title.textContent = '🔗 Omega Panel';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '14px';
        closeBtn.style.marginLeft = '8px';
        closeBtn.title = 'Close';
        closeBtn.onclick = () => togglePanel();

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        panel.appendChild(tabHeader);
        panel.appendChild(tabContent);

        // Create and activate tabs
        const redirectButtonsTab = createTab('Shortcuts', Object.assign(document.createElement('div'), { id: 'redirectButtonsTab' }));
        const anonymizerTab = createTab('Anonymizer', Object.assign(document.createElement('div'), { id: 'anonymizerTab' }));
        anonymizerTab.innerHTML = "<p>Some informational text or tools here.</p>";

        tabHeader.children[0].click(); //

        // Tab headers
        tabHeader.style.display = 'flex';
        tabHeader.style.gap = '4px';
        tabHeader.style.marginBottom = '6px';
        panel.appendChild(tabHeader);

        // Tab content area
        tabContent.style.flex = '1';
        tabContent.style.overflow = 'auto';
        panel.appendChild(tabContent);

        makePanelResizable(panel);

        const groups = {
            "Pims.no Dev-test": {
                links: [
                    { label: 'Versions', url: id => `https://dev-test.pims.no/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-test.pims.no`); } },
                    { label: 'Updater', url: id => `https://dev-test.pims.no/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#D8D8EC'}
            },
            "Pims.no Dev": {
                links: [
                    { label: 'Versions', url: id => `https://dev.pims.no/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev.pims.no`); } },
                    { label: 'Updater', url: id => `https://dev.pims.no/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#D8D8EC'}
            },
            "Pims R4 Dev-preview": {
                links: [
                    { label: 'Versions', url: id => `https://dev-r4-preview.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-r4-preview.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://dev-r4-preview.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: {}
            },
            "Pims R4 Dev": {
                links: [
                    { label: 'Versions', url: id => `https://dev-r4.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-r4.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://dev-r4.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: {}
            },
            "Pims R4 Stage": {
                links: [
                    { label: 'Versions', url: id => `https://stage-r4.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://stage-r4.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://stage-r4.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#D8F2EC'}
            },
            "Pims R5 Dev-preview": {
                links: [
                    { label: 'Versions', url: id => `https://dev-r5-preview.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-r5-preview.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://dev-r5-preview.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#F2F2D3'}
            },
            "Pims R5 Dev": {
                links: [
                    { label: 'Versions', url: id => `https://dev-r5.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-r5.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://dev-r5.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#F2F2D3'}
            },
            "Pims R5 Stage": {
                links: [
                    { label: 'Versions', url: id => `https://stage-r5.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://stage-r5.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://stage-r5.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#F2F2D3'}
            },
            "Pims R4 Stage-Sec": {
                links: [
                    { label: 'Versions', url: id => `https://stage-sec.pimsdevhosting.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://stage-sec.pimsdevhosting.com`); } },
                    { label: 'Updater', url: id => `https://stage-sec.pimsdevhosting.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: {}
            },
            "Appframe Dev-test": {
                links: [
                    { label: 'Versions', url: id => `https://dev-test.appframe.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://dev-test.appframe.com`); } },
                    { label: 'Updater', url: id => `https://dev-test.appframe.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#F2D8D3'}
            },
            "Appframe Stage": {
                links: [
                    { label: 'Versions', url: id => `https://stage.appframe.com/af-versions?filter%5BdsVersions%5D=Issue_ID%20%3D%20${id}` },
                    { label: 'Current', action: id => { OpenCurrentIn(`https://stage.appframe.com`); } },
                    { label: 'Updater', url: id => `https://stage.appframe.com/af-updater?filter%5BdsTransactions%5D=%5BIssue_ID%5D%20%3D%20${id}#changesTab&includeApplied&includeDeployed` },
                ],
                attributes: { color: '#F2D8D3'}
            },
            "O365": {
                links: [
                    { label: 'Open in o365 WFs', url: id => `https://omega.omega365.com/nt/scope-items/scope-workflow?ID=${id}` },
                ],
                attributes: { color: '#D8F2EC'}
            },
        };

        for (const [groupName, {links, attributes}] of Object.entries(groups)) {
            addGroup(redirectButtonsTab, groupName, links, attributes);
        }

        /* not working yet
        const redirectDomains = [
            'dev.pims.no',
            'dev-test.pims.no',
            'dev-r4.pimsdevhosting.com',
            'dev-r4-preview.pimsdevhosting.com',
            'stage-r4.pimsdevhosting.com',
            'stage-sec.pimsdevhosting.com',
            'dev-r5.pimsdevhosting.com',
            'dev-r5-preview.pimsdevhosting.com',
            'stage-r5.pimsdevhosting.com',
            'stage-r5-sec.pimsdevhosting.com',
            'dev-test.appframe.com'
        ];

        let topUrl;

        try {
            topUrl = new URL(window.top.location.href); // top-level page URL
        } catch (e) {
            // If cross-origin iframe blocks access
            console.warn('Could not access top window location, falling back to current frame');
            topUrl = new URL(location.href);
        }
        const currentRedirectDomain = window.location.hostname;

        //allow all subdomains for domains in redirectDomains
        function getBaseDomain(domain) {
            const parts = domain.split('.');
            if (parts.length >= 2) {
                return parts.slice(-2).join('.');
            }
            return domain;
        }

        const allowedBaseDomains = redirectDomains.map(getBaseDomain);
        const currentBaseDomain = getBaseDomain(currentRedirectDomain);

        const isAllowedDomain = allowedBaseDomains.some(base =>
                                                        currentRedirectDomain === base || currentRedirectDomain.endsWith('.' + base)
                                                       );

        if (isAllowedDomain) {
            redirectDomains.forEach(domain => {
                GM_registerMenuCommand(`Open current in ${domain}`, () => {
                    const newUrl = `${topUrl.protocol}//${domain}${topUrl.pathname}${topUrl.search}${topUrl.hash}`;
                    GM_openInTab(newUrl, { active: true, insert: true });
                });
            });
        }
        */

// Anonymizer

    let mapping = new Map();
    let currentOriginal = '';
    let currentPrefixes = ['atbl','astp','afnc','atbx','aviw','stbl','sstp','sfnc','stbx','sviw','Appf']; // Default prefixes

    function generateFakeWord(length = 5) {
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        const vowels = 'aeiou';
        let word = '';
        for (let i = 0; i < length; i++) {
            const pool = i % 2 === 0 ? consonants : vowels;
            word += pool[Math.floor(Math.random() * pool.length)];
        }
        return word;
    }

    function generateAlias(prefix) {
        const short = prefix.replace(/^a/, ''); // "atbl" → "tbl"
        const fakeWord = generateFakeWord();
        return `${short}_${fakeWord}`;
    }

    function anonymize(text) {
        mapping.clear();
        const regex = new RegExp(`\\b([A-Za-z_][A-Za-z0-9_]*)\\b`, 'g'); // Match word-like strings (variables, object names, etc.)

        return text.replace(regex, (match) => {
            if (currentPrefixes.some(prefix => match.startsWith(prefix)) && !mapping.has(match)) {
                const matchedPrefix = currentPrefixes.find(prefix => match.startsWith(prefix));
                const alias = generateAlias(matchedPrefix);
                mapping.set(match, alias);
            }
            return mapping.get(match) || match;
        });
    }

    function restore(text) {
        const reverseMap = {};
        for (const [original, alias] of mapping.entries()) {
            reverseMap[alias] = original;
        }

        function escapeRegex(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        const aliases = Object.keys(reverseMap);
        aliases.sort((a, b) => b.length - a.length);
        const regex = new RegExp(`\\b(${aliases.map(escapeRegex).join('|')})\\b`, 'g');

        return text.replace(regex, match => reverseMap[match] || match);
    }

    function updateDictionaryView() {
        const dictEl = document.getElementById('dictionary');
        dictEl.innerHTML = '';
        for (const [original, alias] of mapping.entries()) {
            const div = document.createElement('div');
            div.textContent = `${original} → ${alias}`;
            dictEl.appendChild(div);
        }
    }

        const button = document.createElement('button');
        button.textContent = "Run";
        button.style.margin = '2px 0';
        button.style.padding = '4px 6px';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.background = '#fff';
        button.onclick = () => {
            const selection = window.getSelection().toString();
            console.log("selection");
            console.log(selection);
            console.log("selection");
            if (!selection.trim()) {
                alert("Please select some code to anonymize.");
                return;
            }
            const anonymized = anonymize(selection);
            showPanel(anonymizerTab, selection, anonymized);
        };
        anonymizerTab.appendChild(button);

    function showPanel(containerTab, original, anonymized) {
        currentOriginal = original;

        const isDarkMode = false;//window.matchMedia('(prefers-color-scheme: dark)').matches;

        // const existing = document.getElementById('anonymizer-panel');
        // if (existing) existing.remove();


        GM_addStyle(`
            #anonymizerTab {
                background: ${isDarkMode ? '#1e1e1e' : '#f9f9f9'};
                color: ${isDarkMode ? '#f0f0f0' : '#000'};
                border: 1px solid ${isDarkMode ? '#555' : '#ccc'};
                padding: 10px;
                font-family: monospace;
            }

            #anonymizerTab textarea,
            #anonymizerTab input[type="text"] {
                width: 100%;
                height: 80px;
                margin: 5px 0;
                background: ${isDarkMode ? '#2a2a2a' : '#fff'};
                color: ${isDarkMode ? '#eee' : '#000'};
                border: 1px solid ${isDarkMode ? '#444' : '#ccc'};
                padding: 5px;
                resize: vertical;
            }

            #anonymizerTab input[type="text"] {
                height: auto;
            }

            #anonymizerTab button {
                margin-top: 5px;
                margin-right: 10px;
                background: ${isDarkMode ? '#333' : '#e0e0e0'};
                color: ${isDarkMode ? '#f0f0f0' : '#000'};
                border: 1px solid ${isDarkMode ? '#555' : '#aaa'};
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;
            }

            #anonymizerTab button:hover {
                background: ${isDarkMode ? '#444' : '#d0d0d0'};
            }

            #anonymizerTab #dictionary {
                max-height: 120px;
                overflow-y: auto;
                border: 1px solid ${isDarkMode ? '#333' : '#ddd'};
                padding: 5px;
                background: ${isDarkMode ? '#2a2a2a' : '#fafafa'};
                margin-bottom: 10px;
            }
        `);

        // panel.id = 'anonymizer-panel';
        containerTab.innerHTML = `
            <strong>Anonymized Code:</strong><br>
            <textarea id="anonymized-output">${anonymized}</textarea><br>

            <strong>Prefixes (comma separated):</strong><br>
            <input type="text" id="prefix-input" value="${currentPrefixes.join(',')}" /><br>

            <button id="reanonymize-btn">Re-Anonymize</button><br>

            <strong>Dictionary (original → alias):</strong><br>
            <div id="dictionary" style="font-size: 0.9em; line-height: 1.4em; margin-bottom: 10px;"></div><br>

            <strong>Paste AI Response Below:</strong><br>
            <textarea id="ai-response"></textarea><br>
            <button id="restore-btn">Restore</button><br>

            <strong>Restored Output:</strong><br>
            <textarea id="restored-output" readonly></textarea><br>
        `;
        updateDictionaryView();

        document.getElementById('reanonymize-btn').addEventListener('click', () => {
            const input = document.getElementById('prefix-input').value.trim();
            currentPrefixes = input.split(',').map(p => p.trim()).filter(Boolean);
            const newAnonymized = anonymize(currentOriginal);
            console.log(newAnonymized); // Check for truncation
            document.getElementById('anonymized-output').value = newAnonymized;
            updateDictionaryView();
        });

        document.getElementById('restore-btn').addEventListener('click', () => {
            const aiText = document.getElementById('ai-response').value;
            const restored = restore(aiText);
            document.getElementById('restored-output').value = restored;
        });
    }

    }

    if (location.pathname.startsWith('/af-dbmanager')) {
        function injectScript(fn) {
            const script = document.createElement('script');
            script.textContent = '(' + fn.toString() + ')();';
            document.documentElement.appendChild(script);
            script.remove();
        }

        injectScript(() => {
            const interval = setInterval(() => {
                const searchInput = document.querySelector('#dbmanager-search');
                if (!searchInput) return;
                clearInterval(interval);

                // --- Container for input + menu ---
                const container = document.createElement('div');
                container.style.position = 'relative';
                container.style.marginBottom = '6px';
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                // --- Input field ---
                const aiInput = document.createElement('input');
                aiInput.type = 'text';
                aiInput.className = 'form-control';
                aiInput.placeholder = '✨ Enter object name and hit Enter';
                aiInput.style.flex = '1';
                container.appendChild(aiInput);

                // --- Menu button ---
                const menuButton = document.createElement('div');
                menuButton.textContent = '⋮';
                Object.assign(menuButton.style, {
                    position: 'absolute',
                    right: '8px',
                    top: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    userSelect: 'none',
                    fontSize: '18px'
                });
                container.appendChild(menuButton);

                // --- Dropdown menu ---
                const menu = document.createElement('div');
                Object.assign(menu.style, {
                    position: 'absolute',
                    right: '8px',
                    top: '30px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    display: 'none',
                    width: '200px',
                    zIndex: 9999,
                    color: 'black',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    flexDirection: 'column'
                });

                // --- Menu items ---
                const selectTopOption = document.createElement('div');
                selectTopOption.textContent = 'SELECT TOP 100';
                Object.assign(selectTopOption.style, {
                    padding: '5px 8px',
                    cursor: 'pointer'
                });
                selectTopOption.addEventListener('mouseover', function() {
                    selectTopOption.style.background = '#eee';
                });
                selectTopOption.addEventListener('mouseout', function() {
                    selectTopOption.style.background = 'white';
                });
                menu.appendChild(selectTopOption);

                const openOption = document.createElement('div');
                openOption.textContent = 'Open';
                Object.assign(openOption.style, { padding: '5px 8px', cursor: 'pointer' });
                openOption.addEventListener('mouseover', function() {
                    openOption.style.background = '#eee';
                });
                openOption.addEventListener('mouseout', function() {
                    openOption.style.background = 'white';
                });
                menu.appendChild(openOption);

                const versionsOption = document.createElement('div');
                versionsOption.textContent = 'Versions';
                Object.assign(versionsOption.style, { padding: '5px 8px', cursor: 'pointer' });
                versionsOption.addEventListener('mouseover', function() {
                    versionsOption.style.background = '#eee';
                });
                versionsOption.addEventListener('mouseout', function() {
                    versionsOption.style.background = 'white';
                });
                menu.appendChild(versionsOption);

                const compareOption = document.createElement('div');
                compareOption.textContent = 'Compare';
                Object.assign(compareOption.style, { padding: '5px 8px', cursor: 'pointer' });
                compareOption.addEventListener('mouseover', function() {
                    compareOption.style.background = '#eee';
                });
                compareOption.addEventListener('mouseout', function() {
                    compareOption.style.background = 'white';
                });
                menu.appendChild(compareOption);

                container.appendChild(menu);
                searchInput.parentNode.insertBefore(container, searchInput);

                // --- Menu toggle ---
                menuButton.addEventListener('click', function() {
                    menu.style.display = (menu.style.display === 'none') ? 'flex' : 'none';
                });

                document.addEventListener('click', function(e) {
                    if (!menu.contains(e.target) && e.target !== menuButton) {
                        menu.style.display = 'none';
                    }
                });

                // --- Only show SELECT TOP 100 for allowed prefixes ---
                aiInput.addEventListener('input', function() {
                    const val = aiInput.value.trim();
                    const allowedPrefixes = ['atbl','atbv','aviw','stbl','stbv','sviw','ltbl','ltbv','lviw'];
                    const shouldShow = allowedPrefixes.some(function(p){ return val.startsWith(p) && !val.toLowerCase().endsWith('trig'); });
                    selectTopOption.style.display = shouldShow ? 'block' : 'none';
                });

                // --- Input Enter key ---
                aiInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' && aiInput.value.trim() !== '') {
                        const val = aiInput.value.trim();
                        const lowerVal = val.toLowerCase();
                        const isTable = ['atbl', 'stbl', 'ltbl'].some(p => lowerVal.startsWith(p)) && !lowerVal.endsWith('trig');

                        const url = isTable
                        ? '/af-dbmanager-table?' + encodeURIComponent(val)
                        : '/af-dbmanager-query?' + encodeURIComponent(val);

                        // --- If Control+Enter -> open in new browser tab ---
                        if (e.ctrlKey) {
                            window.open(url, '_blank');
                            return;
                        }

                        // --- Otherwise, open in iframeTabs as before ---
                        const topWindow = window.top || window;
                        const iframeTabs = topWindow.iframeTabs;

                        if (!iframeTabs || typeof iframeTabs.activateTab !== 'function') {
                            console.warn('iframeTabs not accessible');
                            return;
                        }

                        iframeTabs.activateTab({
                            id: val,
                            url: url,
                            tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                        });
                    }
                });


                // --- Menu click actions ---
                menu.addEventListener('click', function(e) {
                    const val = aiInput.value.trim();
                    if (!val) return;
                    const topWindow = window.top || window;
                    const iframeTabs = topWindow.iframeTabs;

                    if (!iframeTabs || typeof iframeTabs.activateTab !== 'function') {
                        console.warn('iframeTabs not accessible');
                        return;
                    }

                    const action = e.target.textContent.trim();
                    const lowerVal = val.toLowerCase();
                    const isTable = ['atbl', 'stbl', 'ltbl'].some(p => lowerVal.startsWith(p)) && !lowerVal.endsWith('trig');
                    let url;

                    switch(action){
                        case 'SELECT TOP 100':
                            iframeTabs.activateTab({
                                id: 'Query ' + Date.now(),
                                url: '/af-dbmanager-query',
                                tabBarItemContents: '<i class="fa fa-file text-info"></i> Query'
                            }, function() {
                                const frame = document.querySelector('iframe.active')?.contentWindow;
                                if (!frame?.afMonaco) return;
                                frame.afMonaco.changeCurrentTextTo("SELECT TOP 100 * FROM " + val);
                                frame.expandSqlTakeAction("SELECT TOP 100 * FROM " + val, 2);
                            });
                            break;

                        case 'Open':
                            url = isTable
                                ? '/af-dbmanager-table?' + encodeURIComponent(val)
                            : '/af-dbmanager-query?' + encodeURIComponent(val);
                            iframeTabs.activateTab({
                                id: val,
                                url: url,
                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                            });
                            break;

                        case 'Versions':
                            url = window.af?.devtools?.links('db_object_versions') + val;
                            iframeTabs.activateTab({
                                id: val + '_versions',
                                url: url,
                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                            });
                            break;

                        case 'Compare':
                            url = window.af?.devtools?.links('af_compare') + '?type=3&name=' + val;
                            iframeTabs.activateTab({
                                id: val + '_compare',
                                url: url,
                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                            });
                            break;

                        default: return;
                    }

                    menu.style.display = 'none';
                });

                // --- Attach Ctrl+Alt+O handler into top + dynamic same-origin iframes ---
                (function () {
                    const attached = new WeakMap();

                    function getSelectionFromWindow(win) {
                        try {
                            const sel = (typeof win.getSelection === 'function') ? win.getSelection().toString().trim() : '';
                            if (sel) return sel;
                        } catch (err) { /* cross-origin or unavailable */ }

                        try {
                            const active = win.document && win.document.activeElement;
                            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
                                const start = active.selectionStart;
                                const end = active.selectionEnd;
                                if (typeof start === 'number' && typeof end === 'number' && end > start) {
                                    return active.value.substring(start, end).trim();
                                }
                            }
                        } catch (err) { /* ignore */ }

                        return '';
                    }

                    function makeKeyHandlerForWindow(win) {
                        return function (e) {
                            try {
                                if (!(e.ctrlKey && e.altKey && e.key && e.key.toLowerCase() === 'd')) return;

                                // get selection from the same window where event fired
                                const sel = getSelectionFromWindow(win);
                                if (!sel) return;

                                const val = sel;
                                const lowerVal = val.toLowerCase();
                                const isTable = ['atbl', 'stbl', 'ltbl'].some(p => lowerVal.startsWith(p)) && !lowerVal.endsWith('trig');
                                const url = isTable
                                ? '/af-dbmanager-table?' + encodeURIComponent(val)
                                : '/af-dbmanager-query?' + encodeURIComponent(val);

                                const topWindow = window.top || window;
                                const iframeTabs = topWindow.iframeTabs;

                                if (!iframeTabs || typeof iframeTabs.activateTab !== 'function') {
                                    console.warn('iframeTabs not accessible');
                                    return;
                                }

                                iframeTabs.activateTab({
                                    id: val,
                                    url: url,
                                    tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                                });

                                try { e.preventDefault(); e.stopPropagation(); } catch (_) {}
                            } catch (err) {
                                console.error('open-shortcut handler error', err);
                            }
                        };
                    }

                    function attachToWindow(win) {
                        if (!win || attached.has(win)) return;
                        try {
                            const handler = makeKeyHandlerForWindow(win);
                            // capture phase so it fires early regardless of element focus
                            win.addEventListener('keydown', handler, true);
                            attached.set(win, handler);
                        } catch (err) {
                            // cannot attach (likely cross-origin)
                            return;
                        }

                        // Try to attach to same-origin child iframes immediately
                        try {
                            const frames = win.document.querySelectorAll ? win.document.querySelectorAll('iframe') : [];
                            frames.forEach(function (f) {
                                try {
                                    if (f.contentWindow) attachToWindow(f.contentWindow);
                                } catch (err) {
                                    // ignore cross-origin or other errors
                                }
                                // ensure we re-attach after iframe loads/navigates
                                try {
                                    if (!f.__tm_open_hook) {
                                        f.addEventListener('load', function () {
                                            try { if (f.contentWindow) attachToWindow(f.contentWindow); } catch (_) {}
                                        });
                                        f.__tm_open_hook = true;
                                    }
                                } catch (_) {}
                            });
                        } catch (_) { /* ignore */ }
                    }

                    // Attach to top window and existing iframes
                    attachToWindow(window);
                    (document.querySelectorAll('iframe') || []).forEach(function (f) {
                        try { if (f.contentWindow) attachToWindow(f.contentWindow); } catch (_) {}
                        try {
                            if (!f.__tm_open_hook) {
                                f.addEventListener('load', function () {
                                    try { if (f.contentWindow) attachToWindow(f.contentWindow); } catch (_) {}
                                });
                                f.__tm_open_hook = true;
                            }
                        } catch (_) {}
                    });

                    // Observe for dynamically added iframes (and nested ones)
                    const mo = new MutationObserver(function (mutations) {
                        for (const m of mutations) {
                            for (const node of m.addedNodes) {
                                try {
                                    if (!node || node.nodeType !== 1) continue;
                                    if (node.tagName === 'IFRAME') {
                                        try { if (node.contentWindow) attachToWindow(node.contentWindow); } catch (_) {}
                                        try {
                                            if (!node.__tm_open_hook) {
                                                node.addEventListener('load', function () {
                                                    try { if (node.contentWindow) attachToWindow(node.contentWindow); } catch (_) {}
                                                });
                                                node.__tm_open_hook = true;
                                            }
                                        } catch (_) {}
                                    } else {
                                        // node might contain nested iframes
                                        const nested = node.querySelectorAll ? node.querySelectorAll('iframe') : [];
                                        nested.forEach(function (f) {
                                            try { if (f.contentWindow) attachToWindow(f.contentWindow); } catch (_) {}
                                            try {
                                                if (!f.__tm_open_hook) {
                                                    f.addEventListener('load', function () {
                                                        try { if (f.contentWindow) attachToWindow(f.contentWindow); } catch (_) {}
                                                    });
                                                    f.__tm_open_hook = true;
                                                }
                                            } catch (_) {}
                                        });
                                    }
                                } catch (_) {}
                            }
                        }
                    });

                    try {
                        mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
                    } catch (_) {
                        // ignore if observe fails
                    }

                    // Optional cleanup exposure (useful from console during debugging)
                    try {
                        window.__tm_open_shortcut_cleanup = function () {
                            try { mo.disconnect(); } catch (_) {}
                            attached.forEach(function (handler, w) {
                                try { w.removeEventListener('keydown', handler, true); } catch (_) {}
                            });
                        };
                    } catch (_) {}
                })();

                // --- Keyboard shortcut: show full menu near selected text (Ctrl+Alt+O) ---
                // Works in main page and dynamically created iframes with /af-dbmanager-query?... src
                (function setupMenuShortcutEverywhere() {
                    function attachShortcut(doc) {
                        if (!doc || doc.__menuShortcutAttached) return;
                        doc.__menuShortcutAttached = true;

                        doc.addEventListener('keydown', function(e) {
                            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'o') {
                                e.preventDefault();

                                const selection = doc.getSelection();
                                const selectedText = selection && selection.toString().trim();
                                if (!selectedText) return;

                                let x = 0, y = 0;
                                if (selection.rangeCount > 0) {
                                    const rect = selection.getRangeAt(0).getBoundingClientRect();
                                    x = rect.left + doc.defaultView.scrollX;
                                    y = rect.bottom + doc.defaultView.scrollY;
                                }

                                const floatingMenu = menu.cloneNode(true);
                                Object.assign(floatingMenu.style, {
                                    position: 'fixed',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)', // shift back by half width/height
                                    zIndex: 999999,
                                });
                                doc.body.appendChild(floatingMenu);

                                floatingMenu.addEventListener('click', function(ev) {
                                    const action = ev.target.textContent.trim();
                                    if (!action) return;

                                    const topWindow = window.top || window;
                                    const iframeTabs = topWindow.iframeTabs;
                                    if (!iframeTabs || typeof iframeTabs.activateTab !== 'function') {
                                        console.warn('iframeTabs not accessible');
                                        return;
                                    }

                                    const val = selectedText;
                                    const lowerVal = val.toLowerCase();
                                    const isTable = ['atbl', 'stbl', 'ltbl'].some(p => lowerVal.startsWith(p)) && !lowerVal.endsWith('trig');
                                    let url;

                                    switch(action){
                                        case 'SELECT TOP 100':
                                            iframeTabs.activateTab({
                                                id: 'Query ' + Date.now(),
                                                url: '/af-dbmanager-query',
                                                tabBarItemContents: '<i class="fa fa-file text-info"></i> Query'
                                            }, function() {
                                                const frame = document.querySelector('iframe.active')?.contentWindow;
                                                if (!frame?.afMonaco) return;
                                                frame.afMonaco.changeCurrentTextTo("SELECT TOP 100 * FROM " + val);
                                                frame.expandSqlTakeAction("SELECT TOP 100 * FROM " + val, 2);
                                            });
                                            break;

                                        case 'Open':
                                            url = isTable
                                                ? '/af-dbmanager-table?' + encodeURIComponent(val)
                                            : '/af-dbmanager-query?' + encodeURIComponent(val);
                                            iframeTabs.activateTab({
                                                id: val,
                                                url: url,
                                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                                            });
                                            break;

                                        case 'Versions':
                                            url = window.af?.devtools?.links('db_object_versions') + val;
                                            iframeTabs.activateTab({
                                                id: val + '_versions',
                                                url: url,
                                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                                            });
                                            break;

                                        case 'Compare':
                                            url = window.af?.devtools?.links('af_compare') + '?type=3&name=' + val;
                                            iframeTabs.activateTab({
                                                id: val + '_compare',
                                                url: url,
                                                tabBarItemContents: '<i class="fa fa-file text-info"></i>' + val
                                            });
                                            break;

                                        default:
                                            return;
                                    }

                                    floatingMenu.remove();
                                });

                                setTimeout(() => {
                                    const hideHandler = ev => {
                                        if (!floatingMenu.contains(ev.target)) {
                                            floatingMenu.remove();
                                            doc.removeEventListener('click', hideHandler);
                                        }
                                    };
                                    doc.addEventListener('click', hideHandler);
                                }, 0);
                            }
                        });
                    }

                    // Attach to main page
                    attachShortcut(document);

                    // Attach to already loaded iframes
                    document.querySelectorAll('iframe').forEach(f => {
                        if (f.src.includes('/af-dbmanager-query')) {
                            try { attachShortcut(f.contentDocument); } catch (_) {}
                        }
                    });

                    // Watch for dynamically added iframes
                    const observer = new MutationObserver(mutations => {
                        mutations.forEach(m => {
                            m.addedNodes.forEach(node => {
                                if (node.tagName === 'IFRAME' && node.src.includes('/af-dbmanager-query')) {
                                    node.addEventListener('load', () => {
                                        try { attachShortcut(node.contentDocument); } catch (_) {}
                                    });
                                }
                            });
                        });
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                })();



            }, 500);
        });
    }





})();
