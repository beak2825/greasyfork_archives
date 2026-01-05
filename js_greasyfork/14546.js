// ==UserScript==
// @name        Douban Book WHU Library Helper
// @author      hntee
// @namespace   https://greasyfork.org/en/users/22079-hntee
// @description 在豆瓣图书中添加武汉大学图书馆的信息
// @version     0.3
// @include     http://book.douban.com/subject/*
// @include     https://book.douban.com/subject/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14546/Douban%20Book%20WHU%20Library%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/14546/Douban%20Book%20WHU%20Library%20Helper.meta.js
// ==/UserScript==

// 

function getBooksInfo(booksJSON) {
  var index = [2,3,5,6];
  var dist = booksJSON['disList']; // 第一行，包括：单册状态	应还日期	馆藏位置	索书号
  var books = booksJSON['res'];
  books.unshift(dist); // 把表格头放在书籍信息之前作为单独的一行

  var all_books_info = '<table cellspacing="1px" cellpadding="5px">\n'
  books.forEach(function(book) {
    var row = '<tr>\n';
      index.forEach(function(i) {
        row += '<td>' + book[i] + '</td>\n';
      });
    row += '</tr>\n';
    all_books_info += row;
  });
  all_books_info += '</table>';
  return all_books_info;
}

function noBook(){
  $('#isex').html("并没有 （╯' - ')╯︵ ┻━┻");
}

function insertInfo(){
  if($('#buyinfo').length){
    $('#buyinfo').before('<div class="gray_ad" id="whulib"></div>');
    $('#whulib').append('<h2>武大图书馆有没有?</h2><div class="bs" id="isex"></div>');
    if (typeof($('#info').text().split('ISBN:')[1]) != 'undefined') {
      var isbn = $('#info').text().split('ISBN:')[1].split(' ')[1];   
      // 第一步的URL，真正的URL要在下面的页面内找
      var url = 'http://opac.whu.findplus.cn/?h=search_list&query=IB:' + isbn; 
      var realRequestURL;
      $('#isex').html('查询中...');
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
          try {
            var bookURL = $(response.responseText).find('.title-link-wrapper a')[0].href.split('marc_no=')[1]
            realRequestURL = 'http://opac.whu.findplus.cn/?h=book_message&control=search_opac_detail&action=user_check&type=holdings&marc_no=' + bookURL;
            console.log(realRequestURL);
            // 下面是真正的信息
            GM_xmlhttpRequest({
              url: realRequestURL,
              method: 'GET',
              onload: function (response) {
                var text = response.responseText;
                var booksInfo = getBooksInfo(JSON.parse(text));
                $(booksInfo).appendTo('#whulib');
                $('#isex').html('');
              }
            });

          }
          catch(err) {
              noBook();
          }
        }
      });    
    } else {
      noBook();
    }
  }
}

insertInfo();
