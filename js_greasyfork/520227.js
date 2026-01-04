// ==UserScript==
// @name         Auto Increment Streaks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tăng streaks tự động mỗi giây
// @author       YourName
// @match        https://example.com/*  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520227/Auto%20Increment%20Streaks.user.js
// @updateURL https://update.greasyfork.org/scripts/520227/Auto%20Increment%20Streaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    const streakElement = document.querySelector('#streak'); 
    
    if (streakElement) {
        setInterval(() => {
            let streak = parseInt(streakElement.textContent);
            streakElement.textContent = streak + 1; 
        }, 1000); // Mỗi 1 giây
    } else {
        console.error('Không tìm thấy phần tử streaks!');
    }
})();
