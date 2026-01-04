// ==UserScript==
// @name        【知乎优化助手】屏蔽知乎广告、其他功能优化
// @description 这个脚本，能屏蔽掉知乎网页版的时间线上的部分广告，和网页版右侧的广告。这个脚本短期内我会继续更新，优化网页版知乎，增加更多的辅助功能，让大家更高效的使用知乎。联系方式：微博：@创客星辰，微信：makersky1688，邮箱：makersky1688@163.com
// @namespace   https://greasyfork.org/zh-CN/scripts/410221
// @author      创客星辰
// @match       *://*.zhihu.com/*
// @require     https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant       none
// @version     1.0
// @icon        https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.67c7b278.png
// @description 2020/8/30 上午11:19:18
// @downloadURL https://update.greasyfork.org/scripts/410221/%E3%80%90%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B%E3%80%91%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E3%80%81%E5%85%B6%E4%BB%96%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/410221/%E3%80%90%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B%E3%80%91%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E3%80%81%E5%85%B6%E4%BB%96%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    setTimeout(function delzhihuad(){
      console.log("程序执行");
      //通过浏览器的控制台查看这个屏蔽知乎广告的函数有没有执行
      $(".Pc-feedAd-container ").parent().hide();
      //屏蔽时间线上的广告
      $(".Banner-link").parent().hide();
      //屏蔽右侧的广告
    },3000);
})();

