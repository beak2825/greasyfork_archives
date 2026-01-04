// ==UserScript==
// @name         GreasyFork AI Safety Checker
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @description  在 GreasyFork 主頁面顯示 AI 安全檢查提示，分析腳本的域名和權限，幫助用戶識別潛在風險，支援多國語系。免責聲明：本腳本由 xAI 的 Grok 開發，旨在提供靜態檢查參考，不保證完全準確，可能存在誤報或漏報。使用者應自行驗證並承擔風險，有問題請留言。本聲明最終解釋權歸公布者所有。
// @match        https://greasyfork.org/*scripts/*
// @exclude      https://greasyfork.org/*scripts/*/code*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529757/GreasyFork%20AI%20Safety%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/529757/GreasyFork%20AI%20Safety%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userLang = GM_getValue('userSelectedLanguage', '');
    if (!userLang) {
        userLang = navigator.language === 'zh-TW' ? 'zh-TW' : 
                   navigator.language.startsWith('zh') ? 'zh-CN' : 
                   navigator.language.startsWith('ja') ? 'ja' : 'en';
    }

    const translations = {
        'zh-TW': {
            safetyNotice: 'AI 安全提示：${grant} - 靜態檢查: 檢查 ${count} 個域名，檢測到 ${riskCount} 個高風險域名${apiSummary}${politicalWarning}, 建議在沙盒環境中測試此腳本。',
            safetyNoticeNoRisk: 'AI 安全提示：${grant} - 靜態檢查: 檢查 ${count} 個域名，未發現匹配${apiSummary}${politicalWarning}.',
            staticRiskNotice: 'AI 安全提示：靜態檢查發現風險域名 - 檢查 ${count} 個域名，檢測到 ${riskCount} 個高風險域名${apiSummary}${politicalWarning}, 建議在沙盒環境中測試此腳本。',
            noHighRiskGrant: '未檢測到高風險權限',
            fetchCodeFailed: 'AI 安全提示：無法獲取腳本代碼，請手動檢查。',
            viewDetails: '查看詳情',
            hideDetails: '收起詳情',
            gamblingRelated: '可能與博彩相關',
            ptcSite: 'PTC（點擊賺錢）網站',
            urlShortening: '縮短連結服務',
            fileSharing: '文件分享網站',
            highRiskTld: '高風險 TLD',
            GM_xmlhttpRequest: 'GM 跨站請求',
            GM_setValue: 'GM 設置值',
            unsafeWindow: '不安全窗口',
            GM_openInTab: 'GM 新標籤開啟'
        },
        'zh-CN': {
            safetyNotice: 'AI 安全提示：${grant} - 静态检查: 检查 ${count} 个域名，检测到 ${riskCount} 个高风险域名${apiSummary}${politicalWarning}, 建议在沙盒环境中测试此脚本。',
            safetyNoticeNoRisk: 'AI 安全提示：${grant} - 静态检查: 检查 ${count} 个域名，未发现匹配${apiSummary}${politicalWarning}.',
            staticRiskNotice: 'AI 安全提示：静态检查发现风险域名 - 检查 ${count} 个域名，检测到 ${riskCount} 个高风险域名${apiSummary}${politicalWarning}, 建议在沙盒环境中测试此脚本。',
            noHighRiskGrant: '未检测到高风险权限',
            fetchCodeFailed: 'AI 安全提示：无法获取脚本代码，请手动检查。',
            viewDetails: '查看详情',
            hideDetails: '收起详情',
            gamblingRelated: '可能与博彩相关',
            ptcSite: 'PTC（点击赚钱）网站',
            urlShortening: '缩短链接服务',
            fileSharing: '文件分享网站',
            highRiskTld: '高风险 TLD',
            GM_xmlhttpRequest: 'GM 跨站请求',
            GM_setValue: 'GM 设置值',
            unsafeWindow: '不安全窗口',
            GM_openInTab: 'GM 新标签开启'
        },
        'en': {
            safetyNotice: 'AI Safety Notice: ${grant} - Static check: checked ${count} domains, detected ${riskCount} high-risk domains${apiSummary}${politicalWarning}, test in a sandbox environment.',
            safetyNoticeNoRisk: 'AI Safety Notice: ${grant} - Static check: checked ${count} domains, no matches${apiSummary}${politicalWarning}.',
            staticRiskNotice: 'AI Safety Notice: Static check detected risks - checked ${count} domains, detected ${riskCount} high-risk domains${apiSummary}${politicalWarning}, test in a sandbox environment.',
            noHighRiskGrant: 'No high-risk permissions detected',
            fetchCodeFailed: 'AI Safety Notice: Unable to fetch script code, please check manually.',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            gamblingRelated: 'Possibly gambling-related',
            ptcSite: 'PTC (Pay-to-Click) site',
            urlShortening: 'URL shortening service',
            fileSharing: 'File sharing site',
            highRiskTld: 'High-risk TLD',
            GM_xmlhttpRequest: 'GM_xmlhttpRequest',
            GM_setValue: 'GM_setValue',
            unsafeWindow: 'unsafeWindow',
            GM_openInTab: 'GM_openInTab'
        },
        'ja': {
            safetyNotice: 'AI安全通知：${grant} - 静的チェック：${count}ドメインをチェックし、${riskCount}個の高リスクドメインを検出しました${apiSummary}${politicalWarning}。サンドボックス環境でテストすることをお勧めします。',
            safetyNoticeNoRisk: 'AI安全通知：${grant} - 静的チェック：${count}ドメインをチェックしましたが、一致するものはありません${apiSummary}${politicalWarning}。',
            staticRiskNotice: 'AI安全通知：静的チェックでリスクを検出 - ${count}ドメインをチェックし、${riskCount}個の高リスクドメインを検出しました${apiSummary}${politicalWarning}。サンドボックス環境でテストすることをお勧めします。',
            noHighRiskGrant: '高リスク権限は検出されませんでした',
            fetchCodeFailed: 'AI安全通知：スクリプトコードを取得できません。手動で確認してください。',
            viewDetails: '詳細を表示',
            hideDetails: '詳細を非表示',
            gamblingRelated: 'ギャンブル関連の可能性',
            ptcSite: 'PTC（クリックで稼ぐ）サイト',
            urlShortening: 'URL短縮サービス',
            fileSharing: 'ファイル共有サイト',
            highRiskTld: '高リスクTLD',
            GM_xmlhttpRequest: 'GM_xmlhttpRequest',
            GM_setValue: 'GM_setValue',
            unsafeWindow: 'unsafeWindow',
            GM_openInTab: 'GM_openInTab'
        }
    };

    function t(key, params = {}) {
        let text = translations[userLang][key] || translations['en'][key];
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`\${${param}}`, value);
        }
        return text;
    }

    GM_registerMenuCommand('切換語言 / Switch Language', () => {
        const languages = ['zh-TW', 'zh-CN', 'en', 'ja'];
        const currentIndex = languages.indexOf(userLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        userLang = languages[nextIndex];
        GM_setValue('userSelectedLanguage', userLang);
        alert('語言已切換 / Language switched to: ' + userLang);
        location.reload();
    });

    if (/\/code/.test(window.location.href)) return;

    const fetchScriptCode = () => {
        const scriptId = window.location.pathname.match(/scripts\/(\d+)/)?.[1];
        if (!scriptId) throw new Error('無法提取腳本 ID');
        const codeUrl = `${window.location.origin}${window.location.pathname}/code`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: codeUrl, onload: (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const code = doc.querySelector('pre')?.textContent;
                    if (code) resolve(code);
                    else reject('未找到代碼');
                }, onerror: () => reject('獲取代碼失敗')
            });
        });
    };

    const analyzeScript = async (code) => {
        const lines = code.split('\n');
        const matches = lines
            .filter(line => line.trim().startsWith('// @match'))
            .map(line => line.replace('// @match', '').trim().replace(/^\*?:\/\//, '').replace(/\/.*/, ''))
            .filter(url => url && !url.includes('greasyfork.org'));

        const highRiskDomains = [];
        const riskReasons = {};
        const knownSafe = ['google.com', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'wikipedia.org'];
        const riskyPatterns = [
            /vn88\..*/, /fb88\..*/, /m88\..*/, /bet88li\.com/, /yeumoney\.com/, /165\.22\.63\.250/, /188\.166\.185\.213/,
            /aylink\.co/, /gplinks\.co/, /v2links\.me/, /coinclix\.co/, /cutyion\.com/, /upfion\.com/,
            /modsfire\.com/, /dropbox\.com/, /drive\.google\.com/, /mega\.nz/,
            /ourcoincash\.xyz/, /bitcotasks\.com/, /freepayz\.com/, /gwaher\.com/, /geekgrove\.net/, /cricketlegacy\.com/,
            /.*\.techyuth\.xyz/, /.*\.idblogmarket\.com/, /.*\.phonesparrow\.com/, /.*\.wikijankari\.com/,
            /financewada\.com/, /financenova\.online/, /utkarshonlinetest\.com/, /rajasthantopnews\.com/,
            /.*\.devnote\.in/, /naamlist\.com/, /modijiurl\.com/, /gmsrweb\.org/
        ];

        let staticCheckedCount = 0;
        matches.forEach(domain => {
            staticCheckedCount++;
            if (knownSafe.some(safe => domain.includes(safe))) return;
            let reason = '未知風險';
            if (riskyPatterns.some(pattern => pattern.test(domain))) {
                if (/vn88\..*|fb88\..*|m88\..*|bet88li\.com|yeumoney\.com/.test(domain)) reason = t('gamblingRelated');
                else if (/aylink\.co|gplinks\.co|v2links\.me|coinclix\.co|cutyion\.com|upfion\.com/.test(domain)) reason = t('urlShortening');
                else if (/modsfire\.com|dropbox\.com|drive\.google\.com|mega\.nz/.test(domain)) reason = t('fileSharing');
                else if (/ourcoincash\.xyz|bitcotasks\.com|freepayz\.com|gwaher\.com|geekgrove\.net|cricketlegacy\.com/.test(domain)) reason = t('ptcSite');
                else if (/xyz|in|online|wtf/.test(domain)) reason = t('highRiskTld');
                highRiskDomains.push(domain);
                riskReasons[domain] = reason;
            }
        });

        const highRiskGrants = ['GM_xmlhttpRequest', 'unsafeWindow', 'GM_setValue', 'GM_openInTab'];
        let firstRiskyGrant = '';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            for (const grant of highRiskGrants) {
                if (line.match(new RegExp(`@grant\\s+${grant}`))) {
                    firstRiskyGrant = `${t(grant)} (行 ${i + 1})`;
                    break;
                }
            }
            if (firstRiskyGrant) break;
        }
        if (!firstRiskyGrant) firstRiskyGrant = t('noHighRiskGrant');

        let warning;
        const details = highRiskDomains.length > 0 
            ? `<div class="grok-ai-safety-details" style="display: none;">${highRiskDomains.map(d => `${d}: ${riskReasons[d]}`).join('<br>')}</div>` 
            : '';

        if (highRiskDomains.length > 0) {
            warning = firstRiskyGrant === t('noHighRiskGrant') 
                ? `${t('staticRiskNotice', { count: staticCheckedCount, riskCount: highRiskDomains.length, apiSummary: '', politicalWarning: '' })}<a id="toggle-details" href="#">${t('viewDetails')}</a>${details}`
                : `${t('safetyNotice', { grant: firstRiskyGrant, count: staticCheckedCount, riskCount: highRiskDomains.length, apiSummary: '', politicalWarning: '' })}<a id="toggle-details" href="#">${t('viewDetails')}</a>${details}`;
        } else {
            warning = t('safetyNoticeNoRisk', { grant: firstRiskyGrant, count: staticCheckedCount, apiSummary: '', politicalWarning: '' });
        }

        return { warning, highRiskDomains, riskReasons };
    };

    const waitForElement = (selector) => new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    GM_addStyle(`
        .grok-ai-safety-notice { background: #fff3f3; border: 2px solid #ff4d4d; padding: 10px; margin-bottom: 15px; border-radius: 5px; color: #333; }
        .grok-ai-safety-details { margin-top: 10px; padding: 5px; background: #ffe6e6; border: 1px solid #ff9999; border-radius: 3px; }
    `);

    waitForElement('.install-link').then((installButton) => {
        fetchScriptCode().then(async (code) => {
            const { warning, highRiskDomains } = await analyzeScript(code);
            const notice = document.createElement('div');
            notice.className = 'grok-ai-safety-notice';
            notice.innerHTML = warning;

            if (highRiskDomains.length > 0) {
                const toggleLink = notice.querySelector('#toggle-details');
                const detailsDiv = notice.querySelector('.grok-ai-safety-details');
                toggleLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (detailsDiv.style.display === 'block') {
                        detailsDiv.style.display = 'none';
                        toggleLink.textContent = t('viewDetails');
                    } else {
                        detailsDiv.style.display = 'block';
                        toggleLink.textContent = t('hideDetails');
                    }
                });
            }

            installButton.parentNode.insertBefore(notice, installButton);
            console.log('提示已插入 / Notice inserted');
        }).catch(() => {
            const notice = document.createElement('div');
            notice.className = 'grok-ai-safety-notice';
            notice.textContent = t('fetchCodeFailed');
            installButton.parentNode.insertBefore(notice, installButton);
        });
    });
})();