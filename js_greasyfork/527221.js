// ==UserScript==
// @name        @everyone macro for Kiwi IRC
// @namespace   Violentmonkey Scripts
// @match       *://irc.*.*/*
// @grant       none
// @version     1.0
// @author      anonymous
// @description 17.02.2025, 13:37:00
// @run-at document-end
// @license Public Domain
// @downloadURL https://update.greasyfork.org/scripts/527221/%40everyone%20macro%20for%20Kiwi%20IRC.user.js
// @updateURL https://update.greasyfork.org/scripts/527221/%40everyone%20macro%20for%20Kiwi%20IRC.meta.js
// ==/UserScript==

function get_nicknames() {
    let a = document.getElementsByClassName("kiwi-nicklist-user-nick");
    let b = [];
    for (let i = 0; i < a.length; i++) {
        b.push(a[i].innerText);
    }
    return b;
}

(new MutationObserver(wait_for_ircinput)).observe(document, {childList: true, subtree: true});

function wait_for_ircinput(changes, observer) {
    let msgbox = document.getElementsByClassName("kiwi-ircinput-editor")[0];
    if(msgbox) {
        observer.disconnect();
        msgbox.addEventListener("keydown", function (e) {
            let ms = msgbox.innerText;
            if (ms.includes("@everyone")) {
                let nicks = get_nicknames().join(" ");
                msgbox.innerText = ms.replace("@everyone", nicks);
                }
            }
        );
    }
}
