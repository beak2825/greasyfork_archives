// ==UserScript==
// @name        ニコニコ動画の検索フィルタの投稿日時の期間の選択肢を増やす
// @namespace   rinsuki.net
// @match       https://www.nicovideo.jp/search/*
// @match       https://www.nicovideo.jp/tag/*
// @grant       none
// @version     1.1
// @author      -
// @description ニコニコ動画の検索フィルタの投稿日時の期間に3ヶ月と1年の選択肢を追加します。
// @downloadURL https://update.greasyfork.org/scripts/429249/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%81%AE%E6%8A%95%E7%A8%BF%E6%97%A5%E6%99%82%E3%81%AE%E6%9C%9F%E9%96%93%E3%81%AE%E9%81%B8%E6%8A%9E%E8%82%A2%E3%82%92%E5%A2%97%E3%82%84%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/429249/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%81%AE%E6%8A%95%E7%A8%BF%E6%97%A5%E6%99%82%E3%81%AE%E6%9C%9F%E9%96%93%E3%81%AE%E9%81%B8%E6%8A%9E%E8%82%A2%E3%82%92%E5%A2%97%E3%82%84%E3%81%99.meta.js
// ==/UserScript==

(() => {
    const choices = document.querySelector(".searchOption .filterOptionContainer .postTime ul")
    const customChoice = choices.children[choices.children.length-1]
    function dateToNicoString(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart("0", 2)}`
    }
    const hr = document.createElement("li")
    hr.style = "border-top: 1px solid #999";
    choices.insertBefore(hr, customChoice)
    function add(name, days) {
        const date = new Date(Date.now() - (days * 24 * 60 * 60 * 1000))
        const li = choices.querySelector("li:not(.active)").cloneNode(true)
        li.classList.remove("active")
        const link = li.children[0]
        link.innerText = name
        link.href = link.href.replace(/f_range=\d/, "")
        link.href += `&start=${dateToNicoString(date)}`
        link.href += `&end=${dateToNicoString(new Date())}`
        choices.insertBefore(li, customChoice)
    }
    add("3ヶ月以内", 90)
    add("1年以内", 365)
})()