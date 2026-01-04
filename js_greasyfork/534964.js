// ==UserScript==
// @name        8janny
// @description 8chan janny tools
// @version     0.2
// @license     MIT
// @namespace   9e7f6239-592e-409b-913f-06e11cc5e545
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @match       https://8chan.moe/latestPostings.js*
// @match       https://8chan.se/latestPostings.js*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/534964/8janny.user.js
// @updateURL https://update.greasyfork.org/scripts/534964/8janny.meta.js
// ==/UserScript==

// Settings
const BAN_BUTTON_LOCKOUT_MS = 1000; // ms to lock the ban buttons for after clicking one to prevent misclicks
const BAN_BUTTON_TEXT = "Bot Ban";
const BAN_DURATION = "3d";
const BAN_REASON = "bot";

// Consts
const MINI_SETTING = "8j_lp_mini";

const isLatestPostings = window.location.toString().includes("latestPostings.js");

// State
let disableBanButton = false;
let lpStyle;
let minimalMode = getBoolSetting(MINI_SETTING, false);

if (isLatestPostings) {
    buildLpStyle();
    buildMenu();

    console.log(minimalMode);
    if (minimalMode) {
        applyMinimalToPage();
    }

    // Process posts that are present on page load
    document.querySelectorAll(".postCell").forEach((post) => processPost(post));

    // Start an observer to process any posts that are dynamically loaded (load more button, etc)
    const postObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                const isPost = node.classList.contains("postCell");
                if (isPost) processPost(node);
            }
        }
    });

    const postsContainer = document.getElementById("divPostings");
    postObserver.observe(postsContainer, { childList: true });
}

// Overwrite deleteSinglePost to stay in thread / prevent refresh when deleting posts by IP
window.postingMenu.deleteSinglePost = function(boardUri, threadId, post, fromIp, unlinkFiles, wipeMedia, innerPart, forcedPassword, onThread, trash) {
    let key = `${boardUri}/${threadId}`;
    if (post !== threadId) key += `/${post}`;

    const postingPasswords = JSON.parse(localStorage.postingPasswords || "{}");
    const password = postingPasswords[key] || localStorage.deletionPassword || document.getElementById("deletionFieldPassword")

    let action;
    if (fromIp) action = onThread ? "thread-ip-deletion" : "ip-deletion";
    else action = trash ? "trash" : "delete";

    const req = {
        confirmation: true,
        password,
        deleteUploads: unlinkFiles,
        deleteMedia: wipeMedia,
        action
    };

    const reqKey = key.replaceAll("/", "-");
    req[reqKey] = true;

    window.api.formApiRequest("contentActions", req, (status, data) => {
        if (status !== "ok") {
            alert(`[${action}] FAILED : ${JSON.stringify(data)}`);
            return;
        }

        // data is undefined if you try to delete an already deleted post (or something?)
        const removed = !data || data.removedThreads || data.removedPosts;
        if (removed) {
            if (unlinkFiles) {
                innerPart.querySelector(".panelUploads")[0].remove();
            } else if (fromIp) {
                const postId = innerPart.querySelector(".labelId").innerText;
                window.posting.idsRelation[postId].forEach((innerPost) => {
                    innerPost.parentNode.remove();
                });
            } else if (data.removedThreads) {
                window.location.pathname = `/${boardUri}`;
            } else {
                let post = innerPart.parentNode;
                if (typeof(reports) !== "undefined") post = post.parentNode;
                post.remove();
            }
        } else {
            alert("Did not delete anything. Probably due to incorrect deletion password.");
        }
    });
}

function processPost(post) {
    if (minimalMode) {
        applyMinimalToPost(post);
    }

    const toolbar = document.createElement("div");
    post.appendChild(toolbar);
    toolbar.className = "toolbar";

    const banButton = document.createElement("div");
    toolbar.appendChild(banButton);
    banButton.className = "ban-button";
    banButton.innerText = BAN_BUTTON_TEXT;

    banButton.onclick = () => {
        if (!disableBanButton) {
            disableBanButton = true;
            setTimeout(() => {
                disableBanButton = false;
            }, BAN_BUTTON_LOCKOUT_MS);

            const innerPost = post.querySelector(".innerPost");
            const boardUri = post.querySelector(".labelBoard")?.innerText?.replaceAll("/", "");
            const threadId = innerPost.dataset.uri.split("/")[1]?.split("#")[0];

            if (!boardUri || !threadId) {
                alert("Could not determine info needed to perform ban.");
                return;
            }

            window.postingMenu.applySingleBan(
                "", 3, BAN_REASON, false, 0, BAN_DURATION, false,
                true, boardUri, threadId, post.id, innerPost, post
            );
        }
    }
}

