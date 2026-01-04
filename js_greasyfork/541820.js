// ==UserScript==
// @name         PT站电影评分过滤器
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  可自定义过滤条件的电影过滤器，支持多个PT站点
// @author       Dost
// @match        https://ubits.club/torrents.php*
// @match        https://cyanbug.net/torrents.php*
// @match        https://hdfans.org/torrents.php*
// @match        https://carpt.net/torrents.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541820/PT%E7%AB%99%E7%94%B5%E5%BD%B1%E8%AF%84%E5%88%86%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541820/PT%E7%AB%99%E7%94%B5%E5%BD%B1%E8%AF%84%E5%88%86%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        minIMDbRating: 6.1,
        minDoubanRating: 6.5,
        removeNA: false,
        removeOnlyAllNA: true,
        requireBothRatings: false,
        showDebugInfo: true,
        enabled: true,
        showNotification: true,
        notificationDuration: 8
    };

    // 公共选择器配置
    const COMMON_SELECTORS = {
        imdbSelector: 'div:nth-child(1) > span',
        doubanSelector: 'div:nth-child(2) > span',
        ratingContainerSelector: 'div[style*="flex-direction: column"]'
    };

/* 如何适配新站点？
1. 在@match添加新站点URL（如// @match https://new-site.com/torrents.php*）
2. 在SITE_ADAPTERS中添加适配器配置：
   'new-site.com': {
     name: '站点显示名称',
     rowSelector: 'tr:has(> td > 评分容器父元素)',
     ratingContainerSelector: '包含双评分的div',
     imdbSelector: 'IMDb评分元素选择器',
     doubanSelector: '豆瓣评分元素选择器'
   }
3. 选择器调试技巧：
   - 用开发者工具检查评分区域HTML结构
   - 优先尝试复用现有选择器
   - 开启showDebugInfo查看过滤日志
*/
    // 站点适配器配置
    const SITE_ADAPTERS = {
        'ubits.club': {
            name: 'UBits',
            rowSelector: 'tr:has(> td > table.torrentname > tbody > tr > td.embedded > div[style*="flex-direction: column"])',
            ...COMMON_SELECTORS
        },
        'cyanbug.net': {
            name: 'CyanBug',
            rowSelector: 'tr:has(> td > table.torrentname > tbody > tr > td.embedded > div[style*="flex-direction: column"])',
            ...COMMON_SELECTORS
        },
        'hdfans.org': {
            name: 'HDFans',
            rowSelector: 'tr:has(> td > table.torrentname > tbody > tr > td.embedded > div[style*="flex-direction: column"])',
            ...COMMON_SELECTORS
        },
        'carpt.net': {
            name: 'CARPT',
            rowSelector: 'tr:has(> td > table.torrentname > tbody > tr > td.embedded > div[style*="flex-direction: column"])',
            ...COMMON_SELECTORS
        }
    };

    // 主控制器
    class FilterController {
        config = { ...DEFAULT_CONFIG };
        adapter = SITE_ADAPTERS[location.hostname];
        stats = {
            totalChecked: 0,
            totalRemoved: 0,
            removedByLowIMDb: 0,
            removedByLowDouban: 0,
            removedByNA: 0,
            removedByMissingRating: 0
        };

        constructor() {
            this.loadConfig();
            this.initStyles();
        }

        loadConfig() {
            const saved = GM_getValue('MultiSiteFilterConfig', '{}');
            this.config = {
                ...DEFAULT_CONFIG,
                ...(typeof saved === 'string' ? JSON.parse(saved) : saved)
            };
        }

        initStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .multisite-filter-btn {
                    position: fixed;
                    z-index: 9998;
                    padding: 8px 15px;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    font-family: Arial, sans-serif;
                }
                .multisite-filter-config-btn {
                    bottom: 70px;
                    right: 20px;
                    background: #6c757d;
                }
                .multisite-filter-toggle-btn {
                    bottom: 20px;
                    right: 20px;
                    background: #17a2b8;
                }
                #multisite-filter-notification {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background-color: #f8f9fa;
                    color: #212529;
                    padding: 12px;
                    border-radius: 5px;
                    z-index: 9999;
                    box-shadow: 0 0 15px rgba(0,0,0,0.2);
                    max-width: 320px;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-line;
                    border-left: 4px solid #6c757d;
                    transform: translateX(120%);
                    transition: transform 0.3s ease-out;
                }
                #multisite-filter-config-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    z-index: 10000;
                    box-shadow: 0 0 20px rgba(0,0,0,0.3);
                    border-radius: 8px;
                    width: 350px;
                    max-width: 90%;
                    font-family: Arial, sans-serif;
                }
            `;
            document.head.appendChild(style);
        }

init() {
    // 即使禁用也应该添加控制按钮
    GM_registerMenuCommand(`配置${this.adapter.name}电影过滤器`, () => this.showConfigUI());
    this.addControlButtons();
    
    if (!this.config.enabled) {
        console.log(`${this.adapter.name}电影过滤器已禁用`);
        return;
    }

    this.applyFilters();
}
        applyFilters() {
            document.querySelectorAll(this.adapter.rowSelector).forEach(tr => {
                this.stats.totalChecked++;
                const ratingContainer = tr.querySelector(this.adapter.ratingContainerSelector);
                if (!ratingContainer) return;

                const imdbRating = this.parseRating(
                    ratingContainer.querySelector(this.adapter.imdbSelector)?.textContent
                );
                const doubanRating = this.parseRating(
                    ratingContainer.querySelector(this.adapter.doubanSelector)?.textContent
                );

                if (this.shouldRemoveItem(imdbRating, doubanRating, tr)) {
                    tr.style.display = 'none';
                    tr.dataset.filtered = 'true';
                    this.stats.totalRemoved++;
                }
            });

            this.showResults();
        }

        parseRating(ratingText) {
            if (!ratingText) return { valid: false, isNA: true };

            const text = ratingText.trim();
            if (text === 'N/A' || text === '' || text === '-') {
                return { valid: false, isNA: true };
            }

            const value = parseFloat(text);
            return isNaN(value)
                ? { valid: false, isNA: true }
                : { valid: true, isNA: false, value };
        }

        shouldRemoveItem(imdbRating, doubanRating, tr) {
            let shouldRemove = false;
            const removeReasons = [];

            // 检查双评分要求
            if (this.config.requireBothRatings && (!imdbRating.valid || !doubanRating?.valid)) {
                shouldRemove = true;
                removeReasons.push('缺少有效评分');
                this.stats.removedByMissingRating++;
            }

            // 检查N/A
            if (this.config.removeNA) {
                const imdbNA = imdbRating.isNA;
                const doubanNA = doubanRating ? doubanRating.isNA : true;

                if (this.config.removeOnlyAllNA ? imdbNA && doubanNA : imdbNA || doubanNA) {
                    shouldRemove = true;
                    removeReasons.push(this.config.removeOnlyAllNA ? '双评分均为N/A' : '存在N/A评分');
                    this.stats.removedByNA++;
                }
            }

            // 检查评分
            if (imdbRating.valid && this.config.minIMDbRating > 0 && imdbRating.value < this.config.minIMDbRating) {
                shouldRemove = true;
                removeReasons.push(`IMDb ${imdbRating.value} < ${this.config.minIMDbRating}`);
                this.stats.removedByLowIMDb++;
            }

            if (doubanRating?.valid && this.config.minDoubanRating > 0 && doubanRating.value < this.config.minDoubanRating) {
                shouldRemove = true;
                removeReasons.push(`豆瓣 ${doubanRating.value} < ${this.config.minDoubanRating}`);
                this.stats.removedByLowDouban++;
            }

            if (shouldRemove && this.config.showDebugInfo) {
                console.log(`删除项目: ${removeReasons.join('; ')}`, tr);
            }

            return shouldRemove;
        }

        addControlButtons() {
            // 移除旧按钮
            document.querySelectorAll('#multisite-filter-config-btn, #multisite-filter-toggle-btn')
                   .forEach(btn => btn.remove());

            // 配置按钮
            const configBtn = document.createElement('button');
            configBtn.id = 'multisite-filter-config-btn';
            configBtn.className = 'multisite-filter-btn multisite-filter-config-btn';
            configBtn.textContent = `⚙️ ${this.adapter.name}过滤器配置`;
            configBtn.addEventListener('click', () => this.showConfigUI());

            // 切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'multisite-filter-toggle-btn';
            toggleBtn.className = 'multisite-filter-btn multisite-filter-toggle-btn';
            toggleBtn.textContent = '👁️ 显示被过滤';

            let showFiltered = false;
            toggleBtn.addEventListener('click', () => {
                showFiltered = !showFiltered;
                toggleBtn.textContent = showFiltered ? '👁️ 隐藏被过滤' : '👁️ 显示被过滤';
                this.toggleFilteredItems(showFiltered);
            });

            document.body.append(configBtn, toggleBtn);
        }

        toggleFilteredItems(show) {
            document.querySelectorAll('tr[data-filtered="true"]')
                   .forEach(row => row.style.display = show ? '' : 'none');
        }

        showResults() {
            const resultLines = [
                `${this.adapter.name}电影过滤结果 (共检查 ${this.stats.totalChecked} 个项目)`,
                `-------------------------------------`,
                `隐藏总数: ${this.stats.totalRemoved}`,
                ...(this.stats.removedByLowIMDb > 0 ? [`- IMDb评分过低: ${this.stats.removedByLowIMDb}`] : []),
                ...(this.stats.removedByLowDouban > 0 ? [`- 豆瓣评分过低: ${this.stats.removedByLowDouban}`] : []),
                ...(this.stats.removedByNA > 0 ? [`- N/A评分: ${this.stats.removedByNA}`] : []),
                ...(this.stats.removedByMissingRating > 0 ? [`- 缺少有效评分: ${this.stats.removedByMissingRating}`] : []),
                `-------------------------------------`,
                `当前过滤条件:`,
                `- 最低IMDb评分: ${this.config.minIMDbRating > 0 ? this.config.minIMDbRating : '不限制'}`,
                `- 最低豆瓣评分: ${this.config.minDoubanRating > 0 ? this.config.minDoubanRating : '不限制'}`,
                `- 删除N/A: ${this.config.removeNA ? (this.config.removeOnlyAllNA ? '仅双N/A' : '任意N/A') : '否'}`,
                `- 要求双评分: ${this.config.requireBothRatings ? '是' : '否'}`,
                `- 过滤器状态: ${this.config.enabled ? '启用' : '禁用'}`
            ];

            console.log(resultLines.join('\n'));
            if (this.config.showNotification) {
                this.showNotification(resultLines.join('\n'), this.config.notificationDuration * 1000);
            }
        }

        showNotification(message, duration = 8000) {
            const existing = document.getElementById('multisite-filter-notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.id = 'multisite-filter-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => notification.style.transform = 'translateX(0)', 100);

            const hideTimer = setTimeout(() => {
                notification.style.transition = 'opacity 1s';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 1000);
            }, duration);

            notification.addEventListener('mouseenter', () => clearTimeout(hideTimer));
            notification.addEventListener('mouseleave', () => {
                notification.style.opacity = '1';
                setTimeout(() => {
                    notification.style.transition = 'opacity 1s';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 1000);
                }, duration);
            });
        }

        showConfigUI() {
            const existing = document.getElementById('multisite-filter-config-dialog');
            if (existing) existing.remove();

            const dialog = document.createElement('div');
            dialog.id = 'multisite-filter-config-dialog';
            dialog.innerHTML = `
                <h3 style="margin-top:0;color:#495057">${this.adapter.name}电影过滤器配置</h3>
                <div style="margin-bottom:15px">
                    <label style="display:flex;align-items:center">
                        <input type="checkbox" id="multisite-filter-enabled" ${this.config.enabled ? 'checked' : ''} style="margin-right:8px">
                        启用过滤器
                    </label>
                </div>

                <div style="margin:20px 0;border-top:1px solid #eee;padding-top:15px">
                    <h4 style="margin:0 0 10px 0;color:#495057">过滤条件</h4>
                    <div style="margin-bottom:15px">
                        <label style="display:block;margin-bottom:5px;color:#495057">最低IMDb评分:</label>
                        <input type="number" id="multisite-filter-imdb" step="0.1" min="0" max="10" value="${this.config.minIMDbRating}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">
                    </div>
                    <div style="margin-bottom:15px">
                        <label style="display:block;margin-bottom:5px;color:#495057">最低豆瓣评分:</label>
                        <input type="number" id="multisite-filter-douban" step="0.1" min="0" max="10" value="${this.config.minDoubanRating}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">
                    </div>
                    <div style="margin-bottom:15px">
                        <label style="display:flex;align-items:center">
                            <input type="checkbox" id="multisite-filter-remove-na" ${this.config.removeNA ? 'checked' : ''} style="margin-right:8px">
                            只要包含N/A的项目就隐藏
                        </label>
                    </div>
                    <div style="margin-bottom:15px">
                        <label style="display:flex;align-items:center">
                            <input type="checkbox" id="multisite-filter-remove-only-all-na" ${this.config.removeOnlyAllNA ? 'checked' : ''} style="margin-right:8px" ${this.config.removeNA ? '' : 'disabled'}>
                            仅当双评分均为N/A时隐藏
                        </label>
                    </div>
                    <div style="margin-bottom:15px">
                        <label style="display:flex;align-items:center">
                            <input type="checkbox" id="multisite-filter-require-both" ${this.config.requireBothRatings ? 'checked' : ''} style="margin-right:8px">
                            必须同时包含IMDb和豆瓣评分
                        </label>
                    </div>
                </div>

                <div style="margin:20px 0;border-top:1px solid #eee;padding-top:15px">
                    <h4 style="margin:0 0 10px 0;color:#495057">通知设置</h4>
                    <div style="margin-bottom:15px">
                        <label style="display:flex;align-items:center">
                            <input type="checkbox" id="multisite-filter-show-notification" ${this.config.showNotification ? 'checked' : ''} style="margin-right:8px">
                            显示统计窗口
                        </label>
                    </div>
                    <div style="margin-bottom:15px">
                        <label style="display:block;margin-bottom:5px;color:#495057">统计窗口显示时间(秒):</label>
                        <input type="number" id="multisite-filter-notification-duration" min="1" max="60" value="${this.config.notificationDuration}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">
                    </div>
                </div>

                <div style="display:flex;justify-content:space-between;margin-top:20px">
                    <button id="multisite-filter-save" style="padding:8px 15px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer">保存</button>
                    <button id="multisite-filter-cancel" style="padding:8px 15px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer">取消</button>
                </div>
            `;

            document.body.appendChild(dialog);

            document.getElementById('multisite-filter-remove-na').addEventListener('change', function() {
                document.getElementById('multisite-filter-remove-only-all-na').disabled = !this.checked;
            });

            document.getElementById('multisite-filter-save').addEventListener('click', () => {
    this.config = {
        enabled: document.getElementById('multisite-filter-enabled').checked,
        minIMDbRating: parseFloat(document.getElementById('multisite-filter-imdb').value) || 0,
        minDoubanRating: parseFloat(document.getElementById('multisite-filter-douban').value) || 0,
        removeNA: document.getElementById('multisite-filter-remove-na').checked,
        removeOnlyAllNA: document.getElementById('multisite-filter-remove-only-all-na').checked,
        requireBothRatings: document.getElementById('multisite-filter-require-both').checked,
        showNotification: document.getElementById('multisite-filter-show-notification').checked,
        notificationDuration: parseInt(document.getElementById('multisite-filter-notification-duration').value) || 8
    };

    GM_setValue('MultiSiteFilterConfig', JSON.stringify(this.config));
    dialog.remove();
    this.resetFilters();
    
    // 更新按钮状态
    this.addControlButtons();

    if (this.config.enabled) {
        this.applyFilters();
    } else if (this.config.showNotification) {
        this.showNotification(`${this.adapter.name}电影过滤器已禁用`);
    }
});

            document.getElementById('multisite-filter-cancel').addEventListener('click', () => dialog.remove());
        }

        resetFilters() {
            document.querySelectorAll('tr[data-filtered="true"]').forEach(row => {
                row.style.display = '';
                row.removeAttribute('data-filtered');
            });
        }
    }

    // 初始化
    const controller = new FilterController();
    window.addEventListener('load', () => controller.init());
})();