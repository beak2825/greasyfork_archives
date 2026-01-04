// ==UserScript==
// @name         WME Simple Alert Messages
// @namespace    https://fxzfun.com/
// @version      3.3.0
// @description  changes the styling of the segment and venue messages
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/webp;base64,UklGRi4EAABXRUJQVlA4TCEEAAAvgoAgEJVIb4A3y5zrJscm7yg3Skd5R2GUm6SWDsiHH5uq/4ISESBWTZBt0/tL3mQG0rbJ2YTcv8nNv0NJVtvmoe4mgwxqyQeU8qspYaIkrojakUpkB4b+7I4wlRwa8smyLwUztA0ICT+jJYNyWEZiqKWoNwaeinxGSpqzwMSwhtOblHMs2SWyThY/KPPYArhDE3qDJCY1Xaz4cMQ/y3gi0S9GlkdcFoINoXoRG6hhiWWjYdlh4E+G0sYekOWwykRZp4a/B1SZ7uAbIe5terAPAjS1jNlJsmzR7G7L1WUod01Whmgzf1FN9M1MWlVrqVy4jpsqLLURQTO/+EkwvXjBxVMf908NJne/ljf4D0u8uaQmOZX33e8oTfWdT5vaLgW/iYxO7/2O03XzU4KjZFSEM32d6mFmM7Cip7mZIMXbxtp3NK3xoNTauWCqu6Np497EmPx13P11bSDJ+qb2J+iOG1xgg1K3Ud1G/PnuB16lBjiIoGeNN/E2ZwODWFvvNwug9VeOFrDQuxpQqsYkwUHbhWKtaDt12eNdHCpDDzcgCSGY6i1awNSw0ExJwSRTqszTgfUHBLJcmcM7T/9wpujiE4XOBOZgkrn+qVFcCKWSgeocB9xttFhGWCdh5sMxbDPB+qgpV4kNO/f1eN97w8ClysSAcvMaHGiSA0oFGR5nu1AsAE1LPyWZrsoRNBn6qOZpZVOSybJNYbOospMwyc3kRYqqMhE4EjiZmoih8QSUbB/xwddbY8uQZbVz5xonXz/F/ZB3yrHGyx8R9+RN7wKQLYlrjadq1sp1OzOU02bJqsEBWVvgRC5DMdOElFlzZcgTH5XFLZo1uSCbLjtElqzgScsRmLDlXdiE66No9a+Ui01cMWXghbIn4GvAlikchJxZKqmx40Khel9b/5okMW7/8mtyU6XMjzJvUmfWfHrTe6AXhYzSxXc9bItBk0Qb2XN7SULV2RZO71hMCY3OlE+8X8yLk8go0IgSqsOX6n7WAQosoJpTXA347NXjdUeySljTSrjB4avla6aV8mfmwNMRcDU6iOgs+wWOSApnYV43lMRbXaxS2l4gHhmSukLuy2dAssbHzxe+GXIuICPAdTcY8p7ZuFyosI4jG5Qy94W9fQ8Wni9/m1FG33d56PLCU/1TiOz+CBgFBApjkwiU/I2uIfWz9xS725Tt26yhwmj3h1LTrsRr1UFaGd7nkrrRzhi2v5/u3t2DfQ9YxjKtpGVedDwBw0sJa2tNwRZFU7s503Z4V2cb/whk/F+c/MZJVnib53mvokGwTRwaYPyhKLAQOyz9ekuSE9kfyBK2gT6novReETaVov/3EaUU/cqvpDll8igRUGLessFrV0pmRMlcSgmMSymajeC+/NC+FCx/jfl7ocz5zwOlpR+O1kSLnlEAAA==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449727/WME%20Simple%20Alert%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/449727/WME%20Simple%20Alert%20Messages.meta.js
// ==/UserScript==

/* global W, OpenLayers, trustedTypes */

