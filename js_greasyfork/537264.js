// ==UserScript==
// @name         kemono.su - Fix Username Display
// @name:ja      kemono.su - ユーザー名表示修正
// @name:zh-TW   kemono.su - 修正使用者名稱顯示
// @namespace    none
// @version      1.0
// @description  Display Pixiv/Fanbox usernames with auto-correction, customization.
// @description:ja Pixiv/Fanboxのユーザー名を自動補正・カスタマイズ表示します。
// @description:zh-TW 顯示 Pixiv/Fanbox 使用者名稱，支援自動補正與自訂。
// @match        https://kemono.su/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537264/kemonosu%20-%20Fix%20Username%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/537264/kemonosu%20-%20Fix%20Username%20Display.meta.js
// ==/UserScript==

// ==/UserScript==

(async function () {
  'use strict';

  GM_addStyle(`
    .name_edit, .name_org, .user-card__stats {
      user-select: none !important;
    }
  `);

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(main, 500);
    }
  }, 500);

  if (!location.pathname.startsWith('/artists')) {
    preloadArtists();
  }

  function preloadArtists() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://kemono.su/artists';
    iframe.style = 'width:0;height:0;border:0;position:fixed;left:-9999px;';
    iframe.onload = () => setTimeout(() => iframe.remove(), 3000);
    document.body.appendChild(iframe);
  }

  async function main() {
    let name = document.querySelector('.user-header__profile [itemprop="name"], .post__user-name');
    if (name) fix_header(name);

    const cards = document.querySelectorAll('.user-card:not([data-fixed])');
    for (const card of cards) {
      card.dataset.fixed = 'true';
      await fix_card(card);
    }

    const lists = document.querySelectorAll('.card-list__items');
    for (const list of lists) {
      new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(node => {
        if (node.classList?.contains('user-card') && !node.dataset.fixed) {
          node.dataset.fixed = 'true';
          fix_card(node);
        }
      }))).observe(list, { childList: true });
    }
  }

  async function fix_card(card) {
    try {
      const nameElem = card.querySelector('.user-card__name');
      if (!nameElem) return;

      let href = nameElem.getAttribute('href') || card.getAttribute('href');
      if (!href) return;

      let match = href.match(/\/(\w+)\/user\/(\d+)/);
      if (!match) return;

      const site = match[1];
      const id = match[2];

      nameElem.href = href;
      nameElem.target = '_blank';
      card.setAttribute('href', href);
      card.classList.add('user-card--clickable');

      nameElem.addEventListener('copy', (e) => {
        e.preventDefault();
        e.clipboardData.setData('text/plain', nameElem.textContent.trim());
      });

      await fix_name(nameElem, id, site);
    } catch (e) {
      console.error('fix_card error:', e);
    }
  }

  function fix_header(nameElem) {
    const match = location.href.match(/\/(\w+)\/user\/(\d+)/);
    if (!match) return;
    const site = match[1];
    const id = match[2];
    fix_name(nameElem, id, site);
  }

  async function fix_name(nameElem, id, site) {
    const original = nameElem.innerText.trim();
    let fixed = (await GM_getValue(site, {}))[id];

    if (site === 'fanbox' && !fixed) {
      fixed = await GM_getValue(id);
      if (!fixed) {
        fixed = await get_pixiv_name(id) || original;
        save_name(id, fixed, site);
      }
    }

    if (fixed && fixed !== original) {
      nameElem.innerText = fixed;
      nameElem.classList.add('highlight');

      const org = document.createElement('span');
      org.textContent = ` (${original})`;
      org.className = 'name_org';
      nameElem.after(org);
    }

    if (!nameElem.nextSibling?.classList?.contains('name_edit')) {
      const edit = document.createElement('span');
      edit.textContent = ' ✎';
      edit.className = 'name_edit';
      edit.style = 'cursor:pointer;color:#0af;margin-left:6px;';
      edit.onclick = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        const newName = prompt('Enter custom name', fixed || original);
        if (newName) {
          await save_name(id, newName.trim(), site);
          nameElem.innerText = newName.trim();
          nameElem.after(edit);
        }
      };
      nameElem.after(edit);
    }
  }

  async function get_pixiv_name(id) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.pixiv.net/ajax/user/${id}?full=1&lang=ja`,
        headers: { referer: "https://www.pixiv.net/" },
        onload: res => {
          try {
            const json = JSON.parse(res.responseText);
            resolve(json.body?.name?.trim() || null);
          } catch {
            resolve(null);
          }
        },
        onerror: () => resolve(null)
      });
    });
  }

  async function save_name(id, name, site) {
    const bySite = await GM_getValue(site, {});
    bySite[id] = name;
    await GM_setValue(site, bySite);
    await GM_setValue(id, name);
  }

  main();
})();
