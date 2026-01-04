// ==UserScript==
// @name        52pt.site
// @namespace   Violentmonkey Scripts
// @match       https://52pt.site/torrents.php
// @match       https://52pt.site/details.php
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description 2025/1/2 11:33:11
// @downloadURL https://update.greasyfork.org/scripts/522577/52ptsite.user.js
// @updateURL https://update.greasyfork.org/scripts/522577/52ptsite.meta.js
// ==/UserScript==

// https://52pt.site/torrents.php?inclbookmarked=0&incldead=1&spstate=0&page=0
if (location.href.indexOf('torrents.php') > -1) {
  let aLinkInx = Number(localStorage.getItem('aLinkInx')) || 0
  debugger
  let list = document.querySelectorAll(
    'table.torrentname td.embedded:nth-child(2n - 1) > a'
  )
  function clickNext() {
    if (aLinkInx < list.length) {
      debugger
      list[aLinkInx].click()
      aLinkInx++
      localStorage.setItem('aLinkInx', aLinkInx)
      setTimeout(clickNext, 1000)
    }
  }
  clickNext()
  if (aLinkInx === 100) {
    debugger
    let pageNo = Number(localStorage.getItem('pageNo')) || 0
    pageNo++
    localStorage.setItem('pageNo', pageNo)
    localStorage.setItem('aLinkInx', 0)
    let url = `https://52pt.site/torrents.php?inclbookmarked=0&incldead=1&spstate=0&page=${pageNo}`
    window.open(url, '_self')
  }
}
if (location.href.indexOf('details.php') > -1) {
  setTimeout(() => {
    debugger
    if (document.querySelectorAll('#thanksbutton input').length > 0) {
      document.querySelectorAll('#thanksbutton input')[0].click()
      setTimeout(() => {
        history.go(-1)
      }, 2000)
    }
  }, 2000)
}