// ==UserScript==
// @name         Lexa commerical spam remover
// @namespace    https://www.lexa.nl/
// @version      0.10
// @description  Lexa is a dating website with lots of extra payment options. This scripts gets rid of them, so you have a commercial harassment free browsing experience. Currently only works for the Dutch domain name.
// @author       Rick van der Staaij
// @require      http://code.jquery.com/jquery-latest.min.js
// @include      https://www.lexa.nl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/372851/Lexa%20commerical%20spam%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/372851/Lexa%20commerical%20spam%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSpamGridBoxes() {
        var cleanCounter = 0;
        $('.card-list__card').each(function() {
            // If there's no member card, I'm not interested
            if ($(this).find('.member-card').length == 0) {
                cleanCounter++;
                $(this).remove();
            }
        });
        if (cleanCounter > 0) {
            console.log('[LexaClear] Removed ' + cleanCounter + ' spam cards.');
        }
    }

    function removeClasses() {
        var cleanCounter = 0;
        var removeClassesArray = [
            'dating-header__wrapper--with-banner-small',
        ];

        removeClassesArray.forEach((spamClass) => {
            var spam = $(`.${spamClass}`);

            if (spam.length > 0) {
                cleanCounter++;
                spam.removeClass(spamClass);
            }
        });

        if (cleanCounter > 0) {
            console.log('[LexaClear] Removed ' + cleanCounter + ' spam classes.');
        }
    }

    function removeSpamElements() {
        var spamElementArray = [
            '.auto-promo-card',
            '.ar-reactivation-state',
            '.cross-sell-card',
            '.sticky-payment-button',
            '.nrc-promo-card',
            '.lara-promo-card',
            'dating-header-boost',
            'dating-header-incognito',
            'dating-header-super-message',
            'lara-bot',
            'header-cross-sell',
            'auto-promo-card',
            'promo-bubble',
            '.dating-header__shuffle-pulse',
            '.dating-header__shuffle-pulse--delayed',
            '.inbox-promo',
            'chat-box',
            '.with-super-message-cta button',
            'button[data-test="contact-filter-icon-zen"]'
        ];

        var spamElements = $(spamElementArray.join(', '));
        if (spamElements.length > 0) {
            var cleanCounter = spamElements.length;
            spamElements.remove();
            console.log('[LexaClear] Removed ' + cleanCounter + ' spam elements.');
        }
    }

    function removeSpam() {
        removeSpamElements();
        removeSpamGridBoxes();
        removeClasses();
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        removeSpam();
    });

    observer.observe(document, {
        subtree: true,
        attributes: true,
    });

    $(window).load(function() {
        removeSpam();
    });

    console.log('[LexaClear] Script is running and removing commercial spam...');
})();