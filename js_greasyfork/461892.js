// ==UserScript==
// @name         Hide your twitter info
// @namespace    https://github.com/KazooTTT/hide-your-twitter-info
// @version      0.6
// @description  Hide your Twitter information. Prevent others from seeing your ID, nickname, and profile picture in public places.
// @author       KazooTTT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/461892/Hide%20your%20twitter%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/461892/Hide%20your%20twitter%20info.meta.js
// ==/UserScript==

const insertStylesBySelector = (selector) => {
  const style = document.createElement("style");
  style.textContent = `
${selector} {
display:none
}
`;
  const head = document.querySelector("head");
  head.append(style);
};

(function () {
  "use strict";

  function useOption(key, title, defaultValue) {
    if (typeof GM_getValue === 'undefined') {
      return {
        value: defaultValue,
      }
    }

    let value = GM_getValue(key, defaultValue)
    const ref = {
      get value() {
        return value
      },
      set value(v) {
        value = v
        GM_setValue(key, v)
        location.reload()
      },
    }

    GM_registerMenuCommand(`${title}: ${value ? '✅' : '❌'}`, () => {
      ref.value = !value
    })

    return ref
  }

  const hideTwitterInfo = useOption('hideTwitterInfoTab', 'Hide Twitter Info', true)

  if(hideTwitterInfo.value){
  
    insertStylesBySelector(`[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(1)`);
    insertStylesBySelector(`[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2)`);

    const timer = setInterval(() => {
      const accountEl = document.querySelector(
        'a[data-testid="AppTabBar_Profile_Link"]'
      );
      if (accountEl) {
        const accountId = accountEl.href.split("/").pop();
        insertStylesBySelector(
          `div[data-testid="UserAvatar-Container-${accountId}"]`
        );
        clearInterval(timer);
      }
    }, 1500);
  }
})();
