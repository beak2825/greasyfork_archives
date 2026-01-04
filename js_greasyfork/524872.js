// ==UserScript==
// @name         Bilibili Auto Check-in with Share Function
// @namespace    https://www.bilibili.com/
// @version      1.5
// @description  Automatically perform Bilibili daily check-in tasks, including sharing a video, when you open www.bilibili.com
// @author        Hao
// @match        https://www.bilibili.com/
// @grant        GM_notification
// @grant        unsafeWindow
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/524872/Bilibili%20Auto%20Check-in%20with%20Share%20Function.user.js
// @updateURL https://update.greasyfork.org/scripts/524872/Bilibili%20Auto%20Check-in%20with%20Share%20Function.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script has already run today
    const lastRunDate = localStorage.getItem('bilibili_checkin_lastRunDate');
    const today = new Date().toDateString();

    if (lastRunDate === today) {
        console.log('Check-in already performed today.');
        return;
    }

    // Function to get bili_jct from the page
    function getBiliJct() {
        try {
            const bili_jct_match = document.cookie.match(/bili_jct=([^;]+)/);
            if (bili_jct_match) {
                console.log('Retrieved bili_jct from document.cookie.');
                return bili_jct_match[1];
            } else {
                console.log('bili_jct not found.');
                return null;
            }
        } catch (e) {
            console.error('Error retrieving bili_jct:', e);
            return null;
        }
    }

    const bili_jct = getBiliJct();

    if (!bili_jct) {
        console.log('bili_jct not found.');
        return;
    }

    // Function to perform the check-in task
    function performCheckIn() {
        const expAddUrl = "https://api.bilibili.com/x/vip/experience/add";
        const expAddPayload = `csrf=${bili_jct}`;

        fetch(expAddUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.bilibili.com',
                'Referer': 'https://www.bilibili.com/'
            },
            credentials: 'include',
            body: expAddPayload
        })
        .then(response => response.json())
        .then(data => {
            console.log('AddExpResponse:', data);
            // Proceed to share a video after adding experience
            shareVideo();
        })
        .catch(err => {
            console.error('Error during experience add request:', err);
        });
    }

    // Function to share a video
    function shareVideo() {
        // Replace with the actual aid (video ID) you want to share
        const aid = '12345678'; // Example video ID
        const shareUrl = 'https://api.bilibili.com/x/web-interface/share/add';
        const sharePayload = `aid=${aid}&csrf=${bili_jct}`;

        fetch(shareUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.bilibili.com',
                'Referer': 'https://www.bilibili.com/'
            },
            credentials: 'include',
            body: sharePayload
        })
        .then(response => response.json())
        .then(data => {
            console.log('ShareVideoResponse:', data);

            if (data.code === 0) {
                GM_notification({
                    text: 'Bilibili check-in and video share completed successfully!',
                    title: 'Success',
                    timeout: 5000
                });
            } else {
                GM_notification({
                    text: `Video share failed: ${data.message}`,
                    title: 'Error',
                    timeout: 5000
                });
            }

            // Update last run date
            localStorage.setItem('bilibili_checkin_lastRunDate', today);
        })
        .catch(err => {
            console.error('Error during video share request:', err);
        });
    }

    // Run the check-in function when the page loads
    window.addEventListener('load', performCheckIn);

})();
