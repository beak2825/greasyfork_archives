// ==UserScript==
// @name         Ignore Steam ID
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides comments from the chosen steam user IDs in the discussion section of steam, click on the user name then "Ignore this user"
// @author       synogen
// @match        https://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370147/Ignore%20Steam%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/370147/Ignore%20Steam%20ID.meta.js
// ==/UserScript==

// Planned Features / ToDo
// - hide even quoted content from blocked users (may need username in addition to ID for proper detection)
// - hide even forum threads
// - option to unignore/edit ignore list somewhere
// - configuration page with settings on what to hide (ignore list config should be here as well)
// - instead of removing the comment hide it and give the user an option to view it if he really wants to, should be configurable

var blockedIds = window.localStorage.getItem('ignoredSteamIds') != null ? JSON.parse(window.localStorage.getItem('ignoredSteamIds')) : [];

document.ignoreSteamId = function(id) {
    var idParts = id.split('/');
    var steamId = idParts[idParts.length-1];
    console.log(steamId + ' added to ignore list!');
    blockedIds.push(steamId);
    window.localStorage.setItem('ignoredSteamIds', JSON.stringify(blockedIds));
    refreshIgnores();
};

function addIgnoreMenuOption() {
    var comments = document.getElementsByClassName('commentthread_comment');
    for (var i = 0; i < comments.length; i++) {
        var authorlink = comments[i].getElementsByClassName('commentthread_author_link')[0];

        // add ignore item to popup menu
        var popup = comments[i].getElementsByClassName('forum_author_menu')[0].getElementsByClassName('popup_menu')[0];
        if (!popup.textContent.includes('Ignore this user')) {
            var ignorelink = document.createElement('a');
            ignorelink.setAttribute('class', 'popup_menu_item tight');
            ignorelink.setAttribute('onclick', 'ignoreSteamId(\'' + authorlink.getAttribute('href') + '\')');
            ignorelink.appendChild(document.createTextNode('Ignore this user'));
            popup.appendChild(ignorelink);
        }
    }
}

function refreshIgnores() {

    var comments = document.getElementsByClassName('commentthread_comment');
    for (var i = 0; i < comments.length; i++) {
        var authorlink = comments[i].getElementsByClassName('commentthread_author_link')[0];

        // remove comments from IDs on the blocklist
        for (var j = 0; j < blockedIds.length; j++) {
            if (authorlink.getAttribute('href').endsWith(blockedIds[j])) {
                comments[i].parentElement.removeChild(comments[i]);
                i--;
            }
        }
    }
}

// initial run
addIgnoreMenuOption();
refreshIgnores();

// callback when the comments change
var onChildChange = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            addIgnoreMenuOption();
            refreshIgnores();
        }
    }
};

// Observe comments for child changes to refresh ignores and menu items
var comments = document.getElementsByClassName('commentthread_comments')[0];
var observer = new MutationObserver(onChildChange);
observer.observe(comments, { attributes: false, childList: true, subtree: false });


