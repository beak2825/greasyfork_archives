// ==UserScript==
// @name         Soundcloud Repost Hider
// @namespace    https://github.com/ehrenjn
// @version      0.1.1
// @description  Hides reposts on soundcloud
// @author       Ehren Julien-Neitzert
// @match        https://soundcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40052/Soundcloud%20Repost%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/40052/Soundcloud%20Repost%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var last_tracks = [];
    var hide_reposts = false;

    //continuously checks for changes to tracks every 150 milliseconds because im too lazy to figure out all the ResizeObserver junk
    window.setInterval(function() {
        //console.log('checking');
        if (location.href == 'https://soundcloud.com/stream') { //only want to actually run on the stream
            add_repost_button();
            check_tracks();
        } else { //empty last_tracks so that reposts are hidden even if the user goes from /stream, then to another soundcloud page, and then back to /stream
            hide_reposts = false;
            last_tracks = [];
        }
    }, 150);


    function add_repost_button() {
        if (document.querySelector('#hide_repo_button') === null) {
            var b = document.createElement('button');
            b.classList.add('sc-button');
            b.classList.add('sc-button-small');
            b.innerText = 'Hide Reposts';
            b.id = 'hide_repo_button';
            b.onclick = hide_button_clicked;
            document.querySelector('.stream').prepend(b);
        }
    }
    function hide_button_clicked() {
        if (this.style.color == "rgb(255, 85, 0)") {
            //console.log('reposts visable');
            hide_reposts = false;
            this.style.color = 'black';
            unhide_tracks();
        } else {
            //console.log('reposts hidden');
            this.style.color = "rgb(255, 85, 0)";
            hide_reposts = true;
        }
    }

    function check_tracks() {
        if (hide_reposts) { //if we're hiding reposts
            var tracks = document.querySelectorAll('.sound.streamContext');
            if (tracks.length != last_tracks.length) {
                //console.log('checking all tracks for reposts');
                for (let t = 0; t < tracks.length; t++) {
                    var track = tracks[t];
                    if (track.getElementsByClassName('soundContext__repost').length != 0
                    && ! track.hidden) { //if its a repost that's not already hidden
                        track.hidden = true;
                    }
                }
                last_tracks = tracks;
            }
        }
    }

    function unhide_tracks() {
        var tracks = document.querySelectorAll('.sound.streamContext');
        for (let t = 0; t < tracks.length; t++) {
            tracks[t].hidden = false;
        }
        last_tracks = []; //reset list of tracks so they can all be hidden agian
    }

})();