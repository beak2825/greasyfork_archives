// ==UserScript==
// @name       Unlock Hath Perks
// @name:zh-TW 解鎖 Hath Perks
// @name:zh-CN 解锁 Hath Perks
// @description       Unlock Hath Perks and add other helpers
// @description:zh-TW 解鎖 Hath Perks 及增加一些小工具
// @description:zh-CN 解锁 Hath Perks 及增加一些小工具
// @namespace   https://flandre.in/github
// @version     3.0.4
// @match       https://e-hentai.org/*
// @match       https://exhentai.org/*
// @icon        https://i.imgur.com/JsU0vTd.png
// @grant       GM_getValue
// @grant       GM_setValue
// @noframes
// @author      FlandreDaisuki
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/UnlockHathPerks/README.md
// @license     MPLv2
// @downloadURL https://update.greasyfork.org/scripts/34422/Unlock%20Hath%20Perks.user.js
// @updateURL https://update.greasyfork.org/scripts/34422/Unlock%20Hath%20Perks.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const noop = () => {};

  const $find = (el, selectors) => el.querySelector(selectors);
  const $ = (selectors) => document.querySelector(selectors);
  const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

  const $el = (tag, attr = {}, cb = noop) => {
    const el = document.createElement(tag);
    if (typeof(attr) === 'string') {
      el.textContent = attr;
    }
    else {
      Object.assign(el, attr);
    }
    cb(el);
    return el;
  };

  const $html = (htmlText) => {
    const tmpEl = $el('div');
    tmpEl.innerHTML = htmlText;
    return tmpEl.firstElementChild;
  };

  const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

  const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

  /* cSpell:ignore exhentai juicyads favcat searchnav favform */
  /* eslint-disable no-console */

  /** @type {{abg: boolean, mt: boolean, pe: boolean, fw: boolean}} */
  const uhpConfig = (() => {
    const _conf = Object.assign({ abg: true, mt: true, pe: true, fw: false }, GM_getValue('uhp') );
    GM_setValue('uhp', _conf);

    return new Proxy(_conf, {
      set(target, propertyKey, value){
        const r = Reflect.set(target, propertyKey, value);
        GM_setValue('uhp', _conf);
        return r;
      },
    });
  })();


  // #region Ads-Be-Gone
  if (uhpConfig.abg) {
    $style('iframe[src*="juicyads"] { display:none !important; }');
  }
  // #endregion Ads-Be-Gone

  // #region More Thumbs
  if (uhpConfig.mt) {
    (async() => {
      const u = new URL(location);
      if (!location.pathname.startsWith('/g/')){ return; }
      if (u.searchParams.get('report') === 'select'){ return; }
      if (u.searchParams.get('act') === 'expunge'){ return; }

      const NEXT_PAGE_SELECTOR = '.ptt td:last-child > a';
      const IMAGE_PARENT_SELECTOR = '#gdt';

      const imgParentEl = $(IMAGE_PARENT_SELECTOR);
      if (!imgParentEl){ return console.error('No imgParentEl'); }
      imgParentEl.innerHTML = '';

      /** @param {string} initUrl */
      async function *newPagedImgElsGen(initUrl) {
        let url = initUrl;
        /** @type {HTMLElement[]} */
        let imgEls = [];

        while (url) {
          const resp = await fetch(url, { credentials: 'same-origin' });

          url = '';
          imgEls = [];

          if (resp.ok) {
            const html = await resp.text();
            const docEl = (new DOMParser())
              .parseFromString(html, 'text/html')
              .documentElement;
            imgEls = Array.from($find(docEl, IMAGE_PARENT_SELECTOR)?.children ?? []);

            const nextEl = $find(docEl, NEXT_PAGE_SELECTOR);
            url = nextEl?.href ?? '';
          }

          yield imgEls;
        }

        return [];
      }

      const pagedImgEls = newPagedImgElsGen(location.href);

      const replaceResult = async(ob) => {
        const pagedImgElsResult = await pagedImgEls.next();
        if (pagedImgElsResult.done) {
          return ob.disconnect();
        }
        for (const imgEl of pagedImgElsResult.value) {
          if (!imgEl.classList.contains('c')) {
            imgParentEl.appendChild(imgEl);
          }
        }
      };
      let isIntersecting = false;
      const ob = new IntersectionObserver(async(entries) => {
        isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          do {
            await replaceResult(ob);
            await sleep(300);
          } while (isIntersecting);
        }
      });
      ob.observe($('table.ptb'));
    })();
  }
  // #endregion More Thumbs

  // #region Page Enlargement
  if (uhpConfig.pe) {
    (async() => {
      if (! $('input[name="f_search"]')) { return; }
      if (! $('.itg')) { return; }

      const isTableLayout = Boolean($('table.itg'));

      const NEXT_PAGE_SELECTOR = '.ptt td:last-child > a, .searchnav a[href*="next="]';
      const IMAGE_PARENT_SELECTOR = isTableLayout ? 'table.itg > tbody' : 'div.itg';

      const imgParentEl = $(IMAGE_PARENT_SELECTOR);
      if (!imgParentEl){ return console.error('No imgParentEl'); }
      imgParentEl.innerHTML = '';

      const statusEl = $el('h1', { textContent: 'Loading...', id: '🔓-status' });
      $('table.ptb, .itg + .searchnav, #favform + .searchnav').replaceWith(statusEl);

      /** @param {string} initUrl */
      async function *newPagedImgElsGen(initUrl) {
        let url = initUrl;
        /** @type {HTMLElement[]} */
        let imgEls = [];

        while (url) {
          const resp = await fetch(url, { credentials: 'same-origin' });

          url = '';
          imgEls = [];

          if (resp.ok) {
            const html = await resp.text();
            const docEl = (new DOMParser())
              .parseFromString(html, 'text/html')
              .documentElement;
            imgEls = Array.from($find(docEl, IMAGE_PARENT_SELECTOR)?.children ?? []);

            const nextEl = $find(docEl, NEXT_PAGE_SELECTOR);
            url = nextEl?.href ?? '';
          }

          yield imgEls;
        }

        return [];
      }

      const pagedImgEls = newPagedImgElsGen(location.href);
      const replaceResult = async(ob) => {
        const pagedImgElsResult = await pagedImgEls.next();
        if (pagedImgElsResult.done) {
          statusEl.textContent = 'End';
          return ob.disconnect();
        }
        for (const imgEl of pagedImgElsResult.value) {
          imgParentEl.appendChild(imgEl);
        }
      };
      let isIntersecting = false;
      const ob = new IntersectionObserver(async(entries) => {
        isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          do {
            await replaceResult(ob);
            await sleep(300);
          } while (isIntersecting);
        }
      });
      ob.observe(statusEl);
    })();
  }
  // #endregion Page Enlargement

  // #region Full Width

  if (uhpConfig.fw) {
    document.body.classList.add('🔓-full-width');
  }

  // #endregion Full Width

  // #region ubp dialog setup

  const uhpDialogEl = $el('dialog', { id: '🔓-dialog' });
  uhpDialogEl.className = (location.host === 'exhentai.org') ? 'dark' : '';
  uhpDialogEl.innerHTML = `
  <fieldset>
    <legend>Unlock Hath Perks</legend>
    <div role="group">

      <div class="option-grid">
        <label class="material-switch">
          <input type="checkbox" id="🔓-conf-abg" value="abg" />
        </label>
        <span class="🔓-conf-title">Ads-Be-Gone</span>
        <span class="🔓-conf-desc">Remove ads. You can use it with adblock webextensions.</span>
      </div>

      <div class="option-grid">
        <label class="material-switch">
          <input type="checkbox" id="🔓-conf-mt" value="mt" />
        </label>
        <span class="🔓-conf-title">More Thumbs</span>
        <span class="🔓-conf-desc">Scroll infinitely in gallery pages.</span>
      </div>

      <div class="option-grid">
        <label class="material-switch">
          <input type="checkbox" id="🔓-conf-pe" value="pe" />
        </label>
        <span class="🔓-conf-title">Page Enlargement</span>
        <span class="🔓-conf-desc">Scroll infinitely in search results pages.</span>
      </div>

      <div class="option-grid">
        <label class="material-switch">
          <input type="checkbox" id="🔓-conf-fw" value="fw" />
        </label>
        <span class="🔓-conf-title">Full Width</span>
        <span class="🔓-conf-desc">Utilize your monitor.</span>
      </div>

    </div>
  </fieldset>
`;
  uhpDialogEl.onclick = (evt) => {
    if (evt.target === uhpDialogEl) {
      uhpDialogEl.close();
      if (uhpDialogEl.dataset.hasChanged) {
        location.reload();
      }
    }
  };
  document.body.appendChild(uhpDialogEl);

  /** @type {HTMLInputElement[]} */
  const checkboxEls = $$('dialog#🔓-dialog input[type="checkbox"]');
  for (const checkboxEl of checkboxEls) {
    checkboxEl.checked = uhpConfig[checkboxEl.value];
    checkboxEl.onchange = () => {
      uhpConfig[checkboxEl.value] = checkboxEl.checked;
      uhpDialogEl.dataset.hasChanged = true;
    };
  }

  const nb = $('#nb');
  nb.appendChild(
    $html(`
    <div>
      <a id="🔓-entry" href="javascript:;">Unlock Hath Perks</a>
    </div>
  `),
  );

  $('a#🔓-entry').onclick = () => uhpDialogEl.showModal();
  // #endregion ubp dialog setup

  // #region override e-h style

  $style(`
/* nav bar */
#nb {
  width: initial;
  max-width: initial;
  max-height: initial;
  justify-content: center;
}

/* search input */
table.itc + p.nopm {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
input[name="f_search"] {
  width: 100%;
}

/* /favorites.php */
input[name="favcat"] + div {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 8px;
}

/* gallery grid */
.gl1t {
  display: flex;
  flex-flow: column;
}
.gl1t > .gl3t {
  flex: 1;
}
.gl1t > .gl3t > a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}`);

  // #endregion override e-h style

  // #region uhp style

  $style(`
#🔓-status {
  text-align: center;
  font-size: 3rem;
  clear: both;
  padding: 2rem 0;
}

#🔓-dialog {
  padding: 1.2rem;
  background-color: floralwhite;
  border-radius: 1rem;
  font-size: 1.4rem;
  color: darkred;
  max-width: 950px;

  &.dark {
    background-color: dimgray;
    color: ghostwhite;
  }

  fieldset > legend {
    font-size: 2rem;
  }

  .option-grid {
    display: grid;
    grid-template-columns: max-content 14rem 1fr;
    column-gap: 1rem;
    padding: 0.5rem 1rem;
    align-items: center;
  }
}

.🔓-full-width :where(#gdt, div.ido) {
  max-width: initial !important;
  margin: 1rem !important;
}

@supports (display:grid) {
  .🔓-full-width .gld {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 0.5rem;
  }
}

/* Modified https://bootsnipp.com/snippets/featured/material-design-switch */
label.material-switch > input[type="checkbox"] {
  display: none;
}

label.material-switch {
  display: inline-block;
  position: relative;
  margin: 6px;
  border-radius: 8px;
  width: 40px;
  height: 16px;
  opacity: 0.3;
  background-color: rgb(0, 0, 0);
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease-in-out;
  cursor: pointer;
}

label.material-switch::after {
  position: absolute;
  top: -4px;
  left: -4px;
  border-radius: 16px;
  width: 24px;
  height: 24px;
  content: "";
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}

label.material-switch:has(> input[type="checkbox"]:checked) {
  background-color: #0e0;
  opacity: 0.7;
}

label.material-switch:has(> input[type="checkbox"]:checked)::after {
  background-color: inherit;
  left: 20px;
}`);

  // #endregion uhp style

})();
