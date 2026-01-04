// ==UserScript==
// @name        Plain old youtube.com (2019)
// @namespace   tei.su
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      teidesu
// @description 11/28/2019, 9:31:23 PM
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/393055/Plain%20old%20youtubecom%20%282019%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393055/Plain%20old%20youtubecom%20%282019%29.meta.js
// ==/UserScript==

(function() {
  function replace() {
    if (!location.search.match(/[?&]disable_polymer=/)) {
      var h = location.search.indexOf('?') > -1 ? '&' : '?'
      location.href += h + 'disable_polymer=1'
    }
  }
  replace()
  window.addEventListener('popstate', replace)
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(it => {
      if (it.href.match(/^(https?:)?\/\/(?!(www\.)?youtube\.com)/)) return // external links
      var h = it.href.indexOf('?') > -1 ? '&' : '?'
      it.href += h + 'disable_polymer=1'
    })
  })
})()

