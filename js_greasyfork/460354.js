// ==UserScript==
// @name         Hacker News Thread Replies Monitor
// @version      0.10
// @description  Monitor replies to your Hacker News posts
// @license      WTFPL
// @match        https://news.ycombinator.com/*
// @icon         https://news.ycombinator.com/favicon.ico
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/460354/Hacker%20News%20Thread%20Replies%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/460354/Hacker%20News%20Thread%20Replies%20Monitor.meta.js
// ==/UserScript==
(async function () {
    "use strict";
    function parseDoc(doc) {
        const threads = new Map();
        for (const el of doc.querySelectorAll(".athing.comtr")) {
            const parentEl = [].find.call(el.querySelectorAll(".navs a"), (el) => el.textContent == "parent");
            const id = parseInt(el.id, 10);
            threads.set(id, {
                id,
                age: new Date(el.querySelector(".age").getAttribute("title")),
                author: el.querySelector(".hnuser").textContent,
                parentId: parentEl != null
                    ? parseInt(parentEl
                        .getAttribute("href")
                        .replace(/^(item\?id=|#)/, ""), 10)
                    : null,
                text: el.querySelector(".commtext"),
            });
        }
        return threads;
    }
    async function fetchThreadsDoc(userId) {
        return new DOMParser().parseFromString(await (await fetch(`https://news.ycombinator.com/threads?id=${userId}`)).text(), "text/html");
    }
    function gatherUserReplies(userId, threads) {
        const replyIds = new Map();
        for (const [_, comment] of threads) {
            if (comment.parentId == null) {
                continue;
            }
            const parentComment = threads.get(comment.parentId);
            if (parentComment == null) {
                continue;
            }
            if (parentComment.author != userId) {
                continue;
            }
            if (!replyIds.has(parentComment.id)) {
                replyIds.set(parentComment.id, new Set());
            }
            replyIds.get(parentComment.id).add(comment.id);
        }
        return replyIds;
    }
    const LOCAL_STORAGE_KEY = "hn-thread-monitor";
    function loadUnreadState() {
        const item = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item == null) {
            return new Map();
        }
        return new Map(JSON.parse(item).map(([id, childStates]) => [
            id,
            new Map(childStates),
        ]));
    }
    function saveUnreadState(state) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(state).map(([id, childStates]) => [
            id,
            Array.from(childStates),
        ])));
    }
    function updateUnreadState(unreadState, replies) {
        for (const [id, childrenIds] of replies) {
            const childUnreadState = unreadState.get(id);
            // Everything is new!
            if (childUnreadState == null) {
                unreadState.set(id, new Map([...childrenIds].map((childId) => [childId, true])));
                continue;
            }
            // Only some things are new, so let's copy them over.
            for (const childId of childrenIds) {
                if (!childUnreadState.has(childId)) {
                    childUnreadState.set(childId, true);
                }
            }
        }
    }
    function markPostsRead(unreadState, posts) {
        for (const [_, childUnreadState] of unreadState) {
            for (const [childId, _] of childUnreadState) {
                if (!posts.has(childId)) {
                    continue;
                }
                childUnreadState.set(childId, false);
            }
        }
    }
    function countUnread(unreadState) {
        let n = 0;
        for (const [_, childUnreadState] of unreadState) {
            for (const [_, unread] of childUnreadState) {
                if (!unread) {
                    continue;
                }
                ++n;
            }
        }
        return n;
    }
    function sleep(ms, abortSignal) {
        return new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                resolve();
            }, ms);
            if (abortSignal) {
                abortSignal.addEventListener("abort", () => {
                    clearTimeout(id);
                    reject(abortSignal.reason);
                });
            }
        });
    }
    class Monitor {
        static SLEEP_INTERVAL_MS = 30 * 1000;
        me;
        document;
        abortController;
        el;
        constructor(me, document) {
            this.me = me;
            this.document = document;
            this.abortController = new AbortController();
            this.el = document.createElement("span");
            this.el.style.padding = "0 0.5em";
            const linkEl = this.document.querySelector('a[href^="threads?id"]');
            linkEl.appendChild(this.document.createTextNode(" "));
            linkEl.appendChild(this.el);
            this.updateEl(countUnread(loadUnreadState()));
        }
        async start() {
            while (true) {
                try {
                    await sleep(Monitor.SLEEP_INTERVAL_MS, this.abortController.signal);
                }
                catch (e) {
                    break;
                }
                try {
                    await this.updateOnce(false);
                }
                catch (e) { }
            }
        }
        stop() {
            this.abortController.abort();
            this.abortController = new AbortController();
        }
        updateEl(count) {
            this.el.innerText = count != null ? count.toString() : "?";
            this.el.style.background =
                count != null && count > 0 ? "#ffffaa" : "#828282";
        }
        async updateOnce(markRead) {
            const unreadState = loadUnreadState();
            const threads = parseDoc(await fetchThreadsDoc(this.me));
            const replies = gatherUserReplies(this.me, threads);
            updateUnreadState(unreadState, replies);
            if (markRead) {
                markPostsRead(unreadState, parseDoc(this.document));
            }
            saveUnreadState(unreadState);
            this.updateEl(countUnread(unreadState));
        }
    }
    const me = document.getElementById("me").textContent;
    const monitor = new Monitor(me, document);
    await monitor.updateOnce(true);
    document.addEventListener("visibilitychange", async () => {
        switch (document.visibilityState) {
            case "visible": {
                monitor.start();
                break;
            }
            case "hidden": {
                monitor.stop();
                break;
            }
        }
    });
    monitor.start();
})();
