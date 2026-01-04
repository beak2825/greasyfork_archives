// ==UserScript==
// @name pass javbus driver verify
// @namespace http://tampermonkey.net/
// @version 0.1
// @description  自动过科目一！
// @author ayasechan
// @license MIT
// @include      *://*javbus.com/doc/*
// @include      *://www.*bus*/doc/*
// @include      *://www.*javsee*/doc/*
// @include      *://www.*seejav*/doc/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @downloadURL https://update.greasyfork.org/scripts/493661/pass%20javbus%20driver%20verify.user.js
// @updateURL https://update.greasyfork.org/scripts/493661/pass%20javbus%20driver%20verify.meta.js
// ==/UserScript==


const main = () => {

  document.cookie = 'dv=1; path=/; max-age=2592000'
  document.cookie = 'age=verified; path=/; max-age=2592000'
  const refer = new URLSearchParams(location.search).get('referer') ?? location.origin
  location.href = refer

}



main()