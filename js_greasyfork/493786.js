// ==UserScript==
// @name         SFF Enhancer
// @namespace    https://sff.i5.lu/
// @version      1.2
// @license      GPLv3
// @description  Replaces ID on SFF with copy link, and adds extra features
// @author       ceodoe
// @match        https://sff.i5.lu/
// @match        https://sff.i5.lu/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getsession.org
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/493786/SFF%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/493786/SFF%20Enhancer.meta.js
// ==/UserScript==

function setupOptionsBoxes() {
    let bumpLink = document.querySelector("a[href$='bump.php'");

    let html = `
        | <input type="checkbox" name="sffe-shorten-ids-checkbox" id="sffe-shorten-ids-checkbox" ${shorten ? `checked` : ``}><label for="sffe-shorten-ids-checkbox">Shorten IDs</label>
        <input type="checkbox" name="sffe-favicon-checkbox" id="sffe-favicon-checkbox" ${setFavicon ? `checked` : ``}><label for="sffe-favicon-checkbox">Add site favicon</label>
        <input type="checkbox" name="sffe-autorefresh-checkbox" id="sffe-autorefresh-checkbox" ${autoRefresh ? `checked` : ``}><label for="sffe-autorefresh-checkbox">Auto refresh</label>
        <input type="checkbox" name="sffe-remember-copied-checkbox" id="sffe-remember-copied-checkbox" ${rememberCopiedIDs ? `checked` : ``}><label for="sffe-remember-copied-checkbox">Remember copied IDs</label>
        <input type="checkbox" name="sffe-hide-add-date" id="sffe-hide-add-date" ${hideAddDate ? `checked` : ``}><label for="sffe-hide-add-date">Hide "Add Date" column</label>
        <input type="checkbox" name="sffe-hide-bump-date" id="sffe-hide-bump-date" ${hideBumpDate ? `checked` : ``}><label for="sffe-hide-bump-date">Hide "Bump Date" column</label>
    `;

    bumpLink.insertAdjacentHTML("afterend", html);

    document.getElementById("sffe-shorten-ids-checkbox").addEventListener("change", function() {
        GM_setValue("sffeShortenIDs", this.checked);
        location.reload();
    });

    document.getElementById("sffe-favicon-checkbox").addEventListener("change", function() {
        GM_setValue("sffeFavicon", this.checked);
        location.reload();
    });

    document.getElementById("sffe-autorefresh-checkbox").addEventListener("change", function() {
        GM_setValue("sffeAutoRefresh", this.checked);
        location.reload();
    });

    document.getElementById("sffe-remember-copied-checkbox").addEventListener("change", function() {
        GM_setValue("sffeRememberCopiedIDs", this.checked);

        if(!this.checked) {
            GM_setValue("sffeRememberedIDs", []); // clear saved IDs if user disables memory
        }

        location.reload();
    });

    document.getElementById("sffe-hide-add-date").addEventListener("change", function() {
        GM_setValue("sffeHideAddDate", this.checked);
        location.reload();
    });

    document.getElementById("sffe-hide-bump-date").addEventListener("change", function() {
        GM_setValue("sffeHideBumpDate", this.checked);
        location.reload();
    });
}

function setupCopyableIDs() {
    let idElements = document.querySelectorAll("tr > td:first-child");
    for(let i = 1; i < idElements.length; i++) { // Skip first row as it is a header row not marked as such
        let id = idElements[i].innerText.trim();
        let displayID = shorten ? id.substring(0,9) + "…" : id;

        let html = `
            <span class="copy-btn" id="copy-btn-${i}" data-session-id="${id}" style="cursor: pointer; border-bottom: 1px dashed;" title="Click to copy">
                <span id="copy-icon-${i}">${rememberCopiedIDs && rememberedIDs.includes(id) ? `✅` : `📄`}</span> ${displayID}
            </span>
        `;

        idElements[i].innerHTML = html;

        document.getElementById(`copy-btn-${i}`).addEventListener("click", async function() {
            let tempInput = document.createElement("input");
            let sessionID = this.getAttribute("data-session-id").trim();
            tempInput.value = sessionID;
            tempInput.select();
            tempInput.setSelectionRange(0,66);

            try {
                await navigator.clipboard.writeText(tempInput.value);
                document.getElementById(`copy-icon-${i}`).innerText = "✅";

                if(rememberCopiedIDs) {
                    if(!rememberedIDs.includes(sessionID)) {
                        rememberedIDs.push(sessionID);
                        GM_setValue("sffeRememberedIDs", rememberedIDs);
                    }
                }
            } catch (err) {
                alert("Sorry, failed to copy to clipboard. Your browser said:\n\n" + err);
                document.getElementById(`copy-icon-${i}`).innerText = "❌";
            }
        });
    }
}

