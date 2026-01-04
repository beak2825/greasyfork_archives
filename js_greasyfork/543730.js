// ==UserScript==
// @name         4chan Media-B-Gone
// @namespace    https://boards.4chan.org/
// @version      1.2.2
// @license      GPLv3
// @description  Filter media on 4chan using duplicate detection
// @author       ceodoe
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/res/*
// @match        https://boards.4chan.org/*/catalog
// @match        https://boards.4chan.org/*/
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543730/4chan%20Media-B-Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/543730/4chan%20Media-B-Gone.meta.js
// ==/UserScript==

// Load settings
let filteredImageHashes = GM_getValue("filteredImageHashes", []).filter(e => e.trim() !== "");
let settings = GM_getValue("settings", {
    use4chanX: true,
    hideCompletely: true,
    addTo4chanXFilter: true,
    addTo4chanXFilterNoStub: true,
    hammingDistance: 5,
    nukeBtnText: "☢️",
    showHashInstead: false
});

function main() {
    GM_addStyle(`
        .hidden {
            display: none !important;
        }

        span#fcmbg-settings-btn {
            cursor: pointer;
            user-select: none;
        }

        dialog#fcmbg-settings-dialog::backdrop {
            backdrop-filter: blur(5px);
        }

        dialog#fcmbg-settings-dialog h3 {
            margin: 0;
            margin-bottom: 0.5em;
        }

        dialog#fcmbg-settings-dialog {
            box-sizing: border-box;
            color: inherit;
            background-color: inherit;
            font-family: inherit;
            border-radius: 10px;
            border: 1px solid #888;
            min-width: 40em;
            max-width: 50%;
        }

        span#fcmbg-closebtn {
            cursor: pointer;
            float: right;
        }

        textarea#fcmbg-hashes-textbox {
            width: 98%;
            width: -moz-available;
            width: -webkit-fill-available;
            height: 100px;
            margin-bottom: 0.5em;
            color: inherit;
            background-color: inherit;
        }

        input.fcmbg-indented-checkbox {
            margin-left: 2em;
        }

        input.fcmbg-indented-checkbox-2 {
            margin-left: 4em;
        }

        input[type=checkbox]:disabled + label {
            color: #888;
        }

        .fcmbg-positive {
            color: #0f0;
        }

        .fcmbg-negative {
            color: #f00;
        }

        .fcmbg-positive, .fcmbg-negative {
            font-weight: bold;
        }

        div#fcmbg-save-button-wrapper {
            width: 98%;
            width: -moz-available;
            width: -webkit-fill-available;
            margin: auto;
            margin-top: 2em;
            text-align: center;
        }

        .fcmbg-footnote {
            margin-bottom: 0.2em;
        }

        .fcmbg-nuke-button {
            margin-left: 0.2em;
            cursor: pointer;
            user-select: none;
        }
    `);

    window.addEventListener("load", function () {
        let settingsDialog = this.document.createElement("dialog");
        settingsDialog.id = "fcmbg-settings-dialog";
        settingsDialog.innerHTML = `
            <span id="fcmbg-closebtn" title="Close" onclick="this.closest('dialog').close()">❌</span>
            <h3>☢️ 4chan Media-B-Gone</h3>

            Filtered thumbnail hashes (comma-separated) <sup>[1]</sup> :<br />
            <textarea id="fcmbg-hashes-textbox" placeholder="List of comma-separated hashes">${filteredImageHashes.join(",")}</textarea><br />

            <input type="checkbox" id="fcmbg-checkbox-usefourchanx" ${settings.use4chanX ? "checked" : ""}><label for="fcmbg-checkbox-usefourchanx">Integrate with 4chan X (${is4chanXActive() ? "<span class='fcmbg-positive'>Detected</span>" : "<span class='fcmbg-negative'>Not detected</span>"})</label><br />
                <input type="checkbox" id="fcmbg-checkbox-hidecompletely" class="fcmbg-indented-checkbox" ${settings.hideCompletely ? "checked" : ""}><label for="fcmbg-checkbox-hidecompletely">Hide matched media completely instead of leaving a stub <sup>[2]</sup></label><br />
                <input type="checkbox" id="fcmbg-checkbox-add-to-filter" class="fcmbg-indented-checkbox" ${settings.addTo4chanXFilter ? "checked" : ""}><label for="fcmbg-checkbox-add-to-filter">Add matched media to 4chan X's Image MD5 filter</label><br />
                <input type="checkbox" id="fcmbg-checkbox-add-to-filter-nostub" class="fcmbg-indented-checkbox-2" ${settings.addTo4chanXFilterNoStub ? "checked" : ""}><label for="fcmbg-checkbox-add-to-filter-nostub">Add <code>stub:no;</code> to generated 4chan X filters to override stub setting <sup>[3]</sup></label><br /><br />

            <input type="checkbox" id="fcmbg-checkbox-hash-instead-of-btn" ${settings.showHashInstead ? "checked" : ""}><label for="fcmbg-checkbox-hash-instead-of-btn">Show copiable media hash on posts instead of nuke button</label><br />
            Text to show on the hide button: <input type="text" id="fcmbg-checkbox-nuke-button-text" value="${settings.nukeBtnText || "☢️"}" /><br />

            <br />

            Hamming distance <sup>[4]</sup> : <input type="number" value="${settings.hammingDistance}" max="15" min="0" id="fcmbg-hamming-distance-numeric" /><br /></<br /><br />

            <small>
                <div class="fcmbg-footnote">
                    <sup>[1]</sup> Note that these are <i>average hashes</i>, not MD5 hashes, they are incompatible with 4chan X's hashes
                </div>
                <div class="fcmbg-footnote">
                    <sup>[2]</sup> If stubs are turned off in 4chan X's settings, this setting will have no effect.
                </div>
                <div class="fcmbg-footnote">
                    <sup>[3]</sup> This requires a page reload to take effect since 4chan X doesn't reparse posts unless the page is reloaded.
                </div>
                <div class="fcmbg-footnote">
                    <sup>[4]</sup> Valid values are 0-15. A value of 0 means no tolerance for any differences in the image, a value of 15 means a high tolerance for differences. A value of 5 is ideal.
                </div>
            </small>

            <div id="fcmbg-save-button-wrapper">
                <input type="button" value="Save and reload" id="fcmbg-save-button" />
            </div>
        `;

        document.body.insertAdjacentElement("afterbegin", settingsDialog);

        // Disable all 4chan X related options if it's not detected
        if(!is4chanXActive()) {
            document.querySelector("#fcmbg-checkbox-usefourchanx").disabled = true;
            document.querySelector("#fcmbg-checkbox-hidecompletely").disabled = true;
            document.querySelector("#fcmbg-checkbox-add-to-filter").disabled = true;
            document.querySelector("#fcmbg-checkbox-add-to-filter-nostub").disabled = true;
        }

        document.querySelector("#fcmbg-checkbox-usefourchanx").addEventListener("change", function() {
            if(this.checked) {
                document.querySelector("#fcmbg-checkbox-hidecompletely").disabled = false;
                document.querySelector("#fcmbg-checkbox-add-to-filter").disabled = false;
                document.querySelector("#fcmbg-checkbox-add-to-filter-nostub").disabled = false;
            } else {
                document.querySelector("#fcmbg-checkbox-hidecompletely").disabled = true;
                document.querySelector("#fcmbg-checkbox-add-to-filter").disabled = true;
                document.querySelector("#fcmbg-checkbox-add-to-filter-nostub").disabled = true;
            }
        });

        document.querySelector("#fcmbg-save-button").addEventListener("click", function() {
            settings.use4chanX = document.querySelector("#fcmbg-checkbox-usefourchanx").checked;
            settings.showHashInstead = document.querySelector("#fcmbg-checkbox-hash-instead-of-btn").checked;
            settings.hideCompletely = document.querySelector("#fcmbg-checkbox-hidecompletely").checked;
            settings.addTo4chanXFilter = document.querySelector("#fcmbg-checkbox-add-to-filter").checked;
            settings.addTo4chanXFilterNoStub = document.querySelector("#fcmbg-checkbox-add-to-filter-nostub").checked;
            settings.nukeBtnText = document.querySelector("#fcmbg-checkbox-nuke-button-text").value;
            settings.hammingDistance = document.querySelector("#fcmbg-hamming-distance-numeric").value;
            GM_setValue("settings", settings);

            // Do not reload hashes since user may have edited the list directly
            filteredImageHashes = document.querySelector("#fcmbg-hashes-textbox").value.split(",").map(e => e.trim()).filter(e => e !== "");

            GM_setValue("filteredImageHashes", [...new Set(filteredImageHashes.filter(e => e.trim() !== ""))]);

            location.reload();
        });

        settingsDialog.addEventListener("click", function(event) {
            let rect = this.getBoundingClientRect();
            let isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );

            if(!isInDialog) {
                this.close();
            }
        });


        if(is4chanXActive() && settings.use4chanX) {
            let fcMBGSettingsBtn = document.createElement("span");
            fcMBGSettingsBtn.innerText = "☢️";
            fcMBGSettingsBtn.id = "fcmbg-settings-btn";

            let fcXSettingsBtn = document.querySelector("span#shortcut-settings");
            fcMBGSettingsBtn.classList.add("shortcut");
            fcMBGSettingsBtn.classList.add("brackets-wrap");
            fcXSettingsBtn.insertAdjacentElement("afterend", fcMBGSettingsBtn);
        } else {
            // Thread
            let anchorElem = document.querySelector("div.navLinks.desktop");

            // Index
            if(!anchorElem) {
                anchorElem = document.querySelector("div#ctrl-top");
            }

            // Catalog
            if(!anchorElem) {
                anchorElem = document.querySelector("span.navLinks");
            }

            anchorElem.insertAdjacentHTML("beforeend", `
                [ <a id="fcmbg-settings-btn" href="#">☢️ Media-B-Gone</a> ]
            `);
        }

        document.querySelector("#fcmbg-settings-btn").onclick = function() {
            document.querySelector("#fcmbg-settings-dialog").showModal();
        };

        // Skip initial load if we load into 4chan X catalog, and let the MutationObserver deal with the posts
        if(!document.querySelector("div.board.catalog-small, div.board.catalog-large")) {
            let images = document.querySelectorAll("a.fileThumb > img, a.catalog-link > img.catalog-thumb, div.thread img.thumb");
            let md5Hashes4chanX = [];

            // Mark initial batch parsed before starting observer so we don't process twice
            images.forEach(img => {
                (img.closest("div.postContainer") || img.closest("div.thread")).setAttribute("data-fcmbg-parsed", "1");
            });

            let initialLoop = new Promise((resolve, reject) => {
                let promises = Array.from(images).map(img => {
                    return getImageHash(img.src).then(hash => {
                        post = (img.closest("div.postContainer") || img.closest("div.thread"));

                        if(settings.showHashInstead) {
                            let hashElem = this.document.createElement("span");
                            hashElem.innerText = " " + hash + " ";
                            hashElem.title = "Media hash for Media-B-Gone";

                            let anchorElem = (post.querySelector("div.catalog-stats") || post.querySelector("span.postNum.desktop") || post.querySelector("div.meta"));
                            anchorElem.insertAdjacentElement("afterend", hashElem);
                        }

                        img.setAttribute("data-fcmbg-ahash", hash);
                        for(let i = 0; i < filteredImageHashes.length; i++) {
                            if(hammingDistance(hash, filteredImageHashes[i]) <= settings.hammingDistance) {
                                // Adding an all-zero hash will nuke a ton of unintended media, it represents an image whose pixels are close to being all the same
                                if(hash !== "0000000000000000") {
                                    nukePost(hash, post);
                                    if(settings.use4chanX) {
                                        if(is4chanXActive() && settings.addTo4chanXFilter) {
                                            md5Hashes4chanX.push(img.getAttribute("data-md5"));
                                        }
                                    }
                                    break; // no need to try to hide already hidden post
                                }
                            }
                        }
                    });
                });

                Promise.all(promises).then(resolve).catch(reject);
            });

            initialLoop.then(() => {
                if(is4chanXActive() && settings.addTo4chanXFilter) {
                    if(md5Hashes4chanX.length > 0) {
                        update4chanXFilter(md5Hashes4chanX)
                    }
                }
            });

            for(let i = 0; i < images.length; i++) {
                if(images[i].classList.contains("catalog-thumb")) {
                    addNukeButton(images[i].closest("div.catalog-thread"));
                } else if(images[i].closest("div.postContainer")){
                    addNukeButton(images[i].closest("div.postContainer"));
                } else {
                    addNukeButton(images[i].closest("div.thread"));
                }
            }
        }
    });

    new MutationObserver(function(event) { parseNewPosts(); }).observe(document.querySelector("div.thread") || document.querySelector("div.board"), {subtree: true, childList: true});
}

