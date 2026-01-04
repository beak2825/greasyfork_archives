// ==UserScript==
// @name        YoutubeEpisodeEnable
// @namespace   YoutubeEpisodeEnable
// @description:ru Отображает список эпизодов справа от видео
// @description:en Displays a list of episodes to the right of the video
// @author Ratmir Aitov
// @license MIT
// @include     https://www.youtube.com/*
// @match       https://www.youtube.com/*
// @exclude     https://www.youtube.com
// @version     0.3.1
// @grant       none
// @homepageURL https://greasyfork.org/ru/scripts/414771
// @description Отображает список эпизодов справа от видео
// @downloadURL https://update.greasyfork.org/scripts/414771/YoutubeEpisodeEnable.user.js
// @updateURL https://update.greasyfork.org/scripts/414771/YoutubeEpisodeEnable.meta.js
// ==/UserScript==

//when you open new page - event yt-page-data-updated stopped working
document.addEventListener('load', function () {
    setTimeout(()=>document.querySelector('.ytp-chapter-title').click(),0)
});

window.addEventListener('yt-page-data-updated', function () {
    setTimeout(()=>document.querySelector('.ytp-chapter-title').click(),400)
});

