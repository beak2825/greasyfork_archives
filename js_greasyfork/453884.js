// ==UserScript==
// @name         AddMyCSS
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  通过给网页添加CSS来自定义网页样式
// @author       Jawon
// @icon         http://www.weather.com.cn/favicon.ico

// @match        *://www.baidu.com/*
// @match        *://wenku.baidu.com/*
// @match        *://fanyi.baidu.com/*
// @match        *://baijiahao.baidu.com/*
// @match        *://jingyan.baidu.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://*.csdn.net/*
// @match        *://www.it1352.com/*
// @match        *://www.cnblogs.com/*
// @match        *://www.bilibili.com/*
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?chapterId*
// @match        *://www.logosc.cn/*
// @match        *://www.douyin.com/*
// @match        *://*.bing.com/*
// @match        *://*.zhihu.com/*

// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/453884/AddMyCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/453884/AddMyCSS.meta.js
// ==/UserScript==

/*
脚本介绍：

    使用门槛：
        1.有一台电脑，电脑上的浏览器能安装油猴插件。
        2.会使用tampermonkey油猴插件，不会的去百度。
        3.有一点点前端编程基础，只要一点点哦！

    使用方法：
        比如你要修改百度的样式，只要进行下面几步即可。

        1.将此脚本添加到油猴插件里并打开。
        2.在上面添加你要匹配的网站： // @match *://www.baidu.com/*
        3.在下面addStyleArr函数内添加要改变的样式，你可以将我原来的样式删除，再像我那样添加新的样式。
            //示例代码：
            else if (web("www.baidu.com")) {

                addCssSelector(                             //至于用哪个函数请阅读脚本原理
                    "div#head",                             //参数1 选择器字符串
                    "background-color: black !important;"   //参数2 CSS字符串
                );

            }

        4.OK了，刷新百度看看效果。

    脚本原理：
        此JS脚本为向网页添加CSS改变网页样式提供了便利的接口，帮你解决了JS直接修改网页样式无效的两种情况。

        情况一：
            js修改的元素还没加载出来，或者元素不定时出现，再或者元素具有内联样式
	        解决方法：
                1.addCssSelector(selectorStr, cssStr);
                将添加的选择器和CSS保存到数组里，之后会生成两个相同的style标签并分别添加到html起始和末尾，
                以保证CSS持续作用于整个网页。这种方式对没有内联样式的元素有效。

                2.changeInlineStyle(selectorStr, cssStr);
                有些元素具有内联样式并且带有!important，导致上面的方法失效，这时我们用changeInlineStyle
                来修改元素的内联样式。这个函数同样将添加的选择器和CSS保存到数组里，之后先设置最短和最长修改
                时间，再用定时器循环修改内联样式。每次循环若找到元素就修改，再判断是否到达最短修改时间，是
                就停止循环，否就继续循环，若未找到元素就持续循环，直到达到最长修改时间。这样既防止修改一次
                后被后加载的CSS覆盖，又防止找不到元素后一直循环检测，浪费CPU资源。

                3.keepChangeInlineStyle(selectorStr, cssStr)；
                而有些元素不但具有内联样式加!important而且会不定时改变内联样式，这时第二个函数就失效了，那
                我们就用第三个函数keepChangeInlineStyle。这个函数类似于第二个函数，不同点是他会不停地循环，
                一旦检测到元素的内联样式与指定的样式不符，就将其修改。
        情况二：
            目标元素在iframe框架内，js无法找到元素
            解决方法：
                match 后面匹配的网址换成 iframe 内的网址即可

    最后要特别感谢油猴中文网bbs.tampermonkey.net.cn对我的帮助！特别是热情的李恒道哥哥！
*/

"use strict";

