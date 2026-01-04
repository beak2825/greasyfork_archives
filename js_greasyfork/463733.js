// ==UserScript==
// @name         coding for entrepreneurs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a simple script to unlock videos in codingforentrepreneurs.com
// @author       CoderBoi
// @match        https://www.codingforentrepreneurs.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codingforentrepreneurs.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463733/coding%20for%20entrepreneurs.user.js
// @updateURL https://update.greasyfork.org/scripts/463733/coding%20for%20entrepreneurs.meta.js
// ==/UserScript==

window.addEventListener("load", (function() {
  const scripts = document.querySelectorAll("script")
    let vid_id = scripts[scripts.length-3].innerHTML.split("video_id")[1].split(",")[0].replace(":", "").replace("\"","").trim();
    let ele = document.querySelector("div.min-content-h ");
    ele.style.cssText = 'postion:relative;';
    ele.innerHTML = `<iframe src="https://player.vimeo.com/video/${vid_id}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" frameborder="0" style="position:absolute;height:100%;width:100%"></iframe>`
})
)