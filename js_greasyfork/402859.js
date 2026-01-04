"use strict";

// ==UserScript==
// @name         Nihon no Yafuoku
// @namespace    http://aarsalmon.starfree.jp/
// @version      1.0
// @description  ヤフオクでワンクリックで国内からの出品に限定して検索できます。
// @author       AAAR_Salmon
// @match        https://auctions.yahoo.co.jp/search/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402859/Nihon%20no%20Yafuoku.user.js
// @updateURL https://update.greasyfork.org/scripts/402859/Nihon%20no%20Yafuoku.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var buttonPos = document.querySelector('.acMdSearchForm .untBody .ptsOption');
  var anchorHTML = document.createElement('a');
  buttonPos.appendChild(anchorHTML);
  buttonPos.style.right = '-145px';
  anchorHTML.style.padding = '0 5px';
  anchorHTML.innerText = '国内限定';

  anchorHTML.href = function () {
    var url = new URL(location);
    url.searchParams.set('loc_cd', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47');
    return url.toString();
  }();
})();