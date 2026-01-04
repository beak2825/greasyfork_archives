// ==UserScript==
// @name        1080p for invidio.us
// @namespace   432346-fke9fgjew89gjwe89
// @match       https://invidio.us/watch?v=*
// @grant       none
// @version     1.0
// @author      anon
// @description Enable different quality options on invidio.us without logging in (https://github.com/omarroth/invidious/issues/34#issuecomment-457060326)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/394627/1080p%20for%20invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/394627/1080p%20for%20invidious.meta.js
// ==/UserScript==

(function() {
  
  function replace() {
    if (!location.search.match(/[?&]quality=/)) {
      var h = location.search.indexOf('?') > -1 ? '&' : '?'
      location.href += h + 'quality=dash'
    }
  }
  replace()
  window.addEventListener('popstate', replace)
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(it => {
      if (it.href.match(/^(https?:)?\/\/(?!(www\.)?invidio\.us\/watch)/)) return // external links
      var h = it.href.indexOf('?') > -1 ? '&' : '?'
      it.href += h + 'quality=dash'
    })
  })

})()

