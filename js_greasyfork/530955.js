// ==UserScript==
// @name         HIDIVE Video Toggles
// @namespace    Violentmonkey Scripts
// @version      1.07
// @author       Officer Erik 1K-88
// @description  Currently we only have one toggle, it's for the HIDIVE subtitles being able to be switched between Off and the last selected subtitles (Defaults to English when no last selected exists) with the 'C' key.
// @license      BSD 3-Clause
// @match        https://www.hidive.com/*
// @grant        GM.getValue
// @grant        GM.getValues
// @grant        GM.setValue
// @grant        GM.info
// @downloadURL https://update.greasyfork.org/scripts/530952/HIDIVE%20Video%20Toggles.user.js
// @updateURL https://update.greasyfork.org/scripts/530952/HIDIVE%20Video%20Toggles.meta.js
// ==/UserScript==
// Created on 3/26/2025, 10:02:12 AM GMT+0500 (CDT)

/**
 * Formats a date object.
 * @param {Date} date The Date object.
 * @returns The formatted string.
 */
function formatDate(date) {
    const pad = (n, width = 2) => String(n).padStart(width, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);

    // GMT offset in ±HHMM format
    const offsetMinutes = date.getTimezoneOffset();
    const absOffset = Math.abs(offsetMinutes);
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(absOffset / 60));
    const offsetMins = pad(absOffset % 60);
    const gmtOffset = `GMT${offsetSign}${offsetHours}${offsetMins}`;

    // Time zone name (e.g., Eastern Daylight Time)
    const tzName = date.toString().match(/\(([^)]+)\)/)?.[1] || Intl.DateTimeFormat().resolvedOptions().timeZone;

    return `${year}-${month}-${day}  ${hour}:${minute}:${second}.${milliseconds}  (${gmtOffset} [${tzName}])`;
}

class Logger {
    constructor(name) {
        this.information = {
            name: name,
            timeElapsed: 0,
            logs: []
        };
        this.counterNames = [];
        this.counterInfo = {};
        this.startTime = Date.now();
    }

    get logs() {
        return this.information.logs;
    }

    clear() {
        this.startTime = Date.now();
        this.information.timeElapsed = 0;
        this.counterNames = [];
        this.counterInfo = {};
        this.information.logs = []
    }

    send() {
        this.information.timeElapsed = Date.now() - this.startTime;
        console.log(this.information);
    }

    message(type, ...msg) {
        this.logs.push({
            logType: type,
            message: (msg.length == 1 ? msg[0] : msg),
            time: new Date(Date.now()).toTimeString()
        });
    }

    error(...msg) {
        this.message("error", ...msg);
    }

    warn(...msg) {
        this.message("warn", ...msg);
    }

    log(...msg) {
        this.message("log", ...msg);
    }

    count(label) {
        if (!this.counterNames.includes(label)) {
            const index = this.logs.length;
            this.counterInfo[label] = index;
            this.counterNames.push(label);
            this.message("counter", {
                label: label,
                count: 0,
                time: {
                    start: formatDate(new Date(Date.now())),
                    end: ""
                }
            });
        }
        const countInfo = this.logs[this.counterInfo[label]].message;
        countInfo.count += 1;
        countInfo.time.end = formatDate(new Date(Date.now()));
    }
}

async function getVal(key, def) {
    return await GM.getValue(key, def);
}

async function getVals(keys) {
    return await GM.getValues(keys);
}

async function setVal(key, value) {
    return await GM.setValue(key, value);
};

let subtitles = [];
let selected = undefined;
let currentLabel = "";
let subtitlesOff = undefined;
let otherSub = undefined;

function styleChanges(add=true) {
    if (add) {
        // Inject CSS to hide the scrollbar but still allow scrolling
        const style = document.createElement('style');
        style.id = "HHVSstyling";
        style.textContent = `
            /* Hide scrollbar for all elements */
            ::-webkit-scrollbar {
                width: 0px;
                height: 0px;
            }
            html, body {
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none;  /* IE 10+ */
            }
        `;
        document.documentElement.appendChild(style);
    } else {
        const style = document.getElementById("HHVSstyling");
        if (style) {
            style.remove();
        }
    }
}

