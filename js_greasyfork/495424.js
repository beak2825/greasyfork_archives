// ==UserScript==
// @name        Automatically click on all Youtube thumbnails in Steam discussions
// @author      pizzahut
// @description Provided that the automatic playback is disabled for Steam discussions, you will see a bigger preview image and the video title.
// @license     MIT
// @match       https://steamcommunity.com/*/discussions/*
// @namespace   https://greasyfork.org/users/1117297-pizzahut
// @grant       none
// @version     7
// @downloadURL https://update.greasyfork.org/scripts/495424/Automatically%20click%20on%20all%20Youtube%20thumbnails%20in%20Steam%20discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/495424/Automatically%20click%20on%20all%20Youtube%20thumbnails%20in%20Steam%20discussions.meta.js
// ==/UserScript==

function clickAll() {
    document.querySelectorAll(".dynamiclink_box").forEach(bt => bt.click());
}
clickAll();
const myTimeout = setInterval(clickAll, 1000);
