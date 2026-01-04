// ==UserScript==
// @name         Duolingo Auto IME On-Off
// @namespace    mog86uk-duo-autoime
// @version      1.04
// @description  Forces IME to switch between English and Japanese automatically for each typing question.
// @author       mog86uk (aka. testmoogle)
// @match        https://www.duolingo.com
// @match        https://www.duolingo.com/practice
// @match        https://www.duolingo.com/skill/ja/*
// @match        https://www.duolingo.com/skill/en/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/35117/Duolingo%20Auto%20IME%20On-Off.user.js
// @updateURL https://update.greasyfork.org/scripts/35117/Duolingo%20Auto%20IME%20On-Off.meta.js
// ==/UserScript==


jQuery.noConflict();
jQuery(document).ready(function($) {
    'use strict';
    if (duo.uiLanguage !== 'en' && duo.uiLanguage !== 'ja') {
        return;
    }

    var typeLang = "";
    var typeLangPrevious = "";
    var alertShown = 0;

    function Start(mutationRecords) {
        if (/^https:\/\/www\.duolingo\.com\/(practice|skill\/(en|ja)\/.+\/.+)/.test(window.location.href)) {
            if (!alertShown) {
                if (typeof $('html').css('ime-mode') === 'undefined' && typeof $('html').prop('inputMode') === 'undefined') {
                    alert("+++ Auto IME On-Off userscript +++\nIf you're using Chrome or Opera, you'll need to enable the following browser flag in order for this userscript to work at all:\n\n#enable-experimental-web-platform-features\n\nFirefox should work fine as it is, but Chrome and Opera need to enable this flag to be able to make use of the 'inputmode' experimental html attribute.\n\n(If you need more help with enabling this browser flag, please visit the userscript's page over on greasyfork.) ^^");
                }
                alertShown = 1;
            }
            else {
                if ($('textarea[data-test="challenge-translate-input"]').length) {
                    typeLang = $('textarea[data-test="challenge-translate-input"]').attr('lang');
                    if (typeLang !== typeLangPrevious || (typeLang === 'en' && $('textarea[data-test="challenge-translate-input"]').css('ime-mode') === 'auto')) {
                        if (typeLang === 'en') {
                            $('textarea[data-test="challenge-translate-input"]').attr('inputmode', 'latin').css('ime-mode', 'disabled').blur().focus();
                        }
                        else if (typeLang === 'ja') {
                            $('textarea[data-test="challenge-translate-input"]').attr('inputmode', 'kana').css('ime-mode', 'active').blur().focus();
                        }
                        typeLangPrevious = typeLang;
                    }
                }
                else if ($('input[placeholder="英語で入力してください"]').length) {
                    if(typeLangPrevious !== 'en' || $('input[placeholder="英語で入力してください"]').css('ime-mode') === 'auto') {
                        $('input[placeholder="英語で入力してください"]').attr('inputmode', 'latin').css('ime-mode', 'disabled').blur().focus();
                        typeLangPrevious = 'en';
                    }
                }
            }
        }
    }

    if (window.top == window.self) {
        var observerOfStuff = new MutationObserver(Start);

        observerOfStuff.observe(document.body, {
            attributes: true,
            subtree: true
        });
    }
});