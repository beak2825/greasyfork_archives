// ==UserScript==
// @name         Bypass 18+
// @description  Bypass 18+ checking forever
// @namespace    https://github.com/FlandreDaisuki
// @version      1.2.1
// @author       FlandreDaisuki
// @match        *://www.amazon.co.jp/*
// @match        *://gyutto.com/*
// @match        *://www.dlsite.com/*
// @match        *://ec.toranoana.jp/*
// @match        *://www.ptt.cc/*
// @match        *://www.melonbooks.co.jp/*
// @match        *://www.suruga-ya.jp/*
// @match        *://www.javlibrary.com/*
// @include      *://javdb*.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422827/Bypass%2018%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/422827/Bypass%2018%2B.meta.js
// ==/UserScript==

/* cSpell:ignore gyutto dlsite toranoana melonbooks javlibrary */
/* cSpell:ignore adflg adultchecked adalt suruga uniqid */
/* eslint-disable no-unused-expressions */

class CookieBuilder {
  constructor(k, v) {
    this['🍪'] = new Map([[k, v]]);
    this['🍪'].set('secure', '');
    this['🍪'].set('same-site', 'Lax');
    this['🚗'] = true;
  }
  expires() {
    this['🍪'].set('expires', new Date('2345-06-07T00:00:00').toGMTString());
    return this;
  }
  path(t = '/') {
    this['🍪'].set('path', t);
    return this.noPath();
  }
  noPath() {
    this['🚗'] = false;
    return this;
  }
  domain(t) {
    this['🍪'].set('domain', t);
    return this;
  }
  toString() {
    this.expires();
    if (this['🚗']) {
      this.path();
    }
    return [...this['🍪']].map((p) => p.join('=')).join('; ');
  }
  get ['⏰']() {
    document.cookie = this.toString();
    return 0;
  }
}

(() => {
  const bake = (...args) => new CookieBuilder(...args);
  const cookieMap = document.cookie.split('; ')
    .reduce((c, s) => {
      const i = s.indexOf('=');
      c.set(s.slice(0, i), s.slice(i + 1));
      return c;
    }, new Map());

  const host = location.host;
  const any = (...args) => args.some(Boolean);

  if (host === 'www.amazon.co.jp') {
    const t = cookieMap.get('session-token');
    if (!t) {
      fetch('/-/en/black-curtain/save-eligibility/black-curtain')
        .then(() => location.reload());
    }
    bake('session-token', t).domain('amazon.co.jp')['⏰'];
    return;
  }

  if (host === 'gyutto.com') {
    bake('adult_check_flag', 1).domain('gyutto.com')['⏰'];
    bake('user_agent_flag', 1).domain('gyutto.com')['⏰'];
    return;
  }

  if (host === 'www.dlsite.com') {
    bake('adultchecked', 1).domain('dlsite.com')['⏰'];
    bake('uniqid', '0.00000000000').domain('dlsite.com')['⏰'];
    return;
  }

  if (host === 'ec.toranoana.jp') {
    bake('adflg', 0).domain('ec.toranoana.jp')['⏰'];
    return;
  }

  if (host === 'www.melonbooks.co.jp') {
    bake('AUTH_ADULT', 1)['⏰'];
    return;
  }

  if (host === 'www.suruga-ya.jp') {
    bake('adult', 1)['⏰'];
    return;
  }

  if (host === 'www.javlibrary.com') {
    bake('over18', 18)['⏰'];
    return;
  }

  if (any(host === 'www.ptt.cc', host.startsWith('javdb'))) {
    bake('over18', 1)['⏰'];
    return;
  }
})();
