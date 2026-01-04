// ==UserScript==
// @name         elecfans电子发烧网阅读全文优化
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  elecfans电子发烧网自动展开全文，去除部分广告。
// @author       萱萱的饭
// @match        www.elecfans.com/*
// @match        m.elecfans.com/*
// @match        bbs.elecfans.com/*
// @grant        none
// @note         20-07-11 0.16 新增 m.elecfans/* 的阅读全文、去除部分广告
// @note         20-07-12 0.17 新增 http://www.elecfans.com/yuanqijian/* 的阅读全文,去除d/*的部分广告
// @note         20-07-12 0.18 优化代码结构，优化 m.elecfans/* , 新增对/analog/* /rengongzhineng/* /news/* 展开全文，去除广告的支持
// @note         21-03-1 0.19 优化代码结构，优化 elecfans.com/dianzichangshi/* 展开全文
// @note         21-09-19 0.20 优化代码结构，新增对bbs的优化, 添加一波AOE 展开全文和去除广告，有可能会误伤
// @note         21-09-23 0.21 优化移动端
// @downloadURL https://update.greasyfork.org/scripts/404813/elecfans%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E7%BD%91%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/404813/elecfans%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E7%BD%91%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
   个人制作，用爱发电。如有不满，请多包含。 去除广告请配合 adblock plus 扩展插件使用（广告实在是太多了）
*/

"use strict";
/* 该网站使用的是ajax判断用户是否登陆
   如果未登录则缩起文章并添加上阅读全文按钮
*/

