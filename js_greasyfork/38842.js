// ==UserScript==
// @name         博客阅读美化（去广告|自动全文|简洁）
// @namespace    http://www.csdn.net/
// @icon         https://favicon.yandex.net/favicon/csdn.net
// @version      1.2.16-20180429
// @description  去广告；布局及格式优化；优化内容推荐展示样式；图片居中；删除空段落；|CSDN|自动阅读全文；去除首行缩进；支持MathJax;|51脚本|SegmentFault|W3cschool|。（修改自新版CSDN阅读体验提升）
// @author       zhuzhuyule
// @license      GPL version 3
// @match        http://blog.csdn.net
// @match        https://blog.csdn.net/*
// @match        https://bbs.csdn.net/*
// @match        http://so.csdn.net/*
// @match        https://www.csdn.net
// @match        http://www.csdn.net/*
// @match        https://download.csdn.net
// @match        http://download.csdn.net/*
// @match        http://www.jb51.net/*
// @match        https://www.jb51.net/*
// @match        https://segmentfault.com/*
// @match        https://www.w3cschool.cn/*
// @match        https://www.liaoxuefeng.com/*
// @grant        none
// @run-at       document-body
// @note         v1.2.14     CSDN改版，及名称简化
// @note         v1.2.15     新增 廖雪峰 个人博客 广告过滤 https://www.liaoxuefeng.com/*
// @note         v1.2.16     CSDN隐藏显示更多按钮,新增CSDN多页面广告

