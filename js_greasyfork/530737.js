// ==UserScript==
// @name         Inline Media Player (HTML5)
// @namespace    gfish
// @author       gfish
// @version      1.0
// @description  Watch video/audio URLs right on the page instead of downloading them!
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530737/Inline%20Media%20Player%20%28HTML5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530737/Inline%20Media%20Player%20%28HTML5%29.meta.js
// ==/UserScript==

(function() {
    const VIDEO_EXTENSIONS = ['mp4', 'm4v', 'mov', 'avi', 'mpeg', 'wmv', 'mov']
    const AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac']
    let inv = setInterval(() => {
        if (document.links.length > 0) {
            clearInterval(inv);
            Object.values(document.links).forEach(s => {
                let ext = s.href.split('.').pop().toLowerCase().split('?').shift();
                if (VIDEO_EXTENSIONS.includes(ext)) {
                    let frame = document.createElement("span");
                    frame.innerHTML = `<br><video controls="" loop preload="metadata" style="max-width: 100%; max-height: 100vh;" ><source src="${s.href}"></source></video>`;
                    s.parentNode.insertBefore(frame, s.nextSibling);
                }
                else if (AUDIO_EXTENSIONS.includes(ext)) {
                    let frame = document.createElement("span");
                    frame.innerHTML = `<br><audio controls="" loop preload="metadata" style="width: 100%;" ><source src="${s.href}"></source></audio>`;
                    s.parentNode.insertBefore(frame, s.nextSibling);
                }
            })
        }
    }, 100)
})();
