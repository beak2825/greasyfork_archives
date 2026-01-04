// ==UserScript==
// @name         Ikariam desktop notifications v 7.8.3
// @namespace    Yarani
// @version      7.8.3
// @description  Runs when you have ikariam open and provides push notifications when the advisors lights up. Inspired by Ikariam desktop notifications by Danielv123.
// @author       Yarani
// @grant                unsafeWindow
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_deleteValue
// @grant                GM_addStyle
// @grant                GM_registerMenuCommand
// @grant                GM_xmlhttpRequest
// @grant                GM_openInTab
//
// @exclude              http://board.*.ikariam.gameforge.com*
// @exclude              http://*.ikariam.gameforge.*/board
// @include			     /https?:\/\/s[0-9]*-[a-z]{2}\.ikariam\.gameforge\.com\/.*/
// @downloadURL https://update.greasyfork.org/scripts/38590/Ikariam%20desktop%20notifications%20v%20783.user.js
// @updateURL https://update.greasyfork.org/scripts/38590/Ikariam%20desktop%20notifications%20v%20783.meta.js
// ==/UserScript==

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
// http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/mayor_premium_active.png
// $('#js_GlobalMenu_cities')[0].className == "premiumactive"
// main checking loop
setInterval(function() {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        // check if the advisors are glowing
        // City advisor
        if ($('#js_GlobalMenu_cities')[0].className == "normalactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Something happened in one of your towns!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/mayor_active.png");
        }
        if ($('#js_GlobalMenu_cities')[0].className == "premiumactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Something happened in one of your towns!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/mayor_premium_active.png");
        }
        // diplomacy advisor
        if ($('#js_GlobalMenu_diplomacy')[0].className == "normalactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Someone sent you a message!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/diplomat_active.png");
        }
        if ($('#js_GlobalMenu_diplomacy')[0].className == "premiumactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Someone sent you a message!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/diplomat_premium_active.png");
        }
        // military advisor
        // by checking if military is !normal we can also include the red status
        if ($('#js_GlobalMenu_military')[0].className == "normalactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Your military advisor is trying to tell you something!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/general_active.png");
        }
        if ($('#js_GlobalMenu_military')[0].className == "premiumactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "Your military advisor is trying to tell you something!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/general_premium_active.png");
        }
        if ($('#js_GlobalMenu_military')[0].className == "normalalert") {
            console.log('Ding!');
            notifyMe("Ikariam", "You are under attack!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/general_alert.png");
        }
        if ($('#js_GlobalMenu_military')[0].className == "premiumalert") {
            console.log('Ding!');
            notifyMe("Ikariam", "You are under attack!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/general_premium_alert.png");
        }
        // research advisor
        if ($('#js_GlobalMenu_research')[0].className == "normalactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "New research aviable!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/scientist_active.png");
        }
        if ($('#js_GlobalMenu_research')[0].className == "premiumactive") {
            console.log('Ding!');
            notifyMe("Ikariam", "New research aviable!", "http://s2-ae.ikariam.gameforge.com/skin/layout/advisors/scientist_premium_active.png");
        }
    }
    // wait 60.000 ms (1 min) between checking for notifications
},30000);


function notifyMe(title, message, picture) {
    // check if functionality exists
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (!picture) {
        picture = "https://www.jcdanczak.com/images/samples.png";
    }

    // ask for permission to speak
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            // notification icon, should be replaced with the correct advisor later
            icon: picture,
            body: message,
        });
        // kill notifications 700 ms after their birth
        setTimeout(function(){notification.close();}, 7000);
        // if user shows affection for notify, let notify do them a last service before it dies prematurely.
        notification.onclick = function () {
            window.open("http://s2-ae.ikariam.gameforge.com/index.php");
        };
    }
}
