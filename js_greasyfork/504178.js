// ==UserScript==
// @name        Short clks bypass
// @namespace   Tampermonkey script

// @match       *://mdn.lol/*
// @match       *://awgrow.com/*
// @match       *://worldtanr.xyz/*
// @match       *://fadedfeet.com/*
// @match       *://kenzo-flowertag.com/*
// @match       *://homeculina.com/*
// @match       *://lawyex.co/*
// @match       *://danidmonkey.com/*
// @match       *://dreamhomelabs.com/*
// @match       *://celebperson.com/*
// @match       *://cookingpumpkin.com/*
// @match       *://audioinspects.com/*
// @match       *://plumptofit.com/*
// @match       *://mommylovesme.xyz/*
// @match       *://financewrapper.net/*
// @match       *://goodmoneytimes.xyz/*
// @match       *://businessuniqueidea.com/*
// @match       *://bestfitnessgear4u.com/*
// @match       *://cashadvancefvt.com/*
// @match       *://yexolo.net/*
// @match       *://financeclick.net/*
// @match       *://elishea.com/*
// @match       *://chefslink.org/*
// @match       *://ineedskin.com/*
// @match       *://alightmotionlatest.com/*

// @grant       none
// @version     1.7
// @author      Groland
// @description Personal script
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/504178/Short%20clks%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/504178/Short%20clks%20bypass.meta.js
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
  }, time * 1300);
}

function setCaptchaVisible(captcha){
  var $div = $(captcha).parents('div');
  for (var i = 0; i<$div.length; i++){
    if ($div[i].style.display === 'none') {
      $div[i].style.display = 'block';
    }
  }
}


function changeTitle(text){
  document.title = text;
  window.setTimeout(()=>{
    changeTitle(text.substr(1) + text.substr(0, 1));
  }, 200);
}

function invoke(selector, time){
  if (document.getElementsByClassName('g-recaptcha').length !==0) {
    changeTitle('captcha');
    let c = document.getElementsByClassName('g-recaptcha')[0].closest('form');
    let t = window.setInterval(()=> {
      if (window.grecaptcha.getResponse().length !==0) {
        formSubmit(c, 2);
        clearInterval(t);
      }
    }, 1000);
  }


  else if (existElement('input[name=_iconcaptcha-token]')) {
    changeTitle(' Solve iconCaptcha ');
    iconCaptcha(selector);
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
  var forms = document.forms;
  for (var i = 0; i < forms.length; i++) {
    if (familyName === 'clks'){
      var form = forms[i].innerHTML;
      if (form.includes('Step')) {
      return forms[i];
      }
    }
    else if (familyName === 'rssh') {
      var bait = forms[i].action;
      if (/bypass.html|adblock.html/.test(bait)) continue;
      return forms[i];
    }
    else {
      return;
    }
  }
}

Object.defineProperty(document, 'querySelector', { value: document.querySelector, configurable: false, writable: false });
Object.defineProperty(HTMLFormElement.prototype, 'submit', { writable: false });
disable_timers('(/ad-now.php|/bypass|Solve reCaptcha)', 'setInterval');
disable_timers('(bl0ck3d|Solve reCaptcha)', 'setTimeout');


             var l = new URL(window.location.href);
                switch (l.hostname) {
                  case 'blog.cryptowidgets.net': case 'blog.insurancegold.in': case 'blog.wiki-topia.com':
                  case 'blog.freeoseocheck.com': case 'blog.coinsvalue.net': case 'blog.cookinguide.net':
                  case 'blog.makeupguide.net': case 'blog.carstopia.net': case 'blog.carsmania.net':
                    document.addEventListener('DOMContentLoaded', function() {
                      document.querySelectorAll('.row.text-center').forEach((dtc) => dtc.parentNode.removeChild(dtc));
                      invoke('#countdown', 20);
                    });
                    break;
                    case 'worldtanr.xyz': case 'celebperson.com': case 'dreamhomelabs.com': case 'audioinspects.com': case 'financewrapper.net': case 'financeclick.net': case 'cookingpumpkin.com': case 'danidmonkey.com': case 'fishingbreeze.com': case 'goodmoneytimes.xyz': case 'plumptofit.com': case 'mommylovesme.xyz': case 'cashadvancefvt.com': case 'elishea.com': case 'chefslink.org': case 'businessuniqueidea.com': case 'awgrow.com': case 'fadedfeet.com':
                  case 'kenzo-flowertag.com': case 'homeculina.com': case 'lawyex.co':
                  case 'ineedskin.com': case 'yexolo.net': case 'alightmotionlatest.com':
                  case 'mdn.lol':
                    document.addEventListener('DOMContentLoaded', function() {
                      invoke(getForm('clks'), 10);
                    });
                    break;
                  case 'rsinsuranceinfo.com': case 'rssoftwareinfo.com': case 'rsfinanceinfo.com':
                  case 'rseducationinfo.com': case 'rsadnetworkinfo.com': case 'rshostinginfo.com':
                    document.addEventListener('DOMContentLoaded', function() {
                      invoke(getForm('rssh'), 5);
                    });
                    break;
                  default:
                    break;
                }






  const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}

              if (window.location.href.includes("https://celebperson.com/")){
    setTimeout (function () {
 ReadytoClick("div button:nth-of-type(1)")
    }, 18000);
              }
             if (window.location.href.includes("https://elishea.com/")){
    setTimeout (function () {
 ReadytoClick("div button:nth-of-type(1)")
    }, 18000);
              }
              if (window.location.href.includes("https://dreamhomelabs.com/")){
    setTimeout (function () {
 ReadytoClick("div button:nth-of-type(1)")
    }, 18000);
              }

             setTimeout (function () {
ReadytoClick("button:nth-of-type(3)")
    }, 6000);

             setTimeout (function () {
ReadytoClick("button:nth-of-type(4)")
    }, 5000);




              $("#overlay").remove();
        $("#click").css("display","none");
        $("#"+ $(".cf-turnstile:first").closest("form>div").attr("id") ).css("display","block");


          

            })();