// ==UserScript==
// @name         KissAnime Auto Hide
// @version      1.1.1
// @description  Automatically hide ads on KissAnime pages.  Also automatically hides the beta player ad.
// @author       G-Rex
// @match        http://kissanime.ru/*
// @match        https://kissanime.ru/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
//
// @namespace https://greasyfork.org/users/154522
// @downloadURL https://update.greasyfork.org/scripts/38606/KissAnime%20Auto%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/38606/KissAnime%20Auto%20Hide.meta.js
// ==/UserScript==

var observer;
var hidAds = false;
var closedVidAd = false;

(function() {
    'use strict';

    let date = new Date();
    let sec = date.getSeconds();
    let ms = date.getMilliseconds();

    let content = document.querySelector('.barContent');
    if(!content) {
        return;
    }

    observer = new MutationObserver(removeAds);
    observer.observe(content, {
        'childList': true,
        'subtree': true
    });
})();

function removeAds() {
    hideAds();
    closeVideoAd();

    if(hidAds && closedVidAd) {
        console.log('disconnecting');
        observer.disconnect();
    }
}

function hideAds() {
    let hideAnchors = document.querySelectorAll('.divCloseBut a');

    if(hideAnchors.length === 0) {
        return;
    }

    for(let i = 0; i < hideAnchors.length; i++) {
        hideAnchors[i].onclick();
    }

    hidAds = true;
}

function closeVideoAd() {
    let videoAdClose = document.querySelector('.videoAdClose');


    if(!videoAdClose) {
        return;
    }

    videoAdClose.onclick();

    closedVidAd = true;
}

function videoadclosetemp() {
    let videoAd = document.getElementById('videoAd');
    if(videoAd) {
        videoAd.parentNode.removeChild(videoAd);
    }

    let videoAdClose = document.getElementsByClassName('videoAdClose');

    for(let i = 0; i < videoAdClose.length; i++) {
        if(videoAdClose[i]) {
            videoAdClose[i].parentNode.removeChild(videoAdClose[i]);
        }
    }
}