// 在这里添加要改变的样式 ==============================================================================================
function addStyleArr() {
    //百度文库样式
    if (web("wenku.baidu.com")) {
        //百度文库的第一种页面
        if (document.querySelector("body.tpl-xreader")) {
            changeInlineStyle(
                "div#app-right,.menubar,.tool-bar-wrap,.bg-theme-wrap.no-full-screen,.page-icon-pos.pos,.page-icon-on.pos,#app-left,#app-top-right-tool",
                "display: none !important;"
            );
            changeInlineStyle(
                ".center-wrapper.zoom-scale.classic",
                "width: calc(100% - 280px) !important;height: 120% !important;"
            );
            addCssSelector(
                ".creader-canvas",
                "width: 1000px !important;height: 100% !important;"
            );
        }
        //百度文库的第二种页面，office文档
        else if (document.querySelector(".catalog-main")) {
            changeInlineStyle(
                ".tool-bar-wrapper.wk-web-4774.fade-in,.theme-enter-wrap,.sidebar-wrapper",
                "display: none !important;"
            );
        }
        //百度文库的第三种页面,几百页的书
        else if (document.querySelector(".doc-info-wrapper")) {
            changeInlineStyle(
                ".tool-bar-wrapper.wk-web-4774.fade-in,.theme-enter-wrap,.sidebar-wrapper",
                "display: none !important;"
            );
        }
    }
    //CSDN样式
    else if (web("csdn.net")) {
        addCssSelector(
            ".main_father.clearfix.d-flex.justify-content-center,body,#userSkin",
            "background: #06090a !important;"
        );
        addCssSelector(".column_info_box", "position: unset !important;");
        if (1) {
            // CSDN 打印保存样式
            addCssSelector(
                "aside.blog_container_aside,div#blogColumnPayAdvert,.blog-tags-box,div#pcCommentBox,div#recommendNps,.template-box,\
.blog-footer-bottom,.csdn-side-toolbar,.top-banner,.ag-tab-bar,.satisfied-component,.toolbar-advert,.passport-login-container,.hide-preCode-box,\
.first-recommend-box,.second-recommend-box,.recommend-box,.left-toolbox,#csdn-toolbar,.operating",
                "display: none !important;"
            );
            // 黑底白字
            addCssSelector("html,body,div,p,td,blockquote,code,h1,h2,h3,h4,h5,h6","color: #aaa !important; background: black !important;");
            addCssSelector("img","background-color: white !important;");
            addCssSelector(
                "main,div#mainBox,.main_father.clearfix.d-flex.justify-content-center",
                "width: 100% !important;margin: 0 !important;padding: 0 !important;float: left !important;width: 100% !important;"
            );
            addCssSelector(
                "main div.blog-content-box",
                "padding: 0 10% !important;"
            );
            addCssSelector(".con-l-tag", "width: 100% !important;");
            addCssSelector("#toolBarBox > div", "background-color: #0000 !important;");
            //代码展开
            addCssSelector(".set-code-hide", "height: auto !important;");
        }
    }
    //百度
    else if (web("www.baidu.com")) {
        addCssSelector(
            "#lg>img,#s-top-left,#u1,#s-hotsearch-wrapper,#bottom_layer,#s_side_wrapper,#s_top_wrap,#s_wrap",
            "display:none !important;"
        );
    }
    //百度翻译样式
    else if (web("fanyi.baidu.com")) {
        addCssSelector(
            "#transOtherRight,.vip-btn-activity,#app-guide",
            "display:none !important;"
        );
    }
    //bilibili样式
    else if (web("www.bilibili.com")) {
        addCssSelector(
            ".bpx-player-container[data-screen=full] .bpx-player-shadow-progress-area,.bpx-player-shadow-progress-area",
            "height: 5px !important; visibility:visible !important; opacity: 1 !important;"
        );
    }
    //博客园样式
    else if (web("www.cnblogs.com")) {
        if (1) {
            // 博客园打印保存样式
            addCssSelector(
                "#notHomeTopCanvas,#articleInfo > a,#open-button,#dayNightSwitch,#aplayer,#cnblogs_post_body > div.essaySuffix-box,#blog_post_info_block,#cnblogs_post_body > p.essaySuffix-eof,\
#comment_form,#footer",
                "display: none !important;"
            );
            addCssSelector(
                "*",
                "color: #bbb !important; background: black !important"
            );
        }
    }
    //it1352样式
    else if (web("www.it1352.com")) {
        // 展开全部内容
        addCssSelector(".arc-body-main", "height: auto !important;");
        addCssSelector(".arc-body-main-more", "display: none !important;");
    }
    // 抖音样式
    else if (web("www.douyin.com")) {
        // 进度条颜色
        addCssSelector(
            "xg-played.xgplayer-progress-played",
            "background-color: white !important;"
        );
    }
    // 标小智Logo
    else if (web("www.logosc.cn")) {
        // logo去水印放大
        if (1) {
            addCssSelector(
                "rect.watermarklayer,html::after",
                "display: none !important;"
            );
            addCssSelector(
                ".flex-1 .swiper-slide-active .svg-card svg",
                "position: fixed;width: 1350px;height: 1350px;top: -63%;left: 10%;z-index: 99999999 !important;"
            );
        }
    }
    // 百度经验
    else if (web("jingyan.baidu.com")) {
        // 自动展开
        addCssSelector(
            "#exp-article > div.exp-content-outer > div",
            "overflow: visible !important; height: auto !important; max-height: -webkit-fill-available !important;"
        );
        addCssSelector(
            "div#main-content,img.exp-image-default.pic-cursor-pointer",
            "min-width: 100% !important;"
        );
        //图片变大
        addCssSelector(
            ".exp-image-wraper",
            "min-width: 80% !important;"
        );
        addCssSelector(
            "#format-exp > div.read-whole-mask,body > nav,body > header,#breadcrumb,#exp-article > div.wgt-thumbs.clearfix,#ui-tooltip-0,#exp-article > div.exp-title.clearfix > span,\
#wgt-like,#wgt-exp-share,#wgt-barrier-free,#task-panel-wrap,#aside,#format-exp > div.prompt,#format-exp > div.f12.origin-notice,#format-exp > div:nth-child(1)",
            "display: none !important;"
        );
    }
    // 超星学习通
    else if (web("chaoxing.com") || web("ananas")) {
        // 当前目录高亮
        addCssSelector(
            ".posCatalog_active",
            "color: red !important;"
        );
        // addCssSelector(
        //     "#video > div.vjs-control-bar",
        //     "display: none !important;"
        // );
    }
    //必应
    else if (web("bing.com")) {
        // 去除建议栏
        addCssSelector(
            "#wikiWidgetContainer",
            "display: none !important;"
        );
    }
    //百家号百度
    else if (web("baijiahao.baidu.com")) {
        // 简洁打印样式
        addCssSelector(
            ".-F_R2,._2v051,._3m1xk,._2LcVE,._1LjGN,._3YM_A,.xcp-publish-title,.xcp-publish,.xcp-list,#commentModule,.Wo80H",
            "display: none !important;"
        );
        addCssSelector(
            ".EaCvy",
            "width: 100% !important;"
        );
        // 黑底白字
        addCssSelector(
            "*",
            "color: #ccc !important; background: black !important;"
        );
    }
    //百度知道
    else if (web("zhidao.baidu.com")) {
        // 简洁打印样式
        addCssSelector(
            ".head-wrap,.nav-menu-container,#userbar,#qb-side,#ask-info,.guide-tip,.question-number-text-chain,.task-list-button,.aria-div,.jump-goto-star,.wgt-related,.wgt-footer-new,\
#qbleftdown-container,.show-answer-dispute,.wgt-replyer-all-follow-box,.wgt-answers-mask,.bottom-dashed-line",
            "display: none !important;"
        );
        addCssSelector(
            "article#qb-content,a.ikqb_img_alink",
            "min-width:100% !important;"
        );
        addCssSelector(
            ".ikqb_img",
            "min-width:70% !important; min-height:70% !important; max-height:70% !important;"
        );
        addCssSelector(
            ".bd.answer,div#answer-content-1983575631",
            "height: auto !important;"
        );
        addCssSelector(
            ".wgt-replyer-all,.line.content-wrapper",
            "visibility: visible !important;"
        );
        // 黑底白字
        addCssSelector(
            ".line.content-wrapper",
            "color: #ccc !important; background: black !important;"
        );
    }
    //知乎
    else if (web("zhihu.com")) {
        addCssSelector(
            ".Modal-wrapper,.is-hidden.is-fixed,.css-1jf8wzl,.css-1ynzxqw,.QuestionHeader-tags,.QuestionHeader-side,.Question-sideColumn",
            "display: none !important;"
        );
        addCssSelector(
            ".EaCvy",
            "width: 100% !important;"
        );
        addCssSelector(
            "html",
            "overflow: visible !important;"
        );
        addCssSelector(
            ".Question-mainColumn",
            "width: 100%; !important;"
        );
    }
}
// 添加完毕 ===========================================================================================================








