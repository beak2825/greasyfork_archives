// ==UserScript==
// @name         CSDN Focus
// @description  CSDN页面重置, 支持黑暗模式, 无弹窗无广告无任何干扰, 自动展开文章和评论, 自由复制, 外链直达! 同步支持脚本之家, 简书
// @version      2.3.7
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
//
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://www.jb51.net/article/*
// @match        *://www.jianshu.com/*
//
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @compatible   Chrome Latest
// @compatible   Safari Latest
// @downloadURL https://update.greasyfork.org/scripts/420352/CSDN%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/420352/CSDN%20Focus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const finnWidth = GM_getValue('FinnData') && GM_getValue('FinnData').finnWidth || 1000;
    const csdn = `<style>:root{--finn-width:${finnWidth}px;} #content_views,#content_views *{user-select:auto!important} [darkMode],[darkMode] #darkBtn,[darkMode] code.hljs,[darkMode] img,[darkMode] pre.prettyprint{filter:invert(1) hue-rotate(180deg);transition:all .5s}[darkMode] .markdown_views.prism-github-gist .prettyprint,[darkMode] .markdown_views.prism-github-gist .prettyprint .pre-numbering,[darkMode] .markdown_views.prism-github-gist pre code,[darkMode] .markdown_views.prism-github-gist pre.prettyprint{background-color: #0d1117;transition: all 0.1s}[darkModE] body{background:#ebebeb!important;transition:background .7s}#darkBtn{position:fixed;top:8px;left:50px;width:32px;height:32px;z-index:9999;background:gold;cursor:pointer;border-radius:50%;transition:all .5s}[darkMode] #darkBtn{background:0 0;box-shadow:-.5em .3em 0 0 gold;left:60px;top:4px}#darkBtn:before{content:"";width:50px;height:50px;display:block;}#darkBtn:after{content:"打开夜间模式";width:100px;position:absolute;right:-120px;top:4px;font-size:14px;font-weight:600;transition:all .5s;display:none}[darkMode] #darkBtn:after{content:"关闭夜间模式";right:-110px;top:8px;filter:invert(1) hue-rotate(180deg);font-weight:600}#darkBtn:hover:after{display:block}#asideArchive,.aside-box-footer,#asideCategory,#asideHotArticle,#asideNewComments,#asideNewNps,#asideSearchArticle+.box-shadow.mb8,#blogColumnPayAdvert,#csdn-toolbar .toolbar-advert,#csdn-toolbar .toolbar-container-left,#csdn-toolbar .toolbar-container-right,#dmp_ad_58,#footerRightAds,#passportbox,#placeholder,#rightAside,#recommendNps,.blog-footer-bottom,.csdn-shop-window-common,.csdn-side-toolbar,.hide-article-box.hide-article-pos.text-center,.leftPop,.login-mark,.opt-box.text-center,.template-box,.toolbar-search-drop-menu.toolbar-search-half,::-webkit-input-placeholder,.passport-login-mark,.passport-login-container,.hide-preCode-box,#marketingBox,.icon-fire,#toolBarBox .tool-hover-tip+.tool-active-list,.passport-login-tip-container,#remuneration,#asideWriteGuide,#asideSearchArticle,#tool-share,#treeSkill,#swiper-remuneration-container,.swiper-slide-box-remuneration,.ai-abstract-box,.btn-code-notes{/*全局隐藏*/display:none!important;margin;color:transparent;visibility:hidden;height:0}.toolbar-search.onlySearch{transition:all .3s ease}body #csdn-toolbar{box-shadow:0 2px 10px 0 rgba(0,0,0,.15);position:fixed!important;top:0;left:0;width:100%;z-index:1993}.toolbar-search.onlySearch:focus-within{max-width:var(--finn-width)!important;width:var(--finn-width)!important}#asidedirectory,.d-flex{display:block!important}.main_father,pre.set-code-hide{height:auto!important}main{cursor:auto;width:100%!important;box-shadow:0 0 30px #959fa378;margin-bottom:0!important}#mainBox{position:relative;margin:10px auto 30px;width:var(--finn-width)!important;padding:0 10px;box-sizing:content-box;cursor:e-resize}.comment-list-box{max-height:none!important}#commentPage,.toolbar-container-middle{display:block!important}.toolbar-container{min-width:100%!important}#article_content{height:auto!important}.comment-list-container{padding:4px 0!important}.article-header-box{padding-top:18px!important}main .comment-box{padding:0;box-shadow:0 0 10px rgba(0,0,0,.05);margin:8px 0}#FinnTop{width:36px;height:36px;color:#ff4d4d;font:600 14px/44px arial;text-align:center;position:fixed;left:50%;margin-left:calc(var(--finn-width)/ 2 + 20px);bottom:80px;z-index:999;cursor:pointer;background:#fff;border-radius:50%;box-shadow:0 0 20px #75757545}#FinnTop:before{content:"";position:absolute;left:28%;top:35%;color:#ff4d4d;width:14px;height:14px;border-top:2px solid #ff4d4d;border-left:2px solid #ff4d4d;transform:rotate(45deg)}.blog_container_aside{width:300px!important;height:calc(100% - 100px);overflow-y:auto;overflow-x:hidden;border:solid #fff;border-width:20px 4px 0 4px;background:#fff;box-sizing:content-box;position:fixed;top:initial!important;left:-307px!important;transition:all .35s;box-shadow:2px 0 10px 0 rgba(0,0,0,.15);z-index:1111!important;cursor:auto}.blog_container_aside::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 15px rgba(0,0,0,.13);background-color:#fefefe}.blog_container_aside::-webkit-scrollbar{width:6px;height:6px;background-color:#eee}.blog_container_aside::-webkit-scrollbar-thumb{border-radius:6px;background-color:#cecece}.blog_container_aside:hover{left:0!important}.recommend-box.insert-baidu-box{height:60%;overflow:auto!important;position:fixed;background:#fff;box-sizing:content-box;transition:all .38s;box-shadow:0 -3px 10px 0 rgba(0,0,0,.25);border:10px solid #fff;z-index:1995;top:calc(100% - 7px);left:0;right:0;margin:auto;width:var(--finn-width)}.recommend-box.insert-baidu-box:hover{top: calc(39% - 7px)}.recommend-box.insert-baidu-box::-webkit-scrollbar-thumb{background-color:rgba(153,154,170,.3)}.recommend-box.insert-baidu-box::-webkit-scrollbar{width:5px;height:100px}.recommend-item-box{display:none!important}.recommend-item-box.type_blog{display:block!important}aside.blog_container_aside:before{width:14px;animation:_l 1s ease-in forwards;position:fixed;top:48px;left:-3px!important;padding:5px 1px 10px;background:#ff4d4d;text-align:center;color:#fff;content:"";writing-mode:tb-rl;font-size:10px;line-height:1;border-radius:0 0 15px 0;transition:all .35s ease}@keyframes _l{from{left:-20px}to{left:0}}aside.blog_container_aside:hover:before,[asidePin] aside.blog_container_aside:before{width:308px;height:18px;padding:4px 2px;writing-mode:rl-tb;font-size:14px;top:66px;border-radius:0}.recommend-box.insert-baidu-box:before{position:fixed;bottom:7px;left:50%;margin-left:calc(var(--finn-width)/ 2);padding:30px 5px;background:#ff4d4d;content:"";pointer-events: auto!important}html body{min-width:100%;background:#eee}#pcCommentBox:has(.unlogin-comment-model){display:none!important}@media print{#csdn-toolbar,#pcCommentBox,aside,#toolBarBox,.recommend-box,#FinnTop{display:none!important}}[asidePin] aside.blog_container_aside{left:0!important}#pinBtn{color:#ccc;position:fixed;left:18px; top:12px;z-index:9999;width:19px;height:26px;border:2px solid;cursor:pointer} #pinBtn:before{content:'';position:absolute;left:-2px;height:23px;border:1px solid;transition:all 0.5s}[asidePin] #pinBtn:before{left:3px} #toolbar-search-input, #toolbar-search-button{border-radius:0!important} main div.blog-content-box pre{max-height:none!important}main div.blog-content-box pre .hljs-button.signin.active.add_def{right:12px!important}</style><div id="darkBtn"></div><div id="pinBtn"></div><div id="FinnTop" title="返回顶部"></div>`;
    const jb51 = `<style>#container{width:${finnWidth}px!important;} #main .main-right,#topbar,#footer,.pt10,.lbd,.xgcomm,#header,.lbd_bot,#ewm,.subnav,.art_xg,.tags,#comments{display:none !important;}body #main .main-left{padding:0;width:unset;float:none}body #article{padding:15px 20px 20px;box-shadow:0 0 30px rgb(0 0 0 / 25%)}#ewm+p{font-weight:bold;text-align:center;margin:20px;font-size:24px;}body .syntaxhighlighter .line.alt1,body .syntaxhighlighter .line.alt2{background:#d4dbdc !important}body .syntaxhighlighter div{padding:10px 0px !important}.jb51code{width:960px !important}.jb51code .syntaxhighlighter table{background:#d4dbdc !important}</style>`;
    const jianshu = `<style>#wrapper,header,aside,iframe,._13lIbp,._3Pnjry,.ouvJEz:not(:first-of-type){display:none!important} ._gp-ck{width:${finnWidth}px!important;box-shadow:0 0 30px rgb(0 0 0 / 25%)}</style>`

    let h = document.documentElement, _Ds,OB;
    let FinnData = new Proxy(GM_getValue('FinnData', {}), {
        set(target, key, val) {
            if (typeof val === "boolean") h.toggleAttribute(key, val);
            const B = Reflect.set(target, key, val);
            GM_setValue('FinnData', FinnData);
            return B;
        }
    })
    if (location.host === "www.jb51.net") { _Ds = jb51 } else
    if (location.host === "www.jianshu.com") { _Ds = jianshu } else {
        _Ds = csdn;
        window.addEventListener("DOMContentLoaded", () => {
            mainBox.addEventListener('click', e => {
                let ev = e.target;
                if (ev.nodeName === 'A') {
                    if (ev.host && !ev.host.includes("csdn")) {
                        e.stopImmediatePropagation();
                        window.open(ev.href);
                        e.preventDefault();
                    }
                }
            }, true);
            pinBtn.onclick =()=> FinnData.asidePin = !FinnData.asidePin
            $("#darkBtn").click(() => { FinnData.darkMode = !FinnData.darkMode })
            $("#FinnTop").click(() => { $("body,html").animate({ scrollTop: 0 }, 300) });

            mainBox.addEventListener("mousedown", e => {
                if (e.target !== mainBox) return;
                let startX = e.clientX,
                    offsetWidth = mainBox.offsetWidth;
                const maxSize = window.innerWidth * 0.88;
                mainBox.style.userSelect = "none";
                e.stopPropagation();
                document.onmousemove = e => {
                    let endX = e.clientX;
                    let moveLen = (startX / maxSize < 0.5) ? startX - endX : endX - startX;
                    let l = Math.max(888,Math.min(offsetWidth + moveLen * 2 - 20,maxSize));
                    FinnData.finnWidth = l;
                    h.style.setProperty('--finn-width', l + "px");
                }
                document.onmouseup = () => {
                    mainBox.style.userSelect = "auto";
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }, true)
        })
        window.onload=()=>{
            $("#content_views").unbind("copy")
            document.addEventListener('copy', function(e) {
                e.stopImmediatePropagation();
            }, true);

            document.querySelectorAll(".hljs-button.signin").forEach((e) => {
                e.setAttribute("data-title", "一键复制");
                e.onclick = function (e) {
                    e.stopPropagation();
                    navigator.clipboard
                        .writeText(this.parentNode.previousSibling.innerText)
                        .then(() => {this.setAttribute("data-title", "复制成功") })
                };
            });
        }
    }
    function ins() {
        h = h||document.documentElement;
        h.insertAdjacentHTML('afterbegin', _Ds);
        FinnData.darkMode && h.setAttribute("darkMode", true);
        FinnData.asidePin && h.setAttribute("asidePin", true);
        OB?.disconnect()
    }
    if (!h) {
        OB = new MutationObserver(ins);
        OB.observe(document, { childList: true })
    } else {
        ins()
    }
})();