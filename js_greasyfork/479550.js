// ==UserScript==
// @name         Bypass Youtube Video Player Blocker
// @version      1.5
// @description  Bypass Youtube's Adblocker detector by embedding videos and playlists
// @author       Misnomer
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.youtube.com/playlist?list=*
// @match        https://www.youtu.be/watch?v=*
// @license      MIT
// @namespace https://greasyfork.org/users/1215479
// @downloadURL https://update.greasyfork.org/scripts/479550/Bypass%20Youtube%20Video%20Player%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/479550/Bypass%20Youtube%20Video%20Player%20Blocker.meta.js
// ==/UserScript==



(function () {
  'use strict';

  class YoutubeEmbedder {
  constructor() {
    this.IFRAME_ID = '';
    this.URL = '';
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.PLAYER = null;
  }

  uuid() {
    return 'embedded-youtube-' + Math.random().toString(36).substring(7);
  }

  getVID() {
    return this.URL.match(/v=([^&]+)/)[1];
  }

  setDimension() {
    this.HEIGHT = this.PLAYER.clientHeight;
    this.WIDTH = this.PLAYER.clientWidth;
  }

  removeExistingIframe() {
    const embeddedIframe = document.getElementById(this.IFRAME_ID);
    if (embeddedIframe) embeddedIframe.remove();
  }

  mbed() {
      const iframe = document.createElement('iframe');

      iframe.id = this.IFRAME_ID;
      iframe.src = `https://www.youtube.com/embed/${this.getVID()}`;
      iframe.width = this.WIDTH + 'px';
      iframe.height = this.HEIGHT + 'px';
      iframe.style.border = 'none';
      iframe.setAttribute('allow', 'autoplay');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      iframe.addEventListener('load', function () {
        const iframeDocument = this.contentDocument || this.contentWindow.document;
        const videoElement = iframeDocument.querySelector('video');
        if (videoElement) videoElement.click();
      });

      this.PLAYER.innerHTML = '';
      this.PLAYER.appendChild(iframe);
  }

  update() {
    if (this.URL === window.location.href) return;

    this.removeExistingIframe();
    this.IFRAME_ID = this.uuid();
    this.URL = window.location.href;
    this.mbed();
  }

  start() {
    this.PLAYER = document.querySelector('#player');

    if(this.PLAYER) {
      this.setDimension();
      setInterval(() => this.update(), 1000);
    }
    else {
      setTimeout(() => this.start(), 1000);
    }
  }

}

const youtubeEmbedder = new YoutubeEmbedder();
youtubeEmbedder.start();

})();