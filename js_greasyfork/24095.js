// ==UserScript==
// @name        CaptchaRefresh
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   http://reservation.nid.gov.ly/#/Reserve
// @include     http://*.nid.gov.ly/*
// @description CaptchaRefresh is tool to refresh captcha images
// @version     1.02
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/24095/CaptchaRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/24095/CaptchaRefresh.meta.js
// ==/UserScript==
    
   $('body').on('click', '.captcha', function(){
      $('.captcha').attr("src","/Reservation/Captcha?"+(new Date).getTime()); 
   });