// @downloadURL https://update.greasyfork.org/scripts/38842/%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E7%BE%8E%E5%8C%96%EF%BC%88%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%7C%E7%AE%80%E6%B4%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/38842/%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E7%BE%8E%E5%8C%96%EF%BC%88%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%7C%E7%AE%80%E6%B4%81%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //初始化一个 document.ready 事件
    (function () {
        var ie = !!(window.attachEvent && !window.opera);
        var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
        var fn = [];
        var run = function () {
            for (var i = 0; i < fn.length; i++) fn[i]();
        };
        var d = document;
        d.ready = function (f) {
            if (!ie && !wk && d.addEventListener)
                return d.addEventListener('DOMContentLoaded', f, false);
            if (fn.push(f) > 1) return;
            if (ie)
                (function () {
                    try {
                        d.documentElement.doScroll('left');
                        run();
                    }
                    catch (err) {
                        setTimeout(arguments.callee, 0);
                    }
                })();
            else if (wk)
                var t = setInterval(function () {
                    if (/^(loaded|complete)$/.test(d.readyState)) {
                        clearInterval(t);
                        run();
                    }
                }, 0);
        };
    })();

    //------------------------------------------------------------------------------------------
    // 文档载入成功后开始执行
    try {
        if ( location.host.indexOf('csdn.net') > -1) {
            dealCSDN();
        } else if ('www.jb51.net' == location.host) {
            dealJb51();
        } else if ('segmentfault.com' == location.host) {
            dealSegmentFault();
        } else if ('www.w3cschool.cn' == location.host) {
            dealW3cschool();
        } else if ('www.liaoxuefeng.com' == location.host) {
            dealLiaoxuefeng();
        }

        window.addEventListener('scroll', () => {
            if (getScrollTop() + getWindowHeight() > getScrollHeight() - 10) {
                document.querySelectorAll('dl[class=""]').forEach(function (item) {
                    item.parentElement.removeChild(item);
                });

                document.querySelectorAll('iframe').forEach(function (item) {
                    if ((item.src && item.src.indexOf('pos.baidu.com') > 0)) {
                        item.parentElement.removeChild(item);
                    }
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
    //------------------------------------------------------------------------------------------
    //页面处理过程
    /**
     * 处理 CSDN广告及布局
     * blog.csdn.net
     */
    function dealCSDN() {
        var s = '';
        //公共部分
        s += 'h1 { "text-align": "center"; }';
        s += '.article_content p { margin:1em 0; "line-height": "1.75em";"color":"#2F2F2F"}';
        s += '.pulllog-box { display:none !important; }';

        //自动全文
        s += '.article_content{ height: auto !important;}';
        s += '#article_content{ height: auto !important;}';
        
        //搜索页
        s += '.rightadv,';
        //首页
        s += '.banner-ad-box,.right_extension.slide-outer,aside .slide-outer.right_top,';
        //下载页
        s += '.ad,.top_ad_box,#layerd';

        s += '{ display: none !important; }';

        //旧版本
        s += '#homepageArticles ,#layerd,#nav_show_top_stop, .QRcodebg1, .readall_box,.hide-article-box';
        s += '{ display: none !important; }';
        s += '#com-quick-reply,#com-quick-collect,#com-d-top-a { min-width: 30px !important; width: 31px !important;}';
        s += '#com-quick-reply:hover,#com-quick-collect:hover,#com-d-top-a:hover { width: 90px !important;}';

        //新版本
        s += '.fixRight,.extension_other,.fixRight_box,.persion_article,.yd_a_d_feed_cla,.edu_promotion,.box-box-default,.csdn-tracking-statistics[data-mod="popu_4"],main .edu-promotion';
        s += '{ display: none !important;}';
        s += 'body > header{transition: height 1s;margin-bottom: 10px;overflow: hidden;}';
        s += 'header.hide{height:5px;}';
        s += 'header.hide:hover{height:140px;}';
        s += '.article_content,.article_content p,.article_content p span:not([class^=MathJax] span):not([class^=MathJax]):not([id^=MathJax] span):not([id^=MathJax]) {"font-family": "Microsoft YaHei,Consolas";"font-size": "15px" }';
        s += '.article_content p .MathJax { "font-size": "16px"; }';
        s += '.article_content p img{  "display": "block";"margin": "0 auto" }';


        //修改原来烦人的样式
        s += contentEndStyle('article');
        s += recomendStyle();
        addStyle(s);
        document.ready(function () {
            //缩放头部
            let header = document.getElementsByTagName('header')[0];
            if (header)
                header.classList.add('hide');
            //自动展开全文
            var btnMore = document.querySelector('a.btn.read_more_btn');
            if (btnMore)
                btnMore.click();

            //优化推荐列表显示效果
            modifyRecomendWeak('.recommend_list');
            modifyRecomendWeak('.recommend-box');

            //删除空白段落
            var paragraph = document.querySelectorAll('.article_content p');
            paragraph.forEach(function (item) {
                if (!item.innerText.trim() && !item.querySelector('img,a'))
                    item.parentElement.removeChild(item);
            });

            document.querySelectorAll('iframe').forEach(function (item) {
                if ((item.src && item.src.indexOf('pos.baidu.com') > 0)) {
                    item.parentElement.removeChild(item);
                }
            });

            setTimeout(function () {
                var hideArr = [];
                document.querySelectorAll('div[id]').forEach(function (item) {
                    if (item.id.startsWith('BAIDU_SSP'))
                        hideArr.push('#' + item.id);
                });

                document.querySelectorAll('dl[class=""]').forEach(function (item) {
                    item.parentElement.removeChild(item);
                });

                document.querySelectorAll('iframe').forEach(function (item) {
                    if ((item.src && item.src.indexOf('pos.baidu.com') > 0)) {
                        if (item.parentElement.id.length > 0)
                            hideArr.push('#' + item.parentElement.id);
                        else
                            item.parentElement.style.display = 'none !important;';
                    }
                });
                if (hideArr.length > 0)
                    addStyle(hiddenStyle(hideArr));
            }, 200);
        });
    }

    /**
     * 处理 脚本之家广告及布局
     * www.jb51.net
     */
    function dealJb51() {
        var hideArr = [];
        hideArr.push('.main.mb10.clearfix');
        hideArr.push('.header .wrap');
        hideArr.push('.main.clearfix.bgf .lbd.clearfix');
        hideArr.push('#content>.jb51ewm');
        hideArr.push('.lbd.clearfix');
        hideArr.push('.article-right>.r300.clearfix.mt10');
        //hideArr.push('');

        var style = hiddenStyle(hideArr);
        style += contentEndStyle('#content');
        style += recomendStyle();
        addStyle(style);

        document.ready(function () {
            //优化推荐列表显示效果
            modifyRecomendWeak('.xgcomm.clearfix');

            //删除空白段落
            var paragraph = document.querySelectorAll('#content p');
            paragraph.forEach(function (item) {
                if (!item.innerText.trim() && !item.querySelector('img,a'))
                    item.parentElement.removeChild(item);
            });

            document.querySelectorAll('iframe').forEach(function (item) {
                if ((item.src && item.src.indexOf('pos.baidu.com') > 0)) {
                    item.parentElement.removeChild(item);
                }
            });

            setTimeout(function () {
                var hideArr = [];
                document.querySelectorAll('div[id]').forEach(function (item) {
                    if (item.id.startsWith('BAIDU_SSP'))
                        hideArr.push('#' + item.id);
                });
                document.querySelectorAll('iframe').forEach(function (item) {
                    if ((item.src && item.src.indexOf('pos.baidu.com') > 0)) {
                        if (item.parentElement.id.length > 0)
                            hideArr.push('#' + item.parentElement.id);
                        else
                            item.parentElement.style.display = 'none !important;';
                    }
                });
                if (hideArr.length > 0)
                    addStyle(hiddenStyle(hideArr));
            }, 200);
        });
    }

    /**
     * 处理 思否 广告
     * segmentfault.com
     */
    function dealSegmentFault() {
        var hideArr = [];
        hideArr.push('.mt20.ad-detail-mm');
        hideArr.push('.side .mb25');
        //hideArr.push('');

        var style = hiddenStyle(hideArr);
        addStyle(style);
    }
    /**
     * 处理 w3cschool 广告
     * www.w3cschool.cn
     */
    function dealW3cschool() {
        var hideArr = [];
        hideArr.push('.widget-body');
        hideArr.push('.bottom-tools');
        hideArr.push('#header');
        hideArr.push('.project-sq');
        hideArr.push('.abox-item');
        //hideArr.push('');

        var style = hiddenStyle(hideArr);
        style += '.left-drager{top: 0 !important;}';
        style += '.splitter-sidebar{padding-bottom: 10px !important;}';
        addStyle(style);

        window.addEventListener('resize',function () {
            setTimeout(()=>{
                var height = workLeftHeight + 100 + 'px';
                document.querySelector(".left-container").style.height = height;
                document.querySelector(".slimScrollDiv").style.height = height;
                document.querySelector(".fixed-sidebar").style.height = height;
            },500);
        });
        setTimeout(()=>{
            var height = workLeftHeight + 100 + 'px';
            document.querySelector(".left-container").style.height = height;
            document.querySelector(".slimScrollDiv").style.height = height;
            document.querySelector(".fixed-sidebar").style.height = height;
        },2000);
    }

    /**
     * 处理 w3cschool 广告
     * www.w3cschool.cn
     */
    function dealLiaoxuefeng() {
        var hideArr = [];
        hideArr.push('#x-sponsor-b');
        hideArr.push('#x-sponsor-a');
        //hideArr.push('');

        var style = hiddenStyle(hideArr);
        style += '.left-drager{top: 0 !important;}';
        style += '.splitter-sidebar{padding-bottom: 10px !important;}';
        addStyle(style);
    }



    //------------------------------------------------------------------------------------------
    //辅助方法
    function getScrollTop() {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    //文档的总高度
    function getScrollHeight() {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    }

    function getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

    function hiddenStyle(items) {
        return (items.toString() + ' {display: none !important; }');
    }

    function contentEndStyle(selector) {
        return selector + '::after{content:"— The End —";color:#e0e0e0;text-align:center;width:100%;line-height:60px;margin-top:-40px;display:block;font-family:Monotype Corsiva,Blackadder ITC,Brush Script MT,Bradley Hand ITC,Bell MT;font-size:1.6em;padding-bottom:.6em;}';
    }

    function recomendStyle() {
        var s = '*{transition: opacity 1s, width 1s;}';
        s += '.recomend_weak { height: 180px !important; overflow-y: hidden !important; opacity:.2; }';
        s += '.recomend_show { height:auto !important;  overflow-y !important: visible;opacity:.2; }';
        s += '.recomend_weak:hover { opacity:1; }';
        s += '.recomend_show:hover { opacity:1; }';
        return s;
    }

    function addStyle(s) {
        //添加样式到 Head 中
        var head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            var style = document.createElement("style");
            style.type = "text/css";
            style.appendChild(document.createTextNode(s));
            head.appendChild(style);
        }
    }

    //优化推荐列表显示效果
    function modifyRecomendWeak(selector) {
        var item = document.querySelector(selector);
        if (item) {
            var func = function () {
                item.removeEventListener('mousemove', func);
                this.classList.add('recomend_show');
                this.classList.remove('recomend_weak');
            };
            item.classList.add('recomend_weak');
            item.addEventListener('mousemove', func);
        }
    }
})();