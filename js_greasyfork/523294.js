// ==UserScript==
// @name Komica 收藏貼文功能 (可拖曳按鈕版)
// @namespace https://komica.org/
// @version 4.2
// @description 在 Komica 每篇貼文添加收藏功能，提供懸浮視窗管理收藏，支持自定義位置、大小及配色切換，並新增收藏圖片縮圖功能。收藏按鈕可自由拖曳。
// @author Yun (Modified by Gemini)
// @license GNU GPLv3
// @icon https://i.ibb.co/bscXhHh/icon.png
// @match https://gita.komica1.org/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523294/Komica%20%E6%94%B6%E8%97%8F%E8%B2%BC%E6%96%87%E5%8A%9F%E8%83%BD%20%28%E5%8F%AF%E6%8B%96%E6%9B%B3%E6%8C%89%E9%88%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523294/Komica%20%E6%94%B6%E8%97%8F%E8%B2%BC%E6%96%87%E5%8A%9F%E8%83%BD%20%28%E5%8F%AF%E6%8B%96%E6%9B%B3%E6%8C%89%E9%88%95%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// 常量定義
const CONSTANTS = {
STORAGE_KEYS: {
FAVORITES: 'komicaFavorites',
POSITION: 'favoritesWindowPosition',
SIZE: 'favoritesWindowSize',
THEME: 'favoritesWindowTheme',
CATEGORIES: 'komicaCategories',
TOGGLE_BTN_POSITION: 'toggleBtnPosition' // ★ 新增：按鈕位置
},
DEFAULT_VALUES: {
POSITION: { top: '10px', left: '10px' },
SIZE: { width: '300px', height: '400px' },
THEME: 'original',
// ★ 修改：按鈕預設位置 (unset 很重要，確保拖曳後 top/left 生效)
TOGGLE_BTN_POSITION: { top: 'unset', left: 'unset', bottom: '10px', right: '10px' }
},
THEMES: {
original: { background: '#F0E0D6', header: '#EA8', text: '#800000', button: '#EA8', border: '#B89080' },
blackWhite: { background: '#FFFFFF', header: '#BBBBBB', text: '#000000', button: '#BBBBBB', border: '#999999' },
blue: { background: '#DDEEFF', header: '#6699CC', text: '#003366', button: '#6699CC', border: '#4477AA' }
},
HOTKEYS: {
TOGGLE_WINDOW: 'Alt+F',
QUICK_SAVE: 'Alt+S'
}
};

// 工具函數
const utils = {
throttle: (func, limit) => {
let inThrottle;
return function(...args) {
if (!inThrottle) {
func.apply(this, args);
inThrottle = true;
setTimeout(() => inThrottle = false, limit);
}
};
},

showToast: (message, type = 'info') => {
const toast = document.createElement('div');
toast.textContent = message;
toast.style.cssText = `
position: fixed;
bottom: 20px;
left: 50%;
transform: translateX(-50%);
padding: 10px 20px;
border-radius: 5px;
color: white;
z-index: 10002;
opacity: 0;
transition: opacity 0.3s;
`;

switch(type) {
case 'success':
toast.style.backgroundColor = '#4CAF50';
break;
case 'error':
toast.style.backgroundColor = '#f44336';
break;
default:
toast.style.backgroundColor = '#2196F3';
}

document.body.appendChild(toast);
setTimeout(() => toast.style.opacity = '1', 10);
setTimeout(() => {
toast.style.opacity = '0';
setTimeout(() => toast.remove(), 300);
}, 2000);
},

exportData: () => {
const data = {
favorites: favorites,
categories: categories
};
const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `komica_favorites_${new Date().toISOString().slice(0,10)}.json`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
utils.showToast('匯出成功！', 'success');
},

importData: (file) => {
const reader = new FileReader();
reader.onload = (e) => {
try {
const data = JSON.parse(e.target.result);
if (data.favorites && Array.isArray(data.favorites)) {
favorites = data.favorites;
localStorage.setItem(CONSTANTS.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
if (data.categories) {
categories = data.categories;
localStorage.setItem(CONSTANTS.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}
updateFavoritesWindow();
utils.showToast('匯入成功！', 'success');
} else {
utils.showToast('無效的檔案格式！', 'error');
}
} catch (error) {
utils.showToast('匯入失敗！', 'error');
console.error('Import error:', error);
}
};
reader.readAsText(file);
},

// 更新分類列表
updateCategories: () => {
// 獲取所有已使用的分類
const usedCategories = new Set(favorites.map(fav => fav.category));

// 更新分類列表，只保留已使用的分類和"未分類"
categories = Array.from(usedCategories);
if (!categories.includes('未分類')) {
categories.push('未分類');
}

// 儲存更新後的分類列表
localStorage.setItem(CONSTANTS.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

// 更新分類選單
const categorySelect = document.querySelector('#favoritesWindow select');
if (categorySelect) {
const currentValue = categorySelect.value;
categorySelect.innerHTML = `

全部
${categories.map(cat => `

${cat}`).join('')}
`;
categorySelect.value = currentValue;
}
}
};

// 狀態管理
let favorites = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.FAVORITES)) || [];
let categories = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.CATEGORIES)) || ['未分類'];
let position = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.POSITION)) || CONSTANTS.DEFAULT_VALUES.POSITION;
let size = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.SIZE)) || CONSTANTS.DEFAULT_VALUES.SIZE;
let theme = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.THEME)) || CONSTANTS.DEFAULT_VALUES.THEME;
// ★ 新增：讀取按鈕位置
let toggleBtnPosition = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.TOGGLE_BTN_POSITION)) || CONSTANTS.DEFAULT_VALUES.TOGGLE_BTN_POSITION;
let currentCategory = '全部';
let currentSort = 'time-desc';
let searchTerm = '';

