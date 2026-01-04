// ==UserScript==
// @name         WME Comment Icons
// @namespace    https://greasyfork.org/en/users/1440408-minhtanz1
// @version      2.1.0
// @description  Displays custom icons on the map based on the text of Map Comments in Vietnam.
// @author       Waze VN
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @license MIT
// @grant        none
// @require      https://greasyfork.org/scripts/489325-wme-sdk/code/WME%20SDK.js?version=1327429
// @downloadURL https://update.greasyfork.org/scripts/541106/WME%20Comment%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/541106/WME%20Comment%20Icons.meta.js
// ==/UserScript==
/* global getWmeSdk, W, OpenLayers */
class WmeCommentIcons {
    constructor() {
        this.version = '2.1.0';
        this.scriptName = 'WME Comment Icons';
        this.debugMode = false; // Đặt là true để xem log trong console
        this.layerName = 'wme-comment-icons-layer';
        this.layer = null;
        this.commentLayerCheckbox = null;
        this.arrayRegex = this.buildCombinedRegex()
        this.wmeSdk = null;
        // Debounce hàm cập nhật để tránh gọi quá nhiều lần khi di chuyển/thu phóng bản đồ
        this.debouncedUpdate = this.debounce(this.updateDisplay.bind(this), 1000);
        this.wmeSdk = getWmeSdk({
            scriptId: 'wme-comment-icons',
            scriptName: this.scriptName
        });
        this.wmeSdk.Events.once({
            eventName: 'wme-ready'
        }).then(this.initializePlugin.bind(this));
    }
    async initializePlugin() {
        this.log('WME is ready. Initializing script...');
        this.layer = new OpenLayers.Layer.Vector(this.layerName, {
            displayInLayerSwitcher: false, // Hide from default WME layer switcher
            rendererOptions: { zIndexing: true }
        });
        W.map.addLayer(this.layer);


        if (this.layer.div) {
            this.layer.div.style.pointerEvents = 'none';
        }
        this.addLayerCheckbox();
        this.listen();
        this.updateDisplay();
    }
    listen() {
        // Listen for map movement and zoom changes (debounced)
        this.wmeSdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: this.debouncedUpdate });
        this.wmeSdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: this.debouncedUpdate });
        // Track changes to map comments data model
        this.wmeSdk.Events.trackDataModelEvents({ dataModelName: 'mapComments' });
        this.wmeSdk.Events.on({
            eventName: 'wme-data-model-objects-changed',
            eventHandler: (e) => {
                if (e.detail?.dataModelName === 'mapComments') {
                    if (Object.keys(e.detail?.added || {}).length > 0 || Object.keys(e.detail?.removed || {}).length > 0 || Object.keys(e.detail?.updated || {}).length > 0) {
                        this.debouncedUpdate();
                    }
                }
            }
        });
        const mapCommentsCheckbox = document.getElementById('layer-switcher-item_map_comments');
        if (mapCommentsCheckbox) {
            mapCommentsCheckbox.addEventListener('change', this.debouncedUpdate);
        } else {
            this.log("Could not find WME map comments layer checkbox for additional listener.");
        }
    }
    async updateDisplay() {
        this.layer.setZIndex(this.findTopLayer()+50);
        this.layer.removeAllFeatures();
        if (!this.commentLayerCheckbox || !this.commentLayerCheckbox.checked) {
            this.log('Custom layer is disabled, clearing icons.');
            return;
        }
        try {
            const mapComments = await this.wmeSdk.DataModel.MapComments.getAll(); // getAll is sync for loaded objects
            if (!mapComments || mapComments.length === 0) {
                this.log('No map comments found in data model for current view.');
                return;
            }
            const featuresToAdd = [];
            for (const comment of mapComments) {
                const iconSvg = this.getCommentIcon(comment.subject);
                const [lon, lat] = comment.geometry.coordinates;
                const pointGeometry = new OpenLayers.Geometry.Point(lon, lat)
                .transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject());
                const feature = new OpenLayers.Feature.Vector(pointGeometry);
                const base64Svg = this.utf8ToBase64(iconSvg);
                const xOffset = Math.floor(Math.random() * 41) - 20;
                const yOffset = Math.floor(Math.random() * 41) - 20;
                feature.style = {
                    graphic: true,
                    externalGraphic: 'data:image/svg+xml;base64,' + base64Svg,
                    graphicHeight: 30, // Adjust size as needed
                    graphicWidth: 30, // Adjust size as needed
                    graphicXOffset: xOffset, // Adjust based on SVG origin
                    graphicYOffset: yOffset, // Adjust based on SVG height/origin
                    graphicOpacity: 0.9,
                    label: comment.modificationData.createdBy,
                    labelAlign:'cm',
                    labelXOffset:yOffset,
                    labelYOffset:xOffset,
                    fontColor: '#ffffff',
                    fontSize: '12px',
                    fontOpacity: 0.8
                };
                featuresToAdd.push(feature);
            }
            if (featuresToAdd.length > 0) {
                this.layer.addFeatures(featuresToAdd);
            } //else {
            //this.log('No features to add after processing comments.');
            //}
        } catch (error) {
            console.error(`[${this.scriptName}] Error updating display:`, error);
        }
    }
    findTopLayer() {
        // Access the .layers array directly, which is standard in older OpenLayers versions.
        const layers = W.map.layers;
        let maxZ = -Infinity;
        let topLayer = null;

        // Loop through each layer to find the maximum z-index
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            // It's good practice to check if the layer and its method exist
            if (layer && typeof layer.getZIndex === 'function') {
                const zIndex = layer.getZIndex();
                if (zIndex !== null && zIndex > maxZ) {
                    maxZ = zIndex;
                    topLayer = layer;
                }
            }
        }

        // If no layers with a z-index were found, default to a base value like 0.
        if (maxZ === -Infinity) {
            console.log('No layers with a z-index were found. Defaulting to 0.');
            maxZ = 0;
        }

        // Set the instance's ZIndex property
        this.ZIndex = maxZ;

        // Return the highest z-index
        return maxZ;
    }
    utf8ToBase64(str) {
        // Use TextEncoder to get UTF-8 bytes
        const utf8Bytes = new TextEncoder().encode(str);
        const binaryString = String.fromCharCode.apply(null, utf8Bytes);
        return btoa(binaryString);
    }
    buildCombinedRegex() {
        const allRegexParts = [];
        this.ruleMap = new Map();
        this.commentRules = [
            {
                name: 'VAO_KDC',
                regex: /^(?!.*\b(ngo.i|ra|h.t|h.*c)\b).*?(.*kdc|.*kdc|.*khu d.n c.|.*d.n c.|.*b.t ..u k|dc|n.i th.*|th.nh th.)/is,
                icon: () => this.residentialZoneIcon(false)
            },
            {
                name: 'HET_KDC',
                regex: /^(?!.*\b(v.o|b.t ..u|v.)\b).*?(ngo.i.*|ra\S.*k.*|ra n.*|h.t.*cư|h.*dc|h.t.*kdc|th.nh th.|h.t th.*)/is,
                icon: () => this.residentialZoneIcon(true)
            },
            {
                name: 'CAM_RE_TRAI',
                regex: /^(?!.*\b(v..t)\b)(bi.n|c.m|k.*g|cr).*?(tr.i|t)$/is,
                icon: () => this.prohibitTurnIcon('left')
            },
            {
                name: 'CAM_RE_PHAI',
                regex: /^(bi.n|c.m|k.*g|cr).*?(ph.i|p)$/is,
                icon: () => this.prohibitTurnIcon('right')
            },
            {
                name: 'CAM_QUAY_DAU',
                regex: /^(bi.n|c.m|k.*g).*?(quay ..u)$/is,
                icon: () => this.prohibitTurnIcon('u-turn')
            },
            {
                name: 'CAM_VUOT',
                regex: /^(bi.n|c.m|k.*g).*?(v..t)$/is,
                icon: () => this.prohibitIcon('cam_vuot')
            },
            {
                name: 'HET_CAM_VUOT',
                regex: /^(h.t|bi.n).*?(v..t)$/is,
                icon: () => this.prohibitIcon('het_cam_vuot')
            },
            {
                name: 'CAMERA_TOC_DO',
                regex: /^(cam.* t.c ..|speed.*|cam.*speed)$/is,
                icon: () => this.cameraIcon('speed')
            },
            {
                name: 'CAMERA_DEN_DO',
                regex: /^(cam.* ph.t ngu.i|cam.* ..n ..|..n ..|traffic light)$/is,
                icon: () => this.cameraIcon('red-light')
            },
            {
                name: 'HET_CAM_TOC_DO',
                regex: /^(?:h.t|h.t bi.n)\s+.*?(\d+)/is,
                icon: (match) => this.speedIcon(match[1], true)
            },
            {
                name: 'GH_TOC_DO',
                regex: /^(?!.*\b(h.t|n.a)\b).*?(\d{2,3})/is,
                icon: (match) => this.speedIcon(match[2], false)
            },
            {
                name: 'HET_MOI_LENH_CAM',
                regex: /^(h.t|bi.n).*?(bi.n|c.m|l.c|t.m th.i|l..h|h.n)$/is,
                icon: () => this.createEndOfProhibitionsIcon()
            }
        ]

        for (const rule of this.commentRules) {
            if (!/^[a-zA-Z0-9_]+$/.test(rule.name)) {
                console.error(`[${this.scriptName}] Rule name "${rule.name}" is invalid. It must be a valid JavaScript identifier.`);
                continue;
            }
            this.ruleMap.set(rule.name, rule);
            const regexPattern = rule.regex.source;
            allRegexParts.push(`(?<${rule.name}>${regexPattern})`);
        }
        const combinedPattern = `^(${allRegexParts.join('|')})`;
        this.combinedRegex = new RegExp(combinedPattern, 'is');
        return this.combinedRegex
    }
    getCommentIcon(subject) {
        if (!subject || typeof subject !== 'string') return null;
        const text = subject.trim();
        const match = this.arrayRegex.exec(text);
        if (match === null) {
            return null;
        }
        const matchedGroupName = Object.keys(match.groups).find(groupName => match.groups[groupName] !== undefined);
        if (matchedGroupName) {
            const rule = this.ruleMap.get(matchedGroupName);
            if (rule) {
                return rule.icon(match.groups[matchedGroupName].match(rule.regex));
            }
        }
        return null;
    }
    residentialZoneIcon(isEnd = true) {
        return isEnd ? `<svg width="239.99998" height="200" viewBox="0 0 63.499994 52.916666" version="1.1" id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs1"><clipPath clipPathUnits="userSpaceOnUse" id="clipPath56"><path fill="none" stroke="#0046aa" stroke-width="1.32246" d="M 0.05437925,55.564166 H 158.74999 V 187.81051 H 0.05437925 Z" id="path56" /></clipPath></defs><g id="layer10" transform="translate(-0.05438337,-52.916664)"><path fill="#0046aa" d="M 0.05438337,52.916664 H 63.554376 V 105.83333 H 0.05438337 Z" id="path1" style="stroke-width:0.0529165" /><path d="m 2.7002164,92.604164 v -8.678336 l 5.185833,-5.503333 5.1858326,5.503333 v 3.915833 h 1.534584 V 78.05208 l 1.058333,-1.640418 v -9.524999 l 2.910416,-6.0325 2.910417,6.0325 v 9.524999 l 1.058333,1.640418 v 3.915833 l 3.439583,-1.852086 6.50875,4.074587 v 5.926666 h 1.693333 V 75.459164 h 0.846666 v -6.032501 h 0.582084 v -5.926666 h 5.926663 v 7.831665 h 0.899584 V 81.54458 h 2.328334 v 6.032498 h 0.952498 v -9.895417 l 4.074584,-3.598333 4.497916,4.021666 v 4.92125 l 3.651251,-3.016249 3.175,3.4925 v 9.101669 z" fill="#ffffff" id="path2" style="stroke-width:0.0529165" /><path stroke="#f00a0a" stroke-width="7.93478" d="M 0.05437925,187.81051 158.74999,55.564165" id="path3" clip-path="url(#clipPath56)" transform="matrix(0.40013706,0,0,0.40013706,0.03262422,30.683383)" /><path fill="none" stroke="#ffffff" stroke-width="0.529165" d="M 0.58354859,53.44583 H 63.025211 v 51.85833 H 0.58354859 Z" id="path4" /></g></svg>` : `<svg width="239.99997" height="200" viewBox="0 0 63.49999 52.916666" version="1.1" id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs1" /><g id="layer11" transform="translate(-105.83333,-52.916664)"><path fill="#0046aa" d="m 105.83333,52.916664 h 63.49999 v 52.916666 h -63.49999 z" id="path1-3" style="stroke-width:0.0529164" /><path fill="none" stroke="#ffffff" stroke-width="0.529164" d="m 106.36249,53.44583 h 62.44166 v 51.85833 h -62.44166 z" id="path2-5" /><path d="m 108.47916,92.604158 v -8.678331 l 5.18584,-5.503334 5.18583,5.503334 v 3.915833 h 1.53458 v -9.789583 l 1.05833,-1.640417 v -9.524998 l 2.91042,-6.032499 2.91042,6.032499 v 9.524998 l 1.05832,1.640417 v 3.915833 l 3.43959,-1.852083 6.50876,4.074582 v 5.926665 h 1.69333 V 75.45916 h 0.84666 v -6.032498 h 0.58208 v -5.926667 h 5.92667 v 7.831665 h 0.89959 v 10.212917 h 2.32832 v 6.032497 h 0.95251 V 77.68166 l 4.07458,-3.598332 4.49792,4.021665 v 4.92125 l 3.65124,-3.01625 3.17501,3.4925 v 9.101665 z" fill="#ffffff" id="path3-7" style="stroke-width:0.0529164" /></g></svg>`;
    }
    prohibitIcon(type) {
        switch (type) {
            case 'cam_vuot':
                return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve"><g transform="translate(-.075 30.541)scale(.0756)"><circle style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:79.8054;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M196.278-131.7c-5.124.02-14.1 3.883-15.667 12.21l-9.555 57.61c-5.418-.007-12.536 6.857-12.556 10.655v32.19c1.498 3.904 4.336 6.923 7.333 9.435v26.085c0 3.997 5.972 7.215 13.39 7.215 7.417 0 13.388-3.218 13.388-7.215V-9.6c18.2 2.153 36.062 3.67 53.389 3.663 17.327.007 35.188-1.51 53.389-3.663v26.085c0 3.997 5.971 7.215 13.389 7.215s13.389-3.218 13.389-7.215V-9.6c2.997-2.512 5.835-5.53 7.333-9.435v-32.19c-.02-3.798-7.137-10.662-12.555-10.656l-9.556-57.61c-1.567-8.326-10.543-12.188-15.667-12.209zm11.13 10.49h77.183c8.756.005 18.106 5.066 19.456 11.654l5.767 34.41c.132.854-.427 2.62-1.056 3.608-1.279 1.697-3.504 2.667-6.778 2.664-1.255 0-7.888-.5-7.888-.5-23.766-1.36-31.143-1.304-48.092-1.554-16.95.25-24.326.195-48.091 1.554 0 0-6.634.5-7.89.5-3.273.003-5.498-.967-6.777-2.664-.63-.988-1.188-2.754-1.056-3.608l5.767-34.41c1.35-6.588 10.7-11.649 19.456-11.655M231.056-55h29.89l30 2.665-.011 5.772h-89.878v-5.772zm-50.333 1.11a12.222 12.21 0 0 1 12.222 12.211 12.222 12.21 0 0 1-12.222 12.21A12.222 12.21 0 0 1 168.5-41.68a12.222 12.21 0 0 1 12.222-12.21m130.556 0A12.222 12.21 0 0 1 323.5-41.678a12.222 12.21 0 0 1-12.222 12.21 12.222 12.21 0 0 1-12.222-12.21 12.222 12.21 0 0 1 12.222-12.21M201.067-40.68h89.877v8.436h-89.888zm-.011 14.319h89.878l.01 5.772-30 2.664h-29.889l-30-2.664z"/><path d="M406.278-131.7c-5.124.02-14.1 3.883-15.667 12.21l-9.555 57.61c-5.418-.007-12.536 6.857-12.556 10.655v32.19c1.499 3.904 4.336 6.923 7.333 9.435v26.085c0 3.997 5.972 7.215 13.39 7.215 7.417 0 13.388-3.218 13.388-7.215V-9.6c18.2 2.153 36.062 3.67 53.389 3.663 17.327.007 35.188-1.51 53.389-3.663v26.085c0 3.997 5.971 7.215 13.389 7.215s13.389-3.218 13.389-7.215V-9.6c2.997-2.512 5.834-5.53 7.333-9.435v-32.19c-.02-3.798-7.137-10.662-12.555-10.656l-9.556-57.61c-1.567-8.326-10.543-12.188-15.667-12.209zm11.13 10.49h77.183c8.756.005 18.106 5.066 19.456 11.654l5.767 34.41c.132.854-.427 2.62-1.056 3.608-1.279 1.697-3.504 2.667-6.778 2.664-1.255 0-7.888-.5-7.888-.5-23.766-1.36-31.143-1.304-48.092-1.554-16.95.25-24.326.195-48.091 1.554 0 0-6.634.5-7.89.5-3.273.003-5.498-.967-6.777-2.664-.63-.988-1.188-2.754-1.056-3.608l5.767-34.41c1.35-6.588 10.7-11.649 19.456-11.655M441.056-55h29.89l30 2.665-.011 5.772h-89.878v-5.772zm-50.333 1.11a12.222 12.21 0 0 1 12.222 12.211 12.222 12.21 0 0 1-12.222 12.21A12.222 12.21 0 0 1 378.5-41.68a12.222 12.21 0 0 1 12.222-12.21m130.556 0A12.222 12.21 0 0 1 533.5-41.678a12.222 12.21 0 0 1-12.222 12.21 12.222 12.21 0 0 1-12.222-12.21 12.222 12.21 0 0 1 12.222-12.21M411.067-40.68h89.877v8.436h-89.888zm-.011 14.319h89.878l.01 5.772-30 2.664h-29.889l-30-2.664z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:79.8054;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
            case 'het_cam_vuot':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.6;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1;paint-order:normal" d="M211-134c-16.907.043-50.824 5.95-67.8 18.6-9.108 26.06-12.503 37.146-30.2 56.8l8.8 35.6c.78 5.855 1.17 8.508 6.2 11.5l1.049 16.677c.398 6.149 5.768 10.836 11.55 10.823 2.602-.044 9.383-2.775 9.6-11.6v-17.6H271.8V4.4c.218 8.825 7 11.556 9.6 11.6 5.783.013 11.153-4.674 11.551-10.823L294-11.5c5.03-2.992 5.42-5.645 6.2-11.5l8.8-35.6c-17.698-19.654-21.091-30.74-30.2-56.8-16.975-12.65-50.892-18.557-67.8-18.6m0 9.8c26.205.505 34.794 3.317 60.8 15 6.006 24.85 16.954 41.515 27.4 53.2l-8 33c-1.502 3.596-4.38 5.879-6.2 7l-1.6 20.4c-.197 1.103-.464 2.773-1.6 2.6-.887.067-1.266-1.457-1.2-2.6V-23H141.4V4.4c.066 1.143-.313 2.667-1.2 2.6-1.136.173-1.403-1.497-1.6-2.6L137-16c-1.82-1.121-4.698-3.404-6.2-7l-8-33c10.446-11.685 21.394-28.35 27.4-53.2 26.006-11.683 34.596-14.495 60.8-15m280-9.8c-16.907.043-50.824 5.95-67.8 18.6-9.108 26.06-12.503 37.146-30.2 56.8l8.8 35.6c.78 5.855 1.17 8.508 6.2 11.5l1.049 16.677c.398 6.149 5.768 10.836 11.55 10.823 2.602-.044 9.383-2.775 9.6-11.6v-17.6H551.8V4.4c.218 8.825 7 11.556 9.6 11.6 5.783.013 11.153-4.674 11.551-10.823L574-11.5c5.03-2.992 5.42-5.645 6.2-11.5l8.8-35.6c-17.698-19.654-21.091-30.74-30.2-56.8-16.975-12.65-50.892-18.557-67.8-18.6m0 9.8c26.205.505 34.794 3.317 60.8 15 6.006 24.85 16.954 41.515 27.4 53.2l-8 33c-1.502 3.596-4.38 5.879-6.2 7l-1.6 20.4c-.197 1.103-.464 2.773-1.6 2.6-.887.067-1.266-1.457-1.2-2.6V-23H421.4V4.4c.066 1.143-.313 2.667-1.2 2.6-1.136.173-1.403-1.497-1.6-2.6L417-16c-1.82-1.121-4.698-3.404-6.2-7l-8-33c10.446-11.685 21.394-28.35 27.4-53.2 26.006-11.683 34.596-14.495 60.8-15"/><path transform="rotate(45)" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/><path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
            default:
                return null;
        }
    }
    speedIcon(speed, isProhibit = false) {
        const speedNum = parseInt(speed, 10);
        if (!isNaN(speedNum) && speedNum > 10 && speedNum < 150 && (speedNum % 10 === 0 || speedNum % 5 ===0)) {
            return isProhibit ? `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"> <g transform="translate(-.076 30.541)scale(.0756)" style="display:inline"> <circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/> <text x="351" y="-80" font-size="450" font-family="Arial" font-weight="bold" fill="none" stroke="#000000" stroke-width="10" text-anchor="middle" dominant-baseline="central">${speed}</text> <path transform="rotate(45)" style="opacity:0.3;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/> <path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/> </g> </svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="21" fill="#FFFFFF" stroke="#C20B10" stroke-width="5"/>
                        <text x="25" y="35" font-size="25" font-family="Arial" font-weight="bold" fill="#1F2125" text-anchor="middle">${speed}</text>
                    </svg>`;
        }
    }
    prohibitTurnIcon(direction) {
        switch (direction) {
            case 'left':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.583 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><g transform="translate(265.834 83.253)scale(.07182)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path d="M491 156v-280c0-38.78-31.22-70-70-70H246v-35l-105 70 105 70v-35h175v280z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:4.2306;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45)" d="M261.378-129.989h50v680h-50z"/></g></g></svg>`;
            case 'right':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-317.5 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="343.958" cy="79.375" r="26.458"/><g transform="matrix(-.07182 0 0 .07182 369.166 83.253)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path d="M491 156v-280c0-38.78-31.22-70-70-70H246v-35l-105 70 105 70v-35h175v280z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:4.2306;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45)" d="M261.378-129.989h50v680h-50z"/></g></g></svg>`;
            case 'u-turn':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-370.417 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="396.875" cy="79.375" r="26.458"/><g transform="translate(371.668 83.253)scale(.07182)"><circle style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.28921;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M246 16v-175c0-38.78 31.22-70 70-70h70c38.78 0 70 31.22 70 70v315h-70v-315h-70V16h35l-70 105-70-105Z"/><path transform="rotate(-45)" style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.99h50v680h-50z"/></g></g></svg>`;
            default:
                return null;
        }
    }
    cameraIcon(type) {
        switch (type) {
            case 'speed':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-476.25)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="26.458"/><circle style="fill:#c20b10;fill-opacity:1;stroke-width:4.48117;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="24.701"/><circle style="fill:#fff;fill-opacity:1;stroke-width:3.174;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="17.496"/><g transform="matrix(.38687 0 0 .33923 255.134 -1.055)"><path d="M617.505 48.837h38.475a4 4 45 0 1 4 4v24.06a4 4 135 0 1-4 4h-38.475a4 4 45 0 1-4-4v-24.06a4 4 135 0 1 4-4z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8fa1ad;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M621.583 84.377h30.32v6.337h-30.321v-6.336z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#738b9e;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M627.367 94.392h18.763v5.979h-18.763z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7996b5;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M638.524 110.976h27.88v5.272h-27.88z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7ea1ba;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M632.199 103.618h9.275v12.57H632.2v-12.57z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8ba2b6;fill-opacity:1;stroke:#000;stroke-width:6.20394;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><circle style="font-variation-settings:&quot;wght&quot;900;fill:#b6d5f4;fill-opacity:1;stroke:#000;stroke-width:7.53681;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="636.793" cy="64.936" r="7.183"/></g></g></svg>`;
            case 'red-light':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-476.25 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="26.458"/><circle style="fill:#c20b10;fill-opacity:1;stroke-width:4.48117;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="24.701"/><circle style="fill:#fff;fill-opacity:1;stroke-width:3.174;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="17.496"/><g transform="translate(-19.723 59.891)scale(.85573)"><path style="font-variation-settings:&quot;wght&quot;900;fill:#5e6261;fill-opacity:1;stroke:#000;stroke-width:2.16141;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M597.163 10.043h9.134a2 2 45 0 1 2 2v16.073a2 2 135 0 1-2 2h-9.134a2 2 45 0 1-2-2V12.043a2 2 135 0 1 2-2z" transform="matrix(1.0615 0 0 .9969 -36.887 .683)"/><ellipse style="font-variation-settings:&quot;wght&quot;900;fill:#d86057;fill-opacity:1;stroke:#000;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="601.854" cy="15.934" rx="3.586" ry="3.712"/><ellipse style="font-variation-settings:&quot;wght&quot;900;fill:#a0e885;fill-opacity:1;stroke:#000;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="601.854" cy="25.936" rx="3.586" ry="3.712"/><path d="M601.856 12.091a3.586 3.712 0 0 0-.56.046 3.586 3.712 0 0 0-.548.136 3.586 3.712 0 0 0-.52.223 3.586 3.712 0 0 0-.48.304 3.586 3.712 0 0 0-.428.378 3.586 3.712 0 0 0-.365.443 3.586 3.712 0 0 0-.294.496 3.586 3.712 0 0 0-.216.538 3.586 3.712 0 0 0-.002.008 4.583 4.743 0 0 1 .411-.426 4.583 4.743 0 0 1 .524-.405 4.583 4.743 0 0 1 .574-.324 4.583 4.743 0 0 1 .613-.237 4.583 4.743 0 0 1 .639-.144 4.583 4.743 0 0 1 .652-.048 4.583 4.743 0 0 1 .232.006 4.583 4.743 0 0 1 .232.018 4.583 4.743 0 0 1 .23.03 4.583 4.743 0 0 1 .229.043 4.583 4.743 0 0 1 .225.054 4.583 4.743 0 0 1 .224.066 4.583 4.743 0 0 1 .22.078 4.583 4.743 0 0 1 .215.09 4.583 4.743 0 0 1 .211.1 4.583 4.743 0 0 1 .206.11 4.583 4.743 0 0 1 .2.123 4.583 4.743 0 0 1 .194.132 4.583 4.743 0 0 1 .187.142 4.583 4.743 0 0 1 .18.152 4.583 4.743 0 0 1 .173.161 4.583 4.743 0 0 1 .164.17 4.583 4.743 0 0 1 .086.1 3.586 3.712 0 0 0-.023-.077 3.586 3.712 0 0 0-.072-.195 3.586 3.712 0 0 0-.082-.19 3.586 3.712 0 0 0-.092-.185 3.586 3.712 0 0 0-.102-.179 3.586 3.712 0 0 0-.112-.173 3.586 3.712 0 0 0-.121-.166 3.586 3.712 0 0 0-.13-.16 3.586 3.712 0 0 0-.138-.151 3.586 3.712 0 0 0-.146-.143 3.586 3.712 0 0 0-.154-.134 3.586 3.712 0 0 0-.161-.126 3.586 3.712 0 0 0-.167-.115 3.586 3.712 0 0 0-.174-.106 3.586 3.712 0 0 0-.178-.095 3.586 3.712 0 0 0-.184-.086 3.586 3.712 0 0 0-.187-.073 3.586 3.712 0 0 0-.192-.064 3.586 3.712 0 0 0-.195-.052 3.586 3.712 0 0 0-.197-.04 3.586 3.712 0 0 0-.2-.03 3.586 3.712 0 0 0-.2-.017 3.586 3.712 0 0 0-.201-.006" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 11.88a4.427 6.689 0 0 0-.692.082 4.427 6.689 0 0 0-.676.245 4.427 6.689 0 0 0-.641.402 4.427 6.689 0 0 0-.593.548 4.427 6.689 0 0 0-.528.681 4.427 6.689 0 0 0-.451.798 4.427 6.689 0 0 0-.363.895 4.427 6.689 0 0 0-.266.97 4.427 6.689 0 0 0-.002.014 5.658 8.548 0 0 1 .507-.767 5.658 8.548 0 0 1 .646-.731 5.658 8.548 0 0 1 .709-.584 5.658 8.548 0 0 1 .757-.427 5.658 8.548 0 0 1 .788-.259 5.658 8.548 0 0 1 .805-.087 5.658 8.548 0 0 1 .287.01 5.658 8.548 0 0 1 .286.033 5.658 8.548 0 0 1 .284.055 5.658 8.548 0 0 1 .282.077 5.658 8.548 0 0 1 .28.098 5.658 8.548 0 0 1 .275.119 5.658 8.548 0 0 1 .272.14 5.658 8.548 0 0 1 .266.16 5.658 8.548 0 0 1 .26.181 5.658 8.548 0 0 1 .254.2 5.658 8.548 0 0 1 .247.22 5.658 8.548 0 0 1 .24.239 5.658 8.548 0 0 1 .23.256 5.658 8.548 0 0 1 .222.274 5.658 8.548 0 0 1 .214.29 5.658 8.548 0 0 1 .202.306 5.658 8.548 0 0 1 .107.18 4.427 6.689 0 0 0-.029-.139 4.427 6.689 0 0 0-.089-.35 4.427 6.689 0 0 0-.101-.342 4.427 6.689 0 0 0-.114-.334 4.427 6.689 0 0 0-.126-.323 4.427 6.689 0 0 0-.138-.312 4.427 6.689 0 0 0-.15-.3 4.427 6.689 0 0 0-.16-.287 4.427 6.689 0 0 0-.17-.273 4.427 6.689 0 0 0-.18-.257 4.427 6.689 0 0 0-.19-.242 4.427 6.689 0 0 0-.2-.226 4.427 6.689 0 0 0-.205-.208 4.427 6.689 0 0 0-.215-.19 4.427 6.689 0 0 0-.22-.173 4.427 6.689 0 0 0-.227-.154 4.427 6.689 0 0 0-.231-.133 4.427 6.689 0 0 0-.237-.114 4.427 6.689 0 0 0-.24-.093 4.427 6.689 0 0 0-.244-.074 4.427 6.689 0 0 0-.246-.052 4.427 6.689 0 0 0-.247-.032 4.427 6.689 0 0 0-.25-.01z" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:2.36782;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 21.908a3.586 3.712 0 0 0-.56.046 3.586 3.712 0 0 0-.548.136 3.586 3.712 0 0 0-.52.223 3.586 3.712 0 0 0-.48.304 3.586 3.712 0 0 0-.428.378 3.586 3.712 0 0 0-.365.443 3.586 3.712 0 0 0-.294.497 3.586 3.712 0 0 0-.216.537 3.586 3.712 0 0 0-.002.008 4.583 4.743 0 0 1 .411-.426 4.583 4.743 0 0 1 .524-.405 4.583 4.743 0 0 1 .574-.324 4.583 4.743 0 0 1 .613-.237 4.583 4.743 0 0 1 .639-.144 4.583 4.743 0 0 1 .652-.048 4.583 4.743 0 0 1 .232.006 4.583 4.743 0 0 1 .232.018 4.583 4.743 0 0 1 .23.03 4.583 4.743 0 0 1 .229.043 4.583 4.743 0 0 1 .225.054 4.583 4.743 0 0 1 .224.066 4.583 4.743 0 0 1 .22.078 4.583 4.743 0 0 1 .215.09 4.583 4.743 0 0 1 .211.1 4.583 4.743 0 0 1 .206.11 4.583 4.743 0 0 1 .2.123 4.583 4.743 0 0 1 .194.132 4.583 4.743 0 0 1 .187.142 4.583 4.743 0 0 1 .18.152 4.583 4.743 0 0 1 .173.161 4.583 4.743 0 0 1 .164.17 4.583 4.743 0 0 1 .086.1 3.586 3.712 0 0 0-.023-.077 3.586 3.712 0 0 0-.072-.195 3.586 3.712 0 0 0-.082-.19 3.586 3.712 0 0 0-.092-.184 3.586 3.712 0 0 0-.102-.18 3.586 3.712 0 0 0-.112-.173 3.586 3.712 0 0 0-.121-.166 3.586 3.712 0 0 0-.13-.16 3.586 3.712 0 0 0-.138-.15 3.586 3.712 0 0 0-.146-.144 3.586 3.712 0 0 0-.154-.134 3.586 3.712 0 0 0-.161-.125 3.586 3.712 0 0 0-.167-.116 3.586 3.712 0 0 0-.174-.106 3.586 3.712 0 0 0-.178-.095 3.586 3.712 0 0 0-.184-.086 3.586 3.712 0 0 0-.187-.073 3.586 3.712 0 0 0-.192-.064 3.586 3.712 0 0 0-.195-.052 3.586 3.712 0 0 0-.197-.04 3.586 3.712 0 0 0-.2-.03 3.586 3.712 0 0 0-.2-.017 3.586 3.712 0 0 0-.201-.006" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 21.697a4.427 6.689 0 0 0-.692.082 4.427 6.689 0 0 0-.676.245 4.427 6.689 0 0 0-.641.402 4.427 6.689 0 0 0-.593.548 4.427 6.689 0 0 0-.528.681 4.427 6.689 0 0 0-.451.798 4.427 6.689 0 0 0-.363.895 4.427 6.689 0 0 0-.266.97 4.427 6.689 0 0 0-.002.014 5.658 8.548 0 0 1 .507-.767 5.658 8.548 0 0 1 .646-.731 5.658 8.548 0 0 1 .709-.584 5.658 8.548 0 0 1 .757-.427 5.658 8.548 0 0 1 .788-.259 5.658 8.548 0 0 1 .805-.087 5.658 8.548 0 0 1 .287.01 5.658 8.548 0 0 1 .286.034 5.658 8.548 0 0 1 .284.054 5.658 8.548 0 0 1 .282.077 5.658 8.548 0 0 1 .28.098 5.658 8.548 0 0 1 .275.119 5.658 8.548 0 0 1 .272.14 5.658 8.548 0 0 1 .266.16 5.658 8.548 0 0 1 .26.181 5.658 8.548 0 0 1 .254.2 5.658 8.548 0 0 1 .247.22 5.658 8.548 0 0 1 .24.239 5.658 8.548 0 0 1 .23.256 5.658 8.548 0 0 1 .222.274 5.658 8.548 0 0 1 .214.29 5.658 8.548 0 0 1 .202.307 5.658 8.548 0 0 1 .107.178 4.427 6.689 0 0 0-.029-.137 4.427 6.689 0 0 0-.089-.352 4.427 6.689 0 0 0-.101-.341 4.427 6.689 0 0 0-.114-.334 4.427 6.689 0 0 0-.126-.323 4.427 6.689 0 0 0-.138-.312 4.427 6.689 0 0 0-.15-.3 4.427 6.689 0 0 0-.16-.287 4.427 6.689 0 0 0-.17-.272 4.427 6.689 0 0 0-.18-.257 4.427 6.689 0 0 0-.19-.243 4.427 6.689 0 0 0-.2-.226 4.427 6.689 0 0 0-.205-.208 4.427 6.689 0 0 0-.215-.19 4.427 6.689 0 0 0-.22-.173 4.427 6.689 0 0 0-.227-.153 4.427 6.689 0 0 0-.231-.134 4.427 6.689 0 0 0-.237-.114 4.427 6.689 0 0 0-.24-.093 4.427 6.689 0 0 0-.244-.074 4.427 6.689 0 0 0-.246-.052 4.427 6.689 0 0 0-.247-.032 4.427 6.689 0 0 0-.25-.01z" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:2.36782;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/></g><g transform="matrix(.32618 0 0 .28601 299.846 54.468)"><path d="M617.505 48.837h38.475a4 4 45 0 1 4 4v24.06a4 4 135 0 1-4 4h-38.475a4 4 45 0 1-4-4v-24.06a4 4 135 0 1 4-4z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8fa1ad;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M621.583 84.377h30.32v6.337h-30.321v-6.336z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#738b9e;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M627.367 94.392h18.763v5.979h-18.763z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7996b5;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M638.524 110.976h27.88v5.272h-27.88z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7ea1ba;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M632.199 103.618h9.275v12.57H632.2v-12.57z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8ba2b6;fill-opacity:1;stroke:#000;stroke-width:6.20394;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><circle style="font-variation-settings:&quot;wght&quot;900;fill:#b6d5f4;fill-opacity:1;stroke:#000;stroke-width:7.53681;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="636.793" cy="64.936" r="7.183"/></g></g></svg>`;
            default:
                return null;
        }
    }
    createEndOfProhibitionsIcon() {
        return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.541)scale(.0756)" style="display:inline"><circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/><path transform="rotate(45)" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/><path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
    }
    // Adds the custom layer checkbox to the WME layer switcher
    addLayerCheckbox() {
        // Use setInterval to wait for the WME layer switcher to be ready
        const checkInterval = setInterval(() => {
            // Find the existing 'Map Comments' checkbox element
            const mapCommentsCheckbox = document.getElementById('layer-switcher-item_map_comments');
            if (mapCommentsCheckbox) {
                clearInterval(checkInterval); // Stop checking once found
                const parentListItem = mapCommentsCheckbox.closest('li');
                // Create the list item element for our custom layer checkbox
                const layerItem = document.createElement('li');
                layerItem.innerHTML = `
                    <div class="layer-selector">
                        <wz-checkbox id="layer-switcher-item_${this.layerName}" checked>
                            <div class="layer-selector-container" title="${this.scriptName}">${this.scriptName}</div>
                        </wz-checkbox>
                    </div>`;
                // Insert our checkbox item right after the 'Map Comments' item
                if (parentListItem) {
                    parentListItem.insertAdjacentElement('afterend', layerItem);
                } else {
                    // Fallback if the structure changes, just add it somewhere in the layer switcher
                    const layerSwitcherList = document.querySelector('.layer-switcher .list');
                    if (layerSwitcherList) {
                        layerSwitcherList.appendChild(layerItem);
                    } else {
                        this.log("Could not find layer switcher list to add checkbox.");
                        return; // Cannot add checkbox, exit function
                    }
                }
                // Get the actual wz-checkbox element
                this.commentLayerCheckbox = document.getElementById(`layer-switcher-item_${this.layerName}`);
                if (this.commentLayerCheckbox) {
                    // Set initial visibility
                    this.layer.setVisibility(this.commentLayerCheckbox.checked);
                    // Add event listener to toggle layer visibility
                    this.commentLayerCheckbox.addEventListener('change', (e) => {
                        this.log(`Layer checkbox toggled: ${e.target.checked}`);
                        this.layer.setVisibility(e.target.checked);
                        if (e.target.checked) {
                            // If turned on, immediately update display in case comments loaded while off
                            this.updateDisplay();
                        }
                    });
                } else {
                    this.log("Could not get the created layer checkbox element.");
                }
            }
        }, 300);
    }
    log(message) {
        if (this.debugMode) {
            console.log(`%c[${this.scriptName} v${this.version}]%c: ${message}`, 'color: #3498db; font-weight: bold;', '');
        }
    }
    // Simple debounce function
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }
}
window.SDK_INITIALIZED.then(() => new WmeCommentIcons());