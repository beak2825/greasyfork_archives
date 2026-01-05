// ==UserScript==
// @name         Wishing Well - Quick Wish TM
// @namespace    http://tampermonkeyh.net
// @version      1.1
// @description  Writes donation amount and wish once the page loads
// @author       Nyu (clraik)
// @match        http://www.neopets.com/wishing.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29565/Wishing%20Well%20-%20Quick%20Wish%20TM.user.js
// @updateURL https://update.greasyfork.org/scripts/29565/Wishing%20Well%20-%20Quick%20Wish%20TM.meta.js
// ==/UserScript==


var i = GM_getValue('wishcount', 0);
GM_setValue('wishcount', i + 1);


$(document).ready(function(){
    $("[name='donation']").val(21);//Replace 21 with the amount of nps you want to donate
    $("[name='wish']").val("Turned Tooth");//Replace Turned Tooth with the item you want
    if (i % 8!==0) {
        setTimeout(function(){ $("[value='Make a Wish']").click();},1000);// Wait 1 second before clicking submit
    }
});