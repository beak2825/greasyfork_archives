// ==UserScript==
// @name         Pikabu Haruhiism
// @namespace    http://ryuunosuke.me/
// @version      0.1
// @description  thx to http://pikabu.ru/story/pechenki_po_suzumiya_haruhi_no_yuuutsu_3559752#comments
// @author       Akasaka Ryuunosuke
// @match        http://pikabu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11583/Pikabu%20Haruhiism.user.js
// @updateURL https://update.greasyfork.org/scripts/11583/Pikabu%20Haruhiism.meta.js
// ==/UserScript==

if(document.getElementById("brovdiv") != null) {
    var root="//software.vladkorotnev.me/service/customcookie/haruhi/";
    var images = ["haruhi_k.png","haruhi.png","mikuru.png","nagato.png","kyon.png","koizumi.png"];
    var descriptions = ["Судзумия Харухи (версия Коёэн)","Судзумия Харухи","Асахина Микуру","Нагато Юки","Кён","Коидзуми Ицки"];
    
    var clink = document.getElementById("brovdiv").children[0];
    var imgel = clink.children[0];
    
    var i=Math.floor(Math.random()*images.length);
    
    clink.href = "http://pikabu.ru/story/pechenki_po_suzumiya_haruhi_no_yuuutsu_3559752";
    imgel.title = descriptions[i];
    imgel.src= root+images[i];
    imgel.height=300;
    
    $('.footer-fornex').html('Печеньки by<a href="http://pikabu.ru/story/pechenki_po_suzumiya_haruhi_no_yuuutsu_3559752">PrincessPanda</a>');
}