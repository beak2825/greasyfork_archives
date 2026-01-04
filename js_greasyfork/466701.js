// ==UserScript==
// @name         InnerHTML logger
// @namespace    https://lafkpages.tech
// @version      0.2
// @description  Logs usage of innerHTML and outerHTML
// @author       LuisAFK
// @match        *://*/*
// @icon         https://i.imgur.com/1p0A8XP.png
// @icon64       https://i.imgur.com/jbvkyHD.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466701/InnerHTML%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/466701/InnerHTML%20logger.meta.js
// ==/UserScript==

(() => {
  const proto = Element.prototype;
  const props = ['innerHTML', 'outerHTML'];
  const injectInto = document.head || document.body || document.currentScript?.parentElement || document.documentElement;
  const flashClass = 'innerhtml-logger-flash';
  const flashProp = '__innerhtml_logger_flash_timeout';
  const timesUsedProp = '__innerhtml_logger_times_used';

  window[timesUsedProp] = 0;

  const originalProps = Object.fromEntries(
    props.map(prop => [
      prop,
      Object.getOwnPropertyDescriptor(proto, prop)
    ])
  );

  function log(prop, elm, value) {
    window[timesUsedProp]++;

    elm.classList.remove(flashClass);
    clearTimeout(elm[flashProp] || 0);
    setTimeout(() => {
      elm.classList.add(flashClass);
      elm[flashProp] = setTimeout(() => {
        elm?.classList.remove(flashClass);
      }, 1000);
    }, 10);
  }

  function makeLoggerProp(prop) {
    return {
      get: function () {
        // log
        log(prop, this);

        // call
        return originalProps[prop].get.call(this, ...arguments);
      },
      set: function (value) {
        // log
        log(prop, this, value);

        // call
        return originalProps[prop].set.call(this, ...arguments);
      }
    };
  }

  Object.defineProperties(proto, Object.fromEntries(
    props.map(prop => [
      prop,
      makeLoggerProp(prop)
    ])
  ));

  const styles = document.createElement('style');
  styles.textContent = `
    .${flashClass} {
      background-image: none;
      animation: 1s linear 0s 1 normal forwards running ${flashClass} !important;
    }

    @keyframes ${flashClass} {
      from {
        background-color: yellow;
      }

      to {
        background-color: transparent;
      }
    };
  `;
  styles.type = 'text/css';
  injectInto.appendChild(styles);
})();