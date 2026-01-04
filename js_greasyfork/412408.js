// ==UserScript==
// @name         Google検索結果の住所を非表示にするやつ
// @namespace    nbatotu.github.io/t
// @version      0.1
// @description  Google検索結果の住所を非表示にするやつです
// @author       You
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412408/Google%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%E4%BD%8F%E6%89%80%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/412408/Google%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%E4%BD%8F%E6%89%80%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==
window.onload = function(){

    document.getElementById("BHDErf").innerText="スクリプト使用中"
    document.getElementById("Wprf1b").innerText="住所非公開"
    document.querySelector('.Q8LRLc').innerText="不明"
}
