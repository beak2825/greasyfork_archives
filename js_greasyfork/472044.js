// ==UserScript==
// @name         【广告去除】百度百科
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  去除秒懂百科、去除页面底部的广告、去除右侧广告和TA说等；去除置灰默哀效果
// @author       You
// @match        *://baike.baidu.com/
// @match        *://baike.baidu.com/item/*
// @match        *://baike.baidu.com/search/*
// @match        *://baike.baidu.com/vbaike/*
// @match        *://baike.baidu.com/tashuo/*
// @match        *://baike.baidu.com/tashuolist/*
// @match        *://baike.baidu.com/history/*
// @match        *://baike.baidu.com/historydiff/*
// @match        *://baike.baidu.com/usercenter/userpage*
// @match        *://baike.baidu.com/planet/talk*
// @match        *://baike.baidu.com/platform/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472044/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/472044/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

// run-at       document-start


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
    //---------百度百科词条
    //******************
    if (url.includes('baike.baidu.com/item')) {
        console.log('[广告去除] 百度百科词条');
        names = [
            ['//*[@id="hotspotmining_s"]', "remove"],//概述下方TA说&新闻
            ['//*[@class="second-wrapper"]', "remove"],//词条名下方秒懂视频
            ['//*[@class="poster-middle"]', "remove"],//影视大图左下秒懂视频
            ['//*[@class="related-video-container J-related-video-container"]', "remove"],//信息栏下方秒懂视频
            ['//*[@class="lemmaWgt-promotion-slide"]', "remove"],//右侧秒懂百科贴图广告

            ["//a[contains(@class, 'btnItem_fJoc_') and contains(text(), '上传视频')]", "remove"],//上传视频按键
            ['//*[@class="edit-prompt"]', "remove"],//词条名下方编辑提示
            ['//div[@id="J-lemma-main-wrapper"]//div[@id="J-personal-auth"]', "remove"],//正文下方编辑提示

            ['//*[@class="unionAd union"]', "remove"],//右侧列表广告
            ['//*[contains(concat(" ", normalize-space(@class), " "), " new-bdsharebuttonbox ") and contains(concat(" ", normalize-space(@class), " "), " new-side-share ")]', "remove"],//右侧悬浮分享
            ['//*[contains(concat(" ", normalize-space(@class), " "), " right-ad ")]', "remove"],//右下悬浮知识专题

            ['//*[contains(concat(" ", normalize-space(@class), " "), " bottom-recommend-wrapper ")]', "remove"],//底部猜你喜欢
            ['//*[contains(concat(" ", normalize-space(@class), " "), " fc-guess-like ") and contains(concat(" ", normalize-space(@class), " "), " new-list ")]', "remove"],//底部相关搜索
            ['//*[contains(concat(" ", normalize-space(@class), " "), " relatedSearch_gAuve ")]', "remove"],//relatedSearch_gAuve
            ['//*[contains(@class, "relatedSearch_")]', "remove"],//relatedSearch_gAuve

            ['//*[contains(concat(" ", normalize-space(@class), " "), " tashuo-right ")]', "remove"],//右侧TA说
            ['//*[contains(@class, "slideAdBox_")]', "remove"],//右侧TA说
            ['//*[contains(concat(" ", normalize-space(@class), " "), " tashuo-bottom ")]', "remove"],//页面底部TA说

            ['//*[contains(concat(" ", normalize-space(@class), " "), " topA ")]', "remove"],//顶部搜索栏右侧活动入口
            ['//*[contains(concat(" ", normalize-space(@class), " "), " pinzhuanWrap ")]', "remove"],//页面底部品牌广告

            ['//*[contains(concat(" ", normalize-space(@class), " "), " item ") and contains(concat(" ", normalize-space(@class), " "), " appdownload ")]', "remove"],//顶部"下载百科APP"

            //这些其实不算广告，而是功能模块
            ['//*[contains(concat(" ", normalize-space(@class), " "), " lemma-structured ")]', "remove"],//概述下方相关星图
            ["//*[contains(@class, 'lemmaStructured_')]", "remove"],//概述下方
            ['//*[@id="J-lemma-human-relation"]', "remove"],//概述下方主要演员
            ['//*[@id="J-lemma-starmap"]', "remove"],//概述下方相关星图
            ['//*[contains(@class, "afterLargeFeature_")]', "remove"],//上方影视模块
            ['//*[contains(concat(" ", normalize-space(@class), " "), " graph-card ")]', "remove"],//信息栏下方百科图谱
            ['//*[@id="J-graph-card"]', "remove"],//信息栏下方百科图谱
            ['//*[contains(@class, "albumList_")]', "remove"],//页面下方词条图册

            //20231030新增
            ['//*[@id="J-lemma-video-list"]', "remove"],//信息栏下方视频
            ['//*[@id="J-bottom-recommend-wrapper"]', "remove"],//底部猜你喜欢
            ['//*[contains(@class, "appDownload_")]', "remove"],//右上APP广告
            ['//*[contains(@class, "contentBottom_")]', "remove"],//词条名下秒懂视频
            ['//*[contains(@class, "tashuoWrap_")]', "remove"],//ta说
            ['//*[@id="J-bottom-tashuo"]', "remove"],//ta说

            //手机端
            ['//*[@id="J-declare"]', "remove"],//顶部提醒
            ['//*[@id="qtqy_container"]', "remove"],//底部大家还在搜
            ['//*[@id="tashuo_list"]', "remove"],//底部他说
            ['//*[@id="J-lemma-videos"]', "remove"],//更多视频
            ['//*[@id="J-tashuo-button-fixed"]', "remove"],//右下TA说按钮
            ['//*[@id="J_yitiao_container"]', "remove"],//下方广告
            ['//div[@class="BK-after-content-wrapper"]/div/a[@onclick="page.Mixedor.mixedOpen(this,0)"]/..', "remove"],//下方广告


            ['//*[contains(concat(" ", normalize-space(@class), " "), " sw-383__scroll-image-box ") and contains(concat(" ", normalize-space(@class), " "), " sw-383__J-scroll-item ")]', "remove"],//底部他说
            ['//*[contains(concat(" ", normalize-space(@class), " "), " sw-136__lemma-attention ") and contains(concat(" ", normalize-space(@class), " "), " sw-136__no-title ")]', "remove"],
            ['//*[@id="_7152007"]', "remove"],

            //20231126
            ['//*[contains(@class, "rightAd_")]', "remove"],//右下悬浮
            ['//*[contains(@class, "index-module_drawerHand__")]', "remove"]//右侧活动广告

        ];
    }


    //******************
    //---------百度百科历史&历史对比
    //******************
    else if (url.includes('baike.baidu.com/history')) {
        console.log('[广告去除] 百度百科历史');
        names = [
            ['//*[@id="water-mark"]', "remove"],//水印，style过长不匹配了
        ];
    }


    //******************
    //---------百度百科搜索
    //******************
    else if (url.includes('baike.baidu.com/search')) {
        console.log('[广告去除] 百度百科搜索');
        names = [
            ['//*[@class and contains(concat(" ", @class, " "), " J-search-ad ")]', "remove"],
            ['//*[@class and contains(concat(" ", @class, " "), " ad-container ") and contains(concat(" ", @class, " "), " J-search-result-ad ")]', "remove"],
        ];
    }


    //******************
    //---------百度百科V百科
    //******************
    else if (url.includes('baike.baidu.com/vbaike')) {
        console.log('[广告去除] 百度百科V百科');
        names = [
            ['//*[contains(@id, "J-wgt-baikeapp-promote-")]', "remove"],//右下角APP二维码，例：J-wgt-baikeapp-promote-28d928c
            ['//*[contains(concat(" ", normalize-space(@class), " "), " wgt-baikeapp-promote-container ")]', "remove"],//右下角APP二维码
            ['//*[contains(concat(" ", normalize-space(@class), " "), " wgt-side-share ")]', "remove"],//右侧悬浮分享
        ];
    }


    //******************
    //---------百度百科TA说
    //******************
    else if (url.includes('baike.baidu.com/tashuo') || url.includes('baike.baidu.com/tashuolist')) {
        console.log('[广告去除] 百度百科TA说');
        names = [
            ['//*[@class="new-bdsharebuttonbox new-side-share"]', "remove"],//右侧悬浮分享
            ['//*[@id="side-share"]', "remove"],//右侧悬浮分享
        ];
    }


    //******************
    //---------百度百科用户主页
    //******************
    else if (url.includes('baike.baidu.com/usercenter/userpage')) {
        console.log('[广告去除] 百度百科用户主页');
        names = [
            ['//*[@class="navbarAdNew"]', "remove"],//主页顶部搜索栏右侧活动入口
            ['//*[@class="wgt-baikeapp-promote-container"]', "remove"],//主页右下角下载APP悬浮窗
        ];
    }

    //******************
    //---------百度百科科星球
    //******************
    else if (url.includes('baike.baidu.com/planet/talk')) {
        console.log('[广告去除] 百度百科科星球');
        names = [
            ['//*[@class="wgt-baikeapp-promote-container"]', "remove"],//主页右下角下载APP悬浮窗
        ];
    }

    //******************
    //---------百度百科电影视频
    //******************
    else if (url.includes('baike.baidu.com/platform')) {
        console.log('[广告去除] 百度百科电影视频');
        names = [
            ['//section[@class="J-ec-ads"]', "remove"], // 猜你关注
            ['//section[@class="J-ecfc-ads"]', "remove"], // 猜你关注
        ];
    }

    //******************
    //---------百度百科首页
    //******************
    else if (url.includes('baike.baidu.com/') && pathSegment === "") {
        console.log('[广告去除] 百度百科首页');
        names = [
            ['//*[@class="wgt-baikeapp-promote-container"]', "remove"],//主页右下角下载APP悬浮窗
            ['//*[@id="navbarAdNew"]', "remove"],//顶部搜索栏右侧活动入口
            ['//*[@class="navbarAdNew"]', "remove"],//顶部搜索栏右侧活动入口
        ];
    }

    //******************
    //---------通用
    //******************
    if (url) {
        console.log('[广告去除] 通用');
        names.push(...[
            // "//*[matches(@src, '')]"
            ["//*[contains(@src, 'pos.baidu.com')]", "remove"], // 通用
            ["//*[contains(@src, 'dup.baidustatic.com')]", "remove"], // 通用
            ["//*[contains(@src, 'cpro.baidustatic.com')]", "remove"], // 通用

            ["//*[contains(@src, 'c.gdt.qq.com')]", "remove"], // 通用
            ["//*[contains(@href, 'c.gdt.qq.com')]", "remove"], // 通用 - 注意：修正了拼写错误 @herf → @href

            ["//*[contains(@src, 'sina.cn/check?')]", "remove"], // 通用

            ["//*[contains(@src, 'googleads.g.doubleclick.net')]", "remove"], // 通用
            ["//*[contains(@src, 'pagead2.googlesyndication.com')]", "remove"], // 通用

            ["//*[contains(@class, 'appDownload_')]", "remove"], // 右上APP广告appDownload_OfsOt


            //src="https://qgnu18wo.sina.cn/check?src=https%3A%2F%2Fmjs.sinaimg.cn%2Fwap%2Fcustom_html%2Fwap%2F20230511%2F645c9e2002215.html%3Fpdps%3DPDPS000000067809"
            //blogbf
        ])
    }








    //*************************************************************************************
    //----------------------------------------广告去除函数
    //*************************************************************************************
    // XPath查询辅助函数 - 过滤掉已隐藏的元素
    function getElementsByXPath(xpath) {
        const result = [];
        const nodesSnapshot = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
            const element = nodesSnapshot.snapshotItem(i);

            // 检查元素是否已隐藏
            if (!isElementHidden(element)) {
                result.push(element);
            }
        }

        return result;
    }

    // 基本的隐藏检查，简化版本
    function isElementHidden(element) {
        if (!element || !(element instanceof Element)) {
            return true;
        }

        // 检查元素自身和父元素的显示状态
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none' ||
            computedStyle.visibility === 'hidden') {
            return true;
        }

        // 检查是否有隐藏的祖先元素
        let parent = element;
        while (parent && parent !== document.documentElement) {
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'none' ||
                parentStyle.visibility === 'hidden') {
                return true;
            }
            parent = parent.parentElement;
        }

        return false;
    }

    // 根据动作类型处理元素
    function processElementsByAction(elements, action, xpath) {
        elements.forEach((element, index) => {
            switch (action) {
                case "remove":
                    element.remove();
                    break;

                case "hide":
                    element.style.display = 'none';
                    break;

                case "mark":
                    element.setAttribute('data-processed', 'true');
                    break;

                case "disable":
                    element.disabled = true;
                    element.style.opacity = '0.5';
                    break;

                default:
                    console.warn(`[元素处理] 未知的动作类型: ${action}`);
                    return;
            }

            console.log(`[元素处理] 元素 ${index + 1}/${elements.length} (${xpath}) 执行 ${action} 成功`);
        });
    }


    function processElements(rules) {
        if (!rules || !rules.length) {
            console.log("[元素处理] 没有需要处理的规则");
            return;
        }

        let hasProcessed = false;

        rules.forEach(rule => {
            const [xpath, action] = rule;

            if (!xpath || !action) {
                console.warn("[元素处理] 规则格式错误，跳过处理", rule);
                return;
            }

            try {
                const elements = getElementsByXPath(xpath);

                if (!elements || elements.length === 0) {
                    return;
                }

                processElementsByAction(elements, action, xpath);
                hasProcessed = true;

            } catch (error) {
                console.error(`[元素处理] 处理规则失败: ${xpath}`, error);
            }
        });

        if (!hasProcessed) {
            console.log("[元素处理] 未发现需要处理的元素");
        }
    }




    //*************************************************************************************
    //----------------------------------------广告去除
    //*************************************************************************************
    // 定义要运行的函数
    function run() {
        processElements(names);
    }

    // 监听URL变化（兼容单页应用SPA）
    let lastUrl = location.href;

    // MutationObserver（推荐，监听SPA路由变化）
    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            run(); // URL变化后运行
        }
    });

    // 开始监听DOM变化
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    var counter = 0; // 计数器变量
    var interval = setInterval(function() {
        run();
        counter++; // 每次执行时计数器加1
        if (counter === 100) { // 在达到指定次数后停止执行
            clearInterval(interval);
        }
    }, 50);

    // 每隔一秒运行一次函数
    setInterval(run, 1000);



    //     setTimeout(function() {
    //         console.log('run()');
    //         run();
    //     }, 3000);


    //*************************************************************************************
    //----------------------------------------置灰去除
    //*************************************************************************************
    function delFilter() {


        //memorial
        //20231030新规则
        //var bodyElement = document.querySelector('body');

        // 移除原来的样式属性
        //if (bodyElement) {
        //bodyElement.removeAttribute('class');
        //}


        let box = document.getElementsByClassName('memorial');
        console.log(box);
        for (var i = 0; i < box.length; i++) {
            box[i].className = box[i].className.replace(/memorial/g, '');
        }

    }
    delFilter();

















})();