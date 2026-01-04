// ==UserScript==
// @name         本站审查
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  按 Alt+3 分析首页的可见 H1、外链（排除 wordpress.org）、中文文本，并后台打开相关页面，优化弹窗排版，作者：hsopen。
// @author       hsopen
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      GPLv3
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541879/%E6%9C%AC%E7%AB%99%E5%AE%A1%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/541879/%E6%9C%AC%E7%AB%99%E5%AE%A1%E6%9F%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const autoOpenPaths = [
        '/wp-admin/options-reading.php',
        '/about/',
        '/',  // 可选首页
    ];

    GM_addStyle(`
    .my-popup {
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      color: #333;
      padding: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      max-width: 80%;
      max-height: 80%;
      overflow-y: auto;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
    }
    .my-popup-close {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
    }
    `);

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            runAudit();
        }
    });

    function runAudit() {
        const url = new URL(window.location.href);
        const base = `${url.protocol}//${url.hostname}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: base + '/',
            onload: function (res) {
                const html = res.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const siteTitle = (doc.querySelector('title')?.textContent || '无标题').trim();
                const h1Count = doc.querySelectorAll('h1').length;

                const allLinks = [...doc.querySelectorAll('a[href]')];
                const visibleLinks = allLinks.filter(a => {
                    const style = a.getAttribute("style") || "";
                    const hidden = a.getAttribute("hidden") !== null || a.getAttribute("aria-hidden") === "true";
                    const hasContent = a.textContent.trim() !== "" || a.querySelector("img, button");
                    return !hidden && !/display\s*:\s*none/i.test(style) && hasContent;
                });
                const linkHrefs = visibleLinks.map(a => a.href);

                const externalLinks = linkHrefs.filter(href =>
                    /^https?:\/\//.test(href) &&
                    !href.includes(url.hostname) &&
                    !href.includes("wordpress.org")
                );
                const externalCount = externalLinks.length;

                const bodyText = doc.body.innerText || "";
                const chineseMatches = bodyText.match(/[\u4e00-\u9fa5]{2,}/g);
                const chineseSamples = chineseMatches ? [...new Set(chineseMatches)].slice(0, 10) : [];

                let htmlContent = `
<h2>📘 本站分析报告</h2>
<p><strong>站点标题：</strong> ${siteTitle}</p>
<p><strong>H1 标签数量：</strong> ${h1Count}</p>
<p><strong>可见外链（排除 wordpress.org）：</strong> ${externalCount}</p>
<ul>
${externalLinks.slice(0, 10).map(link => `<li><code>${link}</code></li>`).join('')}
${externalCount > 10 ? '<li>...（更多）</li>' : ''}
</ul>
<p><strong>是否含中文：</strong> ${chineseSamples.length > 0 ? '是' : '否'}</p>
${chineseSamples.length > 0 ? `
<p><strong>中文内容示例：</strong></p>
<ul>
${chineseSamples.map(t => `<li>${t}</li>`).join('')}
</ul>` : '<p><em>未发现中文内容</em></p>'}
`;

                showPopup(htmlContent);

                // 打开 robots.txt 中的 sitemap 链接（如果有）
                GM_xmlhttpRequest({
                    method: "GET",
                    url: base + '/robots.txt',
                    onload: function (r) {
                        const sitemapMatch = r.responseText.match(/Sitemap:\s*(\S+)/i);
                        if (sitemapMatch) {
                            GM_openInTab(sitemapMatch[1], { active: false });
                        }
                    }
                });

                // 打开配置的后台路径
                autoOpenPaths.forEach(path => {
                    GM_openInTab(base + path, { active: false });
                });
            }
        });
    }

    function showPopup(html) {
        const div = document.createElement("div");
        div.className = "my-popup";

        const close = document.createElement("div");
        close.className = "my-popup-close";
        close.innerHTML = "×";
        close.onclick = () => div.remove();

        div.innerHTML = html;
        div.appendChild(close);
        document.body.appendChild(div);
    }
})();
