// ==UserScript==
// @name         知网批量下载PDF+丨CNKI Multi PDF Download
// @namespace    http://tampermonkey.net/
// @icon         https://kdoc.cnki.net/favicon.ico
// @version      0.6
// @description  用于知网批量下载PDF，保存下载信息到txt
// @author       Juicpt(因为不熟悉js里的属性方法，为了方便添加新功能，24用jQuery重写)
// @include      */kns/brief/*
// @include      */kns*/AdvSearch*
// @include      */kns*/defaultresult/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/409840/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDPDF%2B%E4%B8%A8CNKI%20Multi%20PDF%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/409840/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDPDF%2B%E4%B8%A8CNKI%20Multi%20PDF%20Download.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;
(function(){
    $('.SavePoint').width(620);
    $('<a>批量下载PDF</a>').appendTo('.SavePoint,.result-con-l').click(downLoad).attr({'id':'pdfdown','title':'此页面若有勾选，则下载勾选部分；没有则默认下载当前页面全部搜索结果'}).addClass('btn-search-his');
    $('<a>信息</a>').appendTo('.SavePoint,.result-con-l').click(getInfo).attr({'id':'info','title':'导出简要信息，用于核对下载情况和辅助重命名'}).addClass('btn-search-his');
    var tr3 = [];
    var info_count = 0;
    if (location.pathname.match('/kns/brief/'))
    {
        tr3 = $('tr[bgcolor],.GridDoubleRow,.GridSingleRow');
        replaceUrl(tr3);
    }
    else
    {
        $('#briefBox').ajaxStop(function(){
            tr3 = $('.result-table-list tbody tr,.result-detail-list dd');
            replaceUrl(tr3);
            /*
            if($(".countPageMark")){
                var page_count = $(".countPageMark").text().trim().split("/")[0];
                var page_per = $("#perPageDiv span").text().trim();
                info_count = (page_count-1) * page_per;
                info_count = info_count > 0 ? info_count : 0 ;
            }
            */
        });
    }
    function replaceUrl(all){
        all.each(function(){
            var url = $(this).find('a.briefDl_D,.briefDl_Y,.downloadlink').attr('href');
            if (url){
                //url = url.match('&dflag') ? url.replace('&dflag=nhdown','&dflag=pdfdown') : (url + '&dflag=pdfdown');
                url = document.URL.match('oversea') ? url : url.replace(/\S*(filename=\S*)/,'https://chn.oversea.cnki.net/kns/download?$1');
                $(this).find('a.briefDl_D,.briefDl_Y,.downloadlink').attr('href',url);
            }
        });
    }
    function getInfo(){
        var info = '序号→发表时间→第一作者→文献标题→下载状态\n' ;
        var trselected = selectBox(tr3);
        info += trselected.map(getInfoInEach).get().join('');
        var txtname = $(tr3).find('a.fz14,.author_flag,.GridRightColumn,.author').find('font.Mark').eq(0).text().trim() + '.txt';
        txtname = txtname == '.txt' ? $('.conditions').text().trim() + '.txt' : txtname;
        exportInfo(info,txtname);
        info = '';
    }
    function downLoad(){
        var trselected = selectBox(tr3);
        trselected.each(function(){
            var btdown=$(this).find('a.briefDl_D,.briefDl_Y,.downloadlink.icon-download,.icon-textlink')[0];
            if (btdown) btdown.click();
        });
    }
    function getInfoInEach(index){
        var pnum = index + 1 + info_count;
        var ptime = $(this).find('td:eq(4),label:contains(发表时间),span.date').text().replace('发表时间：','').trim().substr(0,10);
        var pname = $(this).find('.author_flag,.author,.authorinfo p a:eq(0)').text().split(';')[0].replace('，','').trim().split('  ').pop();
        pname = pname.length > 15 ? pname.split(' ')[1] : pname;
        pname = pname.length == 0 ? $(this).find('.authorinfo p').text().trim() : pname;
        var ptitle = $(this).find('a.fz14,h3.title_c a').text().trim().replace(/[\/:*?"<>|]+/g,'_').replace(/[\n\r\t]+/g,'').replace(/\s+——/g,'——');
        var pstatus = $(this).find('a.briefDl_D,.briefDl_Y,.downloadlink.icon-download').attr('title');
        pstatus = pstatus===undefined ? '未下载': pstatus.slice(3);
        var infoineach = pnum + '→' + ptime + '→' + pname + '→' + ptitle + '→' + pstatus + '\n';
        return infoineach;
    }
    function selectBox(all){
        var checked = tr3.find(':checkbox').is(":checked");
        var selected = checked == true ? all.filter(function(){return $(':checkbox',this).is(':checked')==true}) : all;
        return selected
    }
    function exportInfo(content, filename) {
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }
})();
