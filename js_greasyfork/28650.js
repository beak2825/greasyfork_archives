// ==UserScript==
// @name         reddit.com/r/place template
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/place*
// @match        https://www.reddit.com/r/place*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28650/redditcomrplace%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/28650/redditcomrplace%20template.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function toHtml(str) {
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = str;
        return htmlObject.firstChild;
    }
    const params = (location.search||"?").substr(1).split("&").map(x => x.split("=").map(a => unescape(a))).reduce((o,[k,v]) => Object.assign(o, {[k]: v}), {});
    var img = document.createElement("img");
    img.src = params.template;
    img.className = "place-canvas";
    Object.assign(img.style, {
        transform: `translate(${params.ox - 0.5}px,${params.oy - 0.5}px)`,
        position: "absolute",
        top: 0,
        left: 0,
        width: params.tw ? `${params.tw}px` : undefined,
        pointerEvents: "none",
        zIndex: 5,
        opacity: 0.5,
    });
    const v = document.querySelector(".place-camera");
    if(!v) return;
    v.appendChild(img);
    const cb = document.querySelector(".place-camera-button");
    const c2 = toHtml(`<button id="place-template-button" class="place-camera-button" style="display:inline-block; top:110px; background-image:inherit">T</button>`);
    cb.parentNode.insertBefore(c2, cb);
    let active = 1;
    c2.addEventListener("click", () => {
        if(active == 1) {
            active = 2;
            img.style.opacity = 0.9;
        } else if (active == 2) {
            active = 0;
            img.style.visibility = "hidden";
        } else if (active == 0) {
            active = 1;
            img.style.visibility = "inherit";
            img.style.opacity = 0.5;
        }
    });
    console.log("/r/place template added");
})();