// ==UserScript==
// @name        Spamma amici facebook
// @description Plugin per invitare tutti gli amici su facebook
// @author Maxeo | maxeo.net
// @include     https://www.facebook.com/*
// @version     1.1.3
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @icon        https://www.maxeo.net/imgs/icon/android-chrome-192x192.png
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/31228/Spamma%20amici%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/31228/Spamma%20amici%20facebook.meta.js
// ==/UserScript==

$(document).ready(function () {
  var dataTimeSpam=1000;
  var intervalloAmici = setInterval(function () {
    if ($('.fbProfileBrowserResult').length) {
      clearInterval(intervalloAmici);
      $('.uiOverlayFooter').last().append('<input type="text" class="spammaTime" value="1000"><button type="button" class="spammaAmici">Spamma Amici</button>')
    }
  }, 500)
  
  
  function invitaAmico() {
    setTimeout(function () {
      $('.uiButtonText').eq(0).click()
      $('.uiButtonText').eq(0).remove()
      invitaAmico()
    }, dataTimeSpam);
  }
  $('body').on('click', '.spammaAmici', function () {
    dataTimeSpam=$('.spammaTime').val();
    invitaAmico();
  })
})//
