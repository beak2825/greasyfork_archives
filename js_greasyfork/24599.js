// ==UserScript==
// @name        Booth.pm Hide Out of Stock
// @namespace   https://greasyfork.org/en/users/76021-bootresha
// @description Hide items that are "Out of Stock"
// @icon        https://booth.pm/favicon.ico
// @include     https://booth.pm/*
// @include     https://*.booth.pm/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24599/Boothpm%20Hide%20Out%20of%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/24599/Boothpm%20Hide%20Out%20of%20Stock.meta.js
// ==/UserScript==
$(document).ready(function () {
  if (document.location.href.indexOf('booth.pm') == 8) {
    var hideShowButton = '<div><button class="showHideOOS">Hide out of stock</div>';
    $('.global-nav').append(hideShowButton);
    $('.showHideOOS').click(function(){
      if ($('.showHideOOS').text() == "Hide out of stock"){
        $('.showHideOOS').text('Show out of stock');
        hideOOS(true);
      } else {
        $('.showHideOOS').text('Hide out of stock');
        hideOOS(false);
      }
    });
    numItems = $('.item-wrap').length;
    for (i = 0; i <= numItems; i++) {
      currentItem = $('.item-wrap').eq(i);
      handlerBooth(currentItem);
      //       if (currentItem.ready) {
      //         handlerBooth(currentItem);
      //       } else {
      //         currentItem.load(handlerBooth(currentItem));
      //       }
    }
    hideOOS(false);
  } else {
    var hideShowButton = '<div><button class="showHideOOS">Hide out of stock</div>';
    $('.ctrl-nav.shop').append(hideShowButton);
    $('.showHideOOS').click(function(){
      if ($('.showHideOOS').text() == "Hide out of stock"){
        $('.showHideOOS').text('Show out of stock');
        hideOOS(true);
      } else {
        $('.showHideOOS').text('Hide out of stock');
        hideOOS(false);
      }
    });
    numItems = $('.thumb').length;
    for (i = 0; i <= numItems; i++) {
      currentItem = $('.thumb').eq(i);
      handlerStoreBooth(currentItem);
      //       if (currentItem.ready) {
      //         handlerStoreBooth(currentItem);
      //       } else {
      //         currentItem.load(handlerStoreBooth(currentItem));
      //       }
    }
    hideOOS(false);
  }
})
function handlerBooth(input) {
  if (input.children('.empty-stock').length > 0) {
    input.parent().addClass('OOS');
  }
}
function handlerStoreBooth(input) {
  if (input.children('.badges').children('.empty-stock').length > 0) {
    input.parent().addClass('OOS');
  }
}
function hideOOS(inputBoolean) {
  if (inputBoolean) {
    $('.OOS').hide();
  } else {
    $('.OOS').show();
    $('.OOS').css({
      'opacity': 0.25
    });
  }
}
