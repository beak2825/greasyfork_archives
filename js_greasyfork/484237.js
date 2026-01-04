// ==UserScript==
// @name         Better Youtube Music
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Create a Better Youtube Music
// @author       Rizky Daffy Al Fajr | @rizky.daffy
// @copyright    2023, DappyNet (https://github.com/Dappy-Net)
// @license      MIT
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484237/Better%20Youtube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/484237/Better%20Youtube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.startsWith("https://music.youtube.com/")) {

        // Home page
        if (window.location.href === "https://music.youtube.com/") {

          const faviconLink = document.querySelector('link[rel="icon"]');
          const newFaviconLink = document.createElement('link');
          newFaviconLink.rel = 'icon';
          newFaviconLink.sizes = '32x32';
          newFaviconLink.type = 'image/png';
          newFaviconLink.href = 'https://github.com/RizkyDave/Better-Youtube-Music/blob/main/assets/AppleMUsic.png?raw=true';
          if (faviconLink) {
          document.head.removeChild(faviconLink);
          }
          document.head.appendChild(newFaviconLink);
          const imgElement = document.querySelector('.yt-simple-endpoint.style-scope.ytmusic-logo img');
          if (imgElement) {
          imgElement.src = 'https://raw.githubusercontent.com/RizkyDave/Better-Youtube-Music/refs/heads/main/assets/Apple.webp';
          }
          const pictureElement = document.querySelector('.yt-simple-endpoint.style-scope.ytmusic-logo picture');
          if (pictureElement) {
          const imgElement = pictureElement.querySelector('img');

         if (imgElement) {
        pictureElement.parentNode.insertBefore(imgElement, pictureElement);

        pictureElement.remove();
        }
        }
        const ytIconButtonElement = document.querySelector('yt-icon-button');

        if (ytIconButtonElement) {
        ytIconButtonElement.remove();
        }
        const logoElement = document.querySelector('.logo.ytmusic-logo');
        if (logoElement) {
        logoElement.style.height = '60px';
        logoElement.style.paddingLeft = '10px';
        }
        const logoSpace = document.querySelector('ytmusic-logo.ytmusic-nav-bar');
        if (logoSpace) {
        logoSpace.style.height = '62px';
        }

        const itemsContainer = document.getElementById('items');
        const guideEntryRendererElements = itemsContainer.querySelectorAll('.ytmusic-guide-entry-renderer');

       guideEntryRendererElements.forEach(function(element) {
       const iconElement = element.querySelector('.guide-icon');
       if (iconElement) {
        iconElement.style.color = '#f00';
       }

       const titleElement = element.querySelector('.title');
         if (titleElement) {
          titleElement.style.color = '#fff';
       }
       });
      const titleElements = itemsContainer.querySelectorAll('.title.style-scope.ytmusic-guide-entry-renderer');

      titleElements.forEach((titleElement) => {
      if (titleElement.innerText.trim() === 'Koleksi') {

        titleElement.innerText = 'Radio';
      }

      if (titleElement.innerText.trim() === 'Upgrade') {

      const entryRendererElement = titleElement.closest('ytmusic-guide-entry-renderer');
      if (entryRendererElement) {
            entryRendererElement.remove();
        }
      }
      });

       const navaasContainer = document.querySelector('#items.ytmusic-guide-section-renderer');

       if (navaasContainer) {
       navaasContainer.style.paddingTop = '25px';
       }

const recentlyPaperItem = document.createElement('tp-yt-paper-item');
recentlyPaperItem.setAttribute('role', 'link');
recentlyPaperItem.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
recentlyPaperItem.setAttribute('style-target', 'host');
recentlyPaperItem.setAttribute('id', 'recentlyPage');
recentlyPaperItem.setAttribute('tabindex', '0');
recentlyPaperItem.setAttribute('aria-disabled', 'false');
recentlyPaperItem.setAttribute('aria-current', 'false');
recentlyPaperItem.setAttribute('href', '/listen_again');


const recentlyIcon = document.createElement('div');
recentlyIcon.setAttribute('class', 'guide-icon style-scope ytmusic-guide-entry-renderer');
recentlyIcon.setAttribute('style', 'color: rgb(255, 0, 0);');
const ionIcon = document.createElement('ion-icon');
ionIcon.setAttribute('name', 'time-outline');
recentlyIcon.appendChild(ionIcon);

const recentlyTitleColumn = document.createElement('div');
recentlyTitleColumn.setAttribute('class', 'title-column style-scope ytmusic-guide-entry-renderer');

const recentlyTitleGroup = document.createElement('div');
recentlyTitleGroup.setAttribute('class', 'title-group style-scope ytmusic-guide-entry-renderer');

const recentlyTitle = document.createElement('yt-formatted-string');
recentlyTitle.setAttribute('class', 'title style-scope ytmusic-guide-entry-renderer');
recentlyTitle.setAttribute('style', 'color: rgb(255, 255, 255);');
recentlyTitle.setAttribute('is-empty', '');

const recentlyInlineBadges = document.createElement('span');
recentlyInlineBadges.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
recentlyInlineBadges.textContent = 'Recently';

const recentlySubtitle = document.createElement('yt-formatted-string');
recentlySubtitle.setAttribute('class', 'subtitle style-scope ytmusic-guide-entry-renderer');
recentlySubtitle.setAttribute('is-empty', '');

recentlyTitleGroup.appendChild(recentlyTitle);
recentlyTitleColumn.appendChild(recentlyTitleGroup);
recentlyTitleColumn.appendChild(recentlyInlineBadges);
recentlyTitleColumn.appendChild(recentlySubtitle);
recentlyPaperItem.appendChild(recentlyIcon);
recentlyPaperItem.appendChild(recentlyTitleColumn);

const artistPaperItem = document.createElement('tp-yt-paper-item');
artistPaperItem.setAttribute('role', 'link');
artistPaperItem.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
artistPaperItem.setAttribute('style-target', 'host');
artistPaperItem.setAttribute('tabindex', '0');
artistPaperItem.setAttribute('aria-disabled', 'false');
artistPaperItem.setAttribute('aria-current', 'false');
artistPaperItem.setAttribute('href', '/listen_again');

const artistIcon = document.createElement('div');
artistIcon.setAttribute('class', 'guide-icon style-scope ytmusic-guide-entry-renderer');
artistIcon.setAttribute('style', 'color: rgb(255, 0, 0);');
const artistionIcon = document.createElement('ion-icon');
artistionIcon.setAttribute('name', 'time-outline');
artistIcon.appendChild(artistionIcon);

const artistTitleColumn = document.createElement('div');
artistTitleColumn.setAttribute('class', 'title-column style-scope ytmusic-guide-entry-renderer');

const artistTitleGroup = document.createElement('div');
artistTitleGroup.setAttribute('class', 'title-group style-scope ytmusic-guide-entry-renderer');

const artistTitle = document.createElement('yt-formatted-string');
artistTitle.setAttribute('class', 'title style-scope ytmusic-guide-entry-renderer');
artistTitle.setAttribute('style', 'color: rgb(255, 255, 255);');
artistTitle.setAttribute('is-empty', '');

const artistInlineBadges = document.createElement('span');
artistInlineBadges.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
artistInlineBadges.textContent = 'Artist';

const artistSubtitle = document.createElement('yt-formatted-string');
artistSubtitle.setAttribute('class', 'subtitle style-scope ytmusic-guide-entry-renderer');
artistSubtitle.setAttribute('is-empty', '');

artistTitleGroup.appendChild(artistTitle);
artistTitleColumn.appendChild(artistTitleGroup);
artistTitleColumn.appendChild(artistInlineBadges);
artistTitleColumn.appendChild(artistSubtitle);
artistPaperItem.appendChild(artistIcon);
artistPaperItem.appendChild(artistTitleColumn);
//space
const albumsPaperItem = document.createElement('tp-yt-paper-item');
albumsPaperItem.setAttribute('role', 'link');
albumsPaperItem.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
albumsPaperItem.setAttribute('style-target', 'host');
albumsPaperItem.setAttribute('tabindex', '0');
albumsPaperItem.setAttribute('aria-disabled', 'false');
albumsPaperItem.setAttribute('aria-current', 'false');
albumsPaperItem.setAttribute('href', '/listen_again');

const albumsIcon = document.createElement('div');
albumsIcon.setAttribute('class', 'guide-icon style-scope ytmusic-guide-entry-renderer');
albumsIcon.setAttribute('style', 'color: rgb(255, 0, 0);');
const albumsionIcon = document.createElement('ion-icon');
albumsionIcon.setAttribute('name', 'time-outline');
albumsIcon.appendChild(albumsionIcon);

const albumsTitleColumn = document.createElement('div');
albumsTitleColumn.setAttribute('class', 'title-column style-scope ytmusic-guide-entry-renderer');

const albumsTitleGroup = document.createElement('div');
albumsTitleGroup.setAttribute('class', 'title-group style-scope ytmusic-guide-entry-renderer');

const albumsTitle = document.createElement('yt-formatted-string');
albumsTitle.setAttribute('class', 'title style-scope ytmusic-guide-entry-renderer');
albumsTitle.setAttribute('style', 'color: rgb(255, 255, 255);');
albumsTitle.setAttribute('is-empty', '');

const albumsInlineBadges = document.createElement('span');
albumsInlineBadges.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
albumsInlineBadges.textContent = 'Albums';

const albumsSubtitle = document.createElement('yt-formatted-string');
albumsSubtitle.setAttribute('class', 'subtitle style-scope ytmusic-guide-entry-renderer');
albumsSubtitle.setAttribute('is-empty', '');

albumsTitleGroup.appendChild(albumsTitle);
albumsTitleColumn.appendChild(albumsTitleGroup);
albumsTitleColumn.appendChild(albumsInlineBadges);
albumsTitleColumn.appendChild(albumsSubtitle);
albumsPaperItem.appendChild(albumsIcon);
albumsPaperItem.appendChild(albumsTitleColumn);

const songsPaperItem = document.createElement('tp-yt-paper-item');
songsPaperItem.setAttribute('role', 'link');
songsPaperItem.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
songsPaperItem.setAttribute('style-target', 'host');
songsPaperItem.setAttribute('tabindex', '0');
songsPaperItem.setAttribute('aria-disabled', 'false');
songsPaperItem.setAttribute('aria-current', 'false');
songsPaperItem.setAttribute('href', '/listen_again');

const songsIcon = document.createElement('div');
songsIcon.setAttribute('class', 'guide-icon style-scope ytmusic-guide-entry-renderer');
songsIcon.setAttribute('style', 'color: rgb(255, 0, 0);');
const songsionIcon = document.createElement('ion-icon');
songsionIcon.setAttribute('name', 'time-outline');
songsIcon.appendChild(songsionIcon);

const songsTitleColumn = document.createElement('div');
songsTitleColumn.setAttribute('class', 'title-column style-scope ytmusic-guide-entry-renderer');

const songsTitleGroup = document.createElement('div');
songsTitleGroup.setAttribute('class', 'title-group style-scope ytmusic-guide-entry-renderer');

const songsTitle = document.createElement('yt-formatted-string');
songsTitle.setAttribute('class', 'title style-scope ytmusic-guide-entry-renderer');
songsTitle.setAttribute('style', 'color: rgb(255, 255, 255);');
songsTitle.setAttribute('is-empty', '');

const songsInlineBadges = document.createElement('span');
songsInlineBadges.setAttribute('class', 'style-scope ytmusic-guide-entry-renderer');
songsInlineBadges.textContent = 'Songs';

const songsSubtitle = document.createElement('yt-formatted-string');
songsSubtitle.setAttribute('class', 'subtitle style-scope ytmusic-guide-entry-renderer');
songsSubtitle.setAttribute('is-empty', '');

songsTitleGroup.appendChild(songsTitle);
songsTitleColumn.appendChild(songsTitleGroup);
songsTitleColumn.appendChild(songsInlineBadges);
songsTitleColumn.appendChild(songsSubtitle);
songsPaperItem.appendChild(songsIcon);
songsPaperItem.appendChild(songsTitleColumn);

const dividerElement = document.querySelector('#itam.style-scope.ytmusic-guide-section-renderer');

if (dividerElement) {
    dividerElement.insertAdjacentElement('beforebegin', newDiv);
}

const scriptModule = document.createElement('script');
scriptModule.setAttribute('type', 'module');
scriptModule.setAttribute('src', 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js');

const scriptNoModule = document.createElement('script');
scriptNoModule.setAttribute('nomodule', '');
scriptNoModule.setAttribute('src', 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js');

const headElement = document.head || document.getElementsByTagName('head')[0];

headElement.appendChild(scriptModule);
headElement.appendChild(scriptNoModule);

const newDiv = document.createElement('div');
newDiv.setAttribute('class', 'style-scope ytmusic-guide-section-renderer');
newDiv.innerHTML = '<h1 class="library">Library</h1>';
newDiv.setAttribute('id', 'itam');
newDiv.appendChild(recentlyPaperItem);
newDiv.appendChild(artistPaperItem);
newDiv.appendChild(albumsPaperItem);
newDiv.appendChild(songsPaperItem);
newDiv.style.paddingLeft = '20px';
newDiv.style.paddingTop = '30px';
const NdContainer = document.getElementById('items');
const alinkContainer = document.getElementById('recentlyPage');
const newLink = document.createElement('a');
newLink.setAttribute('href', '/listen_again');

if (NdContainer) {
    NdContainer.insertAdjacentElement('afterend', newDiv);
}
if (alinkContainer) {
    alinkContainer.insertAdjacentElement('afterend', newLink);
}
//add more
const libraryTitle = newDiv.querySelector('.library');
if (libraryTitle) {
    libraryTitle.style.paddingBottom = '20px';
}

const bodyElement = document.querySelector('body');

bodyElement.style.setProperty('background-color', 'rgb(98, 97, 97)');

const htmlElement = document.querySelector('html');

htmlElement.style.setProperty('--ytmusic-color-black4', '#262626');
     }
    }
})();