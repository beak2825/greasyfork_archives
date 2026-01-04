// ==UserScript==
// @name         YouTube – Open clicked videos in new tabs
// @name:fr      YouTube – Ouvrir les vidéos cliquées dans de nouveaux onglets
// @name:es      YouTube – Abrir vídeos clicados en nuevas pestañas
// @name:de      YouTube – Angeklickte Videos in neuen Tabs öffnen
// @name:pt      YouTube – Abrir vídeos clicados em novas abas
// @name:ru      YouTube – Открывать кликнутые видео в новых вкладках
// @name:zh-CN   YouTube – 在新标签页中打开点击的视频
// @name:ar      YouTube – فتح الفيديوهات التي تنقر عليها في علامات تبويب جديدة
// @name:ja      YouTube – クリックした動画を新しいタブで開く
// @name:ko      YouTube – 클릭한 동영상을 새 탭에서 열기
// @name:it      YouTube – Apri i video cliccati in nuove schede
// @name:hi      YouTube – जिस वीडियो पर क्लिक करें, उसे नई टैब में खोलें

// @description    Open YouTube videos in new tabs while keeping your current playback.
// @description:fr Ouvre les vidéos YouTube dans de nouveaux onglets sans interrompre ta lecture en cours.
// @description:es Abre vídeos de YouTube en nuevas pestañas sin interrumpir la reproducción actual.
// @description:de Öffnet YouTube-Videos in neuen Tabs, ohne die aktuelle Wiedergabe zu unterbrechen.
// @description:pt Abre vídeos do YouTube em novas abas sem interromper a reprodução atual.
// @description:ru Открывайте видео YouTube в новых вкладках, не прерывая текущий просмотр.
// @description:zh-CN 在不打断当前播放的情况下，将 YouTube 视频在新标签页中打开。
// @description:ar افتح مقاطع فيديو YouTube في علامات تبويب جديدة دون إيقاف التشغيل الحالي.
// @description:ja 現在の再生を中断せずに、YouTube動画を新しいタブで開きます。
// @description:ko 현재 재생을 유지하면서 YouTube 동영상을 새 탭에서 엽니다.
// @description:it Apri i video di YouTube in nuove schede senza interrompere la riproduzione in corso.
// @description:hi YouTube वीडियो को नई टैब में खोलें बिना मौजूदा प्लेबैक रोके।

// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       Dℝ∃wX
// @copyright    2025 DℝᴇwX
// @license      Apache-2.0
// @match        https://www.youtube.com/*
// @grant        none
// @tag          youtube
// @tag          new tab
// @tag          video
// @tag          navigation
// @tag          open link
// @tag          multitask
// @tag          productivity
// @downloadURL https://update.greasyfork.org/scripts/542455/YouTube%20%E2%80%93%20Open%20clicked%20videos%20in%20new%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/542455/YouTube%20%E2%80%93%20Open%20clicked%20videos%20in%20new%20tabs.meta.js
// ==/UserScript==




/*
Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/





(function(){
  'use strict';

  const OVLY = 'yt-thumbnail-hover-overlay-toggle-actions-view-model, ytd-thumbnail-overlay-toggle-button-renderer, #hover-overlays';

  function patch(){
    document
      .querySelectorAll('a[href*="/watch?v="], a[href^="/shorts/"]')
      .forEach(link => {
        if (link.dataset.newtab) return;
        link.dataset.newtab = '1';
        link.target = '_blank';
        link.removeAttribute('onclick');
        link.addEventListener('click', e => {
          if (e.target.closest(OVLY)) return;
          e.stopImmediatePropagation();
          e.preventDefault();
          window.open(link.href, '_blank');
        }, true);
      });
  }

  patch();
  new MutationObserver(patch)
    .observe(document.body, { childList: true, subtree: true });
})();
