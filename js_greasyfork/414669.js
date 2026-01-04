// ==UserScript==
// @name         redirect2aoj-beta.js
// @namespace    AOJ
// @version      0.2
// @description  すべての提出画面で，指定した言語と結果で検索できるボタンを自動で追加
// @author       Bondo
// @match      http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/414669/redirect2aoj-betajs.user.js
// @updateURL https://update.greasyfork.org/scripts/414669/redirect2aoj-betajs.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------

$(function(){
    var len = $('div.dat > a').length
    var url = $('div.dat > a').eq(len-1).text();
    window.location.replace(url);
});