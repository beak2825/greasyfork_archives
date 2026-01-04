// ==UserScript==
// @name         Roblox Unfriend Everyone Except Input List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unfriends everyone except selected usernames or user IDs via UI input 💔
// @author       gurt
// @match        https://www.roblox.com/users/friends*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543314/Roblox%20Unfriend%20Everyone%20Except%20Input%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/543314/Roblox%20Unfriend%20Everyone%20Except%20Input%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    function createUI() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="unfriend-ui" style="
                position: fixed;
                top: 80px;
                right: 20px;
                width: 250px;
                background: #111;
                color: white;
                border: 2px solid #444;
                border-radius: 8px;
                padding: 10px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            ">
                <b style="font-size: 14px;">Keep List (one per line):</b><br>
                <textarea id="keep-list" style="width: 100%; height: 120px; margin-top: 5px;"></textarea><br>
                <button id="start-unfriend" style="
                    margin-top: 10px;
                    background-color: #e74c3c;
                    border: none;
                    color: white;
                    padding: 8px;
                    width: 100%;
                    border-radius: 5px;
                    cursor: pointer;
                ">Unfriend All Except</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('start-unfriend').addEventListener('click', startUnfriending);
    }

    async function startUnfriending() {
        const input = document.getElementById('keep-list').value;
        const keepList = input.split('\n').map(x => x.trim().toLowerCase()).filter(Boolean);

        alert('starting to unfriend everyone not in list 💔 hold tight');

        // scroll to load all friends
        for (let i = 0; i < 20; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(1500);
        }

        const cards = document.querySelectorAll('.friend-card-item');

        for (const card of cards) {
            const usernameEl = card.querySelector('.text-name');
            const userName = usernameEl?.textContent.trim().toLowerCase();

            if (userName && !keepList.includes(userName)) {
                const unfriendBtn = card.querySelector('button[aria-label="Unfriend"]');
                if (unfriendBtn) {
                    console.log(`Unfriending ${userName}`);
                    unfriendBtn.click();
                    await sleep(1000);
                }
            } else {
                console.log(`Keeping ${userName}`);
            }
        }

        alert('done 💔 everyone not in the list got dropped');
    }

    window.addEventListener('load', () => {
        createUI();
    });
})();
