// ==UserScript==
// @name        ColorAskMona
// @namespace   sei0o.askmona.color
// @description AskMonaのレスに独自に色をつけます。
// @include     http://askmona.org/*
// @version     1.0.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js  
// @downloadURL https://update.greasyfork.org/scripts/10454/ColorAskMona.user.js
// @updateURL https://update.greasyfork.org/scripts/10454/ColorAskMona.meta.js
// ==/UserScript==

$("p.res").each(function(idx, elm){
  var m = $(this).html().match(/\[\[(\d+)\]\]/);
  if (m) {
    for(var i=0; i <= 7; i++) { // 他のlvクラスを削除
      $(this).removeClass("lv"+ i);
    }
    
    var level = parseInt(m[1], 10); // lvクラス追加
    $(this).addClass("lv"+ level);
    
    // [[n]]自体は小さく貼り直す
    $(this).html(
      $(this).html().replace(/\[\[(\d+)\]\]/, "")
    );
    $(this).append("<span style='font-size: 0.8rem; color: #777;'>"+ m[0] +"</span>");
  }
});