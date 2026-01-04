// ==UserScript==
// @name         広告削除＆文字サイズ固定
// @author       MIO
// @namespace    https://www.x-feeder.info/
// @version      0.1b
// @description  タイトルの通りです。
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @grant        none
// @description  ja
// @downloadURL https://update.greasyfork.org/scripts/463869/%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4%EF%BC%86%E6%96%87%E5%AD%97%E3%82%B5%E3%82%A4%E3%82%BA%E5%9B%BA%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/463869/%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4%EF%BC%86%E6%96%87%E5%AD%97%E3%82%B5%E3%82%A4%E3%82%BA%E5%9B%BA%E5%AE%9A.meta.js
// ==/UserScript==
(function 文字サイズ強制変更() {
  'use strict';
    const LETTER_SIZE = "14";
    const REG=RegExp('(?=<span style="font-size: [0-9]*px;">)(?!<span style="font-size:'+LETTER_SIZE+'px;">)');
    const IDIOM='<span style="font-size:'+LETTER_SIZE+'px;">'
    setInterval(function(){
    const elm = document.getElementById("feed_list");
    const elm_c = elm.innerHTML;
    const judge = REG.test(elm_c);
    if(judge){elm.innerHTML = elm_c.replace(/<span style="font-size: [0-9]*px;">/g,IDIOM);
}}, 500);})();
function 広告除去(){
    document.getElementById("main_right").
    removeChild(document.getElementById("main_right").
    firstChild);document.getElementById("main_right").
    removeChild(document.getElementById("main_right").lastChild);document.getElementById("wrapper").
    removeChild(document.getElementById("wrapper").lastChild);document.getElementById("wrapper").
    removeChild(document.getElementById("wrapper").lastChild);
};広告除去();広告除去();