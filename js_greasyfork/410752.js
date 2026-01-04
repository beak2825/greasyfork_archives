// ==UserScript==
// @name         Spiegel.de without JavaScript
// @namespace    https://greasyfork.org/en/users/8981-buzz
// @version      0.3
// @description  Enables HTML5 video and lazyloaded images with disabled JavaScript.
// @license      GPLv2
// @noframes
// @author       buzz
// @match        https://www.spiegel.de/*
// @grant        GM.xmlHttpRequest
// @require      https://unpkg.com/lazysizes@5.2.2/lazysizes.js
// @downloadURL https://update.greasyfork.org/scripts/410752/Spiegelde%20without%20JavaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/410752/Spiegelde%20without%20JavaScript.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function setSource(videoEl, source) {
    videoEl.setAttribute('src', source.file);
    videoEl.setAttribute('type', source.type);
  }

  async function addVideoTag(image, sources, c) {
    let source = sources.find((s) => s.label === sources[0].label);
    if (!source) {
      source = sources[0];
    }

    const videoEl = document.createElement('video');
    videoEl.setAttribute('autoplay', '');
    videoEl.setAttribute('controls', '');
    videoEl.setAttribute('poster', image);
    videoEl.setAttribute('preload', '');
    videoEl.setAttribute('width', sources[0].width);
    videoEl.setAttribute('height', sources[0].height);
    videoEl.style.maxWidth = '100%';
    videoEl.style.minWidth = '100%';
    videoEl.style.height = 'auto';

    const sourceSelEl = document.createElement('div');
    if (sources.length > 1) {
      sourceSelEl.style.textAlign = 'right';
      sourceSelEl.style.paddingTop = '0.2rem';
      sources.forEach((s) => {
        const aEl = document.createElement('a');
        aEl.innerText = s.label;
        aEl.setAttribute('href', '');
        aEl.style.margin = '0 0.4rem';
        if (s === source) {
          aEl.style.textDecoration = 'underline';
        }
        aEl.addEventListener('click', (ev) => {
          ev.preventDefault();
          setSource(videoEl, s);
          for (let i = 0; i < sourceSelEl.children.length; i++) {
            const aChild = sourceSelEl.children[i]
            if (aChild.innerText === s.label) {
              aChild.style.textDecoration = 'underline';
            } else {
              aChild.style.textDecoration = 'none';
            }
          }
        });
        sourceSelEl.append(aEl);
      });
    }

    const child = c.firstElementChild;
    child.style.backgroundColor = 'transparent';
    child.style.paddingTop = '0';
    child.innerHTML = '';
    child.append(videoEl);
    child.append(sourceSelEl);
    setSource(videoEl, source);
  }

  function processApiResponse(r, c) {
    const playlist = r.playlist[0];
    const sources = playlist.sources
      .filter((s) => s.type.startsWith('video/'))
      .sort((a, b) => b.height - a.height)
    addVideoTag(playlist.image, sources, c);
  }

  function processContainer(c) {
    const { apiUrl, mediaId } = JSON.parse(c.dataset.settings);
    GM.xmlHttpRequest({
      method: "GET",
      url: `${apiUrl}/v2/media/${mediaId}`,
      onload: (r) => processApiResponse(JSON.parse(r.responseText), c),
    });
  }

  document.querySelectorAll('[data-settings*=apiUrl]').forEach(processContainer);
})();
