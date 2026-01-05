// ==UserScript==
// @name            Youtube: UpDown to Scroll
// @description     Scroll up/down when using home/end/up/down arrow/page up/page down instead of controlling the volume.
// @author          Chris H (Zren)
// @icon            https://youtube.com/favicon.ico
// @namespace       http://xshade.ca
// @version         5
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @downloadURL https://update.greasyfork.org/scripts/28324/Youtube%3A%20UpDown%20to%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/28324/Youtube%3A%20UpDown%20to%20Scroll.meta.js
// ==/UserScript==

window.addEventListener('keydown', function(e) {
    var validTarget = e.target.id === 'movie_player' || e.target.id === 'player-api' || e.target.className === 'ytp-progress-bar'
    if (validTarget) {
        if (e.keyCode === 33) { // PageUp
            e.stopPropagation()
        } else if (e.keyCode === 34) { // PageDown
            e.stopPropagation()
        } else if (e.keyCode === 35) { // End
            e.stopPropagation()
        } else if (e.keyCode === 36) { // Home
            e.stopPropagation()
        } else if (e.keyCode === 38) { // ArrowUp
            e.stopPropagation()
        } else if (e.keyCode === 40) { // ArrowDown
            e.stopPropagation()
        }
    }
}, true);
