// ==UserScript==
// @name         Speed+
// @version      1.0.3
// @description  Speed / Pitch changer control bar for YouTube
// @author       Caassiiee
// @match        http*://www.youtube.com/watch*
// @icon64        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAQAAADTdEb+AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAgcMAAIHDAVNYbsIAAAAHdElNRQfhCgUDNwD+45R5AAADc0lEQVR42u3WsU3DABRF0Z/AWohRIKMxCmsZJaZBVFEUJK6M0TmVy1dc23+Ge5xmmXXWWea09ZR9OG49gP9JWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWPdZrzxxw+Octp6wA+d5+noFj/M0l3nYetDfd5hl6wm7cPyO6TyXrcfswcGnnYIbi8TjfGw9YRf8Cn/o4Hi/w3me52UeZuY8b/PueOe3vM4y66yzzOvWU/bBjXWfw5UnbhAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWiU9N+hvulv+L7AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMC0wNFQyMDo1NTowMC0wNzowMJNobkEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTAtMDRUMjA6NTU6MDAtMDc6MDDiNdb9AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==
// @grant        none
// @license      MPL-2.0
// @namespace    Caassiiee
// @downloadURL https://update.greasyfork.org/scripts/503876/Speed%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/503876/Speed%2B.meta.js
// ==/UserScript==
function waitForElement(guaranteedParent, selector) {
    /**
        Waits for a given element to exist.
        @param {Element} guaranteedParent - A parent that will always exist (to be watched)
        @param {string} selector - A CSS selector for the element to wait for
    **/
    return new Promise(resolve => {
        const o = new MutationObserver(() => { // watch for descendants being added
            let el = document.querySelector(selector);
            if (el) {
                resolve(el || null);
                o.disconnect(); // stop watching
            }
        });
        o.observe(guaranteedParent || document.body, {
            childList: true,
            subtree: true
        });
    });
}
 
(function() {
    'use strict';
    const container = document.createElement("div");
    container.id = "ytspeed-container";
    container.innerHTML = '<p class="bold" style="font-size:2rem">Ｓｐｅｅｄ＋</p><input type="range" min="0.1" max="8" value="1" step="0.1" id="ytspeed-slider" list="ytspeed-list">'+
        '<datalist id="ytspeed-list" display="none"><option value="0.5"></option><option value="1"></option><option value="2"></option><option value="4"></option><option value="8"></option></option></datalist>'+
        '<p id="ytspeed-label">1x</p><label for="ytspeed-pitch">Ｐｒｅｓｅｒｖｅ ｐｉｔｃｈ</label><input type="checkbox" id="ytspeed-pitch" checked><p style="margin-top:1vh;">✧</p>';
    const style = document.createElement("style");
    style.innerText = `
    #ytspeed-container {font-size:1.2rem;}
    #ytspeed-container{background:var(--yt-spec-badge-chip-background);width:75%;padding:2vh;margin:2vh auto;border-radius:12px;text-align:center;}
    #ytspeed-label{margin-bottom:1vh;}
    #ytspeed-slider{width:100%;margin-top:1vh;background:transparent;height:2vh;}
 
    #ytspeed-slider::-moz-range-track{background:var(--yt-spec-10-percent-layer);}
    #ytspeed-slider::-webkit-slider-runnable-track{background:var(--yt-spec-10-percent-layer);}
 
    #ytspeed-slider::-moz-range-thumb{background:var(--yt-spec-themed-blue);height:12px;width:12px;transition:.1s;border:transparent;border-radius:50%;}
    #ytspeed-slider::-webkit-slider-thumb{background:var(--yt-spec-themed-blue);height:12px;width:12px;transition:.1s;border:transparent;border-radius:50%;}
    #ytspeed-slider:hover::-moz-range-thumb{height:18px;width:18px;}
    #ytspeed-slider:hover::-webkit-slider-thumb{height:18px;width:18px;}
    #ytspeed-slider::-moz-range-progress{background:var(--yt-spec-themed-blue);}
    `; // various styles
 
    document.head.appendChild(style);
    let slider = container.querySelector("#ytspeed-slider"),
        label = container.querySelector("#ytspeed-label"),
        pitch = container.querySelector("#ytspeed-pitch");
 
    waitForElement(null, "#bottom-row").then(e => { // make sure the element immediately below the container exists
        e.insertAdjacentElement("beforebegin", container);
        const video = document.querySelector("video");
        const observer = new MutationObserver((changes)=> { // resets the speed & stuff when the video changes (doesn't reload bottom part of video)
            changes.forEach(function(mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                    pitch.checked = true;
                    video.preservesPitch = true;
                    slider.value = 1;
                    video.playbackRate = 1;
                    label.innerText = "1x";
                }
            });
        });
        observer.observe(video, {
            attributes: true
        });
        pitch.onchange = () => { video.preservesPitch = pitch.checked; }; // "Preserves pitch" checkbox
        slider.oninput = () => { video.playbackRate = parseFloat(slider.value);label.innerText = slider.value + "x"; }; // Slider
    });
})();