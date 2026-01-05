// ==UserScript==
// @name Delay removal Moonwalk
// @namespace play once
// @description отключение задержки перед воспроизведением
// @match *://*/*
// @version 1.3
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/18847/Delay%20removal%20Moonwalk.user.js
// @updateURL https://update.greasyfork.org/scripts/18847/Delay%20removal%20Moonwalk.meta.js
// ==/UserScript==

(function () {
    var w = unsafeWindow || window,
        inIFrame = function() {
            try {
                return w.self !== w.top;
            } catch (e) {
                return true;
            }
        };

    if (!inIFrame)
        return;

    function playonce() {
        if (typeof delay !== undefined)
            delay=0;
    }

    window.addEventListener('load',function() {
        if (w.condition_detected !== undefined) {
            w.request_host_id = "19804";
            var player = document.getElementById('player');
            if (player) player.onclick = function(){
                w.showVideo();
            };
        }
    },false);
})();