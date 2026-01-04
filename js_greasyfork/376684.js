// ==UserScript==
// @name         移除百家号搜索结果
// @icon         https://www.baidu.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/375240
// @description  删除百度搜索结果的百家号结果
// @version      1.25
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @author       mzcc
// @note         2022.10.14-1.25 新增删除部分推广广告
// @note         2022.10.14-1.23 调整删除逻辑，解决未删除第一个元素的问题
// @note         2022.10.11-1.22 调整授权问题
// @note         2022.10.09-1.20 重做删除逻辑
// @note         2019.02.20-1.11 监听页面结构变化，调整代码
// @note         2019.02.20-1.10 监听页面结构变化，修改移除逻辑
// @note         2019.01.28-1.02 移除超时限制
// @note         2019.01.25-1.01 百度搜索页面由于界面变化，观察页面dom的方式已经失效，更换新的去除方式
// @note         2018.12.30-0.15 根据反馈，删除操作做新的变更逻辑
// @note         2018.12.19-0.14 根据百度界面变化，删除操作做新的变更逻辑
// @grant        GM.xmlHttpRequest
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375240/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/375240/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';


    var titleEl = document.getElementsByTagName("title")[0];
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if(MutationObserver){
        var MutationObserverConfig={
            childList: true,
            subtree: true,
            characterData: true
        };
        var observer=new MutationObserver(function(mutations){
            dealContent();
        });
        observer.observe(titleEl,MutationObserverConfig);
    }else if(titleEl.addEventListener){
        titleEl.addEventListener("DOMSubtreeModified", function(evt) {
            dealContent();
        }, false);
    }


    dealContent();


    function dealContent() {
        let $container = $('#content_left');
        // 移除广告
        $('.ec-tuiguang').parents('.new-pmd').parent().parent().parent().remove();

        // 移除百度视频广告
        $container.find('a[href*="haokan.baidu"]').parents('.c-container').remove();

        let $tags = $container.find('a[href^="http://www.baidu.com/link?url="]');
        let $top = $('.c-offset');
        let href = Array.from($tags).map(v => $(v).attr('href'));

        // 去重
        href = Array.from(new Set(href));

        // 移除
        href.forEach(function(url, index){
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                maxRedirects: 0,
                onload: function (response) {
                    if (response.finalUrl.indexOf('baijia') > -1) {

                        let $ele = $container.find('a[href="'+url+'"]').eq(0);
                        let flag = '.c-row';
                        let $parent = $ele.parents('.c-row');
                        if(!$parent.length){
                            $parent = $ele.parents('.c-container');
                            flag = '.c-container';
                        }

                        $parent.remove();
                        let $newBox = $parent.parents('.new-pmd');
                        if(!$newBox.find(flag).length){
                            $newBox.remove();
                        };
                    } else {
                        // 还原真实地址
                        $container.find('a[href="'+url+'"]').attr('href', response.finalUrl);
                    }
                }
            });
        });

    }

})();
