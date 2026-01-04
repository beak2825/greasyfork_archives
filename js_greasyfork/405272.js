// ==UserScript==
// @name         ABEMA NextProgramInfo Blocker
// @namespace    https://greasyfork.org/ja/scripts/405272
// @version      1
// @description  ABEMAビデオで次のエピソードへ勝手に移動するのをブロックします
// @include      https://abema.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405272/ABEMA%20NextProgramInfo%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/405272/ABEMA%20NextProgramInfo%20Blocker.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const sid = 'NPIBlocker',
    timer = {
      init: 0
    };

  //「次のエピソード」が表示されたらすぐに閉じる・移動をキャンセルする
  const closeNextProgramInfo = () => {
    if (/^https:\/\/abema\.tv\/video\/episode\//.test(location.href)) {
      const cb = document.querySelector('.com-vod-VODNextProgramInfo__close-button'),
        cnpb = document.querySelector('.com-vod-VODScreenOverlayForMiniPlayer__cancel-next-program-button');
      if (cb && cb.hasAttribute('tabindex') && cb.getAttribute('tabindex') !== '-1') {
        cb.click();
      } else if (cnpb) cnpb.click();
    }
  };

  //ページを開いたときに1度だけ実行
  const init = () => {
    const main = document.getElementById('main');
    if (main && !main.classList.contains(sid)) {
      main.classList.add(sid);
      observerM.observe(main, { childList: true, subtree: true });
    }
  };

  const observerM = new MutationObserver(closeNextProgramInfo);
  clearInterval(timer.init);
  timer.init = setInterval(() => {
    if (document.getElementById('main')) {
      clearInterval(timer.init);
      init();
    }
  }, 1000);

})();