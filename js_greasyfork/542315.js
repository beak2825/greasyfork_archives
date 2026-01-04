// ==UserScript==
// @name         Iwara ID 黑名单 (v3.9)
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  在 iwara.tv 上根据作者 Profile ID 屏蔽作品和评论，并提供默认折叠的导入/导出/管理黑名单的功能。
// @author       Gemini
// @match        https://*.iwara.tv/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542315/Iwara%20ID%20%E9%BB%91%E5%90%8D%E5%8D%95%20%28v39%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542315/Iwara%20ID%20%E9%BB%91%E5%90%8D%E5%8D%95%20%28v39%29.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const BLACKLIST_KEY = 'iwara_id_blacklist';

    const getBlacklist = () => {
        const defaultValue = '["blacklane"]';
        return new Set(JSON.parse(GM_getValue(BLACKLIST_KEY, defaultValue)));
    };

    const saveBlacklist = (blacklistSet) => {
        GM_setValue(BLACKLIST_KEY, JSON.stringify(Array.from(blacklistSet)));
    };

    const hideBlacklistedWorks = () => {
        const blacklist = getBlacklist();
        if (blacklist.size === 0) return;
        const works = document.querySelectorAll('.videoTeaser:not([data-id-checked]), .imageTeaser:not([data-id-checked])');
        for (const work of works) {
            work.dataset.idChecked = 'true';
            const authorLink = work.querySelector('a.username');
            if (authorLink) {
                const profileId = authorLink.href.split('/profile/')[1];
                if (profileId && blacklist.has(profileId)) {
                    const workContainer = work.closest('[class*="col-"]');
                    if (workContainer) workContainer.style.display = 'none';
                }
            }
        }
    };

    const hideBlacklistedComments = () => {
        const blacklist = getBlacklist();
        if (blacklist.size === 0) return;
        const comments = document.querySelectorAll('.comment:not([data-id-checked])');
        for (const comment of comments) {
            comment.dataset.idChecked = 'true';
            const authorLink = comment.querySelector('a.username');
            if (authorLink) {
                const profileId = authorLink.href.split('/profile/')[1];
                if (profileId && blacklist.has(profileId)) {
                    const commentContainer = comment.closest('.col-12');
                    if (commentContainer) commentContainer.style.display = 'none';
                }
            }
        }
    };

    const addBlockButton = () => {
        if (!window.location.pathname.startsWith('/profile/')) return;
        if (document.querySelector('#author-id-block-btn')) return;
        const container = document.querySelector('.page-profile__header__middle .d-flex.align-items-center');
        if (!container) return;
        const currentProfileId = window.location.pathname.split('/profile/')[1];
        if (!currentProfileId) return;
        const blockButton = document.createElement('div');
        blockButton.id = 'author-id-block-btn';
        Object.assign(blockButton.style, {
            marginLeft: '16px', padding: '4px 10px', border: '1px solid #ccc',
            borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
            fontWeight: 'bold', userSelect: 'none', transition: 'all 0.2s ease'
        });

        const updateButtonState = (isBlocked) => {
            if (isBlocked) {
                // 已拉黑状态
                blockButton.textContent = '🚫已拉黑此ID (点击移除)';
                blockButton.style.borderColor = '#e91e63';
                blockButton.style.color = '#e91e63';
                blockButton.style.backgroundColor = '#fce4ec';
            } else {
                // --- 核心改动：更新按钮的文本和样式 ---
                // 未拉黑 (正常) 状态
                blockButton.textContent = '✅正常状态 (点击拉黑)';
                blockButton.style.borderColor = '#4CAF50';
                blockButton.style.color = '#4CAF50';
                blockButton.style.backgroundColor = '#e8f5e9';
            }
        };

        let blacklist = getBlacklist();
        updateButtonState(blacklist.has(currentProfileId));
        blockButton.addEventListener('click', (e) => {
            e.stopPropagation();
            let currentBlacklist = getBlacklist();
            if (currentBlacklist.has(currentProfileId)) {
                currentBlacklist.delete(currentProfileId);
            } else {
                currentBlacklist.add(currentProfileId);
            }
            saveBlacklist(currentBlacklist);
            updateButtonState(currentBlacklist.has(currentProfileId));

            const managerList = document.querySelector('#blacklist-manager-list');
            const toggleBtn = document.querySelector('#toggle-blacklist-view-btn');
            if (managerList && toggleBtn) {
                renderBlacklistDisplay(managerList);
                updateToggleBtnText(toggleBtn, managerList);
            }
        });
        container.appendChild(blockButton);
    };

    const updateToggleBtnText = (btn, listElement) => {
        const count = getBlacklist().size;
        const isHidden = listElement.style.display === 'none';
        btn.textContent = `${isHidden ? '显示' : '隐藏'}列表 (${count}个)`;
    };

    const renderBlacklistDisplay = (targetElement) => {
        const blacklist = getBlacklist();
        targetElement.innerHTML = '';
        if (blacklist.size === 0) {
            targetElement.textContent = '黑名单为空。';
            return;
        }
        blacklist.forEach(id => {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; justify-content: space-between; padding: 2px 5px; border-bottom: 1px solid #eee;';
            item.innerHTML = `
                <a href="/profile/${id}" target="_blank" style="color: #337ab7;">${id}</a>
                <button data-id="${id}" class="remove-id-btn" style="cursor: pointer; color: red; background: none; border: none; font-size: 12px;">[移除]</button>
            `;
            targetElement.appendChild(item);
        });
    };

    const createManagementUI = () => {
        if (document.querySelector('#blacklist-manager')) return;
        const footerThreadsBlock = document.querySelector('.footer__threads');
        if (!footerThreadsBlock) return;
        const targetContainer = footerThreadsBlock.closest('.block');
        if (!targetContainer) return;

        const managerDiv = document.createElement('div');
        managerDiv.id = 'blacklist-manager';
        managerDiv.className = 'block block--padding block--margin';
        managerDiv.innerHTML = `
            <div class="block__content">
                <div class="text mb-2 text--inline text--bold">🚫 Iwara ID 黑名单管理面板</div>
                <button id="toggle-blacklist-view-btn" type="button" style="padding: 5px 10px; cursor: pointer; margin-bottom: 10px; width: 100%; text-align: left;"></button>
                <div id="blacklist-manager-list" style="display: none; margin-bottom: 15px; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; border-radius: 4px;"></div>
                <div style="margin-bottom: 15px;">
                    <button id="export-blacklist-btn" type="button" style="padding: 5px 10px; cursor: pointer;">导出列表</button>
                    <textarea id="blacklist-io-area" placeholder="导出数据将显示在此处，或在此处粘贴数据以导入" style="width: 100%; min-height: 60px; margin-top: 5px; font-size: 12px; padding: 5px; box-sizing: border-box;"></textarea>
                </div>
                <button id="import-blacklist-btn" type="button" style="padding: 5px 10px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">导入列表 (将覆盖现有列表并刷新)</button>
            </div>
        `;

        targetContainer.parentNode.insertBefore(managerDiv, targetContainer.nextSibling);

        const listDiv = managerDiv.querySelector('#blacklist-manager-list');
        const ioArea = managerDiv.querySelector('#blacklist-io-area');
        const exportBtn = managerDiv.querySelector('#export-blacklist-btn');
        const importBtn = managerDiv.querySelector('#import-blacklist-btn');
        const toggleBtn = managerDiv.querySelector('#toggle-blacklist-view-btn');

        updateToggleBtnText(toggleBtn, listDiv);

        toggleBtn.addEventListener('click', () => {
            const isHidden = listDiv.style.display === 'none';
            listDiv.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                renderBlacklistDisplay(listDiv);
            }
            updateToggleBtnText(toggleBtn, listDiv);
        });

        exportBtn.addEventListener('click', () => {
            const blacklist = getBlacklist();
            ioArea.value = JSON.stringify(Array.from(blacklist));
            ioArea.select();
            alert(`已生成 ${blacklist.size} 个ID，请手动复制文本框中的内容。`);
        });

        importBtn.addEventListener('click', () => {
            const data = ioArea.value.trim();
            if (!data) return alert('导入数据不能为空！');
            try {
                const parsed = JSON.parse(data);
                if (!Array.isArray(parsed)) throw new Error('数据格式不是一个有效的数组。');
                const newBlacklist = new Set(parsed.filter(item => typeof item === 'string'));
                saveBlacklist(newBlacklist);
                alert(`成功导入 ${newBlacklist.size} 个ID！页面即将刷新以应用新的黑名单。`);
                window.location.reload();
            } catch (e) {
                alert('导入失败！请检查数据是否为之前导出的正确JSON格式。\n错误信息: ' + e.message);
            }
        });

        listDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-id-btn')) {
                const idToRemove = e.target.dataset.id;
                if (idToRemove && confirm(`确定要将ID: ${idToRemove} 从黑名单中移除吗？`)) {
                    let blacklist = getBlacklist();
                    blacklist.delete(idToRemove);
                    saveBlacklist(blacklist);
                    renderBlacklistDisplay(listDiv);
                    updateToggleBtnText(toggleBtn, listDiv);
                }
            }
        });
    };

    const observer = new MutationObserver(() => {
        hideBlacklistedWorks();
        hideBlacklistedComments();
        addBlockButton();
        createManagementUI();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();