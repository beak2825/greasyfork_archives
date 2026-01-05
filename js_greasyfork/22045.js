// ==UserScript==
// @name            Moonwalk&HDGo&Kodik FIXTEST
// @name:en         Moonwalk&HDGo&Kodik FIXTEST
// @namespace       FIXTEST
// @version         0.1.4
// @description     Смотри фильмы и сериалы без ожидания!
// @description:en  Watch movies and serials without waiting!
// @author          raletag
// @match           *://*/*
// @run-at          document-start
// @grant           unsafeWindow
// @compatible      Opera 15+
// @compatible      Chrome
// @incompatible      Dolphin Browser
// @downloadURL https://update.greasyfork.org/scripts/22045/MoonwalkHDGoKodik%20FIXTEST.user.js
// @updateURL https://update.greasyfork.org/scripts/22045/MoonwalkHDGoKodik%20FIXTEST.meta.js
// ==/UserScript==

(function() {
alert('Script start!');
    var win = unsafeWindow || window,
        inIFrame = function() {
            try {
                return win.self !== win.top;
            } catch (e) {
                return true;
            }
        };

      (function () {
alert(!inIFrame);
        if (!inIFrame)
            return;

        document.addEventListener ("DOMContentLoaded", function() {
            if (win.condition_detected !== undefined) {
                alert('Moonwalk player detected!');
                win.request_host_id = "19804";
                var player = document.getElementById('player');
                if (player) player.onclick = function() {
                    win.showVideo();
                };
            } else if (win.banner_second !== undefined) {
                win.banner_second = 0;
                var player = document.getElementById('MT_overroll');
                if (player) player.onclick = function() {
                    var adsdiv = document.getElementById("ads-player-hd");
                    adsdiv.parentNode.removeChild(adsdiv);
                    win.setPlayer();
                };
            } else if (win.MXoverrollCallback !== undefined) {
                var player = document.getElementsByClassName('play_button')[0];
                if (player) player.onclick = function() {
                    win.MXoverrollCallback();
                };
            }
        },false);
    })();

})();