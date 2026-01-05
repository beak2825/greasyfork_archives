// ==UserScript==
// @name Closers JP Hash Inspector
// @namespace http://fb.me/yuneharuka
// @description Inspect the Hash for bypasser
// @include https://cls.sega-online.jp/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant unsafeWindow
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/23313/Closers%20JP%20Hash%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/23313/Closers%20JP%20Hash%20Inspector.meta.js
// ==/UserScript==

var date = new Date();
var timestamp = date.getTime();

$("#headerInfo").each(function () {
  $(this).append('\
  <div class="vmHashContainer" style="margin: 10px 0 0 20px;font-size: 12px;float: right;">\
  <button style="\
      background: #545454;\
      width: 90px;\
      height: 20px;\
      margin-left: 10px;\
      text-align: center;\
      border-radius: 2px;\
      border: 0;\
      line-height: 20px;\
      color: #ffffff;\
  "class="vmGetHash">Get Hash</button></div>');
});

$(".vmHashContainer").on("click","button.vmGetHash",function(){

    if ($(".vmHash").length == 0){
      $.get("/auth/geturl/?time=" + timestamp,
        function(data){
        var objData = $.parseJSON(data);
		$(".vmGetHash").before('<input class="vmHash" style="width:280px;padding:2px"value="'+objData.option[0].val+'">');
      });
    }
});