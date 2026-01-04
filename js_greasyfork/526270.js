// ==UserScript==
// @name         Filter Comics in 18comic Search
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在18comic中过滤含有特定标签的漫画
// @match        *://18comic.vip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526270/Filter%20Comics%20in%2018comic%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/526270/Filter%20Comics%20in%2018comic%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var debug = false;
    var deleteAds = true; // not implemented

    // 额外功能: 去除首页的右侧男同广告
    const elements = document.querySelectorAll('.web-right-float-button');
    console.log(elements);
    elements.forEach(el => el.style.display = 'none');

    // 页面加载完成后执行
    window.addEventListener('load', async function() {
        if (debug) console.log('进入函数');

        // 额外功能: 去除首页的右侧男同广告
        //const elements = document.querySelectorAll('.web-right-float-button');
        //console.log(elements);
        //elements.forEach(el => el.style.display = 'none');

        // 不想要的标签数组
        const unwantedTags = ['yaoi', 'YAOI', '伪娘', '偽娘', '扶她', '扶他', '皮物', '男娘', '人妖', 'yoai'];
        const albumsPattern = '*://18comic.vip/albums*';
        const searchPattern = '*://18comic.vip/search/photos?*';
        const albumPattern = '*://18comic.vip/album/*';
        const photoPattern = '*://18comic.vip/photo/*';

        function isMatch(url, pattern, standardRegex=false) {
            if (!standardRegex) {
                // 移除模式中的通配符*
                pattern = pattern.replace(/\*/g, '.*');
            }
            // 创建正则表达式对象，并确保它匹配整个字符串
            const regex = new RegExp('^' + pattern + '$');
            return regex.test(url);
        }

        const currentUrl = window.location.href;
        if (isMatch(currentUrl, albumsPattern) || isMatch(currentUrl, searchPattern)) {
            if (isMatch(currentUrl, searchPattern)){
                console.log("本页面是搜索页");
            } else {
                console.log("本页面是'更多'页");
            }
            // 获取所有的comic元素
            let comics = document.querySelectorAll('#wrapper > .container > .row > div > .row > div');
            console.log("找到"+comics.length+"本漫画");

            comics.forEach(comic => {
                // 漫画标题
                let title = comic.querySelector('div > .video-title.title-truncate.m-t-5').textContent;
                console.log('正在处理: 《' + title + '》');

                // 获取comic中的所有标签
                let tagsInComic = comic.querySelectorAll('div > .tags > a.tag');

                // 遍历每个标签，检查是否包含不想要的标签
                for (let tag of tagsInComic) {
                    if (unwantedTags.includes(tag.textContent)) {
                        console.log('发现不要的标签: '+tag.textContent);
                        // 如果有不想要的标签，移除整个comic元素
                        comic.remove();
                        console.log('====删除了《'+ title+ '》, 页面又干净了一点====');
                        break; // 退出循环，避免重复删除
                    }
                }
            });
        }
        else if (isMatch(currentUrl, albumPattern) || isMatch(currentUrl, photoPattern)){
            if (isMatch(currentUrl, albumPattern)){
                console.log("本页面是详情页");
            } else if (isMatch(currentUrl, photoPattern)){
                console.log("本页面是图片页");
            }

            console.log("等待详情页加载...");
            let relevantComics = null;
            let maxWaitTime = 30000; // 30s = 30000ms
            let timeoutReached = false;
            let waiter = null;
            waiter = setInterval(() => { // wait for relevantComics
                relevantComics = document.querySelector('#wrapper > .container > .tab-content > .tab-pane > .row > .owl-loaded');
                if (relevantComics) {
                    clearInterval(waiter);
                    let comics = document.querySelectorAll('#wrapper > .container > .tab-content > .tab-pane > .row > .owl-loaded > .owl-stage-outer > .owl-stage > .owl-item');
                    console.log("找到"+comics.length+"本漫画");
                    comics.forEach(comic => {
                        // 漫画标题
                        let title = comic.querySelector('div > .video-title.title-truncate.m-t-5').textContent;
                        if (debug) console.log('正在处理: 《' + title + '》');

                        // 获取comic中的所有标签
                        let tagsInComic = comic.querySelectorAll('div > .tags > a.tag');

                        // 遍历每个标签，检查是否包含不想要的标签
                        for (let tag of tagsInComic) {
                            if (unwantedTags.includes(tag.textContent)) {
                                console.log('发现不要的标签: '+tag.textContent);
                                // 如果有不想要的标签，移除整个comic元素
                                comic.remove();
                                console.log('====删除了《'+ title+ '》, 页面又干净了一点====');
                                break; // 退出循环，避免重复删除
                            }
                        }
                    });
                }
            });
            setTimeout(() => {timeoutReached = true;}, maxWaitTime);

            if (timeoutReached) {
                console.error("相关漫画未正常加载");
                return;
            }
        }

        if (debug) console.log('退出函数');
    }, false);
})();