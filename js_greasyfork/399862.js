// ==UserScript==
// @name            Kill YouTube Channel Video Autoplay
// @name:de         Kill YouTube Channel Video Autoplay
// @name:en         Kill YouTube Channel Video Autoplay
// @name:es         Kill YouTube Channel Video Autoplay
// @name:it         Kill YouTube Channel Video Autoplay
// @name:ja         Kill YouTube Channel Video Autoplay
// @name:fr         Kill YouTube Channel Video Autoplay
// @name:ko         Kill YouTube Channel Video Autoplay
// @name:pl         Kill YouTube Channel Video Autoplay
// @name:ru         Kill YouTube Channel Video Autoplay
// @name:zh         Kill YouTube Channel Video Autoplay
// @namespace       killYouTubeChannelVideoAutoplay
// @version         0.3
// @description     Kill autoplay on YouTube channel and user pages
// @description:de  Beenden Sie die automatische Wiedergabe auf dem YouTube-Kanal und den Benutzerseiten
// @description:en  Kill autoplay on YouTube channel and user pages
// @description:es  Elimina la reproducción automática en el canal de YouTube y en las páginas del usuario
// @description:it  Uccidi la riproduzione automatica sul canale YouTube e sulle pagine utente
// @description:ja  YouTubeチャンネルとユーザーページの自動再生を終了する
// @description:fr  Tuez la lecture automatique sur la chaîne YouTube et les pages utilisateur
// @description:ko  YouTube 채널 및 사용자 페이지에서 자동 재생 중지
// @description:pl  Zabij autoodtwarzanie na kanale YouTube i stronach użytkowników
// @description:ru  Убирает автозапуск видео на страницах канала и пользователя на YouTube
// @description:zh  终止YouTube频道和用户页面上的自动播放
// @author          Blank
// @match           https://www.youtube.com/*
// @run-at          document-start
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/399862/Kill%20YouTube%20Channel%20Video%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/399862/Kill%20YouTube%20Channel%20Video%20Autoplay.meta.js
// ==/UserScript==

(function main() {
  'use strict';

  document.createElement = new Proxy(document.createElement, {
    apply(target, that, args) {
      if (args[0]?.toLowerCase() !== 'video') return Reflect.apply(target, that, args);
      const video = Reflect.apply(target, that, args);
      video.addEventListener('loadstart', () => {
        const channel = document.querySelector('ytd-channel-video-player-renderer');
        if (channel?.contains(video)) video.pause();
      }, { passive: true });
      return video;
    },
  });
}());
