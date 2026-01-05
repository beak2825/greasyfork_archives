// ==UserScript==
// @name       AdBlock for hahasport/yopika
// @description Blocks annoying video ads on Hahasport
// @version    0.5
// @copyright  2015, Turkhero
// @namespace  https://greasyfork.org/tr/scripts/13440-adblock-for-hahasport-yopika
// @include    *biggestplayer.me/*
// @include    *cricfree*/*
// @include    *crichd.in/*
// @include    *footdirect24.com/*
// @include    *freehdsport.com/*
// @include    *gtcaster.com/*
// @include    *hahasport.com/*
// @include    *hqstream.tv/*
// @include    *leton.tv/*
// @include    *liveall.tv/*
// @include    *minimalistream.com/*
// @include    *mybeststream.xyz/*
// @include    *u-stream.me/*
// @include    *privatestream.tv/*
// @include    *sawlive.tv*
// @include    *theactionlive.com*
// @include    *yocast.tv/*
// @include    *yopika.com/*
// @include    *yotv.co/*
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/13440/AdBlock%20for%20hahasportyopika.user.js
// @updateURL https://update.greasyfork.org/scripts/13440/AdBlock%20for%20hahasportyopika.meta.js
// ==/UserScript==

(function(window, document) {"use strict";

  var player_width = 800;
  var jQuery, $;
  $ = jQuery = window.jQuery.noConflict(true);
  
  document.addEventListener('DOMContentLoaded', DOM_ContentReady);
  window.addEventListener('load', pageFullyLoaded);
                             
  function DOM_ContentReady() {
    $('.lad').remove();
    $('#ads_video_before').remove();
    $('#ads_video_after').remove();
    $('head').append('<style type="text/css">' +
    '.player{float:none;margin:0;}' +
    '.turk-danger{color:red;}' +
    '</style>'
    );
    // Ubinet link
    var itext;
    $('td.evv_link').each(function () {
      itext = $(this).text();
      if (itext.match(/\(Unibet TV\)/g)) {
        $(this).append(' <span class=\'turk-danger\'>!</span>');
      }
    });
    $('td.evv_link>a').attr("target","");
    $('td.evv_link').attr("class","");
    bigsize_player();
  }
  function pageFullyLoaded() {
    var ihost = document.location.host;
    if(ihost.indexOf('minimalistream.com') > - 1){
      adwrap_ads();
    }
    else if (ihost.indexOf('gtcaster.com') > - 1) {
      adc_ads();
    }
    else if (ihost.indexOf('mybeststream.xyz') > - 1) {
      videoaddsoverdiv_ads();
    }
    else if (ihost.indexOf('liveall.tv') > - 1 ||
    ihost.indexOf('privatestream.tv') > - 1 ||
    ihost.indexOf('hqstream') > - 1 ||
    ihost.indexOf('leton') > - 1
    ) {
      timer_ads();
    } 
    else if (ihost.indexOf('yocast.tv') > - 1 ||
    ihost.indexOf('freehdsport.com') > - 1 ||
    ihost.indexOf('cricfree') > - 1 ||
    ihost.indexOf('yotv.co') > - 1 ||
    ihost.indexOf('crichd') > - 1 ||
    ihost.indexOf('theactionlive') > - 1 ||
    ihost.indexOf('footdirect24') > - 1
    ) {
      floatlayer_ads();
    } 
    else if (ihost.indexOf('biggestplayer') > - 1) {
      adblock_ads();
    } 
    else if (ihost.indexOf('u-stream.me') > - 1) {
      ustreamme();
    } 
    else if (ihost.indexOf('sawlive.tv') > - 1) {
      $('#adba').hide();
      $('#sawdiv').hide();
      closeMyAd();
    }
  }
  function adwrap_ads(){
    $('div').each(function () {
      if ($(this).attr('id') == '1adWrap') {
        $(this).remove();
      }
      else if ($(this).attr('id') == 'adWrap') {
        $(this).remove();
      }
      else if ($(this).attr('id') == '1adWrap4') {
        $(this).remove();
      }
      else if ($(this).attr('id') == 'adWrap4') {
        $(this).remove();
      }
      else if ($(this).attr('id') == 'videoaCodeWrap') {
        $(this).remove();
      }
    });
    $("div[style^='background-color: rgb(251, 236, 173)']").remove();
  }
  function adc_ads(){
    $('div').each(function () {
      if ($(this).attr('id') == 'adc2') {
        $(this).remove();
      }
      else if ($(this).attr('id') == 'adc') {
        $(this).remove();
      }
    });
  }
  function timer_ads() {
    $('div').each(function () {
      if ($(this).attr('id') == 'timer1') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'timer2') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'timer3') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'timer4') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'timer5') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'timer_full') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'title') {
        $(this).remove();
      } 
      else if ($(this).attr('id') == 'topad') {
        $(this).remove();
      }
    });
  }
  function floatlayer_ads() {
   
    for(var index = 0; index < $('div').length; index++){
      
      if($('div').eq(index).attr('id') == 'video_ads_overdiv') {
        $('div').eq(index).remove();
      } 
      else if ($('div').eq(index).attr('id') == 'floatLayer1') {
        $('div').eq(index).remove();
      } 
      else if ($('div').eq(index).attr('id') == 'floatLayer2') {
        $('div').eq(index).remove();
      } 
      else if ($('div').eq(index).attr('id') == 'flashcontent') {
        $('div').eq(index).remove();
      } 
      else if ($('div').eq(index).attr('id') == 'video_ads_overdiv') {
        $('div').eq(index).remove();
      }
      else{
        /* loop çalışmadığı için iptal edildi
        if($('div').attr("style").match(/background-color: rgb\(251\, 236\, 173\)/)){
          $('div').eq(index).remove();
        }
        if($('div').attr("style").match(/url\(\'http\:\/\/www\.ltassrv/)){
          $('div').eq(index).remove();
        }
        */
      }     
      
    }
    $("div[style^='background-color: rgb(251, 236, 173)']").remove();
    $("iframe[src^='http://yocast.tv/adembed']").remove();
  }
  function adblock_ads() {
    $('.adblock1').remove();
  }
  function videoaddsoverdiv_ads(){
    $('.video_ads_overdiv').remove();
  }
  function ustreamme() {
    $('div').each(function () {
      if ($(this).attr('id') == 'ad') {
        $(this).remove();
      }
    });
  }

  function bigsize_player() {
    var iplayerframe = $('.player>iframe');
    var iplayersource = iplayerframe.attr('src');
    var iplayerframe_width = iplayerframe.attr('width');
    var iplayerframe_height = iplayerframe.attr('height');

    if (iplayerframe_width < player_width) {     
      var irgxpw = new RegExp('width=' + iplayerframe_width, 'g');
      var irgxph = new RegExp('height=' + iplayerframe_height, 'g');
      if (iplayersource.match(irgxpw)){
        iplayersource = iplayersource.replace(irgxpw, 'width=' + player_width);
        iplayerframe.attr('width', player_width);
        var iplayerframe_newheight = Math.round(player_width * iplayerframe_height / iplayerframe_width);
        iplayerframe.attr('height', iplayerframe_newheight);
        iplayersource = iplayersource.replace(irgxph, 'height=' + iplayerframe_newheight);
        iplayerframe.attr('src', iplayersource);
      }else{
        iplayerframe.attr('width', player_width);
        var iplayerframe_newheight = Math.round(player_width * iplayerframe_height / iplayerframe_width);
        iplayerframe.attr('height', iplayerframe_newheight);
      }
    }
  }      
                             
}(window, document));