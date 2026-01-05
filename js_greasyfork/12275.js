// ==UserScript==
// @name        荔枝FM 节目下载。Download Lizhi FM MP3
// @namespace   feifeihang.info
// @description 下载当前节目。Download current MP3 playing on Lizhi FM
// @include     http://www.lizhi.fm/box*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12275/%E8%8D%94%E6%9E%9DFM%20%E8%8A%82%E7%9B%AE%E4%B8%8B%E8%BD%BD%E3%80%82Download%20Lizhi%20FM%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/12275/%E8%8D%94%E6%9E%9DFM%20%E8%8A%82%E7%9B%AE%E4%B8%8B%E8%BD%BD%E3%80%82Download%20Lizhi%20FM%20MP3.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  window.addEventListener('load', function () {
    var frag = document.createDocumentFragment();
    var link = document.createElement('a');
    link.addEventListener('mouseenter', function () {
      ready(link);
    });
    link.target = '_blank';
    link.style = 'display: block; color: #fff; position: fixed; z-index: 999999; top: 0;' +
      ' right: 20px; width: 100px; height: 35px; background: #7695D6; text-decoration: none;' + 
      ' cursor: pointer; line-height: 35px; font-weight: bold; text-align: center';
    link.appendChild(document.createTextNode('下载当前节目'));
    frag.appendChild(link);
    document.body.appendChild(frag);
  });
  function ready(anchor) {
    if (window.player && window.player.getCurrentAudio()) {
      var audio = window.player.getCurrentAudio();
      download(anchor, audio.url, audio.title || 'download');
    }
  }
  function download(link, url, name) {
    link.download = name;
    link.href = url;
  }
}) (this, this.document);
