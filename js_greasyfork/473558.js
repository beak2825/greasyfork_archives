// ==UserScript==
// @name         【广告去除】新闻网站
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  去除网易新闻、百家号、腾讯新闻的广告
// @author       You
// @match        *://news.163.com/*
// @match        *://sports.163.com/*
// @match        *://money.163.com/*
// @match        *://auto.163.com/*
// @match        *://tech.163.com/*
// @match        *://mobile.163.com/*
// @match        *://hea.163.com/*
// @match        *://fashion.163.com/*
// @match        *://v.163.com/*
// @match        *://culture.163.com/*
// @match        *://travel.163.com/*
// @match        *://*.house.163.com/*
// @match        *://home.163.com/*
// @match        *://edu.163.com/*
// @match        *://jiankang.163.com/*
// @match        *://art.163.com/*
// @match        *://bendi.news.163.com/*
// @match        *://*.news.163.com/*
// @match        *://*.163.com/news/*
// @match        *://*.163.com/sports/*
// @match        *://ent.163.com/*
// @match        *://*.163.com/dy/*
// @match        *://*.163.com/ent/*
// @match        *://comment.tie.163.com/*

// @match        *://new.qq.com/*

// @match        *://news.sina.com.cn/*
// @match        *://finance.sina.com.cn/*
// @match        *://tech.sina.com.cn/*
// @match        *://k.sina.com.cn/*

// @match        *://*.sohu.com/a/*


// @match        *://*.china.com/*

// @match        *://*.huanqiu.com/*

// @match        *://*.1905.com/*

// @match        *://store.rg-adguard.net/

// @match        *://22.do/*
// @match        *://ask.zol.com.cn/*

// @exclude      *://tech.163.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=17173.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473558/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E6%96%B0%E9%97%BB%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/473558/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E6%96%B0%E9%97%BB%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==


/*
1.0更新内容
创建

1.1更新内容

*/

