// ==UserScript==
// @name MultiPaytm
// @namespace irctcpay
// @match https://secure.paytm.in/*
// @version     1
// @grant       none
// @description paytm irctcpay
// @downloadURL https://update.greasyfork.org/scripts/411552/MultiPaytm.user.js
// @updateURL https://update.greasyfork.org/scripts/411552/MultiPaytm.meta.js
// ==/UserScript==
var payint=setInterval(function(){j();},1000);
function j(){ 
  if(document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input')){
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').dispatchEvent(new Event('focus'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').dispatchEvent(new Event('keydown'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').value="****17005026****";
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').dispatchEvent(new Event('keyup'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').dispatchEvent(new Event('input'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div._2KRx._2OlL.fl > div > div > input').dispatchEvent(new Event('blur'));
    document.querySelector('#mm').dispatchEvent(new Event('focus'));
    document.querySelector('#mm').dispatchEvent(new Event('keydown'))
    document.querySelector('#mm').value="07";
    document.querySelector('#mm').dispatchEvent(new Event('keyup'));
    document.querySelector('#mm').dispatchEvent(new Event('input'));
    document.querySelector('#mm').dispatchEvent(new Event('blur'))
    document.querySelector('#yy').dispatchEvent(new Event('focus'));
    document.querySelector('#yy').dispatchEvent(new Event('keydown'));
    document.querySelector('#yy').value="23";
    document.querySelector('#yy').dispatchEvent(new Event('keyup'));
    document.querySelector('#yy').dispatchEvent(new Event('input'));
    document.querySelector('#yy').dispatchEvent(new Event('blur'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').dispatchEvent(new Event('focus'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').dispatchEvent(new Event('keydown'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').value="***";
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').dispatchEvent(new Event('keyup'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').dispatchEvent(new Event('input'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div:nth-child(3) > div > input').dispatchEvent(new Event('blur'));
    document.querySelector('#app > main > div:nth-child(4) > div.payment-type-methods.white > section.active.false._3hMK.pos-r.p-option > section > section > section > div.ib.w100.vt > div.fl._313Z.align-r > section > button').click();
   clearInterval(payint);
  }
else
document.querySelector('#app > main > div > div > section:nth-child(2) > section > div > div > label > input[type=radio]').click();
}