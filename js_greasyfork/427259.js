// ==UserScript==
// @name           FullScreen
// @version        1.0
// @namespace      -
// @description    fs
// @include        https://rt.bongacams.xxx
// @downloadURL https://update.greasyfork.org/scripts/427259/FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/427259/FullScreen.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keypress', handler);
    
    function handler(e) {
        if (e.keyCode !== 32) return;
        const vid = document.getElementById('stream-layer');
        
        vid.style.zIndex = '999999';
        vid.style.height = '100vh';
        vid.style.width = '100vw';
    }
})();