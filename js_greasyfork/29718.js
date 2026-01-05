// ==UserScript==
// @name           [MAL] Additional features
// @description    Adds image and torrent search to anime / manga entries.
// @version        1.2.0
// @author         MetalTxus

// @match          https://myanimelist.net/anime*
// @match          https://myanimelist.net/manga*

// @icon           https://cdn.myanimelist.net/images/favicon.ico
// @namespace      https://greasyfork.org/users/8682
// @downloadURL https://update.greasyfork.org/scripts/29718/%5BMAL%5D%20Additional%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/29718/%5BMAL%5D%20Additional%20features.meta.js
// ==/UserScript==

/* globals jQuery */

(() => {
  'use strict';

  const MediaType = {
    Anime: { id: '1_2', label: 'anime' },
    Manga: { id: '3_1', label: 'manga'}
  };

  const addLinksToSearch = () => {
    jQuery('#contentWrapper h1.title-name, #contentWrapper h1 span[itemprop="name"]').each(function (i, element) {
      element = jQuery(element);

      const mediaType = location.href.indexOf('https://myanimelist.net/anime') > -1 ? MediaType.Anime : MediaType.Manga;

      const isMultiLine = element.html().includes('<br>');
      const title = isMultiLine ? element.html().split('<br>')[0] : element.text();

      const searchWrapper = jQuery(`<div class="custom-search-wrapper"></div>`);

      const picturesAnchor = jQuery(`<a href="https://www.google.es/search?tbm=isch&q=${encodeURI(title)} ${mediaType.label}"></a>`);
      const picturesIcon = jQuery(`<i class="fa fa-picture-o" title="Search for pictures"></i>`);
      appendSearchAnchor(searchWrapper, picturesAnchor, picturesIcon);

      const torrentSearch = `https://nyaa.si/?f=0&s=seeders&o=desc&c=${mediaType.id}&q=${encodeURI(title)}`;
      const torrentAnchor = jQuery(`<a href="${torrentSearch}"></a>`);
      const torrentIcon = jQuery(`<i class="fa-solid fa-magnet" title="Search for torrents"></i>`);
      appendSearchAnchor(searchWrapper, torrentAnchor, torrentIcon);

      const hsAnchor = jQuery(`<a href="${torrentSearch} SubsPlease 720"></a>`);
      const hsIcon = jQuery(`<i class="fa-solid fa-s" title="Search for SubsPlease torrents"></i>`);
      appendSearchAnchor(searchWrapper, hsAnchor, hsIcon);

      isMultiLine ? element.find('br').before(searchWrapper) : element.append(searchWrapper);
    });
  }

  const appendSearchAnchor = (container, anchor, icon) => {
    anchor.append(icon);
    container.append(' ', anchor);
  }

  const appendStyles = () => {
    jQuery(`
      <style>
       .custom-search-wrapper {
         display: inline-block;
         font-size: 0;
         padding: 0 4px;
       }

       .custom-search-wrapper a {
         box-sizing: border-box;
         display: inline-block;
         font-size: 16px;
         text-align: center;
         text-decoration: none;
         transition: .3s;
         width: 24px;
       }

       .custom-search-wrapper a:hover {
         color: rgba(80, 116, 200, .9);
       }
      </style>
    `).appendTo('head');
  }

  const initialize = () => {
    appendStyles();
    addLinksToSearch();
  }

  initialize();
})();