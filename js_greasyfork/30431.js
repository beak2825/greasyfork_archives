// ==UserScript==
// @name         seek +/- 5 sec in video player (html5) with arrow keys (hold Ctrl for 30 sec)
// @description  ^^^^^^^
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       jaborandi
// @match        http://ru.eurosportplayer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30431/seek%20%2B-%205%20sec%20in%20video%20player%20%28html5%29%20with%20arrow%20keys%20%28hold%20Ctrl%20for%2030%20sec%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30431/seek%20%2B-%205%20sec%20in%20video%20player%20%28html5%29%20with%20arrow%20keys%20%28hold%20Ctrl%20for%2030%20sec%29.meta.js
// ==/UserScript==

(function() {
window.addEventListener('load', function() {
    document.addEventListener('keydown', function(e) {
		if (![37,39].includes(e.keyCode)) return;
		var player = document.getElementsByTagName('video')[0];
		if (!player) return;
        if (e.keyCode == 37) player.currentTime -= e.ctrlKey?30:5;
		else /* if (e.keyCode == 39) */ player.currentTime += e.ctrlKey?30:5;
    });
});
})();