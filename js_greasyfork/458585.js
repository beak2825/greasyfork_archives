// ==UserScript==
// @name Автозапил на 8
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Автозапил
// @author bog
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/458585/%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D0%B8%D0%BB%20%D0%BD%D0%B0%208.user.js
// @updateURL https://update.greasyfork.org/scripts/458585/%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D0%B8%D0%BB%20%D0%BD%D0%B0%208.meta.js
// ==/UserScript==

(function() {
'use strict';
if(typeof (my_id) != "undefined"){
var players = 8;
var liga =1;//лига от 1 бронза и далее по порядку
var money =20;
setInterval(function(){
if(gam_state==""){
$("#buttonCreateGame").click();
$("#crt_players").val(players);
$("#crt_league").val(liga);
$("#crt_bet").val(money);
$("#crt_prior").click();
setTimeout(function(){
$("#gmc_btn_create").click();
},500)
}
},1000)

}

})();