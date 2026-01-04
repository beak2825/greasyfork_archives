// ==UserScript==
// @name         AWS - Default Page Redirector
// @name:en      AWS - Default Page Redirector
// @name:ja      AWS - デフォルトページリダイレクタ
// @name:zh-CN   AWS - 服务默认页面跳转
// @namespace    https://github.com/CheerChen
// @version      3.0.1
// @description  Automatically redirects from AWS service dashboards to your preferred default page (e.g., EC2 -> Instances). Fully customizable and supports SPA navigation.
// @description:en Automatically redirects from AWS service dashboards to your preferred default page (e.g., EC2 -> Instances). Fully customizable and supports SPA navigation.
// @description:ja AWSサービスのダッシュボードから希望するデフォルトページ（例：EC2 -> インスタンス）に自動的にリダイレクトします。完全にカスタマイズ可能でSPAナビゲーションをサポートします。
// @description:zh-CN 自动将 AWS 服务的仪表盘页面重定向到您预设的常用页面（例如 EC2 -> 实例列表）。支持完全自定义和单页面应用（SPA）导航。
// @author       cheerchen37
// @match        https://*.console.aws.amazon.com/*
// @icon         https://www.google.com/s2/favicons?domain=aws.amazon.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/547476/AWS%20-%20Default%20Page%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/547476/AWS%20-%20Default%20Page%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --------------------------------------------------------------------------------
    // Configuration: Define your desired default pages for AWS services here.
    // --------------------------------------------------------------------------------
    const defaultPages = {
        'rds': '/rds/home#databases:',
        'lambda': '/lambda/home#/functions',
        'dynamodbv2': '/dynamodbv2/home#tables',
        'cloudwatch': '/cloudwatch/home#logsV2:log-groups',

        'stepfunctions': '/stepfunctions/home#/statemachines',
        'ec2': '/ec2/home#Instances:',
        'apigateway': '/apigateway/main/apis',
        'events': '/events/home#/rules',
        'route53': '/route53/v2/hostedzones',
        'ecs': '/ecs/v2/clusters',
        'ecr': '/ecr/repositories',
        // 'servicename': '/path/to/default/page'
    };


    // --------------------------------------------------------------------------------
    // Core Logic: No need to edit below this line.
    // --------------------------------------------------------------------------------

    let lastUrl = location.href;

    /**
     * The core function that checks the current URL and redirects if necessary.
     */
    function checkAndRedirect() {
        const currentUrl = window.location.href;
        const pathname = window.location.pathname;
        const hash = window.location.hash;

        const serviceMatch = pathname.match(/\/([a-zA-Z0-9_-]+)\/(home|v2|main)/);
        if (!serviceMatch) return;

        const serviceName = serviceMatch[1];
        const defaultPath = defaultPages[serviceName];

        if (!defaultPath) return;

        // 1. If already at or beyond the target page, do nothing to prevent loops.
        if (currentUrl.includes(defaultPath)) return;

        // 2. Define a list of "home/dashboard" hashes that should trigger a redirect.
        const redirectableHashes = ['', '#', '#/', '#dashboard', '#welcome'];

        // 3. Check if the current page is a redirectable service root/dashboard page.
        const isServiceRootPage = (pathname.endsWith('/home') || pathname.endsWith('/home/')) &&
                                  redirectableHashes.includes(hash);

        if (isServiceRootPage) {
            const urlParams = new URLSearchParams(window.location.search);
            let region = urlParams.get('region');

            if (!region) {
                const regionMatch = window.location.hostname.match(/^([a-z0-9-]+)\.console\.aws\.amazon\.com/);
                if (regionMatch && regionMatch[1]) {
                    region = regionMatch[1];
                }
            }

            const hashIndex = defaultPath.indexOf('#');
            let basePath = defaultPath;
            let newHash = '';

            if (hashIndex !== -1) {
                basePath = defaultPath.substring(0, hashIndex);
                newHash = defaultPath.substring(hashIndex);
            }

            const regionQuery = region ? `?region=${region}` : '';
            const newUrl = `${window.location.origin}${basePath}${regionQuery}${newHash}`;

            console.log(`AWS Redirector: Redirecting for "${serviceName}"...`);
            console.log(`   From: ${currentUrl}`);
            console.log(`   To:   ${newUrl}`);

            window.location.href = newUrl;
        }
    }

    const handleUrlChange = () => {
        requestAnimationFrame(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(checkAndRedirect, 200);
            }
        });
    };

    // ----- Initialize Listeners -----
    window.addEventListener('hashchange', handleUrlChange, false);
    window.addEventListener('popstate', handleUrlChange, false);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleUrlChange();
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkAndRedirect, 1000);
    });

})();