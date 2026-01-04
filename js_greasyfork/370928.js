// ==UserScript==
// @name         GeelyForum
// @namespace    http://fulicat.com/
// @version      0.6
// @description  重置吉利论坛新版界面
// @author       Jack.Chan
// @match        https://club.geely.com/bbs/forum.php*
//               https://club.geely.com/bbs/forum.php?mod=forumdisplay&fid=339
//               https://greasyfork.org/scripts/370928-geelyforum/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370928/GeelyForum.user.js
// @updateURL https://update.greasyfork.org/scripts/370928/GeelyForum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rules = [];
    rules.push("::-webkit-scrollbar{width:12px !important;}");
    rules.push("body{padding-top:60px !important;}");
    rules.push("header{box-shadow: 0 0 8px 0px #999;position:absolute !important;}");
    rules.push(".club-nav{padding-bottom:10px !important;}");
    rules.push(".bm.bml{display:none !important;}");
    rules.push("#pgt{margin-top:10px !important;}");
    rules.push(".waterfall{padding-bottom:150px;height:100% !important;padding-left:10px;padding-right:10px;}");
    rules.push(".waterfall>li{width:100% !important;float:none !important;position:static !important;border-radius:5px !important;}");
    rules.push(".waterfall>li:hover{box-shadow: 0 0 10px 0 #03a9f4;}");
    rules.push("#waterfall .c{width:60px !important;max-height:40px;overflow:hidden;margin-left:5px;}");
    rules.push("#waterfall .c,");
    rules.push("#waterfall h3,");
    rules.push("#waterfall .auth{display:inline-block;vertical-align:middle;}");
    rules.push("#waterfall .auth{padding-bottom:0 !important;}");
    rules.push("#waterfall .nopic{border-radius:5px !important;}");
    rules.push("#waterfall .nopic .shoucang-icon{display:none;top:10px;}");
    rules.push("#waterfall .nopic:hover .shoucang-icon{display:block;}");
    rules.push("#waterfall .xw0 a{font-size: 1.3vw !important;}");
    rules.push("footer{display:none !important;}");
    rules.push(".link-first-page,");
    rules.push(".link-prev-page,");
    rules.push(".link-next-page{position:fixed;right:0;z-index:9999;background:#333;color:#fff !important;display:block;width:70px;height:40px;line-height:40px;text-align:center;border-radius:5px 0 0 5px;}");
    rules.push(".link-first-page{top:40%;margin-top:-100px;}");
    rules.push(".link-prev-page{top:40%;margin-top:-50px;}");
    rules.push(".link-next-page{top:40%;}");
    rules.push(".link-first-page:hover,");
    rules.push(".link-prev-page:hover,");
    rules.push(".link-next-page:hover{background:#888;}");
    rules.push("");

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = rules.join('');
    document.head.appendChild(style);

    if(document.forms.moderate){
        var pageStr = decodeURIComponent( document.forms.moderate.listextra.value );
        var page = 1, pagePrev = 1, pageNext = 1;
        if(pageStr){
            var tmp = pageStr.replace('page=', '');
            if(tmp){
                page = parseInt(tmp);
                pagePrev = parseInt(page - 1);
                pageNext = parseInt(page + 1);
            };
            
            if(page>1){
                var pagePrevHref = location.href.replace(pageStr, 'page='+ pagePrev);
                var $pagePrev = document.createElement('A');
                $pagePrev.setAttribute('class', 'link-prev-page');
                $pagePrev.setAttribute('href', pagePrevHref);
                $pagePrev.innerText = '上一页';
                document.body.appendChild($pagePrev);
            };

            if(page>2){
                var pageFirstHref = location.href.replace(pageStr, 'page=1');
                var $pageFirst = document.createElement('A');
                $pageFirst.setAttribute('class', 'link-first-page');
                $pageFirst.setAttribute('href', pageFirstHref);
                $pageFirst.innerText = '第一页';
                document.body.appendChild($pageFirst);
            };

            var pageNextHref = location.href.replace(pageStr, 'page='+ pageNext);
            if(location.href.indexOf('page=')<0){
                pageNextHref = pageNextHref +'&page=2';
            };
            var $nextPage = document.createElement('A');
            $nextPage.setAttribute('class', 'link-next-page');
            $nextPage.setAttribute('href', pageNextHref);
            $nextPage.innerText = '下一页';
            document.body.appendChild($nextPage);
        };

        if(window.jQuery){
            window.jQuery(document).on('mousedown', '#waterfall>li>h3>a', function(e){
                this.setAttribute('target', '_blank');
            });
        };

    }
})();