//以下是功能实现，请慎重修改！

//jsInserted标志JS代码是否已全部注入，如果未完全注入就开始调用函数会出现函数未定义错误
var jsInserted = false;
var checkInserted = setInterval(() => {
    if (jsInserted) {
        // 请在这里调用 StartToChange
        StartToChange();
        clearInterval(checkInserted);
    }
}, 100);

//----------------------------------------------------- 参数设置
var initTime = 1000 * 6; //初始识别网页时间
//普通检测参数:
var commonCycleTime = 300; //周期
var minTime = 1000 * 6; //最短检测时间
var maxTime = 1000 * 15; //最长检测时间
//持续监测参数:
var keepCycleTime = 500; //周期
//-----------------------------------------------------
//普通元素列表
var commonEleArr = [];

//需要持续检测的元素列表
var keepSetArr = [];

//添加css选择器的元素列表
var CSSArr = [];

//添加style标签，适用于没有内联样式的元素
function addCssSelector(selectorStr, cssStr) {
    CSSArr.push({ selector: selectorStr, css: cssStr });
}
//改变内敛样式，适用于具有内联样式并且不会变动的元素
//参数1:选择器，参数2:样式
function changeInlineStyle(selectorStr, cssStr) {
    //保存每一个 选择器字符串 和 样式字符串 为一个 对象，添加到数组里
    commonEleArr.push({ selector: selectorStr, css: cssStr });
}
//持续改变内敛样式，适用于具有内联样式并且不定时变动的元素
function keepChangeInlineStyle(selectorStr, cssStr) {
    keepSetArr.push({ selector: selectorStr, css: cssStr });
}

