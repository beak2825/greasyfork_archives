// ==UserScript==
// @name         Rockstar Jobs Fixer
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Fixes the 'See More Jobs' functionality on Rockstar Social Club Jobs page.
// @author       you
// @match        https://socialclub.rockstargames.com/jobs*
// @match        https://socialclub.rockstargames.com/member/*/jobs*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493500/Rockstar%20Jobs%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/493500/Rockstar%20Jobs%20Fixer.meta.js
// ==/UserScript==

(function() {
  const injectFix = setInterval(() => {
    const el = document.querySelector('[class^="Search__wrap"]')
    if (!el) return; // Exit if element not found

    const propsKey = Object.keys(el).find(k => k.startsWith('__reactProps'))
    const children = el[propsKey].children
    const c = (Array.isArray(children) ? children[0] : children)._owner.stateNode
    c.props.hasMore = true
    c.forceUpdate()
  }, 500);

  // Stop the fix on page unload
  window.addEventListener('unload', () => clearInterval(injectFix));
})();
