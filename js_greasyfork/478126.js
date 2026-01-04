// ==UserScript==
// @name         Simplyfiy series sections on MAL 1.2
// @namespace    Simplyfiy your MAL-"ing"
// @version      1.2
// @description  It removes a lot of unnecessary text and empty spaces, creating a more minimalist site.
// @author       rurzowiutki
// @match        https://myanimelist.net/profile/*
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/anime/*/*
// @match        https://myanimelist.net/animelist/*
// @icon         https://www.svgrepo.com/show/331489/myanimelist.svg
// @downloadURL https://update.greasyfork.org/scripts/478126/Simplyfiy%20series%20sections%20on%20MAL%2012.user.js
// @updateURL https://update.greasyfork.org/scripts/478126/Simplyfiy%20series%20sections%20on%20MAL%2012.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var unwantedElements = [
        '.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r',
        '.js-sns-icon-container',
        '.sUaidzctQfngSNMH-pdatla',
        '.anime-slide-block',
        'span.notice_open_public.pt4',
        'span.notice_open_public.pb4',
        '.mt4.ar',
        '.border_top',
        '.btn-detail-recommendations-view-all.fl-r',
        '.picSurround.fl-l.mr8.ml3.mt4',
        '.spaceit',
        '.lightLink',
        '.qc-cmp2-persistent-link',
        '.widget-content',
        '.external_links',
        '.pb16.broadcasts',
        '.floatRightHeader',
        '.detail-stack-block',
        '.page-forum',
        '.theme-songs.js-theme-songs.opnening',
        '.theme-songs.js-theme-songs.ending',
        '.detail-page-featured-article',
        '.header-right',
        '#footer-block',
        '.user-profile-sns',
        'span.PubAdAI',
        '.anime-info-review__header'
    ];

    unwantedElements.forEach(function(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.remove();
        });
    });

    function removeElementsByStructure(structurePattern) {
        var elements = document.querySelectorAll(structurePattern);
        elements.forEach(function(element) {
            element.remove();
        });
    }

    removeElementsByStructure('.clearfix > div > p');
    removeElementsByStructure('.clearfix > div > a');
    removeElementsByStructure('.clearfix > div > img');
    removeElementsByStructure('iframe');
    removeElementsByStructure('.clearfix > .spaceit');

    var navElement = document.querySelector('#horiznav_nav');
    if (navElement) {
        var liElements = navElement.querySelectorAll('li');
        liElements.forEach(function(liElement) {
            var textContent = liElement.textContent.trim().toLowerCase();
            if (textContent === 'videos' || textContent === 'forum' || textContent === 'clubs' || textContent === 'pictures' || textContent === 'more info') {
                liElement.remove();
            }
        });
    }

    var titleElements = document.querySelectorAll('.title-name.h1_bold_none strong');
    titleElements.forEach(function(titleElement) {
        titleElement.style.fontSize = '22px';
    });

    var divs = document.querySelectorAll('div[style*="padding"]');
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        if (div.style.padding) {
            div.remove();
        }
    }

    var h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(function(h2Element) {
        if (containsText(h2Element, 'available at') || containsText(h2Element, 'recent news') || containsText(h2Element, 'interest stacks') || containsText(h2Element, 'background') || containsText(h2Element, 'opening theme') || containsText(h2Element, 'ending theme') || containsText(h2Element, 'recent featured articles') || containsText(h2Element, 'resources') || containsText(h2Element, 'recent forum discussion') || containsText(h2Element, 'reviews') || containsText(h2Element, 'streaming platforms') || containsText(h2Element, 'recommendations') || containsText(h2Element, 'episode videos')) {
            var newText = h2Element.textContent
                .replace('Available At', '')
                .replace('Resources', '')
                .replace('Recent News', '')
                .replace('Opening Theme', '')
                .replace('Reviews', '')
                .replace('Interest Stacks', '')
                .replace('Ending Theme', '')
                .replace('Episode Videos', '')
                .replace('Recommendations', '')
                .replace('Recent Featured Articles', '')
                .replace('Recent Forum Discussion', '')
                .replace('Background', '')
                .replace('Streaming Platforms', '');

            h2Element.textContent = newText;
        }
    });

    function containsText(element, text) {
        return element.textContent.trim().toLowerCase().includes(text.toLowerCase());
    }
})();
