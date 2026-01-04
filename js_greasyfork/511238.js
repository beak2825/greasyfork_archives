// ==UserScript==
// @name            Better Youtube Volume
// @version         1.0.4
// @namespace       https://fryzen.net/
// @author          HarbAlarm
// @description     Replaces the volume slider with a version that offers more control at lower volumes
// @description:de  Ersetzt den Lautstärkeregler durch eine Version, die mehr Kontrolle bei geringerer Lautstärke bietet
// @license         The Unlicense
// @tag             QOL
// @match           https://www.youtube.com/watch*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant           unsafeWindow
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/511238/Better%20Youtube%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/511238/Better%20Youtube%20Volume.meta.js
// ==/UserScript==


//let slider = '<input id="harbVol" type="range" onInput="harbVolume(event.target.value)"/>';
let volSlider, volPanel, volControlHover, video
let slider = document.createElement('input');

function init() {
    slider.id = 'harbVol';
    slider.type = 'range';
    slider.style.position = 'relative';
    //slider.style.top = '10px';
    //slider.style.right = '300px';
    slider.style.zIndex = '99999';
    slider.style.width = '80px';
    slider.style.marginTop = '15px';
    slider.oninput = function(e) { harbVolume(e.target.value) }

    if (document.querySelectorAll('.ytp-volume-slider')) {
        volSlider = document.querySelector('.ytp-volume-slider')
        volSlider.style.display = 'none'
    }

    if (document.querySelectorAll('.ytp-volume-panel')) {
        volPanel = document.querySelector('.ytp-volume-panel')
        volPanel.style.width = 'auto'
        //volPanel.style.overflow = 'hidden'
    }

    if (document.querySelectorAll('.ytp-volume-control-hover')) {
        volControlHover = document.querySelector('.ytp-volume-control-hover')
        //volControlHover.style.width = 'auto'
        volControlHover.style.overflow = 'hidden'
    }
    update()
}

function update() {
    document.querySelector('#title').appendChild(slider)
}

function harbVolume(slider) {
    if (!video) { video = document.querySelector('video') }
    video.volume = bezier(0, 0, .25, 1, slider / 100);
}

function bezier(p1, p2, p3, p4, t) {
    // https://javascript.info/bezier-curve
    return (1 - t) * (1 - t) * (1 - t) * p1 +
           3 * (1 - t) * (1 - t) * t * p2 +
           3 * (1 - t) * t*t * p3 + t*t*t * p4
}

const mo = new MutationObserver(() => {
    mo.disconnect();
    if (!document.contains(slider)) {
        update()
    }
    observe();
});

function observe() {
    mo.observe(document.body, {childList: true, subtree: true});
}

(function() {
    document.querySelector(".ytp-volume-panel").appendChild(slider)
//    document.addEventListener("DOMContentLoaded", function(event){
        init()
        observe();
//    })
})();