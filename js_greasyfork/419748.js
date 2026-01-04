// ==UserScript==
// @name         游民星空去广告
// @namespace    http://tampermonkey.net/
// @version      0.70
// @description  移除大部分广告以及调整页面样式 !
// @author       Baugun
// @match      http://*.gamersky.com/*
// @match      https://*.gamersky.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419748/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/419748/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var gamersky = {
        // 设定要去除元素的选择器规则
        queryADArray : [
            ".onlyOneBgtgs", // 主页背景广告
            ".bgAdWrap",
            "#top_index_660",
            "#top_allsite_660",
            "#ADback", // 主广告
            '#adscontainer_banner_new_top_index_1060', // 主页顶部通栏广告
            '#adscontainer_banner_new_top_index_1060_2', // 主页顶部通栏广告2
            '#adscontainer_banner_new_top_index_1060_3', // 主页顶部通栏广告3
            '#adscontainer_banner_new_second_index_1060', // 主页次级通栏广告
            '#adscontainer_banner_new_second_index_1060_2', // 主页次级通栏广告2
            '#adscontainer_banner_new_second_index_1060_3', // 主页次级通栏广告3
            '.Slides_ad', //轮播图广告
            "#FuGai", // 弹窗广告
            "#ADcover", // 弹窗广告
            '#new_top_allsite_970_1', // 详情通栏1
            '#new_top_allsite_970_2', // 详情通栏2
            "#adTips", // 右下提示广告
            '#new_page_allsite_620', // 详情页正文下方广告位
            '.ad_r', // 详情页推荐位广告
            '#adscontainer_block_300_3', // 详情页推荐位广告B
            '.MidR_ad', // 专题页侧边广告
            ".BaiduAdvertising"
        ],
        // 黑天白天模式切换下的样式调整
        switchLightAndDark: function(){
            // 默认为白天模式
            var themeMode = 'light';
            // 黑天模式
            if(document.body.className.indexOf('hei')!==-1){
                themeMode = 'dark';
            }

            // 忽律专题页的模式切换
            if(new RegExp(/\.gamersky.com\/z\/*/).test(window.location.href)){
                return;
            }

            switch(themeMode){
                case 'light':
                    this.setStyles(document.body, {
                        background: '#e2e2e2'
                    })
                    break;
                case 'dark':
                    this.setStyles(document.body, {
                        background: '#333'
                    })
                    break;
            }
        },
        // 设定dom内联样式
        setStyles:function(el, styleObject){
            for(var i in styleObject){
                if(el instanceof HTMLElement){
                    el.style[i] = styleObject[i];
                }
            }
        }

    };
    gamersky.switchLightAndDark();

    window.gamersky = gamersky


    // 监听所有dom变化
    new MutationObserver(function(mutations, observer){

        gamersky.queryADArray.forEach(function(item){
            document.querySelector(item) ? document.querySelector(item).remove() : null;
        });

        // 去除阴影样式
        if(document.querySelector('.Mid')){
            gamersky.setStyles(document.querySelector(".Mid"), {
                boxShadow: 'none'
            });
        }


        // 白天黑天切换
        if(document.querySelector('#switch')){
            document.querySelector('#switch').addEventListener('click',function(){
                gamersky.switchLightAndDark();
            },false);
        }

    }).observe(document.querySelector("body"), {childList: true, subtree: true});

})();