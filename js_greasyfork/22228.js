// ==UserScript==
// @name         sports.ru-blocker
// @namespace    sports.ru
// @version      0.36
// @description  block the shit out from sports.ru
// @author       artemutin
// @match        http*://*.sports.ru/*
// @downloadURL https://update.greasyfork.org/scripts/22228/sportsru-blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/22228/sportsru-blocker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    console.log('sports.ru-blocker');
    setInterval(function(){
        console.log('flush!?');
        var ads = [].concat(
            ...document.querySelectorAll('a[href="//goo.gl/MPYuOK"]')
            ).concat(
            ...document.querySelectorAll('a[href*="utm_source"]')
        ).concat(
             ...document.querySelectorAll('a[href*="abs-cdn.org"]')
        ).concat(
             ...document.querySelectorAll('a[href*="partners"]')
        ).concat(
            [document.querySelector('#insticatorIframe')]
        ).concat(
             ...document.querySelectorAll('iframe:not([src*="youtube"]):not(.instagram-media):not(#undefined):not([src*=sports]):not([src*=streamable]):not([src*=gfycat]):not([src*=vine])')
        ).concat(
             ...document.querySelectorAll('div.b-plista')
        ).concat(
             ...document.querySelectorAll('div.plista_widget_belowArticle')
        ).concat(
             ...document.querySelectorAll('div#vn-player iframe')
        );
        var removalList = [].concat(
             'div#vn-player iframe'
        );
        console.log(ads);
        ads.forEach(function(ad){if (ad && ad.style) ad.style.display='none';});
        removalList.forEach(function(sel) {$(sel).remove();});
    }, 2500);
})();