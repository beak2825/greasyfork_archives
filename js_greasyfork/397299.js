// ==UserScript==
// @name        Deezer Media Session Support
// @namespace   http://tampermonkey.net/
// @description    Deezer Media Session Support for Chrome
// @include     http://*.deezer.com/*
// @include     https://*.deezer.com/*
// @version     1.0.8
// @run-at      document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/397299/Deezer%20Media%20Session%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/397299/Deezer%20Media%20Session%20Support.meta.js
// ==/UserScript==

(function (dzPlayer, _){
    navigator.mediaSession.setActionHandler('previoustrack', function() {
        if (!dzPlayer.isRadio() || _.noLimit){
            dzPlayer.control.prevSong();
        }
    });

    navigator.mediaSession.setActionHandler('nexttrack', function() {
        dzPlayer.radioSkipCounter = ~~_.noLimit || dzPlayer.radioSkipCounter; // unlimited skips
        dzPlayer.control.nextSong();
    });

    navigator.mediaSession.setActionHandler('play', function() {
        dzPlayer.control.play();
        if (_.pausets + _.pauseConst > +new Date()){
            _.pauseTimeout = setTimeout(function(){
                dzPlayer.radioSkipCounter = ~~_.noLimit || dzPlayer.radioSkipCounter; // unlimited skips
                dzPlayer.control.nextSong();
                _.pauseTimeout = 0;
            }, _.pauseConst)
        }
    });

    navigator.mediaSession.setActionHandler('pause', function() {
        if (_.pauseTimeout){
            clearTimeout(_.pauseTimeout);
            _.pauseTimeout = 0;
            if (!dzPlayer.isRadio() || _.noLimit){
                dzPlayer.control.prevSong();
            }
        } else {
            dzPlayer.control.pause();
        }
        _.pausets = +new Date();
    });

    navigator.mediaSession.setActionHandler('seekbackward', function() {
        dzPlayer.control.seek(Math.max(dzPlayer.getPosition() - _.seekConst, 0) / dzPlayer.getDuration());
    });

    navigator.mediaSession.setActionHandler('seekforward', function() {
        dzPlayer.control.seek(Math.min(dzPlayer.getPosition() + _.seekConst, dzPlayer.getDuration()) / dzPlayer.getDuration());
    });

    // block deezer from overriding userscript actions
    MediaSession.prototype.setActionHandler = function(){}; //(a,b){console.log(a,b); };

})(dzPlayer, {
    seekConst:30,
    noLimit:true,
    pausets:0,
    pauseConst: 333
});