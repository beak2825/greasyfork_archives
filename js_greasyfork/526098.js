// ==UserScript==
// @name         主题/日志/条目讨论收藏到日志
// @version      1.5
// @author       age_anime
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @description  添加收藏按钮，自动将主题帖、日志或条目讨论收藏到所选日志。
// @license       MIT
// @namespace https://greasyfork.org/users/1426310
// @downloadURL https://update.greasyfork.org/scripts/526098/%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%E6%9D%A1%E7%9B%AE%E8%AE%A8%E8%AE%BA%E6%94%B6%E8%97%8F%E5%88%B0%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/526098/%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%E6%9D%A1%E7%9B%AE%E8%AE%A8%E8%AE%BA%E6%94%B6%E8%97%8F%E5%88%B0%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //1.5版本说明：
    //①重构脚本，解耦了一些功能，方便后续修改
    //②增加了多日志多收藏夹功能
    //③增加了收藏条目讨论的功能
    const BASE_URL = location.hostname;
    const path = location.pathname;
    const LS_KEY_TARGET_MAP = 'UserTargetBlogID';
    const LS_KEY_CACHE = 'UserConIDT';
    
    let TARGET_MAP = loadTargetMap();
    let UserConIDT = loadUserConIDT();
    let dropdownEl = null, modifyBtnEl = null, dropdownOpen = false;

    function loadTargetMap() {
        let raw = localStorage.getItem(LS_KEY_TARGET_MAP);
        if (!raw || raw === '填完整日志链接') return saveTargetMap({});
        if (/^\d+$/.test(raw)) return saveTargetMap({[raw]: true});
        try { return JSON.parse(raw) || saveTargetMap({}); } catch (_) { return saveTargetMap({}); }
    }

    function loadUserConIDT() {
        let raw = localStorage.getItem(LS_KEY_CACHE);
        if (!raw) return {};
        
        try {
            const data = JSON.parse(raw);
            if (data && typeof data === 'object' && !Object.values(data).some(v => typeof v === 'object')) {
                const migrated = {};
                for (const blogId in TARGET_MAP) {
                    migrated[blogId] = {};
                    for (const key in data) {
                        if (data[key]) migrated[blogId][key] = true;
                    }
                }
                localStorage.setItem(LS_KEY_CACHE, JSON.stringify(migrated));
                return migrated;
            }
            return data || {};
        } catch (_) {
            return {};
        }
    }

    function saveTargetMap(map = TARGET_MAP) {
        localStorage.setItem(LS_KEY_TARGET_MAP, JSON.stringify(TARGET_MAP = map));
        return map;
    }

    function saveUserConIDT() {
        localStorage.setItem(LS_KEY_CACHE, JSON.stringify(UserConIDT));
    }

    function getSelectedBlogId() {
        for (const id in TARGET_MAP) if (TARGET_MAP[id]) return id;
        return '';
    }

    function setSelectedBlogId(id) {
        const next = {};
        for (const key in TARGET_MAP) next[key] = false;
        next[id] = true;
        saveTargetMap(next);
        
        if (id && !UserConIDT[id]) {
            UserConIDT[id] = {};
            saveUserConIDT();
        }
    }

    function addOrUpdateId(id, selected = false) {
        if (!id || !/^\d+$/.test(id)) return;
        if (!(id in TARGET_MAP)) {
            TARGET_MAP[id] = !!selected;
            if (selected) for (const k in TARGET_MAP) if (k !== id) TARGET_MAP[k] = false;
            if (!UserConIDT[id]) {
                UserConIDT[id] = {};
                saveUserConIDT();
            }
        } else if (selected) {
            for (const k in TARGET_MAP) TARGET_MAP[k] = false;
            TARGET_MAP[id] = true;
        }
        saveTargetMap();
    }

    function deleteId(id) {
        if (id in TARGET_MAP) {
            const wasSelected = !!TARGET_MAP[id];
            delete TARGET_MAP[id];
            if (UserConIDT[id]) {
                delete UserConIDT[id];
                saveUserConIDT();
            }
            saveTargetMap();
            if (wasSelected && Object.keys(TARGET_MAP)[0]) setSelectedBlogId(Object.keys(TARGET_MAP)[0]);
        }
    }

    function addCollectButton() {
        const header = document.querySelector('#header') || document.querySelector('#pageHeader h1');
        if (!header || document.querySelector('#bangumi-collect-buttons')) return;

        const btnContainer = document.createElement('div');
        btnContainer.id = 'bangumi-collect-buttons';
        btnContainer.style = 'display:inline-flex;align-items:center;gap:8px;margin-left:10px;position:relative';

        const postId = getPostIdFromUrl();
        const isBlog = path.startsWith('/blog/');
        const isSubjectTopic = path.startsWith('/subject/topic/');
        const storageKey = isBlog ? `blog${postId}` : isSubjectTopic ? `st${postId}` : postId;
        const selectedBlogId = getSelectedBlogId();
        const isCollected = selectedBlogId && UserConIDT[selectedBlogId]?.[storageKey];
        const buttonText = isCollected ? '🔴 再次收藏' : '⭐ 收藏页面';

        const collectBtn = createButton(buttonText, handleCollect);
        modifyBtnEl = createButton('修改收藏地址', handleModifyLogToggle);
        const openLogBtn = createButton('打开收藏地址', handleOpenLog);

        btnContainer.append(collectBtn, modifyBtnEl, openLogBtn);
        header.parentNode.insertBefore(btnContainer, header.nextSibling);

        dropdownEl = buildDropdown();
        btnContainer.appendChild(dropdownEl);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style = 'padding:2px 6px;font-size:12px;background:transparent;border:1px solid #ccc;border-radius:3px;cursor:pointer';
        button.style.color = document.documentElement.getAttribute('data-theme') === 'dark' ? '#cccccc' : '#000000';
        button.addEventListener('click', onClick);
        return button;
    }

    function buildDropdown() {
        const wrap = document.createElement('div');
        wrap.id = 'bangumi-collect-dropdown';
        wrap.style = `position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:4px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);font-size:12px;z-index:9999;display:none;user-select:none;width:${Math.max(160, Math.ceil((modifyBtnEl?.getBoundingClientRect?.().width || 80) * 2))}px`;
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        wrap.style.background = isDark ? '#333' : '#f2f2f2';
        wrap.style.border = isDark ? '1px solid #444' : '1px solid #d0d0d0';

        const list = document.createElement('div');
        list.style = 'max-height:360px;overflow-y:auto';
        wrap.appendChild(list);

        function renderRows() {
            list.innerHTML = '';
            const ids = Object.keys(TARGET_MAP);
            if (!ids.length) {
                const empty = document.createElement('div');
                empty.textContent = '无目录';
                empty.style = `padding:8px;color:${isDark ? '#999' : '#666'}`;
                list.appendChild(empty);
            } else {
                ids.forEach((id, idx) => {
                    list.appendChild(createRow(id, TARGET_MAP[id]));
                    if (idx < ids.length - 1) list.appendChild(makeSeparator());
                });
            }
            list.appendChild(makeSeparator());
            const addRow = document.createElement('div');
            addRow.style = `display:flex;align-items:center;justify-content:center;padding:6px 8px;cursor:pointer;color:${isDark ? '#ccc' : '#000'}`;
            addRow.textContent = '+';
            addRow.title = '新增目录';
            addRow.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = createRow('', false, true);
                const sep = makeSeparator();
                list.insertBefore(sep, addRow);
                list.insertBefore(row, sep);
                row.querySelector('input[data-edit="id"]')?.focus();
            });
            list.appendChild(addRow);
        }

        function makeSeparator() {
            const hr = document.createElement('div');
            hr.style = `height:1px;background:${isDark ? '#444' : '#ddd'};margin:0`;
            return hr;
        }

        function createRow(id, selected, editMode = false) {
            const row = document.createElement('div');
            row.style = `display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;cursor:pointer;background:${
                selected ? (isDark ? '#444' : '#e6e6e6') : (isDark ? '#333' : '#f2f2f2')
            }`;

            const left = document.createElement('div');
            left.style = 'flex:1;min-width:0;display:flex;align-items:center;gap:6px';

            const idBox = document.createElement('span');
            idBox.textContent = id || '(新建)';
            idBox.style = `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${isDark ? '#ccc' : '#000'}`;
            if (selected) idBox.style.fontWeight = '700';

            const right = document.createElement('div');
            right.style = 'display:flex;align-items:center;gap:8px';

            const editBtn = document.createElement('span');
            editBtn.textContent = '✎';
            editBtn.title = '编辑ID';
            editBtn.style = `cursor:pointer;color:${isDark ? '#ccc' : '#000'}`;

            const delBtn = document.createElement('span');
            delBtn.textContent = '×';
            delBtn.title = '删除';
            delBtn.style = `cursor:pointer;color:${isDark ? '#ccc' : '#000'}`;

            row.addEventListener('click', e => {
                if (e.target === editBtn || e.target === delBtn || !id) return;
                setSelectedBlogId(id);
                renderRows();
            });

            function enterEdit() {
                if (row.querySelector('input[data-edit="id"]')) {
                    row.querySelector('input[data-edit="id"]').focus();
                    return;
                }
                const input = document.createElement('input');
                input.type = 'text';
                input.value = id || '';
                input.placeholder = '仅限数字ID';
                input.setAttribute('data-edit', 'id');
                input.style = `width:100%;font-size:12px;padding:2px 4px;border:${isDark ? '1px solid #555' : '1px solid #ccc'};border-radius:3px;background:${isDark ? '#444' : '#fff'};color:${isDark ? '#eee' : '#000'}`;
                input.addEventListener('click', e => e.stopPropagation());

                const commit = () => {
                    const val = input.value.trim();
                    if (val) {
                        if (!/^\d+$/.test(val)) return input.focus();
                        if (val !== id && TARGET_MAP[val]) {
                            if (id && id !== '(新建)' && TARGET_MAP[id] !== undefined) {
                                delete TARGET_MAP[id];
                                if (UserConIDT[id]) {
                                    UserConIDT[val] = UserConIDT[id];
                                    delete UserConIDT[id];
                                    saveUserConIDT();
                                }
                            }
                            setSelectedBlogId(val);
                        } else {
                            if (id && TARGET_MAP[id] !== undefined && id !== val) {
                                const wasSelected = !!TARGET_MAP[id];
                                delete TARGET_MAP[id];
                                if (UserConIDT[id]) {
                                    UserConIDT[val] = UserConIDT[id];
                                    delete UserConIDT[id];
                                    saveUserConIDT();
                                }
                                TARGET_MAP[val] = wasSelected;
                            } else if (!(val in TARGET_MAP)) TARGET_MAP[val] = false;
                            if (!getSelectedBlogId()) setSelectedBlogId(val);
                            else saveTargetMap();
                        }
                        saveTargetMap();
                        renderRows();
                    } else input.focus();
                };

                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') { e.preventDefault(); commit(); }
                    else if (e.key === 'Escape') { e.preventDefault(); renderRows(); }
                });
                input.addEventListener('blur', commit);
                left.replaceChildren(input);
            }

            editBtn.addEventListener('click', e => { e.stopPropagation(); enterEdit(); });
            delBtn.addEventListener('click', e => { e.stopPropagation(); if (id) { deleteId(id); renderRows(); } });

            left.appendChild(idBox);
            right.append(editBtn, delBtn);
            row.append(left, right);

            if (editMode) setTimeout(enterEdit, 0);
            return row;
        }

        renderRows();
        wrap.addEventListener('click', e => e.stopPropagation());
        return wrap;
    }

    function handleModifyLogToggle(e) {
        e.stopPropagation();
        if (!dropdownEl) return;
        if (!dropdownOpen) {
            dropdownEl.style.display = 'block';
            dropdownOpen = true;
            document.addEventListener('click', closeDropdownOnOutside, { capture: true, once: true });
        } else {
            dropdownEl.style.display = 'none';
            dropdownOpen = false;
        }
    }

    function closeDropdownOnOutside(ev) {
        if (!dropdownEl) return;
        if (modifyBtnEl && (modifyBtnEl === ev.target || modifyBtnEl.contains(ev.target))) {
            document.addEventListener('click', closeDropdownOnOutside, { capture: true, once: true });
            return;
        }
        if (dropdownEl === ev.target || dropdownEl.contains(ev.target)) {
            document.addEventListener('click', closeDropdownOnOutside, { capture: true, once: true });
            return;
        }
        dropdownEl.style.display = 'none';
        dropdownOpen = false;
    }

    function getAuthorInfo() {
        const postTopic = document.querySelector('.postTopic');
        if (postTopic) {
            const userId = postTopic.getAttribute('data-item-user');
            const userLink = postTopic.querySelector('.inner strong a');
            const usernameFromLink = userLink?.href?.split('/').pop();
            const displayName = userLink?.textContent?.trim();
            return { id: userId || usernameFromLink || '用户', name: displayName || '用户' };
        }

        if (path.startsWith('/blog/')) {
            const authorLink = document.querySelector('#pageHeader h1 a[href^="/user/"]') || document.querySelector('.blog_info a[href^="/user/"]');
            const authorUsername = authorLink ? authorLink.href.split('/').pop() : '用户';
            const authorDisplayName = authorLink ? authorLink.textContent.trim() : '用户';
            return { id: authorUsername, name: authorDisplayName };
        }

        return { id: '用户', name: '用户' };
    }

    function getPostIdFromUrl() {
        return path.split('/').pop();
    }

    function getSubjectInfo() {
        const subjectLink = document.querySelector('#subject_inner_info > a.avatar[href^="/subject/"]');
        const subjectId = subjectLink ? subjectLink.href.split('/')[4] : null;
        const subjectName = subjectLink ? subjectLink.title || subjectLink.textContent.trim() : null;
        return { id: subjectId, name: subjectName };
    }

    async function getBlogFormData(blogId) {
        try {
            if (!blogId) throw new Error('未选择日志ID');
            const response = await fetch(`https://${BASE_URL}/blog/${blogId}`);
            if (!response.ok) throw new Error('无法获取日志');
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const formhash = doc.querySelector('input[name="formhash"]')?.value;
            const lastview = doc.querySelector('input[name="lastview"]')?.value;
            if (!formhash || !lastview) throw new Error('找不到日志信息');
            return { formhash, lastview };
        } catch (error) {
            alert('日志无效，请在"修改收藏地址"中选择或新增有效ID！');
            console.error('获取日志失败:', error.message);
            throw error;
        }
    }

    async function submitComment(blogId, formData, content) {
        try {
            const response = await fetch(`https://${BASE_URL}/blog/entry/${blogId}/new_reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    formhash: formData.formhash,
                    lastview: formData.lastview,
                    content: content,
                    submit: '加上去',
                }),
            });
            return response.ok || response.status === 302;
        } catch (error) {
            console.error('提交失败:', error.message);
            return false;
        }
    }

    async function handleCollect() {
        try {
            const isBlog = path.startsWith('/blog/');
            const isSubjectTopic = path.startsWith('/subject/topic/');
            const postId = getPostIdFromUrl();
            const storageKey = isBlog ? `blog${postId}` : isSubjectTopic ? `st${postId}` : postId;
            const selectedBlogId = getSelectedBlogId();

            document.querySelectorAll('#bangumi-collect-buttons button').forEach(btn => {
                if (btn.innerHTML.includes('收藏页面') || btn.innerHTML.includes('再次收藏')) {
                    btn.innerHTML = '🔴 再次收藏';
                }
            });

            if (selectedBlogId) {
                if (!UserConIDT[selectedBlogId]) UserConIDT[selectedBlogId] = {};
                UserConIDT[selectedBlogId][storageKey] = true;
                saveUserConIDT();
            }

            let postUrl, postTitle, bbcode;
            const authorInfo = getAuthorInfo();
            const formData = await getBlogFormData(selectedBlogId);

            if (isBlog) {
                postUrl = location.href;
                const headerText = document.querySelector('#pageHeader h1').innerHTML;
                postTitle = (headerText.split('<br>')[1] || document.title).trim();
                const groupName = '日志';
                const postUrlLink = `https://${BASE_URL}/blog/${postId}`;
                const authorLink = `https://${BASE_URL}/user/${authorInfo.id}`;
                bbcode = `[url=${postUrlLink}]${postTitle}[/url]\n[${groupName}]  ${authorInfo.name}([url=${authorLink}]${authorInfo.id}[/url])`;
            } else if (isSubjectTopic) {
                postUrl = location.href;
                postTitle = document.querySelector('#header h1')?.textContent.trim() || document.title.replace(' - Bangumi', '');
                const subjectInfo = getSubjectInfo();
                const postUrlLink = `https://${BASE_URL}/subject/topic/${postId}`;
                const authorLink = `https://${BASE_URL}/user/${authorInfo.id}`;
                const subjectLink = subjectInfo.id ? `https://${BASE_URL}/subject/${subjectInfo.id}` : '';
                bbcode = `[url=${postUrlLink}]${postTitle}[/url]\n` + 
                         (subjectInfo.id ? `[[url=${subjectLink}]${subjectInfo.name}[/url]]  ` : '') + 
                         `${authorInfo.name}([url=${authorLink}]${authorInfo.id}[/url])`;
            } else {
                postUrl = location.href;
                postTitle = document.title.replace(' - Bangumi', '');
                const groupName = document.querySelector('#pageHeader h1 a')?.textContent.trim() || '未知小组';
                const postUrlLink = `https://${BASE_URL}/group/topic/${postId}`;
                const authorLink = `https://${BASE_URL}/user/${authorInfo.id}`;
                bbcode = `[url=${postUrlLink}]${postTitle}[/url]\n[${groupName}]  ${authorInfo.name}([url=${authorLink}]${authorInfo.id}[/url])`;
            }

            if (!await submitComment(selectedBlogId, formData, bbcode)) throw new Error('提交失败');
            console.log('收藏成功');
        } catch (err) {
            console.error('错误:', err.message || '操作失败');
        }
    }

    function handleOpenLog() {
        const id = getSelectedBlogId();
        if (!id) return alert('尚未选择收藏目录，请先点击"修改收藏地址"进行选择或新增。');
        window.open(`https://${BASE_URL}/blog/${id}`, '_blank');
    }

    function handleBlogPage() {
        const currentBlogId = path.split('/')[2];
        addCollectButton();

        if (currentBlogId && TARGET_MAP[currentBlogId] !== undefined) {
            const currentLinks = new Set();
            const extractedTopics = {};
            const extractedBlogs = {};
            const extractedSubjectTopics = {};

            document.querySelectorAll('.light_even.row.row_reply.clearit, .light_odd.row.row_reply.clearit').forEach(comment => {
                comment.querySelectorAll('.message a[href*="/group/topic/"]').forEach(link => {
                    const topicID = link.href.match(/group\/topic\/(\d+)/)?.[1];
                    if (topicID) {
                        currentLinks.add(topicID);
                        extractedTopics[topicID] = true;
                    }
                });
                comment.querySelectorAll('.message a[href*="/blog/"]').forEach(link => {
                    const blogID = link.href.match(/blog\/(\d+)/)?.[1];
                    if (blogID) {
                        const blogKey = `blog${blogID}`;
                        currentLinks.add(blogKey);
                        extractedBlogs[blogKey] = true;
                    }
                });
                comment.querySelectorAll('.message a[href*="/subject/topic/"]').forEach(link => {
                    const stID = link.href.match(/subject\/topic\/(\d+)/)?.[1];
                    if (stID) {
                        const stKey = `st${stID}`;
                        currentLinks.add(stKey);
                        extractedSubjectTopics[stKey] = true;
                    }
                });
            });

            if (!UserConIDT[currentBlogId]) UserConIDT[currentBlogId] = {};
            
            for (const key in UserConIDT[currentBlogId]) {
                if (!currentLinks.has(key)) {
                    delete UserConIDT[currentBlogId][key];
                }
            }
            
            Object.assign(UserConIDT[currentBlogId], extractedTopics, extractedBlogs, extractedSubjectTopics);
            saveUserConIDT();

            const notice = document.createElement('div');
            notice.textContent = `已提取 ${Object.keys(extractedTopics).length} 个主题、${Object.keys(extractedBlogs).length} 个日志、${Object.keys(extractedSubjectTopics).length} 个条目讨论`;
            notice.style = `position:fixed;top:20px;right:20px;padding:10px;background:#40E0D0;color:white;border-radius:5px;z-index:9999;box-shadow:0 2px 5px rgba(0,0,0,0.2)`;
            document.body.appendChild(notice);
            setTimeout(() => {
                notice.style.transition = 'opacity 1s';
                notice.style.opacity = '0';
                setTimeout(() => notice.remove(), 1000);
            }, 3000);
        }
    }

    if (path.startsWith('/group/topic/') || path.startsWith('/blog/') || path.startsWith('/subject/topic/')) {
        if (path.startsWith('/blog/')) {
            handleBlogPage();
        } else {
            addCollectButton();
        }
    }
})();