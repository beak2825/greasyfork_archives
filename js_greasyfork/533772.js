// ==UserScript==
// @name         Scheduled Website Opener (Daily Check - Config Page)
// @namespace    your-namespace
// @version      0.3
// @description  Opens websites at scheduled times (checks once daily), config via separate page.
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533772/Scheduled%20Website%20Opener%20%28Daily%20Check%20-%20Config%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533772/Scheduled%20Website%20Opener%20%28Daily%20Check%20-%20Config%20Page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCHEDULE_KEY = 'scheduledWebsitesDaily';
    const LAST_CHECK_KEY = 'lastScheduleCheck';

    function loadSchedules() {
        const storedSchedules = GM_getValue(SCHEDULE_KEY);
        return storedSchedules ? JSON.parse(storedSchedules) : [];
    }

    function getLastCheck() {
        return GM_getValue(LAST_CHECK_KEY, 0);
    }

    function setLastCheck() {
        GM_setValue(LAST_CHECK_KEY, Date.now());
    }

    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function checkSchedules() {
        const now = new Date();
        const currentTime = formatTime(now);
        const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
        const schedules = loadSchedules();

        schedules.forEach(schedule => {
            if (schedule.days.includes(currentDay) && schedule.time === currentTime) {
                window.open(schedule.url, '_blank');
                // Optionally, you could remove the schedule after it's executed once:
                // GM_setValue(SCHEDULE_KEY, JSON.stringify(schedules.filter(s => s !== schedule)));
            }
        });
        setLastCheck();
        setTimeout(checkDaily, 24 * 60 * 60 * 1000);
    }

    function checkDaily() {
        const now = new Date();
        const lastCheck = getLastCheck();
        const timeSinceLastCheck = now.getTime() - lastCheck;

        if (timeSinceLastCheck >= 24 * 60 * 60 * 1000) {
            checkSchedules();
        } else {
            setTimeout(checkDaily, (24 * 60 * 60 * 1000) - timeSinceLastCheck);
        }
    }

    // Start the daily check interval
    checkDaily();

})();