// ==UserScript==
// @name         链接新标签页打开❓
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  为同域名和跨域名链接分别设置打开行为
// @author       Grey333
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528650/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E2%9D%93.user.js
// @updateURL https://update.greasyfork.org/scripts/528650/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E2%9D%93.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentDomain = window.location.hostname;
    const getTopLevelDomain = (domain) => {
        const parts = domain.split('.');
        return parts.length > 2 ? parts.slice(-2).join('.') : domain;
    };
    const currentTopLevelDomain = getTopLevelDomain(currentDomain);

    // 获取和设置行为
    const getSameDomainBehavior = () => GM_getValue(currentDomain + '_sameDomain_behavior', 'default');
    const setSameDomainBehavior = (value) => GM_setValue(currentDomain + '_sameDomain_behavior', value);
    const getSubDomainBehavior = () => GM_getValue(currentDomain + '_subDomain_behavior', 'default');
    const setSubDomainBehavior = (value) => GM_setValue(currentDomain + '_subDomain_behavior', value);
    const getCrossDomainBehavior = () => GM_getValue(currentDomain + '_crossDomain_behavior', 'default');
    const setCrossDomainBehavior = (value) => GM_setValue(currentDomain + '_crossDomain_behavior', value);

    // 创建图形界面
    function createGUI() {
        if (document.getElementById('linkControlPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'linkControlPanel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #f9f9f9;
            border: 1px solid #ddd; border-radius: 8px; padding: 15px;
            z-index: 10000; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: Arial, sans-serif; transition: opacity 0.3s ease-in-out;
            opacity: 0; max-width: 350px; min-width: 250px;
        `;

        const title = document.createElement('h3');
        title.textContent = `链接控制 - ${currentDomain}`;
        title.style.margin = '0 0 10px';
        panel.appendChild(title);

        const options = [
            { group: '同域名链接', key: 'sameDomain', get: getSameDomainBehavior, set: setSameDomainBehavior },
            { group: '子域名链接', key: 'subDomain', get: getSubDomainBehavior, set: setSubDomainBehavior },
            { group: '跨域名链接', key: 'crossDomain', get: getCrossDomainBehavior, set: setCrossDomainBehavior }
        ];

        options.forEach(({ group, key, get, set }) => {
            const groupTitle = document.createElement('h4');
            groupTitle.textContent = group;
            groupTitle.style.margin = '10px 0 5px';
            panel.appendChild(groupTitle);

            const behaviorOptions = [
                { label: '默认（不干预）', value: 'default' },
                { label: '强制新标签页', value: 'forceNewTab' },
                { label: '禁止新标签页', value: 'forceSameTab' }
            ];

            behaviorOptions.forEach(opt => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.margin = '5px 0';

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `${key}_behavior`;
                radio.value = opt.value;
                if (get() === opt.value) radio.checked = true;

                radio.addEventListener('change', () => {
                    set(opt.value);
                    alert(`已为 ${group} 设置: ${opt.label}`);
                });

                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${opt.label}`));
                panel.appendChild(label);
            });
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 15px; padding: 5px 10px; background: #007bff;
            color: #fff; border: none; border-radius: 4px; cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => {
            panel.style.opacity = '0';
            setTimeout(() => panel.remove(), 300);
        });
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);
        setTimeout(() => panel.style.opacity = '1', 10);
    }

    GM_registerMenuCommand('设置链接行为', createGUI);

    // 拦截 window.open
    const originalOpen = unsafeWindow.open;
    unsafeWindow.open = function(url, name, features) {
        const absoluteURL = new URL(url, window.location.href);
        const linkDomain = absoluteURL.hostname;
        const linkTopLevelDomain = getTopLevelDomain(linkDomain);
        let behavior;

        if (linkDomain === currentDomain) {
            behavior = getSameDomainBehavior();
        } else if (linkTopLevelDomain === currentTopLevelDomain && linkDomain !== currentDomain) {
            behavior = getSubDomainBehavior();
        } else {
            behavior = getCrossDomainBehavior();
        }

        if (behavior === 'forceSameTab') {
            window.location.href = absoluteURL.href;
            return null;
        } else if (behavior === 'forceNewTab') {
            return originalOpen.call(this, url, name, features);
        }
        return originalOpen.call(this, url, name, features);
    };

    // 应用链接行为
    function applyLinkBehavior() {
        const sameDomainBehavior = getSameDomainBehavior();
        const subDomainBehavior = getSubDomainBehavior();
        const crossDomainBehavior = getCrossDomainBehavior();

        // 单次绑定点击事件
        document.removeEventListener('click', clickHandler, { capture: true });
        document.addEventListener('click', clickHandler, { capture: true });

        function clickHandler(e) {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            const absoluteURL = new URL(link.href, window.location.href);
            const linkDomain = absoluteURL.hostname;
            const linkTopLevelDomain = getTopLevelDomain(linkDomain);
            let behavior;

            if (linkDomain === currentDomain) {
                behavior = sameDomainBehavior;
            } else if (linkTopLevelDomain === currentTopLevelDomain && linkDomain !== currentDomain) {
                behavior = subDomainBehavior;
            } else {
                behavior = crossDomainBehavior;
            }

            if (behavior === 'default') return;

            e.preventDefault();
            e.stopImmediatePropagation();

            if (behavior === 'forceNewTab') {
                window.open(absoluteURL.href, '_blank');
            } else if (behavior === 'forceSameTab') {
                window.location.href = absoluteURL.href;
            }
        }

        // 优化 MutationObserver
        let debounceTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                document.querySelectorAll('a[href]').forEach(link => {
                    const absoluteURL = new URL(link.href, window.location.href);
                    const linkDomain = absoluteURL.hostname;
                    const linkTopLevelDomain = getTopLevelDomain(linkDomain);
                    let behavior;

                    if (linkDomain === currentDomain) {
                        behavior = sameDomainBehavior;
                    } else if (linkTopLevelDomain === currentTopLevelDomain && linkDomain !== currentDomain) {
                        behavior = subDomainBehavior;
                    } else {
                        behavior = crossDomainBehavior;
                    }

                    if (behavior === 'forceSameTab' && link.getAttribute('target') === '_blank') {
                        link.removeAttribute('target');
                    }
                });
            }, 100); // 防抖 100ms
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    applyLinkBehavior();
})();