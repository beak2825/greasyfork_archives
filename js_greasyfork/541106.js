// ==UserScript==
// @name         WME Comment Icons
// @namespace    https://greasyfork.org/en/users/1440408-minhtanz1
// @version      2.1.3
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
        this.version = "2.1.3";
        this.scriptName = "WME Comment Icons";
        this.debugMode = false; // Đặt là true để xem log trong console
        this.layerName = "wme-comment-icons-layer";
        this.layer = null;
        this.storageKey = "wme_comment_icons_settings";
        this.commentLayerCheckbox = null;
        this.RULE_DEFINITIONS = this.defineRules();
        this.RULE_ORDER = Object.keys(this.RULE_DEFINITIONS);
        const rulesDefaults = {};
        this.RULE_ORDER.forEach(key => {
            rulesDefaults[key] = {
                legend: this.RULE_DEFINITIONS[key].legend,
                enable: true,
                regex: this.RULE_DEFINITIONS[key].regex,
            };
        });
        const defaults = {
            iconSize: 30,
            opacity: 0.9,
            opacityText: 0.8,
            textSize: 12,
            opacitySub: 0.9,
            offsetRange: 15,
            isSubsign: true,
            label: true,
            rules: rulesDefaults,
        };
        this.RULE_ORDER.forEach((key) => {
            defaults.rules[key] = {
                legend: this.RULE_DEFINITIONS[key].legend,
                enable: true,
                regex: this.RULE_DEFINITIONS[key].regex,
            };
        });
        const storedOptions = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        if (storedOptions.rules) {
            storedOptions.rules = Object.assign(rulesDefaults, storedOptions.rules);
        } else {
            storedOptions.rules = rulesDefaults;
        }
        this.options = Object.assign(defaults, storedOptions);
        this.arrayRegex = this.buildCombinedRegex();
        this.wmeSdk = null;
        this._elems = {
            br: document.createElement("br"),
            button: document.createElement("button"),
            div: document.createElement("div"),
            hr: document.createElement("hr"),
            i: document.createElement("i"),
            img: document.createElement("img"),
            input: document.createElement("input"),
            fieldset: document.createElement("fieldset"),
            label: document.createElement("label"),
            legend: document.createElement("legend"),
            li: document.createElement("li"),
            ol: document.createElement("ol"),
            option: document.createElement("option"),
            p: document.createElement("p"),
            select: document.createElement("select"),
            span: document.createElement("span"),
            style: document.createElement("style"),
            textarea: document.createElement("textarea"),
            ul: document.createElement("ul"),
        };
        this.debouncedUpdate = this.debounce(this.updateDisplay.bind(this), 1000);
        this.wmeSdk = getWmeSdk({
            scriptId: "wme-comment-icons",
            scriptName: this.scriptName,
        });
        this.wmeSdk.Events.once({
            eventName: "wme-ready",
        }).then(this.initializePlugin.bind(this));
    }
    async initializePlugin() {
        this.log("WME is ready. Initializing script...");
        this.layer = new OpenLayers.Layer.Vector(this.layerName, {
            displayInLayerSwitcher: false,
            rendererOptions: {
                zIndexing: true,
            },
        });
        W.map.addLayer(this.layer);
        if (this.layer.div) {
            this.layer.div.style.pointerEvents = "none";
        }
        this.addLayerCheckbox();
        this.listen();
        this.tabUI();
    }
    listen() {
        this.wmeSdk.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: this.debouncedUpdate,
        });
        this.wmeSdk.Events.on({
            eventName: "wme-map-zoom-changed",
            eventHandler: this.debouncedUpdate,
        });
        this.wmeSdk.Events.trackDataModelEvents({
            dataModelName: "mapComments",
        });
        this.wmeSdk.Events.on({
            eventName: "wme-data-model-objects-changed",
            eventHandler: (e) => {
                if (e.detail?.dataModelName === "mapComments") {
                    if (
                        Object.keys(e.detail?.added || {}).length > 0 ||
                        Object.keys(e.detail?.removed || {}).length > 0 ||
                        Object.keys(e.detail?.updated || {}).length > 0
                    ) {
                        this.debouncedUpdate();
                    }
                }
            },
        });
        const mapCommentsCheckbox = document.getElementById(
            "layer-switcher-item_map_comments",
        );
        if (mapCommentsCheckbox) {
            mapCommentsCheckbox.addEventListener("change", this.debouncedUpdate);
        } else {
            this.log(
                "Could not find WME map comments layer checkbox for additional listener.",
            );
        }
    }
    defineRules() {
        return {
            C_DTRP: {
                legend: "Biển cấm đi thẳng & rẽ phải",
                regex:
                "^(.*c.m|k.*)(?!.*((o|ô)|m.y|quay)).*(?=.*(th.ng|\\b.t\\b))(?=.*(ph.i|rp))",
                icon: () => this.prohibitTurnIcon("sr"),
            },
            C_DTRT: {
                legend: "Biển cấm đi thẳng & rẽ trái",
                regex:
                "^(.*c.m|k.*)(?!.*((o|ô)|m.y|quay)).*(?=.*(th.ng|\\b.t\\b))(?=.*(tr.i|rt))",
                icon: () => this.prohibitTurnIcon("sl"),
            },
            C_RTRP: {
                legend: "Biển cấm rẽ trái & rẽ phải",
                regex:
                "^(?!.*((o|ô)|m.y|quay))(.*c.m|k.*).*(?=.*(ph.i|rp))(?=.*(tr.i|rt))",
                icon: () => this.prohibitTurnIcon("lr"),
            },
            C_OTO_RT_QD: {
                legend: "Biển cấm oto rẽ trái & quay đầu",
                regex: "^(.*c.m|k.*).*t.*(?=.*(r. tr.i|rt))(?=.*(quay ..u|qd))",
                icon: () => this.prohibitTurnIcon("oto-left-uturn"),
            },
            C_OTO_RP_QD: {
                legend: "Biển cấm oto rẽ phải & quay đầu",
                regex: "^(.*c.m|k.*).*t.*(?=.*(r. ph.i|rp))(?=.*(quay ..u|qd))",
                icon: () => this.prohibitTurnIcon("oto-right-uturn"),
            },
            C_RTQD: {
                legend: "Biển cấm rẽ trái & quay đầu",
                regex:
                "^(?!.*((o|ô)|m.y|ph.i))(.*c.m)(?=.*(tr.i|rt)).*(?=.*(quay ..u|qd))",
                icon: () => this.prohibitIcon("left-uturn"),
            },
            C_RPQD: {
                legend: "Biển cấm rẽ phải & quay đầu",
                regex:
                "^(?!.*((o|ô)|m.y|tr.i))(.*c.m)(?=.*(ph.i|rt)).*(?=.*(quay ..u|qd))",
                icon: () => this.prohibitIcon("right-uturn"),
            },
            C_RT: {
                legend: "Biển cấm rẽ trái",
                regex:
                "^(.*c.m|k.*)(?!.*((o|ô)|m.y|th.ng|quay|ph.i)).*(tr.i|rt)$",
                icon: () => this.prohibitTurnIcon("left"),
            },
            C_RP: {
                legend: "Biển cấm rẽ phải",
                regex:
                "^(?!.*((o|ô)|m.y|(đ|d)t|th.ng|quay|qd|tr.i|rt))(.*c.m|k.*).*(ph.i|rp)",
                icon: () => this.prohibitTurnIcon("right"),
            },
            C_DT: {
                legend: "Biển cấm đi thẳng",
                regex:
                "^(.*c.m|k.*)(?!.*((o|ô)|m.y|ph.i|tr.i|quay)).*(th.ng|(đ|d)t)$",
                icon: () => this.prohibitTurnIcon("s"),
            },
            C_QD: {
                legend: "Biển cấm quay đầu",
                regex: "^(.*c.m|k.*)\\W(quay ..u)$",
                icon: () => this.prohibitTurnIcon("u-turn"),
            },
            HET_CAM_TOC_DO: {
                legend: "Biển hết cấm giới hạn tốc độ",
                regex: "^(?:h.t|h.t bi.n)\\s+.*?(\\d+)",
                icon: (m) => this.speedIcon(m?.[1] || "??", true),
            },
            GH_TOC_DO: {
                legend: "Biển giới hạn tốc độ",
                regex: "^(?!.*\\b(h.t|n.a)\\b).*?(\\d{2,3})",
                icon: (m) => this.speedIcon(m?.[2] || "??", false),
            },
            C_VUOT: {
                legend: "Biển cấm vượt",
                regex: "^(c.m|k.*g|c).*(v..t|v)$",
                icon: () => this.prohibitIcon("cam_vuot"),
            },
            HET_C_VUOT: {
                legend: "Biển hết cấm vượt",
                enable: true,
                regex: "(h.t|hc).*(v..t|v)$",
                icon: () => this.prohibitIcon("het_cam_vuot"),
            },
            C_OTO_RT: {
                legend: "Biển cấm oto rẽ trái",
                regex: "^(.*c.m|k.*).*t(o|ô).*(tr.i|rt)$",
                icon: () => this.prohibitTurnIcon("oto-left"),
            },
            C_OTO_RP: {
                legend: "Biển cấm oto rẽ phải",
                regex: "^(.*c.m|k.*).*t(o|ô).*(ph.i|rp)$",
                icon: () => this.prohibitTurnIcon("oto-right"),
            },
            C_OTO_QD: {
                legend: "Biển cấm oto quay đầu",
                regex: "^(.*c.m|k.*).*t(o|ô)\\s*(quay ..u|qd)$",
                icon: () => this.prohibitTurnIcon("oto-uturn"),
            },
            C_OTO: {
                legend: "Biển cấm oto",
                regex: "^(.*c.m).*t(o|ô)$",
                icon: () => this.prohibitIcon("oto"),
            },
            HL_DT: {
                legend: "Biển hiệu lệnh đi thẳng",
                regex: "^(?!.*(?:bi.n|c.m)).*i.*th(ẳ|a)ng",
                icon: () => this.mandatoryIcon("straight"),
            },
            HL_RP: {
                legend: "Biển hiệu lệnh rẽ phải",
                regex: "^(?!.*(?:bi.n|c.m)).*r.*ph.i",
                icon: () => this.mandatoryIcon("right"),
            },
            HL_RT: {
                legend: "Biển hiệu lệnh rẽ trái",
                regex: "^(?!.*(?:bi.n|c.m)).*r.*tr.i",
                icon: () => this.mandatoryIcon("left"),
            },
            LAN_OTO: {
                legend: "Biển đường dành oto",
                regex: "^(...ng|l.n).*t(o|ô)$",
                icon: () => this.mandatoryIcon("only-oto"),
            },
            LAN_XEMAY: {
                legend: "Biển làn dành xe máy",
                regex: "^(l.n|...ng).*(m.y)$",
                icon: () => this.mandatoryIcon("only-moto"),
            },
            VAO_KDC: {
                legend: "Biển vào KDC",
                regex:
                "^(?!.*\\b(ngo.i|ra|h.t|h.*c)\\b).*?(.*kdc|.*kdc|.*khu d.n c.|.*d.n c.|.*b.t ..u k|dc|n.i th.*|th.nh th.)",
                icon: () => this.residentialZoneIcon(false),
            },
            HET_KDC: {
                legend: " Biển hết KDC",
                regex:
                "^(?!.*\\b(v.o|b.t ..u|v.)\\b).*?(ngo.i.*|ra\\S.*k.*|ra n.*|h.t.*cư|h.*dc|h.t.*kdc|th.nh th.|h.t th.*)",
                icon: () => this.residentialZoneIcon(true),
            },
            CAMERA_TOC_DO: {
                legend: "Camera tốc độ",
                regex: "^(cam.* t.c ..|speed.*|cam.*speed|cam.*ai)$",
                icon: () => this.cameraIcon("speed"),
            },
            CAMERA_DEN_DO: {
                legend: "Camera đèn đỏ",
                regex:
                "^(cam.* ph.t ngu.i|cam.* ..n ..|..n ..|traffic light|.*th(o|ô)ng)$",
                icon: () => this.cameraIcon("red_light"),
            },
            TOLL: {
                legend: "Trạm thu phí",
                regex: ".*tr.m thu ph.",
                icon: () => this.mandatoryIcon("toll"),
            },
            HET_MOI_LENH_C: {
                legend: "Biển hết mọi lệnh cấm",
                regex: "^(h.t|bi.n).*?(bi.n|c.m|l.c|t.m th.i|l..h|h.n)$",
                icon: () => this.createEndOfProhibitionsIcon(),
            },
        };
    }
    async updateDisplay() {
        this.layer.setZIndex(this.findTopLayer() + 50);
        this.layer.removeAllFeatures();
        if (!this.commentLayerCheckbox || !this.commentLayerCheckbox.checked) {
            this.log("Custom layer is disabled, clearing icons.");
            return;
        }
        try {
            const mapComments = await this.wmeSdk.DataModel.MapComments.getAll();
            if (!mapComments || mapComments.length === 0) {
                this.log("No map comments found in data model for current view.");
                return;
            }
            const featuresToAdd = [];
            const { iconSize, opacity, offsetRange, isSubsign, label, opacitySub,textSize, opacityText } =
                  this.options;
            for (const comment of mapComments) {
                const iconSvg = this.getCommentIcon(comment.subject);
                const [lon, lat] = comment.geometry.coordinates;
                const pointGeometry = new OpenLayers.Geometry.Point(lon, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    W.map.getProjectionObject(),
                );
                const baseOffsetX =
                      Math.floor(Math.random() * (offsetRange * 2 + 1)) - offsetRange;
                const baseOffsetY =
                      Math.floor(Math.random() * (offsetRange * 2 + 1)) - offsetRange;
                if (iconSvg) {
                    const feature = new OpenLayers.Feature.Vector(pointGeometry);
                    const base64Svg = this.utf8ToBase64(iconSvg);
                    feature.style = {
                        graphic: true,
                        externalGraphic: "data:image/svg+xml;base64," + base64Svg,
                        graphicHeight: iconSize,
                        graphicWidth: iconSize,
                        graphicXOffset: baseOffsetX,
                        graphicYOffset: baseOffsetY,
                        graphicOpacity: opacity,
                        label: label ? comment.modificationData.createdBy : "",
                        labelAlign: "cm",
                        fontColor: "#ffffff",
                        fontSize: `${textSize}px`,
                        fontOpacity: opacityText,
                        labelXOffset: baseOffsetY,
                        labelYOffset: baseOffsetX,
                    };
                    featuresToAdd.push(feature);
                }
                if (isSubsign) {
                    const featureSub = new OpenLayers.Feature.Vector(pointGeometry.clone());
                    const textSubsign = this.subSignRegex(comment.subject);
                    if (textSubsign) {
                        const CHAR_UNIT_WIDTH = 7;
                        const PADDING_UNITS = 10;
                        let widthUnits =
                            PADDING_UNITS + textSubsign.length * CHAR_UNIT_WIDTH;
                        widthUnits = Math.max(30, widthUnits);
                        const SUB_SIGN_VIEWBOX_HEIGHT = 30;
                        const graphicWidth = Math.round(
                            widthUnits * (iconSize / SUB_SIGN_VIEWBOX_HEIGHT),
                        );
                        const subSignSvg = this.subSignIcon(textSubsign, widthUnits);
                        const base64SubSignSvg = this.utf8ToBase64(subSignSvg);
                        featureSub.style = {
                            graphic: true,
                            externalGraphic: "data:image/svg+xml;base64," + base64SubSignSvg,
                            graphicWidth: graphicWidth,
                            graphicHeight: 20,
                            graphicXOffset: baseOffsetX - (graphicWidth * 0.5) / 2,
                            graphicYOffset: baseOffsetY + iconSize,
                            graphicOpacity: opacitySub,
                        };
                        featuresToAdd.push(featureSub);
                    }
                }
            }
            if (featuresToAdd.length > 0) {
                this.layer.addFeatures(featuresToAdd);
            }
        } catch (error) {
            console.error(`[${this.scriptName}] Error updating display:`, error);
        }
    }
    createConfigRow(label, type, key, subKey = null) {
        const container = this.createElem("div", {
            style:
            "margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;",
        });
        const val = subKey ? this.options.rules[subKey][key] : this.options[key];
        const input = this.createElem("input", {
            type: type === "number" ? "number" : "text",
            value: val,
            style: "width: 60%;",
        });
        if (type === "checkbox") {
            input.type = "checkbox";
            input.checked = val;
        }
        input.addEventListener("change", (e) => {
            const newV =
                  type === "checkbox"
            ? e.target.checked
            : type === "number"
            ? parseFloat(e.target.value)
            : e.target.value;
            if (subKey) this.options.rules[subKey][key] = newV;
            else this.options[key] = newV;
            this.applySettings();
        });
        container.append(
            this.createElem("span", {
                textContent: label,
                style: "font-size: 11px;",
            }),
            input,
        );
        return container;
    }
    createElem(type = "", attrs = {}, eventListener = []) {
        const el =
              this._elems[type]?.cloneNode(false) || this._elems.div.cloneNode(false),
              applyEventListeners = function ([evt, cb]) {
                  return this.addEventListener(evt, cb);
              };
        Object.keys(attrs).forEach((attr) => {
            if (
                attrs[attr] !== undefined &&
                attrs[attr] !== "undefined" &&
                attrs[attr] !== null &&
                attrs[attr] !== "null"
            ) {
                if (
                    attr === "disabled" ||
                    attr === "checked" ||
                    attr === "selected" ||
                    attr === "textContent" ||
                    attr === "innerHTML"
                ) {
                    el[attr] = attrs[attr];
                } else {
                    el.setAttribute(attr, attrs[attr]);
                }
            }
        });
        if (eventListener.length > 0) {
            eventListener.forEach((obj) => {
                Object.entries(obj).map(applyEventListeners.bind(el));
            });
        }
        return el;
    }
    async tabUI() {
        const docFrags = document.createDocumentFragment();
        this.wmeSdk.Sidebar.registerScriptTab()
            .then(({ tabLabel, tabPane }) => {
            tabLabel.textContent = "WME Comment Icons";
            tabLabel.title = this.scriptName;
            docFrags.appendChild(
                this.createElem("span", {
                    class: "WMECI-spanTitle",
                    textContent: this.scriptName,
                }),
            );
            docFrags.appendChild(
                this.createElem("span", {
                    class: "WMECI-spanVersion",
                    textContent: this.version,
                }),
            );
            let liElem = this.createElem("li", {
                class: "active",
            });
            liElem.appendChild(
                this.createElem("a", {
                    "data-toggle": "tab",
                    href: "#panel-wmeci-configs",
                    "aria-expanded": true,
                    textContent: "Configs",
                }),
            );
            const ulElem = this.createElem("ul", {
                class: "nav nav-tabs",
            });
            ulElem.appendChild(liElem);
            liElem = this.createElem("li");
            liElem.appendChild(
                this.createElem("a", {
                    "data-toggle": "tab",
                    href: "#panel-wmeci-settings",
                    "aria-expanded": true,
                    textContent: "Settings",
                }),
            );
            ulElem.appendChild(liElem);
            liElem = this.createElem("li");
            liElem.appendChild(
                this.createElem("a", {
                    "data-toggle": "tab",
                    href: "#panel-wmeci-others",
                    "aria-expanded": true,
                    textContent: "Others",
                }),
            );
            ulElem.appendChild(liElem);
            let divElemRoot = this.createElem("div", {
                class: "WmeCommentIcons-navTabs",
            });
            divElemRoot.appendChild(ulElem);
            docFrags.appendChild(divElemRoot);
            divElemRoot = this.createElem("div", {
                class: "tab-content WmeCommentIcons-divTabs",
                style: "--height-offset:0px;",
            });
            divElemRoot.appendChild(
                this.createElem("div", {
                    id: "panel-wmeci-configs",
                    class: "tab-pane active",
                }),
            );
            divElemRoot.appendChild(
                this.createElem("div", {
                    id: "panel-wmeci-settings",
                    class: "tab-pane",
                }),
            );
            divElemRoot.appendChild(
                this.createElem("div", {
                    id: "panel-wmeci-others",
                    class: "tab-pane",
                }),
            );
            docFrags.appendChild(divElemRoot);
            const configPanel = divElemRoot.querySelector("#panel-wmeci-configs");
            configPanel.append(
                this.createConfigRow("Icon Size", "number", "iconSize"),
                this.createConfigRow("Opacity (0-1)", "number", "opacity"),
                this.createConfigRow("Opacity biển phụ (0-1)", "number", "opacitySub"),
                this.createConfigRow("Offset +/-", "number", "offsetRange"),
                this.createConfigRow("Opacity text (0-1)", "nunmber", "opacityText"),
                this.createConfigRow("Text size (px)", "nunmber", "textSize"),
                this.createElem("hr"),
                this.createElem("p", {
                    textContent: "Regex Rules:",
                    style: "font-weight: bold",
                }),
            );
            this.RULE_ORDER.forEach((ruleKey) => {
                const ruleData = this.options.rules[ruleKey];
                configPanel.append(
                    this.createConfigRow(ruleData.legend, "text", "regex", ruleKey),
                );
            });
            const settingsPanel = divElemRoot.querySelector(
                "#panel-wmeci-settings",
            );
            settingsPanel.append(
                this.createConfigRow("Bật biển phụ", "checkbox", "isSubsign"),
                this.createConfigRow("Bật tên", "checkbox", "label"),
            );
            this.RULE_ORDER.forEach((key) => {
                settingsPanel.append(
                    this.createConfigRow(
                        this.options.rules[key].legend,
                        "checkbox",
                        "enable",
                        key,
                    ),
                );
            });
            tabPane.appendChild(docFrags);
            tabPane.id = "sidepanel-wme-ci";
            W.userscripts.waitForElementConnected(tabPane);
            Object.assign(
                document.getElementById("sidepanel-wme-ci").parentElement.style,
                {
                    width: "auto",
                    padding: "0 15px",
                },
            );
            this.updateDisplay();
        })
            .catch((error) => {
            console.error(`${this.scriptName}: Error creating script tab`, error);
        });
    }
    applySettings() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.options));
        this.arrayRegex = this.buildCombinedRegex();
        this.updateDisplay();
    }
    findTopLayer() {
        const layers = W.map.layers;
        let maxZ = -Infinity;
        let topLayer = null;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer && typeof layer.getZIndex === "function") {
                const zIndex = layer.getZIndex();
                if (zIndex !== null && zIndex > maxZ) {
                    maxZ = zIndex;
                    topLayer = layer;
                }
            }
        }
        if (maxZ === -Infinity) {
            console.log("No layers with a z-index were found. Defaulting to 0.");
            maxZ = 0;
        }
        this.ZIndex = maxZ;
        return maxZ;
    }
    utf8ToBase64(str) {
        const utf8Bytes = new TextEncoder().encode(str);
        const binaryString = String.fromCharCode.apply(null, utf8Bytes);
        return btoa(binaryString);
    }
    subSignRegex(subject) {
        const _regex = /.*\[(.*)\]/is;
        const match = subject.match(_regex);
        if (match) {
            return match[1];
        }
    }
    buildCombinedRegex() {
        const allRegexParts = [];
        this.RULE_ORDER.forEach((name) => {
            const config = this.options.rules[name];
            if (!config || !config.enable) return;
            const regexPart = this.options.rules[name].regex;
            allRegexParts.push(`(?<${name}>${regexPart})`);
        });
        if (allRegexParts.length === 0) {
            return new RegExp("$^");
        }
        return new RegExp(`^(${allRegexParts.join("|")})`, "is");
    }
    getCommentIcon(subject) {
        if (!subject) return null;
        const text = subject.replace(/\s*\[.*\]\s*$/, "").trim();
        const match = this.arrayRegex.exec(text);
        if (!match || !match.groups) return null;
        for (const ruleName of this.RULE_ORDER) {
            if (match.groups[ruleName] !== undefined) {
                const rule = this.RULE_DEFINITIONS[ruleName];
                const config = this.options.rules[ruleName];
                if (rule && config.enable) {
                    const localRegex = new RegExp(config.regex, "is");
                    const localMatch = text.match(localRegex);
                    return rule.icon(localMatch);
                }
            }
        }
        return null;
    }
    subSignIcon(content, widthUnits) {
        return `<svg width="${widthUnits}" height="20" viewBox="0 0 ${widthUnits} 20" xmlns="http://www.w3.org/2000/svg"><rect style="fill:#fff;fill-opacity:1;stroke:#000;stroke-width:2.89086;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:fill markers stroke" width="${widthUnits - widthUnits * 0.05}" height="19" x="1.445" y="1.445" ry="5.419"/><text xml:space="preserve" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:12;line-height:2;letter-spacing:.326827px;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.23525;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:fill markers stroke" x="8.665" y="14.348"><tspan style="fill:#000;fill-opacity:1;stroke:none;stroke-width:1.23525" x="8.665" y="14.348" font-family="Arial" font-weight="bold">${content}</tspan></text></svg>`;
    }
    residentialZoneIcon(isEnd = true) {
        return isEnd
            ? `<svg width="239.99998" height="200" viewBox="0 0 63.499994 52.916666" version="1.1" id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs1"><clipPath clipPathUnits="userSpaceOnUse" id="clipPath56"><path fill="none" stroke="#0046aa" stroke-width="1.32246" d="M 0.05437925,55.564166 H 158.74999 V 187.81051 H 0.05437925 Z" id="path56" /></clipPath></defs><g id="layer10" transform="translate(-0.05438337,-52.916664)"><path fill="#0046aa" d="M 0.05438337,52.916664 H 63.554376 V 105.83333 H 0.05438337 Z" id="path1" style="stroke-width:0.0529165" /><path d="m 2.7002164,92.604164 v -8.678336 l 5.185833,-5.503333 5.1858326,5.503333 v 3.915833 h 1.534584 V 78.05208 l 1.058333,-1.640418 v -9.524999 l 2.910416,-6.0325 2.910417,6.0325 v 9.524999 l 1.058333,1.640418 v 3.915833 l 3.439583,-1.852086 6.50875,4.074587 v 5.926666 h 1.693333 V 75.459164 h 0.846666 v -6.032501 h 0.582084 v -5.926666 h 5.926663 v 7.831665 h 0.899584 V 81.54458 h 2.328334 v 6.032498 h 0.952498 v -9.895417 l 4.074584,-3.598333 4.497916,4.021666 v 4.92125 l 3.651251,-3.016249 3.175,3.4925 v 9.101669 z" fill="#ffffff" id="path2" style="stroke-width:0.0529165" /><path stroke="#f00a0a" stroke-width="7.93478" d="M 0.05437925,187.81051 158.74999,55.564165" id="path3" clip-path="url(#clipPath56)" transform="matrix(0.40013706,0,0,0.40013706,0.03262422,30.683383)" /><path fill="none" stroke="#ffffff" stroke-width="0.529165" d="M 0.58354859,53.44583 H 63.025211 v 51.85833 H 0.58354859 Z" id="path4" /></g></svg>`
      : `<svg width="239.99997" height="200" viewBox="0 0 63.49999 52.916666" version="1.1" id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs1" /><g id="layer11" transform="translate(-105.83333,-52.916664)"><path fill="#0046aa" d="m 105.83333,52.916664 h 63.49999 v 52.916666 h -63.49999 z" id="path1-3" style="stroke-width:0.0529164" /><path fill="none" stroke="#ffffff" stroke-width="0.529164" d="m 106.36249,53.44583 h 62.44166 v 51.85833 h -62.44166 z" id="path2-5" /><path d="m 108.47916,92.604158 v -8.678331 l 5.18584,-5.503334 5.18583,5.503334 v 3.915833 h 1.53458 v -9.789583 l 1.05833,-1.640417 v -9.524998 l 2.91042,-6.032499 2.91042,6.032499 v 9.524998 l 1.05832,1.640417 v 3.915833 l 3.43959,-1.852083 6.50876,4.074582 v 5.926665 h 1.69333 V 75.45916 h 0.84666 v -6.032498 h 0.58208 v -5.926667 h 5.92667 v 7.831665 h 0.89959 v 10.212917 h 2.32832 v 6.032497 h 0.95251 V 77.68166 l 4.07458,-3.598332 4.49792,4.021665 v 4.92125 l 3.65124,-3.01625 3.17501,3.4925 v 9.101665 z" fill="#ffffff" id="path3-7" style="stroke-width:0.0529164" /></g></svg>`;
    }
    prohibitIcon(type) {
        switch (type) {
            case "right-uturn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.55757;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M429.75 64.3V-54c0-58.17-46.83-105-105-105s-105 46.83-105 105v186.9h52.5V-54c0-29.085 23.415-52.5 52.5-52.5s52.5 23.415 52.5 52.5V64.3H351l52.5 79.1L456 64.3Z"/><path d="M508.5-159H324.75v52.5H508.5v26.25l79.1-52.5-79.1-52.5z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroake-width:7.55757;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.989h50v680h-50z"/></g></svg>`;
            case "left-uturn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.582 -52.916)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.80008;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><g transform="translate(265.834 83.253)scale(.07182)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.39927;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M274.38 60.965V-54.858c0-56.951 45.848-102.8 102.8-102.8s102.8 45.849 102.8 102.8v182.986h-51.4V-54.858c0-28.475-22.924-51.4-51.4-51.4s-51.4 22.925-51.4 51.4V60.965h25.7l-51.4 77.443-51.4-77.443Z"/><path d="M197.28-157.658h179.9v51.4h-179.9v25.7l-77.444-51.4 77.443-51.4z" style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.39927;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.989h50v680h-50z" transform="rotate(-45)"/></g></g></svg>`;
            case "oto":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.582 -52.916)" style="display:inline"><circle style="display:inline;fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><circle cy="79.375" cx="291.043" style="display:inline;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:19.4416;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="21.546"/><path style="fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:22.6818;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M291.043 54.238a25.137 25.137 0 0 0-25.137 25.137 25.137 25.137 0 0 0 25.137 25.137 25.137 25.137 0 0 0 25.137-25.137 25.137 25.137 0 0 0-25.137-25.137m0 7.182a17.955 17.955 0 0 1 17.955 17.955 17.955 17.955 0 0 1-17.955 17.955 17.955 17.955 0 0 1-17.955-17.955 17.955 17.955 0 0 1 17.955-17.955"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:11.989;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M283.562 66.606c-.771.003-2.122.583-2.358 1.832l-1.438 8.64c-.815-.001-1.886 1.028-1.89 1.598v4.827c.226.586.653 1.039 1.104 1.415v3.912c0 .6.899 1.082 2.015 1.082s2.015-.482 2.015-1.082v-3.912c2.739.323 5.427.55 8.034.55s5.295-.227 8.034-.55v3.912c0 .6.899 1.082 2.015 1.082s2.015-.482 2.015-1.082v-3.912c.45-.376.878-.83 1.103-1.415v-4.827c-.002-.57-1.074-1.6-1.89-1.599l-1.437-8.64c-.236-1.248-1.587-1.828-2.358-1.83zm1.675 1.574h11.614c1.318 0 2.725.76 2.928 1.747l.868 5.161c.019.128-.064.393-.159.541-.193.255-.527.4-1.02.4a39 39 0 0 1-1.187-.075c-3.576-.204-4.686-.196-7.237-.233-2.55.037-3.66.029-7.237.233 0 0-.998.075-1.187.075-.493 0-.828-.145-1.02-.4-.095-.148-.179-.413-.159-.54l.868-5.162c.203-.988 1.61-1.747 2.928-1.747m3.558 9.93h4.498l4.514.4-.002.865H284.28v-.866zm-7.574.166a1.84 1.831 0 0 1 1.839 1.831 1.84 1.831 0 0 1-1.84 1.831 1.84 1.831 0 0 1-1.838-1.83 1.84 1.831 0 0 1 1.839-1.832m19.646 0a1.84 1.831 0 0 1 1.84 1.831 1.84 1.831 0 0 1-1.84 1.831 1.84 1.831 0 0 1-1.84-1.83 1.84 1.831 0 0 1 1.84-1.832m-16.585 1.981h13.525v1.265h-13.526zm-.002 2.148h13.525l.002.865-4.514.4h-4.498l-4.514-.4z"/><path style="fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.1782;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m272.507 63.378 2.539-2.54 34.533 34.534-2.54 2.54z"/></g></svg>`;
            case "cam_vuot":
                return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve"><g transform="translate(-.075 30.541)scale(.0756)"><circle style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:79.8054;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M196.278-131.7c-5.124.02-14.1 3.883-15.667 12.21l-9.555 57.61c-5.418-.007-12.536 6.857-12.556 10.655v32.19c1.498 3.904 4.336 6.923 7.333 9.435v26.085c0 3.997 5.972 7.215 13.39 7.215 7.417 0 13.388-3.218 13.388-7.215V-9.6c18.2 2.153 36.062 3.67 53.389 3.663 17.327.007 35.188-1.51 53.389-3.663v26.085c0 3.997 5.971 7.215 13.389 7.215s13.389-3.218 13.389-7.215V-9.6c2.997-2.512 5.835-5.53 7.333-9.435v-32.19c-.02-3.798-7.137-10.662-12.555-10.656l-9.556-57.61c-1.567-8.326-10.543-12.188-15.667-12.209zm11.13 10.49h77.183c8.756.005 18.106 5.066 19.456 11.654l5.767 34.41c.132.854-.427 2.62-1.056 3.608-1.279 1.697-3.504 2.667-6.778 2.664-1.255 0-7.888-.5-7.888-.5-23.766-1.36-31.143-1.304-48.092-1.554-16.95.25-24.326.195-48.091 1.554 0 0-6.634.5-7.89.5-3.273.003-5.498-.967-6.777-2.664-.63-.988-1.188-2.754-1.056-3.608l5.767-34.41c1.35-6.588 10.7-11.649 19.456-11.655M231.056-55h29.89l30 2.665-.011 5.772h-89.878v-5.772zm-50.333 1.11a12.222 12.21 0 0 1 12.222 12.211 12.222 12.21 0 0 1-12.222 12.21A12.222 12.21 0 0 1 168.5-41.68a12.222 12.21 0 0 1 12.222-12.21m130.556 0A12.222 12.21 0 0 1 323.5-41.678a12.222 12.21 0 0 1-12.222 12.21 12.222 12.21 0 0 1-12.222-12.21 12.222 12.21 0 0 1 12.222-12.21M201.067-40.68h89.877v8.436h-89.888zm-.011 14.319h89.878l.01 5.772-30 2.664h-29.889l-30-2.664z"/><path d="M406.278-131.7c-5.124.02-14.1 3.883-15.667 12.21l-9.555 57.61c-5.418-.007-12.536 6.857-12.556 10.655v32.19c1.499 3.904 4.336 6.923 7.333 9.435v26.085c0 3.997 5.972 7.215 13.39 7.215 7.417 0 13.388-3.218 13.388-7.215V-9.6c18.2 2.153 36.062 3.67 53.389 3.663 17.327.007 35.188-1.51 53.389-3.663v26.085c0 3.997 5.971 7.215 13.389 7.215s13.389-3.218 13.389-7.215V-9.6c2.997-2.512 5.834-5.53 7.333-9.435v-32.19c-.02-3.798-7.137-10.662-12.555-10.656l-9.556-57.61c-1.567-8.326-10.543-12.188-15.667-12.209zm11.13 10.49h77.183c8.756.005 18.106 5.066 19.456 11.654l5.767 34.41c.132.854-.427 2.62-1.056 3.608-1.279 1.697-3.504 2.667-6.778 2.664-1.255 0-7.888-.5-7.888-.5-23.766-1.36-31.143-1.304-48.092-1.554-16.95.25-24.326.195-48.091 1.554 0 0-6.634.5-7.89.5-3.273.003-5.498-.967-6.777-2.664-.63-.988-1.188-2.754-1.056-3.608l5.767-34.41c1.35-6.588 10.7-11.649 19.456-11.655M441.056-55h29.89l30 2.665-.011 5.772h-89.878v-5.772zm-50.333 1.11a12.222 12.21 0 0 1 12.222 12.211 12.222 12.21 0 0 1-12.222 12.21A12.222 12.21 0 0 1 378.5-41.68a12.222 12.21 0 0 1 12.222-12.21m130.556 0A12.222 12.21 0 0 1 533.5-41.678a12.222 12.21 0 0 1-12.222 12.21 12.222 12.21 0 0 1-12.222-12.21 12.222 12.21 0 0 1 12.222-12.21M411.067-40.68h89.877v8.436h-89.888zm-.011 14.319h89.878l.01 5.772-30 2.664h-29.889l-30-2.664z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:79.8054;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
            case "het_cam_vuot":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.6;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1;paint-order:normal" d="M211-134c-16.907.043-50.824 5.95-67.8 18.6-9.108 26.06-12.503 37.146-30.2 56.8l8.8 35.6c.78 5.855 1.17 8.508 6.2 11.5l1.049 16.677c.398 6.149 5.768 10.836 11.55 10.823 2.602-.044 9.383-2.775 9.6-11.6v-17.6H271.8V4.4c.218 8.825 7 11.556 9.6 11.6 5.783.013 11.153-4.674 11.551-10.823L294-11.5c5.03-2.992 5.42-5.645 6.2-11.5l8.8-35.6c-17.698-19.654-21.091-30.74-30.2-56.8-16.975-12.65-50.892-18.557-67.8-18.6m0 9.8c26.205.505 34.794 3.317 60.8 15 6.006 24.85 16.954 41.515 27.4 53.2l-8 33c-1.502 3.596-4.38 5.879-6.2 7l-1.6 20.4c-.197 1.103-.464 2.773-1.6 2.6-.887.067-1.266-1.457-1.2-2.6V-23H141.4V4.4c.066 1.143-.313 2.667-1.2 2.6-1.136.173-1.403-1.497-1.6-2.6L137-16c-1.82-1.121-4.698-3.404-6.2-7l-8-33c10.446-11.685 21.394-28.35 27.4-53.2 26.006-11.683 34.596-14.495 60.8-15m280-9.8c-16.907.043-50.824 5.95-67.8 18.6-9.108 26.06-12.503 37.146-30.2 56.8l8.8 35.6c.78 5.855 1.17 8.508 6.2 11.5l1.049 16.677c.398 6.149 5.768 10.836 11.55 10.823 2.602-.044 9.383-2.775 9.6-11.6v-17.6H551.8V4.4c.218 8.825 7 11.556 9.6 11.6 5.783.013 11.153-4.674 11.551-10.823L574-11.5c5.03-2.992 5.42-5.645 6.2-11.5l8.8-35.6c-17.698-19.654-21.091-30.74-30.2-56.8-16.975-12.65-50.892-18.557-67.8-18.6m0 9.8c26.205.505 34.794 3.317 60.8 15 6.006 24.85 16.954 41.515 27.4 53.2l-8 33c-1.502 3.596-4.38 5.879-6.2 7l-1.6 20.4c-.197 1.103-.464 2.773-1.6 2.6-.887.067-1.266-1.457-1.2-2.6V-23H421.4V4.4c.066 1.143-.313 2.667-1.2 2.6-1.136.173-1.403-1.497-1.6-2.6L417-16c-1.82-1.121-4.698-3.404-6.2-7l-8-33c10.446-11.685 21.394-28.35 27.4-53.2 26.006-11.683 34.596-14.495 60.8-15"/><path transform="rotate(45)" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/><path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
            default:
                return null;
        }
    }
    speedIcon(speed, isProhibit = false) {
        const speedNum = parseInt(speed, 10);
        if (
            !isNaN(speedNum) &&
            speedNum > 10 &&
            speedNum < 150 &&
            (speedNum % 10 === 0 || speedNum % 5 === 0)
        ) {
            return isProhibit
                ? `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"> <g transform="translate(-.076 30.541)scale(.0756)" style="display:inline"> <circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/> <text x="351" y="-80" font-size="450" font-family="Arial" font-weight="bold" fill="none" stroke="#000000" stroke-width="10" text-anchor="middle" dominant-baseline="central">${speed}</text> <path transform="rotate(45)" style="opacity:0.3;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/> <path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/> </g> </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="21" fill="#FFFFFF" stroke="#C20B10" stroke-width="5"/>
                        <text x="25" y="35" font-size="25" font-family="Arial" font-weight="bold" fill="#1F2125" text-anchor="middle">${speed}</text>
                    </svg>`;
        }
    }
    mandatoryIcon(direction) {
        switch (direction) {
            case 'toll':
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd200" stroke="#000" d="M38 .5h525c20.775 0 37.5 16.725 37.5 37.5v225c0 20.775-16.725 37.5-37.5 37.5H38C17.225 300.5.5 283.775.5 263V38C.5 17.225 17.225.5 38 .5Z" transform="matrix(.08805 0 0 .0853 -.044 14.172)"/><path d="M3.302 15.014h46.226a2.471 2.394 0 0 1 2.477 2.4v19.192a2.471 2.394 0 0 1-2.477 2.399H3.302a2.471 2.394 0 0 1-2.477-2.4V17.414a2.471 2.394 0 0 1 2.477-2.399"/><path fill="#ffd200" d="M3.302 16.347h46.226c.61 0 1.1.476 1.1 1.066v19.193c0 .59-.49 1.066-1.1 1.066H3.302c-.61 0-1.1-.475-1.1-1.066V17.413c0-.59.49-1.066 1.1-1.066"/><path d="M11.297 22.39v11h-2.09v-11H6.191v-1.795h8.161v1.795zm14.077 4.622q0 1.528-.375 2.921-.374 1.395-1.064 2.254-1.104 1.432-3.193 1.432-1.4 0-2.307-.554-.907-.553-1.498-1.737-.414-.822-.67-1.986-.256-1.184-.257-2.33 0-1.585.375-2.941.394-1.356 1.064-2.273.592-.725 1.4-1.07.828-.362 1.971-.362 1.262 0 2.149.554t1.518 1.738q.414.859.65 2.005t.237 2.349m-2.09 0q0-1.089-.197-2.005-.197-.936-.591-1.585-.315-.497-.73-.726-.394-.23-.985-.268-.769-.038-1.281.344-.513.382-.848 1.241-.256.573-.394 1.395a11.71 11.345 0 0 0-.119 1.604q0 1.031.198 1.986t.59 1.566q.316.496.75.744.434.249 1.064.249.73 0 1.203-.382.493-.382.828-1.242.098-.248.197-.592a7.22 6.995 0 0 0 .158-.744 8.981 8.7 0 0 0 .118-.802q.04-.401.04-.783m5.014 6.378V20.595h2.09V31.5h6.11v1.89zm10.164 0V20.595h2.09V31.5h6.11v1.89z"/></svg>`;
            case "only-moto":
                return `<svg width="200" height="250" viewBox="0 0 52.917 66.146" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g style="display:inline"><path style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.9367;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M0-503h600v800H0z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.89387;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M5-498h590v790H5z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><path style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.80816;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M15-488h570v770H15z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><g style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:159.076px;line-height:0;font-family:Giaothong2;-inkscape-font-specification:&quot;Giaothong2 Bold&quot;;letter-spacing:0;word-spacing:0;fill:#000;fill-opacity:1;stroke:none;stroke-width:.828522" aria-label="TRẠM"><g style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:161.347px;line-height:0;font-family:Giaothong2;-inkscape-font-specification:&quot;Giaothong2 Bold&quot;;letter-spacing:3.35593px;word-spacing:0;fill:#000;fill-opacity:1;stroke:none;stroke-width:.696246" aria-label="TRẠM" transform="matrix(.08824 0 0 .08272 -25.647 109.746)"/></g><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.0865841;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M329.357-253c-6.839.036-15.439 2.345-17.25 15.214l-.964 1.072 3 8.035 6.107 1.072 3.107 5.143-2.142 5.035v1.072l7.07 3.964v2.143l7.072 7.071 17.357-13.178.965-1.072 2.035-10.178c-1.43-16.66-10.597-25.352-26.357-25.393m30.429 40.714L343.5-198.143l-1.929 1.072c-.967 15.099-2.158 19.1-5.142 25.5-1.917 3.326-8.677 8.072-10.071 8.143-2.703.187-7.441-2.134-10.287-3-5.017-1.348-17.174-6.942-29.142-7.286-7.712.06-16.175 1.829-21.429 7.07h-1.928L213.643-98.5c-31.424-14.957-56.91-12.265-79.714-.964l6.107 6.107c31.218-13.4 52.223-5.67 68.892 1.071l-11.3 15.696a66.43 66.43 0 0 0-33.699-9.267c-36.688 0-66.43 29.74-66.429 66.429C97.5 17.259 127.241 47 163.929 47c36.687 0 66.428-29.741 66.428-66.428A66.43 66.43 0 0 0 204-72.307l11.894-16.122c36.446 22.43 40.787 40.116 47.678 57.215h9.215l7.929 22.286h89.799c5.156 32.21 32.937 55.91 65.558 55.928 36.687 0 66.428-29.741 66.428-66.428 0-36.688-29.74-66.43-66.428-66.43a66.43 66.43 0 0 0-38.965 12.73l-6.648-9.856C402.4-90.891 416.714-95.5 432.107-95.5a75.56 75.56 0 0 1 38.036 10.393l-1.072-7.179c-11.066-9.612-23.728-13.56-37.5-13.286l-4.928-15.214-5.143-2.035c-1.53 4.894-7.07 7.112-9.107 7.178-11.07.021-12.629-9.866-13.178-19.5v-11.036c-.212-3.019-1.93-7.178-1.93-7.178-6.046-23.86-16.766-41.763-37.5-58.929m-70.5 49.715c4.352.281 7.814 3.45 9.643 4.07l34.5 11.25 12.107-11.25 20.357 31.608v4.072l-45.643 13.178-43.5-25.5h-26.18l14.93-20.143 6.107-3.214 3.108 5.143 6.213-5.143.858-1.929s6.51-2.159 7.5-2.142m-30.869 70.285h39.548l4.07 12.215-25.285.964 3 25.393-3.107 8.143zm125.167 14.437 6.87 10.184a66.43 66.43 0 0 0-20.779 47.594h-13.103c.032-23.199 10.525-43.943 27.012-57.778M163.929-67.643a48.2 48.2 0 0 1 22.882 5.826l-18.967 25.901c-8.726.201-15.697 7.33-15.701 16.059 0 8.876 7.195 16.071 16.071 16.071s16.072-7.195 16.072-16.071a16.08 16.08 0 0 0-8.646-14.24l17.53-23.62a48.21 48.21 0 0 1 18.973 38.289c0 26.627-21.586 48.214-48.214 48.214S115.714 7.2 115.714-19.428c0-26.629 21.587-48.215 48.215-48.215m272.143 0c26.628 0 48.214 21.587 48.214 48.215 0 26.627-21.586 48.214-48.214 48.214-22.568-.018-42.104-15.688-47.018-37.714h23.048a23.04 23.04 0 0 0 20.22 12c12.722 0 23.035-10.314 23.035-23.036S445.045-43 432.322-43a23.04 23.04 0 0 0-12.421 3.664l-12.614-18.7a48.2 48.2 0 0 1 28.785-9.607m-35.24 15.366 12.772 18.934a23.04 23.04 0 0 0-4.314 13.272h-21.41a48.2 48.2 0 0 1 12.952-32.206" transform="matrix(.0882 0 0 .08268 0 41.59)"/></g></svg>`;
            case "only-oto":
                return `<svg width="200" height="250" viewBox="0 0 52.917 66.146" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g style="display:inline"><path style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.9367;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M0-503h600v800H0z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.89387;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M5-498h590v790H5z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><path style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.80816;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M15-488h570v770H15z" transform="matrix(.0882 0 0 .08268 0 41.59)"/><g style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:159.076px;line-height:0;font-family:Giaothong2;-inkscape-font-specification:&quot;Giaothong2 Bold&quot;;letter-spacing:0;word-spacing:0;fill:#000;fill-opacity:1;stroke:none;stroke-width:.828522" aria-label="TRẠM"><g style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:161.347px;line-height:0;font-family:Giaothong2;-inkscape-font-specification:&quot;Giaothong2 Bold&quot;;letter-spacing:3.35593px;word-spacing:0;fill:#000;fill-opacity:1;stroke:none;stroke-width:.696246" aria-label="TRẠM" transform="matrix(.08824 0 0 .08272 -25.647 109.746)"/></g><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:205.316;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M172.143-303c-13.175.053-36.256 9.996-40.286 31.428l-24.571 148.286C93.354-123.3 75.052-105.632 75-95.857V-13C78.853-2.95 86.149 4.82 93.858 11.286v67.142C93.858 88.717 109.212 97 128.286 97s34.428-8.283 34.428-18.572V11.286c46.802 5.541 92.73 9.446 137.286 9.428 44.556.018 90.484-3.887 137.286-9.428v67.142C437.286 88.717 452.64 97 471.714 97s34.428-8.283 34.428-18.572V11.286C513.852 4.82 521.148-2.951 525-13v-82.857c-.053-9.775-18.354-27.444-32.285-27.429l-24.572-148.286c-4.03-21.432-27.11-31.375-40.286-31.428Zm28.622 27h198.47c22.514.014 46.558 13.042 50.029 30l14.828 88.571c.341 2.199-1.096 6.742-2.714 9.286-3.289 4.368-9.01 6.864-17.429 6.857-3.229 0-20.285-1.286-20.285-1.286-61.111-3.5-80.08-3.357-123.664-4-43.584.643-62.552.5-123.663 4 0 0-17.057 1.286-20.286 1.286-8.418.007-14.14-2.49-17.43-6.857-1.617-2.544-3.054-7.087-2.713-9.286l14.828-88.572c3.47-16.957 27.515-29.985 50.029-30m60.806 170.428h76.858l77.142 6.858-.028 14.857H184.43v-14.857zm-129.428 2.857a31.43 31.43 0 0 1 31.428 31.43 31.43 31.43 0 0 1-31.428 31.427 31.43 31.43 0 0 1-31.429-31.428 31.43 31.43 0 0 1 31.43-31.429m335.715 0a31.43 31.43 0 0 1 31.428 31.43 31.43 31.43 0 0 1-31.428 31.427 31.43 31.43 0 0 1-31.43-31.428 31.43 31.43 0 0 1 31.43-31.429m-283.4 34H415.57V-47H184.43zm-.03 36.858h231.116L415.572-17l-77.143 6.857h-76.858L184.43-17z" transform="matrix(.0882 0 0 .08268 0 41.59)"/></g></svg>`;
            case "left":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.07517 0 0 .0751 -55.778 30.514)"><circle transform="scale(-1 1)" r="350" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.814;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="-1093.94" cy="-54"/><circle transform="scale(-1 1)" r="350.5" style="opacity:1;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:#fff;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="-1093.94" cy="-54"/><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.0333468;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M934.873-299.963v35.723h291.434c42.063 0 75.931 33.868 75.931 75.933V227.14h-71.186v-384.97c0-18.2-13.72-33.4-31.421-35.222H934.895v35.722l-107.248-71.118z"/></g></svg>`;
            case "right":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.07526 0 0 .0752 -55.876 30.519)"><circle r="350" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.814;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="1093.94" cy="-54"/><circle r="350.5" style="opacity:1;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:#fff;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="1093.94" cy="-54"/><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.0333468;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M1253.008-299.963v35.723H961.573c-42.063 0-75.931 33.868-75.931 75.933V227.14h71.186v-384.97c0-18.2 13.72-33.4 31.421-35.222h264.736v35.722l107.248-71.118z"/></g></svg>`;
            case "straight":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(-.07582 0 0 .07582 53.07 30.566)"><circle cy="-54" cx="351" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="350"/><path style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.42201;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:3.864;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m316 294.8 13 1 22 .7 22-.7 13-1V-229h35l-70-105-70 105h35z"/><circle r="350.5" style="opacity:1;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54.45"/><circle r="350.5" style="opacity:1;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:#fff;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54"/></g></svg>`;
            default:
                return null;
        }
    }
    prohibitTurnIcon(direction) {
        switch (direction) {
            case "sr":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.03705;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m254-264 70 140h-35v105h140v-35l140 70-140 70V51H289v105h-70v-280h-35Z"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.989h50v680h-50z"/></g></svg>`;
            case "sl":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.03705;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m448-264-70 140h35v105H273v-35L133 16l140 70V51h140v105h70v-280h35Z"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.989h50v680h-50z"/></g></svg>`;
            case "lr":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-62.917 431.458)"><circle style="fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:23.8741;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="89.375" cy="-405" r="26.458"/><circle cy="-405" cx="89.375" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:17.0529;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="18.899"/><path style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.133513;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m81.437-418.23-7.937 5.293 7.937 5.291v-2.646h5.292v18.521h5.292v-18.52h5.291v2.645l7.938-5.292-7.938-5.291v2.646h-5.291a2.64 2.64 0 0 0-2.646 2.646 2.64 2.64 0 0 0-2.646-2.646h-5.292Z"/><path transform="rotate(-45)" style="fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.45039;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M347.686-248.883h3.78v51.405h-3.78z"/></g></svg>`;
            case "s":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 405)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:23.8741;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="26.458" cy="-378.542" r="26.458"/><circle cy="-378.542" cx="26.458" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:17.0529;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="18.899"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.0986707;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M23.812-385.42h-2.645l5.291-8.997 5.292 8.996h-2.646v22.754h-5.292z"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.4504;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M284.488-274.663h3.78v51.405h-3.78z"/></g></svg>`;
            case "oto-uturn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.28921;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M211 16v-175c0-38.78 31.22-70 70-70h70c38.78 0 70 31.22 70 70v315h-70v-315h-70V16h35l-70 105-70-105Z"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.99h50v680h-50z"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:64.2742;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M465.222-124c-4.099.017-11.28 3.149-12.533 9.9l-7.644 46.71c-4.335-.005-10.029 5.56-10.045 8.64v26.1c1.199 3.166 3.469 5.613 5.867 7.65v21.15c0 3.24 4.777 5.85 10.71 5.85 5.935 0 10.712-2.61 10.712-5.85V-25c14.56 1.745 28.85 2.976 42.711 2.97 13.862.006 28.15-1.225 42.711-2.97v21.15c0 3.24 4.777 5.85 10.711 5.85s10.711-2.61 10.711-5.85V-25c2.398-2.037 4.668-4.484 5.867-7.65v-26.1c-.016-3.08-5.71-8.645-10.044-8.64l-7.645-46.71c-1.253-6.751-8.434-9.883-12.533-9.9zm8.905 8.505h61.746c7.004.005 14.485 4.108 15.565 9.45l4.613 27.9c.106.692-.341 2.124-.844 2.925-1.024 1.376-2.804 2.162-5.423 2.16-1.004 0-6.31-.405-6.31-.405-19.013-1.103-24.915-1.058-38.474-1.26-13.56.202-19.46.157-38.473 1.26 0 0-5.307.405-6.311.405-2.62.002-4.4-.784-5.423-2.16-.503-.801-.95-2.233-.844-2.925l4.613-27.9c1.08-5.342 8.56-9.445 15.565-9.45m18.917 53.685h23.912l24 2.16-.01 4.68h-71.902v-4.68zm-40.266.9a9.778 9.9 0 0 1 9.777 9.9 9.778 9.9 0 0 1-9.777 9.9 9.778 9.9 0 0 1-9.778-9.9 9.778 9.9 0 0 1 9.778-9.9m104.444 0a9.778 9.9 0 0 1 9.778 9.9 9.778 9.9 0 0 1-9.778 9.9 9.778 9.9 0 0 1-9.778-9.9 9.778 9.9 0 0 1 9.778-9.9M469.053-50.2h71.903v6.84h-71.912zm-.009 11.61h71.903l.009 4.68-24 2.16h-23.911l-24-2.16z"/></g></svg>`;
            case "oto-right":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.581 -52.917)" style="display:inline"><circle style="display:inline;fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><circle cy="79.375" cx="291.043" style="display:inline;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:19.4416;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="21.546"/><path d="M282.989 95.85V79.024a4.197 4.197 0 0 1 4.206-4.207h10.517v-2.103l6.31 4.206-6.31 4.207v-2.103h-10.517V95.85z" style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.254228;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:22.6818;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M291.043 54.238a25.137 25.137 0 0 0-25.137 25.137 25.137 25.137 0 0 0 25.137 25.137 25.137 25.137 0 0 0 25.137-25.137 25.137 25.137 0 0 0-25.137-25.137m0 7.182a17.955 17.955 0 0 1 17.955 17.955 17.955 17.955 0 0 1-17.955 17.955 17.955 17.955 0 0 1-17.955-17.955 17.955 17.955 0 0 1 17.955-17.955"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.64789;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M288.744 63.616c-.363.002-1 .275-1.11.863l-.678 4.07c-.384 0-.888.485-.89.753v2.274c.106.276.307.49.52.667v1.843c0 .282.423.51.95.51.525 0 .948-.228.948-.51v-1.843c1.29.152 2.557.259 3.785.259s2.495-.107 3.785-.26v1.844c0 .282.423.51.949.51s.949-.228.949-.51v-1.843c.213-.178.414-.391.52-.667v-2.274c-.001-.268-.506-.753-.89-.753l-.678-4.07c-.11-.588-.747-.861-1.11-.863zm.79.741h5.471c.62 0 1.283.358 1.379.824l.409 2.43a.5.5 0 0 1-.075.256c-.09.12-.248.188-.48.188-.09 0-.56-.035-.56-.035-1.684-.096-2.207-.093-3.409-.11-1.202.017-1.724.014-3.41.11 0 0-.47.035-.558.035-.233 0-.39-.068-.48-.188a.5.5 0 0 1-.076-.255l.41-2.431c.095-.466.758-.823 1.378-.824m1.676 4.678h2.118l2.127.188v.408h-6.372v-.408Zm-3.569.079a.866.863 0 0 1 .867.862.866.863 0 0 1-.867.863.866.863 0 0 1-.866-.863.866.863 0 0 1 .866-.862m9.256 0a.866.863 0 0 1 .866.862.866.863 0 0 1-.866.863.866.863 0 0 1-.867-.863.866.863 0 0 1 .867-.862m-7.813.933h6.371v.596h-6.372zm-.001 1.012h6.371l.001.407-2.127.189h-2.118l-2.127-.189z"/><path style="fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.1782;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="m272.507 63.378 2.539-2.54 34.533 34.534-2.54 2.54z"/></g></svg>`;
            case "oto-left":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.582 -52.916)"><circle style="display:inline;fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><path d="M440.106 187.229v-234.28c0-32.448-26.123-58.57-58.57-58.57H235.11v-29.285l-87.855 58.57 87.855 58.57v-29.285h146.425v234.28z" style="display:inline;opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:3.5398;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="translate(265.834 83.253)scale(.07182)"/><path style="display:inline;opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250" transform="translate(265.834 83.253)scale(.07182)"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:78.6395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M318.994-273.417c-5.057.018-13.917 3.82-15.464 12.011l-9.432 56.672c-5.347-.005-12.373 6.747-12.393 10.483v31.666c1.48 3.84 4.28 6.81 7.239 9.281v25.66c0 3.932 5.894 7.098 13.215 7.098 7.322 0 13.216-3.166 13.216-7.098v-25.66c17.965 2.118 35.595 3.61 52.698 3.603 17.103.005 34.733-1.485 52.698-3.603v25.66c0 3.932 5.894 7.098 13.215 7.098 7.322 0 13.216-3.166 13.216-7.098v-25.66c2.959-2.47 5.76-5.44 7.238-9.281v-31.666c-.018-3.736-7.045-10.489-12.392-10.483l-9.432-56.672c-1.547-8.19-10.407-11.99-15.464-12.01zm10.987 10.319h76.184c8.642.005 17.871 4.984 19.204 11.465l5.692 33.85c.13.84-.421 2.577-1.042 3.549-1.263 1.67-3.46 2.623-6.69 2.62-1.24 0-7.787-.49-7.787-.49-23.458-1.338-30.74-1.284-47.47-1.53-16.73.246-24.01.191-47.468 1.53 0 0-6.548.49-7.787.49-3.231.004-5.428-.95-6.69-2.62-.621-.972-1.173-2.709-1.042-3.549l5.692-33.85c1.332-6.48 10.562-11.46 19.204-11.465m23.34 65.134h29.503l29.612 2.62-.01 5.679H323.71v-5.678zm-49.681 1.092a12.064 12.011 0 0 1 12.064 12.011 12.064 12.011 0 0 1-12.064 12.011 12.064 12.011 0 0 1-12.064-12.01 12.064 12.011 0 0 1 12.064-12.012m128.866 0a12.064 12.011 0 0 1 12.064 12.011 12.064 12.011 0 0 1-12.064 12.011 12.064 12.011 0 0 1-12.064-12.01 12.064 12.011 0 0 1 12.064-12.012m-108.785 12.994h88.715v8.299H323.71zm-.01 14.086h88.715l.01 5.678-29.612 2.62h-29.502l-29.612-2.62z" transform="translate(265.834 83.253)scale(.07182)"/><path style="display:inline;opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45 233.412 -279.264)scale(.07182)" d="M261.378-129.989h50v680h-50z"/></g></svg>`;
            case "oto-right-uturn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.54)scale(.0756)"><circle style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.55757;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M429.75 64.3V-54c0-58.17-46.83-105-105-105s-105 46.83-105 105v186.9h52.5V-54c0-29.085 23.415-52.5 52.5-52.5s52.5 23.415 52.5 52.5V64.3H351l52.5 79.1L456 64.3Z"/><path d="M508.5-159H324.75v52.5H508.5v26.25l79.1-52.5-79.1-52.5z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:7.55757;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path transform="rotate(-45)" style="opacity:1;fill:#f00a0a;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.989h50v680h-50z"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:63.7363;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M311.222-289.2c-4.099.016-11.28 3.096-12.533 9.735l-7.644 45.932c-4.335-.005-10.029 5.468-10.045 8.495v25.666c1.199 3.112 3.469 5.52 5.867 7.522v20.797c0 3.187 4.777 5.753 10.71 5.753 5.935 0 10.712-2.566 10.712-5.753v-20.797c14.56 1.716 28.85 2.926 42.711 2.92 13.862.006 28.15-1.204 42.711-2.92v20.797c0 3.187 4.777 5.753 10.711 5.753s10.711-2.566 10.711-5.753v-20.797c2.398-2.003 4.668-4.41 5.867-7.522v-25.666c-.016-3.027-5.71-8.5-10.044-8.495l-7.645-45.932c-1.253-6.639-8.434-9.719-12.533-9.735zm8.905 8.363h61.746c7.004.005 14.485 4.04 15.565 9.292l4.613 27.436c.106.68-.341 2.088-.844 2.876-1.024 1.353-2.804 2.126-5.423 2.124-1.004 0-6.31-.398-6.31-.398-19.013-1.085-24.915-1.04-38.474-1.24-13.56.2-19.46.155-38.473 1.24 0 0-5.307.398-6.311.398-2.62.002-4.4-.771-5.423-2.124-.503-.788-.95-2.195-.844-2.876l4.613-27.436c1.08-5.252 8.56-9.287 15.565-9.292m18.917 52.79h23.912l24 2.125-.01 4.601h-71.902v-4.601zm-40.266.885a9.778 9.735 0 0 1 9.777 9.735 9.778 9.735 0 0 1-9.777 9.735 9.778 9.735 0 0 1-9.778-9.735 9.778 9.735 0 0 1 9.778-9.735m104.444 0a9.778 9.735 0 0 1 9.778 9.735 9.778 9.735 0 0 1-9.778 9.735 9.778 9.735 0 0 1-9.777-9.735 9.778 9.735 0 0 1 9.777-9.735m-88.169 10.532h71.903v6.726h-71.912zm-.009 11.416h71.903l.009 4.602-24 2.124h-23.911l-24-2.124z"/></g></svg>`;
            case "oto-left-uturn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.582 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><g transform="translate(265.834 83.253)scale(.07182)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.64785;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M85.85 10.7c-.363.001-1 .274-1.11.862l-.678 4.07c-.384 0-.888.485-.89.753v2.275c.106.275.307.489.52.666v1.843c0 .282.423.51.95.51.525 0 .948-.228.948-.51v-1.843c1.29.152 2.557.26 3.785.259 1.228 0 2.495-.107 3.785-.259v1.843c0 .282.423.51.949.51s.949-.228.949-.51v-1.843c.213-.177.414-.39.52-.666v-2.275c-.001-.268-.506-.753-.89-.753l-.678-4.07c-.11-.588-.747-.86-1.11-.862Zm.79.74h5.471c.62.001 1.283.359 1.379.824l.409 2.431c.01.06-.03.185-.075.255-.09.12-.248.189-.48.188-.09 0-.56-.035-.56-.035-1.685-.096-2.207-.092-3.409-.11-1.202.018-1.724.014-3.41.11 0 0-.47.035-.558.035-.233 0-.39-.068-.48-.188a.5.5 0 0 1-.076-.255l.409-2.43c.096-.466.759-.824 1.38-.824m1.676 4.679h2.118l2.127.188v.408h-6.372v-.408zm-3.569.078a.866.863 0 0 1 .867.863.866.863 0 0 1-.867.862.866.863 0 0 1-.866-.862.866.863 0 0 1 .866-.863m9.256 0a.866.863 0 0 1 .866.863.866.863 0 0 1-.866.862.866.863 0 0 1-.867-.862.866.863 0 0 1 .867-.863m-7.813.933h6.371v.596H86.19zm-.001 1.012h6.371l.001.408-2.127.188h-2.118l-2.127-.188z" transform="translate(-893.443 -422.39)scale(13.92379)"/><path style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:6.80155;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M293.745 93.597V-12.87c0-52.351 42.145-94.496 94.496-94.496s94.496 42.145 94.496 94.496v168.203H435.49V-12.869c0-26.176-21.073-47.248-47.248-47.248-26.176 0-47.248 21.072-47.248 47.248V93.597h23.624l-47.248 71.187-47.249-71.187z"/><path d="M222.872-107.365h165.369v47.248H222.872v23.624l-71.187-47.248 71.187-47.248z" style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:6.80155;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45)" d="M261.378-129.989h50v680h-50z"/></g></g></svg>`;
            case "left":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-264.583 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="291.042" cy="79.375" r="26.458"/><g transform="translate(265.834 83.253)scale(.07182)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path d="M491 156v-280c0-38.78-31.22-70-70-70H246v-35l-105 70 105 70v-35h175v280z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:4.2306;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45)" d="M261.378-129.989h50v680h-50z"/></g></g></svg>`;
            case "right":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-317.5 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="343.958" cy="79.375" r="26.458"/><g transform="matrix(-.07182 0 0 .07182 369.166 83.253)"><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:270.699;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="300"/><path d="M491 156v-280c0-38.78-31.22-70-70-70H246v-35l-105 70 105 70v-35h175v280z" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:4.2306;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 100A250 250 0 0 1 601-54a250 250 0 0 1-250 250A250 250 0 0 1 101-54a250 250 0 0 1 250-250"/><path style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" transform="rotate(-45)" d="M261.378-129.989h50v680h-50z"/></g></g></svg>`;
            case "u-turn":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-370.417 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="396.875" cy="79.375" r="26.458"/><g transform="translate(371.668 83.253)scale(.07182)"><circle style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="350"/><circle cy="-54" cx="351" style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:225.582;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" r="250"/><path style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.28921;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M246 16v-175c0-38.78 31.22-70 70-70h70c38.78 0 70 31.22 70 70v315h-70v-315h-70V16h35l-70 105-70-105Z"/><path transform="rotate(-45)" style="opacity:1;fill:#c20b10;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:72.0997;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M261.378-129.99h50v680h-50z"/></g></g></svg>`;
            default:
                return null;
        }
    }
    cameraIcon(type) {
        switch (type) {
            case "speed":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-476.25)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="26.458"/><circle style="fill:#c20b10;fill-opacity:1;stroke-width:4.48117;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="24.701"/><circle style="fill:#fff;fill-opacity:1;stroke-width:3.174;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="26.458" r="17.496"/><g transform="matrix(.38687 0 0 .33923 255.134 -1.055)"><path d="M617.505 48.837h38.475a4 4 45 0 1 4 4v24.06a4 4 135 0 1-4 4h-38.475a4 4 45 0 1-4-4v-24.06a4 4 135 0 1 4-4z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8fa1ad;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M621.583 84.377h30.32v6.337h-30.321v-6.336z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#738b9e;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M627.367 94.392h18.763v5.979h-18.763z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7996b5;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M638.524 110.976h27.88v5.272h-27.88z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7ea1ba;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M632.199 103.618h9.275v12.57H632.2v-12.57z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8ba2b6;fill-opacity:1;stroke:#000;stroke-width:6.20394;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><circle style="font-variation-settings:&quot;wght&quot;900;fill:#b6d5f4;fill-opacity:1;stroke:#000;stroke-width:7.53681;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="636.793" cy="64.936" r="7.183"/></g></g></svg>`;
            case "red_light":
                return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-476.25 -52.917)"><circle style="fill:#e4dfe1;fill-opacity:1;stroke-width:4.79999;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="26.458"/><circle style="fill:#c20b10;fill-opacity:1;stroke-width:4.48117;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="24.701"/><circle style="fill:#fff;fill-opacity:1;stroke-width:3.174;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers" cx="502.708" cy="79.375" r="17.496"/><g transform="translate(-19.723 59.891)scale(.85573)"><path style="font-variation-settings:&quot;wght&quot;900;fill:#5e6261;fill-opacity:1;stroke:#000;stroke-width:2.16141;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M597.163 10.043h9.134a2 2 45 0 1 2 2v16.073a2 2 135 0 1-2 2h-9.134a2 2 45 0 1-2-2V12.043a2 2 135 0 1 2-2z" transform="matrix(1.0615 0 0 .9969 -36.887 .683)"/><ellipse style="font-variation-settings:&quot;wght&quot;900;fill:#d86057;fill-opacity:1;stroke:#000;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="601.854" cy="15.934" rx="3.586" ry="3.712"/><ellipse style="font-variation-settings:&quot;wght&quot;900;fill:#a0e885;fill-opacity:1;stroke:#000;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="601.854" cy="25.936" rx="3.586" ry="3.712"/><path d="M601.856 12.091a3.586 3.712 0 0 0-.56.046 3.586 3.712 0 0 0-.548.136 3.586 3.712 0 0 0-.52.223 3.586 3.712 0 0 0-.48.304 3.586 3.712 0 0 0-.428.378 3.586 3.712 0 0 0-.365.443 3.586 3.712 0 0 0-.294.496 3.586 3.712 0 0 0-.216.538 3.586 3.712 0 0 0-.002.008 4.583 4.743 0 0 1 .411-.426 4.583 4.743 0 0 1 .524-.405 4.583 4.743 0 0 1 .574-.324 4.583 4.743 0 0 1 .613-.237 4.583 4.743 0 0 1 .639-.144 4.583 4.743 0 0 1 .652-.048 4.583 4.743 0 0 1 .232.006 4.583 4.743 0 0 1 .232.018 4.583 4.743 0 0 1 .23.03 4.583 4.743 0 0 1 .229.043 4.583 4.743 0 0 1 .225.054 4.583 4.743 0 0 1 .224.066 4.583 4.743 0 0 1 .22.078 4.583 4.743 0 0 1 .215.09 4.583 4.743 0 0 1 .211.1 4.583 4.743 0 0 1 .206.11 4.583 4.743 0 0 1 .2.123 4.583 4.743 0 0 1 .194.132 4.583 4.743 0 0 1 .187.142 4.583 4.743 0 0 1 .18.152 4.583 4.743 0 0 1 .173.161 4.583 4.743 0 0 1 .164.17 4.583 4.743 0 0 1 .086.1 3.586 3.712 0 0 0-.023-.077 3.586 3.712 0 0 0-.072-.195 3.586 3.712 0 0 0-.082-.19 3.586 3.712 0 0 0-.092-.185 3.586 3.712 0 0 0-.102-.179 3.586 3.712 0 0 0-.112-.173 3.586 3.712 0 0 0-.121-.166 3.586 3.712 0 0 0-.13-.16 3.586 3.712 0 0 0-.138-.151 3.586 3.712 0 0 0-.146-.143 3.586 3.712 0 0 0-.154-.134 3.586 3.712 0 0 0-.161-.126 3.586 3.712 0 0 0-.167-.115 3.586 3.712 0 0 0-.174-.106 3.586 3.712 0 0 0-.178-.095 3.586 3.712 0 0 0-.184-.086 3.586 3.712 0 0 0-.187-.073 3.586 3.712 0 0 0-.192-.064 3.586 3.712 0 0 0-.195-.052 3.586 3.712 0 0 0-.197-.04 3.586 3.712 0 0 0-.2-.03 3.586 3.712 0 0 0-.2-.017 3.586 3.712 0 0 0-.201-.006" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 11.88a4.427 6.689 0 0 0-.692.082 4.427 6.689 0 0 0-.676.245 4.427 6.689 0 0 0-.641.402 4.427 6.689 0 0 0-.593.548 4.427 6.689 0 0 0-.528.681 4.427 6.689 0 0 0-.451.798 4.427 6.689 0 0 0-.363.895 4.427 6.689 0 0 0-.266.97 4.427 6.689 0 0 0-.002.014 5.658 8.548 0 0 1 .507-.767 5.658 8.548 0 0 1 .646-.731 5.658 8.548 0 0 1 .709-.584 5.658 8.548 0 0 1 .757-.427 5.658 8.548 0 0 1 .788-.259 5.658 8.548 0 0 1 .805-.087 5.658 8.548 0 0 1 .287.01 5.658 8.548 0 0 1 .286.033 5.658 8.548 0 0 1 .284.055 5.658 8.548 0 0 1 .282.077 5.658 8.548 0 0 1 .28.098 5.658 8.548 0 0 1 .275.119 5.658 8.548 0 0 1 .272.14 5.658 8.548 0 0 1 .266.16 5.658 8.548 0 0 1 .26.181 5.658 8.548 0 0 1 .254.2 5.658 8.548 0 0 1 .247.22 5.658 8.548 0 0 1 .24.239 5.658 8.548 0 0 1 .23.256 5.658 8.548 0 0 1 .222.274 5.658 8.548 0 0 1 .214.29 5.658 8.548 0 0 1 .202.306 5.658 8.548 0 0 1 .107.18 4.427 6.689 0 0 0-.029-.139 4.427 6.689 0 0 0-.089-.35 4.427 6.689 0 0 0-.101-.342 4.427 6.689 0 0 0-.114-.334 4.427 6.689 0 0 0-.126-.323 4.427 6.689 0 0 0-.138-.312 4.427 6.689 0 0 0-.15-.3 4.427 6.689 0 0 0-.16-.287 4.427 6.689 0 0 0-.17-.273 4.427 6.689 0 0 0-.18-.257 4.427 6.689 0 0 0-.19-.242 4.427 6.689 0 0 0-.2-.226 4.427 6.689 0 0 0-.205-.208 4.427 6.689 0 0 0-.215-.19 4.427 6.689 0 0 0-.22-.173 4.427 6.689 0 0 0-.227-.154 4.427 6.689 0 0 0-.231-.133 4.427 6.689 0 0 0-.237-.114 4.427 6.689 0 0 0-.24-.093 4.427 6.689 0 0 0-.244-.074 4.427 6.689 0 0 0-.246-.052 4.427 6.689 0 0 0-.247-.032 4.427 6.689 0 0 0-.25-.01z" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:2.36782;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 21.908a3.586 3.712 0 0 0-.56.046 3.586 3.712 0 0 0-.548.136 3.586 3.712 0 0 0-.52.223 3.586 3.712 0 0 0-.48.304 3.586 3.712 0 0 0-.428.378 3.586 3.712 0 0 0-.365.443 3.586 3.712 0 0 0-.294.497 3.586 3.712 0 0 0-.216.537 3.586 3.712 0 0 0-.002.008 4.583 4.743 0 0 1 .411-.426 4.583 4.743 0 0 1 .524-.405 4.583 4.743 0 0 1 .574-.324 4.583 4.743 0 0 1 .613-.237 4.583 4.743 0 0 1 .639-.144 4.583 4.743 0 0 1 .652-.048 4.583 4.743 0 0 1 .232.006 4.583 4.743 0 0 1 .232.018 4.583 4.743 0 0 1 .23.03 4.583 4.743 0 0 1 .229.043 4.583 4.743 0 0 1 .225.054 4.583 4.743 0 0 1 .224.066 4.583 4.743 0 0 1 .22.078 4.583 4.743 0 0 1 .215.09 4.583 4.743 0 0 1 .211.1 4.583 4.743 0 0 1 .206.11 4.583 4.743 0 0 1 .2.123 4.583 4.743 0 0 1 .194.132 4.583 4.743 0 0 1 .187.142 4.583 4.743 0 0 1 .18.152 4.583 4.743 0 0 1 .173.161 4.583 4.743 0 0 1 .164.17 4.583 4.743 0 0 1 .086.1 3.586 3.712 0 0 0-.023-.077 3.586 3.712 0 0 0-.072-.195 3.586 3.712 0 0 0-.082-.19 3.586 3.712 0 0 0-.092-.184 3.586 3.712 0 0 0-.102-.18 3.586 3.712 0 0 0-.112-.173 3.586 3.712 0 0 0-.121-.166 3.586 3.712 0 0 0-.13-.16 3.586 3.712 0 0 0-.138-.15 3.586 3.712 0 0 0-.146-.144 3.586 3.712 0 0 0-.154-.134 3.586 3.712 0 0 0-.161-.125 3.586 3.712 0 0 0-.167-.116 3.586 3.712 0 0 0-.174-.106 3.586 3.712 0 0 0-.178-.095 3.586 3.712 0 0 0-.184-.086 3.586 3.712 0 0 0-.187-.073 3.586 3.712 0 0 0-.192-.064 3.586 3.712 0 0 0-.195-.052 3.586 3.712 0 0 0-.197-.04 3.586 3.712 0 0 0-.2-.03 3.586 3.712 0 0 0-.2-.017 3.586 3.712 0 0 0-.201-.006" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.5875;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/><path d="M601.856 21.697a4.427 6.689 0 0 0-.692.082 4.427 6.689 0 0 0-.676.245 4.427 6.689 0 0 0-.641.402 4.427 6.689 0 0 0-.593.548 4.427 6.689 0 0 0-.528.681 4.427 6.689 0 0 0-.451.798 4.427 6.689 0 0 0-.363.895 4.427 6.689 0 0 0-.266.97 4.427 6.689 0 0 0-.002.014 5.658 8.548 0 0 1 .507-.767 5.658 8.548 0 0 1 .646-.731 5.658 8.548 0 0 1 .709-.584 5.658 8.548 0 0 1 .757-.427 5.658 8.548 0 0 1 .788-.259 5.658 8.548 0 0 1 .805-.087 5.658 8.548 0 0 1 .287.01 5.658 8.548 0 0 1 .286.034 5.658 8.548 0 0 1 .284.054 5.658 8.548 0 0 1 .282.077 5.658 8.548 0 0 1 .28.098 5.658 8.548 0 0 1 .275.119 5.658 8.548 0 0 1 .272.14 5.658 8.548 0 0 1 .266.16 5.658 8.548 0 0 1 .26.181 5.658 8.548 0 0 1 .254.2 5.658 8.548 0 0 1 .247.22 5.658 8.548 0 0 1 .24.239 5.658 8.548 0 0 1 .23.256 5.658 8.548 0 0 1 .222.274 5.658 8.548 0 0 1 .214.29 5.658 8.548 0 0 1 .202.307 5.658 8.548 0 0 1 .107.178 4.427 6.689 0 0 0-.029-.137 4.427 6.689 0 0 0-.089-.352 4.427 6.689 0 0 0-.101-.341 4.427 6.689 0 0 0-.114-.334 4.427 6.689 0 0 0-.126-.323 4.427 6.689 0 0 0-.138-.312 4.427 6.689 0 0 0-.15-.3 4.427 6.689 0 0 0-.16-.287 4.427 6.689 0 0 0-.17-.272 4.427 6.689 0 0 0-.18-.257 4.427 6.689 0 0 0-.19-.243 4.427 6.689 0 0 0-.2-.226 4.427 6.689 0 0 0-.205-.208 4.427 6.689 0 0 0-.215-.19 4.427 6.689 0 0 0-.22-.173 4.427 6.689 0 0 0-.227-.153 4.427 6.689 0 0 0-.231-.134 4.427 6.689 0 0 0-.237-.114 4.427 6.689 0 0 0-.24-.093 4.427 6.689 0 0 0-.244-.074 4.427 6.689 0 0 0-.246-.052 4.427 6.689 0 0 0-.247-.032 4.427 6.689 0 0 0-.25-.01z" style="font-variation-settings:&quot;wght&quot;900;opacity:.7;fill:#000;fill-opacity:1;stroke:none;stroke-width:2.36782;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"/></g><g transform="matrix(.32618 0 0 .28601 299.846 54.468)"><path d="M617.505 48.837h38.475a4 4 45 0 1 4 4v24.06a4 4 135 0 1-4 4h-38.475a4 4 45 0 1-4-4v-24.06a4 4 135 0 1 4-4z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8fa1ad;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M621.583 84.377h30.32v6.337h-30.321v-6.336z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#738b9e;fill-opacity:1;stroke:#000;stroke-width:6.35;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M627.367 94.392h18.763v5.979h-18.763z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7996b5;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M638.524 110.976h27.88v5.272h-27.88z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#7ea1ba;fill-opacity:1;stroke:#000;stroke-width:6.08542;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><path d="M632.199 103.618h9.275v12.57H632.2v-12.57z" style="font-variation-settings:&quot;wght&quot;900;display:inline;fill:#8ba2b6;fill-opacity:1;stroke:#000;stroke-width:6.20394;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/><circle style="font-variation-settings:&quot;wght&quot;900;fill:#b6d5f4;fill-opacity:1;stroke:#000;stroke-width:7.53681;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="636.793" cy="64.936" r="7.183"/></g></g></svg>`;
            default:
                return null;
        }
    }
    createEndOfProhibitionsIcon() {
        return `<svg width="200" height="200" viewBox="0 0 52.917 52.917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-.076 30.541)scale(.0756)" style="display:inline"><circle style="opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.65454;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" cx="351" cy="-54" r="340"/><path transform="rotate(45)" style="opacity:1;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.04701;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers" d="M165.011-616.378h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8zm20.05 0h9.8v660h-9.8z"/><path d="M351-404A350 350 0 0 0 1-54a350 350 0 0 0 350 350A350 350 0 0 0 701-54a350 350 0 0 0-350-350m0 49.7A300.3 300.3 0 0 1 651.3-54 300.3 300.3 0 0 1 351 246.3 300.3 300.3 0 0 1 50.7-54 300.3 300.3 0 0 1 351-354.3" style="opacity:1;fill:#0046aa;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:315.815;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"/></g></svg>`;
    }
    addLayerCheckbox() {
        const checkInterval = setInterval(() => {
            const mapCommentsCheckbox = document.getElementById(
                "layer-switcher-item_map_comments",
            );
            if (mapCommentsCheckbox) {
                clearInterval(checkInterval);
                const parentListItem = mapCommentsCheckbox.closest("li");
                const layerItem = document.createElement("li");
                layerItem.innerHTML = `
                    <div class="layer-selector">
                        <wz-checkbox id="layer-switcher-item_${this.layerName}" checked>
                            <div class="layer-selector-container" title="${this.scriptName}">${this.scriptName}</div>
                        </wz-checkbox>
                    </div>`;
                if (parentListItem) {
                    parentListItem.insertAdjacentElement("afterend", layerItem);
                } else {
                    const layerSwitcherList = document.querySelector(
                        ".layer-switcher .list",
                    );
                    if (layerSwitcherList) {
                        layerSwitcherList.appendChild(layerItem);
                    } else {
                        this.log("Could not find layer switcher list to add checkbox.");
                        return;
                    }
                }
                this.commentLayerCheckbox = document.getElementById(
                    `layer-switcher-item_${this.layerName}`,
                );
                if (this.commentLayerCheckbox) {
                    this.layer.setVisibility(this.commentLayerCheckbox.checked);
                    this.commentLayerCheckbox.addEventListener("change", (e) => {
                        this.log(`Layer checkbox toggled: ${e.target.checked}`);
                        this.layer.setVisibility(e.target.checked);
                        if (e.target.checked) {
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
            console.log(
                `%c[${this.scriptName} v${this.version}]%c: ${message}`,
                "color: #3498db; font-weight: bold;",
                "",
            );
        }
    }
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
