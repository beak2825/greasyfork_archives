// ==UserScript==
// @name        TGFC自动车牌识别系统
// @description TGFC老司机专用
// @namespace   magnet
// @include     http://club.tgfcer.com/thread-*.html
// @include     http://club.tgfcer.com/viewthread.php*
// @require                 http://cdn.staticfile.org/jquery/1.11.0/jquery.min.js
// @version     beta 0.2
// @grant GM_xmlhttpRequest
// @run-at                  document-end
// @downloadURL https://update.greasyfork.org/scripts/18111/TGFC%E8%87%AA%E5%8A%A8%E8%BD%A6%E7%89%8C%E8%AF%86%E5%88%AB%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/18111/TGFC%E8%87%AA%E5%8A%A8%E8%BD%A6%E7%89%8C%E8%AF%86%E5%88%AB%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
var tk = 'http://www.torrentkitty.me';
var moo = 'https://www.avmoo.com/cn'
$('body').append('<div style=\'display:none;\' id=\'tmp\'><table></table><span id=\'tmpclose\' >关闭</span><i></i></div>');
$('body').prepend('<style>#tmp {position:fixed;bottom:10px;right:10px; padding:0 0 10px 0; box-shadow:1px 1px 3px rgba(0,0,0,0.12),3px 3px 9px rgba(0,0,0,0.3); background:rgba(255,255,255,0.8); } #tmp td{padding:5px 10px;} #tmp td,#tmp a{font-size:12px;text-align:left;} td.action a{margin:0 10px;} a.torrent{color:#f00;} #tmpclose{text-align:center;color:#f00;border:1px solid #f00;border-radius:5px;padding:1px 5px;margin:2px;cursor:pointer;} #tmp.wait{ width:400px; height:400px; background:#fff;opacity:0.6} #tmp a.movie-box{display:block;text-align:center;padding:0 0 10px 0;} #tmp>i{ dispaly:none; width:45px; height:40px; position:relative; top:150px; left:150px; border-radius:50%;border:5px solid #f60;border-right:none;} #tmp.wait>i{ display:block; animation:wait 3s infinite;} @keyframes wait{from{transform:rotate(0deg)} to{transform:rotate(360deg)} };</style>');
$('.t_msgfont').each(function () {
  var cont = $(this).html().replace(/([A-Z|a-z]{2,6}[\s|_|-]{0,1}[0-9]{2,6})/g, '<a class=\'torrent\' href=\'' + tk + '/search/$1\' target=\'_blank\' data-moo=\'' + moo + '/search/$1\'><b>$1</b></a>');
  $(this).html(cont);
});
$('.torrent').click(function (e) {
  e.preventDefault()
  $('#tmp>table').empty();
  $('.movie-box').remove();
  $('#tmp').show().addClass('wait');
  var turl = $(this).attr('href');
  var durl = $(this).attr('data-moo');
  GM_xmlhttpRequest({
    method: 'GET',
    url: turl,
    onload: function (response) {
      $('#tmp').removeClass('wait');
      var tmp = $.parseHTML(response.responseText);
      $('#tmp>table').html($(tmp).find('#archiveResult').html());
      $('#tmp a[rel=\'information\']').attr('href', tk + $('#tmp a[rel=\'information\']').attr('href')).attr('target', '_blank');
    }
  });
  GM_xmlhttpRequest({
    method: 'GET',
    url: durl,
    onload: function (response) {
      var dmp = $.parseHTML(response.responseText);
      $('#tmp').prepend($(dmp).find('.movie-box'));
      $('#tmp .movie-box').attr('target','_blank');
    }
  });
});
$('#tmpclose').click(function () {
  $('#tmp>table').empty();
  $('.movie-box').remove();
  $('#tmp').hide();
});
