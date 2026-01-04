// ==UserScript==
// @name         Legacy Chat
// @namespace    http://tampermonkey.net/
// @version      0.0.13
// @include      *://*.twitch.tv/*
// @exclude      *://*.twitch.tv/*/chat
// @exclude      *://api.twitch.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant        none
// @description  Replaces new chat
// @downloadURL https://update.greasyfork.org/scripts/35307/Legacy%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/35307/Legacy%20Chat.meta.js
// ==/UserScript==

var channelURL = '';

function cleanName(str) {
    var strL = str.length;
    for (var i = 0; i < strL; i++) {
        if (!/^\w+$/.test(str[i])) {
            return str.slice(0, i);
        }
    }
    return str;
}

function replaceChat(url) {
    var chan = url.split("/");
    var chanName = cleanName(chan[3]);
    if (chanName == "videos")
        return;
    var embeddedChat = '<iframe class="legacy-chat" src="https://www.twitch.tv/'+chanName+'/chat" height="100%" style="width: var(--ffz-chat-width)"></iframe> ';
    $('[class="tw-full-height tw-block tw-flex-grow-0 tw-flex-shrink-0 tw-relative"]').html(embeddedChat);
}

var observer = new MutationObserver(function() {
    var url = window.location.href;
    if ((!$('[class="tw-full-height tw-block tw-flex-grow-0 tw-flex-shrink-0 tw-relative"] .legacy-chat').length) || (channelURL != url)) {
        channelURL = url;
        replaceChat(url);
    }
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(document.body, config);