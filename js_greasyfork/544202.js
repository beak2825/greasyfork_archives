// ==UserScript==
// @name         标题替换
// @version      1.01
// @description  支持标签页关键词删除、替换、自定义规则、正则、split。规则按域名保存，仅对当前网站生效。
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @namespace    https://greasyfork.org/users/1171320
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544202/%E6%A0%87%E9%A2%98%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/544202/%E6%A0%87%E9%A2%98%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const siteKey = location.hostname;

    const helpText =
`✅ 规则语法说明（中间有空格，不能删完整个标题）
- 关键词              删除关键词
-i 关键词             忽略大小写删除
-s 关键词             删除关键词及空格
-^ 关键词             删除标题开头关键词
-$ 关键词             删除标题结尾关键词
>split 关键词          截取关键词前内容
r 原词 => 新词        替换关键词为新词（支持正则）

✅ 示例
  -i - 【4k】
  -s - YouTube
  r 营销管理平台 => 替换词
  r /在线.*工具/ => 替换词2

✅ 多个规则用英文逗号分隔，如：
  -i - 【4k】,r /营销.*平台/ => 替换词
`;

    let savedRules = GM_getValue('rules_' + siteKey, '');

    GM_registerMenuCommand('📝 规则', () => {
        let input = prompt(helpText + '\n当前页面规则:\n' + (savedRules || '无'), savedRules);
        if (input === null) return;

        const entries = input
            .replace(/，/g, ',')
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        GM_setValue('rules_' + siteKey, entries.join(','));
        showNotice('✅ 修改成功，下次打开网页生效');
    });

    function showNotice(msg) {
        const box = document.createElement('div');
        box.textContent = msg;
        Object.assign(box.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 99999,
            transition: 'opacity 1s ease',
            opacity: '1',
        });
        document.body.appendChild(box);
        setTimeout(() => { box.style.opacity = '0'; }, 2000);
        setTimeout(() => { box.remove(); }, 3000);
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function parseRule(ruleStr) {
        if (!ruleStr) return null;

        // 替换规则 r 原词 => 新词（支持正则）
        if (ruleStr.startsWith('r ')) {
            const match = ruleStr.match(/^r\s+(.+?)\s*=>\s*(.+)$/);
            if (!match) return null;
            const from = match[1].trim();
            const to = match[2];

            try {
                const reg = from.startsWith('/') && from.endsWith('/')
                    ? new RegExp(from.slice(1, -1), 'g')
                    : new RegExp(escapeRegExp(from), 'g');
                return title => title.replace(reg, to);
            } catch {
                return null;
            }
        }

        // split
        if (ruleStr.startsWith('>split')) {
            const key = ruleStr.slice(6).trim();
            return title => title.split(key)[0];
        }

        const m = ruleStr.match(/^(-i|-s|-\^|-\$|-)\s+(.+)$/);
        if (!m) return null;

        const prefix = m[1];
        const keywordRaw = m[2].replace(/%7C/gi, '|');
        const regexFlags = 'gi';

        let keywordEscaped;
        if (keywordRaw.includes('|')) {
            keywordEscaped = keywordRaw
                .split('|')
                .map(k => escapeRegExp(k.trim()))
                .join('|');
        } else {
            keywordEscaped = escapeRegExp(keywordRaw);
        }

        let pattern = '';
        switch (prefix) {
            case '-i': pattern = keywordEscaped; break;
            case '-s': pattern = `\\s*(${keywordEscaped})\\s*`; break;
            case '-^': pattern = `^(${keywordEscaped})\\s*`; break;
            case '-$': pattern = `\\s*(${keywordEscaped})$`; break;
            case '-':  pattern = `\\s*(${keywordEscaped})\\s*`; break;
            default: return null;
        }

        try {
            const reg = new RegExp(pattern, regexFlags);
            return title => title.replace(reg, '');
        } catch {
            return null;
        }
    }

    const ruleFuncs = [];
    if (savedRules) {
        for (const r of savedRules.split(',').map(s => s.trim())) {
            const f = parseRule(r);
            if (f) ruleFuncs.push(f);
        }
    }

    if (ruleFuncs.length === 0) return;

    function cleanTitle(title) {
        let t = title;
        for (const f of ruleFuncs) t = f(t);
        return t;
    }

    let lastTitle = '';
    function forceTitle() {
        const newTitle = cleanTitle(document.title);
        if (newTitle && newTitle !== document.title) {
            document.title = newTitle;
            lastTitle = newTitle;
        }
    }

    // 启动后立即尝试修改
    forceTitle();

    // 监听 <title> 节点变化
    const titleEl = document.querySelector('title');
    if (titleEl) {
        const observer = new MutationObserver(() => {
            if (document.title !== lastTitle) {
                forceTitle();
            }
        });
        observer.observe(titleEl, { childList: true });
    }

    // 定时兜底（避免 Vue 或延迟加载还原标题）
    setInterval(() => {
        if (document.title !== lastTitle) {
            forceTitle();
        }
    }, 1200);
})();
