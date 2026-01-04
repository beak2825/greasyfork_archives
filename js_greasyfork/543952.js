// ==UserScript==
// @name         TikTok 达人标签管理器
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  【常用标签优化版】重构常用标签模块，实现更直观的增删和使用体验。
// @author       Gemini & You
// @match        https://affiliate.tiktok.com/seller/im*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543952/TikTok%20%E8%BE%BE%E4%BA%BA%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543952/TikTok%20%E8%BE%BE%E4%BA%BA%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const STORAGE_KEY = 'tiktok_creator_tags';
    const COMMON_TAGS_STORAGE_KEY = 'tiktok_common_tags';

    let tagsData = {};
    let commonTags = [];
    let lastProcessedUser = null;

    GM_addStyle(`
        .tag-manager-container { display: flex; align-items: center; justify-content: center; margin-top: 16px; margin-bottom: 16px; width: 100%; }
        .tm-section { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: normal; }
        .tm-title { font-weight: bold; color: #555; flex-shrink: 0; }
        .tm-tags-list, .tm-common-tags-list { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .tm-separator { border-left: 1px solid #ccc; height: 24px; margin: 0 12px; }
        .tm-tag-item { display: flex; align-items: center; background-color: #f0f2f5; border: 1px solid #e0e0e0; border-radius: 4px; padding: 4px 8px; font-size: 13px; }
        .tm-tag-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70px; margin-right: 6px; }
        .tm-tag-actions { display: flex; align-items: center; gap: 4px; }
        .tm-tag-actions button { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
        .tm-tag-actions svg { width: 16px; height: 16px; color: #888; }
        .tm-tag-actions svg:hover { color: #333; }
        .tm-add-btn { padding: 4px 10px; font-size: 13px; border-radius: 4px; cursor: pointer; border: none; background-color: #007bff; color: white; }
        .tm-add-btn:hover { background-color: #0056b3; }
        .tm-common-tag-chip { position: relative; background-color: #e2e3e5; color: #333; font-size: 12px; padding: 4px 18px 4px 8px; border-radius: 10px; cursor: pointer; }
        .tm-common-tag-chip:hover { background-color: #d1d3d6; }
        .tm-common-tag-delete { position: absolute; top: 1px; right: 4px; background: none; border: none; font-size: 16px; font-weight: bold; color: #999; cursor: pointer; padding: 0; line-height: 1; }
        .tm-common-tag-delete:hover { color: black; }
        .tm-add-common-btn { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; font-size: 16px; border-radius: 50%; cursor: pointer; border: 1px solid #007bff; background-color: #f0f8ff; color: #007bff; }
        .tm-add-common-btn:hover { background-color: #dbebff; }
        .list-tag-container { margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; padding-left: 52px; }
        .list-tag-chip { font-size: 11px; color: #white; background-color: #1890ff; padding: 2px 6px; border-radius: 4px; white-space: nowrap; max-width: 60px; overflow: hidden; text-overflow: ellipsis; display: inline-block; }
    `);

    async function loadData() {
        const storedTags = await GM_getValue(STORAGE_KEY, "{}");
        const storedCommonTags = await GM_getValue(COMMON_TAGS_STORAGE_KEY, "[]");
        try {
            tagsData = JSON.parse(storedTags);
            commonTags = JSON.parse(storedCommonTags);
            if (commonTags.length === 0) {
                commonTags = ['待联系', '已寄样', '待出视频', '已完成'];
                await saveCommonTags();
            }
        } catch (e) { tagsData = {}; commonTags = []; }
    }
    async function saveTags() { await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData)); }
    async function saveCommonTags() { await GM_setValue(COMMON_TAGS_STORAGE_KEY, JSON.stringify(commonTags)); }
    function getTagsForUser(username) { return tagsData[username] || []; }

    function renderTagManager(container, username) {
        const userTags = getTagsForUser(username);
        container.innerHTML = `<div class="tm-section" id="tm-user-section"><span class="tm-title">用户标签:</span><div class="tm-tags-list"></div></div><div class="tm-separator"></div><div class="tm-section" id="tm-common-section"><span class="tm-title">常用:</span><div class="tm-common-tags-list"></div></div>`;
        const userList = container.querySelector('.tm-tags-list');
        const commonList = container.querySelector('.tm-common-tags-list');
        userTags.forEach((tag, index) => {
            const tagItem = document.createElement('div');
            tagItem.className = 'tm-tag-item';
            const tagText = document.createElement('span');
            tagText.className = 'tm-tag-text';
            tagText.textContent = tag;
            tagText.title = tag;
            const actions = document.createElement('div');
            actions.className = 'tm-tag-actions';
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '✏️';
            editBtn.title = '编辑';
            editBtn.onclick = () => editTag(username, index);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h56.4l64.2 624.4c2.9 28.1 26.6 49.6 54.8 49.6h373.2c28.2 0 51.9-21.5 54.8-49.6L795.6 328H856c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM384 176h256v80H384v-80zM768.3 888H255.7L200.2 328h623.5L768.3 888z"></path><path d="M456 424h48v352h-48zM624 424h-48v352h48z"></path></svg>`;
            deleteBtn.title = '删除';
            deleteBtn.onclick = () => deleteTag(username, index);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            tagItem.appendChild(tagText);
            tagItem.appendChild(actions);
            userList.appendChild(tagItem);
        });
        const addBtn = document.createElement('button');
        addBtn.className = 'tm-add-btn';
        addBtn.textContent = '+ Tag';
        addBtn.onclick = () => addTag(username);
        userList.appendChild(addBtn);
        commonTags.forEach((tag, index) => {
            const chip = document.createElement('div');
            chip.className = 'tm-common-tag-chip';
            chip.title = `点击添加标签: ${tag}`;
            const textSpan = document.createElement('span');
            textSpan.textContent = tag;
            textSpan.onclick = () => addTagFromCommon(username, tag);
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'tm-common-tag-delete';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = `删除常用标签: ${tag}`;
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteCommonTag(index); };
            chip.appendChild(textSpan);
            chip.appendChild(deleteBtn);
            commonList.appendChild(chip);
        });
        const addCommonBtn = document.createElement('button');
        addCommonBtn.className = 'tm-add-common-btn';
        addCommonBtn.textContent = '+';
        addCommonBtn.title = '新增常用标签';
        addCommonBtn.onclick = addCommonTag;
        commonList.appendChild(addCommonBtn);
    }

    function renderTagsInList() {
        const contactCards = document.querySelectorAll('.contactCard-wsHws4');
        contactCards.forEach(card => {
            const usernameElement = card.querySelector('.uname-SzeGdi');
            if (!usernameElement) return;
            const username = usernameElement.innerText.trim();
            const tags = getTagsForUser(username).slice(0, 2);
            const messageRow = card.querySelector('.messageRow-EeINvE');
            if (!messageRow) return;
            messageRow.querySelector('.list-tag-container')?.remove();
            if (tags.length > 0) {
                const container = document.createElement('div');
                container.className = 'list-tag-container';
                tags.forEach(tag => {
                    const chip = document.createElement('span');
                    chip.className = 'list-tag-chip';
                    chip.textContent = tag;
                    chip.title = tag;
                    container.appendChild(chip);
                });
                messageRow.appendChild(container);
            }
        });
    }

    async function addTag(username) {
        const newTag = prompt("请输入新标签 (最多25个字):");
        if (newTag && newTag.trim() !== "") {
            const tag = newTag.trim().slice(0, 25);
            if (!tagsData[username]) tagsData[username] = [];
            tagsData[username].push(tag);
            await saveTags();
            lastProcessedUser = null;
        }
    }
    async function editTag(username, index) {
        const oldTag = tagsData[username][index];
        const newTag = prompt("请修改标签内容 (最多25个字):", oldTag);
        if (newTag && newTag.trim() !== "" && newTag.trim() !== oldTag) {
            tagsData[username][index] = newTag.trim().slice(0, 25);
            await saveTags();
            lastProcessedUser = null;
        }
    }
    async function deleteTag(username, index) {
        if (confirm(`确定要删除标签 "${tagsData[username][index]}" 吗?`)) {
            tagsData[username].splice(index, 1);
            await saveTags();
            lastProcessedUser = null;
        }
    }
    async function addTagFromCommon(username, tag) {
        if (!tagsData[username]) tagsData[username] = [];
        if (tagsData[username].includes(tag)) { alert(`用户 [${username}] 已有此标签。`); return; }
        tagsData[username].push(tag);
        await saveTags();
        lastProcessedUser = null;
    }
    async function addCommonTag() {
        const newCommonTag = prompt("请输入要新增的常用标签：");
        if (newCommonTag && newCommonTag.trim() !== "") {
            commonTags.push(newCommonTag.trim().slice(0,25));
            await saveCommonTags();
            lastProcessedUser = null;
        }
    }
    async function deleteCommonTag(index) {
        if (confirm(`确定要从常用标签库中删除 "${commonTags[index]}" 吗?`)) {
            commonTags.splice(index, 1);
            await saveCommonTags();
            lastProcessedUser = null;
        }
    }

    async function main() {
        await loadData();
        const userInfoContainer = document.querySelector('div[data-e2e="bf0b46ee-68f1-0118"]');
        if (userInfoContainer) {
            const usernameElement = document.querySelector('[data-e2e="4e0becc3-a040-a9d2"]');
            if (usernameElement) {
                const currentUsername = usernameElement.innerText.trim();
                if (currentUsername !== lastProcessedUser) {
                    lastProcessedUser = currentUsername;
                    document.querySelector('.tag-manager-container')?.remove();
                    const panel = document.createElement('div');
                    panel.className = 'tag-manager-container';
                    userInfoContainer.insertAdjacentElement('afterend', panel);
                    renderTagManager(panel, currentUsername);
                }
            }
        } else {
            if (lastProcessedUser !== null) {
                lastProcessedUser = null;
                document.querySelector('.tag-manager-container')?.remove();
            }
        }
        renderTagsInList();
    }

    setInterval(main, 1000);

})();