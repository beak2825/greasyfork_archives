// ==UserScript==
// @name              百度系产品去广告，百度搜索、百度贴吧、百度知道、百度文库去广告
// @version           1.0.4
// @description       清除百度搜索页面，百度贴吧页的页面广告。
// @license           MIT
// @namespace         百度去广告
// @match             *://www.baidu.com/*
// @match             *://tieba.baidu.com/*
// @match             *://zhidao.baidu.com/*
// @match             *://wenku.baidu.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @connect           *
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/418345/%E7%99%BE%E5%BA%A6%E7%B3%BB%E4%BA%A7%E5%93%81%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E3%80%81%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/418345/%E7%99%BE%E5%BA%A6%E7%B3%BB%E4%BA%A7%E5%93%81%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E3%80%81%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
;(() => {

    'use strict'

    function clearbaidu() {
        setInterval(function () {

            var content = document.getElementById('content_left');
            var list = content.getElementsByTagName("div");
            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (list[i].innerHTML.indexOf("display:block !important;visibility:visible !important") > -1) {
                    list[i].style.display = "none";
                }
            }
            //a 链接无下划线
            $('a').css('text-decoration', 'none');

            //去除右侧推广
            var pop = $("#content_right .cr-content");
            for (var i = 0; i < pop.length; i++) {
                if (pop[i].innerHTML.indexOf("new-pmd") > -1) {
                    pop[i].style.display = "none";
                }
            }
            //去除右侧广告
            if ($("#container #con-ar").find("div.result-op").length > 1) {
                $("#container #con-ar").find("div").hide();
            }

            //去除右侧侧边栏推广广告链接
            $(".layout").hide();
            //去除搜索内容带广告的条目
            var arr = $(".f13 span");
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].innerText.indexOf("广告") > -1) {
                    arr[j].parentNode.parentNode.style.display = "none";
                }
            }
        }, 1);
    }

    function cleartieba() {
        setInterval(function () {
            $(".top-sec").remove();
            $(".spage_liveshow_slide").remove();
            $(".platact_bigouter").remove();
            $(".r-top-sec").remove();
        }, 1)

    }

    function clearzhidao() {
        setInterval(function () {
            $(".list-header .bannerdown").remove();
            $(".list-header .leftup").remove();
            $(".aside div.rightup").remove();
        }, 1)
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.location.href.indexOf("www.baidu.com/s") > -1) {
            clearbaidu();
        } else if (window.location.href.indexOf("tieba.baidu.com/") > -1) {
            cleartieba();
        } else if (window.location.href.indexOf("zhidao.baidu.com/") > -1) {
            clearzhidao();
        }
    });
})()
