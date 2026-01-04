// ==UserScript==
// @name        Keep Scroll Position After Clicking Tabs on YouTube Channel Page
// @namespace   UserScript
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @license MIT
// @author      CY Fung
// @description To Keep Scroll Position After Clicking Tabs on YouTube Channel Page
// @downloadURL https://update.greasyfork.org/scripts/470245/Keep%20Scroll%20Position%20After%20Clicking%20Tabs%20on%20YouTube%20Channel%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/470245/Keep%20Scroll%20Position%20After%20Clicking%20Tabs%20on%20YouTube%20Channel%20Page.meta.js
// ==/UserScript==


let lastScrollTop = 0;
let lastScrollTopUpdatedAt = 0;
const _requestAnimationFrame = requestAnimationFrame;
async function checker(tab, endAt) {


  while (Date.now() - lastScrollTopUpdatedAt < endAt) {
    if (lastScrollTop !== document.documentElement.scrollTop) {
      lastScrollTopUpdatedAt = 0;
      if(tab.classList.contains('iron-selected')){

        document.documentElement.scrollTop = lastScrollTop;
        Promise.resolve().then(() => {

          document.documentElement.scrollTop = lastScrollTop;
        })
        setTimeout(() => {
          document.documentElement.scrollTop = lastScrollTop;
        }, 1)
      }

      return;
    }
    await new Promise(_requestAnimationFrame)
  }
  lastScrollTopUpdatedAt = 0;


}
document.addEventListener('click', (evt) => {
  if (!evt || !evt.isTrusted) return;
  const target = evt.target;

  Promise.resolve().then(() => {

    let tab;
    if (target instanceof HTMLElement) {
      tab = HTMLElement.prototype.closest.call(target, 'tp-yt-paper-tab.style-scope.ytd-c4-tabbed-header-renderer');
    }

    if (!tab) return;

    if (document.documentElement.scrollTop > 10) {
      lastScrollTop = document.documentElement.scrollTop;
      lastScrollTopUpdatedAt = Date.now();
      checker(tab, 830)
    }
  })

}, true)