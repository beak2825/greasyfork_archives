// ==UserScript==
// @name          Wanikani Context Move-Up
// @namespace     http://www.wanikani.com
// @description   Move up Context Sentences and Patterns of Use in Review
// @icon          https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @match         https://www.wanikani.com/extra_study/session*
// @match         https://www.wanikani.com/review/session*
// @match         https://www.wanikani.com/subjects/review*
// @match         https://www.wanikani.com/subjects/extra_study*
// @match         https://preview.wanikani.com/extra_study/session*
// @match         https://preview.wanikani.com/review/session*
// @match         https://preview.wanikani.com/subjects/review*
// @match         https://preview.wanikani.com/subjects/extra_study*
// @version       0.1.0
// @author        polv
// @license       MIT; http://opensource.org/licenses/MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/462826/Wanikani%20Context%20Move-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/462826/Wanikani%20Context%20Move-Up.meta.js
// ==/UserScript==

(function () {
  const elInfo = document.querySelector('turbo-frame#subject-info');
  if (elInfo) {
    const obs = new MutationObserver(() => {
      const container = Array.from(elInfo.childNodes).find(
        (el) => el instanceof HTMLElement && el.classList.contains('container'),
      );
      if (!(container instanceof HTMLElement)) return;

      const contextHref = container.querySelector('section > a#context');
      if (!contextHref) return;

      const contextSection = contextHref.parentElement;
      if (!contextSection) return;

      const meaningSection = container.querySelector(
        'section > a#meaning',
      )?.parentElement;
      if (!meaningSection) return;

      meaningSection.insertAdjacentElement(
        'beforebegin',
        contextSection.cloneNode(true),
      );

      contextSection.remove();
    });
    obs.observe(elInfo, {
      attributes: true,
      attributeFilter: ['src', 'complete'],
    });
  }
})();
