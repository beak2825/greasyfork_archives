// ==UserScript==
// @name         GRG自动服务管理页面
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在打开http://10.2.8.200/index.do网页时，自动点击"服务管理"元素，然后在iframe中点击"#treeDemo_1_switch"元素，并展开后再点击"#treeDemo_1_ul"下的所有<span>元素。
// @author       You
// @match        http://10.2.8.200/index.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472489/GRG%E8%87%AA%E5%8A%A8%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/472489/GRG%E8%87%AA%E5%8A%A8%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载完毕后执行点击操作
    window.addEventListener('load', function() {
        // 查找“服务管理”元素
        var serviceManagementElement = document.querySelector('body > table > tbody > tr:nth-child(1) > td > div > div.headerbanerright > div.nav_content > div.nav > ul > li:nth-child(4) > a');

        if (serviceManagementElement) {
            // 模拟点击操作
            serviceManagementElement.click();

            // 等待一段时间，确保iframe加载完成
            setTimeout(function() {
                // 查找iframe元素
                var iframe = document.getElementById('submenu');

                if (iframe) {
                    // 切换到iframe
                    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                    // 查找"#treeDemo_1_switch"元素
                    var treeDemoSwitchElement = iframeDocument.querySelector('#treeDemo_1_switch');

                    if (treeDemoSwitchElement) {
                        // 模拟点击"#treeDemo_1_switch"元素
                        treeDemoSwitchElement.click();

                        // 等待一段时间，确保"#treeDemo_1_ul"展开
                        setTimeout(function() {
                            // 查找"#treeDemo_1_ul"下的所有<span>元素
                            var spans = iframeDocument.querySelectorAll('#treeDemo_1_ul span');

                            // 遍历并点击所有<span>元素
                            spans.forEach(function(span) {
                                span.click();
                            });
                        }, 1000); // 在这里设置等待时间，根据实际情况调整
                    } else {
                        console.log("未找到#treeDemo_1_switch元素");
                    }
                } else {
                    console.log("未找到iframe元素");
                }
            }, 2000); // 在这里设置等待时间，根据实际情况调整
        } else {
            console.log("未找到服务管理元素");
        }
    });
})();
