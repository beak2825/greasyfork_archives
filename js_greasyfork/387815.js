// ==UserScript==
// @name         掘金/思否/CSDN/博客园/Vue 去广告
// @version      2.1
// @description  完全免费去除广告
// @author       Gocc
// @match        *://*.juejin.im/*
// @match        *://*.segmentfault.com/*
// @match        *://*.csdn.net/*
// @match        *://www.iteye.com/*
// @match        *://*.cnblogs.com/*
// @match        *://*.vuejs.org/*
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png
// @namespace    掘金/思否/CSDN/博客园/Vue去广告
// @downloadURL https://update.greasyfork.org/scripts/387815/%E6%8E%98%E9%87%91%E6%80%9D%E5%90%A6CSDN%E5%8D%9A%E5%AE%A2%E5%9B%ADVue%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/387815/%E6%8E%98%E9%87%91%E6%80%9D%E5%90%A6CSDN%E5%8D%9A%E5%AE%A2%E5%9B%ADVue%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var addEventListener_o=EventTarget.prototype.addEventListener;
    function addEventListener(type, listener, useCapture) {
        if (type != "copy") {
            this.addEventListener = addEventListener_o;
            this.addEventListener(type, listener, useCapture);
            this.addEventListener = addEventListener;
        }
    }
    EventTarget.prototype.addEventListener = addEventListener;
    function hide(element) {
        if (element != undefined) {
            element.style.position = "fixed";
            element.style.top = "-2000px";
            element.style.position = "-2000px";
        }
    }
    function remove(element) {
        if (element != undefined) {
            element.remove();
        }
    }
    function click(element) {
        if (element != undefined) {
            element.click();
        }
    }
    function operate(operation, elements) {
        if (elements != undefined && elements.length != undefined) {
            for (var i = 0; i < elements.length; ++i) {
                operation(elements[i]);
            }
        }
    }
    var IntervalID = setInterval(function() {
        if (document.body) {
            if (document.body.getElementsByClassName("vip-caise")[0] != undefined) {
                document.body.getElementsByClassName("vip-caise")[0].style.padding = "0";
            }
            if (document.body.getElementsByClassName("csdn-side-toolbar")[0] != undefined && document.body.getElementsByClassName("csdn-side-toolbar")[0].children[0].dataset.type == "vip") {
                hide(document.body.getElementsByClassName("csdn-side-toolbar")[0].children[0]);
            }
            remove(document.getElementById("kp_box_56"));
            for (var i=0;i<=500;i++) {
                hide(document.getElementById("kp_box_"+i));
            }
            hide(document.getElementById("kp_box_394_1047"));
            hide(document.getElementById("kp_box_395_1047"));
            hide(document.getElementById("kp_box_396_1047"));
            hide(document.getElementById("kp_box_397_1047"));
            hide(document.getElementById("kp_box_398_1047"));
            hide(document.getElementById("kp_box_399_1047"));
            hide(document.getElementById("kp_box_219_1046"));
            click(document.getElementById("btn-readmore"));
            operate(click, document.body.getElementsByClassName("btn-readmore"));
            operate(click, document.body.getElementsByClassName("fouce_close_btn J_fouce_close_btn"));
            operate(hide, document.body.getElementsByClassName("bbs_feed bbs_feed_ad_box"));
            operate(hide, document.body.getElementsByClassName("indexSuperise"));
            operate(hide, document.body.getElementsByClassName("right-item ad_item"));
            operate(hide, document.body.getElementsByClassName("t0 clearfix"));
            operate(hide, document.body.getElementsByClassName("meau-gotop-box"));
            operate(hide, document.body.getElementsByClassName("slide-outer right_top"));
            operate(hide, document.body.getElementsByClassName("quake-slider"));
            operate(hide, document.body.getElementsByClassName("banner-ad-box"));
            operate(hide, document.body.getElementsByClassName("adsbygoogle"));
            operate(hide, document.body.getElementsByClassName("bbs_feed bbs_feed_ad_box"));
            operate(hide, document.body.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow"));
            operate(hide, document.body.getElementsByClassName("recommend-item-box recommend-ad-box"));
            operate(hide, document.body.getElementsByClassName("vip-totast"));
            operate(remove, document.body.getElementsByClassName("box-box-large"));
            operate(remove, document.body.getElementsByClassName("box-box-default"));
            //思否
            operate(hide,document.getElementsByClassName("mb25"));
            operate(hide,document.getElementsByClassName("mb30"));
            operate(hide,document.getElementsByClassName("sf-live-recommend"));
            operate(hide,document.getElementsByClassName("job-recommend"));
            //掘金
            operate(hide,document.getElementsByClassName("sidebar-bd-entry"));
            operate(hide,document.getElementsByClassName(" index-book-collect"));
            //博客园
            hide(document.getElementById("cnblogs_a1"));
            hide(document.getElementById("cnblogs_a2"));
            hide(document.getElementById("cnblogs_a3"));
            hide(document.getElementById("cnblogs_a4"));
            hide(document.getElementById("cnblogs_b1"));
            hide(document.getElementById("cnblogs_b2"));
            hide(document.getElementById("cnblogs_b3"));
            hide(document.getElementById("cnblogs_b4"));
            hide(document.getElementById("cnblogs_c1"));
            hide(document.getElementById("cnblogs_c2"));
            hide(document.getElementById("cnblogs_c3"));
            hide(document.getElementById("cnblogs_c4"));
            hide(document.getElementById("e1"));
            hide(document.getElementById("e2"));
            hide(document.getElementById("e3"));
            hide(document.getElementById("e4"));
            //vue
            hide(document.getElementById("ad"));
            operate(hide,document.getElementsByClassName("main-sponsor"));

        }
    }, 100);
    setTimeout(function() {
        clearInterval(IntervalID)
    }, 10000);
})();