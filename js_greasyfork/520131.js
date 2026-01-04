// ==UserScript==
// @name         Duolingo Streak Saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động duy trì streak hàng ngày trên Duolingo
// @author       Bạn
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520131/Duolingo%20Streak%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/520131/Duolingo%20Streak%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const saveStreak = async () => {
        const response = await fetch('https://www.duolingo.com/2017-06-30/users/{user_id}/xp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                'xpGained': 10,
                'learningLanguage': 'en'
            })
        });

        if (response.ok) {
            console.log('Streak saved successfully!');
        } else {
            console.error('Failed to save streak.');
        }
    };

    const runStreakSaver = () => {
        if (window.location.href.includes('duolingo.com')) {
            saveStreak();
        }
    };

    setInterval(runStreakSaver, 3600000); // Tự động gọi mỗi giờ
})();
