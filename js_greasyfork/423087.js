// ==UserScript==
// @name         [AMD] Auto Expand Option(s)
// @description  Automatically opens the first option.
// @author       Magic of Lolis <magicoflolis@tuta.io>
// @icon         https://www.amd.com/themes/custom/amd/favicon.ico
// @version      1.0.5
// @supportURL   https://github.com/magicoflolis/userscriptrepo/issues/new
// @namespace    https://github.com/magicoflolis/userscriptrepo/tree/master/AMDAutoOpen#amd-auto-expand
// @homepageURL  https://github.com/magicoflolis/userscriptrepo/tree/master/AMDAutoOpen#amd-auto-expand
// @match        https://www.amd.com/*/support/*
// @grant        navigator.userAgent
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423087/%5BAMD%5D%20Auto%20Expand%20Option%28s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423087/%5BAMD%5D%20Auto%20Expand%20Option%28s%29.meta.js
// ==/UserScript==

'use strict';
(() => {
  //#region Config
  /** Choice Options:
   * @param {string} choice - first | all | none | windows or Windows 11 - 64-Bit Edition...etc */
  let choice = 'first';
  /** Enable/disable Reduce Clutter:
   * @param {boolean} reduce_clutter - Removes some clutter */
  let reduce_clutter = true;
  /** Auto Scroll Amount:
   * @param {number} scroll_amount - Set to 0 disables auto scroll AND 'Top' button */
  let scroll_amount = 110;
  /** Top Button CSS:
   * @param {string} css - You can customize the look here */
  let css = `.aeo-top-btn {
  bottom: 1rem;
  right: 1rem;
  color: #000;
  border: 2px solid #000;
  font-size: 14px;
  font-weight: bold;
  width: auto;
  min-height: 5px;
  margin: 0 3px;
  padding: 10px 15px;
  cursor: pointer;
  text-transform: uppercase;
  text-align: center;
  white-space: normal;
  position:fixed;
}
.os-group summary .summary {
  margin-left: .5em;
}
/** Removes more clutter */
[id="colorbox"],
[id="cboxOverlay"],
.PPLightBox {
  display: none !important;
  z-index: -1 !important;
  visibility: hidden !important;
}`;
  //#endregion

  const err = (...msg) =>
    console.error(
      '[%cAMD%c] %cERROR',
      'color: rgb(237, 28, 36);',
      '',
      'color: rgb(249, 24, 128);',
      ...msg
    );
  // const log = (...msg) =>
  //   console.log(
  //     '[%cAMD%c] %cDBG',
  //     'color: rgb(237, 28, 36);',
  //     '',
  //     'color: rgb(255, 212, 0);',
  //     ...msg
  //   );
  // const info = (...msg) => console.info('[%cAMD%c] %cINF', 'color: rgb(237, 28, 36);', '', 'color: rgb(0, 186, 124);', ...msg);

  /**
   * Object is Null
   * @param {Object} obj - Object
   * @returns {boolean} Returns if statement true or false
   */
  const isNull = (obj) => {
    return Object.is(obj, null) || Object.is(obj, undefined);
  };
  /**
   * Object is Blank
   * @param {(Object|Object[]|string)} obj - Array, Set, Object or String
   * @returns {boolean} Returns if statement true or false
   */
  const isBlank = (obj) => {
    return (
      (typeof obj === 'string' && Object.is(obj.trim(), '')) ||
      (obj instanceof Set && Object.is(obj.size, 0)) ||
      (Array.isArray(obj) && Object.is(obj.length, 0)) ||
      (obj instanceof Object &&
        typeof obj.entries !== 'function' &&
        Object.is(Object.keys(obj).length, 0))
    );
  };
  /**
   * Object is Empty
   * @param {(Object|Object[]|string)} obj - Array, object or string
   * @returns {boolean} Returns if statement true or false
   */
  const isEmpty = (obj) => {
    return isNull(obj) || isBlank(obj);
  };
  /**
   * Add Event Listener
   * @param {Object} root - Selected Element
   * @param {string} type - root Event Listener
   * @param {Function} callback - Callback function
   * @param {Object} [options={}] - (Optional) Options
   * @returns {Object} Returns selected Element
   */
  const ael = (root, type, callback, options = {}) => {
    try {
      root = root || document || document.documentElement;
      if (/Mobi/.test(navigator.userAgent) && type === 'click') {
        type = 'mouseup';
        root.addEventListener('touchstart', callback);
        root.addEventListener('touchend', callback);
      }
      if (type === 'fclick') {
        type = 'click';
      }
      return root.addEventListener(type, callback, options);
    } catch (ex) {
      return err(ex);
    }
  };
  /**
   * Form Attributes of Element
   * @param {Object} elt - Element
   * @param {string} cname - (Optional) Element class name
   * @param {Object} [attrs={}] - (Optional) Element attributes
   * @returns {Object} Returns created Element
   */
  const formAttrs = (el, cname, attrs = {}) => {
    try {
      if (!isEmpty(cname)) {
        el.className = cname;
      }
      if (!isEmpty(attrs)) {
        for (const key in attrs) {
          if (key === 'dataset') {
            for (const key2 in attrs[key]) {
              el[key][key2] = attrs[key][key2];
            }
          } else if (key === 'click') {
            ael(el, 'click', attrs[key]);
          } else if (key === 'container') {
            if (typeof key === 'function') {
              key();
            }
          } else {
            el[key] = attrs[key];
          }
        }
      }
      return el;
    } catch (ex) {
      err(ex);
      return el;
    }
  };
  const make = (element, cname, attrs = {}) => {
    let el;
    try {
      el = document.createElement(element);
      return formAttrs(el, cname, attrs);
    } catch (ex) {
      err(ex);
      return el;
    }
  };
  const loadCSS = (css, name = 'common') => {
    const s = make('style', `aeo-${name}`, {
      innerHTML: css,
    });
    return !document.head.contains(s) ? document.head.appendChild(s) : false;
  };
  /**
   * Prefix for document.querySelector()
   * @param {Object} element - Element for query selection
   * @param {Object} [root=document] - Root selector Element
   * @returns {Object} Returns root.querySelector(element)
   */
  const qs = (element, root) => {
    root = root ?? document ?? document.body;
    return root.querySelector(element);
  };
  /**
   * Prefix for document.querySelectorAll()
   * @param {Object} element - Elements for query selection
   * @param {Object} [root=document] - Root selector Element
   * @returns {Object} Returns root.querySelectorAll(element)
   */
  const qsA = (element, root) => {
    root = root ?? document ?? document.body;
    return root.querySelectorAll(element);
  };
  /**
   * Prefix for document.querySelector() w/ Promise
   * @param {Object} element - Element for query selection
   * @param {Object} [root=document] - Root selector Element
   * @returns {Object} Returns root.querySelector(element)
   */
  const query = async (element, root) => {
    root = root ?? document ?? document.body;
    while (root.querySelector(element) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return root.querySelector(element);
  };
  const top_btn = make('input', 'aeo-top-btn', {
    value: 'Top',
    type: 'button',
    onclick: () => {
      return window.scroll(0, scroll_amount);
    },
  });
  const initScript = async () => {
    try {
      loadCSS(css);
      if (scroll_amount > 0) {
        document.body.append(top_btn);
        window.scroll(0, scroll_amount);
        window.onscroll = () => {
          document.documentElement.scrollTop > scroll_amount
            ? top_btn.setAttribute('style', 'display: inline-block !important')
            : top_btn.setAttribute('style', 'display: none !important');
        };
      }
      if (reduce_clutter) {
        if (qs('[id="scrollspy"]')) {
          qs('[id="scrollspy"]').setAttribute(
            'style',
            'padding: 0px !important'
          );
        }
        const ads = [
          qs('.panel'),
          qs('[role="banner"]'),
          qs('[role="contentinfo"]'),
        ];
        for (const ad of ads) {
          if (isEmpty(ad)) continue;
          ad.remove();
        }
      }
      if (!isEmpty(choice) && !choice.match(/none/gi)) {
        if (choice === 'first') {
          qs('details.os-group').setAttribute('open', '');
        } else {
          for (const details of qsA('details.os-group')) {
            if (choice === 'all') {
              details.setAttribute('open', '');
            } else {
              const re = new RegExp(`${choice}+`, 'gi');
              const txt = details.children[0].textContent;
              if (!isEmpty(txt)) {
                const find = txt.match(re) ?? [];
                if (!isEmpty(find)) {
                  details.setAttribute('open', '');
                }
              }
            }
          }
        }
      }
      await query('details.os-group .os-row a');
      await query('details.os-group summary .summary');
      for (const details of qsA('details.os-group')) {
        const summary = qs('summary > span.summary', details);
        // for(const driver of qsA('.driver .field--type-uri > a[href]', details)) { };
        const driver = qs('.driver-metadata a', details);
        summary.textContent = driver.href;
        summary.onclick = (e) => {
          e.preventDefault();
          const dlBtn = make('a', 'amd_Downloader');
          dlBtn.href = driver.href;
          dlBtn.click();
          dlBtn.remove();
        };
      }
    } catch (ex) {
      err(ex);
    }
  };
  initScript();
})();
/**
* Defaults:
*
* choice = 'first'
* reduce_clutter = true
* scroll_amount = 110
* css = `.aeo-top-btn {
  bottom: 1rem;
  right: 1rem;
  color: #000;
  border: 2px solid #000;
  font-size: 14px;
  font-weight: bold;
  width: auto;
  min-height: 5px;
  margin: 0 3px;
  padding: 10px 15px;
  cursor: pointer;
  text-transform: uppercase;
  text-align: center;
  white-space: normal;
  position:fixed;
}
...`
*/
