// ==UserScript==
// @name         Auto download Album of FanKe's website
// @name:zh-TW   自動下載凡科網站相册圖片
// @namespace    http://WWW.NTRSN.CN/
// @description:en I can't Fix this Error "Uncaught TypeError: Cannot read property 'substring' of undefined"
// @description:zh-tw I can't Fix this Error "Uncaught TypeError: Cannot read property 'substring' of undefined"
// @version      0.1
// @author       WWW.NTRSN.CN
// @supportURL   873248164@qq.com
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=873248164@qq.com&item_name=Greasy+Fork+donation
// @include      http://*.icoc.cc/*
// @description I can't Fix this Error "Uncaught TypeError: Cannot read property 'substring' of undefined"
// @downloadURL https://update.greasyfork.org/scripts/368204/Auto%20download%20Album%20of%20FanKe%27s%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/368204/Auto%20download%20Album%20of%20FanKe%27s%20website.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function Download() {
        var ImgList=document.querySelectorAll(".productListForms img");
        var StringA, StringB, Src;
        for(var i in ImgList){
            Src=ImgList[i].src;
            ImgList[i].src=Src.substring(0,Src.length-11)+Src.substring(Src.length-4);
            download(ImgList[i].src);
        }
        // NextPage();
    }
    function download(src) {
        var $a = document.createElement('a');
        $a.setAttribute("href", src);
        $a.setAttribute("download", "");
        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'click',true,true,document.defaultView,0,0,0,0,0,false,false,true,false,0,null);
        $a.dispatchEvent(evObj);
    }
    function NextPage() {
        var pageNext=document.querySelector(".pageNext a");
        if(pageNext!==null){
            pageNext.click();
        }
        else{
            console.log('下载完毕哦');
        }
    }
    window.onload=function(){
        Download();
    };
})();