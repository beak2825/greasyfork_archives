// ==UserScript==
// @name         Freesound Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  adds shortcuts to freesound
// @author       Sebastien Andary
// @match        https://freesound.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32709/Freesound%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/32709/Freesound%20Shortcuts.meta.js
// ==/UserScript==
//debugger;
(function() {
    'use strict';
    const ids = soundManager.soundIDs;
    const controls = $("a.play");
    const nSamples = ids.length;
    const SKIP_MILLIS = 3000;
    console.log("found " + nSamples + " samples");

    let current = -1;

    function toggleCurrent(){
        if (current < 0 && current >= nSamples) {
            console.log("cannot toggle sample state");
            return;
        }
        var sound = getSound(current);
        if (sound.playState === 0) {
            sound.play();
        } else if (sound.paused) {
            sound.resume();
        } else {
            sound.pause();
        }
    }
    function getSound(i){
        return soundManager.getSoundById(ids[i]);
    }
    function scrollTo(i){
        $("html, body").scrollTop($(controls[i]).offset().top - 80);
    }
    function playNext(count) {
        if (current >= 0 && current < nSamples) {
            stopSound(current);
        }
        current += count;
        if (current >= nSamples) {
            current -= nSamples;
        }
        if (current < 0) {
            current += nSamples;
        }
        playSound(current);
    }
    function skipSamples(direction) {
        if (current < 0 && current >= nSamples) {
            console.log("cannot skip samples");
            return;
        }
        var sound = soundManager.getSoundById(ids[current]);
        if (sound.playState === 0){
            sound.play();
        }
        if (sound.paused) {
            sound.resume();
        }
        var pos = sound.position + direction * SKIP_MILLIS;
        if (pos < 0) pos = 0;
        if (pos > sound.duration) pos = sound.duration - 1;
        sound.setPosition(pos);
    }
    function playSound(i) {
        if (i >= nSamples || i < 0) {
            console.log("cannot play " + i);
            return;
        }
        console.log("play "+ i);

        switchOn($(controls[i]));
        scrollTo(i);
        var sound = soundManager.getSoundById(ids[i]);
        sound.stop();
        sound.setPosition(0);
        sound.play();
    }
    function stopSound(i) {
        if (i >= nSamples || i < 0) {
            console.log("cannot stop " + i);
            return;
        }
        console.log("stop "+ i);

        switchOff($(controls[i]));
        var sound = soundManager.getSoundById(ids[i]);
        sound.stop();
    }
    document.addEventListener('keydown', (event) => {
        if (/[input|textarea|select]/i.test(event.target.tagName)) {
            return false;
        }
        const keyName = event.key;
        const ctrl = event.getModifierState("Control");
        //console.log(keyName + " pressed");
        if (keyName === "ArrowDown") {
            event.preventDefault();
            if (ctrl) {
                // next page if possible
                let link = $('.next-page > a')[0];
                if (link) link.click();
            } else {
                playNext(1);
            }
        } else if (keyName === "ArrowUp") {
            event.preventDefault();
            if (ctrl) {
                // previous page if possible
                let link = $('.previous-page > a')[0];
                if (link) link.click();
            } else {
                playNext(-1);
            }
        } else if (keyName === ' ') {
            event.preventDefault();
            toggleCurrent();
        } else if (keyName === 'ArrowRight') {
            event.preventDefault();
            skipSamples(1 * (ctrl ? 10 : 1));
        } else if (keyName === 'ArrowLeft') {
            event.preventDefault();
            skipSamples(-1 * (ctrl ? 10 : 1));
        } else if (keyName === "r") {
            event.preventDefault();
            playNext(0);
        }
    });
    $('.play').live('toggle', function(event) {
        current = controls.index(this);
    });
})();
