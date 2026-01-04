// ==UserScript==
// @name         CodeCasts一键下载修改版。需要复制地址到postman  添加refererhttps://www.codecasts.com/series
// @namespace    https://www.hesper.me
// @version      0.1.1
// @description  在codecasts.com的课程列表页添加一键下载按钮
// @author       hesper   在 i@mokeyjay.com的基础上修改
// @match        https://www.codecasts.com/series/*
// @downloadURL https://update.greasyfork.org/scripts/404381/CodeCasts%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%BF%AE%E6%94%B9%E7%89%88%E3%80%82%E9%9C%80%E8%A6%81%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80%E5%88%B0postman%20%20%E6%B7%BB%E5%8A%A0refererhttps%3Awwwcodecastscomseries.user.js
// @updateURL https://update.greasyfork.org/scripts/404381/CodeCasts%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%BF%AE%E6%94%B9%E7%89%88%E3%80%82%E9%9C%80%E8%A6%81%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80%E5%88%B0postman%20%20%E6%B7%BB%E5%8A%A0refererhttps%3Awwwcodecastscomseries.meta.js
// ==/UserScript==

$('tbody tr').map(function(i, e) {
    // 添加 加载中 图标
    $('<td><a class="fa fa-spinner fa-spin fa-3x fa-fw" style="text-decoration: none;" id="downloadLinkLoadStatus_'+i+'"  target="_blank" rel="https://www.codecasts.com/series/learn-php/episodes/1"></a></td>').appendTo($(e));
    // 获取下载链接
    let detail_page_url = $(e).find('a').attr('href');
    $.get(detail_page_url, (html) => {
        //还要修改
        let download_url = html.match(/https:\/\/cdn..+\.mp4.+/);
        if(download_url){
            $('#downloadLinkLoadStatus_'+i).removeClass('fa-spinner fa-spin').addClass('fa-download').attr('href', download_url);
        }
    });
});