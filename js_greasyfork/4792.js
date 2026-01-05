// ==UserScript==
// @name       pixiv ajax bookmark and follow
// @namespace  
// @version    0.7
// @description  ブックマークとお気に入り登録をページ遷移なく非同期的に行います。
// @include   http://www.pixiv.net/member_illust.php*
// @include   http://www.pixiv.net/member.php?*
// @copyright  2014+, qa2
// @author qa2
// @downloadURL https://update.greasyfork.org/scripts/4792/pixiv%20ajax%20bookmark%20and%20follow.user.js
// @updateURL https://update.greasyfork.org/scripts/4792/pixiv%20ajax%20bookmark%20and%20follow.meta.js
// ==/UserScript==

//初期設定
/*
参考
 char code list：　http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

 */

// bkm_restrict ブックマークする作品を非公開にするかどうか 0:公開 1:非公開
var bkm_restrict = 0;

// follow_restrict　フォローしたユーザーを非公開にするかどうか　0:公開 1:非公開
var follow_restrict = 0;

$('a[name=link]').css({'font-size':'60px'});
$('a[alt=link]').css({'font-size':'60px'});
$('input[name=input]').css({'font-size':'60px'});


//eキーを押すとブクマする
$(window).keydown(function(e) {
  if (!$("input[name=word]").is(":focus") && e.which == 69) {
    $(".add-bookmark").text("ブクマ編集");
      bkm();
    }
});



//zキーを押したらユーザーをお気に入り登録する
$(window).keydown(function(e) {
  if (!$("input[name=word]").is(":focus") && e.which == 90) {
    $("#favorite-button").attr("data-text-follow", "フォロー中です");
    $("#favorite-button > .text").text("フォロー中です");
    follow();
    }
});


// ajaxでブックマークする関数
function bkm() {
  
   var illustid = $("input[name=illust_id").val();
   var url = "http://www.pixiv.net/bookmark_add.php?id=" + illustid
   var tt = $("input[name=tt]").val();
   var type = $("input[name=type]:eq(1)").val();
//作品に登録されているすべてのタグをブックマークタグとして追加
   var tags = "";
     $(".tag > .text").each(function() {
        tags +=  $(this).text() + " "
     });

  $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {
        mode: "add",
        tt: tt,
        id: illustid,
        type: type,
        from_id: "",
        comment: "",
        tag: tags,
        restrict: bkm_restrict,
        success: function() {
          $(".add-bookmark _button")
          .removeClass(".add-bookmark _button")
          .addClass(".edit-bookmark button-on")
          $("._button")
            .css("color", "#666")
            .css("text-shadow", "none")
            .css("background-color", "#f4f4e7");
        }
      },
    })
}

// ajaxでお気に入り登録する関数
function follow() {
    var usr_id = $(".user-link").attr("href");
    var usrid = usr_id.match(/\/member.php\?id=([0-9]+)/);
    var id = usrid[1];

    var tt = $("input[name=tt]").val();

    $.ajax({
        url: 'http://www.pixiv.net/bookmark_add.php',
        type: 'POST',
        dataType: 'json',
        data: {
            mode: "add",
            type: "user",
            user_id: id,
            tt: tt,
            from_sid: "",
            restrict: follow_restrict,
            left_column: "OK",
            success: function() {
              $("i._icon sprites-follow")
                  .removeClass("_icon sprites-follow")
                  .addClass("_icon sprites-follow");
             }
        },
    })
}

