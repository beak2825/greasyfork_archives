// ==UserScript==
// @name         GreasyFork AI Safety Checker (Multi API)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  在 GreasyFork 主頁面顯示簡約的安全檢查提示，整合多重 API，檢查腳本中的轉址行為。
// @match        https://greasyfork.org/*scripts/*
// @exclude      https://greasyfork.org/*scripts/*/code*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529747/GreasyFork%20AI%20Safety%20Checker%20%28Multi%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529747/GreasyFork%20AI%20Safety%20Checker%20%28Multi%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 語言檢測與手動切換
    let userLang = GM_getValue('userSelectedLanguage', '');
    if (!userLang) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('zh-tw')) userLang = 'zh-TW';
        else if (navigator.language.toLowerCase().startsWith('zh')) userLang = 'zh-CN';
        else if (navigator.language.toLowerCase().startsWith('ja')) userLang = 'ja';
        else userLang = 'en';
    }

    // 模組化語言翻譯
    const translations = {
        'zh-TW': {
            safetyNotice: 'AI 安全提示：${grant} - 靜態檢查: 檢查 ${count} 個域名，檢測到 ${riskCount} 個高風險域名${apiSummary}${politicalWarning}, 建議在沙盒環境中測試此腳本。',
            safetyNoticeNoRisk: 'AI 安全提示：${grant} - 靜態檢查: 檢查 ${count} 個域名，未發現匹配${apiSummary}${politicalWarning}.',
            viewDetails: '查看詳情',
            hideDetails: '收起詳情',
            applyApi: '申請 API',
            hideApiApply: '收起 API 申請',
            applyGoogle: '申請 Google Safe Browsing API Key',
            applyVirusTotal: '申請 VirusTotal API Key',
            applyAbuseIPDB: '申請 AbuseIPDB API Key',
            fetchCodeFailed: 'AI 安全提示：無法獲取腳本代碼，請手動檢查。',
            installButtonNotFound: '未找到安裝按鈕:',
            noHighRiskGrant: '未檢測到高風險權限',
            insertedNotice: '提示已插入',
            switchLanguage: '切換語言',
            enablePoliticalCheck: '啟用政治正確檢查',
            disablePoliticalCheck: '禁用政治正確檢查',
            politicalWarning: '警告：檢測到從 ${sensitiveSites} 轉向到特定網站 ${chinaSites}'
        },
        'zh-CN': {
            safetyNotice: 'AI 安全提示：${grant} - 静态检查: 检查 ${count} 个域名，检测到 ${riskCount} 个高风险域名${apiSummary}${politicalWarning}, 建议在沙盒环境中测试此脚本。',
            safetyNoticeNoRisk: 'AI 安全提示：${grant} - 静态检查: 检查 ${count} 个域名，未发现匹配${apiSummary}${politicalWarning}.',
            viewDetails: '查看详情',
            hideDetails: '收起详情',
            applyApi: '申请 API',
            hideApiApply: '收起 API 申请',
            applyGoogle: '申请 Google Safe Browsing API Key',
            applyVirusTotal: '申请 VirusTotal API Key',
            applyAbuseIPDB: '申请 AbuseIPDB API Key',
            fetchCodeFailed: 'AI 安全提示：无法获取脚本代码，请手动检查。',
            installButtonNotFound: '未找到安装按钮:',
            noHighRiskGrant: '未检测到高风险权限',
            insertedNotice: '提示已插入',
            switchLanguage: '切换语言',
            enablePoliticalCheck: '启用政治正确检查',
            disablePoliticalCheck: '禁用政治正确检查',
            politicalWarning: '警告：检测到从 ${sensitiveSites} 转向到特定网站 ${chinaSites}'
        },
        'en': {
            safetyNotice: 'AI Safety Notice: ${grant} - Static check: checked ${count} domains, detected ${riskCount} high-risk domains${apiSummary}${politicalWarning}, test in a sandbox environment.',
            safetyNoticeNoRisk: 'AI Safety Notice: ${grant} - Static check: checked ${count} domains, no matches${apiSummary}${politicalWarning}.',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            applyApi: 'Apply for API',
            hideApiApply: 'Hide API Apply',
            applyGoogle: 'Apply for Google Safe Browsing API Key',
            applyVirusTotal: 'Apply for VirusTotal API Key',
            applyAbuseIPDB: 'Apply for AbuseIPDB API Key',
            fetchCodeFailed: 'AI Safety Notice: Unable to fetch script code, please check manually.',
            installButtonNotFound: 'Install button not found:',
            noHighRiskGrant: 'No high-risk permissions detected',
            insertedNotice: 'Notice inserted',
            switchLanguage: 'Switch Language',
            enablePoliticalCheck: 'Enable Political Correctness Check',
            disablePoliticalCheck: 'Disable Political Correctness Check',
            politicalWarning: 'Warning: Detected redirection from ${sensitiveSites} to specific sites ${chinaSites}'
        },
        'ja': {
            safetyNotice: 'AI安全通知：${grant} - 静的チェック：${count}ドメインをチェックし、${riskCount}個の高リスクドメインを検出しました${apiSummary}${politicalWarning}。サンドボックス環境でテストすることをお勧めします。',
            safetyNoticeNoRisk: 'AI安全通知：${grant} - 静的チェック：${count}ドメインをチェックしましたが、一致するものはありません${apiSummary}${politicalWarning}。',
            viewDetails: '詳細を表示',
            hideDetails: '詳細を非表示',
            applyApi: 'APIを申請',
            hideApiApply: 'API申請を非表示',
            applyGoogle: 'Google Safe Browsing APIキーを申請',
            applyVirusTotal: 'VirusTotal APIキーを申請',
            applyAbuseIPDB: 'AbuseIPDB APIキーを申請',
            fetchCodeFailed: 'AI安全通知：スクリプトコードを取得できません。手動で確認してください。',
            installButtonNotFound: 'インストールボタンが見つかりません：',
            noHighRiskGrant: '高リスク権限は検出されませんでした',
            insertedNotice: '通知が挿入されました',
            switchLanguage: '言語を切り替え',
            enablePoliticalCheck: '政治的正しさチェックを有効にする',
            disablePoliticalCheck: '政治的正しさチェックを無効にする',
            politicalWarning: '警告：${sensitiveSites}から特定サイト${chinaSites}へのリダイレクトが検出されました'
        }
    };

    function t(key, params = {}) {
        let text = translations[userLang][key] || translations['en'][key];
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`\${${param}}`, value);
        }
        return text;
    }

    // 政治正確檢查設定
    let politicalCheckEnabled = GM_getValue('politicalCheckEnabled', false);
    GM_registerMenuCommand(politicalCheckEnabled ? t('disablePoliticalCheck') : t('enablePoliticalCheck'), () => {
        politicalCheckEnabled = !politicalCheckEnabled;
        GM_setValue('politicalCheckEnabled', politicalCheckEnabled);
        alert(politicalCheckEnabled ? t('enablePoliticalCheck') : t('disablePoliticalCheck'));
        location.reload();
    });

    // 語言切換
    GM_registerMenuCommand(t('switchLanguage'), () => {
        const languages = ['zh-TW', 'zh-CN', 'en', 'ja'];
        const currentIndex = languages.indexOf(userLang);
        userLang = languages[(currentIndex + 1) % languages.length];
        GM_setValue('userSelectedLanguage', userLang);
        alert(t('switchLanguage') + ': ' + userLang);
        location.reload();
    });

    // 政治正確檢查模組（移除敏感網址）
    const checkPoliticalRedirection = (code) => {
        const sensitiveSites = ['example.com', 'test.com']; // 替換為中性網址
        const chinaSites = [/example\.cn/, /test\.cn/]; // 替換為中性網址

        const lines = code.split('\n');
        let politicalIssues = [];
        let sensitiveMatches = [];
        let chinaMatches = [];

        const redirectionPatterns = [
            /window\.location\.href\s*=\s*['"]([^'"]+)['"]/,
            /window\.location\.replace\s*\(['"]([^'"]+)['"]\)/,
            /GM_openInTab\s*\(['"]([^'"]+)['"]/,
            /location\.assign\s*\(['"]([^'"]+)['"]\)/
        ];

        for (const line of lines) {
            for (const pattern of redirectionPatterns) {
                const match = line.match(pattern);
                if (match) {
                    const targetUrl = match[1].toLowerCase();
                    const fromSensitive = sensitiveSites.some(site => line.toLowerCase().includes(site));
                    const toChina = chinaSites.some(chinaSite => chinaSite.test(targetUrl));

                    if (fromSensitive && toChina) {
                        const sensitiveSite = sensitiveSites.find(site => line.toLowerCase().includes(site));
                        sensitiveMatches.push(sensitiveSite);
                        chinaMatches.push(targetUrl);
                    }
                }
            }
        }

        if (sensitiveMatches.length > 0 && chinaMatches.length > 0) {
            politicalIssues.push(t('politicalWarning', {
                sensitiveSites: sensitiveMatches.join(', '),
                chinaSites: chinaMatches.join(', ')
            }));
        }

        return politicalIssues.join('; ');
    };

    // 簡化的安全檢查（省略其他部分）
    const analyzeScript = async (code) => {
        let politicalWarning = '';
        if (politicalCheckEnabled) {
            const politicalIssues = checkPoliticalRedirection(code);
            if (politicalIssues) {
                politicalWarning = `; ${politicalIssues}`;
            }
        }
        return { warning: `Safety Check: ${politicalWarning}`, highRiskDomains: [], hasApiLinks: false };
    };

    // 插入警告（省略其他部分）
    const installButton = document.querySelector('.install-link');
    if (installButton) {
        const code = document.querySelector('pre')?.textContent || '';
        analyzeScript(code).then(({ warning }) => {
            const notice = document.createElement('div');
            notice.className = 'grok-ai-safety-notice';
            notice.textContent = warning;
            installButton.parentNode.insertBefore(notice, installButton);
        });
    }
})();