(function() {
    'use strict';

    //*************************************************************************************
    //----------------------------------------广告匹配规则
    //*************************************************************************************
    let url = window.location.href;
    let domain = document.domain;
    let pathSegment = window.location.pathname.split('/')[1]

    let names = [];


    //******************
    //---------网易新闻
    //******************
    if (domain.match(/(www|news|sports|ent|money|auto|tech|mobile|hea|fashion|v|culture|travel|house|home|edu|jiankang|art).163.com/)
        || (domain.match('163.com')
            && pathSegment.match(/(news|sports)/))
       ) {
        console.log('[广告去除] 网易新闻');
        //'anything'
        names = [
            ['class','ns_area area_column_ad channel_relative_2016 mod_js_ad'],//头部广告，通用
            ['class','post_area post_columnad_top'],//顶通
            ['data-adid',/\barticle_cms_column_[0-9]{1,2}\b/],//顶通
            ['class','ns_area second2016_top_ad channel_relative_2016 channel_relative_2016_lh'],//顶通
            ['class',/\b[^ ]*top_ad[^ ]*\b/],//顶部
            ['class',/\b[^ ]*mod_js_ad[^ ]*\b/],//顶部，area topad channel_relative_2016 mod_js_ad
            ['class',/\b[^ ]*advertisement[^ ]*\b/],//顶部
            ['id','js_ads_banner_top'],//顶部

            ['class','mod_ad_toutu channel_relative_2016'],//右侧文字广告
            ['class','rg_ad_text mb25 channel_relative_2016'],//右侧文字广告
            ['data-adid',/\bnews_index_column_[0-9]{1,2}\b/],//通用
            ['ad-location','anything'],//通用
            ['class',/\bmt[0-9]{1,2} mod_ad_[0-9]{1,2} mod_ad_r\b/],//右侧图片广告,mt27 mod_ad_8 mod_ad_r
            ['id',/\bssp_[0-9a-z]{7,10}\b/],//广告位：网易-内页矩形M1,ssp_7365610
            ['class',/\bblank[0-9]{1,2}\b/],//右侧
            ['data-adid',/\barticle_cms_right_[0-9]{1,2}\b/],//右侧，article_cms_right_2
            ['class',/\brg_ad mb[0-9]{1,2}\b/],//右侧严选广告
            ['class',/\bsports_shangxun_ad[0-9]{1,2}[^ ]*\b/],//AD 文字广告
            ['class',/\bchannel_ad_text_[0-9]{4}\b/],//AD 文字广告
            ['class',/\bimg_ad_[0-9]{3} mb[0-9]{1,2}[^ ]*\b/],//AD 广告图片300*250 +文字
            ['class',/\bad-wrapper underlive-ad[^ ]*\b/],//两侧
            ['class','ad'],//

            ['class','ns_side_qrcode'],//右侧APP二维码
            ['class','ns-side-qrcode'],//右侧APP二维码
            ['class','newsapp-qrcode'],//右侧APP二维码
            ['class','sidebar_qrcode'],//右侧APP二维码
            ['class','ntes-nav-mobile-title ntes-nav-entry-bgblack'],//顶部APP

        ];
    }


    //******************
    //---------网易号
    //******************
    else if (url.includes('163.com/dy')||url.includes('comment.tie.163.com')) {
        console.log('[广告去除] 网易号');
        names = [
            ['class','newsapp-qrcode'],//右侧APP二维码
            ['class','ntes-nav-mobile-title ntes-nav-entry-bgblack'],//顶部APP

            ['class','ad_module'],//右侧广告
            ['data-adid',/\barticle_dy_right_[0-9]{1}\b/],//右侧广告，article_dy_right_1
            ['data-adid',/\barticle_dy_column_[0-9]{1}\b/],//顶部广告，article_dy_column_1
            ['id',/\bssp_[0-9a-z]{7,10}\b/],//广告位：网易号--内页矩形M1,ssp_7365630

            ['id','top-banner'],//顶部
            ['id','ad-inner'],//右侧


        ];
    }

    //******************
    //---------腾讯网
    //******************

    else if (domain.includes('new.qq.com')) {
        console.log('[广告去除] 腾讯网');
        names = [
            //全屏

            //顶部
            ['id',/\b[Tt]{1}op[Aa]{1}d\b/],//顶部广告
            ['class',/\b[^ ]*widthAd[^ ]*\b/],//顶部广告

            //侧面
            ['id',/\badCon[0-9]{1,2}\b/],//夹杂广告
            ['id','focus-bar'],//右侧轮换
            ['class','focus-bar swiper-container-horizontal'],//右侧轮换
            ['dt-eid','em_ad'],//右侧图片
            ['data-role','hd-ad-adapter-interactivelayer'],//右侧视频
            ['data-role','creative-player-video-layer'],//右侧视频
            ['class','article-item ad-author-item'],//右侧
            ['id','pc_bot_author_ad'],//右侧
            //['class','pc_bot_hotlist_ad'],//右侧

            //底部
            ['class','g-bot-box'],//底部
            //['class','recommend-con'],//底部
            //['id','ArticleBottom'],//底部
            ['id','pic'],//底部

        ];
    }


    //******************
    //---------新浪新闻
    //******************
    else if (domain.match(/(news|finance|tech|k).sina.com.cn/)) {
        console.log('[广告去除] 新浪新闻');
        names = [
            ['id',/\bad_[0-9]{5}\b/],//顶部
            ['class','tb-left auto_switch'],//顶部
            ['class','tb-left'],//顶部空白


            ['class','blk-zcapp clearfix'],//正文底部
            ['data-sudaclick','ad_content_bottom'],//正文底部

            ['id',/\bBAIDU_SSP__wrapper_u[0-9]{7}_[0-9]{1}\b/],//侧面悬浮，BAIDU_SSP__wrapper_u6838895_0
            ['id',/\biframeu[0-9]{7}_[0-9]{1}\b/],//侧面悬浮
            ['name',/\biframeu[0-9]{7}_[0-9]{1}\b/],//侧面悬浮
            ['id',/\bsinaadToolkitBox[0-9]{1}\b/],//侧面悬浮
            ['class','side-btns-2w'],//侧面悬浮
            ['data-ad-pdps','anything'],//侧面文字
            ['class',/\bside-btns-answer[0-9]{4}\b/],//侧面悬浮
            ['class','right-bar-btn zc-app-btn'],//侧面APP
            ['id','sina-pages-u'],//
            ['class','yyy-wrap-2021'],//

            ['id','bgAdWrap'],//背景


        ];
    }

    //******************
    //---------搜狐
    //******************
    else if (url.includes('sohu.com/a/')) {
        console.log('[广告去除] 新浪号');
        names = [

            //全屏
            ['class','left-bottom-float-fullScreenSleepContainer'],//全屏弹窗

            //顶部
            //['id',/\bad_[0-9]{5}\b/],//顶部


            //侧面
            //['data-spm','left-author-card-ad'],//左侧悬浮
            ['id',/\bgoogle_ads_iframe_[^ ]*\b/],//左侧悬浮
            ['data-spm','ad-right-sponsor'],//右侧
            ['data-ad-status','filled'],//两侧悬浮
            ['id','god_fix_container'],//右侧悬浮
            ['class','right-fixed'],//右侧悬浮
            ['data-spm',/\bad-sq[0-9]{1}\b/],//两侧图片
            //['class','article-do article-do-fixed'],//左侧悬浮分享
            //['id','article-do'],//左侧悬浮分享
            ['data-spm','ad-ss'],//左下悬浮
            ['class','hot-article clear bord'],//右侧空白
            ['id','hot-news-container'],//右侧空白


            //底部
            ['class',/\bpublift-widget-[0-9]{11}-container\b/],//底部悬浮
            ['data-spm','middle-banner-ad'],//文章底部
            ['class','allsee-item clear bd-wrap'],//底部“大家都在看”夹杂
            ['data-spm','ad-text-bottom'],//底部“大家都在看”底部
            ['class','google-auto-placed'],//底部空白
            ['id',/\b[0-9a-z]{6,8}_\b/],//右侧“24小时推文”夹杂，其他夹杂

            //底部

            //背景
            ['id','bgAdWrap'],//背景

            //激进
            //['class','groom-read'],//文章底部推荐阅读
            ['class','news-list clear'],//文章底部推荐阅读

        ];

    }


    //******************
    //---------中国网
    //******************
    else if (domain.includes('china.com')) {
        console.log('[广告去除] 中国网');
        names = [
            //全屏悬浮
            ['id','plugin-newspush'],//底部

            //顶部
            ['id',/\bBAIDU_SSP__wrapper_u[0-9_]{9,11}\b/],//

            //正文
            ['id',/\bpicNewList_ad[0-9]{1,2}\b/],//
            ['class','listItem tt_xxl_L clearfix'],//
            ['id',/\bCH_MTL_[0-9]{5}\b/],//正文空白

            //侧面
            ['class','container'],//右侧
            ['src',/\b[^ ]*bd-china-2.appmobile.cn[^ ]*\b/],//右侧
            ['onmouseup',/\b[^ ]*mouseUpAd_JC[^ ]*\b/],//右侧
            ['class',/\bside_ads side_ads[0-9]{1,2}\b/],//左侧
            ['class','adcon margin_bot'],//右侧
            ['id',/\bnewsListJingcai_[0-9]{1}\b/],//右侧
            ['id',/\bmedia-[0-9]{1}-[0-9]{1}\b/],//左侧



            //底部
            ['id',/\bpicNewList_ad_[0-9]{1,2}_[0-9]{1,2}\b/],//底部大图
            ['id',/\bQIHOO__WEB__SO__[0-9_]{16,18}\b/],//底部大图


            //底部

            //背景

            //激进

        ];
    }

    //******************
    //---------环球网
    //******************
    else if (domain.includes('finance.huanqiu.com')) {
        console.log('[广告去除] 环球网');
        names = [
            //全屏悬浮
            ['id','next-box'],//右下

            //顶部

            //正文

            //侧面class="ad-content"
            ['class','ad-content'],//右侧
            ['__attr__id','anything'],//右侧

            //底部
            ['class','feed-item feed-other'],//底部夹杂
            ['class',/\bmediav-newsfeed-listitem-ads_[0-9]{1}\b/],//底部夹杂


            //底部

            //背景

            //激进

        ];
    }

    //******************
    //---------1905
    //******************
    else if (domain.includes('1905.com')) {
        console.log('[广告去除] 1905电影网');
        names = [
            //全屏悬浮
            ['id','next-box'],//右下

            //顶部

            //正文
            ['class','mdb-ad'],

            //侧面class="ad-content"
            ['class','ad ad-content bottom'],//右侧
            ['id',/\badjs_[0-9]{5}\b/],//右侧adjs_32001

            //底部



            //底部

            //背景

            //激进

        ];
    }

    //******************
    //---------通用-接口广告
    //******************
    if (url) {
        console.log('[广告去除] 通用-接口广告');
        names.push(...[
            ['src',/\b[^ ]*pos.baidu.com[^ ]*\b/],//通用
            ['src',/\b[^ ]*dup.baidustatic.com[^ ]*\b/],//通用
            ['src',/\b[^ ]*cpro.baidustatic.com[^ ]*\b/],//通用

            ['src',/\b[^ ]*c.gdt.qq.com[^ ]*\b/],//通用
            ['herf',/\b[^ ]*c.gdt.qq.com[^ ]*\b/],//通用

            ['src',/\b[^ ]*sina.cn\/check\?[^ ]*\b/],//通用

            ['src',/\b[^ ]*googleads.g.doubleclick.net[^ ]*\b/],//通用
            ['src',/\b[^ ]*pagead2.googlesyndication.com[^ ]*\b/],//通用


            //src="https://qgnu18wo.sina.cn/check?src=https%3A%2F%2Fmjs.sinaimg.cn%2Fwap%2Fcustom_html%2Fwap%2F20230511%2F645c9e2002215.html%3Fpdps%3DPDPS000000067809"
            //blogbf
        ])
    }








    //*************************************************************************************
    //----------------------------------------其他提升可读性的操作
    //*************************************************************************************
    function doOtherThing() {


        //******************
        //---------搜狐
        //******************
        if (url.includes('sohu.com/a/')) {

            //展开文章
            //lookall-box
            //lookall-box control-hide
            var openA = document.querySelector('div[class="lookall-box"]');
            if (openA) {
                openA.setAttribute("class", "lookall-box control-hide");
            }
            //hidden-content control-hide
            //hidden-content
            var openB = document.querySelector('div[class="hidden-content control-hide"]');
            if (openB) {
                openB.setAttribute("class", "hidden-content");
            }

            //显示来源作者
            var comeUrl = document.querySelector('span[data-role="original-link"]');
            if (comeUrl) {
                comeUrl.setAttribute("data-role", "");
            }
        }





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
        //console.log("[广告去除] names："+names);
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
    setInterval(doOtherThing, 1000);



})();
