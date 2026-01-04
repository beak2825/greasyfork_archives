// ==UserScript==
// @name 净化Baidu首页
// @version 1.0
// @description A script to remove baidu AD.
// @match *://*.baidu.com/*
// @namespace https://greasyfork.org/users/1363287
// @downloadURL https://update.greasyfork.org/scripts/506887/%E5%87%80%E5%8C%96Baidu%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/506887/%E5%87%80%E5%8C%96Baidu%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    function main(){
        const observer = new MutationObserver(()=>{document.querySelector(`#s_wrap`);document.querySelector(`#s_wrap`).style.display = `none`;}); //处理广告
        observer.observe(document.body, {childList: true, subtree: true }); //以上述配置开始观察广告节点
    }

    if (document.readyState === `loading`) {
        document.addEventListener(`DOMContentLoaded`, main); // 此时加载尚未完成
    } else {
        main();// 此时`DOMContentLoaded` 已经被触发
    }

})();
