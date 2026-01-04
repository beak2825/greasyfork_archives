// ==UserScript==
// @name         CSDN博客专用
// @namespace    zhaoxiufei@gmail.com
// @version      1.3.3
// @description  CSDN博客网站专用 自动展开+去除页面广告+长期更新
// @author       zhaoxiufei
// @match        *://blog.csdn.net/*
// @require      http://code.jquery.com/jquery-3.3.1.slim.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372413/CSDN%E5%8D%9A%E5%AE%A2%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/372413/CSDN%E5%8D%9A%E5%AE%A2%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let isDebug = true;
    let log = isDebug ? console.log.bind(console) : function () {
    };

    let i = 0;
    //自动展开
    let clean = window.setInterval(cleanAd, 500);

    function displayOne(name, selector) {
        let ad = document.querySelector(selector);
        if (ad) {
            ad.style.display = "none";
            log(name + "已执行");
        } else {
            log(name + "未执行");
        }
    }
    function displayAll(name, selector) {
        let ad = document.querySelectorAll(selector);
        if (ad) {
            for (let i = 0; i < ad.length; i++) {
                ad[i].style.display = "none";
            }
            log(name + "已执行");
        } else {
            log(name + "未执行");
        }
    }
    function displayAll2(name, selector) {
        let ad = document.querySelectorAll(selector);
        if (ad) {
            for (let i = 0; i < ad.length; i++) {
                if(ad[i].getAttribute("data-track-click").indexOf("baidu.com")!=-1){
                     ad[i].style.display = "none";
                }
            }
            log(name + "已执行");
        } else {
            log(name + "未执行");
        }
    }
    //
    function removeOne(name, selector) {
        let ad = document.querySelector(selector);
        if (ad) {
            $(selector).remove();
            log(name + "已执行");
        }
    }
    function removeAttr(name, selector,attr) {
        let ad = document.querySelector(selector);
        if (ad) {
            $(selector).removeAttr(attr);;
            log(name + "已执行");
        }
    }
    function cleanAd() {
        if (i >= 2) {
            clearInterval(clean)
        }
        log("执行");
        //自动展开
        removeAttr("ad000","#article_content","style");
        removeOne("ad00","#mainBox > main > div.blog-content-box > article > div.hide-article-box.text-center");
        displayAll2("xxoo","#mainBox > main > div.recommend-box > div.recommend-item-box.recommend-box-ident.type_blog")
        removeOne("ad0","#mainBox > div > ul");
        displayOne("ad1", "#mainBox > main > div.recommend-box > div.recommend-item-box.blog-expert-recommend-box");
        displayOne("ad2", "#mainBox > aside > div.csdn-tracking-statistics.mb8.box-shadow");
        //displayOne("ad3", "#mainBox > main > div.recommend-box > div.p4courset3_target._4paradigm_box.recommend-item-box.clearfix");
        displayAll("ad4", "[id^='dmp_ad_']");
        displayOne("ad5", "#mainBox > main > div.recommend-box > div.recommend-item-box.type_hot_word");
        displayOne("ad6", "#mainBox > main > div.recommend-box > div.recommend-item-box.recommend-ad-box");
        displayOne("ad7", "body > div.pulllog-box");
        displayAll("ad8", "#mainBox > main > div.recommend-box > div.recommend-item-box.recommend-ad-box");
        displayOne("ad9", "body > div.fourth_column");
        displayOne("ad10", "#asideFooter");
        i++;
    }
})();
