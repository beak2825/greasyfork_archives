// ==UserScript==
// @name         BTD Dev Plugin
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  improved work efficiency.
// @author       cc
// @match        https://meego.feishu.cn/*/issue/detail/*
// @match        https://meego.feishu.cn/*/story/detail/*
// @match        https://bits.bytedance.net/bytebus/devops/code/detail/*
// @match        https://bits.bytedance.net/bytebus/components/components/detail/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/438155/BTD%20Dev%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/438155/BTD%20Dev%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const __VERSION__ = '1.0.2';
    let config;

    function formatLog(message) {
        console.log(`%c ${message} `, 'background-color: yellow; color: black;');
    }

    function syncConfig() {
        config = GM_getValue('config');
        if (!config) {
            config = {
                shouldTitleStripBracket: false,
            };
            GM_setValue('config', config);
        }
    }

    /**
     * Get schema
     * @param {string} url url to get schema
     * @returns {string} schema of the url
     */
    function getSchema(url) {
        let schema = location.href.substring(location.href.indexOf(location.host) + location.host.length);
        return schema;
    }

    /**
     * Get sub schema
     * @param {string} schema schema to get sub schema
     * @returns {string} sub schema
     */
    function getSubSchema(schema) {
        let subSchema = schema.replace(/^\/\w+/, '');
        return subSchema;
    }

    /**
     *
     * @param {string} schema schema to get first router
     * @returns {string} first router of schema
     */
    function getFirstRouter(schema) {
        let result = schema.match(/^\/([^\/]+)/);
        return (result && result[1]) ? result[1] : '';
    }

    /**
     * Execute task when the condition satisfies
     * @param {function} task task to execute
     * @param {function} cond condition to decide whether to execute task
     * @param {number} timeout retry timeout
     */
    function execUntil(task, cond, timeout) {
        timeout = timeout || 250;
        function tryTask () {
            if (cond()) {
                task();
            } else {
                setTimeout(tryTask, timeout);
            }
        }
        tryTask();
    }

    /**
     * Simplify title
     * @param {string} title title to simplify
     * @param {RegExp} prefixToBeReplaced prefix to be replaced
     * @param {string} prefixToReplace prefix to replace
     * @param {string} prefixToAdd prefix to add in the front
     */
    function simplifyTitle(title, prefixToBeReplaced, prefixToReplace, prefixToAdd) {
        prefixToBeReplaced = prefixToBeReplaced || '';
        prefixToReplace = prefixToReplace || '';
        prefixToAdd = prefixToAdd || '';
        let simplifiedTitle = title || '';
        if (prefixToBeReplaced) {
            while (simplifiedTitle.match(prefixToBeReplaced)) {
                simplifiedTitle = simplifiedTitle.replace(prefixToBeReplaced, prefixToReplace);
            }
        }
        simplifiedTitle = simplifiedTitle.replace(/\s{2,}/g, ' ');
        simplifiedTitle = simplifiedTitle.replace(/\]\[/g, '] [');
        simplifiedTitle = simplifiedTitle.trim();
        if (config.shouldTitleStripBracket) {
            simplifiedTitle = simplifiedTitle.replace(/\[.+?\]/g, '');
        }
        simplifiedTitle = `${prefixToAdd}${simplifiedTitle}`;
        return simplifiedTitle;
    }

    /**
     * Replace title with a specific role
     * @param {string} titleSelector title selector
     * @param {function} simplifyRole simplify role
     */
    function replaceTitle(titleSelector, simplifyRole) {
        execUntil(() => {
            let titleEl = document.querySelector(titleSelector);
            let title = titleEl.innerText;
            function resetTitle() {
                config.shouldTitleStripBracket = !config.shouldTitleStripBracket;
                GM_setValue('config', config);
                titleEl.removeEventListener('click', resetTitle);
                replaceTitle(titleSelector, simplifyRole);
            }
            titleEl.addEventListener('click', resetTitle);
            let simplifiedTitle = simplifyRole(title);
            document.title = simplifiedTitle;
        }, () => {
            let titleEl = document.querySelector(titleSelector);
            return titleEl && titleEl.innerText.length > 0;
        });
    }

    document.onreadystatechange = function() {
        formatLog(`BTDDevPlugin.js version: ${__VERSION__}`);
        syncConfig();

        if (location.host === 'meego.feishu.cn') {
            let schema = getSchema(location.href);
            let subSchema = getSubSchema(schema);

            if (subSchema.match(/^\/issue\/detail\/\d+.*$/)) {          // /*/issue/detail/*
                replaceTitle('.issue-title', (title) => {
                    let simplifiedTitle = simplifyTitle(title, /【(.+?)】/, '[$1]', '[Issue] ');
                    return simplifiedTitle;
                });
            } else if (subSchema.match(/^\/story\/detail\/\d+.*$/)) {   // /*/story/detail/*
                replaceTitle('.story-header-toolbar .story-header-item', (title) => {
                    let simplifiedTitle = simplifyTitle(title, /【(.+?)】/, '[$1]', '[Story] ');
                    return simplifiedTitle;
                });
            }
        } else if (location.host === 'bits.bytedance.net') {
            let schema = getSchema(location.href);
            let subSchema = getSubSchema(schema);
            let firstRouter = getFirstRouter(schema);

            if (firstRouter === 'bytebus') {
                if (subSchema.match(/^\/devops\/code\/detail\/\d+.*$/)) {                   // /bytebus/devops/code/detail/*
                    replaceTitle('.title-text', (title) => {
                        let simplifiedTitle = simplifyTitle(title, /【(.+?)】/, '[$1]', '[MR] ');
                        return simplifiedTitle;
                    });
                } else if (subSchema.match(/^\/components\/components\/detail\/\d+.*$/)) {  // /bytebus/components/components/detail/*
                    replaceTitle('[class^=title__Name]', (title) => {
                        let simplifiedTitle = simplifyTitle(title, undefined, undefined, '[Components] ');
                        return simplifiedTitle;
                    });
                }
            }
        }
    }
})();