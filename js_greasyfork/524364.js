// ==UserScript==
// @name         Ding+ for YouTube
// @namespace    ccn0
// @version      2
// @description  Plays random shit every 100 milliseconds to 15 seconds
// @author       CCN0
// @license      MIT
// @match        *://*.youtube.com/watch?*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURf////8AAOta55MAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABmSURBVCjPhZFLEsAgCEOTG8D9L1trTbGINQvRN2T4iEL+6H3TQwtwC0eQDLgBzEAxwLj8gWw5Vtl2ihOwPP68MSXMezOU4rTensIW7ANwj2r0AISxCaOugCfQTln0YQIquQAvuwQuYxcSwuN7duwAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524364/Ding%2B%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/524364/Ding%2B%20for%20YouTube.meta.js
// ==/UserScript==

(function () {
    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const sfx = [
        "ding.mp3", "kapow.mp3", "punch.mp3", "punt.mp3",
        "recordscratch.mp3", "rubberduck.mp3", "smack.mp3",
        "sosad1.mp3", "sosad2.mp3", "tiptoe.mp3", "what.mp3",
        "whoosh1.mp3", "whoosh2.mp3", "whoosh3.mp3", "whoosh5.mp3",
        "whoosh6.mp3", "wompwomp.mp3", "wow.mp3", "yay.mp3"
    ];

    function PlaySnd(sound) {
        var snd = new Audio();
        snd.src = sound;
        snd.playbackRate = 1;
        snd.play();
    }

    function dingaling() {
        setTimeout(() => {
            PlaySnd("https://ccn0.github.io/img/audio/plus/" + sfx[randomInteger(0, sfx.length - 1)]);
            dingaling();
        }, randomInteger(100, 15000));
    }

    dingaling();
})();