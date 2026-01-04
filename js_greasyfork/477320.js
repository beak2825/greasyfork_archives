// ==UserScript==
// @name         隐藏不想看到的页面元素等
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  1:屏蔽知乎搜索结果列表，知乎文章，知乎评论，知乎专栏中的图片和购物广告链接。2:屏蔽简书部分广告推荐。
// @author       You
// @match        *://*.52pojie.cn/*
// @match        *://*.jianshu.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52pojie.cn
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/477320/%E9%9A%90%E8%97%8F%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477320/%E9%9A%90%E8%97%8F%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏
    function hideEls(){
        // 52评论区左侧头像
        var els_52 = document.getElementsByClassName("avtm");
        // 简书技术文章右侧热点推荐短文小说
        var els_jianshu = document.getElementsByClassName("_3Z3nHf");
        // 知乎文章滚动时动态显示的标题
        var els_zhihu_tip = document.getElementsByClassName("PageHeader");
        // 知乎文章中的图片
        var els_zhihu_pics = document.getElementsByTagName("picture");
        var els_zhihu_imgs = document.getElementsByTagName("figure");
        var els_zhihu_title_imgs = document.getElementsByClassName("RichContent-cover");
        // 知乎文章中的动图
        var els_zhihu_gifs = document.getElementsByClassName("ztext-gif");
        // 知乎评论中的图片
        var els_zhihu_comment_imgs = document.getElementsByClassName("comment_img");
        // 知乎文章中的带货链接
        var ads = document.getElementsByClassName("RichText-MCNLinkCardContainer");

        var delElsArr = [
            els_zhihu_tip,
            els_zhihu_pics,
            els_zhihu_imgs,
            els_zhihu_title_imgs,
            els_zhihu_comment_imgs,
            els_zhihu_gifs,
            ads,
        ];

        delElsArr.forEach((els) => {
            [...els].forEach((el) => {
                 // el.style.visibility = "hidden";
               el.style.display = "none";
            })
        })

        for (let i=0; i<els_52.length; i++)
        {
            els_52[i].style.opacity = "0.2";
        }

        for (let i=0; i<els_jianshu.length; i++)
        {
            if(i === 1) els_jianshu[i].style.display = "none";
        }

        setTimeout(function() { hideEls(); }, 500);
    }

    hideEls();
})();