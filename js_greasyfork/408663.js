// ==UserScript==
// @name         free-video
// @namespace    https://github.com/xhonker/free-video
// @version      0.2.4
// @description  free play all china video
// @supportURL   https://github.com/xhonker/free-video/issues
// @author       Quicker
// @include       *://v.qq.com/x/cover/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/408663/free-video.user.js
// @updateURL https://update.greasyfork.org/scripts/408663/free-video.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let baseURL = '//jx.idc126.net/jx/?url=';

  loadTencent();

  function loadTencent() {
    let playerContainer = document.querySelector('#mod_player');
    let tencentPlayer = document.querySelector('#tenvideo_player');
    let vip = document.querySelector('#_vip_player_sec');
    if (vip) vip.hidden = true;

    let episode = document.querySelector('.mod_episode');
    if (episode) {
      episode.addEventListener('click', function (e) {
        let event = e.target;
        if (event.nodeName === 'A') {
          episode.querySelector('.current').classList.toggle('current');
          event.parentElement.classList.add('current');
          loadIframe(event.href);
        }
      });
    }
    removeTxPlayer();

    function loadIframe(href) {
      let isLoad = document.querySelector('#mod_player iframe');

      if (isLoad) playerContainer.removeChild(document.querySelector('iframe'));
      let iframe = document.createElement('iframe');
      iframe.src = `${baseURL}${href}`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.allowFullscreen = true;
      playerContainer.appendChild(iframe);
    }

    function removeTxPlayer() {
      let timer = setInterval(() => {
        if (typeof window.TxpCreativePlayer !== 'undefined') {
          TxpCreativePlayer = void 0;
          playerContainer.removeChild(tencentPlayer);
          tencentPlayer.innerHTML = '<span></span>';
          tencentPlayer.hidden = true;
          loadIframe(window.location.href);
          clearInterval(timer);
        }
      }, 200);
    }
  }
})();
