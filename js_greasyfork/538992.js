// ==UserScript==
// @name         Greasyfork Spam Filter
// @name:en      Greasyfork Spam Filter
// @name:vi      Bộ lọc Spam cho Greasyfork
// @name:zh-CN   Greasyfork 垃圾内容过滤器
// @name:ru      Фильтр спама для Greasyfork
// @namespace    violetmonkey
// @version      1.2.0
// @description  Hides spam and promotional content on Greasyfork discussions.
// @description:en Hides spam and promotional content on Greasyfork discussions.
// @description:vi  Ẩn nội dung rác và quảng cáo trong các cuộc thảo luận trên Greasyfork.
// @description:zh-CN 隐藏 Greasyfork 讨论中的垃圾信息和推广内容。
// @description:ru  Скрывает спам и рекламный контент в обсуждениях Greasyfork.
// @author       Yuusei
// @match        https://greasyfork.org/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/538992/Greasyfork%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/538992/Greasyfork%20Spam%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- INTERNATIONALIZATION (I18N) ---
    const I18N = {
        'en': {
            settingsTitle: 'Spam Filter Settings',
            statusLabel: 'Filter Status',
            enabledText: 'Enabled',
            disabledText: 'Disabled',
            keywordsLabel: 'Spam Keywords (one per line)',
            sensitivityLabel: 'Sensitivity',
            sensitivityHint: '(1=Lax, 5=Strict)',
            showCountLabel: 'Show Filtered Post Count',
            yesText: 'Yes',
            noText: 'No',
            cancelButton: 'Cancel',
            saveButton: 'Save and Apply',
            filteredMessage: (count) => `Filtered ${count} spam/promotional post(s).`,
            menuTitle: 'Greasyfork Spam Filter Settings'
        },
        'vi': {
            settingsTitle: 'Cài đặt Bộ lọc Spam',
            statusLabel: 'Trạng thái Lọc',
            enabledText: 'Đã bật',
            disabledText: 'Đã tắt',
            keywordsLabel: 'Từ khóa Spam (mỗi từ một dòng)',
            sensitivityLabel: 'Độ nhạy',
            sensitivityHint: '(1=Nhẹ, 5=Nghiêm ngặt)',
            showCountLabel: 'Hiển thị số bài đã lọc',
            yesText: 'Có',
            noText: 'Không',
            cancelButton: 'Hủy',
            saveButton: 'Lưu và Áp dụng',
            filteredMessage: (count) => `Đã lọc ${count} bài viết rác/quảng cáo.`,
            menuTitle: 'Cài đặt Bộ lọc Spam Greasyfork'
        },
        'zh-CN': {
            settingsTitle: '垃圾内容过滤器设置',
            statusLabel: '过滤器状态',
            enabledText: '已启用',
            disabledText: '已禁用',
            keywordsLabel: '垃圾内容关键词（每行一个）',
            sensitivityLabel: '灵敏度',
            sensitivityHint: '(1=宽松, 5=严格)',
            showCountLabel: '显示已过滤的帖子数量',
            yesText: '是',
            noText: '否',
            cancelButton: '取消',
            saveButton: '保存并应用',
            filteredMessage: (count) => `已过滤 ${count} 个垃圾/推广帖子。`,
            menuTitle: 'Greasyfork 垃圾内容过滤器设置'
        },
        'ru': {
            settingsTitle: 'Настройки фильтра спама',
            statusLabel: 'Статус фильтра',
            enabledText: 'Включено',
            disabledText: 'Выключено',
            keywordsLabel: 'Ключевые слова для спама (по одному в строке)',
            sensitivityLabel: 'Чувствительность',
            sensitivityHint: '(1=Слабая, 5=Строгая)',
            showCountLabel: 'Показывать количество отфильтрованных постов',
            yesText: 'Да',
            noText: 'Нет',
            cancelButton: 'Отмена',
            saveButton: 'Сохранить и применить',
            filteredMessage: (count) => `Отфильтровано ${count} спам/рекламных постов.`,
            menuTitle: 'Настройки фильтра спама Greasyfork'
        }
    };
    const lang = Object.keys(I18N).find(k => navigator.language.startsWith(k)) || 'en';
    const T = I18N[lang];


    // --- DEFAULTS & CONFIGURATION ---
    const DEFAULTS = {
        spamKeywords: [
            'review', 'supplement', 'weight loss', 'diet', 'keto', 'cbd',
            'bitcoin', 'crypto', 'earn money', 'make money', 'be careful',
            'honest insights', 'hard truths', 'patches', 'sleep patches',
            'wellamoon', 'scam', 'official site', 'free trial', 'buy now',
            'click here', 'limited time', 'special offer', 'miracle',
            'amazing', '{ be careful }', 'insights and hard truths'
        ],
        sensitivity: 2,
        showFilteredCount: true,
        enabled: true,
    };
    let config = {};

    // --- CSS STYLES (DARK UI) ---
    const styles = `
        .gfsf-modal-backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
        }
        .gfsf-modal-content {
            background-color: #2b2b2b; color: #e0e0e0; border-radius: 8px;
            padding: 24px; width: 90%; max-width: 550px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            border: 1px solid #444;
        }
        .gfsf-modal-content h2 {
            margin: 0 0 20px; font-size: 22px; color: #fff; border-bottom: 1px solid #444; padding-bottom: 10px;
        }
        .gfsf-form-group { margin-bottom: 18px; }
        .gfsf-form-group label {
            display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #ccc;
        }
        .gfsf-form-group textarea, .gfsf-form-group input, .gfsf-form-group select {
            width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #555;
            font-size: 14px; background-color: #1e1e1e; color: #e0e0e0;
            box-sizing: border-box;
        }
        .gfsf-form-group textarea:focus, .gfsf-form-group input:focus, .gfsf-form-group select:focus {
            outline: none; border-color: #4a90e2; box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
        }
        .gfsf-form-group textarea { height: 150px; resize: vertical; }
        .gfsf-sensitivity-group { display: flex; align-items: center; gap: 15px; }
        #gfsf-sensitivity { flex-grow: 1; }
        #gfsf-sensitivity-value { font-weight: bold; font-size: 16px; color: #fff; min-width: 20px; text-align: center; }
        .gfsf-modal-actions {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
        }
        .gfsf-btn {
            padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;
            font-size: 14px; font-weight: 600; transition: background-color 0.2s, transform 0.1s;
        }
        .gfsf-btn:active { transform: translateY(1px); }
        .gfsf-btn-save { background-color: #28a745; color: white; }
        .gfsf-btn-save:hover { background-color: #218838; }
        .gfsf-btn-cancel { background-color: #6c757d; color: white; }
        .gfsf-btn-cancel:hover { background-color: #5a6268; }
        .gfsf-filtered-message {
            margin: 10px 0; padding: 10px 15px; background-color: #3a3a3a;
            border: 1px solid #555; border-radius: 4px; color: #e0e0e0; font-size: 14px;
        }
    `;

    // --- UTILITY FUNCTIONS ---
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // --- CORE FUNCTIONS ---
    function loadConfig() {
        config.spamKeywords = GM_getValue('spamKeywords', DEFAULTS.spamKeywords);
        config.sensitivity = GM_getValue('sensitivity', DEFAULTS.sensitivity);
        config.showFilteredCount = GM_getValue('showFilteredCount', DEFAULTS.showFilteredCount);
        config.enabled = GM_getValue('enabled', DEFAULTS.enabled);
    }

    function saveConfig() {
        GM_setValue('spamKeywords', config.spamKeywords);
        GM_setValue('sensitivity', config.sensitivity);
        GM_setValue('showFilteredCount', config.showFilteredCount);
        GM_setValue('enabled', config.enabled);
    }

    function isSpam(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        const score = config.spamKeywords.reduce((acc, keyword) =>
            lowerText.includes(keyword.toLowerCase()) ? acc + 1 : acc, 0);
        const threshold = Math.max(1, 6 - config.sensitivity);
        return score >= threshold;
    }

    function applyFilter() {
        if (!config.enabled) {
            document.querySelectorAll('.discussion-list-container[data-gfsf-hidden="true"]').forEach(item => {
                item.style.display = '';
                item.removeAttribute('data-gfsf-hidden');
            });
            const messageContainer = document.querySelector('.gfsf-filtered-message');
            if (messageContainer) messageContainer.remove();
            return;
        }

        const discussionContainers = document.querySelectorAll('.discussion-list-container');
        discussionContainers.forEach(container => {
            const title = container.querySelector('.discussion-title')?.textContent.trim() || '';
            const snippet = container.querySelector('.discussion-snippet')?.textContent.trim() || '';
            const combinedText = `${title} ${snippet}`;

            if (isSpam(combinedText)) {
                container.style.display = 'none';
                container.setAttribute('data-gfsf-hidden', 'true');
            } else {
                 container.style.display = '';
                 container.removeAttribute('data-gfsf-hidden');
            }
        });

        const totalFiltered = document.querySelectorAll('[data-gfsf-hidden="true"]').length;
        if (config.showFilteredCount && totalFiltered > 0) {
            showFilteredMessage(totalFiltered);
        } else {
             const messageContainer = document.querySelector('.gfsf-filtered-message');
             if(messageContainer) messageContainer.remove();
        }
    }

    function showFilteredMessage(count) {
        let messageContainer = document.querySelector('.gfsf-filtered-message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'gfsf-filtered-message';
            const discussionList = document.querySelector('.discussion-list');
            if (discussionList) {
                discussionList.prepend(messageContainer);
            }
        }
        messageContainer.textContent = T.filteredMessage(count);
    }

    function createSettingsModal() {
        if (document.querySelector('.gfsf-modal-backdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'gfsf-modal-backdrop';
        backdrop.innerHTML = `
            <div class="gfsf-modal-content">
                <h2>${T.settingsTitle}</h2>
                <div class="gfsf-form-group">
                    <label for="gfsf-enabled">${T.statusLabel}</label>
                    <select id="gfsf-enabled">
                        <option value="true">${T.enabledText}</option>
                        <option value="false">${T.disabledText}</option>
                    </select>
                </div>
                <div class="gfsf-form-group">
                    <label for="gfsf-keywords">${T.keywordsLabel}</label>
                    <textarea id="gfsf-keywords"></textarea>
                </div>
                <div class="gfsf-form-group">
                    <label for="gfsf-sensitivity">${T.sensitivityLabel} <span style="font-weight:normal;color:#999">${T.sensitivityHint}</span></label>
                    <div class="gfsf-sensitivity-group">
                       <input type="range" id="gfsf-sensitivity" min="1" max="5" step="1">
                       <span id="gfsf-sensitivity-value"></span>
                    </div>
                </div>
                <div class="gfsf-form-group">
                    <label for="gfsf-show-count">${T.showCountLabel}</label>
                    <select id="gfsf-show-count">
                        <option value="true">${T.yesText}</option>
                        <option value="false">${T.noText}</option>
                    </select>
                </div>
                <div class="gfsf-modal-actions">
                    <button id="gfsf-btn-cancel" class="gfsf-btn gfsf-btn-cancel">${T.cancelButton}</button>
                    <button id="gfsf-btn-save" class="gfsf-btn gfsf-btn-save">${T.saveButton}</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        // Populate form with current config
        const sensitivitySlider = document.getElementById('gfsf-sensitivity');
        const sensitivityValue = document.getElementById('gfsf-sensitivity-value');
        
        document.getElementById('gfsf-enabled').value = String(config.enabled);
        document.getElementById('gfsf-keywords').value = config.spamKeywords.join('\n');
        sensitivitySlider.value = config.sensitivity;
        sensitivityValue.textContent = config.sensitivity;
        document.getElementById('gfsf-show-count').value = String(config.showFilteredCount);

        // Event Listeners
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
        document.getElementById('gfsf-btn-cancel').addEventListener('click', () => backdrop.remove());
        sensitivitySlider.addEventListener('input', () => { sensitivityValue.textContent = sensitivitySlider.value; });
        
        document.getElementById('gfsf-btn-save').addEventListener('click', () => {
            config.enabled = document.getElementById('gfsf-enabled').value === 'true';
            config.spamKeywords = document.getElementById('gfsf-keywords').value.split('\n').map(k => k.trim()).filter(Boolean);
            config.sensitivity = parseInt(document.getElementById('gfsf-sensitivity').value, 10);
            config.showFilteredCount = document.getElementById('gfsf-show-count').value === 'true';
            
            saveConfig();
            backdrop.remove();
            applyFilter();
        });
    }

    // --- INITIALIZATION ---
    function init() {
        loadConfig();
        GM_addStyle(styles);
        GM_registerMenuCommand(T.menuTitle, createSettingsModal);
        
        applyFilter();

        const debouncedFilter = debounce(applyFilter, 300);
        const observer = new MutationObserver((mutations) => {
             for(const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    if (Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.classList.contains('discussion-list') || node.querySelector('.discussion-list')))) {
                        debouncedFilter();
                        return;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})(); 