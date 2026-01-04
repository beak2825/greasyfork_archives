// ==UserScript==
// @name         2kiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  2kiki2kiki
// @author       YInJw
// @match        https://item.jd.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425038/2kiki.user.js
// @updateURL https://update.greasyfork.org/scripts/425038/2kiki.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // Your code here...
  window.kiki = () => {
    const cssText = $('#J-detail-content>style')[0]['innerText']
    const mainImages = []
    const detailImages = cssText.match(/\((.+?)\)/g) || []

    $('#spec-list .lh li').each((index, item) => {
      mainImages.push({
        imgName: `产品主图 ${index}.` + item.children[0]['src'].replace(')', '').split('.').slice(-1),
        imgUrl: item.children[0]['src'].replace('/n5/', '/n12/')
      })
    })
    for (let i = 0; i <= detailImages.length - 1; i++) {
      detailImages[i] = {
        imgName: `产品详情图 ${i}.` + detailImages[i].replace(')', '').split('.').slice(-1),
        imgUrl: detailImages[i].replace('(', '').replace(')', '').replace('//', 'https://')
      }
    }

    console.log(JSON.stringify([...mainImages, ...detailImages]))
  }
})()
