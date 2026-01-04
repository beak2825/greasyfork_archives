// ==UserScript==
// @name         Unstuck
// @namespace    http://tampermonkey.net/
// @version      2025.1
// @description  Unstuck Aug PN
// @author       fatoow
// @match        https://pockieninja.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544327/Unstuck.user.js
// @updateURL https://update.greasyfork.org/scripts/544327/Unstuck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // UI overlay at the middle top part of the screen with Start/Stop buttons
    const uiDiv = document.createElement('div');
    uiDiv.id = 'unstuck-ui-overlay';
    uiDiv.style.position = 'fixed';
    uiDiv.style.top = '10px';
    uiDiv.style.left = '50%';
    uiDiv.style.transform = 'translateX(-50%)';
    uiDiv.style.zIndex = '9999';
    uiDiv.style.background = 'rgba(0,0,0,0.7)';
    uiDiv.style.color = '#fff';
    uiDiv.style.padding = '10px 24px';
    uiDiv.style.borderRadius = '8px';
    uiDiv.style.fontSize = '18px';
    uiDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    uiDiv.style.display = 'flex';
    uiDiv.style.flexDirection = 'column';
    uiDiv.style.alignItems = 'center';

    const statusText = document.createElement('div');
    statusText.textContent = 'Unstuck Script Ready';
    statusText.style.marginBottom = '8px';
    uiDiv.appendChild(statusText);

    const btnToggle = document.createElement('button');
    btnToggle.textContent = 'Start';
    btnToggle.style.margin = '0 8px 4px 0';
    btnToggle.style.padding = '6px 18px';
    btnToggle.style.fontSize = '16px';
    btnToggle.style.borderRadius = '5px';
    btnToggle.style.border = 'none';
    btnToggle.style.background = '#4caf50';
    btnToggle.style.color = '#fff';
    btnToggle.style.cursor = 'pointer';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.appendChild(btnToggle);
    uiDiv.appendChild(btnRow);

    document.body.appendChild(uiDiv);

    let running = false;
    let timeouts = [];

    function clearAllTimeouts() {
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];
    }

    function safeSetTimeout(fn, delay) {
        const t = setTimeout(fn, delay);
        timeouts.push(t);
        return t;
    }
    const selectors = {
        sm: {
            imageButton: '#game-container > div.slot-machine__icon > button > img',
            challengeButton: '#game-container > div.slot-machine__container > button.image_button.--default.slot-machine__challenge-btn',
            fightButton: '#fightContainer > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button:nth-child(3)',
            closeButton: '#fightResultModal button'
        }
    };

    // Waits for an element with exact text
    function waitForElementByText(text, callback, interval = 750, timeout = 10000) {
        const start = Date.now();
        function search() {
            const xpath = `//*[normalize-space(text())='${text}']`;
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                const el = result.snapshotItem(i);
                if (el.offsetParent !== null) { // only visible elements
                    callback(el);
                    return;
                }
            }
            if (Date.now() - start < timeout) {
                setTimeout(search, interval);
            } else {
                console.log(`❗ Element with text not found: "${text}"`);
            }
        }
        search();
    }

    // Espera a que exista una imagen con src exacto
    function waitForImageBySrc(src, callback, interval = 750, timeout = 10000) {
        const start = Date.now();
        function search() {
            const imgs = document.querySelectorAll(`img[src='${src}']`);
            for (let img of imgs) {
                if (img.offsetParent !== null) { // only visible images
                    callback(img);
                    return;
                }
            }
            if (Date.now() - start < timeout) {
                setTimeout(search, interval);
            } else {
                console.log(`❗ Image with src not found: "${src}"`);
            }
        }
        search();
    }

    // Click in the center of the screen
    function clickCenter() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                view: window
            });
            const target = document.elementFromPoint(x, y);
            if (target) {
                target.dispatchEvent(event);
            }
        });
        console.log('✅ Click in the center of the screen');
    }

    // Click Accept multiple times
    function clickAccept25Times(acceptEl, times = 5, delay = 250) {
        let count = 0;
        function doClick() {
            if (count < times) {
                acceptEl.click();
                count++;
                console.log(`✅ Click Accept #${count}`);
                setTimeout(doClick, delay);
            } else {
                console.log('🎉 Finished 25 clicks on Accept');
            }
        }
        doClick();
    }

    // Complete sequence using robust waiting functions
    function startSequence() {
        if (!running) return;
        statusText.textContent = 'Checking for Leave button...';
        let leaveBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === 'Leave' && el.offsetParent !== null);
        if (leaveBtn) {
            statusText.textContent = 'Clicking Leave...';
            leaveBtn.click();
            console.log('✅ Clicked Leave');
        } else {
            console.log('Leave button not visible, proceeding.');
        }
        setTimeout(() => {
            let worldMapBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === 'World Map' && el.offsetParent !== null);
            if (worldMapBtn) {
                statusText.textContent = 'Clicking World Map...';
                worldMapBtn.click();
                console.log('✅ Clicked World Map');
            } else {
                console.log('World Map button not visible, proceeding.');
            }
            setTimeout(() => {
                statusText.textContent = 'Clicking center/crossroad...';
                clickCenter();
                setTimeout(() => {
                    let slotMachineImg = document.querySelector('img[src="https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/ui/SlotMachine/icon.png"]');
                    if (slotMachineImg && slotMachineImg.offsetParent !== null) {
                        statusText.textContent = 'Clicking SlotMachine icon...';
                        slotMachineImg.click();
                        console.log('✅ Clicked SlotMachine icon');
                    } else {
                        console.log('SlotMachine icon not visible, proceeding.');
                    }
                    setTimeout(() => {
                        let challengeBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === 'Challenge' && el.offsetParent !== null);
                        if (challengeBtn) {
                            statusText.textContent = 'Clicking Challenge button...';
                            challengeBtn.click();
                            console.log('✅ Clicked Challenge button');
                            statusText.textContent = 'Sequence complete.';
                        } else {
                            console.log('Challenge button not visible, sequence complete.');
                            statusText.textContent = 'Sequence complete.';
                        }
                    }, 750);
                }, 750);
            }, 750);
        }, 750);
    }

    // Button event listeners
    btnToggle.onclick = () => {
        if (!running) {
            running = true;
            btnToggle.textContent = 'Stop';
            btnToggle.style.background = '#f44336';
            statusText.textContent = 'Unstuck Script Running...';
            clearAllTimeouts();
            startSequence();
        } else {
            running = false;
            btnToggle.textContent = 'Start';
            btnToggle.style.background = '#4caf50';
            clearAllTimeouts();
            statusText.textContent = 'Unstuck Script Stopped.';
        }
    };

})();

