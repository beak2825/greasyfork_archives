// ==UserScript==
// @name        t.me fix
// @description Make t.me image savable and prevent "open with..." dialog on load
// @namespace   http://github/hafeoz
// @match       https://t.me/*
// @match       https://telegram.me/joinchat/*
// @grant       none
// @run-at      document-start
//
// @version     1.1.0
// @author      hafeoz
// @icon        https://telegram.org/img/website_icon.svg
// @license     0BSD OR CC0-1.0 OR WTFPL
// @homepageURL https://gist.github.com/hafeoz/666c8cd11a3c7be20167a3aeb3e9df7b
// @supportURL  https://gist.github.com/hafeoz/666c8cd11a3c7be20167a3aeb3e9df7b
// @downloadURL https://update.greasyfork.org/scripts/526139/tme%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/526139/tme%20fix.meta.js
// ==/UserScript==
window.onload = function() {
    for (const elem of document.getElementsByClassName("tgme_widget_message_photo_wrap")) {
        const src = /^url\("([^"]+)"\)$/.exec(elem.style.backgroundImage)[1];
        elem.style.backgroundImage = "";
        const imgelem = document.createElement("img");
        elem.appendChild(imgelem);
        const placeholder = elem.getElementsByClassName("tgme_widget_message_photo")[0];
        if (placeholder !== undefined) {
            imgelem.classList = placeholder.classList;
            placeholder.remove();
        }
        imgelem.style.width = "100%";
        imgelem.src = src;
    }
}

// https://caniuse.com/mdn-api_element_beforescriptexecute_event
window.addEventListener("beforescriptexecute", (e) => {
    if (e.target.text.includes("protoUrl")) {
        //e.preventDefault();
        e.target.text = e.target.text.replace(/tg:\\\/\\\/resolve[^\"]+/, "");
    }
});