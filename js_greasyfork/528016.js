// ==UserScript==
// @name         Open2chの返信音を変える
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  hayabusaの方
// @author       icchi
// @match        https://hayabusa.open2ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528016/Open2ch%E3%81%AE%E8%BF%94%E4%BF%A1%E9%9F%B3%E3%82%92%E5%A4%89%E3%81%88%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528016/Open2ch%E3%81%AE%E8%BF%94%E4%BF%A1%E9%9F%B3%E3%82%92%E5%A4%89%E3%81%88%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetURLs = {
        'https://image.open2ch.net/lib/sound/sound.mp3':
            'https://raw.githubusercontent.com/Bongocat27/onj-sound-rawlink/main/%E3%83%9A%E3%82%BF%E3%83%83.mp3',
        'https://image.open2ch.net/lib/sound/drum-japanese2.mp3':
            'https://raw.githubusercontent.com/Bongocat27/onj-sound-rawlink/main/%E3%83%8B%E3%83%A5%E3%833.mp3'
    };

    const originalAudio = window.Audio;
    window.Audio = function(src) {
        for (const [target, custom] of Object.entries(targetURLs)) {
            if (src && src.includes(target)) {
                console.log(`[Tampermonkey] 音源を置き換え: ${src} → ${custom}`);
                return new originalAudio(custom);
            }
        }
        return new originalAudio(src);
    };

    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        for (const [target, custom] of Object.entries(targetURLs)) {
            if (this.src.includes(target)) {
                console.log(`[Tampermonkey] 音源を置き換え: ${this.src} → ${custom}`);
                this.src = custom;
            }
        }
        return originalPlay.call(this);
    };
})();
