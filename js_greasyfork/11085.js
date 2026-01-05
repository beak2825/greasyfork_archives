// ==UserScript==
// @name        KAT - MOD - IP Tools
// @namespace   Dr.YeTii
// @description Adds hyperlinks next to IPs to go to helpful quick links
// @include     *kat.cr/*
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11085/KAT%20-%20MOD%20-%20IP%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/11085/KAT%20-%20MOD%20-%20IP%20Tools.meta.js
// ==/UserScript==
$('.mainpart').append('<style>.ipLink {font-size:85% !important;}</style>');
$('a[href^="/moderator/listusers/"]').each(function() {
  var ip = $(this).attr('href').split('/')[3];
  var text = $(this).text();
  if (text.indexOf('/moderator/listusers/') >= 0)
    text = ip;
  if (text.indexOf(ip) < 0)
    text = text+" ("+ip+")";
  if ($(this).is('.siteButton') == false && $(this).parent().is('li') == false) {
    $(this).html('<a class="ipLink" title="Users by IP" href="/moderator/listusers/'+ip+'/">'+text+'<i class="ka ka-user"></i></a>'+
                 '<a class="ipLink" title="whatismyipaddress.com" href="http://www.whatismyipaddress.com/ip/'+ip+'/"><i class="ka ka-IP"></i></a>'+
                 '<a class="ipLink" title="Comments by IP" href="/moderator/listusers/'+ip+'/comments/"><i class="ka ka-community"></i></a>');  
  }
});