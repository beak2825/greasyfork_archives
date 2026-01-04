// ==UserScript==
// @name               广告清理
// @name:en            guanggaoqingli
// @name:zh-TW         广告清理
// @namespace          ziyuanxiaozhan
// @version            2.0.8.90
// @description        彻底清理广告，并防止反复
// @description:en     Thoroughly clean up advertisements and prevent repetition
// @description:zh-TW  徹底清理廣告，並防止反復
// @author             ziyuanxiaozhan
// @include            http*://www.baidu.com/*
// @include            http*://m.baidu.com/*
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 测试通过
// @compatible         opera 未测试
// @compatible         safari 测试通过
// @downloadURL https://update.greasyfork.org/scripts/402274/%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/402274/%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var killBaijiaType=1;//1：添加-baijiahao ；2：嗅探真实url
    var MO = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    if(MO){
        var observer = new MO(function(records){
            records.map(function(record) {
                if(record.addedNodes.length){
                    [].forEach.call(record.addedNodes,function(addedNode) {
                        clearOneAD(addedNode);
                    });
                }
            });
        });
        var option = {
            'childList': true,
            'subtree': true
        };
        observer.observe(document, option);
    }

    function checkBaijia(item){
        var itemHref=item.querySelector("a").href;
        item.style.display="none";
        if(itemHref.indexOf("baidu.com")==-1)return;
        var gmxhr=GM_xmlhttpRequest({
            url: itemHref,
            headers: {
                "Accept": "text/html"
            },
            method: "head",
            onreadystatechange:function(response) {
                if(response.readyState==4){
                    if(response.finalUrl.indexOf("baijiahao.baidu.com")!=-1){
                        item.remove();
                    }else{
                        item.style.display="";
                    }
                    gmxhr.abort();
                }
            }
        });
    }

    function clearAD(){
        if(!document.querySelectorAll || !document.parentNode)return;
        var mAds=document.querySelectorAll(".ec_wise_ad,.ec_youxuan_card,.page-banner"),i;
        for(i=0;i<mAds.length;i++){
            var mAd=mAds[i];
            mAd.remove();
        }
        var list=document.querySelectorAll("#content_left>div,#content_left>table");
        for(i=0;i<list.length;i++){
            let item = list[i];
            let s = item.getAttribute("style");
            if (s && /display:(table|block)\s!important/.test(s)) {
                item.remove();
            }else{
                var span=item.querySelector("div>span");
                if(span && span.innerHTML=="广告"){
                    item.remove();
                }
                [].forEach.call(item.querySelectorAll("a>span"),function(span){
                    if(span && (span.innerHTML=="广告" || span.getAttribute("data-tuiguang"))){
                        item.remove();
                    }
                });
                if(killBaijiaType==2){
                    [].forEach.call(item.querySelectorAll("a>span>img"),function(img){
                        if(img && img.classList.contains("source-icon") && !item.querySelector("span.c-pingjia")){
                            checkBaijia(item);
                        }
                    });
                }
            }
        }

        var eb = document.querySelectorAll("#content_right>table>tbody>tr>td>div");
        for(i=0;i<eb.length;i++){
            let d = eb[i];
            if (d.id!="con-ar") {
                d.remove();
            }
        }

        var nr = document.querySelector("#content_right>div>div>div");
        if(nr){
            var nra=nr.querySelectorAll("a");
            for(i=0;i<nra.length;i++){
                let d = nra[i];
                if (d.innerHTML=="广告") {
                    nr.remove();
                    break;
                }
            }
        }
    }

    function clearOneAD(ele){
        if(ele.nodeType!=1)return;
        if(ele.classList.contains("ec_wise_ad") || ele.classList.contains("ec_youxuan_card") || ele.classList.contains("page-banner")){
            ele.remove();
            return;
        }
        if(ele.parentNode && ele.parentNode.id=="content_left" && (ele.nodeName=="DIV" || ele.nodeName=="TABLE")){
            let s = ele.getAttribute("style");
            if (s && /display:(table|block)\s!important/.test(s)) {
                ele.remove();
            }else{
                var span=ele.querySelector("div>span");
                if(span && span.innerHTML=="广告"){
                    ele.remove();
                }
                [].forEach.call(ele.querySelectorAll("a>span"),function(span){
                    if(span && (span.innerHTML=="广告" || span.getAttribute("data-tuiguang"))){
                        ele.remove();
                    }
                });
                if(killBaijiaType==2){
                    [].forEach.call(ele.querySelectorAll("a>span>img"),function(img){
                        if(img && img.classList.contains("source-icon") && !ele.querySelector("span.c-pingjia")){
                            checkBaijia(ele);
                        }
                    });
                }
            }
        }

        if(ele.parentNode && ele.parentNode.id=="content_right"){
            if(ele.nodeName=="TABLE"){
                var eb = ele.querySelectorAll("tbody>tr>td>div");
                for(var i=0;i<eb.length;i++){
                    let d = eb[i];
                    if (d.id!="con-ar") {
                        d.remove();
                    }
                }
            }
            if(ele.nodeName=="DIV"){
                var nr = ele.querySelector("div>div");
                if(nr){
                    var nra=nr.querySelectorAll("a");
                    for(i=0;i<nra.length;i++){
                        let d = nra[i];
                        if (d.innerHTML=="广告") {
                            nr.remove();
                            break;
                        }
                    }
                }
            }
        }
    }
    setTimeout(()=>{clearAD();},2000);
})();
