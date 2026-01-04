// ==UserScript==
// @name         🦖 DINO Enhancer🦖
// @version      2/14/2025
// @description  Several FoE Helper and DINO enhancements
// @author       Vicarius
// @match        https://*.forgeofempires.com/game/index*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1418467
// @downloadURL https://update.greasyfork.org/scripts/522545/%F0%9F%A6%96%20DINO%20Enhancer%F0%9F%A6%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522545/%F0%9F%A6%96%20DINO%20Enhancer%F0%9F%A6%96.meta.js
// ==/UserScript==

// =========================================================================================================================//
// =====     Info Box     ==================================================================================================//
// =========================================================================================================================//

(function() {
    const style = document.createElement('style');
    style.textContent = `
        /*  Force .window-box to a fixed position, e.g. top:100px, left:200px */
    #BackgroundInfo.window-box {
        position: absolute !important;
        top: 1030px !important;
        left: 2001px !important;
        pointer-events: auto !important;
        user-select: none !important;
    }
        }
    `;
    document.head.appendChild(style);
})();

// =========================================================================================================================//
// =====     Info Box Style Adjustments     ================================================================================//
// =========================================================================================================================//

(function () {
    'use strict';

    const myUiIDs = [
        "DINO_UI",
        "Settings_SettingsPanel",
        "DINO_debugLogsPopup",
        "DINO_manualEntryPopup",
        "LockableUI_Container"
    ];

    function adjustCloseBox() {
        const closeButton = document.getElementById("cb-close-all-windows");
        if (closeButton) {
            // Only resize the existing close button; remove our injected close logic
            closeButton.style.width       = "26px";
            closeButton.style.height      = "26px";
            closeButton.style.fontSize    = "26px";
            closeButton.style.textAlign   = "center";
            closeButton.style.lineHeight  = "26px";
            closeButton.style.display     = "flex";
            closeButton.style.justifyContent = "center";
            closeButton.style.alignItems  = "center";
        } else {
            setTimeout(adjustCloseBox, 500);
        }
    }

    const observer = new MutationObserver(() => {
        adjustCloseBox();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('DOMContentLoaded', adjustCloseBox);
    adjustCloseBox();
})();

// =========================================================================================================================//
// =====     Info Box Clone with Dino Close Features     ===================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    // List of extra UI panels to close
    const myUiSelectors = [
        "#DINO_UI",
        "#Settings_SettingsPanel",
        "#DINO_debugLogsPopup",
        "#DINO_manualEntryPopup",
        "#LockableUI_Container",
        "#game_body > div.custom-toast-notification"
    ];

    function replicateCloseButton() {
        const closeButton = document.getElementById("cb-close-all-windows");
        if (!closeButton) {
            setTimeout(replicateCloseButton, 500);
            return;
        }

        // Ensure parent is inline-flex so both buttons stay side by side
        const parent = closeButton.parentElement;
        if (parent) {
            parent.style.display = "inline-flex";
            parent.style.flexWrap = "nowrap";
            parent.style.alignItems = "center";
        }

        // Clone the original button
        const dinoCloseButton = closeButton.cloneNode(true);

        // Rename and re-label the clone, remove original onclick
        dinoCloseButton.id = "cb-close-all-dino-windows";
        dinoCloseButton.textContent = "X";
        dinoCloseButton.removeAttribute("onclick");

        // Arrange them horizontally
        closeButton.style.display = "inline-flex";
        dinoCloseButton.style.display = "inline-flex";
        dinoCloseButton.style.marginLeft = "8px";

        // Custom close logic for the new button
        dinoCloseButton.onclick = () => {
            myUiSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = "none";
                });
            });
        };

        // Insert the new “X” button to the right of the original
        closeButton.insertAdjacentElement("afterend", dinoCloseButton);
    }

    replicateCloseButton();
})();

// =========================================================================================================================//
// =====     Info Box Text and Scroll    ===================================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    function removeInfoboxText() {
        const spanElement = document.querySelector('#BackgroundInfoHeader > span');
        if (spanElement) {
            spanElement.textContent = '';
        } else {
          setTimeout(removeInfoboxText, 500);
        }
    }

    const observer = new MutationObserver(mutations => {
      removeInfoboxText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('DOMContentLoaded', removeInfoboxText);
    removeInfoboxText();

})();

(function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Make #BackgroundInfoBody scrollable but hide the scrollbar */
        #BackgroundInfoBody {
            overflow-y: auto !important;
            -ms-overflow-style: none !important;  /* IE/Edge 10+ */
            scrollbar-width: none !important;     /* Firefox */
        }
        #BackgroundInfoBody::-webkit-scrollbar {
            width: 0px !important;               /* Chrome/Safari/Opera */
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
})();

