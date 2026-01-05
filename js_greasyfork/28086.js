// ==UserScript==
// @name        fas.li.shink.in
// @namespace   http://fas.li.shink.in/
// @include     *://shink.in/*
// @include     *://fas.li/*
// @description fas.liとshink.inのクッキーを固定し、複数開いた時も同時進行できるようにする
// @version     1.2.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/28086/faslishinkin.user.js
// @updateURL https://update.greasyfork.org/scripts/28086/faslishinkin.meta.js
// ==/UserScript==
/* 2017/08/13 don't working
(function() {
  
  var current_url = location.href;
  var shinkin_cookie = "csrf_sci=";
  var fasli_cookie = "csfi=";
  var shinkin_value = "";
  var fasli_value = "";
  
  var SHINKIN_FIXED_COOKIE = "shinkin_fixed_cookie"
  var FASLI_FIXED_COOKIE = "fasli_fixed_cookie"
  
  console.info(document.cookie);
  
  function setCookie() {
    console.info("GM値：" + GM_getValue(SHINKIN_FIXED_COOKIE));
    console.info("値：" + document.cookie.split(shinkin_cookie)[1].split(";")[0]);
    if(GM_getValue(SHINKIN_FIXED_COOKIE) !== document.cookie.split(shinkin_cookie)[1].split(";")[0]){
     document.cookie = shinkin_cookie + encodeURIComponent(GM_getValue(SHINKIN_FIXED_COOKIE)) + ";domain=.shink.in;path=/";
     clearInterval(anti_change);
    }
  }
  
  function reclick() {
    document.getElementsByClassName("g-recaptcha btn btn-primary")[0].click();
  };
  
  if(current_url.indexOf("://shink.in/") !== -1){
    shinkin_value = document.cookie.split(shinkin_cookie)[1].split(";")[0];
    if(current_url.indexOf("://shink.in/go/") !== -1){
      var anti_change = setInterval(setCookie, 250);
    }else{
      GM_setValue(SHINKIN_FIXED_COOKIE, shinkin_value);
    }
  }else{
    document.getElementById('skip').removeAttribute('id');
    setInterval(reclick, 500);
    fasli_value = document.cookie.split(fasli_cookie)[1].split(";")[0];
    if(current_url.indexOf("://fas.li/go/") !== -1){
      document.cookie = fasli_cookie + encodeURIComponent(GM_getValue(FASLI_FIXED_COOKIE)) +
        ";domain=.fas.li;path=/";
    }else{
      GM_setValue(FASLI_FIXED_COOKIE, fasli_value);
    }
  }
  
})();
*/