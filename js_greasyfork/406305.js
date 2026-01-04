// ==UserScript==
// @name         Niconico Seiga Block
// @namespace    https://greasyfork.org/ja/scripts/406305-niconico-seiga-block/
// @version      0.1
// @description  ニコニコ静画にユーザー名ブロック機能を追加します
// @match        https://seiga.nicovideo.jp/illust/*
// @match        https://seiga.nicovideo.jp/tag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406305/Niconico%20Seiga%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/406305/Niconico%20Seiga%20Block.meta.js
// ==/UserScript==

const blockTarget = [
        "sample1",
        /^sample2$/,
      ],
      element = (() => {
        const loc = location.href
        if (loc.includes("ranking/point")) {
          return document.getElementsByClassName("ranking_single")
        } else if (loc.includes("ranking")) {
          return document.getElementsByClassName("rank_list_block")
        } else {
          return document.querySelectorAll("[class^=list_item]")
        }
      })()

Array.from(element).forEach(e => {
  const userName = (e.getElementsByClassName("user")[0] || e.getElementsByClassName("rank_txt_user")[0]).textContent.replace(/\n\s+/g, "")
  blockTarget.forEach(b => {
    if (userName.match(b)) e.style.display = "none"
  })
})