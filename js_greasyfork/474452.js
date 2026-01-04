// ==UserScript==
// @name         alt_expand for Old TweetDeck
// @namespace    https://twitter.com/@7vU6jrZRuX2ffkY
// @version      0.1
// @description  旧TweetDeckでTL上にALTテキストを展開するやつ
// @author       @7vU6jrZRuX2ffkY
// @match        https://twitter.com/i/tweetdeck
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474452/alt_expand%20for%20Old%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/474452/alt_expand%20for%20Old%20TweetDeck.meta.js
// ==/UserScript==
 
(() => {
  const observer = new MutationObserver(m => {
    m.forEach(mm => {
      mm.addedNodes.forEach(e => {
        if (e.classList && e.classList.contains("js-stream-item")) {
          addAltText1(e.querySelector("div.js-media.media-preview:has(a.js-media-image-link[title]:not([title='']))"));
          addAltText2(e.querySelector("div.js-media.media-preview:has(a.js-media-image-link img[alt]:not([alt=''])"));
        }
      });
    });
  });
 
  const addAltText1 = ele => {
    ele && ele.insertAdjacentHTML("afterend", "<p style='white-space:pre-wrap;padding-top:1em'>" + ele.querySelector("a[title]").title + "</p>")
  };
 
  const addAltText2 = ele => {
    ele && ele.insertAdjacentHTML("afterend", "<p style='white-space:pre-wrap;padding-top:1em'>" + ele.querySelector("img[alt]").alt + "</p>")
  };
 
  const waitForLoadCompletion = () => {
    const t1 = document.querySelector("div.js-app-columns");
    const t2 = document.querySelector("div#open-modal");
    if (t1 && t2) {
      observer.observe(t1, {
        childList: true,
        subtree: true,
        characterData: true
      });
      observer.observe(t2, {
        childList: true,
        subtree: true,
        characterData: true
      });
    } else {
      setTimeout(waitForLoadCompletion, 500);
    }
  };
 
  waitForLoadCompletion();
})();