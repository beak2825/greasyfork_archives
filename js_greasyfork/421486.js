// ==UserScript==
// @name         Panopto Annoyances Remover
// @namespace    http://github.com/jaytohe/
// @version      1.2.0
// @description  Fixes many annoyances in Panopto. Space button now always controls the video.
// @author       jaytohe
// @match        https://*.panopto.eu/Panopto/Pages/Viewer.aspx?id=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421486/Panopto%20Annoyances%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/421486/Panopto%20Annoyances%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BlackListIDs = ['quickRewindButton','quickFastForwardButton','volumeControl', 'captionsButton', 'playButton', 'playSpeedButton', 'qualityButton', 'captionStyleOptions'];

    function checkID(val) {
     if (typeof val !== 'undefined') {
         const thumb_regex = /thumbnail\d+thumbnailList/g;
         const event_regex = /^event\d+$/g;
         const transcript_regex = /^UserCreatedTranscript-\d+$/g;
        if ( BlackListIDs.includes(val)
            || thumb_regex.test(val)
            || event_regex.test(val)
            || transcript_regex.test(val)
           ) {
                 return true;
        }
     }
     return false;
    }
    if (EventTarget.prototype.original_addEventListener == null) {
        EventTarget.prototype.original_addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener =function override_listener(typ, fn, opt) {

            if (checkID(this.id) && typ === 'keydown') {
                const tmp_func = function(e) {
                    const original = fn;
                    if (e.keyCode === 32) {
                        e.stopImmediatePropagation();
                        e.preventDefault(); //prevent scrolling of sidebar.
                        document.getElementById('playButton').click();
                        return;
                    }
                    original(e);
                }
                this.original_addEventListener(typ, tmp_func, opt);
            }

            this.original_addEventListener(typ, fn, opt);
        }
        }
})();