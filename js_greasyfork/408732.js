// ==UserScript==
// @name         DeepBird改行ボタン
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.deepbrid.com/service
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408732/DeepBird%E6%94%B9%E8%A1%8C%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/408732/DeepBird%E6%94%B9%E8%A1%8C%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==


$(function(){
　　//ボタン
    $('button[name="sendLink"]').after('<button type="button" class="button w-24 shadow-md mr-1 mb-2 bg-theme-1 text-white" name="autoPaste">📝</button>');

    $('button[name="autoPaste"]').click(function(e) {

　　　　navigator.clipboard.readText().then(function (clip) {

         var links = $('textarea[name="link"]').val();
         //alert(links);
         if (links == "") $('textarea[name="link"]').val(clip);
         else $('textarea[name="link"]').val(links + "\n" +clip);
　　　　});

    })

})(jQuery);