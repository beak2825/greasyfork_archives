// ==UserScript==
// @name        WaniKani Chrome Font Fix
// @namespace   kwoverride
// @description Make New Unlocks and Critical Items bigger
// @include     https://www.wanikani.com/recent-unlocks*
// @include     https://www.wanikani.com/critical-items*
// @include     https://www.wanikani.com/burned-items*
// @include     https://www.wanikani.com/lesson/session*
// @include     https://www.wanikani.com/review/session*
// @version     1.0
// @author      Lukasz Kwasek
// @grant       GM_addStyle
// @run-at      document-start
// @grant       unsafeWindow
// @require     http://code.jquery.com/jquery-1.11.2.min.js
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/394785/WaniKani%20Chrome%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/394785/WaniKani%20Chrome%20Font%20Fix.meta.js
// ==/UserScript==


GM_addStyle ( `
#character > span {
    font-family: "Hiragino Sans", "Hiragino Maru", "Meiryo", "Source Han Sans Japanese", "NotoSansCJK", "TakaoPGothic", "Yu Gothic", "ヒラギノ角ゴ Pro W3", "メイリオ", "Osaka", "MS PGothic", "ＭＳ Ｐゴシック", "Noto Sans JP", sans-serif
}

#user-response {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic Pro", "Meiryo", "Source Han Sans Japanese", "NotoSansCJK", "TakaoPGothic", "Yu Gothic", "ヒラギノ角ゴ Pro W3", "メイリオ", "Osaka", "MS PGothic", "ＭＳ Ｐゴシック", "Noto Sans JP", sans-serif
}

` );

$(function() {

});




