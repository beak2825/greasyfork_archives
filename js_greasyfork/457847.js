// ==UserScript==
// @name         从Discogs添加豆瓣条目
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.8
// @license      MIT
// @run-at document-end
// @author       越洋飞机
// @match        *://www.discogs.com/release*
// @match        *://www.discogs.com/master*
// @icon         https://s.discogs.com/badaa268132c5df6360d067acd267fbebd755915/images/discogs-white.png?5
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @description  添加豆瓣条目，自动填写信息，使用https://api.discogs.com
// @downloadURL https://update.greasyfork.org/scripts/457847/%E4%BB%8EDiscogs%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/457847/%E4%BB%8EDiscogs%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const doubanURL = 'https://music.douban.com/new_subject';
  const discogsURL = window.location.href;

  function getRequest(url) {
    return fetch(url).then(response => response.json());
  }

  function newSubject() {
    const masterURL = 'https://www.discogs.com/master/';
    const releaseURL = 'https://www.discogs.com/release/';
    const apiURL = 'https://api.discogs.com/';
    let id;

    if (discogsURL.startsWith(masterURL)) {
      id = discogsURL.substring(31, discogsURL.indexOf('-'));
      getRequest(`${apiURL}masters/${id}`).then(data => {
        const releaseID = data.main_release;
        addItem(releaseID);
      });
    } else if (discogsURL.startsWith(releaseURL)) {
      id = discogsURL.substring(32, discogsURL.indexOf('-'));
      addItem(id);
    }
  }

  function addItem(releaseID) {
    const apiToken = 'tgRatMaOmFfXjBwHNBlZDQtXrOAELZwpywEOCEbb';
    const url = `https://api.discogs.com/releases/${releaseID}?token=${apiToken}`;

    getRequest(url).then(data => {
      const info = {
        artists: data.artists ? [...data.artists] : [],
        genres: data.genres ? [...data.genres] : [],
        numArtists: data.artists ? data.artists.length : 0,
        label: data.labels && data.labels.length > 0 ? data.labels[0].name : 'Unknown',
        title: data.title || 'Unknown',
        format: data.formats && data.formats.length > 0 ? data.formats[0].name : 'Unknown',
        styles: data.styles ? [...data.styles] : 'Unknown',
        release: data.released || 'Unknown',
        note: data.notes || 'None',
        country: data.country || 'Unknown',
        link: discogsURL,
        tracklist: '',
        type: determineType(data.formats && data.formats.length > 0 ? data.formats[0].descriptions : null),
      };

      if (data.tracklist && data.tracklist.length > 0) {
        for (const track of data.tracklist) {
          if (track.type_ === 'heading') {
            info.tracklist += `${track.title}\n`;
          } else if (track.type_ === 'track') {
            info.tracklist += `${track.position}. ${track.title} ${track.duration}\n`;
          }
        }
      }

      console.log(info);

      if (data.images && data.images.length > 0) {
        GM_download(data.images[0].uri, `${info.title}.jpg`);
      }

      window.open(doubanURL, JSON.stringify(info));
    });
  }

  function determineType(descriptions) {
    if (!descriptions) return '';
    if (descriptions.includes('Album') || descriptions.includes('LP') || descriptions.includes('Stereo') ||
        descriptions.includes('12"') || descriptions.includes('33 ⅓ RPM')) {
      return '专辑';
    }
    if (descriptions.includes('Single') || descriptions.includes('7"') || descriptions.includes('45 RPM')) {
      return '单曲';
    }
    if (descriptions.includes('Compilation')) {
      return '选集';
    }
    if (descriptions.includes('EP') || descriptions.includes('Mini-Album')) {
      return 'EP';
    }
    return '';
  }

  GM_registerMenuCommand('添加条目', newSubject);
})();
