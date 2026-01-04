// ==UserScript==
// @name         Discord - Unlocked Nitro Emojis
// @description  Use Discord's custom emojis anywhere in the web-app, without Nitro.
// @author       4TSOS
// @license      GNU GPLv3
// @version      2.6.5
// @match        *://discord.com/channels/*
// @namespace    https://greasyfork.org/users/1159227
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/481093/Discord%20-%20Unlocked%20Nitro%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/481093/Discord%20-%20Unlocked%20Nitro%20Emojis.meta.js
// ==/UserScript==

var emojis = [];
var show_emojis = false
const stylesheet = document.createElement("style");
stylesheet.textContent = `
#emoji-menu {resize: both; display: block; position: absolute; z-index: 99999999; background-color: #00000094; overflow-y: scroll; max-height: 70%; max-width: 40%; min-height: 15%; min-width: 15%; transition: opacity 1s, visibility 1s;}
#emoji-menu::-webkit-scrollbar {width: 12px;}
#emoji-menu::-webkit-scrollbar-track {background: rgba(0, 0, 0, 0.4); border-radius: 3px;}
#emoji-menu::-webkit-scrollbar-thumb {background: rgba(0, 0, 0, 0.8); border-radius: 3px;}
#emoji-menu::-webkit-resizer {background: rgba(0, 0, 0, 0.4)}
#emoji-menu-toggle {background: transparent !important; color: currentColor; border: none; font-size: 0.8em; transition: font-size 1s;}
#emoji-menu-toggle:hover {font-size: 0.9em;}
#emoji-menu-search {border: none; width: 90%; margin-left: 4.1%; margin-top: 1vh; background-color: rgba(100, 100, 100, 0.2); color: white; padding: 4px; border-radius: 4px;}
#emoji-menu-search::placeholder {color: #ffffffcf;}
#emoji-label {color: white; text-align: center; top: 0; position: sticky; background: rgba(0, 0, 0, 0.5);}
.emoji-menu-item {height: 48px; width: 48px; padding: 3px; border-radius: 3px; border: solid 2px transparent; transition: border 0.7s ease-in-out, background-color 0.7s ease-in-out; margin-top: 1vh;}
.emoji-menu-item:hover {background-color: #00000069;; cursor: pointer; border: 2px solid white;}
`;
document.head.appendChild(stylesheet);

var emojiMenuHolder = null;
var emojiMenuSearch = null;
var emojiMenuToggle = null;
var emojiMenuLabel = null;

function updateEmojis() {
    var emoji_holder = document.getElementById("emoji-menu");
  let holderItems = document.querySelectorAll(".emoji-menu-item");
    for (const emoji of emojis) {
        if (!document.querySelector(`#emoji-menu img[src="${emoji.src}"]`)) {
            let newEmoji = document.createElement("img");
            let newEmojiName = emoji.parentElement.getAttribute("data-name");
            newEmoji.className = `emoji-menu-item ${newEmojiName}`;
            newEmoji.src = emoji.src
            newEmoji.addEventListener("click", function() {
                navigator.clipboard.writeText(emoji.src);
            });
            newEmoji.addEventListener("mouseover", function() {
                emojiMenuLabel.textContent = `:${newEmojiName}:`;
            });
            emoji_holder.appendChild(newEmoji);
        };
    };
};

function toggleEmojis() {
    emojiMenuSearch.value = "";
    emojiMenuLabel.textContent = "None selected...";
    if (show_emojis) {
        emojiMenuHolder.style.opacity = "0";
        emojiMenuHolder.style.visibility = "hidden";
        show_emojis = false;
        emojiMenuToggle.textContent = "Show";
        return;
    }
    else {
        emojiMenuHolder.style.opacity = "1";
        emojiMenuHolder.style.visibility = "visible";
        updateEmojis();
        show_emojis = true;
        emojiMenuToggle.textContent = "Hide";
    };
    for (const item of holderItems) {
        item.style = "";
    };
};

function createToggle() {
    let emoji_toggle = document.createElement("button");
    emoji_toggle.textContent = "Show";
    emoji_toggle.onclick = toggleEmojis;
    emoji_toggle.id = "emoji-menu-toggle";
    document.querySelector("[class^=toolbar]").appendChild(emoji_toggle);
};

function createEmojis() {
    let emojiHolder = document.createElement("div");
    emojiHolder.id = "emoji-menu";
    let emojiHolderSearch = document.createElement("input");
    emojiHolderSearch.id = "emoji-menu-search";
    emojiHolderSearch.placeholder = "Search for emojis...";
    emojiHolderSearch.addEventListener("keyup", function(event) {
        let holderItems = document.querySelectorAll(".emoji-menu-item");
        for (const item of holderItems) {
            if (item.className.toLowerCase().includes(emojiMenuSearch.value.toLowerCase()) || emojiMenuSearch.value === "") {
                item.style = "";
            }
            else {
                item.style = "display: none";
            };
        };
    });
    let emojiLabel = document.createElement("p");
    emojiLabel.textContent = "None selected...";
    emojiLabel.id = "emoji-label";
    emojiHolder.append(emojiHolderSearch);
    emojiHolder.append(emojiLabel);
    document.body.appendChild(emojiHolder);
};

document.body.addEventListener("click", function(event) {
    if (event.target !== document.getElementById("emoji-menu") && event.target !== emojiMenuToggle && event.target !== emojiMenuSearch) {
        if (show_emojis) {
            toggleEmojis();
        };
    };
});

document.body.addEventListener("keydown", function(event) {
    if (show_emojis) {
        emojiMenuSearch.focus();
    };
    if (event.keyCode === 9) {
        event.preventDefault();
        toggleEmojis();
    };
});

const Observer = new MutationObserver(function(mutations) {
    if (mutations.length > 0) {
        if (typeof mutations[0].target === "object") {
            if (mutations[0].target.hasAttribute("src")) {
                if (mutations[0].target.src.includes("emojis")) {
                    var element = mutations[0].target;
                    emojis.push(element);
                };
            };
        }
    };
    if (!document.getElementById("emoji-menu-toggle")) {
        createToggle();
        emojiMenuToggle = document.getElementById("emoji-menu-toggle");
    };
});

Observer.observe(document.body, {childList: true, subtree: true, attributes: true});

createEmojis();

emojiMenuHolder = document.getElementById("emoji-menu");
emojiMenuSearch = document.getElementById("emoji-menu-search");
emojiMenuLabel = document.getElementById("emoji-label");

emojiMenuHolder.style = "visibility: hidden;"