// ==UserScript==
// @name        YouTube: Force Single Column Mode
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @unwrap
// @inject-into page
// @version     1.1.1
// @author      CY Fung
// @description 8/17/2023, 1:51:20 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473217/YouTube%3A%20Force%20Single%20Column%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/473217/YouTube%3A%20Force%20Single%20Column%20Mode.meta.js
// ==/UserScript==

(() => {

  const VIDEO_WH_RATIO_REFERENCE = 16 / 9; // 1.78
  const ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN = 0.2 // 20% or more of other content can be displayed in your browser

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);


  let ytPreferredMode = null; // true for two-columns_; min-width of side panel = 380px

  function getShouldSingleColumn() {
    if (ytPreferredMode === false) return true;
    const { clientHeight, clientWidth } = document.documentElement;
    if (clientHeight > clientWidth) {
      let referenceVideoHeight = clientWidth / (VIDEO_WH_RATIO_REFERENCE);
      let belowSpace = clientHeight - referenceVideoHeight;
      if (belowSpace > -1e-3) {
        if (belowSpace - ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN * clientHeight >= -1e-3) {
          return true;
        }
      }
    }
    return false;
  }

  let isShouldSingleColumn = null;

  const Promise = (async () => { })().constructor;
  const { setInterval, clearInterval } = window;

  if (location.pathname.indexOf('live_chat') >= 0) return;

  let resizeBusy = false;
  let resizeQuene = Promise.resolve();


  function setIsTwoColumns_(ywf) {
    if (!ywf) return;
    const cnt = insp(ywf);
    const pnt = (cnt.ytdWatchBehavior ? cnt : ywf.ytdWatchBehavior ? ywf : 0) || 0;

    if (typeof isShouldSingleColumn === 'boolean' && 'isTwoColumns_' in (pnt.ytdWatchBehavior || 0)) {
      pnt.ytdWatchBehavior.isTwoColumns_ = !isShouldSingleColumn;
    }

  }
  let cid = setInterval.call(window, () => {
    const ywf = document.querySelector('ytd-watch-flexy');
    if (ywf && isShouldSingleColumn === null) {
      isShouldSingleColumn = getShouldSingleColumn();
      Window.prototype.addEventListener.call(window, 'resize', function () {
        if (resizeBusy) return;
        resizeBusy = true;
        const ywf = document.querySelector('ytd-watch-flexy');
        resizeQuene = resizeQuene.then(() => {
          const p = isShouldSingleColumn;
          isShouldSingleColumn = getShouldSingleColumn();
          resizeBusy = false;
          return isShouldSingleColumn !== p
        }).then(k => {
          if (k) setIsTwoColumns_(ywf);
        });
      }, { capture: false, passive: true });

      if (isShouldSingleColumn) {
        ywf.removeAttribute('is-two-columns_');
      } else {
        ywf.setAttribute('is-two-columns_', '');
      }

      const cnt = insp(ywf);
      const pnt = (cnt.ytdWatchBehavior ? cnt : ywf.ytdWatchBehavior ? ywf : 0) || 0;

      if (typeof cnt.updateIsTwoColumnsFromBinding === 'function' && ('isTwoColumns_' in (pnt.ytdWatchBehavior || 0))) {

        cnt.updateIsTwoColumnsFromBinding = function (a) {
          let b = null;
          try {
            b = a.detail.value;
          } catch (e) { }
          if (typeof b === 'boolean') ytPreferredMode = b;
        };

      }
      Promise.resolve(ywf).then(setIsTwoColumns_)
      clearInterval.call(window, cid);
    }

  }, 1);

})();