//判断网址
function web(urlStr) {
    if (RegExp(urlStr, "i").test(location.href)) {
        return true;
    } else {
        return false;
    }
}

//循环检测，直到出现或超时
function setStyle() {
    var isEndLoop = false; //是否结束循环的标记
    var laterStop = true; //是否长时间未找到，需要停止循环
    var overMinTime = false; //在最短时间内，不管找没找到都不许停，否则会被后来加载的css覆盖

    setTimeout(function () {
        overMinTime = true;
    }, minTime);

    var checkLoop = setInterval(function () {
        //达到最短检测时间才开始判断是否停止，没到最短时间isEndTime始终是false
        if (overMinTime) {
            isEndLoop = true;
        }
        //遍历检测元素是否存在
        for (var i = 0; i < commonEleArr.length; i++) {
            var objList = document.querySelectorAll(commonEleArr[i].selector);
            //如果找到了就改样式
            if (objList.length > 0) {
                for (var j = 0; j < objList.length; j++) {
                    //如果改过了就不要重复改了
                    if (objList[j].style.cssText != commonEleArr[i].css) {
                        objList[j].style.cssText = commonEleArr[i].css;
                    }
                }
            }
            //没有找到就标记false，继续检测
            else {
                isEndLoop = false;
            }
        }
        if (isEndLoop) {
            clearInterval(checkLoop);
            laterStop = false; //已经全部找到并停止了，不需要再次停止
            console.log("Jawon: 普通循环检测已结束");
        }
    }, commonCycleTime);
    //到最长检测时间后还没找到就不找了
    setTimeout(function () {
        if (laterStop) {
            clearInterval(checkLoop);
            console.log("Jawon: 普通循环检测已结束，但仍有元素未找到！");
        }
    }, maxTime);
}

//持续循环检测
function keepSetStyle() {
    setInterval(function () {
        //遍历检测元素
        for (var i = 0; i < keepSetArr.length; i++) {
            var objList = document.querySelectorAll(keepSetArr[i].selector);

            for (var j = 0; j < objList.length; j++) {
                if (objList[j].style.cssText != keepSetArr[i].css) {
                    objList[j].style.cssText = keepSetArr[i].css;
                }
            }
        }
    }, keepCycleTime);
}

//在html起始和末尾分别添加style标签
function setCssSelector() {
    var myStyleFirst = document.createElement("style");
    var myStyleLast = document.createElement("style");
    myStyleFirst.className = "CssByJawon";
    myStyleLast.className = "CssByJawon";
    for (let i = 0; i < CSSArr.length; i++) {
        myStyleFirst.innerHTML +=
            CSSArr[i].selector + "{" + CSSArr[i].css + "}";
        myStyleLast.innerHTML += CSSArr[i].selector + "{" + CSSArr[i].css + "}";
    }
    var htmlObj = document.querySelector("html");
    htmlObj.insertBefore(myStyleFirst, htmlObj.firstChild);
    htmlObj.appendChild(myStyleLast);
}

//有些网站有多种样式布局，需要通过查找某个元素来辨别，为了保证找到该元素，需要多找几次，避免该元素还没加载出来。
function StartToChange() {
    var laterStop = true;
    var addEleLoop = setInterval(function () {
        if (
            commonEleArr.length == 0 &&
            keepSetArr.length == 0 &&
            CSSArr.length == 0
        ) {
            //如果没有元素就添加
            addStyleArr();
            //一旦添加成功，立即停止识别，开始循环检测，修改样式
            if (
                commonEleArr.length != 0 ||
                keepSetArr.length != 0 ||
                CSSArr.length != 0
            ) {
                clearInterval(addEleLoop);
                laterStop = false;
                if (commonEleArr.length > 0) {
                    setStyle();
                    console.log("Jawon: 普通循环检测已开启");
                }
                if (keepSetArr.length > 0) {
                    keepSetStyle();
                    console.log("Jawon: 持续循环检测已开启");
                }
                if (CSSArr.length > 0) {
                    setCssSelector();
                    console.log("Jawon: 已添加选择器");
                }
            }
        }
    }, 200);
    //initTime之内未添加元素就放弃,说明未识别到网站
    setTimeout(function () {
        if (laterStop) {
            clearInterval(addEleLoop);
            console.log("Jawon: 未识别到网站");
        }
    }, initTime);
}

// js代码插入完毕的标志
jsInserted = true;
