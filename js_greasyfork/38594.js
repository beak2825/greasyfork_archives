// ==UserScript==
// @name         CodeCasts一键下载
// @namespace    https://www.mokeyjay.com
// @version      0.1
// @description  在codecasts.com的课程列表页添加一键下载按钮
// @author       i@mokeyjay.com
// @match        https://www.codecasts.com/series/*
// @downloadURL https://update.greasyfork.org/scripts/38594/CodeCasts%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/38594/CodeCasts%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

$('tbody tr').map(function(i, e) {
    // 添加 加载中 图标
    $('<td><a class="fa fa-spinner fa-spin fa-3x fa-fw" style="text-decoration: none;" id="downloadLinkLoadStatus_'+i+'"></a></td>').appendTo($(e));
    // 获取下载链接
    let detail_page_url = $(e).find('a').attr('href');
    $.get(detail_page_url, (html) => {
        let download_url = html.match(/\/download\/video\/[a-z0-9]*/);
        if(download_url){
            $('#downloadLinkLoadStatus_'+i).removeClass('fa-spinner fa-spin').addClass('fa-download').attr('href', download_url);
        }
    });
});