// ==UserScript==
// @name        TrackingParameterRemover
// @namespace   https://htsign.hateblo.jp
// @version     20250922-rev0
// @description remove tracking parameters
// @author      htsign
// @match       *://*/*
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/489565/TrackingParameterRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/489565/TrackingParameterRemover.meta.js
// ==/UserScript==

const TRACKING_TAGS = [
  '#?utm_campaign',
  '#?utm_content',
  '#?utm_int',
  '#?utm_medium',
  '#?utm_source',
  '_hsmi',
  '_openstat',
  'action_object_map',
  'action_ref_map',
  'action_type_map',
  'fb_action_ids',
  'fb_action_types',
  'fb_ref',
  'fb_source',
  'ga_campaign',
  'ga_content',
  'ga_medium',
  'ga_place',
  'ga_source',
  'ga_term',
  'gs_l',
  'guccounter',
  'guce_referrer',
  'guce_referrer_sig',
  'gws_rd',
  'hmb_campaign',
  'hmb_medium',
  'hmb_source',
  'ref_src',
  'ref_url',
  'utm_campaign',
  'utm_cid',
  'utm_content',
  'utm_int',
  'utm_language',
  'utm_medium',
  'utm_name',
  'utm_place',
  'utm_pubreferrer',
  'utm_reader',
  'utm_source',
  'utm_swu',
  'utm_term',
  'utm_userid',
  'utm_viz_id',
  'yclid',
  'cx_part@www.afpbb.com',
  'cx_position@www.afpbb.com',
  '_encoding@amazon.*',
  'linkCode@amazon.*',
  'linkId@amazon.*',
  'pd_rd_*@amazon.*',
  'psc@amazon.*',
  'qid@amazon.*',
  'sbo@amazon.*',
  'sprefix@amazon.*',
  'sr@amazon.*',
  'tag@amazon.*',
  'mkt_tok@www.amd.com',
  'rm@digital.asahi.com',
  'iref@www.asahi.com',
  'ref@www.asahi.com',
  'spJobID@www.asahi.com',
  'spMailingID@www.asahi.com',
  'spReportId@www.asahi.com',
  'spUserID@www.asahi.com',
  'callback@bilibili.com',
  'cvid@bing.com',
  'form@bing.com',
  'pq@bing.com',
  'qs@bing.com',
  'sc@bing.com',
  'sk@bing.com',
  'sp@bing.com',
  'algorithm@www.change.org',
  'grid_position@www.change.org',
  'algorithm@www.change.org',
  'grid_position@www.change.org',
  'j@www.change.org',
  'jb@www.change.org',
  'l@www.change.org',
  'mid@www.change.org',
  'original_footer_petition_id@www.change.org',
  'placement@www.change.org',
  'pt@www.change.org',
  'sfmc_sub@www.change.org',
  'source_location@www.change.org',
  'u@www.change.org',
  'bi?@google.*',
  'client@google.*',
  'dpr@google.*',
  'ei@google.*',
  'gws_rd@google.*',
  'oq@google.*',
  'sa@google.*',
  'sei@google.*',
  'source@google.*',
  'ved@google.*',
  'ncid@huffingtonpost.jp',
  'fbclid@itmedia.co.jp',
  'word_result@nhk.or.jp',
  'n_cid@nikkeibp.co.jp',
  'n_cid@nikkei.com',
  'position@sourceforge.net',
  'source@sourceforge.net',
  's@x.com',
  't@x.com',
  'feature@youtube.com',
  'gclid@youtube.com',
  'kw@youtube.com',
];

const createStyle = params => {
  const toKebab = s => s.replace(/(?<=[a-z])[A-Z]/g, m => `-${m.toLowerCase()}`);
  return Object.entries(params)
    .map(([key, val]) => `${toKebab(key)}: ${val};`)
    .join('; ');
};

const createWrapper = () => {
  const PADDING = 20;

  const wrapper = Object.assign(
    document.createElement('div'),
    {
      style: createStyle({
        position: 'fixed',
        width: 'fit-content',
        maxHeight: 'fit-content',
        left: `${PADDING}px`,
        top: `${PADDING}px`,
        zIndex: 2 ** 31 - 1,
      }),
    },
  );
  return document.body.appendChild(wrapper);
};

