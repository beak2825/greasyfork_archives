// ==UserScript==
// @name         [NOT WORKING] Pixiv User Scanner (Queue + Highlight + Follow/Unfollow Detect)
// @namespace    Violentmonkey Scripts
// @version      1.5
// @description  Scan Pixiv users lazily, highlight follow status, detect follow & unfollow actions
// @author       Oppai1442
// @match        https://www.pixiv.net/en/artworks/*
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/535904/%5BNOT%20WORKING%5D%20Pixiv%20User%20Scanner%20%28Queue%20%2B%20Highlight%20%2B%20FollowUnfollow%20Detect%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535904/%5BNOT%20WORKING%5D%20Pixiv%20User%20Scanner%20%28Queue%20%2B%20Highlight%20%2B%20FollowUnfollow%20Detect%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const scanned = new Set();
    const processed = new Map(); // userId → isFollowed
    const queue = [];

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getUserIdFromHref = href => {
        const match = href.match(/\/users\/(\d+)/);
        return match ? match[1] : null;
    };

    const highlightFollowed = (userId, isFollowed) => {
        const matches = document.querySelectorAll(`[data-gtm-value="${userId}"]`);
        matches.forEach(el => {
            const wrapper = el.closest('.sc-5a760b36-1.dUCFCr');
            if (!wrapper) return;

            const applied = wrapper.dataset.followMarked === 'true';

            if (isFollowed && !applied) {
                wrapper.style.border = '2px solid limegreen';
                wrapper.style.borderRadius = '6px';
                wrapper.style.padding = '2px';
                wrapper.dataset.followMarked = 'true';
            } else if (!isFollowed && applied) {
                wrapper.style.border = '';
                wrapper.style.borderRadius = '';
                wrapper.style.padding = '';
                wrapper.dataset.followMarked = 'false';
            }
        });
    };






    const fetchUserInfo = async (userId) => {
        if (processed.has(userId)) {
            highlightFollowed(userId, processed.get(userId));
            return;
        }

        const url = `https://www.pixiv.net/ajax/user/${userId}?full=1&lang=en`;
        try {
            const res = await fetch(url, { credentials: 'include' });
            const json = await res.json();
            if (!json.error) {
                const name = json.body.name;
                const isFollowed = json.body.isFollowed;
                processed.set(userId, isFollowed);
                highlightFollowed(userId, isFollowed);
                // console.log(`[${name}] (${userId}) Followed: ${isFollowed}`);
            }
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
        }
    };

    const processQueue = async () => {
        while (true) {
            if (queue.length > 0) {
                const userId = queue.shift();
                await fetchUserInfo(userId);
            }
            await delay(300 + Math.random() * 200);
        }
    };

    const scanPage = () => {
        const seenThisScan = new Set();

        document.querySelectorAll('a[href*="/users/"]').forEach(link => {
            const userId = getUserIdFromHref(link.getAttribute('href'));
            if (!userId || seenThisScan.has(userId)) return;
            seenThisScan.add(userId);

            // Nếu user chưa được quét, đưa vào queue
            if (!scanned.has(userId)) {
                scanned.add(userId);
                queue.push(userId);
            }

            // Gọi highlight nếu đã có data
            if (processed.has(userId)) {
                highlightFollowed(userId, processed.get(userId));
            }
        });
    };



    const observeFollowButtons = () => {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-gtm-user-id]');
            if (btn) {
                const userId = btn.getAttribute('data-gtm-user-id');
                if (!userId) return;

                // Toggle trạng thái hiện tại
                const current = processed.get(userId) === true;
                const newState = !current;
                processed.set(userId, newState);
                highlightFollowed(userId, newState);
                // console.log(`[Follow toggled manually] ${userId} → ${newState}`);

                // (Optional) sync lại sau vài giây với server
                setTimeout(async () => {
                    try {
                        const res = await fetch(`https://www.pixiv.net/ajax/user/${userId}?full=1&lang=en`, { credentials: 'include' });
                        const json = await res.json();
                        if (!json.error) {
                            const actual = json.body.isFollowed;
                            processed.set(userId, actual);
                            highlightFollowed(userId, actual);
                            // console.log(`[Synced follow status] ${userId} → ${actual}`);
                        }
                    } catch (e) {
                        console.warn(`Sync failed for ${userId}`);
                    }
                }, 3000); // đợi cho chắc
            }
        }, true);
    };



    let scanTimeout = null;
    const observer = new MutationObserver(() => {
        if (scanTimeout) return;
        scanTimeout = setTimeout(() => {
            scanPage();
            scanTimeout = null;
        }, 100); // debounce
    });
    observer.observe(document.body, { childList: true, subtree: true });


    scanPage();
    processQueue();
    observeFollowButtons();
})();
