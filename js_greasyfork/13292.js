// ==UserScript==
// @name            Bypass IH
// @version         1.0
// @description     Bypasss la limite des 15 caractéres.
// @author          Azahet
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant           GM_addStyle
// @include         https://instant-hack.com/*
// @include         https://www.instant-hack.com/*
// @namespace  https://instant-hack.com/members/omniscient.5503/
// @downloadURL https://update.greasyfork.org/scripts/13292/Bypass%20IH.user.js
// @updateURL https://update.greasyfork.org/scripts/13292/Bypass%20IH.meta.js
// ==/UserScript==
// ==Profile==
 
//Dev par Azahet pour https://instant-hack.com
function f1(){$("iframe.redactor_textCtrl").contents().find("body").html($("iframe.redactor_textCtrl").contents().find("body").html()+"[SIZE=1][COLOR=#ffffff]...............[/COLOR][/SIZE]")}$(".submitUnit").append('<input id="bypass" class="button rep" value="Passer la limite des 15 caractères" type="button">'),$("#bypass").click(f1); 

