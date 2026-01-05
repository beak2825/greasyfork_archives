// ==UserScript==
// @name        Douban Book HUST Helper
// @description 豆瓣读书添加HUST图书馆信息 1.01 修改了显示位置，让借书信息可以正常显示
// @author      lastmayday & ab00b
// @namespace   http://lastmayday.org
// @include     https://book.douban.com/*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @version     1.0.1
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @icon        http://douban.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/4720/Douban%20Book%20HUST%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4720/Douban%20Book%20HUST%20Helper.meta.js
// ==/UserScript==
/* global $, jQuery */
function insertInfo() {
  if ($('#dale_book_subject_top_middle').length) {
    $('#dale_book_subject_top_middle').before('<div class="clearfix" id="hustlib"></div>');
    $('#hustlib').append('<h2>华科图书馆有没有?</h2><div class="bs" id="isex"></div>');
    if (typeof($('#info').text().split('ISBN:')[1]) != 'undefined') {
      let isbn = $('#info').text().split('ISBN:')[1].split(' ')[1];
      let url = 'https://ftp.lib.hust.edu.cn/search~S0*chx/?searchtype=i&searcharg=+' + isbn;
      GM_xmlhttpRequest({
        url: url,
        method: 'GET',
        onload: function(msg) {
          let text = msg.responseText;
          if (text.indexOf('未找到符合查询条件的馆藏') !== -1) {
            $('#isex').html('我科快去买书啦~竟然没有!');
          } else {
            $('#isex').html('我科的图书馆当然有!');
            $('#isex').after('<br><h2>在哪里在哪里?</h2>');
            $(text).find(".bibOrderEntry").appendTo('#hustlib');
            $(text).find('.bibItems').appendTo('#hustlib');
            $('#hustlib').append('<br><h2>再具体点?</h2><p><div class="bs" id="mdt"><a href="' + url + '" target="_blank">戳这里~</a></div>');
            for (let i = 1; i <= $('#hustlib tr').length - 1; i++) {
              let booknum = $('#hustlib tr').eq(i).find('td').eq(1).text();
              $('#hustlib tr').eq(i).find('td').eq(1).remove();
              $('#hustlib tr').eq(i).find('td').eq(0).after('<td width="43%">' + booknum + '</td>');
            }
          }
        }
      });
    } else {
      $('#isex').html('竟然没有！');
    }
  }
}
insertInfo();