// ==UserScript==
// @name         Reddit Comment/Post Mass Deleter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mass delete Reddit comments and posts
// @author       c2y5
// @match        https://reddit.com/*
// @match        https://*.reddit.com/*
// @match        https://old.reddit.com/user/*/comments/*
// @match        https://old.reddit.com/user/*/submitted/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540119/Reddit%20CommentPost%20Mass%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/540119/Reddit%20CommentPost%20Mass%20Deleter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WORDLIST_URL = "https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-usa-no-swears-short.txt";
    const CACHE_KEY = "reddit_randomizer_wordlist_cache";

    function getElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    function waitForXPath(xpath, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const check = () => {
                const el = getElementByXPath(xpath);
                if (el) resolve(el);
                else if ((elapsed += interval) >= timeout) reject(new Error("XPath not found: " + xpath));
                else setTimeout(check, interval);
            };
            check();
        });
    }

    async function loadWordList() {
        let cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const words = JSON.parse(cached);
                if (Array.isArray(words) && words.length > 0) {
                    console.log(`Loaded ${words.length} words from localStorage cache.`);
                    return words;
                }
            } catch {}
        }
        try {
            const resp = await fetch(WORDLIST_URL);
            if (!resp.ok) throw new Error(`Failed to fetch word list: ${resp.status}`);
            const text = await resp.text();
            const words = text.split("\n").map(w => w.trim()).filter(w => w.length > 0);
            localStorage.setItem(CACHE_KEY, JSON.stringify(words));
            console.log(`Fetched & cached ${words.length} words from remote.`);
            return words;
        } catch (err) {
            console.error("Error loading word list:", err);
            return ["red", "blue", "green", "fast", "slow", "happy", "sad", "cat", "dog", "run", "jump", "sky", "tree", "car", "light", "dark", "fire", "water", "cloud", "stone"];
        }
    }

    async function randomSentence() {
        const words = await loadWordList();
        let sentence = [];
        for (let i = 0; i < 8; i++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        return sentence.join(" ");
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleRateLimit(container) {
        const errorSpan = container.querySelector("span.error.RATELIMIT.field-ratelimit");
        if (errorSpan && errorSpan.style.display !== "none" && errorSpan.textContent) {
            const match = errorSpan.textContent.match(/Take a break for (\d+) seconds?/i);
            if (match) {
                const waitSeconds = parseInt(match[1], 10);
                console.warn(`Rate limited: waiting ${waitSeconds + 1} seconds before retrying...`);
                await delay((waitSeconds + 1) * 1000);
                return true;
            }
        }
        return false;
    }

    function styleButton(button, topPx) {
        button.style.position = "fixed";
        button.style.top = topPx + "px";
        button.style.right = "10px";
        button.style.zIndex = 99999;
        button.style.padding = "10px 15px";
        button.style.backgroundColor = "#ff4500";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.userSelect = "none";
        button.style.fontWeight = "600";
        button.style.fontSize = "14px";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.width = "160px";
        button.style.height = "40px";
    }

    if (window.location.hostname === "old.reddit.com") {
        const userCommentsRegex = /^\/user\/([^\/]+)\/comments(\/.*)?$/;
        const userSubmittedRegex = /^\/user\/([^\/]+)\/submitted(\/.*)?$/;

        window.addEventListener("load", () => {
            const commentsMatch = window.location.pathname.match(userCommentsRegex);
            const postsMatch = window.location.pathname.match(userSubmittedRegex);

            if (commentsMatch) {
                const username = commentsMatch[1];

                const btnRandomize = document.createElement("button");
                btnRandomize.textContent = "Randomize All Comments";
                styleButton(btnRandomize, 10);

                const btnDeleteComments = document.createElement("button");
                btnDeleteComments.textContent = "Delete All Comments";
                styleButton(btnDeleteComments, 60);

                const btnGoToPosts = document.createElement("button");
                btnGoToPosts.textContent = "Go to Posts";
                styleButton(btnGoToPosts, 110);

                document.body.appendChild(btnRandomize);
                document.body.appendChild(btnDeleteComments);
                document.body.appendChild(btnGoToPosts);

                btnRandomize.addEventListener("click", async () => {
                    const comments = document.querySelectorAll("div.thing.comment");
                    if (comments.length === 0) {
                        alert("No comments found!");
                        return;
                    }
                    if (!confirm(`This will replace text of ${comments.length} comments with random 8-word sentences. Proceed?`)) {
                        return;
                    }
                    for (let i = 0; i < comments.length; i++) {
                        const comment = comments[i];
                        const editLink = comment.querySelector("a.edit-usertext");
                        if (!editLink) {
                            console.warn("No edit link found for comment:", comment.id);
                            continue;
                        }
                        editLink.click();
                        await delay(500);
                        const editor = comment.querySelector("div.usertext-edit textarea");
                        if (!editor) {
                            console.warn("No editor textarea found for comment:", comment.id);
                            continue;
                        }
                        editor.value = await randomSentence();
                        editor.dispatchEvent(new Event("input", { bubbles: true }));
                        let saved = false;
                        while (!saved) {
                            const saveBtn = comment.querySelector("button.save");
                            if (!saveBtn) break;
                            saveBtn.click();
                            await delay(1000);
                            const waited = await handleRateLimit(comment);
                            if (!waited) saved = true;
                            else console.log("Retrying save after rate limit wait...");
                        }
                        await delay(500);
                    }
                    alert("Done attempting to randomize all comments!");
                });

                btnDeleteComments.addEventListener("click", async () => {
                    const comments = document.querySelectorAll("div.thing.comment");
                    if (comments.length === 0) {
                        alert("No comments found!");
                        return;
                    }
                    if (!confirm(`This will DELETE ${comments.length} comments. This action cannot be undone. Proceed?`)) {
                        return;
                    }
                    for (let i = 0; i < comments.length; i++) {
                        const comment = comments[i];
                        const deleteForm = comment.querySelector("form.toggle.del-button");
                        if (!deleteForm) continue;
                        const deleteLink = deleteForm.querySelector("a.togglebutton[data-event-action=\"delete\"]");
                        if (!deleteLink) continue;
                        deleteLink.click();
                        await delay(500);
                        const yesLink = deleteForm.querySelector("a.yes");
                        if (!yesLink) continue;
                        yesLink.click();
                        await delay(1000);
                        await handleRateLimit(comment);
                    }
                    alert("Done attempting to delete all comments!");
                });

                btnGoToPosts.addEventListener("click", () => {
                    window.location.href = `https://old.reddit.com/user/${username}/submitted/`;
                });

            } else if (postsMatch) {
                const username = postsMatch[1];

                const btnDeletePosts = document.createElement("button");
                btnDeletePosts.textContent = "Delete All Posts";
                styleButton(btnDeletePosts, 10);

                const btnGoToComments = document.createElement("button");
                btnGoToComments.textContent = "Go to Comments";
                styleButton(btnGoToComments, 60);

                document.body.appendChild(btnDeletePosts);
                document.body.appendChild(btnGoToComments);

                btnDeletePosts.addEventListener("click", async () => {
                    const posts = document.querySelectorAll("div.thing.link");
                    if (posts.length === 0) {
                        alert("No posts found!");
                        return;
                    }
                    if (!confirm(`This will DELETE ${posts.length} posts. This action cannot be undone. Proceed?`)) {
                        return;
                    }
                    for (let i = 0; i < posts.length; i++) {
                        const post = posts[i];
                        const deleteForm = post.querySelector("form.toggle.del-button");
                        if (!deleteForm) continue;
                        const deleteLink = deleteForm.querySelector("a.togglebutton[data-event-action=\"delete\"]");
                        if (!deleteLink) continue;
                        deleteLink.click();
                        await delay(500);
                        const yesLink = deleteForm.querySelector("a.yes");
                        if (!yesLink) continue;
                        yesLink.click();
                        await delay(1000);
                        await handleRateLimit(post);
                    }
                    alert("Done attempting to delete all posts!");
                });

                btnGoToComments.addEventListener("click", () => {
                    window.location.href = `https://old.reddit.com/user/${username}/comments/`;
                });
            }
        });

    } else {
        window.addEventListener("load", () => {
            const button = document.createElement("button");
            button.innerText = "Go to Old Reddit";
            button.style.position = "fixed";
            button.style.bottom = "20px";
            button.style.right = "20px";
            button.style.zIndex = "9999";
            button.style.width = "160px";
            button.style.height = "40px";
            button.style.backgroundColor = "#ff4500";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.fontWeight = "600";
            button.style.fontSize = "14px";
            button.style.userSelect = "none";

            document.body.appendChild(button);

            button.addEventListener("click", async () => {
                try {
                    const avatarXPath = "/html/body/shreddit-app/reddit-header-large/reddit-header-action-items/header/nav/div[3]/div[2]/rpl-dropdown/rpl-tooltip/activate-feature/button/span/span/div/faceplate-partial/span/span";
                    const avatar = await waitForXPath(avatarXPath, 5000);
                    avatar.click();

                    const usernameXPath = "//span[contains(@class, \"text-12\") and starts-with(text(), \"u/\")]";
                    const usernameElem = await waitForXPath(usernameXPath, 5000);
                    const username = usernameElem.innerText.replace(/^u\//, "");

                    const targetUrl = `https://old.reddit.com/user/${username}/comments/`;
                    window.location.href = targetUrl;
                } catch (err) {
                    alert("Failed: " + err.message);
                    console.error(err);
                }
            });
        });
    }
})();
