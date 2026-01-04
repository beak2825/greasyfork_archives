// ==UserScript==
// @name         提出済み課題削除
// @namespace    twitter.com/to_ku_me
// @version      0.1.3
// @description  芝浦のlmsで済んでいるものを非表示にします
// @author       とくめいっ！
// @match        https://scomb.shibaura-it.ac.jp/portal/contents/home*
// @icon         http://www.sic.shibaura-it.ac.jp/MoSICA/shikaz.png
// @downloadURL https://update.greasyfork.org/scripts/435612/%E6%8F%90%E5%87%BA%E6%B8%88%E3%81%BF%E8%AA%B2%E9%A1%8C%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/435612/%E6%8F%90%E5%87%BA%E6%B8%88%E3%81%BF%E8%AA%B2%E9%A1%8C%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==



function firstscript() {

    let lists_ = document.getElementsByClassName("complete");
    for (let i = 0; i < lists_.length; i++) {
        let lists__ = lists_[i].parentNode;
        lists__.style.display ="none";
    }
}

window.onload = firstscript;