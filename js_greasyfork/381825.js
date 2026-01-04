// ==UserScript==
// @author      Ahmet Güler
// @name        Teknoseyir w/ Ahmet Güler
// @include     https://teknoseyir.com/*
// @version     1.0.1
// @description Teknoseyir için ek özelleştirmeler içerir.
// @namespace https://greasyfork.org/users/291913
// @downloadURL https://update.greasyfork.org/scripts/381825/Teknoseyir%20w%20Ahmet%20G%C3%BCler.user.js
// @updateURL https://update.greasyfork.org/scripts/381825/Teknoseyir%20w%20Ahmet%20G%C3%BCler.meta.js
// ==/UserScript==
(function($) {
  'use strict';
  // Teknoızdırap eklentsideki birbirinden iyi örnek kodları için @frt'a sonsuz teşekkürler :)
  // Code Butonu
  $(document).on('click', '.btn-code', function() {
    var txt;
    txt = $(".acik textarea").val();
    if (txt.length > 0) txt += "";
    txt += "<code></code>";
    $(".acik textarea").val(txt);
    $(".acik textarea").focus();
  });

  function codebutton() {
    $(".comment-form-submit").each(function() {
      $(this).find(".comment_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-xs btn-code" type="button">Kod</button>');
      $(this).addClass("button-code");
    });
    $("#submit").each(function() {
      $(this).find("#post_form_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-sm btn-code" type="button">Kod</button>');
      $(this).addClass("button-code");
    });
  }
  //Önerilen Etiketler
  function suggestedtag() {
    $("#post_content").after('<div class="suggestedtag"> <b>Önerilen Etiketler:</b> <a href="#">#gündem</a><a href="#">#ikinciel</a><a href="#">#sıcakfırsat</a><a href="#">#teknoyardım</a><a href="#">#cihazönerisi</a><a href="#">#konudışı</a></div>');
    $('.suggestedtag a').click(function(event) {
      var txt;
      txt = $(".acik textarea").val();
      if (txt.length > 0) txt += "";
      txt += $(this).text() + " ";
      $(".acik textarea").val(txt);
      $(".acik textarea").focus();
      return !1
    });
  }
  //Favorilere Ekle Sistemi
  function addfav() {
    $('.post-actions [data-action="favori_btn"]').click(function(event) {
      var fp = $(this).parent().parent();
      var fav_count = $(fp).find('.social_badge .favori_sayi span').text();
      if ($(this).text() == 'Favori') {
        $(fp).find('.social_badge .favori_sayi span').text(parseInt(fav_count) + 1);
        $(fp).find('.social_badge .favori_sayi').attr("title", (parseInt(fav_count) + 1) + " kişi favorilere ekledi.");
        if (fav_count.length == 0) {
          $(fp).find('.social_badge').append('<a class="favori_sayi" href="#" data-action="favori_sayi_btn" data-type="durum" data-object_id="' + $(fp).find(this).attr("data-object_id") + '" title="1 kişi favorilere ekledi"><i class="fa fa-star"></i> <span>1</span></a>');
        }
      } else {
        $(fp).find('.social_badge .favori_sayi span').text(fav_count - 1);
        $(fp).find('.social_badge .favori_sayi').attr("title", (parseInt(fav_count) - 1) + " kişi favorilere ekledi.");
        if (fav_count == 1) {
          $(fp).find('.social_badge .favori_sayi').remove();
        }
      }
    });
  }
  //Gönderi Beğeni Sistemi
  function postlike() {
    $('.post-actions .begen_btn').click(function(event) {
      var bp = $(this).parent().parent();
      var plike_count = $(bp).find('.social_badge .begen_sayi span').text();
      if ($(this).text() == 'Beğen') {
        $(bp).find('.social_badge .begen_sayi span').text(parseInt(plike_count) + 1);
        $(bp).find('.social_badge .begen_sayi').attr("title", (parseInt(plike_count) + 1) + " kişi beğendi.");
        if (plike_count.length == 0) {
          $(bp).find('.social_badge').prepend('<a class="begen_sayi" href="#" data-action="begen_sayi_btn" data-type="durum" data-object_id="' + $(bp).find(".begen_btn").attr("data-object_id") + '" title="1 kişi beğendi"><i class="fa fa-thumbs-up-o"></i> <span>1</span></a>');
        }
      } else {
        $(bp).find('.social_badge .begen_sayi span').text(plike_count - 1);
        $(bp).find('.social_badge .begen_sayi').attr("title", (parseInt(plike_count) - 1) + " kişi beğendi.");
        if (plike_count == 1) {
          $(bp).find('.social_badge .begen_sayi').remove();
        }
      }
    });
  }
  //Yorum Beğeni Sistemi
  function commentlike() {
    $('.comment-actions .begen_btn').click(function(event) {
      var cp = $(this).parent();
      var like_count = $(cp).find('.begen_sayi span').text();
      if ($(this).text() == 'Beğen') {
        $(cp).find('.begen_sayi span').text(parseInt(like_count) + 1);
        $(cp).find('.begen_sayi').attr("title", (parseInt(like_count) + 1) + " kişi beğendi.");
        if (like_count.length == 0) {
          $(cp).append('<a class="begen_sayi" href="#" data-action="begen_sayi_btn" data-type="comment" data-object_id="' + $(cp).find(".begen_btn").attr("data-object_id") + '" title="1 kişi beğendi"><i class="fa fa-thumbs-up-o"></i> <span>1</span></a>');
        }
      } else {
        $(cp).find('.begen_sayi span').text(parseInt(like_count) - 1);
        $(cp).find('.begen_sayi').attr("title", (parseInt(like_count) - 1) + " kişi beğendi.");
        if (like_count == 1) {
          $(cp).find('.begen_sayi').remove();
        }
      }
    });
  }
  addfav();
  codebutton();
  suggestedtag();
  postlike();
  commentlike();
  $('head').append('<style>.suggestedtag a { padding-left: 5px; cursor: pointer;} .suggestedtag { margin-bottom: 10px; } .post_content { margin: 10px 0; margin-bottom: 5px; }</style>');
})(jQuery);