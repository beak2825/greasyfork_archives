// ==UserScript==
// @name        Blur text in audio challenges
// @description Makes audio challenges more instructive by keeping your focus on the spoken text
// @namespace   neobrain
// @author      neobrain
// @match       https://*.duolingo.com/*
// @grant       GM.addStyle
// @grant       GM.log
// @version     1.2
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/503959/Blur%20text%20in%20audio%20challenges.user.js
// @updateURL https://update.greasyfork.org/scripts/503959/Blur%20text%20in%20audio%20challenges.meta.js
// ==/UserScript==

GM.addStyle(`
[data-test="challenge challenge-translate"] > div > div > div:nth-child(1) > div > div > div > div > span:nth-child(2),
/* [data-test="challenge challenge-readComprehension"] > div > div > div:nth-child(1) > div > div > div > div > div > span:nth-child(2),*/
[data-test="challenge challenge-readComprehension"] > div > div > div:nth-child(1) > :not(:first-child),
[data-test="challenge challenge-dialogue"] > div > div > div:nth-child(1) > div > div > div:nth-child(3) > span:not(:first-child),
[data-test="challenge challenge-dialogue"] > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div > span:not(:first-child),
[data-test="challenge challenge-definition"] > div > div > div:nth-child(1) > span:not(:first-child) {
  filter: blur(5px);
  transition: filter ease-out 0.2s
}

[data-test="challenge challenge-translate"] > div > div > div:nth-child(1) > div > div > div > div > span:nth-child(2):hover,
[data-test="challenge challenge-translate"] > div > div > div:nth-child(1) > div > div > div > div > div > span:nth-child(2):hover,
/*[data-test="challenge challenge-readComprehension"] > div > div > div:nth-child(1) > div > div > div > div > div > span:nth-child(2):hover,*/
[data-test="challenge challenge-readComprehension"] > div > div > div:nth-child(1) > :not(:first-child):hover,
[data-test="challenge challenge-dialogue"] > div > div > div:nth-child(1) > div > div > div:nth-child(3) > span:not(:first-child):hover,
[data-test="challenge challenge-dialogue"] > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div > span:not(:first-child):hover,
[data-test="challenge challenge-definition"] > div > div > div:nth-child(1) > span:not(:first-child):hover {
  filter: blur(0px);
}
`)

// Unblur text if the data-test="blame blame-correct" element is added to the footer
window.addEventListener('load', () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        for (const blame of addedNode.querySelectorAll('div[data-test^="blame blame-"]')) {
          for (const challengeElem of document.querySelectorAll('div[data-test^="challenge challenge-"]')) {
            for (const elem of challengeElem.getElementsByTagName('*')) {
              elem.style.transition = "filter ease-out 0.2s";
              elem.style.filter = "blur(0px)";
            }
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
