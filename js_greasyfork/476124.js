// ==UserScript==
// @name         Bring Twitter Icons Back
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Attempt at bringing back Twitter icons, removing Subscription buttons, removing blue checks
// @author       You
// @match        https://*twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476124/Bring%20Twitter%20Icons%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/476124/Bring%20Twitter%20Icons%20Back.meta.js
// ==/UserScript==

GM_addStyle('div#placeholder > svg { visibility: hidden!important; }');
GM_addStyle('[data-testid="icon-verified"] { display: none !important; }');
GM_addStyle("[style='min-width: 104px;'] > [aria-describedby] { display: none !important; }")
GM_addStyle("[href$='/superfollows'] { display: none !important; }")
GM_addStyle("[style='border-color: rgb(201, 54, 204);'] { display: none !important; }")
GM_addStyle('[data-testid="icon-subscriber"] { display: none !important; }');

function replaceSVG() {
    var svgElement = document.querySelector('div#placeholder > svg');
    if (svgElement) {
        svgElement.innerHTML = `<g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>`; // Replace with your SVG's code

        // Make the new SVG visible
        svgElement.style.visibility = 'visible !important';
        return true
    }
    return false
}

function changeFavicon() {
    var favicon = document.querySelector('link[rel~="icon"]');
    if (favicon) {
        var clone = favicon.cloneNode(true);
        clone.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2YT4hPURTHr3PmmYU/oSQWdiLlX5KFUogyIvmz8Cf5t8SGrGQWiixFGqWI/Oac22gkZkWyU6SRKAsiJZphfr93zhsy+T2950emZqb3e/e9N5v3qbt7797zPefce889xpSUlJSUlJQkxNbmI+kFZH2NJAGy1oDlObKcMbd19ki/eBVZbFzATt1o2kNwmqQ9hMhIJBlC1nDEQSpAejj+/k7fFCR/O7A+QtKL6Re2XyYjaTXymov9SHJlVMN5+ACSZ8jy848o+WRsdYbDwtr2n4cuGxtis3OAld1JjcfhEen3rC41t6rTsVPWpRIAVo4M8w7L3aY8EoYTkORt88bLELB2AetjJP3qWVmUTgDLsREm/4hW1if5v4WCFam8z3+HfEcbbDFpQQo2j5qrLN2my18wpgNIDzgI6Gshf5VxIj4NVMYIdR1I7kVCTU/YmiiCSTczyy6TBY1zO8mitUbenkAra01XbR6w7E0dgU5/WyYCzI1wErK+ccvlNAJ0g7PtQLIHSPd5FV0GLL1FCvDSnjyj5jDJYGECSOpR5J0FRBdJ4anD8SX2ymQFsDwpXoR0ZCbAs8Hyf7VJcRFoM1mCJDsLE0Hab2w40WRNVBYAy9P8Bcg5kwdIwVa0uglJriHJj5yMHzSVYE5OAvRSAZv3vMkN689E1s85ps4Hc7N/an4Con1QCVYi67ccPP8raYnuTlSkkT7MUgBYPW2KJrofgLQdWB84ps716OVWuIBoUWA9iKQDTsbb5t/ZbvSErWB1P7C+cDC8DqSncvW8R7okSpMW8lej9XcA6UlguY+kvmPKvEOSNSZ3ugemIcvZRgctg2NSq7HXsyiTm6Iis4DkOLC+THXCsPQCydHIIWbcsf5CsHoISa7GZXbU84k7d1KP7weS93E7kKUjbhPawbnjbXJJSUlJSUmJyZHfxnHsrRJKPnUAAAAASUVORK5CYII";
        favicon.parentNode.removeChild(favicon);
        document.head.appendChild(clone);
    }
}

function changeHomeIcon() {
    var home_icon = document.querySelector("a[href='/home'] svg");
    if (home_icon) {
        home_icon.outerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp old-twitter-icon" data-replaced="true"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>`; // truncated for brevity
        return true; // return true to indicate that the icon was found and changed
    }
    return false; // return false if the icon was not found
}

function removePremiumButton() {
    var links = document.querySelectorAll('a[href="/i/verified-choose"]');
    links.forEach(link => {
        link.parentNode.removeChild(link);
    });
}

/*
function startPolling() {
    const interval = setInterval(() => {
        if (replaceSVG()) {
            console.log("yes");
            clearInterval(interval); // Stop polling once the SVG is replaced
        }
    }, 100); // Check every 20ms
}

startPolling();
*/

function modifyTitle() {
    if (document.title.includes(' / X')) {
        document.title = document.title.replace(' / X', ' / Twitter');
    }
}

// Function to handle the title change
function handleTitleChange(mutations) {
    mutations.forEach(mutation => {
        modifyTitle()
    });
}

// Function to observe the title once it's added
function observeTitle() {
    var titleElement = document.querySelector('title');
    if (titleElement) {
        var titleObserver = new MutationObserver(handleTitleChange);
        titleObserver.observe(titleElement, { childList: true });
        headObserver.disconnect(); // Stop observing the head once the title is found
    }
}

// Set up a MutationObserver to watch for the addition of the <title> element
var headObserver = new MutationObserver(observeTitle);
headObserver.observe(document.head, { childList: true });

if (document.readyState === "loading") {
    window.addEventListener('DOMContentLoaded', function() {
        changeFavicon();
        if (!changeHomeIcon()) {
            // If the home icon wasn't found, set up a MutationObserver to watch for DOM changes
            var observer = new MutationObserver(function(mutations, obs) {
                if (changeHomeIcon()) {
                    removePremiumButton();
                    obs.disconnect(); // Disconnect the observer once the icon is found and changed
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, false);
} else {
    changeFavicon();
    if (!changeHomeIcon()) {
        var observer = new MutationObserver(function(mutations, obs) {
            if (changeHomeIcon()) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}
