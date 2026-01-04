// ==UserScript==
// @name         USTC网课下载
// @namespace    https://www.bb.ustc.edu.cn/
// @version      0.5
// @description  展示USTC网课回放的直链地址
// @author       398
// @match        *://www.eeo.cn/*
// @grant        GM_addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/405052/USTC%E7%BD%91%E8%AF%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/405052/USTC%E7%BD%91%E8%AF%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 观测对象
let observer;

// 创建可用标签
function createOne() {
    const path_href = document.createElement('a')
    path_href.setAttribute('id', 'download-href');
    document.getElementById('lesson-time').appendChild(path_href);
    return path_href
}

// 回调
function callBack(mutate) {
    let target
    try{target = mutate[0].target} catch (e) {return}
    let href = document.getElementById('download-href')
    href = (href === null || href === undefined)? createOne(): href
    href.textContent = '下载链接:' + target.src;
    href.href = target.src
}

// 立即执行
(function () {
    // 添加样式
    GM_addStyle(`#download-href{color: white; cursor: pointer;} #download-href:hover {color: #29875a;}`)

    // classin 基于 vue 搭建 SPA 项目，会动态刷新页面，采用监听器监听 video 标签变化。
    const playerNode = document.getElementById('player_html5_api')
    const config = {
            attributes: true,
            attributeFilter: ['src']
    }
    observer = new MutationObserver(callBack)
    observer.observe(playerNode, config)
})()
