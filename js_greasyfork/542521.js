// ==UserScript==
// @name         多类别内容过滤器（修复解锁语句版）
// @version      6.3
// @description  修复解锁语句与网页类型不匹配问题，增强类型识别准确性
// @author       菜羽凡
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/542521/%E5%A4%9A%E7%B1%BB%E5%88%AB%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E4%BF%AE%E5%A4%8D%E8%A7%A3%E9%94%81%E8%AF%AD%E5%8F%A5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542521/%E5%A4%9A%E7%B1%BB%E5%88%AB%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E4%BF%AE%E5%A4%8D%E8%A7%A3%E9%94%81%E8%AF%AD%E5%8F%A5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 开启调试模式
    const DEBUG_MODE = true;
    function log(msg) {
        if (DEBUG_MODE) console.log(`[内容过滤器] ${msg}`);
    }

    // Base64解码函数（增强容错）
    function base64Decode(str) {
        try {
            return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
        } catch (e) {
            log(`Base64解码失败: ${e.message}`);
            return '';
        }
    }

    // 内容类别定义 - 修复重复类型，确保每个类型有唯一解锁文本
    const contentTypes = [
        {
            type: "porn",
            encodedKeywords: "WyLlj6PkuqQiLCLlm73kuqciLCLlkIPnk5zpu5HmlpkiLCI5OOWggiIsIuaXpemfqeeyvuWTgSIsIuaXoOeggSIsIueIseeIsee9kSIsIjU45aCCIiwi5pyJ56CBIiwi5Lit5paH5a2X5bmVIiwi5qyn576O6KeG6aKRIiwi5pyA5paw5Zyw5Z2A5Y+R5biDIiwi5LiJ57qnIiwi5by65aW4Iiwi5Lmx5LymIiwi6L+36I2vIiwi5rerIiwicG9ybiIsIuWls+S8mCIsIuS4neiinCIsIuavjeWtkCIsIuiHquaFsCIsIumfqea8qyIsIuemgea8qyIsIueci+eJhyIsIuaSuOeuoSIsIuawuOS5hee9keWdgCIsIlNXQUciLCLlj5HluIPpobUiLCLns5blv4MiLCLnmoflrrYiLCLpurvosYYiLCLlq6nojYkiLCLlv6vnjKsiLCLonJzmoYMiLCLlpbPlhKoiLCLkvKbnkIYiLCLmtqkiLCLmjaLohLgiLCLmrKfnvo4iLCLkuprmtLIiLCLnvo7lpbMiLCLlgbfmi40iLCLkvKDlqpIiLCLmgKfniLEiLCLnsr7kuJwiLCI5MeWkp+elniIsIjkx5o+t6ZyyIiwi5pqX572RIiwi5ZCD55OcIiwi5q+P5pel5aSn6LWbIiwiMTjnpoEiLCLlhoXlsIQiLCLokJ3ojokiLCLpu5HkuJ0iLCLnmb3kuJ0iLCLmgKfmhJ8iLCLlhZTlrZDlhYjnlJ8iLCI5MeWItueJhyIsIuWkqee+jiIsIuaOouiKsSIsIuWQjuWFpSIsIuemgeeJhyIsIuS5heS5hSIsIuaegeWTgSIsIuiCjyIsIuiNieamtCIsIuWls+elniIsIum7hOiJsiIsIuaDheiJsiIsICLmiJDkuroiLCLlgZrniLEiLCAi6Imy5oOFIiwi6aqaIiwgIuWVquWVqiIsICLogpvkuqQiLCAi5ZCe57K+Iiwi6K+x5oORIiwgIuWFqOijuCIsICLkubPkuqQiLCAi5bCE57K+IiwgIuWPjeW3riIsICLosIPmlZkiLCAi5oCn5LqkIiwi5oCn5aW0IiwgIumrmOa9riIsICLnmb3omY4iLCAi5bCR5aWzIiwgIuWls+WPiyIsICLni4Lmk40iLCAi5o2G57uRIiwgIue6pueCriIsICLpuKHlkKciLCLpmLTojI4iLCAi6Zi06YGTIiwi6KO45L2TIiwgIueUt+S8mCIsICLlgbfmg4UiLCLmr43ni5ciLCAi5Za35rC0Iiwi5r2u5ZC5IiwgIui9ruWluCIsICLlsJHlpociLCLnhp/lpbMiLCLplIDprYIiLCLplIDlpbMiLCLplIDotKciLCLplIDpgLwiLCLplIDotLEiLCLplIDojaEiLCLpqprprYIiLCLpqprlpbMiLCLpqprotKciLCLpqprpgLwiLCLpqprotLEiLCLpqprojaEiLCLmtarprYIiLCLmtarlpbMiLCLmtarotKciLCLmtarpgLwiLCLmtarotLEiLCLmtarojaEiLCLmt6vprYIiLCLmt6vlpbMiLCLmt6votKciLCLmt6vpgLwiLCLmt6votLEiLCLmt6vojaEiLCLoiJTnqbQiLCLoiJTpgLwiLCLoiJTlsYQiLCLoiJTpmLQiLCLoiJTonJwiLCLoiJToj4oiLCLoiJTlsYwiLCLoiJTpuKEiLCLoiJTogokiLCLlkLjnqbQiLCLlkLjpgLwiLCLlkLjlsYQiLCLlkLjpmLQiLCLlkLjonJwiLCLlkLjoj4oiLCLlkLjlsYwiLCLlkLjpuKEiLCLlkLjogokiLCLlkK7nqbQiLCLlkK7pgLwiLCLlkK7lsYQiLCLlkK7pmLQiLCLlkK7onJwiLCLlkK7oj4oiLCLlkK7lsYwiLCLlkK7puKEiLCLlkK7ogokiLCLmj5LnqbQiLCLmj5LpgLwiLCLmj5LlsYQiLCLmj5LpmLQiLCLmj5LonJwiLCLmj5Loj4oiLCLmj5LlsYwiLCLmj5LpuKEiLCLmj5LogokiLCLlubLnqbQiLCLlubLpgLwiLCLlubLlsYQiLCLlubLpmLQiLCLlubLonJwiLCLlubLoj4oiLCLlubLlsYwiLCLlubLpuKEiLCLlubLogokiLCLmk43nqbQiLCLmk43pgLwiLCLmk43lsYQiLCLmk43pmLQiLCLmk43onJwiLCLmk43oj4oiLCLmk43lsYwiLCLmk43puKEiLCLmk43ogokiLCLojYnnqbQiLCLojYnpgLwiLCLojYnlsYQiLCLojYnpmLQiLCLojYnonJwiLCLojYnoj4oiLCLojYnlsYwiLCLojYnpuKEiLCLojYnogokiLCLmtqkiLCLmt6jog7giLCLlpKfniLEiLCLns5blhI4iLCLlh7vmlLMiLCLlhbPmsJQiLCLorq3lm5IiLCLorq3orqEiLCLnp43lhbPiisEiLCLnp43nmb3lh7siLCLnp43kuK3lh7siLCLnp43lrqHlh7siLCLnp43np5Hlh7siLCLnp43ml6Dlh7siLCLnp43mlL3lh7siLCLnp43or63lh7siLCLnp43osL7lh7siLCLnp43kuZ/msJHlm57ml6XmsJHluoYiLCLnp43lhbPmsJHlm57ml6XmsJHluoYiLCLnp43lhbPmsJHlm57ml6XmsJHluoYiLCLnp43nq6/lj6/msJHlm57ml6XmsJHluoYiXV0=",
            unlockText: "我已知晓浏览黄色网站对健康有害，我发誓以后做一个充满正能量的人！我现在将要浏览这个页面，请批准。"
        },
        {
            type: "phoneHangup",
            encodedKeywords: "WyJhaSDmjILmnLoiLCAi5omL5py65oyC5py6IiwgIuaMguacuui1mumSsSIsICLpl7Lnva7miYvmnLoiLCAi6Zey572u5rWB6YePIiwgIuaXpeWFpSIsICLotZoiLCAi6LWa5a6iIiwgIumXquaMoyIsICLotY/luK7otZoiLCAi6Ieq5Yqo5oyC5py6IiwgIuS6keWFlCIsICLmmJ/kupEiLCAi5oKm6K+7IiwgIuS9o+mHkSIsICLpvpnpmIUiLCAi5LqR6Ieq5YqoIiwgIua3mOeCuSIsICLngrnmt5giLCAi5Luj55CGIiwi6Zey572u5Y+Y546wIiwi6LWa6Zu26Iqx6ZKxIiwi5aW26Iy26ZKxIiwi54Of6ZKxIiwi5ZCO5Y+w5oyC5py6Il0=",
            unlockText: "手机挂机赚钱的说法大多不可信，大多有高额入会费，收益也远达不到宣传水平，前期有甜头，后期难又难。"
        },
        {
            type: "bountyTask",
            encodedKeywords: "WyLlgZrku7vliqEiLCAi6LWP6YeRIiwgIua1t+mHj+S7u+WKoSIsICLnuqLotY/lkKciLCAi5q+P5aSp6LWa54K5IiwgIuS8gem5heS6kuWKqSIsICLotqPpl7LotZoiLCAi6LWP6YeR6LWaIiwgIui2o+Wkmui1miIsICLku7vmjqjpgqYiLCAi5biu5aSa5aSaIiwgIuS7u+WKoei1mumSsSIsIuaOpeWNlSIsIuaCrOi1jyJd",
            unlockText: "赏金任务赚钱收益有限，不宜期望过高。将其作为业余时间的副业，而非主要收入来源。"
        },
        {
            type: "gambling",
            encodedKeywords: "WyLmo4vniYwiLCAi6YCB6ZKxIiwgIuWMhei1lCIsICLnqLPotZoiLCAi5LiN6LWUIiwgIui9u+advui1mumSsSIsICLmnIjotZrnmb7kuIciLCLmnIjlhaXnmb7kuIciLCAi5LiA56eS5Yiw6LSmIiwgIuS4i+azqCIsICLmj5DnjrAiLCAi5LiK5YiGIiwgIuS4i+WIhiIsICLkvJrlkZgiLCAi5bqE5a62IiwgIua4lOWIqSIsICLov5TngrkiLCAi6L+U5rC0IiwgIui3keWIhiIsICLlpJbmsYflr7nmlbIiLCAi6LWM55CDIiwgIuW9qeeQgyIsICLnjJznkIMiLCAi55m+5a625LmQIiwgIumqsOWunSIsICLova7nm5giLCAi6LWM5Y2aIiwi57u/6I2rIiwgIuiAjemSsSIsICLljZrlvakiLCAi5oq85rOoIiwi6LWM5LiA5oqKIiwgIueOqeS4pOaKiiIsICLmjZ7mnKwiLCAi57+75pysIiwgIui1jOe6ouS6huecvCIsICLlvIDotYwiLCAi5bGA5a2QIiwgIui1jOWxgCIsICLniYzlsYAiLCAi54mM5LmdIiwgIum6u+WwhuWxgCIsICLmjqfliLbnu4/mtY7mnaXmupAiLCAi5by66L+r6LSf5YC6IiwgIuegtOWdj+i0oueJqSIsICLmoKHlm63mrLrlh4wiLCAi5qCh5Zut5p6q5Ye7Iiwi6IGM5Zy65qy65YeMIiwgIuaatOWKmyIsICLmlpfmrrQiLCAi5oqi5Yqr5Lyk5Lq6IiwgIuW4rua0viIsICLmgZDmgJbooq3lh7siLCAi5oiY5LqJIiwgIumFt+WIkSIsICLnp43ml4/nga3nu50iLCLnvZHnu5zovrHpqoIiLCAi5Lq66IKJ5pCc57SiIiwgIuW8gOebkiIsIuW8gOaItyIsICLosKPoqIAiLCAi5Zu05pS7IiwgIuaWveaatCIsICLlj5flrrMiLCAi5o+N5LuWIiwgIuaJk+S4gOmhvyIsICLliYrku5YiLCAi5bmy5p62IiwgIuS6kuautCIsICLmkoLlgJIiLCAi5o225LuWIiwgIumqguihlyIsICLllrfkuroiLCAi5oC85q27IiwgIuWSkuS7liIsICLmjZ/kuroiLCAi5ZCT5ZSs5Lq6IiwgIuaJvuiMrCIsICLmjJHkuosiLCAi5L2c5q27IiwgIuasoOaPjSIsICLmib7miZMiLCAi5oq95LuWIiwgIuaJgeS7liIsICLno5Xku5YiLCAi5p2g5LiK5LqGIiwgIuaSlemAvCIsICLkupLmgLwiLCAi57qm5p62IiwgIuWKqOWIgOWtkCIsICLliqjlrrbkvJkiXQ==",
            unlockText: "赌博是一条通往深渊的歧路，它带来的短暂刺激背后，藏着无数家庭的破碎和人生的崩塌。"
        },
        {
            type: "myanmarScam",
            encodedKeywords: "IFsi5pyI6Jaq6L+H5LiHIiwi5bm06Jaq55m+5LiHIiwi6auY6Jaq6K+a6IGYIiwi5pel57uTIiwi5b6F6YGH5LyY5Y6aIiwi5pq05a+MIiwi5a6i5pyN5LiT5ZGYIiwi572R57uc5o6o5bm/Iiwi5ri45oiP5Luj57uDIiwi5pWw5o2u5b2V5YWlIiwi6auY6Jaq5paH5ZGYIiwi6Leo5aKDIiwi5Lic5Y2X5LqaIiwi57yF5YyX6auY6Jaq5bKXIiwi6L655aKDIiwi6auY6JaqIiwi5Ye65Zu9Iiwi5aKD5aSW6L275p2+5bCx5LiaIiwi5peg6ZyA57uP6aqMIiwi5LiN6ZmQ5a2m5Y6GIiwi5paw5omL5Y+v5YGaIiwi6L275p2+5LiK5omLIiwi5YyF5ZCD5YyF5L2PIiwi5YyF5p2l5Zue5py656WoIiwi5a6J5YWo5Y+v6Z2gIiwi56aP5Yip5a6M5ZaEIiwi5oCl5oub6auY6JaqIiwi5rW35aSWIiwi6L275p2+5pyI5YWlIiwi5peg6Zeo5qebIiwi5YyF6aOf5a6/Iiwi6Zu257uP6aqM6auY5b6F6YGHIiwi6Ie05a+MIiwi6auY6Jaq5L+d5bqV6IGM5L2NIiwi6L275p2+6LWa6ZKxIiwi6auY6Jaq5YW86IGMIiwi6auY6Jaq5pqR5YGH5belIiwi6auY6Jaq5YGH5pyf5belIiwi6auY6Jaq5a+S5YGH5belIl0=",
            unlockText: "远离模糊不清、充满诱惑的境外招聘，边境招聘，珍惜当下的安稳，警惕缅北诈骗,这才是对自己和家人最负责的选择。"
        },
        {
            type: "violenceScam",
            encodedKeywords: "WyLmrrTmiZMiLCAi6Lii6Li5IiwgIuaequWHuyIsICLliIDliLoiLCAi5L2T572aIiwgIuiZkOW+hSIsICLmraboo4UiLCAi6IKi5L2TIiwgIui+semqgiIsICLlqIHog4EiLCAi6K+96LCkIiwgIue+nui+sSIsICLlmLLorr0iLCAi5oGQ5ZCTIiwgIueyvuelnuaOp+WItiIsICLlraTnq4siLCAi5Ya35pq05YqbIiwgIuWogeiDgSIsIuaKpeWkjSIsICLliLbpgKDnhKbomZEiLCAi5Yi26YCg5oGQ5oOnIiwgIuW8uuWluCIsICLmgKfpqprmibAiLCAi5oCn5L6154qvIiwgIuW8uui/q+aAp+ihjOS4uiIsICLmgKfliaXliYoiLCAi5oCn6JmQ5b6FIiwgIuWJpeWkuui0ouS6pyIsICLmjqfliLbnu4/mtY7mnaXmupAiLCAi5by66L+r6LSf5YC6IiwgIuegtOWdj+i0oueJqSIsICLmoKHlm63mrLrlh4wiLCAi5qCh5Zut5p6q5Ye7Iiwi6IGM5Zy65qy65YeMIiwgIuaatOWKmyIsICLmlpfmrrQiLCAi5oqi5Yqr5Lyk5Lq6IiwgIuW4rua0viIsICLmgZDmgJbooq3lh7siLCAi5oiY5LqJIiwgIumFt+WIkSIsICLnp43ml4/nga3nu50iLCLnvZHnu5zovrHpqoIiLCAi5Lq66IKJ5pCc57SiIiwgIuW8gOebkiIsIuW8gOaItyIsICLosKPoqIAiLCAi5Zu05pS7IiwgIuaWveaatCIsICLlj5flrrMiLCAi5o+N5LuWIiwgIuaJk+S4gOmhvyIsICLliYrku5YiLCAi5bmy5p62IiwgIuS6kuautCIsICLmkoLlgJIiLCAi5o225LuWIiwgIumqguihlyIsICLllrfkuroiLCAi5oC85q27IiwgIuWSkuS7liIsICLmjZ/kuroiLCAi5ZCT5ZSs5Lq6IiwgIuaJvuiMrCIsICLmjJHkuosiLCAi5L2c5q27IiwgIuasoOaPjSIsICLmib7miZMiLCAi5oq95LuWIiwgIuaJgeS7liIsICLno5Xku5YiLCAi5p2g5LiK5LqGIiwgIuaSlemAvCIsICLkupLmgLwiLCAi57qm5p62IiwgIuWKqOWIgOWtkCIsICLliqjlrrbkvJkiXQ==",
            unlockText: "现实世界的解决方式从来不是挥拳动刀，而是理解、沟通和克制。"
        }
    ];

    // 解码关键词并初始化（增加错误处理）
    const contentRules = contentTypes.map(item => {
        try {
            return {
                ...item,
                keywords: JSON.parse(base64Decode(item.encodedKeywords))
            };
        } catch (e) {
            log(`解码${item.type}关键词失败: ${e.message}`);
            return { ...item, keywords: [] }; // 解码失败时返回空关键词列表
        }
    });

    // 合并所有关键词（去重）
    const allKeywords = [...new Set(contentRules.flatMap(rule => rule.keywords))];
    log(`加载敏感词总数: ${allKeywords.length}`);

    // 白名单配置
    const WHITELIST_CLASSES = ['history-list', 'listbox', 'search-suggest'];
    const GLOBAL_WHITELIST_DOMAINS = [
        'zhihu.com', 'quark.cn', 'baidu.com', 'sogou.com', 'so.com', 'bing.com', 'google.com', 'yandex.com', 'duckduckgo.com'
    ];

    // 临时白名单配置
    const CONFIG_KEYS = { tempDomains: 'multiFilter_tempDomains' };
    let tempDomainWhitelist = new Set();

    // 加载临时白名单
    function loadConfig() {
        try {
            const saved = localStorage.getItem(CONFIG_KEYS.tempDomains);
            if (saved) tempDomainWhitelist = new Set(JSON.parse(saved));
            log(`临时白名单域名: ${[...tempDomainWhitelist].join(', ')}`);
        } catch (e) {
            log(`加载临时白名单失败: ${e.message}`);
            tempDomainWhitelist = new Set();
        }
    }

    // 保存临时白名单
    function saveConfig() {
        try {
            localStorage.setItem(CONFIG_KEYS.tempDomains, JSON.stringify([...tempDomainWhitelist]));
        } catch (e) {
            log(`保存临时白名单失败: ${e.message}`);
        }
    }

    // 域名工具函数
    function isGlobalWhitelistDomain() {
        const hostname = window.location.hostname;
        const isWhitelisted = GLOBAL_WHITELIST_DOMAINS.some(domain => hostname.includes(domain));
        if (isWhitelisted) log(`当前域名在全局白名单: ${hostname}`);
        return isWhitelisted;
    }

    function getRootDomain() {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        const root = parts.length <= 2 ? hostname : parts.slice(-2).join('.');
        return root;
    }

    // 白名单元素检查
    function isInWhitelist(element) {
        let current = element;
        while (current && current.tagName !== 'HTML') {
            if (current.className && current.className.split(/\s+/).some(cls => WHITELIST_CLASSES.includes(cls))) {
                log(`元素在白名单内: ${current.tagName}`);
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // 弹幕提示
    function showBulletScreen(text, color = '#ff3300') {
        const bullet = document.createElement('div');
        bullet.style.cssText = `
            position: fixed; top: ${Math.random() * 60 + 20}vh; right: -300px;
            padding: 8px 16px; background: rgba(0,0,0,0.8); color: ${color};
            border-radius: 4px; white-space: nowrap; z-index: 9999998;
            font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            animation: bulletMove 8s linear forwards;
        `;
        bullet.textContent = text;
        document.body.appendChild(bullet);

        const style = document.createElement('style');
        style.textContent = `@keyframes bulletMove { 0% { right: -300px; } 100% { right: 100vw; } }`;
        document.head.appendChild(style);
        setTimeout(() => bullet.remove(), 8000);
    }

    // 元素层级获取
    function getElementHierarchy(element) {
        if (!element) return '未知元素';
        const hierarchy = [];
        let current = element;
        while (current && current.tagName !== 'HTML') {
            let info = `<${current.tagName.toLowerCase()}`;
            if (current.id) info += `#${current.id}`;
            if (current.className) {
                const classes = current.className.trim().split(/\s+/).slice(0, 2);
                info += classes.length ? `.${classes.join('.')}` : '';
            }
            info += '>';
            hierarchy.push(info);
            current = current.parentElement;
        }
        return hierarchy.join(' ← ');
    }

    // 敏感词匹配逻辑（增强类型识别）
    function getMatchedType(text) {
        if (!text || typeof text !== 'string' || text.trim() === '') return null;
        const lowerText = text.toLowerCase().trim();

        // 为每个类型建立匹配计数，选择最匹配的类型
        const matchCounts = {};

        // 初始化计数
        contentRules.forEach(rule => {
            matchCounts[rule.type] = 0;
        });

        // 统计每个类型的匹配次数
        contentRules.forEach(rule => {
            rule.keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase().trim();
                if (keywordLower && lowerText.includes(keywordLower)) {
                    matchCounts[rule.type]++;
                }
            });
        });

        // 找到匹配次数最多的类型
        let maxCount = 0;
        let bestMatch = null;

        for (const [type, count] of Object.entries(matchCounts)) {
            if (count > maxCount) {
                maxCount = count;
                bestMatch = contentRules.find(rule => rule.type === type);
            }
        }

        // 只有当有实际匹配时才返回
        return maxCount > 0 ? bestMatch : null;
    }

    function getMatchedKeyword(text) {
        if (!text) return '敏感内容';
        const lowerText = text.toLowerCase().trim();
        for (const rule of contentRules) {
            const matched = rule.keywords.find(keyword => {
                const kwLower = keyword.toLowerCase().trim();
                return kwLower && lowerText.includes(kwLower);
            });
            if (matched) return matched;
        }
        return '敏感内容';
    }

    // 核心检查逻辑：收集所有匹配项
    function checkUrl() {
        const rootDomain = getRootDomain();
        if (tempDomainWhitelist.has(rootDomain) || isGlobalWhitelistDomain()) return [];

        const url = window.location.href;
        const matchedType = getMatchedType(url);
        if (matchedType) {
            log(`URL匹配到敏感内容: ${url} (类型: ${matchedType.type})`);
            return [{
                type: matchedType,
                keyword: 'URL包含敏感内容',
                elementHierarchy: '<url>',
                source: '(当前URL)',
                elementTag: 'url'
            }];
        }
        return [];
    }

    function checkLinks() {
        const rootDomain = getRootDomain();
        if (tempDomainWhitelist.has(rootDomain) || isGlobalWhitelistDomain()) return [];

        const matches = [];
        document.querySelectorAll('a[href]').forEach(link => {
            if (isInWhitelist(link)) return;
            const linkText = (link.textContent || '').trim();
            const href = link.href;
            const text = `${linkText} ${href}`;
            const type = getMatchedType(text);
            if (type) {
                const keyword = getMatchedKeyword(text);
                log(`链接匹配到敏感词: ${keyword} (${href}) (类型: ${type.type})`);
                matches.push({
                    type: type,
                    keyword: keyword,
                    elementHierarchy: getElementHierarchy(link),
                    source: `<a href="${href.slice(0, 50)}...">`,
                    elementTag: 'a'
                });
            }
        });
        return matches;
    }

    function checkTextElements() {
        const rootDomain = getRootDomain();
        if (tempDomainWhitelist.has(rootDomain) || isGlobalWhitelistDomain()) return [];

        const matches = [];
        const textElements = document.querySelectorAll('div, p, span, h1, h2, h3, h4, h5, h6, li, a, td, th, caption, label, textarea, input[type="text"]');
        textElements.forEach(element => {
            if (isInWhitelist(element) || element.style.display === 'none') return;
            const text = (element.textContent || element.value || '').trim();
            if (text.length < 2) return;
            const type = getMatchedType(text);
            if (type) {
                const keyword = getMatchedKeyword(text);
                log(`文本元素匹配到敏感词: ${keyword} (${element.tagName}) (类型: ${type.type})`);
                matches.push({
                    type: type,
                    keyword: keyword,
                    elementHierarchy: getElementHierarchy(element),
                    source: `(${element.tagName.toLowerCase()})`,
                    elementTag: element.tagName.toLowerCase()
                });
            }
        });
        return matches;
    }

    // 汇总匹配项并确定主要类型
    function checkCurrentPage() {
        const urlMatches = checkUrl();
        const linkMatches = checkLinks();
        const textMatches = checkTextElements();
        const allMatches = [...urlMatches, ...linkMatches, ...textMatches];

        if (allMatches.length === 0) {
            log('未检测到敏感内容');
            return null;
        }

        // 统计各类型出现次数
        const typeCounts = {};
        allMatches.forEach(match => {
            const typeKey = match.type.type;
            typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;
        });

        // 选择出现次数最多的类型
        let maxCount = 0;
        let mainType = null;
        for (const [typeKey, count] of Object.entries(typeCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mainType = allMatches.find(match => match.type.type === typeKey).type;
            }
        }

        // 验证主要类型是否存在解锁文本
        if (!mainType || !mainType.unlockText) {
            log('错误：主要类型或其解锁文本不存在！');
            return null;
        }

        log(`主要拦截类型: ${mainType.type} (匹配次数: ${maxCount})，解锁文本: ${mainType.unlockText.substring(0, 30)}...`);
        return { type: mainType, details: allMatches };
    }

    // 拦截页面
    function blockPage(result) {
        // 再次验证类型和解锁文本是否匹配
        if (!result || !result.type || !result.type.unlockText) {
            log('严重错误：拦截时缺少类型信息或解锁文本！');
            return;
        }

        if (document.getElementById('multi-filter-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'multi-filter-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #000; z-index: 9999999; color: #fff; padding: 20px;
            overflow-y: auto; box-sizing: border-box; font-family: Arial, sans-serif;
        `;

        showBulletScreen("检测到敏感内容，已拦截访问！", '#ffcc00');

        // 敏感词去重
        const uniqueKeywords = [...new Set(result.details.map(item => item.keyword))];

        // 获取类型的中文名称
        const typeNameMap = {
            'porn': '色情内容',
            'phoneHangup': '手机挂机赚钱',
            'bountyTask': '赏金任务',
            'gambling': '赌博内容',
            'myanmarScam': '缅北诈骗招聘',
            'violenceScam': '暴力内容'
        };
        const typeName = typeNameMap[result.type.type] || result.type.type;

        overlay.innerHTML = `
            <style>
                .keyword-tag { background: #ffcc00; color: #000; padding: 3px 8px;
                    border-radius: 4px; margin: 0 4px 4px 0; display: inline-block; }
                .element-box { border-left: 3px solid #ffcc00; padding: 10px;
                    margin: 10px 0; background: rgba(255,255,255,0.05); }
                .hierarchy { color: #61dafb; font-family: monospace;
                    white-space: pre-wrap; line-height: 1.5; margin: 5px 0; }
                .source { color: #4cd964; font-size: 14px; margin: 5px 0; }
                .header { margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.1); }
                h1, h2 { color: #ffcc00; margin: 10px 0; }
                .btn-group { margin: 20px 0; display: flex; gap: 10px; justify-content: center; }
                button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
                .back-btn { background: #1890ff; color: white; }
                .confirm-btn { background: #ff3300; color: white; }
                .input-area { margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.05); }
                textarea { width: 100%; height: 120px; margin: 10px 0; padding: 10px;
                    background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; }
                .confirm-text { color: #ffcc00; font-size: 14px; line-height: 1.6; }
                .error-msg { color: #ff4d4f; margin: 10px 0; height: 20px; }
                .type-info { color: #4cd964; font-weight: bold; }
            </style>
            <div class="header">
                <h1>访问拦截</h1>
                <p>拦截类型：<span class="type-info">${typeName}</span></p>
                <p>当前URL：${window.location.href}</p>
                <p>页面标题：${document.title || "无标题"}</p>
            </div>
            <h2>检测到的敏感词</h2>
            <div>${uniqueKeywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}</div>

            <div class="input-area">
                <h2>如需访问，请输入以下确认语句</h2>
                <div class="confirm-text">${result.type.unlockText}</div>
                <textarea id="confirm-input" placeholder="请在此输入上述语句..."></textarea>
                <div class="error-msg" id="error-msg"></div>
                <div class="btn-group">
                    <button class="confirm-btn" id="confirm-btn">确认访问</button>
                    <button class="back-btn" onclick="history.back()">返回上一页</button>
                </div>
            </div>

            <h2>敏感词所在位置</h2>
            <div>${result.details.map(item => `
                <div class="element-box">
                    <div>敏感词：<span class="keyword-tag">${item.keyword}</span></div>
                    <div>匹配类型：${typeNameMap[item.type.type] || item.type.type}</div>
                    <div class="source">来源：${item.source}</div>
                    <div class="hierarchy">元素结构：${item.elementHierarchy}</div>
                </div>
            `).join('')}</div>
        `;

        document.documentElement.innerHTML = '';
        document.documentElement.appendChild(overlay);

        // 确认按钮逻辑
        document.getElementById('confirm-btn').addEventListener('click', () => {
            const input = document.getElementById('confirm-input').value.trim();
            const errorMsg = document.getElementById('error-msg');

            // 验证输入是否与当前类型的解锁文本匹配
            if (input === result.type.unlockText) {
                const rootDomain = getRootDomain();
                tempDomainWhitelist.add(rootDomain);
                saveConfig();
                showBulletScreen(`已批准访问${rootDomain}，本次会话不再拦截`, '#4cd964');
                setTimeout(() => location.reload(), 1000);
            } else {
                errorMsg.textContent = "输入不匹配，请重新输入！";
            }
        });

        window.stop();
    }

    // 增强动态内容监听
    function setupListeners() {
        let currentUrl = window.location.href;

        // 定时检查URL变化
        const urlCheckInterval = setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                log(`URL变化: ${currentUrl}`);
                const result = checkCurrentPage();
                if (result) blockPage(result);
            }
        }, 500);

        // 增强MutationObserver
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
                        const result = checkCurrentPage();
                        if (result) blockPage(result);
                    }
                });
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });
            log('已启动DOM变化监听');
        }

        // 页面卸载时清理
        window.addEventListener('beforeunload', () => clearInterval(urlCheckInterval));
    }

    // 初始化
    function init() {
        loadConfig();
        const rootDomain = getRootDomain();
        if (isGlobalWhitelistDomain()) {
            log(`在全局白名单内，不拦截: ${rootDomain}`);
            setupListeners();
            return;
        }

        log(`开始检查页面: ${window.location.href}`);
        const initialCheck = checkCurrentPage();
        if (initialCheck) {
            blockPage(initialCheck);
        } else {
            setupListeners();
        }
    }

    // 立即执行初始化
    init();
})();
