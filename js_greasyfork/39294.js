// ==UserScript==
// @name         KissAnime Video at the Top (and always visible)
// @namespace    superschwul
// @version      5.0
// @description  Move video to the top of the page. Keep video visible when scrolling down to see comments. Auto show comments.
// @homepageURL  https://greasyfork.org/en/scripts/39294-kissanime-video-at-the-top-and-always-visible
// @author       Superschwul
// @match        http://kissanime.ru/Anime/*
// @match        https://kissanime.ru/Anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39294/KissAnime%20Video%20at%20the%20Top%20%28and%20always%20visible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39294/KissAnime%20Video%20at%20the%20Top%20%28and%20always%20visible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.getElementsByTagName('body')[0];
    var navContainer = document.getElementsByClassName('barContent')[0];
    if(navContainer == null) {
        throw '';
    }
    var nav = navContainer.children[0].children[0];
    var videoContainer = document.createElement('div');
    var video = document.getElementById('centerDivVideo');

    nav.id = 'episodeNav';
    videoContainer.id = 'videoContainer';
    body.insertBefore(videoContainer, body.firstChild);
    videoContainer.appendChild(video);
    body.insertBefore(nav, body.firstChild);

    var style = document.createElement('style');
    style.innerHTML = `
        body {
            width: 100vw;
            overflow-x: hidden;
        }
        #episodeNav {
            height: 30px;
        }
        #videoContainer {
            height: 70vh;
            margin-bottom: 20px;
        }
        #centerDivVideo {
            width: auto !important;
            height: auto !important;
            display: block !important;
            z-index: 90;
        }
        #divContentVideo {
            width: auto !important;
            height: auto !important;
        }
        #divContentVideo iframe,
        #divContentVideo #my_video_1 {
            width: 700px !important;
            height: 70vh !important;
            display: block;
            margin: 0 auto;
        }
        #divComments {
            width: 46vw !important;
            margin: 0 0 0 2vw !important;
        }
        #divComments > div:first-child {
            width: 94% !important;
        }

        body.fixed #centerDivVideo {
            position: fixed !important;
            right: 2vw;
            top: 2vw;
            width: 46vw !important;
        }
        body.fixed #divContentVideo {
            width: 100% !important;
            height: 76vh !important;
        }
        body.fixed #divMyVideo {
            height: 100%;
        }
        body.fixed #divContentVideo iframe ,
        body.fixed #divContentVideo #my_video_1 {
            width: 100% !important;
            height: 100% !important;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    var runOnScroll = function(ev) {
        document.body.className = '';
        if(window.pageYOffset > 380) {
            document.body.className = 'fixed';
        }
    };
    window.addEventListener('scroll', runOnScroll);

    document.getElementById('btnShowComments').click();

})();