// ==UserScript==
// @name      统一脚本
// @namespace   Violentmonkey Scripts
// @match      *://a1a1a1.live/bbs*
// @match      *://sexinsex.net/bbs*
// @match    http://www.zuanke8.com/*
// @match    http://www.0818tuan.com/*
// @match    https://www.qiangqiang5.com/*
// @match    https://v1.xianbao.net/*
// @match    https://*.xianbao.fun/*
// @match    http://www.96bbs.com/*
// @match    https://h4j2z2.wzvikms1kb.com/*
// @match    *://sis001.com/*
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand
// @grant    opentab
// @grant    window.close
// @grant    unsafeWindow
// @run-at document-end
// @version     1.0
// @author      -
// @description 2022/6/20 00:55:25
// @downloadURL https://update.greasyfork.org/scripts/500401/%E7%BB%9F%E4%B8%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/500401/%E7%BB%9F%E4%B8%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    var L_url = window.location.href;
    var t_title = document.title;

    //赚客吧网站标题替换
  /*
    var point_title = ["赚客", "抢友交流", "线报"];
    for (let p of point_title) {
        console.log(p);
        if (t_title.indexOf(p) != -1) {
            document.title = "网站";
        }
    }
    */




    //自动按发帖时间倒序
    if (L_url.indexOf("forumdisplay.php?") != -1 ) {
        //blank_click();
        var a_url = "&orderby=dateline&ascdesc=DESC";
        console.log(L_url, a_url);
        if (L_url.indexOf(a_url) == -1) {
            window.location.href = window.location.href + a_url;

        }
       if (L_url.indexOf("viewthread.php") == -1 ) {
        blank_click();
       }

    }

    if (L_url.indexOf("app.php?p=threadrush&action=awardlist") != -1) {
        var x = document.getElementsByClassName("xi2");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].click();
        }

    }

    if (L_url.indexOf("viewthread.php?tid=") != -1) {
        //blank_click();

        //匹配自动点击
        setTimeout(() => {
            obsClick();
        }, 2000);

        function obsClick(selector, desc = 'click') {
            console.log('按下回车键');
            let target = document.querySelector("span.postratings >  div > a");
            target.click();
          //ccc();//点击后自动关闭
        }

        function ccc() {
            window.close();
            //open(location, '_self').close();

        }

    }
    //强制新页面打开链接
    function blank_click() {
        //强制新页面打开链接
        'use strict';
        targetBlank(); //  修改为新标签页打开
        targetDiscuz(); // 针对 Discuz! 论坛的帖子
        aObserver(); //    针对动态加载内容中的 a 标签


        // 修改为新标签页打开
        function targetBlank() {
            document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
            Array.from(document.links).forEach(function (_this) { // 排除特殊链接
                if (_this.onclick || _this.href.slice(0, 4) != 'http' || _this.getAttribute('href').slice(0, 1) === '#') {
                    _this.target = '_self'
                }
            })
            document.querySelectorAll('form').forEach(function (_this) { // 排除 form 标签
                if (!_this.target) {
                    _this.target = '_self'
                }
            });
        }

        // 针对 Discuz! 论坛的帖子
        function targetDiscuz() {
            if (document.querySelector('meta[name="author"][content*="Discuz!"], meta[name="generator"][content*="Discuz!"]') || document.querySelector('body[id="nv_forum"][class^="pg_"][onkeydown*="27"]') || document.querySelector('body[id="nv_search"][onkeydown*="27"]') || (document.querySelector('a[href*="www.discuz.net"]') && document.querySelector('a[href*="www.discuz.net"]').textContent.indexOf('Discuz!') > -1) || (document.getElementById('ft') && document.getElementById('ft').textContent.indexOf('Discuz!') > -1)) {
                let atarget = document.getElementById('atarget');
                if (atarget && atarget.className.indexOf('atarget_1') === -1) { // 强制勾选 [新窗]
                    atarget.click();
                }
            }
        }

        // 针对动态加载内容中的 a 标签
        function aObserver() {
            const callback = (mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    for (const target of mutation.addedNodes) {
                        if (target.nodeType != 1)
                            return
                            if (target.tagName === 'A') {
                                if (target.onclick || target.href.slice(0, 4) != 'http' || target.getAttribute('href').slice(0, 1) === '#') {
                                    target.target = '_self'
                                }
                            } else {
                                document.querySelectorAll('a').forEach(function (_this) {
                                    if (_this.onclick || _this.href.slice(0, 4) != 'http' || _this.getAttribute('href').slice(0, 1) === '#') {
                                        _this.target = '_self'
                                    }
                                });
                            }
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }

        // console.log('强制新页面打开链接');
        // document.body.addEventListener('mousedown', function (e) {
        // e.target.target = '_blank';
        // e.target.parentNode.target = '_blank';
        // e.target.parentNode.parentNode.target = '_blank';
        // e.target.parentNode.parentNode.parentNode.target = '_blank';
        // e.target.parentNode.parentNode.parentNode.parentNode.target = '_blank';
        // })

    }

})();
