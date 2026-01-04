// ==UserScript==
// @name         Amazon裏コマンド
// @namespace    https://next.waterleaper.net/
// @version      0.1.1
// @description  Amazonの商品を裏コマンドで絞り込みます
// @author       waterleaper
// @match        https://www.amazon.co.jp/s*
// @icon         https://www.amazon.co.jp/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452319/Amazon%E8%A3%8F%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/452319/Amazon%E8%A3%8F%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89.meta.js
// ==/UserScript==

/*
[参考記事]
https://radiolife.com/internet/amazon/45201/
*/

;(function () {
  "use strict"
  let newSelect = document.createElement("select")
  newSelect.setAttribute("id", "sel")

  let newOption0 = document.createElement("option")
  let newContent0 = document.createTextNode("▼選択肢を選んでください")
  newOption0.appendChild(newContent0)
  newSelect.appendChild(newOption0)

  let newOption1 = document.createElement("option")
  let newContent1 = document.createTextNode("マーケットプレイスを除外")
  newOption1.appendChild(newContent1)
  newOption1.setAttribute("value", "excludemp")
  newSelect.appendChild(newOption1)

  let newOption2 = document.createElement("option")
  let newContent2 = document.createTextNode("人気の高い順")
  newOption2.appendChild(newContent2)
  newOption2.setAttribute("value", "popular")
  newSelect.appendChild(newOption2)

  let newOption3 = document.createElement("option")
  let newContent3 = document.createTextNode("売り上げの良い順")
  newOption3.appendChild(newContent3)
  newOption3.setAttribute("value", "sales")
  newSelect.appendChild(newOption3)

  // let newOption4 = document.createElement("option")
  // let newContent4 = document.createTextNode("レビューが良い順")
  // newOption4.appendChild(newContent4)
  // newOption4.setAttribute("value", "review")
  // newSelect.appendChild(newOption4)

  let newOption5 = document.createElement("option")
  let newContent5 = document.createTextNode("50%以上安い品")
  newOption5.appendChild(newContent5)
  newOption5.setAttribute("value", "off50")
  newSelect.appendChild(newOption5)

  // let newOption6 = document.createElement("option")
  // let newContent6 = document.createTextNode("価格の高い順")
  // newOption6.appendChild(newContent6)
  // newOption6.setAttribute("value", "highprice")
  // newSelect.appendChild(newOption6)

  // let newOption7 = document.createElement("option")
  // let newContent7 = document.createTextNode("価格の安い順")
  // newOption7.appendChild(newContent7)
  // newOption7.setAttribute("value", "lowprice")
  // newSelect.appendChild(newOption7)

  // let newOption8 = document.createElement("option")
  // let newContent8 = document.createTextNode("発売日の新しい順")
  // newOption8.appendChild(newContent8)
  // newOption8.setAttribute("value", "new")
  // newSelect.appendChild(newOption8)

  let form = document.querySelector(
    "#search > span > div > h1 > div > div.sg-col-6-of-20.sg-col.sg-col-6-of-16.sg-col-6-of-12 > div > div > form"
  )
  form.appendChild(newSelect)

  const sel = document.getElementById("sel")
  let url = window.location.href.split("&")[0]

  sel.addEventListener("change", function () {
    let val = this.value
    if (val === "excludemp") {
      url = url + "&emi=AN1VRQENFRJN5"
      window.location.href = url
    } else if (val === "popular") {
      url = url + "&sort=popularity-rank"
      window.location.href = url
    } else if (val === "sales") {
      url = url + "&sort=salesrank"
      window.location.href = url
    } else if (val === "review") {
      url = url + "&sort=review-rank"
      window.location.href = url
    } else if (val === "off50") {
      url = url + "&pct-off=50-"
      window.location.href = url
    } else if (val === "highprice") {
      url = url + "&sort=-price"
      window.location.href = url
    } else if (val === "lowprice") {
      url = url + "&sort=price"
      window.location.href = url
    } else if (val === "new") {
      url = url + "&sort=releasedate"
      window.location.href = url
    }
  })
})()
