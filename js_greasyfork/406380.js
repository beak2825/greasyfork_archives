// ==UserScript==
// @name         かりんと
// @match        https://up2.karinto.in/uploader/download/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @description  try to take over the world!
// @version 0.0.1.20200702094211
// @namespace https://greasyfork.org/users/83168
// @downloadURL https://update.greasyfork.org/scripts/406380/%E3%81%8B%E3%82%8A%E3%82%93%E3%81%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/406380/%E3%81%8B%E3%82%8A%E3%82%93%E3%81%A8.meta.js
// ==/UserScript==

$(function(){
    $("#download_pass").val("2323");
    $('#down_check').trigger("click");

})(jQuery);