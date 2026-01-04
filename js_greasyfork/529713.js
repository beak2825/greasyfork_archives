// ==UserScript==
// @name         Bili Clean
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  屏蔽相关推荐、热搜、和部分广告（配合广告屏蔽插件使用更佳）
// @author       lq
// @include	 https://search.bilibili.com/*
// @include	 https://space.bilibili.com/*
// @include	 https://www.bilibili.com/*
// @include	 https://live.bilibili.com/*
// @include	 https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529713/Bili%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/529713/Bili%20Clean.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(function(mutations,observer) {
        //index
        let search_input = document.querySelector(".nav-search-input");
        if (search_input) {
            search_input.placeholder = "";
            search_input.title = "";
        }

        let trending = document.querySelector(".trending");
        if (trending) {
            trending.remove();
        }

        let recommended_swipe = document.querySelector(".recommended-swipe.grid-anchor");
        if (recommended_swipe) {
            recommended_swipe.remove();
        }

        let btn_ad = document.querySelector(".btn-ad");
        if (btn_ad) {
            btn_ad.remove();
        }

        //video
        let next_btn = document.querySelector(".switch-btn.on")
        if(next_btn){
            next_btn.click();
        }

        let cards = document.querySelectorAll(".card-box");
        if(cards){
            cards.forEach((card)=>{card.remove()})
        }

        let rec_list = document.querySelector(".recommend-list-v1");
        if(rec_list){
            rec_list.style.display = "none";
        }

        let floor_ad = document.querySelector(".ad-report.ad-floor-exp.right-bottom-banner");
        if(floor_ad){
            floor_ad.style.display = "none";
        }

        let slide_ad = document.querySelector("#slide_ad");
        if(slide_ad){
            slide_ad.style.display = "none";
        }

        let card_ad = document.querySelector(".video-card-ad-small");
        if(card_ad){
            card_ad.style.display = "none";
        }

        let banner_ad = document.querySelector(".ad-report.ad-floor-exp.left-banner");
        if(banner_ad){
            banner_ad.style.display = "none";
        }

        let player_ending = document.querySelector(".bpx-player-ending-related");
        if(player_ending){
            player_ending.remove();
        }

        // dynamic
        let topic_panel = document.querySelector(".topic-panel");
        if(topic_panel){
            topic_panel.remove();
        }

        //live
        let live_search = document.querySelector(".nav-search-content");
        if (live_search) {
            live_search.placeholder = "";
            live_search.title = "";
        }

        if (window.location.origin === "https://live.bilibili.com" && window.location.pathname === "/") {
            window.location.href = "https://live.bilibili.com/all";
        }

        //observer.disconnect();
    }).observe(document.body, {childList: true, subtree: true});


})();