// ==UserScript==
// @name         Messenger Blacklist
// @namespace    AAAAAAAA.com
// @version      3.6
// @description  This is how you really block people
// @author       ducktrshessami
// @match        *://www.messenger.com/*
// @match        *://www.facebook.com/messages/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/384707/Messenger%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/384707/Messenger%20Blacklist.meta.js
// ==/UserScript==

(function() {
    const blacklist = [ // Fill this list with their Facebook names
        ""
    ];

    /***************** ^^ Edit above list ^^ *****************/

    function main() { // Triggered by page change
        var dialog = $("[aria-label='Dialog content']");
        present().forEach((name) => { // Member list
            donk("[title^='Seen by " + name + " ']"); // Read receipt
            donk("[aria-label='Messages'] > div > div:has([alt='" + name + "'])", name); // Messages
            if (dialog.length) {
                donk_box("li:has(a[href]:contains('" + name + "'))", dialog); // Nickname change
                donk_box(":contains('Message Reactions') div[class] > div[class]:has(div[class]:contains('" + name + "'))", dialog);
            }
            reaction(name); // Reactions
        });
        latest_message(); // Latest message
    }

    function cleanup() { // Check for removed names from the blacklist
        for (var id in blacklistNicknames) {
            for (var name in blacklistNicknames[id]) {
                if (!blacklist.includes(name)) {
                    delete blacklistNicknames[id][name];
                }
            }
            if (jQuery.isEmptyObject(blacklistNicknames[id])) {
                delete blacklistNicknames[id];
            }
        }
    }

    async function update(name, nickname) { // Update a blacklisted user's nickname
        const url = location.href; // Assume nickname is for current conversation
        if (url) {
            if (!blacklistNicknames[url]) {
                blacklistNicknames[url] = new Object;
            }
            blacklistNicknames[url][name] = nickname;
            window.localStorage.setItem("MessengerBlacklistNicknames", JSON.stringify(blacklistNicknames));
            latest_message();
        }
    }

    function present() { // Check if there are blacklisted users in the current conversation
        return blacklist.filter((name) => {
            if (name) {
                var member = $("li:has(:contains('" + name + "'))", ".uiScrollableAreaContent:contains('Conversation Information')");
                member.hide(); // Just spam hide regardless of visibility
                return member.length;
            }
        });
    }

    async function donk(selector, name) { // Destroy targets and handle nickname parsing
        var targets = $(selector + ":visible");
        if (targets.length) { // Target acquired
            targets.hide();
            console.log("Target destroyed");
            if (name) { // Nickname parsing
                var nickname = targets.first().find("h5[aria-label]");
                if (nickname.length) { // Nickname located
                    if (nickname.children().length) {
                        nickname = nickname.children();
                    }
                    update(name, nickname.prop("innerHTML"));
                }
            }
        }
    }

    async function donk_box(selector, context) {
        var targets = $(selector + ":visible", context);
        if (targets.length) { // Target acquired
            targets.hide();
            console.log("Target destroyed");
        }
    }

    async function latest_message() { // Check the latest message of every conversation for blacklisted nicknames
        var convo, latest, found, a, b, c;
        for (var url in blacklistNicknames) {
            found = false;
            convo = $("[data-href='" + url + "']");
            if (convo) {
                latest = $("div > div > div[class]:last-child:not(:only-child)", convo); // Messenger has multiple HTML arrangements for displaying nicknames
                a = latest.children().get(0);
                b = $("div:last-child > span > span:not(:only-child)", convo);
                c = $("span:not([class])", b);
                for (var name in blacklistNicknames[url]) {
                    if (!found) {
                        if (a.textContent.startsWith(blacklistNicknames[url][name]) || b.prop("innerHTML") == blacklistNicknames[url][name] || c.prop("innerHTML") == blacklistNicknames[url][name]) { // Target acquired
                            found = true;
                            latest.hide(); // Also spam hide regardless of visibility
                        }
                    }
                }
                if (!found) { // Conversation is clear
                    latest.show();
                }
            }
        }
    }

    async function reaction(name) { // Edit the tooltip for reactions
        var targets = $("[data-tooltip-content*='" + name + "']:visible"), n;
        if (targets.length) { // Target acquired
            $("[role='button'] > span:last-child", targets).text((i, s) => {
                if (s == 1) {
                    $("[role='button']", targets).hide();
                }
                return s - 1;
            });
            targets.attr("data-tooltip-content", (i, tooltip) => tooltip.replace(name, "").replace("\n\n", "\n"));
            console.log("Target destroyed");
        }
    }

    var blacklistNicknames, observer = new MutationObserver(main);
    if (!(blacklistNicknames = JSON.parse(window.localStorage.getItem("MessengerBlacklistNicknames")))) { // Check for stored value
        blacklistNicknames = new Object;
        window.localStorage.setItem("MessengerBlacklistNicknames", JSON.stringify(blacklistNicknames));
    }
    cleanup();
    observer.observe(document.body, { // Wait for page change
        childList: true,
        subtree: true
    });
    window.addEventListener("beforeunload", () => { // Store before leaving
        cleanup();
        window.localStorage.setItem("MessengerBlacklistNicknames", JSON.stringify(blacklistNicknames));
    });
})();