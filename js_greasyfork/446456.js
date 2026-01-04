// ==UserScript==
// @name         shumin-baidu
// @description  百度搜索页净化 并添加 google、startpage、duckduckgo 和 小红书 的转跳，卡片样式抄改自https://greasyfork.org/zh-CN/scripts/406336
// @icon         http://baidu.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/
// @version      7.4.4
// @author       qianjunlang
// @license      MIT
// @run-at       document-start
// @match        *://*.baidu.com/*
// @exclude      *://baijiahao.baidu.com/*
// @exclude      *://m.baidu.com/*
// @exclude      *://wap.baidu.com/*
// @grant        GM_xmlhttpRequest
// @connect      baidu.com
// @compatible   edge
// @compatible   chrome
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/446456/shumin-baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/446456/shumin-baidu.meta.js
// ==/UserScript==

function check_emp(x) {
  return x.length > 0;
}

(function() {
    'use strict';

    var white_style = `
        .chat-input-anchor {
            top:-15px!important;
            /*left: -16px;*/
        }
        #s_main, .s-top-nav, .s-hotsearch-wrapper, #content_right, #foot, #searchTag, .bdpfmenu , .bdnuarrow , .arrowusermenu{
            display: none !important;
        }
        #container #content_left {
            width: 1000px !important;
        }
        @media screen and (min-width: 1921px) {
            #container.sam_newgrid {
                padding-left: 0 !important;
                width: 1000px !important;
            }
            .wrapper_new #s_tab.s_tab .s_tab_inner {
                padding-left: 0 !important;
                margin-left: -36px;
            }
            .wrapper_new #head .s_form:not(div#s_fm.s_form), .s-isindex-wrap {
                margin-left: -60px !important;
            }
            .wrapper_new #s_tab, #page > div, #ent_sug {
                width: 1000px !important;
            }
            .foot-container_2X1Nt div {
                width: 1000px !important;
            }
        }
        .new-pmd.c-container, #container #content_left .result-op, #container #content_left .result {
            width: 980px !important;
        }
        .new-pmd .c-span12 {
            width: 970px !important;
        }
        .new-pmd .c-span9 {
            width: 820px !important;
        }
        #container .c-container h3.t > a:first-child, #container .c-container h3.t > a:first-child em, #container .c-container .c-title > a:first-child, #container .c-container .c-title > a:first-child em {
            text-decoration: none !important;
            line-height: 1.3 !important
        }
        .nums, .new_search_tool_conter {
            width: 1000px !important;
        }
        #container.sam_newgrid {
            margin-left: unset !important;
            margin: 0 auto !important;
        }
        #container #content_left .result-op, #container #content_left .result {
            border-radius: 10px !important;
            box-shadow: 0 0 6px #eeeeff;
            border-left: 1px solid #eeeeee;
            padding: 10px 10px 15px 20px !important;
            transition: margin-bottom 0.6s, padding-bottom 0.6s, box-shadow 0.2s;
        }
        #container #content_left .result-op:hover, #container #content_left .result:hover {
            box-shadow: 1px 1px 10px #cccccc;
            border-radius: 0;
        }
        .new-pmd .c-border {
            box-shadow: unset !important
        }
        .wrapper_new #s_tab, #page > div, #ent_sug {
            padding-left: 0 !important;
            width: 1080px;
            margin: 0 auto !important;
        }
        #ent_sug {
            margin-top: 140px !important;
        }
        #help {
            display: block;
            width: 1080px;
            margin: 0 auto;
            float: unset !important;
            padding-left: unset !important;
        }
        #head .head_wrapper {
            width: 1080px;
            margin: 0 auto !important;
        }
        .wrapper_new #head .s_form:not(div#s_fm.s_form), .s-isindex-wrap {
            margin-left: 0;
        }
        .wrapper_new #head .s_form {
            padding-left: 0 !important;
        }
        .slowmsg1 {
            left: 400px !important;
            top: 120px !important;
            box-shadow: none !important;
            border: none !important;
            background: none !important;
        }
        div[class^="re-box_"] {
            box-shadow: none !important;
        }
        .s-tab-xiaohongshu::before {
            color: rgb(255, 36, 66) !important;
        }
        #head {
            border-bottom: 1px solid #eee !important;
            box-shadow: none !important;
            height: 46px !important;
        }
        #form {
            height: 0px !important;
            margin-top: 5px !important;
        }
        #u {
            margin-top: -6px !important;
            padding-right: 11px !important;
        }
        #result_logo {
            margin-top: 3px !important;
            margin-right: -53px !important;
            transform: translateX(-37px);
        }
    `;
    var style_tag = document.createElement('style');
    style_tag.innerHTML = white_style;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//调用全局变量的函数写在main内部

function get_s_wd(){
    var wd = "NONE"
    var qry = window.location.search.substring(1);
    var vals = qry.split('&');
    for(var i in vals){
        var pair = vals[i].split('=');
        if(pair[0] == "wd") wd = pair[1];
    }

    wd = wd.replace(/%20/g,'+');
    wd = wd.split('+').filter(check_emp).join('+');

    try{
        if(vals.length > 1) window.history.replaceState(null, null, 'https://' + window.location.hostname + '/s?wd=' + wd);
    }catch(error){}

    return wd;
}
function isBaiduSearchPage() {
    const urlPattern1 = /^https?:\/\/.*\.baidu\.com\/s\?.+/;
    const urlPattern2 = /^https?:\/\/.*\.baidu\.com\/baidu\?.+/;
    return urlPattern1.test(window.location.href) || urlPattern2.test(window.location.href);
}
function go_elsewhere(){
    var wd = get_s_wd();

    const toindexElement = document.querySelector("#u a.toindex");
    if (toindexElement) {
        toindexElement.href = "https://startpage.com/do/search?q="+ wd;
        toindexElement.textContent = "=> StartPage";
    }
    const pfElement = document.querySelector("#u a.pf");
    if (pfElement) {
        pfElement.href = "https://duckduckgo.com/?q="+ wd + "&kp=-2&kai=-1&kn=1&kaj=m&kae=c&km=m&k18=1&kg=p&kz=1&kv=1&ks=t&kw=w&kj=6e8a6c&kx=ff4b2b&k7=fffae2&k8=000000&k9=2a6fff&kaa=7d39b3&k21=fffffe&be=3&k1=-1&ksn=5";
        pfElement.textContent = "> DuckDuckGo";

        const bdpfmenu = document.querySelector(".bdpfmenu");
        if (bdpfmenu) {
            bdpfmenu.remove();        // 移除绑定的弹出菜单
        }
    }
    const resultLogo = document.querySelector("#result_logo");
    if (resultLogo) {
        resultLogo.href = "https://wap.baidu.com/s?pu=sz%401321_480&word="+ wd;
    }
    const userElement = document.querySelector("#user");
    if (userElement) {
        userElement.href = 'https://www.google.com/search?q='+ wd;
        const topImgWrapper = document.querySelector(".s-top-img-wrapper img");
        if (topImgWrapper) {
            topImgWrapper.src = "https://www.google.com/favicon.ico";
        }
        document.querySelector(".s-top-username").textContent = "Google";
        //setTimeout(function() {document.querySelector(".s-top-username").textContent = "Google";}, 5000);
    }
    const lbElement = document.querySelector('#u a.lb');
    if (lbElement) {
        lbElement.href = 'https://encrypted.google.com/search?q='+ wd;
        lbElement.setAttribute('onclick', ';');
        lbElement.textContent = "Google";
    }

    const wenkuLink = document.querySelector('.s-tab-wenku');
    if (wenkuLink) {
        const xiaohongshuLink = wenkuLink.cloneNode(true);
        xiaohongshuLink.href = 'https://www.xiaohongshu.com/search_result?keyword=' + wd ;
        const span = xiaohongshuLink.querySelector('span');
        if (span) {
            span.textContent = '小红书';
            span.style.color = 'rgb(255, 36, 66)';
        }
        xiaohongshuLink.classList.remove('s-tab-wenku');
        xiaohongshuLink.classList.add('s-tab-xiaohongshu');
        if (wenkuLink.parentNode) {
            wenkuLink.parentNode.replaceChild(xiaohongshuLink, wenkuLink);
            xiaohongshuLink.parentNode.insertBefore(xiaohongshuLink, document.querySelector('.s-tab-pic'));
        }
    }
}
function fresh_page(){
    document.head.appendChild(style_tag);

    go_elsewhere();

    const resultLinks = document.querySelectorAll('h3 > a:not([data-processed])');
    resultLinks.forEach(link => {
        link.setAttribute('data-processed', 'true');
        try {
            GM_xmlhttpRequest({
                extData: 'https://www.baidu.com/',
                url: link.href + '&wd=&eqid=',
                headers: { "Accept": "*/*", "Referer": 'https://www.baidu.com/' },
                method: "GET",
                timeout: 100,
                onreadystatechange: (response) => {
                    if (response.responseText) {
                        const urlMatch = (/URL='([^']+)'/ig).exec(response.responseText);
                        if (urlMatch && urlMatch[1]) {
                            link.href = urlMatch[1];
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error processing search result:', error);
        }
    });
}

function kill_baidu(){

    if (!isBaiduSearchPage()) return;

    fresh_page();

    const adContainers = document.querySelectorAll('#content_left>div');
    adContainers.forEach(container => {
        const adSpan = container.querySelector('span');
        if (adSpan && adSpan.textContent.includes("广告")) {
            container.remove();
        }
    });

    setTimeout(() => {
        const delayedAds = document.querySelectorAll('.c-container');
        delayedAds.forEach(container => {
            const adSpan = container.querySelector('.f13>span');
            if (adSpan && adSpan.textContent.includes("广告")) {
                container.remove();
            }
        });
    }, 2100);

}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    document.addEventListener('DOMContentLoaded', () => {

        const userElement = document.querySelector("#user");
        if (userElement) {
            const pfElement = document.querySelector('#u a.pf');
            const toindexElement = document.querySelector("#u a.toindex");
            if (pfElement) {
                pfElement.parentNode.insertBefore(userElement, pfElement);
            }
            if (toindexElement) {
                toindexElement.parentNode.insertBefore(userElement, toindexElement);
            }
        }
        const lbElement = document.querySelector('#u a.lb');
        if (lbElement) {
            const pfElement = document.querySelector('#u a.pf');
            const toindexElement = document.querySelector("#u a.toindex");

            if (pfElement) {
                pfElement.parentNode.insertBefore(lbElement, pfElement);
            }
            if (toindexElement) {
                toindexElement.parentNode.insertBefore(lbElement, toindexElement);
            }

            lbElement.style.width = "60px";
        }
        const pfElement = document.querySelector('#u a.pf');
        if (pfElement) {
            pfElement.addEventListener('click', (e) => {
                e.preventDefault();
                location.href = pfElement.getAttribute('href');
            });
        }


        kill_baidu();
    })

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//一旦页面发生改变，立刻补救
    window.addEventListener('popstate', kill_baidu);
    window.onhashchange = kill_baidu;

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() { setTimeout(kill_baidu, 100); });
        originalXHROpen.apply(this, arguments);
    };
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            setTimeout(kill_baidu, 100);
            return response;
        });
    };

})();