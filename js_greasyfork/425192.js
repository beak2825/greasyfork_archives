    // ==UserScript==
    // @name         防止访问360网站
    // @namespace    阿尔斯神-aerss
    // @version      2.1.0
    // @description  珍爱电脑，远离360！
    // @author       阿尔斯神
    // @match        https://www.360.cn/
    // @match        https://www.360.cn/*
    // @match        https://soft.360.cn/
    // @match        https://soft.360.cn/*
    // @match        https://sd.360.cn/
    // @match        https://sd.360.cn/*
    // @match        https://browser.360.cn/
    // @match        https://browser.360.cn/*
    // @match        http://weishi.360.cn/
    // @match        http://weishi.360.cn/*
    // @match        https://dl.360safe.com/
    // @match        https://dl.360safe.com/*
    // @match        https://dl.360safe.com/360sd/*
    // @match        https://down.360safe.com/offline/*
    // @match        https://down.360safe.com/offline/
    // @match        https://www.so.com/
    // @match        https://www.so.com/*
    // @match        http://www.ludashi.com/
    // @match        http://www.ludashi.com/*
    // @match        https://down.360safe.com/*
    // @match        https://down.360safe.com/
    // @match        http://www.51xiazai.cn/*
    // @match        http://www.51xiazai.cn/
    // @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019cab56b1c61c6ac7256cb09ca222.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621315556&t=69f2470745304f82dcdde2826d0124d6
// @downloadURL https://update.greasyfork.org/scripts/425192/%E9%98%B2%E6%AD%A2%E8%AE%BF%E9%97%AE360%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/425192/%E9%98%B2%E6%AD%A2%E8%AE%BF%E9%97%AE360%E7%BD%91%E7%AB%99.meta.js
    // ==/UserScript==
    (function() {
        'use strict';
            let url = window.location.href;
            url = url.replace('http://www.51xiazai.cn/*');
            url = url.replace('https://down.360safe.com/*');
            url = url.replace('https://down.360safe.com/');
            url = url.replace('http://www.ludashi.com/*');
            url = url.replace('http://www.ludashi.com/');
            url = url.replace('https://www.so.com/*');
            url = url.replace('https://www.so.com/');
            url = url.replace('https://down.360safe.com/offline/');
            url = url.replace('https://down.360safe.com/offline/*');
            url = url.replace('https://dl.360safe.com/360sd/');
            url = url.replace('https://dl.360safe.com/360sd/*');
            url = url.replace('https://dl.360safe.com/');
            url = url.replace('https://dl.360safe.com/*');
            url = url.replace('http://weishi.360.cn/');
            url = url.replace('http://weishi.360.cn/*');
            url = url.replace('https://browser.360.cn/');
            url = url.replace('https://browser.360.cn/*');
            url = url.replace('https://sd.360.cn/');
            url = url.replace('https://sd.360.cn/*');
            url = url.replace('https://soft.360.cn/');
            url = url.replace('https://soft.360.cn/*');
            url = url.replace('https://www.360.cn/');
            url = url.replace('https://www.360.cn/*');
            url = url.replace('https://hao.360.com/*');
            url = url.replace('https://hao.360.com/');
            url = url.replace('http://www.mydown.com/jhfl/360/*');
            url = url.replace('http://www.mydown.com/jhfl/360/');
            url = url.replace('http://www.mydown.com*');
            url = url.replace('http://www.mydown.com');
            url = url.replace('');
            window.location.replace("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019cab56b1c61c6ac7256cb09ca222.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621315556&t=69f2470745304f82dcdde2826d0124d6");
     
       }
     
    )();
     