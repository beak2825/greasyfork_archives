// ==UserScript==
// @name         Havis+
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  changing things in havis
// @author       Zimek
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376158/Havis%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/376158/Havis%2B.meta.js
// ==/UserScript==

setTimeout(function(){
$("#autoRespawnTime").attr("min","0.0001");
  //  $(".custom-menu").css("margin-top", "-40px");
$("div#ad_main").remove();
}, 12000);
$("div#ad_main").remove();

$(`<style>
#chatroom{overflow-x: hidden;word-wrap: break-word}
</style>`).appendTo('head');