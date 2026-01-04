// ==UserScript==
// @name        ExploitedX Sites - Release Codes
// @author      peolic
// @version     1.6
// @description Episode numbers for ExploitedX sites.
// @namespace   https://github.com/peolic
// ===== Exploited College Girls
// @match       http*://*.exploitedcollegegirls.com/
// @match       http*://*.exploitedcollegegirls.com/models/*
// @match       http*://*.exploitedcollegegirls.com/categories/movies_*
// @match       http*://*.exploitedcollegegirls.com/updates/page_*
// ===== Backroom Casting Couch
// @match       http*://*.backroomcastingcouch.com/
// @match       http*://*.backroomcastingcouch.com/models/*
// @match       http*://*.backroomcastingcouch.com/categories/movies_*
// @match       http*://*.backroomcastingcouch.com/updates/page_*
// ===== Black Ambush
// @match       http*://*.blackambush.com/
// @match       http*://*.blackambush.com/models/*
// @match       http*://*.blackambush.com/categories/movies_*
// @match       http*://*.blackambush.com/updates/page_*
// ===== BBC Surprise
// @match       http*://*.bbcsurprise.com/
// @match       http*://*.bbcsurprise.com/models/*
// @match       http*://*.bbcsurprise.com/categories/movies_*
// @match       http*://*.bbcsurprise.com/updates/page_*
// ===== Hot MILFs Fuck
// @match       http*://*.hotmilfsfuck.com/
// @match       http*://*.hotmilfsfuck.com/models/*
// @match       http*://*.hotmilfsfuck.com/categories/movies_*
// @match       http*://*.hotmilfsfuck.com/updates/page_*
// ===== ExCoGi Girls
// @match       http*://*.excogigirls.com/
// @match       http*://*.excogigirls.com/models/*
// @match       http*://*.excogigirls.com/categories/movies_*
// @match       http*://*.excogigirls.com/updates/page_*
// =====
// @grant       none
// @homepageURL https://github.com/peolic/userscripts
// @downloadURL https://update.greasyfork.org/scripts/498192/ExploitedX%20Sites%20-%20Release%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/498192/ExploitedX%20Sites%20-%20Release%20Codes.meta.js
// ==/UserScript==

//@ts-check
(() => {
  /**
   * @param {HTMLDivElement} item video item element
   * @param {HTMLDivElement} [infoDiv] release info element
   * @returns {void}
   * @throws no target error
   */
  function injectDefault(item, infoDiv) {
    if (!infoDiv)
      throw new Error('no element to inject');
    let target = item.querySelector('.rating-div') || item.querySelector('.content-div .text-right');
    if (target)
      return target.prepend(infoDiv);
    target = item.querySelector('.content-div');
    if (target)
      return target.append(infoDiv);
    throw new Error('no target');
  }

  /**
   * @typedef SiteType
   * @property {RegExp} pattern
   * @property {(item: HTMLDivElement, infoDiv?: HTMLDivElement) => void} inject
   * @property {string} [textColor]
   * @property {Partial<CSSStyleDeclaration>} [style]
   */

  // https://regex101.com/r/hPTK77/2
  const hostnamePattern = /^(?:www\.)?([a-z.]+)$/i;

  /** @type {{ [hostname: string]: Partial<SiteType> }} */
  const SITES = {
    'exploitedcollegegirls.com': {
      textColor: '#000000',
      // inject: injectDefault,
    },
    'backroomcastingcouch.com': {
      textColor: '#dd0066',
      style: {
        position: 'absolute',
        right: '0',
      },
      inject: (item, infoDiv) => {
        let target = item.querySelector('.content-div');
        if (!target)
          throw new Error('no target');

        if (window.location.pathname.startsWith('/models/')) {
          // Make video cards larger, like on the other network sites
          /** @type {HTMLDivElement} */ (item.parentElement).classList.add('col-lg-9');
          const row = /** @type {HTMLDivElement} */ (target.querySelector('div'));
          row.children[0].classList.add('col-lg-8');
          row.children[1].classList.add('col-lg-4');
          if (!infoDiv)
            return;
        }

        if (!infoDiv)
          throw new Error('no element to inject');

        target.prepend(infoDiv);
      },
    },
    'blackambush.com': {
      textColor: '#ffa901',
      // inject: injectDefault,
    },
    'bbcsurprise.com': {
      textColor: '#ffa901',
      // inject: injectDefault,
    },
    'hotmilfsfuck.com': {
      textColor: '#d52023',
      // inject: injectDefault,
    },
    'excogigirls.com': {
      textColor: '#000000',
      // inject: injectDefault,
    },
  };

  // https://regex101.com/r/BtryUh/6
  const globalPattern = /(?<site>ecgg?|brcc|ba|blackambush|bbcs?|hmf).*?(?<release>\d{4})/;

  /** @type {SiteType} */
  const defaultSite = {
    pattern: globalPattern,
    inject: injectDefault,
  };

  /** @type {NodeListOf<HTMLDivElement>} */
  (document.querySelectorAll('.item-video')).forEach((item) => {
    const baseHostname = window.location.hostname.match(hostnamePattern)?.[1] ?? window.location.hostname;
    const options = { ...defaultSite, ...SITES[baseHostname] };
    const { pattern, textColor, inject, style } = options;

    const videoSrc = item.querySelector('video > source')?.getAttribute('src');
    if (!videoSrc) {
      inject(item);
      return;
    }

    const filename = videoSrc.split(/\//g).slice(-1)[0];
    const result = filename.match(pattern);
    const { site, release } = result?.groups ?? {};

    const infoDiv = document.createElement('div');
    Object.assign(infoDiv.style, { position: 'relative' });
    const info = document.createElement('span');
    Object.assign(info.style, {
      color: textColor,
      fontWeight: 600,
      ...(style ?? {
        position: 'absolute',
        right: '0',
        top: '-22px',
      }),
    });
    info.innerText = release !== undefined ? `#${release}` : filename;
    info.title = `${site}-${release}\n${filename}`;
    infoDiv.appendChild(info);

    inject(item, infoDiv);
  });

})();
