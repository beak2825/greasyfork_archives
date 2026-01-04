// ==UserScript==
// @name         Extract HTML Content with Configurations
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extract and save HTML content of the webpage with site-specific configurations and removal of unwanted elements
// @author       Your Name
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/503005/Extract%20HTML%20Content%20with%20Configurations.user.js
// @updateURL https://update.greasyfork.org/scripts/503005/Extract%20HTML%20Content%20with%20Configurations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 网站配置
    const siteConfigurations = {
        'woshipm.com': {
            selector: 'div.article--content.grap',
            removeSelectors: ['.article--actions', '.article-bottomAd.js-star.js-star-1.star--show']
        }
        // 可以在这里添加更多网站配置
    };

    // 获取当前网站的配置
    const currentSite = Object.keys(siteConfigurations).find(site => window.location.href.includes(site));
    const siteConfig = currentSite ? siteConfigurations[currentSite] : null;

    function extractAndDownloadHTML() {
        let extractedContent;

        if (siteConfig && siteConfig.selector) {
            // 提取特定选择器内容
            const element = document.querySelector(siteConfig.selector);
            if (element) {
                // 克隆节点以进行修改
                const clonedElement = element.cloneNode(true);

                // 删除指定的子元素
                if (siteConfig.removeSelectors) {
                    siteConfig.removeSelectors.forEach(selector => {
                        const elementsToRemove = clonedElement.querySelectorAll(selector);
                        elementsToRemove.forEach(el => el.remove());
                    });
                }

                extractedContent = clonedElement.outerHTML;
            } else {
                alert('指定的元素未找到。');
                return;
            }
        } else {
            // 提取整个HTML内容
            const doctype = new XMLSerializer().serializeToString(document.doctype);
            const html = document.documentElement.cloneNode(true);

            // 删除所有script标签
            const scripts = html.getElementsByTagName('script');
            while (scripts.length > 0) {
                scripts[0].parentNode.removeChild(scripts[0]);
            }

            // 删除所有style标签
            const styles = html.getElementsByTagName('style');
            while (styles.length > 0) {
                styles[0].parentNode.removeChild(styles[0]);
            }

            // 删除所有link标签中的CSS文件
            const links = html.getElementsByTagName('link');
            for (let i = links.length - 1; i >= 0; i--) {
                if (links[i].rel === 'stylesheet') {
                    links[i].parentNode.removeChild(links[i]);
                }
            }

            extractedContent = doctype + html.outerHTML;
        }

        // 获取网页标题作为文件名
        const title = document.title.replace(/[\/\\:*?"<>|]/g, '_'); // 替换掉不允许出现在文件名中的字符
        const fileName = `${title}.html`;

        // 创建一个Blob对象并下载
        const blob = new Blob([extractedContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 注册菜单命令
    GM_registerMenuCommand('Extract HTML', extractAndDownloadHTML);
})();
