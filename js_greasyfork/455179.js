// ==UserScript==
// @name         zhelper下载助手-可下载z-libirary资源
// @namespace    http://zhelper.net/
// @version      0.4
// @description  本脚本暂停更新，请不要再下载，请访问新版地址下载电子书：https://node1.v5.zhelper.net/
// @author       You
// @include      https://*.zhelper.net/
// @match        https://*.v4.zhelper.net/search/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455179/zhelper%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E5%8F%AF%E4%B8%8B%E8%BD%BDz-libirary%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/455179/zhelper%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E5%8F%AF%E4%B8%8B%E8%BD%BDz-libirary%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //替换所有链接
      $('.list-group a').each(function(){
        var href = $(this).attr('href');
        if(href){
            let url = href;
            var book_str = url.substring(url.lastIndexOf('/') - 8);
            var book_id = book_str.slice(0,8);
            href = href.replace(href,'https://mc.zhelper.net/miaochuan/'+book_id);
            $(this).attr('href',href);
             $(this).attr('data_href',href);
           $(this).attr('target',"_blank");
            $(this).attr('book_id',book_id);
        }
    });

})();