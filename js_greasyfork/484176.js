// ==UserScript==
// @name         Youtube Stream Spamer
// @version      2024-01-01
// @author       The Legion
// @description  Youtube stream chat spam tool
// @include      *//www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    Youtube_Stream_Spamer
// @downloadURL https://update.greasyfork.org/scripts/484176/Youtube%20Stream%20Spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/484176/Youtube%20Stream%20Spamer.meta.js
// ==/UserScript==

var spamBox;
var spamInput;
var spamDelay;
var spamSwitch;
var disableWatchStatsSwitch;

var spamTimer;

var chatBox;
var chatDocument;
var chatInput;
var sendButton;

var enabled = false;

var delay = 20;
var randomDelay = 5;

var tagsBuilt = false;
var tagsVisible = false;

(function() {
    'use strict';

    buildTags();
    setInterval(refresh, 2 * 1000);
})();

function refresh() {
    var previousChatBox = document.getElementById("chat-container");

    if (previousChatBox && chatBox !== previousChatBox && tagsBuilt) previousChatBox.appendChild(spamBox);

    chatBox = previousChatBox;
    chatDocument = chatBox?.childNodes[2]?.childNodes[2]?.contentWindow.document;

    refreshTags();
}

function buildTags() {
    if (tagsBuilt) return;
    tagsBuilt = true;

    spamBox = document.createElement("div");
    spamBox.style.margin = "10px";
    spamBox.style.display = "none";

    spamInput = document.createElement("input");
    spamInput.placeholder = "Наспамьте в чат";
    spamInput.style = "margin-right: 4px";

    spamDelay = document.createElement("input");
    spamDelay.placeholder = "Задержка (20 сек)";
    spamDelay.style = "margin-right: 4px";

    spamSwitch = document.createElement("input");
    spamSwitch.value = "Вкл";
    spamSwitch.type = "button";
    spamSwitch.onclick = onSpamSwitchClick;

    disableWatchStatsSwitch = document.createElement("input");
    disableWatchStatsSwitch.style = "margin: 4px";
    disableWatchStatsSwitch.type = "checkbox";
    disableWatchStatsSwitch.checked = GM_getValue("disableWatchStatsSwitch_checked");
    disableWatchStatsSwitch.onchange = onDisableWatchStatsSwitch;

    var disableWatchStatsSwitchHeader = document.createElement("span");
    disableWatchStatsSwitchHeader.style = "margin: 4px; color: red;";
    disableWatchStatsSwitchHeader.textContent = "Скрыть просмотр";

    spamBox.appendChild(spamInput);
    spamBox.appendChild(spamDelay);
    spamBox.appendChild(spamSwitch);
    spamBox.appendChild(disableWatchStatsSwitch);
    spamBox.appendChild(disableWatchStatsSwitchHeader);
}

function refreshTags() {
    if (!tagsBuilt) return;

    var hasChatBox = chatBox && chatDocument;

    if (tagsVisible && !hasChatBox) hideTags();
    else if (!tagsVisible && hasChatBox) showTags();
}

function hideTags() {
    spamBox.style.display = "none";
    tagsVisible = false;
}

function showTags() {
    spamBox.style.display = "";
    tagsVisible = true;
}

function refreshChatTags() {
    if (!chatDocument) return;
    try {
        chatInput = chatDocument.getElementsByClassName("yt-live-chat-text-input-field-renderer")[1];
        sendButton = chatDocument.getElementById("send-button").getElementsByClassName("yt-spec-button-shape-next")[0];
    }
    catch {}
}

function onSpamSwitchClick(e) {
    enabled = !enabled;
    spamSwitch.value = enabled ? "Выкл" : "Вкл";

    if (enabled) {
        spamDelay.disabled = "disabled";

        delay = parseInt(spamDelay.value);
        if (!delay || delay <= 0) delay = 20;

        spamTimer = setInterval(onSpamTimer, (delay + randomDelay / 2) * 1000);
    }
    else {
        spamDelay.disabled = undefined;

        if (spamTimer) clearInterval(spamTimer);
    }
}

function onDisableWatchStatsSwitch(e) {
    GM_setValue("disableWatchStatsSwitch_checked", disableWatchStatsSwitch.checked);
}

function onSpamTimer() {
    setTimeout(
        () => {
            if (enabled) sendMessage();
        },
        Math.random() * 1000 * randomDelay / 2
    );
}

function sendMessage() {
    refreshChatTags();
    if (!chatInput || !sendButton) return;
    chatInput.focus();
    chatInput.textContent = spamInput.value;
    chatInput.dispatchEvent(new Event('input', {bubles:true, cancelable:true}));
    setTimeout(() => sendButton.click(), 100);
}

// Online counter blocker
(function(open) {
    window.XMLHttpRequest.prototype.open = function() {
        const isStatEnpoint = /\.youtube.com\/api\/stats\/watchtime.*/.test(arguments[1])
        if(isStatEnpoint && disableWatchStatsSwitch?.checked) return;
        open.apply(this, arguments)
    };
})(XMLHttpRequest.prototype.open);