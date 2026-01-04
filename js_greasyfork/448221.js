// ==UserScript==
// @name         Hide youtube Shorts
// @version      1.1
// @namespace https://gist.github.com/MrDrache333/4e9121cea06395b6342e99232cd980f8
// @description  Remove youtube shorts Links, Videos and Feeds
// @author       MrDrache333
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448221/Hide%20youtube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/448221/Hide%20youtube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function removeShortsLinks(){
    var count = 0
    //Remove Shorts Link
    document.querySelectorAll('a[title="Shorts"]').forEach(t => {
        const elem = t.closest('ytd-guide-entry-renderer');
        if (elem){
            elem.remove();
            count++
        }
    })
    if(count)console.log('Removed ' + count + ' shorts-Links');
    }
    
    function removeShortsfromStart(){
        //Remove Shorts from Startpage
        const elem = document.querySelector('ytd-rich-shelf-renderer[is-shorts]')
        if (elem){
            elem.remove();
            console.log('Removed Shorts Area on Startpage');
        }
    }
    
    function removeSearchReels() {
        let count = 0;

        document.querySelectorAll('ytd-reel-shelf-renderer').forEach(t => {
            if (t) {
                count++;
                const elem = t;
                if (elem) {
                    elem.remove();
                }
            }
        });

        if (count) {
            console.log('Removed ' + count + ' Reel Shelfs in Search');
        }
    }
    
    
    function removeShortsVideos(){
    //Remove Shorts in search
    var count = 0
    document.querySelectorAll('a[href^="/shorts/"]').forEach(t => {
        const elem = t.closest('ytd-video-renderer');
        if (elem){
            elem.remove();
        }
    })
    if(count)console.log('Removed ' + count + ' shorts-Videos');
    }

    //@author danieloliveira117
    function removeShortsFeed() {
        let count = 0;

        document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(t => {
            if (t) {
                count++;
                const elem = t.closest('ytd-grid-video-renderer');

                if (elem) {
                    elem.remove();
                }
            }
        });

        if (count) {
            console.log('Removed ' + count + ' shorts');
        }
    }
    
    function removeShorts(){
        removeShortsLinks();
        removeShortsVideos();
        removeShortsFeed();
        removeShortsfromStart();
        removeSearchReels();
    }

    const observer = new MutationObserver(removeShorts);
    observer.observe(document.querySelector('#page-manager'), { childList:true, subtree:true });
})();