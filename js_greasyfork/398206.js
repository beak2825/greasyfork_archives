// ==UserScript==
// @name         DMM 增强
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @author       targetlock
// @description  DMM
// @match        *://www.dmm.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398206/DMM%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398206/DMM%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
  'use strict'

  addNextAndPrevButton()
  keyboardShourtcut();

  function keyboardShourtcut() {
    document.addEventListener('keyup', e => {
      if (e.code === 'Period' && !e.ctrlKey && e.shiftKey && !e.metaKey) {
          document.querySelector('#nextCidButton').click()
      }
      if (e.code === 'Comma' && !e.ctrlKey && e.shiftKey && !e.metaKey) {
          document.querySelector('#prevCidButton').click()
      }
    })
  }

  function addNextAndPrevButton() {
    const header = document.querySelector('.hreview')
    const cid = getCid()
    if (header && cid) {
       const nextCid = getNextCid(cid)
       const nextHref = location.href.replace(/\/cid=(\w+)\//, `/cid=${nextCid}/`)
       header.insertAdjacentHTML('beforeend', `<a id="nextCidButton" href="${nextHref}" style="float: right; margin: 0 0 0 20px">${nextCid}</a>`)

       const prevCid = getPrevCid(cid)
       const prevHref = location.href.replace(/\/cid=(\w+)\//, `/cid=${prevCid}/`)
       header.insertAdjacentHTML('beforeend', `<a id="prevCidButton" href="${prevHref}" style="float: right; margin: 0 0 0 20px">${prevCid}</a>`)
    }
  }

  function getCid() {
    const result = /\/cid=(\w+)\//.exec(location.href)
    return result ? result[1] : null
  }

  function getPrevCid(cid) {
    const re = /(\d+)(\D*)$/
    const result = re.exec(cid)
    const number = result[1]
    const suffix = result[2]
    return cid.replace(re, parseInt(number) - 1) + suffix
  }

  function getNextCid(cid) {
    const re = /(\d+)(\D*)$/
    const result = re.exec(cid)
    console.log(result)
    const number = result[1]
    const suffix = result[2]
    return cid.replace(re, parseInt(number) + 1) + suffix
  }
})();