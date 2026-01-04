// ==UserScript==
// @name         k44n_js
// @namespace    none
// @version      103.0
// @description  script
// @author       k44n_js
// @match        gartic.io/*
// @grant        window.close
// @require      https://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/410556/k44n_js.user.js
// @updateURL https://update.greasyfork.org/scripts/410556/k44n_js.meta.js
// ==/UserScript==
var c;
setTimeout(function(){
c = setInterval(function(){
if(document.title.indexOf("#") !== -1){
          document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
    clearInterval(c);
          }
});
}, 1000);
var $ = window.$;
var lastkickedroom = window.location.href;

var copyName = document.createElement("input");
copyName.style = "position:fixed;margin-top:-50px;";
copyName.setAttribute("id","kopiname");
copyName.setAttribute("placeholder","Click any nickname");
document.body.appendChild(copyName);

  var lol = setInterval(function(){
      var documentText = document.body.innerText;
      var searched = documentText.indexOf("PASİF");
      if(searched !== -1){
          document.getElementsByClassName('btYellowBig  ic-yes')[0].click();
  }
      var searchedo = documentText.indexOf("PROFİL");
      if(searchedo !== -1){
          document.getElementById("kopiname").value = document.getElementsByClassName("content profile")[0].innerText.split("\n")[1];
          document.getElementById("kopiname").select();
          document.execCommand("copy");
  }
      var searchedr = documentText.indexOf("Zaten bu cihazda oynuyorsunuz");
      if(searchedr !== -1){
          document.getElementsByClassName('btYellowBig  ic-yes')[0].click();
          document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
  }
      var searchedp = documentText.indexOf("HATA");
      if(searchedp !== -1){
          document.getElementsByClassName('btYellowBig  ic-yes')[0].click();
          document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
  }
      var searchedx = documentText.indexOf("CEVAPLAR");
      if(searchedx !== -1){
          document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].style = "background-color:black;color:white;";
  }
      var searched2 = documentText.indexOf("KURALLAR");
      if(searched2 !== -1){
          document.cookie = "durdurma";
          document.getElementsByClassName('btYellowBig ic-yes')[0].click();
          lastkickedroom = window.location.href;
          var msgalrt = document.getElementsByClassName("msg alert");
          for (var i2 = 0; i2 < msgalrt.length; i2++){
           document.getElementsByClassName("msg alert")[i2].innerHTML = "eski kick silindi";
          }
      }
      var searched3 = documentText.indexOf("adlı kullanıcıyı atmak için oy verdi");
      if(searched3 !== -1){
        var priceEls = document.getElementsByClassName("msg alert");
        var sayac = 0;
          for (var i = 0; i < priceEls.length; i++){
            sayac = i;
          }
        var price = priceEls[sayac].innerText;
        var b = price.split(" ");
        var mynickname = document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].innerText; //THIS LINE TAKING YOUR USERNAME IN GAME
          if(b.indexOf(mynickname) !== -1){
            document.getElementById('exit').click();document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
            setTimeout(function(){
            window.location.href = lastkickedroom;
            },4000);
      }
  }
  }, 1);
lol();
//K44N_JS