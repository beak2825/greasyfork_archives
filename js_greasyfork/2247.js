// ==UserScript==
// @name           pixiv_sk
// @namespace      http://alexam.hateblo.jp/
// @author         shikato
// @description    pixivの検索結果をフィルタリングしソートします。
// @version        2.1.1
// @include        https://www.pixiv.net/search.php*
// @include        https://www.pixiv.net/tags.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2247/pixiv_sk.user.js
// @updateURL https://update.greasyfork.org/scripts/2247/pixiv_sk.meta.js
// ==/UserScript==


/** 設定値 ここから **/

// 作品のブックマーク数が以下の値未満の場合は表示しない
var FAV_FILTER = 3;
// リンクを別のタブで開くかどうか true / false
var IS_LINK_BLANK = true; 

/** 設定値 ここまで **/ 


var getFav = function (target) { 
  var favText = target.children('figure').children('figcaption').children('ul').children('li:nth-child(3)').children('ul').children('li').children('a').text(); 
  if (favText === '') {
    return 0;
  } else { 
    return parseInt(favText);
  }
};

// filtering and sorting
var filterAndSort = function () {
  var works = []; 

  // fav filtering
  $('.x7wiBV0').children('.JoCpVnw').each(function () { 
    var fav = getFav($(this)); 
    if (fav >= FAV_FILTER) { 
      // If IS_LINK_BLANK is true, target blank attribute is added.
      if (!IS_LINK_BLANK) {
        return;
      }
      $(this).children('figure').children('._3IpHIQ_').children('a').attr('target', 'blank').attr('rel', '');
      works.push($(this));
    }
  });

  // sorting
  works.sort(function (a, b) {
    var favA = getFav(a); 
    var favB = getFav(b); 
    if (favA > favB) {
      return -1;
    }
    if (favA < favB) {
      return 1;
    }
    return 0;
  }); 

  // create result(html characters)
  var results = ''; 
  works.forEach(function (work) {
    results += $('<div>').append(work).html();
  }); 

  return results;
}; 

var isFinishedLazyloaded = function () { 
  var isFinished = true;
  $('.x7wiBV0').children('.JoCpVnw').each(function () { 
    if ($(this).children('figure').children('._3IpHIQ_').children('a').children('._1hsIS11').css('background-image') === 'none') {
      isFinished = false; 
    }
  });
  return isFinished;
};

var pisivSkInterval = setInterval(function () {
  if ($('.x7wiBV0').length) {
    if (isFinishedLazyloaded()) { 
      var sortedWorks = filterAndSort(); 
      $('.x7wiBV0').empty().append(sortedWorks).show(); 
      clearInterval(pisivSkInterval); 
    }  
  }
}, 100); 
