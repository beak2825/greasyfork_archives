// ==UserScript==
// @name         Free soundsnap.com
// @name:en      Free soundsnap.com
// @name:ru      Бесплатный soundsnap.com
// @namespace    tuxuuman:soundsnap
// @version      0.2.1
// @description:en  Free download of sounds from soundsnap.com.
// @description:ru  Бесплатная загрузка звуков с сайта soundsnap.com.
// @author       tuxuuman <tuxuuman@gmail.com>
// @match        *://www.soundsnap.com/*
// @grant        none
// @run-at document-body
// @description Free download of sounds from soundsnap.com.
// @downloadURL https://update.greasyfork.org/scripts/33772/Free%20soundsnapcom.user.js
// @updateURL https://update.greasyfork.org/scripts/33772/Free%20soundsnapcom.meta.js
// ==/UserScript==

(function() {
    var createBackend = WaveSurfer.prototype.createBackend;
    WaveSurfer.prototype.createBackend = function() {
        createBackend.apply(this, arguments);
        var self = this;
        jQuery(self.container)
            .parents('.ojoo-audio')
            .find('.audio-download')
            .css('width', '300px')
            .append(jQuery('<span></span>', {
                title: "free download ^^",
                "class": "si_buttons si_download",
                click: function() {
                    location.href = self.backend.song;
                },
               text: "Free",
               css: {
                   "margin-top": "3px",
                   "border-radius": "4px"
               }
        }));
    }

})();