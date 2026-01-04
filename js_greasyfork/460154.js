// ==UserScript==
// @name         hide id search page - odnoklassniki
// @version      1.1
// @description  hide videos clicking on the views and puts them in localstorage
// @match        https://ok.ru/video/search
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1028437
// @downloadURL https://update.greasyfork.org/scripts/460154/hide%20id%20search%20page%20-%20odnoklassniki.user.js
// @updateURL https://update.greasyfork.org/scripts/460154/hide%20id%20search%20page%20-%20odnoklassniki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = '';
    css += ".video-card_play{display: none !important;}";
    css += "div#rightColumn{display: none !important;}";
    css += "aside.layout-aside.left-column-redesign.__new-design.__gray.__items-redesign.__round-avatar{display: none !important;}";
    css += ".video-header_top{display: none !important;}";
    css += "div#scrollToTop{display: none !important;}";
    css += ".ugrid_i.js-seen-item-movie{width: 25% !important;}";
    css += ".ugrid.__responsive.__xl-vert .ugrid_i{border-bottom-width: 10px !important;}";
    css += ".video-card.js-movie-card.__responsive .video-card_info:hover{background: #ec8108;color: #ec8108;border-radius: 6px;transition: all ease .2s !important;}";
    css += ".video-card.js-movie-card.__responsive .video-card_info:not(:hover) {transition: all ease .5s !important;}";
    css += ".layout-container__v3{padding-right: 0px; width: 96% !important;}";
    css += ".layout-wrapper .layout-container__v3 .layout-main{width: 100% !important;}";
    css += "a.video-card_lk {border: 3px dashed #fff; border-radius: 8px !important;}";
    css += "a.video-card_lk:visited {border: 3px dashed #ee8208; border-radius: 8px !important;}";
    css += ".video-card_img, .video-card_lk {border-radius: 6px; !important;}";
    css += ".btn1{all: unset; position: absolute; height: 100%; width: 20px; cursor: pointer;}";

    if (css.length > 0) {
        GM_addStyle(css);
    }


    const expireAfter = 12 * 60 * 60 * 1000; // 12 hours
    function hideVideoCard() {
        let videoId = this.closest(".video-card.js-movie-card.__responsive").getAttribute("data-id");
        let hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos")) || {};
        hiddenVideos[videoId] = Date.now();
        localStorage.setItem("hiddenVideos", JSON.stringify(hiddenVideos));
        let parent = this.closest(".ugrid_i.js-seen-item-movie");
        parent.style.display = "none";
        checkExpired();
    }

    function checkExpired() {
        let hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos")) || {};
        let expiredIds = [];
        for (let id in hiddenVideos) {
            if (Date.now() - hiddenVideos[id] > expireAfter) {
                expiredIds.push(id);
            }
        }
        for (let id of expiredIds) {
            delete hiddenVideos[id];
        }
        localStorage.setItem("hiddenVideos", JSON.stringify(hiddenVideos));
    }


    var buttonHTML = '<button class="btn1"></button>';
    var mainContainer = document.getElementById("mainContainer");
    mainContainer.insertAdjacentHTML('afterbegin', buttonHTML);
    var button = document.querySelector(".btn1");
    button.addEventListener("mousedown", function(event) {
      if (event.button === 0) {
       window.scrollTo(0, 0);
     } else if (event.button === 2) {
       window.scrollTo(0, document.body.scrollHeight);
     }
   });
   button.addEventListener("contextmenu", function(event) {
    event.preventDefault();
   });


    function setPointerCursor() {
        this.style.cursor = "none";
    }

    window.addEventListener("load", function() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    checkExpired();
                    let hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos")) || {};
                    let videoCards = document.querySelectorAll(".ugrid_cnt .video-card.js-movie-card.__responsive");
                    videoCards.forEach(function(videoCard) {
                        let videoId = videoCard.getAttribute("data-id");
                        let views = videoCard.querySelector(".video-card_info");
                        if (hiddenVideos[videoId]) {
                            videoCard.closest(".ugrid_i.js-seen-item-movie").style.display = "none";
                        }
                        else {
                            videoCard.querySelector(".video-card_info").addEventListener("click", hideVideoCard);
                            views.addEventListener("mouseover", setPointerCursor);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
