// ==UserScript==
// @name            YouTube Channel Scroll Saver
// @name:de         YouTube Channel Scroll Saver
// @namespace       https://www.youtube.com/
// @version         1.6.1
// @description     Saves and restores scroll position on YouTube channel videos pages
// @description:de  Speichert und stellt die Scrollposition auf der Video-Seite des YouTube-Kanals wieder her
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match           https://www.youtube.com/@*/videos
// @match           https://www.youtube.com/*
// @require         https://greasyfork.org/scripts/455253-kamikaze-script-utils/code/Kamikaze'%20Script%20Utils.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @resource        toastifyCss https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/534035/YouTube%20Channel%20Scroll%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/534035/YouTube%20Channel%20Scroll%20Saver.meta.js
// ==/UserScript==

// Autoscroll to last postion on this channel.
// Leave it false if you wan to click a button to manual scroll
const doAutoscroll = false

// Save scroll position at most every 3 second
const saveDelay = 3000



/* global Logger waitForElm notify */



const SCRIPT_NAME = "YT Scroll Saver"
const log = new Logger(SCRIPT_NAME, 4);

// Load remote JS
GM_xmlhttpRequest({
    method : "GET",
    // from other domain than the @match one (.org / .com):
    url : "https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js",
    onload : (ev) =>
    {
        let e = document.createElement('script');
        e.innerText = ev.responseText;
        document.head.appendChild(e);
    }
});

// Load remote CSS
const extCss = GM_getResourceText("toastifyCss");
GM_addStyle(extCss);


(function() {
    // https://stackoverflow.com/questions/61964265/getting-error-this-document-requires-trustedhtml-assignment-in-chrome
    if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string
            // Optional, only needed for script (url) tags
            //,createScriptURL: string => string
            //,createScript: string => string,
        });
    }

    let isScrolling = false;
    let btnAdded = false;
    let saveTimeout = null;
    let lastUrl = location.href;

    function getChannelUsername() {
        const match = window.location.pathname.match(/@([^/]+)/);
        return match ? match[1] : null;
    }

    function saveScrollPosition() {
        const username = getChannelUsername();
        if (!username) return;

        const scrollPosition = window.scrollY;
        if ( scrollPosition > 800 ) {
            localStorage.setItem(`yt_scroll_${username}`, scrollPosition);
            notify(`[YT Scroll Saver] Saved position: ${scrollPosition}px for @${username}`, 3000)
            log.debug(`Saved position: ${scrollPosition}px for @${username}`);
        } else {
            log.debug(`Scroll pos is below 800 (${scrollPosition}). Don't save pos.`);
            return
        }
    }

    function loadScrollPosition() {
        const username = getChannelUsername();
        if (!username) {
            isScrolling = false
            return
        };

        const savedPosition = parseInt(localStorage.getItem(`yt_scroll_${username}`) || "0", 10);
        if (savedPosition <= 0) {
            isScrolling = false
            return
        };

        notify(`[YT Scroll Saver] Trying to restore position: ${savedPosition}px for @${username}`)
        log.debug(`[YT Scroll Saver] Trying to restore position: ${savedPosition}px for @${username}`);

        if (!btnAdded) createManualScrollBtn(savedPosition)
        if (doAutoscroll) scrollTo(savedPosition)
    }

    function scrollTo(pos) {
        let attempts = 0;
        const maxAttempts = 20; // 500ms * 20 = 10 seconds max

        const scrollInterval = setInterval(() => {
            if (window.scrollY >= pos || attempts >= maxAttempts) {
                clearInterval(scrollInterval);
                isScrolling = false
                notify(`[[YT Scroll Saver] Scroll position reached or max attempts hit. {Pos: ${window.scrollY}, Saved: ${pos}}`)
                log.debug(`[YT Scroll Saver] Scroll position reached or max attempts hit. {Pos: ${window.scrollY}, Saved: ${pos}}`);
                return;
            }
            notify(`[YT Scroll Saver] Scrolling.. `, 1000)
            log.debug(`[YT Scroll Saver] Scrolling.. `);
            window.scrollTo(0, pos);
            attempts++;
        }, 500);
    }

    async function createManualScrollBtn(pos) {
        const chipList = await waitForElm("iron-selector")
        const btn = document.createElement("button")

        btn.addEventListener( 'click', () => scrollTo(pos) )
        btn.innerText = `Scroll to: ${pos}`
        btn.style = `
        background-color: transparent;
        padding: 8px;
        border-radius: 10px;
        margin: 0 30px;
        color: #f1f1f1;
        border-color: rgba(255, 255, 255, 0.2);
        outline: none !important;
        cursor: pointer;
`

        chipList.append(btn)
        btnAdded = true
    }

    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (window.location.pathname.includes('/videos')) {
                log.debug("[YT Scroll Saver] Detected navigation to a channel's /videos page.");
                isScrolling = true
                setTimeout(loadScrollPosition, 1000);
            } else {
                btnAdded = false
            }
            log.debug("btnAdded",btnAdded)
        }
    }

    // Attach scroll event listener
    window.addEventListener('scroll', () => {
        if (!window.location.pathname.includes('/videos') || isScrolling) return;
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveScrollPosition, saveDelay);
    });

    // Watch for SPA navigation changes
    const observer = new MutationObserver(checkUrlChange);
    observer.observe(document.body, { childList: true, subtree: true });

    // Restore scroll position after page loads
    if (window.location.pathname.includes('/videos')) {
        isScrolling = true
        notify(`[YT Scroll Saver] Loading scroll position.`)
        log.debug(`[YT Scroll Saver] Loading scroll position.`);
        setTimeout(loadScrollPosition, 1000); // Delay to allow initial content to load
    };
})();
