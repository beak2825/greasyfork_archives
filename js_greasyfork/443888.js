// ==UserScript==
// @name       Additional Bypass
// @namespace  Violentmonkey Scripts
// @match      *://*.offerwallmedia.com/*
// @match      *://*.offers4crypto.xyz/*
// @match      *://*.dripoffers.com/*
// @match      *://*.adwallgate.com/*
// @match      *://*.bitcotasks.com/*
// @match      *://*.ewall.biz/*
// @grant      none
// @version    7.2
// @author     Bloggerpemula
// @run-at     document-start
// @description Bypass Addition for Bypass All Shortlinks
// @require    https://code.jquery.com/jquery-3.6.0.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/xhook/1.4.9/xhook.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jimp/0.22.10/jimp.min.js
// @downloadURL https://update.greasyfork.org/scripts/443888/Additional%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/443888/Additional%20Bypass.meta.js
// ==/UserScript==
// ======================================================================================================================================================
//                                      PLEASE READ SCRIPT INFO BEFORE USE
//                                  PLEASE RESPECT IF MY SCRIPTS USEFUL FOR YOU
//                      DON'T TRY TO COPY PASTE MY SCRIPTS THEN SHARE TO OTHERS LIKE YOU ARE THE CREATOR
//                            PLEASE DON'T REMOVE OR CHANGE MY BLOG, THANKS FOR YOUR SUPPORT
//              My Blog is Very Important to give some Delay for safe away ,Track New Shortlinks , Broken Bypass etc...
// Thanks so much to @JustOlaf , @Konf , @hacker09 and @juansi for Helping me , make my script even better , and for All who has contributed via Feedback.
// =======================================================================================================================================================
(function() {
  'use strict';
  const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
  const elementExists = query => bp(query) !== null;const BpParams = new URLSearchParams(location.search);
  function BpBlock() {return 1;}
  function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function ClickIfExists(query, timeInSec = 1, funcName = 'setTimeout') {
    if (elementExists(query)) {window[funcName](function() {(query).click();}, timeInSec * 1000);}}
  function SubmitBp(selector, time) {setTimeout(()=>{let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; elem.requestSubmit();}, time*1000);}
  function Captchacheck(selector) {if (elementExists("iframe[src^='https://newassets.hcaptcha.com']")) {return window.hcaptcha.getResponse().length !== 0;
    } else if (elementExists("input[name='cf-turnstile-response']") && !elementExists('.core-msg.spacer.spacer-top')) {return window.turnstile.getResponse().length !== 0;} else if (elementExists("iframe[title='reCAPTCHA']")) {return window.grecaptcha.getResponse().length !== 0;
    } else if (elementExists('#iconcaptcha')) {let b = setInterval(() => {let p = bp('.iconcaptcha-holder.iconcaptcha-theme-light.iconcaptcha-success'); if (p) {clearInterval(b); SubmitBp(selector, 1);}}, 1000);} else {return;}}
  function GetForm() {var forms = document.forms; for (var i = 0; i < forms.length; i++) {var bait = forms[i].action;
     if (/bypass.html|adblock.html/.test(bait)) continue; return forms[i];}}
  function Checkvisibility(elem) {if (!elem.offsetHeight && !elem.offsetWidth) {return false;}
    if (getComputedStyle(elem).visibility === 'hidden') {return false;} return true;}
  function waitForElm(query, callback) {setTimeout(function() {
    if (elementExists(query)) {callback(bp(query));} else {waitForElm(query, callback);}}, 1000);}
  function redirect(url, blog = false) {location = blog ? 'https://rotator.nurul-huda.sch.id/?BypassResults=' + url : url;}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}
  function Captchaicon(selector) {let b = setInterval(() => {let p = bp('.iconcaptcha-holder.iconcaptcha-theme-light.iconcaptcha-success');
      if (p) {clearInterval(b);SubmitBp(selector, 1);}}, 1000);}
  function RemoveRef(value) {delete document.referrer; document.__defineGetter__('referrer', () => value);}
  function RemoveBp(domain, selector) {const re_domain = new RegExp(domain); if (!re_domain.test(location.host)) return;
    const elements = BpAll(selector);for (const element of elements) {element.remove();}}
  function BlockRead(SearchString, nameFunc) {var target = window[nameFunc]; window[nameFunc] = function(...args) {const stringFunc = String(args);
    if ((new RegExp(SearchString)).test(stringFunc)) args[0] = function() {}; return target.call(this, ...args);};}
  function strBetween(s, front, back, trim = false) {if (trim) {s = s.replaceAll(' ', '');s = s.trim();s = s.replaceAll('\n', ' ');}
      return s.slice(s.indexOf(front) + front.length, s.indexOf(back, s.indexOf(front) + front.length));}
  function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
  function BloggerPemulaHD(re_domain, data, blog) {if (!re_domain.test(location.host)) return;
    if (typeof data === 'function') return data();if (Array.isArray(data)) data = { '/': data }; if (!(location.pathname in data)) return;const [key, value] = data[location.pathname];
    if (typeof key === 'object' && key.test(location.search)) return redirect(value + RegExp.$1, blog); if (BpParams.has(key)) redirect(value + BpParams.get(key), blog);}
  function BypassHD(selector, time) {if (elementExists('.g-recaptcha')) {let gc = setInterval(() => {if (window.grecaptcha.getResponse().length !== 0) {
    clearInterval(gc); SubmitBp('.g-recaptcha', 1);}}, 1000);} else if (elementExists('.h-captcha')) {let hc = setInterval(() => {if (window.hcaptcha.getResponse().length !== 0) {
    clearInterval(hc); SubmitBp('.h-captcha', 1);}}, 1000);} else if (elementExists('.cf-turnstile')) {let tc = setInterval(() => {if (window.turnstile.getResponse().length !== 0) {
    clearInterval(tc); SubmitBp('.cf-turnstile', 1);}}, 1000);} else if (elementExists('input[name=_iconcaptcha-token]')) {Captchaicon(selector);} else {SubmitBp(selector, time);}}
  function EnableRCF() {[].forEach.call(['contextmenu', 'visibilitychange', 'cut', 'paste', 'blur', 'mouseleave', 'keyup', 'drag', 'dragstart', 'hasFocus', 'focus', 'select', 'selectstart', 'webkitvisibilitychange', 'mozvisibilitychange'], function(event) {
      document.addEventListener(event, function(e) {e.stopPropagation();}, true);});}
  function IconCaptcha() {elementReady('#validateVisit').then(xhook.after(async function(request, response, callback) {if (request.url.match(/captcha\/request\.php$/)) {const Urls = request.url.replace(/captcha\/request\.php$/, ''); const ImageData = JSON.parse(response.text); const Maps = new Map(); var Skipstr = ''; xhook.disable(); let Loadimage = 0;
    for (let i = 0; i < ImageData.length; i++) {Jimp.read(Urls + 'captcha/request.php?cid=0&hash=' + ImageData[i]).then(function(solved) { solved.getBase64(Jimp.AUTO, function(error, base64String) {if (Maps.has(base64String)) {if (!Skipstr) {Skipstr = base64String;}} else {Maps.set(base64String, ImageData[i]);} Loadimage = Loadimage + 1;});});}
    for (let i = 0; i < 5; i++) {if (Loadimage != ImageData.length) {await sleep(2000);} else {break;}} if (Loadimage == ImageData.length && Maps.size == 2) {for (let [key, value] of Maps) {if (key != Skipstr) {bp("[name='captcha-hf']").value = Maps.get(key);
    $.ajax({url: Urls + 'captcha/request.php', type: 'POST', data: {cID: 0, pC: Maps.get(key), rT: 2}, success: function() {$('div.captcha-modal__icons > div:nth-child(1)').trigger('success');}, error: function() {console.log('An Error Occurred When Solving the Captcha');}});}}} else {console.log('Sorry Images Cannot be identified');}} else {callback();}}));}


  if (['interactive', 'complete'].includes(document.readyState)) {onHtmlLoaded();} else {document.addEventListener('DOMContentLoaded', onHtmlLoaded);}
  function onHtmlLoaded() {let $ = window.jQuery;

    BloggerPemulaHD(/(bitcotasks|adwallgate|dripoffers|offerwallmedia).com|offers4crypto.xyz|ewall.biz/, function() {
      if (location.href.includes('lead/')) {
        IconCaptcha();
      } else {}
    });

  }})();