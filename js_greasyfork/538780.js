// ==UserScript==
// @name         宽屏分栏
// @namespace    http://tampermonkey.net/
// @version      2025-06-07
// @author       AA
// @description  将纵向长文本改为横向分栏显示
// @match        *://zhuanlan.zhihu.com/*
// @match        *://www.zhihu.com/*
// @match        *://www.bilibili.com/opus/*
// @match        *://bulbapedia.bulbagarden.net/*
// @match        *://*dedao.cn/*
// @match        *://mp.weixin.qq.com/*
// @match        *://*.nga.cn/*
// @match        *://*.dedao.cn/*
// @match        *://bbs.yamibo.com/*
// @match        *://yuanbao.tencent.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538780/%E5%AE%BD%E5%B1%8F%E5%88%86%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/538780/%E5%AE%BD%E5%B1%8F%E5%88%86%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleElement = document.createElement('style');
    styleElement.id = 'custom-css';
    document.head.appendChild(styleElement); // 简化插入逻辑

    const applyCustomCSS = () => {
        if (window.innerWidth >= minWidth) {
            getCustomCSSforThisWebsite();
            styleElement.textContent = customCSS;
        } else {
            styleElement.textContent = '';
        }
    };

    // 防抖函数
    const debounce = (fn, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    };

    // 直接监听页面加载完成事件（替代递归检查CSS）
    const onPageLoad = () => {
        applyCustomCSS();
        window.addEventListener('resize', debounce(applyCustomCSS, 200));
    };

    if (document.readyState === 'complete') {
        onPageLoad();
    } else {
        window.addEventListener('load', onPageLoad);
    }
})();

var customCSS = '';
var minWidth = null;

const zhihuBaseCSS = `
            .Post-Row-Content, .Search-container{
                width: 95vw !important;
            }
            .Profile-main, .Question-main, .ListShortcut{
              max-width: 95vw !important;
              min-width: 692px !important;
              width: auto !important;
              flex: 1;
            }

            p, blockquote, .css-376mun, .CommentContent {
                font-size: 16px;
                line-height: 1.8em;
                letter-spacing: 0.025em;
                font-family: Noto Serif CJK SC, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif;
            }

            .commentTime {
                font-size: 15px;
                line-height: 21px;
                letter-spacing: 0;
                bottom: -27px;
                font-family:-apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif;
            }

            .css-1yl6ec1 p {
                margin: 0.5em 0;
                text-indent: 1em;
            }

            .List-item {
              margin: 0 auto !important;
            }

            .css-1ld0bim, .css-szr8e7, .RichContent:not(.is-collapsed) > div:first-child{
                max-width: 600px !important;
                width: auto !important;
                max-height: 400px !important;
                height: auto !important;
                display: block;
            }

            .RichText, .css-376mun, .List-item{}
            .RichText{
                display: block !important;
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 87vh !important;
                height: auto;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
                break-inside: auto;
            }
            .RichText > figure {
                break-inside: avoid;
                max-height: 85vh !important;
            }
            .RichText  > :is(p, h1, h2, blockquote, ol, ul, figure) { max-width: 580px !important;}


            .ContentItem-rightButton{margin-left: 5vw;}

            .is-collapsed {
              display: flex;
              flex-wrap: wrap;        /* 允许换行 */
              justify-content: center; /* 水平居中 */
              align-items: center;    /* 垂直居中 */
              max-width: 660px;
              margin: 0 auto;
            }

            /* 强制按钮换行 */
            .is-collapsed > div:last-child {
              flex-basis: 100%;       /* 占满整行 */
              text-align: center;     /* 按钮居中 */
            }


            .ContentItem-title, .ContentItem-meta {
              max-width: 660px;
              margin-left:auto;
              margin-right:auto;
              margin-bottom: 5px;
            }

            .ContentItem-actions {
              display: flex;
              justify-content: center; /* 水平居中 */
            }

            .is-collapsed > .ContentItem-actions {
              display: flex;
              justify-content: left; /* 水平居中 */
            }

            .Comments-container{
                max-width: 660px !important;
                margin: 10px auto;
            }
            .Post-SideActions{ right: 0px !important;}`

