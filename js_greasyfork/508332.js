// ==UserScript==
// @name         Lofter增强插件
// @namespace    http://lofter.com
// @version      1.13
// @description  强制展开所有标签，提供隐藏用户/关键词功能
// @author       boni
// @match        https://www.lofter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lofter.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @description:zh 强制展开所有标签，提供隐藏用户/关键词功能
// @downloadURL https://update.greasyfork.org/scripts/508332/Lofter%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/508332/Lofter%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(() => {
  'use strict';

  // ===== CSS STYLING =====
  GM_addStyle(`
    // 强制展开tag栏
    .isaym .w-opt {
        height: fit-content;
        
    }

    .m-mlist .isaym .w-opt {
      height: fit-content !important;
    }

    .w-opt .opta {
        width: 100% !important;
        height: fit-content;
        margin-bottom: 5px;
    }
    .w-opt .optb {
        position: relative;
        float: right;
    }

    // 隐藏app二维码
    #j-tagser-app-down {
        display: none !important;
    }
  `);

  if (!window.location.href.match(/^https:\/\/www\.lofter\.com\/tag\//)) return;

  GM_addStyle(`

     .control-panel details[open] ul {
      max-height: 200px; /* Adjust this value as needed */
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 5px; /* Space for scrollbar */
    }
    
    /* Custom scrollbar styling */
    .control-panel details[open] ul::-webkit-scrollbar {
      width: 6px;
    }
    
    .control-panel details[open] ul::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .control-panel details[open] ul::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 3px;
    }
    
    .control-panel details[open] ul::-webkit-scrollbar-thumb:hover {
      background: #a0a0a0;
    }
      
    /* Original sidebar replacement */
    #rside {
        position: sticky;
        top: 94px;
        z-index: 1000;
        max-height: calc(100vh - 20px);
        overflow-y: auto;
        width:210px;
        padding: 10px !important;
        background: #f8f8f8 !important;
        border-radius: 4px !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    }

    /* Panel styling */

    .control-panel:last-child {
        margin-bottom: 20px;
    }

    .control-panel {
        font-family: Arial, sans-serif;

         details[open] {
          margin-bottom: 15px;
        }

    }
    .control-panel details[open] {
        margin-bottom: 15px;
    }
    .control-panel.muteTag {
        margin-bottom: 15px;
    }
    .control-panel summary {
        font-weight: bold;
        cursor: pointer;
        padding: 5px;
        background: #eee;
        border-radius: 3px;
        outline: none;
        margin-bottom: 5px;
    }
    .control-panel ul {
        list-style: none;
        padding: 0;
        margin: 5px 0 0 0;
    }
    .control-panel li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-bottom: 1px solid #eee;
    }
    .control-panel li:last-child {
        border-bottom: none;
    }
    /* Unified button styling */
    .control-btn, .mute-button {
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        background: #e0e0e0;
        border: 1px solid #c0c0c0;
        color: #333 !important;
        transition: all 0.2s ease;
        font-weight: normal;
        text-decoration: none;
        cursor: pointer;
    }
    
    .control-btn:hover, .mute-button:hover {
        background: #d0d0d0;
        border-color: #b0b0b0;
    }
    
    /* Specific button adjustments */
    .unmute-btn, .remove-keyword-btn, 
    .add-keyword-btn, .export-btn, 
    .import-btn, .import-submit, 
    .import-cancel {
        background: #e0e0e0;
        border: 1px solid #c0c0c0;
        color: #333;
    }

    .export-btn, 
    .import-btn {
      width: 50%;
    }
    
    .unmute-btn:hover, .remove-keyword-btn:hover,
    .add-keyword-btn:hover, .export-btn:hover, 
    .import-btn:hover, .import-submit:hover, 
    .import-cancel:hover {
        background: #d0d0d0;
        border-color: #b0b0b0;
    }
    
    .add-keyword-form {
        display: flex;
        margin-top: 8px;
        gap: 5px;
    }
    .add-keyword-input {
        flex-grow: 1;
        padding: 6px;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        font-size: 12px;
    }
    .add-keyword-btn {
        margin-left: 0;
    }

    /* Mute button styling */
    .mute-button {
        display: inline-block;
        margin-left: 8px;
        padding: 3px 8px;
        // float: right;
    }

    /* Backup/Restore panel */
    .backup-controls {
      display: flex;
      gap: 5px;
      margin-top: 10px;
    }
    
    .backup-textarea {
      width: 100%;
      height: 100px;
      margin: 10px 0;
      padding: 8px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      resize: vertical;
      box-sizing: border-box;
    }
    
    .backup-buttons {
      display: flex;
      gap: 5px;
      justify-content: flex-end;
    }
    
    /* Form elements */
    input, textarea, button {
        font-family: Arial, sans-serif;
        font-size: 12px;
    }
    
    /* Panel spacing */
    .control-panel  {
          details[open] {
          margin-bottom: 15px;
        }
    }

     /* Backup/Restore panel */
    .backup-controls {
      display: flex;
      gap: 5px;
      margin-top: 10px;
    }
    
    .backup-textarea {
      width: 100%;
      height: 100px;
      margin: 10px 0;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-family: monospace;
      font-size: 12px;
    }
    

  `);

  // ===== STORAGE MANAGEMENT =====
  const MUTED_USERS_KEY = 'lofter_muted_users';
  const BLOCKED_KEYWORDS_KEY = 'lofter_blocked_keywords';


  const getMutedUsers = () => {
    const stored = GM_getValue(MUTED_USERS_KEY, '[]');
    try {
      const parsed = JSON.parse(stored);
      if (parsed.length && typeof parsed[0] === 'string') {
        return parsed.map(id => ({ id, name: id }));
      }
      return parsed;
    } catch {
      return [];
    }
  };

  const saveMutedUsers = (users) => GM_setValue(MUTED_USERS_KEY, JSON.stringify(users));

  const getBlockedKeywords = () => {
    const stored = GM_getValue(BLOCKED_KEYWORDS_KEY, '[]');
    try {
      const keywords = JSON.parse(stored);
      return keywords
    } catch {
      return [];
    }
  };

  const saveBlockedKeywords = (keywords) => GM_setValue(BLOCKED_KEYWORDS_KEY, JSON.stringify(keywords));

  // ===== USER MANAGEMENT =====
  const muteUser = (userId, displayName) => {
    const muted = getMutedUsers();
    if (!muted.some(user => user.id === userId)) {
      muted.push({ id: userId, name: displayName });
      saveMutedUsers(muted);
      updateMuteList();
      blockUser(userId);
    }
  };

  const unmuteUser = (userId) => {
    const muted = getMutedUsers();
    const updated = muted.filter(user => user.id !== userId);
    if (updated.length !== muted.length) {
      saveMutedUsers(updated);
      updateMuteList();
      unblockUser(userId);
    }
  };

  const createMuteListHTML = () => {
    const mutedUsers = getMutedUsers();
    if (!mutedUsers.length) return '<ul><li>没有用户被隐藏</li></ul>';

    return `
      <ul>
        ${mutedUsers.map(user => `
          <li>
            <span>${user.name || user.id}</span>
            <button class="control-btn unmute-btn" data-user-id="${user.id}">移除</button>
          </li>
        `).join('')}
      </ul>
    `;
  };

  // ===== KEYWORD MANAGEMENT =====
  const addKeyword = (keyword) => {
    if (!keyword.trim()) return;
    const keywords = getBlockedKeywords();
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
      saveBlockedKeywords(keywords);
      updateKeywordList();
      filterPostsByKeywords();
    }
  };

  const removeKeyword = (keyword) => {
    const keywords = getBlockedKeywords();
    const index = keywords.indexOf(keyword);
    if (index > -1) {
      keywords.splice(index, 1);
      saveBlockedKeywords(keywords);
      updateKeywordList();
      restoreContentForKeyword(keyword);
    }
  };

  const restoreContentForKeyword = (keyword) => {
    document.querySelectorAll('.m-mlist[data-hidden-by="keyword"]').forEach(post => {
      let containsKeyword = false;
      const textElements = post.querySelectorAll('.txt');
      for (const element of textElements) {
        if (element.textContent.includes(keyword)) {
          containsKeyword = true;
          break;
        }
      }

      if (!containsKeyword) {
        const tagElements = post.querySelectorAll('.opta span');
        for (const element of tagElements) {
          if (element.textContent.includes(keyword)) {
            containsKeyword = true;
            break;
          }
        }
      }

      if (containsKeyword) {
        const shouldShow = !containsBlockedKeywords(post, getBlockedKeywords());
        if (shouldShow) showPostElement(post);
      }
    });
  };

  // ===== PANEL UPDATES =====
  const updateMuteList = () => {
    const panel = document.querySelector('.mute-panel');
    if (panel) {
      const details = panel.querySelector('details');
      const wasOpen = details.open;

      // Update summary count
      const summary = panel.querySelector('summary');
      summary.textContent = `隐藏的用户 (${getMutedUsers().length})`;

      // Update list content
      const newList = document.createElement('div');
      newList.innerHTML = createMuteListHTML();
      const oldList = panel.querySelector('ul');

      if (oldList) {
        oldList.replaceWith(newList.querySelector('ul'));
      } else {
        details.appendChild(newList.querySelector('ul'));
      }

      // Reattach event listeners
      panel.querySelectorAll('.unmute-btn').forEach(btn => {
        btn.addEventListener('click', () => unmuteUser(btn.dataset.userId));
      });

      // Restore open state
      details.open = wasOpen;
    }
  };

  const updateKeywordList = () => {
    const panel = document.querySelector('.keyword-panel');
    if (panel) {
      const details = panel.querySelector('details');
      const wasOpen = details.open;

      // Update summary count
      const summary = panel.querySelector('summary');
      summary.textContent = `隐藏的关键词 (${getBlockedKeywords().length})`;

      // Update list content
      const newList = document.createElement('div');
      newList.innerHTML = createKeywordListHTML();
      const oldList = panel.querySelector('ul');

      if (oldList) {
        oldList.replaceWith(newList.querySelector('ul'));
      } else {
        const form = panel.querySelector('.add-keyword-form');
        if (form) form.insertAdjacentElement('beforebegin', newList.querySelector('ul'));
      }

      // Reattach event listeners
      panel.querySelectorAll('.remove-keyword-btn').forEach(btn => {
        btn.addEventListener('click', () => removeKeyword(btn.dataset.keyword));
      });

      // Restore open state
      details.open = wasOpen;
    }
  };

  const createKeywordListHTML = () => {
    const keywords = getBlockedKeywords();
    if (!keywords.length) return '<ul><li>没有关键词被隐藏</li></ul>';

    return `
      <ul>
        ${keywords.map(keyword => `
          <li>
            <span>${keyword}</span>
            <button class="control-btn remove-keyword-btn" data-keyword="${keyword}">移除</button>
          </li>
        `).join('')}
      </ul>
    `;
  };

  // ===== SIDEBAR INITIALIZATION =====
  const createControlPanels = () => {
    const sidebar = document.getElementById('rside');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="control-panel muteTag">
        <a class="muteTag" href="https://www.lofter.com/usertagforbid" target="_blank">打开Lofter标签屏蔽页面</a>
      </div>
      <div class="control-panel mute-panel">
        <details>
          <summary>隐藏的用户 (${getMutedUsers().length})</summary>
          ${createMuteListHTML()}
        </details>
      </div>
      <div class="control-panel keyword-panel">
        <details>
          <summary>隐藏的关键词 (${getBlockedKeywords().length})</summary>
          ${createKeywordListHTML()}
          <div class="add-keyword-form">
            <input type="text" class="add-keyword-input" placeholder="输入屏蔽词">
            <button class="control-btn add-keyword-btn">添加</button>
          </div>
        </details>
      </div>
      <div class="control-panel backup-panel">
        <details>
          <summary>导出/导入屏蔽设置</summary>
          <div class="backup-controls">
            <button class="control-btn export-btn">导出</button>
            <button class="control-btn import-btn">导入</button>
          </div>
          <div class="import-area" style="display: none;">
            <textarea class="backup-textarea" placeholder="黏贴规则代码"></textarea>
            <div class="backup-buttons">
              <button class="control-btn import-submit">应用</button>
              <button class="control-btn import-cancel">取消</button>
            </div>
          </div>
        </details>
      </div>
    `;

    // Add event listeners for mute buttons
    sidebar.querySelectorAll('.unmute-btn').forEach(btn => {
      btn.addEventListener('click', () => unmuteUser(btn.dataset.userId));
    });

    // Add event listeners for keyword removal
    sidebar.querySelectorAll('.remove-keyword-btn').forEach(btn => {
      btn.addEventListener('click', () => removeKeyword(btn.dataset.keyword));
    });

    // Add event listener for keyword addition
    const addKeywordBtn = sidebar.querySelector('.add-keyword-btn');
    const addKeywordInput = sidebar.querySelector('.add-keyword-input');

    const handleAddKeyword = () => {
      const keyword = addKeywordInput.value.trim();
      if (keyword) {
        addKeyword(keyword);
        addKeywordInput.value = '';
      }
    };

    addKeywordBtn.addEventListener('click', handleAddKeyword);
    addKeywordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddKeyword();
    });

    // Add backup/restore event listeners
    const exportBtn = sidebar.querySelector('.export-btn');
    const importBtn = sidebar.querySelector('.import-btn');
    const importArea = sidebar.querySelector('.import-area');
    const importTextarea = sidebar.querySelector('.backup-textarea');
    const importSubmit = sidebar.querySelector('.import-submit');
    const importCancel = sidebar.querySelector('.import-cancel');

    exportBtn.addEventListener('click', handleExportSettings);
    importBtn.addEventListener('click', () => importArea.style.display = 'block');
    importSubmit.addEventListener('click', handleImportSettings);
    importCancel.addEventListener('click', () => {
      importArea.style.display = 'none';
      importTextarea.value = '';
    });
  }


  // ===== CONTENT FILTERING =====
  const filterContent = () => {
    blockMutedUsers();
    filterPostsByKeywords();
  };

  const blockMutedUsers = () => getMutedUsers().forEach(user => blockUser(user.id));

  const blockUser = (userId) => {
    // Only target author links, not comment links
    const authorLinks = document.querySelectorAll(`
      .m-mlist a.publishernick[href*="${userId}"],
      .m-mlist div.mlistimg a[href*="${userId}"]
    `);

    authorLinks.forEach(link => {
      const section = link.closest('.m-mlist');
      if (section && !section.dataset.processed) {
        section.style.display = 'none';
        section.dataset.processed = 'true';
        console.log(`Blocked content from user: ${userId}`);
      }
    });
  };

  // FIXED UNBLOCKUSER FUNCTION
  const unblockUser = (userId) => {
    const authorLinks = document.querySelectorAll(`
      .m-mlist a.publishernick[href*="${userId}"],
      .m-mlist div.mlistimg a[href*="${userId}"]
    `);

    authorLinks.forEach(link => {
      const section = link.closest('.m-mlist');
      if (section) {
        section.style.display = '';
        delete section.dataset.processed;
      }
    });
  };
  const filterPostsByKeywords = () => {
    const keywords = getBlockedKeywords();
    if (!keywords.length) return;

    document.querySelectorAll('div.m-mlist').forEach(post => {
      const title = post.querySelector('h2.tit')?.textContent || '';
      const content = post.querySelector('div.cnt')?.textContent || '';
      const shouldHide = keywords.some(kw => title.includes(kw) || content.includes(kw));

      if (shouldHide) {
        hidePostElement(post);
      } else if (post.dataset.hiddenBy === 'keyword') {
        showPostElement(post);
      }
    });
  };

  const containsBlockedKeywords = (post, keywords) => {
    const textElements = post.querySelectorAll('.txt');
    for (const element of textElements) {
      if (keywords.some(keyword => element.textContent.includes(keyword))) {
        return true;
      }
    }
    return false;
  };

  const hidePostElement = (element) => {
    const section = element.closest('.m-mlist');
    if (section && section.style.display !== 'none') {
      section.style.display = 'none';
      section.dataset.hiddenBy = 'keyword';
    }
  };

  const showPostElement = (element) => {
    const section = element.closest('.m-mlist');
    if (section && section.style.display === 'none') {
      section.style.display = '';
      delete section.dataset.hiddenBy;
    }
  };

  // ===== MUTE BUTTON =====
  const addMuteButtons = () => {
    document.querySelectorAll('.w-icn2.w-icn2-3.a-followicon').forEach(icon => {
      if (window.getComputedStyle(icon).display === 'none') return;
      if (icon.closest('.m-mlist').querySelector('.mute-button')) return;

      const muteBtn = document.createElement('a');
      muteBtn.className = 'mute-button';
      muteBtn.textContent = '隐藏';

      const post = icon.closest('.m-mlist');
      const publisherNick = post?.querySelector('.w-who .publishernick');
      const userLink = post?.querySelector('a[href^="https://"]');

      if (userLink?.href && publisherNick) {
        const userId = new URL(userLink.href).pathname.split('/')[1] ||
          new URL(userLink.href).hostname.split('.')[0];
        if (userId) {
          muteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            muteUser(userId, publisherNick.textContent.trim());
          });
          icon.closest('.w-who')?.appendChild(muteBtn);
        }
      }
    });
  };

  // ===== BACKUP/RESTORE FUNCTIONS =====
  const handleExportSettings = () => {
    const settings = {
      version: 1,
      mutedUsers: getMutedUsers(),
      blockedKeywords: getBlockedKeywords()
    };

    const jsonString = JSON.stringify(settings, null, 2);
    const textarea = document.createElement('textarea');
    textarea.value = jsonString;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert('设置已复制到剪贴板.');
  };

  const handleImportSettings = () => {
    const jsonString = document.querySelector('.backup-textarea').value.trim();
    if (!jsonString) return;

    try {
      const settings = JSON.parse(jsonString);

      // Validate the settings structure
      if (!settings.mutedUsers || !settings.blockedKeywords) {
        throw new Error('Invalid settings format');
      }

      // Remove duplicates from imported data
      const uniqueUsers = [];
      const uniqueKeywords = [];
      const userMap = new Map();
      const keywordSet = new Set();

      // Deduplicate users by ID
      for (const user of settings.mutedUsers) {
        if (!userMap.has(user.id)) {
          userMap.set(user.id, true);
          uniqueUsers.push(user);
        }
      }

      // Deduplicate keywords
      for (const keyword of settings.blockedKeywords) {
        if (!keywordSet.has(keyword)) {
          keywordSet.add(keyword);
          uniqueKeywords.push(keyword);
        }
      }

      // Get current counts for comparison
      const currentUserCount = getMutedUsers().length;
      const currentKeywordCount = getBlockedKeywords().length;

      // Save the deduplicated settings
      saveMutedUsers(uniqueUsers);
      saveBlockedKeywords(uniqueKeywords);

      // Update UI
      updateMuteList();
      updateKeywordList();
      filterContent();

      // Hide import area and clear textarea
      document.querySelector('.import-area').style.display = 'none';
      document.querySelector('.backup-textarea').value = '';

      // Show import summary
      const newUserCount = uniqueUsers.length - currentUserCount;
      const newKeywordCount = uniqueKeywords.length - currentKeywordCount;

      let message = '导入成功!';
      if (newUserCount > 0 || newKeywordCount > 0) {
        message += `\n已添加:`;
        if (newUserCount > 0) message += ` ${newUserCount} 个用户`;
        if (newKeywordCount > 0) {
          if (newUserCount > 0) message += ' 和';
          message += ` ${newKeywordCount} 个关键词`;
        }
      }

      const duplicateCount =
        (settings.mutedUsers.length - uniqueUsers.length) +
        (settings.blockedKeywords.length - uniqueKeywords.length);

      if (duplicateCount > 0) {
        message += `\nSkipped ${duplicateCount} duplicates`;
      }

      alert(message);
    } catch (error) {
      alert('导入失败，无效格式.');
      console.error('Import error:', error);
    }
  };

  // ===== INITIALIZATION =====
  const init = () => {
    if (!window.location.href.match(/^https:\/\/www\.lofter\.com\/tag\//)) return;



    // Hide original sidebar content
    const sidebar = document.getElementById('rside');
    if (sidebar) {
      // Hide original content but keep it for layout purposes
      sidebar.querySelectorAll('*:not(.control-panel)').forEach(el => {
        el.style.display = 'none';
      });
    }

    createControlPanels();
    filterContent();
    addMuteButtons();
    blockMutedUsers();

    new MutationObserver(() => {
      filterContent();
      addMuteButtons();
      blockMutedUsers();
    }).observe(document.body, { childList: true, subtree: true });
  };

  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
