// ==UserScript==
// @name         zgjx6的script
// @version      1.2.1
// @description  zgjx6自用脚本，优化各常用网站页面，提高使用体验
// @author       zgjx6
// @include      *://*/*
// @license MIT
// @icon         data:image/jpeg;base64,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
// @namespace zgjx6@qq.com
// @downloadURL https://update.greasyfork.org/scripts/429331/zgjx6%E7%9A%84script.user.js
// @updateURL https://update.greasyfork.org/scripts/429331/zgjx6%E7%9A%84script.meta.js
// ==/UserScript==

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}
(function zgjx6() {
    'use strict';
    switch (document.location.host) {
        case "stackoverflow.com":
            if (typeof jQuery == 'undefined') {
                var importJs = document.createElement('script');
                importJs.setAttribute("type", "text/javascript");
                importJs.setAttribute("src", 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js');
                document.getElementsByTagName("head")[0].appendChild(importJs);
                console.log('add jquery');
            }
            break;
        case "link.zhihu.com":
            var regex_zhihu = location.href.match(/target=(.+?)(&|$)/);
            if (regex_zhihu && regex_zhihu.length == 3) {
              var url_zhihu = decodeURIComponent(regex_zhihu[1]);
              location.href = url_zhihu;
            }
            break;
        case "blog.csdn.net":
            addNewStyle(".prettyprint{max-height: none !important;}");
            break;
        case "link.csdn.net":
            var regex_csdn = location.href.match(/target=(.+?)(&|$)/);
            if (regex_csdn && regex_csdn.length == 3) {
              var url_csdn = decodeURIComponent(regex_csdn[1]);
              location.href = url_csdn;
            }
            break;
        case "www.qianhei.net":
            var wrap = document.getElementsByClassName('wrap');
            if (wrap.length===4 && wrap[2].firstElementChild.className==='main'){
                wrap[2].style.width = '70%';
            }
            break;
        case "meitu.xunlei.com":
            // 迅雷 http://meitu.xunlei.com
            document.getElementById('vediocon').setAttribute('style', 'display:none');
            document.getElementById('ckplayer_a1').play();
            break;
        case "www.jianshu.com":
                // 简书 jianshu.com
                if (location.href.indexOf('jianshu.com/go-wild?ac=') > -1) {
                  var regex_jianshu = location.href.match(/url=(.+?)(&|$)/);
                  if (regex_jianshu && regex_jianshu.length == 3) {
                    var url_jianshu = decodeURIComponent(regex_jianshu[1]);
                    location.href = url_jianshu;
                  }
                }
                var jianshu = document.getElementsByClassName('_3VRLsv');
                var jianshu1 = document.getElementsByClassName('_gp-ck');
                var jianshu2 = document.getElementsByClassName('_3Pnjry');
                var jianshu3 = document.getElementsByTagName('footer')
                if (jianshu.length>0){
                    jianshu[0].style.width = '80%';
                }
                if (jianshu1.length>0){
                    jianshu1[0].style.width = '60%';
                }
                if (jianshu2.length>0){
                    jianshu2[0].style.display = 'none';
                }
                if (jianshu3.length>0){
                    jianshu3[0].style.display = 'none';
                }
                for (var i of document.getElementsByClassName('image-container'))
                {
                    i.style.maxWidth='none';
                    i.style.maxHeight='none';
                }
                break;
        case "railstutorial-china.org":
            // railstutorial-china.org
            var rails = document.getElementsByClassName('container')[1]
            rails.style.maxWidth = "1920px";
            break;
        case "xss.tf":
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "https://code.jquery.com/jquery-1.9.1.min.js");
            var script2 = document.createElement("script");
            script2.setAttribute("type", "text/javascript");
            script2.setAttribute("src", "https://cdn.bootcss.com/bootstrap/2.3.1/js/bootstrap.min.js");
            var heads = document.getElementsByTagName("head");
            var meta = document.createElement("meta");
            meta.setAttribute("http-equiv", "Content-Security-Policy");
            meta.setAttribute("content", "upgrade-insecure-requests");
            if (heads.length) {
                heads[0].appendChild(meta);
                heads[0].appendChild(script);
                heads[0].appendChild(script2);
            } else {
                document.documentElement.appendChild(meta);
                document.documentElement.appendChild(script);
                document.documentElement.appendChild(script2);
            }
            break;
        case "mp.weixin.qq.com":
            setTimeout(function() {
                document.title = document.title + ' - ' + document.getElementsByName('author')[0].content + ' - ' + document.getElementById('js_name').innerText;
            }, 2000);
            var wechat = document.getElementsByClassName('rich_media_area_primary_inner');
            wechat[0].style.maxWidth = '900px';
            break;
        case "www.ruanyifeng.com":
            var ad = document.getElementsByClassName('entry-sponsor')[0];
            ad.style.display = 'none';
            var ad2 = document.getElementById('cre');
            ad2.style.display = 'none';
            var ad3 = document.getElementById('alpha-inner');
            ad3.children[1].style.display = 'none';
            break;
        case "bbs.ichunqiu.com":
            document.getElementsByClassName('fast-login-bg')[0].style.display = 'none';
            document.getElementsByClassName('fast-reg-btn')[0].style.display = 'none';
            break;
        case "www.liaoxuefeng.com":
            document.onkeydown = function(event) {
                var pages = document.getElementsByClassName('x-wiki-prev-next')[0].getElementsByTagName('a')
                var prev = pages[0]
                var next = pages[1]
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 37) { // 按 left
                    prev.click()
                }
                if (e && e.keyCode == 39) { // 按 right
                    next.click()
                }
            };
            break;
        case "c.biancheng.net":
            document.onkeydown = function(event) {
                var prev = document.getElementsByClassName('pre left')[0].getElementsByTagName('a')[0]
                var next = document.getElementsByClassName('right next')[0].getElementsByTagName('a')[0]
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 37) { // 按 left
                    prev.click()
                }
                if (e && e.keyCode == 39) { // 按 right
                    next.click()
                }
            };
            break;
        case "weread.qq.com":
            document.onkeydown = function(event) {
                var next = document.getElementsByClassName('readerFooter_button')[0]
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 39) { // 按 right
                    next.click()
                }
            };
            break;
        case "juejin.cn":
            setTimeout(function() {
                var container = document.getElementsByClassName('container main-container')[0]
                container.setAttribute('style', 'max-width: 100% !important');
                var main = document.getElementsByClassName('main-area article-area')[0]
                main.style.width = "70%";
                main.style.paddingLeft = "15%";
                var menu = document.getElementsByClassName('sticky-block-box')[0]
                menu.style.right = "10%";
                var sidebar = document.getElementsByClassName('sidebar')[0]
                sidebar.style.right = "10%";
            }, 3000)
            break;
        case "www.cmsblogs.com":
            if (document.location.href.indexOf("article") > -1) {
                document.getElementById('article-content-main').style.height = ''
                document.getElementById('read-more-btn').remove()
                document.getElementById('read-more-wrap').remove()
                document.getElementsByClassName('article-action')[0].remove()
            }
            break;
        case "www.zhihu.com":
            if (document.location.href.indexOf("question") > -1){
                document.getElementsByTagName("header")[0].remove();
            }
            break;
        case "zhuanlan.zhihu.com":
            for (let i of document.querySelectorAll(".Post-NormalMain>*"))
            {
                i.style.width='60%';
            }
            document.querySelector('.Post-SideActions').style.right= '16%';
            break;
        case "segmentfault.com":
            document.querySelector('#__next > div.article-content.pt-3.pt-sm-0.container').style.maxWidth='60%'
            break;
        case "bugstack.cn":
            var c = 0
            var href = location.href
            var isHashChanged = function() {
                return location.href !== href
            }
            var bugstack = function() {
                if (document.getElementsByClassName('read-more-wrap').length > 0) {
                    document.getElementsByClassName('read-more-wrap')[0].remove()
                }
                if (document.getElementsByClassName('theme-default-content').length > 0){
                    document.getElementsByClassName('theme-default-content')[0].style.height='auto'
                }
                c += 1
                if (c>2) {
                    c = 0
                    clearInterval(id)
                }
            }
            var id = setInterval(bugstack, 1000)
            setInterval(function() {
                // isHashChanged() 为要检测url是否被改变的函数
                var ischanged = isHashChanged();
                if (ischanged) {
                    href = location.href
                    id = setInterval(bugstack, 1000) //如被改变，设用函数
                }
            }, 1000);
            break;
        case "www.bilibili.com":
            var pathList = ['/video/', '/list/watchlater'];
            for (let pathname of pathList) {
                if (window.location.pathname.indexOf(pathname) > -1){
                    setTimeout(function() {
                        window.scrollTo({
                            left: 0,
                            top: 80,
                            behavior: 'smooth'//或'auto'
                        });
                    }, 2000);
                }
            }
            break;
        case "baomidou.com":
            document.getElementsByTagName('astro-island')[0].style.display = 'none';
            var styleNode = document.createElement('style');
            var cssCode = 'astro-island { display: none; }';
            styleNode.appendChild(document.createTextNode(cssCode));
            document.head.appendChild(styleNode);
            break;
        case "practice-zh.course.rs":
            document.querySelectorAll('code').forEach(codeElement => {
                const currentHeight = parseFloat(window.getComputedStyle(codeElement).height);
                const newHeight = currentHeight + 20;
                codeElement.style.height = `${newHeight}px`;
            });
            break;
    }
})();

