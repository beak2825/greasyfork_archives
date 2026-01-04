// ==UserScript==
// @name         dark mode portal mpk
// @namespace    http://tampermonkey.net/
// @version      0.29
// @description  tryb nocny
// @author       obci
// @match        https://portal.mpk.krakow.pl/pp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krakow.pl
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469634/dark%20mode%20portal%20mpk.user.js
// @updateURL https://update.greasyfork.org/scripts/469634/dark%20mode%20portal%20mpk.meta.js
// ==/UserScript==

// usuniecie witamy
$("body > div.container.mb-3 > div.alert.alert-success.alert-dismissible.m-0.mb-1").remove();

// rysowanie przycisku w lewym górym rogu
const btn = $('<div><button type="button" id="button1" style="background-color:#759bc9;"></button></div>')
.css({
    position: "fixed",
    left: 0,
    top: 0,
    "z-index":"1200"
  })
btn.appendTo("body");


const btn1 = document.querySelector("#button1");
const currentTheme = localStorage.getItem("theme");
let theme;

// wykrycie aktualnego trybu i wpisanie napisu w przycisk
if (currentTheme == "dark") {
  btn1.innerText="Tryb jasny ";
  darkmode();
} else {
  btn1.innerText="Tryb ciemny";
  lightmode()
}

// podpięcie pod przycisk zmiany trybu
btn1.addEventListener("click", function() {
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  btn1.innerText="Tryb ciemny";
  theme = "light";
  lightmode();
} else {
  btn1.innerText="Tryb jasny ";
  theme = "dark";
  darkmode();
}

localStorage.setItem("theme", theme);
});


//tryb jasny - domyslne ustawienia kolorów
function lightmode()
{
 $("body").css({
  "background-color": "rgb(252, 247, 238)",
  "background-image": "url('https://portal.mpk.krakow.pl//static/img/logo_mono_szary.png')",
  "background-repeat": "no-repeat",
  "background-position":"120% 90%",
  "background-size": "60%",
  })
  $(".table").css({"color": "#212529"});
  $(".text-muted").attr('style', "color: #6c757d !important");
  $(".text-secondary").attr('style', "color: #6c757d !important");
  $(".text-secondary").css({"font-size": "95%"});
  $(".card-text").attr('style', "background-color: #f8f9fa !important");
  $(".card-header").attr('style', "background-color: rgba(0,0,0,.03) !important");
  $(".card-footer").attr('style', "background-color: rgba(0,0,0,.03) !important");
  $(".card-body").attr('style', "background-color: white !important");
  $(".navbar").attr('style', "background-color: lightgrey");
  $(".modal-header").attr('style', "background-color: #f8f9fa !important");
  $(".modal-body").attr('style', "background-color: white !important");
  $("a").css({"color":"black"});
  $(".table-warning").attr('style', "background-color: #ffeeba !important");
  $(".dropdown-menu").attr('style', "background-color: white !important");
  $(".bg-secondary").attr('style', "background-color: #6c757d !important");
  if(location.href=="https://portal.mpk.krakow.pl/pp/grafik/"){
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-2].parentElement).attr('style', "display: flex");
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-2].parentElement.parentElement).attr('style', "display: flex");

     if(document.querySelectorAll("table").length == 6 || document.querySelectorAll("table").length == 7 || document.querySelectorAll("table").length == 8)
      {
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-3].parentElement).attr('style', "display: flex");
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-3].parentElement.parentElement).attr('style', "display: ''");
 $(document.querySelector("body > div.container.mb-3 > div:nth-child(2) > div:nth-child(4) > div > div.card-body.p-0 > div")).attr('style', "display: flex");
           $(document.querySelector("body > div.container.mb-3 > div:nth-child(2) > div:nth-child(5) > div > div.card-body.p-0 > div")).attr('style', "display: flex");

      }
  }

  if(location.href=="https://portal.mpk.krakow.pl/pp/"){
  $(".card-text").css({
    "overflow-y": "auto",
    "max-height": "550px"
    })
  }

  if($("body > div.container.mb-3 > div:nth-child(2) > div.col-12.mt-3.mb-3 > div > div.card-body.p-0 > p > table > tbody").find("button").length > 0 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    $(".modal-content").attr('style', "zoom: 75% !important");

}

// tryb ciemny
function darkmode()
{
   $("body").css({
  "background-color": "rgb(80, 80, 80)",
  "background-image": "url('https://portal.mpk.krakow.pl//static/img/logo_mono_szary.png')",
  "background-repeat": "no-repeat",
  "background-position":"120% 90%",
  "background-size": "60%",
  })

  $(".table").css({"color": "aliceblue"});
  $(".text-muted").attr('style', "color: black !important");
  $(".text-secondary").attr('style', "color: black !important");
  $(".text-secondary").css({"font-size": "95%"});
  $(".card-text").attr('style', "background-color: rgb(140, 140, 140) !important");
  $(".ml-1").attr('style', "background-color: rgb(100, 100, 100) !important");
  $(".card-header").attr('style', "background-color: grey !important");
  $(".card-footer").attr('style', "background-color: grey !important");
  $(".card-body").attr('style', "background-color: darkgrey !important");
  $(".navbar").attr('style', "background-color: darkgrey");
  $(".modal-header").attr('style', "background-color: darkgrey !important");
  $(".modal-body").attr('style', "background-color: rgb(170, 170, 170) !important");
  $("a").css({"color":"white"});
  $(".table-warning").attr('style', "background-color: #b9a664 !important");
  $(".dropdown-menu").attr('style', "background-color: grey !important");
  if(location.href=="https://portal.mpk.krakow.pl/pp/grafik/"){
   if(document.querySelectorAll("table")[document.querySelectorAll("table").length-2].parentElement){
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-2].parentElement).attr('style', "display: flex");
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-2].parentElement.parentElement).attr('style', "display: flex");
}
            if(document.querySelectorAll("table").length == 6 || document.querySelectorAll("table").length == 7 || document.querySelectorAll("table").length == 8)
      {
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-3].parentElement).attr('style', "display: flex");
    $(document.querySelectorAll("table")[document.querySelectorAll("table").length-3].parentElement.parentElement).attr('style', "display: ''");
 $(document.querySelector("body > div.container.mb-3 > div:nth-child(2) > div:nth-child(4) > div > div.card-body.p-0 > div")).attr('style', "display: flex");
           $(document.querySelector("body > div.container.mb-3 > div:nth-child(2) > div:nth-child(5) > div > div.card-body.p-0 > div")).attr('style', "display: flex");
      }

       document.querySelectorAll('[style*="outline: green solid 3px"]').forEach(function(el) {
      el.style.outline = 'blue solid 3px';
      el.style.color = 'white';
    });

  }

  if(location.href=="https://portal.mpk.krakow.pl/pp/"){
  $(".card-text").css({
    "overflow-y": "auto",
    "max-height": "550px"
    })
  }

  if($("body > div.container.mb-3 > div:nth-child(2) > div.col-12.mt-3.mb-3 > div > div.card-body.p-0 > p > table > tbody").find("button").length > 0 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    $(".modal-content").attr('style', "zoom: 75% !important");

}

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('[style*="outline: green solid 3px"]').forEach(function(el) {
      el.style.outline = 'blue solid 3px';
      el.style.color = 'white';
    });
  }, 200);
});
