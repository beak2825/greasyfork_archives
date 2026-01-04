// ==UserScript==
// @name        [Aternos] AntiAntiAdblock!
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     10.0
// @author      HKR
// @description Removes all the adblock reminders without a hussle.
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/436921/%5BAternos%5D%20AntiAntiAdblock%21.user.js
// @updateURL https://update.greasyfork.org/scripts/436921/%5BAternos%5D%20AntiAntiAdblock%21.meta.js
// ==/UserScript==

/* Script doesn't work? 
- Please read https://hakorr.github.io/Userscripts/Aternos/AntiAntiAdblock/course/ before rating it! */

/* Note to the developers, touch some grass. */

$(document).ready(function () {
    Array.from($(".ad")).forEach(ad => ad.setAttribute("style","display: none;")); 
    document.querySelector(".sidebar").setAttribute("style","display: none;"); 
    
    $(".body, .header").each(function () {
        this.style.setProperty("display", "");
        this.style.setProperty("height", "");
    });

    $("#start").each(function () {
        this._ready = true;
    });

    $("#userdropdown-toggle").click(function (e) {
        if ($(window).width() <= 1e3) {
        e.preventDefault();
        $(".userdropdown").slideToggle(100);
        }
    });

    $(".logout").click(function () {
        aget("/panel/ajax/account/logout.php", function () {
        location.href = "/go/";
        });
    });
    $(".navigation-toggle").click(function () {
        var cookieValue = 0;
        if ($(".navigation").hasClass("toggled")) {
        $(".navigation").removeClass("toggled");
        } else {
        $(".navigation").addClass("toggled");
        cookieValue = 1;
        }
        document.cookie = COOKIE_PREFIX + "_NAVIGATION_TOGGLED=" + cookieValue + ";path=/;max-age=31536000";
    });
    $(".friend-access-count-dropdown").click(function () {
        var dropdown = $(".friend-access-dropdown");
        if (dropdown.css("display") === "none") {
        dropdown.slideDown(100);
        $(".friend-access-count-dropdown i").fa("fas", "fa-caret-up");
        } else {
        dropdown.slideUp(100);
        $(".friend-access-count-dropdown i").fa("fas", "fa-caret-down");
        }
    });
    $(".js-friends-access").click(friendAccess);
    $(".js-friends-leave").click(friendLeave);
    $(".hamburger").click(function () {
        if ($(".navigation").css("left") == "-200px") {
        $(".navigation").animate({left: "0px"});
        } else {
        $(".navigation").animate({left: "-200px"});
        }
    });
});

/* onbeforescriptexecute - https://github.com/Ray-Adams/beforeScriptExecute-Polyfill */
const HakorrIsCute = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + 5);

(() => {
    'use strict';

    if ('onbeforescriptexecute' in document) return;

    const BseEvent = new Event(HakorrIsCute, {
        bubbles: true,
        cancelable: true
    });

    const observerCallback = (mutationsList) => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;

                // Adds functionality to document.onbeforescriptexecute
                if (typeof document.HakorrIsCute === 'function') {
                    document.addEventListener(
                        HakorrIsCute,
                        document.HakorrIsCute,
                        { once: true }
                    );
                };

                // Returns false if preventDefault() was called
                if (!node.dispatchEvent(BseEvent)) {
                    node.remove();
                };
            };
        };
    };

    const scriptObserver = new MutationObserver(observerCallback);
    scriptObserver.observe(document, { childList: true, subtree: true });
})();

function HakorrIsCool(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

//A new web request initiated
document.HakorrIsCute = (e) => {
    //If it requests a selected file
    if (e.target.src.includes('data:text/javascript;base64,')) {
        //Block it
        e.preventDefault();

        e.target.getAttribute("src")
            .split("data:text/javascript;base64,")
                .forEach(t=>{if(HakorrIsCool(t)){atob(t)
                        .split(" ").forEach(t=>{t
                            .includes(atob("XzB4NGMwND0="))&&t
                                .split("'").forEach(t=>{t
                                    .includes("#")&&0!=t.length&&$(t)&&($(t)[0]
                                        .innerHTML="")})})}});
    }
}

if(confirm(`This script doesn't function, as it is not developed anymore!
    
REASON: Aternos' developers keep an eye on scripts like these, and patch them.

The userscript needs to be private or very secret to function for a long period of time. That's why you need to build your own version!

Would you like to be redirected to my crash course to build your own version?`)) {
    window.location.href = "https://hakorr.github.io/Userscripts/Aternos/AntiAntiAdblock/course/";
}