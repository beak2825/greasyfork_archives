// ==UserScript==
// @name        KAT - ACL 8 - Faker Request Alert
// @namespace   Dr.YeTii
// @description Scans for faker requests
// @include     *kat.cr/moderator/verify/tier1/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10753/KAT%20-%20ACL%208%20-%20Faker%20Request%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/10753/KAT%20-%20ACL%208%20-%20Faker%20Request%20Alert.meta.js
// ==/UserScript==

$('body').append('<style>.alertL-1 {background-color: #F8EBEB;}.alertL-2 {background-color: #F6DFDF;}.alertL-3 {background-color: #F8C3C3;}.alertLCount {cursor:pointer;padding: 0px 3px;border-radius: 50%;font-size: 10px;box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.7);}</style>');
$('.data tr').each(function() {
  var request = $(this).find('td:eq(2)').html();
  var ip = $(this).find('td:eq(0) [href^="/moderator/listusers/"]').first().attr('href');
  var alertT = '';
  var alertL = 0;
  switch(true) {
    case /(american|brazillian|sweden|[^\s]+ian) student/gi.test(request):
      alertT = "American Student"; alertL = 3;
      break;
    case /help visitors with rare programs/gi.test(request):
      alertT = "American Student variant"; alertL = 3;
      break;
    case /pro(\s|)program/gi.test(request):
      alertT = "Pro Programmes"; alertL = 3;
      break;
    case /staunch fan/gi.test(request):
      alertT = "Staunch fan"; alertL = 3;
      break;
    case /^hello admin/gi.test(request):
      alertT = "Hello admin guy, maybe?"; alertL = 3;
      break;
    case /I can seed for a few weeks and I retain them if I need to seed them again/gi.test(request):
      alertT = "https://kat.cr/community/show/list-common-faker-requests-v3/?post=16604579"; alertL = 3;
      break;
    case /kickass occount/gi.test(request):
      alertT = "Occount!!"; alertL = 3;
      break;
    case /full hd 1080p/gi.test(request):
      alertT = "Full HD 1080p Faker"; alertL = 2;
      break;
    case /name is(\s|)(\.+|\*+|\_+)/gi.test(request):
      alertT = "Placeholder?"; alertL = 2;
      break;
    case /kikas\b/gi.test(request):
      alertT = "Kikas?"; alertL = 2;
      break;
    case /coded by me$/gi.test(request):
      alertT = "... coded by me"; alertL = 2;
      break;
    case /I love informatics technology/gi.test(request):
      alertT = "https://kat.cr/community/show/list-common-faker-requests-all-super-mods/ pattern #29"; alertL = 2;
      break;
    case /site.*hindi.*tamil/gi.test(request):
      alertT = "https://kat.cr/community/show/list-common-faker-requests-v3/?post=16607621"; alertL = 2;
      break;
    case /(music.*books)|(music.*games)|(books.*music)|(books.*games)|(games.*books)|(games.*music)/gi.test(request):
      alertT = "Possible Music/Books/Movies guy"; alertL = 1;
      break;
  }
  if (alertL) {
      $(this).find('td:eq(2)').addClass('alertL-'+alertL).attr('title', alertT);
  }
  
  alertT = '';
  alertL = 0;
  switch(true) {
    case /^5\.79\./.test(ip):
      alertT = '5.79 faker?'; alertL = 3;
      break;
    case /^182\./.test(ip):
      alertT = '182 faker?'; alertL = 2;
      break;
  }
  if (alertL) {
    $(this).find('td:eq(0)').addClass('alertL-'+alertL).attr('title', alertT);
  }
});
$('.data').before('<div>Count:'+
                    ' <span class="alertLCount reset">all</span>'+
                    ' <span class="alertLCount alertL-1">'+$('.data tr:has(.alertL-1)').length+'</span>'+
                    ' <span class="alertLCount alertL-2">'+$('.data tr:has(.alertL-2)').length+'</span>'+
                    ' <span class="alertLCount alertL-3">'+$('.data tr:has(.alertL-3)').length+'</span>'+
                  '</div>');
$(document).delegate('.alertLCount.reset', 'click', function() {
  $('.data tr.hidden').removeClass('hidden');
});
$(document).delegate('.alertLCount:not(.reset)', 'click', function() {
  $('.data tr:not(.firstr)').addClass('hidden');
  var clss = $(this).attr('class').split('alertL-')[1];
  $('.data tr:has(.alertL-'+clss+')').removeClass('hidden');
});