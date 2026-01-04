// ==UserScript==
// @name TMGStudio M3U8 URL Grabber
// @match *://*.tmgstudios.tv/supporters
// @version 1.0
// @description Copies the M3U8 for the specific video / audio to clipboard for use in other viewing programs such as MPV or VLC
// @run-at document-end
// @license MIT
// @namespace https://greasyfork.org/users/784940
// @downloadURL https://update.greasyfork.org/scripts/444569/TMGStudio%20M3U8%20URL%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/444569/TMGStudio%20M3U8%20URL%20Grabber.meta.js
// ==/UserScript==

// Constants
const obsnode = document.querySelector('#posts_list');
const obsOpt = {childList: true};
const btnColor = "var(--color-primary)";
const btnColorText = "var(--color-on-primary)";
const btnStyle = `margin-left:auto; color:${btnColorText}; background-color:${btnColor}; align-self:center; cursor:pointer`;
const btnClass = "badge badge--pale badge--large M3U8";
const btnText = "Copy M3U8 to clipboard";

// Functions
function copyStream(e) {
    let el = e.currentTarget;
    let m3u8Link = el.parentNode.parentNode.parentNode.parentNode.querySelector("[data-source]").getAttribute("data-source");
    navigator.clipboard.writeText(m3u8Link);
}

function addCopyButton() {
let tagSec = document.querySelectorAll(".post__tags");
for (let sec of tagSec) {
    if (sec.parentNode.querySelector(".M3U8")) continue;
    sec.parentNode.style.display="flex";
    let btn = document.createElement("div");
    btn.classList = btnClass;
    btn.style = btnStyle;
    btn.innerText = btnText;
    sec.parentNode.appendChild(btn);
    btn.addEventListener("click", copyStream);
    }
}


// Entry Point
let mut = new MutationObserver(addCopyButton);
mut.observe(obsnode, obsOpt);
addCopyButton();