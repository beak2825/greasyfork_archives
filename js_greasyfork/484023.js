// ==UserScript==
// @name         DDSteam for Google, Steam, IGDB and MobyGames
// @name:es      DDSteam para Google, Steam, IGDB y MobyGames
// @version      8.0
// @description  Add, edit, and remove download/search links for games on Steam, IGDB, MobyGames and Google Search pages. Includes configurable shortcuts and game name formatting.
// @description:es  Añade, edita y elimina enlaces de descarga/búsqueda de juegos en las páginas de Steam, IGDB, MobyGames y búsquedas de Google. Incluye accesos directos configurables y formato de nombre de juego.
// @author       johnromerobot
// @license      MIT
// @match        https://www.igdb.com/search*
// @match        https://www.igdb.com/games/*
// @match        https://store.steampowered.com/app/*
// @match        https://www.mobygames.com/game/*
// @match        https://www.google.com/search*
// @match        https://www.google.es/search*
// @match        https://www.google.co.uk/search*
// @match        https://www.google.ca/search*
// @match        https://www.google.com.mx/search*
// @match        https://www.google.com.ar/search*
// @match        https://www.google.cl/search*
// @namespace    https://greasyfork.org/users/1243768
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/484023/DDSteam%20for%20Google%2C%20Steam%2C%20IGDB%20and%20MobyGames.user.js
// @updateURL https://update.greasyfork.org/scripts/484023/DDSteam%20for%20Google%2C%20Steam%2C%20IGDB%20and%20MobyGames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Keys for Settings ---
    const SITES_CONFIG_KEY = 'ddsteam_sites_config';
    const SETTINGS_SHORTCUT_ENABLED_KEY = 'ddsteam_show_settings_shortcut';
    const GAME_FORMATTING_ENABLED_KEY = 'ddsteam_game_formatting_enabled';
    const DEFAULT_SETTINGS_SHORTCUT_ENABLED = true;
    const DEFAULT_GAME_FORMATTING_ENABLED = false;

    // --- Default Configuration ---
    const defaultSiteConfigs = [
        { id: "steamgg", name: "SteamGG", tooltip: "Search on SteamGG\nDLL Site. Portable Games.", icon: "https://i.ibb.co/XCj45HD/1728102863385.png", urlTemplate: "https://steamgg.net/?s={game}", defaultEnabled: true },
        { id: "anker", name: "AnkerGames", tooltip: "Search on AnkerGames\nDLL Site. Portable Games. Direct Links. No filehosters.", icon: "https://ankergames.net/static/img/logo-1734270270.webp", urlTemplate: "https://ankergames.net/search/{game}", defaultEnabled: true },
        { id: "onlinefix", name: "Online-Fix", tooltip: "Search on Online-Fix\nDLL Site. Games with online patches", icon: "https://i.ibb.co/rRZfn6Wp/logo1.png", urlTemplate: "https://online-fix.me/index.php?do=search&subaction=search&story={game}", defaultEnabled: true },
        { id: "steamrip", name: "SteamRIP", tooltip: "Search on SteamRIP\nDLL Site. Portable Games.", icon: "https://i.imgur.com/tmvOT86.png", urlTemplate: "https://steamrip.com/?s={game}", defaultEnabled: true },
        { id: "elenemigos", name: "ElEnemigos", tooltip: "Search on ElEnemigos\nDLL Spanish Site.", icon: "https://elenemigos.com/imgs/logo.png", urlTemplate: "https://elenemigos.com/?g_name={game}&platform=&tag=&order=last_update", defaultEnabled: true },
        { id: "csrinru", name: "CS.RIN.RU", tooltip: "Search on CS.RIN.RU (Login required) \nThe origin of everything. Good for download clean steam files and latest updates.", icon: "https://i.ibb.co/RYQkz8t/site-logo-2.png", urlTemplate: "https://cs.rin.ru/forum/search.php?keywords={game}&terms=all&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search", defaultEnabled: true },
        { id: "gog", name: "GOG", tooltip: "Search on GOGGames\nDLL Site. Focus in GOG games.", icon: "https://i.imgur.com/wXfz72C.png", urlTemplate: "https://www.gog-games.to/?search={game}", defaultEnabled: true },
        { id: "blizzboygames", name: "BlizzBoyGames", tooltip: "Search on BlizzBoyGames\nDLL Spanish Site. Good for old games.", icon: "https://www.blizzboygames.net/wp-content/uploads/2016/07/logo.png", urlTemplate: "https://www.blizzboygames.net/?s={game}", defaultEnabled: true },
        { id: "fitgirl", name: "FitGirl", tooltip: "Search on FitGirl\nThe Torrent Site.", icon: "https://i.imgur.com/GOFbweI.png", urlTemplate: "https://fitgirl-repacks.site/?s={game}", defaultEnabled: true },
        { id: "byxatab", name: "ByXatab", tooltip: "Search on ByXatab\nTorrent Site. Newer games are portable.", icon: "https://i.ibb.co/x8CsZ8GP/1314800.jpg", urlTemplate: "https://byxatab.com/search/{game}", defaultEnabled: true },
        { id: "ovagames", name: "OvaGames", tooltip: "Search on OvaGames\nDLL Site in multiple parts.", icon: "https://i.ibb.co/MxtCWQxG/ovagames-logo-Photoroom.png", urlTemplate: "https://www.ovagames.com/?s={game}", defaultEnabled: true },
        { id: "gamedrive", name: "GameDrive", tooltip: "Search on GameDrive\nDLL Site.", icon: "https://gamedrive.org/wp-content/uploads/2023/06/logo.png", urlTemplate: "https://gamedrive.org/?s={game}", defaultEnabled: true },
        { id: "crocdb", name: "CrocDB", tooltip: "Search on CrocDB\nROMs DDL Site. Clean and fast.", icon: "https://crocdb.net/static/img/croc_logo.png", urlTemplate: "https://crocdb.net/search/?title={game}", defaultEnabled: true },
        { id: "retrogametalk", name: "CDRomance", tooltip: "Search on CDRomance \nROMs DDL Site. Good for patched, modded and translated games.", icon: "https://cdromance.org/wp-content/uploads/2025/11/cdr-logo-phoenix.png", urlTemplate: "https://cdromance.org/?s={game}", defaultEnabled: true },
        { id: "romsfun", name: "RomsFun", tooltip: "Search on RomsFun\nROMs DDL Site.", icon: "https://romsfun.com/wp-content/uploads/2023/08/LOGO.png", urlTemplate: "https://romsfun.com/?s={game}", defaultEnabled: true },
        { id: "nxbrew", name: "NXBrew", tooltip: "Search on NXBrew\nSwitch Games.", icon: "https://nxbrew.net/wp-content/uploads/2019/05/cropped-NXbrewlogo-1.png", urlTemplate: "https://nxbrew.net/?s={game}", defaultEnabled: true },
        { id: "nopaystation", name: "NoPayStation", tooltip: "Search on NoPayStation\nPS3/PSVita PKG games files.", icon: "https://i.ibb.co/22msVjw/87ef1b4993784afe5a15d20e5936253b.webp", urlTemplate: "https://nopaystation.com/search?query={game}&limit=50&orderBy=completionDate&sort=DESC&missing=Show", defaultEnabled: true },
        { id: "pcgamingwiki", name: "PCGamingWiki", tooltip: "Search on PCGamingWiki\nGame Fixes & Workarounds.", icon: "https://i.ibb.co/h1FZcbV1/images-Photoroom.png", urlTemplate: "https://www.pcgamingwiki.com/w/index.php?search={game}", defaultEnabled: true },
        { id: "steamdb", name: "SteamDB", tooltip: "Search on SteamDB", icon: "https://i.ibb.co/nNNjwvpQ/Picsart-25-03-23-03-58-16-581.png", urlTemplate: "https://steamdb.info/search/?a=all&q={game}", defaultEnabled: true },
        { id: "hltb", name: "HowLongToBeat", tooltip: "Search on HowLongToBeat\nFind Average Game Lengths.", icon: "https://howlongtobeat.com/img/icons/apple-touch-icon-72x72.png", urlTemplate: "https://howlongtobeat.com/?q={game}", defaultEnabled: true },
        { id: "ggdeals", name: "GGDeals", tooltip: "Search on GGDeals", icon: "https://gg.deals/images/logo/logo-white.svg?v=c4392aa2", urlTemplate: "https://gg.deals/search/?title={game}", defaultEnabled: true },
        { id: "igdbsearch", name: "IGDB", tooltip: "Search on IGDB", icon: "https://www.igdb.com/packs/static/igdbLogo-bcd49db90003ee7cd4f4.svg", urlTemplate: "https://www.igdb.com/search?utf8=%E2%9C%93&q={game}", defaultEnabled: true },
        { id: "steamgriddb", name: "SteamGridDB", tooltip: "Search on SteamGridDB", icon: "https://avatars.githubusercontent.com/u/48405094?s=200&v=4", urlTemplate: "https://www.steamgriddb.com/search/grids?term={game}", defaultEnabled: false },
        { id: "mobygames", name: "MobyGames", tooltip: "Search on MobyGames", icon: "https://www.mobygames.com/static/img/logo.37887f87.png", urlTemplate: "https://www.mobygames.com/search/?q={game}", defaultEnabled: true }
    ];

    // --- Configuration Management ---
    function initializeConfig() {
        if (!GM_getValue(SITES_CONFIG_KEY)) {
            GM_setValue(SITES_CONFIG_KEY, defaultSiteConfigs);
        }
        const sites = getSitesConfig();
        sites.forEach(site => {
            if (GM_getValue(`ddsteam_steam_${site.id}`) === undefined) {
                setSiteEnabled(site.id, 'steam', site.defaultEnabled !== false);
            }
            if (GM_getValue(`ddsteam_igdb_${site.id}`) === undefined) {
                setSiteEnabled(site.id, 'igdb', site.defaultEnabled !== false);
            }
            if (GM_getValue(`ddsteam_mobygames_${site.id}`) === undefined) {
                setSiteEnabled(site.id, 'mobygames', site.defaultEnabled !== false);
            }
            if (GM_getValue(`ddsteam_google_${site.id}`) === undefined) {
                setSiteEnabled(site.id, 'google', site.defaultEnabled !== false);
            }
        });
    }

    function getSitesConfig() {
        return GM_getValue(SITES_CONFIG_KEY, []);
    }

    function setSitesConfig(newConfig) {
        GM_setValue(SITES_CONFIG_KEY, newConfig);
    }

    function getSiteOrder(platform) {
        const key = `ddsteam_order_${platform}`;
        const siteConfigs = getSitesConfig();
        const savedOrder = GM_getValue(key, []);
        const validOrder = savedOrder.filter(id => siteConfigs.some(s => s.id === id));
        siteConfigs.forEach(site => {
            if (!validOrder.includes(site.id)) {
                validOrder.push(site.id);
            }
        });
        if (validOrder.length === 0 && siteConfigs.length > 0) {
            return siteConfigs.map(site => site.id);
        }
        return validOrder;
    }

    function setSiteOrder(platform, order) {
        const key = `ddsteam_order_${platform}`;
        GM_setValue(key, order);
    }

    function isSiteEnabled(siteId, platform) {
        const key = `ddsteam_${platform}_${siteId}`;
        const site = getSitesConfig().find(s => s.id === siteId);
        const defaultState = site ? site.defaultEnabled !== false : true;
        return GM_getValue(key, defaultState);
    }

    function setSiteEnabled(siteId, platform, enabled) {
        const key = `ddsteam_${platform}_${siteId}`;
        GM_setValue(key, enabled);
    }

    // --- Popup Menu & Site Editor ---
    let ddsteamSettingsModal = null;
    let ddsteamSettingsModalClickListener = null;

    function closeDdsteamSettingsModal() {
        if (ddsteamSettingsModal && ddsteamSettingsModal.parentNode) {
            ddsteamSettingsModal.parentNode.removeChild(ddsteamSettingsModal);
            document.body.style.overflow = '';
            if (ddsteamSettingsModalClickListener) {
                document.removeEventListener('click', ddsteamSettingsModalClickListener);
                ddsteamSettingsModalClickListener = null;
            }
            ddsteamSettingsModal = null;
        }
    }

    function showSiteEditorModal(siteToEdit, platform, onSaveCallback) {
        if (ddsteamSettingsModal) ddsteamSettingsModal.style.display = 'none';

        const editorModal = document.createElement('div');
        editorModal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #2a2a2a; padding: 25px; z-index: 10002;
            box-shadow: 0 0 15px rgba(0,0,0,0.7); border-radius: 8px;
            color: #fff; width: 400px;
        `;

        editorModal.innerHTML = `
            <h3 style="margin-top: 0;">${siteToEdit ? 'Edit Site' : 'Add New Site'}</h3>
            <label>Name:</label><br>
            <input type="text" id="siteName" value="${(siteToEdit && siteToEdit.name) || ''}" style="width: 95%; margin-bottom: 10px; padding: 5px;"><br>
            <label>Tooltip:</label><br>
            <textarea id="siteTooltip" style="width: 95%; height: 60px; margin-bottom: 10px; padding: 5px;">${(siteToEdit && siteToEdit.tooltip) || ''}</textarea><br>
            <label>Icon URL:</label><br>
            <input type="text" id="siteIcon" value="${(siteToEdit && siteToEdit.icon) || ''}" style="width: 95%; margin-bottom: 10px; padding: 5px;"><br>
            <label>URL Template (use {game}):</label><br>
            <input type="text" id="siteUrlTemplate" value="${(siteToEdit && siteToEdit.urlTemplate) || ''}" placeholder="e.g., https://example.com/search?q={game}" style="width: 95%; margin-bottom: 15px; padding: 5px;"><br>
        `;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = 'padding: 8px 15px; background-color: #007bff; border: none; color: #fff; cursor: pointer; border-radius: 4px;';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = 'margin-left: 10px; padding: 8px 15px; background-color: #444; border: none; color: #fff; cursor: pointer; border-radius: 4px;';

        const closeEditor = () => {
            document.body.removeChild(editorModal);
            if (ddsteamSettingsModal) ddsteamSettingsModal.style.display = 'block';
        };

        cancelButton.onclick = closeEditor;

        saveButton.onclick = () => {
            const siteName = document.getElementById('siteName').value.trim();
            const siteUrlTemplate = document.getElementById('siteUrlTemplate').value.trim();

            if (!siteName || !siteUrlTemplate) {
                alert('Name and URL Template are required.');
                return;
            }

            let allSites = getSitesConfig();
            if (siteToEdit) {
                const site = allSites.find(s => s.id === siteToEdit.id);
                if (site) {
                    site.name = siteName;
                    site.tooltip = document.getElementById('siteTooltip').value;
                    site.icon = document.getElementById('siteIcon').value;
                    site.urlTemplate = siteUrlTemplate;
                }
            } else {
                const newSite = {
                    id: `custom_${Date.now()}`,
                    name: siteName,
                    tooltip: document.getElementById('siteTooltip').value,
                    icon: document.getElementById('siteIcon').value,
                    urlTemplate: siteUrlTemplate,
                    defaultEnabled: true
                };
                allSites.push(newSite);
                const currentOrder = getSiteOrder(platform);
                currentOrder.push(newSite.id);
                setSiteOrder(platform, currentOrder);
                setSiteEnabled(newSite.id, platform, true);
            }
            setSitesConfig(allSites);
            onSaveCallback();
            closeEditor();
        };

        editorModal.appendChild(saveButton);
        editorModal.appendChild(cancelButton);
        document.body.appendChild(editorModal);
    }

    function createPopupMenu() {
        if (ddsteamSettingsModal) return;

        ddsteamSettingsModal = document.createElement('div');
        const modal = ddsteamSettingsModal;
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #1a1a1a; padding: 20px; z-index: 10001;
            box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 8px;
            max-height: 80vh; overflow-y: auto; color: #fff; width: 500px;
        `;
        document.body.style.overflow = 'hidden';

        modal.innerHTML = `
            <h2 style="margin-top: 0; color: #fff;">DDSteam Configuration</h2>
            <div id="ddsteam_tabs" style="display: flex; margin-bottom: 10px;">
                <button id="steamTabBtn" style="flex: 1; padding: 5px; background-color: white; color: black; border: none; cursor: pointer;">Steam</button>
                <button id="igdbTabBtn" style="flex: 1; padding: 5px; background-color: #ccc; color: black; border: none; cursor: pointer;">IGDB</button>
                <button id="mobyTabBtn" style="flex: 1; padding: 5px; background-color: #ccc; color: black; border: none; cursor: pointer;">Moby</button>
                <button id="googleTabBtn" style="flex: 1; padding: 5px; background-color: #ccc; color: black; border: none; cursor: pointer;">Google</button>
            </div>
        `;
        const steamContainer = document.createElement('div');
        const igdbContainer = document.createElement('div');
        const mobyContainer = document.createElement('div');
        const googleContainer = document.createElement('div');
        igdbContainer.style.display = 'none';
        mobyContainer.style.display = 'none';
        googleContainer.style.display = 'none';

        modal.appendChild(steamContainer);
        modal.appendChild(igdbContainer);
        modal.appendChild(mobyContainer);
        modal.appendChild(googleContainer);

        const steamTabBtn = modal.querySelector('#steamTabBtn');
        const igdbTabBtn = modal.querySelector('#igdbTabBtn');
        const mobyTabBtn = modal.querySelector('#mobyTabBtn');
        const googleTabBtn = modal.querySelector('#googleTabBtn');

        function populateContainer(container, platform) {
            container.innerHTML = '';
            const siteConfigs = getSitesConfig();
            const order = getSiteOrder(platform);

            order.forEach(siteId => {
                const site = siteConfigs.find(s => s.id === siteId);
                if (!site) return;

                const item = document.createElement('div');
                item.draggable = true;
                item.style.cssText = 'display: flex; align-items: center; margin: 5px 0; padding: 5px; background-color: #2a2a2a; border-radius: 4px; color: #fff;';

                item.innerHTML = `
                    <span style="cursor: move; margin-right: 10px;">☰</span>
                    <img src="${site.icon}" title="${site.tooltip}" style="width: 56px; height: 28px; object-fit: contain; margin-right: 10px;">
                    <span style="flex-grow: 1;">${site.name}</span>
                `;
                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️';
                editBtn.style.cssText = 'background:none; border:none; color: #fff; cursor:pointer; font-size: 16px; margin-left: 10px;';
                editBtn.title = 'Edit Site';
                editBtn.onclick = () => showSiteEditorModal(site, platform, () => populateContainer(container, platform));

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️';
                deleteBtn.style.cssText = 'background:none; border:none; color: #ff6b6b; cursor:pointer; font-size: 16px;';
                deleteBtn.title = 'Delete Site';
                deleteBtn.onclick = () => {
                    if (confirm(`Are you sure you want to delete "${site.name}"? This cannot be undone.`)) {
                        let allSites = getSitesConfig().filter(s => s.id !== site.id);
                        setSitesConfig(allSites);
                        setSiteOrder('steam', getSiteOrder('steam').filter(id => id !== site.id));
                        setSiteOrder('igdb', getSiteOrder('igdb').filter(id => id !== site.id));
                        setSiteOrder('mobygames', getSiteOrder('mobygames').filter(id => id !== site.id));
                        setSiteOrder('google', getSiteOrder('google').filter(id => id !== site.id));
                        populateContainer(container, platform);
                    }
                };

                const status = document.createElement('span');
                const isEnabled = isSiteEnabled(site.id, platform);
                status.textContent = isEnabled ? '✔' : '✘';
                status.style.cssText = `font-size: 20px; margin-left: 10px; cursor: pointer; color: ${isEnabled ? '#00ff00' : '#ff0000'};`;
                status.addEventListener('click', () => {
                    const newState = !isSiteEnabled(site.id, platform);
                    setSiteEnabled(site.id, platform, newState);
                    status.textContent = newState ? '✔' : '✘';
                    status.style.color = newState ? '#00ff00' : '#ff0000';
                });
                item.appendChild(editBtn);
                item.appendChild(deleteBtn);
                item.appendChild(status);
                container.appendChild(item);

                item.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', site.id); item.style.opacity = '0.5'; });
                item.addEventListener('dragend', () => item.style.opacity = '1');
                item.addEventListener('dragover', (e) => e.preventDefault());
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    item.style.opacity = '1';
                    const draggedId = e.dataTransfer.getData('text/plain');
                    if (draggedId === site.id) return;
                    let currentOrderList = getSiteOrder(platform);
                    const draggedIndex = currentOrderList.indexOf(draggedId);
                    const dropIndex = currentOrderList.indexOf(site.id);
                    currentOrderList.splice(draggedIndex, 1);
                    currentOrderList.splice(dropIndex, 0, draggedId);
                    setSiteOrder(platform, currentOrderList);
                    populateContainer(container, platform);
                });
            });

            const addSiteButton = document.createElement('button');
            addSiteButton.textContent = '+ Add New Site';
            addSiteButton.style.cssText = 'margin-top: 15px; padding: 8px; width: 100%; background-color: #007bff; border: none; color: #fff; cursor: pointer; border-radius: 4px;';
            addSiteButton.onclick = () => showSiteEditorModal(null, platform, () => populateContainer(container, platform));
            container.appendChild(addSiteButton);
        }

        populateContainer(steamContainer, 'steam');
        populateContainer(igdbContainer, 'igdb');
        populateContainer(mobyContainer, 'mobygames');
        populateContainer(googleContainer, 'google');

        function setActiveTab(activeBtn, activeContainer) {
            [steamContainer, igdbContainer, mobyContainer, googleContainer].forEach(c => c.style.display = 'none');
            [steamTabBtn, igdbTabBtn, mobyTabBtn, googleTabBtn].forEach(b => b.style.backgroundColor = '#ccc');
            activeContainer.style.display = 'block';
            activeBtn.style.backgroundColor = 'white';
        }

        steamTabBtn.addEventListener('click', () => setActiveTab(steamTabBtn, steamContainer));
        igdbTabBtn.addEventListener('click', () => setActiveTab(igdbTabBtn, igdbContainer));
        mobyTabBtn.addEventListener('click', () => setActiveTab(mobyTabBtn, mobyContainer));
        googleTabBtn.addEventListener('click', () => setActiveTab(googleTabBtn, googleContainer));

        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = 'margin-top: 15px; padding-top: 10px; border-top: 1px solid #444;';
        optionsContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <input type="checkbox" id="ddsteam_show_shortcut_checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="ddsteam_show_shortcut_checkbox" style="cursor: pointer;">Show settings shortcut in link lists</label>
            </div>
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="ddsteam_format_game_name_checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="ddsteam_format_game_name_checkbox" style="cursor: pointer;">Enable game name formatting</label>
            </div>
        `;
        modal.appendChild(optionsContainer);
        const shortcutCheckbox = optionsContainer.querySelector('#ddsteam_show_shortcut_checkbox');
        shortcutCheckbox.checked = GM_getValue(SETTINGS_SHORTCUT_ENABLED_KEY, DEFAULT_SETTINGS_SHORTCUT_ENABLED);
        shortcutCheckbox.addEventListener('change', () => GM_setValue(SETTINGS_SHORTCUT_ENABLED_KEY, shortcutCheckbox.checked));

        const formattingCheckbox = optionsContainer.querySelector('#ddsteam_format_game_name_checkbox');
        formattingCheckbox.checked = GM_getValue(GAME_FORMATTING_ENABLED_KEY, DEFAULT_GAME_FORMATTING_ENABLED);
        formattingCheckbox.addEventListener('change', () => GM_setValue(GAME_FORMATTING_ENABLED_KEY, formattingCheckbox.checked));

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset All to Defaults';
        resetButton.style.cssText = 'padding: 5px 10px; background-color: #d9534f; border: none; color: #fff; cursor: pointer;';
        resetButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset EVERYTHING?\nThis will delete all custom sites and restore the default list, order, and settings.")) {
                const currentSites = getSitesConfig();
                GM_deleteValue(SITES_CONFIG_KEY);
                GM_deleteValue('ddsteam_order_steam');
                GM_deleteValue('ddsteam_order_igdb');
                GM_deleteValue('ddsteam_order_mobygames');
                GM_deleteValue('ddsteam_order_google');
                currentSites.forEach(site => {
                    GM_deleteValue(`ddsteam_steam_${site.id}`);
                    GM_deleteValue(`ddsteam_igdb_${site.id}`);
                    GM_deleteValue(`ddsteam_mobygames_${site.id}`);
                    GM_deleteValue(`ddsteam_google_${site.id}`);
                });
                initializeConfig();
                populateContainer(steamContainer, 'steam');
                populateContainer(igdbContainer, 'igdb');
                populateContainer(mobyContainer, 'mobygames');
                populateContainer(googleContainer, 'google');
            }
        });

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = 'margin-left: 10px; padding: 5px 10px; background-color: #444; border: none; color: #fff; cursor: pointer;';
        okButton.addEventListener('click', () => { closeDdsteamSettingsModal(); window.location.reload(); });

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(okButton);
        modal.appendChild(buttonContainer);

        ddsteamSettingsModalClickListener = (e) => {
            const editor = document.querySelector('div[style*="z-index: 10002"]');
            if (editor && editor.contains(e.target)) return;
            if (ddsteamSettingsModal && !ddsteamSettingsModal.contains(e.target) && !e.target.closest('.ddsteam-settings-shortcut-btn')) {
                closeDdsteamSettingsModal();
            }
        };
        setTimeout(() => document.addEventListener('click', ddsteamSettingsModalClickListener), 0);

        document.body.appendChild(modal);
    }

    GM_registerMenuCommand("Configure DDSteam Links", createPopupMenu);

    // --- Utility Functions ---
    function getSites(formattedGameName, platform) {
        const siteConfigs = getSitesConfig();
        const order = getSiteOrder(platform);
        return order
            .map(siteId => siteConfigs.find(site => site.id === siteId))
            .filter(site => site && isSiteEnabled(site.id, platform))
            .map(site => ({
                name: site.name,
                tooltip: site.tooltip,
                icon: site.icon,
                url: site.urlTemplate.replace('{game}', encodeURIComponent(formattedGameName))
            }));
    }

    function createLinkButton(searchLink, buttonText, tooltipText, iconPath, iconWidth, iconHeight) {
        const linkButton = document.createElement("a");
        linkButton.href = searchLink;
        linkButton.target = "_blank";
        linkButton.title = tooltipText;
        const img = new Image();
        img.src = iconPath;
        img.alt = buttonText;
        img.style.cssText = `width: ${iconWidth}; height: ${iconHeight}; object-fit: contain; border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); background-color: rgba(0, 0, 0, 0.2);`;
        linkButton.appendChild(img);
        return linkButton;
    }

    function createSettingsShortcutButtonElement(targetHeightStr) {
        const settingsButton = document.createElement("button");
        settingsButton.className = 'ddsteam-settings-shortcut-btn';
        settingsButton.textContent = "⚙️";
        settingsButton.title = "Open DDSteam Settings";
        const numericHeight = parseInt(targetHeightStr);
        settingsButton.style.cssText = `display: inline-flex; align-items: center; justify-content: center; width: ${targetHeightStr}; height: ${targetHeightStr}; font-size: ${numericHeight * 0.65}px; padding: 0; border: none; background-color: rgba(0, 0, 0, 0.2); color: #fff; border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.3s ease-in-out;`;
        settingsButton.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); createPopupMenu(); });
        settingsButton.addEventListener('mouseover', () => settingsButton.style.transform = 'scale(1.1)');
        settingsButton.addEventListener('mouseout', () => settingsButton.style.transform = 'scale(1)');
        return settingsButton;
    }

    function formatGameName(gameName) {
        const useFormatting = GM_getValue(GAME_FORMATTING_ENABLED_KEY, DEFAULT_GAME_FORMATTING_ENABLED);
        if (useFormatting) {
            return gameName.trim().toLowerCase().replace(/'/g, '').replace(/_/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '');
        } else {
            return gameName.trim();
        }
    }

    // --- Processing Functions ---
    function addLinksToContainer(container, gameName, platformKey, iconHeight, iconWidth) {
        const formattedGameName = formatGameName(gameName);
        const sites = getSites(formattedGameName, platformKey);
        sites.forEach(site => {
            const btn = createLinkButton(site.url, site.name, site.tooltip, site.icon, iconWidth, iconHeight);
            container.appendChild(btn);
        });

        if (sites.length > 0) {
            const openAllButton = document.createElement('button');
            openAllButton.textContent = '🚀';
            openAllButton.title = 'Open All Links';
            const numericHeight = parseInt(iconHeight);
            openAllButton.style.cssText = `
                display: inline-flex; align-items: center; justify-content: center;
                width: ${iconHeight}; height: ${iconHeight};
                font-size: ${numericHeight * 0.65}px;
                padding: 0; border: none; background-color: rgba(0, 0, 0, 0.2);
                color: #fff; border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                cursor: pointer; transition: transform 0.3s ease-in-out;
            `;
            openAllButton.addEventListener('mouseover', () => openAllButton.style.transform = 'scale(1.1)');
            openAllButton.addEventListener('mouseout', () => openAllButton.style.transform = 'scale(1)');

            openAllButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const linksToOpen = Array.from(container.querySelectorAll('a'));
                linksToOpen.forEach(link => {
                    GM_openInTab(link.href, { active: false });
                });
            });

            container.appendChild(openAllButton);
        }

        if (GM_getValue(SETTINGS_SHORTCUT_ENABLED_KEY, DEFAULT_SETTINGS_SHORTCUT_ENABLED)) {
            const settingsBtn = createSettingsShortcutButtonElement(iconHeight);
            container.appendChild(settingsBtn);
        }
    }

    function processSearchResults() {
        document.querySelectorAll("a.overflow-wrap.link-dark.h4.mt-0").forEach(link => {
            if (!link.href.includes('/games/') || (link.nextElementSibling && link.nextElementSibling.classList.contains("ddsteam-container"))) return;
            const gameName = link.firstChild?.nodeType === Node.TEXT_NODE ? link.firstChild.textContent.trim() : link.textContent.trim();
            const container = document.createElement('div');
            container.className = "ddsteam-container";
            container.style.cssText = 'margin-top: 5px; display: flex; flex-wrap: wrap; gap: 5px;';
            addLinksToContainer(container, gameName, 'igdb', '28px', '56px');
            link.insertAdjacentElement('afterend', container);
        });
    }

    function processGameInfoPage() {
        const linksContainerTarget = document.querySelector('.MuiGrid2-grid-xs-12');
        if (!linksContainerTarget || linksContainerTarget.querySelector('.ddsteam-game-links')) return;
        const container = document.createElement('div');
        container.className = 'ddsteam-game-links';
        container.style.cssText = 'margin-top: 8px; margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;';
        const gameTitleElement = document.querySelector("h1.MuiTypography-h3, h1");
        if (!gameTitleElement) return;
        const gameName = gameTitleElement.textContent.trim();
        addLinksToContainer(container, gameName, 'igdb', '48px', '48px');
        const hrElem = linksContainerTarget.querySelector('hr');
        if (hrElem) hrElem.insertAdjacentElement('beforebegin', container);
        else linksContainerTarget.appendChild(container);
    }

    function processGamePage() {
        const gameTitleElement = document.querySelector('.apphub_AppName');
        if (!gameTitleElement) return;
        const parent = gameTitleElement.parentElement;
        if (!parent || parent.querySelector('.ddsteam-container')) return;
        const gameName = gameTitleElement.textContent.trim();
        const container = document.createElement('div');
        container.className = "ddsteam-container";
        container.style.cssText = 'margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;';
        addLinksToContainer(container, gameName, 'steam', '28px', '56px');
        parent.appendChild(container);
    }

    function processMobyGamesPage() {
        const gameTitleElement = document.querySelector('h1.mb-0');
        if (!gameTitleElement) return;
        const parent = gameTitleElement.parentNode;
        if (!parent || parent.querySelector('.ddsteam-container')) return;
        const gameName = gameTitleElement.textContent.trim();
        const container = document.createElement('div');
        container.className = "ddsteam-container";
        container.style.cssText = 'margin-top: 10px; margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 5px;';
        addLinksToContainer(container, gameName, 'mobygames', '28px', '56px');
        parent.appendChild(container);
    }

    function processGoogleSearchPage() {
        // Check if we already added the links
        if (document.querySelector('.ddsteam-container')) return;

        // Find the subtitle element that indicates if it's a game
        const subtitleElement = document.querySelector('[data-attrid="subtitle"]');
        if (!subtitleElement) return;

        const subtitleText = subtitleElement.textContent.toLowerCase();

        // Check if it's a video game - support multiple languages
        const gameKeywords = [
            'videojuego', 'videojuegos',           // Spanish
            'videogame', 'video game', 'videogames', 'video games', // English
            'game',                                 // Generic English
            'jeu vidéo', 'jeux vidéo',             // French
            'videogioco', 'videogiochi',           // Italian
            'videospiel', 'videospiele',           // German
            'jogo de vídeo', 'jogos de vídeo',     // Portuguese
            'видеоигра', 'видеоигры',              // Russian
            'ビデオゲーム',                          // Japanese
            '비디오 게임',                           // Korean
            '电子游戏', '電子遊戲'                   // Chinese (Simplified/Traditional)
        ];

        const isGame = gameKeywords.some(keyword => subtitleText.includes(keyword));

        if (!isGame) return;

        // Find the title element
        const titleElement = document.querySelector('[data-attrid="title"]');
        if (!titleElement) return;

        const gameName = titleElement.textContent.trim();

        // Create container for links
        const container = document.createElement('div');
        container.className = "ddsteam-container";
        // CSS UPDATED: Added max-width, flex-wrap, and removed width that caused squeezing
        container.style.cssText = 'margin-top: 12px; margin-bottom: 28px; display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; background-color: rgba(0,0,0,0.05); border-radius: 8px; box-sizing: border-box; width: 100%; position: relative; z-index: 99; min-height: fit-content; overflow: visible;';
        addLinksToContainer(container, gameName, 'google', '28px', '56px');

        // FIXED INSERTION LOGIC:
        // Google Titles are often inside a flex row. We need to go UP the DOM tree to find
        // a parent that allows us to insert a block element underneath the whole title row.
        let insertionPoint = titleElement;

        // Attempt to find the Heading Row wrapper (usually 2 levels up from the text node)
        // Structure is usually: Div(Container) -> Div(Row) -> Div(TitleWrapper) -> Title
        if (insertionPoint.parentElement && insertionPoint.parentElement.parentElement) {
             insertionPoint = insertionPoint.parentElement.parentElement;
        }

        // Insert AFTER the flex container of the header
        if (insertionPoint && insertionPoint.parentNode) {
            insertionPoint.insertAdjacentElement('afterend', container);
        } else {
            // Fallback
            titleElement.insertAdjacentElement('afterend', container);
        }
    }

    // --- Styles ---
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `.ddsteam-container a:hover img, .ddsteam-game-links a:hover img { transform: scale(1.1); }`;
    document.head.appendChild(styleSheet);

    // --- Initialization ---
    initializeConfig();

    const url = window.location.href;
    if (url.includes('igdb.com/search')) {
        setTimeout(processSearchResults, 500);
        const observer = new MutationObserver(() => processSearchResults());
        observer.observe(document.body, { childList: true, subtree: true });
    } else if (url.includes('igdb.com/games/')) {
        setInterval(() => {
            if (document.querySelector("h1.MuiTypography-h3, h1") && document.querySelector('.MuiGrid2-grid-xs-12')) {
                processGameInfoPage();
            }
        }, 1000);
    } else if (url.includes('store.steampowered.com/app/')) {
        setInterval(() => {
            if (document.querySelector('.apphub_AppName')) {
                processGamePage();
            }
        }, 1000);
    } else if (url.includes('mobygames.com/game/')) {
        setInterval(() => {
            if (document.querySelector('h1.mb-0')) {
                processMobyGamesPage();
            }
        }, 1000);
    } else if (url.includes('google.') && url.includes('/search')) {
        // Initial check
        setTimeout(processGoogleSearchPage, 500);
        // Use MutationObserver for dynamic content changes (e.g., when navigating via AJAX)
        const observer = new MutationObserver(() => {
            processGoogleSearchPage();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();