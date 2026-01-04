// ==UserScript==
// @name         小草帮手
// @version      3.0.8
// @author       窗外的麻雀
// @namespace    https://greasyfork.org/users/1033046
// @description  屏蔽頁面廣告|優化圖片鏈接|增加磁力鏈接|在線成人影院主動加載視頻and屏蔽視頻悬浮文字菜單
// @require      https://code.jquery.com/jquery-2.0.0.min.js
// @match        http*://*/htm_data/*.html
// @match        http*://*/htm_mob/*.html
// @match        http*://*/thread0806*
// @match        http*://*/read.php*
// @match        http*://*.rmdown.com/*
// @match        http*://*.tanseb.com/*
// @match        http*://*/play/video*
// @match        http*://*/embed/*
// @match        http*://*/chain/*
// @match        http*://*/player/*
// @match        http*://*/index*/*ndex/video*
// @match        http*://*/v/*
// @grant        none
// @grant        GM_log
// @license      FBI WARNING
// @run-at       document-end
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/460757/%E5%B0%8F%E8%8D%89%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460757/%E5%B0%8F%E8%8D%89%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // @grant        unsafeWindow
    var pageHref = window.location.href.toLowerCase();
    var isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    var nfid = (typeof fid != "undefined") ? fid : 0;
    console.log(nfid+'||'+pageHref);
    if (nfid == 0 && pageHref.indexOf("rmdown") != -1){
        setTimeout(function(){
            $("a[href*=http]").each(function() {
                $(this).remove();
            });
            return;
        }, 500);
    }
    if (nfid == 0 && (pageHref.indexOf("play") != -1 || (pageHref.indexOf("hyaa") != -1 && pageHref.indexOf("video") != -1) || pageHref.indexOf("/v/") != -1)){
        setTimeout(function(){
            //console.log('links');
            $("div[class*=links]").each(function() {
                $(this).remove();
            });
            $("div[class*=sidebar]").each(function() {
                $(this).remove();
            });
            if (!$.isEmptyObject($("#think_page_trace_open"))){
                $("#think_page_trace_open").remove();
            }
            return;
        }, 500);
    }
    if (nfid == 0 && (pageHref.indexOf("tanseb") != -1 || pageHref.indexOf("chain") != -1 || pageHref.indexOf("embed") != -1)){
        setTimeout(function(){
            $("a[class*=fp-logo]").each(function() {
                $(this).remove();
            });
            return;
        }, 500);
    }
    if (nfid == 0 && pageHref.indexOf("embed") != -1){
        setTimeout(function(){
            $("div[class*=fp-settings-list]").each(function() {
                $(this).remove();
            });
            if (!$.isEmptyObject($("#buttons-block"))){
                $("#buttons-block").remove();
                $("div").first().css('height','100%');
            }
            return;
        }, 500);
    }

//    function isEmptyObj(obj){
//         for (var key in obj) {
//            return false;
//         }
//         return true;
//     }

//     function printObj(obj){
//         var x = 0;
//         for (var s in obj) {
//            console.log(x + ':' + s);
//            x++;
//         }
//     }

//     function removeObj(obj){
//         for (var i = obj.length; i > 0; i-- ){
//             obj[i - 1].remove();
//         }
//     }

