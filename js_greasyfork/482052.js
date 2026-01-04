// ==UserScript==
// @name            R4 Settings
// @description     R4 Settings Library
// @version         1.4.9
// @grant           GM.info
// @grant           GM.addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @require         https://update.greasyfork.org/scripts/482042/1298685/R4%20Images.js
// @require         https://update.greasyfork.org/scripts/482597/1301960/R4%20Utils.js
// ==/UserScript==

    /* ------------------------------------------------- */
    /* --------------Polyfills-------------------------- */
    /* ------------------------------------------------- */


    // Polyfill for Greasemonkey extension

    function R4_addStyle (aCss) {
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
 
    if (GM.info?.scriptHandler === 'Userscripts') {
        console.log("Overriding GM.addStyle for Safari Userscripts extension.");
        GM.addStyle = R4_addStyle;
    }
    
    // Polyfill for Safari Userscripts extension

    const original_GM_xmlHttpRequest = GM.xmlHttpRequest;

    async function R4_xmlHttpRequest(details) {

        if (details.onload) {
            const original_onload = details.onload;
            details.onload = (response) => {
                if (response.responseURL) {
                    response.finalUrl = response.responseURL;
                }
                return original_onload(response);
            }
        }

        return await original_GM_xmlHttpRequest(details);
    }

    GM.xmlHttpRequest = R4_xmlHttpRequest;


/* ------------------------------------------------- */
/* --------------Settings--------------------------- */
/* ------------------------------------------------- */

function R4Settings(options = {}) {

    const utils = R4Utils();
    const images = R4Images();

    GM.addStyle(`
    /* css */

    /* Settings */

    .r4-settings {
        position: relative;
    }

    .r4-settings > ul {
        width: 350px;
        background: #313131;
        border-top: 0;
        position: absolute;
        top: 50px;
        left: 0px;
        white-space: nowrap;
        box-shadow: 0 5px 20px 0px #000;
        border-color: #222d33;
        border-style: solid;
        border-width: 3px 3px 3px 3px;
        padding: 5px 0 0 0;
    }
    .r4-settings > ul:before {
        content: '';
        display: block;
        position: absolute;
        top: -13px;
        left: 20px;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #222d33;
    }

    .r4-settings > ul:after {
        content: '';
        display: block;
        position: absolute;
        top: -9px;
        left: 21px;
        width: 0;
        height: 0;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 9px solid #313131;
    }

    .r4-settings > ul > li,
    .r4-setting-submenu > ul > li {
        color: #777;
        font-size: 10px;
        font-weight: bold;
        margin: 0 !important;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        min-height: 30px;
    }


    .r4-settings > ul > li .r4-setting,
    .r4-setting-submenu > ul > li .r4-setting {
        display: inline-block;
        width: 100%;
    }

    .r4-settings > ul > li .r4-tumbler,
    .r4-setting-submenu > ul > li .r4-tumbler {
        float: right;
    }

    .r4-settings .r4-setting-header {
        text-align: center;
    }

    .r4-settings .r4-setting-text-value {
        display: block;
        opacity: .5;
    }

    .r4-settings .r4-setting-text-block {
        float: left;
        position: relative;
        padding-top: 5px;
    }

    .r4-setting-submenu {
        position: relative;
        cursor: pointer;
    }

    .r4-setting-submenu > ul {
        background: #212121;
        margin: 30px -10px 0;
        padding: 10px 0;
        cursor: auto;
    }

    .r4-settings > ul > li:last-child .r4-setting-submenu > ul {
        margin-bottom: -5px;
    }

    .r4-setting-submenu-arrow {
        float: right;
        width: 15px;
        height: 15px;
        margin-right: 10px;
        margin-top: 5px;
        background-size: 15px 15px;
        background-repeat: no-repeat;
        background-image: url(${images.arrow});
        filter: invert(100%) sepia(95%) saturate(21%) hue-rotate(280deg) brightness(106%) contrast(106%);
        transform: rotate(180deg);
    }

    /* Tumbler */

    .r4-tumbler {
        width: 38px;
        height: 30px;
        background-color: #000;
        border: #1d92b2;
        border-radius: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
        cursor: pointer;
        position: relative;
        user-select: none;
        box-sizing: content-box;
    }
    .r4-tumbler-point {
        border-radius: 50%;
        content: '';
        display: block;
        height: 20px;
        width: 20px;
        background-color: #999;
        background-clip: content-box;
        box-sizing: border-box;
        border-color: transparent;
        border-style: solid;
        border-width: 5px;
    }
    .r4-tumbler > .r4-tumbler-dot {
        position: absolute;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background-color: #fff;
        transition: transform .5s,background-color .5s;
        will-change: transform;
    }

    /* Tumbler On-Off */

    .r4-on-of-tumbler .r4-tumbler-point:nth-child(1) {
        background-color: green;
    }
    .r4-on-of-tumbler .r4-tumbler-point:nth-child(2) {
        background-color: indianred;
    }

    /* Tumbler Settings */

    .r4-tumbler-settings {
        width: 40px !important;
    }
    .r4-tumbler-settings .r4-tumbler-point {
        background-size: 15px 15px;
        background-repeat: no-repeat;
        background-position: center;
        border-width: 2px;
    }
    .r4-tumbler-settings .r4-tumbler-point:nth-child(1) {
        background-image: url('${images.settings}');
        background-color: transparent !important;
    }
    .r4-tumbler-settings .r4-tumbler-point:nth-child(2) {
        background-image: url('${images.settingsclose}');
        background-color: transparent !important;
    }

    .r4-tumbler-settings-update,
    .r4-tumbler-settings-update:hover {
        height: 30px;
        background: #f4363630;
        position: absolute;
        left: 0;
        margin-left: 30px;
        margin-top: 5px;
        border-radius: 30px;
        color: #b44b44 !important;
        line-height: 30px;
        padding: 0 20px 0 40px;
        cursor: pointer;
        text-decoration: none;
    }

    /* Tooltip */

    .r4-tooltip {
        position: relative;
        display: inline-block;
    }

    .r4-tooltip .tooltiptext {
        background: #313131;
        border-top: 0;
        position: absolute;
        top: -10px;
        left: 35px;
        white-space: nowrap;
        box-shadow: 0 5px 20px 0px #000;
        border-color: #222d33;
        border-style: solid;
        border-width: 3px;
        visibility: hidden;
        width: 300px;
        white-space: normal;
        padding: 15px;
        position: absolute;
        z-index: 3;
    }

    .r4-tooltip:hover .tooltiptext {
        visibility: visible;
    }

    .r4-tooltip .tooltiptext:before {
        content: '';
        display: block;
        position: absolute;
        left: -13px;
        top: 11px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid #222d33;
    }

    .r4-tooltip .tooltiptext:after {
        content: '';
        display: block;
        position: absolute;
        left: -9px;
        top: 12px;
        width: 0;
        height: 0;
        border-top: 9px solid transparent;
        border-bottom: 9px solid transparent;
        border-right: 9px solid #222d33;
    }

    .r4-tooltip-icon {
        border-radius: 50%;
        background: #777;
        width: 14px;
        height: 14px;
        display: inline-block;
        text-align: center;
        color: #000;
        text-transform: lowercase;
        cursor: pointer;
        font-family: monospace, monospace;
        font-size: 13px;
        margin: 8px;
    }

    /* !css */
    `);

    const state = {
        events: {
            start: {
                fired: false,
            },
            end: {
                fired: false,
            },
        }
    };

    const elements = {
        tumbler: null,
        dropdown: null,
    };

    buildSettings();

    async function setSetting(name, value) {
        await GM.setValue(name, value);
        console.debug(`Saved setting ${name}: ${JSON.stringify(value)}`);
    }

    async function deleteSetting(name) {
        await GM.deleteValue(name);
    }

    async function getSetting(name) {
        const value = await GM.getValue(name);
        if (value === undefined) {
            return options.missingSettingHandler?.(name);
        }
        console.debug(`Got setting ${name}: ${JSON.stringify(value)}`);
        return value;
    }

    async function setCongigSetting(config, option) {
        if (option.value === undefined) {
            await deleteSetting(config.name);
        } 
        await setSetting(config.name, option.value);
    }

    async function getConfigSetting(config) {
        return await getSetting(config.name);
    }

    async function getCurrentOption(config) {
        const currentSetting = await getConfigSetting(config);

        for (const tumblerOption of config.options) {
            const optionSetting = tumblerOption.value;
            if (optionSetting === currentSetting) {
                return tumblerOption;
            }
        }

        const option = getDefaultOption(config);
        await setCongigSetting(config, option);
        return option;
    }

    async function rotateSetting(config) {
        const currentOption = await getCurrentOption(config);
        const nextOption = getNextOption(config, currentOption);
        await setCongigSetting(config, nextOption);
        setBodyClass(config, nextOption);
        if (nextOption.reload === true) {
            document.location.reload();
        }
        if (nextOption.start) {
            nextOption.start();
        }
        if (nextOption.end) {
            nextOption.end();
        }
    }

    function getDefaultOption(config) {
        for (const tumblerOption of config.options) {
            if (tumblerOption.default === true) {
                return tumblerOption;
            }
        }
        return config.options[0];
    }

    function setBodyClass(config, option) {
        for (const tumblerOption of config.options) {
            if (tumblerOption.class) {
                document.body.classList.remove(tumblerOption.class);
            }
        }

        if (option?.class) {
            document.body.classList.add(option.class);
        }
    }

    function getNextOption(config, option) {
        let nextOptionIndex;
        if (option) {
            const currentOptionIndex = config.options.indexOf(option);
            if (currentOptionIndex < config.options.length - 1) {
                nextOptionIndex = currentOptionIndex + 1;
            } else {
                nextOptionIndex = 0;
            }
        } else {
            nextOptionIndex = 1;
        }
        return config.options[nextOptionIndex];
    }

    function afterStart(callback) {
        if (state.events.start.fired === true) {
            callback();
        } else {
            document.addEventListener("R4SettingsStart", callback);
        }
    }

    function afterEnd(callback) {
        if (state.events.end.fired === true) {
            callback();
        } else {
            document.addEventListener("R4SettingsEnd", callback);
        }
    }

    async function initSetting(config) {
        const currentOption = await getCurrentOption(config);
        afterStart(() => {
            setBodyClass(config, currentOption);
        });
        if (config?.start) {
            afterStart(() => {
                config.start();
            });
        }
        if (currentOption?.start) {
            afterStart(() => {
                currentOption.start();
            });
        }
        if (config?.end) {
            afterEnd(() => {
                config.end();
            });
        }
        if (currentOption?.end) {
            afterEnd(() => {
                currentOption.end();
            });
        }
    }

    function buildSettings() {
        elements.tumbler = buildTumbler({
            handler: toggle,
            name: "settings",
            classes: ["r4-settings", "pull-right"],
            options: [
                {
                    class: null,
                },
                {
                    class: "r4-settings-active",
                },
            ],
        });

        elements.dropdown = utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <ul class="hidden"></ul>
            <!-- !html -->
            `
        );

        elements.tumbler.appendChild(elements.dropdown);

        const header = utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <div class="r4-setting-header"></div>
            <!-- !html -->
            `
        );

        if (options.script_homepage) {
            
            header.appendChild(utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="r4-setting-label">
                    <a href="${options.script_homepage}" target="_blank">
                        ${GM.info.script.name}
                    </a>
                </div>
                <!-- !html -->
                `
            ));
            
            header.appendChild(utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="r4-setting-text-value">
                    <a href="${options.script_homepage}/feedback" target="_blank">
                        ${options.feedback_text || "Feedback"}
                    </a>
                </div>
                <!-- !html -->
                `
            ));

            GM.xmlHttpRequest({
                method: "GET",
                url: options.script_homepage,
                onload(response) {
                    console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                    if (response.status === 200) {
                        const patern = /<a class="install-link" [^>]* data-script-version="(?<version>[^"]*)" [^>]* href="(?<href>[^"]*)"[^>]*>/;
                        const results = patern.exec(response.responseText);
                        if (!results?.groups) {
                            console.debug(`Failed to parse install link`);
                            return;
                        }
                        if (results.groups.version == GM.info.script.version) {
                            return;
                        }
                        console.log(`New version ${results.groups.version} is available`);

                        elements.tumbler.insertBefore(utils.fromHTML(
                            /* html */
                            `
                            <!-- html -->
                            <a class="r4-tumbler-settings-update" href="${results.groups.href}" target="_blank">
                                ${options.update_text || "Update"}
                            </a>
                            <!-- !html -->
                            `
                        ), elements.tumbler.firstChild);
                    }
                },
                onerror(e) {
                    console.debug(`Failed to request install link`);
                    console.debug("Error:", {e});
                },
            });

        } else {
            
            header.appendChild(utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="r4-setting-label">
                    ${GM.info.script.name}
                </div>
                <!-- !html -->
                `
            ));

        }
            
        header.appendChild(utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <div class="r4-setting-text-value">
                ${options.version_text || "Version"}: ${GM.info.script.version}
            </div>
            <!-- !html -->
            `
        ));

        addElementSetting(header);

        document.addEventListener("click", close);
    }

    function toggle(event) {
        elements.dropdown.classList.toggle("hidden");
        event.stopPropagation();
        event.preventDefault();
    }

    function close(event) {
        if (!event.target.closest(".r4-settings")) {
            elements.dropdown.classList.add("hidden");
        }
    }

    function findSubmenu(config) {
        const submenuAll = elements.tumbler.querySelectorAll(".r4-setting-submenu");
        const submenuFiltered = Array.from(submenuAll).find(
            (el) => el.querySelector(".r4-setting-label").textContent === config.submenu
        );
        if (submenuFiltered) {
            return submenuFiltered.querySelector("ul");
        }
    }

    function createSubmenu(config) {
        const submenuItem = utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <li>
                <div class="r4-setting r4-setting-submenu">
                    <span class="r4-setting-submenu-arrow"></span>
                    <ul class="hidden"></ul>
                </div>
            </li>
            <!-- !html -->
            `
        )

        const submenuElem = submenuItem.querySelector(".r4-setting-submenu");
        submenuElem.insertBefore(
            buildSettingTextBlock(config.submenu), 
            submenuElem.firstChild
        );

        const submenu = submenuElem.querySelector("ul");
        submenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        submenuItem.addEventListener("click", (event) => {
            submenu.classList.toggle("hidden");
        });

        elements.dropdown.appendChild(submenuItem);
        return submenu;
    }

    function addElementSetting(element, config) {
        let container;

        if (config?.submenu) {
            let submenu = findSubmenu(config);
            if (!submenu) {
                submenu = createSubmenu(config);
            }
            container = submenu;
        } else {
            const dropdown = elements.tumbler.querySelector("ul");
            container = dropdown;
        }

        const item = document.createElement("li");
        item.appendChild(element);
        container.appendChild(item);
    }

    function buildTumbler(config) {
        const optionsLength = config.options.length;
        const tumblerClassName = `r4-tumbler-${config.name}`;

        GM.addStyle(`
        /* css */

        .${tumblerClassName} {
            width: ${optionsLength * 15 + optionsLength * 5}px !important;
        }

        /* !css */
        `);

        const tumblerWrapper = utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <div class="r4-tumbler-wrapper ${config.classes.join(" ")}">
                <div class="r4-tumbler ${tumblerClassName}"></div>
            </div>
            <!-- !html -->
            `
        );

        const tumbler = tumblerWrapper.querySelector(".r4-tumbler");
        tumbler.addEventListener("click", config.handler);

        for (let optionIndex = 0; optionIndex < optionsLength; optionIndex++) {
            const tumblerOption = config.options[optionIndex];
            const tumblerPoint = utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="r4-tumbler-point"></div>
                <!-- !html -->
                `
            );
            tumbler.appendChild(tumblerPoint);

            if (tumblerOption.class) {
                GM.addStyle(`
                /* css */

                .${tumblerOption.class} .${tumblerClassName} .r4-tumbler-dot {
                    transform: translateX(${optionIndex * 100}%) !important;
                }

                /* !css */
                `);
            } else {
                GM.addStyle(`
                /* css */

                .${tumblerClassName} .r4-tumbler-dot {
                    transform: translateX(${optionIndex * 100}%);
                }

                /* !css */
                `);
            }
        }

        tumbler.appendChild(utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <div class="r4-tumbler-dot"></div>
            <!-- !html -->
            `
        ));

        return tumblerWrapper;
    }

    function buildSettingTextBlock(label) {
        return utils.fromHTML(
            /* html */
            `
            <!-- html -->
            <div class="r4-setting-text-block">
                <span class="r4-setting-label">${label}</span>
            </div>
            <!-- !html -->
            `
        );
    }

    function buildTumblerSetting(config) {
        for (const tumplerOption of config.options) {
            if (tumplerOption.class === undefined && tumplerOption.value !== undefined && tumplerOption.value !== null) {
                tumplerOption.class = `${config.name}-${tumplerOption.value}`;
            }
            if (tumplerOption.value === undefined && tumplerOption.class !== undefined) {
                tumplerOption.value = tumplerOption.class;
            }
        }

        initSetting(config);
        
        const originalHandler = config.handler;
        config.handler = async (event) => {
            await rotateSetting(config);
            originalHandler?.(event);
        };

        const tumblerWrapper = buildTumbler(config);
        tumblerWrapper.classList.add("r4-setting");

        const settingClass = `r4-setting-${config.name}`;
        tumblerWrapper.classList.add(settingClass);

        const settingTextBlock = buildSettingTextBlock(config.label);

        let textValueClassEmpty = null;
        for (const tumblerOption of config.options) {
            if (!tumblerOption.class) {
                const optionIndex = config.options.indexOf(tumblerOption);
                textValueClassEmpty = `r4-setting-text-value-${optionIndex + 1}`;
            }
        }

        const emptySelectors = [];
        for (const tumblerOption of config.options) {
            if (tumblerOption.class) {
                emptySelectors.push(`body.${tumblerOption.class} .${settingClass} .${textValueClassEmpty}`);
            }
        }

        for (const tumblerOption of config.options) {
            const optionIndex = config.options.indexOf(tumblerOption);
            const textValueClass = `r4-setting-text-value-${optionIndex + 1}`;

            settingTextBlock.appendChild(utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <span class="r4-setting-text-value ${textValueClass}">
                    ${tumblerOption.text}
                </span>
                <!-- !html -->
                `
            ));

            if (tumblerOption.class) {
                GM.addStyle(`
                /* css */

                body:not(.${tumblerOption.class}) .${settingClass} .${textValueClass} {
                    display: none !important;
                }

                /* !css */
                `);
            } else {
                GM.addStyle(`
                /* css */

                ${emptySelectors.join(",")} {
                    display: none !important;
                }

                /* !css */
                `);
            }
        }

        tumblerWrapper.appendChild(settingTextBlock);

        return tumblerWrapper;
    }

    function createTumblerSetting(config, wrapSetting = tumblerSetting => tumblerSetting) {
        const tumblerSetting = buildTumblerSetting(config);
        addElementSetting(wrapSetting(tumblerSetting), config);
    }

    if (document.body) {
        state.events.start.fired = true;
    } else {
        new MutationObserver((mutationList, observer) => {
            if (document.body && !state.events.start.fired) {
                document.dispatchEvent(new Event("R4SettingsStart"));
                state.events.start.fired = true;
                observer.disconnect();
            }
        }).observe(document.documentElement, {childList: true});
    }

    if (/complete|interactive|loaded/.test(document.readyState)) {
        state.events.end.fired = true;
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            document.dispatchEvent(new Event("R4SettingsEnd"));
            state.events.end.fired = true;
        });
    }

    return {
        tumbler: elements.tumbler,
        buildTumblerSetting,
        createTumblerSetting,
        addElementSetting,
        setSetting,
        getSetting,
        afterStart,
        afterEnd,
    }
}