// ==UserScript==
// @name         GPT Analytics Report
// @namespace    makiisthenes
// @author       Michael Peres
// @version      2024-10-28
// @description  Track all monthly ChatGPT conversation metrics
// @license      MIT
// @match              https://chat.openai.com/
// @match              https://chat.openai.com/?model=*
// @match              https://chat.openai.com/c/*
// @match              https://chat.openai.com/g/*
// @match              https://chat.openai.com/gpts
// @match              https://chat.openai.com/gpts/*
// @match              https://chat.openai.com/share/*
// @match              https://chat.openai.com/share/*/continue
// @match              https://chatgpt.com/
// @match              https://chatgpt.com/?model=*
// @match              https://chatgpt.com/c/*
// @match              https://chatgpt.com/g/*
// @match              https://chatgpt.com/gpts
// @match              https://chatgpt.com/gpts/*
// @match              https://chatgpt.com/share/*
// @match              https://chatgpt.com/share/*/continue
// @match              https://new.oaifree.com/
// @match              https://new.oaifree.com/?model=*
// @match              https://new.oaifree.com/c/*
// @match              https://new.oaifree.com/g/*
// @match              https://new.oaifree.com/gpts
// @match              https://new.oaifree.com/gpts/*
// @match              https://new.oaifree.com/share/*
// @match              https://new.oaifree.com/share/*/continue
// @require            https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require            https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515074/GPT%20Analytics%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/515074/GPT%20Analytics%20Report.meta.js
// ==/UserScript==
(function() {
    'use strict';


    const TEST_EMAIL = "test@test.com";
    const ACCOUNT_ID = "test";
    const LIMIT = 28;

    const LAST_RUN_KEY = `gpt_metrics_last_run_${ACCOUNT_ID}`;
    const METRICS_STORAGE_KEY = `gpt_metrics_data_${ACCOUNT_ID}`;

    // GM_setValue(LAST_RUN_KEY, null);

    const API_MAPPING = {
        "https://chat.openai.com": "https://chat.openai.com/backend-api",
        "https://chatgpt.com": "https://chatgpt.com/backend-api",
    };

    const baseUrl = new URL(location.href).origin;
    const apiUrl = API_MAPPING[baseUrl];

    // Storage management functions
    function shouldRunToday() {
        const today = new Date().toISOString().split('T')[0];
        const lastRun = GM_getValue(LAST_RUN_KEY, null);
        return lastRun !== today;
    }

    function markAsRun() {
        const today = new Date().toISOString().split('T')[0];
        GM_setValue(LAST_RUN_KEY, today);
    }

    function saveMetrics(metrics) {
        GM_setValue(METRICS_STORAGE_KEY, metrics);
    }

    function getStoredMetrics() {
        return GM_getValue(METRICS_STORAGE_KEY, []);
    }

    // Session and authentication
    const sessionApi = `${baseUrl}/api/auth/session`;

    async function fetchSession() {
        const response = await fetch(sessionApi);
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }

    function getPageAccessToken() {
        return window.__remixContext?.state?.loaderData?.root?.clientBootstrap?.session?.accessToken ?? null;
    }

    async function getAccessToken() {
        const pageAccessToken = getPageAccessToken();
        if (pageAccessToken) return pageAccessToken;
        const session = await fetchSession();
        return session.accessToken;
    }

    // API functions
    async function _fetchAccountsCheck() {
        const accessToken = await getAccessToken();
        const response = await fetch(`${apiUrl}/accounts/check/v4-2023-04-27`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }

    const getCookie = (key) => {
        return document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || '';
    };

    async function getTeamAccountId() {
        const accountsCheck = await _fetchAccountsCheck();
        const workspaceId = getCookie('_account');
        if (workspaceId) {
            const account = accountsCheck.accounts[workspaceId];
            if (account) return account.account.account_id;
        }
        return null;
    }

    async function fetchApi(url, options = {}) {
        const accessToken = await getAccessToken();
        const accountId = await getTeamAccountId();

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                ...(accountId ? { 'ChatGPT-Account-ID': accountId } : {}),
                ...options.headers
            }
        });

        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }

    async function fetchConversations(offset = 0, limit = LIMIT) {
        try {
            const url = `${apiUrl}/conversations?offset=${offset}&limit=${limit}&order=updated`;
            const data = await fetchApi(url);
            return data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return null;
        }
    }

    async function fetchAllConversations() {
        const conversations = [];
        let offset = 0;

        while (true) {
            const result = await fetchConversations(offset, LIMIT);
            if (!result || !result.items || !result.items.length) break;

            conversations.push(...result.items);
            if (offset + LIMIT >= result.total) break;
            offset += LIMIT;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return conversations;
    }

    // Analytics functions
    function groupConversationsByDay(conversations) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const groupedConversations = {};

        conversations.forEach(conv => {
            const createDate = new Date(conv.create_time);

            // Skip conversations from today
            if (createDate >= today) {
                return;
            }

            const year = createDate.getFullYear();
            const month = (createDate.getMonth() + 1).toString().padStart(2, '0');
            const day = createDate.getDate().toString().padStart(2, '0');
            const key = `${day}/${month}/${year}`;

            if (!groupedConversations[key]) {
                groupedConversations[key] = {
                    period: key,
                    chat_occurrence: 0,
                    account: TEST_EMAIL
                };
            }

            groupedConversations[key].chat_occurrence++;
        });

        return groupedConversations;
    }

    function sortPeriods(periods) {
        return periods.sort((a, b) => {
            const [aDay, aMonth, aYear] = a.period.split('/');
            const [bDay, bMonth, bYear] = b.period.split('/');
            const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay));
            const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay));
            return bDate - aDate;
        });
    }

    async function generateMetrics() {
        if (!shouldRunToday()) {
            console.log('Analytics report has already ran.');
            return null;
        }

        console.log('Generating analytics report...');
        const conversations = await fetchAllConversations();

        if (!conversations) {
            console.error('Failed to fetch conversations');
            return null;
        }

        const groupedByDay = groupConversationsByDay(conversations);
        const metrics = Object.values(groupedByDay);
        const sortedMetrics = sortPeriods(metrics);

        // Calculate statistics
        const totalDays = sortedMetrics.length;
        const totalConversations = sortedMetrics.reduce((sum, m) => sum + m.chat_occurrence, 0);
        const avgConversations = totalConversations / totalDays;
        const maxConversations = Math.max(...sortedMetrics.map(m => m.chat_occurrence));

        console.log('Analytics Report:');
        console.table(sortedMetrics.map(m => ({
            Date: m.period,
            Conversations: m.chat_occurrence
        })));

        console.log('\nSummary Statistics:');
        console.log(`Total Days: ${totalDays}`);
        console.log(`Total Conversations: ${totalConversations}`);
        console.log(`Average Conversations per Day: ${avgConversations.toFixed(1)}`);
        console.log(`Maximum Conversations in a Day: ${maxConversations}`);

        saveMetrics(sortedMetrics);
        markAsRun();

        return {
            metrics: sortedMetrics,
            statistics: {
                totalDays,
                totalConversations,
                avgConversations,
                maxConversations
            }
        };
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateMetrics);
    } else {
        generateMetrics().catch(console.error);
    }
})();