// =========================================================================================================================//
// =====     GbG Enchancer     =============================================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    const sectorNameMapping = { 'A1M': 'A1', 'B1O': 'B1', 'C1N': 'C1', 'D1B': 'D1', 'X1X': 'X1' };

    let raceState = {};
    let highlightState = {};
    let deadlineState = {};

    const RACE_KEY = 'GbG_RaceState';
    const HIGHLIGHT_KEY = 'GbG_HighlightState';
    const DEADLINE_KEY = 'GbG_DeadlineState';

    function loadState() {
        try {
            const rawRace = localStorage.getItem(RACE_KEY);
            if (rawRace) {
                raceState = JSON.parse(rawRace);
            }
        } catch(e) {
        }
        try {
            const rawHighlight = localStorage.getItem(HIGHLIGHT_KEY);
            if (rawHighlight) {
                highlightState = JSON.parse(rawHighlight);
            }
        } catch(e) {
        }
        try {
            const rawDeadline = localStorage.getItem(DEADLINE_KEY);
            if (rawDeadline) {
                deadlineState = JSON.parse(rawDeadline);
            }
        } catch(e) {
        }

        const now = Date.now();
        for (const timerId in deadlineState) {
            if (deadlineState.hasOwnProperty(timerId)) {
                if (now > deadlineState[timerId]) {
                    delete raceState[timerId];
                    delete highlightState[timerId];
                    delete deadlineState[timerId];
                }
            }
        }
        saveState();
    }

    function saveState() {
        localStorage.setItem(RACE_KEY, JSON.stringify(raceState));
        localStorage.setItem(HIGHLIGHT_KEY, JSON.stringify(highlightState));
        localStorage.setItem(DEADLINE_KEY, JSON.stringify(deadlineState));
    }

    function getCountdownSeconds(timerId) {
        const counter = document.querySelector(`#counter-${timerId}`);
        if (!counter) return 0;
        const parts = counter.textContent.trim().split(':');
        if (parts.length !== 3) return 0;
        const [h, m, s] = parts.map(p => parseInt(p, 10));
        return (h * 3600) + (m * 60) + s;
    }

    function updateDeadline(timerId, row, isOn) {
        const highlightOn = highlightState[timerId] === true;
        const raceOn = raceState[timerId] === true;

        if (highlightOn || raceOn) {
            const secs = getCountdownSeconds(timerId);
            const expiry = Date.now() + ((secs + 10) * 1000);
            deadlineState[timerId] = expiry;
        } else {
            delete deadlineState[timerId];
        }
        saveState();
    }

    function observeRowHighlight(row) {
        const timerId = row.id.split('-')[1];
        if (!timerId) return;

        if (highlightState[timerId]) {
            row.classList.add('highlight-row');
        }

        const mo = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isHighlighted = row.classList.contains('highlight-row');

                    highlightState[timerId] = isHighlighted;
                    updateDeadline(timerId, row, isHighlighted);
                }
            }
        });
        mo.observe(row, { attributes: true });
    }

    function copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text).then(() => {
            }).catch(err => {
            });
        }
    }

    function convertTo24Hour(timeString) {
        const [time, meridiem] = timeString.split(' ');
        let [hour, minute] = time.split(':').map(Number);
        if (meridiem === 'PM' && hour !== 12) {
            hour += 12;
        }
        if (meridiem === 'AM' && hour === 12) {
            hour = 0;
        }
        return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`;
    }

    function convertCSTtoEST(timeString) {
        const [hourStr, minuteStr, secondStr] = timeString.split(':');
        let hour = parseInt(hourStr, 10);
        hour += 1;
        if (hour >= 24) hour -= 24;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:${minuteStr} ${ampm}`;
    }

    function getColorName(battletypeSpan) {
        if (battletypeSpan.classList.contains('BTattack')) {
            return 'Red';
        } else if (battletypeSpan.classList.contains('BTdefence')) {
            return 'Blue';
        }
        return 'Unknown';
    }

    function removeSelectAllButton() {
        const selectAllButton = document.querySelector('#LiveGildFightingBody > div > button.btn-default.copybutton.all');
        if (selectAllButton) {
            selectAllButton.remove();
        } else {
        }
    }

    function disableRowSelection(tbody) {
        if (!tbody) return;
        tbody.style.userSelect = 'none';
        tbody.style.cursor = 'default';

        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.userSelect = 'none';
            row.style.cursor = 'default';
        });
    }

    function renameSectorsInUI(table) {
        const sectorNameElements = table.querySelectorAll('td.prov-name > b');
        sectorNameElements.forEach(element => {
            const originalName = element.textContent.trim();
            if (sectorNameMapping.hasOwnProperty(originalName)) {
                const newName = sectorNameMapping[originalName];
                element.textContent = newName;
            }
        });
    }

    function mapBattleCode(battleCode) {
        return sectorNameMapping[battleCode] || battleCode;
    }

    (function() {
        const style = document.createElement('style');
        style.textContent = `
            td.prov-name > span.province-color {
                display: none !important;
            }
            #LiveGildFightingBody {
                overflow-y: scroll;
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            #LiveGildFightingBody::-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
            #LiveGildFighting > div.window-grippy {
                opacity: 0 !important;
                pointer-events: all !important;
                cursor: se-resize !important;
            }

            /* Force .window-box to a fixed position for #LiveGildFighting if desired */
            #LiveGildFighting.window-box {
                position: absolute !important;
                top: 754px !important;
                left: 2001px !important;
                pointer-events: auto !important;
                user-select: none !important;
            }
        `;
        document.head.appendChild(style);
    })();

    function CopyAllImageElement() {
        const defaultImageURL = 'data:image/png;base64,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';
        const pressedImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB60lEQVR4nO3YP6iNcRzH8eN/ShLDHQwGKZkMYrAoSroGpKQMJotsjGxWRoMMFhnZGAxume5kEMXAubmlJErIv5d+OeV4zu9czz3f43fP8HvXs72f53w+z/N7fr/z/DqdSqVSqVQqkwUO4zW6ODQutyjYjc/+0B2HWxRsxry/eRl1i4K1mG0E+4kTEbcoWIZbBrkccYuDS5lgd7A84hYFR/GjEewJ1kfcomAnPjaCvcXWiFsUTOFVI9hX7Iu4RcFqPMyM9TMRtzi4ngl2JeoWBRcywe5jZcQtCg7ieyPYM2yIuEXBdrxvBHuHbRG3KNiI541g37A/4hYFq/AgM9bPRtzi4Fom2I2oWxScywSbSWtDxF2Q9HWFud5xpBMEB3pju58X2BRx/0mvQP/LNfJ/+zS79GaZfj5gR8QdpcjIZdI8j6eNa6X1YDritiYNp8zjXVQZrMC9zFg/H3EXDY5nyqQ7dKrl+VczwW5G3aJlcDoT7BHWRNyiZbAXXxp++n6YirhFy2AL3jS8T9iVuWZrt2gZrMPjlls4rd3/QvqhIbPZSdw1yMXMAntsIbcY8mVy3E77TkPWpaHupJWZTTuAff5cW3eSysynvdgWC2zWXRIMTgBpN3xP1F0S/L7b3d4xPS63UqlUKpXOEvMLL0qUfU9KJFoAAAAASUVORK5CYII=';

        const img = document.createElement('img');
        img.src = defaultImageURL;
        img.style.width = '20px';
        img.style.height = '30px';

        img.togglePressedState = function() {
            img.src = pressedImageURL;
            setTimeout(() => {
                img.src = defaultImageURL;
            }, 2000);
        };
        return img;
    }

    function CopyNextImageElement() {
        const defaultImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFiklEQVR4nO2Ze2wURRzHR+UhJgom/oExIvJUwyNt03b3Zq4XeQlCDAk2QRENwaAIgiaSgBB5KISAVUu43Z3dShUCgYvviOEhgiC9mbOAQRGkdPcAoTHRIOCjUsrPzPZuu72+9u6aO9D7Jr+kO92d/D77+/1mZ36HUE45/T8l06jPV2HJ6EaXpFtR2TBNdKNLrjCnS3p0Wrb9yElIMmqflXVrObqeRJl/osbwPsrIccqwQcOkuKP7A5VWH8mw6iXdvFpAz93mGr9V0q2dkm6tQJkWZWSyxsg1ygnEzb5meFM5K7qjrWck3XxaNiyQdPNL97hsmLOaxq2dKJOqPBLoQxn+3Q3Rwhg5RSNyYRsgG4TDMjXnx8cCS/d2kw3rpD1eYU3OKIjG/AvahXBgcL3KyOPu52Td4sLhYuN0gQNn1M61IXTzx9IQ3JJhEHywU5DmVHulGSQ6SqRR/BrT2n6Sbl5oAqmdlFEIWl3QnTJyxQuIKzqLEufxVRy/XTaso3ZtGOYWlGkpEd/QpCC4A+NERkim1lQ7EoZ5SCo70yvjIDrDUkognIDGyYvxecTyK+nRmYWVVt+0HFIiZADleCVlZDPlJBQ3jWGdcryGcrKYMjxX52SSuHcpoJvFczRCxqQKQhlppGEyNdEXP43eLenWS5Jufi4Z1mXZsPZ5giirknpRhs8n6chflOHDlOFvUgbh9gLwj8bJaLc/kmHtb0qzmOlWyBOIGvY9mo4z6ZrG8AVRaw6IHp0m6ea7YjMpooO8SuN4iXviXTWL4WL9OahvuGRb47UG528xXnf5KNT+tgeO1m2D8On1sOfUcth4+LF0YX4SH1aUjijHW9yT/vpnDSQrAajzkjRhyBehUGnqH0HKyS73hPwsTRqkofFvqIg83AWphtekExGWOOGG6rHw3qEJrWzLd6Xw6bHZsLtmCRyMvgNHzm+CY798DNtPvNx1dRP2T0kJRONkfzaLnbZR/LQa90s+Iox8lm3naet6+SgVEDXbjtPWUfkjeRBO5mXbcdrK8MmkQTTuL8lyGsGa7XJiRIIdOg2AboIg8oGCZoGKxoqx0A8P9RChzBbI/LX58MiUB5ohOL6qczKkYxAFzQEFQczqoRz1tKPC8I6sRKMKQ6E8CF57v7B5nJGtnaYRBNFKByKIZsTHVYZnZgNkxqKRMM4VDcpxgxKRh3kBuRcUdDEGsxXKkH2IUQ6QO8W5OpMQr28rhhEjB8JaV31oHL/VKYQNEkI9IIg+cNIriJwtgcbxxnSdCx7AsMhwpUk7VrZDhvzCQbAgWOBKKVxHq8f09gaioFddEKdBQaPi/xMtm3RB3t7tg2HDB3R6j+QfbKeVqy4aaQRP8ARhg6horgtkD6joOaCod3sbSE/G8Bm7sxi7LsKDYdnmojbvXfVhMeQXDWoJ0XTsXeUZwll+FbQQguiSC2izAxImxfbb8dzeIaroJCqRkrz4+Ow38iAwfiioVS3uhTmr82Bk3kCYtzY/ca6vlu4NdEsKxAEKohUxiCsQRC06erEzescQHJvuI2r5yfE944uFGsYw8YkHgYweAi+szIMZC0eAHBgMJeOGwupPpIRoku/FQpMShA2ioLoYSBgUNB0UNAnWo77xD6R4S21D4AbKyJu0usBpOjsvgOGvHdAwsQu59Plh8OT84bB4Q+sFQOMkqlZJ96QMEQNZ5/owxlNse0JDojxhSd5Lq/z57c0puize64qc0Jn//rQgHBgVYQiiZaJGBAQoqFVrRiyH6rf+Ii9vTkSJcvJz5yCY0erAXeh6VlPDDl9uJwqNlOF1baVllwhU1B8UVAnr0X1dMZ8aDvTXGK7UOD4rfm7QOKmhnFBPW490BAp6JlYjT6EbWdC0bRkHFHXPti855ZRTTug/o38BG8Uz47E8Uw4AAAAASUVORK5CYII=';
        const pressedImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB60lEQVR4nO3YP6iNcRzH8eN/ShLDHQwGKZkMYrAoSroGpKQMJotsjGxWRoMMFhnZGAxume5kEMXAubmlJErIv5d+OeV4zu9czz3f43fP8HvXs72f53w+z/N7fr/z/DqdSqVSqVQqkwUO4zW6ODQutyjYjc/+0B2HWxRsxry/eRl1i4K1mG0E+4kTEbcoWIZbBrkccYuDS5lgd7A84hYFR/GjEewJ1kfcomAnPjaCvcXWiFsUTOFVI9hX7Iu4RcFqPMyM9TMRtzi4ngl2JeoWBRcywe5jZcQtCg7ieyPYM2yIuEXBdrxvBHuHbRG3KNiI541g37A/4hYFq/AgM9bPRtzi4Fom2I2oWxScywSbSWtDxF2Q9HWFud5xpBMEB3pju58X2BRx/0mvQP/LNfJ/+zS79GaZfj5gR8QdpcjIZdI8j6eNa6X1YDritiYNp8zjXVQZrMC9zFg/H3EXDY5nyqQ7dKrl+VczwW5G3aJlcDoT7BHWRNyiZbAXXxp++n6YirhFy2AL3jS8T9iVuWZrt2gZrMPjlls4rd3/QvqhIbPZSdw1yMXMAntsIbcY8mVy3E77TkPWpaHupJWZTTuAff5cW3eSysynvdgWC2zWXRIMTgBpN3xP1F0S/L7b3d4xPS63UqlUKpXOEvMLL0qUfU9KJFoAAAAASUVORK5CYII=';

        const img = document.createElement('img');
        img.src = defaultImageURL;
        img.style.width = '20px';
        img.style.height = '30px';

        img.togglePressedState = function() {
            img.src = pressedImageURL;
            setTimeout(() => {
                img.src = defaultImageURL;
            }, 2000);
        };
        return img;
    }

    function CopyRacesImageElement() {
        const defaultImageURL = 'data:image/png;base64,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';
        const pressedImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAQAAAA9bl7IAAAATElEQVR4nGNgGBSQBRm/BpBjIGEnCRTr/v379+CBDycFjIjIyPjnHr1ix8+vh48fPf4SBIDAcDWw6QJqBNIJ0AP+hfKXikMgNGXeCO/DSBh4HAEJuJYNkTQ0ZAAAAAElFTkSuQmCC';

        const img = document.createElement('img');
        img.src = defaultImageURL;
        img.style.width = '20px';
        img.style.height = '30px';

        img.togglePressedState = function() {
            img.src = pressedImageURL;
            setTimeout(() => {
                img.src = defaultImageURL;
            }, 2000);
        };

        return img;
    }

    function addCopyAllButton(container) {
        if (!container) return;
        if (container.querySelector('.custom-copy-all-anchor')) return;

        const li = document.createElement('li');
        li.className = 'gbgprogress game-cursor';

        const copyAllAnchor = document.createElement('a');
        copyAllAnchor.href = '#copyall';
        copyAllAnchor.className = 'game-cursor custom-copy-all-anchor';
        copyAllAnchor.title = 'Copy Selected';

        const img = CopyAllImageElement();
        copyAllAnchor.appendChild(img);
        li.appendChild(copyAllAnchor);
        container.appendChild(li);

        copyAllAnchor.addEventListener('click', (evt) => {
            evt.stopPropagation();

            img.togglePressedState();

            try {
                const tbody = document.querySelector('#gbgnextup #nextup > table > tbody');
                if (!tbody) return;
                const timerRows = tbody.querySelectorAll('[id^="timer-"]');
                if (!timerRows.length) return;

                let copyText = 'Upcoming Sectors:\n\n';

                timerRows.forEach(timerRow => {
                    const timerId = timerRow.id.split('-')[1];
                    if (!highlightState[timerId]) return;

                    const provNameCell = timerRow.querySelector('td.prov-name');
                    let battleCode = provNameCell.querySelector('b').textContent.trim();
                    battleCode = mapBattleCode(battleCode);

                    const battletypeSpan = provNameCell.querySelector('span.battletype');
                    const colorName = getColorName(battletypeSpan);

                    const ownerCell = timerRow.querySelector('td:nth-child(2)');
                    const ownerName = ownerCell ? ownerCell.textContent.trim() : '';

                    const timeStaticCell = timerRow.querySelector('td.time-static');
                    if (!timeStaticCell) return;
                    const originalTime = timeStaticCell.getAttribute('data-original-time');
                    if (!originalTime) return;

                    const estTime = convertCSTtoEST(originalTime);
                    const timeDynamic = timerRow.querySelector(`#counter-${timerId}`).textContent.trim();

                    let prefix = raceState[timerId] ? 'Race - ' : '';
                    copyText += `- ${prefix}${battleCode} (${colorName}) opens @ ${estTime} (${timeDynamic}) Owner:${ownerName}\n`;
                });
                copyToClipboard(copyText);
            } catch (err) {
            }
        });
    }

    function addCopyNextButton() {
        const container = document.querySelector('#LiveGildFightingBody > div > ul');
        if (!container) return;
        if (container.querySelector('.custom-copy-next-anchor')) return;

        const li = document.createElement('li');
        li.className = 'gbgprogress game-cursor';

        const copyNextAnchor = document.createElement('a');
        copyNextAnchor.href = '#copynext';
        copyNextAnchor.className = 'game-cursor custom-copy-next-anchor';
        copyNextAnchor.title = 'Copy Next Sector';

        const img = CopyNextImageElement();
        copyNextAnchor.appendChild(img);
        li.appendChild(copyNextAnchor);
        container.appendChild(li);

        copyNextAnchor.addEventListener('click', () => {
            img.togglePressedState();

            const nextSector = document.querySelector('#nextup > table > tbody > tr:first-child');
            if (!nextSector) return;

            const timerId = nextSector.id.split('-')[1];
            const provNameCell = nextSector.querySelector('td.prov-name');
            const battleCodeOriginal = provNameCell.querySelector('b').textContent.trim();
            const battleCode = mapBattleCode(battleCodeOriginal);

            const battletypeSpan = nextSector.querySelector('td.prov-name > span.battletype');
            const colorName = getColorName(battletypeSpan);

            const ownerCell = nextSector.querySelector('td:nth-child(2)');
            const ownerName = ownerCell ? ownerCell.textContent.trim() : '';

            const timeStaticCell = nextSector.querySelector('td.time-static');
            if (!timeStaticCell) return;
            const originalTime = timeStaticCell.getAttribute('data-original-time');
            const estTime = convertCSTtoEST(originalTime);
            const timeDynamic = nextSector.querySelector(`#counter-${timerId}`).textContent.trim();

            let copyText = `${battleCode} (${colorName}) opens @ ${estTime} (${timeDynamic}) Owner:${ownerName}`;
            if (raceState[timerId]) {
                copyText = `Race - ${copyText}`;
            }
            copyToClipboard(copyText);
        });
    }

    function addCopyRacesButton(container) {
        if (!container) return;
        if (container.querySelector('.custom-copy-races-anchor')) return;

        const li = document.createElement('li');
        li.className = 'gbgprogress game-cursor';

        const copyRacesAnchor = document.createElement('a');
        copyRacesAnchor.href = '#copyraces';
        copyRacesAnchor.className = 'game-cursor custom-copy-races-anchor';
        copyRacesAnchor.title = 'Copy Races';

        const img = CopyRacesImageElement();
        copyRacesAnchor.appendChild(img);

        li.appendChild(copyRacesAnchor);
        container.appendChild(li);

        copyRacesAnchor.addEventListener('click', (evt) => {
            evt.stopPropagation();

            img.togglePressedState();

            try {
                const tbody = document.querySelector('#gbgnextup #nextup > table > tbody');
                if (!tbody) return;
                const timerRows = tbody.querySelectorAll('[id^="timer-"]');
                if (!timerRows.length) return;

                let copyText = '🏁RACE TIME🏁\n\n';

                timerRows.forEach(timerRow => {
                    const timerId = timerRow.id.split('-')[1];

                    if (!raceState[timerId]) return;

                    const provNameCell = timerRow.querySelector('td.prov-name');
                    let battleCode = provNameCell.querySelector('b').textContent.trim();
                    battleCode = mapBattleCode(battleCode);

                    const battletypeSpan = provNameCell.querySelector('span.battletype');
                    const colorName = getColorName(battletypeSpan);

                    const ownerCell = timerRow.querySelector('td:nth-child(2)');
                    const ownerName = ownerCell ? ownerCell.textContent.trim() : '';

                    const timeStaticCell = timerRow.querySelector('td.time-static');
                    if (!timeStaticCell) return;
                    const originalTime = timeStaticCell.getAttribute('data-original-time');
                    if (!originalTime) return;

                    const estTime = convertCSTtoEST(originalTime);
                    const timeDynamic = timerRow.querySelector(`#counter-${timerId}`).textContent.trim();

                    copyText += `- ${battleCode} (${colorName}) opens @ ${estTime} (${timeDynamic}) Owner:${ownerName}\n`;
                });

                copyText += '\nPlease set timers!';

                copyToClipboard(copyText);
            } catch (error) {
            }
        });
    }

    function addCopyButton(timerRow) {
        const timerId = timerRow.id.split('-')[1];

        const alertCell = timerRow.querySelector(`#alert-${timerId}`);
        if (!alertCell) return;

        let copyButton = alertCell.querySelector('.custom-copy-button');
        if (!copyButton) {
            copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.className = 'btn-default btn-tight custom-copy-button';
            copyButton.style.marginLeft = '5px';

            copyButton.addEventListener('click', (evt) => {
                evt.stopPropagation();

                try {
                    const provNameCell = timerRow.querySelector('td.prov-name');
                    let battleCode = provNameCell.querySelector('b').textContent.trim();
                    battleCode = mapBattleCode(battleCode);

                    const battletypeSpan = provNameCell.querySelector('span.battletype');
                    const colorName = getColorName(battletypeSpan);

                    const ownerCell = timerRow.querySelector('td:nth-child(2)');
                    const ownerName = ownerCell ? ownerCell.textContent.trim() : '';

                    const timeStaticCell = timerRow.querySelector('td.time-static');
                    if (!timeStaticCell) return;
                    const originalTime = timeStaticCell.getAttribute('data-original-time');
                    const estTime = convertCSTtoEST(originalTime);
                    const timeDynamic = timerRow.querySelector(`#counter-${timerId}`).textContent.trim();

                    let copyText = `${battleCode} (${colorName}) opens @ ${estTime} (${timeDynamic}) Owner:${ownerName}`;
                    if (raceState[timerId]) {
                        copyText = `Race - ${copyText}`;
                    }

                    copyToClipboard(copyText);
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                } catch (err) {
                }
            });
            alertCell.appendChild(copyButton);
        }

        let raceButton = alertCell.querySelector('.custom-race-button');
        if (!raceButton) {
            raceButton = document.createElement('button');
            raceButton.className = 'btn-default btn-tight custom-race-button';
            raceButton.style.marginLeft = '5px';
            raceButton.style.height = '21px';
            raceButton.style.lineHeight = '21px';
            raceButton.style.padding = '0 5px';

            if (raceState[timerId] === undefined) {
                raceState[timerId] = false;
            }

            const outerBox = document.createElement('div');
            outerBox.style.display = 'inline-block';
            outerBox.style.width = '8px';
            outerBox.style.height = '8px';
            outerBox.style.backgroundColor = '#fff';
            outerBox.style.verticalAlign = 'middle';
            outerBox.style.marginLeft = '1px';

            const innerBox = document.createElement('div');
            innerBox.style.width = '7px';
            innerBox.style.height = '7px';
            innerBox.style.marginLeft = '.5px';
            innerBox.style.marginTop = '.25px';
            innerBox.style.backgroundColor = '#000';
            innerBox.style.display = raceState[timerId] ? 'block' : 'none';

            outerBox.appendChild(innerBox);
            raceButton.appendChild(outerBox);

            raceButton.addEventListener('click', (evt) => {
                evt.stopPropagation();
                raceState[timerId] = !raceState[timerId];
                innerBox.style.display = raceState[timerId] ? 'block' : 'none'

                updateDeadline(timerId, timerRow, raceState[timerId] || highlightState[timerId]);
            });
            alertCell.appendChild(raceButton);
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const existingCopyBtn = alertCell.querySelector('.custom-copy-button');
                    const existingRaceBtn = alertCell.querySelector('.custom-race-button');
                    if (!existingCopyBtn || !existingRaceBtn) {
                        addCopyButton(timerRow);
                    }
                }
            });
        });
        observer.observe(alertCell, { childList: true, subtree: true });
    }

    function enhanceUI() {
        const liveGildFighting = document.querySelector('#LiveGildFighting');
        if (!liveGildFighting) return;

        const table = liveGildFighting.querySelector('#gbgnextup #nextup > table');
        if (!table) return;

        const headerRow = table.querySelector('thead > tr');
        if (headerRow) {
            const th6 = headerRow.querySelector('th:nth-child(6)');
            if (th6 && !th6.textContent.includes('Race!')) {
                const raceSpan = document.createElement('span');
                raceSpan.textContent = 'Race! ↴';
                raceSpan.style.float = 'right';
                raceSpan.style.marginRight = '5px';
                raceSpan.style.fontWeight = 'normal';
                th6.appendChild(raceSpan);
            }
        }

        const timeStaticCells = table.querySelectorAll('tr[id^="timer-"] > td.time-static');
        if (!timeStaticCells.length) return;

        removeSelectAllButton();

        const copyAllContainer = document.querySelector('#LiveGildFightingBody > div > ul');
        if (copyAllContainer)
        addCopyAllButton(copyAllContainer);
        addCopyNextButton();
        addCopyRacesButton(copyAllContainer);

        const tbody = table.querySelector('tbody');
        disableRowSelection(tbody);

        renameSectorsInUI(table);

        timeStaticCells.forEach((timeStaticCell) => {
            const timerRow = timeStaticCell.closest('tr[id^="timer-"]');
            if (!timerRow) return;

            const displayedTime = timeStaticCell.textContent.trim();
            const originalTime = convertTo24Hour(displayedTime);
            timeStaticCell.setAttribute('data-original-time', originalTime);

            const [hour, minute] = originalTime.split(':');
            const ampm = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
            const hour12 = (parseInt(hour, 10) % 12) || 12;
            const localMinute = String(minute).padStart(2,'0');
            const localTime = `${hour12}:${localMinute} ${ampm}`;

            timeStaticCell.textContent = localTime;
            addCopyButton(timerRow);
            observeRowHighlight(timerRow);
        });
    }

    function initializeObserver() {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.id === 'bonus-hud' ||
                            (node.querySelector && node.querySelector('#bonus-hud'))) {
                            enhanceUI();
                        }
                        if (node.id === 'LiveGildFighting' ||
                            (node.querySelector && node.querySelector('#LiveGildFighting'))) {
                            enhanceUI();
                        }
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    loadState();

    initializeObserver();

    window.addEventListener('load', () => {
        const bonusHud = document.querySelector('#bonus-hud');
        const liveGildFighting = document.querySelector('#LiveGildFighting');
        if (bonusHud) enhanceUI();
        if (liveGildFighting) enhanceUI();
    });

})();

