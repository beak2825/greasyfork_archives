// ==UserScript==
// @name           Gmail Shield
// @name:es        Gmail Escudo
// @namespace      http://tampermonkey.net/
// @version        3.0
// @description    Gmail Sender Shield with GitHub Gist cloud sync
// @description:es Gmail Escudo de Correos con sincronización en la nube
// @author         IgnaV
// @match          https://mail.google.com/*
// @icon           https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico
// @license        MIT
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504281/Gmail%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/504281/Gmail%20Shield.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    class GistSync {
        constructor() {
            this.token = GM_getValue('gms_token') ?? GM_setValue('gms_token', '') ?? '';
            this.gistId = GM_getValue('gms_gistId') ?? GM_setValue('gms_gistId', '') ?? '';
        }

        isConfigured() {
            return !!this.token && !!this.gistId;
        }

        async fetchGist() {
            if (!this.isConfigured()) return null;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.github.com/gists/${this.gistId}`,
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    onload: (response) => {
                        try {
                            if (response.status === 200) {
                                const gist = JSON.parse(response.responseText);
                                const filename = Object.keys(gist.files)[0];
                                resolve(JSON.parse(gist.files[filename].content));
                            } else {
                                resolve(null);
                            }
                        } catch (e) {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        async updateGist(data) {
            if (!this.isConfigured()) return;

            GM_xmlhttpRequest({
                method: 'PATCH',
                url: `https://api.github.com/gists/${this.gistId}`,
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    files: {
                        'gmail_shield_data.json': {
                            content: JSON.stringify(data, null, 2)
                        }
                    }
                }),
                onerror: () => {}
            });
        }
    }

    function obtenerCorreo() {
        return new Promise((resolve) => {
            const buscarMeta = () => {
                const meta = document.querySelector('meta[name="og-profile-acct"]');
                if (meta?.content?.includes('@')) {
                    resolve(meta.content);
                    return true;
                }
                return false;
            };

            if (buscarMeta()) return;

            const observer = new MutationObserver(() => {
                if (buscarMeta()) {
                    observer.disconnect();
                }
            });

            observer.observe(document.head, { childList: true, subtree: true });
        });
    }

    obtenerCorreo().then(async (email) => {
        const userId = email || window.location.href.match(/\/u\/(\d+)\//)[1];
        const gistSync = new GistSync();

        const localDomains = GM_getValue('allowedDomains', []);
        const localUserDomains = GM_getValue('allowedUserDomains', {});

        const addIcon = GM_getValue('addIcon', true);
        const addDomain = GM_getValue('addDomain', true);
        const processedElements = new Set();
        const channel = new BroadcastChannel('mi-canal');

        channel.onmessage = () => {
            updateAllDomainStates();
        };

        const hasDomains = (localDomains.length > 0) || (Object.keys(localUserDomains).length > 0);

        if (!addIcon && !addDomain && !hasDomains) return;

        gistSync.fetchGist().then((gistData) => {
            if (gistData) {
                const safeGistData = {
                    addIcon: gistData.addIcon !== undefined ? gistData.addIcon : true,
                    addDomain: gistData.addDomain !== undefined ? gistData.addDomain : true,
                    allowedDomains: gistData.allowedDomains || [],
                    allowedUserDomains: gistData.allowedUserDomains || {}
                };

                const mergedDomains = [...new Set([
                    ...localDomains,
                    ...safeGistData.allowedDomains
                ])];

                const mergedUserDomains = { ...safeGistData.allowedUserDomains };
                for (const id in localUserDomains) {
                    if (!mergedUserDomains[id]) mergedUserDomains[id] = [];
                    mergedUserDomains[id] = [...new Set([
                        ...mergedUserDomains[id],
                        ...localUserDomains[id]
                    ])];
                }

                GM_setValue('allowedDomains', mergedDomains);
                GM_setValue('allowedUserDomains', mergedUserDomains);
                updateAllDomainStates();
            }
        }).catch(() => {});

        setInterval(async () => {
            const freshGist = await gistSync.fetchGist();
            if (freshGist) {
                GM_setValue('allowedDomains', freshGist.allowedDomains || []);
                GM_setValue('allowedUserDomains', freshGist.allowedUserDomains || {});
                updateAllDomainStates();
            }
        }, 5 * 60 * 1000);

        function getCommonDomains() {
            return GM_getValue('allowedDomains', []);
        }

        function getUserDomains() {
            const allUserDomains = GM_getValue('allowedUserDomains', {});
            return allUserDomains[userId] || [];
        }

        function getAllowedDomains() {
            return getCommonDomains().concat(getUserDomains());
        }

        function sortDomainList(list) {
            return list.sort((a, b) => {
                const getDomain = (str) => str.includes('@') ? str.split('@')[1] : str;
                const aDomain = getDomain(a);
                const bDomain = getDomain(b);

                const getSLD = (domain) => {
                    const parts = domain.split('.');
                    return parts[parts.length - 2];
                };

                const aSLD = getSLD(aDomain);
                const bSLD = getSLD(bDomain);

                if (aSLD !== bSLD) return aSLD.localeCompare(bSLD);
                if (aDomain !== bDomain) return aDomain.localeCompare(bDomain);
                return a.localeCompare(b);
            });
        }

        function saveAndSync() {
            const dataToSync = {
                addIcon,
                addDomain,
                allowedDomains: getCommonDomains(),
                allowedUserDomains: GM_getValue('allowedUserDomains', {})
            };

            gistSync.updateGist(dataToSync);
        }

        function extractDomain(email) {
            const domainParts = email.split('@')[1].split('.');
            if (domainParts[domainParts.length - 2] === 'com') {
                return domainParts.slice(-3).join('.');
            }
            return domainParts.slice(-2).join('.');
        }

        function updateDomainState(container, email) {
            const domain = extractDomain(email);
            const allowedDomains = getAllowedDomains();
            container.classList.remove('not-allowed-domain', 'allowed-domain');
            if (allowedDomains.includes(email) || allowedDomains.includes(domain)) {
                container.classList.add('allowed-domain');
            } else {
                container.classList.add('not-allowed-domain');
            }
        }

        function addIconToContainer(domainContainer, domain) {
            const icon = document.createElement('img');
            icon.src = `https://www.google.com/s2/favicons?domain=${domain}`;
            icon.className = 'domain-icon';
            domainContainer.appendChild(icon);
        }

        function addDomainToContainer(domainContainer, domain) {
            const domainSpan = document.createElement('span');
            domainSpan.className = 'domain-text';
            domainSpan.textContent = domain;
            domainContainer.appendChild(domainSpan);
        }

        function addDomainContainer(element, email) {
            const domain = extractDomain(email);
            const domainContainer = document.createElement('div');
            domainContainer.className = 'domain-container';
            domainContainer.title = email;
            domainContainer.onclick = () => domainContainerEvent(domainContainer, email);
            updateDomainState(domainContainer, email);

            addIconToContainer(domainContainer, domain);
            addDomainToContainer(domainContainer, domain);
            element.appendChild(domainContainer);
            return domainContainer;
        }

        function showTooltip(element, message) {
            const tooltip = document.createElement('span');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = message;

            element.appendChild(tooltip);
            setTimeout(() => {
                if (element.contains(tooltip)) {
                    element.removeChild(tooltip);
                }
            }, 3000);
        }

        function domainContainerEvent(domainContainer, email) {
            event.preventDefault();
            event.stopPropagation();

            const domain = extractDomain(email);
            const commonDomains = getCommonDomains();
            const userDomainsLocal = getUserDomains();
            let message;

            if (userDomainsLocal.includes(domain)) {
                const updated = userDomainsLocal.filter(d => d !== domain);
                const newCommon = sortDomainList([...commonDomains, domain]);

                GM_setValue('allowedDomains', newCommon);
                const allUserDomains = GM_getValue('allowedUserDomains', {});
                allUserDomains[userId] = updated;
                GM_setValue('allowedUserDomains', allUserDomains);
                message = `+ Empresa (Todas las cuentas)`;
            } else if (commonDomains.includes(domain)) {
                const updated = commonDomains.filter(d => d !== domain);
                const newUserDomains = sortDomainList([...userDomainsLocal, email]);

                GM_setValue('allowedDomains', updated);
                const allUserDomains = GM_getValue('allowedUserDomains', {});
                allUserDomains[userId] = newUserDomains;
                GM_setValue('allowedUserDomains', allUserDomains);
                message = `+ Correo (Esta cuenta)`;
            } else if (userDomainsLocal.includes(email)) {
                const updated = userDomainsLocal.filter(d => d !== email);
                const newCommon = sortDomainList([...commonDomains, email]);

                GM_setValue('allowedDomains', newCommon);
                const allUserDomains = GM_getValue('allowedUserDomains', {});
                allUserDomains[userId] = updated;
                GM_setValue('allowedUserDomains', allUserDomains);
                message = `+ Correo (Todas las cuentas)`;
            } else if (commonDomains.includes(email)) {
                const updated = commonDomains.filter(d => d !== email);
                GM_setValue('allowedDomains', updated);
                message = `Eliminado`;
            } else {
                const newUserDomains = sortDomainList([...userDomainsLocal, domain]);
                const allUserDomains = GM_getValue('allowedUserDomains', {});
                allUserDomains[userId] = newUserDomains;
                GM_setValue('allowedUserDomains', allUserDomains);
                message = `+ Empresa (Esta cuenta)`;
            }

            updateAllDomainStates();
            showTooltip(domainContainer, message);
            saveAndSync();

            setTimeout(() => channel.postMessage(message), 200);
        }

        function updateAllDomainStates() {
            const nameElements = document.querySelectorAll('.bA4, .bAK, .bAp');
            nameElements.forEach((element) => {
                const emailElement = element.querySelector('[email]');
                if (!emailElement) return;

                const email = emailElement.getAttribute('email');
                const domainContainer = element.querySelector('.domain-container');

                if (domainContainer) {
                    updateDomainState(domainContainer, email);
                } else {
                    addDomainContainer(element, email);
                }
            });
        }

        function addDomainBelowName() {
            const nameElements = document.querySelectorAll('.bA4, .bAK, .bAp');

            nameElements.forEach((element) => {
                if (processedElements.has(element)) return;

                const emailElement = element.querySelector('[email]');
                if (!emailElement) return;

                const email = emailElement.getAttribute('email');
                addDomainContainer(element, email);
                processedElements.add(element);
            });
        }

        function addStyles() {
            const style = document.createElement('style');
            style.type = 'text/css';
            const css = `
                .bA4, .bAK, .bAp {
                    padding-top: 9px;
                }
                .domain-container {
                    display: flex;
                    align-items: center;
                    margin-top: -4px;
                    font-size: 10px;
                    color: #888;
                    width: fit-content;
                    height: 11px;
                    padding: 1px 2px;
                }
                .domain-container:hover {
                    background-color: #b1b1b1;
                }
                .domain-container.not-allowed-domain:hover {
                    background-color: #e5afaf;
                }
                .domain-icon {
                    width: 10px;
                    height: 10px;
                    margin-right: 3px;
                }
                .domain-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 10px;
                    color: inherit;
                }
                .not-allowed-domain {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                .allowed-domain {
                    background-color: transparent;
                    color: inherit;
                }
                .custom-tooltip {
                    position: absolute;
                    background-color: #000;
                    color: #fff;
                    padding: 4px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                    top: 40px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .custom-tooltip:has(+ .custom-tooltip) {
                    display: none;
                }
                .domain-container:hover .custom-tooltip {
                    opacity: 1;
                }
            `;
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        addStyles();
        addDomainBelowName();

        const observer = new MutationObserver(() => {
            addDomainBelowName();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('load', () => {
            addDomainBelowName();
        });
    });
})();