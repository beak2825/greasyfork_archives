// ==UserScript==
// @name        MyAnimeList (MAL) "Episode Videos" Hider
// @namespace   https://greasyfork.org/en/users/692452
// @match       https://myanimelist.net/anime/*
// @match       https://myanimelist.net/anime.php?id=*
// @version     1.0.2
// @author      jordan-git (_Jordo)
// @description A script that will hide "Episode Videos" by default on an anime page to avoid spoilers. There is a button to toggle this feature above where the videos should be, beside "More Videos"
// @downloadURL https://update.greasyfork.org/scripts/412452/MyAnimeList%20%28MAL%29%20%22Episode%20Videos%22%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/412452/MyAnimeList%20%28MAL%29%20%22Episode%20Videos%22%20Hider.meta.js
// ==/UserScript==

const toggleButton = document.createElement('a');
const spanSeparator = document.createElement('span');
const videoContainer = document.querySelector('#episode_video');
const bottomBorder = videoContainer.nextSibling;

videoContainer.style.display = 'none';
bottomBorder.style.display = 'none';

toggleButton.innerText = 'Show';
toggleButton.style.display = 'inline-block';
toggleButton.style.cursor = 'pointer';
toggleButton.style.userSelect = 'none';

spanSeparator.innerText = ', ';

toggleButton.onclick = function () {
    this.innerText === 'Show'
        ? (this.innerText = 'Hide')
        : (this.innerText = 'Show');

    videoContainer.style.display === 'none'
        ? (videoContainer.style.display = 'block')
        : (videoContainer.style.display = 'none');

    bottomBorder.style.display === 'none'
        ? (bottomBorder.style.display = 'block')
        : (bottomBorder.style.display = 'none');
};

const headerElements = document.getElementsByTagName('a');
for (const element of headerElements) {
    if (element.innerText === 'More Videos') {
        element.parentNode.insertBefore(toggleButton, element);
        element.parentNode.insertBefore(spanSeparator, element);
    }
}