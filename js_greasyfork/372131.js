// ==UserScript==
// @name         JW-Player shortcuts delegate
// @namespace    https://video.aktualne.cz
// @version      1.1.1
// @description  Delegate keyboard events to a jw-player element if it is found
//               in the page so its keyboard shortcuts work without having to click on the player first to focus it.
//               Also fast-forwards ads.
// @author       bubblefoil
// @license      MIT
// @match        https://video.aktualne.cz/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/372131/JW-Player%20shortcuts%20delegate.user.js
// @updateURL https://update.greasyfork.org/scripts/372131/JW-Player%20shortcuts%20delegate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getVideo(){
        return document.querySelector('video.jw-video');
    }

    var playbackRates = [0.25, 0.5, 1, 1.125, 1.25, 1.5, 2];
    const muteVolume = 0.05;

    function slowDown(){
        console.log("slowing down");
        var video = getVideo();
        if(video == null || !video.playbackRate){
            console.log("There is no jw-player");
            return;
        }
        var currentRate = video.playbackRate;
        var ri = playbackRates.findIndex(r => r >= currentRate);
        video.playbackRate = playbackRates[Math.max(0, ri - 1)];
        console.log("Playback rate =", video.playbackRate);
    }

    function speedUp(){
        console.log("Speeding up");
        var video = getVideo();
        if(video == null || !video.playbackRate){
            console.log("There is no jw-player");
            return;
        }
        var currentRate = Math.min(video.playbackRate, playbackRates[playbackRates.length - 1]);
        var ri = playbackRates.findIndex(r => r >= currentRate);
        video.playbackRate = playbackRates[Math.min(ri + 1, playbackRates.length - 1)];
        console.log("Playback rate =", video.playbackRate);
    }

    let originalVolume = 1;
    let muted = false;
    function mute(){
        if (!muted){
            originalVolume = getVideo().volume;
        }
        getVideo().volume = muteVolume;
        muted = true;
    }

    function unmute(){
        let video = getVideo();
        if (muted && video) video.volume = originalVolume;
        muted = false;
    }

    function skipAd(t){
        eventFire(t, 'mouseover');
        eventFire(t, 'mousedown');
        eventFire(t, 'click');
    }

    let originalSpeed = 1;
    let fastForwarding = false;
    const fastForwardRate = 5;
    function fastForward(){
        if (!fastForwarding){
            originalSpeed = getVideo().playbackRate;
        }
        getVideo().playbackRate = fastForwardRate;
        fastForwarding = true;
    }

    function stopFastForward(){
        let video = getVideo();
        if (fastForwarding && video) video.playbackRate = originalSpeed;
        fastForwarding = false;
    }

    document.onkeydown = function (e) {
        console.debug("keydown: ", e);
        //debugger;
        if(e.shiftKey && e.keyCode === 188){
            slowDown();
        }
        if(e.shiftKey && e.keyCode === 190){
            speedUp();
        }
        var ctrl = document.getElementsByClassName("jwplayer")[0];
        if(!ctrl){
            return false;
        }
        //Prevent page scroll when pressing Space key
        if(e.keyCode === 32){
            e.preventDefault();
        }
        var userInactive = ctrl.classList.contains("jw-flag-user-inactive");
        if(userInactive){
            //This shows the control bar
            ctrl.classList.remove("jw-flag-user-inactive");
        }
        var cb = document.getElementsByClassName("jw-controlbar")[0];
        //Focus the player. Clicking this element seems to work
        cb.click();
        var ed = new KeyboardEvent('keydown', {key: e.key, keyCode: e.keyCode, which: e.which, code: e.code});
        //Send the key event to the player
        ctrl.dispatchEvent(ed);
        //Hide the control bar if it was hidden before
        if(userInactive){
            ctrl.classList.add("jw-flag-user-inactive");
        }
    };

    function eventFire(el, etype){
        //debugger;
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    function getSkippable(){
        return document.querySelector('.jw-skiptext') || document.querySelector('div.jw-skippable');
    }

    function addMnemonic(element, key) {
        if (element && key && key.length === 1 && element.innerText.indexOf(key) > 0) {
            element.innerHTML = element.innerText.replace(key, `<u>${key}</u>`);
            element.accessKey = key.toLowerCase;
        }
    }

    const hasAddedNodes = (mutation) => mutation.addedNodes.length > 0;

    const mutationObserver = new MutationObserver(function (mutations) {
        mutations
            .filter(hasAddedNodes)
            .forEach((mutation) => {
            let s = getSkippable();
            if (s) {
                console.debug("click text");
                mute();
                fastForward();
                addMnemonic(s, 'p');
                skipAd(s);
            } else {
                stopFastForward();
                unmute();
            }
            console.trace('Irrelevant mutation.');
        });
    });

    const observeOptions = {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
    };
    mutationObserver.observe(document.body, observeOptions);

})();
