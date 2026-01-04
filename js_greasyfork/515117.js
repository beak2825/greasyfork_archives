// ==UserScript==
// @name        YouTube Flag Tracker
// @namespace   Violentmonkey Scripts
// @version     1.2.2
// @description Track changes in YouTube's experiment flags
// @include     http*://www.youtube.com/*
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/515117/YouTube%20Flag%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/515117/YouTube%20Flag%20Tracker.meta.js
// ==/UserScript==

function save(key, data) {

    if (!Object.keys(data).length) {
        return;
    }

    if (key === "changes") {
        const changes = GM_getValue("changes", []);
        changes.unshift(data);
        data = changes;
    }

    GM_setValue(key, data);
}

function isEqual(a, b) {

    if (Array.isArray(a) && Array.isArray(b)) {
        return (
            a.length === b.length &&
            JSON.stringify(a) === JSON.stringify(b)
        );
    }

    return a === b;
}

function diffChecker(prev = {}, curr = {}) {

    let changes = {};

    const allKeys = new Set([...Object.keys(prev), ...Object.keys(curr)]);

    allKeys.forEach(key => {

        const prevVal = prev[key];
        const currVal = curr[key];

        if (prevVal === undefined) {
            changes[key] = { type: "added", value: currVal };
        }

        else if (currVal === undefined) {
            changes[key] = { type: "removed" };
        }

        else if (!isEqual(prevVal, currVal)) {
            changes[key] = { type: "modified", value: currVal };
        }
    });

    return changes;
}

function updateStorage(currentFlags) {

    const previousFlags = GM_getValue("flags", {});
    const changes = diffChecker(previousFlags, currentFlags);

    const numChanges = Object.keys(changes).length;
    const maxChanges = Object.keys(previousFlags).length / 2;

    if (!maxChanges || numChanges <= maxChanges) {
        save("changes", changes);
        save("flags", currentFlags);
    }
}

function observeFlags() {

    const observer = new MutationObserver(() => {

        const flags = unsafeWindow.yt?.config_?.EXPERIMENT_FLAGS;

        if (flags) {
            observer.disconnect();
            updateStorage(flags);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


observeFlags();