// ==UserScript==
// @name         Hide Youtube seek bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Youtube's seek bar with your context menu
// @author       WhiteTapeti
// @match        *://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/475226/Hide%20Youtube%20seek%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/475226/Hide%20Youtube%20seek%20bar.meta.js
// ==/UserScript==

(function() {
    var hiddenSeekbarThingE = 0;
    if (hiddenSeekbarThingE == 0) {
        console.log('add seekbar styles')
        var elemDivHiddenSeekbarThing = document.createElement('div');
        elemDivHiddenSeekbarThing.innerHTML = ( `
<style>
.ytp-chrome-top.hidden-seekbar-thing,.ytp-chrome-bottom.hidden-seekbar-thing, .ytp-gradient-top.hidden-seekbar-thing, .ytp-gradient-bottom.hidden-seekbar-thing {display:none!important;}
</style>
`);
        document.body.append(elemDivHiddenSeekbarThing);
        hiddenSeekbarThingE = 1;
    }
    var seekBarThing = document.querySelector('.ytp-chrome-top');
    seekBarThing.classList.toggle('hidden-seekbar-thing');
    console.log(seekBarThing);
    seekBarThing = document.querySelector('.ytp-chrome-bottom');
    seekBarThing.classList.toggle('hidden-seekbar-thing');
    console.log(seekBarThing);
    seekBarThing = document.querySelector('.ytp-gradient-top');
    seekBarThing.classList.toggle('hidden-seekbar-thing');
    console.log(seekBarThing);
    seekBarThing = document.querySelector('.ytp-gradient-bottom');
    seekBarThing.classList.toggle('hidden-seekbar-thing');
    console.log(seekBarThing);
})();