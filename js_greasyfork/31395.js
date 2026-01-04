// ==UserScript==
// @name        Fileforum Repair
// @namespace   highlighter
// @author      lobo
// @version     1.49
// @include     https://*.betanews.com/*
// @include     http://*.betanews.com/*
// @include     http://*fileforum.com/*
// @include     https://*fileforum.com/*
// @grant       none
// @description Detect words in div, color code the parent div, hide ads
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31395/Fileforum%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/31395/Fileforum%20Repair.meta.js
// ==/UserScript==

  $('.section.topdownloads').css('display', 'none');
  $('html').css('background', '#222222');
  $('.summary').css('display', 'none');
  $('.sectionTop').css('display', 'none');
  $('.topdownloads ol').css('display', 'none');
  $('#bd .navCol').css('display', 'none');
  $('#bd .mainCol').css('width', '67%');
  $('.file .license').css('color', '#fff9f9').css('padding-bottom', '0.2em').css('copadding-toplor', '0.3em');
  $('.actions > a').css('color', 'white');
  $('#bd .wideCol').css('width', '100%');
  $('#topAd').css('display', 'none');
  $('.ad').css('display', 'none');
  $('#hd #topnavBar').css('display', 'none');
  $('#bd .sideCol').css('width', '365px');
  $('#page').css('width', '1150px');


 
  $('.actions a').each(function(){
    newtext = $(this).text().replace("Watch", "Exclude");
    $(this).text(newtext);
    var oldUrl = $(this).attr("href"); // Get current url
    var oldUrl = oldUrl.replace("notifications", "exclusions"); // Create new url
    var oldUrl = oldUrl.replace("javascript:popwin(\'", "");
    var newUrl = oldUrl.replace(";\')", "");
    $(this).attr("href", newUrl).attr('target','_blank'); // Set herf value
  });
 
  //changed this to block entire div if match bad word
  $('div.license').each(function() {
    var ourText = $(this).text().toLowerCase(); // convert text to Lowercase
    if(ourText.match('shareware')) {
      $(this).parents().eq(0).css('background-color', 'red').css('padding', '5px').css('border-radius', '4px');
      //$(this).parents().eq(1).css('display', 'none');
    } else if (ourText.match('mac')) { //order matters, if it matches the first word it wont match the next
      $(this).parents().eq(0).css('background-color', 'purple').css('padding', '5px').css('border-radius', '4px');
      //$(this).parents().eq(1).css('display', 'none');
    } else if (ourText.match('ios')) {
      $(this).parents().eq(0).css('background-color', 'purple').css('padding', '5px').css('border-radius', '4px');
      //$(this).parents().eq(1).css('display', 'none');
    } else if (ourText.match('open')) {
      $(this).parents().eq(0).css('background-color', '#90d192').css('padding', '5px').css('border-radius', '4px');
    } else if (ourText.match('adware')) {
      $(this).parents().eq(0).css('background-color', 'orange').css('padding', '5px').css('border-radius', '4px');
    } else if (ourText.match('freeware')) {
      $(this).parents().eq(0).css('background-color', '#56b3c4').css('padding', '5px').css('border-radius', '4px');
    } else if (ourText.match('subscription')) {
      $(this).parents().eq(1).css('display', 'none');
    } else if (ourText.match('demo')) {
      $(this).parents().eq(1).css('display', 'none');
    } 
  });

