// ==UserScript==
// @name         hidePlayer
// @namespace    https://github.com/yegorgunko/shikme-tools
// @version      0.4
// @description  Hide player
// @author       Yegor Gunko
// @match        https://shikme.chat/
// @icon         https://shikme.chat/default_images/icon.png?v=1528136794
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413039/hidePlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/413039/hidePlayer.meta.js
// ==/UserScript==
const hidePlayer = () => {
    const e = document.getElementById("player"),
        t = document.getElementById("warp_show_chat");
    t.style.height = `${parseFloat(window.getComputedStyle(t).getPropertyValue("height"))+parseFloat(window.getComputedStyle(e).getPropertyValue("height"))}px`, e.style.display = "none"
};
document.addEventListener("DOMContentLoaded", hidePlayer(), !1);