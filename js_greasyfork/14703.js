// ==UserScript==
// @name         Sergey Schmidt - $1.50 ones
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.0
// @description  Sergey Schmidt - Rate channels according to our instructions
// @author       saqfish
// @include      file://*
// @include      *google.com/evaluation/endor*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14703/Sergey%20Schmidt%20-%20%24150%20ones.user.js
// @updateURL https://update.greasyfork.org/scripts/14703/Sergey%20Schmidt%20-%20%24150%20ones.meta.js
// ==/UserScript==

$("h2:last-of-type").find('table').each(function(z){
    $(this).children().children().eq(1).children().eq(6).children().eq(1).children().each(function(zz){
       if(zz == 4){
        $(this).prop('checked',true);   
       }
    }); 
});