function parseNewPosts() {
    let images = document.querySelectorAll("a.fileThumb > img, a.catalog-link > img.catalog-thumb, div.thread img.thumb");

    for(let i = 0; i < images.length; i++) {
        let post = (images[i].closest("div.catalog-thread") || images[i].closest("div.thread") || images[i].closest("div.postContainer"));
        if(post.getAttribute("data-fcmbg-parsed")) {
            continue;
        } else {
            post.setAttribute("data-fcmbg-parsed", "1");
            addNukeButton(post);
            processImage(images[i]);
        }
    }
}

async function processImage(img) {
    let hash = await getImageHash(img.src);
    img.setAttribute("data-fcmbg-ahash", hash);

    for(let i = 0; i < filteredImageHashes.length; i++) {
        if(hammingDistance(hash, filteredImageHashes[i]) <= settings.hammingDistance) {
            nukePost(hash, img.closest("div.postContainer"));

            if(is4chanXActive() && settings.addTo4chanXFilter) {
                update4chanXFilter(img.getAttribute("data-md5"));
            }

            break;
        }
    }
}

function addNukeButton(post) {
    if(settings.showHashInstead) {
        return;
    }

    // Try to ascend to an ancestor to avoid duping nuke buttons
    let ancestor = post.closest("div.postContainer") || post;
    if(!ancestor.querySelector(".fcmbg-nuke-button")) {
        post = ancestor;
    } else {
        return;
    }

    let nukeBtn = document.createElement("span");

    nukeBtn.innerText = settings.nukeBtnText || "☢️";
    nukeBtn.title = "Nuke media with 4chan Media-B-Gone";
    nukeBtn.classList.add("fcmbg-nuke-button");
    nukeBtn.addEventListener("click", function() {
        let img = post.querySelector("a.fileThumb > img, a.catalog-link > img.catalog-thumb, div.thread img.thumb");
        let aHash = img.getAttribute("data-fcmbg-ahash");
        let md5hash = img.getAttribute("data-md5");

        if(hammingDistance(aHash, "0000000000000000") <= settings.hammingDistance) {
            alert("You are trying to hide a piece of media which is very close to has to all zeroes. This has unintended consequences and will lead to a lot of false positives when it comes to videos that start with a black or white frame.");
        } else {
            nukePost(aHash, post);

            if(is4chanXActive() && settings.addTo4chanXFilter) {
                update4chanXFilter(md5hash);
            }
        }
    });

    let anchorElem = (post.querySelector("div.catalog-stats") || post.querySelector("span.postNum.desktop") || post.querySelector("div.meta"));
    anchorElem.insertAdjacentElement("afterend", nukeBtn);
}

