// ==UserScript==
// @name         Eski Tasarım
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Home tuşuna basınca eski tasarıma götürür.
// @author       Windows 2000 Datacenter Server
// @match        http://www.incisozluk.com.tr/*
// @grant        Yok
// @downloadURL https://update.greasyfork.org/scripts/22553/Eski%20Tasar%C4%B1m.user.js
// @updateURL https://update.greasyfork.org/scripts/22553/Eski%20Tasar%C4%B1m.meta.js
// ==/UserScript==

(function() {
    'use strict';

//kod başı yarramın başı
document.onkeydown = keyKontrol;
//kodu kopyalama sikerim yoksa
function keyKontrol(key){
    var keyKod;
    keyKod = key.which;
    if(keyKod == 36){
        window.location="http://www.incisozluk.com.tr/index.php?c=yenit&t=0";
    }
}
})();