// ==UserScript==
// @name        屏蔽此傻X
// @description 用于快速再v2ex上屏蔽傻X
// @namespace   lovearia.me
// @include     http://v2ex.com/t/*
// @include     https://v2ex.com/t/*
// @include     http://www.v2ex.com/t/*
// @include     https://www.v2ex.com/t/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14498/%E5%B1%8F%E8%94%BD%E6%AD%A4%E5%82%BBX.user.js
// @updateURL https://update.greasyfork.org/scripts/14498/%E5%B1%8F%E8%94%BD%E6%AD%A4%E5%82%BBX.meta.js
// ==/UserScript==

var blockUserByReplyId = function (reply_id) {
  var $reply = $('#r_' + reply_id);
  var matched = $reply.html().match(/\/member\/(\w+)/);
  var member_page_url = matched[0];
  var username = matched[1];
  if (confirm('确定屏蔽傻X ' + username + ' ?')) {
    return $.get(member_page_url, function (page) {
      var block_url = page.match(/\/block\/\d+\?t=\d+/)[0];
      return $.get(block_url, function(){
        $reply.remove();
        alert('已成功屏蔽傻X ' + username + ' !');
      });
    });
  }
}

$('div[id*="thank_area_"]').each(function(){
  var $el = $(this);
  var reply_id = $el.attr('id').match(/\d+/)[0];
  
  var button = $('<a class="thank" style="color: #ccc;" href="#;" >屏蔽此傻X</a>');
  button.on('click', function(){blockUserByReplyId(reply_id)});
  $el.html(' &nbsp; &nbsp; &nbsp; '+$el.html())
  $el.prepend(button);
});
