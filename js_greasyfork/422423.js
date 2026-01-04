// ==UserScript==
// @name         Github Comment显示24小时时间（仅适用国内用户-北京时间）
// @name:en      Github Comment English Time to GTM8 (Beijing)
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  github的comment默认显示英语日期，此脚本自动替换push时间为此次push的第一笔commit的时间，并且使用北京时间24小时计时法显示. 能力有限，需要F5刷新一次才能完成替换，原因不明。
// @description:en github comment default shows English date without time, this script replace it as GTM8(Beijing time) 24h time
// @homepage     https://greasyfork.org/zh-CN/scripts/422423
// @icon         https://github.com/fluidicon.png
// @author       tumuyan
// @match        https://github.com/*/commits/*
// @run-at         document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422423/Github%20Comment%E6%98%BE%E7%A4%BA24%E5%B0%8F%E6%97%B6%E6%97%B6%E9%97%B4%EF%BC%88%E4%BB%85%E9%80%82%E7%94%A8%E5%9B%BD%E5%86%85%E7%94%A8%E6%88%B7-%E5%8C%97%E4%BA%AC%E6%97%B6%E9%97%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422423/Github%20Comment%E6%98%BE%E7%A4%BA24%E5%B0%8F%E6%97%B6%E6%97%B6%E9%97%B4%EF%BC%88%E4%BB%85%E9%80%82%E7%94%A8%E5%9B%BD%E5%86%85%E7%94%A8%E6%88%B7-%E5%8C%97%E4%BA%AC%E6%97%B6%E9%97%B4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll(`.TimelineItem-body`).forEach((item) => {
        var t = item.querySelector(`relative-time`).title.toString();
        t = t.replace("年","-").replace("月","-").replace("日","").replace("GMT+8","");

        if(t.indexOf("下午")>0){
            t=t.replace("下午0","下午")
                .replace(" 下午0:","12:")
                .replace(" 下午1:","13:")
                .replace(" 下午2:","14:")
                .replace(" 下午3:","15:")
                .replace(" 下午4:","16:")
                .replace(" 下午5:","17:")
                .replace(" 下午6:","18:")
                .replace(" 下午7:","19:")
                .replace(" 下午8:","20:")
                .replace(" 下午9:","21:")
                .replace(" 下午10:","22:")
                .replace(" 下午11:","23:")
                .replace(" 下午12:","12:");
        }else{
            t=t.replace("上午0","上午")
                .replace(" 上午0:","00:")
                .replace(" 上午1:","01:")
                .replace(" 上午2:","02:")
                .replace(" 上午3:","03:")
                .replace(" 上午4:","04:")
                .replace(" 上午5:","05:")
                .replace(" 上午6:","06:")
                .replace(" 上午7:","07:")
                .replace(" 上午8:","08:")
                .replace(" 上午9:","09:")
                .replace(" 上午10:","10:")
                .replace(" 上午11:","11:")
                .replace(" 上午12:","00:");
        }

        // var t= "2020年11月9日 GMT+8 下午11:00".replace("年","-").replace("月","-").replace("日","").replace("GMT+8","");
        item.querySelector(`h2`).innerText=t;
        //        console.log(item.text);
    });

    document.querySelectorAll(`.TimelineItem-body relative-time`).forEach((item) => {
        var t = item.title.toString();
        t = t.replace("年","-").replace("月","-").replace("日","").replace("GMT+8","");
        item.innerText="于 "+t;
    });


    /*
////@require http://code.jquery.com/jquery-1.11.0.min.js
    setTimeout(function(){
        //要执行的事件
        $(".TimelineItem-body").ready(function(){
            var t = $(this).find("relative-time").attr("title");
            t = t.replace("年","-").replace("月","-").replace("日","").replace("GMT+8","").replace(" 上午","");

            if(t.indexOf("下午")>0){
                t=t.replace("下午0","下午")
                    .replace(" 下午0:","12:")
                    .replace(" 下午1:","13:")
                    .replace(" 下午2:","14:")
                    .replace(" 下午3:","15:")
                    .replace(" 下午4:","16:")
                    .replace(" 下午5:","17:")
                    .replace(" 下午6:","18:")
                    .replace(" 下午7:","19:")
                    .replace(" 下午8:","20:")
                    .replace(" 下午9:","21:")
                    .replace(" 下午10:","22:")
                    .replace(" 下午11:","23:")
                    .replace(" 下午12:","24:");
            }
            $(this).find("h2").text(t);
        });
    },3000);
 */
})();