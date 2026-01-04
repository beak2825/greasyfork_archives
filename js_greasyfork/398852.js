// ==UserScript==
// @name         Asana subtask auto loadmore
// @namespace    http://tampermonkey.net
// @description  Asana subtask auto load more
// @version      0.4
// @author       zhong666
// @match        https://app.asana.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398852/Asana%20subtask%20auto%20loadmore.user.js
// @updateURL https://update.greasyfork.org/scripts/398852/Asana%20subtask%20auto%20loadmore.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  function dispatchClickLoadMore() {
    const $loadmore = document.querySelector('.SubtaskGrid.SingleTaskPaneSpreadsheet-subtaskGrid .SubtaskGrid-loadMore')
    if (!$loadmore) {
      return
    }
    $loadmore.click()
  }

  dispatchClickLoadMore = debounce(dispatchClickLoadMore, 50)

  const mobs = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      dispatchClickLoadMore()
    })
  })

  mobs.observe(document.body, {
    subtree: true,
    childList: true,
  })
})();