// ==UserScript==
// @name         FOFA IP and Domain Extractor (Dark Tabbed)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Extract IP:port and domains with dark themed tabbed interface
// @author       zephyrus
// @match        https://fofa.info/result*
// @match        https://*.fofa.info/result*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537304/FOFA%20IP%20and%20Domain%20Extractor%20%28Dark%20Tabbed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537304/FOFA%20IP%20and%20Domain%20Extractor%20%28Dark%20Tabbed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    GM_addStyle(`
        .fofa-extractor-container {
            margin: 20px auto;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            width: 70%;
            max-width: 800px;
        }
        .fofa-tab-container {
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            background: #2d2d2d;
        }
        .fofa-tab-header {
            display: flex;
            background: #1e1e1e;
            border-bottom: 1px solid #3a3a3a;
        }
        .fofa-tab {
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 500;
            color: #aaa;
            transition: all 0.3s;
            border-right: 1px solid #3a3a3a;
            position: relative;
        }
        .fofa-tab:last-child {
            border-right: none;
        }
        .fofa-tab.active {
            color: #05f2f2;
            background: #2d2d2d;
        }
        .fofa-tab.active:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: #05f2f2;
        }
        .fofa-tab-badge {
            display: inline-block;
            padding: 2px 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 12px;
            margin-left: 8px;
            color: #ddd;
        }
        .fofa-tab-content {
            display: none;
            background: #2d2d2d;
            padding: 15px;
        }
        .fofa-tab-content.active {
            display: block;
        }
        .fofa-content-box {
            max-height: 400px;
            overflow-y: auto;
            padding: 12px;
            background: #252525;
            border-radius: 4px;
            line-height: 1.6;
            white-space: pre;
            font-size: 13px;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        .fofa-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            color: #aaa;
            font-size: 13px;
        }
        .fofa-copy-btn {
            padding: 6px 14px;
            background: #05f2f2;
            color: #111;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            font-weight: 500;
        }
        .fofa-copy-btn:hover {
            background: #05e0e0;
        }
        .fofa-copy-btn.copied {
            background: #05a2a2;
            color: #fff;
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e1e;
        }
        ::-webkit-scrollbar-thumb {
            background: #05f2f2;
            border-radius: 4px;
        }
        @media (max-width: 768px) {
            .fofa-extractor-container {
                width: 90%;
            }
            .fofa-tab-header {
                flex-wrap: wrap;
            }
            .fofa-tab {
                flex: 1 0 auto;
                text-align: center;
                padding: 8px 12px;
            }
        }
    `);

    const extractData = () => {
        const items = Array.from(document.querySelectorAll(".hsxa-meta-data-item"));
        const domains = new Set();
        const ips = new Set();

        items.forEach(item => {
            // Extract domain with port
            const domainLink = item.querySelector(".hsxa-host a");
            const domain = domainLink?.textContent.trim().replace(/^https?:\/\//, "");
            const portElement = item.querySelector(".hsxa-port");
            const port = portElement ? atob(portElement.href.match(/qbase64=([^&]+)/)?.[1]).match(/port="([^"]+)"/)?.[1] : "";

            if (domain && port) {
                domains.add(`${domain}:${port}`);
            }

            // Extract IP with port
            const ipElement = item.querySelector(".hsxa-jump-a");
            const ip = ipElement ? atob(ipElement.href.match(/qbase64=([^&]+)/)?.[1]).match(/ip="([^"]+)"/)?.[1] : "";

            if (ip && port) {
                ips.add(`${ip}:${port}`);
            }
        });

        return {
            domains: Array.from(domains).sort(),
            ips: Array.from(ips).sort()
        };
    };

    const createTabbedInterface = (ips, domains) => {
        const container = document.createElement('div');
        container.className = 'fofa-tab-container';

        // Create tab headers
        const tabHeader = document.createElement('div');
        tabHeader.className = 'fofa-tab-header';

        const ipTab = document.createElement('div');
        ipTab.className = 'fofa-tab active';
        ipTab.dataset.tab = 'ip';
        ipTab.innerHTML = `IP列表 <span class="fofa-tab-badge">${ips.length}</span>`;

        const domainTab = document.createElement('div');
        domainTab.className = 'fofa-tab';
        domainTab.dataset.tab = 'domain';
        domainTab.innerHTML = `域名列表 <span class="fofa-tab-badge">${domains.length}</span>`;

        tabHeader.appendChild(ipTab);
        tabHeader.appendChild(domainTab);
        container.appendChild(tabHeader);

        // Create tab contents
        const contentContainer = document.createElement('div');
        contentContainer.className = 'fofa-tab-contents';

        // IP Tab Content
        const ipContent = document.createElement('div');
        ipContent.className = 'fofa-tab-content active';
        ipContent.id = 'ip-tab';

        const ipToolbar = document.createElement('div');
        ipToolbar.className = 'fofa-toolbar';
        ipToolbar.innerHTML = '<div>共 ' + ips.length + ' 个IP</div>';

        const ipCopyBtn = document.createElement('button');
        ipCopyBtn.className = 'fofa-copy-btn';
        ipCopyBtn.textContent = '复制所有IP';
        ipCopyBtn.onclick = () => {
            GM_setClipboard(ips.join('\n'));
            ipCopyBtn.textContent = '已复制!';
            ipCopyBtn.classList.add('copied');
            setTimeout(() => {
                ipCopyBtn.textContent = '复制所有IP';
                ipCopyBtn.classList.remove('copied');
            }, 2000);
        };

        ipToolbar.appendChild(ipCopyBtn);
        ipContent.appendChild(ipToolbar);

        const ipContentBox = document.createElement('div');
        ipContentBox.className = 'fofa-content-box';
        ipContentBox.textContent = ips.join('\n');
        ipContent.appendChild(ipContentBox);

        // Domain Tab Content
        const domainContent = document.createElement('div');
        domainContent.className = 'fofa-tab-content';
        domainContent.id = 'domain-tab';

        const domainToolbar = document.createElement('div');
        domainToolbar.className = 'fofa-toolbar';
        domainToolbar.innerHTML = '<div>共 ' + domains.length + ' 个域名</div>';

        const domainCopyBtn = document.createElement('button');
        domainCopyBtn.className = 'fofa-copy-btn';
        domainCopyBtn.textContent = '复制所有域名';
        domainCopyBtn.onclick = () => {
            GM_setClipboard(domains.join('\n'));
            domainCopyBtn.textContent = '已复制!';
            domainCopyBtn.classList.add('copied');
            setTimeout(() => {
                domainCopyBtn.textContent = '复制所有域名';
                domainCopyBtn.classList.remove('copied');
            }, 2000);
        };

        domainToolbar.appendChild(domainCopyBtn);
        domainContent.appendChild(domainToolbar);

        const domainContentBox = document.createElement('div');
        domainContentBox.className = 'fofa-content-box';
        domainContentBox.textContent = domains.join('\n');
        domainContent.appendChild(domainContentBox);

        contentContainer.appendChild(ipContent);
        contentContainer.appendChild(domainContent);
        container.appendChild(contentContainer);

        // Add tab switching functionality
        const tabs = container.querySelectorAll('.fofa-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active content
                const tabName = tab.dataset.tab;
                container.querySelectorAll('.fofa-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                container.querySelector(`#${tabName}-tab`).classList.add('active');
            });
        });

        return container;
    };

    const insertResults = () => {
        // Check if already inserted
        if (document.getElementById('fofa-extractor-container')) return;

        const targetElement = document.querySelector('div.contentContainer.resultIndex > div:nth-child(1) > div.relatedSearch');
        if (!targetElement) return;

        const { domains, ips } = extractData();
        if (domains.length === 0 && ips.length === 0) return;

        const container = document.createElement('div');
        container.id = 'fofa-extractor-container';
        container.className = 'fofa-extractor-container';

        container.appendChild(createTabbedInterface(ips, domains));
        targetElement.parentNode.insertBefore(container, targetElement);
    };

    // Use MutationObserver to wait for page load
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.hsxa-meta-data-item')) {
            obs.disconnect();
            setTimeout(insertResults, 500);
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Also run when page updates (e.g. pagination)
    document.addEventListener('DOMNodeInserted', insertResults);
})();