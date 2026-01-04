// ==UserScript==
// @name         Auto Refresh for Legal Aid & Justice Websites
// @author        PointStar
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Automatic page refresh after 3 minutes of inactivity when the page is not in focus, including handling of the ResizeObserver error.
// @match        https://*.justice.gov.il/*
// @match        https://*.court.gov.il/*
// @match        https://*.btl.gov.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527190/Auto%20Refresh%20for%20Legal%20Aid%20%20Justice%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/527190/Auto%20Refresh%20for%20Legal%20Aid%20%20Justice%20Websites.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // טיפול בשגיאת ResizeObserver
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes("ResizeObserver loop completed")) {
            event.stopImmediatePropagation();
            console.warn("התגלתה שגיאת ResizeObserver, מתעלמים ממנה");
        }
    });

    let refreshTimeout;
    const timeoutDuration = 180000; // 180,000 מילי-שניות = 3 דקות

    // הפעלה של הטיימר - לאחר 3 דקות ללא פעילות, הדף יתרענן
    function startRefreshTimer() {
        if (!refreshTimeout) {
            console.log("הטיימר התחיל");
            refreshTimeout = setTimeout(function() {
                console.log("לא הייתה פעילות במשך 3 דקות - מבצע רענון");
                location.reload();
                refreshTimeout = null;
            }, timeoutDuration);
        }
    }

    // ביטול הטיימר
    function cancelRefreshTimer() {
        if (refreshTimeout) {
            console.log("הטיימר בוטל");
            clearTimeout(refreshTimeout);
            refreshTimeout = null;
        }
    }

    // אתחול מחדש של הטיימר - משמש בעת גילוי פעילות משתמש
    function resetRefreshTimer() {
        cancelRefreshTimer();
        startRefreshTimer();
    }

    // פונקציה לבדיקה האם הטיימר פעיל (ניתן להריץ דרך הקונסול)
    function checkTimer() {
        if (refreshTimeout) {
            console.log("הטיימר פעיל");
        } else {
            console.log("אין טיימר פעיל");
        }
    }
    window.checkTimer = checkTimer;

    // הפעלת הטיימר עם טעינת הדף
    startRefreshTimer();

    // מאזינים לאירועי פעילות של המשתמש (תנועת עכבר, הקשות, גלילה ומגע)
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(eventName => {
        window.addEventListener(eventName, resetRefreshTimer, false);
    });

    // מאזין לשינוי במצב הפוקוס של הדף (למשל, במקרה של מינימיזציה)
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            // אם העמוד מוסתר, מוודאים שהטיימר רץ
            if (!refreshTimeout) startRefreshTimer();
        } else {
            // אם העמוד חוזר להיות פעיל, מאפסים את הטיימר
            resetRefreshTimer();
        }
    });
})();