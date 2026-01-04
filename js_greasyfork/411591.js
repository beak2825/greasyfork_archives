// ==UserScript==
// @name irctcMultiPay
// @namespace irctc
// @match https://www.irctcipay.com/pgui/jsp/*
// @match https://netsafe.hdfcbank.com/ACSWeb/*
// @version     1.5
// @grant       none
// @description irctc
// @downloadURL https://update.greasyfork.org/scripts/411591/irctcMultiPay.user.js
// @updateURL https://update.greasyfork.org/scripts/411591/irctcMultiPay.meta.js
// ==/UserScript==
var payint=setInterval(function(){
  var fpy=document.querySelector('#divCardNumber > input.cardNumber');j();
},1000); 
var payi=setInterval(function(){ var ntpa=document.querySelector('#staticAuthOpen.tab-section'); k();},1000);  
function j(fpy){
  if(document.querySelector('#divCardNumber > input.cardNumber').value==""){
 document.querySelector('#divCardNumber> input.cardNumber').dispatchEvent(new Event('focus'));
 document.querySelector('#divCardNumber > input.cardNumber').dispatchEvent(new Event('keydown'));
 document.querySelector('#divCardNumber > input.cardNumber').value="****************";
 document.querySelector('#divCardNumber > input.cardNumber').dispatchEvent(new Event('keyup'));
 document.querySelector('#divCardNumber > input.cardNumber').dispatchEvent(new Event('input'));
 document.querySelector('#divCardNumber > input.cardNumber').dispatchEvent(new Event('blur'));
  }else
if(document.querySelector('#validity> input.inputField').value==""){
 document.querySelector('#validity> input.inputField').dispatchEvent(new Event('focus',{bubbles:!0}));
 document.querySelector('#validity> input.inputField').dispatchEvent(new Event('keydown',{bubbles:!0}));
 document.querySelector('#validity> input.inputField').dispatchEvent(new Event('paste',{bubbles:!0}));
 document.querySelector('#validity> input.inputField').value="09"+"/"+"23";
 document.querySelector('#validity> input.inputField').dispatchEvent(new Event('keyup',{bubbles:!0}));
}else
  if(document.querySelector('.cardSection>div>div>input.pField').value==""){
 document.querySelector('.cardSection>div>div>input.pField').dispatchEvent(new Event('focus',{bubbles:!0}));
 document.querySelector('.cardSection>div>div>input.pField').dispatchEvent(new Event('keydown',{bubbles:!0}));
 document.querySelector('.cardSection>div>div>input.pField').dispatchEvent(new Event('paste',{bubbles:!0}));
 document.querySelector('.cardSection>div>div>input.pField').value="***";
 document.querySelector('.cardSection>div>div>input.pField').dispatchEvent(new Event('keyup',{bubbles:!0}));
     }else
       if(document.querySelector('#divName input.inputField').value==""){
 document.querySelector('#divName input.inputField').dispatchEvent(new Event('focusout',{bubbles:!0}));
 document.querySelector('#divName input.inputField').dispatchEvent(new Event('keydown',{bubbles:!0}));
 document.querySelector('#divName input.inputField').dispatchEvent(new Event('paste',{bubbles:!0}));
 document.querySelector('#divName input.inputField').value="**********";
 document.querySelector('#divName input.inputField').dispatchEvent(new Event('keyup',{bubbles:!0}));
     j(); } 
if(document.querySelector('#divName input.inputField').value!=""){setTimeout(function(){document.querySelector('#confirm-purchase.payment-btn').click();return false;},1000);}
  
        }

function k(ntpa){
document.querySelector('#staticAuthOpen.tab-section').click();
document.querySelector('#staticAuthForm input.password').dispatchEvent(new Event('keydown'));
document.querySelector('#staticAuthForm input.password').value="********";//document.querySelector('#staticAuthForm>div button').click();return false;
if(document.querySelector('#staticAuthForm input.password').value!=""){clearInterval(payi);}
}
