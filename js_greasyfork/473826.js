// ==UserScript==
// @name                RFE/RL direct media links
// @namespace           https://greasyfork.org/users/1129435
// @version             1.0.1
// @description         Adds direct links to media files in all available formats under players on RFE/RL sites
// @description:ru      Добавляет прямые ссылки на медиафайлы во всех доступных форматах под плеерами на сайтах Радио Свобода
// @copyright           2023 sha512:e5ca548d21f145140a0cd0e4f9835c768807ae58f546796644704c0b426485210f81984b81a271a726d56e4baff4232fa642efc4b60a1abc905e46900b521d4f
// @license             MPL-2.0
// @icon                https://www.google.com/s2/favicons?sz=64&domain=www.rferl.org
// @match               https://*.rferl.org/*
// @match               https://*.currenttime.tv/*
// @match               https://*.svaboda.org/*
// @match               https://*.radiosvoboda.org/*
// @match               https://*.krymr.com/*
// @match               https://*.szabadeuropa.hu/*
// @match               https://*.europalibera.org/*
// @match               https://*.svobodnaevropa.bg/*
// @match               https://*.slobodnaevropa.org/*
// @match               https://*.slobodnaevropa.mk/*
// @match               https://*.evropaelire.org/*
// @match               https://*.svoboda.org/*
// @match               https://*.severreal.org/*
// @match               https://*.sibreal.org/*
// @match               https://*.azatliq.org/*
// @match               https://*.idelreal.org/*
// @match               https://*.kavkazr.com/*
// @match               https://*.radiomarsho.com/*
// @match               https://*.azatutyun.am/*
// @match               https://*.azadliq.org/*
// @match               https://*.radiotavisupleba.ge/*
// @match               https://*.ekhokavkaza.com/*
// @match               https://*.radiofarda.com/*
// @match               https://*.azattyq.org/*
// @match               https://*.azattyk.org/*
// @match               https://*.ozodi.org/*
// @match               https://*.azathabar.com/*
// @match               https://*.ozodlik.org/*
// @match               https://*.azadiradio.com/*
// @match               https://*.mashaalradio.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/473826/RFERL%20direct%20media%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/473826/RFERL%20direct%20media%20links.meta.js
// ==/UserScript==
// RFE/RL sites: https://www.rferl.org/navigation/allsites

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

(function () {
  'use strict';

  let style = document.createElement('style');
  style.textContent = `\
    .media-links {
      margin-top: 1ex;
    }
    .media-links > a {
      margin-left: 2ex;
    }
    .media-links::before {
      content: '🔗';
    }
  `;
  document.body.append(style);

  let mediaList = document.querySelectorAll('video, audio');
  for (let media of mediaList) {
    try {
      let mediaLinks = document.createElement('div');
      mediaLinks.classList.add('media-links');
      media.closest('.c-sticky-container').after(mediaLinks);

      let sources = JSON.parse(media.dataset.sources);
      for (let source of sources) {
        if (!/^(video|audio)\//g.test(source.Type)) continue;
        let link = document.createElement('a');
        link.textContent = source.DataInfo;
        link.href = source.Src;
        mediaLinks.append(link);
      }
    } catch (err) { }
  }
})();
