// ==UserScript==
// @name          Cookie Clicker
// @namespace     absolut-fair.com
// @description   Füllt schneller aus
// @include       https://www.service-subway.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @version       1.0
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_info
// @grant         GM_setClipboard
// @grant         GM_addStyle
// @grant         GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/17630/Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/17630/Cookie%20Clicker.meta.js
// ==/UserScript==

$(window).ready(function() {
   if( $("#txtSearch").length ) 
   {
       $("#txtSearch").val('35229');
       unsafeWindow.SearchStore();
       setTimeout(unsafeWindow.CloseAndGo, 500);
   }
   if( $("#myDiv").length )
   {
       setTimeout(function() {
           var code = prompt("Transaktionsnr:","");
           var nowdate = new Date();
           var datestr = pad(nowdate.getUTCDate())+"/"+pad(nowdate.getUTCMonth() + 1)+"/"+nowdate.getUTCFullYear();
           $(".textfield_datePicker").val(datestr);
           $("select.textfield4:eq(0)").val(nowdate.getUTCHours()+1);
           $("select.textfield4:eq(1)").val(nowdate.getUTCMinutes());
           $("input.textfield5:eq(0)").val(code);
           $("table").each(function() {
               $(this).find("tr").each(function() {
                   $("td:last input[type=radio]", this).attr("checked", "checked"); 
               });
           });
           $("select.textfield").each(function(i) {
               $(this).attr("data-eq", i);
           });
           $("select.textfield:eq(6)").val("45442");
           $("select.textfield:eq(7)").val("45445");
           $("select.textfield:eq(8)").val("45385");
           $("select.textfield:eq(9)").val("45415");
           $("input[type=email]").val("nicolas.giese@web.de");
           $("select.textfield:eq(10)").val("No");
           $("#DdlContact").val("No");
       }, 2000);
   }
});
    
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }