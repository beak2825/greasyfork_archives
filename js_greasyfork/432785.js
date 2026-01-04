// ==UserScript==
// @name         新浪腾讯新闻查看全文+微博长文不关注看全文
// @version      0.2.6
// @description  让新浪新闻、腾讯新闻、it1352不需要展开或者下载APP直接看全文，微博长文不需要点击关注即可阅读全文，陆续支持更多网站中...
// @author       CWBeta
// @include      *zx.sina.cn*
// @include      *weibo.com/ttarticle*
// @include      *it1352.com*
// @include      *xw.qq.com*
// @icon         https://www.google.com/s2/favicons?domain=sina.cn
// @namespace    https://greasyfork.org/users/670174
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432785/%E6%96%B0%E6%B5%AA%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%2B%E5%BE%AE%E5%8D%9A%E9%95%BF%E6%96%87%E4%B8%8D%E5%85%B3%E6%B3%A8%E7%9C%8B%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/432785/%E6%96%B0%E6%B5%AA%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%2B%E5%BE%AE%E5%8D%9A%E9%95%BF%E6%96%87%E4%B8%8D%E5%85%B3%E6%B3%A8%E7%9C%8B%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("【新浪查看全文】运行中！")
    var wasWorking = false;
    function DisableHiding()
    {
        var isWorking = document.getElementById("SinaAutoDisableHiding") != null;
        if (isWorking)
        {
            return;
        }
        if( wasWorking && !isWorking)
        {
            console.log("【新浪查看全文】检测到对面试图干掉我，但是我预判了对面的预判，又干掉了对面。")
        }
        var style = document.createElement("style");
        style.type = "text/css";
        var cssString = ".arc-body-main,.s_card,.WB_editor_iframe_new,#article_body,.WB_editor_iframe_word {overflow:hidden !important; height:auto !important; max-height:99999999px !important;} #float-btn,.look_more,.look_more_a,.artical_add_box,.arc-body-main-more, #article_body .pictureBottomBtn, .collapseWrapper, #article_body .shareA, #article_body .mask, .landad-inner{display: none !important}"
        try
        {
            style.appendChild(document.createTextNode(cssString));
        }
        catch(ex)
        {
            style.styleSheet.cssText = cssString;//针对IE
        }
        style.setAttribute("id","SinaAutoDisableHiding");
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
        wasWorking = true;
    }
    setInterval(DisableHiding,1000);
    DisableHiding();
})();