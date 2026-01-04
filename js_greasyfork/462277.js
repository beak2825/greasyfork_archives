// ==UserScript==
// @name         Change notification wording
// @namespace    https://github.com/tomasz13nocon
// @version      1.2.1
// @description  Replace sentence-like wording from yt notifications with predictable, readable-at-a-glance text.
// @author       Tomasz Nocoń
// @match        https://www.youtube.com/*
// @grant        none
// @homepageURL  https://github.com/tomasz13nocon/youtube-change-notification-wording
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462277/Change%20notification%20wording.user.js
// @updateURL https://update.greasyfork.org/scripts/462277/Change%20notification%20wording.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const langs = {
        // The span stuff in the regexes prevents a bug where the notification text would get replaced recursively
        // The key must correspond to the lang attribute on the html tag
        "pl-PL": {
            notifTitleText: "Powiadomienia",
            video:        /(?:.*<\/span>)?Na kanał (?<channel>.*?) został przesłany film (?<title>.*)/,
            live:         /(?:.*<\/span>)?(?<channel>.*?) nadaje: (?<title>.*)/,
            premiere:     /(?:.*<\/span>)?Na kanale (?<channel>.*?) trwa premiera filmu: (?<title>.*)/,
            commentReply: /(?:.*<\/span>)?(?<user>.*?) odpowiedział\(a\): (?<comment>.*)/,
            commentLike:  /(?:.*<\/span>)?👍 Ktoś polubił Twój komentarz: (?<comment>.*)/,
        },
        "en-GB": {
            notifTitleText: "Notifications",
            video:        /(?:.*<\/span>)?(?<channel>.*?) uploaded: (?<title>.*)/,
            live:         /(?:.*<\/span>)?(?<channel>.*?) is live: (?<title>.*)/,
            premiere:     /(?:.*<\/span>)?(?<channel>.*?) premiering now: (?<title>.*)/,
            commentReply: /(?:.*<\/span>)?(?<user>.*?) replied: (?<comment>.*)/,
            commentLike:  /(?:.*<\/span>)?👍 Someone liked your comment: (?<comment>.*)/,
        },
    };

    let siteLang = document.getElementsByTagName("html")[0].getAttribute("lang");
    if (!(siteLang in langs)) { 
        console.error(`Language ${siteLang} is not supported.`);
        return;
    }

    document.head.insertAdjacentHTML("beforeend", `<style>
.notif-wording_channel-name {
    color: #c0cbf7; /* var(--yt-spec-text-primary); */
}
html[dark="true"] .notif-wording_channel-name {
    color: #99a;
}
</style>`);

    function main(list) {
        let weMutatedDom = false;
        let styleObserverActive = false;

        new MutationObserver((mutations, observer) => {
            // If the popup is not a notification popup, abort
            if (!list.innerText.startsWith(langs[siteLang].notifTitleText)) return;

            if (weMutatedDom) {
                weMutatedDom = false;
                return;
            }

            let elList = list.querySelectorAll(".message.ytd-notification-renderer");

            // The changes we make to notification wording mess up youtube's proccessing of them
            // that happens when the notification drop down gets reopened, scrolled down or a new notification gets added.
            // To remedy this we need to watch for when the drop down gets hidden and revert all our changes.
            if (!styleObserverActive) {
                // let listHtml = list.querySelector("#items").innerHTML;
                let listWrapper = list.querySelector("tp-yt-iron-dropdown");
                new MutationObserver((mutations, observer) => {
                    if (listWrapper.style.display === "none") {
                        // Surprisingly  removing the HTML works. JK it doesn't
                        list.querySelector("#items").innerHTML = "";
                        styleObserverActive = false;
                        observer.disconnect();
                    }
                }).observe(listWrapper, { attributes: true, attributeFilter: ["style"] });
                styleObserverActive = true;
            }

            for (let el of elList) {
                weMutatedDom = true;

                el.innerHTML = el.innerHTML.replace(langs[siteLang].video,        `<span class="notif-wording_wrapper"><strong class="notif-wording_channel-name">$<channel></strong>: $<title></span>`);
                el.innerHTML = el.innerHTML.replace(langs[siteLang].live,         `<span class="notif-wording_wrapper">🔴 <strong class="notif-wording_channel-name">$<channel></strong>: $<title></span>`);
                el.innerHTML = el.innerHTML.replace(langs[siteLang].premiere,     `<span class="notif-wording_wrapper">🎦 <strong class="notif-wording_channel-name">$<channel></strong>: $<title></span>`); // Alternative emojis: 🗓️📹
                el.innerHTML = el.innerHTML.replace(langs[siteLang].commentReply, `<span class="notif-wording_wrapper">💬 <strong class="notif-wording_channel-name">$<user></strong>: $<comment></span>`);
                el.innerHTML = el.innerHTML.replace(langs[siteLang].commentLike,  `<span class="notif-wording_wrapper">💬👍 $<comment></span>`);

                // Youtube goes crazy when the notification text gets changed, and adds text from different notifications to existing notification elements. This works around that.
                if (el.children.length > 1) {
                    el.firstElementChild.remove();
                }
            }
        }).observe(list, { childList: true, subtree: true });
    }

    let list = document.querySelector("ytd-popup-container");
    // Most of the time this element exists at the time this script executes, so we just call the main function
    if (list) {
        main(list);
    }
    // If it doesn't though, observe body for it to be added
    else {
        let observer = new MutationObserver(() => {
            list = document.querySelector("ytd-popup-container");
            if (list) {
                observer.disconnect();
                main(list);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();


