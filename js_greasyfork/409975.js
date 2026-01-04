// ==UserScript==
// @name         屏蔽贴吧强制置顶广告
// @namespace    https://tieba.baidu.com/
// @version      0.1
// @description  近期有一些广告被贴吧官方强制置顶在一些相关贴吧，本脚本解决了这个问题
// @author       kilszfdjs
// @include      http*://tieba.baidu.com/*
// @exclude      http*://tieba.baidu.com/f/fdir*
// @exclude      http*://tieba.baidu.com/f/search*
// @exclude      http*://tieba.baidu.com/f/center/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409975/%E5%B1%8F%E8%94%BD%E8%B4%B4%E5%90%A7%E5%BC%BA%E5%88%B6%E7%BD%AE%E9%A1%B6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/409975/%E5%B1%8F%E8%94%BD%E8%B4%B4%E5%90%A7%E5%BC%BA%E5%88%B6%E7%BD%AE%E9%A1%B6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var loop = function () {
    const request = (url, options = {}) => fetch(url, Object.assign({
        credentials: 'omit',
        // 部分贴吧（如 firefox 吧）会强制跳转回 http（2020年已经全改成https了）
        redirect: 'follow',
        // 阻止浏览器发出 CORS 检测的 HEAD 请求头
        mode: 'same-origin',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    }, options)).then(res => res.text());
    var object2 = document.getElementById('pagelet_live/pagelet/live'); //通过id获取器获取对应元素
    if (object2 != null){
        object2.parentNode.removeChild(object2);
    }

        }
            setInterval(loop, 1);
})();