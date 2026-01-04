// ==UserScript==
// @name        Absolute Time on GreasyFork
// @namespace   UserScript
// @match       https://greasyfork.org/*
// @grant       none
// @version     1.1.0
// @license MIT
// @author      CY Fung
// @description Make Absolute Time on GreasyFork
// @unwrap
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/470348/Absolute%20Time%20on%20GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/470348/Absolute%20Time%20on%20GreasyFork.meta.js
// ==/UserScript==

(() => {

  let langUsed = null;

  const Promise = (async () => { })().constructor;

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  function pad(s, d) {
    s = `000000${s}`
    return s.substring(s.length - d)
  }

  /**
   * @callback formatDateTimeFn
   * @param {DateTime} dt
   * @returns {string} formated text for date & time
   */

  /** @type {formatDateTimeFn} */
  const formatUFn = (dt) => {
    return `${dt.getFullYear()}.${pad(dt.getMonth() + 1, 2)}.${pad(dt.getDate(), 2)} ${pad(dt.getHours(), 2)}:${pad(dt.getMinutes(), 2)}`

  }

  /** @type {formatDateTimeFn} */
  const formatFrFn = (dt) => {
    return `${pad(dt.getDate(), 2)}.${pad(dt.getMonth() + 1, 2)}.${dt.getFullYear()} ${pad(dt.getHours(), 2)}:${pad(dt.getMinutes(), 2)}`
  }

  let formatFn = formatUFn;

  let rafPromise = null;

  const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
    requestAnimationFrame(hRes => {
      rafPromise = null;
      resolve(hRes);
    });
  }));

  let delay100 = null;

  delay100 = new PromiseExternal();
  setInterval(() => {
    delay100.resolve();
    delay100 = new PromiseExternal();
  }, 100);

  let psk = 0;

  const cssText = `

    @keyframes relativeTimeNotAbsoluteAppended {
        from{
            background-position-x: 1px;
        }
        to{
            background-position-x: 2px;
        }
    }
    relative-time[datetime]:not(.absolute) {
        animation: relativeTimeNotAbsoluteAppended 1ms linear 0s 1 normal forwards;
    }

  `;

  async function fixRelativeTime(s) {

    psk = Date.now();

    s.classList.add("absolute")
    s.format = 'datetime';
    await Promise.resolve().then();
    await getRafPromise().then();

    if (langUsed === null) {
      langUsed = document.documentElement.lang;
      if (typeof langUsed === 'string' && (langUsed === 'fr' || langUsed.startsWith('fr-'))) {
        formatFn = formatFrFn;
      }
    }

    let d = s.getAttribute('datetime');
    let dt = d ? new Date(d) : null;
    if (dt && s.shadowRoot && s.shadowRoot.firstChild) {

      psk = Date.now();
      while (Date.now() - psk < 800) {
        s.shadowRoot.firstChild.textContent = formatFn(dt);
        await delay100.then();
      }

    }

  }

  document.addEventListener('animationstart', (evt) => {
    const animationName = evt.animationName;
    if (!animationName) return;
    if (animationName === 'relativeTimeNotAbsoluteAppended') {
      fixRelativeTime(evt.target);
    }
  }, { capture: true, passive: true });

  document.head.appendChild(document.createElement('style')).textContent = cssText;

})();