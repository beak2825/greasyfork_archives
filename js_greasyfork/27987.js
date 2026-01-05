// ==UserScript==
// @name        reddit context menu options
// @description Adds links for reddit-stream, snoopsnoo, and "copy link with context" to reddit
// @namespace   org.stevenhoward
// @include     https://www.reddit.com/*
// @version     1
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/27987/reddit%20context%20menu%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/27987/reddit%20context%20menu%20options.meta.js
// ==/UserScript==
// jshint esversion: 6

function createMenu (parent, actions) {
    function randomId() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '');
    }

    let id = randomId();

    let menu = document.createElement('menu');
    menu.id = id;
    menu.type = 'context';
    
    for (let action in actions) {
        let item = document.createElement('menuItem');
        item.label = action;
        item.onclick = actions[action];

        menu.appendChild(item);
    }

    parent.parentNode.appendChild(menu);
    parent.setAttribute('contextMenu', id);
}

function attachRedditStreamCommand(thing) {
    let streamLink = thing.href.replace(/reddit/, 'reddit-stream');
    createMenu(thing, {
        'open in reddit-stream': () => window.location = streamLink,
        'open in reddit-stream (new tab)': () => window.open(streamLink)
    });
}

function attachCopyContextCommand(thing) {
    let contextLink = thing.href + '?context=3';
    createMenu(thing, { 'Copy link with context': () => GM_setClipboard(contextLink) });
}

function attachSnoopSnooCommand(thing) {
    let user = thing.href.match('[^/]+$');
    if (user) {
        user = user[0];
        let snoopUrl = `http://snoopsnoo.com/u/${user}`;
        createMenu(thing, { 'SnoopSnoo': () => window.open(snoopUrl) });
    }
}

function findAndAttach(attachFn, selector, childSelector) {
    for (let node of document.querySelectorAll(selector)) {
        attachFn(node);
    }
}

findAndAttach(attachRedditStreamCommand, '.link a.title');
findAndAttach(attachCopyContextCommand, '.comment .bylink');
findAndAttach(attachSnoopSnooCommand, 'a.author, a[href^="/u/"]');