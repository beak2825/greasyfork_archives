// ==UserScript==
// @name         LeetCode 灵神题单状态标记
// @namespace    https://github.com/qk-antares
// @version      0.3
// @description  请求用户所有题目的状态，匹配HTML页面上相应的题目超链接进行展示，适用于灵神的讨论帖题单场景（也可用于其他题单）
// @author       qk-antares
// @match        https://leetcode.cn/discuss/post/*
// @grant        GM_xmlhttpRequest
// @connect      leetcode.cn
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQ2NjcxNzM5NTU1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY3MDIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEwMjEuMDUgOTE0LjU5TDY1NC4yMSAxMTkuNzdBOTYuMjcgOTYuMjcgMCAwIDAgNTY3LjA1IDY0SDQ4MGEzMiAzMiAwIDAgMC0yOSAxOC41OWwtMzg0IDgzMkEzMiAzMiAwIDAgMCA5NiA5NjBoMjE1LjA1YTk2LjI3IDk2LjI3IDAgMCAwIDg3LjE2LTU1Ljc3bDQxLTg4Ljg0IDI1NS40NSAxMjcuNzJBMTYwLjg0IDE2MC44NCAwIDAgMCA3NjYuMjIgOTYwSDk5MmEzMiAzMiAwIDAgMCAyOS00NS40MXogbS02ODAuOTQtMzcuMThBMzIuMTEgMzIuMTEgMCAwIDEgMzExLjA1IDg5NkgyNzRsNjEuMjEtMTMyLjYxTDM4MiA3ODYuNzV6IG0zODMuMTcgOC40NUw0MzguNDEgNzQzLjQzbC0wLjE2LTAuMDgtMTAzLjc3LTUxLjg5LTAuODEtMC4zOWEzMS44MyAzMS44MyAwIDAgMC0yNC0xLjM3aC0wLjA1YTMxLjg0IDMxLjg0IDAgMCAwLTE4LjUzIDE2LjU5Yy0wLjA2IDAuMTItMC4xMiAwLjI1LTAuMTcgMC4zN0wyMDMuNTMgODk2SDE0NmwzNTQuNDctNzY4SDU1OEwzMzkgNjAyLjU5Yy0wLjA1IDAuMDktMC4wOCAwLjE4LTAuMTIgMC4yN2EzMiAzMiAwIDAgMCAxNC44NiA0MS43NmwyOTEuMiAxNDUuNmEzMiAzMiAwIDAgMCA0NS45MS0zMy42M2MxLTAuNDYgMC4yMi0yLjQtMi41NS04LjRMNTc5LjI0IDUxMiA2MDggNDQ5LjcgODE0IDg5NmgtNDcuNzhhOTYuNDEgOTYuNDEgMCAwIDEtNDIuOTQtMTAuMTR6TTU0NCA1ODguMzZsNDcuOTIgMTAzLjgyLTc3Ljg3LTM4Ljkzek04ODQuNDcgODk2TDYzNy4wNSAzNTkuOTJhMzIgMzIgMCAwIDAtNTgtMC4ybC0wLjEgMC4yLTEyMi4xNyAyNjQuNjktNDYuNzMtMjMuMzZMNjA4IDE3Mi4zNiA5NDIgODk2eiIgZmlsbD0iI0ZGN0E1OCIgcC1pZD0iNjcwMyI+PC9wYXRoPjwvc3ZnPg==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535287/LeetCode%20%E7%81%B5%E7%A5%9E%E9%A2%98%E5%8D%95%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/535287/LeetCode%20%E7%81%B5%E7%A5%9E%E9%A2%98%E5%8D%95%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const THRESHOLD = 10; // 阈值
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (!csrfToken) {
        console.warn("⚠️ 未获取到 CSRF Token，用户可能未登录。");
    }
    console.log("🚀 [题单状态标记] 脚本启动");

    function getStatusIcon(status) {
        switch (status) {
            case 'ac': return '✅';
            case 'notac': return '❌';
            case null: return '🕓';
            default: return '❓';
        }
    }

    function extractLinks() {
        return Array.from(document.querySelectorAll("ul li > a[href*='/problems/']"))
            .filter(link => /\/problems\/[^/]+\/$/.test(link.href));
    }

    function insertStatusIcon(link, status) {
        const icon = getStatusIcon(status);
        const span = document.createElement('span');
        span.textContent = icon + ' ';
        link.parentNode.insertBefore(span, link);
    }

    function fetchAllProblemStatuses() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://leetcode.cn/api/problems/all/",
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        const map = new Map();
                        json.stat_status_pairs.forEach(item => {
                            const slug = item.stat.question__title_slug;
                            const status = item.status;
                            map.set(slug, status);
                        });
                        console.log(`📦 批量模式：获取状态成功，共 ${map.size} 题`);
                        resolve(map);
                    } catch (e) {
                        console.error("❌ 批量解析失败", e);
                        resolve(new Map());
                    }
                },
                onerror: function (err) {
                    console.error("❌ 批量请求失败", err);
                    resolve(new Map());
                }
            });
        });
    }

    function fetchSingleStatus(slug) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://leetcode.cn/graphql/",
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrftoken': csrfToken || '',
                },
                data: JSON.stringify({
                    operationName: "getQuestionProgress",
                    variables: { titleSlug: slug },
                    query: `
                        query getQuestionProgress($titleSlug: String!) {
                          question(titleSlug: $titleSlug) {
                            status
                          }
                        }
                    `
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        const status = json.data?.question?.status ?? null;
                        resolve(status);
                    } catch (e) {
                        console.error(`⚠️ 单题解析失败：${slug}`, e);
                        resolve(null);
                    }
                },
                onerror: function (err) {
                    console.error(`❌ 单题请求失败：${slug}`, err);
                    resolve(null);
                }
            });
        });
    }

    async function run() {
        const links = extractLinks();
        console.log(`🔍 检测到 ${links.length} 个题目链接`);

        if (links.length === 0) return;

        if (links.length <= THRESHOLD) {
            console.log(`🧪 小于等于 ${THRESHOLD}，逐题请求模式`);
            for (const link of links) {
                const slug = link.href.match(/problems\/([^/]+)\//)?.[1];
                if (!slug) continue;
                const status = await fetchSingleStatus(slug);
                insertStatusIcon(link, status);
            }
        } else {
            console.log(`📦 超过 ${THRESHOLD}，进入批量模式`);
            const statusMap = await fetchAllProblemStatuses();
            for (const link of links) {
                const slug = link.href.match(/problems\/([^/]+)\//)?.[1];
                const status = statusMap.get(slug) ?? null;
                insertStatusIcon(link, status);
            }
        }
    }

    // 等待页面加载完成
    setTimeout(run, 1000);
})();
