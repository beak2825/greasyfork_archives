// ==UserScript==
// @name         Boost Volume
// @namespace    http://greasyfork.org/
// @version      0.3
// @description  Boost video volume on any site. Shortcuts: Alt-Shift-[+/-]
// @author       rix
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389804/Boost%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/389804/Boost%20Volume.meta.js
// ==/UserScript==

(() => {
    const boostVolume = (() => {
        const sources = {};
        const context = new AudioContext();
        return (gain) => {
            for (let video of document.querySelectorAll('video')) {
                try {
                    const source = context.createMediaElementSource(video);
                    const gainNode = context.createGain(source);
                    source.connect(gainNode);
                    gainNode.connect(context.destination);
                    sources[video] = gainNode;
                } catch(e) {}
            }
            for (let [video, gainNode] of Object.entries(sources)) {
                try {
                    gainNode.gain.value = gain;
                } catch(e) {}
            }
        };
    })();
    let gain = 1;
    document.body.addEventListener('keyup', e => {
        if (!(e instanceof KeyboardEvent && e.type === 'keyup')) return;
        if (e.composed && e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey) {
            if (e.keyCode === 187) { // +
                gain++;
            }
            else if (e.keyCode === 189) { // -
                gain = Math.max(gain - 1, 1);
            }
            else return;
            boostVolume(gain);
        }
    });
})();
