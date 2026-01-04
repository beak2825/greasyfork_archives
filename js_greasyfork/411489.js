// ==UserScript==
// @name         KFC-9V
// @namespace    none
// @version      102.0
// @description  script
// @author       roomowner_js
// @match        gartic.io/*
// @grant        window.close
// @grant        window.onbeforeunload = null
// @require      https://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/411489/KFC-9V.user.js
// @updateURL https://update.greasyfork.org/scripts/411489/KFC-9V.meta.js
// ==/UserScript==
var $ = window.$;
var lastkickedroom = window.location.href;

var copySpace = document.createElement("input");
copySpace.style = "position:fixed;margin-top:-50px;";
copySpace.setAttribute("id","kopispace");
copySpace.setAttribute("value","‎");
document.body.appendChild(copySpace);

var myname = document.createElement("input");
myname.style = "position:fixed;margin-top:-50px;";
myname.setAttribute("id","myname");
myname.setAttribute("value","ⱤɆᗪ≫RØØMØWNER");
document.body.appendChild(myname);

var copyName = document.createElement("input");
copyName.style = "position:fixed;margin-top:-50px;";
copyName.setAttribute("id","kopiname");
copyName.setAttribute("placeholder","Click any nickname");
document.body.appendChild(copyName);

var c;
setTimeout(function(){
c = setInterval(function(){
if(document.title.indexOf("#") !== -1){
          document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
    clearInterval(c);
          }
});
}, 1000);

document.body.addEventListener("keydown", logkey);
//window.addEventListener('load', submitAction);

function logkey(){
 if(event.keyCode == 27){
  window.open(window.location.href, "_blank");
            document.getElementById('exit').click();document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
            setTimeout(function(){
  window.close();
  },5000);
 }
    if(event.keyCode == 109){
  document.getElementById("exit").click();document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
 }
    if(event.keyCode == 106){
    document.getElementById("kopispace").select();
    document.getElementById("kopispace").setAttribute("disabled","disabled");
    document.execCommand("copy");
    document.getElementById("kopispace").removeAttribute("disabled");
  }
    if(event.keyCode == 33){
    document.getElementById("myname").select();
    document.getElementById("myname").setAttribute("disabled","disabled");
    document.execCommand("copy");
    document.getElementById("myname").removeAttribute("disabled");
  }
          if(event.keyCode == 111){
        var grgr = lastkickedroom;
        window.location.href = grgr;
  }
}

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
              var lastwindow2 = window.location.href;
            document.getElementById('exit').click();document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
            clearInterval(lol);
            setTimeout(function(){
                window.location.href = lastwindow2;
            },3500);
      }
  }
  }, 1);
lol();