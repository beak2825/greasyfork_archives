// ==UserScript==
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @name         myFirstScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  self using script!
// @author       caodongdong
// @match        https://*.douban.com/*
// @match        https://*.csdn.net/*
// @match        https://www.coder.work/*
// @match        https://www.runoob.com/*
// @match        https://www.w3school.com.cn/*
// @match        https://git.huawei.com/*/merge_requests/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425003/myFirstScript.user.js
// @updateURL https://update.greasyfork.org/scripts/425003/myFirstScript.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href;

    // ------------豆瓣增强--------------
    var doubanHelper={};
    /*
     * 1. 去除页面广告
     */
    doubanHelper.removeAd = function(){
        var adItems = $('[id^=dale_]');
        if(adItems.length >=1) {
            $(adItems).remove();
        }
    }
    // 去除广告
    if(url.indexOf("douban.com") != -1) {
        doubanHelper.removeAd();
    }

    // ------------coderWork增强--------------
    var coderWorkHelper={};
    /*
     * 1. 去除页面广告
     */
    coderWorkHelper.removeAd = function(){
        var adItems = $('.adsbygoogle');
        if(adItems.length >=1) {
            $(adItems).each(function(){
                if($(this).css("display") != "none"){
                    $(this).parent().remove(); // 把整个广告连同空白一起删除掉
                }
            });
        }
    }
    // 去除广告
    if(url.indexOf("coder.work") != -1) {
        coderWorkHelper.removeAd();
    }

    // ------------runoob增强--------------
    var runoobHelper={};
    /*
     * 1. 去除页面广告
     */
    runoobHelper.removeAd = function(){
        var adItems = $('ins.adsbygoogle');
        if(adItems.length >=1) {
            $(adItems).each(function(){
                if($(this).css("display") != "none"){
                    $(this).parent().parent().remove(); // 把整个广告连同空白一起删除掉
                }
            });
        }
    }
    // 去除广告
    if(url.indexOf("runoob.com") != -1) {
        runoobHelper.removeAd();
    }

    // ------------w3school增强--------------
    var w3schoolHelper={};
    /*
     * 1. 去除页面广告
     */
    w3schoolHelper.removeAd = function(){
        var adItems = $('ins.adsbygoogle');
        if(adItems.length >=1) {
            $(adItems).each(function(){
                if($(this).css("display") != "none"){
                    $(this).parent().remove(); // 把整个广告连同空白一起删除掉
                }
            });
        }
    }
    // 去除广告
    if(url.indexOf("w3school.com") != -1) {
        w3schoolHelper.removeAd();
    }

    // ------------csdn增强--------------
    var csdnHelper={};
    /*
     * 1. 去除页面广告
     */
    csdnHelper.removeAd = function(){
        var adItems = $('#recommendAdBox');
        if(adItems.length >=1) {
            $(adItems).remove();
        }
    }
    // 去除广告
    if(url.indexOf("csdn.net") != -1) {
        csdnHelper.removeAd();
    }

    /************************************
     **************工作增强**************
     ************************************/
    // ------------git.huawei增强--------------
    var git_huawei = {};
    git_huawei.resolve_discussion = function(){
        var monitor = setInterval(set_click, 500);
        function set_click() {
            var btns = $('.line-resolve-btn');
            if (btns.length > 0) { // 页面初始化完成
                $(btns).first().click(function(){
                    if($(this).hasClass('is-active')) {
                        $('.btn.btn-default.ml-sm-2:contains(Unresolve discussion)').click();
                    } else {
                        $('.btn.btn-default.ml-sm-2:contains(Resolve discussion)').click();
                    }
                });
                clearInterval(monitor);
            }
        }
    }

    $(document).ready(function(){
        if(url.indexOf("git.huawei.com") != -1) {
            git_huawei.resolve_discussion();
        }
    });

})();
