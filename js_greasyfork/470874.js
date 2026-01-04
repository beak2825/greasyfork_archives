// ==UserScript==
// @name         cctv等真实m38u地址
// @namespace    http://www.52lovehome.com/
// @version      0.1
// @description  cctv等获取真实m38u地址并发送猫抓解析下载
// @author       G魂帅X
// @author       You
// @match        https://*/*
// @match        http://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470874/cctv%E7%AD%89%E7%9C%9F%E5%AE%9Em38u%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/470874/cctv%E7%AD%89%E7%9C%9F%E5%AE%9Em38u%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const reg = /https?:\/\/dh5.cntv.[-a-z0-9]+\.(com|cn)\/asp\/h5e\/*/
    let matchArr = []
    async function findMedia(url, raw = undefined, depth = 0) {
        if (!url) {
            return
        }
        if (url.indexOf('.m3u8') < 0) {
            return
        }
        if (reg.test(url) && !matchArr.includes(url)) {
            matchArr.push(url)
            addToCat(url)
        }
    }
    function addToCat(url) {
        const urlEnd = url.replace(/https?:\/\/dh5.cntv.[-a-z0-9]+\.(com|cn)\/asp\/h5e\//g, '')
        const newUrl = 'https://hls.cntv.myhwcdn.cn/asp/' + urlEnd
        window.postMessage({
            action: "catCatchAddMedia",
            url: newUrl,
            href: location.href
        })
    }

    const _xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
            findMedia(this.responseURL);
        });
        _xhrOpen.apply(this, arguments);
    }
    XMLHttpRequest.prototype.open.toString = function () {
        return _xhrOpen.toString();
    }
})();