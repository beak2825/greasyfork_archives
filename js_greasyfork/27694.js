// ==UserScript==
// @name         OfferToro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automation
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @icon            http://i.imgur.com/FhCT7Ke.png
// @icon64URL       http://i.imgur.com/8VRBwr7.png
// @match        http://*offertoro.com/*
// @downloadURL https://update.greasyfork.org/scripts/27694/OfferToro.user.js
// @updateURL https://update.greasyfork.org/scripts/27694/OfferToro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var priceEls = document.getElementsByClassName('offer-title');

//Vid 1
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('Videos & Viral Content')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}

//Vid 2
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('Must-Read Stories')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}

//Vid 3
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('Read, Watch & Learn!')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}

//Vid 4
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('Must-Watch Videos')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}
//Vid 5
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('Lifestyle Trends')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}

//Vid 6
for (var i = 0; i < priceEls.length; i++) {
  var targ = priceEls[i].innerText;
  if (targ.indexOf('The home page for everything viral')>=0)
  {
  	priceEls[i].click();
  	break;
  }
}
window.focus();

    /*var priceEls = document.getElementsByClassName("description");
    for (var i = 0; i < priceEls.length; i++) {
        var targ = priceEls[i].innerText;
        if (targ.indexOf('unlimited times a day, every day!')>=0)
        {
            priceEls[i].click();
        }
    }*/
})();