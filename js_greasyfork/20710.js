// ==UserScript==
// @name         Calm Down YouTube
// @version      1.3
// @description  Converts titles on YouTube to be less obnoxious.
// @author       Ryan Poole
// @match        *://www.youtube.com/*
// @run-at        document-start
// @namespace https://greasyfork.org/users/48078
// @downloadURL https://update.greasyfork.org/scripts/20710/Calm%20Down%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/20710/Calm%20Down%20YouTube.meta.js
// ==/UserScript==

var channels = ['Hat Films', 'YOGSCAST Lewis & Simon'];

var acronyms = ['GTA', 'TTT'];

function transformTitle (title) {
    var splitTitle = /(.*?)(\((.*)\))?$/.exec(title.trim());
    var gameName = splitTitle[3];
    var videoName = splitTitle[1];
    var newName = ((gameName ? gameName.trim() + " - "  : "") + videoName.trim()).toLowerCase();
    acronyms.forEach(function(a) {
        newName = newName.replace(a.toLowerCase(), a.toUpperCase());
    });
    return newName;
}

var observer = new MutationObserver(parsePage);

function onPageLoad () {
    setupObservers();
    parsePage();
}

function setupObservers () {
    observer.disconnect();
    var elsToObserve = ['.section-list', '.branded-page-v2-body', '.channels-browse-content-grid', '#pl-load-more-destination', '#watch-more-related'];
    var el;
    elsToObserve.forEach(function(elName) {
        if ((el = document.querySelector(elName)) !== null) {
            observer.observe(el, {childList:true});
        }
    });
}

function parsePage () {
    var titleEls = [];

    var pageChannelNameEl = document.querySelector('.branded-page-header-title-link');

    function parseDOMList (opts) {
        var listSelector = opts.list || null;
        var nameSelector = opts.name || null;
        var titleSelector = opts.title || null;
        var videos = document.querySelectorAll(listSelector);
        for (var i = 0; i < videos.length; i++) {
            var currentVideoEl = videos[i];
            var currentNameEl = currentVideoEl.querySelector(nameSelector);
            var channelName = (currentNameEl !== null ? currentNameEl.textContent : null) || (pageChannelNameEl !== null ? pageChannelNameEl.text : null) || null;
            if (channelName === null) {
                continue;
            }
            if (channels.includes(channelName)) {
                titleEls.push(currentVideoEl.querySelector(titleSelector));
            }
        }
    }

    parseDOMList({
        list:'.yt-lockup-content',
        name:'.yt-lockup-byline>a',
        title:'.yt-lockup-title>a'
    });

    parseDOMList({
        list:'.lohp-media-object-content',
        name:'.content-uploader>a',
        title:'.lohp-video-link'
    });

    parseDOMList({
        list:'.pl-video',
        name:'.pl-video-owner>a',
        title:'.pl-video-title>a'
    });

    parseDOMList({
        list:'.video-list-item',
        name:'.g-hovercard',
        title:'.title'
    });

    parseDOMList({
        list:'.playlist-video',
        name:'.video-uploader-byline>span',
        title:'h4'
    });

    parseDOMList({
        list:'.video-detail',
        title:'h3>a'
    });

    parseDOMList({
        list:'.lohp-large-shelf-container',
        name:'.content-uploader>a',
        title:'.lohp-video-link'
    });

    for (i = 0; i < titleEls.length; i++) {
        var titleEl = titleEls[i];
        if (titleEl.getAttribute("data-parsed" === "true")) {
            continue;
        }
        titleEl.style.textTransform = 'capitalize';
        titleEl.setAttribute("data-parsed", true);
        titleEl.textContent = transformTitle(titleEl.textContent);
    }
}

(function() {
    'use strict';
    document.addEventListener('spfdone', onPageLoad);
    window.addEventListener('DOMContentLoaded', onPageLoad);
})();