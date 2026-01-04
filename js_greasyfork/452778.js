// ==UserScript==
// @name         98浏览助手多图版
// @namespace    98BAMI
// @author       Virya

// @description  为堂内帖子列表增加多图预览支持。下面链接分别是org和net域名下的常用论坛版块地址，也可自行添加修改版块地址或域名。如果某个版块显示有问题，请在下方@exclude处填写要排除的版块链接。

// @match        https://www.sehuatang.org/forum*
// @match        https://sehuatang.org/forum*

// @match        https://www.sehuatang.net/forum*
// @match        https://sehuatang.net/forum*


// @exclude        https://www.sehuatang.org/forum.php?mod=forumdisplay&fid=95&filter=author&typeid=710* //排除技术交流区，看图不太方便。
// @exclude        https://sehuatang.org/forum.php?mod=forumdisplay&fid=95&filter=author&typeid=710*
// @exclude        https://www.sehuatang.net/forum.php?mod=forumdisplay&fid=95&filter=typeid&typeid=710*
// @exclude        https://sehuatang.net/forum.php?mod=forumdisplay&fid=95&filter=typeid&typeid=710*

// @grant          GM_xmlhttpRequest
// @require https://code.jquery.com/jquery-3.6.1.min.js

// @connect sehuatang.org
// @connect sehuatang.net


// @version 2.2.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452778/98%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B%E5%A4%9A%E5%9B%BE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452778/98%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B%E5%A4%9A%E5%9B%BE%E7%89%88.meta.js
// ==/UserScript==
/* global $ */

$(document).ready(function(){

$('body').append('<script src="//lib.baomitu.com/jquery.lazyload/1.9.1/jquery.lazyload.min.js" type="text/javascript"></script>');

//删除列表无用元素
$('.common').remove();
$('.by').remove();
$('.num').remove();
$('.new').remove();
$('.lock').remove();

$("td.icn a img").remove();
$("tbody[id*='stick']").remove();

//修正导致排版错误的分割线和第一个<tbody>
$("tbody[id='separatorline']").remove();
$('#threadlisttableid tbody tr td').css('width', '100%');
$('#threadlisttableid tbody tr td').removeAttr('colspan');
//$("#threadlisttableid tbody:eq(1) tr td").css("width", "100%")
//$("#threadlisttableid tbody:eq(1) tr td").removeAttr('colspan');



//sehuatang.org获取每个帖子内容
$('.icn').each(function(){
    var urls="https://www.sehuatang.org/"; //如果你无法科学上网，请替换可访问的域名
    urls+=$(this).find("a").attr("href");
    //console.log(urls);
    var icn_td=$(this);
    icn_td.css('width', '100%') //优化标题下载效果
    GM_xmlhttpRequest({
        method: 'GET',
        url: urls,
        headers: {
            'User-agent': 'Mozilla/5.0  Chrome/70. Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        },
        onload: function(result) {
            var doc = result.responseText;



            //加载标题
            var dvi02=$(doc).find("#thread_subject");
            if ($(dvi02).html() == undefined) {
                $(this).remove();
            } else {
                $(icn_td).css("width",'100%')
                $(icn_td).prepend("<br/><a id = 'titles' style='margin-top: 20px;font-size: 2em;' target = '_blank' title = '新窗口打开'>"+$(dvi02).html()+"</a><br/>");
                var titles = $(icn_td).find('#titles') //标题增加链接
                titles.attr('href',urls);
            }

            //加载图片
            $(doc).find(".zoom").slice(0, 3).each(function(index) {
                var zoomFile = $(this).attr("zoomfile");
                var img = new Image();
                img.src = zoomFile;
                img.onload = function() {
                    if (img.height > 30) {
                        var img_thumb = $('<img>');
                        img_thumb.attr('src', zoomFile);
                        img_thumb.css({
                            //"vertical-align": "top",
                            "max-width": "33%"
                        });
                        $(icn_td).find('a:eq(1)').append(img_thumb)
                        return false; // 停止循环
                    }
                }
            });

        }
  });
});
});