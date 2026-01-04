// ==UserScript==
// @name        SoundCloud: Toggle Reposts
// @description Toggle the visibility of reposts on the stream and artists page.
// @version     2022.12.13
// @author      garylaski
// @namespace   https://github.com/garylaski/userscripts
// @match       https://soundcloud.com/*
// @licence     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/451339/SoundCloud%3A%20Toggle%20Reposts.user.js
// @updateURL https://update.greasyfork.org/scripts/451339/SoundCloud%3A%20Toggle%20Reposts.meta.js
// ==/UserScript==
let streamSelector = '';
let buttonSelector = '';
let toggleButtonHandle = null;

function waitTillExists(selector, callback) {
    new MutationObserver(function(mutations) {
        let element = document.querySelector(selector);
        if (element) {
            this.disconnect();
            callback(element);
        }
    }).observe(document, {subtree: true, childList: true});
}

function createButton(location) {
    if (document.getElementById("toggleButtonHandle")) {
        return;
    }
    location.innerHTML += `<div class ="g-flex-row-centered">
                             <div class="toggleFormControl">
                                <div class="toggleFormControl">
                                   <label id="toggleButtonHandle" class="toggle sc-toggle toggleFormControl__toggle sc-mx-1x sc-toggle-off">
                                   <span class="sc-toggle-handle"></span>
                                   <input id="toggleButton" class="sc-toggle-input sc-visuallyhidden" type="checkbox" checked="" aria-required="false">
                                   </label>
                                </div>
                                <div class="checkboxFormControl__validation g-input-validation g-input-validation-hidden"></div>
                             </div>
                             <span style="margin-left:10px"class="sc-ministats sc-ministats-small sc-ministats-reposts soundContext__repost"></span>
                          </div>`;
    document.getElementById("toggleButton").addEventListener("click", toggle);
    toggleButtonHandle = document.getElementById("toggleButtonHandle");
    if(GM_getValue("showReposts")) {
        toggleButtonHandle.classList.add("sc-toggle-on");
        toggleButtonHandle.classList.add("sc-toggle-active");
        toggleButtonHandle.classList.remove("sc-toggle-off");
    }
}

function updateReposts(stream) {
    for (const item of stream.querySelectorAll("li")) {
        if (item.querySelector(".soundContext__repost,.soundTitle__info")) {
            if (GM_getValue("showReposts")) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        }
    }
}

function monitorStream(stream) {
    new MutationObserver(function(mutations) {
        updateReposts(stream);
    }).observe(stream, {subtree: true, childList: true});
}

function toggle() {
    if(GM_getValue("showReposts")) {
        toggleButtonHandle.classList.remove("sc-toggle-on");
        toggleButtonHandle.classList.remove("sc-toggle-active");
        toggleButtonHandle.classList.add("sc-toggle-off");
        GM_setValue("showReposts",false);
    } else {
        toggleButtonHandle.classList.remove("sc-toggle-off");
        toggleButtonHandle.classList.add("sc-toggle-on");
        toggleButtonHandle.classList.add("sc-toggle-active");
        GM_setValue("showReposts",true);
    }
    updateReposts(document.querySelector(streamSelector));
}

let previousUrl = '';
const urlObserver = new MutationObserver(function(mutations) {
    if (location.href !== previousUrl) {
        previousUrl = location.href;
        if (location.href == "https://soundcloud.com/feed") {
            streamSelector = ".stream__list .lazyLoadingList ul";
            buttonSelector = ".stream__header";
        } else {
            streamSelector = ".userStream__list ul";
            buttonSelector = ".profileTabs";
        }
        waitTillExists(streamSelector, monitorStream);
        waitTillExists(buttonSelector, createButton);
    }
});

urlObserver.observe(document, {subtree: true, childList: true});