// =========================================================================================================================//
// =====     GB Cost Calculator Enhancer    ================================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    function removeHelperEm() {
        const helperElement = document.querySelector('#costCalculatorHeader > span em');
        if (helperElement) {
            helperElement.remove();
        }
    }

    const observer = new MutationObserver(() => {
        removeHelperEm();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

// =========================================================================================================================//
// =====     FOE Production Overview Enhancer    ===========================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    const headerSelectors = [
        "#items > table.foe-table.sortable-table.items-list.active > thead > tr:nth-child(1) > th:nth-child(1)",
        "#items > table.foe-table.sortable-table.items-list > thead > tr:nth-child(1) > th:nth-child(1)",
        "#items > table.foe-table.sortable-table.items-group.active > thead > tr:nth-child(1) > th",
        "#items > table.foe-table.sortable-table.items-group > thead > tr:nth-child(1) > th",
        "#items > table.foe-table.items-sum.active > thead > tr:nth-child(1) > th",
        "#items > table.foe-table.items-sum > thead > tr:nth-child(1) > th"
    ];

    function switchTable(targetClass) {
        let allTables = document.querySelectorAll("#items > table.foe-table");
        allTables.forEach(table => {
            table.classList.remove("active");
            table.style.display = "none";
        });

        let targetTable = document.querySelector(targetClass);
        if (targetTable) {
            targetTable.classList.add("active");
            targetTable.style.display = "table";
        }
    }

    function addButtonsToHeader(header) {
        if (!header || header.querySelector(".custom-toggle-buttons")) return;

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("custom-toggle-buttons");

        function createButton(label, targetClass) {
            let button = document.createElement("button");
            button.innerText = label;
            button.onclick = () => switchTable(targetClass);
            return button;
        }

        buttonContainer.appendChild(createButton("List View", "#items > table.foe-table.sortable-table.items-list"));
        buttonContainer.appendChild(createButton("Group View", "#items > table.foe-table.sortable-table.items-group"));
        buttonContainer.appendChild(createButton("Sum View", "#items > table.foe-table.items-sum"));

        header.appendChild(buttonContainer);
    }

    function processHeaders() {
        headerSelectors.forEach(selector => {
            let header = document.querySelector(selector);
            if (header) addButtonsToHeader(header);
        });
    }

    let observer = new MutationObserver(processHeaders);
    observer.observe(document.body, { childList: true, subtree: true });

    processHeaders();
})();

