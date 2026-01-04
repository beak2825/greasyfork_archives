// ==UserScript==
// @name         Geoguessr Globe Spinner
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @version      1.0.1
// @description  Because why not
// @author       victheturtle#5159
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/_next/static/images/globeMobile-52f0c621440536eca4a771ff74020196.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458052/Geoguessr%20Globe%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/458052/Geoguessr%20Globe%20Spinner.meta.js
// ==/UserScript==

let clicking = false;
let last_click = [0, 0]
let last_t = 0
let speed = 1;

function advanceFrame() {
    if (location.pathname != "/") return
    let video = document.querySelector("video")
    if (speed < 1.3 || clicking) {
        video.playbackRate = 1
        return;
    }
    video.playbackRate = speed;
    console.log(video.playbackRate)
    if (speed > 6) speed -= 1.0;
    else speed = 1 + (speed-1) * 0.8
    setTimeout(advanceFrame, 500);
}

let speedFromInput = (d) => Math.max(0.1, Math.min(16, d*20))

document.addEventListener("mousedown", (event) => {
    if (location.pathname != "/") return
    last_click = [event.pageX, event.pageY]
    last_t = Date.now()
    clicking = true;
    let video = document.querySelector("video")
    video.playbackRate = 1
});

document.addEventListener("mousemove", (event) => {
    if (location.pathname != "/" || !clicking) return
    let click = [event.pageX, event.pageY]
    let t = Date.now()
    if (t - last_t < 100) return
    speed = speedFromInput((click[0] - last_click[0]) / (t - last_t))
    let video = document.querySelector("video")
    video.playbackRate = speed;
    last_click = click
    last_t = t
});

document.addEventListener("mouseup", (event) => {
    if (location.pathname != "/" || !clicking) return
    clicking = false;
    let click = [event.pageX, event.pageY]
    let t = Date.now()
    if (t != last_t) speed = speedFromInput((click[0] - last_click[0]) / (t - last_t))
    last_click = click
    last_t = t
    advanceFrame()
});

document.addEventListener("mouseout", (event) => {
    if (location.pathname != "/" || !clicking) return
    clicking = false;
    let click = [event.pageX, event.pageY]
    let t = Date.now()
    if (t != last_t) speed = speedFromInput((click[0] - last_click[0]) / (t - last_t))
    last_click = click
    last_t = t
    advanceFrame()
});
