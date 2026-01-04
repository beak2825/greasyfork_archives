// ==UserScript==
// @name         WME Quick HN (DaveAcincy fork)
// @description  Quick House Numbers
// @version      2025.06.12.01
// @author       Vinkoy (forked by DaveAcincy)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @namespace    https://greasyfork.org/users/166713
// @homepage     https://www.waze.com/discuss/t/script-wme-quick-hn-daveacincy-fork/327021
// @grant        GM.addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/458651/WME%20Quick%20HN%20%28DaveAcincy%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458651/WME%20Quick%20HN%20%28DaveAcincy%20fork%29.meta.js
// ==/UserScript==

/* global W */
/* global I18n */
/* global WazeWrap */

(function () {
    const debug = false;

    const scriptName = 'Quick HN';
    const scriptId = 'wmeqhn';

    let policySafeHTML;
    let wazeMapObserver;
    let lastHN;
    let nextHNs;
    let interval = 1;
    let modeMultiplier = 1;
    let fillnext = false;
    let { autoSetHN = false, zoomKeys = false, custom = 4 } = JSON.parse(localStorage[scriptId] ?? '{}');

    let wmeSDK;
    unsafeWindow.SDK_INITIALIZED.then(() => {
        wmeSDK = getWmeSdk({ scriptId, scriptName });
        wmeSDK.Events.once({ eventName: 'wme-ready' }).then( () => {
            initialiseQHN();
        });
    });

    function tlog(message, data = '') {
        if (!debug) return;

        const t = new Date;
        const h = t.getHours();
        const m = t.getMinutes();
        const s = t.getSeconds();
        const ms = `${t.getMilliseconds()}`.padStart(3, '0');

        console.log(`QHN: ${h}:${m}:${s}.${ms}: ${message}`, data);
    }

    function createShortcut(shortcutId, description, callback, shortcutKeys) {
        // SDK shortcuts for when that's fixed
        // wmeSDK.Shortcuts.createShortcut({ callback, description, shortcutId, shortcutKeys });

        I18n.translations[wmeSDK.Settings.getLocale().localeCode].keyboard_shortcuts.groups[scriptId].members[shortcutId] = description;
        W.accelerators.addAction(shortcutId, { group: scriptId });
        W.accelerators.events.register(shortcutId, null, callback);
        W.accelerators._registerShortcuts({ [shortcutKeys]: shortcutId });
    }

    function saveQHNOptions() {
        localStorage[scriptId] = JSON.stringify({ autoSetHN, zoomKeys, custom });
    }

    function initialiseQHN() {
        if (typeof trustedTypes !== 'undefined') {
            policySafeHTML = trustedTypes.createPolicy('policySafeHTML', { createHTML: innerText => innerText });
        }

        W.accelerators.Groups[scriptId] = { members: [] };
        I18n.translations[wmeSDK.Settings.getLocale().localeCode].keyboard_shortcuts.groups[scriptId] = { description: scriptName, members: {} };

        createShortcut('WME_QHN_newHN01', "Insert next sequential house number", () => addOrZoom(1), 't');
        createShortcut('WME_QHN_newHN02', "Insert every 2nd house number", () => addOrZoom(2), 'r');
        createShortcut('WME_QHN_newHNcustom', "Insert house number with custom interval", () => addOrZoom(custom), 'e');
        for (let key = 1; key <= 10; key++)
            createShortcut(`WME_QHN_newHN${key}`, `Insert house number ±${key}, or zoom to level ${key + 10}`, () => addOrZoom(key, key + 10), key % 10);

        GM.addStyle('.qhn-panel { color: var(--content_p1); }');

        wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
            tabLabel.id = scriptId;
            tabLabel.innerText = scriptName;
            tabLabel.title = `${scriptName} Settings`;
            tabPane.innerHTML = ((text) => policySafeHTML ? policySafeHTML.createHTML(text) : text)(`
                <div class="qhn-panel"><div><b>Quick House Numbers</b> v${GM_info.script.version}</div><br/>
                <div><input type='checkbox' id='qhnAutoSetHNCheckbox' name='qhnAutoSetHNCheckbox' title="When enabled, auto set next HN updates the last HN based on the last HN moved" ${autoSetHN ? 'checked' : ''}> <label for='qhnAutoSetHNCheckbox'>Auto set next HN on moved HN</label></div>
                <div><input type='checkbox' id='qhnZoomKeysCheckbox' name='qhnZoomKeysCheckbox' title="1-9 => Z11-19; 0 => Z20" ${zoomKeys ? 'checked' : ''}> <label for='qhnZoomKeysCheckbox'>Zoom Keys when no segment</label></div>
                <div>Custom interval (E): <input type='number' id='qhnCustomInput' min='1' value='${custom}' style='width: 50px;'></div><br/>
                <div>Mode: <button name='qhnModeToggle' id='qhnModeToggle'>Increment &uarr;</button></div><br/>
                <div id="qhnTabPane"></div></div>`);

            document.querySelector('#qhnAutoSetHNCheckbox').addEventListener('change', (e) => {
                autoSetHN = e.target.checked;
                saveQHNOptions();
            });

            document.querySelector('#qhnZoomKeysCheckbox').addEventListener('change', (e) => {
                zoomKeys = e.target.checked;
                saveQHNOptions();
                updateTabPane();
            });

            document.querySelector('#qhnCustomInput').addEventListener('change', (e) => {
                custom = e.target.value;
                e.target.blur();
                saveQHNOptions();
                updateNextHNs();
            });

            document.querySelector('#qhnModeToggle').addEventListener('click', (e) => {
                modeMultiplier *= -1;
                e.target.innerHTML = (modeMultiplier > 0 ? 'Increment &uarr;' : 'Decrement &darr;');
                e.target.blur();
                updateNextHNs();
            });

            updateNextHNs();
        });

        wazeMapObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.className === 'house-number is-active') {
                        const hnInput = node.querySelector('input');
                        if (hnInput) hnInput.onfocus = () => setHN();
                    }
                }
            }
        });

        wmeSDK.Events.on({
            eventName: 'wme-selection-changed', eventHandler: () => {
                if (wmeSDK.Editing.getSelection()?.objectType === 'segment')
                    wazeMapObserver.observe(document.querySelector('#WazeMap'), { childList: true, subtree: true });
                else
                    wazeMapObserver.disconnect();
                updateTabPane();
            }
        });

        wmeSDK.Events.on({
            eventName: "wme-house-number-added",
            eventHandler: handleHNAdded
        });
        wmeSDK.Events.on({
            eventName: "wme-house-number-moved",
            eventHandler: handleHNMoved
        });

        console.log("Quick HN: initialize complete");
    }
    function handleHNAdded(e) {
        const hnid = e.houseNumberId;
        // SDK need - wmeSDK.DataModel.HouseNumbers.getById({houseNumberId:hnid});
        const hn = W.model.segmentHouseNumbers.getObjectById(hnid)?.attributes.number;
        tlog('hn added event: ' + hn,e);
        lastHN = hn;
        updateNextHNs();
        setTimeout(displayQHNtab, 110);
    }
    function handleHNMoved(e) {
        const hnid = e.houseNumberId;
        const hn = W.model.segmentHouseNumbers.getObjectById(hnid)?.attributes.number;
        if (autoSetHN) {
            tlog('hn moved event: ' + hn,e);
            lastHN = hn;
            updateNextHNs();
            setTimeout(displayQHNtab, 110);
        }
    }

    function addOrZoom(newInterval, zoom) {
        if (!newInterval) return;

        if (wmeSDK.Editing.getSelection()?.objectType == 'segment') {
            interval = Number(newInterval);
            fillnext = true;

            tlog('setFocus');

            document.querySelector('wz-button:has(.w-icon-home)').click(); // click add HN button
        }
        else if (zoomKeys && zoom) wmeSDK.Map.setZoomLevel( { zoomLevel: zoom } );
    }

    async function displayQHNtab() {
        // first click on userscript tab if its not selected
        const scr = document.querySelector('#drawer > wz-navigation-item[data-for="userscript_tab"]');
        if (scr && scr.getAttribute('selected')== 'false') { scr.click(); }

        await new Promise(r => setTimeout(r, 50));
        // then click on our tab
        document.querySelector(`#${scriptId}`).click();
    }

    async function setHN() {
        tlog('setHN');
        const hnInput = document.querySelector('div.house-number.is-active input:placeholder-shown');
        if (!fillnext || !hnInput) return;

        fillnext = false;

        // React hack: https://github.com/facebook/react/issues/11488#issuecomment-884790146
        hnInput.value = nextHNs[interval][0];
        hnInput._valueTracker?.setValue("");
        hnInput.dispatchEvent(new Event("input", { bubbles: true }));

        await new Promise(r => setTimeout(r, 100));
        hnInput.blur();
    }

    function updateNextHNs() {
        nextHNs = {};

        for (const interval of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, custom]) {
            nextHNs[interval] = new Array(3);
            let baseHN = lastHN ?? '0';

            for (let index = 0; index < nextHNs[interval].length; index++) {
                const nextParts = baseHN.match(/[0-9]+|[a-z]|[A-Z]|\S/g);

                let thisInterval = interval;
                for (const [index, part] of nextParts.reverse().entries()) {
                    if (!Number.isNaN(Number(part))) {
                        nextParts[index] = Math.max(1, Number(part) + (thisInterval * modeMultiplier)).toString().padStart(part.length, '0');
                        break;
                    }

                    if (/[a-z]/i.test(part)) {
                        let nextLetter = part.codePointAt(0) + ((thisInterval % 26) * modeMultiplier);
                        thisInterval = Math.floor(thisInterval / 26);

                        if ((/[a-z]/.test(part) && nextLetter > 'z'.codePointAt(0)) ||
                            (/[A-Z]/.test(part) && nextLetter > 'Z'.codePointAt(0))) {
                            nextLetter -= 26;
                            thisInterval++;
                        }

                        if ((/[a-z]/.test(part) && nextLetter < 'a'.codePointAt(0)) ||
                            (/[A-Z]/.test(part) && nextLetter < 'A'.codePointAt(0))) {
                            nextLetter += 26;
                            thisInterval++;
                        }

                        nextParts[index] = String.fromCodePoint(nextLetter);

                        if (!thisInterval) break;
                    }
                }

                baseHN = nextParts.reverse().join('');
                nextHNs[interval][index] = baseHN;
            }
        }

        updateTabPane();
    }

    function updateTabPane() {
        document.querySelector('#qhnTabPane').innerHTML = lastHN ?
            `<div>Last house number: <b>${lastHN}</b></div><br/><div>Press...` +
            [['T', 1], ['R', 2], ['E', custom], ...[...Array(10).keys()].map(key => [(key + 1) % 10, key + 1])].reduce((list, [key, interval]) =>
                `${list}<br/><b>${key}</b> ${zoomKeys && Number.isInteger(key) && wmeSDK.Editing.getSelection()?.objectType !== 'segment'
                    ? `to zoom to level ${interval + 10}`
                    : `for HN${modeMultiplier > 0 ? "+" : "-"}${interval} <i>(${nextHNs[interval].join(", ")}...)</i>`}`
                , '')
            : "Manually set a house number to start using Quick HN";
    }
})();
