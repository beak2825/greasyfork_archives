// ==UserScript==
// @name         Direct Stream Caster
// @namespace    https://tampermonkey.net
// @version      3.2
// @description  Dynamically detect and cast HLS streams via Chromecast on any site (e.g., StreamEast)
// @author       sharmanhall
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537814/Direct%20Stream%20Caster.user.js
// @updateURL https://update.greasyfork.org/scripts/537814/Direct%20Stream%20Caster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let detectedStreamUrl = null;
    const REFERER = "https://googlapisapi.com";

    // Hook fetch and XHR to sniff for .m3u8 playlist requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('.m3u8')) {
            console.log('[CastDetect] Found .m3u8 via fetch:', args[0]);
            detectedStreamUrl = args[0];
        }
        return originalFetch(...args);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.includes('.m3u8')) {
            console.log('[CastDetect] Found .m3u8 via XHR:', url);
            detectedStreamUrl = url;
        }
        return originalXHROpen.apply(this, arguments);
    };

    // Inject Cast SDK
    const sdkScript = document.createElement('script');
    sdkScript.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    document.head.appendChild(sdkScript);

    // Wait for Cast API and then inject cast button
    window.__onGCastApiAvailable = function (isAvailable) {
        if (!isAvailable) return;

        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });

        addCastButton();
    };

    function addCastButton() {
        if (document.getElementById('castToChromecast')) return;

        const btn = document.createElement('button');
        btn.id = 'castToChromecast';
        btn.textContent = '📺 Cast Stream';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 9999,
            padding: '12px 20px',
            backgroundColor: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        });

        btn.onclick = () => {
            const context = cast.framework.CastContext.getInstance();
            const session = context.getCurrentSession();

            if (!session) {
                alert("No Chromecast session. Click the Cast icon in your Chrome toolbar first.");
                return;
            }

            if (!detectedStreamUrl) {
                alert("No stream detected yet. Wait for the stream to load or refresh.");
                return;
            }

            const mediaInfo = new chrome.cast.media.MediaInfo(detectedStreamUrl, 'application/x-mpegurl');
            mediaInfo.customData = {
                headers: {
                    Referer: REFERER
                }
            };

            const request = new chrome.cast.media.LoadRequest(mediaInfo);
            session.loadMedia(request).then(() => {
                console.log("Casting stream:", detectedStreamUrl);
            }).catch(console.error);
        };

        document.body.appendChild(btn);
    }
})();