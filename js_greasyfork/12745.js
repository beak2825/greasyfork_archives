// ==UserScript==
// @name        yap_filter_posts
// @namespace   yap_filter
// @description "Hide posts with low rating and ad posts"
// @description:ru "Скрипт скрывает на yaplakal.com посты, с низким рейтингом и рекламные посты."
// @include     http://www.yaplakal.com/
// @include     http://www.yaplakal.com/st/*
// @version     4
// @grant       none
// @requre      https://code.jquery.com/jquery-2.1.4.min.js
// @requre      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/12745/yap_filter_posts.user.js
// @updateURL https://update.greasyfork.org/scripts/12745/yap_filter_posts.meta.js
// ==/UserScript==

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

$(document).ready(function() 
{
  if($.cookie('yap_filter_value') === null || $.cookie('yap_filter_value') === "" || !isInt($.cookie('yap_filter_value'))) {
    min_rating = 200;  
  } else {
    min_rating = parseInt($.cookie('yap_filter_value'));
  }
  
  $('#tabs').after('<div id="yap_filter" style="float: right;">Фильтр по рейтингу: <input id="yap_filter_value" type="text" style="width: 40px;"> <button id="yap_filter_button" type="button">ок</button></div>');
  $('#yap_filter_value').val(min_rating);
  
  // скрыть посты без оценок (реклама)
  $('noindex').parents('.lenta tr').hide();
  $('.newshead').not(':has(.rating-short-value)').parents('.lenta tr').each(function() {
   $(this).hide();
   $(this).nextAll(':lt(2)').hide();    
  });

  function hide_posts() {
    $('.rating-short-value a').each(function(){
      var rating = parseInt(this.text);
      var post = $(this).parents('.lenta tr');
      if(rating < min_rating) {
        post.hide();
        post.nextAll(':lt(2)').hide();
      } else {
        post.show();
        post.nextAll(':lt(2)').show();
        console.log(rating);
      }
    });
  }

  $('#yap_filter_button').click(function() {
    var rating = $('#yap_filter_value').val();
    if(isInt(rating)) {
     min_rating = rating;
     $.cookie('yap_filter_value', min_rating);
     hide_posts();
    } else {
      alert('Wrong number');
    }
  });
  
  hide_posts();
  
  // удалить все скрытое
  // $('.lenta tr:hidden').remove();
});