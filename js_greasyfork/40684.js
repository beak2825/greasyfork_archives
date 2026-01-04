// ==UserScript==
// @name         [RED] Export Bookmarks
// @namespace    https://redacted.ch
// @version      1.1.2
// @description  Adds actions to export bookmarks as markdown/json to the bookmarks page
// @author       wavelight
// @include      https://redacted.ch/bookmarks.php
// @include      https://redacted.ch/bookmarks.php?type=torrents
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40684/%5BRED%5D%20Export%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/40684/%5BRED%5D%20Export%20Bookmarks.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const doc = document;

  const LABELS = {
    BOOKMARKS: '\'s bookmarks',
    DATE: '**Export Date:** ',
    COUNT: '**Number of Groups:** ',
    EXPORT_JSON: 'Export JSON',
    EXPORT_MD: 'Export Markdown',
  };

  const SELECTORS = {
    TORRENTS: '.torrent_table > tbody > .group',
    GROUP_HEADLINE: 'td:last-child > strong',
    ALBUM_LINK : '.tooltip',
    ARTIST_LINKS: 'a:not(.tooltip)',
    USER_NAME: '.username',
    LINK_BOX: '.linkbox'
  };

  const compose = (...fns) => (x, ...rest) => fns.reduceRight((acc, fn) => fn(acc, ...rest), x);

  // Selector helpers
  const node = (sel, el = doc) => el.querySelector(sel);
  const toNode = sel => el => node(sel, el);
  const nodeArr = (sel, el = doc) => Array.from(el.querySelectorAll(sel));
  const toNodeArr = sel => el => nodeArr(sel, el);

  // Value formatting helpers
  const formatName = el => el.textContent;
  const formatUrl = el => `https://redacted.ch/${el.getAttribute('href')}`;
  const formatYear = el => {
    const regex = new RegExp(/\[(\d*)\]$/);
    const matches = regex.exec(el.innerHTML);
    return  matches[1];
  };

  const parseBookmarks = () => {
    const {
      ALBUM_LINK,
      ARTIST_LINKS,
      GROUP_HEADLINE,
      TORRENTS,
    } = SELECTORS;

    const fallbackArtist = {
      name: 'Various Artists',
      url: null,
    };

    const parseGroup = (headline, i) => {
      const artistLinks = nodeArr(ARTIST_LINKS, headline);
      const albumLink = node(ALBUM_LINK, headline);

      const toArtist = artistLink => ({
        name: formatName(artistLink),
        url: formatUrl(artistLink)
      });

      return {
        album: {
          name: formatName(albumLink),
          url: formatUrl(albumLink),
          year: formatYear(headline),
        },
        artists: artistLinks.length === 0
          ? fallbackArtist
          : artistLinks.map(toArtist),
      };
    };

    const toParsed = compose(
      parseGroup,
      toNode(GROUP_HEADLINE)
    );

    return nodeArr(TORRENTS).map(toParsed);
  };

  const renderJson = () => {
    const { USER_NAME } = SELECTORS;
    const bookmarks = parseBookmarks();

    const payload = {
      bookmarks,
      length: bookmarks.length,
      date: Date.now(),
      user: formatUrl(node(USER_NAME)),
    };

    return JSON.stringify(payload);
  };

  const renderMarkdown = () => {
    const { USER_NAME } = SELECTORS;

    const formatBlock = (...lines) => [].concat(lines, '');
    const formatLine = str => `${str}<br>`;
    const formatHeadline = (str, level = '#') => formatBlock(`${level} ${str}`);

    const renderArtist = ({ name: artist, url: artistUrl }) => artistUrl != null
      ? `[${artist}](${artistUrl})`
      : `${artist}`;

    const renderGroup = ({
      artists,
      album: {
        name: album,
        url: albumUrl,
        year,
      },
    }, i) => `${i + 1}. [${album}](${albumUrl}) (${year}) – ${[].concat(artists).map(renderArtist).join(', ')}`;

    const lines = parseBookmarks().map(renderGroup);

    const metaInformation = [
      ...formatHeadline(`${node(USER_NAME).textContent}${LABELS.BOOKMARKS}`),
      ...formatBlock(
        formatLine(`${LABELS.DATE}${new Date().toLocaleString('en-US')}`),
        formatLine(`${LABELS.COUNT}${lines.length}`)
      ),
    ];

    return metaInformation
      .concat(lines)
      .join('\n');
  };

  const saveData = (data, fileName) => {
    const a = doc.createElement('a');
    a.style = 'display:none';
    doc.body.appendChild(a);
    const blob = new Blob([data], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const init = () => {
    const { LINK_BOX } = SELECTORS;
    const { EXPORT_JSON, EXPORT_MD } = LABELS;

    const linkbox = node(LINK_BOX);

    const renderLink = (label, renderer, fileName) => {
      const a = doc.createElement('a');
      a.classList.add('brackets');
      a.href = '#export';
      a.innerText = label;
      a.addEventListener('click', (evt) => {
        evt.preventDefault();
        return saveData(renderer(), fileName);
      });

      linkbox.appendChild(a);
    };

    renderLink(EXPORT_JSON, renderJson, 'bookmarks.json');
    renderLink(EXPORT_MD, renderMarkdown, 'bookmarks.md');
  };

  init();
})();
