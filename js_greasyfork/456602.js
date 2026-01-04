// ==UserScript==
// @name         一键打包下载国科大sep上的课件
// @version      1.0
// @description  一键打包下载国科大sep上的课件，不用一个个点了
// @author       VnYzm
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js
// @match        https://course.ucas.ac.cn/portal/site/*/tool/*
// @namespace    DownloadPPT
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/456602/%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E5%9B%BD%E7%A7%91%E5%A4%A7sep%E4%B8%8A%E7%9A%84%E8%AF%BE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456602/%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E5%9B%BD%E7%A7%91%E5%A4%A7sep%E4%B8%8A%E7%9A%84%E8%AF%BE%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('button:contains("复制")').after(
        '<input type="button" value="下载" style="margin:0" class="btn btn-default">');
    $(':button').click(function () {
        let zip = new JSZip();
        let files = $('input[name="selectedMembers"]:checked');
        if (files.length == 0) return;
        $(':button').prop('disabled','disabled')
        files.each(function () {
            let a = $(this).parent().next().children().first(); 
            zip.file(
                a.next().find('.hidden-sm').text(),
                fetch(a.prop('href')).then(r => r.blob()));
        });
        zip.generateAsync({type:'blob'}).then(function(content) {
            saveAs(content, '课件.zip');
            $(':button').removeProp('disabled');
        });
    });
})();
