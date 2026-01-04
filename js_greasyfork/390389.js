// ==UserScript==
// @name         ad-get-out
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清理(baidu.com)搜索结果左右栏推广，以及二次推广
// @author       Leeyw
// @email        2621847675@qq.com
// @include      http*://www.baidu.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/390389/ad-get-out.user.js
// @updateURL https://update.greasyfork.org/scripts/390389/ad-get-out.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var sumbit = document.querySelector("#su").onclick = ()=> {
        //alert("aaa");
        AdClear(
            ()=>{setTimeout(()=>{
                setTimeout(AdClear( setTimeout(()=>{setTimeout(AdClear,1000);return;},0)),0);
                //alert("我是第三次执行");
                return 3;
            },2000)}
        );//过渡
        //alert("bbb");
    }
    //var Url = location.href;
    //var Oldwd = UrlHash(Url)['wd'];
    //var Newwd = Oldwd;
    //alert(Newwd);
    //判断是否发生改变
    function isHashChanged(){
        Url = location.harf;
        Newwd = UrlHash(Url)['wd'];
        if(Oldwd === Newwd){
            return false;
        }else{
            Oldwd = Newwd
            return true;
        }
    }
    // 通过harf判断是否更新wd
    function UrlHash(url){
        var params = [],p;
        var hash = url.slice(url.indexOf("?") + 1).split("&");
        for(var i = 0; i < hash.length; i++){
            var h = hash[i].split("=");
            params.push(h[0]);
            params[h[0]] = h[1];
        }
        return params;
    }
     // 清除百度推广
    function AdClear(t1 = ()=>{return 0;}){
       //alert(t1);
       var rightAd = document.querySelectorAll("#content_right > div > div");
       var leftAd = document.querySelectorAll("#content_left > div");
       var i;
       for(i = 0; i < leftAd.length; i++){//删除content_left推广
           var id = Number(leftAd[i].id);
           if(id > 1000){
               leftAd[i].remove();
           }else{
             leftAd = document.querySelectorAll("#content_left > div > div");
             for(i = 0; i < leftAd.length; i++){
                 id = Number(leftAd[i].id);
                 if(id > 1000){
                     leftAd[i].remove();
                 }else{
                     leftAd = document.querySelectorAll("#content_left > div > div > span");
                     for(i = 0; i < leftAd.length; i++){
                         if(leftAd[i].innerText === "广告"){
                             leftAd[i].parentNode.parentNode.remove();
                         }else{
                             //alert("使用第三种策略");
                             break;
                         }
                     }
                     //alert("使用第二种策略");
                     break;
                 }
             }
             //alert("使用第一种策略");
             break;
           }
       }
       for(i = 0; i < rightAd.length; i++){//删除content_right推广
            rightAd[i].remove()
        }
       var t = t1();
       //alert(t);
       return 1;
    }
    AdClear(()=>{ return 1;});
    setTimeout(()=>{AdClear(); return 2;},2000);
})();