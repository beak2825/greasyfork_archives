// ==UserScript==
// @name         CSDN 工具箱
// @namespace    http://z.houbin.site/csdn/
// @version      0.6
// @description  过滤CSDN 广告,包括 博客,论坛,问答,首页和搜索,博客自动展开-阅读更多(csdn.net),去掉博客版权复制信息,论坛查看全部
// @author       z.houbin
// @match        *://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371858/CSDN%20%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/371858/CSDN%20%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    switch (window.location.hostname) {
        case 'bbs.csdn.net':
            bbs_csdn_net();
            break;
        case 'download.csdn.net':
            download_csdn_net();
            break;
        case 'ask.csdn.net':
            ask_csdn_net();
            break;
        case 'www.csdn.net':
            www_csdn_net();
            break;
        case 'blog.csdn.net':
            blog_csdn_net();
            break;
        case 'so.csdn.net':
            so_csdn_net();
            break;
        default:
            loadStyle('.J_adv{display:none !important} ');
            break;
    }

    //去掉版权信息
    document.addEventListener("copy", function (e) {
        console.log('copy');
        var data = e.clipboardData;
        var text = data.getData('text');
        var pos = text.indexOf('————————————————');
        if (pos !== -1) {
            text = text.substring(0, pos - 2);
            data.setData('text', text);
        }
    });

    function so_csdn_net() {
        console.log('so_csdn_net');
        loadStyle('.yd_a_d_so{display:none !important} .rightadv{display:none}');
    }

    function blog_csdn_net() {
        console.log('blog_csdn_net');
        loadStyle(".type_hot_word{display:none !important} .blog-expert-recommend-box{display:none !important} iframe[src*='pos.baidu.com']{display:none !important} .J_adv{display:none !important} .recommend-ad-box{display:none} .mb8{display:none} .bdsharebuttonbox{display:none} .p4course_target{display:none !important} newsfeed{display:none !important} .pulllog-box{display:none !important} #adAways{display:none} .btn-remove{display:none !important}");

        //展开全文
        $("#article_content").removeAttr("style");
        //展开全文
        $(".hide-article-box").remove();
        //二维码
        $("#asideFooter").remove();
        //推荐文章
        $(".recommend-box").remove();
        //最新评论
        $("#asideNewComments").remove();
        //热门文章
        $("#asideHotArticle").remove();
        //最新文章
        $("#asideNewArticle").remove();
        //归档
        $("#asideArchive").remove();
        //评论框
        $(".comment-box").remove();


        //首页
        //二维码
        $(".persion_article").remove();
        //广告
        $(".right_extension").remove();
        //博客专家
        $(".feed_media_list").remove();
        $('body > div.container.clearfix > div > aside > div:nth-child(2)').remove()
    }

    function www_csdn_net() {
        console.log('www_csdn_net');
        loadStyle('.J_adv{display:none !important} .right_top{display:none}');
    }

    function ask_csdn_net() {
        console.log('ask_csdn_net');
        loadStyle('.ask_feed_ad_box{display:none !important}');
    }

    function download_csdn_net() {
        console.log('download_csdn_net');
        loadStyle('.J_adv{display:none}  .dl_mar{display:none} #_yd_ad_1{display:none !important} #_yd_ad_2{display:none !important} #_yd_ad_3{display:none !important} .newsfeed{display:none !important} .ad_wrap{display:none}');
        $('iframe').remove();
        $('.pull-right').remove();
        $('.download_r').remove();
    }

    function bbs_csdn_net() {
        console.log('bbs_csdn_net');
        //本周牛人
        $('body > div.csdn_bbs_main.pad_left > div.bbs_main_wrap > div.bbs_left_wrap.fl > div:nth-child(2)').remove();
        $('.totast-box').remove();
        $('.right-box').remove();
        $('.post_recommend').remove();

        //论坛首页 J_adv
        //登录注册 pulllog-box
        //主贴下广告 bd_ad_2
        //CSDN推荐 相关推荐
        var mod_topic_wraps = document.getElementsByClassName('mod_topic_wrap');
        for (var i = 0; i < mod_topic_wraps.length; i++) {
            if (mod_topic_wraps[i].className == 'mod_topic_wrap') {
                mod_topic_wraps[i].style = 'display:none';
            }
        }
        //回帖广告 mediav_ad
        //相关推荐广告 bbs_feed_ad_box
        loadStyle('.bbs_feed_ad_box{display:none} .mediav_ad{display:none} #bd_ad_2{display:none !important} .pulllog-box{display:none !important} .J_adv{display:none}');

        //删除百度脚本
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            //console.log(i + "," + src);
            if (src != null && src.indexOf('baidu') != -1) {
                scripts[i].parentElement.removeChild(scripts[i]);
            }
        }
        //查看全部
        document.getElementsByClassName('show_topic js_show_topic')[0].click();
    }

    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(css));
        //for IE
        //style.styleSheet.cssText = code;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})();