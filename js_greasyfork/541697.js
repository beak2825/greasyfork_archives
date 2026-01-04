// ==UserScript==
// @name         Disboard Filter
// @namespace    https://github.com/wintrick
// @version      1.5
// @description  Filter Disboard servers by tag, member count, and more. Improved UI and fixes.
// @license      GNU GPLv3
// @author       wintrick
// @match        https://disboard.org/servers*
// @match        https://disboard.org/search*
// @icon         https://disboard.org/favicon.ico
// @grant        none
// @noframes
// @homepage     https://github.com/wintrick/disboard-filter
// @supportURL   https://github.com/wintrick/disboard-filter/issues
// @downloadURL https://update.greasyfork.org/scripts/541697/Disboard%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541697/Disboard%20Filter.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Inject CSS for better layout fill and horizontal tag list
    const style = document.createElement('style');
    style.textContent = `
      /* Flex layout for server container so cards fill gaps */
      #listings {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }
      /* Flex sizing for server cards */
      .column.is-one-third-desktop.is-half-tablet {
        flex: 1 1 320px !important;
        margin: 0 10px 10px 0 !important;
        box-sizing: border-box;
      }

      /* Horizontal tag list in filter panel */
      #tag-list {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        padding-left: 0 !important;
      }
      #tag-list li {
        list-style: none !important;
        background: #eee;
        border-radius: 4px;
        padding: 2px 8px;
        margin: 0 !important;
        display: flex;
        align-items: center;
      }
      #tag-list li span {
        margin-right: 6px;
      }
      #tag-list li button {
        color: red !important;
        border: none !important;
        background: none !important;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        line-height: 1;
        padding: 0;
      }
    `;
    document.head.appendChild(style);

    const REMOVE_DUPLICATES = true;
    const MIN_ONLINE_COUNT = 0;
    const MAX_ONLINE_COUNT = 20;
    const SERVER_DETAILS_RATE_LIMIT = 5000;

    const STORAGE_KEY = 'disboard_filtered_tags';
    const defaultTags = ["furry", "lgbt", "fortnite", "vtuber", "crypto"];
    const storedTags = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const FILTERED_TAGS = new Set([...defaultTags, ...storedTags]);

    const seenServers = {};
    const cachedServers = JSON.parse(localStorage.getItem("cachedServers") || "{}");
    const queuedServers = [];
    const retryDelays = {};

    function updateTagStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...FILTERED_TAGS]));
    }

    function updateCache() {
        localStorage.setItem("cachedServers", JSON.stringify(cachedServers));
    }

    function queueServer(serverUrl) {
        return new Promise((resolve, reject) => {
            if (cachedServers[serverUrl]) {
                resolve(cachedServers[serverUrl]);
            } else {
                queuedServers.push([serverUrl, resolve]);
            }
        });
    }

    setInterval(() => {
        if (queuedServers.length > 0) {
            const [serverUrl, resolve] = queuedServers.shift();
            getServerDetails(serverUrl).then(resolve).catch(() => {
                const retryCount = retryDelays[serverUrl] || 0;
                const delay = Math.min(30000, Math.pow(2, retryCount) * 1000);
                retryDelays[serverUrl] = retryCount + 1;
                setTimeout(() => {
                    queuedServers.unshift([serverUrl, resolve]);
                }, delay);
            });
        }
    }, SERVER_DETAILS_RATE_LIMIT);

    function getServerDetails(serverUrl) {
        return new Promise((resolve, reject) => {
            if (cachedServers[serverUrl]) {
                resolve(cachedServers[serverUrl]);
                return;
            }

            fetch(serverUrl).then(response => {
                if (!response.ok) return reject();
                response.text().then(html => {
                    const lines = html.split("\n");
                    const serverInfo = { isNew: false, onlineCount: -1, totalCount: -1 };

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line.includes('<i class="icon icon-baby-crying"></i>')) serverInfo.isNew = true;
                        if (line === '<div class="online-member-count">') {
                            serverInfo.onlineCount = parseInt(lines[++i].match(/<b>(\d+)<\/b>/)?.[1] || "-1");
                        }
                        if (line === '<div class="member-count">') {
                            serverInfo.totalCount = parseInt(lines[++i].match(/<b>(\d+)<\/b>/)?.[1] || "-1");
                            break;
                        }
                    }

                    cachedServers[serverUrl] = serverInfo;
                    updateCache();
                    resolve(serverInfo);
                });
            }).catch(reject);
        });
    }

    function serverUrl(element) {
        return element.closest(".server-info").querySelector(".server-name a").href;
    }

    function applyFilters(element) {
        Array.from(element.querySelectorAll(".listing-card > .server-header > .server-info > .server-misc > .server-online")).filter(onlineCount => {
            const url = serverUrl(onlineCount);
            const online = parseInt(onlineCount.innerText);
            const tags = Array.from(onlineCount.closest(".listing-card").getElementsByClassName("tag")).map(tag => tag.title.toLowerCase());

            if ((REMOVE_DUPLICATES && seenServers[url]) ||
                (online > MAX_ONLINE_COUNT || online < MIN_ONLINE_COUNT) ||
                tags.some(tag => FILTERED_TAGS.has(tag))) {
                // Remove entire .column wrapper to avoid blank spaces
                const columnDiv = onlineCount.closest(".listing-card")?.parentElement;
                if (columnDiv && columnDiv.classList.contains("column")) {
                    columnDiv.remove();
                } else {
                    onlineCount.closest(".listing-card").remove();
                }
                seenServers[url] = true;

                // Force layout reflow
                const listings = document.getElementById("listings");
                if (listings) {
                    listings.style.display = 'none';
                    listings.offsetHeight; // force reflow
                    listings.style.display = '';
                }

                return false;
            }

            seenServers[url] = true;
            return true;
        }).forEach(filtered => {
            filtered.innerText += " / ?";
            const url = serverUrl(filtered);
            queueServer(url).then(info => {
                filtered.innerText = `${info.onlineCount} / ${info.totalCount}`;
            });
        });
    }

    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.fontFamily = 'Arial, sans-serif';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '☰ Filter Tags';
        toggleBtn.style.background = '#444';
        toggleBtn.style.color = 'white';
        toggleBtn.style.border = 'none';
        toggleBtn.style.padding = '6px 12px';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '14px';
        toggleBtn.style.width = '100%';

        const panel = document.createElement('div');
        panel.style.display = 'none';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.borderTop = 'none';
        panel.style.padding = '10px';
        panel.style.borderRadius = '0 0 4px 4px';
        panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        panel.style.width = '320px';
        panel.style.maxHeight = '400px';
        panel.style.overflowY = 'auto';
        panel.style.fontSize = '14px';
        panel.style.color = '#222';

        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        const title = document.createElement('strong');
        title.textContent = 'Filtered Tags';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.id = 'tag-list';
        list.style.padding = '0';
        list.style.margin = '10px 0';
        list.style.listStyleType = 'none';

        function refreshTagList() {
            list.innerHTML = '';
            [...FILTERED_TAGS].sort().forEach(tag => {
                const li = document.createElement('li');
                li.style.margin = '0';
                li.innerHTML = `<span>${tag}</span> <button data-tag="${tag}">✕</button>`;
                list.appendChild(li);
            });
        }

        refreshTagList();
        panel.appendChild(list);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Add tags (comma-separated)';
        input.style.width = 'calc(100% - 60px)';
        input.style.padding = '6px';
        input.style.marginBottom = '6px';
        input.style.marginRight = '6px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.style.padding = '6px 10px';
        addBtn.style.border = 'none';
        addBtn.style.background = '#28a745';
        addBtn.style.color = '#fff';
        addBtn.style.borderRadius = '4px';
        addBtn.style.cursor = 'pointer';

        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(addBtn);
        panel.appendChild(inputWrapper);

        addBtn.addEventListener('click', () => {
            const tags = input.value.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
            let added = false;
            for (const tag of tags) {
                if (!FILTERED_TAGS.has(tag)) {
                    FILTERED_TAGS.add(tag);
                    added = true;
                }
            }

            if (added) {
                updateTagStorage();
                location.reload();
            }
        });

        list.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const tag = e.target.dataset.tag;
                FILTERED_TAGS.delete(tag);
                updateTagStorage();
                location.reload();
            }
        });

        container.appendChild(toggleBtn);
        container.appendChild(panel);
        document.body.appendChild(container);
    }

    createUI();
    applyFilters(document);

    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                applyFilters(mutation.addedNodes[0]);
            }
        }
    }).observe(document.getElementById("listings"), { childList: true });

})();