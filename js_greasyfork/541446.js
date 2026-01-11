// ==UserScript==
// @name         Alias Helper
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Makes adding aliases easier.
// @author       You
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @match        https://steamdb.info/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_openInTab
// @grant        GM.addValueChangeListener
// @grant        GM.removeValueChangeListener
// @connect      api.vndb.org
// @connect      steamdb.info
// @connect      mobygames.com
// @connect      id.twitch.tv
// @connect      api.igdb.com
// @downloadURL https://update.greasyfork.org/scripts/541446/Alias%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/541446/Alias%20Helper.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    if (location.hostname === "steamdb.info") {
        if (GM.getValue('checking_steamdb_aliases', 1)) {
            if (document.getElementById('info')) {
                const info = {};
                const result = document.evaluate("//td[contains(text(),'name_localized')]/following-sibling::td[1]/table/tbody/tr/td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const nodes = [];
                for (let i = 0; i < result.snapshotLength; i++) {
                    nodes.push(result.snapshotItem(i).textContent.trim());
                }
                info.name_localized = nodes;
                GM.setValue('steamdb_alias_info', info);
            }
        }
    }

    let IGDB_CLIENT = await GM.getValue("IGDB_CLIENT_ID", null);
    let IGDB_SECRET = await GM.getValue("IGDB_CLIENT_SECRET", null);

    if (!IGDB_CLIENT || !IGDB_SECRET) {
        IGDB_CLIENT = prompt("Enter your IGDB Client ID:");
        IGDB_SECRET = prompt("Enter your IGDB Client Secret:");
        if (IGDB_CLIENT && IGDB_SECRET) {
            await GM.setValue("IGDB_CLIENT_ID", IGDB_CLIENT);
            await GM.setValue("IGDB_CLIENT_SECRET", IGDB_SECRET);
        } else {
            alert("IGDB credentials are required.");
            return;
        }
    }

    const GAME_NAME = document.querySelector('#content a').textContent;
    const VNDBID = document.querySelector('#vndburi').value?.match(/v\d+/);

    const waitForInput = setInterval(() => {
        const originalInput = document.querySelector('input[name="aliases"]');
        if (originalInput) {
            clearInterval(waitForInput);
            enhanceInput(originalInput);
        }
    }, 500);

    function enhanceInput(originalInput) {
        originalInput.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '5px';
        wrapper.style.maxWidth = '500px';
        wrapper.style.marginTop = '5px';

        const separatorSelect = document.createElement('select');
        ["||","|","/",","].forEach(sep => {
            const opt = document.createElement('option');
            opt.value = sep;
            opt.textContent = `Use "${sep}"`;
            separatorSelect.appendChild(opt);
        });

        const dedupeBtn = document.createElement('button');
        dedupeBtn.textContent = 'Deduplicate Tags';
        dedupeBtn.style.alignSelf = 'flex-start';
        dedupeBtn.style.marginLeft = '10px';

        const sourceToggles = document.createElement('div');
        sourceToggles.style.display = 'flex';
        sourceToggles.style.flexDirection = 'row';
        sourceToggles.style.justifyContent = 'space-around';
        sourceToggles.style.fontSize = '14px';
        sourceToggles.style.gap = '2px';
        sourceToggles.style.margin = '5px 0';

        const sources = {
            vndb: true,
            igdb: true,
            mobygames: false,
            steamdb: false
        };

        Object.entries(sources).forEach(([key, defaultValue]) => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '4px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = localStorage.getItem(`aliasHelper_source_${key}`) !== 'false';

            checkbox.addEventListener('change', () => {
                localStorage.setItem(`aliasHelper_source_${key}`, checkbox.checked);
                sources[key] = checkbox.checked;
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(`Use ${key.toUpperCase()}`));
            sourceToggles.appendChild(label);

            sources[key] = checkbox.checked;
        });

        const tagContainer = document.createElement('div');
        Object.assign(tagContainer.style, {
            display: 'flex', flexWrap: 'wrap',
            padding: '5px', cursor: 'text',
            minHeight: '30px'
        });

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Type alias...';
        Object.assign(inputField.style, {
            border: 'none', outline: 'none', flex: '1', minWidth: '100px'
        });
        tagContainer.appendChild(inputField);

        const suggestions = document.createElement('div');
        Object.assign(suggestions.style, {
            border: '1px solid #aaa', padding: '4px',
            maxHeight: '150px', overflowY: 'auto',
            display: 'none'
        });

        const btn = document.createElement('button');
        btn.textContent = 'Get Suggestions';
        btn.style.alignSelf = 'flex-start';

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.gap = '10px';
        buttonWrapper.append(btn, dedupeBtn);

        wrapper.append(tagContainer, separatorSelect, sourceToggles, buttonWrapper, suggestions);
        originalInput.parentNode.insertBefore(wrapper, originalInput.nextSibling);

        let tags = [];
        let currentSeparator = detectSeparator(originalInput.value || ",");

        separatorSelect.value = currentSeparator;
        separatorSelect.addEventListener('change', () => {
            currentSeparator = separatorSelect.value;
            tags = splitBySeparator(originalInput.value || "", currentSeparator);
            updateUI();
        });

        inputField.addEventListener('keydown', (e) => {
            const val = inputField.value.trim();
            const key = e.key;
            let isTrigger = key === 'Enter'
            || (currentSeparator === ',' && key === ',')
            || (currentSeparator === '|' && key === '|')
            || (currentSeparator === '/' && key === '/')
            || (currentSeparator === '||' && key === '|' && inputField.value.endsWith('|'));

            if (isTrigger) {
                e.preventDefault();
                let cleaned = val;
                if (currentSeparator === '||' && val.endsWith('|')) cleaned = val.slice(0, -1).trim();
                cleaned.split(currentSeparator).forEach(entry => {
                    if (entry) {
                        tags.push(entry.trim());
                    }
                    inputField.value = '';
                    updateUI();
                });
            }
        });

        btn.addEventListener('click', () => {
            event.preventDefault()
            if (GAME_NAME.length < 2) return;
            suggestions.innerHTML = 'Loading…';
            suggestions.style.display = 'block';
            fetchSuggestions(GAME_NAME, (list) => renderSuggestions(list));
        });

        if (originalInput.value) {
            tags = splitBySeparator(originalInput.value, currentSeparator);
            updateUI();
        }

        function updateUI() {
            tagContainer.querySelectorAll('.tag-chip').forEach(el => el.remove());
            tags.forEach((tag, index) => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag-chip';
                tagSpan.style.background = '#444';
                tagSpan.style.padding = '4px 8px';
                tagSpan.style.margin = '2px';
                tagSpan.style.borderRadius = '4px';
                tagSpan.style.cursor = 'pointer';
                tagSpan.style.display = 'flex';
                tagSpan.style.alignItems = 'center';
                tagSpan.style.gap = '5px';

                const text = document.createElement('span');
                text.textContent = tag;

                const editBtn = document.createElement('span');
                editBtn.textContent = '✏️';
                editBtn.style.cursor = 'pointer';
                editBtn.title = 'Edit tag';

                editBtn.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = tag;
                    input.style.margin = '0 4px';
                    input.style.flex = '1';

                    const finishEdit = () => {
                        const newVal = input.value.trim();
                        if (newVal && newVal !== tag) {
                            tags = tags.map(t => t === tag ? newVal : t);
                        }
                        updateUI();
                    };

                    input.addEventListener('blur', finishEdit);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            finishEdit();
                        } else if (e.key === 'Escape') {
                            updateUI();
                        }
                    });

                    input.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    tagSpan.replaceChild(input, text);
                    input.focus();
                });

                tagSpan.addEventListener('click', (e) => {
                    if (e.target !== editBtn) {
                        tags.splice(index, 1);
                        updateUI();
                    }
                });

                tagSpan.appendChild(text);
                tagSpan.appendChild(editBtn);
                tagContainer.insertBefore(tagSpan, inputField);
            });
            originalInput.value = tags.join(currentSeparator + ' ');
        }

        dedupeBtn.addEventListener('click', () => {
            event.preventDefault();
            const seen = new Set();
            tags = tags.filter(tag => {
                if (seen.has(tag)) return false;
                seen.add(tag);
                return true;
            });
            updateUI();
        });

        function detectSeparator(val) {
            if (val.includes("||")) return "||";
            if (val.includes("|")) return "|";
            if (val.includes("/")) return "/";
            return ",";
        }

        function splitBySeparator(val, sep) {
            const esc = sep.replace(/[|\\]/g,'\\$&');
            return val.split(new RegExp(esc)).map(s => s.trim()).filter(Boolean);
        }

        function escapeHTML(str) {
            return str.replace(/[&<>"']/g, function (match) {
                const escape = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return escape[match];
            });
        }

        function renderSuggestions(list) {
            suggestions.innerHTML = '';
            const seen = new Set();
            list.forEach(({name,src}) => {
                if (seen.has(name)) return;
                seen.add(name);

                const div = document.createElement('div');
                div.innerHTML = `<strong>[${src}]</strong> ${escapeHTML(name)}`;
                div.style.cursor = 'pointer';
                div.style.padding = '4px';
                div.style.margin = '2px 0';
                div.style.border = '1px solid #ccc';
                div.style.width = 'fit-content';
                div.style.borderRadius = '4px';
                div.style.backgroundColor = tags.includes(name) ? '#ba2222' : '#36ba22';

                div.addEventListener('click', () => {
                    if (!tags.includes(name)) {
                        tags.push(name);
                        div.style.backgroundColor = '#ba2222';
                        updateUI();
                    }
                });
                suggestions.appendChild(div);
            });
            if (!list.length) suggestions.textContent = 'No results';
        }

        function fetchIGDBToken() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://id.twitch.tv/oauth2/token",
                    data: `client_id=${IGDB_CLIENT}&client_secret=${IGDB_SECRET}&grant_type=client_credentials`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (res) {
                        try {
                            const json2 = JSON.parse(res.responseText);
                            resolve(json2.access_token);
                        } catch (err) {
                            console.error("Failed to parse IGDB token response", err);
                            reject(err);
                        }
                    },
                    onerror: function (err) {
                        console.error("Error fetching IGDB token", err);
                        reject(err);
                    }
                });
            });
        }

        async function fetchSuggestions(q, cb) {
            const collected = [];
            const IGDB_TOKEN = await fetchIGDBToken();
            const steamInput = document.querySelector("#steamuri");
            let steamAppId = null;
            if (steamInput?.value) {
                const match = steamInput.value.match(/\d+/);
                if (match) {
                    steamAppId = match[0];
                }
            }

            const mobyInput = document.querySelector("#mobygamesuri");

            const tasks = [];
            if (sources.vndb) tasks.push(fetchVNDBAliases(q));
            if (sources.igdb) tasks.push(fetchIGDBAliases(q));
            if (sources.mobygames) tasks.push(fetchMobyAliases(mobyInput?.value));
            if (sources.steamdb && steamAppId) {
                tasks.push(fetchSteamAliases(steamAppId));
            }

            await Promise.all(tasks);
            cb(collected);

            // VNDB
            function fetchVNDBAliases(q) {
                if (!q) {
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    let filter;
                    (VNDBID) ? filter = ['id', "=", VNDBID[0]] : filter = ['search', '=', q];
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.vndb.org/kana/vn',
                        data: JSON.stringify({filters:filter, fields:"title, alttitle, titles{title, latin}, aliases", results:5}),
                        headers: {'Content-Type':'application/json'},
                        onload(res) {
                            try {
                                const obj = JSON.parse(res.responseText);
                                obj.results.forEach(vn => {
                                    const vndbAliases = new Set();

                                    if (vn.title) vndbAliases.add(vn.title);

                                    if (vn.alttitle) vndbAliases.add(vn.alttitle);

                                    if (Array.isArray(vn.aliases)) {
                                        vn.aliases.forEach(alias => {
                                            if (typeof alias === "string") {
                                                vndbAliases.add(alias);
                                            } else if (Array.isArray(alias) && alias[1]) {
                                                vndbAliases.add(alias[1]);
                                            }
                                        });
                                    }

                                    if (Array.isArray(vn.titles)) {
                                        vn.titles.forEach(t => {
                                            if (t.latin) vndbAliases.add(t.latin);
                                            if (t.title) vndbAliases.add(t.title);
                                        });
                                    }

                                    vndbAliases.forEach(alias => {
                                        if (alias && !(alias == GAME_NAME)) {
                                            collected.push({name: alias.trim(), src: 'VNDB' });
                                        }
                                    });
                                });
                            } catch(e){}
                            resolve();
                        },
                        onerror: resolve
                    });
                });
            }

            //IGDB
            function igdbRequest(url, data, token) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url,
                        data,
                        headers: {
                            "Client-ID": IGDB_CLIENT,
                            "Authorization": `Bearer ${IGDB_TOKEN}`,
                            "Accept": "application/json"
                        },
                        onload: res => {
                            try {
                                const parsed = JSON.parse(res.responseText);
                                resolve(parsed);
                            } catch (err) {
                                reject(err);
                            }
                        },
                        onerror: reject
                    });
                });
            }

            function fetchIGDBAliases(query, token) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const games = await igdbRequest("https://api.igdb.com/v4/games", `search "${query}"; fields name,alternative_names,game_localizations; limit 5;`, token);

                        const aliasMap = new Map();
                        const localizationIds = new Set();
                        const altIds = new Set();

                        games.forEach(game => {
                            if (game.name && !(game.name == GAME_NAME)) {
                                aliasMap.set(game.name, 'IGDB');
                            }
                            (game.alternative_names || []).forEach(id => altIds.add(id));
                            (game.game_localizations || []).forEach(id => localizationIds.add(id));
                        });

                        if (altIds.size > 0) {
                            const altNames = await igdbRequest("https://api.igdb.com/v4/alternative_names", `where id = (${[...altIds].join(",")}); fields name;`, token);
                            altNames.forEach(entry => {
                                if (entry.name && !(entry.name == GAME_NAME)) {
                                    aliasMap.set(entry.name, 'IGDB');
                                }
                            });
                        }

                        if (localizationIds.size > 0) {
                            const localNames = await igdbRequest("https://api.igdb.com/v4/game_localizations", `where id = (${[...localizationIds].join(",")}); fields name;`, token);
                            localNames.forEach(entry => {
                                if (entry.name && !(entry.name == GAME_NAME)) {
                                    aliasMap.set(entry.name, 'IGDB');
                                }
                            });
                        }

                        aliasMap.forEach((source, alias) => {
                            collected.push({name: alias, src: source });
                        });

                        resolve();
                    } catch (err) {
                        console.error("Error fetching IGDB aliases:", err);
                        resolve();
                    }
                });
            }

            // MobyGames
            function fetchMobyAliases(q) {
                if (!q) {
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: q,
                        onload(res) {
                            try {
                                const html = new DOMParser().parseFromString(res.responseText,'text/html');
                                html.querySelectorAll('#main div.mb div span u').forEach((a,i) => {
                                    collected.push({name: a.textContent.trim(), src:'MobyGames-aka'});
                                });

                                html.querySelectorAll('section>ul.text-sm>li').forEach((a,i) => {
                                    collected.push({name: a.textContent.split(' - ').slice(0,-1).join("").trim(), src:'MobyGames-alt'});
                                });
                                resolve();
                            } catch(err){
                                console.error("Error fetching Moby aliases:", err);
                            }
                        },
                        onerror: resolve
                    });
                });
            }

            // Steam
            function fetchSteamAliases(q) {
                return new Promise((resolve) => {
                    GM.deleteValue('steamdb_alias_info');
                    GM.setValue('checking_steamdb_aliases', 1);
                    const tab = GM_openInTab(`https://steamdb.info/app/${q}/info`);

                    const listener = GM.addValueChangeListener(
                        "steamdb_alias_info", (key, oldValue, newValue) => {
                            GM.removeValueChangeListener(listener);
                            tab.close();
                            const aliases = newValue?.name_localized ?? [];

                            GM.deleteValue(key);
                            GM.deleteValue("checking_steamdb_aliases");
                            if (!newValue) {
                                console.warn("SteamDB returned no alias data");
                                clearTimeout(timeout);
                                resolve;
                            }
                            aliases.forEach((a) => collected.push({ name: a, src: "SteamDB" }));
                            clearTimeout(timeout);
                            resolve(aliases);
                        }
                    );

                    const timeout = setTimeout(() => {
                        GM.removeValueChangeListener(listener);
                        try { tab.close(); } catch {}
                        console.warn("Time out waiting for steamdb_alias_info");
                        resolve();
                    }, 15000);
                });
            }
        }
    }
})();