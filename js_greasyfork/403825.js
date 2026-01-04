// ==UserScript==
// @name         Twitch Sadakat Puanı
// @name:en      Twitch CHANNEL POINTS Clicker
// @namespace    fb.com/ozzwizard instagram.com/ozz.wizard
// @version      1.0
// @description  Otomatik Twitch Sadakat Puanı Tıklayıcı
// @description:en Automatic Twitch CHANNEL POINTS Clicker
// @author       Musa Köşker
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403825/Twitch%20Sadakat%20Puan%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/403825/Twitch%20Sadakat%20Puan%C4%B1.meta.js
// ==/UserScript==

function musakosker(path) {
    var a = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(a ==null)
    {
       return null;
    }
    return  a;
}

var zaman = 900;
var ilk = false;
function tiklandi(yol){
    if(ilk){
    musakosker(yol).placeholder = "Tahmini kalan süren : "+zaman;
zaman = zaman -1;
    }
    else{
        musakosker(yol).placeholder = "Geri sayım için ilk +50 bekleniyor";
    }
}
    setInterval(function(){
    var a = musakosker("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[2]/div/button/p");
    if(a == null)
    {
         if( musakosker("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[2]/div[2]/div[1]/div/div/div/div[2]/div/div/div/button")!=null){
        musakosker("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[2]/div[2]/div[1]/div/div/div/div[2]/div/div/div/button").click();
             ilk = true;
             zaman = 900;
         }
        tiklandi("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[2]/div[1]/div/div[2]/div/div/textarea");
    }
    else{
       if( musakosker("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[3]/div[2]/div[1]/div/div/div/div[2]/div/div/div/button")!=null){
      musakosker("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[3]/div[2]/div[1]/div/div/div/div[2]/div/div/div/button").click();
           ilk = true;
        zaman = 900;
       }
      tiklandi("/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/section/div/div[5]/div[3]/div[1]/div/div[2]/div/div/textarea");
    }
},1000);

