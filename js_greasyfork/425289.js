// ==UserScript==
// @name         强制使用国内镜像访问etherscan.io
// @namespace    http://hhtjim.com/
// @version      0.1
// @description  强制以太坊浏览器使用国内镜像!避免cf的访问验证以及代理问题。
// @author       You
// @match        http://etherscan.io/*
// @match        https://etherscan.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425289/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F%E8%AE%BF%E9%97%AEetherscanio.user.js
// @updateURL https://update.greasyfork.org/scripts/425289/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F%E8%AE%BF%E9%97%AEetherscanio.meta.js
// ==/UserScript==

(function(){
    'use strict';
//    const $=document.querySelector.bind(document);
//    const $$=document.querySelectorAll.bind(document);
//    const video=$('div');
    const mirror_host = 'cn.etherscan.com';// 需要访问的镜像站点
    const old_url = window.document.location.href;
    console.log(`${old_url} ==>> ${mirror_host}`)
    window.document.location.host = mirror_host
    history.pushState({}, "etherscan.io", old_url)
})();