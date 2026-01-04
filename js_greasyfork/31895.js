// ==UserScript==
// @name        TwitterFonts
// @namespace   reloader
// @include     *twitter.com/*
// @include     *facebook.com/*
// @description set farsi fonts for Twitter and Facebook
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31895/TwitterFonts.user.js
// @updateURL https://update.greasyfork.org/scripts/31895/TwitterFonts.meta.js
// ==/UserScript==
setInterval(function () {
  var elems = document.getElementsByTagName('p');
  var eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
  
  
  elems = document.getElementsByTagName('strong');
  eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
  
  
  elems = document.getElementsByTagName('a');
  eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
  
  elems = document.getElementsByTagName('h2');
  eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
  
  elems = document.getElementsByTagName('span');
  eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
  
  elems = document.getElementsByTagName('div');
  eArr = [
  ].slice.call(elems);
  eArr.forEach(function (v, ix)
  {
    eArr[ix].style.fontFamily = 'XB Roya';
  });
}, 2000);
