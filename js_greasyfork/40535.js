// ==UserScript==
// @name         淘宝联盟搜索id时自动生成商品链接
// @namespace    http://pub.alimama.com/
// @version      0.5
// @description  有时候从别处得到一个商品id(只有id，不是链接)，想知道该商品是否在淘宝联盟，或者需要查看该商品的佣金信息等，还得手动写一个链接`https://item.taobao.com/item.htm?id=xxx，才能进行搜索。本脚本在用户输入时，如果检测到关键词是商品id，则自动生成商品链接。
// @author       Yaxian23
// @match        http://pub.alimama.com/promo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40535/%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F%E6%90%9C%E7%B4%A2id%E6%97%B6%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/40535/%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F%E6%90%9C%E7%B4%A2id%E6%97%B6%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict'

  let form
  let input

  function ready() {
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        form = document.querySelector('.input-group')
        if (form) {
          clearInterval(timer)
          input = form.querySelector('.search-inp')
          resolve()
        }
      }, 500)
    })
  }

  function onInput() {
    if ((/^\s*(\d{8,20})\s*$/).test(input.value)) {
      input.value = generateUrl(input.value)
    }
  }

  function generateUrl(id) {
    // test
    return 'https://item.taobao.com/item.htm?id=' + id
  }

  ; (async () => {
    ready().then(() => {
      input.addEventListener('input', onInput)
    }).catch(err => {
      console.error(err)
    })
  })()
})()
