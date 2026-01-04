// ==UserScript==
// @name ltn.com.tw
// @namespace ltn.com.tw
// @include /^https?\:\/\/(?:[\w]+\.)?ltn\.com\.tw\//
// @grant none
// @description 刪掉總是在移動的文字
// @version 0.0.1.20171117131601
// @downloadURL https://update.greasyfork.org/scripts/35285/ltncomtw.user.js
// @updateURL https://update.greasyfork.org/scripts/35285/ltncomtw.meta.js
// ==/UserScript==

window.onload = function(){
  $("html>body>.boxTitle[data-desc='置頂選單']").each(
    function(index,elem){
      elem.remove()
    }
  )
  $("div#main div.marquee-bottom.marquee-bottom-head.boxTitle.boxText").each(
    function(index,elem){
      elem.remove()
    }
  )
}