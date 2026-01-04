// ==UserScript==
// @name        Skip Amazon Prime Video Ads
// @description This script skips primevideo ADS
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @match https://primevideo.com/region/*/detail/*
// @match https://*.primevideo.com/region/*/detail/*
// @match https://primevideo.com/detail/* 
// @match https://*.primevideo.com/detail/*
// @match https://amazon.com/Episode-*/dp/*
// @match https://*.amazon.com/Episode-*/dp/*
// @match https://amazon.co.jp/Episode-*/dp/*
// @match https://*.amazon.co.jp/Episode-*/dp/*
// @match https://amazon.com/gp/video/detail/*  
// @match https://*.amazon.com/gp/video/detail/*
// @match https://amazon.co.jp/gp/video/detail/*  
// @match https://*.amazon.co.jp/gp/video/detail/*   
// @version     1.1
// @icon        https://images-eu.ssl-images-amazon.com/images/I/411j1k1u9yL.png
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/393617/Skip%20Amazon%20Prime%20Video%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/393617/Skip%20Amazon%20Prime%20Video%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(
        function(){
            if(document.querySelectorAll('.adSkipButton.skippable').length){
                document.querySelector('.adSkipButton.skippable').click();
            }
        }
        ,100);
})();