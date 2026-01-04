// ==UserScript==
// @name         Genshin Assistant
// @namespace    https://www.hoyolab.com/
// @version      1.3
// @description  Automates doing dailies on the forum
// @author       Vaccaria
// @match        https://www.hoyolab.com/genshin/*
// @match        https://webstatic-sea.mihoyo.com/ys/event/signin-sea/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_registerMenuCommand
// @grant    GM_openInTab
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422007/Genshin%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/422007/Genshin%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, false);
    var tracker = 0;

    GM_registerMenuCommand("Click Like", () => {
        tracker = 0;
        var refreshBtn = document.querySelectorAll (
            ".mhy-heart-click"
        );
        refreshBtn.forEach(function(userItem) {
            if(tracker >= 10){
                ()=>{};
            }
            else{
                userItem.dispatchEvent (clickEvent);
                tracker += 1;
            }
        });
        refreshBtn = document.querySelector (
            ".header__signin"
        );
        refreshBtn.dispatchEvent (clickEvent);
    });

    GM_registerMenuCommand("Open 5 Windows", () => {
        tracker = 0;
        var articleBtn = document.querySelectorAll (
            ".mhy-article-card__link"
        );
        articleBtn.forEach(function(userItem) {
            if(tracker >= 5){
                ()=>{};
            }
            else{
                GM_openInTab (userItem.href);
                tracker += 1;
            }
        });
    });

    GM_registerMenuCommand("Both of the above", () => {
        tracker = 0;
        var articleBtn = document.querySelectorAll (
            ".mhy-article-card__link"
        );
        articleBtn.forEach(function(userItem) {
            if(tracker >= 5){
                ()=>{};
            }
            else{
                GM_openInTab (userItem.href);
                tracker += 1;
            }
        });
        tracker = 0;
        var refreshBtn = document.querySelectorAll (
            ".mhy-heart-click"
        );
        refreshBtn.forEach(function(userItem) {
            if(tracker >= 10){
                ()=>{};
            }
            else{
                userItem.dispatchEvent (clickEvent);
                tracker += 1;
            }
        });
        refreshBtn = document.querySelector (
            ".header__signin"
        );
        refreshBtn.dispatchEvent (clickEvent);
    });

    var path = location.pathname;
    switch (true) {
        case path.includes('/article'):
            var checkExist = setInterval(function() {
                if ($('.mhy-article-actions').length) {
                    var favoriteBtn = document.querySelector (
                        "[*|href='#icon-shoucang']"
                    );
                    favoriteBtn.dispatchEvent (clickEvent);
                    setTimeout(function() {
                        favoriteBtn.dispatchEvent (clickEvent);
                    }, 1000);
                    clearInterval(checkExist);
                }
            }, 100);
            break;
        case path.includes('/signin-sea'):
            var checkExist2 = setInterval(function() {
                if ($('div[class^="components-home-assets-__sign-content_---item"]').length) {
                    var favoriteBtn2 = document.querySelectorAll (
                        'div[class^="components-home-assets-__sign-content_---item---"]'
                    );
                    favoriteBtn2.forEach(function(userItem) {
                        setTimeout(function() {
                            userItem.dispatchEvent (clickEvent);
                            console.log("click");
                        }, 3000);
                    });
                    clearInterval(checkExist2);
                }
            }, 100);
            break;
    }

})();