function applyMinimalToPage() {
    document.querySelector("img.logoImg").classList.add("lp-hidden");
}

function applyMinimalToPost(post) {
    post.querySelector(".labelBoard")?.classList?.add("lp-hidden");
    post.querySelector(".postInfo")?.classList?.add("lp-hidden");
    post.querySelector(".panelASN")?.classList?.add("lp-hidden");
    post.querySelector(".panelBypassId")?.classList?.add("lp-hidden");
    post.querySelector(".panelIp")?.classList?.add("lp-hidden");
    post.querySelectorAll(".panelUploads summary")?.forEach((uploadSummary) => uploadSummary.classList?.add("lp-hidden"));

    const isDeleted = post.querySelector(".trashIndicator");
    if (isDeleted) {
        post.classList.add("lp-hidden");
        return;
    }
}

function buildMenu() {
    document.getElementById("lpMenu")?.remove();

    const menuFragment = new DocumentFragment();
    const menu = document.createElement("div");
    menuFragment.appendChild(menu);
    menu.id = "lpMenu";
    menu.className = "lp-menu";

    const miniContainer = document.createElement("div");
    menu.appendChild(miniContainer);
    miniContainer.className = "lp-container";
    miniContainer.title = "Remove header logo, extra info on posts, hide already deleted posts.";

    const miniLabel = document.createElement("div");
    miniContainer.appendChild(miniLabel);
    miniLabel.className = "lp-label";
    miniLabel.innerText = "Mini";

    const miniCheckbox = document.createElement("input");
    miniContainer.appendChild(miniCheckbox);
    miniCheckbox.type = "checkbox";
    miniCheckbox.checked = minimalMode;
    miniCheckbox.onclick = () => {
        minimalMode = !minimalMode;
        setSetting(MINI_SETTING, minimalMode);

        if (minimalMode) {
            applyMinimalToPage();
            document.querySelectorAll(".postCell").forEach((post) => applyMinimalToPost(post));
        } else {
            document.querySelectorAll(".lp-hidden").forEach((hidden) => hidden.classList.remove("lp-hidden"));
        }
    };

    document.getElementsByTagName("body")[0].appendChild(menuFragment);
}

function buildLpStyle() {
    const _lpStyle = document.createElement("style");
    _lpStyle.id = "lpStyle";
    lpStyle = document.head.appendChild(_lpStyle).sheet;

    lpStyle.insertRule(".lp-hidden { display: none !important; }");
    lpStyle.insertRule("div.postCell { background-color: var(--border-color); border: 2px solid var(--border-color); display: flex; flex-direction: column; margin-bottom: 0.5rem; }");
    lpStyle.insertRule("div.innerPost { border: 0; }");
    lpStyle.insertRule("div.toolbar { align-items: flex-start; background-color: var(--contrast-color); display: flex; flex-direction: column; gap: 1rem; margin-top: 1px; padding: 0.25rem; }");
    lpStyle.insertRule("div.toolbar button { border: 1px solid red; margin: 0; white-space: nowrap; }");
    lpStyle.insertRule("div.ban-button { border: 1px solid red; cursor: pointer; font-size: 0.75rem; font-weight: bold; pointer; padding: 0.25rem; user-select: none;");
    lpStyle.insertRule("div.lp-menu { background-color: var(--border-color); border: 1px solid var(--border-color); bottom: 0; display: flex; flex-direction: column; gap: 1px; position: fixed; right: 0; user-select: none; }");
    lpStyle.insertRule("div.lp-container { background-color: var(--contrast-color); color: var(--text-color); display: flex; padding: 0.25rem; }");
}

function setSetting(name, value) {
    localStorage.setItem(name, value);
}

function getBoolSetting(name, defaultValue) {
    const value = localStorage.getItem(name);
    console.log(value);
    if (value === null) return defaultValue;
    return value == "true";
}