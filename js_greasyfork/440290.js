// ==UserScript==
// @name         网页翻译-彩云小译
// @description  网页翻译,全文翻译,双语对照
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     2.2
// @author       guzz
// @description 2022/2/19 下午2:46:37
// @include      https://*
// @include      http://*
// @exclude      *://*.google*/*
// @exclude      *://*.cn/*
// @exclude      *://*.baidu.com/*
// @exclude      *://*.qq.com/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://*.jianshu.com/*
// @exclude      *://*sspai.com/*
// @exclude      *://*zhihu/*
// @exclude      *://*acfun/*
// @exclude      *://*csdn/*
// @exclude      *://*china/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440290/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/440290/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91.meta.js
// ==/UserScript==






document.addEventListener('keydown', keydownEvent);

function keydownEvent(e) {
    if (e.key == ';' && !(e.metaKey || e.ctrlKey) && e.altKey) {
        if (['input', 'text', 'textarea'].includes(e.target.tagName.toLowerCase())) {
            return
        }
        translation();

    }
}

GM_registerMenuCommand("翻译当前网页", translation);


function translation() {


    (function (open, send) {
        var xhrOpenRequestUrl;

        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

            xhrOpenRequestUrl = new URL(url, document.location.href).href;
            open.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function (data) {
            if (xhrOpenRequestUrl.includes('api.interpreter.caiyunai.com/v1/page/auth')) {
                let tempArg = JSON.parse(arguments[0]);
                tempArg.browser_id = new Date().getTime()
                arguments[0] = JSON.stringify(tempArg)
            }
            send.apply(this, arguments);
        }
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)



    var cyfy = document.createElement("script");
    cyfy.type = "text/javascript";
    cyfy.charset = "UTF-8";
    cyfy.src = ("https:" == document.location.protocol ? "https://" : "http://") + "caiyunapp.com/dest/trs.js";
    document.body.appendChild(cyfy);

    var c = '.cyxy-personal{display:none}.cyxy-favorite{display:none}#asdazcasdiovb{position:fixed;bottom:0;right:0;width:auto;font-size:0.8em}';

    var ele1 = document.createElement("style");
    ele1.innerHTML = c;
    document.getElementsByTagName('head')[0].appendChild(ele1)
    var p = document.createElement("div");
    p.innerHTML = '<p>脚本已执行,3秒后自动关闭</p>'
    p.id = 'asdazcasdiovb';
    document.body.appendChild(p);

    setTimeout(() => {
        document.querySelector('#asdazcasdiovb').hidden = true;
    }, 3000)

}