// 更新收藏按鈕顏色
function updateCollectButtonsColor() {
document.querySelectorAll('.collect-btn').forEach(btn => {
btn.style.color = CONSTANTS.THEMES[theme].text;
});
}

// 應用主題
function applyTheme(favoritesWindow, toggleBtn) {
const currentTheme = CONSTANTS.THEMES[theme];
favoritesWindow.style.backgroundColor = currentTheme.background;
favoritesWindow.querySelector('.window-header').style.backgroundColor = currentTheme.header;
favoritesWindow.querySelector('.window-header').style.color = currentTheme.text;
if (toggleBtn) {
toggleBtn.style.backgroundColor = currentTheme.button;
toggleBtn.style.color = currentTheme.text;
}

// 更新所有文字顏色
document.querySelectorAll('#favoritesWindow a, #favoritesWindow p, #favoritesWindow select')
.forEach(el => el.style.color = currentTheme.text);


// 新增：更新編輯和刪除按鈕顏色
document.querySelectorAll('#favoritesWindow .favorites-content span[title="編輯分類"], #favoritesWindow .favorites-content span[title="移除收藏"]')
.forEach(btn => btn.style.color = currentTheme.text);

// 新增：更新分類標籤顏色
document.querySelectorAll('#favoritesWindow .favorites-content span:not([title])')
.forEach(tag => {
tag.style.backgroundColor = `${currentTheme.header}40`;
tag.style.color = currentTheme.text;
});
document.querySelectorAll('#favoritesWindow input, #favoritesWindow select')
.forEach(el => {
el.style.border = `1px solid ${currentTheme.border}`;
el.style.backgroundColor = currentTheme.background;
el.style.color = currentTheme.text;
});

// 更新分隔線顏色
document.querySelectorAll('#favoritesWindow .favorites-content > div')
.forEach(item => {
item.style.borderBottom = `1px solid ${currentTheme.border}`;
});
document.querySelector('#favoritesWindow .favorites-toolbar')?.style
.setProperty('border-bottom-color', currentTheme.border);

updateCollectButtonsColor();
}

