// ==UserScript==
// @name         maxsimpler
// @namespace    http://fanwei.me/
// @version      1.83
// @description  Improve the web world!
// @author       iisimpler
// @match        *://www.google.com/*
// @match        *://*.gitee.com/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://*.jianshu.com/p/*
// @match        *://*.cnblogs.com/*/p/*
// @match        *://*.cnblogs.com/*/articles/*
// @match        *://juejin.cn/post/*
// @match        *://juejin.cn/s/*
// @match        *://segmentfault.com/*
// @match        *://mp.weixin.qq.com/s*
// @match        *://www.iteye.com/blog/*
// @match        *://kns.cnki.net/KCMS/detail/detail.aspx*
// @match        *://www.cnki.net/KCMS/detail/detail.aspx*
// @match        *://tv.cctv.com/*
// @match        *://www.flydean.com/*
// @match        *://yourbatman.cn/*
// @match        *://*.json.cn/*
// @match        *://www.zhihu.com/question/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.zhihu.com/pub/reader/*
// @match        *://blog.51cto.com/*
// @match        *://*.infoq.cn/*
// @match        *://edu.51cto.com/center/course/lesson/*
// @match        *://bugstack.cn/*
// @match        *://docs.python.org/*
// @match        *://nacos.pintec.com/*
// @grant        none
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @require      https://lib.baomitu.com/jquery.nicescroll/latest/jquery.nicescroll.min.js
// @downloadURL https://update.greasyfork.org/scripts/392768/maxsimpler.user.js
// @updateURL https://update.greasyfork.org/scripts/392768/maxsimpler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var siteUrl = window.location.href;

    var modifyAttrMap = {};
    var removeAttrMap = {};
    var removeEles = [];
    var css = '';

    setTimeout(function(){
        $('a').click(function(e) { e.stopPropagation(); })
    }, 3000);

    let delayOptSiteUrlArray = ['infoq.cn', 'edu.51cto.com/center/course/lesson']

    if (siteUrl.includes('www.google.com/search')) {
        document.querySelectorAll('a').forEach(it => it.target='_blank')
    } else if (siteUrl.includes('gitee.com')) {
        setTimeout(function(){
            Array.from(document.querySelectorAll('a'))
            .filter(it => it.href && it.href.startsWith('https://gitee.com/link?target='))
            .forEach(it => it.href = decodeURIComponent(it.href.replace('https://gitee.com/link?target=', '')))
        }, 1000);
    } else if (siteUrl.includes('blog.csdn.net') && siteUrl.includes('/article/details/')) {
        css = `#mainBox {width: 90% !important; margin-right: unset !important}
               #mainBox main {width: 100% !important}
               #article_content {height: unset !important}
               iframe, #csdn-toolbar, .blog_container_aside, #rightAside, #toolBarBox, .csdn-side-toolbar, .blog-footer-bottom, #recommendNps, .passport-container, .hide-preCode-box, .signin, .passport-login-container, .hide-article-box, .passport-login-tip-container {display: none !important;}
               pre.set-code-hide {height: unset !important; max-height: unset !important}`
        $(document).ready(function() {
            document.querySelectorAll('.recommend-box div[data-url^="https://download.csdn.net"]').forEach(it => it.remove())
            document.querySelectorAll('a').forEach(node => node.addEventListener("click", event => event.stopImmediatePropagation(), true))
        });
    } else if (siteUrl.includes('jianshu.com/p')) {
        css = `body > div:nth-child(13), header, footer, aside, .adad_container, body > div:nth-child(2) > div:nth-child(4), div[role='main'] > div > section:nth-child(2), div[role='main'] > div > section:nth-child(5), div[role='main'] > div > section:nth-child(1) > div:nth-child(9),  div[role='main'] > div > section:nth-child(1) > div:nth-child(7), #note-page-comment > section > div:nth-child(1) {display: none !important;}
               div[role='main'] > div {width: 135% !important;}
               div[role='main'] {padding: unset !important}`
        setTimeout(function(){
            Array.from(document.querySelectorAll('a'))
            .filter(it => it.href && it.href.startsWith('https://links.jianshu.com/go?to='))
            .forEach(it => it.href = decodeURIComponent(it.href.replace('https://links.jianshu.com/go?to=', '')))
        }, 1000);
    } else if (siteUrl.includes('cnblogs.com')) {
        css = `.charm-bar-wrapper, .imagebar, .bannerbar, #fixed-header-slide, #TopLogo, #header-wrap, .LeftCell, #divFooterInfo, .draw, .custom-toolbar, #left-side, .profile, .custom-searchbar, #bannerbar, #top_nav, #header, #footer, #sideBar, #blog_post_info, #mytopmenu, #leftcontent, .footer, #mylinks, .pattern-center, .site-branding, .esa-toolbar, #navigator {display: none !important;}
               #centercontent {padding: unset !important; width: 90% !important; margin: auto !important}
               #home { display: block !important; width: 85% !important; margin: auto !important; margin-top: unset !important; max-width: unset !important; position: unset !important}
               #main { display: block !important; width: unset !important}
               #articleDirectory {z-index: 1000}
               #mainContent {width: 100% !important; margin: auto !important; max-width: unset !important; flex: unset !important; grid-template-rows: 100vh !important; padding: unset !important}
               #mainContent .forFlow { margin: unset !important; padding: unset !important; width: unset !important; max-width: unset !important; position: unset !important}
               #topics, .postBody {width: unset !important;}
               .post { padding-right: 20px; }`
    } else if (siteUrl.includes('juejin.cn/post') || siteUrl.includes('juejin.cn/s')) {
        css = `.wechat-ad, .jj_animate_pulse, .mask, .bottom-login-guide, .category-course-recommend, .recommended-links, div.sidebar.article-sidebar > a, .main-header-box, .article-suspended-panel, .author-block, .index-book-collect, .related-entry-sidebar-block, .suspension-panel, .follow, .article-banner, .comment-form, .entry-public-aside, .sidebar-bd-entry, .app-download-sidebar-block, .login-guide-popup {display: none !important;}
               .container, .entry-public-main {max-width: 90% !important;}
               #comment-box {max-width: 100% !important;}
               .main-area {width: 75% !important;}
               .sticky-block-box {position:fixed;top:1rem !important; width: inherit; transition:top .2s }
               .result {max-height: none !important;box-sizing:unset !important}
               .catalog-body {max-height: calc(90vh) !important;}`;
        setTimeout(function(){
            Array.from(document.querySelectorAll('a'))
            .filter(it => it.href && it.href.startsWith('https://link.juejin.cn/?target='))
            .forEach(it => it.href = decodeURIComponent(it.href.replace('https://link.juejin.cn/?target=', '')))
        }, 1000);
    } else if (siteUrl.includes('segmentfault.com')) {
        css = `#sf-header, #right-side-wrap, .sticky-wrap, #article-header, #footer {display:none !important}
               nav {visibility: hidden !important}
               .right-side { width: unset !important; margin: unset !important; padding: unset !important}
               .container {max-width: 90% !important; }`
    } else if (siteUrl.includes("mp.weixin.qq.com/s")) {
        css = `#page-content > div {max-width: 85% !important}
               #js_pc_qr_code {display: none !important}
               section {color: unset !important}`
    } else if (siteUrl.includes("www.iteye.com/blog")) {
        css = `#header, #local, .hide-article-box, .comments, #bottoms {display: none !important}
               #blog_content {height: unset !important}
               #content {width: 90% !important}
               .not_exist_right_recommend {width: 100% !important}`
    } else if (siteUrl.includes("kns.cnki.net/KCMS/detail/detail.aspx")) {
        var nhDownBtn = $("a:contains('整本下载'):first");
        var pdfUrl = nhDownBtn.attr("href").replace("nhdown", "pdfdown");
        var pdfDownBtn = nhDownBtn.clone(true).attr("href", pdfUrl).text("PDF下载").removeClass("icon-dlGreen").addClass("icon-dlpdf");
        $(".dllink").append(pdfDownBtn);
        $("a:contains('整本下载')").text("CAJ下载").removeClass("icon-dlGreen").addClass("icon-dlcaj");
        $("a:contains('分页下载')").removeClass("icon-dlBlue").addClass("icon-phone xml");
        $("a:contains('分章下载')").removeClass("icon-dlBlue").addClass("icon-dlcrsp xml");
        $("a:contains('在线阅读')").removeClass("icon-dlGreen").addClass("icon-phone xml");
    } else if (siteUrl.includes("www.cnki.net/KCMS/detail/detail.aspx")) {
        var zbDownBtn = $("li.whole");
        var pdfZbUrl = zbDownBtn.children(":first").attr("href").replace("nhdown", "pdfdown");
        var pdfZbDownBtn = zbDownBtn.clone(true);
        pdfZbDownBtn.children(":first").attr("href", pdfZbUrl).text("PDF下载");
        $(pdfZbDownBtn).insertAfter(zbDownBtn);
    } else if (siteUrl.includes("pintec.com") && siteUrl.includes("nacos")) {
        removeEles = ['#root > div > header > div > span'];
        $("#root > div > header > div").css({ "height": "40px", "line-height": "40px" })
        $('#container').css({ "height": "1500px" })
    } else if (siteUrl.includes("tv.cctv.com")) {
        [...document.getElementById('fpy_ind04').getElementsByTagName("a")].forEach(item => item.href = "http://api.baiyug.vip/index.php?url=" + item.href);
        [...document.getElementById('fpy_ind04').getElementsByTagName("dd")].forEach(item => item.style.display = 'block');
    } else if (siteUrl.includes("www.flydean.com")) {
        removeEles = ['#read-more-mask', '#read-more-btn'];
        document.getElementById('9527article').setAttribute('style', '')
    } else if (siteUrl.includes("yourbatman.cn")) {
        removeEles = ['#read-more-wrap'];
        document.getElementById('artDetail').setAttribute('style', '')
    } else if (siteUrl.includes("json.cn")) {
        removeEles = ['header', 'li > a.tip', 'footer', 'div.xf-window', 'ul.nav', 'p.editor-tip'];
        removeAttrMap = { 'body': ['class'], 'html': ['class'] };
        $('main').css('height', '100%')
    } else if (siteUrl.includes("www.zhihu.com/pub/reader")) {
        css = `.Pub-reader-app-header, .Pub-reader-bottom-bar, .CornerButtons {display: none !important;}
               .Pub-web-reader .reader-container {width: 88% !important; left: 38% !important}
               .Pub-reader-catalogue {left: 37% !important;}
               .Pub-web-reader .reader-chapter-content {width: unset !important; padding-top: unset !important;}
               .Pub-web-reader .Pub-reader-catalogue .MPub-reader-chapter {padding-top: unset !important;}`
        $('.reader-container').addClass('show-chapters');
    } else if (siteUrl.includes("www.zhihu.com/tardis")) {
        css = `.App-pc .Container { max-width: 85% !important }`
    } else if (siteUrl.includes("zhuanlan.zhihu.com/p/")) {
        css = `img.origin_image {max-width: 50% !important}
               .Post-Row-Content {justify-content: center !important; width: 68% !important;}
               .Post-Row-Content-right, .ColumnPageHeader-Wrapper, .TitleImage, .Post-Author, .Voters, .RichContent-actions, .ContentItem-time {display: none !important;}
               .Post-Row-Content-left {width: unset !important;}
               .Post-Header, .Post-RichTextContainer, .PostIndex-Contributions, .Recommendations-Main, .Comments-container, .Comments-container, .Post-NormalSub .Comments-container {width: unset !important; margin: 0 0 50px 0 !important}
               `
        setTimeout(function() {
            $('.Modal-closeButton').click()
            Array.from(document.querySelectorAll('a'))
            .filter(it => it.href && it.href.startsWith('https://link.zhihu.com/?target='))
            .forEach(it => it.href = decodeURIComponent(it.href.replace('https://link.zhihu.com/?target=', '')))
        }, 500);
    } else if (siteUrl.includes("www.zhihu.com/question")) {
        css = `div[data-za-detail-view-path-module='RightSideBar'], .Pc-word, .QuestionHeader-footer {display: none !important;}
               .Question-main, .QuestionHeader-main {width: 80% !important}
               .ListShortcut, .Question-mainColumn {width: 100% !important}
               .Question-mainColumn, .Topstory-mainColumn {margin: 0 !important; flex-shrink: unset !important}
               .QuestionHeader-content {max-width: 80% !important; margin: auto !important; justify-content: space-between !important; padding-left: unset !important}
               img.origin_image[data-size="normal"] {max-width: 60% !important}
               .AuthorInfo {max-width: unset !important}`
        setTimeout(function(){
            var bookStore = document.querySelector("a[href$='www.zhihu.com/question/waiting']")
            bookStore.innerText = '书店'
            bookStore.href = 'https://www.zhihu.com/pub'
        }, 500)
    } else if (siteUrl.includes("blog.51cto.com")) {
        removeEles = ['.Header', '.home-top', '.action-aside-left', '.detail-content-right', '.fixtitle', '.Footer']
        css = "#page_center {width: 86% !important} .detail-content-left {width: 100% !important} .detail-content-new {padding: 0 !important}"
    } else if (siteUrl.includes("infoq.cn")) {
        removeEles = ['.header', '.sub-nav-wrap', '.header', '.article-aside', '.operation-bar', '.layout-footer-wrap', '.sub-nav-wrap', '.article-sidebar', '.article-fixed-operation']
        css = ".inner-content, .article-content-layout {padding-top: 10px !important} .layout-content {width: 90% !important} .main-content, .content-main, .article-main {width: 100% !important} .main {max-width: 90% !important; witdh: 90% !important}"
        setTimeout(function() { $('.close-geo').click(); $('.toggle-menu').click();}, 2000);
    } else if (siteUrl.includes("edu.51cto.com/center/course/lesson")) {
        removeEles = ['.course-infos', '.breadcrumb-nav', '.Header3', '.course-right-layout', '.VideoTop', '.openchapter', '.videoInfos', '#zhichiBtn', '.bullet-screen']
        var innerHeight = window.innerHeight
        css = `.section-list-scroll {height: ${innerHeight}px !important;} .bullet-screen {display: none !important;}`
    } else if (siteUrl.includes("bugstack.cn")) {
        setTimeout(function(){
            document.getElementById('read-more-wrap').remove()
            document.getElementsByClassName('lock')[0].setAttribute('style', '')
        }, 2000);
    } else if (siteUrl.includes("docs.python.org")) {
        css = `.bodywrapper {margin: 0 0 0 500px !important}
               .sphinxsidebar {width: 400px !important}
               .sphinxsidebarwrapper {width: 400px !important}
               .sphinxsidebarwrapper li { padding: 5px 0 !important; font-size: 16px !important }
              `
    }


    $(document).ready(function() {
        if (delayOptSiteUrlArray.some(it => siteUrl.includes(it))) {
            setTimeout(function() { opt() }, 1500);
        } else {
            opt()
        }
    });

    function opt() {
        var style = document.createElement('style');
        style.innerHTML = css
        window.document.head.appendChild(style);
        $.each(removeAttrMap, function(key, values) { $.each(values, function(index, item) { $(key).removeAttr(item) }) });
        $.each(removeEles, function(index, item) { $(item).remove() });
        $.each(modifyAttrMap, function(key, values) {
            $(key).each(function(keyIndex, keyItem) {
                $.each(values, function(valueIndex, valueItem) {
                    if (valueIndex % 2 === 1) {
                        $(keyItem).attr(valueItem, $(keyItem).attr(values[valueIndex - 1]));
                    }
                })
            })
        });
    }
})();