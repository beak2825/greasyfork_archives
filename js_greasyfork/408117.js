// ==UserScript==
// @name         TwitterのDraft画面に出る文字をsudoの注意書きに変更するやつ
// @namespace    https://github.com/yuuki76
// @version      1.0.0
// @description  名前のまんま
// @author       Kris57 aka yuuki76
// @match        https://twitter.com/*
// @grant        none
// @licence      CC-BY-SA-4.0; https://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/408117/Twitter%E3%81%AEDraft%E7%94%BB%E9%9D%A2%E3%81%AB%E5%87%BA%E3%82%8B%E6%96%87%E5%AD%97%E3%82%92sudo%E3%81%AE%E6%B3%A8%E6%84%8F%E6%9B%B8%E3%81%8D%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/408117/Twitter%E3%81%AEDraft%E7%94%BB%E9%9D%A2%E3%81%AB%E5%87%BA%E3%82%8B%E6%96%87%E5%AD%97%E3%82%92sudo%E3%81%AE%E6%B3%A8%E6%84%8F%E6%9B%B8%E3%81%8D%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==
(
    window.onload = function() {
        document.getElementsByClassName('public-DraftEditorPlaceholder-inner')[0].innerHTML = "#1) Respect the privacy of others.\n#2) Think before you type.\n#3) With great power comes great responsibility.\n"
    }
)();