(function() {
    'use strict';
    const DEBUG = false;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_NAME = GM_info.script.name;

    class Messages {
        static LOCKED = "locked";
        static EA = "ea";
        static MIXED = "mixed";
        static PUR = "pur";
        static CLOSURE = "closure";
        static HIDE_MESSAGE = "hide_message";
        static SNAPSHOT_ACTIVE = "snapshot";
        static ROUTING_PREFERENCE = "routing";
        static JUNCTION_BOX = "junction_box";

        static messages = {
            "locked":        { "icon": "w-icon-lock-fill", "message": "Locked to L{maxLock}" },
            "ea":            { "icon": "w-icon-alert-fill", "message": "Out of your EA" },
            "mixed":         { "icon": "w-icon-round-trip", "message": "Mixed A/B" },
            "pur":           { "icon": "w-icon-location-update-fill", "message": "PUR Request" },
            "closure":       { "icon": "w-icon-closure", "message": "Has Closures" },
            "snapshot":      { "icon": "w-icon-restore", "message": "Snapshot Mode On" },
            "routing":       { "icon": "w-icon-route", "message": "Routing Pref" },
            "junction_box":  { "icon": "w-icon-polygon", "message": "In Junction Box" }
        }

        static getMessage(type, maxLock='') {
            return this.messages?.[type]?.message?.replace('{maxLock}', maxLock);
        }

        static getIcon(type) {
            return this.messages?.[type]?.icon;
        }
    }

    class MessageContainer {
        container;

        constructor() {
            this.container = document.getElementById("wmeSamContainer") || document.createElement("div");
            if (!document.getElementById("wmeSamContainer")) {
                this.container.id = "wmeSamContainer";
                document.querySelector("#edit-panel wz-tabs").insertAdjacentElement("beforeBegin", this.container);
            }
        }

        reset() {
            this.container.innerHTML = policy.createHTML("");
        }

        addMessage(messageType, maxLock='') {
            this.container.insertAdjacentHTML("beforeEnd", policy.createHTML(`<span class="wmeSamMessage ${messageType}"><i class="w-icon ${Messages.getIcon(messageType)}"></i> ${Messages.getMessage(messageType, maxLock) ?? ''}</span>`));
        }
    }

    const codeNames = {'400': 'Bad Request', '401': 'Unauthorized', '402': 'Payment Required', '403': 'Forbidden', '404': 'Not Found', '405': 'Method Not Allowed', '406': 'Not Acceptable', '407': 'Proxy Authentication Required', '408': 'Request Timeout', '409': 'Conflict', '410': 'Gone', '411': 'Length Required', '412': 'Precondition Required', '413': 'Request Entry Too Large', '414': 'Request-URI Too Long', '415': 'Unsupported Media Type', '416': 'Requested Range Not Satisfiable', '417': 'Expectation Failed', '418': 'I\'m a teapot', '429': 'Too Many Requests', '500': 'Internal Server Error', '501': 'Not Implemented', '502': 'Bad Gateway', '503': 'Service Unavailable', '504': 'Gateway Timeout', '505': 'HTTP Version Not Supported'};
    const policy = trustedTypes.createPolicy('wmeSamPolicy', { createHTML: (input) => input});

    function getUrl() {
        let center = W.map.getCenter();
        let lonlat = new OpenLayers.LonLat(center.lon, center.lat);
        lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
        let zoom = W.map.getZoom();

        let features = W.selectionManager.getSelectedFeatures();
        let featureType = features[0]._wmeObject.getType()
        features = features.map(f => f.id);

        let url = location.href.split("?")[0] + `?env=${W.map.wazeMap.regionCode}&lat=${lonlat.lat}&lon=${lonlat.lon}&zoomLevel=${zoom}`;
        if (features.length > 0) url += `&${featureType}s=${features.join(",")}`;
        return url;
    }

    function getCity() {
        var city = document.querySelector(".location-info").innerText.split(",")[0];
        if (document.querySelector(".wmecitiesoverlay-region") !== null) city = document.querySelector(".wmecitiesoverlay-region").innerText;
        return city;
    }

    function addLockRequestCopier(maxLock, routingType=false) {
        let chip = document.querySelector(".wmeSamMessage.locked") ?? document.querySelector(".wmeSamMessage.routing");
        chip.addEventListener("click", () => {
            navigator.clipboard.writeText(`:unlock${maxLock}: ${routingType ? ':arrow_down_small:' : ''} ${getCity()} - *reason* - <${getUrl()}>`);
            chip.innerHTML = policy.createHTML(`<span class="wmeSamMessage locked"><i class="w-icon w-icon-copy"></i> Copied!</span>`);
        });
    }

    function isOOEA(id) {
        if ((typeof id === "string" && id.includes("OpenLayers")) || W.snapshotManager.isSnapshotOn()) return false; // not OOEA

        const type = typeof id === "string" && id.includes(".") ? "venues" : "segments";
        const model = W.model[type].objects[id];

        const userRank = W.loginManager.getUserRank();
        const lockRank = model?.getLockRank();
        const propertiesEditable = model.arePropertiesEditable();

        if (propertiesEditable) return false; // not OOEA
        if (lockRank > userRank) return type === "venues"; // locked up
        if (userRank >= lockRank) return !propertiesEditable; // unlocked but not editable
        return false;
    }


    window.isOOEA = isOOEA;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getPanel() {
        for (let i = 0; i < 100; i++) {
            const panel = document.querySelector("#edit-panel");
            const tabs = document.querySelector("#edit-panel wz-tabs");
            if (panel && tabs) return panel;
            await sleep(100);
        }
    }

    async function addAdvancedErrorDetails(response) {
        const parsedJSON = await response.json();
        const div = document.createElement("div");

        function createA(lat, lng) {
            const a = document.createElement("a");
            a.innerText = `${lat}, ${lng}`;
            a.href = `https://www.waze.com/editor?lat=${lat}&lon=${lng}&zoom=20`;
            a.onclick = (ev) => {
                ev.preventDefault();
                const center = OpenLayers.Layer.SphericalMercator.forwardMercator(lng, lat);
                W.map.setCenter(center);
                document.querySelector(".error-list .close-button").click();
            };
            return a;
        }

        const errorDetailsHTML = policy.createHTML(`
        <div class="wmeSamAdvancedErrorDetails">
            <wz-caption>Server Response</wz-caption>
            <p>Error ${response.status}: ${codeNames[response.status]}</p>
            <wz-caption>Internal Messages [${parsedJSON.errorList.length}]</wz-caption>
        </div>`);

        div.innerHTML = errorDetailsHTML;
        document.querySelector(".error-list .body").appendChild(div);

        const errorListContainer = div.children[0];

        parsedJSON.errorList.forEach(e => {
            errorListContainer.innerHTML += policy.createHTML(`<p>Error ${e.code}: ${e.details}</p>`);
            errorListContainer.appendChild(createA(e.geometry.coordinates[1], e.geometry.coordinates[0]));
        });
    }

    async function processSelectionChange() {
        let selected = W.selectionManager.getSelectedFeatures();
        let userRank = W.loginManager.user.getRank();
        let maxLockRank = Math.max(...selected.map(item => item._wmeObject.attributes.lockRank));
        let maxRoutingType = Math.max(...selected.map(s => s._wmeObject.getAttribute("routingRoadType")));

        if (selected.length === 0) return;

        // wait for panel to open
        let panel = await getPanel();
        if (!panel) {
            console.error("WME SAM: Could not open panel");
            return;
        }

        // add or clear message container
        let messageContainer = new MessageContainer();
        messageContainer.reset();

        const wzAlerts = Array.from(document.querySelector('wz-alerts-group')?.children || []);
        wzAlerts.forEach(wzAlert => {
            let messageType;

            if (userRank < maxLockRank) messageType = Messages.LOCKED;
            if (wzAlert?.innerHTML?.includes('driven area') || (maxLockRank <= userRank && wzAlert?.innerHTML?.includes('editing area'))) messageType = Messages.EA;
            if (wzAlert?.classList?.contains('inconsistent-direction-alert')) messageType = Messages.MIXED;
            if (wzAlert?.innerHTML?.includes('pending')) messageType = Messages.PUR;
            if (wzAlert?.innerHTML?.includes('active road closures')) messageType = Messages.CLOSURE;
            if (wzAlert?.innerHTML?.includes('junction box')) messageType = Messages.JUNCTION_BOX;
            if (wzAlert?.innerHTML?.includes('reviewed')) messageType = Messages.HIDE_MESSAGE;

            if (!!messageType) {
                if (messageType !== Messages.HIDE_MESSAGE) messageContainer.addMessage(messageType, maxLockRank + 1);
                if (!DEBUG) wzAlert?.classList?.add("hide");
                if (DEBUG) console.log("WME SAM: " + messageType);
            }
            if (messageType === Messages.LOCKED) addLockRequestCopier(maxLockRank + 1, !!maxRoutingType);
            if (messageType === Messages.PUR) document.querySelector(".wmeSamMessage.pur").addEventListener("click", () => { document.querySelector(".venue-alerts wz-alert span[slot=action]").click(); });
        });

        if (W.snapshotManager.isSnapshotOn()) messageContainer.addMessage(Messages.SNAPSHOT_ACTIVE);
        if (!document.querySelector(".wmeSamMessage.ea") && [...selected].some(obj => isOOEA(obj.id))) messageContainer.addMessage(Messages.EA);
        if (!!maxRoutingType) {
            messageContainer.addMessage(Messages.ROUTING_PREFERENCE);
            addLockRequestCopier(maxLockRank + 1, !!maxRoutingType);
        }

        // hide message box if no unhandled alerts
        const wzAlertsGroup = document.querySelector("wz-alerts-group");
        const visibleAlerts = Array.from(wzAlertsGroup?.children || []).filter(_ => _?.classList.contains('hide') === false);
        if (visibleAlerts.length === 0) {
            wzAlertsGroup.classList.add('hide');
        }
    }

    function initialize() {
        console.log("WME SAM: Loaded");
        W.selectionManager.events.register('selectionchanged', this, processSelectionChange);

        // run preselected features from url
        if (W.selectionManager.getSelectedFeatures().length > 0) processSelectionChange();

        // add styling
        let style = document.createElement("style");
        style.innerHTML = policy.createHTML(`/* WME Simple Alert Messages Styling */
            #wmeSamContainer {padding-top: 10px;}
            .wmeSamMessage {padding: 7px 10px; border-radius: 10px; width: fit-content; margin-left: 5px; white-space: nowrap;}
            .wmeSamMessage .w-icon {font-size: 20px;vertical-align: middle;}
            .wmeSamMessage.locked {background-color: #FE5F5D; cursor: pointer;}
            .wmeSamMessage.ea, .wmeSamMessage.junction_box {background-color: #FF9800;}
            .wmeSamMessage.mixed, .wmeSamMessage.snapshot {background-color: #42A5F5;}
            .wmeSamMessage.pur {background-color: #C9B5FF; cursor: pointer;}
            .wmeSamMessage.closure {background-color: #FE5F5D; cursor: pointer;}
            .wmeSamMessage.routing {background-color: #FF9800; cursor: pointer;}
            .wmeSamAdvancedErrorDetails { width: 343px; margin: auto; padding: 10px 0; }`);
        document.body.appendChild(style);
    }

    // bootstrap
    W?.userscripts?.state?.isReady ? initialize() : document.addEventListener("wme-ready", initialize, { once: true });


    // override fetch api to intercept errors
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);
        if (!response.ok) {
            window.errorObject = response;
            addAdvancedErrorDetails(response.clone());
        }
        return response;
    };
})();
