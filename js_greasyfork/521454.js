// ==UserScript==
// @name         移除广告内嵌脚本
// @namespace   https://greasyfork.org/zh-CN/users/1373566
// @version      1.5.2.4
// @license      MIT
// @description  这是一个由AI生成的脚本，通过关键词匹配来移除网页中的内嵌广告脚本。不能保证100%成功，可以在脚本菜单中管理排除的网页和关键词，脚本已经内置一些常见的关键词，若还有广告，可以自行添加Math.random，platform，navigator，new Function，new Date()尝试去除。
// @author       copilot & cheatgpt
// @homepageURL https://scriptcat.org/zh-CN/script-show-page/2796
// @match        http*://*/*
// @exclude      *://*.baidu.*/*
// @exclude      *://*.bing.*/*
// @exclude      *://*.douban.com/*
// @exclude      *://*.github.com/*
// @exclude      *://*.google.*/*
// @exclude      *://*.ifeng.com/*
// @exclude      *://*.iqiyi.com/*
// @exclude      *://*.mgtv.com/*
// @exclude      *://*.pptv.com/*
// @exclude      *://*.qq.com/*
// @exclude      *://*.sina.com.cn/*
// @exclude      *://*.sohu.com/*
// @exclude      *://*.v.qq.com/*
// @exclude      *://*.yandex.*/*
// @exclude      *://github.com/*
// @exclude      *://greasyfork.org/*
// @exclude      *://m.douban.com/*
// @exclude      *://scriptcat.org/*
// @exclude      *://twitter.com/*
// @exclude      *://x.com/*
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAXhSURBVGiB7VpdbBRVGD3n7g/bH8v2JynsNgTa7hIbfdhqIoIao2IkQSVAK9KWogRMiDHRB19MSH3QFxONJiY2sUJxS7RJI/iiRhEDhCaaFqix0XbbIukfFNqCLdB2dz4furudtruzs5XsqulJNpn7zZlvzrnz3bl3ZpaIDWt5efljAMpExB6HkzKQnAbQ2d7efhpAcN6+hWSfz/ckyXqSJakSaBYiEiB5oK2t7VQkNs+Az+fbQvI4ybT3ejyIyDSA59vb278FdAbKysqyHQ5HF8nVaVNnEiIyGAwGvR0dHZPWSNDhcFToxYvIgIh8AGAsLSp1UErlisgbJF0AQNKllNoJoDFqgORG/UGaplVeuHDhXIq1xkV5efnPAE5H2kqphwE0qkhARHJ02zI+Pt6eWonGGB0d/UVERBfKBQAVhw+r1Srx9qUDMfQQMDDwX8GygXRj2UC68Y8NuOpdmabJzbCX+vNyCo8WZqHu7nSeNTElPjz+ogYSNZ4md1N31cBLRlzvMdcjmFEnQOTlWCSU4ymahF8GQFwE8VMQM8f7dl+9kqyGJfdCqX9VGSh7AdgA1JYcLbzPiK8J9wPIAwCCFgI5JO8luIvCT2xiv+xtch8tbnatSYkBUu0hqMKCqJRtjyFfaEuQ0g6wxjKjLnr87q1mdSzNQDMsFFU9TyBRhTqTJSnih4S2C7U3AZwAZCKaB3CSbCn1u542k2pJBkqmVm8WimtB2FVSumqzmeOFuNRVPfRV9+7B97qq+rcFbbeKoGlvA5gOU+wK6rP1DQX3JMq1JANKqVqCi57mCEutqQQLVjW9lWM3umoG6zRNqxBIKJzMHXI4DibUYuqEOqw97HQCeE6n5bvINoFn1zStzE2YZJH1WQRqBr+mxiNRcSIvJkqVtAGbNesFgpkAIMDNIKdrBbgBACQzVyC7ItmcegQZrI9sC3F/cX3uSiN+8iWkoCsTaenbffUKBC2RCAWJy8hgod5rH74owB0AIKgs2ZnrjOUkgXWfu9YDeGhWg4iEQo0AAIYaBbMPG0JsKP7C7U0m7zxUYpq6x1gtNDt3xENSBiyK0Xs/wN5A7/AZAOiuGjoDsA8I91oQhnNCvDEwB5mbMyxG1yuZpUQzLJxGte7kU15P0UdoCp8yfNkBgEQ16nAIddBM5w+j6NOcPAFyI6dRIW3YiG/agGfK9QQVo9M8gTLM/iLtKARYU+J1P96DgR9jJjPo0wxH9jMELWHiZPftoYCRLvMlpEwMzjAI0mJmMC+Aq96VCaq3dJm+xyuYMTrG1BUors9dSXDbXETOAry+mCkFADeFG9sLGgpevbbv2l+LaDHGwNrDTqfdxmMIX9XZm4J8nEibKQMq01EBMCsscmLMNr1lpHJkYiGv1J+Xo5gxADAbYHauY8WOa8CRhTy9leJGt8dqwQ6Ar4FYFd0BNHdVDf6QUJspA0pFy0EELbHEA0CgevQmBMejgXhlJNzlaXK3epvcV61W/gHyXb14gbSO3pnab0pbIoK3Md8twKZwYhGhUY9CKI3RBvGot7nIvZBDopTgBoAF844V0USkfnJCnopZejGQsIS0kG2aVk4BcBDo7u7pP23E77YNnvLOuC8BXEtAcDviRfszfn/JdSFPBIP8sK+2v8OMcNMGAi8PjxT73Vst5OYQ2JDw3l6JUKhJ26nEclCAbwK1/QMAMGafecc5Y58huFqg3RLBdZKXRdM6AreGfk10t1myAQDorR44CeCk2aQ9VUNtAPbpYyOVIxMjwKHk5CXG8muVdGPZQLrx/zUQDAYTrtpTiRh6BJhvYDyyQZJOp/OBVAgzi/z8/AfJeW9CxoD580ArgAORhlLqS5/P9z7JtH+lFJE8EXldr19EzgELvhNnZGR0A3OLqn8r9N+JoyXU2dk5ISJ7RWQqneJM4I6maXs7OjomAcCi3zM0NNRTWFh4luQmkvnp0WeI30Wk8vz587H/K6GD1efzbcTs01FWSqQZgOQEyd/a2tpaAYTSreeu4m8HsQDCyNnesgAAAABJRU5ErkJggg==
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521454/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%86%85%E5%B5%8C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521454/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%86%85%E5%B5%8C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const REMOVE_AD_SCRIPTS_KEYWORDS_KEY = 'removeAdScriptsKeywords';
    const EXCLUDE_SITES_KEY = 'excludeSites';
    const DEFAULT_KEYWORDS = [
        'htmlAds',
        '_ffc1();',
        '_ffc2();',
        '_ffc3();',
        '_ffc4();',
        '_ffp();',
        'kbbaidu1();',
        'kbbaidu2();',
        'kbbaidu3();',
        'html5player.checkVideoAds',
        'ads_codes',
        '{return void 0!==b[a]?b[a]:a}).join("")}',
        '${scripts[randomIndex]}',
        '${scripts[Math.random()',
        '"https://"+Date.parse(new Date())+',
        '"https://"+(new Date().getDate())+',
        'https://hongosi.xn--',
        'https://{randomstr}.',
        'new Function(t)()',
        'new Function(b)()',
        'new Function(c)()',
        'new Function(t);',
        'new Function(b);',
        'new Function(c);',
        'new Function(\'d\',e)',
        'new Function(document[',
        'new Function(function(p,a,c,k,e,d)',
        'function a(a){',
        'function b(b){',
        'function c(c){',
        'function updateCarousel()',
        'Math.floor(2147483648 * Math.random());',
        'Math.floor(Math.random()*url.length)',
        'Math.floor(Math.random() * urls.length)',
        'new Date()[\'getTime\']()',
        'newDate=new window',
        'Math.floor(((new Date()).getTime()',
        '&&navigator[',
        '=navigator;',
        'navigator.platform){setTimeout(function',
        'disableDebugger',
        'blockDeveloperTools',
        '["Date"]())[\'getTime\']()',
        '</\'+\'s\'+\'c\'+\'ri\'+\'pt\'+\'>\');',
        '<\\/\'+\'s\'+\'c\'+\'ri\'+\'pt\'+\'>\');',
        'class=\\"zdhf\\"',
        '(\'#htmlContenthtml\').html',
        'D.createElement(\'span\');',
        'class=\\"app_tj\\"',
        'window.$m(',
        'jsjiami.com.v4',
        'histats.com',
        'hm.baidu.com',
        'adbyunion',
        '{win:false,mac:false,xll:false}',
        'mainCell:".bd",effect:"leftLoop"',
        '/invoke.js">',
        'function|getDate',
        'parseInt(Math[\'random\']',
        'pc.stgowan.com'
    ];
    let keywords = GM_getValue(REMOVE_AD_SCRIPTS_KEYWORDS_KEY, []);
    let excludeList = GM_getValue(EXCLUDE_SITES_KEY, []);
    let removedScriptsInfo = [];

    const saveKeywords = () => GM_setValue(REMOVE_AD_SCRIPTS_KEYWORDS_KEY, keywords);
    const saveExcludeList = () => GM_setValue(EXCLUDE_SITES_KEY, excludeList);
    const createStyledElement = (tagName, styles) => {
        const element = document.createElement(tagName);
        Object.assign(element.style, styles);
        return element;
    };
    const getKeywordsForCurrentSite = () => {
        const siteKeywords = keywords
            .filter(k => k.startsWith(`${window.location.hostname}:`))
            .map(k => k.split(':').slice(1).join(':'));
        return siteKeywords.length > 0 ? siteKeywords : DEFAULT_KEYWORDS;
    };
    const removeSpecificScript = () => {
        if (excludeList.includes(window.location.hostname)) {
            console.log('Site excluded:', window.location.hostname);
            return;
        }
        const currentKeywords = getKeywordsForCurrentSite();
        document.querySelectorAll('script').forEach(script => {
            const content = script.innerHTML;
            if (!content) return;
            const isMatch = currentKeywords.some(k => content.includes(k));
            if (!isMatch) return;
            const matchedKeywords = currentKeywords.filter(k => content.includes(k));
            removedScriptsInfo.push({
                keywords: matchedKeywords,
                content: script.innerHTML
            });
            script.remove();
            console.log('Removed script:', script);
        });
    };
    const addKeyword = () => {
        const newKeyword = prompt('请输入要添加的关键词:');
        if (newKeyword) {
            const siteKeyword = `${window.location.hostname}:${newKeyword}`;
            if (!keywords.some(k => k.startsWith(`${window.location.hostname}:`))) {
                keywords.push(...DEFAULT_KEYWORDS.map(k => `${window.location.hostname}:${k}`));
            }
            keywords.push(siteKeyword);
            saveKeywords();
            alert(`关键词已添加: ${newKeyword}`);
        }
    };
    const showKeywords = () => alert('当前关键词:\n' + getKeywordsForCurrentSite().join('\n'));
    const showRemovedScriptsInfo = () => {
        if (!removedScriptsInfo.length) return alert('没有移除任何脚本。');
        const info = removedScriptsInfo.map((item, i) =>
            `脚本 ${i + 1}:\n匹配关键词: ${item.keywords.join(', ')}\n脚本内容:\n${item.content.slice(0, 1000)}\n`
        ).join('\n');
        alert('移除的脚本信息:\n\n' + info);
    };
    const manageSite = operation => {
        const site = window.location.hostname;
        if (operation === 'exclude' && !excludeList.includes(site)) {
            excludeList.push(site);
            saveExcludeList();
            alert(`当前网址已排除: ${site}`);
        } else if (operation === 'add' && excludeList.includes(site)) {
            excludeList = excludeList.filter(s => s !== site);
            saveExcludeList();
            alert(`当前网址已从排除列表移除: ${site}`);
        } else {
            alert(`当前网址${operation === 'exclude' ? '已在' : '不在'}排除列表中`);
        }
    };
    const editKeywords = () => {
        const overlay = createStyledElement('div', {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '9998'
        });
        const container = createStyledElement('div', {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            width: '80vw',
            maxWidth: '600px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px'
        });
        const editor = createStyledElement('textarea', {
            width: '100%',
            height: '300px',
            border: '2px solid #4a90e2',
            borderRadius: '4px',
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '14px'
        });
        const buttonContainer = createStyledElement('div', {
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
            justifyContent: 'flex-end'
        });
        const buttonStyle = {
            padding: '8px 20px',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
        };
        editor.value = getKeywordsForCurrentSite().join('\n');
        const saveButton = createStyledElement('button', {
            ...buttonStyle,
            backgroundColor: '#4CAF50'
        });
        saveButton.textContent = '保存';
        saveButton.onclick = () => {
            keywords = keywords.filter(k => !k.startsWith(`${window.location.hostname}:`))
                .concat(editor.value.split('\n').map(k => k.trim()).filter(k => k).map(k => `${window.location.hostname}:${k}`));
            saveKeywords();
            document.body.removeChild(overlay);
            document.body.removeChild(container);
            alert('关键词已更新');
        };
        const resetButton = createStyledElement('button', {
            ...buttonStyle,
            backgroundColor: '#f44336'
        });
        resetButton.textContent = '重置';
        resetButton.onclick = () => {
            if (confirm('确定重置为默认关键词？')) {
                keywords = keywords.filter(k => !k.startsWith(`${window.location.hostname}:`));
                editor.value = DEFAULT_KEYWORDS.join('\n');
                saveKeywords();
                alert('已恢复默认关键词');
            }
        };
        buttonContainer.append(saveButton, resetButton);
        container.append(editor, buttonContainer);
        document.body.append(overlay, container);
    };
    const showInlineScripts = () => {
        const scripts = Array.from(document.querySelectorAll('script'))
            .filter(s => s.innerHTML.trim())
            .map((s, i) => `脚本 ${i + 1}:\n${s.innerHTML.trim()}\n`)
            .join('\n');
        alert(scripts ? '网页中的内嵌脚本:\n\n' + scripts : '没有找到内嵌脚本');
    };
    const cleanGMData = () => {
        const siteMap = {};
        keywords.forEach(k => {
            const [site, ...rest] = k.split(':');
            const key = rest.join(':');
            siteMap[site] = siteMap[site] || new Set();
            siteMap[site].add(key);
        });
        const sites = Object.keys(siteMap);
        if (!sites.length) return alert('没有找到任何网站数据');
        const overlay = createStyledElement('div', {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '9998'
        });
        const container = createStyledElement('div', {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            width: '80vw',
            maxWidth: '600px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            maxHeight: '80vh',
            overflowY: 'auto'
        });
        const title = createStyledElement('h3', {
            margin: '0 0 15px 0',
            color: '#212529'
        });
        title.textContent = '选择清理方式';

        const select = createStyledElement('select', {
            width: '100%',
            padding: '8px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #4a90e2'
        });
        select.innerHTML = '<option value="all">清理所有默认关键词数据</option><option value="specific">选择特定网站清理</option>';

        const siteSelectContainer = createStyledElement('div', {
            display: 'none',
            marginBottom: '15px'
        });
        const siteSelect = createStyledElement('select', {
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #4a90e2'
        });
        siteSelect.innerHTML = '<option value="">选择网站</option>' + sites.map(s => `<option value="${s}">${s}</option>`).join('');
        siteSelectContainer.appendChild(siteSelect);

        select.onchange = () => siteSelectContainer.style.display = select.value === 'specific' ? 'block' : 'none';

        const buttonContainer = createStyledElement('div', {
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
        });
        const buttonStyle = {
            padding: '8px 20px',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
        };

        const confirmButton = createStyledElement('button', {
            ...buttonStyle,
            backgroundColor: '#4CAF50'
        });
        confirmButton.textContent = '确认';
        confirmButton.onclick = () => {
            const mode = select.value;
            let report = 'GM数据清理报告:\n\n';
            let cleanedCount = 0;
            const defaultSet = new Set(DEFAULT_KEYWORDS);

            if (mode === 'all') {
                if (!confirm('确定要清理所有与默认关键词一致的数据吗？')) return;
                const sitesToRemove = [];
                for (const site in siteMap) {
                    const siteKeywords = siteMap[site];
                    const isExactMatch = siteKeywords.size === defaultSet.size && [...siteKeywords].every(k => defaultSet.has(k)) && [...defaultSet].every(k => siteKeywords.has(k));
                    report += `网站: ${site}\n关键词数量: ${siteKeywords.size}\n`;
                    if (isExactMatch) {
                        sitesToRemove.push(site);
                        cleanedCount++;
                    } else {
                        if (siteKeywords.size !== defaultSet.size) {
                            report += `原因: 数量不匹配 (默认: ${defaultSet.size}, 网站: ${siteKeywords.size})\n`;
                        }
                        const extraKeywords = [...siteKeywords].filter(k => !defaultSet.has(k));
                        const missingKeywords = [...defaultSet].filter(k => !siteKeywords.has(k));
                        if (extraKeywords.length > 0) {
                            report += `原因: 多余关键词: ${extraKeywords.join(', ')}\n`;
                        }
                        if (missingKeywords.length > 0) {
                            report += `原因: 缺少关键词: ${missingKeywords.join(', ')}\n`;
                        }
                        report += '\n';
                    }
                }
                if (cleanedCount) {
                    keywords = keywords.filter(k => !sitesToRemove.some(s => k.startsWith(`${s}:`)));
                    saveKeywords();
                    report += `共清理 ${cleanedCount} 个与默认关键词一致的网站数据`;
                } else {
                    report += '没有找到与默认关键词完全一致的网站数据';
                }
            } else if (mode === 'specific') {
                const selectedSite = siteSelect.value;
                if (!selectedSite) return alert('请选择一个网站');
                if (!confirm(`确定要清理 ${selectedSite} 的关键词数据吗？`)) return;
                const siteKeywords = siteMap[selectedSite];
                report += `网站: ${selectedSite}\n关键词数量: ${siteKeywords.size}\n关键词: ${[...siteKeywords].join(', ')}\n\n`;
                keywords = keywords.filter(k => !k.startsWith(`${selectedSite}:`));
                saveKeywords();
                report += `已清理 ${selectedSite} 的所有关键词数据`;
                cleanedCount = 1;
            }
            document.body.removeChild(overlay);
            document.body.removeChild(container);
            alert(report);
        };
        const cancelButton = createStyledElement('button', {
            ...buttonStyle,
            backgroundColor: '#f44336'
        });
        cancelButton.textContent = '取消';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(container);
        };
        buttonContainer.append(confirmButton, cancelButton);
        container.append(title, select, siteSelectContainer, buttonContainer);
        document.body.append(overlay, container);
    };
    const observer = new MutationObserver(mutations => {
        const newScripts = [];
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeName === 'SCRIPT' && node.innerHTML) {
                    newScripts.push(node);
                }
            });
        });
        if (!newScripts.length) return;
        if (excludeList.includes(window.location.hostname)) return;
        const currentKeywords = getKeywordsForCurrentSite();
        newScripts.forEach(script => {
            const content = script.innerHTML;
            const isMatch = currentKeywords.some(k => content.includes(k));
            if (!isMatch) return;
            const matchedKeywords = currentKeywords.filter(k => content.includes(k));
            removedScriptsInfo.push({
                keywords: matchedKeywords,
                content: script.innerHTML
            });
            script.remove();
            console.log('Removed script:', script);
        });
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    removeSpecificScript();
    GM_registerMenuCommand('排除当前网址', () => manageSite('exclude'));
    GM_registerMenuCommand('拦截当前网址', () => manageSite('add'));
    GM_registerMenuCommand('添加关键词', addKeyword);
    GM_registerMenuCommand('显示关键词', showKeywords);
    GM_registerMenuCommand('编辑关键词', editKeywords);
    GM_registerMenuCommand('移除脚本日志', showRemovedScriptsInfo);
    GM_registerMenuCommand('网页内嵌脚本查看', showInlineScripts);
    GM_registerMenuCommand('GM关键词数据清理', cleanGMData);
})();