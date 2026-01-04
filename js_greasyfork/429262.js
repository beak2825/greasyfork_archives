// ==UserScript==
// @name        YouTube Live Event to Calendar
// @namespace   https://defaultcf.github.io
// @match       https://www.youtube.com/watch*
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @version     0.1.1
// @author      defaultcf
// @description YouTube Live Event to Calendar...but semi-automatic
// @downloadURL https://update.greasyfork.org/scripts/429262/YouTube%20Live%20Event%20to%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/429262/YouTube%20Live%20Event%20to%20Calendar.meta.js
// ==/UserScript==

'use strict';

(() => {
  const _debug = (...obj) => console.log('[YT Live Event to Calendar]', ...obj);

  class Utility {
    static get_body(url) {
      return new Promise(async resolve => {
        const res = await fetch(url, { cache: 'no-cache' });
        const raw_body = await res.text();
        const domparser = new DOMParser();
        const body = domparser.parseFromString(raw_body, 'text/html');
        resolve(body);
      });
    }

    static async get_metas(body) {
      const metas = {};
      await body.querySelectorAll('meta').forEach(meta => {
        const key = meta.getAttribute('name') || meta.getAttribute('itemprop');
        metas[key] = meta.content;
      });
      return metas;
    }

    static get_date_string(date) {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    static create_event(text, date, details, location) {
      date = new Date(date);
      const start_datetime = this.get_date_string(date);
      date.setHours(date.getHours() + 1);
      const end_datetime = this.get_date_string(date);
      const dates = `${start_datetime}/${end_datetime}`;
      const url = new URL('https://www.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', text);
      url.searchParams.append('dates', dates);
      url.searchParams.append('details', details);
      url.searchParams.append('location', location);
      GM_openInTab(url.href);
    }
  }

  const menu_event = async () => {
    const body = await Utility.get_body(document.location);
    const metas = await Utility.get_metas(body);
    Utility.create_event(
        metas['title'],
        metas['startDate'],
        metas['description'],
        `https://www.youtube.com/watch?v=${metas['videoId']}`,
    );
  }

  GM_registerMenuCommand('Add Google Calendar', menu_event);
})();
