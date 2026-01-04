// ==UserScript==
// @name         Grok's Mass Unfriend
// @namespace    https://grok.com
// @version      0.1
// @description  When you open your Friends List, you will notice three buttons: Start Analyzing, Unfriend all Friends, and Stop Analyzing. Navigate through each page while analyzing so it adds to the list, then, once you're finished, stop analyzing. It will then prompt each friend detected to unfriend them. Don't worry about clutter! It only has a 5-tab limit and closes after unfriending. Enjoy!
// @match        https://www.roblox.com/users/friends
// @match        https://www.roblox.com/users/*/profile
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534954/Grok%27s%20Mass%20Unfriend.user.js
// @updateURL https://update.greasyfork.org/scripts/534954/Grok%27s%20Mass%20Unfriend.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const MAX_TABS = 5; // Maximum number of open tabs at once
    let openTabs = [];
    let collectedLinks = new Set();
    let isAnalyzing = false;

    async function getFriendProfileLinks() {
        await delay(1000);
        const anchors = Array.from(document.querySelectorAll('a')).filter(a =>
            a.href.includes('/users/') && a.href.includes('/profile')
        );
        return [...new Set(anchors.map(a => a.href))];
    }

    async function openAllProfilesInTabs() {
        const startButton = document.querySelector('#start-analyze-btn');
        const stopButton = document.querySelector('#stop-analyze-btn');
        const unfriendButton = document.querySelector('#unfriend-all-btn');
        startButton.style.display = 'none';
        stopButton.style.display = 'none';
        unfriendButton.innerText = 'Unfriending...';
        unfriendButton.disabled = true;

        try {
            const links = Array.from(collectedLinks);
            if (links.length === 0) {
                alert('No profiles collected for unfriending.');
                unfriendButton.innerText = 'Unfriend All Friends';
                unfriendButton.disabled = false;
                return;
            }

            const confirmOpen = confirm(`Open up to ${links.length} tabs to unfriend all collected users?`);
            if (!confirmOpen) {
                unfriendButton.innerText = 'Unfriend All Friends';
                unfriendButton.disabled = false;
                return;
            }

            unfriendButton.innerText = `Opening Tabs (0/${links.length})`;
            let processed = 0;

            for (const link of links) {
                while (openTabs.length >= MAX_TABS) {
                    await delay(1000);
                }

                const newTab = window.open(link, '_blank');
                if (newTab) {
                    openTabs.push(newTab);
                } else {
                    console.warn('Failed to open tab for:', link);
                }

                processed++;
                unfriendButton.innerText = `Opening Tabs (${processed}/${links.length})`;
                await delay(1000);
            }

            while (openTabs.length > 0) {
                await delay(1000);
            }

            alert(`Processed ${processed} profiles.`);
            unfriendButton.innerText = 'Done';
        } catch (error) {
            console.error('Error in openAllProfilesInTabs:', error);
            alert('An error occurred. Please try again.');
            unfriendButton.innerText = 'Unfriend All Friends';
        } finally {
            unfriendButton.disabled = false;
        }
    }

    async function autoClickUnfriend() {
        try {
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Unfriend');
                if (btn) {
                    btn.click();
                    console.log('Clicked unfriend button.');

                    await delay(2000);
                    const unfriendBtnGone = !Array.from(document.querySelectorAll('button')).some(b => b.innerText.trim() === 'Unfriend');
                    if (unfriendBtnGone) {
                        console.log('Unfriend successful, closing tab.');
                        window.close();
                    }
                    return;
                }
                attempts++;
                await delay(1000);
            }

            console.warn('Unfriend button not found after retries.');
            window.close();
        } catch (error) {
            console.error('Error in autoClickUnfriend:', error);
            window.close();
        }
    }

    function addControlButtons() {
        const container = document.createElement('div');
        container.style = 'position:fixed;top:60px;left:20px;z-index:9999;';

        const startBtn = document.createElement('button');
        startBtn.id = 'start-analyze-btn';
        startBtn.innerText = 'Start Analyzing';
        startBtn.style = 'padding:12px 24px;background:#4CAF50;color:white;border:none;border-radius:6px;cursor:pointer;transition:transform 0.3s, background 0.3s;';
        startBtn.onmouseover = () => startBtn.style.transform = 'scale(1.05)';
        startBtn.onmouseout = () => startBtn.style.transform = 'scale(1)';
        startBtn.onclick = () => {
            isAnalyzing = true;
            collectedLinks.clear();
            startBtn.style.display = 'none';
            document.querySelector('#stop-analyze-btn').style.display = 'inline-block';
            document.querySelector('#stop-analyze-btn').disabled = false;
            analyzeFriends();
        };

        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-analyze-btn';
        stopBtn.innerText = 'Stop Analyzing';
        stopBtn.style = 'padding:12px 24px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer;transition:transform 0.3s, background 0.3s; display:none;';
        stopBtn.onmouseover = () => stopBtn.style.transform = 'scale(1.05)';
        stopBtn.onmouseout = () => stopBtn.style.transform = 'scale(1)';
        stopBtn.onclick = () => {
            isAnalyzing = false;
            stopBtn.innerText = 'Stopped Analyzing';
            stopBtn.style.background = '#757575';
            stopBtn.style.cursor = 'default';
            stopBtn.disabled = true;
            setTimeout(() => {
                stopBtn.style.display = 'none';
                startBtn.style.display = 'inline-block';
                startBtn.disabled = false;
                document.querySelector('#unfriend-all-btn').disabled = false;
            }, 1000);
        };

        const unfriendBtn = document.createElement('button');
        unfriendBtn.id = 'unfriend-all-btn';
        unfriendBtn.innerText = 'Unfriend All Friends';
        unfriendBtn.style = 'padding:12px 24px;background:#d00;color:white;border:none;border-radius:6px;cursor:pointer;transition:transform 0.3s, background 0.3s;';
        unfriendBtn.onmouseover = () => unfriendBtn.style.transform = 'scale(1.05)';
        unfriendBtn.onmouseout = () => unfriendBtn.style.transform = 'scale(1)';
        unfriendBtn.disabled = true;
        unfriendBtn.onclick = openAllProfilesInTabs;

        container.appendChild(startBtn);
        container.appendChild(stopBtn);
        container.appendChild(unfriendBtn);
        document.body.appendChild(container);
    }

    async function analyzeFriends() {
        while (isAnalyzing) {
            const links = await getFriendProfileLinks();
            links.forEach(link => collectedLinks.add(link));
            await delay(1000);
        }
    }

    function monitorTabs() {
        setInterval(() => {
            openTabs = openTabs.filter(tab => !tab.closed);
        }, 1000);
    }

    window.addEventListener('load', () => {
        if (window.location.href.includes('/users/friends')) {
            addControlButtons();
            monitorTabs();
        } else if (window.location.href.includes('/profile')) {
            autoClickUnfriend();
        }
    });
})();