function nukePost(hash, post) {
    // Refresh hashes in case they were updated in another tab
    filteredImageHashes = GM_getValue("filteredImageHashes", []);
    filteredImageHashes.push(hash);
    document.querySelector("#fcmbg-hashes-textbox").value = filteredImageHashes.join(",");
    GM_setValue("filteredImageHashes", [...new Set(filteredImageHashes.filter(e => e.trim() !== ""))]);
    document.querySelector("textarea#fcmbg-hashes-textbox").value = filteredImageHashes.join(",");

    if(is4chanXActive() && settings.use4chanX) {
        if(post && !post.querySelector("div.stub")) {
            let hideBtn = post.querySelector("a.hide-reply-button");
            if(hideBtn) {
                hideBtn.click();
            }
        }

        if(post && ((is4chanXActive() && settings.hideCompletely) || is4chanXActive() == false)) {
            post.classList.add("hidden");
        }
    } else {
        if(post) {
            post.classList.add("hidden");
        }
    }
}

function update4chanXFilter(newHashes) {
    if(newHashes.constructor == Array) {
        newHashes = newHashes.map(function(e) {
            return `/${e}/${settings.addTo4chanXFilterNoStub ? ";stub:no;" : ""}`;
        });
    } else if(typeof newHashes == "string") {
        newHashes = [`/${newHashes}/${settings.addTo4chanXFilterNoStub ? ";stub:no;" : ""}`];
    }


    document.querySelector("a.settings-link").click();
    document.querySelector("div#overlay").classList.add("hidden");
    document.querySelector("a.tab-filter").click();
    document.querySelector("select[name=filter]").value = "MD5";
    document.querySelector("select[name=filter]").dispatchEvent(new Event("change"));

    let waitFor4chanX = window.setInterval(function() {
        let md5field = document.querySelector("textarea.field[name=MD5]");

        if(md5field) {
            window.clearInterval(waitFor4chanX);
            let md5s = md5field.value.split("\n").map(function(e) { return e.trim(); });
            md5s = md5s.concat(newHashes);

            // Remove dupes
            md5s = [...new Set(md5s)];

            md5field.value = md5s.join("\n");
            md5field.dispatchEvent(new Event("change"));

            document.querySelector("div#overlay").classList.remove("hidden");
            document.querySelector("a.close.fa.fa-times").click();
        }
    }, 100);
}

