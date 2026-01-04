// ==UserScript==
// @name         Fab 库分类管理器
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  增强 Fab.com“我的库”页面的使用体验。它允许您创建自己的分类体系来管理日益增多的资产，并通过拖拽、点击等直观操作，轻松地将素材归类和筛选。
// @author       Gemini & Gemini
// @match        https://www.fab.com/library*
// @match        https://www.fab.com/*/library*
// @exclude      https://www.fab.com/library?q=*
// @exclude      https://www.fab.com/*/library?q=*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547243/Fab%20%E5%BA%93%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547243/Fab%20%E5%BA%93%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SECTION 0: I18N & LANGUAGE SUPPORT ---
    const i18n = {
        'en': {
            lang_code: 'en-US',
            quixel_link_text: "Browse Quixel Megascans",
            custom_categories_title: "Custom Categories",
            add_category_tooltip: "Add new category",
            show_all_button: "Show All",
            show_uncategorized_button: "Show Uncategorized",
            no_categories_placeholder: "No categories yet",
            rename_tooltip: "Rename",
            delete_tooltip: "Delete",
            delete_confirm: "Confirm?",
            new_category_placeholder: "Enter name and press Enter",
            set_category_tooltip: "Set Categories",
            toast_added_to: 'Added to "{categoryName}"',
            toast_removed_from: 'Removed from "{categoryName}"',
            toast_already_in: 'Already in "{categoryName}"',
            toast_error_category_exists: 'Error: Category "{name}" already exists.',
            toast_category_added: 'Category "{name}" was added.',
            toast_renamed_to: 'Renamed to "{newName}".',
            toast_category_deleted: 'Category "{name}" was deleted.',
            default_category_1: "Character Assets (Demo)",
            default_category_2: "Environment Props (Demo)",
            default_category_3: "Textures & Materials (Demo)",
        },
        'zh-cn': {
            lang_code: 'zh-CN',
            quixel_link_text: "浏览 Quixel Megascans",
            custom_categories_title: "自定义分类",
            add_category_tooltip: "添加分类",
            show_all_button: "显示全部",
            show_uncategorized_button: "显示未分类",
            no_categories_placeholder: "暂无分类",
            rename_tooltip: "重命名",
            delete_tooltip: "删除",
            delete_confirm: "确认?",
            new_category_placeholder: "输入分类名后按回车",
            set_category_tooltip: "设置分类",
            toast_added_to: '已添加到 "{categoryName}"',
            toast_removed_from: '已从 "{categoryName}" 中移除',
            toast_already_in: '"{categoryName}" 分类已存在',
            toast_error_category_exists: '错误：分类 "{name}" 已存在。',
            toast_category_added: '分类 "{name}" 已添加。',
            toast_renamed_to: '已重命名为 "{newName}"。',
            toast_category_deleted: '分类 "{name}" 已删除。',
            default_category_1: "角色资产 (测试)",
            default_category_2: "环境道具 (测试)",
            default_category_3: "贴图材质 (测试)",
        },
        'ja': {
            lang_code: 'ja-JP',
            quixel_link_text: "Quixel Megascansを閲覧",
            custom_categories_title: "カスタムカテゴリ",
            add_category_tooltip: "新しいカテゴリを追加",
            show_all_button: "すべて表示",
            show_uncategorized_button: "未分類を表示",
            no_categories_placeholder: "カテゴリがありません",
            rename_tooltip: "名前を変更",
            delete_tooltip: "削除",
            delete_confirm: "確認しますか？",
            new_category_placeholder: "名前を入力してEnter",
            set_category_tooltip: "カテゴリを設定",
            toast_added_to: '"{categoryName}" に追加しました',
            toast_removed_from: '"{categoryName}" から削除しました',
            toast_already_in: 'すでに "{categoryName}" に存在します',
            toast_error_category_exists: 'エラー：カテゴリ "{name}" はすでに存在します。',
            toast_category_added: 'カテゴリ "{name}" を追加しました。',
            toast_renamed_to: '"{newName}" に名前を変更しました。',
            toast_category_deleted: 'カテゴリ "{name}" を削除しました。',
            default_category_1: "キャラクターアセット (デモ)",
            default_category_2: "環境プロップ (デモ)",
            default_category_3: "テクスチャとマテリアル (デモ)",
        },
        'ko': {
            lang_code: 'ko-KR',
            quixel_link_text: "Quixel Megascans 찾아보기",
            custom_categories_title: "사용자 지정 카테고리",
            add_category_tooltip: "새 카테고리 추가",
            show_all_button: "모두 보기",
            show_uncategorized_button: "미분류 보기",
            no_categories_placeholder: "카테고리가 없습니다",
            rename_tooltip: "이름 바꾸기",
            delete_tooltip: "삭제",
            delete_confirm: "확인?",
            new_category_placeholder: "이름 입력 후 Enter",
            set_category_tooltip: "카테고리 설정",
            toast_added_to: '"{categoryName}"에 추가됨',
            toast_removed_from: '"{categoryName}"에서 제거됨',
            toast_already_in: '이미 "{categoryName}"에 있습니다',
            toast_error_category_exists: '오류: 카테고리 "{name}"이(가) 이미 존재합니다.',
            toast_category_added: '카테고리 "{name}"이(가) 추가되었습니다.',
            toast_renamed_to: '"{newName}"(으)로 이름이 변경되었습니다.',
            toast_category_deleted: '카테고리 "{name}"이(가) 삭제되었습니다.',
            default_category_1: "캐릭터 에셋 (데모)",
            default_category_2: "환경 소품 (데모)",
            default_category_3: "텍스처 및 재료 (데모)",
        }
    };

    function getLangInfo() {
        const path = window.location.pathname;
        const match = path.match(/^\/([a-z]{2}(-[a-z]{2})?)\//);
        const langCode = match ? match[1] : 'en';
        const translationKey = i18n.hasOwnProperty(langCode) ? langCode : 'en';
        const urlPrefix = (langCode === 'en') ? '' : `${langCode}/`;
        return { key: translationKey, prefix: urlPrefix };
    }

    const langInfo = getLangInfo();
    const currentLangKey = langInfo.key;

    function t(key, replacements = {}) {
        let text = i18n[currentLangKey]?.[key] || i18n['en']?.[key] || key;
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

    // --- SECTION 1: DATA & STATE MANAGEMENT ---
    let state = { categories: [], itemAssignments: {}, activeFilter: null };
    let draggedCategory = null;
    const STORAGE_KEYS = { CATEGORIES: 'fab_custom_categories_storage', ASSIGNMENTS: 'fab_item_assignments_storage' };
    function loadData() {
        state.categories = GM_getValue(STORAGE_KEYS.CATEGORIES, []);
        state.itemAssignments = GM_getValue(STORAGE_KEYS.ASSIGNMENTS, {});
        if (state.categories.length === 0) {
            state.categories = [
                { id: '1', name: t('default_category_1') },
                { id: '2', name: t('default_category_2') },
                { id: '3', name: t('default_category_3') }
            ];
            saveData();
        }
    }
    function saveData() { GM_setValue(STORAGE_KEYS.CATEGORIES, state.categories); GM_setValue(STORAGE_KEYS.ASSIGNMENTS, state.itemAssignments); }
    function showToast(message, isError = false) { const existingToast = document.getElementById('fab-custom-toast'); if (existingToast) existingToast.remove(); const toast = document.createElement('div'); toast.id = 'fab-custom-toast'; toast.textContent = message; toast.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 12px 20px; border-radius: 6px; color: white; font-weight: 500; background-color: ${isError ? '#D32F2F' : '#43A047'}; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; opacity: 0; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);`; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '1'; toast.style.bottom = '30px'; }, 10); setTimeout(() => { toast.style.opacity = '0'; toast.style.bottom = '20px'; setTimeout(() => toast.remove(), 300); }, 3000); }

    // --- SECTION 2: LEFT PANEL UI & LOGIC ---
    function handleCategoryDragStart(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') { e.preventDefault(); return; } draggedCategory = e.currentTarget; e.dataTransfer.setData('text/plain--fab-category-id', draggedCategory.dataset.categoryId); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => draggedCategory.classList.add('dragging-category'), 0); }
    function handleCategoryDragEnd(e) { if (!draggedCategory) return; draggedCategory.classList.remove('dragging-category'); document.querySelectorAll('.custom-category-item').forEach(item => { item.classList.remove('drop-indicator-top', 'drop-indicator-bottom'); }); draggedCategory = null; }
    function handleCategoryDragOver(e) { e.preventDefault(); const target = e.currentTarget; if (!draggedCategory || target === draggedCategory) return; const rect = target.getBoundingClientRect(); const midY = rect.top + rect.height / 2; if (e.clientY < midY) { target.classList.add('drop-indicator-top'); target.classList.remove('drop-indicator-bottom'); } else { target.classList.add('drop-indicator-bottom'); target.classList.remove('drop-indicator-top'); } }
    function handleCategoryDragEnter(e) { e.preventDefault(); const target = e.currentTarget; if (!draggedCategory || target === draggedCategory) return; target.classList.add('drag-over-sort'); }
    function handleCategoryDragLeave(e) { const target = e.currentTarget; if (!draggedCategory || target === draggedCategory) return; target.classList.remove('drop-indicator-top', 'drop-indicator-bottom', 'drag-over-sort'); }
    function handleCategoryDrop(e) { e.preventDefault(); e.stopPropagation(); const dropTarget = e.currentTarget; if (!draggedCategory || dropTarget === draggedCategory) return; const draggedId = e.dataTransfer.getData('text/plain--fab-category-id'); if (!draggedId) return; const targetId = dropTarget.dataset.categoryId; const draggedIndex = state.categories.findIndex(c => c.id === draggedId); const targetIndex = state.categories.findIndex(c => c.id === targetId); if (draggedIndex === -1 || targetIndex === -1) return; const [draggedItem] = state.categories.splice(draggedIndex, 1); const newTargetIndex = state.categories.findIndex(c => c.id === targetId); const rect = dropTarget.getBoundingClientRect(); const midY = rect.top + rect.height / 2; if (e.clientY < midY) { state.categories.splice(newTargetIndex, 0, draggedItem); } else { state.categories.splice(newTargetIndex + 1, 0, draggedItem); } saveData(); renderCategoryList(); }
    function renderCategoryList() {
        const listContainer = document.getElementById('custom-category-list-container');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        if (state.categories.length === 0) { listContainer.innerHTML = `<li class="custom-category-item-placeholder">${t('no_categories_placeholder')}</li>`; } else {
            state.categories.forEach(category => {
                const li = document.createElement('li'); li.className = 'custom-category-item'; li.dataset.categoryId = category.id; li.setAttribute('draggable', 'true'); if (state.activeFilter === category.id) li.classList.add('is-active-filter');
                const nameSpan = document.createElement('span'); nameSpan.className = 'category-name'; nameSpan.textContent = category.name; nameSpan.addEventListener('click', () => applyFilter(category.id));
                const actionsDiv = document.createElement('div'); actionsDiv.className = 'category-actions'; actionsDiv.innerHTML = `<button class="edit-btn" title="${t('rename_tooltip')}">✏️</button><button class="delete-btn" title="${t('delete_tooltip')}">🗑️</button>`;
                li.appendChild(nameSpan); li.appendChild(actionsDiv); listContainer.appendChild(li);
                actionsDiv.querySelector('.edit-btn').addEventListener('click', () => handleRenameCategory(category.id));
                actionsDiv.querySelector('.delete-btn').addEventListener('click', (e) => handleDeleteCategory(e, category.id));
                li.addEventListener('dragover', (e) => { e.preventDefault(); if(e.dataTransfer.types.includes('text/plain--fab-category-id')) return; li.classList.add('drag-over'); });
                li.addEventListener('dragleave', () => { li.classList.remove('drag-over'); });
                li.addEventListener('drop', (e) => { e.preventDefault(); if(e.dataTransfer.types.includes('text/plain--fab-category-id')) return; li.classList.remove('drag-over'); const itemId = e.dataTransfer.getData('text/plain'); const card = document.querySelector(`div[data-gm-item-id="${itemId}"]`); if (card) { const assignments = state.itemAssignments[itemId] || []; if (!assignments.includes(category.id)) { toggleItemCategory(card, category.id, false); showToast(t('toast_added_to', { categoryName: category.name })); } else { showToast(t('toast_already_in', { categoryName: category.name }), true); } } });
                li.addEventListener('dragstart', handleCategoryDragStart); li.addEventListener('dragend', handleCategoryDragEnd); li.addEventListener('dragenter', handleCategoryDragEnter); li.addEventListener('dragleave', handleCategoryDragLeave); li.addEventListener('dragover', handleCategoryDragOver); li.addEventListener('drop', handleCategoryDrop);
            });
        }
    }
    function createNewCategory(input) { const name = input.value.trim(); if (name) { if (state.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) { showToast(t('toast_error_category_exists', { name: name }), true); input.focus(); return; } state.categories.push({ id: Date.now().toString(), name: name }); saveData(); showToast(t('toast_category_added', { name: name })); } renderCategoryList(); }
    function handleRenameCategory(catId) { const li = document.querySelector(`.custom-category-item[data-category-id="${catId}"]`); const cat = state.categories.find(c => c.id === catId); if (!li || !cat) return; const oldName = cat.name; li.querySelector('.category-name').style.display = 'none'; const input = document.createElement('input'); input.type = 'text'; input.value = oldName; input.className = 'inline-category-input'; li.prepend(input); input.focus(); input.select(); const done = () => { const newName = input.value.trim(); if (newName && newName.toLowerCase() !== oldName.toLowerCase()) { if (state.categories.some(c => c.id !== catId && c.name.toLowerCase() === newName.toLowerCase())) { showToast(t('toast_error_category_exists', { name: newName }), true); input.focus(); return; } cat.name = newName; saveData(); showToast(t('toast_renamed_to', { newName: newName })); } renderCategoryList(); document.querySelectorAll('div[data-gm-item-id]').forEach(updateCardTag); }; input.addEventListener('keydown', (e) => { if (e.key === 'Enter') done(); }); input.addEventListener('blur', done); }
    function handleDeleteCategory(event, catId) { const btn = event.currentTarget; const cat = state.categories.find(c => c.id === catId); if (!cat) return; if (btn.classList.contains('confirm-delete')) { state.categories = state.categories.filter(c => c.id !== catId); Object.keys(state.itemAssignments).forEach(itemId => { state.itemAssignments[itemId] = state.itemAssignments[itemId].filter(id => id !== catId); if (state.itemAssignments[itemId].length === 0) { delete state.itemAssignments[itemId]; } }); saveData(); renderCategoryList(); showToast(t('toast_category_deleted', { name: cat.name })); document.querySelectorAll('div[data-gm-item-id]').forEach(updateCardTag); } else { btn.classList.add('confirm-delete'); btn.textContent = t('delete_confirm'); const timer = setTimeout(() => { btn.classList.remove('confirm-delete'); btn.textContent = '🗑️'; }, 3000); btn.onmouseleave = () => { clearTimeout(timer); btn.classList.remove('confirm-delete'); btn.textContent = '🗑️'; btn.onmouseleave = null; }; } }
    function handleAddCategory() { if (document.getElementById('new-category-input-li')) { document.querySelector('#new-category-input-li input').focus(); return; } const listContainer = document.getElementById('custom-category-list-container'); if (!listContainer) return; const placeholder = listContainer.querySelector('.custom-category-item-placeholder'); if (placeholder) placeholder.remove(); const li = document.createElement('li'); li.id = 'new-category-input-li'; li.className = 'custom-category-item'; const input = document.createElement('input'); input.type = 'text'; input.placeholder = t('new_category_placeholder'); input.className = 'inline-category-input'; li.appendChild(input); listContainer.prepend(li); input.focus(); input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { createNewCategory(this); } else if (e.key === 'Escape') { renderCategoryList(); } }); input.addEventListener('blur', function() { setTimeout(() => { renderCategoryList(); }, 100); }); }
    function injectLeftPanelUI() {
        if (document.getElementById('custom-categories-container')) return;
        const container = document.createElement('div');
        container.id = 'custom-categories-container';
        container.innerHTML = `
            <a id="quixel-link-btn" href="https://www.fab.com/${langInfo.prefix}sellers/Quixel" target="_blank">${t('quixel_link_text')}</a>
            <div class="fabkit-Stack-root fabkit-Stack--column">
                <h2 class="custom-categories-title">
                    <span>${t('custom_categories_title')}</span>
                    <span id="add-category-btn" title="${t('add_category_tooltip')}">+</span>
                </h2>
                <div id="custom-category-controls">
                    <button id="clear-filter-btn">${t('show_all_button')}</button>
                    <button id="uncategorized-filter-btn">${t('show_uncategorized_button')}</button>
                </div>
                <nav class="fabkit-TreeView-root">
                    <ul id="custom-category-list-container" class="custom-category-list"></ul>
                </nav>
            </div>`;
        document.body.appendChild(container);
        document.getElementById('add-category-btn').addEventListener('click', handleAddCategory);
        document.getElementById('clear-filter-btn').addEventListener('click', clearFilter);
        document.getElementById('uncategorized-filter-btn').addEventListener('click', applyUncategorizedFilter);
        renderCategoryList();
    }


    // --- SECTION 3: RIGHT PANEL & CARD LOGIC ---
    const clickOutsideMenuHandler = (e) => { const menu = document.querySelector('.gm-category-popup-menu'); if (menu && !menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', clickOutsideMenuHandler, true); } };
    function updateCardTag(card) { const itemId = card.dataset.gmItemId; const tag = card.querySelector('.gm-category-tag'); if (!tag || !itemId) return; const assignedCategoryIds = state.itemAssignments[itemId]; if (assignedCategoryIds && assignedCategoryIds.length > 0) { const assignedNames = assignedCategoryIds.map(id => state.categories.find(c => c.id === id)?.name).filter(Boolean).join(', '); tag.textContent = assignedNames; tag.style.display = 'block'; } else { tag.textContent = ''; tag.style.display = 'none'; } }
    function toggleItemCategory(card, categoryId, suppressToast = false) { const itemId = card.dataset.gmItemId; if (!itemId) return; if (!state.itemAssignments[itemId]) state.itemAssignments[itemId] = []; const assignments = state.itemAssignments[itemId]; const categoryIndex = assignments.indexOf(categoryId); const categoryName = state.categories.find(c => c.id === categoryId)?.name || ''; if (categoryIndex > -1) { assignments.splice(categoryIndex, 1); if (!suppressToast) showToast(t('toast_removed_from', { categoryName: categoryName })); } else { assignments.push(categoryId); if (!suppressToast) showToast(t('toast_added_to', { categoryName: categoryName })); } if (assignments.length === 0) delete state.itemAssignments[itemId]; saveData(); updateCardTag(card); const menu = document.querySelector('.gm-category-popup-menu'); if (menu) { const menuItem = menu.querySelector(`li[data-category-id="${categoryId}"]`); if (menuItem) menuItem.classList.toggle('is-checked'); } }
    function showCategoryPopupMenu(event, card) { event.stopPropagation(); const existingMenu = document.querySelector('.gm-category-popup-menu'); document.removeEventListener('click', clickOutsideMenuHandler, true); if (existingMenu) { existingMenu.remove(); return; } const menu = document.createElement('ul'); menu.className = 'gm-category-popup-menu'; const itemId = card.dataset.gmItemId; const assignedCategoryIds = state.itemAssignments[itemId] || []; state.categories.forEach(cat => { const li = document.createElement('li'); li.className = 'gm-popup-item'; li.dataset.categoryId = cat.id; if (assignedCategoryIds.includes(cat.id)) li.classList.add('is-checked'); li.innerHTML = `<span class="gm-popup-checkmark">✔️</span> ${cat.name}`; li.addEventListener('click', (e) => { e.stopPropagation(); toggleItemCategory(card, cat.id); }); menu.appendChild(li); }); document.body.appendChild(menu); const btnRect = event.currentTarget.getBoundingClientRect(); menu.style.left = `${btnRect.left}px`; menu.style.top = `${btnRect.bottom + 5}px`; setTimeout(() => { document.addEventListener('click', clickOutsideMenuHandler, true); }, 0); }
    function applyFilter(categoryId) { if (state.activeFilter === categoryId) { clearFilter(); return; } state.activeFilter = categoryId; renderCategoryList(); }
    function clearFilter() { state.activeFilter = null; renderCategoryList(); }
    function applyUncategorizedFilter() { state.activeFilter = 'uncategorized'; renderCategoryList(); }
    function runFilter() { const allCards = document.querySelectorAll('div[data-gm-item-id]'); const clearBtn = document.getElementById('clear-filter-btn'); const uncatBtn = document.getElementById('uncategorized-filter-btn'); if (clearBtn) clearBtn.classList.toggle('is-active-filter', state.activeFilter === null); if (uncatBtn) uncatBtn.classList.toggle('is-active-filter', state.activeFilter === 'uncategorized'); if (state.activeFilter === null) { allCards.forEach(card => card.style.display = ''); return; } if (state.activeFilter === 'uncategorized') { allCards.forEach(card => { const itemId = card.dataset.gmItemId; const isAssigned = state.itemAssignments[itemId] && state.itemAssignments[itemId].length > 0; card.style.display = isAssigned ? 'none' : ''; }); return; } allCards.forEach(card => { const itemId = card.dataset.gmItemId; const assignments = state.itemAssignments[itemId] || []; if (assignments.includes(state.activeFilter)) { card.style.display = ''; } else { card.style.display = 'none'; } }); }

    function hideQuixelPanel() {
        // 查找所有 href 中包含 "/sellers/Quixel" 的链接
        const quixelLinks = document.querySelectorAll('a[href*="/sellers/Quixel"]');

        quixelLinks.forEach(link => {
            // 忽略脚本自己生成的顶部按钮
            if (link.id === 'quixel-link-btn') return;

            // 向上查找侧边栏容器 (HAfmzF_H)
            const quixelPanel = link.closest('.HAfmzF_H');

            // 如果找到了面板且尚未隐藏，则隐藏它
            if (quixelPanel && quixelPanel.style.display !== 'none') {
                quixelPanel.style.display = 'none';
            }
        });
    }

    function findAndMarkCards() { document.querySelectorAll('div[class*="nTa5u2sc"]').forEach(card => { if (card.querySelector('a[href*="/listings/"]') && !card.dataset.gmProcessed) { card.dataset.gmProcessed = 'true'; const link = card.querySelector('a[href*="/listings/"]'); const itemId = link.href.split('/listings/')[1]; card.dataset.gmItemId = itemId; card.setAttribute('draggable', 'true'); card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', itemId); setTimeout(() => card.classList.add('is-dragging'), 0); }); card.addEventListener('dragend', () => { card.classList.remove('is-dragging'); }); const uiContainer = document.createElement('div'); uiContainer.className = 'gm-ui-container'; const tag = document.createElement('div'); tag.className = 'gm-category-tag'; const button = document.createElement('button'); button.className = 'gm-category-button'; button.title = t('set_category_tooltip'); button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>`; button.addEventListener('click', (e) => showCategoryPopupMenu(e, card)); uiContainer.appendChild(tag); uiContainer.appendChild(button); card.appendChild(uiContainer); updateCardTag(card); } }); runFilter(); }

    // --- SECTION 4: STYLES & INITIALIZATION ---
    function injectGlobalStyles() {
        if (document.getElementById('fab-categorizer-global-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'fab-categorizer-global-styles';
        styleSheet.textContent = `
            #custom-categories-container {
                position: fixed; top: 80px; bottom: 0; left: 10px; width: 280px; z-index: 0;
                background-color: transparent; border: none; box-shadow: none;
                padding: 10px; font-family: Inter, sans-serif; display: flex; flex-direction: column;
                pointer-events: none;
            }
            #custom-categories-container > * { pointer-events: auto; }
            #custom-categories-container .fabkit-Stack-root { flex: 1; display: flex; flex-direction: column; min-height: 0; }
            .fabkit-TreeView-root { flex: 1; overflow-y: auto; min-height: 0; }
            .custom-category-list { list-style: none; padding: 0; margin: 0; }
            #quixel-link-btn { display: block; text-align: center; margin-bottom: 10px; width: 100%; box-sizing: border-box; padding: 8px; background-color: var(--fab-palette-background-low, #2a2a2a); border: 1px solid var(--fab-palette-border, #333); color: var(--fab-palette-foreground-primary, #FFF); border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; font-size: 14px; }
            #quixel-link-btn:hover { background-color: #333; }
            .custom-categories-title { font-size: 0.875rem; font-weight: 700; color: var(--fab-palette-foreground-primary, #FFF); padding: 0 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
            #add-category-btn { cursor: pointer; color: var(--fab-palette-foreground-secondary, #AAA); font-size: 1.5rem; border-radius: 4px; transition: all 0.2s; line-height: 1; }
            #add-category-btn:hover { color: #FFF; background-color: #333; }
            #custom-category-controls { margin-bottom: 8px; display: flex; gap: 8px; }
            #custom-category-controls button { flex-grow: 1; padding: 8px; background-color: var(--fab-palette-background-low, #2a2a2a); border: 1px solid var(--fab-palette-border, #333); color: var(--fab-palette-foreground-primary, #FFF); border-radius: 4px; cursor: pointer; transition: all 0.2s; }
            #custom-category-controls button:hover { background-color: #333; }
            #custom-category-controls button.is-active-filter, .custom-category-item.is-active-filter { background-color: var(--fab-palette-primary-container, #004C99); font-weight: bold; border-color: var(--fab-palette-primary, #0078F2) !important; }
            .custom-category-item { color: var(--fab-palette-foreground-primary, #FFF); padding: 8px 10px; border-radius: 4px; min-height: 36px; display: flex; align-items: center; justify-content: space-between; transition: background-color 0.2s, outline 0.2s, border-top 0.2s, border-bottom 0.2s; border-top: 2px solid transparent; border-bottom: 2px solid transparent; }
            .custom-category-item .category-name { flex-grow: 1; cursor: pointer; }
            .custom-category-item:hover { background-color: var(--fab-palette-background-low, #2a2a2a); }
            .custom-category-item.drag-over { background-color: #004C99 !important; outline: 2px solid #0078F2; }
            .custom-category-item.dragging-category { opacity: 0.5; }
            .custom-category-item.drop-indicator-top { border-top: 2px solid #0078F2; }
            .custom-category-item.drop-indicator-bottom { border-bottom: 2px solid #0078F2; }
            .inline-category-input { width: 100%; background-color: #333; border: 1px solid #0078F2; color: #FFF; border-radius: 4px; padding: 5px 8px; outline: none; box-sizing: border-box; }
            .category-actions { display: none; }
            .custom-category-item:hover .category-actions { display: flex; }
            .category-actions button { background: none; border: none; cursor: pointer; margin-left: 8px; font-size: 16px; opacity: 0.6; transition: all 0.2s; padding: 0; }
            .category-actions button:hover { opacity: 1; }
            .delete-btn.confirm-delete { color: #D32F2F; font-size: 12px; font-weight: bold; width: 50px; }
            div[class*="nTa5u2sc"] { position: relative !important; }
            div[class*="nTa5u2sc"].is-dragging { opacity: 0.5; }
            .gm-ui-container { position: absolute !important; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
            .gm-category-tag { position: absolute; top: 8px; left: 8px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; display: none; max-width: calc(100% - 50px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .gm-category-button { position: absolute; top: 5px; right: 5px; background-color: rgba(30, 30, 30, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 5px; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: all; }
            div[class*="nTa5u2sc"]:hover .gm-category-button { opacity: 1; }
            .gm-category-button:hover { background-color: #333; }
            .gm-category-popup-menu { position: fixed; z-index: 10000; background: #2b2b2b; border: 1px solid #444; border-radius: 5px; list-style: none; padding: 5px 0; margin: 0; min-width: 180px; color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
            .gm-popup-item { padding: 8px 12px; cursor: pointer; display: flex; align-items: center; }
            .gm-popup-item:hover { background: #4a4a4a; }
            .gm-popup-checkmark { color: #4CAF50; font-size: 1.2em; margin-right: 8px; visibility: hidden; }
            .gm-popup-item.is-checked .gm-popup-checkmark { visibility: visible; }
        `;
        document.head.appendChild(styleSheet);
    }

    function main() {
        loadData();
        injectGlobalStyles();
        injectLeftPanelUI();
        setInterval(() => {
            findAndMarkCards();
            hideQuixelPanel();
        }, 500);
    }
    main();

})();