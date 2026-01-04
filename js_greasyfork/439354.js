// ==UserScript==
// @name         百度美化
// @namespace    github.com/yuunie/tampermonkey-fuck-baidu-ad
// @version      1.0
// @description  Remove Baidu Ad
// @author       1591216902@qq.com
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/s*
// @exclude      *://www.baidu.com/s?rtt*
// @match        *://ipv6.baidu.com/
// @match        *://ipv6.baidu.com/s*
// @exclude      *://ipv6.baidu.com/s?rtt*
// @icon         http://www.baidu.com/more/img/xiaodu.gif
// @grant        GM_addStyle
// @grabt        PRO_addStyle
// @grabt        addStyle
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/439354/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439354/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

function addCss(css) {
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
}

function removeAd() {
    runCss()
    $(document).find('#content_left').children().map((k, v) => {
        let id = $(v).attr('id')
        let cl = $(v).attr('class')
        if (id === undefined && cl === undefined) {
            $(v).css({display: 'none'})
        }
        // 去除带有广告标识的内容
        let hasAd = false;
        $(v).find('a').map((kk, vv) => {
            if ($(vv).text().search(/(.*)广告$/) != -1) {
                hasAd = true
            }
        })
        if (hasAd) {
            $(v).remove()
        }
    })
}

function runRemoveAd() {
    // 去除基本广告
    removeAd()
    let interval = setInterval(function () {
        removeAd()
    }, 500)
    setTimeout(() => {
        clearInterval(interval)
    }, 5000)
}

function runJs() {
    try {
        runRemoveAd()
        if (window.onurlchange === null) {
            // feature is supported
            window.addEventListener('urlchange', (info) => {
                runRemoveAd()
            });
        } else {
            window.onurlchange = runRemoveAd()
        }
    } catch {}
}

function runCss() {
    const css = `
body[link] {
    overflow-y: scroll!important;
}
#bottom_layer {
    display: none!important
}
#s_side_wrapper {
    display: none!important
}
#container {
    position: relative;
}

#content_left > .c-container {
    width: 100%;
    margin-left: -16px!important
}
#content_left > .c-container em {
    text-decoration: none!important;
}
#content_left > .c-container h3 a {
    margin-bottom: 8px!important;
    text-decoration: none!important;
}
#content_left > .c-container {
    transition: transform .3s ease-in-out;
    padding: 16px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow:  5px 5px 25px #d9d9d9,
                 -5px -5px 25px #ffffff;
}
#content_left > .c-container:hover {
    transition: transform .3s ease-in-out;
    transform: translateX(-8px);
}
.ad-block {
    display: none
}
    `
    // 添加样式
    addCss(css)
}


(function () {
    'use strict';
    runCss()
    window.onload = function () {
        runJs()
    }
    document.addEventListener("DOMContentLoaded", runJs());
})();
// ==UserScript==
// @name        New script 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/9/19 下午1:42:32
// ==/UserScript==
// ==UserScript==
// @name        New script 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/9/21 下午5:09:47
// ==/UserScript==
