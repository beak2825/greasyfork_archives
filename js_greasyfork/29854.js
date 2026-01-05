// ==UserScript==
// @name         Youtube Bigger Theater
// @namespace    qpqp.dk
// @version      0.1
// @description  Make 'Theater View' on Youtube videos fill the screen.
// @author       Viktor Strate
// @match        https://www.youtube.com/watch*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29854/Youtube%20Bigger%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/29854/Youtube%20Bigger%20Theater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = '<style id="theaterStyle">'+
        '.player-height { height: calc(100vh - 50px) !important; }' +
        '.player-width { width: 100% !important; }' +
        '#player .player-api { left: 0 !important; margin: 0 !important; }' +
        '.watch-stage-mode .player-width { margin: 0 !important; }' +
        '</style>';

    // Theater button left for full screen button
    var theaterBtn = $('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-size-button.ytp-button');

    theaterBtn.mouseup(function(e) {
        var theater = getPlayerTheater();
        // Because of ~500ms delay for player mode to update, use the oposite value
        setPlayerMode(!theater);
    });

    // Returns true if Youtube player is in theater mode, and false if in normal mode.
    function getPlayerTheater () {
        if ($('#page').hasClass('watch-wide')) {
            return true;
        } else return false;
    }

    function setPlayerMode (theater) {
        var theaterStyle = $('#theaterStyle');
        if (theater) {
            if (theaterStyle.length===0) {
                $('body').append(style);
            }
        } else {
            if (theaterStyle.length>0) {
                theaterStyle.remove();
            }
        }
    }

    if (getPlayerTheater()) setPlayerMode(true);
})();
