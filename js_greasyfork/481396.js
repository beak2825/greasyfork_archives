// ==UserScript==
// @name         辱包检测
// @namespace    https://www.xuexi.cn/
// @website      https://www.xuexi.cn/
// @version      0.1
// @license MIT
// @description  在网页中检测辱包词语
// @author       中共中央宣传部
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481396/%E8%BE%B1%E5%8C%85%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481396/%E8%BE%B1%E5%8C%85%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

 // 定义要检测的多个特定文字
    var targetTexts = [
        '习泽东',
        '毛泽东2.0',
        '习特勒',
        '习奥塞斯库',
        '齐奥塞斯库',
        '习武帝',
        '总加速师',
        '独裁国贼',
        '二次袁',
        '袁世凯二世',
        '袁二',
        '清零宗',
        '清零帝',
        '大撒币',
        '小学博士',
        '习包子',
        '庆丰帝',
        '习壳郎',
        '梁家河村插队',
        '习维尼',
        '习维尼修斯',
        '习噗噗',
        '毛病与恶习',
        '萨格尔王',
        '习胖',
        '习猪',
        '习家',
        '习狗',
        '开倒车',
        '习大大',
        '庆丰元年',
        '习禁平',
        '细颈瓶'
    ];

    // 创建横幅提示的函数
    function showBanner() {
        var banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = 'yellow';
        banner.style.color = 'red';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '9999';
        banner.textContent = '别看你今天闹得欢，小心今后拉清单，这都得应验的。';

        document.body.appendChild(banner);

        // 3秒后移除横幅提示
        setTimeout(function() {
            banner.remove();
        }, 5000);
    }

    // 检测页面中的文字并触发横幅提示
    function checkForText() {
        var allTextNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var currentNode;

        while (currentNode = allTextNodes.nextNode()) {
            for (var i = 0; i < targetTexts.length; i++) {
                if (currentNode.nodeValue.includes(targetTexts[i])) {
                    showBanner();
                    return; // 只显示一次横幅提示，如果需要显示多次，可以注释掉这一行
                }
            }
        }
    }

    // 在页面加载完成后开始检测文字
    window.addEventListener('load', function() {
        checkForText();
    });

})();