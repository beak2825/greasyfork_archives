// ==UserScript==
// @name           Twitch and YouTube PiP-Enable for Mac
// @namespace      https://greasyfork.org/en/users/873652-blazingfire007
// @license        MIT
// @version        1.0.0
// @author         Eli Richardson
// @description    Enabled PiP on twitch.tv and youtube.com for macOS only.
// @match          *://*.twitch.tv/*
// @match          *://*.youtube.com/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/439666/Twitch%20and%20YouTube%20PiP-Enable%20for%20Mac.user.js
// @updateURL https://update.greasyfork.org/scripts/439666/Twitch%20and%20YouTube%20PiP-Enable%20for%20Mac.meta.js
// ==/UserScript==

window.pipscript = {};
window.pipscript.control = false;
window.pipscript.enabled = false;
document.addEventListener('readystatechange', async function (e) {
    if (document.readyState === 'complete') {
        console.log('PiP: injecting...');
        if (typeof document.querySelector === 'undefined' && typeof $ === 'undefined') {
            return alert('Unsupported browser!');
        }
        if (typeof document.querySelector === 'undefined') {
            document.querySelector = $;
        }
        return setupListeners();
    } else {
        return e;
    }
});

function setupListeners() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Control') window.control = true;
    });
    document.addEventListener('keyup', function (e) {
        if (e.key === 'Control') window.control = false;
        else if (e.key === 'p' && window.control) {
            if (window.pipscript.enabled) {
                document.exitPictureInPicture();
                window.pipscript.enabled = false;
            } else {
                document.querySelector('video').requestPictureInPicture().then(console.log);
                window.pipscript.enabled = true;
            }
        }
    });
}
