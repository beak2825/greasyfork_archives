// ==UserScript==
// @name         52pj撒币帖子更显眼
// @match        https://www.52pojie.cn/home.php?mod=space&uid=1034393
// @version      1.2
// @description  实时监测并修改链接样式
// @author       aura service
// @match        https://www.52pojie.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      ISC
// @namespace https://greasyfork.org/users/1348251
// @downloadURL https://update.greasyfork.org/scripts/532038/52pj%E6%92%92%E5%B8%81%E5%B8%96%E5%AD%90%E6%9B%B4%E6%98%BE%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/532038/52pj%E6%92%92%E5%B8%81%E5%B8%96%E5%AD%90%E6%9B%B4%E6%98%BE%E7%9C%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认样式配置
    const defaultStyles = {
        fontWeight: 'bold',
        color: 'red',
        fontSize: '16px'
    };

    // 获取当前样式配置
    const styles = {
        fontWeight: GM_getValue('fontWeight', defaultStyles.fontWeight),
        color: GM_getValue('color', defaultStyles.color),
        fontSize: GM_getValue('fontSize', defaultStyles.fontSize)
    };

    // 注册菜单命令以设置样式
    GM_registerMenuCommand("设置链接样式", function() {
        const newFontWeight = prompt("请输入字体粗细 (例如: bold, normal):", styles.fontWeight);
        if (newFontWeight) {
            styles.fontWeight = newFontWeight;
            GM_setValue('fontWeight', styles.fontWeight);
        }

        const newColor = prompt("请输入字体颜色 (例如: red, #ff0000):", styles.color);
        if (newColor) {
            styles.color = newColor;
            GM_setValue('color', styles.color);
        }

        const newFontSize = prompt("请输入字体大小 (例如: 16px, 1em):", styles.fontSize);
        if (newFontSize) {
            styles.fontSize = newFontSize;
            GM_setValue('fontSize', styles.fontSize);
        }

        alert("样式已更新！");
    });

    // 函数：检查并修改样式
    function checkAndModify() {
        const rows = document.querySelectorAll('tbody tr'); // 查找 tbody 下的 tr
        //console.log(`找到 ${rows.length} 行`);

        rows.forEach(row => {
            const ths = row.querySelectorAll('th.common,th.new'); // 只查找 class 为 common或 new的 th
            let hasReward = false;

            ths.forEach(th => {
                const span = th.querySelector('span');
                if (span) {
                    //console.log(`检查 th 中的 span: ${span.textContent}`);
                    if (span.textContent.includes('回帖奖励')) {
                        hasReward = true;
                        //console.log('找到包含“回帖奖励”的 ${span}');
                    }
                }
            });

            if (hasReward) {
                //console.log('对该行的 class 为 common 的 a 标签进行样式修改');
                const links = row.querySelectorAll('th.common a.s.xst, th.new a.s.xst'); // 选择 class 为 common 或 new 的 th 下的 a 标签
                links.forEach(link => {
                    link.style.fontWeight = styles.fontWeight;
                    link.style.color = styles.color;
                    link.style.fontSize = styles.fontSize;
                    //console.log(`修改链接: ${link.textContent}`);
                });
            } else {
                //console.log('该行没有包含“回帖奖励”的 span');
            }
        });
    }

    // 创建一个观察者实例
    const observer = new MutationObserver(checkAndModify);

    // 配置观察者选项
    const config = { childList: true, subtree: true };

    // 开始观察整个文档的 body
    observer.observe(document.body, config);
    console.log('开始观察整个文档的 body');

    // 初始检查
    checkAndModify();

    // 定时检查，每5秒执行一次
    setInterval(checkAndModify, 1000);
})();
