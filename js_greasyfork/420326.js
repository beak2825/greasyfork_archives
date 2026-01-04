// ==UserScript==
// @name         豆瓣读书|多看&微信读书
// @description  在豆瓣读书页面展示多看阅读/微信读书是否有本书 并可跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Daxin
// @match        https://book.douban.com/*
// @match        https://search.douban.com/book/*
// @grant        GM.xmlHttpRequest
// @connect      duokan.com
// @connect      weread.qq.com
// @require      https://greasyfork.org/scripts/416439-hex-md5/code/hex_md5.js?version=871111
//idea come from @Jim https://www.douban.com/group/topic/162543714/
// crypto module come from https://github.com/Sorosliu1029/weReaDou/blob/b7e14905115ff33e24afb7f25f0494a55963ec5d/src/utils.ts#L21
// @downloadURL https://update.greasyfork.org/scripts/420326/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%7C%E5%A4%9A%E7%9C%8B%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/420326/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%7C%E5%A4%9A%E7%9C%8B%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';
   // crypto start;
  var $ = unsafeWindow.jQuery;
  function transformId(id) {
  const idLength = id.length
  if (/^\d*$/.test(id)) {
    const ary = []
    for (let i = 0; i < idLength; i += 9) {
      ary.push(parseInt(id.slice(i, Math.min(i + 9, idLength))).toString(16))
    }
    return ['3', ary]
  }
  let r = ''
  for (let i = 0; i < idLength; i++) {
    r += id.charCodeAt(i).toString(16)
  }
  return ['4', [r]]
}

 function calculateBookStrId(bookId){
  const digest = hex_md5(bookId)
  let result = digest.substr(0, 3)
  const [code, transformedIds] = transformId(bookId)
  result += code + '2' + digest.substr(digest.length - 2, 2)
  for (let i = 0; i < transformedIds.length; i++) {
    let hexLengthStr = transformedIds[i].length.toString(16)
    if (hexLengthStr.length === 1) {
      hexLengthStr = '0' + hexLengthStr
    }
    result += hexLengthStr + transformedIds[i]
    if (i < transformedIds.length - 1) {
      result += 'g'
    }
  }
  if (result.length < 20) {
    result += digest.substr(0, 20 - result.length)
  }
  result += hex_md5(result).substr(0,3)
  return result
}
    //crypto end
    function substringToSymbol(title, symbol) {
        if(title.includes(symbol)) {
            title = title.substr(0, title.indexOf(symbol))
        };
        return title
    }

    function clear(title) {
        title = substringToSymbol(title, ':')
        title = substringToSymbol(title, '（')
        title = substringToSymbol(title, '？')
        title = substringToSymbol(title, '：')
        return title.trim();
    }

    function query_book(dom_obj, title) {
        var url_mireader = "https://www.duokan.com/store/v0/web/query/hint?s=" + title;
		var url_weread = "https://weread.qq.com/web/search/search_suggest?keyword=" + title;
		var mireader_has_book=false;
		var weread_has_book=false;

        GM.xmlHttpRequest({
            method: "GET",
            url: url_mireader,
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                for(var i = 0; i < result.itemsInfo.length; i++) {
                    var cur_title = result.itemsInfo[i].sug
                    var sourceId=result.itemsInfo[i].sourceId
                    if(title == clear(cur_title)) {
                        mireader_has_book = true //sourceId
                        var mireader = '<a href="https://www.duokan.com/book/'+sourceId+'"  target="_blank"> <span style="background-color:#fa7a20;color:white;">多</span> </a>'
                        break;
                    }
                }
				if(mireader_has_book == true) {
                    dom_obj.append(mireader)
                }
            }
        });
		GM.xmlHttpRequest({
            method: "GET",
            url: url_weread,
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                for(var i = 0; i < result.records.length; i++) {
                    var cur_title = result.records[i].word
                    var bookId=result.records[i].bookId
                    if(title == clear(cur_title)) {
                        weread_has_book = true
                        var weread= '<a href="https://weread.qq.com/web/reader/'+calculateBookStrId(bookId)+'"  target="_blank"> <span style="background-color:#32A6FE;color:white;">微</span> </a>'
                        break;
                    }
                }
				if(weread_has_book == true) {
                    dom_obj.append(weread)
                }
            }
        });
    }

    function check_wishlist() {
        //console.log('check wish list')
        $('ul.interest-list h2').each(function() {
            var cur = $(this)
            var title = $(this).children('a').text()
            title = clear(title)
            query_book(cur, title)
        });
    }

    function check_booklist() {
       // console.log('check book list')
        $('div.title').each(function() {
            var cur = $(this)
            var title = $(this).children('a.title-text').text()
            title = clear(title)
            query_book(cur, title)
        });
    }

    function check_onebook() {
        var cur = $('h1').children('span')
        var title = cur.text()
        title = clear(title)
        console.log('check one book')
        query_book(cur, title)

    }


    var pathname = window.location.pathname;
    if(pathname.includes('people')) {
        check_wishlist()
    } else if(pathname.includes('subject_search')) {
        check_booklist()
    }else if(pathname.includes('subject')) {
        check_onebook()
    }

})();