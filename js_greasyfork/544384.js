// ==UserScript==
// @name         HORUS
// @namespace    HORUS-DEADlock
// @version      1.0.0
// @description  디시인사이드 말머리 차단 기능
// @author       DEADlock
// @match        https://gall.dcinside.com/*/board/lists*
// @match        https://gall.dcinside.com/board/lists*
// @match        https://gall.dcinside.com/*/board/view*
// @match        https://gall.dcinside.com/board/view*
// @icon         https://i.imgur.com/LypOzKK.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      dcinside.com
// @downloadURL https://update.greasyfork.org/scripts/544384/HORUS.user.js
// @updateURL https://update.greasyfork.org/scripts/544384/HORUS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        mainModalId: 'horus-blocker-modal',
        mgmtModalId: 'horus-management-modal',
        settingsKey: 'horus_gallery_settings',
        darkThemeClass: 'horus-dark-theme',
    };

    const Utils = {
        getSettings: () => JSON.parse(GM_getValue(CONFIG.settingsKey, '{}')),
        saveSettings: (settings) => GM_setValue(CONFIG.settingsKey, JSON.stringify(settings)),
        getCurrentGalleryId: () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('id');
        },
        getCurrentGalleryName: () => {
            const selectors = ['.gall_name_inner .gall_name a', '.page_head h2 a', '.gall_name .text'];
            for (const selector of selectors) {
                const el = document.querySelector(selector);
                if (el) {
                    const clone = el.cloneNode(true);
                    clone.querySelectorAll('em, span').forEach(tag => tag.remove());
                    return clone.textContent.trim();
                }
            }
            return '알 수 없는 갤러리';
        },
        applyTheme: () => document.body.classList.toggle(CONFIG.darkThemeClass, !!document.getElementById('css-darkmode')),
        fetchAvailableFlairs: (galleryId) => {
            return new Promise((resolve, reject) => {
                const pathname = window.location.pathname;
                const boardIndex = pathname.indexOf('/board/');
                let galleryPath;

                if (boardIndex > 0) {
                    const prefix = pathname.substring(1, boardIndex);
                    galleryPath = `${prefix}/board`;
                } else {
                    galleryPath = 'board';
                }

                const listUrl = `https://gall.dcinside.com/${galleryPath}/lists/?id=${galleryId}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: listUrl,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const flairElements = doc.querySelectorAll('.list_array_option .inner ul li a');
                            const flairs = new Set([...flairElements].map(el => el.innerText.trim()).filter(Boolean));
                            resolve(flairs);
                        } else {
                            reject(new Error(`Failed to fetch flairs. Status: ${response.status}, URL: ${listUrl}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(`Network error while fetching flairs. URL: ${listUrl}`));
                    }
                });
            });
        }
    };

    const UI = {
        createModal: function({ id, title, bodyHTML, footerHTML }) {
            const existingModal = document.getElementById(id);
            if (existingModal) existingModal.remove();

            const modalWrapper = document.createElement('div');
            modalWrapper.innerHTML = `
                <div id="${id}" class="${id}">
                    <div class="horus-modal-header">
                        <span>${title}</span>
                        <button class="horus-modal-close-btn">&times;</button>
                    </div>
                    <div class="horus-modal-body">${bodyHTML}</div>
                    ${footerHTML ? `<div class="horus-modal-footer">${footerHTML}</div>` : ''}
                </div>
            `;
            const modalElement = modalWrapper.firstElementChild;
            document.body.appendChild(modalElement);
            Utils.applyTheme();
            return modalElement;
        },

        openGalleryManagementModal: function() {
            let idsToDelete = new Set();
            
            const renderList = () => {
                const settings = Utils.getSettings();
                const galleryIds = Object.keys(settings);
                const modal = document.getElementById(CONFIG.mgmtModalId);
                if (!modal) return;
                
                const description = modal.querySelector('.horus-modal-description');
                const galleryListDiv = modal.querySelector('.horus-gallery-list');
                const footer = modal.querySelector('.horus-modal-footer');

                description.textContent = galleryIds.length > 0 ? '설정을 초기화할 갤러리를 선택해 주세요' : '말머리 차단이 설정된 갤러리가 없습니다';

                if (galleryIds.length === 0) {
                    galleryListDiv.innerHTML = '';
                    if (footer) footer.style.display = 'none';
                    return;
                }

                if (footer) footer.style.display = 'flex';
                galleryListDiv.innerHTML = galleryIds.map(id => `<div class="horus-gallery-list-item ${idsToDelete.has(id) ? 'marked-for-deletion' : ''}" data-id="${id}"><span>${settings[id].name || '이름 정보 없음'}</span></div>`).join('');
                galleryListDiv.querySelectorAll('.horus-gallery-list-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const id = item.dataset.id;
                        idsToDelete.has(id) ? idsToDelete.delete(id) : idsToDelete.add(id);
                        item.classList.toggle('marked-for-deletion');
                        modal.querySelector('.horus-save-status').style.display = 'none';
                    });
                });
            };

            const bodyHTML = `<p class="horus-modal-description"></p><div class="horus-gallery-list"></div>`;
            const footerHTML = `<button class="horus-btn horus-remove-all-btn">모두 선택</button><div class="horus-button-group"><span class="horus-save-status"></span><button class="horus-btn horus-confirm-btn">저장</button></div>`;
            const modal = this.createModal({ id: CONFIG.mgmtModalId, title: '갤러리 설정 관리', bodyHTML, footerHTML });
            
            modal.querySelector('.horus-modal-close-btn').addEventListener('click', () => { if (idsToDelete.size > 0 && !confirm('저장되지 않은 변경사항이 있습니다\n계속하시겠습니까?')) return; modal.remove(); });
            modal.querySelector('.horus-remove-all-btn').addEventListener('click', () => { const allIds = Object.keys(Utils.getSettings()); allIds.length === idsToDelete.size ? idsToDelete.clear() : allIds.forEach(id => idsToDelete.add(id)); renderList(); });
            modal.querySelector('.horus-confirm-btn').addEventListener('click', () => {
                if (idsToDelete.size > 0) {
                    const currentSettings = Utils.getSettings();
                    idsToDelete.forEach(id => delete currentSettings[id]);
                    Utils.saveSettings(currentSettings);
                    idsToDelete.clear();
                    Core.run();
                    renderList();
                }
                modal.querySelector('.horus-save-status').textContent = '저장됨';
                modal.querySelector('.horus-save-status').style.display = 'inline';
            });
            renderList();
        },

        openSettingsModal: async function() {
            const galleryId = Utils.getCurrentGalleryId();
            if (!galleryId) {
                alert('갤러리 ID를 가져올 수 없습니다');
                return;
            }

            const loadingModal = this.createModal({
                id: CONFIG.mainModalId,
                title: 'HORUS 설정',
                bodyHTML: '<p style="padding: 40px; text-align: center;">말머리 목록을 불러오는 중입니다...</p>',
                footerHTML: ''
            });

            try {
                const availableFlairs = await Utils.fetchAvailableFlairs(galleryId);
                loadingModal.remove();

                const settings = Utils.getSettings();
                const blockedFlairs = new Set(settings[galleryId]?.blocked || []);

                const flairItemsHTML = [...availableFlairs].map(flair => `
                    <label class="horus-list-item">
                        <input type="checkbox" value="${flair}" ${!blockedFlairs.has(flair) ? 'checked' : ''}>
                        ${flair}
                    </label>
                `).join('');

                const labelText = availableFlairs.size > 0 ? '페이지에 노출할 말머리를 선택해 주세요' : '말머리가 존재하지 않습니다';

                const bodyHTML = `
                    <button class="horus-btn horus-manage-btn horus-manage-btn-top">갤러리 설정 관리</button>
                    <div class="horus-form-group">
                        <label class="horus-form-label normal-weight">${labelText}</label>
                        <div class="horus-flair-list">
                            ${flairItemsHTML}
                        </div>
                    </div>
                `;
                const footerHTML = `
                    <button class="horus-btn horus-reset-btn">기본값</button>
                    <div class="horus-button-group">
                        <span class="horus-save-status"></span>
                        <button class="horus-btn horus-confirm-btn">저장</button>
                    </div>
                `;

                const modal = this.createModal({ id: CONFIG.mainModalId, title: 'HORUS 설정', bodyHTML, footerHTML });
                let isDirty = false;
                const saveStatus = modal.querySelector('.horus-save-status');
                const markDirty = () => { isDirty = true; saveStatus.style.display = 'none'; };

                modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', markDirty));
                modal.querySelector('.horus-modal-close-btn').addEventListener('click', () => { if (isDirty && !confirm('저장되지 않은 변경사항이 있습니다\n계속하시겠습니까?')) return; modal.remove(); });
                modal.querySelector('.horus-manage-btn').addEventListener('click', () => { modal.remove(); this.openGalleryManagementModal(); });
                modal.querySelector('.horus-confirm-btn').addEventListener('click', () => {
                    const flairsToBlock = [...modal.querySelectorAll('input:not(:checked)')].map(input => input.value);
                    const currentSettings = Utils.getSettings();
                    const galleryName = Utils.getCurrentGalleryName() || settings[galleryId]?.name || galleryId;
                    if (flairsToBlock.length > 0) {
                        currentSettings[galleryId] = { name: galleryName, blocked: flairsToBlock };
                    } else {
                        delete currentSettings[galleryId];
                    }
                    Utils.saveSettings(currentSettings);
                    isDirty = false;
                    saveStatus.textContent = '저장됨';
                    saveStatus.style.display = 'inline';
                    Core.run();
                });
                modal.querySelector('.horus-reset-btn').addEventListener('click', () => { modal.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(input => input.checked = true); markDirty(); });

            } catch (error) {
                console.error('[HORUS]', error);
                loadingModal.querySelector('.horus-modal-body').innerHTML = `<p style="padding: 40px; text-align: center;">말머리 목록을 불러오지 못했습니다.</p>`;
            }
        },
    };

    const Core = {
        filterPosts: function() {
            const settings = Utils.getSettings();
            const galleryId = Utils.getCurrentGalleryId();
            const blockedFlairs = settings[galleryId]?.blocked || [];
            if (blockedFlairs.length === 0) return;

            const posts = document.querySelectorAll('tr.ub-content');
            posts.forEach(post => {
                const subjectCell = post.querySelector('td.gall_subject');
                let isBlocked = false;
                if (subjectCell) {
                    const displayedFlair = subjectCell.textContent.trim();
                    isBlocked = blockedFlairs.some(fullBlockedFlair =>
                        fullBlockedFlair.length <= 3 ?
                        displayedFlair.startsWith(fullBlockedFlair) :
                        displayedFlair.startsWith(fullBlockedFlair.substring(0, 3))
                    );
                }
                post.style.display = isBlocked ? 'none' : '';
            });
        },

        filterFlairDropdown: function() {
            const settings = Utils.getSettings();
            const galleryId = Utils.getCurrentGalleryId();

            if (!galleryId || !settings[galleryId]) {
                const allFlairItems = document.querySelectorAll('.list_array_option .inner ul li');
                allFlairItems.forEach(item => {
                    item.style.display = '';
                });
                return;
            };

            const blockedFlairs = new Set(settings[galleryId]?.blocked || []);
            const flairItems = document.querySelectorAll('.list_array_option .inner ul li');
            
            flairItems.forEach(item => {
                const flairAnchor = item.querySelector('a');
                if (flairAnchor) {
                    const flairText = flairAnchor.textContent.trim();
                    item.style.display = blockedFlairs.has(flairText) ? 'none' : '';
                }
            });
        },

        handlePostView: function() {
            const settings = Utils.getSettings();
            const galleryId = Utils.getCurrentGalleryId();
            const blockedFlairs = new Set(settings[galleryId]?.blocked || []);
            if (blockedFlairs.size === 0) return;

            const flairElement = document.querySelector('.gall_writer.ub-writer');
            if (!flairElement) return;

            const postFlair = flairElement.dataset.headtext;
            if (postFlair && blockedFlairs.has(postFlair)) {
                document.body.style.overflow = 'hidden';
                const notice = document.createElement('div');
                notice.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 10002; display: flex; justify-content: center; align-items: center; color: white; font-size: 20px; font-family: 'Malgun Gothic', sans-serif;">
                        차단된 말머리의 게시글입니다. 2초 후 목록으로 돌아갑니다.
                    </div>
                `;
                document.body.appendChild(notice);
                setTimeout(() => {
                    history.back();
                }, 2000);
            }
        },
        
        run: function() {
            if (window.location.href.includes('/board/view')) {
                this.handlePostView();
            }
            this.filterPosts();
            this.filterFlairDropdown();
        },

        init: function() {
            GM_addStyle(`
                :root { --font-main: 'Malgun Gothic', sans-serif; --font-size-base: 13px; --font-size-header: 16px; --color-bg: #fff; --color-border: #ddd; --color-border-light: #e9e9e9; --color-border-dark: #ccc; --color-text-primary: #333; --color-text-secondary: #777; --color-text-inverse: #fff; --color-btn-confirm-bg: #333; --color-btn-confirm-text: #fff; --color-btn-cancel-bg: #fff; --color-btn-cancel-text: #333; --color-input-bg: #fff; --color-input-text: #555; --color-row-hover: #f5f5f5; }
                body.${CONFIG.darkThemeClass} { --color-bg: #1f1f1f; --color-border: #4a4b4f; --color-border-light: #444549; --color-border-dark: #555; --color-text-primary: #ccc; --color-text-secondary: #aaa; --color-btn-confirm-bg: #eee; --color-btn-confirm-text: #333; --color-btn-cancel-bg: #444; --color-btn-cancel-text: #e8e8e8; --color-input-bg: #1f1f1f; --color-input-text: #ccc; --color-row-hover: #2a2b2d; }
                .${CONFIG.mainModalId}, .${CONFIG.mgmtModalId} { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; display: block; font-family: var(--font-main); background-color: var(--color-bg); border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: 0; box-shadow: 0 5px 25px rgba(0,0,0,.2); transition: background-color .3s, color .3s, border-color .3s; }
                .${CONFIG.mainModalId} { width: 400px; } .${CONFIG.mgmtModalId} { width: 500px; }
                .horus-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--color-border-light); font-size: var(--font-size-header); font-weight: 700; }
                .horus-modal-close-btn { background: transparent; border: none; font-size: 24px; font-weight: 700; color: var(--color-text-secondary); cursor: pointer; transition: color .2s; }
                .horus-modal-close-btn:hover { color: var(--color-text-primary); }
                .horus-modal-body { padding: 20px; padding-bottom: 10px; }
                .horus-modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; gap: 10px; }
                .horus-form-group { margin-bottom: 10px; }
                .horus-form-label { display: block; font-weight: 700; font-size: var(--font-size-base); color: var(--color-text-primary); margin-bottom: 8px; }
                .horus-form-label.normal-weight { font-weight: normal; }
                .horus-flair-list { display: block; max-height: 330px; overflow-y: auto; }
                .horus-list-item { display: flex; align-items: center; cursor: pointer; font-size: var(--font-size-base); padding: 8px 12px; border-bottom: 1px solid #f0f0f0; transition: background-color .2s; }
                body.${CONFIG.darkThemeClass} .horus-list-item { border-bottom-color: var(--color-border-light); }
                .horus-list-item:last-child { border-bottom: none; }
                .horus-list-item:hover { background-color: var(--color-row-hover); }
                .horus-list-item input[type="checkbox"] { margin-right: 10px; transform: scale(1.2); cursor: pointer; }
                .horus-btn { padding: 8px 25px; border: 1px solid var(--color-border-dark); border-radius: 4px; cursor: pointer; font-weight: 700; font-size: var(--font-size-base); text-align: center; transition: filter .2s, opacity .2s; }
                .horus-btn:hover:not(:disabled) { filter: brightness(.9); }
                .horus-confirm-btn { background-color: var(--color-btn-confirm-bg); color: var(--color-btn-confirm-text); border-color: var(--color-btn-confirm-bg); }
                body.${CONFIG.darkThemeClass} .horus-confirm-btn:hover:not(:disabled) { filter: brightness(.85); }
                .horus-reset-btn, .horus-manage-btn, .horus-remove-all-btn { background-color: var(--color-btn-cancel-bg); color: var(--color-btn-cancel-text); border-color: var(--color-border-dark); }
                body.${CONFIG.darkThemeClass} .horus-reset-btn:hover:not(:disabled), body.${CONFIG.darkThemeClass} .horus-manage-btn:hover:not(:disabled), body.${CONFIG.darkThemeClass} .horus-remove-all-btn:hover:not(:disabled) { filter: brightness(.8); }
                .horus-manage-btn-top { width: 100%; margin-bottom: 20px; }
                .horus-save-status { color: var(--color-text-secondary); font-size: var(--font-size-base); margin-right: auto; display: none; }
                .horus-button-group { display: flex; align-items: center; gap: 10px; }
                .horus-modal-description { font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: 15px; text-align: left; }
                .horus-gallery-list { display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; max-height: 340px; overflow-y: auto; }
                .horus-gallery-list-item { display: inline-flex; align-items: center; background-color: var(--color-row-hover); border: 1px solid var(--color-border-light); border-radius: 16px; padding: 5px 12px; font-size: var(--font-size-base); color: var(--color-text-primary); cursor: pointer; transition: background-color .2s, border-color .2s, opacity .2s; }
                .horus-gallery-list-item:hover { background-color: var(--color-border-light); }
                .horus-gallery-list-item.marked-for-deletion { opacity: 0.6; text-decoration: line-through; }
            `);

            GM_registerMenuCommand('말머리 설정', UI.openSettingsModal.bind(UI));

            const themeObserver = new MutationObserver(Utils.applyTheme);
            themeObserver.observe(document.head, { childList: true });

            const mainObserver = new MutationObserver((mutations) => {
                const listContainer = document.querySelector('.list_wrap, .gall_list_wrap');
                if (listContainer && !listContainer.hasAttribute('data-horus-observed')) {
                    listContainer.setAttribute('data-horus-observed', 'true');
                    this.filterPosts();
                    const postListObserver = new MutationObserver(() => this.filterPosts());
                    postListObserver.observe(listContainer, { childList: true, subtree: true });
                }
            });

            mainObserver.observe(document.body, { childList: true, subtree: true });
            
            window.addEventListener('load', () => {
                Utils.applyTheme();
                this.run();
            });
        }
    };

    Core.init();

})();