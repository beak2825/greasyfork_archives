// ==UserScript==
// @name         Facebook (Messenger) Blacklist
// @namespace    AAAAAAAA.com
// @version      2.1
// @description  This is how you really block people
// @author       ducktrshessami
// @match        *://www.facebook.com/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387392/Facebook%20%28Messenger%29%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/387392/Facebook%20%28Messenger%29%20Blacklist.meta.js
// ==/UserScript==

(function() {
    const blacklist = [ // Fill this list with their Facebook names
        ""
    ];

    /***************** ^^ Edit above list ^^ *****************/

    function main() { // Triggered by page change on facebook.com
        theMeat();
        recentMessage();
    }

    function cleanup() { // Check for removed names from the blacklist
        for (var name in blacklistMetadata) {
            if (!blacklist.includes(name)) {
                delete blacklistMetadata[name];
            }
        }
    }

    async function update(name, data, thread) { // Update a blacklisted user's nickname
        if (!blacklistMetadata[name]) {
            blacklistMetadata[name] = { nicknames: {} };
        }
        blacklistMetadata[name].avatar = data.avatar || blacklistMetadata[name].avatar;
        blacklistMetadata[name].nicknames[thread] = data.nickname || blacklistMetadata[name].nicknames[thread];

        cleanup();
        window.localStorage.setItem("MessengerBlacklistMetadata", JSON.stringify(blacklistMetadata));
    }

    function theMeat() { // Hide messages and read receipts (also trigger nickname update)
        let tabs = $("[data-pagelet='ChatTab']");
        if (tabs.length) {
            blacklist.forEach((name) => {
                let curTab, title, messages, nickname;
                let seen = tabs.find(`span > img[alt*="Seen by ${name}"]:visible`);
                let avatar = seen.attr("src");
                let filTabs = tabs.has(seen);
                seen.hide();
                if (filTabs.length) { // Get messages with same avatar as read receipt
                    for (let i = 0; i < filTabs.length; i++) {
                        curTab = $(filTabs[i]);
                        title = curTab.children().children().attr("aria-label");
                        messages = curTab.find("div[data-testid='incoming_group']:visible").has(`img[src='${avatar}']:visible`).hide();
                        nickname = messages.first().children(":last-child").children(":first-child").text();
                        if (title && (nickname || avatar)) {
                            update(name, { nickname: nickname, avatar: avatar }, title);
                        }
                    }
                }
                else {
                    if (blacklistMetadata[name]) { // Get messages with stored avatar
                        for (let i = 0; i < tabs.length; i++) {
                            curTab = $(tabs[i]);
                            title = curTab.children().children().attr("aria-label");
                            avatar = blacklistMetadata[name].avatar;
                            messages = curTab.find("div[data-testid='incoming_group']:visible").has(`img[src='${avatar}']:visible`).hide();
                            nickname = messages.first().children(":last-child").children(":first-child").text();
                            if (title && (nickname || avatar)) {
                                update(name, { nickname: nickname, avatar: avatar }, title);
                            }
                        }
                    }
                }
            });
        }
    }

    async function recentMessage() { // Hide latest message in chat head tooltip thing
        for (let name in blacklistMetadata) {
            for (let thread in blacklistMetadata[name].nicknames) {
                let nickname = blacklistMetadata[name].nicknames[thread] || name;
                let recent = $(`div > span:visible`).filter(function() {
                    if (this.childElementCount) {
                        let content = getCleanContent(this.children[0]);
                        return content.startsWith(`${nickname}:`);
                    }
                });
                recent.hide();
            }
        }
    }

    function getCleanContent(element) { // Parse text content with image alts
        let content = "";
        for (let child of element.childNodes) {
            if (child.tagName == "SPAN") {
                let imgText = $(child).children().attr("alt");
                if (imgText) {
                    content += imgText;
                }
            }
            else {
                content += child.textContent;
            }
        }
        return content;
    }

    var blacklistMetadata, observer = new MutationObserver(main);
    if (!(blacklistMetadata = JSON.parse(window.localStorage.getItem("MessengerBlacklistMetadata")))) { // Check for stored value
        blacklistMetadata = new Object;
        window.localStorage.setItem("MessengerBlacklistMetadata", JSON.stringify(blacklistMetadata));
    }
    observer.observe(document.body, { // Wait for page change
        childList: true,
        subtree: true
    });
    window.addEventListener("beforeunload", () => { // Store before leaving
        cleanup();
        window.localStorage.setItem("MessengerBlacklistMetadata", JSON.stringify(blacklistMetadata));
    });
})();
