// ==UserScript==
// @name         4chan TeleGuard ID Detector
// @license      GPLv3
// @namespace    https://boards.4chan.org/
// @version      1.3.3
// @description  Tries to detect and provide copy buttons for TeleGuard IDs on 4chan
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
// @downloadURL https://update.greasyfork.org/scripts/522222/4chan%20TeleGuard%20ID%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/522222/4chan%20TeleGuard%20ID%20Detector.meta.js
// ==/UserScript==
let rememberCopiedIDs = GM_getValue("teleguard_rememberCopiedIDs", true);
let rememberedIDs = GM_getValue("teleguard_rememberedIDs", []);
let site = "4chan";

if(location.hostname.includes("archived.moe") || location.hostname.includes("thebarchive.com")) {
    site = "foolfuuka";
}

GM_addStyle(`
    .fctgidd-rememberedID {
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
        if(posts[i].getAttribute("data-fctgidd-parsed") !== "1") {
            posts[i].setAttribute("data-fctgidd-parsed", "1");

            // Strip all backlinks
            let postText = posts[i].innerText.replace(/\>\>\b[0-9]+\b/g, "");

            let id = "";
            let words = postText.split(/\s/);
            for(let j = 0; j < words.length; j++) {
                if(words[j].match(/^[A-Z0-9]{9}$/g)) { // All IDs are 9 chars exactly, skip word if it isn't
                    id = words[j];
                    break; // only do one ID per post
                }
            }

            if(id.length == 9) { // All IDs are 9 chars; if it's not, then we didn't find one
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
                        <span style="color: #b5346c; font-weight: bold;">TeleGuard ID:</span> <span class="fctgidd-teleguard-id ${rememberCopiedIDs && rememberedIDs.includes(id) ? `fctgidd-rememberedID" title="ID has been previously copied` : ``}">${id}</span>
                        <input type="button" class="fctgidd-copy-btn" id="fctgidd-copy-btn-${i}" data-fctgidd-teleguard-id="${id}" style="margin-left: 0.5em;" value="Copy"> <input type="button" class="fctgidd-hide-btn" id="fctgidd-hide-btn-${i}" data-fctgidd-teleguard-id="${id}" style="margin-left: 0.5em;" value="🚫">
                    </div>
                `;

                posts[i].insertAdjacentHTML("beforeend", html);

                document.getElementById(`fctgidd-copy-btn-${i}`).addEventListener("click", async function() {
                    let tempInput = document.createElement("input");
                    let id = this.getAttribute("data-fctgidd-teleguard-id").trim();
                    tempInput.value = id;
                    tempInput.select();
                    tempInput.setSelectionRange(0,66);

                    try {
                        await navigator.clipboard.writeText(tempInput.value);
                        this.value = "✓";

                        if(rememberCopiedIDs) {
                            // Refresh remembered ID list in case it was updated in another tab
                            rememberedIDs = GM_getValue("teleguard_rememberedIDs", []);
                            rememberedIDs.push(id);
                            GM_setValue("teleguard_rememberedIDs", rememberedIDs);
                            updateIDs();
                        }

                        window.setTimeout(function() {
                            document.getElementById(`fctgidd-copy-btn-${i}`).value = "Copy";
                        }, 3000);
                    } catch (err) {
                        alert("Failed to copy to clipboard: " + err);
                    }
                });

                document.getElementById(`fctgidd-hide-btn-${i}`).addEventListener("click", function() {
                    if(confirm("Hide all posts with this ID?")) {
                        hiddenIDs = GM_getValue("hiddenIDs", []);
                        let id = this.getAttribute("data-fctgidd-teleguard-id").trim()
                        hiddenIDs.push(id)
                        GM_setValue("hiddenIDs", hiddenIDs);
                        updateHiddenPosts();
                    }
                });
            }
        }
    }

    if(rememberCopiedIDs) {
        updateIDs();
    }

    updateHiddenPosts();
}

function setupOptions() {
    let parent = document.querySelector("div.bottomCtrl");

    if(site == "foolfuuka") {
        parent = document.querySelector("#footer");
    }

    let html = `
        <span id="fctgidd-options">
            <input type="checkbox" name="fctgidd-rememberIDs-check" id="fctgidd-rememberIDs-check" ${rememberCopiedIDs ? `checked` : ``}>
            <label for="fctgidd-rememberIDs-check" title="Disabling also clears already remembered IDs">Remember copied TeleGuard IDs</label> |
        </span>
    `;
    parent.insertAdjacentHTML("afterbegin", html);

    document.querySelector("#fctgidd-rememberIDs-check").addEventListener("change", function() {
        GM_setValue("teleguard_rememberCopiedIDs", this.checked);

        if(!this.checked) {
            // Clear already remembered IDs on disable
            GM_setValue("teleguard_rememberedIDs", []);
            GM_setValue("hiddenIDs", [])
        }

        location.reload();
    });
}

function updateIDs() {
    rememberedIDs = GM_getValue("teleguard_rememberedIDs", []);
    let idElems = document.querySelectorAll(".fctgidd-teleguard-id");
    for(let i = 0; i < idElems.length; i++) {
        if(rememberedIDs.includes(idElems[i].innerText.trim())) {
            idElems[i].classList.add("fctgidd-rememberedID");
            idElems[i].title = "ID has been previously copied";

            idElems[i].closest("div.post").classList.add("faded");
        }
    }
}

function updateHiddenPosts() {
    let hiddenIDs = GM_getValue("hiddenIDs", []);
    let idElems = document.querySelectorAll(".fctgidd-teleguard-id");
    for(let i = 0; i < idElems.length; i++) {
        if(hiddenIDs.includes(idElems[i].innerText.trim())) {
            idElems[i].closest("div.postContainer").classList.add("hidden");
        }
    }
}

new MutationObserver(function(event) { parsePosts(); }).observe(document.querySelector("div.thread"), {subtree: true, childList: true});
setupOptions();
parsePosts();
