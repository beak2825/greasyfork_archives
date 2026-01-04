// ==UserScript==
// @name         ExEveryDay
// @namespace    https://github.com/FlandreDaisuki
// @description  It is the dawn of a new day!
// @version      1.0
// @author       FlandreDaisuki
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377384/ExEveryDay.user.js
// @updateURL https://update.greasyfork.org/scripts/377384/ExEveryDay.meta.js
// ==/UserScript==

const DAY_MS = 86400 * 1e3;

class Cookie {
  constructor(cookie = document.cookie) {
    this.map = document.cookie.split('; ')
      .reduce((c, s) => {
      const i = s.indexOf('=');
      c.set(s.slice(0, i), s.slice(i + 1));
      return c;
    }, new Map());
  }

  get id() {
    return this.map.get('ipb_member_id');
  }

  toString() {
    return [...this.map.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }
}

const cookie = new Cookie;

const lastDate = new Date(GM_getValue(cookie.id, new Date().toJSON()));
const dateDiff = Date.now() - lastDate;

const onerror = (resp) => {
  console.error('ExEveryDay', resp);
}

const onload = (resp) => {
  console.info('ExEveryDay', resp);
  if(resp.responseText.match(/It is the dawn of a new day/g)) {
    GM_setValue(cookie.id, new Date().toJSON());
  }
}

if(dateDiff > DAY_MS || dateDiff === 0) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://e-hentai.org/news.php',
    headers: {
      Cookie: cookie.toString(),
    },
    onload,
    onerror,
  });
}
