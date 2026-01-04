// ==UserScript==
// @name         屏蔽自定义网址,定向到指定网址
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  支持通配符的自定义网址重定向工具
// @author       mryuyu
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533334/%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E5%9D%80%2C%E5%AE%9A%E5%90%91%E5%88%B0%E6%8C%87%E5%AE%9A%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/533334/%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E5%9D%80%2C%E5%AE%9A%E5%90%91%E5%88%B0%E6%8C%87%E5%AE%9A%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储键名
    const STORAGE_KEY = 'redirectRules';
    
    // 初始化/读取规则
    let redirectRules = GM_getValue(STORAGE_KEY, [
        {
            source: "*.twitter.com/*", 
            target: "https://www.baidu.com"
        },
        {
            source: "youtube.com/shorts*", 
            target: "https://youtube.com/watch?v=$1"
        }
    ]);

    // 注册管理菜单
    GM_registerMenuCommand("🔧 管理重定向规则", showRuleEditor);

    /* 规则编辑器界面 */
    function showRuleEditor() {
        const editorHTML = `
            <div style="padding:10px;font-family:sans-serif">
                <h3>重定向规则编辑器</h3>
                <div id="rulesList">
                    ${generateRulesHTML()}
                </div>
                <button onclick="addNewRule()" style="margin-top:10px">+ 添加规则</button>
                <p style="color:#666;margin-top:15px">
                    通配符说明：<br>
                    • 使用 * 匹配任意字符<br>
                    • 使用 $1/$2 引用捕获组<br>
                    示例：<br>
                    source: "site.com/old/*" → target: "site.com/new/$1"
                </p>
            </div>
        `;

        const win = window.open('', '_blank', 'width=600,height=500');
        win.document.write(editorHTML);
        
        // 动态函数绑定
        win.addNewRule = () => {
            redirectRules.push({ source: '', target: '' });
            win.document.getElementById('rulesList').innerHTML = generateRulesHTML();
        };
        win.saveRules = () => {
            const inputs = win.document.querySelectorAll('.rule-item');
            redirectRules = Array.from(inputs).map(input => ({
                source: input.querySelector('.source').value.trim(),
                target: input.querySelector('.target').value.trim()
            })).filter(rule => rule.source && rule.target);
            
            GM_setValue(STORAGE_KEY, redirectRules);
            win.close();
            window.location.reload();
        };
    }

    /* 生成规则输入HTML */
    function generateRulesHTML() {
        return redirectRules.map((rule, index) => `
            <div class="rule-item" style="margin:10px 0;padding:5px;border:1px solid #ddd">
                <div>规则 #${index + 1}</div>
                <input class="source" value="${rule.source}" 
                    placeholder="源地址（支持*）" style="width:100%;margin:5px 0">
                <input class="target" value="${rule.target}" 
                    placeholder="目标地址（支持$1替换）" style="width:100%;margin:5px 0">
                <button onclick="this.parentElement.remove()" style="color:red">删除</button>
            </div>
        `).join('');
    }

    /* 执行重定向逻辑 */
    function processRedirect() {
        const currentURL = window.location.href;
        
        for (const rule of redirectRules) {
            // 转换通配符为正则表达式
            const regexSource = rule.source
                .replace(/\./g, '\\.')
                .replace(/\*/g, '(.*)')
                .replace(/\?/g, '\\?');
            const regex = new RegExp(`^https?://${regexSource}(/.*)?$`, 'i');
            
            // 执行匹配
            const match = currentURL.match(regex);
            if (match) {
                // 构建目标URL（支持$1参数替换）
                let targetURL = rule.target;
                match.slice(1).forEach((group, index) => {
                    targetURL = targetURL.replace(`$${index + 1}`, group);
                });
                
                // 防止循环重定向
                if (targetURL !== currentURL) {
                    window.location.replace(targetURL);
                    return true; // 已重定向
                }
            }
        }
        return false;
    }

    // 页面加载时触发检查
    setTimeout(processRedirect, 100); // 延迟确保DOM加载完成
})();
