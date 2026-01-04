// ==UserScript==
// @id           BaiduXueShu-CNKI-change
// @name         百度学术知网旧版链接转换
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  将百度学术搜索结果中旧版知网链接替换为新版知网链接,代码地址 https://github.com/dlutor/BaiduXueShu-CNKI-change 欢迎使用和提交问题
// @author       dlutor
// @match        *://xueshu.baidu.com/*
// @include      */usercenter/paper/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398422/%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AF%E7%9F%A5%E7%BD%91%E6%97%A7%E7%89%88%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/398422/%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AF%E7%9F%A5%E7%BD%91%E6%97%A7%E7%89%88%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function change(pre_url){
        var new_base_url='http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=';//CJFQ&filename=
        if(pre_url.match('cnki.com.cn')){
               var filename=pre_url.split('-').slice(-1)[0].split('.ht')[0];
               var dbcode=pre_url.split('-')[0].split('/').slice(-1)[0].slice(0,4);
               var new_url;
               //debugger;
               if (dbcode=='CDMD'||dbcode=='cdmd' ){
               new_url=new_base_url+'CDMD&filename='+filename+'.nh';
               }else{
               new_url=new_base_url+dbcode+'&filename='+filename;
              }
            return new_url;
    }};
    var dl_item_span=document.getElementsByClassName('dl_item_span');
    for (var i=0, len=dl_item_span.length;i<len;i++){
        var element=dl_item_span[i];
        if(element.innerText==" 知网"){
            var pre_url=element.childNodes[1].href,new_url;
            new_url=change(pre_url);
            element.childNodes[1].href=new_url;
            element.childNodes[1].rel="noreferrer";
            }
        if(element.innerText==" kns.cnki.net" ||element.innerText==" KNS"){
            element.childNodes[1].rel="noreferrer";
        }
    }
    var v_source=document.getElementsByClassName('v_source');
    for (i=0, len=v_source.length;i<len;i++){
        element=v_source[i];
        if(element.title=="知网"){
            pre_url=element.href;
            //alert(pre_url);
            new_url=change(pre_url);
            element.href=new_url;
            element.rel="noreferrer";
        }
    }
})();