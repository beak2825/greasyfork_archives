// ==UserScript==
// @name        NoUnavailable
// @namespace   Violentmonkey Scripts
// @license     WTFPL
// @match       https://musify.club/*
// @grant       none
// @version     0.1
// @author      nikita-yfh
// @description 17.05.2025, 02:53:15
// @downloadURL https://update.greasyfork.org/scripts/536247/NoUnavailable.user.js
// @updateURL https://update.greasyfork.org/scripts/536247/NoUnavailable.meta.js
// ==/UserScript==

const elements = document.querySelectorAll('i.zmdi.zmdi-block.zmdi-hc-2-5x');
elements.forEach(element => {
  element.className = 'zmdi zmdi-play-circle-outline zmdi-hc-2-5x';
});

const elementsToRemove = document.querySelectorAll('span.badge.badge-pill.badge-warning');
elementsToRemove.forEach(element => {
  element.remove();
});

const links = document.querySelectorAll(`a[href*="/track/"]`);

links.forEach(link => {
  const href = link.getAttribute('href');
  const match = href.match(/^\/track\/([a-z0-9-]+)-([0-9]+)$/);

  const iconElement = link.querySelector('i.zmdi.zmdi-download.zmdi-hc-2-5x');

  if (match && iconElement) {
    const songName = match[1];
    const songNumber = match[2];

    const newLinkHTML = `<a target="_blank" itemprop="audio" download="${songName}.mp3" href="/track/dl/${songNumber}/${songName}.mp3" class="no-ajaxy yaBrowser ___adv-binded ___adv-yandex ___adv-yandex-download ___adv-yandex-script ___adv-download" id="dl_${songNumber}" data-rbtified="true" data-rbtify-index="1"><span><i class="zmdi zmdi-download zmdi-hc-2-5x"></i></span></a>`;

    link.outerHTML = newLinkHTML;
  }
});

const match = document.URL.match(/\/track\/([a-z0-9-]+)-([0-9]+)$/);
const songName = match[1];
const songNumber = match[2];

var buttons = document.querySelectorAll('button[disabled][class="btn btn-lg btn-outline-primary btn--icon-text songplay_btn disabled mb-0 dis"][title="Скачивание недоступно"]');

buttons.forEach(button => {
  const newLinkHTML = `
      <a target="_blank" class="no-ajaxy yaBrowser btn btn-lg btn-outline-primary btn--icon-text songplay_btn mb-0 ___adv-binded ___adv-yandex ___adv-yandex-download ___adv-yandex-script ___adv-download"
                        itemprop="audio"
                        href="/track/dl/${songNumber}/${songName}.mp3"
                        id="dl_${songNumber}"
                        data-rbtified="true" data-rbtify-index="1">
         <i class="zmdi zmdi-download zmdi-hc-3x"></i>
         Скачать MP3
      </a>
  `;
  button.outerHTML=newLinkHTML;
});

buttons = document.querySelectorAll('button[disabled][title="Прослушивание недоступно"]');

buttons.forEach(button => {
  const newButtonHTML = `
      <button class="btn btn-lg btn-outline-primary btn--icon-text songplay_btn play mb-0 ___adv-binded ___adv-click-stat ___adv-click-stat-stream ___adv-click-stat- ___adv-stream"
              data-url="/track/play/${songNumber}/${songName}.mp3"
              data-rbtified="true"
              data-rbtify-index="1">
        <i class="zmdi zmdi-play zmdi-hc-3x"></i>
        Слушать
      </button>
  `;
  button.outerHTML=newButtonHTML;
});
