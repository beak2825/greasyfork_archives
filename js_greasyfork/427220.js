// ==UserScript==
// @name        哔哩哔哩视频播放禁止空格键翻页，滚动条滚动
// @namespace   https://greasyfork.org/zh-CN/scripts/427220-%E8%A7%86%E9%A2%91%E7%A6%81%E6%AD%A2%E7%A9%BA%E6%A0%BC%E9%94%AE%E7%BF%BB%E9%A1%B5
// @match        http*://www.bilibili.com/video/av*
// @match        http*://www.bilibili.com/video/BV*
// @match        http*://www.bilibili.com/watchlater/*
// @match        http*://www.bilibili.com/medialist/play/*
// @match        http*://www.bilibili.com/bangumi/play/ep*
// @match        http*://www.bilibili.com/bangumi/play/ss*
// @match        http*://bangumi.bilibili.com/anime/*/play*
// @match        http*://bangumi.bilibili.com/movie/*
// @match        http*://bangumi.bilibili.com/movie/
// @match        http*://www.iqiyi.com/v*
// @match        http*://v.qq.com/x/page/*
// @match        http*://v.qq.com/x/cover/*
// @match        http*://v.youku.com/v_show/id*
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @match        http*://
// @grant       none
// @version     1.0
// @author      wugeng
// @description 禁止视频播放时用空格键翻页，浏览器空格键禁止滚动条滚动。禁止视频播放时空格键滚动页面。可匹配哔哩哔哩，爱奇艺，优酷，腾讯视频。其他网站自行添加，和"网页解除限制(改)"可能有冲突。（这个改版的测试了不少网站无效eg:www.bimiacg.net，可以选择cat73原作正常使用）
// @downloadURL https://update.greasyfork.org/scripts/427220/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E7%A6%81%E6%AD%A2%E7%A9%BA%E6%A0%BC%E9%94%AE%E7%BF%BB%E9%A1%B5%EF%BC%8C%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427220/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E7%A6%81%E6%AD%A2%E7%A9%BA%E6%A0%BC%E9%94%AE%E7%BF%BB%E9%A1%B5%EF%BC%8C%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==
 document.body.onkeydown = function(event) {
        var e = window.event || event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
    }