(async function () {
    'use strict';

    const stored = await getVals({
        selsub: "Subtitles Off",
        othersubtitle: ""
    });

    /**
     * The function to be called when a key is pressed down.
     * @param {KeyboardEvent} e The keyboard event.
     * @returns
     */
    const onKeyDown = async (e) => {
        if (e.key.toLowerCase() === 'c') {
			selected = subtitles.find(el => el.classList.contains('preferences-panel__option--selected'));

			currentLabel = (selected ? selected.getAttribute('aria-label') || '' : '');

			if (currentLabel !== 'Subtitles Off') {
				// If it's not already off, turn it off
				if (subtitlesOff) subtitlesOff.click();
				currentLabel = "Subtitles Off";
			} else {
				// Otherwise, try subtitles, or alert that it doesn't exits.
				if (otherSub) {
					otherSub.click();
					currentLabel = otherSub.getAttribute('aria-label');
				} else {
                    alert(`${otherSub.getAttribute('aria-label')} subtitles aren't avaliable.`);
                    return;
				}
			}
            if (currentLabel !== stored.selsub) {
                stored.selsub = currentLabel;
			    await setVal("selsub", stored.selsub);
            }
		}
    };

    const e2c = () => {
        document.addEventListener('keydown', onKeyDown);
    };

    function checker(
        endCallback = undefined,
        interval = 1000, timeout = 10000,
        logger = new Logger(`${GM.info.script.name}'s Entry Checking`)
    ) {
        const startTime = Date.now();
        const check = setInterval(async () => {
            logger.count("Entry Checking Count");
            const entries = Array.from(document.querySelectorAll('div.preferences-panel__entry'));
            let ending = false;
            if (entries.length != 0) {
                ending = true;
                const subtitlesEntry = entries.find(el => {
                    const first = el.firstElementChild;
                    if (first == null || !first.classList.contains("preferences-panel__title")) {
                        return false;
                    }
                    return first.textContent === "Subtitles";
                });
                //logger.log(entries);
                if (subtitlesEntry) {
                    subtitles = Array.from(subtitlesEntry.getElementsByTagName("ul").item(0).children);
    
                    selected = subtitles.find(el => el.classList.contains('preferences-panel__option--selected'));
                    currentLabel = (selected ? selected.getAttribute('aria-label') || '' : '');
    
                    subtitlesOff = subtitles.find(el => el.getAttribute('aria-label') === 'Subtitles Off');
                    if (stored.othersubtitle === "English") {
                        otherSub = subtitles.find(el => {
                            const label = el.getAttribute('aria-label') || '';
                            return label.includes('English');
                        });
                    } else {
                        otherSub = subtitles.find(el => el.getAttribute('aria-label') === stored.othersubtitle);
                    }
    
                    if (!subtitlesOff) {
                        ending = false;
                        logger.warn("'Subtitles Off' wasn't there, checking again.");
                    } else {
                        if (currentLabel !== stored.selsub) {
                            const storedElm = subtitles.find(el => el.getAttribute('aria-label') === stored.selsub);
                            if (storedElm) {
                                storedElm.click();
                            }
                        }
                    }
                } else {
                    ending = false;
                    logger.warn("Subtitles not found, retrying.");
                }
            } else if (Date.now() - startTime > timeout) {
                ending = true;
                logger.error(`Entry Elements not found within time limit: ${timeout} milliseconds`);
            }
            if (ending) {
                clearInterval(check);
                if (endCallback) {
                    endCallback();
                }
                logger.send();
            }
        }, interval);
    }

    let previousUrl = window.location.href;

    if (previousUrl.includes("hidive.com/video")) {
        if (stored.othersubtitle == "") {
            stored.othersubtitle = "English";
            await setVal("othersubtitle", stored.othersubtitle);
        }
        checker(e2c);
        styleChanges();
    }

    let isOut = false;

    setInterval(async function() {
        if (subtitles.length != 0) {
            selected = subtitles.find(el => el.classList.contains('preferences-panel__option--selected'));
            const label = selected.getAttribute('aria-label');
            if (label !== 'Subtitles Off' && (label !== stored.othersubtitle || (label.includes("English") && stored.othersubtitle !== "English"))) {
                if (label.includes("English")) {
                    stored.othersubtitle = "English";
                } else {
                    stored.othersubtitle = label;
                }
                await setVal("othersubtitle", stored.othersubtitle);
            }
        }
        const currentUrl = window.location.href;
        if (currentUrl !== previousUrl) {
            console.log("URL changed (polling):", currentUrl);
            if (currentUrl.includes("hidive.com/video")) {
                if (!previousUrl.includes("hidive.com/video")) {
                    checker(e2c);
                    styleChanges();
                } else {
                    checker();
                }
                isOut = false;
            } else {
                if (!isOut) {
                    styleChanges(false);
                    document.removeEventListener("keydown", onKeyDown);
                    isOut = true;
                }
            }
            previousUrl = currentUrl;
        }
    }, 100); // Check every 100 milliseconds
})();