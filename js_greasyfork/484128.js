// ==UserScript==
// @name     GOOGLE SIGNIN KILLER
// @version  1
// @grant    none
// @include     https://*
// @description Kills every annoyings google sign in popup
// @namespace https://greasyfork.org/users/1244564
// @downloadURL https://update.greasyfork.org/scripts/484128/GOOGLE%20SIGNIN%20KILLER.user.js
// @updateURL https://update.greasyfork.org/scripts/484128/GOOGLE%20SIGNIN%20KILLER.meta.js
// ==/UserScript==
// Donations:
// BTC: 3QNEidBuqhheozbPxxNTsagn1j89D3UGkG
// LTC(prefered !): ltc1qk98xh493a85wnwedmt60qvvwlsxwlnmjx4zxam
// DOGE : DBQ4eftz6mQNoWaLkP9KhLaLqnjrrNQzqU
// ETH : 0xf2b3372bc7ba9edd8d5e218b5810fab4e36e03aa



var _replaced = false;
var _count = 0;



function fuckGoogleSignInPopup() {
  var h = document.getElementById("credential_picker_container");
  if (h != null) {
    //alert(h.innerHTML);
    //alert('Fucking google popup killed !');
    h.style.display = 'none';
    _replaced = true;
  } else {
		_count++;
  }
  if (!_replaced && _count < 4) {setTimeout(fuckGoogleSignInPopup, 500);}
  
}

setTimeout(fuckGoogleSignInPopup, 500);