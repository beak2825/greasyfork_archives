// ==UserScript==
// @name rozetka change from UAH to USD
// @description rozetka.com.ua change to USD
// @namespace Violentmonkey Scripts
// @match https://*.rozetka.com.ua/notebooks/*
// @match https://*.rozetka.com.ua/videocards/*/*/*
// @match https://*.rozetka.com.ua/*
// @match https://*rozetka.com.ua/*
// @match https://*rozetka.com.ua/*/*
// @match https://*rozetka.com.ua/*/*/*
// @grant none
// @version 0.0.4
// @downloadURL https://update.greasyfork.org/scripts/380501/rozetka%20change%20from%20UAH%20to%20USD.user.js
// @updateURL https://update.greasyfork.org/scripts/380501/rozetka%20change%20from%20UAH%20to%20USD.meta.js
// ==/UserScript==
////var url = "https://data.fixer.io/api/latest?access_key=bfca71b58f55ca0957680bf34f6cb792&base=EUR&&symbols=UAH";
var CURRENCY_RATE = 27.22; // price of dollars to convert
var a = document.getElementsByClassName("g-price-uah");

// Just checking if page loaded an
// Find this face it where program jump to start <(O.O)>
window.addEventListener('DOMContentLoaded', function() {

  /***function httpGetAsync(theUrl, callback)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var sdf = xmlHttp.responseText;
            sdf= sdf.toString();
            console.log(sdf);
            callback(xmlHttp.responseText);
          }
      }
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
  }*/ //


  console.log('window - DOMContentLoaded - bubble'); // 3rd
  console.log('Start');
  for (var x = 0; x <= a.length; x++) {
    var str = a[x].innerText;
    var res = str.toString();
    res = res.replace(/\s/g, '');
    str = res.slice(0, -3);
    console.log(parseFloat(str) / CURRENCY_RATE);
    a[x].innerText = (parseFloat(str) / CURRENCY_RATE).toFixed(2) + " USD"; //CURRENCY_RATE
  }
  console.log('Exit');
});
