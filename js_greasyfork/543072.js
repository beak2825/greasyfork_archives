// ==UserScript==
// @name     aucfreeMOD
// @namespace S2
// @license  Suruga-ya
// @version  1.0
// @include	 https://aucfree.com/*
// @description ja
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/543072/aucfreeMOD.user.js
// @updateURL https://update.greasyfork.org/scripts/543072/aucfreeMOD.meta.js
// ==/UserScript==

var $ = window.jQuery;
$(function() {

  //検索フォーム追従
  $('#searchFrame').addClass('fixed');

    var nav = $('.fixed')
    var navTop=nav.offset().top;

    $(window).scroll(function () {
        var winTop = $(this).scrollTop();
        var winHeight = $(this).height();
        var winBottom = winTop + winHeight;
        if (winTop >= navTop) {
            nav.css('position', 'fixed');
            nav.css('top', '0');
        }
        else if (winTop <= navTop) {
            nav.css('position', '');
            nav.css('top','');
        }

  	//広告バナー非表示
  	$('.ovl').remove();
	});
  //サイド、インナー広告バナー非表示
  $('#main div:nth-child(2)').css('min-height','0px') //main下にある2番目のdiv要素
  $('.ad').remove();
  $('[class="results_bid"]').remove();
  $('#adBlock').remove();
  $('div[id*="-ad-"]').remove(); //id曖昧検索
  $('div[id*="ads"]').remove(); //id曖昧検索

  //検索期間MAX固定
  var a = document.getElementById("from")
  var b = document.getElementById("to")
  a.selectedIndex = 1;
  b.selectedIndex = b.length-1;

  var from = document.getElementById("from").value
  var to = document.getElementById("to").value

	$('<input type="hidden" name="from" value="' + from + '">').prependTo('#searchForm');
	$('<input type="hidden" name="to" value="' + to + '">').prependTo('#searchForm');

  //検索ワード置換
　var replaceword = function(){
     var pattern = /▽|●|○|★|☆|◆|■|□|（|）|【|】|「|」|｢|｣|~|～|\-|\=|\/|\*|\(|\)|\[|\]|\*/g
     var SearchWord = $('#searchInput2').val()
     var MyWord = SearchWord.replace(/クオ|クオカード/g, "quo").replace(pattern," ");
     document.getElementById('searchInput2').value = MyWord;
  };

  $('#searchFrame').on('input',replaceword); //入力したらFunction実行する

　//メルカリへダイレクト
  var SearchWord = $('#searchInput2').val()
  if(SearchWord){
      var SliceWord = SearchWord.length > 20 ? (SearchWord).slice(0,20)+"…" : SearchWord; //長い文字列を省略表示
      var mercarilink="https://jp.mercari.com/search?keyword="
      var css= " style=font-size:15pt;color:#006AD6;background-color:#fff2cc;font-weight:700"
      var EncodedWord = encodeURI(SearchWord)
      $("<a target='_blank' href=" + mercarilink + EncodedWord + css + ">" + SliceWord + "をメルカリで検索</a>").prependTo('.main');
  }
});