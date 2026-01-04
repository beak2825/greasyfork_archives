// ==UserScript==
// @name        Steam Search Filter
// @description 在Steam搜尋遊戲時，讓URL自動套用特定語言和類型的篩選器
// @icon https://store.steampowered.com/favicon.ico
// @author       Kamikiri
// @namespace    kamikiriptt@gmail.com
// @match     https://store.steampowered.com/search/?developer=*
// @match     https://store.steampowered.com/search/?term=*
// @match     https://store.steampowered.com/search/?publisher=*
// @match     https://store.steampowered.com/search/?snr=*&term=*
// @license     GPL
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/545942/Steam%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/545942/Steam%20Search%20Filter.meta.js
// ==/UserScript==

var m = /^(https?:\/\/store\.steampowered\.com\/search\/\?)(.*)/.exec(location.href);
if (m) location.href = m[1] + "supportedlang=tchinese%2Cschinese%2Cjapanese&category1=998&hidef2p=1&" + m[2] ;