// ==UserScript==
// @name                CSDN优雅美化脚本-免登陆+旧版两栏+屏宽自动适配+自动展开+去广告
// @name:zh-CN          CSDN优雅美化脚本-免登陆+旧版两栏+屏宽自动适配+自动展开+去广告
// @description         还你一个经典版的CSDN：作者信息和顶部导航栏保留，去掉右边评论区；内容自动展开；去广告；屏宽自动适配；净化剪贴板。
// @description:zh-TW   還你一個經典版的CSDN：作者信息和頂部導航欄保留，去掉右側評論區；內容自動展開；去廣告；屏寬自動適配；淨化剪貼板。
// @description:zh-HK   還你一個經典版的CSDN：作者信息和頂部導航欄保留，去掉右側評論區；內容自動展開；去廣告；屏寬自動適配；淨化剪貼板。
// @description:zh-CN   还你一个经典版的CSDN：作者信息和顶部导航栏保留，去掉右边评论区；内容自动展开；去广告；屏宽自动适配；净化剪贴板。

// @namespace    https://github.com/z1064244797/CSDN-Beautify
// @version      2.9.7
// @author       Nyaasu
// @match        http*://blog.csdn.net/*/article/details/*
// @match        http*://csdnnews.blog.csdn.net/article/details/*
// @run-at       document-end
// @grant        none
// @license      CC-BY-NC-3.0
// @supportURL   https://github.com/z1064244797/CSDN-Beautify/issues
// @date         08/11/2022
// @downloadURL https://update.greasyfork.org/scripts/373974/CSDN%E4%BC%98%E9%9B%85%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC-%E5%85%8D%E7%99%BB%E9%99%86%2B%E6%97%A7%E7%89%88%E4%B8%A4%E6%A0%8F%2B%E5%B1%8F%E5%AE%BD%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%2B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373974/CSDN%E4%BC%98%E9%9B%85%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC-%E5%85%8D%E7%99%BB%E9%99%86%2B%E6%97%A7%E7%89%88%E4%B8%A4%E6%A0%8F%2B%E5%B1%8F%E5%AE%BD%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%2B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // CSS （用魔法来打败魔法）
    const style = document.createElement('style');
    style.innerHTML = `
    .passport-login-container {
        display: none;
    }

    #groupfile {
        max-height: 80%;
    }

    #footerRightAds {
        display: none;
    }

    main {
        float: none;
        margin: 0 auto;
    }

    #passportbox {
        display: none;
    }

    .login-mark {
        display: none;
    }

    .toolbar-btn-vip {
        display: none;
    }

    .csdn-common-logo-advert {
        display: none;
    }

    .icon-fire {
        display: none !important;
    }

    #toolbar-search-input {
        text-indent: 16px !important;
    }

    body {
        min-width: 0;
    }

    img[src="https://img-home.csdnimg.cn/images/20220805045438.png"] {
        display: none;
    }
    
    .icon-mp-menu {
        display: none;
    }

    #recommendNps {
        display: none !important;
    }
    `;
    document.head.appendChild(style);
    resize();
    //未登录复制代码限制
    $('code').css({'user-select':'unset'})
    $('#content_views pre').css({'user-select':'unset'})
    //阅读全文
    $('.hide-article-box').remove();
    $('#article_content').css({
        'height': 'initial'
    });
    //vip免广告 按钮
    // $('.meau-gotop-box').remove();
    //未登录提示
    // $('.unlogin-box').remove();
    //去除剪切板劫持
    csdn.copyright.init("", "", "");
    //移除左侧最新评论
    // $('#asideNewComments').remove();
    //移除左侧CSDN联系方式
    // $('.persion_article').remove();
    //移除右侧工具栏
    // $('.tool-box').remove()
    //下部推荐
    // $('.recommend-box').remove();
    //两栏处理
    $('.blog_container_aside').remove();
    // $('.nodata .container').css({'width':'1318px !important'})
    // $('.nodata .tool-box .meau-list .btn-like-box p').css({'display': 'block'})
    // $('.recommend-right').css({'display':'none'})
    // $('.container').css({'width':'1318px'})
    // $('.container main').css({'width': '1010px'})
    // $('.container main .recommend-box .type_blog .content .desc').css({'width': '81%'})
    // $('.container main .recommend-box .type_blog .content .blog_title_box').css({'width': '18%'})
    // $("#mainBox > main").css("float","left");  //感谢 ID:potoo 的反馈
    // $("aside").css("float","right");
    // $("aside").css("padding-left","10px");
    // $('body').css({'min-width':'0'});
    // $('.csdn-toolbar').css({'min-width':'0'});
    //去广告
    // $('.pulllog-box').remove();
    // $('.fourth_column').remove();
    // $('.mb8').remove();
    // $('newsfeed').remove();
    // $('#asideFooter').remove();
    $("li:contains('VIP会员')").remove();
    $("#health-companies").remove();
    // $('.light-box').remove();
    // $("a[data-type='vip']").remove();
    // $(".csdn-side-toolbar").remove();
    // $(".vip-caise").remove();
    // $('.csdn-tracking-statistics').remove();
    $('#addAdBox').remove();
    $('#recommendAdBox').remove();
    setTimeout(() => {
        $('[data-title="登录后复制"]').remove();
        resize();
    }, 800)
    // 屏宽适配

    function resize() {
        var result1 = window.matchMedia('(min-width:1220px)');
        var result2 = window.matchMedia('(min-width:1020px)');
        if (result1.matches) {
            console.log("大屏宽，恢复原样式");
            $("aside").css({
                'display': 'block'
            });
            $("main").css({
                "width": "1110px",
            });
            $('.container').css({
                'width': '1418px'
            })
            $(".main_father").css({
                "width": "100%",
                "cssText": "justify-content: center !important",
            });
            $("#mainBox").css("margin-left", "8px");
            $("#csdn-toolbar").css("display", "block");
        } else if (result2.matches) {
            console.log("中屏宽，减小mainBox宽度");
            $("aside").css({
                'display': 'block'
            });
            $('.container').css({
                'width': '1008px'
            })
            $("main").css({
                "width": "970px",
            });
            $(".main_father").css({
                "width": "1070px",
                "cssText": "justify-content: center !important",
            });
            $("#mainBox").css("margin-left", "8px");
            $("#csdn-toolbar").css("display", "block");
        } else {
            console.log("小屏宽，隐藏右侧信息栏，mainBox居中");
            $("aside").css({
                'display': 'none'
            });
            $('.container').css({
                'width': '820px'
            });
            $("main").css({
                "width": "800px",
            });
            $(".main_father").css({
                "width": "1010px",
                "cssText": "justify-content: left !important",
                "padding-left": "0",
            });
            $(".btns").css("float", "right");
            $(".csdn-toolbar > div").css("width", "870px");
            $("#mainBox").css("margin-left", "0");
            $("#csdn-toolbar").css("display", "none");
            
        }
    }
    window.addEventListener('resize', function () {
        resize();
    });
    // //显示评论区
    // $('.comment-list-box').css({'display':'block'});
    // $('.comment-list-box').css({'max-height':'870px'});
})();