(function () {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let config = { attributes: true, childList: true }; //配置对象

    // bbs全局覆盖$不能用 用自己的$
    let $ = jQuery;

    let observerLogin;
    //当前网址
    let curURL = window.location.href;
    // 优化网址
    let main = /www\.elecfans\.com/;
    let bbs = /bbs\.elecfans\.com/;
    let yuanqijian = /www\.elecfans\.com\/yuanqijian/;
    let melec = /m\.elecfans\.com/;
    // 监听dom变化
    let loginTips = () => {
        //去除多余随机弹出的login
        observerLogin = new MutationObserver(function (mutations) {
            //构造函数回调
            mutations.forEach(function (record) {
                if (record.type == "childList" && $("div#remainLogBox").length !== 0) {
                    //监听dom节点
                    $("div#remainLogBox").remove();
                    $("html").css("overflow-y", "auto");
                }
            });
        });
        observerLogin.observe($("body")[0], config);
    };
    let extText = (type, times = 10) => {
        let loop = setInterval(() => {
            --times;
            if (times <= 0) {
                clearInterval(loop);
            }
            if ("m" === type) {
                $("div.limit_height").removeClass("limit_height");
                $("div.limit_height_computer").removeClass("limit_height_computer");
            } else {
                // 元器件 电子常识全文链接
                let aText = $("div.article-pagn > a:last-child");
                if (aText.length !== 0) {
                    window.location.href = aText[0].href; // 打开全文网址
                }

                $("div.simditor-body").css("height", "100%");
                $(".article-content").css("height", "100%");
                $("div.max-wImg").css("height", "100%");
                $(".seeHide").remove();
            }
        }, 150);
    };

    let adClean = (times = 10) => {
        let loop = setInterval(() => {
            --times;
            if (times <= 0) {
                clearInterval(loop);
            }
            /* 去广告 */
            // 主页
            $("#container > div.openx_place").remove();
            $("#bottombanner").remove();
            $(
                "#container > div.tow_page_focus > div.col_m > div.focus_m_list > a:nth-child(2) > div.openx_place"
            ).remove();
            $("div > div.col_r > div.openx_place").remove();
            $("body > div > div.openx_place").remove();
            $("body > div.site_footer").remove();
            $(".ad_ic1").remove();
            $(".mett_hot").remove();

            $("#banner_openx").remove();
            $("#topJf").remove();
            $("#ArticleAd").remove();
            $("#fixedRb").remove();
            $("#isShowVideoNext").remove();
            $("body > div.gather-bottom").remove(); //页脚
            $("body > section > article > div > div.article-list").remove(); // 比正文还多的推荐广告
            $("#pcb_site_about").remove();
            $("#sidebar-firstad-new").remove();
            $("#MiddleLeaderboard").remove();
            $("#company-ad").remove();
            $("#newListAdIc").remove();
            // 导航栏下方 系统广告
            $(".changeAd").remove();
            $(".pageNav").remove();
            $("#gg-04-openx-ad").remove();
            $(".recommend").remove();
            $("div.clearfix.code-content.mt24").remove();
            $(".gg-footer").remove();
            $(".dfma").remove();

            // 电子说  http://www.elecfans.com/d/* 去除广告
            //         http://www.elecfans.com/analog/* 去除广告
            //         http://www.elecfans.com/rengongzhineng/* 去除广告
            //         http://www.elecfans.com/news/* 去除广告
            $("#fix-tdkad").remove();
            $("#AD-background").remove();
            $(".aside").remove();
            // $("html body section.section div.clearfix").remove();
            $("div.col-sub").length != 0 && $("div.col-sub").remove();

            $(".footer_bannerAd").remove();
            $("html body section.section article.amain div.main-wrap iframe").remove();
            $("#new-middle-berry").remove();

            // 电子常识 http://www.elecfans.com/dianzichangshi/*
            $("html body.article-page div#header div.advertising.clearfix").remove();
            $("#AdArticleDetailTitle").remove();
            $(".company-ad").remove();
            $(".col-sub").remove();

            // 元器件 http://www.elecfans.com/yuanqijian/*
            $("#sidebar").remove(); // 侧边栏广告深度阅读
            $(".elecTop-mainBox").remove();
            $("#jf-arcMain-1").remove();
            $(".openx_ad_zone").remove();
            $("#page > div.gg.gg-04").remove();
            setTimeout(() => {
                $("#bdshare").remove(); // 分享
            }, 2000);
            // IC广告
            $('[id^="ic-ads"]').remove();

            //调整布局
            if (yuanqijian.test(curURL)) {
                $("#header").css("margin-bottom", "75px");
            } else {
                $("#header").css("margin-bottom", "5px");
            }
            $("div.main-wrap").css("margin-right", "0px");
            $("div.main-wrap").css("padding-right", "0px");
            $("div.main-wrap").css("border-right", "0px");
            $("div.main-wrap").css("margin-bottom", "20px");

            $("#mainContent").css("width", "100%");
            $("#arcInfo-bd").css("width", "100%");
            $("#arcInfo-bd").css("padding", "0px");
            $("#arcInfo-hd").css("width", "100%");
            $("#arcTag").css("width", "580px");
        }, 150);
    };

    let bbsClean = (times = 10) => {
        let loop = setInterval(() => {
            --times;
            if (times <= 0) {
                clearInterval(loop);
            }
            $("#sitefocus").remove();
            $("iframe").remove();
            $(".top_app_ad").remove();
        }, 100);
    };

    let mAdClean = (times = 10) => {
        let loop = setInterval(() => {
            --times;
            if (times <= 0) {
                clearInterval(loop);
            }
            $('[class^="open_app"]').remove();
            $(".go_elecfans").remove();
            $(".see_more_arc").remove();
        }, 100);
    };
    let f = () => {
        // www.elecfans.com   m.elecfans.com 展开全文
        if (main.test(curURL)) {
            // 展开全文
            extText("d");
            // 去除随机弹出的login
            loginTips();
            adClean();
        } else if (melec.test(curURL)) {
            // 展开全文
            extText("m");
            // 移动端特供
            mAdClean();
        } else if (bbs.test(curURL)) {
            // 去除杂质
            adClean();
            // bbs 特供
            bbsClean();
        }
    };

    $(f());
})();
