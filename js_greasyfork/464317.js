// ==UserScript==
// @name         DLsite Volume Boost
// @namespace    garyguo.net
// @version      0.1
// @description  Boost Volume in DLsite play
// @author       Gary Guo
// @match        https://play.dlsite.com/
// @icon         https://play.dlsite.com/favicon.ico
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/464317/DLsite%20Volume%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/464317/DLsite%20Volume%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gainValue = 1;

    // Use a WeakMap to track audio elements that are already created, as multiple
    // createMediaElementSource calls on the same element will fail.
    let map = new WeakMap();
    let lastGain = null;

    function boostGain(audio) {
        let lookup = map.get(audio);
        if (lookup) {
            return lookup.gain;
        }
        let ctx = new AudioContext();
        let src = ctx.createMediaElementSource(audio);
        let gain = ctx.createGain();
        gain.gain.value = gainValue;
        src.connect(gain);
        gain.connect(ctx.destination);
        map.set(audio, {ctx, src, gain});
        return gain;
    }

    // Hijack DOM src set to set crossOrigin property before src.
    // This is needed for createMediaElementSource to work.
    let srcDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    Object.defineProperty(HTMLAudioElement.prototype, 'src', {
        get: srcDesc.get,
        set: function (src) {
            this.crossOrigin = 'anonymous';
            srcDesc.set.call(this, src);
        },
        configurable: true,
        enumerable: true,
    });

    // Hijack DOM play method to set gain before playing.
    let play = HTMLMediaElement.prototype.play;
    HTMLAudioElement.prototype.play = function (...args) {
        lastGain = boostGain(this);
        return play.apply(this, args);
    };

    // A very simple toast display to show the current gain
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.boxSizing = 'content-box';
    toast.style.left = '0';
    toast.style.right = '0';
    toast.style.top = '60%';
    toast.style.bottom = '0';
    toast.style.width = '10em';
    toast.style.height = '1em';
    toast.style.margin = 'auto';
    toast.style.padding = '1em';
    toast.style.borderRadius = '1em';
    toast.style.zIndex = '10000';
    toast.style.pointerEvents = 'none';
    toast.style.background = 'rgba(0,0,0,0.5)';
    toast.style.color = 'white';
    toast.style.textAlign = 'center';
    toast.style.fontSize = '36px';
    toast.style.animation = 'opacity 1s ease-in-out';
    toast.style.opacity = 0;
    document.body.appendChild(toast);

    let toastTimer = null;
    function showToast(text) {
        toast.textContent = text;
        toast.style.opacity = 1;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = 0;
        }, 1000);
    }

    document.body.addEventListener('keydown', e => {
        if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
            if (e.key === '+') {
                gainValue = Math.min(gainValue + 0.1, 5);
            } else if (e.key === '_') {
                gainValue = Math.max(gainValue - 0.1, 1);
            } else {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if (lastGain) {
                lastGain.gain.value = gainValue;
            }
            showToast(`Gain ${(gainValue * 100).toFixed(0)}%`);
        }
    });
})();