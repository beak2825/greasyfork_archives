// ==UserScript==
// @name         【广告去除】百度贴吧
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  去除百度贴吧广告
// @author       You
// @match        *://tieba.baidu.com/
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/f?*
// @match        *://tieba.baidu.com/f/search/*
// @match        *://tieba.baidu.com/home/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472858/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/472858/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //*************************************************************************************
    //----------------------------------------广告匹配规则
    //*************************************************************************************
    var url = window.location.href;

    var domain = document.domain;
    var pathSegment = window.location.pathname.split('/')[1]

    var names = [];

    //******************
    //---------贴吧帖子内
    //******************
    if (url.includes('tieba.baidu.com/p')) {
        console.log('[广告去除] 贴吧帖子');
        names = [
            ['style','ad-dom-img'],//左侧图片广告拥有的style
            ['style','data-index'],//伪装楼层广告拥有的style
            ['style','data-po'],//伪装楼层广告拥有的style
            ['id','aside-ad'],//右侧贴图广告Id
            ['id','fc-wrap-seat'],//右侧空白区域Id
            ['id','pagelet_frs-aside/pagelet/aside_ad'],//右侧视频广告Id
            ['id','aside-ad-wrapper'],//右侧贴图广告Id
            ['id',/mediago-tb-pb-list-\d{1,3}/],//伪装帖子广告Id，例：mediago-tb-pb-list-2
            ['data-index',/\b[0-9]{1,2}\b/],//伪装帖子广告

            ['class','aside-wrapper'],//右侧视频广告Class
            ['class','fc-wrap-seat'],//右侧空白区域Class
            ['class','region_bright app_download_box'],//右侧“扫二维码下载贴吧客户端”广告Class
            ['class','more-config-navtab j_tbnav_tab'],//顶部“我的游戏”Class
            //'l_post l_post_bright j_l_post clearfix',//伪装楼层广告拥有的Class
            ['class',/\b[a-zA-Z0-9]{10}\b\s{1,2}\bclearfix\b/],//左侧贴图广告Class，例：kccb4c7dae  clearfix
            ['class','tbui_aside_fbar_button tbui_fbar_down'],//右侧悬浮APP广告Class

            ['class','topic_list_box'],//右侧“贴吧热议榜”Class

        ];
    }
    //******************
    //---------贴吧吧主页
    //******************
    else if (url.includes('tieba.baidu.com/f?')) {
        console.log('[广告去除] 贴吧吧主页');
        names = [
            ['style','ad-dom-img'],//左侧图片广告拥有的style
            ['style','data-po'],//伪装帖子广告拥有的style
            ['style','data-index'],//伪装帖子广告拥有的style

            ['id','pagelet_frs-aside/pagelet/aside_ad'],//右侧图片广告Id
            ['id','branding_ads'],//右侧图片广告Id下
            ['id',/mediago-tb-frs-list-\d{1,3}/],//伪装帖子广告Id，例：mediago-tb-frs-list-14

            ['class','clearfix thread_item_box'],//伪装帖子广告拥有的Class
            ['class','aside_region app_download_box'],//右侧“扫二维码下载贴吧客户端”广告Class
            ['class',/\b[a-zA-Z0-9]{10}\b\s{1,2}\bclearfix\b/],//左侧贴图广告Class，例：kccb4c7dae  clearfix
            ['class','tbui_aside_fbar_button tbui_fbar_down'],//右侧悬浮APP广告Class
            ['class','more-config-navtab j_tbnav_tab '],//顶部“我的游戏”Class

            //['id','plat_recom_carousel'],//顶部大图广告
            //['class','plat_recom_carousel tbui_slideshow_container'],//顶部大图广告
            //https://tieba.baidu.com/official/click/redirect
            //?client_type=pc_web
            //&tbjump=http%3A%2F%2Fgamein.baidu.com%2Fgame%2Flink%2Fjump%3Fnumber%3D48
            //&ie=utf-8
            //&task=%E5%90%A7%E5%A4%B4%E5%9B%BE%E6%8E%A8%E8%8D%90%E7%BB%9F%E8%AE%A1
            //&ie=utf-8
            //&locate=%E5%A4%B4%E9%83%A8%E8%BD%AE%E6%92%AD%E5%9B%BE
            //&ie=utf-8
            //&page=pfe
            //&ie=utf-8
            //&type=click
            //&url=http%3A%2F%2Ftieba.baidu.com%2Ff%3Fkw%3D%25E6%2598%25BE%25E5%258D%25A1%3Fkw%3D%25E6%2598%25BE%25E5%258D%25A1
            //&ie=utf-8&refer=https%3A%2F%2Ftieba.baidu.com%2F&ie=utf-8
            //&fid=
            //&fname=
            //&uid=
            //&uname=
            //&is_new_user=
            //&tid=
            //&_t=1692152697
            //&frame=1
            //&evl_client_type=pc_web
            //&evl_page=FRS
            //&evl_locate=p0249
            //&evl_task=ad_plat
            //&evl_line=PT
            //&evl_action_type=CLICK
            //&evl_callfrom=effect_evl
            //&evl_obj_id=407930013_13
            //&evl_id=407930013
            //&evl_res_id=13
            //&evl_uid=
            //&evl_uname=
            //&evl_fid=
            //&evl_fname=
            //&evl_first_dir=
            //&evl_second_dir=
            ['href',/\/official\/click\/redirect[^ ]*/],//顶部广告跳转
            ['class','activity_head '],//顶部广告文字


        ];
        //id="frs_list_pager"
        //class="pagination-default clearfix"

    }
    //******************
    //---------贴吧搜索
    //******************
    else if (url.includes('tieba.baidu.com/f/search')) {
        console.log('[广告去除] 贴吧搜索');
        names = [

            ['class','lu-search-box'],//右侧图片广告Class


        ];
    }
    //******************
    //---------贴吧个人主页
    //******************
    else if (url.includes('tieba.baidu.com/home')) {
        console.log('[广告去除] 贴吧个人主页');
        names = [

            ['id','lu-user-right'],//右侧图片广告Id
            ['id','lu-user-right-seat'],//右侧图片空白区域Id


        ];
    }
    //******************
    //---------贴吧其他
    //******************
    else {
        console.log('[广告去除] 贴吧其他');
        names = [
            ['id','notice_item'],//右侧公告板Id
            ['id','lu-home-aside'],//右侧图片广告Id

            ['class','app_download_box'],//右侧“扫二维码下载贴吧客户端”广告Class

        ];
    }



    //*************************************************************************************
    //----------------------------------------广告去除函数
    //*************************************************************************************
    function delAd(names) {
        if (names.length) {
            var flag = false;

            for (var name of names) {

                var tagType = name[0];
                var value = name[1];

                var elements = [];

                //属性内容正则
                if (value instanceof RegExp) {
                    var elementsZero = document.querySelectorAll(`[${tagType}]`);
                    elements = Array.from(elementsZero).filter(element => value.test(element.getAttribute(tagType)));
                }
                //只要存在属性
                else if (value === 'anything'){
                    elements = document.querySelectorAll(`[${tagType}]`);
                }
                //其他正常情况
                else{
                    elements = document.querySelectorAll(`[${tagType}="${value}"]`);
                }

                if (elements && elements.length) {
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
                    console.log(`[广告去除] ${name} 元素移除成功！`);
                    flag = true;
                } else {
                    //console.log(`[广告去除] 未发现 ${name} 元素！`);
                }
            }

            if (!flag) {
                //console.log("[广告去除] 未发现要移除的元素！");
            }
        } else {
            //console.log("[广告去除] 暂不支持此站点。");
        }
    }



    //*************************************************************************************
    //----------------------------------------广告去除
    //*************************************************************************************
    // 定义要运行的函数
    function runDelAd() {
        delAd(names);
    }

    var counter = 0; // 计数器变量
    var interval = setInterval(function() {
        runDelAd();
        counter++; // 每次执行时计数器加一
        if (counter === 100) { // 在达到指定次数后停止执行
            clearInterval(interval);
        }
    }, 50);

    // 每隔一秒运行一次函数
    setInterval(runDelAd, 1000);



})();