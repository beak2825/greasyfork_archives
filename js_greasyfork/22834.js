// ==UserScript==
// @id             www.qidian.com-60bdc46e-38f7-4c43-99fb-269b4c0321a7@scriptish
// @name           小说助手
// @version        0.3
// @namespace      
// @author         糖果君
// @description    在小说主页支持跳转到db小说网站,贴吧等。支持起点 创世 纵横 逐浪 17k
// @include        http://www.qidian.com/Book/*.aspx
// @include        http://*.qdmm.com/MMWeb/*.aspx
// @include        http://chuangshi.qq.com/bk/*.html
// @include        http://yunqi.qq.com/bk/*.html
// @include        http://book.zongheng.com/book/*.html
// @include        http://www.zhulang.com/*/
// @include        http://www.17k.com/book/*.html
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/22834/%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/22834/%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var sites = [
    'qidian.com',
    'qdmm.com',
    'chuangshi.qq.com',
    'yunqi.qq.com',
    'book.zongheng.com',
    'www.zhulang.com',
    'www.17k.com',
];
//var url = '<a href="javascript:booklink.submit();"   class="{1}">免费阅读</a><form  target=_blank name="booklink" method="post" action="https://booklink.me/after_search.php" style="display:none; "><input name="name"  value="{0}" /><input name="search_type" value="book"  /></form>';
var url = '<a href=http://www.sodu.cc/result.html?searchstr={0} target=_blank  class="{1}">免费阅读</a>';
var tieba = '<a href=http://tieba.baidu.com/f?kw={0} target=_blank  class="{1}">前往贴吧</a>';
function setValue(bookname, style) {
    var bkname = $(bookname) .text() .trim();
    url = myformat(url, bkname, style);
    tieba = myformat(tieba, bkname, style);
}
function myformat() {
    for (var i = 0; i < arguments.length - 1; i++) {
        arguments[0] = arguments[0].replace('{' + i + '}', arguments[i + 1]);
    }
    return arguments[0];
}(function ()
  {
    var text;
    var position;
    switch (sites.indexOf(document.domain))
    {
        case 0:
            // 起点
            setValue('.book_info .title h1', '');
            text = $(myformat('<li>{0}</li><li>{1}</li>', url, tieba));
            position = $('#li_DaShang') .parents('ul');
            break;
        case 1:
            //起点女站
            setValue('.book_info .title strong', '');
            text = $(myformat('<li>{0}</li><li>{1}</li>', url, tieba));
            position = $('#li_DaShang') .parents('ul');
            break;
        case 2:
            //创世
        case 3:
            //云起
            setValue('.main1 .title b', 'but02');
            text = $(myformat('<tr><td>{0}</td><td>{1}</td></tr>', url, tieba));
            position = $('#addtobookshelf') .parents('tbody');
            break;
        case 4:
            //纵横
            setValue('.status h1', ' btn_sr');
            text = url + tieba;
            position = $('.book_btn');
            break;
        case 5:
            //逐浪
            setValue('.crumbs strong', 'btn btn-primary');
            text = url + tieba;
            position = $('.cover-btn');
            break;
        case 6:
            //17k
            setValue('.Info h1', '');
            text = url + tieba;
            position = $('.Bar dt');
            break;
    }
    position.prepend(text);
}) ();
