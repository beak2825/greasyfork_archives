// ==UserScript==
// @name       OB自动点赞
// @namespace  https://greasyfork.org/zh-CN/users/34754-jjandxa
// @version    1.1
// @description  OB自动点赞脚本
// @include       *://ourbits.club/torrents.php*
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @copyright  2017+, jjandxa
// @downloadURL https://update.greasyfork.org/scripts/34323/OB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/34323/OB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
console.log('即将开始点赞，读取中...');

var rows = $('#torrenttable > tbody').children('.sticky_blank,.sticky_normal,.sticky_top')
var index = 0;
loadList(index);
function loadList (index) {    var header = $(rows[index]).find('td[class="embedded"] > a')
    var id = getParam($(header).attr('href'), 'id')
    var title = $(header).attr('title')
   
    $.post('/thanks.php', { id: id }, function(data) {
        $(header). children('b').append(' 点赞已完成!!!!');
        index += 1;
        if (index < rows.length) {
            loadList(index);
        } else {
            console.log('点赞已完成');
        }
    })
}

// 获取种子id
function getParam (url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = url.split('?')[1].match(reg)
  if (r != null) return decodeURI(r[2]); return null
}
