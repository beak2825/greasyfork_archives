// ==UserScript==
// @name         FernusMonke
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  İndirme botu.
// @author       Baran Can Altun
// @match        https://yayin.eduasist.com/fernus/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eduasist.com
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/475110/FernusMonke.user.js
// @updateURL https://update.greasyfork.org/scripts/475110/FernusMonke.meta.js
// ==/UserScript==

(function() {
    'use strict';

var stickTo = document.evaluate("/html/body/div[2]/div/div/div[1]/h2", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
let downButton = document.createElement("BUTTON");
    downButton.innerHTML = "Hepsini İndir!";
    stickTo.appendChild(downButton);

    downButton.onclick = () => {
  Downloader();
};
let secButton = document.createElement("BUTTON");
    secButton.innerHTML = "Seçimleri Doldur!";
    stickTo.appendChild(secButton);

    secButton.onclick = () => {
    sinifSelection();
    bransSelection();
    konuSelection();
        $(function(){
      $('#testIsmineEkle ul input[type=checkbox]').each(function(i,item){
        if(item.id != "isim_1" && item.id != "isim_2"){
           $(item).prop("checked", "checked");
        }
      });
    });
};

function optionFinder(select,option) {
  option = option.trim();
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].innerHTML.toLocaleLowerCase().trim() == option.toLocaleLowerCase() || select.options[i].innerHTML.toLocaleUpperCase().trim() == option.toLocaleUpperCase()) {
      var foundOption = select.options[i];
      break;
    }
  }
return foundOption.value;
}

function sinifSelection(){
  setTimeout(function() {
  var sinifSec = document.getElementById("hedefSinif");
  var sinif = document.querySelector("#isimler > a:nth-child(3)").innerHTML;
  sinif = sinif.substring(0, sinif.indexOf(".")+7);
    sinifSec.value = optionFinder(sinifSec,sinif);
   sinifSecildi();
})}

function bransSelection(){
  setTimeout(function() {
    var bransSec = document.getElementById("hedefBrans");
    var brans= document.querySelector("#isimler > a:nth-child(4)").innerHTML;
      if(brans.includes("Soru Bankaları")){
        brans= document.querySelector("#isimler > a:nth-child(5)").innerHTML;
      }
      if(brans.includes("Sınıf")) brans = brans.substring(brans.indexOf("Sınıf")+6);
      else if(brans.includes("TYT") || brans.includes("AYT")){
          brans = brans.substring(0,brans.indexOf("Soru Bankası")).trim();
          brans = brans.substring(4);
      }

      if(brans.includes("Soru Bankası")){
        brans = brans.substring(0, brans.indexOf("Soru Bankası")-1);
          if(brans.includes("TYT") || brans.includes("AYT") ){
          brans = brans.substring(4);
          }
      }else if(brans.includes("SORU BANKASI")){
      brans = brans.substring(0, brans.indexOf("SORU BANKASI")-1);
          if(brans.includes("TYT") || brans.includes("AYT") ){
          brans = brans.substring(4);
          }
  }
      bransSec.value = optionFinder(bransSec,brans);
      bransSecildi();
},1000)}

function konuSelection(){
  setTimeout(function() {

    var konuSec = document.getElementById("hedefKonu");
    var konu = document.querySelector("#isimler > a:nth-child(5)").innerHTML;
    if(konu.includes("Soru Bankası") || konu.includes("Soru Bankasi")){
      konu = document.querySelector("#isimler > a:nth-child(6)").innerHTML;
    }
    if(konu.includes(":")){
    var done = konu.substring(konu.indexOf(":")+2);
    done = done.toLocaleLowerCase();
    done = done.charAt(0).toUpperCase() + done.slice(1);

    konuSec.value = optionFinder(konuSec,done);
    }else{
      done =konu.split(/[0-9]/);
      for(var i = 1; i <done.length; i++){
        if(done[i] !== ""){
          done = done[i];
          break;
        }
      }
      done = done.toLocaleLowerCase();
      done = done.charAt(0).toUpperCase() + done.slice(1);
      chosen = optionFinder(konuSec,done);
      if(chosen){
        konuSec.value = optionFinder(konuSec,done);
      }else{
        var newAttempt = document.getElementById("isimler");
        var a = newAttempt.querySelectorAll("a");
        a=a[a.length-1];
        a = a.toLocaleLowerCase();
        a = a.charAt(0).toUpperCase() + a.slice(1);
        konuSec.value = optionFinder(konuSec,a);
      }
    }
},3000)}

function Downloader() {
  var select = document.evaluate("//*[@id='kaynakContainer']/select", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var opts = select.querySelectorAll("option");
  var btn = document.evaluate("/html/body/div[2]/div/div/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  sinifSelection();
  bransSelection();
  konuSelection();

  setTimeout(function(){

    var i = 0;
    var interval = 3000;
    $(function(){
      $('#testIsmineEkle ul input[type=checkbox]').each(function(i,item){
        if(item.id != "isim_1" && item.id != "isim_2"){
           $(item).prop("checked", "checked");
        }
      });
    });
      opts.forEach(function(node, index) {
         setTimeout(function () {
          if (node.innerHTML != "GERİ") {
            node.selected = true;
            btn.click();
          }
           i++;
        }, index* interval);
        }
      );
  },4000);
}
    }
)();