// 建立工具列
function createToolbar(favoritesWindow) {
const toolbar = document.createElement('div');
toolbar.className = 'favorites-toolbar';
toolbar.style.cssText = `
padding: 5px;
display: flex;
gap: 10px;
align-items: center;
border-bottom: 1px solid ${CONSTANTS.THEMES[theme].border};
`;

// 搜尋框
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = '搜尋...';
searchInput.style.cssText = `
padding: 3px;
border: 1px solid ${CONSTANTS.THEMES[theme].border};
border-radius: 3px;
flex: 1;
background-color: ${CONSTANTS.THEMES[theme].background};
color: ${CONSTANTS.THEMES[theme].text};
`;
searchInput.style.setProperty('::placeholder', CONSTANTS.THEMES[theme].text);
searchInput.addEventListener('input', (e) => {
searchTerm = e.target.value.toLowerCase();
updateFavoritesWindow();
});

// 分類選擇
const categorySelect = document.createElement('select');
categorySelect.style.cssText = `
padding: 3px;
border: 1px solid ${CONSTANTS.THEMES[theme].border};
border-radius: 3px;
background-color: ${CONSTANTS.THEMES[theme].background};
color: ${CONSTANTS.THEMES[theme].text};
`;
categorySelect.innerHTML = `

全部
${categories.map(cat => `

${cat}`).join('')}
`;
categorySelect.value = currentCategory;
categorySelect.addEventListener('change', (e) => {
currentCategory = e.target.value;
updateFavoritesWindow();
});

// 排序選擇
const sortSelect = document.createElement('select');
sortSelect.style.cssText = `
padding: 3px;
border: 1px solid ${CONSTANTS.THEMES[theme].border};
border-radius: 3px;
background-color: ${CONSTANTS.THEMES[theme].background};
color: ${CONSTANTS.THEMES[theme].text};
`;
sortSelect.innerHTML = `

時間 ↓

時間 ↑

編號 ↓

編號 ↑
`;
sortSelect.value = currentSort;
sortSelect.addEventListener('change', (e) => {
currentSort = e.target.value;
updateFavoritesWindow();
});

toolbar.appendChild(searchInput);
toolbar.appendChild(categorySelect);
toolbar.appendChild(sortSelect);

return toolbar;
}

