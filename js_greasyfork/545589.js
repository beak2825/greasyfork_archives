// ==UserScript==
// @name         Simple Water Reminder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple water reminder script that alerts you to drink water.
// @author       jyomama28
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545589/Simple%20Water%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/545589/Simple%20Water%20Reminder.meta.js
// ==/UserScript==

//To all the people who use this as well as my other scripts, I really appreciate it. I work hard on making these scripts!
//Please enjoy this as well as any of my other scripts!
//If you have any questions, Please email me! email me at: jyomama28@gmail.com
//Agian, Thank you all!

alert('Remember to drink water!');
setInterval(function() {
    alert('Remember to drink water!');
}, 600000); // <--- this will alert you every 10 minutes

// To change the time of the reminder, change the number in the setInterval function to any of the timees below:
//1000 ms = 1 second
// 60000 ms = 1 minute
// 300000 ms = 5 minutes
// 600000 ms = 10 minutes
// 1200000 ms = 20 minutes
// 1800000 ms = 30 minutes
// 2400000 ms = 40 minutes
// 3000000 ms = 50 minutes
// 3600000 ms = 1 hour
// 86400000 ms = 1 day