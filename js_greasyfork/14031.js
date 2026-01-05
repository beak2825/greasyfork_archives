// ==UserScript==
// @name       nijie ajax bookmark and favorite command
// @namespace  qa3
// @version    0.2
// @description  nijieでブックマークとユーザーのお気に入り登録をページ遷移なく行う(nijie ajax bookmark and favorite)
// @include    https://nijie.info/*
// @include    http://nijie.info*
// @author qa3
// @copyright  2014+, qa
// @downloadURL https://update.greasyfork.org/scripts/14031/nijie%20ajax%20bookmark%20and%20favorite%20command.user.js
// @updateURL https://update.greasyfork.org/scripts/14031/nijie%20ajax%20bookmark%20and%20favorite%20command.meta.js
// ==/UserScript==

/*
参考
 char code list：　http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 */

//ブックマークボタンをクリックするとajaxでブクマ

//eキーを押すとブクマする

$(window).on("keydown", function(e) {
  if (e.which == 69 && $("#bukuma-do"))  {
    $(".add-bookmark").text("ブクマ編集");
    bkm();
 }
});


$("#bukuma-do").on("click", function() {
  bkm();
});



// $("#not-bookmark").click(follow);

//zキーを押したらユーザーをお気に入り登録する
$(window).on("keydown", function(e) {
  if (e.which == 90 && $("not-bookmark") != null) {
    follow();
  }
});

// bookmarkする
function bkm() {

  $('#bukuma-do').removeAttr('href').html('Adding...');

  //illustId 　　location.hrefから取得する
  illustId = location.href.match(/\?id=([0-9]+)/)[1];

  var tags = '';
  //タグ情報のあるa要素の一番目のテキストの合計
  var num = $('.tag_name > a:first-child').length;
  //a要素の1番目のタグすべてを変数「tags」に格納していく
  for (i = 0; i < num ; i++) {
    cur = $(".tag_name > a:first-child").eq(i).text();
    tags += cur+' ';
  }

  //リクエストを送る
  $.ajax({
    type:"POST",
    url: "https://nijie.info/bookmark_add.php",
    dataType:'jsonp',
    data: {
      tag: tags,
      id: illustId,
      done: function() {
        $('#bukuma-do')
          .css('background: url', '//nijie.info/pic/sprite/sprite_background.png repeat-x')
          .css('color', 'black')
          .css('background-position', '0 -1202px')
          .css('text-shadow', 'none')
          .html('ブックマークを編集');
      }
    },
  });
}


// ajaxでお気に入り登録
function follow() {
  if ($("#not-bookmark")) {
    var url = $(".friend").attr("href");
    var userid = $(".name").attr("href").match(/[0-9]+/);

    $.ajax({
      url: url,
      type: 'GET',
      data: {
        done: function() {
          $("#not-bookmark").text("登録済み");
        }
      },
    })
  }
}
