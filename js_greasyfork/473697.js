// ==UserScript==
// @name        sABER-Click shortlink helper
// @namespace   Violentmonkey Scripts
// @match       *://blog.cryptowidgets.net/*
// @match       *://blog.insurancegold.in/*
// @match       *://blog.wiki-topia.com/*
// @match       *://blog.freeoseocheck.com/*
// @match       *://blog.coinsvalue.net/*
// @match       *://blog.cookinguide.net/*
// @match       *://blog.makeupguide.net/*
// @match       *://blog.carstopia.net/*
// @match       *://blog.carsmania.net/*

// @match       *://mdn.lol/*
// @match       *://awgrow.com/*
// @match       *://worldtanr.xyz/*
// @match       *://fadedfeet.com/*
// @match       *://kenzo-flowertag.com/*
// @match       *://homeculina.com/*
// @match       *://lawyex.co/*
// @match       *://yexolo.net/*
// @match       *://ineedskin.com/*
// @match       *://alightmotionlatest.com/*

// @grant       none
// @version     2.5
// @author      sABER (juansi)
// @description Script de uso personal, adicional para pasar acortadores. Contribuciones via FaucetPay User: Crypto4Script. Try to take over the world!
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/473697/sABER-Click%20shortlink%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/473697/sABER-Click%20shortlink%20helper.meta.js
// ==/UserScript==

(function() { 'use strict';

function getElement(selector) {
  return document.querySelector(selector);
}

function existElement(selector) {
  return getElement(selector) !== null;
}

function formSubmit(selector, time) {
  let elem = (typeof selector === 'string') ? getElement(selector).closest('form') : selector;
  window.setTimeout(()=>{
  elem.submit();
  }, time * 1000);
}

function setCaptchaVisible(captcha){
  var $div = $(captcha).parents('div');
  for (var i = 0; i<$div.length; i++){
    if ($div[i].style.display === 'none') {
      $div[i].style.display = 'block';
    }
  }
}

function iconCaptcha(selector){
  window.setTimeout(()=>{ getElement('.iconcaptcha-modal').click(); }, 3000);
  setCaptchaVisible('.iconcaptcha-modal');
  let t = setInterval(()=>{
    let f = getElement(".iconcaptcha-holder.iconcaptcha-theme-light.iconcaptcha-success");
    if (f) { formSubmit(selector, 1);
            clearInterval(t);
           }
  }, 3000);
}

function changeTitle(text){
  document.title = text;
  window.setTimeout(()=>{
    changeTitle(text.substr(1) + text.substr(0, 1));
  }, 200);
}

function invoke(selector, time){
  if (document.getElementsByClassName('g-recaptcha').length !==0) {
    changeTitle(' Solve reCaptcha ');
    let c = document.getElementsByClassName('g-recaptcha')[0].closest('form');
    let t = window.setInterval(()=> {
      if (window.grecaptcha.getResponse().length !==0) {
        formSubmit(c, 1);
        clearInterval(t);
      }
    }, 1000);
  }
  else {
    formSubmit(selector, time);
  }
}

function disable_timers(string2find, nameFunc){
  var target = window[nameFunc];
  window[nameFunc] = function(...args){
    const stringFunc = String(args);
    if ((new RegExp(string2find)).test(stringFunc)) args[0] = function(){};
    return target.call(this, ...args);
  }
}

function getForm(familyName){
  if (familyName === 'clks'){
    let forms = document.forms;
      var id = forms[0].id;
      var length = Math.trunc(id.length/2);
      var newid = id.substring(1, length);
      var f = document.getElementById(newid);
      return f;
  }
  else {
    return;
  }
}

Object.defineProperty(document, 'querySelector', { value: document.querySelector, configurable: false, writable: false });
Object.defineProperty(HTMLFormElement.prototype, 'submit', { writable: false });
disable_timers('(/Solve reCaptcha|Solve|AdBlocker)', 'setInterval');
disable_timers('(Solve|CryptoWidgets|InsuranceGold|Wiki-Topia|Freeoseocheck|CoinsValue|MakeupGuide|CookinGuide|CarsTopia|CarsMania)', 'setInterval');
disable_timers('(bl0ck3d|Solve reCaptcha)', 'setTimeout');

             var l = new URL(window.location.href);
                switch (l.hostname) {
                  case 'blog.cryptowidgets.net': case 'blog.insurancegold.in': case 'blog.wiki-topia.com':
                  case 'blog.freeoseocheck.com': case 'blog.coinsvalue.net': case 'blog.cookinguide.net':
                  case 'blog.makeupguide.net': case 'blog.carstopia.net': case 'blog.carsmania.net':
                           document.addEventListener('DOMContentLoaded', function() {
                             var error = document.querySelector('.error-code');
                             if (error) { location.href = l.hostname + '?redirect_to=random'; }
                             var s = document.scripts;
                             var data;
                             for (var i = 0; i < s.length; i++) {
                               var t = s[i].textContent;
                               if (t.includes('pdata')) {
                                 var reg = new RegExp('pdata = \"([^\"]*)');
                                 data = reg.exec(t)[1];
                                 break;
                               }
                             }
                             $.ajax({
                               type: "POST",
                               url: l,
                               data: { dataCheck: data },
                               dataType: "json",
                               success: function(response) {
                                 console.log('checked!');
                               }
                             });
                             document.querySelectorAll('.row.text-center').forEach((dtc) => dtc.parentNode.removeChild(dtc));
                             invoke('#countdown', 30);
                           });
                    break;
                  case 'awgrow.com': case 'alightmotionlatest.com':
                    document.addEventListener('DOMContentLoaded', function() {
                      invoke('form', 10);
                    });
                    break;
                  case 'worldtanr.xyz': case 'fadedfeet.com': case 'yexolo.net':
                  case 'kenzo-flowertag.com': case 'homeculina.com': case 'lawyex.co':
                  case 'ineedskin.com': case 'mdn.lol':
                    document.addEventListener('DOMContentLoaded', function() {
                      invoke(getForm('clks'), 10);
                    });
                    break;
                  default:
                    break;
                }
            })();