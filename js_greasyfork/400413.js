// ==UserScript==// @name         MonMask14032020_trial
// @namespace    amazon全自動搶購
// @version      v1.25
// @description  amazon全自動搶購
// @author       amazonbot
// @match        https://www.amazon.co.jp/gp/offer-listing/*
// @match        https://www.amazon.co.jp/gp/*
// @match        https://www.amazon.co.jp/gp/buy/addressselect/handlers/*
// @match        https://www.amazon.co.jp/-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400413/MonMask14032020_trial.user.js
// @updateURL https://update.greasyfork.org/scripts/400413/MonMask14032020_trial.meta.js
// ==/UserScript==

var Bprice = 2000; //貨品價錢
var Bshiprice = 100; //運費
var disable = 0; //開關只購買sold by amazon貨品，0為不限制，1為只購買sold by amazon貨品

var time=0,a=new AudioContext;function beep(e,t,n){var l=a.createOscillator(),o=a.createGain();l.connect(o),l.frequency.value=t,l.type="square",o.connect(a.destination),o.gain.value=.01*e,l.start(a.currentTime),l.stop(a.currentTime+.005*n)}function sleep(e){return new Promise(a=>setTimeout(a,e))}!async function(){"use strict";var e;document.getElementsByClassName("a-size-medium")[0].innerText.length>50&&(await sleep(1600),location.reload());try{e=document.getElementsByClassName("a-column a-span2 olpPriceColumn")[0].getElementsByClassName("olpShippingPrice")[0].innerText.replace(/(\D+)/g,"")}catch(a){e=0}try{var a=document.getElementsByClassName("olpOfferPrice")[0].innerText.replace(/(\D+)/g,"")}catch(e){}var t=document.getElementsByClassName("olpSellerName")[0].children[0];0==disable?"IMG"==t.tagName?(document.body.style.background="blue",await sleep(3e3),location.reload(),beep(200,520,200),time=1):e>Bshiprice?(await sleep(2e3),location.reload()):a<Bprice?(document.body.style.background="pink",beep(200,520,200),time=1,await sleep(3e3),location.reload()):(await sleep(2e3),location.reload()):"IMG"==t.tagName?(document.body.style.background="blue",beep(200,520,200),time=1,await sleep(3e3),location.reload()):(await sleep(2e3),location.reload()),await sleep(3e4),location.reload()}();