// ==UserScript==
// @name          部分网页美化
// @description   替换部分字体，修改间距之类的
// @author        Sign_Up
// @version       2.9.1
// @license       CC-BY-NC-ND-4.0
// @namespace     https://greasyfork.org/zh-CN/scripts/411238-部分网页美化
// @icon          https://img.icons8.com/fluency/344/physics.png
// @run-at        document-start
// @grant         GM_addStyle
// @match         *://baike.baidu.com/*
// @match         *://fanyi.baidu.com/*
// @match         *://*.caiyunapp.com/*
// @match         *://translate.google.com/*
// @match         *://transmart.qq.com/*
// @match         *://*.weixin.qq.com/*
// @match         *://*.xiaohongshu.com/*
// @match         *://*.bing.com/*ranslator*
// @match         *://chat.openai.com/*
// @match         *://chatgpt.com/*
// @match         *://*.ixigua.com/*
// @match         *://music.migu.cn*
// @match         *://*.deepl.com/*
// @match         *://docs.sw.siemens.com/*
// @match         *://duckduckgo.com/*
// @match         *://*.engadget.com/*
// @match         *://*.bbc.com/*
// @match         *://*.foxnews.com/*
// @match         *://*.mysmth.net/*
// @match         *://*.reuters.com/*
// @match         *://*.voachinese.com/*
// @match         *://twitter.com/*
// @match         *://*.inoreader.com/*
// @match         *://*.theverge.com/*
// @match         *://*.weibo.com/*
// @match         *://*.carsi.edu.cn/*
// @match         *://*.acs.org/*
// @match         *://*.annualreviews.org/*
// @match         *://*.aanda.org/*
// @match         *://*.asme.org/*
// @match         *://*.aps.org/*
// @match         *://*.aip.org/*
// @match         *://arxiv.org/*
// @match         *://*.clarivate.com/*
// @match         *://*.cell.com/*
// @match         *://*.degruyterbrill.com/*
// @match         *://*.dimensions.ai/*
// @match         *://*.frontiersin.org/*
// @match         *://github.com/*
// @match         *://*.ieee.org/*
// @match         *://*.iop.org/*
// @match         *://*.mathworks.cn/*
// @match         *://*.mathworks.com/*
// @match         *://*.mdpi.com/*
// @match         *://*.nature.com/*
// @match         *://*.ncbi.nlm.nih.gov/*
// @match         *://*.osapublishing.org/*
// @match         *://*.optica.org/*
// @match         *://*.pnas.org/*
// @match         *://*.researchgate.net/*
// @match         *://*.rsc.org/*
// @match         *://*.sciencedirect.com/*
// @match         *://*.science.org/*
// @match         *://sci-hub.st/*
// @match         *://*.semanticscholar.org/*
// @match         *://*.spiedigitallibrary.org/*
// @match         *://*.springer.com/*
// @match         *://*.springeropen.com/*
// @match         *://*.stackexchange.com/*
// @match         *://stackoverflow.com/*
// @match         *://*.tandfonline.com/*
// @match         *://*.webofscience.com/*
// @match         *://*.wiley.com/*
// @match         *://*.wikipedia.org/*
// @match         *://*.wolfram.com/*
// @match         *://*.scopus.com/*
// @match         *://zenodo.org/*
// @match         *://*.iphy.ac.cn/*
// @match         *://*.x-mol.com/*
// @match         *://*muchong.com/*
// @downloadURL https://update.greasyfork.org/scripts/411238/%E9%83%A8%E5%88%86%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/411238/%E9%83%A8%E5%88%86%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = "";
    if (location.href.startsWith("")) {
        css += `
            p { font-weight:400; font-size: 20px; text-align: justify; line-height: 1.6 !important; }
            //.MJXc-display {margin: 0.5em 0 !important; font-size:20px !important;}
            // ::selection {background-color: #1951a0; color: #fff;}
            // ::-webkit-scrollbar { width: 12px; /* background-color: #F5F5F5; */ }
            // ::-webkit-scrollbar-track { border-radius: 6px; }
            //::-webkit-scrollbar-thumb { border-radius: 6px; /*background-color: #b0bec5;*/ height: 10%; }
            `;
    }
    // ----------------------------------百度百科----------------------------------
    if (location.host.includes('baike.baidu.com')) {
        css += `
            button, html, input, select, textarea { font-family: Roboto Medium, 'Sarasa UI SC Semibold', sans-serif !important; }
            .body-wrapper .para, .para_vJPDN { font-family: Roboto Medium, 'Sarasa UI SC Semibold', sans-serif; font-size: 18px !important; text-align: justify; line-height: 1.66; color: #222; }
            `;
    }
    // ----------------------------------百度翻译----------------------------------
    if (location.host.includes('fanyi.baidu.com')) {
        css += `
            p {font-size: unset; line-height: 1.5 !important; }
            .inner, .inner-te { width: 1300px !important; }
            .trans-left, .trans-right {width: 49.5% !important; }
            // .trans-input-wrap, .output-wrap { border: 2px #283593 ridge; border-radius: 5px; }
            .textarea { color: #111 !important; }
            .small-font, .ordinary-output { text-align: justify; font-family: Roboto,sans-serif !important; line-height: 1.5 !important; font-weight: 400; color: #111 !important; }
            .ordinary-wrap { background-color: #fff !important; }
            .ordinary-output { padding: 10px !important; }
            .sample-wrap .sample-resource a, .sample-wrap .sample-resource span { color: #9fa8da; font-size: 14px; }
            `;
    }
    // ----------------------------------谷歌翻译----------------------------------
    if (location.host.includes('translate.google.com')) {
        css += `
            p {font-size: unset; line-height: 1.5 !important; }
            .MOkH4e { max-width: 1400px !important; }
            `;
            // textarea { text-align: justify !important; line-height: 1.5 !important; }
    }
    // ----------------------------------Bing翻译----------------------------------
    if (location.href.includes('bing.com/translator')) {
        css += `
            p {font-size: unset; line-height: 1.5 !important; }
            #tt_translatorHome {  width: 75% !important; }
            textarea#tta_input_ta { width: 88% !important; text-align: justify; line-height: 1.5; }
            textarea#tta_output_ta { text-align: justify; line-height: 1.6; }
            #tta_clear_cnt { left: 92% !important; }
            select#tta_srcsl, select#tta_tgtsl { font-size: 17px !important; height: 30px !important; font-weight: bold;}
            `;
    }
    // ----------------------------------彩云小译----------------------------------
    if (location.host.includes('*.caiyunapp.com')) {
        css += `
            p {font-size: unset; line-height: 1.5 !important; }
            .lang-container { max-width: 1200px; min-width: 1200px; margin: auto auto !important; }
            .textinput[data-v-745fa261] { font-family: roboto, 'Sarasa UI SC Semibold', sans-serif !important; font-weight: 500px !important; text-align: justify !important; font-size: 20px !important; line-height: 1.2 !important; }
            `;
    }
    // ----------------------------------咪咕音乐----------------------------------
    if (location.host.includes('music.migu.cn')) {
        css += `
            p { font-weight:400; font-size: 20px; text-align: unset; line-height: 1.667 !important; }
            #header .header .header-right { margin-right: 300px !important;}
            `;
    }
    // ----------------------------------西瓜视频----------------------------------
    if (location.host.includes('ixigua.com')) {
        css += `
            body { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; }
            `;
    }
    // ----------------------------------小木虫----------------------------------
    if (location.host.includes('muchong.com')) {
        css += `
            p { font-weight:400; font-size: 16px; text-align: unset; line-height: 1.667 !important; }
            body, button, input, select, textarea { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; font-size:14px !important; line-height: 1.5; }
            th, tr, fieldset { font-size: 15px !important; line-height: 1.5 !important; }
            .forum_Cont .pls_user ul { line-height: 1.5 !important; }
            `;
    }
    // ----------------------------------腾讯交互翻译----------------------------------
    if (location.host.includes('transmart.qq.com')) {
        css += `
            body, button, input, select, textarea { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; font-size:16px !important; color: #000 !important;}
            div, textarea { text-align: justify !important; letter-spacing: normal !important; }
            `;
    }

    // ----------------------------------微信公众号----------------------------------
    if (location.host.includes('weixin.qq.com')) {
        css += `
            .pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner { max-width: 900px !important; }
            body.wx_wap_page { font-family: Arial, sans-serif !important; }
            `;
    }

    // ----------------------------------小红书----------------------
    if (location.host.includes('xiaohongshu.com')) {
        css += `
            body, html { font-family: Arial, sans-serif !important; }
            .right { font-size: 17px !important; }
            `;
    }

    // ---------------------------------- Siemens文档 ----------------------
    if (location.host.includes('docs.sw.siemens.com')) {
        css += `
            p {font-size:unset;}
            body { font-size: 17px !important; }
            `;
    }

    // ----------------------------------ACS/arxiv----------------------------------
    if (location.host.includes('.acs.org') || location.host.includes('arxiv.org')) {
        css += `
            .abstract,.article_content, .articleBody_abstractText {
                font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa Gothic SC Semibold', serif !important;
                font-size: 20px !important;
                font-weight:400 !important;
                text-align: justify;
                line-height: 1.6 !important;
            }
            :root {
                --main-width: 68rem;
                --headings-font-family: "Arial";
                --text-font-family: "Bitter Medium";
                --toc-font-family: "Sarasa Gothic SC Semibold";
                --other-font-family: "Bitter Medium";
                --bs-font-sans-serif: Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                --bs-font-monospace: Consolas, "Courier New", monospace;
            }
            p { font-weight: 400; font-size: 20px; text-align: justify; line-height: 1.6 !important; }
            .article .rqv-container .ref-content {font-size: 14px !important; text-align: justify;}
            .container_scaled-down { padding-left: 40px !important; padding-right: 40px !important; }
            .container { width: auto !important; margin-right: 40px !important; margin-left: 40px !important; }
            .article_content .MathJaxEquation { margin: 0 auto !important; }
        `;
    }
    // ----------------------------------AIP----------------------------------
    if (location.host.includes('pubs.aip.org')) {
        css += `
            .article-body p, .center-content .content p, em, .citation div, [data-widgetname=ArticleFulltext]{font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important; font-size: 20px !important; line-height: 1.6 !important;}
            .pg_article .article-browse_content:not(.has-jump-link-flyout) {max-width: 1600px !important; grid-template-columns: 200px auto 300px !important;}
            `;
            //  .article-body p, .block-child-p, [data-widgetname=ArticleFulltext] {
            //     font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important;
            //     font-size: 20px !important;
            //     line-height: 1.6 !important;
            //     text-align: justify;
            // }
    }
    // ----------------------------------A&A----------------------------------
    if (location.host.includes('aanda.org')) {
        css += `
            #article p {font: 18px/1.6 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important;}
            .wrap {max-width: 1500px !important;}
            `;
    }
    // ----------------------------------APS----------------------------------
    if (location.host.includes('.aps.org')) {
        css += `
        `;
    }
    // ----------------------------------ASME----------------------------------
    if (location.host.includes('.asme.org')) {
        css += `
            p,.block-child-p, [data-widgetname=ArticleFulltext] { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-size: 20px !important;}
            .article-browse_content.clearfix {max-width: 1650px !important;} .pg_articlesplitview .aside {max-width: 25%; flex:auto;} .pg_articlesplitview .article {max-width: 75%; flex:auto;}
            `;
    }
    // ----------------------------------CELL----------------------------------
    if (location.host.includes('.cell.com')) {
        css += `
            .col-lg-9 { width: 80%; }
            .article__sections { padding-right: 20px !important; }
            .article__body .left-side-nav, .formulaLabel { width: 15% !important; }
            .article__body { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-size: 20px !important; text-align: justify; line-height: 1.6667 !important; color: #222 !important;}
            .section-paragraph figure:first-child { text-align: center !important; }
        `;
        window.onload = function() {
            $("br").remove();
        }
    }
    // ----------------------------------ChatGPT----------------------------------
    if (location.host.includes('chatgpt.com')) {
        css += `
            p,.text-base { font-size: 17px; line-height: 1.5 !important; max-width: 55rem !important; }
            html { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; }
            `;
    }
    // ----------------------------------Deepl----------------------------------
    if (location.host.includes('.deepl.com')) {
        css += `
            p { font-size: 17px; line-height: 1.5; }
            body *:not(.fa) {text-align: justify; }
            .lmt--web .lmt__textarea {font-weight:400; font-size: 17px; text-align: justify; line-height: 1.5; color: #000 !important;}
            .lmt__source_textarea_overlay .lmt__source_textarea_overlay__sentence--active{background-color:#faa20061 !important;}
            `;
    }
    // ----------------------------------Degruyter----------------------------------
    if (location.host.includes('.degruyterbrill.com')) {
        css += `
            p, .p {font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; color: #000 !important;}
            div#docContent { max-width: 100% !important; }
            .col-lg-8 { max-width: 60% !important; }
            .col-lg-3 { flex: 0 0 15% !important; max-width: 15% !important; margin-top: 10% !important;}
            .offset-lg-1{ margin-left:18%; margin-right: 1%; }
            .container-fluid {max-width: 92% !important;} /*新版degruyter主栏宽度*/
            `;
    }
    // ----------------------------------Duckduckgo----------------------------------
    if (location.host.includes('duckduckgo.com')) {
        css += `
            body, input, select, textarea { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif; } /*网页字体*/
            .result__url, .result__url:active, .result__url:visited:focus { color: #202124; } /*链接颜色*/
            .result__snippet { color: #4d5156; }
            .result__a { color: #1a0dab; }
            #links .result__title b, #links .result__title strong { font-weight: bold !important;} /*搜索标题*/
            .c-info, .c-base, .c-icon, .c-list, .c-product, .c-detail, .zci__main.has-aux, .zci__main--answer, .results--main, .forecast-wrapper .module--forecast .module__detail--hours__labels, .zcm-wrap--header {max-width: 700px;}
            .cw, .cw--c {max-width: 75%;} .results--sidebar {margin-left:800px;}
            /*html{font-size: 92%;} p {font-size: unset;}*/
            .result__type, .result__pagenum {color:#de5833 !important;} .result--sep--hr:before {background-color: #de5833 !important; height:2px;} /*分页标志颜色*/
            `;
    }
    // ----------------------------------Dimensions.ai----------------------------------
    if (location.host.includes('.dimensions.ai')) {
        css += `
            html { font-size: 92% !important; }
            header.sc-iTVJFM { background-color: aliceblue !important; font-weight: 500 !important; font-size: 16px !important; }
            [data-bt="publication_metadata"] { color: #ad4062 !important; font-weight: bold; }
            [data-testid="abstract-wrapper"] { text-align: justify; }
            [data-bt="detail_link"] { line-height: 1.5; }
            [data-bt="detail_link"]:hover { text-decoration: 2px underline; text-underline-offset: 3px; }
            [data-bt="facet_title"] { font-weight: bold !important; }
            `;
    }
    // ----------------------------------Elsevier----------------------------------
    if (location.host.includes('.sciencedirect.com')) {
        css += `
            p { font-weight:unset; font-size: unset; line-height: 1.667 !important; }
            body { font-family: Roboto, 'Sarasa Gothic SC Semibold', sans-serif !important; }
            .Body, .Tail { font-size: 20px !important; }
            .u-font-serif,.Article p { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa Gothic SC Semibold' !important; text-align: justify !important; }
            .Article .article-wrapper {max-width: 94vw !important;}
            .col-lg-12, .row>.col-lg-12 {width: 70% !important;}
            .col-lg-6, .row>.col-lg-6 { width: 18% !important; }
            /*.TableOfContents { display: none !important; position: fixed; top: 80px; width: 10%; overflow-y: auto; height: 70%; z-index: 3; background-color: #fff; }*/
            .text-xs { z-index: 4; }
            .Body .formula, .Tail .formula, .figure { text-align: center !important; }
            .Abstracts { font-size: 20px !important; line-height: 1.667; }
            .MathJax { font-size: 92% !important; } .mjx-chtml { font-size: 110% !important; }
            `;
    }
    // ----------------------------------Github----------------------------------
    if (location.host.includes('github.com')) {
        css += `
            p{ font-size: unset; line-height: unset !important; font-weight: unset;}
            body, .markdown-body { font-family: Roboto, 'Sarasa Gothic SC Semibold', sans-serif, Apple Color Emoji, Segoe UI Emoji !important; }
            `;
    }
    // ----------------------------------JCR----------------------------------
    if (location.host.includes('.clarivate.com')) {
        css += `
            p{ text-align: unset;}
            ::-webkit-scrollbar { width: 12px; } ::-webkit-scrollbar-thumb { background: #311b92; } ::-webkit-scrollbar-track { box-shadow: inset 19px 1px 12px 15px #dfdfdf; }
            `;
    }
    // ----------------------------------Inoreader----------------------------------
    if (location.host.includes('.inoreader.com')) {
        css += `
            p { font-size: unset; line-height: unset !important; }
            .compact_sidebar .tree_node { font-size: 14px; }
            .column_view_title { font-size: 16px !important; }
            .article_unreaded:hover, div.article_unreaded:hover, .articlunreaded:hover, div.article_current_3way, .article_current_3way .arrow_div, .article_current_3way .popularity_div { background-color: #e7b6bb  !important; }
            div.article_current_3way { background-color: #eef4fc; box-shadow: inset 0 0 0 2px #5b93e1, inset -4px 1px 0 0px #5b93e1; }
            .font_size_2.font_size_titles .article_header_text { line-height: 1.6 !important; }
            `;
    }
    // ----------------------------------IEEE----------------------------------
    if (location.host.includes('ieee.org')) {
        css += `
            .global-ng-wrapper[_ngcontent-mnt-c0] { max-width: 1600px !important;}
            .ng-document .document-main { flex: 0 0 95% !important; max-width: 95% !important; }
            .col-3 { -ms-flex: 0 0 20% !important; flex: 0 0 20% !important; max-width: 20% !important; }
            .ng-document .document-full-text-content div.col-text { flex: 0 0 95% !important; max-width: 95% !important;}
            .col-3-24 { -ms-flex: 0 0 4% !important; flex: 0 0 4%; max-width: 4% !important; }
            .ArticlePage #article, .u-mb-1 { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-size: 20px !important; text-align: justify !important; line-height: 1.6 !important; }
            p { font-family: unset; font-size: unset; text-align: justify; line-height: unset; }
            .ArticlePage #article .article-hdr H2 { width: 100% !important; }
            `;
    }
    // ----------------------------------IOP----------------------------------
    if (location.host.includes('iop.org')) {
        css += `
            body{ color:#000 !important; }
            p { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; }
            .article-text, .chapter-text { font-size: 20px !important; }
            .wrapper { max-width: 1400px !important; width: 100% !important; margin: 0 auto 0 18% !important;}
            .sticky.content-nav-ul { max-width: unset; max-height: unset; font-size: 16px;}
            .da-all .da1-da2, .da1-da2.da1-da2 { width: 90% !important; }
            .mjx-box { text-align: center !important; }
            `;
    }
    // ----------------------------------MATLAB----------------------------------
    if (location.host.includes('.mathworks.cn') || location.host.includes('.mathworks.com')) {
        css += `
            p {font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif; font-size: 16px !important; line-height: unset!important;}
            .offcanvas_nav *, #doc_center_content *:not(sup):not([class*="vjs"]) { font-size: 16px !important; }
            #doc_center_content, #subnav .crux_browse>li { font-size: 16px !important; font-weight:500; }
            pre{ font-size: 15px; }
            .panel-group .panel-heading { background: #e9eaf6 !important;}
            `;
    }
    // ----------------------------------mdpi----------------------------------
    if (location.host.includes('.mdpi.com')) {
        css += `
            p {font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif; font-size: unset; line-height: unset!important;}
            h2 { font-size: 20px !important; font-weight: bold !important; }
            h4 { font-size: 20px !important; }
            article.bright { font-size: 16px !important; }
            .html-p { font-size: 20px !important; line-height: 1.667 !important; font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', serif !important; }
            .html-fig_description,.html-caption{ font-size: 16px !important; line-height: 1.5 !important; font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; }
            .middle-column__main {}
            #container{max-width: 1460px !important;}
            .row, .row.full-width { max-width: 1450px !important; }
            .mjx-chtml {font-size:110% !important;}
            `;
    }
    // ----------------------------------Nature----------------------------------
    if (location.host.includes('.nature.com')) {
        css += `
            .u-container { max-width: 90% !important; margin-left: 25% !important; margin-right: auto; }
            .c-article-main-column { font-family: Harding, Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important; margin-right: 3% !important; font-size:20px; line-height: 1.6!important;} //
            .c-article-body {font-size: 20px !important; text-align: justify; color: #000 !important; }
            .c-reading-companion__sticky { max-width: 550px !important; }
            .content { max-width: 1400px !important; }
            .c-article-equation { margin-bottom: 0.8rem !important; }
            p { margin-bottom: 0.8rem !important; }
            `;
    }
    // ----------------------------------OSA----------------------------------
    if (location.host.includes('optica.org')) {
        css += `
            body { font-family: sans-serif; }
            /*html { background-image: none; } 无背景*/
            p, .single-article .main-content { font-family: sans-serif; font-size: 19px !important; text-align: justify;}
            .container, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl { max-width: 1500px !important; }
            .container {width: 85% !important;} /* 主宽度 */
            .col-sm-push-9 {left: 80%;} .col-sm-3 {width: 20%;} /* 右侧栏宽度及位置 */
            .col-sm-pull-3 {right: 20%;} .col-sm-9 {width: 80%;} /* (左+中)栏宽度及位置 */
            .col-md-3 {width: 20%;} .col-md-9 {width: 80%;} /* 左、中栏宽度及位置 */
            `;
            // .article-math-block { margin: 0rem !important; cursor: text !important; user-select: text !important; }
            // .article-math-block a.math-controls { clear: none !important; float: right; margin: 2rem 0rem !important; }
            // .mjx-chtml { font-size: 110% !important; }
        // show mathjax menu
        // var osa_config = document.createElement("script");
        // osa_config.type = "text/x-mathjax-config";
        // osa_config.text = 'jax = "CommonHTML"; MathJax.Hub.setRenderer(jax);';
        // document.head.appendChild(osa_config);
    }
    // ----------------------------------PNAS----------------------------------
    if (location.host.includes('.pnas.org')) {

        css += `
        article { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', serif !important; font-size:20px !important; text-align: justify !important; }
        #abstracts, .core-container { max-width: 1000px !important; }
        article[data-design] [role=paragraph] { text-align: justify; line-height:1.6 !important; }
        .citations, .citations,.core-collateral { font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; font-size:17px !important; line-height:1.5 !important; text-align: justify !important; }
        figcaption { font-size: 16px !important; line-height: 1.4 !important; text-align: justify !important; color: #222 !important; }
        .mjx-chtml {font-size:100% !important;}
        `;
        // #abstracts{max-width: 100% !important;}
        // article[typeof=BlogPosting], article[typeof=ScholarlyArticle] { max-width: 1000px !important; margin-right: 530px !important; }
        // nav[data-core-nav=collateral] {right:475px !important;} /*右侧导航栏位置*/
        // .sections-navigation__container { max-width: 250px; } /*左侧导航栏宽度*/
        // nav[data-core-nav=collateral] a:hover:after{ background: #1c75bc; } nav[data-core-nav=collateral] a:not(.active):hover{ color: #fff !important; }/*右侧导航栏颜色*/
        // .core-collateral { max-width: 480px !important; } /* 右侧边栏 */
        // nav.sections-navbar { left:5%!important; max-width: 250px !important; font-size: 14px; font-weight: 500;} .sections-navbar ul { max-width: calc(100% - 10px); text-align: left !important;}  /*左侧导航栏位置*/
        // article .display-formula .label{ margin-top: -4rem !important;}
    }
    // ----------------------------------PubMed----------------------------------
    if (location.host.includes('.ncbi.nlm.nih.gov')) {
        css += `
            .MathJax_Display { margin: 0 !important;}
            article, #mc { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Source Serif 4', 'Sarasa UI SC Semibold' !important;  font-size: 20px !important; }
            `;
    }
    // ----------------------------------RCS----------------------------------
    if (location.host.includes('.rsc.org')) {
        css += `
            .pubs-ui .layout__panel--60 { width: 75%; } .pubs-ui .layout__panel--40 { width: 25%; }
            .pubs-ui #wrapper p, .pubs-ui #wrapper span { text-align: justify; line-height: 1.7 !important;}
            .pubs-ui #wrapper h1, .pubs-ui #wrapper h2, .pubs-ui #wrapper h3, .pubs-ui #wrapper h1 > span, .pubs-ui #wrapper h2 > span, .pubs-ui #wrapper h3 > span { text-align: initial !important; }
            .pubs-ui .viewport, .pubs-ui.ahtml-page .viewport { max-width: 1200px !important; }
            body.pubs-ui, .pubs-ui, body.oxy-ui { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Source Serif 4', 'Sarasa UI SC Semibold' !important; font-size: 20px !important; text-align: justify; }
            `;
    }
    // ----------------------------------ResearchGate----------------------------------
    if (location.host.includes('.researchgate.net')) {
        css += `
            .nova-e-text--size-m { font-size: 12pt; line-height: 1.5;}
            .nova-e-text--size-l { font-size: 13pt; }
            .nova-e-text--size-xl {font-size: 16pt;}
            .c-col-content, .c-content { width: 1100px; } /*宽度*/
            .cols-65-35 .c-content { width: 70%; }
            .cols-65-35 .c-col-right {width: 30%;}
            .nova-legacy-c-modal__window { max-width: 900px !important; }
            .content-layout,.content-grid { max-width: 1100px !important;} /*文章正文宽度*/
            div#footer-sidebar { height: 100px !important; }
            .home-feed-activities__item { box-shadow: 0px 5px 5px 0px #888; } /*卡片阴影*/
            .nova-c-card--elevation-none { border: 1px solid #999;}
            `;
    }
    // ----------------------------------Science----------------------------------
    if (location.host.includes('.science.org')) {
        css += `
            article [role=paragraph] { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', serif !important; font-size:20px !important; line-height:1.667 !important; text-align: justify !important; }
            [data-has~=right-rail] { grid-template-columns: 18% minmax(0%, 1500px) minmax(150px, 15%) 5% !important; }
            .core-container { max-width: 1000px !important; }
            [data-has~=right-rail] [data-core-wrapper=content] { max-width: 1000px !important; width: unset !important; }
            #article_sections_menu, [aria-controls=article_sections_menu] { left: -240px !important; }
            #article_collateral_menu {right: -150px !important; }
        `;
            // [data-has~=right-rail] [data-core-wrapper=content], [data-has~=right-rail] #abstracts { max-width: calc(96% - 0.25rem) !important; width: 100% !important;}
            // .core-container { margin-left: 10px !important;}
            // [data-core-nav=article] ul li a:before, .sections-navigation .nav-link:after {top: 50% !important;} /*左侧导航栏标记*/
            // [data-core-nav=article] ul li a[aria-current=true] { text-decoration: underline !important; } /*左侧导航栏下划线*/
            // #article_collateral_menu {right:-100px !important;}  /*右侧导航栏*/
            // [data-core-nav=collateral] a:before { background: #ca2015 !important; }  /*右侧导航栏*/
            // [data-core-nav=collateral] a:not(.active):hover{ color: #fff !important; }  /*右侧导航栏*/
            // .fv__panel { width: 450px !important;  }
            // .js-open-info--opened .fv__slideshow,.js-open-info--opened .fv__toolbar{ width: calc(100% - 450px) !important; }
            // .citation-content, .footnote, .notes, .caption, figure .core-attribution, figure [role~=doc-footnote] { text-align: justify !important; font-size: 16px !important; line-height: 1.4 !important; }
            // i { font-style: normal !important; }
    }
    // ----------------------------------Sci-Hub----------------------------------
    if (location.host.includes('sci-hub.')) {
        css += `
            #rollback img { max-width: 50px !important; }
            `;
    }
    // ----------------------------------Semantic Scholar----------------------------------
    if (location.host.includes('.semanticscholar.org')) {
        css += `
            p {font-size: unset;}
            .cl-paper-venue, .paper-meta-item { color: #af0525 !important; font-weight: bold;} /* 列表中高亮期刊名颜色 */
            .flex-item--width-60 { width: 80% !important; } /* 详情页标题和摘要宽度 */
            .fresh-paper-detail-page__header .doi .doi__link{text-decoration: underline; font-weight: bold; color:#0069d9;}
            .cl-paper-title { display: contents; font-size: 18px !important; }
            .cl-paper__bulleted-row .cl-paper__bulleted-row__item::after, .paper-meta li:after, .cl-paper-stats-list:after {  content: "  ┃  " !important; }
            .paper-meta, .cl-paper__bulleted-row,.cl-paper__bulleted-row.cl-paper-controls { padding: 5px 0; }
            .cl-button, .cl-paper-authors, .cl-paper-fos, .cl-paper-pubdates, .cl-paper-venue, .paper-meta, .figure-meta-left { font-size: 15px !important; }
            .text--preline, .cl-paper-abstract, .similar-papers__paper-card, .tldr-abstract-replacement { font-size: 15px; text-align: justify; line-height: 1.24 !impotant;}
            .card { box-shadow: 0 0 10px 5px #b0bec5; } .paper-nav__nav-link { font-weight: bold !important; font-size: 17px !important; }
            .paper-nav .paper-nav__is-prominent .paper-nav__nav-link, .paper-nav__nav-item.paper-nav__is-prominent, .paper-nav__nav-item:active, .paper-nav__nav-item:hover { background-color: #fff !important; }
            `;
    }
    // ----------------------------------SPIE----------------------------------
    if (location.host.includes('.spiedigitallibrary.org')) {
        css += `
            p, .ArticleContentText {font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-weight: 400; font-size: 20px !important; text-align: justify !important; line-height: 1.5 !important; }
            .ArticleContentRow{text-align: justify !important;}
            .container,.container.SPIEPanel { width: 1800px !important; }
            .PAHArticleCol {width: 100% !important;}
            .col-xs-8 { width: 90% !important; padding: 0px 30px; background-color: white !important; }
            .col-xs-4 { width: 40% !important; }
            .MathJax_Display { margin: 0.2em 0em !important; }
            .SPIEPanel { width: 1500px !important; margin-right: 0; margin-left: 0;}
            `;
    }
    // ----------------------------------Springer----------------------------------
    if (location.host.includes('.springer.com')) {
        css += `
            .main-container { max-width: 1500px; }
            .main-body { max-width: 1050px; }
            .FulltextWrapper .Para { font-size: 20px; font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', serif !important; text-align: justify !important; line-height: 1.6 !important;}
            .FulltextWrapper .Equation { margin: 0.25em 0;}
            .toc a { font-family: Roboto, sans-serif !important; font-size: 16px !important; padding: 0 !important; line-height: 1.5 !important; }
            .CitationContent { font-size: 18px; font-family: Roboto, 'Sarasa UI SC Semibold' !important; text-align: justify !important;}
            .SimplePara { font-family: Roboto, sans-serif !important; font-size: 17px !important; line-height: 1.5 !important; max-width: 100% !important;}
            .MathJax, .MathJax_Display, .MJXc-display, .Figure { text-align: center !important; margin: 0.25em 0;}
            `;
    }
    // ----------------------------------springeropen----------------------------------
    if (location.host.includes('.springeropen.com') || location.host.includes('.springer.com')) {
        css += `
            p { line-height: 1.6 !important; }
            .u-container { max-width: 85% !important; }
            .c-article-main-column { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important; font-size:20px; line-height: 1.667!important; margin-right: 2.6% !important; width: 66.2% !important; }
            .c-reading-companion__sticky { max-width: 489px !important; }
            .MathJax, .c-article-section__figure-content { text-align: center !important; }
            `;
    }
    //----------------------------------stackoverflow/stackexchange----------------------------------
    if (location.host.includes('stackoverflow.com') || location.host.includes('stackexchange.com')) {
        css += `
            p { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important; font-size: 17px !important; }
            html, body { font-size: 17px !important; --ff-sans: Roboto,sans-serif !important; --theme-question-body-font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif !important;}
            .comment-text, .flag-action-card-text { font-size: 15px !important; text-align: justify; }
            #hot-network-questions a, #sidebar .related a, #sidebar .linked a { font-size: 14px; }
            .question-hyperlink { font-size: 20px; }
            body>.container { max-width: 1400px !important; }
            #content { max-width: 1500px !important; }
            `;
    }
    // ----------------------------------水木----------------------------------
    if (location.host.includes('.mysmth.net')) {
        css += `
            html,body,.a-bottom { font-size:15px !important; font-family: Roboto, 'Sarasa UI SC Semibold', sans-serif !important; }
            #main { margin-left: 250px !important; padding: 20px 20px !important; }
            #menu { width: 240px !important; }
            `;
    }
    // ----------------------------------Taylor & Francis----------------------------------
    if (location.host.includes('.tandfonline.com')) {
        css += `
            p { font-family: Bitter Medium, 'LXGW WenKai Screen', serif !important; font-size: 20px; line-height: 1.55 !important; }
            .col-md-7-12 { width: 80% !important; }
            .col-md-1-6 { margin: 0 0 !important; }
            `;
            // .mjx-chtml {font-size:21px !important;}
    }
    // ----------------------------------twitter----------------------------------
    if (location.host.includes('twitter.com')) {
        css += `
            p { font-size: 20px; line-height: 1.55 !important; }
            .r-rthrr5 { width: 1140px !important; }
            .r-1ye8kvj { max-width: 750px !important; }
            `;
    }
    // ----------------------------------WebofScience----------------------------------
    if (location.host.includes('.webofscience.com')) {
        css += `
            html {font-size: 20px;} p {font-size:unset; line-height:unset !important;}
            body {font-family: Roboto, 'Sarasa UI SC Semibold' !important; }
            .summary-page app-refine-panel { width: 15.5rem !important;}
            .summary-source-title { color: #e91e63; font-weight: bold; }
            .page-bar .top-toolbar .dropdown { box-shadow: 0 0 0 1px #564695 !important; }
            `;
    }
    // ----------------------------------Wiley.com----------------------------------
    if (location.host.includes('.wiley.com')) {
        css += `
            .container {width: 83% !important; margin-right: 50px !important;}
            .article-section__content,.article-section__full .article-section__content p {font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-weight: 400; font-size: 20px !important; text-align: justify; line-height: 1.667 !important; }
            .article-section__inline-figure figcaption .figure__caption-text {font-family: Roboto, 'Sarasa UI SC Semibold' !important; font-size: 16px !important; text-align: justify; line-height: 1.4 !important;}
            span.figure, span.figure .figure__image {display: inline-block !important;} .figure {padding:0 !important;}
            mjx-container.MathJax .MJX-TEX { font-size: 100% !important; }
            .inline-equation { font-size: 100% !important; margin: 0px !important; }
            `;
    }
    // ----------------------------------Wikipedia----------------------------------
    if (location.host.includes('.wikipedia.org')) {
        css += `html {font-size: 20px;} p {font-size: unset;}`;
    }
    // ----------------------------------Wolfram----------------------------------
    if (location.host.includes('.wolfram.com')) {
        css += `
            h1, h2, h3, h4, h5, h6{font-weight: bold !important;}
            #monograph section .inner, #monograph .TutorialAbstract .inner, #monograph .breadcrumb, #monograph .overview-menu-items { font-family: roboto, 'Sarasa UI SC Semibold' !important; }
            p.Text, ul.Text, .TechNoteText { font-size:20px !important; }
            .MCap { font-family: Bitter Medium, 'LXGW WenKai Screen', 'Sarasa UI SC Semibold' !important; font-size:16px !important; }
        `;
    }
    // ----------------------------------x-mol----------------------------------
    if (location.host.includes('.x-mol.com')) {
        css += `
            .magazine-text-title, .magazine-text span a, p { font-size: 18px !important; line-height: 1.6 !important; color: #000 !important; }
            .magazine-text p { font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', serif !important; }
            .magazine-text-atten, .it12 { font-size: 15px!important; }
            .container, .col960 { max-width: 1300px !important; width: 1300px !important; }
            .magazine-model-content-new, .magazine-model-content-new ul, .magazine-model-content-new ul li, #content-new { width: 1100px !important; }
        `;
    }
    // ----------------------------------Zenodo----------------------------------
    if (location.host.includes('zenodo.org')) {
        css += `
            body {font-size: 16px;}
            p {text-align: unset;}
            `;
    }
    // ----------------------------------物理学报----------------------------------
    if (location.host.includes('.iphy.ac.cn')) {
        css += `
            body { font-size: 16px; color: #222; }
            p {font-family: 'Bitter Medium', 'LXGW WenKai Screen', 'Sarasa UI SC Semibold', sans-serif; font-size: 20px; text-align:justify; margin-bottom: 0.4rem;}
            .article-abstract, .figure_caption { font-family: roboto, 'Sarasa UI SC Semibold' !important; font-size: 17px !important; line-height:1.6 !important; text-align: justify !important; letter-spacing: 0px !important;}
            .container { width: 1500px !important; }
            .article-top .article-tit { font-size: 20px !important; line-height: 1.5 !important; }
            .article-box-content #abstract { width: 1100px !important; }
            .panel-title { font-weight: bold; font-size: 23px; color: #1a237e; background-color: #f3e5f5; padding: 5px; }
            .navTitle.helpContentClass { font-weight: bold !important; margin: 19px 0 10px !important; color: mediumblue !important; }
            h1, h2, h3, h4, h5, h6 { color: #333 !important; }
        `;
    }
    // ----------------------------------微博----------------------------------
    if (location.host.includes('weibo.com')) {
        css += `
            html { font-family: 'Sarasa Gothic SC Semibold', Roboto, sans-serif !important;}
            .Frame_content_3XrxZ { max-width: 100% !important; margin: auto;} .m-main{ width: 1400px !important; }/* 总内容宽度 */
            .Main_full_1dfQX { width: 780px !important; } /* 主中间宽度 */
            .Main_side_i7Vti,.Side_sideBox_2G3FX { width: 280px; } /* 主右侧宽度 */
            .Frame_side_3G0Bf { width: 220px; } /* 左侧边宽度 */
            .detail_ogText_2Z1Q8, .detail_nick_u-ffy, .detail_reText_30vF1, .wbpro-ui-m .wbpro-list  { font-size: 17px !important; line-height: 1.5 !important; text-align: justify;}
            .Nav_wrap_gHB1a{--weibo-top-nav-bgColor: #283593 !important;}
            :root {
                --feed-title-width: 14px; --feed-title-height: 14px; --feed-title-font-size: 13px; --feed-title-line-height: 17px;
                --feed-head-fast-line-height: 19px; --feed-head-info-font-size: 13px; --feed-head-nick-font-size: 17px; --feed-head-nick-line-height: 1;
                --feed-detail-og-font-size: 17px; --feed-detail-og-line-height: 1.5; --feed-detail-re-font-size: 17px; --feed-detail-re-line-height: 1.5;
                --weibo-top-nav-height: 45px; --frame-mod-gap-space: 5px;
                --w-like-font-size: 14px;
                --feed-toolbar-height: 45px;
                font-weight:400 !important;
                --w-main: #000;
                --w-brand: #264a9d;
                --w-color-orange-3: #264a9d;
                --icon-bg-spe-1: #264a9d;
                --icon-bg-spe-2: #42a5f5;
            }
            .detail_text_1U10O a {color:#264a9d} /*链接字体颜色*/
            .Nav_main_32v4H{top:0px;}
            .wbpro-list { font-size: 16px; line-height: 1.5;} /* 字体大小 */
            .wbpro-side .f12 { font-size: 15px; line-height: 1.5; } /* 右侧边字体大小 */
            .NavItem_text_3Z0D7 { font-size: 15px; line-height: 1.5;} /* 左侧边字体大小 */
            .toolbar_num_JXZul { font-size: 14px;} /*点赞等字体大小*/
            .ProfileHeader_con3_Bg19p { font-size: 14px; } /*个人档案字体大小*/
            .head-info_info_2AspQ { font-size: 14px !important; line-height: 2 !important; }  /*用户名下方信息字体*/
            .NavItem_icon_1tzN0 { margin-right: 5px;} /*分组列表符号右侧空白*/
            `;
        // css += `
        //     p {font-size: unset !important; line-height: unset !important;}
        //     .WB_frame {zoom:1.2;}
        //     `;

        // let timeout = 1000;
        // console.log('%s秒后刷新: ', timeout);
        // setTimeout(() => { location.reload() }, timeout * 2000);
    }

    // ----------------------------------carsi教育网----------------------------------
    if (location.host.includes('carsi.edu.cn')) {
        let timeout = 1014.1;
        console.log('%s秒后刷新: ', timeout);
        setTimeout(() => { location.reload() }, timeout * 2000);
    }
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();