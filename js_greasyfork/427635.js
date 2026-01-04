// ==UserScript==
// @name         Mangadex - Infinite scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically load more items when you scroll to the end on mangadex
// @author       Yrtiop
// @match        https://mangadex.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427635/Mangadex%20-%20Infinite%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/427635/Mangadex%20-%20Infinite%20scroll.meta.js
// ==/UserScript==

(function() {
    var infiniteScroll = function() {
        var loadMoreButton = document.querySelector(".container > .row button.my-6");
        var top = window.pageYOffset + window.innerHeight;
        var bodyHeight = document.querySelector('body').offsetHeight;
        var footerHeight = document.querySelector('footer').offsetHeight;
        if(loadMoreButton && top > bodyHeight-footerHeight) {
            loadMoreButton.click();
        }
    }
    window.addEventListener("scroll", infiniteScroll);
})();