//     function addObj(magtNmae,src,hase){
//         for (var i = obj.length; i > 0; i-- ){
//             obj[i - 1].remove();
//         }
//     }

    function removeMobAD(){
        var ads = null;
        ads = $("div[class='tpc_icon fl']");
        if (!$.isEmptyObject(ads) && ads.length > 0){
            console.log('ad['+ ads.length + ']');
            ads.each(function() {
                $(this).remove();
            });
        }
        ads = $("div[style*='padding:0 10px']");
        if (!$.isEmptyObject(ads) && ads.length > 0){
            console.log('ad['+ ads.length + ']');
            for (var i = 0; i < ads.length; i++ ){
                ads[i].nextElementSibling.remove();
                ads[i].remove();
            }
        }
    }
    function removePcAD(){
        var ads = null;
        ads = $("div[class*=tips]");
        if (!$.isEmptyObject(ads) && ads.length > 0){
            console.log('ad['+ ads.length + ']');
            ads.each(function() {
                $(this).remove();
            });
        }
    }

    if (nfid != 0 && pageHref.indexOf("read.php") != -1){
        console.log('page[read.php]');
        setTimeout(function(){
            if (isMobile) {removeMobAD();}
            else {removePcAD();}
            return;
        }, 100);
    }

    if (pageHref.indexOf("htm_mob") != -1){
        setTimeout(function(){
            removeMobAD();
            return;
        }, 200);
    }

    if (pageHref.indexOf("htm_data") != -1){
        setTimeout(function(){
            removePcAD();
            return;
        }, 200);
    }

    var conttpc = document.getElementById('conttpc');
    if (nfid == 0 || $.isEmptyObject(conttpc)){
        console.log("no conttpc");
        return;
    }

    if (nfid == 22){
        setTimeout(function(){
            if (!$.isEmptyObject(conttpc.children[1]) && !$.isEmptyObject(conttpc.children[1].getAttribute('onclick'))){
                var aDivHref = conttpc.children[1].getAttribute('onclick').split('=\'')[1].split('#')[0];//.slice(1);
                //conttpc.children[0].innerHTML='';
                //conttpc.children[0].style.display='none';
                conttpc.children[0].style.color='blue';
                conttpc.children[1].innerHTML='點擊重新加載視頻';
                conttpc.children[1].style.color='red';
                conttpc.children[1].setAttribute('onclick','document.getElementById(\'iframe1\').src=\''+aDivHref+'\'');//點擊重新加載
                if (isMobile) {location.href = aDivHref;}
                else {document.getElementById('iframe1').src=aDivHref;}
            }
            if (!$.isEmptyObject($("iframe"))) {
                console.log("iframe");
                $("iframe").attr("width","100%");
            }
        }, 500);
    }

    setTimeout(function(){
        var i = 0;
        $('img[ess-data]').each(function(){
//          console.log(i + ':' + $(this).attr('src'));
            i++;
            $(this).css("cursor","pointer");
            $(this).attr("onclick","");
            $(this).off("click");
            $(this).click(function(){
                window.open($(this).attr('ess-data'));
                return false;
            });
        })
    }, 200);

    setTimeout(function(){
        $("a[href*=redircdn]").each(function() {
//            console.log($(this).attr('href'));
            let sourcelink = $(this).attr('href').replace(/https?:\/\/.*?redircdn\.com\/\?(.*?)\&z/gi, '$1').replace(/______/gi, '.');
            $(this).attr('href',sourcelink);
//            console.log(sourcelink);
        });
    }, 200);

    setTimeout(function(){
        $("a[href*=rmdown]").each(function() {
            if (!$.isEmptyObject($(this).attr('href'))){
//                console.log($(this).attr('href'));
                var hash = $(this).attr('href').split('hash=')[1]
                var magnet = 'magnet:?xt=urn:btih:' + hash.substring(3);//magnet:?xt=urn:btih:
                var strRmdown = '';
                strRmdown += '<table style=\'width:100%;padding: 30px;background: #CFE2CD;text-align:center;\'>';
                strRmdown += '<tr><td style=\'width:70%;text-align:left;\'><a style=\'font-size: 16px;cursor: pointer; color: blue;\' target=\'_blank\' href=\''+magnet+'\'>'+magnet+'</a></td>';
                strRmdown += '<td style=\'text-align:right;\'><a style=\'cursor: pointer; color: red;\' target=\'_blank\' href=\''+$(this).attr('href')+'\'>種子下載</a></td></tr></table>';
                $(conttpc).append(strRmdown);
            }
        });
    }, 200);

})();