// ==UserScript==
// @name         Score-Tolerance
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  SDVX, CHUNITHM, オンゲキの譜面保管所で許容を表示します。
// @description  （譜面保管所のデータを使用しているので、SDVXのデータは最新でない可能性があります）
// @author       null
// @include      *sdvx.in*
// @icon         
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425290/Score-Tolerance.user.js
// @updateURL https://update.greasyfork.org/scripts/425290/Score-Tolerance.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.onload = function () {
    let script = document.createElement('script');
    script.setAttribute('src', 'https://sto9.github.io/Score-Tolerance/function.js');
    document.head.appendChild(script);
    script.addEventListener('load', function () {
      UpdateTable();
    });
  };
})();
