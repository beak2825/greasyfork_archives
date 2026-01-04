// ==UserScript==
// @name         Subscriber Changer
// @namespace    https://www.youtube.com/channel/UCUxKOzJUD_-Mf1eqW4NGCyQ
// @version      1
// @description  Changes subscriber count
// @description  Change the number after innerHTML (e.g 21.2k to anything you want)
// @author       AdamDX
// @match        https://www.youtube.com/channel/*
// @match        https://www.youtube.com/channel/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426758/Subscriber%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/426758/Subscriber%20Changer.meta.js
// ==/UserScript==

function start() {
    var subscribercount = document.getElementById("subscriber-count");
    subscribercount.innerHTML = "21.2K subscribers";
    setTimeout(start, 0);
}
start();