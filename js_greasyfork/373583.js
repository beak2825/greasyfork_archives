// ==UserScript==
// @name         DuckDuckGo layout cleaner
// @namespace    duckduckgo_layout_cleaner
// @description  Remove useless clutter from duckduckgo.com
// @match        *://duckduckgo.com/*
// @match        *://duckduckgo.com/*
// @run-at       document-end
// @encoding     utf-8
// @license      MIT
// @version      2025.05.30
// @downloadURL https://update.greasyfork.org/scripts/373583/DuckDuckGo%20layout%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/373583/DuckDuckGo%20layout%20cleaner.meta.js
// ==/UserScript==

function removeByClass(clsname) {
    var a1 = document.getElementsByClassName(clsname);
    for(var i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);
}

(function() {
    setTimeout(function() {
        removeByClass('js-tagline');
        removeByClass("header--aside__item");
        removeByClass("header--aside__item social");
        removeByClass("feedback-prompt");
        removeByClass("js-feedback-btn-wrap");
        removeByClass("footer");
        removeByClass("badge-link");
        removeByClass("js-onboarding-ed");
        removeByClass("content-info__items");
        removeByClass("content-info__title");
        removeByClass("E4_TKgKL7YzziY_dW6E9"); // remove "Can’t find what you’re looking for?"
        removeByClass("text_promo--text");
        removeByClass("related-searches");
    }, 1000);
})();

// aiChatPromptSuggestions: {"hideSuggestions":true}
localStorage.setItem('aiChatPromptSuggestions', '{"hideSuggestions":true}')

// aichatPromoDismissal: {"promosDismissed":"2025-04-06"}
var date = new Date()
var dt = `${date.getYear()+1900}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDay().toString().padStart(2, "0")}`
localStorage.setItem('aichatPromoDismissal', '{"promosDismissed":"'+dt+'"}')


// localstorege duckduckgo_settings tests:
// chat on:  {}
// chat off: {"kbg":"-1"}
// ai assist often: {"kbe":"3"}
// ai assist never: {"kbe":"0"}

var ddg_settings = JSON.parse(localStorage.getItem('duckduckgo_settings')) || {};

ddg_settings['kbg'] = '-1'; // ai chat off
ddg_settings['kbe'] = '0'; // ai assist never

// turn off futher annoyances
ddg_settings['kpsb'] = '-1'; // dismiss "always private" self advertising
ddg_settings["kau"] = "-1"; // OFF: "It's okay to (very infrequently) ask me about my experience using DuckDuckGo"
ddg_settings["kao"] = "-1"; // OFF: "Shows the privacy benefits of using DuckDuckGo on the homepage"
ddg_settings["kap"] = "-1"; // OFF: "Shows occasional reminders to sign up for the DuckDuckGo privacy newsletters"
ddg_settings["kaq"] = "-1"; // OFF: "Shows sign-up form for the DuckDuckGo privacy newsletters"
ddg_settings["kax"] = "-1"; // OFF: "Shows occasional reminders to add DuckDuckGo to your browser"
ddg_settings["kak"] = "-1"; // OFF: "Shows links to instructions for how to add DuckDuckGo to your browser"

localStorage.setItem('duckduckgo_settings', JSON.stringify(ddg_settings));

