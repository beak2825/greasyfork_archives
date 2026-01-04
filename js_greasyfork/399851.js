// ==UserScript==
// @name            Video Shortcuts
// @name:de         Video Tastaturkürzel
// @name:en         Video Shortcuts
// @name:es         Video Shortcuts
// @name:it         Video Shortcuts
// @name:ja         Video Shortcuts
// @name:fr         Video Shortcuts
// @name:ko         Video Shortcuts
// @name:pl         Video Shortcuts
// @name:ru         Video Shortcuts
// @name:zh         视频的键盘快捷键
// @namespace       videoShortcuts
// @version         0.3
// @description     Speed up, slow down, advance, rewind, loop any HTML5 video on any site with quick shortcuts!
// @description:de  Beschleunigen, verlangsamen, vorrücken, zurückspulen, jedes HTML5-Video auf jeder Site mit schnellen Verknüpfungen schleifen!
// @description:en  Speed up, slow down, advance, rewind, loop any HTML5 video on any site with quick shortcuts!
// @description:es  ¡Acelere, reduzca la velocidad, avance, retroceda, repita cualquier video HTML5 en cualquier sitio con atajos rápidos!
// @description:it  Accelera, rallenta, avanza, riavvolgi, riproduci in loop qualsiasi video HTML5 su qualsiasi sito con tasti rapidi!
// @description:ja  クイックショートカットを使用して、サイト上のHTML5ビデオをスピードアップ、スローダウン、アドバンス、巻き戻し、ループします。
// @description:fr  Accélérez, ralentissez, avancez, rembobinez, bouclez n'importe quelle vidéo HTML5 sur n'importe quel site avec des raccourcis rapides!
// @description:ko  빠른 바로 가기로 모든 사이트에서 HTML5 비디오의 속도를 높이고, 느리게하고, 진행하고, 되 감고, 반복합니다!
// @description:pl  Przyspiesz, zwalniaj, przewijaj, przewijaj do tyłu, zapętlaj dowolny film HTML5 na dowolnej stronie dzięki szybkim skrótom!
// @description:ru  Ускоряйте, замедляйте, перематывайте вперед и назад, зацикливайте любое видео HTML5 на любом сайте с помощью быстрых клавиш!
// @description:zh  加快，放慢速度，快进，快退，循环播放任何站点上的HTML5视频，并提供快速快捷键！
// @author          Blank
// @match           *://*/*
// @run-at          document-idle
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @compatible      safari
// @compatible      opera
// @downloadURL https://update.greasyfork.org/scripts/399851/Video%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/399851/Video%20Shortcuts.meta.js
// ==/UserScript==

// shortcuts:
// - speed - 0.25 (speedDelta const)
// = speed + 0.25 (speedDelta const)
// \ speed = 1
// ] advance 10s (timeDelta const)
// [ rewind 10s (timeDelta const)
// ` toggle loop (loop is OFF by default)

(function main() {
  'use strict';

  const speedDelta = 0.25;
  const timeDelta = 10;

  const applyLimits = (x, min, max) => {
    if (x < min) return min;
    if (x > max) return max;
    return x;
  };

  window.addEventListener('message', ({ data }) => {
    if (data === 'pleasePauseVideo') {
      document.querySelectorAll('video').forEach((video) => video.pause());
    }
  });

  document.addEventListener('keydown', ({ target, code }) => {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    switch (code) {
      case 'Equal': // = speed+
        document.querySelectorAll('video').forEach((video) => {
          video.playbackRate = applyLimits(video.playbackRate + speedDelta, 0, 16);
        });
        break;
      case 'Minus': // - speed-
        document.querySelectorAll('video').forEach((video) => {
          video.playbackRate = applyLimits(video.playbackRate - speedDelta, 0, 16);
        });
        break;
      case 'Backslash': // \ speed reset
        document.querySelectorAll('video').forEach((video) => {
          video.playbackRate = 1;
        });
        break;
      case 'BracketLeft': // [ rewind
        document.querySelectorAll('video').forEach((video) => {
          video.currentTime = applyLimits(video.currentTime - timeDelta, 0, video.duration);
        });
        break;
      case 'BracketRight': // ] advance
        document.querySelectorAll('video').forEach((video) => {
          if (video.currentTime < video.duration) {
            video.currentTime = applyLimits(video.currentTime + timeDelta, 0, video.duration);
          }
        });
        break;
      case 'Backquote': // ` toggle loop
        document.querySelectorAll('video').forEach((video) => {
          video.loop = !video.loop;
        });
        break;
      default:
    }
  }, { passive: true });
}());
