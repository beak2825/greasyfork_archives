// ==UserScript==
// @name         MutationObserver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407580/MutationObserver.user.js
// @updateURL https://update.greasyfork.org/scripts/407580/MutationObserver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Firefox和Chrome早期版本中带有前缀
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    // 选择需要观察变动的节点
    const targetNode = document.querySelector('html');

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };

    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            console.log(mutation);
            console.log(mutation.target);
            console.log("\n");
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

})();