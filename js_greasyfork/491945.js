// ==UserScript==
// @name               去除百度搜索结果中的广告
// @name:zh-TW         去除百度搜索結果中的廣告
// @namespace          fournine
// @version            1.0.1
// @description        去除百度搜索结果的广告、刷新后仍可去除
// @description:zh-TW  去除百度搜索結果的廣告、重繪後仍可去除
// @author             fournineauthor
// @include            http*://www.baidu.com/*
// @include            http*://m.baidu.com/*
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/491945/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/491945/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var killBaijiaType=2;
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
        if(!document.querySelectorAll)return;
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
                [].forEach.call(item.querySelectorAll("span,a"),function(span){
                    if(span && (span.innerHTML=="广告" || span.getAttribute("data-tuiguang"))){
                        item.remove();
                    }
                });
                if(killBaijiaType==2){
                    [].forEach.call(item.querySelectorAll("a>div>span+img"),function(img){
                        if(img && /^https?:\/\/pic\.rmb\.bdstatic\.com/.test(img.src)){
                            //checkBaijia(item);
                            item.remove();
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
        if(ele.classList.contains("ec-tuiguang") || ele.classList.contains("ec_wise_ad") || ele.classList.contains("ec_youxuan_card") || ele.classList.contains("page-banner")){
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
                [].forEach.call(ele.querySelectorAll("span,a"),function(span){
                    if(span && (span.innerHTML=="广告" || span.getAttribute("data-tuiguang"))){
                        ele.remove();
                    }
                });
                if(killBaijiaType==2){
                    [].forEach.call(ele.querySelectorAll("a>div>span+img"),function(img){
                        if(img && /^https?:\/\/pic\.rmb\.bdstatic\.com/.test(img.src)){
                            //checkBaijia(ele);
                            ele.remove();
                        }
                    });
                }
            }
        }else if(ele.parentNode && ele.parentNode.id=="content_right"){
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
        }else{
            let eles=ele.querySelectorAll("#content_left>div,#content_left>table");
            [].forEach.call(eles, e=>{clearOneAD(e)});
        }
    }
    setTimeout(()=>{clearAD();},2000);
})();