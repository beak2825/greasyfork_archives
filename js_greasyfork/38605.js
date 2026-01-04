// ==UserScript==
// @name         Facebook shitpost remover
// @version      1.0.1
// @description  Block all shared posts by people who only post shared content.
// @author       G-Rex
// @match        https://www.facebook.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
//
// @namespace https://greasyfork.org/users/154522
// @downloadURL https://update.greasyfork.org/scripts/38605/Facebook%20shitpost%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/38605/Facebook%20shitpost%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Selectors
    var streamSelector = 'div[id^="topnews_main_stream"]';
    var storySelectors = [
        'div[id^="hyperfeed_story_id"]',
        'div[data-ownerid^="hyperfeed_story_id"]'
    ];

    var language = document.documentElement.lang;
    var nodeContentKey = (('innerText' in document.documentElement) ? 'innerText' : 'textContent');
    var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var body;
    var stream;
    var observer;
    var localStorage = window.localStorage;
    var BLOCKED_IDS_STRING = 'blockedIds';
    var blockedIds = JSON.parse(GM_getValue(BLOCKED_IDS_STRING, "null"));//JSON.parse(localStorage.getItem(BLOCKED_IDS_STRING));

    if(!blockedIds) {
        blockedIds = [];
        //localStorage.setItem(BLOCKED_IDS_STRING, JSON.stringify(blockedIds));
        GM_setValue(BLOCKED_IDS_STRING, JSON.stringify(blockedIds));
    }

    function remove(story) {
        if(!story) {
            return;
        }

        story.remove();
    }

    function isBlocked(id) {
        if(!id || id == -1) {
            return false;
        }

        for(let i = 0; i < blockedIds.length; i++) {
            if(blockedIds[i] === id) {
                return true;
            }
        }

        return false;
    }

    function block(id) {
        if(isBlocked(id)) {
            return;
        }

        blockedIds.push(id);

        GM_setValue(BLOCKED_IDS_STRING, JSON.stringify(blockedIds));

        process();
    }

    function addBlockButton(story) {
        if(!story) {
            return;
        }

        let content = story.querySelector('div.mtm');

        let button = content.querySelector('button.shitpost-hider');

        if(button) {
            return;
        }

        button = document.createElement('button');
        let id = getPosterId(story);
        button.onclick = function() {block(id);};
        button.innerHTML = 'Hide';
        button.className = 'shitpost-hider';

        content.appendChild(button);
    }

    function isShared(story) {
        if(!story) {
            return false;
        }

        //get title element
        let title = story.querySelector('span.fwn.fcg span.fcg');

        if(!title) {
            return false;
        }

        //get poster element
        let poster = title.querySelector('a.profileLink');

        if(!poster) {
            return false;
        }

        //get poster id
        let hovercard = poster.getAttribute('data-hovercard');
        let idMatch = hovercard.match(/id=([0-9]+)/);
        let id = -1;

        if(idMatch) {
            id = idMatch[1];
        }

        //get text for title
        let titleText = title.innerText;

        //find shared in title
        if(titleText.indexOf("shared") >= 0 && titleText.indexOf("memory.") < 0) {
            return true;
        }

        return false;
    }

    function getPosterId(story) {
        if(!story) {
            return -1;
        }

        //get title element
        let title = story.querySelector('span.fwn.fcg span.fcg');

        if(!title) {
            return -1;
        }

        //get poster element
        let poster = title.querySelector('a.profileLink');

        if(!poster) {
            return -1;
        }

        //get poster id
        let hovercard = poster.getAttribute('data-hovercard');
        let idMatch = hovercard.match(/id=([0-9]+)/);
        let id = -1;

        if(idMatch) {
            id = idMatch[1];
        }

        return id;
    }

    function process() {
        // Locate the stream every iteration to allow for FB SPA navigation which
        // replaces the stream element
        stream = document.querySelector(streamSelector);
        if(!stream) {
            return;
        }

        var i;
        var j;
        var stories;
        for(i = 0; i < storySelectors.length; i++) {
            stories = stream.querySelectorAll(storySelectors[i]);
            if(!stories.length) {
                return;
            }

            for(j = 0; j < stories.length; j++) {
                if(isShared(stories[j])) {
                    let id = getPosterId(stories[j]);
                    if(isBlocked(id)) {
                        remove(stories[j]);
                    } else {
                        addBlockButton(stories[j]);
                    }
                }
            }
        }
    }

    if(mutationObserver) {
        body = document.querySelector('body');
        if(!body) {
            return;
        }

        observer = new mutationObserver(process);
        observer.observe(body, {
            'childList': true,
            'subtree': true
        });
    }
})();