async function getImageHash(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = 8;
            canvas.height = 8;
            ctx.drawImage(img, 0, 0, 8, 8);

            let imageData = ctx.getImageData(0, 0, 8, 8).data;
            let grayValues = [];

            // Convert to grayscale
            for(let i = 0; i < imageData.length; i += 4) {
                let r = imageData[i];
                let g = imageData[i + 1];
                let b = imageData[i + 2];

                // Grayscale average
                let gray = Math.round((r + g + b) / 3);
                grayValues.push(gray);
            }

            // Compute average brightness
            let avg = grayValues.reduce((sum, val) => sum + val, 0) / grayValues.length;

            // Build hash: 1 if pixel > avg, else 0
            let bits = grayValues.map(v => (v > avg ? 1 : 0)).join('');

            // Convert bits to hex string
            let hash = parseInt(bits, 2).toString(16).padStart(16, '0');

            resolve(hash);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
    });
}

function hexToBinary(hex) {
    return hex.split("").map(h =>
        parseInt(h, 16).toString(2).padStart(4, "0")
    ).join("");
}

function hammingDistance(hash1, hash2) {
    let bin1 = hexToBinary(hash1);
    let bin2 = hexToBinary(hash2);

    let dist = 0;
    for(let i = 0; i < bin1.length; i++) {
        if(bin1[i] !== bin2[i]) {
            dist++;
        }
    }
    return dist;
}

function is4chanXActive() {
    return document.documentElement.classList.contains("fourchan-x");
}

main();
