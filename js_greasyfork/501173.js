// ==UserScript==
// @name         LMS Progress Updater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ШОК ЧТО ТВОРЯТ ПЕРВАКИ ЕБАНУЛИСЬ ВООБЩЕ.
// @author       You
// @match        https://lms.dvfu.ru/viewer/sessions/*/materials/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501173/LMS%20Progress%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/501173/LMS%20Progress%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getIdsFromUrl() {
        const url = window.location.href;
        const match = url.match(/\/sessions\/(\d+)\/materials\/(\d+)/);
        return match ? { sessionId: match[1], materialId: match[2] } : null;
    }

    function sendProgressUpdate() {
        const ids = getIdsFromUrl();
        if (ids) {
            const url = `https://lms.dvfu.ru/mobile/v3/course_sessions/${ids.sessionId}/materials/${ids.materialId}/track`;
            const data = { "time_spent": 1200 };
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
        } else {
            alert('Не найден айди сессии(курса) или айди материала');
        }
    }

    sendProgressUpdate();
})();
