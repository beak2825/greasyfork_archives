// ==UserScript==
// @name           Sabrina-Online.com – Colored Hi-res [Ath]
// @description    Sabrina-Online.com enhancements for old strips: always load hi-res images, load enhanced fan-colored images when available, keyboard navigation.
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2025–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.0.0
// @icon           https://www.google.com/s2/favicons?sz=64&domain=sabrina-online.com
// @match          *://*.sabrina-online.com/*
// @match          *://*.sabrinaonline2k.net/*
// @grant          unsafeWindow
// @grant          GM_info
// @run-at         document-start
// @require        https://cdn.jsdelivr.net/npm/string@3.3.3/dist/string.min.js
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.5.6/monkeyutils.u.min.js
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/536245/Sabrina-Onlinecom%20%E2%80%93%20Colored%20Hi-res%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/536245/Sabrina-Onlinecom%20%E2%80%93%20Colored%20Hi-res%20%5BAth%5D.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const scrollOpts = { behavior: 'smooth' };
  const colorSrcBase = "http://www.sabrinaonline2k.net/MHA/bigstrips";

  const { waitForDocumentReady, h, u, f, attempt, els } =
    //require("../@athari-monkeyutils/monkeyutils.u"); // TODO
    athari.monkeyutils;

  const eld = doc => els(doc, {
    strip: "img:is([src^='strips/'], [src*='/strips/'], [src^='../strips/'])",
    linkedStrip: "a[href^='strips/']:has(> img:is([src^='strips/'], [src*='/strips/'])), a[href^='../bigstrips']:has(> img[src^='../strips/'])",
    lnkPrevPage: "a:has(img[alt='back' i])", lnkNextPage: "a:has(img[alt='next' i])",
  }), el = eld(document);

  S.extendPrototype();
  console.debug("GM info", GM_info);

  await waitForDocumentReady();

  el.tag.head.insertAdjacentHTML('beforeEnd', /*html*/`
    <style>
      :root {
        color-scheme: light dark;
      }
      .ath-strip {
        display: grid;
        margin: 0 auto;
        img {
          grid-area: 1 / 1;
          display: block;
          max-width: calc(100vw - 140px);
          &.ath-image-bw {
            filter: url(#filter-bw);
          }
          &.ath-image-color {
            filter: url(#filter-color);
            mix-blend-mode: multiply;
          }
        }
        &:hover img.ath-image-color {
          opacity: 0;
        }
        + br {
          display: none;
        }
      }
      .ath-warn {
        position: absolute;
        inset: 8px 8px auto auto;
        text-align: right;
        font-size: .8rem;
        font-weight: bold;
        color: red;
        em {
          opacity: 0.6;
        }
      }
    </style>`);
  el.tag.body.insertAdjacentHTML('beforeEnd', /*html*/`
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <filter id="filter-bw">
      </filter>
      <filter id="filter-color">
        <feGaussianBlur stdDeviation="1" />
        <feMorphology operator="dilate" radius="1.5" />
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </svg>`);

  if (el.linkedStrip && location.protocol === 'https:') {
    el.tag.body.insertAdjacentHTML('beforeBegin', /*html*/`
      <p class="ath-warn">
        <a href="${location.href.replace("https:", "http:")}">Switch to HTTP</a>
        to access fan-colored strips<br>
        <em>(or enable insecure content in site options)</em>
      </p>`);
  }

  const onKeyDown = {
    'ArrowLeft': e => {
      if (!el.lnkPrevPage)
        return;
      e.preventDefault();
      location = el.lnkPrevPage.href;
    },
    'ArrowRight': e => {
      if (!el.lnkNextPage)
        return;
      e.preventDefault();
      location = el.lnkNextPage.href;
    },
    'Space': e => {
      if (el.strip) {
        const strips = el.all.strip.map(el => ({ el, rect: el.getBoundingClientRect() }));
        const currentStripIndex = strips.findIndex(s => s.rect.top >= -10);
        const currentStrip = strips[currentStripIndex];
        const nextStrip = strips[currentStripIndex + 1];
        if (currentStrip.rect.bottom > window.innerHeight) {
          e.preventDefault();
          if (currentStrip.rect.top > 0)
            currentStrip.el.scrollIntoView(scrollOpts);
          else
            window.scrollBy({ top: window.innerHeight, ...scrollOpts });
          return;
        }
        else if (nextStrip) {
          e.preventDefault();
          nextStrip.el.scrollIntoView(scrollOpts);
          return;
        }
      }
      if (el.lnkNextPage) {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) {
          e.preventDefault();
          location = el.lnkNextPage.href;
        }
      }
    },
  };

  const modKeys = [ 'Meta', 'Ctrl', 'Alt', 'Shift' ].map(k => [ `${k.toLowerCase()}Key`, k ]);
  const getKeyCode = e => [ e.key, e.code ].map(c => modKeys.reduce((a, [k, p]) => e[k] && !e.code.startsWith(p) ? `${p}+${a}` : a, c));
  document.addEventListener('keydown', e => {
    const [ key, code ] = getKeyCode(e);
    onKeyDown[key]?.(e);
    if (code !== key)
      onKeyDown[code]?.(e);
  });

  attempt("color images", () => {
    for (const elwStrip of el.wrap.all.linkedStrip) {
      const [ elLink, elImageBw ] = [ elwStrip.self, elwStrip.tag.img ];
      const bwSrc = elLink.href;
      const bwFileName = elLink.pathname.split("/").at(-1).replace("OnXmas", "OnlineXmas");
      const colorSrc = `${colorSrcBase}/${bwFileName.replace(/\.(gif|jpg)$/i, ".jpg")}`;
      elImageBw.src = bwSrc;
      elImageBw.classList.add('ath-image-bw');
      elLink.classList.add('ath-strip');
      if (location.hostname.includes('sabrina-online.com'))
        elLink.insertAdjacentHTML('beforeEnd', /*html*/`
          <img class="ath-image-color" alt="${h(elImageBw.alt)}" src="${h(colorSrc)}" onerror="this.remove()">`);
    }
  });
})();