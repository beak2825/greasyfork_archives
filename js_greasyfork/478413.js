// ==UserScript==
// @name         good target click
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动点击csdn zhihu,jianshu,cloud.tencent,infoq,nodeseek,qixinpro,gitee 弹出的拦截页面 自动跳转
// @author       lich
// @match        https://xie.infoq.cn/link?target=*
// @match        https://cloud.tencent.com/developer/tools/blog-entry?target=*
// @match        https://nav.qixinpro.com/sites/*
// @match        https://link.csdn.net/?target=*
// @match        https://link.zhihu.com/?target=*
// @match        https://link.juejin.cn/?target=*
// @match        https://www.jianshu.com/go-wild*
// @match        https://www.nodeseek.com/jump?to=*
// @match        https://gitee.com/link?target=*
// @match        https://www.oschina.net/action/GoToLink?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infoq.cn
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478413/good%20target%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/478413/good%20target%20click.meta.js
// ==/UserScript==

/**
* 如何开始
* 将需要添加的附属到 function是类上
*/
(function() {
    'use strict';
    var count = 100;
    var functions = {}
    var href = window.location.href;
    function getUrlParams(url) {
        let urlStr = url.split('?')[1]
        const urlSearchParams = new URLSearchParams(urlStr)
        const result = Object.fromEntries(urlSearchParams.entries())
        return result
    }
    function lazyTrigger(func) {
        var dom = func()
        if(count-- <0 || dom) {
            dom && (function(dom) {
                if(typeof dom === 'object') {
                    dom.target && (dom.target = '')
                    dom.click()
                } else {
                    window.location.href = dom
                }
            })(dom)
            return;
        }
        setTimeout(function() {
            lazyTrigger(func)
        }, 200);
    }
    function fetchSearchTarget(name) {
        var search = getUrlParams(href) || {}
        return search[name] || '';
    }
    // infoq
    functions['infoq.cn'] = function() {
        return fetchSearchTarget('target');
    }

    // cloud.tencent.com/developer
    functions['cloud.tencent.com/developer'] = function() {
        return fetchSearchTarget('target');
    }
    // nav.qixinpro.com/sites
    functions['nav.qixinpro.com/sites'] = function() {
        return document.querySelector('.site-go-url a');
    }

    // csdn
    functions['link.csdn.net'] = function() {
        return fetchSearchTarget('target');
    }

    // link zhihu
    functions['link.zhihu'] = function() {
        return fetchSearchTarget('target');
    }
    // link.juejin.cn
    functions['link.juejin.cn'] = function() {
        return fetchSearchTarget('target');
    }

    functions['www.jianshu.com'] = function() {
        return fetchSearchTarget('url');
    }

    functions['www.nodeseek.com'] = function() {
        return fetchSearchTarget('to');
    }

        // gitee
    functions['gitee.com'] = function() {
        return fetchSearchTarget('target');
    }
    functions['www.oschina.net'] = function() {
        return fetchSearchTarget('url');
    }

    Object.keys(functions).forEach(key => {
        if (href.includes(key)) {
            lazyTrigger(functions[key])
        }
    })


})();