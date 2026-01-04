// ==UserScript==
// @name         agarpowers hold to drop
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!!
// @author       kidmaletteo
// @license      MIT
// @match        http://62.68.75.115:90/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443018/agarpowers%20hold%20to%20drop.user.js
// @updateURL https://update.greasyfork.org/scripts/443018/agarpowers%20hold%20to%20drop.meta.js
// ==/UserScript==

$(function () {
    const holdDelay = 500, // ms delay to start dropping after pressing
          dropDelay = 100 // ms delay between drops

    let keys = {};
    $(document).on("keydown", (e) => {
        // if (e.keyCode != $('#pellet').text().charCodeAt(0)) return;
        if (e.keyCode in keys) return;
        keys[e.keyCode] = setTimeout(() => {
            drop(e.keyCode);
        }, holdDelay);
    }).on("keyup", (e) => {
        clearTimeout(keys[e.keyCode]);
        delete keys[e.keyCode];
    });
    const drop = key => {
        if (keys[key] == null) return;
        window.onkeydown({ keyCode: key });
        window.onkeyup({ keyCode: key });
        setTimeout(drop, dropDelay, key);
    }
});