// 添加收藏按鈕
function addCollectButtons() {
const posts = document.querySelectorAll('.post:not(.has-collect-btn)');
posts.forEach(post => {
post.classList.add('has-collect-btn');

const postId = post.dataset.no;
const threadId = post.closest('.thread')?.dataset.no || postId;
const thumbnail = post.querySelector('img')?.src || null;
if (!postId) return;

const collectBtn = document.createElement('span');
collectBtn.textContent = favorites.some(fav => fav.id === postId) ? '★' : '☆';
collectBtn.className = 'collect-btn text-button';
collectBtn.style.cssText = `
margin-left: 10px;
cursor: pointer;
color: ${CONSTANTS.THEMES[theme].text};
`;

collectBtn.addEventListener('click', () => {
const existingFavorite = favorites.find(fav => fav.id === postId);
if (existingFavorite) {
favorites = favorites.filter(fav => fav.id !== postId);
collectBtn.textContent = '☆';
utils.showToast('已移除收藏', 'info');
} else {
const postContent = post.querySelector('.quote')?.textContent || '無內文';
favorites.push({
id: postId,
url: `https://gita.komica1.org/00b/pixmicat.php?res=${threadId}#r${postId}`,
content: postContent,
thumbnail,
category: '未分類',
timestamp: Date.now()
});
collectBtn.textContent = '★';
utils.showToast('已加入收藏', 'success');
}
localStorage.setItem(CONSTANTS.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
utils.updateCategories(); // 更新分類列表
updateFavoritesWindow();
});

const postHead = post.querySelector('.post-head');
if (postHead) postHead.appendChild(collectBtn);
});
}

// 建立收藏視窗
function createFavoritesWindow() {
const favoritesWindow = document.createElement('div');
favoritesWindow.id = 'favoritesWindow';
favoritesWindow.style.cssText = `
position: fixed;
top: ${position.top};
left: ${position.left};
width: ${size.width};
height: ${size.height};
border: 1px solid #666;
box-shadow: 0 3px 10px rgba(0,0,0,0.75);
overflow: hidden;
display: none;
resize: both;
z-index: 10001;
flex-direction: column;
`;

// 視窗標題列
const header = document.createElement('div');
header.className = 'window-header';
header.style.cssText = `
padding: 5px;
cursor: move;
display: flex;
justify-content: space-between;
align-items: center;
`;

const title = document.createElement('span');
title.textContent = '已收藏的貼文';
title.style.fontWeight = 'bold';

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';

// 匯出按鈕
const exportBtn = document.createElement('span');
exportBtn.textContent = '↓';
exportBtn.title = '匯出收藏';
exportBtn.style.cursor = 'pointer';
exportBtn.addEventListener('click', utils.exportData);

// 匯入按鈕
const importBtn = document.createElement('span');
importBtn.textContent = '↑';
importBtn.title = '匯入收藏';
importBtn.style.cursor = 'pointer';
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.display = 'none';
importInput.addEventListener('change', (e) => {
if (e.target.files.length > 0) {
utils.importData(e.target.files[0]);
e.target.value = ''; // 重置 input，允許重複匯入相同檔案
}
});
importBtn.addEventListener('click', () => importInput.click());
document.body.appendChild(importInput);

// 清空按鈕
const clearAllBtn = document.createElement('span');
clearAllBtn.textContent = '⌫';
clearAllBtn.style.cursor = 'pointer';
clearAllBtn.title = '清空收藏';
clearAllBtn.addEventListener('click', () => {
if (confirm('確定要清空所有收藏嗎？')) {
favorites = [];
localStorage.setItem(CONSTANTS.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
utils.updateCategories(); // 更新分類列表
updateFavoritesWindow();
utils.showToast('已清空所有收藏', 'info');
}
});

// 主題切換按鈕
const changeThemeBtn = document.createElement('span');
changeThemeBtn.textContent = '↹';
changeThemeBtn.style.cursor = 'pointer';
changeThemeBtn.title = '切換配色';
changeThemeBtn.addEventListener('click', () => {
const themeKeys = Object.keys(CONSTANTS.THEMES);
const currentIndex = themeKeys.indexOf(theme);
theme = themeKeys[(currentIndex + 1) % themeKeys.length];
localStorage.setItem(CONSTANTS.STORAGE_KEYS.THEME, JSON.stringify(theme));
applyTheme(favoritesWindow, toggleBtn);
updateFavoritesWindow(); // 重新渲染收藏列表以更新所有元素顏色
utils.showToast(`已切換至${theme}主題`, 'info');
});
// 關閉按鈕
const closeBtn = document.createElement('span');
closeBtn.textContent = '✕';
closeBtn.style.cursor = 'pointer';
closeBtn.title = '關閉視窗';
closeBtn.addEventListener('click', () => {
favoritesWindow.style.display = 'none';
});

// 添加所有按鈕到容器
[exportBtn, importBtn, clearAllBtn, changeThemeBtn, closeBtn].forEach(btn => {
buttonContainer.appendChild(btn);
});

header.appendChild(title);
header.appendChild(buttonContainer);
favoritesWindow.appendChild(header);

// 添加工具列
const toolbar = createToolbar(favoritesWindow);
favoritesWindow.appendChild(toolbar);

// 內容區域
const content = document.createElement('div');
content.className = 'favorites-content';
content.style.cssText = `
flex: 1;
overflow-y: auto;
padding: 10px;
`;
favoritesWindow.appendChild(content);


// 視窗大小調整
const onResize = utils.throttle(() => {
size = {
width: favoritesWindow.style.width,
height: favoritesWindow.style.height
};
localStorage.setItem(CONSTANTS.STORAGE_KEYS.SIZE, JSON.stringify(size));
}, 100);

favoritesWindow.addEventListener('mouseup', onResize);

// 切換按鈕
const toggleBtn = document.createElement('div');
toggleBtn.textContent = '★ 收藏';
toggleBtn.style.cssText = `
position: fixed;
top: ${toggleBtnPosition.top};
left: ${toggleBtnPosition.left};
bottom: ${toggleBtnPosition.bottom};
right: ${toggleBtnPosition.right};
padding: 5px 10px;
cursor: move; /* ★ 修改：改為 move */
z-index: 10000;
border-radius: 3px;
box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

// ★★★ 統一拖曳功能 (開始) ★★★
// 此邏輯現在同時處理視窗 (header) 和切換按鈕 (toggleBtn)
let dragTarget = null; // 'window' 或 'button'
let dragOffset = { x: 0, y: 0 };
let hasDragged = false; // 用於區分點擊和拖曳

const startDrag = (e, targetType) => {
// 防止在視窗標題的按鈕上觸發拖曳
if (targetType === 'window' && e.target.closest('span[title]')) return;
// 防止右鍵
if (e.button !== 0) return;

dragTarget = targetType;
hasDragged = false;
e.preventDefault(); // 防止文字選取

if (dragTarget === 'window') {
dragOffset.x = e.clientX - favoritesWindow.offsetLeft;
dragOffset.y = e.clientY - favoritesWindow.offsetTop;
header.style.cursor = 'grabbing';
} else if (dragTarget === 'button') {
dragOffset.x = e.clientX - toggleBtn.offsetLeft;
dragOffset.y = e.clientY - toggleBtn.offsetTop;
toggleBtn.style.cursor = 'grabbing';
}
};

const onDrag = utils.throttle((e) => {
if (!dragTarget) return;
hasDragged = true;

const newLeft = `${e.clientX - dragOffset.x}px`;
const newTop = `${e.clientY - dragOffset.y}px`;

if (dragTarget === 'window') {
favoritesWindow.style.left = newLeft;
favoritesWindow.style.top = newTop;
} else if (dragTarget === 'button') {
toggleBtn.style.left = newLeft;
toggleBtn.style.top = newTop;
// 拖曳後固定使用 top/left，清除 bottom/right
toggleBtn.style.bottom = 'unset';
toggleBtn.style.right = 'unset';
}
}, 16); // 16ms 約等於 60fps

const stopDrag = () => {
if (!dragTarget) return;

if (dragTarget === 'window') {
header.style.cursor = 'move';
position = {
top: favoritesWindow.style.top,
left: favoritesWindow.style.left
};
localStorage.setItem(CONSTANTS.STORAGE_KEYS.POSITION, JSON.stringify(position));
} else if (dragTarget === 'button') {
toggleBtn.style.cursor = 'move';
toggleBtnPosition = {
top: toggleBtn.style.top,
left: toggleBtn.style.left,
bottom: 'unset',
right: 'unset'
};
localStorage.setItem(CONSTANTS.STORAGE_KEYS.TOGGLE_BTN_POSITION, JSON.stringify(toggleBtnPosition));
}

dragTarget = null;
// hasDragged 會在 click 事件中重置
};

// 綁定視窗標題的拖曳
header.addEventListener('mousedown', (e) => startDrag(e, 'window'));

// 綁定切換按鈕的拖曳
toggleBtn.addEventListener('mousedown', (e) => startDrag(e, 'button'));

// 全局監聽 mousemove 和 mouseup
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

// ★★★ 統一拖曳功能 (結束) ★★★


toggleBtn.addEventListener('click', () => {
// ★ 修改：如果剛剛拖曳過，就不要觸發點擊
if (hasDragged) {
hasDragged = false;
return;
}
favoritesWindow.style.display = favoritesWindow.style.display === 'none' ? 'flex' : 'none';
});

// 快捷鍵支援
document.addEventListener('keydown', (e) => {
// Alt + F：切換收藏視窗
if (e.altKey && e.key.toLowerCase() === 'f') {
e.preventDefault();
toggleBtn.click();
}
// Alt + S：快速收藏當前貼文
if (e.altKey && e.key.toLowerCase() === 's') {
e.preventDefault();
const activePost = document.activeElement.closest('.post');
if (activePost) {
const collectBtn = activePost.querySelector('.collect-btn');
if (collectBtn) collectBtn.click();
}
}
});

document.body.appendChild(favoritesWindow);
document.body.appendChild(toggleBtn);
applyTheme(favoritesWindow, toggleBtn);
updateFavoritesWindow();

return favoritesWindow;
}

function updateFavoritesWindow() {
const content = document.querySelector('#favoritesWindow .favorites-content');
if (!content) return;

content.innerHTML = '';

let filteredFavorites = [...favorites];

// 套用分類篩選
if (currentCategory !== '全部') {
filteredFavorites = filteredFavorites.filter(fav => fav.category === currentCategory);
}

// 套用搜尋篩選
if (searchTerm) {
filteredFavorites = filteredFavorites.filter(fav =>
fav.content.toLowerCase().includes(searchTerm) ||
fav.id.includes(searchTerm)
);
}

// 套用排序
filteredFavorites.sort((a, b) => {
switch(currentSort) {
case 'time-desc':
return (b.timestamp || 0) - (a.timestamp || 0);
case 'time-asc':
return (a.timestamp || 0) - (b.timestamp || 0);
case 'id-desc':
return b.id.localeCompare(a.id);
case 'id-asc':
return a.id.localeCompare(b.id);
default:
return 0;
}
});

if (filteredFavorites.length === 0) {
const noFavorites = document.createElement('p');
noFavorites.textContent = searchTerm ? '沒有符合搜尋條件的收藏' : '尚無收藏';
noFavorites.style.textAlign = 'center';
noFavorites.style.color = CONSTANTS.THEMES[theme].text;
content.appendChild(noFavorites);
return;
}

// 使用 DocumentFragment 優化 DOM 操作
const fragment = document.createDocumentFragment();

filteredFavorites.forEach(({ id, url, content: favContent, thumbnail, category }) => {
const item = document.createElement('div');
item.style.cssText = `
display: flex;
align-items: center;
padding: 5px;
border-bottom: 1px solid ${CONSTANTS.THEMES[theme].border};
gap: 10px;
`;

if (thumbnail) {
const img = document.createElement('img');
img.src = thumbnail;
img.alt = '縮圖';
img.style.cssText = `
width: 50px;
height: 50px;
object-fit: cover;
border-radius: 3px;
`;
item.appendChild(img);
}

const contentWrapper = document.createElement('div');
contentWrapper.style.flex = '1';

const link = document.createElement('a');
link.href = url;
link.textContent = `${id}: ${favContent.substring(0, 30)}...`;
link.style.cssText = `
display: block;
text-decoration: none;
color: ${CONSTANTS.THEMES[theme].text};
margin-bottom: 5px;
`;

const categoryTag = document.createElement('span');
categoryTag.textContent = category;
categoryTag.style.cssText = `
font-size: 0.8em;
padding: 2px 5px;
background-color: ${CONSTANTS.THEMES[theme].header}40;
border-radius: 3px;
color: ${CONSTANTS.THEMES[theme].text};
`;

contentWrapper.appendChild(link);
contentWrapper.appendChild(categoryTag);
item.appendChild(contentWrapper);

// 操作按鈕容器
const actions = document.createElement('div');
actions.style.display = 'flex';
actions.style.gap = '5px';

// 編輯分類按鈕
// 編輯分類按鈕
const editCategoryBtn = document.createElement('span');
editCategoryBtn.textContent = '✎';
editCategoryBtn.title = '編輯分類';
editCategoryBtn.style.cssText = `
cursor: pointer;
color: ${CONSTANTS.THEMES[theme].text};
`;
editCategoryBtn.addEventListener('click', () => {
const newCategory = prompt('請輸入分類名稱：', category);
if (newCategory !== null && newCategory.trim() !== '') {
const fav = favorites.find(f => f.id === id);
if (fav) {
fav.category = newCategory.trim();
localStorage.setItem(CONSTANTS.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
utils.updateCategories(); // 更新分類列表
updateFavoritesWindow();
utils.showToast('已更新分類', 'success');
}
}
});

// 刪除按鈕
const removeBtn = document.createElement('span');
removeBtn.textContent = '✕';
removeBtn.title = '移除收藏';
removeBtn.style.cssText = `
cursor: pointer;
color: ${CONSTANTS.THEMES[theme].text};
`;
removeBtn.addEventListener('click', () => {
favorites = favorites.filter(fav => fav.id !== id);
localStorage.setItem(CONSTANTS.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
utils.updateCategories(); // 更新分類列表
updateFavoritesWindow();
utils.showToast('已移除收藏', 'info');
});

actions.appendChild(editCategoryBtn);
actions.appendChild(removeBtn);
item.appendChild(actions);

fragment.appendChild(item);
});

content.appendChild(fragment);
}

function init() {
addCollectButtons();
createFavoritesWindow();
}

// 監聽 DOM 變化以添加收藏按鈕
const observer = new MutationObserver(() => {
addCollectButtons();
});

observer.observe(document.body, { childList: true, subtree: true });
init();
})();