// ==UserScript==
// @name         掘金直接跳转链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金直接跳转链接!
// @author       renxianyang
// @match        http://localhost:3000/*
// @match        http://hkmm.xyz:5000/*
// @match        https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      caihongyun.top
// @downloadURL https://update.greasyfork.org/scripts/434483/%E6%8E%98%E9%87%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/434483/%E6%8E%98%E9%87%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.host.endsWith('cn')){
        jueJinScript()
        return
    }


    hkmmScript()
})();

function jueJinScript(){
    console.warn(`掘金直接跳转链接 is injected`)

    // 临时的替换规则
    function urlReplacer(url) {
        return url.replace(`https://link.juejin.cn/?target=`, '')
    }

    const _open = window.open
    window.open = function (url, ...args) {
        _open.call(this, urlReplacer(url), ...args)
    }
    window.addEventListener('click', e => {
        const elA = e.path.find(item => item.tagName === 'A')
        if (elA && elA.target) {
            e.preventDefault()
            window.open(window.decodeURIComponent(elA.href))
        }
    }, { capture: true })


    window.addEventListener('contextmenu', e => {
        const elA = e.path.find(item => item.tagName === 'A')
        if (elA && elA.target) {
            elA.href = urlReplacer(window.decodeURIComponent(elA.href))
        }
    }, { capture: true })
}

function hkmmScript(){
    console.warn(`spiderHttpUtils is injected`)

    class SpiderHttpUtils{
        get(url){
            return new Promise((resolve,reject)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload:resolve,
                    onerror:reject
                });
            })
        }
    }

    // Your code here...
    unsafeWindow.spiderHttpUtils = new SpiderHttpUtils()
}