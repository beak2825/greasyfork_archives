// ==UserScript==
// @name         4chan Session ID Unbreaker
// @license      GPLv3
// @namespace    https://boards.4chan.org/
// @version      2.7.1
// @description  Tries to detect and un-break Session IDs posted on 4chan
// @author       ceodoe
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/res/*
// @match        https://archived.moe/*/thread/*
// @match        https://www.archived.moe/*/thread/*
// @match        https://thebarchive.com/*/thread/*
// @match        https://www.thebarchive.com/*/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488221/4chan%20Session%20ID%20Unbreaker.user.js
// @updateURL https://update.greasyfork.org/scripts/488221/4chan%20Session%20ID%20Unbreaker.meta.js
// ==/UserScript==
let rememberCopiedIDs = GM_getValue("rememberCopiedIDs", true);
let rememberedIDs = GM_getValue("rememberedIDs", []);
let site = "4chan";

if(location.hostname.includes("archived.moe") || location.hostname.includes("thebarchive.com")) {
    site = "foolfuuka";
}

GM_addStyle(`
    .fcsidu-rememberedID {
        color: #aaa;
        border-bottom: 1px dotted #aaa;
    }

    .faded {
        opacity: 30%;
    }

    .hidden {
        display: none;
    }
`);

function parsePosts() {
    let posts = document.querySelectorAll("blockquote.postMessage");

    if(site == "foolfuuka") {
        posts = document.querySelectorAll("article > div.text, div.post_wrapper > div.text");
    }

    for(let i = 0; i < posts.length; i++) {
        if(posts[i].getAttribute("data-fcsidu-parsed") !== "1") {
            posts[i].setAttribute("data-fcsidu-parsed", "1");

            // Strip all backlinks as they are likely to contain the magic number 05 that all Session IDs start with
            let postText = posts[i].innerText.replace(/\>\>\b[0-9]+\b/g, "");
            let idStartIndex = postText.indexOf("05");

            if(idStartIndex > -1) {
                let id = "";

                // "Smart" detection mechanism removes all non-alphanumeric chars, then ignores words with
                // non-hexadecimal chars in them, and tries to build a string exactly 66 chars long
                let words = postText.substring(idStartIndex).split(/\s/);
                for(let j = 0; j < words.length && id.length < 66; j++) {
                    let word = words[j].replace(/[^A-Za-z0-9]/g, "");

                    if(!word.match(/[^A-Fa-f0-9]/g)) {
                        id += word;
                    }
                }

                if(id.length == 66) { // All IDs are 66 chars; if we didn't get exactly 66, ID is invalid
                    let opPost = "";
                    if(posts[i].parentNode.classList.contains("op")) {
                        opPost = "overflow: auto;";
                    }

                    let archivePost = "border-top: 1px solid; width: fit-content;";
                    if(posts[i].parentNode.tagName.toLowerCase() == "article") {
                        archivePost = "";
                    }

                    let html = `
                        <div style="margin-top: 1em; padding: 0.5em; ${archivePost} ${opPost}">
                            <span style="color: #66cc33; font-weight: bold;">Session ID:</span> <span class="fcsidu-session-id ${rememberCopiedIDs && rememberedIDs.includes(id) ? `fcsidu-rememberedID" title="ID has been previously copied` : ``}">${id}</span>
                            <input type="button" class="fcsidu-copy-btn" id="fcsidu-copy-btn-${i}" data-fcsidu-session-id="${id}" style="margin-left: 0.5em;" value="Copy"> <input type="button" class="fcsidu-hide-btn" id="fcsidu-hide-btn-${i}" data-fcsidu-session-id="${id}" style="margin-left: 0.5em;" value="🚫">
                        </div>
                    `;

                    posts[i].insertAdjacentHTML("beforeend", html);

                    document.getElementById(`fcsidu-copy-btn-${i}`).addEventListener("click", async function() {
                        let tempInput = document.createElement("input");
                        let id = this.getAttribute("data-fcsidu-session-id").trim();
                        tempInput.value = id;
                        tempInput.select();
                        tempInput.setSelectionRange(0,66);

                        try {
                            await navigator.clipboard.writeText(tempInput.value);
                            this.value = "✓";

                            if(rememberCopiedIDs) {
                                // Refresh remembered ID list in case it was updated in another tab
                                rememberedIDs = GM_getValue("rememberedIDs", []);
                                rememberedIDs.push(id);
                                GM_setValue("rememberedIDs", rememberedIDs);
                                updateIDs();
                            }

                            window.setTimeout(function() {
                                document.getElementById(`fcsidu-copy-btn-${i}`).value = "Copy";
                            }, 3000);
                        } catch (err) {
                            alert("Failed to copy to clipboard: " + err);
                        }
                    });

                    document.getElementById(`fcsidu-hide-btn-${i}`).addEventListener("click", function() {
                        if(confirm("Hide all posts with this ID?")) {
                            hiddenIDs = GM_getValue("hiddenIDs", []);
                            let id = this.getAttribute("data-fcsidu-session-id").trim()
                            hiddenIDs.push(id)
                            GM_setValue("hiddenIDs", hiddenIDs);
                            updateHiddenPosts();
                        }
                    });
                }
            }
        }
    }

    if(rememberCopiedIDs) {
        updateIDs();
    }

    updateHiddenPosts();
}

function setupOptions() {
    let parent =  document.querySelector("div.bottomCtrl");

    if(site == "foolfuuka") {
        parent = document.querySelector("#footer");
    }

    let html = `
        <span id="fcsidu-options">
            <input type="checkbox" name="fcsidu-rememberIDs-check" id="fcsidu-rememberIDs-check" ${rememberCopiedIDs ? `checked` : ``}>
            <label for="fcsidu-rememberIDs-check" title="Disabling also clears already remembered IDs">Remember copied Session IDs</label> |
        </span>
    `;
    parent.insertAdjacentHTML("afterbegin", html);

    document.querySelector("#fcsidu-rememberIDs-check").addEventListener("change", function() {
        GM_setValue("rememberCopiedIDs", this.checked);

        if(!this.checked) {
            // Clear already remembered IDs on disable
            GM_setValue("rememberedIDs", []);
            GM_setValue("hiddenIDs", [])
        }

        location.reload();
    });
}

function updateIDs() {
    rememberedIDs = GM_getValue("rememberedIDs", []);
    let idElems = document.querySelectorAll(".fcsidu-session-id");
    for(let i = 0; i < idElems.length; i++) {
        if(rememberedIDs.includes(idElems[i].innerText.trim())) {
            idElems[i].classList.add("fcsidu-rememberedID");
            idElems[i].title = "ID has been previously copied";

            idElems[i].closest("div.post").classList.add("faded");
        }
    }
}

function updateHiddenPosts() {
    let hiddenIDs = GM_getValue("hiddenIDs", []);
    let idElems = document.querySelectorAll(".fcsidu-session-id");
    for(let i = 0; i < idElems.length; i++) {
        if(hiddenIDs.includes(idElems[i].innerText.trim())) {
            idElems[i].closest("div.postContainer").classList.add("hidden");
        }
    }
}

new MutationObserver(function(event) { parsePosts(); }).observe(document.querySelector("div.thread"), {subtree: true, childList: true});
setupOptions();
parsePosts();