function getCustomCSSforThisWebsite() {
    if (window.location.href.includes('//yuanbao.tencent.com/') ) {
        customCSS = `
        .hyc-common-markdown> * {
            max-width: 35em;
            margin-left: auto !important;
            margin-right: auto !important;
            line-height: 1.8em !important;
            letter-spacing:0.017em;
            font-family: Noto Serif CJK SC, PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Source Han Sans CN, sans-serif;
        }

        .ql-editor > * {
            font-family: PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Source Han Sans CN, sans-serif !important;
        }

        .agent-chat__bubble--ai, .hyc-common-markdown, .agent-chat__list__item__content,
        .hyc-component-reasoner__think, .agent-chat__bubble__content > *, pre {
            margin-left: auto !important;
            margin-right: auto !important;}

        .agent-chat__list__item {display: block;}

        .hyc-common-markdown{
                display: block !important;
                overflow-x: auto !important;
                max-height: 80vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }

        .hyc-component-reasoner__text {
            overflow-x: auto !important;
        }

        .hyc-common-markdown > *, .hyc-common-markdown__code-lan {max-height: 50vh; height: auto; margin-bottom: 40px;}

        .hyc-common-markdown__code {break-inside: avoid;}

        .agent-chat__conv--ai__speech_show, .hyc-component-reasoner,
        .agent-chat__list__item__content, .hyc-common-markdown {
            max-width: 82vw !important;
            width: auto !important;
        }
        .agent-chat__bubble__content, .agent-chat__list__item__content {width: 100%;}

        .agent-chat__list__item__content, .agent-chat__bubble__content {
            flex-grow: 1;
        }
        `
        minWidth = 850;//console.log('minWidth' + minWidth); threshold of stop applying css
    }
    if (window.location.href.includes('//zhuanlan.zhihu.com/') ) {
        customCSS = `
            .Post-Row-Content{
                width: 95vw !important;
            }
            .Post-Row-Content-left{
                width: 85vw !important;
              margin-right: 10px;
            }
            .Post-RichTextContainer{
              max-width: calc(100vw - 296px); !important;
              min-width: 692px; !important;
              width: auto !important;
            }

            #text, p, span, blockquote {line-height: 1.7em; letter-spacing: 0.025em;}

            .RichText{
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 95vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            .RichText > figure {
                break-inside: avoid;
            }
            .RichText  > :is(p, h1, h2, blockquote, ol, ul) { max-width: 550px !important;}

            .Comments-container{
                max-width: 660px !important;
                margin: 10px auto;
            }
            .Post-SideActions{ right: 0px !important;}
            .Sticky.is-fixed {position: relative !important;}
        `;//console.log('customCSS');
        minWidth = 1304;//console.log('minWidth' + minWidth); threshold of stop applying css
    }
    if (window.location.href.includes('//www.zhihu.com/column/') ) {
        customCSS = zhihuBaseCSS + `
            .Question-mainColumn, .SearchMain, .Profile-mainColumn, .css-9w3zhd, .css-1pariuy, .css-44kk6u {
              max-width: calc(100vw - 150px) !important;
              min-width: 692px !important;
              padding-right: 10px;
              width: auto !important;
            }

            .css-1ld0bim > img{max-height: 350px !important;}

            .RichContent:not(.is-collapsed) > div:first-child {
                margin-left: auto;margin-right: auto;
                margin-bottom:20px;
            }

            .css-h7wqi8{display:none;}

            .css-10l2ro8, .css-f2kkrj{width: auto; max-width: 100vw;}

            .ArticleItem-extraInfo, .ArticleItem-extraInfo>div{ margin-top:0px; margin-bottom:2px;}

            .RichContent>div:first-child, .css-cjh7n0{ margin-top:0px; margin-bottom:7px;}
        `;
        minWidth = 1304;
    }
    else if (window.location.href.includes('//www.zhihu.com/people') ) {
        customCSS = zhihuBaseCSS + `
            .Question-mainColumn, .SearchMain, .Profile-mainColumn, .css-9w3zhd, .css-1pariuy, .css-44kk6u {
              max-width: calc(100vw - 296px) !important;
              min-width: 692px; !important;
              padding-right: 10px;
              width: auto !important;
              flex-grow: 1
            }

            .RichContent:not(.is-collapsed) > div:first-child{ margin: 0 auto}

            .ArticleItem-extraInfo{ margin-top:0px;}

            .ContentItem-meta{display:none;}
        `;
        minWidth = 1304;
    }
    else if (window.location.href.includes('//www.zhihu.com/') ) {
        customCSS = zhihuBaseCSS + `
            .Question-mainColumn, .SearchMain, .Profile-mainColumn, .css-9w3zhd, .css-1pariuy, .css-44kk6u {
              max-width: calc(100vw - 296px) !important;
              min-width: 692px; !important;
              padding-right: 10px;
              width: auto !important;
              flex-grow: 1
            }

            .RichContent:not(.is-collapsed) > div:first-child{ margin: 0 auto}

            .ArticleItem-extraInfo{ margin-top:0px;}
        `;
        minWidth = 1304;
    }
    if (window.location.href.includes('//www.bilibili.com/opus/') ) {
        customCSS = `
            .opus-detail{
              max-width: 90vw !important;
              width: auto !important;
            }
            .right-sidebar-wrap{
                margin-left: 91vw !important;
            }
            .opus-module-content{
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 90vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            .opus-module-content > figure {
                break-inside: avoid;
            }
            .opus-module-content > * { max-width: 550px !important;}

            .Post-SideActions{ right: 0px !important;}
            .Sticky.is-fixed {position: relative !important;}

            .opus-tabs{
                max-width: 800px !important;
            }
        `;//console.log('customCSS');
        minWidth = 1304;//console.log('minWidth' + minWidth);
    }
    if (window.location.href.includes('//bulbapedia.bulbagarden.net/') ) {
        customCSS = `
            .ve-init-mw-desktopArticleTarget-targetContainer{
              margin-left: 20px !important;
              margin-right: 20px !important;
              max-width: 98vw !important;
              width: auto !important;
            }

            .bulbapediamonobook-body{
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 97vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 580px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            table, tbody, .catlinks {
                break-inside: avoid;
                max-width:  750px !important;
            }
            td {
            width: auto !important;
            }
            .bulbapediamonobook-body > p { max-width: 550px !important;}
        `;//console.log('customCSS');
        minWidth = 1304;//console.log('minWidth' + minWidth);
    }
    if (window.location.href.includes('dedao.cn') ) {
        customCSS = `
            .editor-show > p, blockquote {
                font-family: Noto Serif CJK SC, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif;
            }

            .iget_rich-text-panel__small .editor-show p {
                line-height: 1.8em !important;
            }

            .iget-articles, .editor-show {
                user-select: text !important;
            }

            .editor-show > svg, .em-menu-wrapper-select {
                display: none;
            }


            .article-body-wrap {
              margin-left: 20px !important;
              margin-right: 20px !important;
              max-width: 98vw !important;
              width: auto !important;
            }

            .editor-show{
                overflow-x: auto;
                margin-right: 0px !important;
                margin-left: 312px;
                max-height: 85vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 580px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            .pageControl, .article-cover {
                break-inside: avoid;
                max-width:  580px !important;
                margin: 0 auto 0 auto ;
            }
            .article-info, .article-title {
            padding-bottom: 0 !important;
            height: 50px !important;
            margin: 0px auto 0px 310px !important;
            }
            .iget-note-list {margin-left: 312px;}
            .bulbapediamonobook-body > p { max-width: 550px !important;}
        `;//console.log('customCSS');
        minWidth = 1304;//console.log('minWidth' + minWidth);
    }
    if (window.location.href.includes('mp.weixin.qq.com') ) {
        customCSS = `
            .pages_skin_pc .swiper_switch_pc {
                position: absolute;
                top: 85%;
            }
            .rich_media, .rich_media_inner, .rich_media_area_primary, .rich_media_area_primary_inner {
              margin-left: 20px !important;
              margin-right: 20px !important;
              max-width: 98vw !important;
              width: auto !important;
              max-height: 98vh !important;
              height: auto !important;
            }
            .rich_media_content {
              margin-left: 20px !important;
              margin-right: 20px !important;
              max-width: 98vw !important;
              width: auto !important;
              max-height: 80vh !important;
              height: auto !important;
            }
           .rich_media_content {
                overflow-x: auto;
                margin-right: 0px !important;
                margin-left: 312px;
                max-height: 90vh !important;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 580px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }

            .pages_skin_pc .rich_media_global_msg_inner, .pages_skin_pc .rich_media_area_primary_inner, .pages_skin_pc .rich_media_area_extra_inner {
                margin-left: 0;
                margin-right: 0;
            }
            .not_in_mm .qr_code_pc {
                right: 95vw;
            }

            img {
                max-width: 450px !important;
            }
        `;
    }
    if (window.location.href.includes('.nga.') ){
        customCSS = `
            .Post-Row-Content{
                width: 95vw !important;
            }
            .Post-Row-Content-left{
                width: 85vw !important;
            }
            .Post-RichTextContainer{
              max-width: calc(95vw - 306px); !important;
              width: auto !important;
            }

            .postcontent{
                display: block !important;
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 70vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            .postcontent > figure, .quote {
                break-inside: avoid;
                max-height: 70vh;
            }
            .postcontent > :not(div) { display: inline-block;}

            .Comments-container{
                max-width: 800px !important;
            }
            .Post-SideActions{ right: 0px !important;}
            .Sticky.is-fixed {position: relative !important;}
            #mc {margin-bottom: 49px;}
        `;//console.log('customCSS');
        minWidth = 1304;//console.log('minWidth' + minWidth); threshold of stop applying css
    }
    if (window.location.href.includes('bbs.yamibo.com') ){
        customCSS = `
            .Post-Row-Content{
                width: 95vw !important;
            }
            .Post-Row-Content-left{
                width: 85vw !important;
            }
            .Post-RichTextContainer{
              max-width: calc(95vw - 306px); !important;
              width: auto !important;
            }

            .t_f{
                display: block !important;
                overflow-x: auto;
                margin-right: 0px !important;
                max-height: 90vh;
                column-count: auto; /* 设置为你想要的列数 */
                column-width: 550px !important; /* 设置列宽 */
                column-gap: 15px; /* 设置列之间的间距 */
                column-fill: auto;
            }
            .t_f > figure {
                break-inside: avoid;
            }
            .t_f > * { max-width: 550px !important; display: block;}

            .Comments-container{
                max-width: 800px !important;
            }
            .Post-SideActions{ right: 0px !important;}
            .Sticky.is-fixed {position: relative !important;}
        `;//console.log('customCSS');
        minWidth = 904;//console.log('minWidth' + minWidth); threshold of stop applying css
    }
}