GM_registerMenuCommand('open settings', async ev => {
  const wrapper = createWrapper();
  const shadowRoot = wrapper.attachShadow({ mode: 'open' });
  const css = `
    :host {
      background-color: white;
      border: 2px solid #777;
      max-width: 600px;

      @media (prefers-color-scheme: dark) {
        background-color: #333;
      }
    }
    #list {
      display: block;
      white-space: pre;
      width: 400px;
      height: max(50vh, 600px);
    }
    #help {
      font: 16px sans-serif;
    }
    #help_pre {
      font: 14px monospace;
      line-height: 1;
    }
    #controller {
      display: flex;
      justify-content: space-between;
    }
    #content_controller {
      display: flex;
    }
    #reset_button {
      background-color: rgb(64 0 0);
    }
  `;

  /** @type {string[]} */
  const trackingTags = GM_getValue('tracking_tags', TRACKING_TAGS);

  const listArea = Object.assign(document.createElement('textarea'), {
    id: 'list',
    value: trackingTags.join('\n'),
  });
  const controllerBar = Object.assign(document.createElement('div'), { id: 'controller' });
  const contentController = Object.assign(document.createElement('div'), { id: 'content_controller' });
  const resetButton = Object.assign(document.createElement('button'), {
    id: 'reset_button',
    onclick() {
      listArea.value = trackingTags.join('\n');
    },
    textContent: 'Reset',
  });
  const confirmButton = Object.assign(document.createElement('button'), {
    id: 'confirm_button',
    onclick() {
      GM_setValue('tracking_tags', listArea.value.split('\n'));
    },
    textContent: 'Save',
  });
  const sortButton = Object.assign(document.createElement('button'), {
    id: 'sort_button',
    onclick() {
      listArea.value = listArea.value.split('\n').sort((a, b) => {
        if (a === b) return 0;

        const aContainsAt = a.includes('@');
        const bContainsAt = b.includes('@');

        if (!aContainsAt) {
          if (!bContainsAt) {
            return a < b ? -1 : 1;
          }
          return -1;
        }
        else if (!bContainsAt) {
          return 1;
        }

        const [aKey, aHost] = a.split('@');
        const [bKey, bHost] = b.split('@');
        if (aHost === bHost) {
          return aKey < bKey ? -1 : 1;
        }

        const aDomains = aHost.split('.').reverse();
        const bDomains = bHost.split('.').reverse();
        for (let i = 0; ; ++i) {
          const a = aDomains[i];
          const b = bDomains[i];

          if (a === b) continue;
          else if (a === undefined) return -1;
          else if (b === undefined) return 1;
          return a < b ? -1 : 1;
        }
      }).join('\n');
    },
    textContent: 'Sort',
  });
  const closeButton = Object.assign(document.createElement('button'), {
    onclick() {
      wrapper.remove();
    },
    textContent: 'Close',
  });

  const help = Object.assign(document.createElement('details'), { id: 'help' });
  help.append(
    Object.assign(document.createElement('summary'), { textContent: 'Help' }),
    Object.assign(document.createElement('pre'), {
      id: 'help_pre',
      textContent: `
standard style:

- <parameter-name>[@<host>[/<path>]]

  - e.g. "utm_source"
  - e.g. "utm_source@twitter.com"

for hash keywords:

- #?<parameter-name>[@<host>[/<path>]]

others:

- blank lines are ignored
- placing "//" at the beginning of a line causes that line to be ignored
      `.trim(),
    }),
  );

  contentController.append(resetButton, confirmButton, sortButton);
  controllerBar.append(contentController, closeButton);

  shadowRoot.append(listArea, help, controllerBar);
  shadowRoot.adoptedStyleSheets = [await new CSSStyleSheet().replace(css)];
});

(function() {
  'use strict';

  /**
   * @param {Location} loc
   * @returns {{ url: string, locationChanged: boolean }}
   */
  const removeTracking = loc => {
    let locationChanged = false;
    const escapables = Object.freeze({
      '.': '\.',
    });
    const wildcardCharacters = Object.freeze({
      '*': '.*',
      '?': '.',
    });
    const wildcardKeys = Object.keys(wildcardCharacters);

    /**
     * @param {string} pattern
     * @returns {RegExp}
     */
    const toRegExp = pattern => {
      /**
       *
       * @param {Record<string, string>} table
       * @param {string} s
       * @returns {string}
       */
      const replace = (table, s) => Object.entries(table).reduce((acc, [f, t]) => acc.split(f).join(t), s);

      const sanitized = replace(escapables, pattern);
      const inner = replace(wildcardCharacters, sanitized);
      return new RegExp('^' + inner + '$', 'i');
    };

    /**
     *
     * @param {string} pattern
     * @param {string} s
     * @returns {boolean}
     */
    const match = (pattern, s) => {
      if (wildcardKeys.some(c => pattern.includes(c))) {
        return toRegExp(pattern).test(s);
      }
      return pattern === s;
    };

    /**
     * @param {string} domain
     * @param {URLSearchParams} params
     * @param {string} pattern
     * @returns {string}
     */
    const deleteKeys = (domain, params, pattern) => {
      if (!domain || loc.hostname.split('.').some((_, i, arr) => match(domain, arr.slice(i).join('.')))) {
        for (const [key] of params) {
          if (match(pattern, key)) {
            params.delete(key);
            locationChanged = true;
          }
        }
      }
      return params.toString().split('%25').join('%');
    };

    /**
     * @param {string} search
     * @param {() => boolean} condition
     * @param {(arg: URLSearchParams) => any} callback
     * @returns {void}
     */
    const proc = (search, condition, callback) => {
      const params = new URLSearchParams(search);
      if (params.size === 0) return;
      if (!condition()) return;
      callback(params);
    };

    const url = new URL(loc);
    url.search = url.search.split('%25').join('\0'); // avoid to escape of original '%25'
    GM_getValue('tracking_tags', TRACKING_TAGS).forEach(tag => {
      if (tag === '' || tag.startsWith('//')) return;

      const [t, domain, pathname] = tag.split(/[@\/]/);

      if (t.startsWith('#?')) {
        proc(
          url.hash.slice(1),
          () => pathname == null || url.pathname === `/${pathname}`,
          params => {
            url.hash = deleteKeys(domain, params, t.slice(2));
          },
        );
      }
      else {
        if (!url.search) return;

        proc(
          url.search.slice(1).replace(/%(?!25)/g, '%25'),
          () => pathname == null || url.pathname === `/${pathname}`,
          params => {
            url.search = deleteKeys(domain, params, t);
          },
        );
      }
    });
    url.search = url.search.split('%00').join('%25'); // restore original '%25'
    return { url: url.href, locationChanged };
  };

  const { url, locationChanged } = removeTracking(location);
  if (locationChanged) {
    console.info(`TrackingParameterRemover: {${location.href}} => {${url}}`);
    location.replace(url);
  }
}());
