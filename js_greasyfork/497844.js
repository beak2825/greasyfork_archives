// ==UserScript==
// @name            Twitch Bits-Off
// @name:ru         Twitch - Убрать Битсы 2024
// @namespace       https://mjkey.ru/
// @supportURL      https://www.donationalerts.com/r/mjk3y
// @version         24.06.16
// @description     Removes bits and gains in the channel points panel
// @description:ru  Убирает битсы и усиления в панели баллов канала
// @author          MjKey
// @license         MIT
// @match           *://*.twitch.tv/*
// @icon            https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png
// @grant           none
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/497844/Twitch%20Bits-Off.user.js
// @updateURL https://update.greasyfork.org/scripts/497844/Twitch%20Bits-Off.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const a = () => {
    const b = element => element.style.setProperty('display', 'none', 'important');

    const c = document.querySelector('.Layout-sc-1xcs6mc-0.kKpGeT');
    if (c && !c.querySelector('.channel-points-icon__image')) {
      b(c);
    }

    const d = document.querySelectorAll('.Layout-sc-1xcs6mc-0.cFdOrq');
    d.forEach(b);

    const e = document.querySelectorAll('.Layout-sc-1xcs6mc-0.kbdfeJ');
    e.forEach(element => {
      if (!element.querySelector('.Layout-sc-1xcs6mc-0.xxjeD')) {
          if(!element.querySelector('.live-time')){
              b(element);
          }
      }
    });

    const f = document.querySelectorAll('.Layout-sc-1xcs6mc-0.cxywwo');
    f.forEach(container => {
      const g = container.querySelector('.Layout-sc-1xcs6mc-0');
      if (g) {
        let h = g.previousSibling;
        while (h && h.nodeType !== Node.TEXT_NODE) {
          h = h.previousSibling;
        }
        if (h) {
          h.textContent = '';
        }
        container.querySelector('div.Layout-sc-1xcs6mc-0.ScTooltipWrapper-sc-31h4d9-0.cQRCoy.etwtmn.tw-tooltip-wrapper > div > div').remove();
      }
    });

    const i = document.querySelector('.Layout-sc-1xcs6mc-0.ftDwiu.rewards-list');
    if (i) {
      let j = 0;
      for (let div = i.firstChild; div; div = div.nextSibling) {
        if (div.classList && div.classList.contains('Layout-sc-1xcs6mc-0') && div.classList.contains('ZvPWT')) {
          j++;
          if (j > 1) break;
        }
        if (div.tagName === 'DIV') {
          b(div);
        }
      }
    }

    const k = document.querySelectorAll('.Layout-sc-1xcs6mc-0.czRfnU');
    k.forEach(element => {
      if (element.querySelector('[data-a-target="top-nav-get-bits-button"]')) {
        b(element);
      }
    });

    const l = document.querySelectorAll('.Layout-sc-1xcs6mc-0.emBnMs');
    l.forEach(m => {
      const n = m.querySelectorAll('.CoreText-sc-1txzju1-0.fLrMgR');
      n.forEach(o => {
        o.textContent = o.title = 'Награды';
      });
    });

    const z = document.querySelector('[data-a-target="bits-button"]');
    z && b(z);
  };

  a();
  const observer = new MutationObserver(a);
  observer.observe(document.body, { childList: true, subtree: true });
})();