function setupFavicon() {
    document.querySelector("head").insertAdjacentHTML("afterbegin", `
        <link rel="shortcut icon" href="data:image/x-icon;base64,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NP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjA0/zU5M/9twxD/hPwA/1iQHv8xLjX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzX/Xp8a/4X9AP9krRb/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEvNf9enhr/hf4A/2SsFv8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLjX/UHwj/4P4AP911wr/OkYw/zEvNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEuNf9Zkhz/hP0A/2e0E/8zMjT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzT/PUwv/3fcCf+D+AD/W5gc/zMzNP8xLzT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEwNf9foRn/hf4A/2KpF/8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjA0/1aLH/+C9gH/f/AD/1uXHP86RTD/MjE0/zEvNf8xLzX/MS81/zEvNf8xLzX/MS81/zEvNf8xLzX/MS81/zEvNf8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjA0/zU5M/9txA//hPwA/1aLH/8xLjX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjA0/zY6M/9hpRj/gvYB/4L4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Fv9krRb/ZK0W/2CjGP9TgiH/P1At/zIxNP8yMDT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/NDU0/2ayFf+E/AD/bcMQ/zhAMf8xLzT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEvNP89Sy//eeEI/4T7AP+D+gD/g/oA/4P6AP+E+wD/hP0A/4X9AP+F/QD/hf0A/4X+AP+D+gD/eeEH/1qTHf83PTL/MTA0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzT/QVUs/3vnBv9/8QP/Smwn/zEuNf8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP80NjP/T3kk/1yaHP9cmR3/XJkd/1yZHf9cmR3/XJkd/1yZHP9cmRz/XJkc/2KnF/9z0gz/gvcB/4L4Af9lrhb/Nz4y/zIwNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLjX/Un8i/4P5AP9xzg3/Nz4y/zIwNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MS81/zEvNf8xLzX/MS81/zEvNf8xLzX/MS81/zEvNf8xLzX/MS81/zIwNf85QjH/WI8e/37sBP+D+AH/W5Yc/zIyNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzX/Xp0a/4X9AP9krRb/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xMDT/MjE0/1eNHv+C9gH/euMH/0BTLf8xLzT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMDX/YqgY/4X+AP9enxv/MS81/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MTA0/zhAMf9xzg3/g/sA/1WIIP8xLjX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzX/X6AZ/4X+AP9jqhf/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEvNf9foRn/hf4A/2OrFv8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLjX/U4Qh/4P6AP9xzQ3/Nz4y/zIwNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zEuNf9akxz/hP0A/2e0E/8zMjT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zY1OP4yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8xLzX/Qlks/3zpBf+A8QL/S3Am/zEuNf8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP9jqxb/hf0A/2CkGP8yMDX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/NjU4/jc2OewyMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/NDYz/2azFP+E/AD/cc0O/zxJL/8xLjX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/MS41/z5OLv933Qj/gvcB/1B7I/8xLjX/MjE0/zIxNP8yMTT/MjE0/zIxNP8yMTT/NzY57Dg3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" />
    `);
}

function main() {
    GM_addStyle(`
        td:first-child {
            white-space: nowrap;
        }

        ${hideAddDate ? `
        td:nth-child(3) {
            display: none;
        }
        ` : ``}

        ${hideBumpDate ? `
        td:nth-child(4) {
            display: none;
        }
        ` : ``}
    `);

    if(setFavicon) {
        setupFavicon();
    }

    if(autoRefresh) {
        window.setTimeout(function() {
            location.reload();
        }, 300000);
    }

    setupOptionsBoxes();
    setupCopyableIDs();
}

let shorten = GM_getValue("sffeShortenIDs", true);
let setFavicon = GM_getValue("sffeFavicon", true);
let autoRefresh = GM_getValue("sffeAutoRefresh", true);
let rememberCopiedIDs = GM_getValue("sffeRememberCopiedIDs", true);
let rememberedIDs = GM_getValue("sffeRememberedIDs", []);
let hideAddDate = GM_getValue("sffeHideAddDate", true);
let hideBumpDate = GM_getValue("sffeHideBumpDate", false);
main();