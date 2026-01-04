// ==UserScript==
// @name         plurk_lib
// @description  An unofficial library for Plurk
// @version      0.1.1
// @license      MIT
// @namespace    https://github.com/stdai1016
// @include      https://www.plurk.com/*
// @exclude      https://www.plurk.com/_*
// ==/UserScript==

/* jshint esversion: 6 */

const plurklib = (function () { // eslint-disable-line
  'use strict';
  /* class */

  class PlurkRecord {
    constructor (target, type = null) {
      this.target = target;
      this.type = type;
      this.plurks = [];
    }
  }

  class PlurkObserver {
    /**
     *  @param {Function} callback
     */
    constructor (callback) {
      this._observe = false;
      this._mo_tl = new MutationObserver(function (mrs) {
        const records = [];
        mrs.forEach(mr => {
          const pr = new PlurkRecord(mr.target, 'plurk');
          mr.addedNodes.forEach(node => {
            const plurk = Plurk.analysisElement(node);
            if (plurk) pr.plurks.push(plurk);
          });
          if (pr.plurks.length) records.push(pr);
        });
        callback(records);
      });
      this._mo_resp = new MutationObserver(function (mrs) {
        const records = [];
        mrs.forEach(mr => {
          const pr = new PlurkRecord(mr.target, 'plurk');
          mr.addedNodes.forEach(node => {
            const plurk = Plurk.analysisElement(node);
            if (plurk) pr.plurks.push(plurk);
          });
          if (pr.plurks.length) records.push(pr);
        });
        callback(records);
      });
    }

    observe (options = { plurk: false }) {
      if (options?.plurk) {
        this._observe = true;
        getElementAsync('#timeline_cnt .block_cnt', document) // timeline
          .then(tl => this._mo_tl.observe(tl, { childList: true }), e => {});
        getElementAsync('#cbox_response .list', document) // pop window
          .then(list => this._mo_resp.observe(list, { childList: true }));
        getElementAsync('#form_holder .list', document) // resp in timeline
          .then(list => this._mo_resp.observe(list, { childList: true }));
        // resp in article
        getElementAsync('#plurk_responses .list', document).then(
          list => this._mo_resp.observe(list, { childList: true }),
          e => {}
        );
      }
      if (!this._observe) throw Error();
    }

    disconnect () {
      this._mo_tl.disconnect();
      this._mo_resp.disconnect();
    }
  }

  class Plurk {
    /**
     * @param {object} pdata
     */
    constructor (pdata, target) {
      Plurk.ATTRIBUTES.forEach(a => { this[a] = pdata[a]; });
      this.target = target;
    }

    get isMute () { return this.is_unread === 2; }

    get isResponse () { return this.id !== this.plurk_id; }

    get isReplurk () {
      return !this.isResponse && this.user_id !== this.owner_id;
    }

    /**
     *  @param {HTMLElement} node
     *  @returns {Plurk}
     */
    static analysisElement (node) {
      if (!node.classList.contains('plurk')) return null;
      return new Plurk(analysisElement(node), node);
    }
  }

  /* eslint-disable no-multi-spaces */
  /** attributes for plurk | response */
  Plurk.ATTRIBUTES = [
    'owner_id',         // posted by
    'plurk_id',         // the plurk | the plurk that the response belongs to
    'user_id',          // which timeline does this Plurk belong to | unused
    'replurker_id',     // replurked by | unused
    'id',               // plurk id | response id
    'qualifier',        // qualifier
    'content',          // HTMLElement if exist
    // 'content_raw',
    // 'lang',
    'posted',           // the date this plurk was posted
    'last_edited',      // the last date this plurk was edited

    'plurk_type',       // 0: public, 1: private, 4: anonymous | unused
    // 'limited_to',
    // 'excluded',
    // 'publish_to_followers',
    // 'no_comments',
    'porn',             // has 'porn' tag | unused
    'anonymous',        // is anonymous

    'is_unread',        // 0: read, 1: unread, 2: muted  | unused
    // 'has_gift',      // current user sent a gift?
    'coins',            // number of users sent gift
    'favorite',         // favorited by current user
    'favorite_count',   // number of users favorite it
    // 'favorers',      // favorers
    'replurked',        // replurked by current user
    'replurkers_count', // number of users replurked it
    // 'replurkers',    // replurkers
    'replurkable',      // replurkable
    // 'responded',     // responded by current user
    'response_count'    // number of responses | unused
    // 'responses_seen',
    // 'bookmark',
    // 'mentioned'      // current user is mentioned
  ];
  /* eslist-enable */

  function getElementAsync (selectors, target, timeout = 100) {
    return new Promise((resolve, reject) => {
      const i = setTimeout(function () {
        stop();
        const el = target.querySelector(selectors);
        if (el) resolve(el);
        else reject(Error(`get "${selectors}" timeout`));
      }, timeout);
      const mo = new MutationObserver(r => r.forEach(mu => {
        const el = mu.target.querySelector(selectors);
        if (el) { stop(); resolve(el); }
      }));
      mo.observe(target, { childList: true, subtree: true });
      function stop () { clearTimeout(i); mo.disconnect(); }
    });
  }

  /**
   *  @param {HTMLElement} node
   *  @returns {object}
   */
  function analysisElement (node) {
    const user = node.querySelector('.td_qual a.name') ||
                 node.querySelector('.user a.name');
    const posted = node.querySelector('.posted');
    const isResponse = node.classList.contains('response');
    const isReplurk = !isResponse && user.dataset.uid !== node.dataset.uid;
    return {
      owner_id: parseInt(node.dataset.uid || user.dataset.uid),
      plurk_id: parseInt(node.dataset.pid),
      user_id: getPageUserData()?.id || parseInt(user.dataset.uid),
      posted: posted ? new Date(posted.dataset.posted) : null,
      replurker_id: isReplurk ? parseInt(user.dataset.uid) : null,
      id: parseInt(node.id.substr(1) || node.dataset.rid || node.dataset.pid),
      qualifier: (function () {
        const qualifier = node.querySelector('.text_holder .qualifier') ||
                          node.querySelector('.qualifier');
        for (const c of qualifier?.classList || []) {
          if (!c.startsWith('q_') || c === 'q_replurks') continue;
          return c.substr(2);
        }
        return ':';
      })(),
      content: node.querySelector('.text_holder .text_holder') ||
               node.querySelector('.text_holder'),
      // content_raw,
      // lang,
      response_count: parseInt(node.dataset.respcount) || 0,
      // responses_seen,
      // limited_to,
      // excluded,
      // no_comments,
      plurk_type: (function () {
        if (node.dataset.uid === '99999') return 4;
        if (node.querySelector('.private')) return 1;
        return 0;
      })(),
      is_unread: (function () {
        if (node.classList.contains('mute')) return 2;
        if (node.classList.contains('new')) return 1;
        return 0;
      })(),
      last_edited: posted?.dataset.edited
        ? new Date(posted.dataset.edited)
        : null,
      porn: node.classList.contains('porn'),
      // publish_to_followers,
      coins: parseInt(node.querySelector('a.gift')?.innerText) || 0,
      // has_gift,
      replurked: node.classList.contains('replurk'),
      // replurkers,
      replurkers_count:
        parseInt(node.querySelector('a.replurk')?.innerText) || 0,
      replurkable: node.querySelector('a.replurk') !== null,
      // favorers,
      favorite_count: parseInt(node.querySelector('a.like')?.innerText) || 0,
      anonymous: node.dataset.uid === '99999',
      // responded,
      favorite: node.classList.contains('favorite')
      // bookmark,
      // mentioned
    };
  }

  const _GLOBAL = (function () {
    function cp (o) {
      const n = {};
      for (const k in o) {
        if (o[k] instanceof Date) n[k] = new Date(o[k]);
        else if (typeof o[k] !== 'object') n[k] = o[k];
        else n[k] = cp(o[k]);
      }
      return n;
    }
    if (typeof unsafeWindow === 'undefined') {
      if (window.GLOBAL) return cp(window.GLOBAL);// eslint-disable-line
    // eslint-disable-next-line
    } else if (unsafeWindow.GLOBAL) return cp(unsafeWindow.GLOBAL);
    for (const scr of document.querySelectorAll('script')) {
      try {
        const text = scr.textContent
          .replace(/new Date\("([\w ,:]+)"\)/g, '"new Date(\\"$1\\")"');
        const i = text.indexOf('var GLOBAL = {');
        return (function dd (o) {
          for (const k in o) {
            if (typeof o[k] === 'object') dd(o[k]);
            else if (typeof o[k] === 'string' && o[k].startsWith('new Date')) {
              const m = o[k].match(/new Date\("([\w ,:]+)"\)/);
              o[k] = m ? new Date(m[1]) : null;
            }
          }
          return o;
        })(JSON.parse(text.substring(i + 13, text.indexOf('\n', i))));
      } catch {}
    }
  })();

  /**
   *  @returns {object}
   */
  function getUserData () { return _GLOBAL?.session_user; }

  /**
   *  @returns {object}
   */
  function getPageUserData () { return _GLOBAL?.page_user; }

  /* ## API */
  /**
   *  @param {string} path
   *  @param {object} options
   *  @returns {Promise<any>}
   */
  async function callApi (path, options = null) {
    options = options || {};
    let body = '';
    for (const k in options) {
      body += `&${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`;
    }
    body = body.substr(1);
    const init = { method: 'POST', credentials: 'same-origin' };
    if (body.length) {
      init.body = body;
      init.headers = { 'content-type': 'application/x-www-form-urlencoded' };
    }
    path = path.startsWith('/') ? path : '/' + path;
    const resp = await fetch(`https://www.plurk.com${path}`, init);
    if (!resp.ok) {
      throw Error(`${resp.status} ${resp.statusText}: ${await resp.text()}`);
    }
    return resp.json();
  }

  /* ### Notifications */
  /**
   *  @param {number} limit
   *  @param {string|number|Date} offset
   *  @returns {Promise<object>}
   */
  async function getNotificationsMixed2 (limit = 20, offset = null) {
    const options = { limit: limit };
    if (offset) options.offset = (new Date(offset)).toISOString();
    return callApi('/Notifications/getMixed2', options);
  }

  /* ### Responses */
  async function getResponses (plurkId, from = 0) {
    return callApi('/Responses/get',
      { plurk_id: plurkId, from_response_id: from });
  }
  /* ### Users */
  async function fetchUserAliases () {
    return callApi('/Users/fetchUserAliases');
  }
  /**
   *  @param {number|string} userIdOrNickName
   *  @returns {Promise<object>}
   */
  async function fetchUserInfo (userIdOrNickName) {
    let id = null;
    if (/^\d+$/.test(`${userIdOrNickName}`)) id = `${userIdOrNickName}`;
    else {
      const resp = await fetch(`https://www.plurk.com/${userIdOrNickName}`);
      const html = resp.ok ? (await resp.text()) : '';
      const doc = (new DOMParser()).parseFromString(html, 'text/html');
      for (const scr of doc.head.querySelectorAll('script:not([src])')) {
        const i = scr.textContent.indexOf('"page_user"');
        if (i < 0) continue;
        const text = scr.textContent.substr(i, 128);
        id = text.match(/"id" *: *(\d+) *,/)?.[1];
        if (id) break;
      }
    }
    return callApi('/Users/fetchUserInfo', { user_id: id });
  }

  /**
   *  @param {number} userId
   *  @returns {Promise<string[]>}
   */
  async function getCustomCss (userId = null) {
    userId = userId || getPageUserData().id;
    const url = `https://www.plurk.com/Users/getCustomCss?user_id=${userId}`;
    const rules = await (await fetch(url)).text();
    return rules.split(/\r?\n/);
  }

  return {
    Plurk: Plurk,
    PlurkRecord: PlurkRecord,
    PlurkObserver: PlurkObserver,
    getUserData: getUserData,
    getPageUserData: getPageUserData,
    callApi: callApi,
    getNotificationsMixed2: getNotificationsMixed2,
    fetchUserAliases: fetchUserAliases,
    fetchUserInfo: fetchUserInfo,
    getResponses: getResponses,
    getCustomCss: getCustomCss
  };
})();
