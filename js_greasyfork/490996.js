// ==UserScript==
// @name         萌娘百科去adblock提示
// @namespace    
// @version      1.0.1
// @description  去adblock提示
// @author       cookedfish
// @match        https://zh.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490996/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BBadblock%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490996/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BBadblock%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    // 创建一个 MutationObserver 实例，配置观察器的参数
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 遍历每个新增节点
            mutation.addedNodes.forEach(function(node) {
                // 检查是否是 body 的子元素
                if ($(node).parent().is('body')) {
                    $('body').children().filter(function() {
                        return /^[a-zA-Z0-9]{11,13}$/.test($(this).attr('class'));
                    }).remove();
                    console.log('新增子元素:', node);
                }
            });
        });
    });

    // 配置观察器，监视 body 的子元素变化
    var observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

})();