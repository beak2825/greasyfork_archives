// ==UserScript==
// @name         WME COL Basemap
// @namespace    https://fxzfun.com/
// @version      3.1.4
// @description  Adds aerials from the COL GIS as a basemap for WME
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @connect      query.cityoflewisville.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453822/WME%20COL%20Basemap.user.js
// @updateURL https://update.greasyfork.org/scripts/453822/WME%20COL%20Basemap.meta.js
// ==/UserScript==

/* global W, OpenLayers, WazeWrap, trustedTypes */

(function () {
    'use strict';
    const STORAGE_TICKET_KEY = "wmecolbasemap-ticket";
    const STORAGE_EXPIRE_KEY = "wmecolbasemap-ticketExpiryDate";
    const STORAGE_DATES_KEY = "wmecolbasemap-aerialDates";
    const STORAGE_MOST_RECENT_DATE_KEY = "wmecolbasemap-mostRecentDate";
    const STORAGE_SHORTCUT_KEY = "wmecolbasemap-shortcut";
    const STORAGE_BUBBLE_KEY = "wmecolbasemap-settingsBubbleEnabled";
    const STORAGE_PERSISTENT_BUBBLE_KEY = "wmecolbasemap-settingsBubblePersistent";

    const ELEMENT_BUBBLE_ID = "wmecolbasemap-datePickerContainer";
    const ELEMENT_DATE_PICKER_ID = "wmecolbasemap-datePicker";
    const ELEMENT_REFRESH_ID = "wmecolbasemap-refreshBtn";
    const ELEMENT_POPUP_CHECKBOX_ID = "wmecolbasemap-popupCheckbox";
    const ELEMENT_SETTINGS_BUBBLE_ID = "wmecolbasemap-settingsBubble";
    const ELEMENT_SETTINGS_COL_LINK_ID = "wmecolbasemap-settingsColLink";
    const ELEMENT_SETTINGS_TOGGLE_ID = "wmecolbasemap-settingsLayerToggle";
    const ELEMENT_SETTINGS_DATE_PICKER_ID = "wmecolbasemap-settingsDatePicker";
    const ELEMENT_SETTINGS_RELOAD_ID = "wmecolbasemap-settingsRefreshBtn";
    const ELEMENT_SETTINGS_PERSISTENT_BUBBLE_ID = "wmecolbasemap-settingsBubblePersistent";

    const DEBUG = false;
    const NAME = "WME COL Basemap";
    const pageWindow = unsafeWindow ?? window;

    const policy = trustedTypes?.createPolicy('wmecolbasemapPolicy', { createHTML: (input) => input });
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const getMostRecentDate = () => localStorage.getItem(STORAGE_MOST_RECENT_DATE_KEY)?.replaceAll(".", "") ?? "20230531";
    const createURL = (date, ticket) => "https://us0.nearmap.com/maps/?z=${z}&x=${x}&y=${y}&nml=V&version=2&nmd=" + date + "&ticket=" + ticket;

    let layer;
    let layerEnabled = false;
    let bubbleEnabled = JSON.parse(localStorage.getItem(STORAGE_BUBBLE_KEY)) ?? false;
    let persistentBubble = JSON.parse(localStorage.getItem(STORAGE_PERSISTENT_BUBBLE_KEY)) ?? true;
    let currentDate;
    let errorCount = 0;

    function getJSON(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: async function (response) {
                    resolve(JSON.parse(response.response));
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    async function getTicket() {
        let ticket = localStorage.getItem(STORAGE_TICKET_KEY);
        let ticketExpired = (localStorage.getItem(STORAGE_EXPIRE_KEY) ?? 0) < (new Date().getTime() + (60 * 60 * 1000)); // get new ticket if less than an hour left
        if (!ticket || ticketExpired) ticket = await refreshTicket();
        return ticket;
    }

    async function refreshTicket() {
        const json = await getJSON("https://query.cityoflewisville.com/v2/?webservice=NearmapTicketAndDates");
        const data = json[0][0];
        const dates = JSON.parse(data.aerialdates).map(d => d.date);

        localStorage.setItem(STORAGE_TICKET_KEY, data?.ticket);
        localStorage.setItem(STORAGE_DATES_KEY, JSON.stringify(dates));
        localStorage.setItem(STORAGE_MOST_RECENT_DATE_KEY, dates[0]);
        localStorage.setItem(STORAGE_EXPIRE_KEY, new Date().getTime() + (24 * 60 * 60 * 1000)); // expires every 24 hours
        return data?.ticket;
    }

    /*
        Add the layer to the map if it does not exist
    */
    async function addLayer() {
        const date = getMostRecentDate();
        const ticket = await getTicket();
        const url = createURL(date, ticket);

        layer = new OpenLayers.Layer.XYZ(
            NAME,
            url,
            {
                isBaseLayer: false,
                uniqueName: 'colgis',
                tileSize: new OpenLayers.Size(256, 256),
                transitionEffect: 'resize',
                displayInLayerSwitcher: true,
                opacity: 1,
                visibility: false
            });
        layer.events.on({
            'loadend': async function (evt) {
                if (DEBUG) console.log("WME COL Basemap: Loaded tiles");

                const refreshBtn = document.getElementById(ELEMENT_REFRESH_ID);
                if (refreshBtn) {
                    refreshBtn.style.animation = "3s wmecolbasemapRefresh";
                    await sleep(3000);
                    refreshBtn.style.animation = "";
                }
            },
            'loaderror': async function (evt) {
                if (errorCount++ === 0) {
                    console.error("WME COL Basemap: Error loading tile");
                    await refreshTicket();
                    updateLayerDate(currentDate ?? getMostRecentDate());
                } else if (errorCount === 50) {
                    toggleBasemap();
                    alert("WME COL Basemap failed to reach imagery endpoint");
                }
            }
        });
        W.map.addLayer(layer);
        W.map.setLayerIndex(layer, 3);
    }

    async function updateLayerDate(date) {
        if (!layer) return;
        let ticket = await getTicket();
        layer.url = createURL(date, ticket);
        layer.redraw();
    }

    /*
        Add the date picker element to the top left of the map
    */
    function addSettingsBubble() {
        if (!!document.getElementById(ELEMENT_BUBBLE_ID)) return;

        var dates = JSON.parse(localStorage.getItem(STORAGE_DATES_KEY) ?? "[]");

        const div = document.createElement("div");
        div.id = ELEMENT_BUBBLE_ID;
        div.innerHTML = policy.createHTML(
            `<style>
                 .wmecolbasemap { position: absolute; top: 40px; left: 60px; background-color: #fafafa; padding: 0.5em 0.75em; border-radius: 2em; }
                 .wmecolbasemap i { padding: 0.5em; vertical-align: middle; }
                 .wmecolbasemap #select-wrapper { display: none; }
                 @keyframes wmecolbasemapRefresh { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
             </style>
             <div class="wmecolbasemap">
                 <wz-checkbox id="${ELEMENT_POPUP_CHECKBOX_ID}" value="${layerEnabled ? "on" : "off"}" name="" ${layerEnabled ? "checked=''" : ''} style="display: inline-block; vertical-align: middle; margin-left: 0.5em;"></wz-checkbox>
                 <wz-select id="${ELEMENT_DATE_PICKER_ID}" value="${currentDate ?? dates[0]}" style="display: inline-block">
                     <div class="select-wrapper" id="select-wrapper"><div tabindex="0" class="select-box"><div class="selected-value-wrapper"><span class="selected-value">${currentDate ?? dates[0]}</span></div></div></div>
                     ${dates.map(d => "<wz-option value=" + d + ">" + d + "</wz-option>").join("")}
                 </wz-select>
                 <i id="${ELEMENT_REFRESH_ID}" class="w-icon w-icon-refresh"></i>
             </div>`);
        document.querySelector(".olMap").appendChild(div);

        document.getElementById(ELEMENT_POPUP_CHECKBOX_ID).addEventListener("click", toggleBasemap);

        const select = document.getElementById(ELEMENT_DATE_PICKER_ID);
        select.addEventListener("optionClicked", (evt) => {
            currentDate = evt.detail.value ?? currentDate;
            select.value = currentDate;
            updateLayerDate(select.value.replaceAll(".", ""));
            let settingsSelect = document.getElementById(ELEMENT_SETTINGS_DATE_PICKER_ID)
            if (!!settingsSelect) settingsSelect.value = currentDate;
        });

        const refreshBtn = document.getElementById(ELEMENT_REFRESH_ID);
        refreshBtn.addEventListener("click", async () => {
            refreshBtn.style.animation = "1s wmecolbasemapRefresh";
            updateLayerDate(currentDate ?? getMostRecentDate());
            await sleep(1000);
            div.remove();
            addSettingsBubble();
        });
    }

    function toggleBubble() {
        bubbleEnabled = !bubbleEnabled;
        const bubble = document.getElementById(ELEMENT_BUBBLE_ID);
        if (!!bubble && !bubbleEnabled) bubble.remove();
        else if (layerEnabled || persistentBubble) addSettingsBubble();
        localStorage.setItem(STORAGE_BUBBLE_KEY, bubbleEnabled);
    }

    function toggleBubblePersistence() {
        persistentBubble = !persistentBubble;
        if (!document.getElementById(ELEMENT_BUBBLE_ID) && bubbleEnabled) addSettingsBubble();
        else if (!layerEnabled) document.getElementById(ELEMENT_BUBBLE_ID)?.remove();
        localStorage.setItem(STORAGE_PERSISTENT_BUBBLE_KEY, persistentBubble);
    }

    /*
        Callback for shortcut and layer checkbox, toggles the visibility of the layer
    */
    function toggleBasemap() {
        layerEnabled = !layerEnabled;
        layer?.setVisibility(layerEnabled);

        const power = document.getElementById(ELEMENT_SETTINGS_TOGGLE_ID + '_power');
        power.style.color = layerEnabled ? '#00bd00' : '#bdbdbd';
        document.querySelector("#layer-switcher-item_wme_col_basemap").checked = layerEnabled;
        document.getElementById(ELEMENT_SETTINGS_TOGGLE_ID).checked = layerEnabled;

        // toggles date picker
        if (bubbleEnabled && (layerEnabled || persistentBubble)) addSettingsBubble();
        if (!persistentBubble) {
            if (layerEnabled && bubbleEnabled) addSettingsBubble();
            else document.getElementById(ELEMENT_BUBBLE_ID)?.remove();
        } else if (bubbleEnabled) document.getElementById(ELEMENT_POPUP_CHECKBOX_ID).checked = layerEnabled;
    }

    /*
        Main entry point of the script
        Adds layer checkbox, shortcut, and layer
    */
    async function initialize() {
        console.log("WME COL Basemap: Start");

        if (DEBUG) pageWindow.wmeColBasemap = { getJSON, getTicket, refreshTicket, getMostRecentDate, createURL, addLayer, updateLayerDate, addSettingsBubble, toggleBasemap, layer };

        addLayer();

        console.log("WME COL Basemap: Added Layer");

        const i = setInterval(() => {
            if (WazeWrap?.Ready) {
                clearInterval(i);
                WazeWrap.Interface.AddLayerCheckbox(
                    "display",
                    NAME,
                    false,
                    toggleBasemap,
                    layer ?? W.map.getLayerByName(NAME));

                new WazeWrap.Interface.Shortcut('COLBasemapDisplay', 'Toggle COL Basemap',
                    'layers', 'layersToggleCOLBasemapDisplay', localStorage.getItem(STORAGE_SHORTCUT_KEY) ?? "", toggleBasemap, null).add();
            }
        }, 500);

        const dates = JSON.parse(localStorage.getItem(STORAGE_DATES_KEY) ?? "[]");
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wmeColBasemap");

        const label = document.createElement('span');
        label.id = ELEMENT_SETTINGS_TOGGLE_ID + '_power';
        label.classList = 'fa fa-power-off';
        label.style = 'margin-right: 5px;cursor: pointer;color: #ccc;font-size: 13px;';
        label.onclick = (ev) => {
            ev.stopPropagation();
            toggleBasemap();
        }

        tabLabel.appendChild(label);
        tabLabel.appendChild(document.createTextNode(' COL'));
        tabLabel.title = NAME;

        tabPane.style = "display: flex; flex-direction: column; height: 100%; gap: 5px;";
        tabPane.innerHTML = policy.createHTML(`
            <h3>WME COL Basemap <small>v3.1</small></h3>
            <p>provided by <a href="https://maps.cityoflewisville.com" target="_blank" id="${ELEMENT_SETTINGS_COL_LINK_ID}">maps.cityoflewisville.com</a></p>

            <b style="margin-top: 20px">Options</b>
            <wz-checkbox id="${ELEMENT_SETTINGS_BUBBLE_ID}" value="${bubbleEnabled ? "on" : "off"}" name="" ${bubbleEnabled ? "checked=''" : ''}>Show Settings Bubble</wz-checkbox>
            <wz-checkbox id="${ELEMENT_SETTINGS_PERSISTENT_BUBBLE_ID}" value="${persistentBubble ? "on" : "off"}" name="" ${persistentBubble ? "checked=''" : ''}>Persistent Bubble</wz-checkbox>
            <wz-checkbox id="${ELEMENT_SETTINGS_TOGGLE_ID}" value="off" name="">Toggle Basemap Layer</wz-checkbox>

            <span style="margin-top:20px">Aerial Date</span>
            <wz-select id="${ELEMENT_SETTINGS_DATE_PICKER_ID}" value="${currentDate ?? dates[0]}" style="display: inline-block">
                <div class="select-wrapper" id="select-wrapper" style="display: none"><div tabindex="0" class="select-box"><div class="selected-value-wrapper"><span class="selected-value">${currentDate ?? dates[0]}</span></div></div></div>
                ${dates.map(d => "<wz-option value=" + d + ">" + d + "</wz-option>").join("")}
            </wz-select>

            <wz-button id="${ELEMENT_SETTINGS_RELOAD_ID}" color="text" size="sm">Clear token and reload layer</wz-button>

            <p style="margin-top: 20px">Current Shortcut: ${localStorage.getItem(STORAGE_SHORTCUT_KEY) ?? "None"}</p>

            <i style="margin-top: 20px">Please note that the dates shown correspond to when Nearmap imagery was taken over the City of Lewisville, TX and represent the state of all Nearmap imagery as of that date. The date shown of Lewisville imagery does not indicate that areas outside it's city limits were also updated on said date.</i>

            <p style="margin-top: 20px;"><b>Note:</b> please do not use as your default basemap - only enable when needed, as we do not want to abuse the service provided by the City of Lewisville GIS.</p>
            <em>Aerial Imagery © Nearmap - <a href="https://nearmap.com" target="_blank">nearmap.com</a></em>
        `);

        await W.userscripts.waitForElementConnected(tabPane);

        document.getElementById(ELEMENT_SETTINGS_BUBBLE_ID).addEventListener("click", toggleBubble);
        document.getElementById(ELEMENT_SETTINGS_TOGGLE_ID).addEventListener("click", toggleBasemap);
        document.getElementById(ELEMENT_SETTINGS_PERSISTENT_BUBBLE_ID).addEventListener("click", toggleBubblePersistence);
        document.getElementById(ELEMENT_SETTINGS_RELOAD_ID).addEventListener("click", () => updateLayerDate(currentDate ?? getMostRecentDate()));

        const colLink = document.getElementById(ELEMENT_SETTINGS_COL_LINK_ID);
        colLink.addEventListener("mousedown", () => {
            const center = W.map.getCenter();
            const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
            lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
            colLink.href = `https://maps.cityoflewisville.com/?&zoom=${W.map.getZoom()}&center=${lonlat.lat},${lonlat.lon}&basemap=nearmap_${currentDate?.replaceAll(".", "") ?? getMostRecentDate()}`;
        });

        const select = document.getElementById(ELEMENT_SETTINGS_DATE_PICKER_ID);
        select.addEventListener("optionClicked", (evt) => {
            currentDate = evt.detail.value ?? currentDate;
            select.value = currentDate;
            updateLayerDate(select.value.replaceAll(".", ""));
            let bubbleSelect = document.getElementById(ELEMENT_DATE_PICKER_ID)
            if (!!bubbleSelect) bubbleSelect.value = currentDate;
        });

        if (bubbleEnabled && (layerEnabled || persistentBubble)) addSettingsBubble();

        pageWindow.addEventListener("beforeunload", () => {
            const shortcut = W.accelerators.Actions.COLBasemapDisplay?.shortcut;
            if (!shortcut) return;

            const modifiers = [];
            if (shortcut.ctrlKey) modifiers.push("Ctrl");
            if (shortcut.altKey) modifiers.push("Alt");
            if (shortcut.shiftKey) modifiers.push("Shift");

            const newShortcut = `${modifiers.join("+")}+${String.fromCharCode(shortcut.keyCode)}`;
            localStorage.setItem(STORAGE_SHORTCUT_KEY, newShortcut);
            console.log("Saved WME COL Basemap settings");
        });

    }

    W?.userscripts?.state?.isReady ? initialize() : document.addEventListener("wme-ready", initialize, { once: true });
    pageWindow.colInit = initialize;
})();