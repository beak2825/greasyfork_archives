// ==UserScript==
// @name         Via Adblock 规则分析
// @namespace    https://viayoo.com/
// @version      1.19
// @description  解析Adblock规则，是否值得在Via浏览器上订阅，评分仅供娱乐，自行斟酌。
// @author       Grok & Via
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530516/Via%20Adblock%20%E8%A7%84%E5%88%99%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/530516/Via%20Adblock%20%E8%A7%84%E5%88%99%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Adblock Rule Analyzer 脚本已加载，URL:', location.href);

    // 使用 GM_getValue 存储自动识别开关，默认关闭
    let autoDetectRawText = GM_getValue('autoDetectRawText', false);

    // 注册菜单项
    GM_registerMenuCommand("分析当前页面规则", analyzeCurrentPage);
    GM_registerMenuCommand("分析自定义链接规则", analyzeCustomLink);
    GM_registerMenuCommand(`自动识别纯文本链接解析 (${autoDetectRawText ? '开启' : '关闭'})`, toggleAutoDetect);

    // 简洁的 toast 调用函数
    const toast = msg => window.via?.toast?.(msg);

    // 检查是否是纯文本页面并直接处理
    function handleRawTextPage() {
        if (!autoDetectRawText) return false;
        const url = location.href;
        if (url.match(/\.(txt|list|rules|prop)$/i) || url.includes('raw.githubusercontent.com')) {
            console.log('检测到纯文本页面:', url);
            toast('正在分析Adblock规则中……')
            fetchContent(url);
            return true;
        }
        return false;
    }

    // 切换自动识别开关
    function toggleAutoDetect() {
        autoDetectRawText = !autoDetectRawText;
        GM_setValue('autoDetectRawText', autoDetectRawText);
        toast(`自动识别纯文本链接解析已${autoDetectRawText ? '开启' : '关闭'}，刷新页面后生效`);
        // 更新菜单显示
        GM_registerMenuCommand(`自动识别纯文本链接解析 (${autoDetectRawText ? '开启' : '关闭'})`, toggleAutoDetect);
    }

    // 在脚本启动时检查是否需要自动处理
    if (handleRawTextPage()) {
        return;
    }

    // 通用 fetch 函数
    async function fetchContent(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'omit',
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`网络请求失败，状态码: ${response.status} (${response.statusText})`);
            }
            const contentType = response.headers.get('Content-Type') || '';
            if (!contentType.includes('text/')) {
                throw new Error('非文本内容，无法解析 (Content-Type: ' + contentType + ')');
            }
            const content = await response.text();
            console.log('内容获取成功，长度:', content.length);
            analyzeContent(content, url);
        } catch (e) {
            console.error('内容获取失败:', e);
            let errorMsg = '无法获取内容：';
            if (e.message.includes('Failed to fetch')) {
                errorMsg += '网络请求失败，可能是链接不可访问或被浏览器阻止（检查 CORS 或网络连接）。';
            } else {
                errorMsg += e.message;
            }
            errorMsg += '\n请确保链接有效且指向 Adblock 规则文件。';
            alert(errorMsg);
        }
    }

    async function analyzeCurrentPage() {
        toast('分析当前页面');
        fetchContent(location.href);
    }

    function analyzeCustomLink() {
        console.log('分析自定义链接');
        const url = prompt('请输入Adblock规则文件的直链（如 https://raw.githubusercontent.com/...）');
        if (!url || !url.trim()) {
            alert('未输入有效的链接');
            return;
        }
        if (!url.match(/^https?:\/\/.+/)) {
            alert('链接格式无效，请输入以 http:// 或 https:// 开头的完整 URL');
            return;
        }
        toast(`解析链接中……`);
        fetchContent(url);
    }

    function normalizeNewlines(text) {
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    function parseHeader(content) {
        const header = {
            title: '未知标题',
            description: '未添加任何描述',
            version: '未知版本',
            lastModified: '未知时间',
            expires: '未给出更新周期',
        };
        const headerLines = content.split('\n')
            .filter(line => line.trim().startsWith('!'))
            .map(line => line.trim().substring(1).trim());

        headerLines.forEach(line => {
            if (line.startsWith('Title:')) header.title = line.substring(6).trim();
            else if (line.startsWith('Description:')) header.description = line.substring(12).trim();
            else if (line.startsWith('Version:')) header.version = line.substring(8).trim();
            else if (line.startsWith('TimeUpdated:') || line.startsWith('Last modified:') || line.startsWith('Update Time:')) {
                header.lastModified = line.split(':').slice(1).join(':').trim();
            } else if (line.startsWith('Expires:')) header.expires = line.substring(8).trim();
        });
        return header;
    }

    function analyzeContent(content, source) {
        if (!content.startsWith('[Adblock') && !content.startsWith('![Adblock')) {
            toast(`这不是一个标准的Adblock规则文件（未找到[Adblock开头），来源: ${source}`);
            console.log('非Adblock文件，来源:', source);
            return;
        }
        content = normalizeNewlines(content);
        const header = parseHeader(content);
        const lines = content.split('\n')
            .filter(line => line.trim() && !line.trim().startsWith('!') && !line.trim().startsWith('['));

        const stats = {
            cssRules: {
                normal: 0,
                exception: 0,
                hasNotPseudo: 0,
                hasSpecialPseudo: 0,
                hasSpecialPseudoNotAfter: 0
            },
            domainRules: {
                count: 0,
                duplicateRules: 0
            },
            unsupported: 0,
            extendedRules: {
                scriptInject: 0,
                adguardScript: 0,
                htmlFilter: 0,
                cssInject: 0,
                other: 0
            }
        };

        const extendedPatterns = {
            scriptInject: /(##|@#+)\+js\(/,
            adguardScript: /#@?%#/,
            htmlFilter: /\$\$/,
            cssInject: /#@?\$#/,
            specialPseudo: /:matches-property\b|:style\b|:-abp-properties\b|:-abp-contains\b|:min-text-length\b|:matches-path\b|:contains\b|:has-text\b|:matches-css\b|:matches-css-before\b|:matches-css-after\b|:if\b|:if-not\b|:xpath\b|:nth-ancestor\b|:upward\b|:remove\b/,
            other: /\$(\s*)(redirect|rewrite|csp|removeparam|badfilter|empty|generichide|match-case|object|object-subrequest|important|popup|document)|,(\s*)(redirect=|app=|replace=|csp=|denyallow=|permissions=)|:matches-property\b|:style\b|:-abp-properties\b|:-abp-contains\b|:min-text-length\b|:matches-path\b|:contains\b|:has-text\b|:matches-css\b|:matches-css-before\b|:matches-css-after\b|:if\b|:if-not\b|:xpath\b|:nth-ancestor\b|:upward\b|:remove\b|redirect-rule/
        };

        const rulePatternMap = new Map();

        lines.forEach(line => {
            const trimmed = line.trim();

            if (extendedPatterns.scriptInject.test(trimmed)) {
                stats.extendedRules.scriptInject++;
                stats.unsupported++;
            } else if (extendedPatterns.adguardScript.test(trimmed)) {
                stats.extendedRules.adguardScript++;
                stats.unsupported++;
            } else if (extendedPatterns.htmlFilter.test(trimmed)) {
                stats.extendedRules.htmlFilter++;
                stats.unsupported++;
            } else if (extendedPatterns.cssInject.test(trimmed)) {
                stats.extendedRules.cssInject++;
                stats.unsupported++;
            } else if (extendedPatterns.other.test(trimmed)) {
                stats.extendedRules.other++;
                stats.unsupported++;
            } else if (trimmed.startsWith('##') || trimmed.startsWith('###')) {
                stats.cssRules.normal++;
                if (/:has|:not/.test(trimmed)) stats.cssRules.hasNotPseudo++;
                if (extendedPatterns.specialPseudo.test(trimmed)) stats.cssRules.hasSpecialPseudo++;
            } else if (trimmed.startsWith('#@#') || trimmed.startsWith('#@##')) {
                stats.cssRules.exception++;
                if (/:has|:not/.test(trimmed)) stats.cssRules.hasNotPseudo++;
                if (extendedPatterns.specialPseudo.test(trimmed)) stats.cssRules.hasSpecialPseudo++;
            } else if (trimmed.startsWith('||')) {
                stats.domainRules.count++;
                let rulePattern = trimmed;
                let domains = [];
                const domainMatch = trimmed.match(/[,|$]domain=([^$|,]+)/);
                if (domainMatch) {
                    rulePattern = trimmed.replace(/[,|$]domain=[^$|,]+/, '').replace(/[,|$].*$/, '');
                    domains = domainMatch[1].split('|');
                }
                if (rulePatternMap.has(rulePattern)) {
                    const ruleData = rulePatternMap.get(rulePattern);
                    ruleData.count++;
                    stats.domainRules.duplicateRules++;
                    domains.forEach(domain => ruleData.domains.add(domain));
                } else {
                    rulePatternMap.set(rulePattern, {
                        domains: new Set(domains),
                        count: 1
                    });
                }
            }

            // 检测不在合法位置的特殊伪类
            if (extendedPatterns.specialPseudo.test(trimmed)) {
                if (!trimmed.match(/^(##|###|#@#|#@##|#?#|\$\$)/)) {
                    stats.cssRules.hasSpecialPseudoNotAfter++;
                }
            }
        });

        const totalCssRules = stats.cssRules.normal + stats.cssRules.exception;
        const totalExtendedRules = stats.extendedRules.scriptInject + stats.extendedRules.adguardScript +
            stats.extendedRules.htmlFilter + stats.extendedRules.cssInject + stats.extendedRules.other;

        let score = 0;
        let cssCountScore = Math.max(0, totalCssRules <= 5000 ? 35 : totalCssRules <= 7000 ? 35 - ((totalCssRules - 5000) / 2000) * 10 : totalCssRules <= 9999 ? 25 - ((totalCssRules - 7000) / 2999) * 15 : 10 - ((totalCssRules - 9999) / 5000) * 10);
        score += cssCountScore;

        let cssPseudoScore = stats.cssRules.hasNotPseudo <= 30 ? 15 : stats.cssRules.hasNotPseudo <= 100 ? 10 : stats.cssRules.hasNotPseudo <= 120 ? 5 : 0;
        score += cssPseudoScore;

        let domainCountScore = Math.max(0, stats.domainRules.count <= 100000 ? 30 : stats.domainRules.count <= 200000 ? 30 - ((stats.domainRules.count - 100000) / 100000) * 10 : stats.domainRules.count <= 500000 ? 20 - ((stats.domainRules.count - 200000) / 300000) * 15 : 5 - ((stats.domainRules.count - 500000) / 500000) * 5);
        score += domainCountScore;

        let domainDuplicateScore = Math.max(0, stats.domainRules.duplicateRules <= 100 ? 10 : stats.domainRules.duplicateRules <= 300 ? 10 - ((stats.domainRules.duplicateRules - 50) / 150) * 5 : 5 - ((stats.domainRules.duplicateRules - 200) / 200) * 5);
        score += domainDuplicateScore;

        let extendedScore = totalExtendedRules === 0 ? 10 : totalExtendedRules <= 100 ? 10 - (totalExtendedRules / 100) * 5 : totalExtendedRules <= 300 ? 5 - ((totalExtendedRules - 100) / 200) * 5 : Math.max(-10, 0 - ((totalExtendedRules - 300) / 300) * 10);
        score += extendedScore;

        let specialPseudoPenalty = stats.cssRules.hasSpecialPseudo > 0 ? -40 : 0;
        score += specialPseudoPenalty;

        let specialPseudoNotAfterPenalty = stats.cssRules.hasSpecialPseudoNotAfter > 0 ? -10 : 0;
        score += specialPseudoNotAfterPenalty;

        score = Math.max(1, Math.min(100, Math.round(score)));

        const cssPerformance = totalCssRules <= 5000 ? '✅CSS规则数量正常，可以流畅运行' : totalCssRules <= 7000 ? '❓CSS规则数量较多，可能会导致设备运行缓慢' : totalCssRules < 9999 ? '⚠️CSS规则数量接近上限，可能明显影响设备性能' : '🆘CSS规则数量过多，不建议订阅此规则';
        const domainPerformance = stats.domainRules.count <= 100000 ? '✅域名规则数量正常，可以流畅运行' : stats.domainRules.count <= 200000 ? '❓域名规则数量较多，但仍在可接受范围内' : stats.domainRules.count <= 500000 ? '🆘域名规则数量过多，可能会导致内存溢出 (OOM)' : '‼️域名规则数量极多，强烈不建议使用，可能严重影响性能';

        const report = `
Adblock规则分析结果（来源: ${source}）：
📜Adblock规则信息：
  标题: ${header.title}
  描述: ${header.description}
  版本: ${header.version}
  最后更新: ${header.lastModified}
  更新周期: ${header.expires}
---------------------
💯规则评级: ${score}/100
(评分仅供参考，具体以Via变动为主)
📊各部分得分：
  CSS数量得分: ${Math.round(cssCountScore)}/35
  CSS伪类得分: ${cssPseudoScore}/15
  域名数量得分: ${Math.round(domainCountScore)}/30
  重复规则得分: ${Math.round(domainDuplicateScore)}/10
  扩展规则加减分: ${Math.round(extendedScore)} (±10)
  特殊伪类惩罚: ${specialPseudoPenalty} (Adguard/uBlock特殊伪类)
  特殊伪类不按语法: ${specialPseudoNotAfterPenalty} (未使用正确语法)
---------------------
🛠️总规则数: ${lines.length}
👋不支持的规则: ${stats.unsupported}
📋CSS通用隐藏规则：
  常规规则 (##, ###): ${stats.cssRules.normal}
  例外规则 (#@#, #@##): ${stats.cssRules.exception}
  含:has/:not伪类规则: ${stats.cssRules.hasNotPseudo}
  含Adguard/uBlock特殊伪类: ${stats.cssRules.hasSpecialPseudo}
  特殊伪类未使用正确语法: ${stats.cssRules.hasSpecialPseudoNotAfter}
  总CSS规则数: ${totalCssRules}
  性能评估: ${cssPerformance}
🔗域名规则 (||):
  总数: ${stats.domainRules.count}
  重复规则数: ${stats.domainRules.duplicateRules}
  性能评估: ${domainPerformance}
✋🏼uBlock/AdGuard 独有规则：
  脚本注入 (##+js): ${stats.extendedRules.scriptInject}
  AdGuard脚本 (#%#): ${stats.extendedRules.adguardScript}
  HTML过滤 ($$): ${stats.extendedRules.htmlFilter}
  CSS注入 (#$#): ${stats.extendedRules.cssInject}
  其他扩展规则 ($redirect等): ${stats.extendedRules.other}
  总计: ${totalExtendedRules}
注：uBlock/AdGuard 独有规则及特殊伪类在传统 Adblock Plus 中不受支持
    `;
        alert(report);
        console.log(report);
    }
})();