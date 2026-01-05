// ==UserScript==
// @name         匿名版图片修复
// @namespace    http://zhihaofans.com
// @version      0.1.0
// @description  匿名版图片修复(正常时请关闭)
// @author       zhihaofans
// @match        https://h.nimingban.com/t/*
// @match        https://h.nimingban.com/f/*
// @grant        none
// @note         V0.0.1：匿名版图片修复(正常时请关闭)
// @icon         https://h.nimingban.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/22773/%E5%8C%BF%E5%90%8D%E7%89%88%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/22773/%E5%8C%BF%E5%90%8D%E7%89%88%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
var f_time = 0;
function nmb_t_fix() {
    var nowpage = $(".uk-pagination.uk-pagination-left.h-pagination li.uk-active span").text();
    var nowid = $(".h-threads-item.uk-clearfix").attr('data-threads-id');
    $.getJSON("/Api/thread?id=" + nowid + "&page=" + nowpage,
    function(data) {
        if (data.img !== "") {
            var nmb_img = '<div class="h-threads-img-box"><div class="h-threads-img-tool uk-animation-slide-top"><span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span><a class="h-threads-img-tool-btn uk-button-link" target="_blank" href="http://cdn.ovear.info:8998/image/' + data.img + data.ext + '"><i class="uk-icon-search-plus"></i>查看大图</a><span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span><span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span></div><a class="h-threads-img-a" target="_blank" rel="_blank" href="http://cdn.ovear.info:8998/image/' + data.img + data.ext + '"><img hspace="20" border="0" align="left" class="h-threads-img" src="http://cdn.ovear.info:8998/thumb/' + data.img + data.ext + '" data-src="http://cdn.ovear.info:8998/thumb/' + data.img + data.ext + '"></a></div>\n';
            $(".h-threads-item-main").html(nmb_img + $(".h-threads-item-main").html());
        }
        var a = 0;
        $.each(data.replys,
        function(i, item) {
            if (item.img !== "") {
                var nmb_img = '<div class="h-threads-img-box"><div class="h-threads-img-tool uk-animation-slide-top"><span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span><a class="h-threads-img-tool-btn uk-button-link" target="_blank" href="http://cdn.ovear.info:8998/image/' + item.img + item.ext + '"><i class="uk-icon-search-plus"></i>查看大图</a><span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span><span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span></div><a class="h-threads-img-a" target="_blank" rel="_blank" href="http://cdn.ovear.info:8998/image/' + item.img + item.ext + '"><img hspace="20" border="0" align="left" class="h-threads-img" src="http://cdn.ovear.info:8998/thumb/' + item.img + item.ext + '" data-src="http://cdn.ovear.info:8998/thumb/' + item.img + item.ext + '"></a></div>\n';
                $(".h-threads-item-replys .h-threads-item-reply:eq(" + a + ") .h-threads-item-reply-main").html(nmb_img + $(".h-threads-item-replys .h-threads-item-reply:eq(" + a + ") .h-threads-item-reply-main").html());
                a++;
            }
        });
    });
}
function nmb_f_fix() {
    var f_tnum = $(".h-threads-item.uk-clearfix").length;
    var nowid = $(".h-threads-item.uk-clearfix:eq(" + f_time + ")").attr('data-threads-id');
    console.log(nowid);
    $.getJSON("/Api/thread?page=1&id=" + nowid,
    function(data) {
        if (data.img !== "") {
            var fimg = data.img + data.ext;
            var f_nmb_img = '<div class="h-threads-img-box"><div class="h-threads-img-tool uk-animation-slide-top"><span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span><a class="h-threads-img-tool-btn uk-button-link" target="_blank" href="http://cdn.ovear.info:8998/image/' + fimg + '"><i class="uk-icon-search-plus"></i>查看大图</a><span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span><span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span></div><a class="h-threads-img-a" target="_blank" rel="_blank" href="http://cdn.ovear.info:8998/image/' + fimg + '"><img hspace="20" border="0" align="left" class="h-threads-img" src="http://cdn.ovear.info:8998/thumb/' + fimg + '" data-src="http://cdn.ovear.info:8998/thumb/' + fimg + '"></a></div>\n';
            var f_f = $(".h-threads-item.uk-clearfix:eq(" + f_time + ") .h-threads-item-main");
            f_f.html(f_nmb_img + f_f.html());
        }
        var renum = $(".h-threads-item.uk-clearfix:eq(" + f_time + ") .h-threads-item-replys .h-threads-item-reply").length;
        for (var b = 0; b < renum; b++) {
            if (data.replys[b].img !== "") {
                var t_img = data.replys[b].img + data.replys[b].ext;
                var t_nmb_img = '<div class="h-threads-img-box"><div class="h-threads-img-tool uk-animation-slide-top"><span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span><a class="h-threads-img-tool-btn uk-button-link" target="_blank" href="http://cdn.ovear.info:8998/image/' + t_img + '"><i class="uk-icon-search-plus"></i>查看大图</a><span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span><span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span></div><a class="h-threads-img-a" target="_blank" rel="_blank" href="http://cdn.ovear.info:8998/image/' + t_img + '"><img hspace="20" border="0" align="left" class="h-threads-img" src="http://cdn.ovear.info:8998/thumb/' + t_img + '" data-src="http://cdn.ovear.info:8998/thumb/' + t_img + '"></a></div>\n';
                var f_t = $(".h-threads-item.uk-clearfix:eq(" + f_time + ") .h-threads-item-replys .h-threads-item-reply:eq(" + b + ") .h-threads-item-reply-main");
                f_t.html(t_nmb_img + f_t.html());
            }
        }
        if (f_time < f_tnum - 1) {
            f_time++;
            setTimeout(nmb_f_fix(), 300);
        }
    });
}
$(document).ready(function() {
    var url = document.URL;
    if (url.substr(0, 26) == "https://h.nimingban.com/f/") {
        nmb_f_fix();
    }
    if (url.substr(0, 26) == "https://h.nimingban.com/t/") {
        nmb_t_fix();
    }
});