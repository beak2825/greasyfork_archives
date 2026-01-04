// ==UserScript==
// @name         Pukiwiki Search Focus
// @description  検索窓にフォーカスするやつ
// @version      0.1
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/?cmd=search
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381270/Pukiwiki%20Search%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/381270/Pukiwiki%20Search%20Focus.meta.js
// ==/UserScript==

window.onload = function() {
    $('input[name="word"]').focus();
}();
