// ==UserScript==
// @name       sgmod - acno ass script
// @namespace  woot
// @version    1.1
// @description Makes acno an ass
// @match      http://www.seriousgmod.com/*
// @copyright  2013+, stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/26177/sgmod%20-%20acno%20ass%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/26177/sgmod%20-%20acno%20ass%20script.meta.js
// ==/UserScript==
$.ajax({
   complete: function(){
     $('span[class="style21"]:contains("Acnologia")').removeClass('style21').addClass('style7');
     $('li[data-author="Acnologia"] > div > div > h3[class="userText"]').html('<a href="members/acnologia.10364/" class="username" dir="auto" itemprop="name"><span class="style7">Acnologia</span></a><em class="userBanner bannerRed wrapped" itemprop="title"><span class="before"></span><strong>Ass</strong><span class="after"></span></em>');
   }
});
$(document).bind("ajaxComplete", function(){
     $('span[class="style21"]:contains("Acnologia")').removeClass('style21').addClass('style7');
     $('div[id="memberCard10364"] > div[class="userInfo"] > div[class="cardUserBanner"]').html('<em itemprop="title" class="userBanner bannerRed "><span class="before"></span><strong>Ass</strong><span class="after"></span></em>');
     if(window.location.pathname.search('10364') != -1){
       $('div[class="userBanners"]').html('<em itemprop="title" class="userBanner bannerRed "><span class="before"></span><strong>Ass</strong><span class="after"></span></em>');
     }
});