// =========================================================================================================================//
// =====     Copy Data FoE    ==============================================================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    function copyCityCount() {
        let cityCount = {};
        Object.values(MainParser.CityMapData)
            .filter(({ cityentity_id: cityId }) => !['F_', 'H_', 'M_', 'O_', 'S_', 'U_', 'V_', 'X_', 'Y_'].some(prefix => cityId.startsWith(prefix)))
            .forEach(({ cityentity_id: cityId }) => {
                let cityName = ((MainParser.CityEntities[cityId] || {}).name || cityId);
                cityCount[cityName] = (cityCount[cityName] || 0) + 1;
            });

        let result = Object.entries(cityCount)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}\t${value}`)
            .join('\n');

        copyTextToClipboard(result, 'City data copied to clipboard!');
    }

    function copyOtherPlayerCityCount() {
        let cityCount = {};
        Object.values(MainParser.OtherPlayerCityMapData)
            .filter(({ cityentity_id: cityId }) => !['F_', 'H_', 'M_', 'O_', 'S_', 'U_', 'V_', 'X_', 'Y_'].some(prefix => cityId.startsWith(prefix)))
            .forEach(({ cityentity_id: cityId }) => {
                let cityName = ((MainParser.CityEntities[cityId] || {}).name || cityId);
                cityCount[cityName] = (cityCount[cityName] || 0) + 1;
            });

        let result = Object.entries(cityCount)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}\t${value}`)
            .join('\n');

        copyTextToClipboard(result, 'Other player city data copied to clipboard!');
    }

    function copyInventory() {
        let result = Object.values(MainParser.Inventory)
            .filter(item => item.__class__ === "InventoryItem" && item.item.__class__ === "BuildingItemPayload" && item.item.cityEntityId && ['A_', 'D_', 'G_', 'L_', 'M_', 'P_', 'R_', 'T_', 'W_', 'Z_'].some(prefix => item.item.cityEntityId.startsWith(prefix)))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(item => `${item.name}\t${item.inStock}`)
            .join('\n');

        copyTextToClipboard(result, 'Inventory data copied to clipboard!');
    }

    function copyAllInventory() {
        let result = Object.values(MainParser.Inventory)
            .map(item => `${item.name}\t${item.inStock}`)
            .join('\n');

        copyTextToClipboard(result, 'All inventory data copied to clipboard!');
    }

    function copyTextToClipboard(text, successMessage) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            alert(successMessage);
        } catch (err) {
        }

        document.body.removeChild(textArea);
    }

    function appendButtonsToSettingsPanel() {
        const container = document.getElementById('theDinoSheetButtons');
        if (!container) {
            return;
        }

        if (container.getAttribute('data-buttons-appended') === 'true') {
            return;
        }

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'dino-sheet-buttons-wrapper';
        buttonsWrapper.style.display = 'grid';
        buttonsWrapper.style.gridTemplateColumns = '1fr 1fr';
        buttonsWrapper.style.gap = '6px';
        buttonsWrapper.style.width = '100%';
        buttonsWrapper.style.margin = '0';

        const buttons = [
            { text: 'My City Data', onClick: copyCityCount },
            { text: 'Other City Data', onClick: copyOtherPlayerCityCount },
            { text: 'Building Inventory', onClick: copyInventory },
            { text: 'All Inventory', onClick: copyAllInventory },
        ];

        buttons.forEach(buttonInfo => {
            const btn = document.createElement('button');
            btn.textContent = buttonInfo.text;
            btn.className = 'dino-sheet-button';
            btn.addEventListener('click', buttonInfo.onClick);
            buttonsWrapper.appendChild(btn);
        });

        container.appendChild(buttonsWrapper);
        container.setAttribute('data-buttons-appended', 'true');
    }

    function initializeTampermonkeyButtons() {
        const style = document.createElement('style');
        style.textContent = `
            .dino-sheet-button {
                padding: 5px 10px;
                gap: 0px;
                margin: 0;
                font-size: 0;
                width: 100%;
                background-color: #1E90FF;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                text-align: center;
                word-wrap: break-word;
                white-space: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                box-sizing: border-box;
                transition: background-color 0.3s;
            }

            .dino-sheet-button:hover {
                background-color: #1C86EE;
            }
        `;
        document.head.appendChild(style);

        const observer = new MutationObserver((mutations, obs) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.id === 'FPClipboard_SettingsPanel' || (node.querySelector && node.querySelector('#theDinoSheetButtons'))) {
                        appendButtonsToSettingsPanel();
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', initializeTampermonkeyButtons);
})();