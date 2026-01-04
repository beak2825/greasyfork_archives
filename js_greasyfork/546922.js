// ==UserScript==
// @name         RW Start time
// @namespace    http://tampermonkey.net/
// @version      2025-08-23
// @description  Display when a war starts
// @author       olesien
// @license      GNU GPLv3
// @match        https://www.torn.com/factions.php*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs-plugin-utc@0.1.2/dist/dayjs-plugin-utc.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546922/RW%20Start%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/546922/RW%20Start%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    dayjs.extend(dayjsPluginUTC.default)
    let time = null;
    const getLocalePref = () => {
        return String(localStorage?.getItem("locale-pref") ?? "TCT");
    }
    const setLocalePref = (pref) => {
        let newPref = "Both";
        if (pref === "Both") newPref = "TCT";
        if (pref === "TCT") newPref = "Local";
        localStorage.setItem("locale-pref", newPref);
    }
    let hasRendered = () => {
        const bottomBox = document.querySelector("#faction_war_list_id .bottomBox___ui4Jg");
        return bottomBox?.dataset?.edited ?? false;
    };
    // Append the exact time if not already done.
    const renderWar = () => {
        if (!time) return;
        const bottomBox = document.querySelector("#faction_war_list_id .bottomBox___ui4Jg");
        if (!bottomBox || hasRendered()) return;
        const item = document.createElement("span");
        const setText = () => {
            const format = dayjs().format("Z");
            const localePref = getLocalePref();
            switch (localePref) {
                case "TCT": {
                    item.innerText = ` | ${time.utcTime} TCT`;
                    break;
                }
                case "Local": {
                    item.innerText = ` | ${time.localTime} ${format}`;
                    break;
                }
                default: { // Both
                    item.innerText = ` | ${time.localTime} | ${time.utcTime} TCT`;
                    break;
                }
            }
        }
        setText();
        bottomBox.dataset.edited = true;
        bottomBox.appendChild(item);

        item.addEventListener("mouseenter", () => {
            item.style.color = "lightblue";
            item.style.cursor = "pointer";
        });

        item.addEventListener("mouseleave", () => {
            item.style.color = "inherit";
            item.style.cursor = "default";
        });

        item.addEventListener("click", (e) => {
            e.stopPropagation();
            setLocalePref(getLocalePref());
            setText();
        });
    }

    // Check if faction has a valid RW, that has not started. If so, change time variable.
    const checkWar = (data) => {
        const wars = data.wars;
        const rw = data.wars.find(w => w.type === "rank");
        if (!rw) return;
        const start_time = rw.timer;
        if (!rw.timer) return;
        const date = dayjs(rw.timer * 1000).utc();
        if (dayjs().utc().isAfter(date)) return;
        const localTime = date.local().format("ha ddd"); // 1pm Sat
        const utcTime = date.utc().format("ha ddd");
        time = { localTime, utcTime }

        renderWar();
        if (!hasRendered()) {
            // Observe for load
            const initialObserver = new MutationObserver((_, observer) => {
                const panel = document.querySelector("#faction_war_list_id");
                if (panel) {
                    observer.disconnect();
                    renderWar();
                }
            });

            initialObserver.observe(document, { subtree: true, childList: true });
        }
    }

    const origFetch2 = window.fetch;

    // Intercept the request to get war data
    window.fetch = async (url, config) => {
        const response = await origFetch2(url, config);
        if (String(url).indexOf("getwardata") != -1) {
            try {
                const data = await response.clone().json();
                checkWar(data);
            } catch (err) {
                console.error(err);
            }
        }
        return response;
    }
})();