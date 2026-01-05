// ==UserScript==
// @name  禁止腾讯新闻自动播放视频
// @author      meng
// @version    1.0
// @description  禁止腾讯新闻自动播放视频（如gd.qq.com大粤网等地方新闻）
// @include      *.qq.com/*
// @exclude      *v.qq.com/*
// @note         支持 地方新闻等.qq.com
// @run-at       document-end

// @namespace https://greasyfork.org/users/26617
// @downloadURL https://update.greasyfork.org/scripts/22748/%E7%A6%81%E6%AD%A2%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/22748/%E7%A6%81%E6%AD%A2%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function(){

    if (/^http:\/\/.+\.qq\.com\/.+\.htm.*/.test(location.href) && document.querySelector('.rv-player'))
    {
        document.querySelector('.rv-root-v2').outerHTML="<span style=\"color:red;font-size:10px\">禁止腾讯新闻自动播放视频-【插件已屏蔽本视频】";
    }

})();