// ==UserScript==
// @name         YouTube Bulk Unsubber
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Added Whitelist/Delist Everyone buttons | cool thing
// @author       tmg
// @match        https://www.youtube.com/feed/channels
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538932/YouTube%20Bulk%20Unsubber.user.js
// @updateURL https://update.greasyfork.org/scripts/538932/YouTube%20Bulk%20Unsubber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href != "https://www.youtube.com/feed/channels") {
        return;
    }

    // get whitelist from localStorage or default to empty
    function getWhitelist() {
        try {
            const data = localStorage.getItem('ytWhitelist');
            if (data) return JSON.parse(data);
        } catch(e) {}
        return [];
    }

    // save whitelist back to localStorage
    function saveWhitelist(list) {
        localStorage.setItem('ytWhitelist', JSON.stringify(list));
    }

    // add channel name to whitelist
    function addToWhitelist(name) {
        const list = getWhitelist();
        if (!list.includes(name)) {
            list.push(name);
            saveWhitelist(list);
        }
    }

    // remove channel name from whitelist
    function removeFromWhitelist(name) {
        let list = getWhitelist();
        list = list.filter(n => n !== name);
        saveWhitelist(list);
    }

    function updateWhitelistBtn(name, btn) {
        const list = getWhitelist();
        if (list.includes(name)) {
            btn.textContent = 'Remove from Whitelist';
            btn.style.backgroundColor = '#cc0000';
        } else {
            btn.textContent = 'Add to Whitelist';
            btn.style.backgroundColor = '#232323';
        }
    }

    // toggle whitelist membership
    function toggleWhitelist(name, btn) {
        const list = getWhitelist();
        if (list.includes(name)) {
            removeFromWhitelist(name);
            btn.textContent = 'Add to Whitelist';
            btn.style.backgroundColor = '#232323';
        } else {
            addToWhitelist(name);
            btn.textContent = 'Remove from Whitelist';
            btn.style.backgroundColor = '#cc0000';
        }
    }

    // sleep helper
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // confirm unsubscribe popup
    async function waitAndConfirmUnsubscribe() {
        for (let i = 0; i < 10; i++) {
            const confirmBtnWrapper = document.querySelector('yt-button-renderer#confirm-button');
            if (confirmBtnWrapper) {
                const confirmBtn = confirmBtnWrapper.querySelector('button');
                if (confirmBtn) {
                    confirmBtn.click();
                    console.log('confirmed unsubscribe popup');
                    return;
                }
            }
            await sleep(250);
        }
        console.log('unsubscribe confirm popup not found');
    }

    // main unsubscribe function
    async function unsubscribeAll() {
        let unsubbed = 0;
        const channelRows = document.querySelectorAll('ytd-channel-renderer');

        console.log(`found ${channelRows.length} subscribed channels`);

        const whitelist = getWhitelist();

        for (const channel of channelRows) {
            try {
                const nameEl = channel.querySelector('#channel-title, #text-container, a#main-link, a#channel-title');
                if (!nameEl) {
                    console.log('no name element found for a channel, skipping');
                    continue;
                }
                const name = nameEl.textContent.trim().split('\n')[0].trim();

                if (whitelist.includes(name)) {
                    console.log(`keeping subscribed: ${name}`);
                    continue;
                }

                let unsubBtn = channel.querySelector('ytd-subscribe-button-renderer button, yt-button-renderer button');
                if (!unsubBtn) {
                    console.log(`unsubscribe button not found for ${name}, skipping`);
                    continue;
                }

                const btnText = unsubBtn.textContent.trim().toLowerCase();

                if (!btnText.includes('subscribed') && !btnText.includes('unsubscribe')) {
                    console.log(`button text not matching subscribed for ${name}, skipping`);
                    continue;
                }

                console.log(`unsubscribing from: ${name}`);

                unsubbed++;

                unsubBtn.click();

                await waitAndConfirmUnsubscribe();

                await sleep(750);

            } catch (e) {
                console.error('error processing a channel:', e);
            }
        }
        console.log('unsubscribe process done');
        return unsubbed;
    }

    function addWhiteListAllAndNonebtn() {
        // <div id="header-container" class="style-scope ytd-section-list-renderer">
        let header = document.querySelector("div#header-container");

        let WhitelistAll = document.createElement("button");

        WhitelistAll.className = 'dothething';
        WhitelistAll.style.backgroundColor = "#454545";
        WhitelistAll.textContent = "Whitelist Everyone";
        WhitelistAll.style.position = 'relative';
        WhitelistAll.style.marginLeft = '8px';
        WhitelistAll.style.marginRight = '8px';
        WhitelistAll.style.height = "35px";
        WhitelistAll.style.padding = '8px';
        WhitelistAll.style.fontSize = '15px';
        WhitelistAll.style.cursor = 'pointer';
        WhitelistAll.style.border = 'none';
        WhitelistAll.style.borderRadius = '15px';
        WhitelistAll.style.color = 'white';
        WhitelistAll.style.fontWeight = 'bold';
        WhitelistAll.style.userSelect = 'none';
        WhitelistAll.title = 'Put everyone in the whitelist';
        WhitelistAll.style.transition = "width 0.3s ease, background-color 0.3s ease";

        let WhitelistNone = document.createElement("button");

        WhitelistNone.className = 'dothething';
        WhitelistNone.style.backgroundColor = "#232323";
        WhitelistNone.textContent = "Delist Everyone";
        WhitelistNone.style.position = 'relative';
        WhitelistNone.style.marginLeft = '8px';
        WhitelistNone.style.marginRight = '8px';
        WhitelistNone.style.height = "35px";
        WhitelistNone.style.padding = '8px';
        WhitelistNone.style.fontSize = '15px';
        WhitelistNone.style.cursor = 'pointer';
        WhitelistNone.style.border = 'none';
        WhitelistNone.style.borderRadius = '15px';
        WhitelistNone.style.color = 'white';
        WhitelistNone.style.fontWeight = 'bold';
        WhitelistNone.style.userSelect = 'none';
        WhitelistNone.title = 'Remove everyone from the whitelist';
        WhitelistNone.style.transition = "width 0.3s ease, background-color 0.3s ease";

        WhitelistAll.addEventListener("mousedown", () => {
            let list = []; // clear EVERYTHING
            saveWhitelist(list);

            // -- Set everyone to yes save them NOW
            const channelRows = document.querySelectorAll('ytd-channel-renderer');

            channelRows.forEach(channel => {
                const name = channel.querySelector('#channel-title, #text-container, a#main-link, a#channel-title').textContent.trim().split('\n')[0].trim();

                const button = channel.querySelector(".whitelist-toggle-btn");

                toggleWhitelist(name, button);
            });
        });

        WhitelistNone.addEventListener("mousedown", () => {
            let list = []; // clear EVERYTHING
            saveWhitelist(list);

            // -- Update the whitelist buttons
            const channelRows = document.querySelectorAll('ytd-channel-renderer');

            channelRows.forEach(channel => {
                const name = channel.querySelector('#channel-title, #text-container, a#main-link, a#channel-title').textContent.trim().split('\n')[0].trim();

                const button = channel.querySelector(".whitelist-toggle-btn");

                updateWhitelistBtn(name, button);
            });
        });

        header.appendChild(WhitelistAll);
        header.appendChild(WhitelistNone);
    }

    // add whitelist toggle buttons next to channel names
    function addWhitelistButtons() {
        const whitelist = getWhitelist();
        const channelRows = document.querySelectorAll('ytd-channel-renderer');

        channelRows.forEach(channel => {
            if (channel.querySelector('.whitelist-toggle-btn')) {
                // button already exists
                return;
            }

            const nameEl = channel.querySelector('#channel-title, #text-container, a#main-link, a#channel-title');
            if (!nameEl) return;
            const name = nameEl.textContent.trim().split('\n')[0].trim();

            // create button
            const btn = document.createElement('button');
            btn.className = 'whitelist-toggle-btn';
            btn.style.position = 'relative';
            btn.style.marginLeft = '8px';
            btn.style.marginRight = '8px';
            btn.style.height = "35px";
            btn.style.padding = '8px';
            btn.style.fontSize = '15px';
            btn.style.cursor = 'pointer';
            btn.style.border = 'none';
            btn.style.borderRadius = '15px';
            btn.style.color = 'white';
            btn.style.fontWeight = 'bold';
            btn.style.userSelect = 'none';
            btn.style.top = "calc(50% - 8px)";
            btn.style.transform = "translateY(-50%)";
            btn.title = 'Add/remove from whitelist';
            btn.style.transition = "width 0.3s ease, background-color 0.3s ease";

            if (whitelist.includes(name)) {
                btn.textContent = 'Remove from Whitelist';
                btn.style.backgroundColor = '#cc0000'; // green-ish
            } else {
                btn.textContent = 'Add to Whitelist';
                btn.style.backgroundColor = '#232323'; // red-ish
            }

            btn.addEventListener('click', () => {
                toggleWhitelist(name, btn);
            });

            // insert button right after channel name element
            nameEl.parentNode.insertBefore(btn, nameEl.nextSibling);
        });
    }

    // create main unsubscribe trigger button
    function createTriggerButton() {
        const btn = document.createElement('button');
        btn.disabled = false;
        btn.textContent = 'Unsubscribe +';
        btn.style.position = 'fixed';
        btn.style.top = '50%';
        btn.style.transform = "translateY(-50%)";
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#232323';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        btn.style.transition = "background-color 0.3s ease";

        btn.addEventListener("mouseenter", () => {
            if (btn.disabled === false) {
                btn.style.backgroundColor = "#cc0000";
            }
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.backgroundColor = "#232323";
        });

        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.style.cursor = "not-allowed";
            btn.textContent = 'OK. Please Wait.';
            unsubscribeAll().then(result => {
                btn.textContent = `Done. ${result} channels unsubbed.`;
            });
        });

        document.body.appendChild(btn);
    }

    // setup mutation observer on the #contents container to add buttons on new channels dynamically
    function setupObserver() {
        const container = document.querySelector('div#contents.style-scope.ytd-section-list-renderer');
        if (!container) {
            setTimeout(setupObserver, 1000);
            return;
        }

        const observer = new MutationObserver(() => {
            addWhitelistButtons();
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // init after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            addWhitelistButtons();
            addWhiteListAllAndNonebtn();
            createTriggerButton();
            setupObserver();
        }, 3000);
    });

})();