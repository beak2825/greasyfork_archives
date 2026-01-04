/**
name => 自動點選元素函式庫
description => 根據網址(正規表達式)自動點選指定元素的函式庫，提供點選規則與點選任務的 CRUD 操作。
version => 1.0.2
author => Max
namespace => https://github.com/Max46656
license => MPL2.0
本程式具有以下依賴，須添加在你使用的腳本中
@grant        GM_getValue
@grant        GM_setValue
@grant        GM_info
*/

class RuleManager {
        /**
         * 初始化規則管理器，從儲存中載入點選規則。
         */
    constructor() {
        this.clickRules = GM_getValue('clickRules', { rules: [] });
    }

	/**
         * 添加新點選規則，檢查是否重複。
         * @param {Object} newRule - 新規則物件。
         * @param {string} newRule.ruleName - 規則名稱。
         * @param {string} newRule.urlPattern - 網址正規表達式。
         * @param {string} newRule.selector - 元素選擇器。
         * @param {string} newRule.selectorType - 選擇器類型（css 或 xpath）。
         * @param {number} [newRule.nthElement=1] - 點選第幾個符合元素（從 1 開始）。
         * @param {number} [newRule.clickDelay=1000] - 點選間隔（毫秒）。
         * @param {boolean} [newRule.keepClicking=false] - 是否持續點選。
         * @param {boolean} [newRule.ifLinkOpen=false] - 若為連結是否跳轉。
         * @returns {boolean} - 添加成功返回 true，已存在返回 false。
         */
    addRule(newRule) {
        const exists = this.clickRules.rules.some(rule =>
                                                  rule.ruleName === newRule.ruleName &&
                                                  rule.urlPattern === newRule.urlPattern &&
                                                  rule.selector === newRule.selector
                                                 );
        if (exists) {
            console.log(`${GM_info.script.name}: 規則 "${newRule.ruleName}" 已存在,跳過添加`);
            return false;
        }
        this.clickRules.rules.push(newRule);
        this.updateRules();
        console.log(`${GM_info.script.name}: 規則 "${newRule.ruleName}" 添加成功`);
        return true;
    }

        /**
         * 更新指定索引的點擊規則。
         * @param {number} index - 規則索引。
         * @param {Object} updatedRule - 更新後的規則物件，結構同 addRule.
         * @throws {Error} 若索引無效，拋出錯誤。
         */
    updateRule(index, updatedRule) {
        if (index < 0 || index >= this.clickRules.rules.length) {
            throw new Error(`Invalid rule index: ${index}`);
        }
        this.clickRules.rules[index] = updatedRule;
        this.updateRules();
    }

		/**
         * 刪除指定索引的點擊規則。
         * @param {number} index - 規則索引。
         * @throws {Error} 若索引無效，拋出錯誤。
         */
    deleteRule(index) {
        if (index < 0 || index >= this.clickRules.rules.length) {
            throw new Error(`Invalid rule index: ${index}`);
        }
        this.clickRules.rules.splice(index, 1);
        this.updateRules();
    }

        /**
         * 獲取點擊規則，可按網址過濾。
         * @param {string} [filter=null] - 過濾網址，若為 null 返回所有規則。
         * @returns {Array<Object>} - 符合條件的規則陣列。
         */
    getRules(filter = null) {
        if (!filter) return this.clickRules.rules;
        return this.clickRules.rules.filter(rule => {
            try {
                return new RegExp(rule.urlPattern).test(filter);
            } catch (e) {
                console.warn(`${GM_info.script.name}: Invalid regex in rule "${rule.ruleName}": ${rule.urlPattern}`);
                return false;
            }
        });
    }

        /**
         * 將當前規則儲存至持久化儲存。
         */
    updateRules() {
        GM_setValue('clickRules', this.clickRules);
    }
}

class ClickTaskManager {
        /**
         * 初始化任務管理器，關聯規則管理器。
         * @param {RuleManager} ruleManager - 規則管理器實例。
         */
    constructor(ruleManager) {
        this.ruleManager = ruleManager;
        this.intervalIds = {};
        this.isRunningTasks = false;
        this.runTasksTimeout = null;
    }

        /**
         * 為指定規則添加點擊任務，定期執行點擊。
         * @param {number} ruleIndex - 規則索引。
         * @param {string} [source='manual'] - 任務來源（用於日誌）。
         * @returns {number} - 任務的 setInterval ID.
         * @throws {Error} 若規則索引無效或規則缺少必要屬性，拋出錯誤。
         */
    addTask(ruleIndex, source = 'manual') {
        const rule = this.ruleManager.getRules()[ruleIndex];
        if (!rule) {
            throw new Error(`Invalid rule index: ${ruleIndex}`);
        }
        if (!rule.urlPattern || !rule.selector) {
            throw new Error(`Invalid rule: missing urlPattern or selector`);
        }
        if (this.intervalIds[ruleIndex]) {
            clearInterval(this.intervalIds[ruleIndex]);
            delete this.intervalIds[ruleIndex];
            console.log(`${GM_info.script.name}: Cleared existing task for rule "${rule.ruleName}" (index: ${ruleIndex})`);
        }
        const intervalId = setInterval(() => {
            const clicked = this.autoClick(rule, ruleIndex);
            if (clicked && !rule.keepClicking) {
                clearInterval(this.intervalIds[ruleIndex]);
                delete this.intervalIds[ruleIndex];
                console.log(`${GM_info.script.name}: Task stopped for rule "${rule.ruleName}" (index: ${ruleIndex}) due to successful click and keepClicking=false`);
            }
        }, rule.clickDelay || 1000);
        this.intervalIds[ruleIndex] = intervalId;
        console.log(`${GM_info.script.name}: Task started for rule "${rule.ruleName}" (index: ${ruleIndex}, intervalId: ${intervalId}, source: ${source})`);
        return intervalId;
    }

        /**
         * 為所有未執行任務的規則啟動點擊任務。
         * @param {string} [source='manual'] - 任務來源（用於日誌）。
         */
    runTasks(source = 'manual') {
        if (this.isRunningTasks) {
            console.log(`${GM_info.script.name}: runTasks already in progress, skipping (source: ${source})`);
            return;
        }
        this.isRunningTasks = true;
        console.log(`${GM_info.script.name}: Starting runTasks (source: ${source}, rules: ${this.ruleManager.getRules().length})`);
        this.ruleManager.getRules().forEach((rule, index) => {
            if (!this.intervalIds[index]) {
                try {
                    this.addTask(index, source);
                } catch (e) {
                    console.warn(`${GM_info.script.name}: Failed to start task for rule "${rule.ruleName}" (index: ${index}): ${e.message}`);
                }
            } else {
                console.log(`${GM_info.script.name}: Skipped task for rule "${rule.ruleName}" (index: ${index}) as it is already running`);
            }
        });
        this.isRunningTasks = false;
    }

        /**
         * 清除所有正在執行的點擊任務。
         * @param {string} [source='manual'] - 任務來源（用於日誌）。
         * @returns {number} - 清除的任務數量。
         */
    clearTasks(source = 'manual') {
        const clearedIds = Object.keys(this.intervalIds);
        clearedIds.forEach(index => {
            clearInterval(this.intervalIds[index]);
            console.log(`${GM_info.script.name}: Cleared task for rule index ${index} (intervalId: ${this.intervalIds[index]}, source: ${source})`);
            delete this.intervalIds[index];
        });
        if (this.runTasksTimeout) {
            clearTimeout(this.runTasksTimeout);
            this.runTasksTimeout = null;
            console.log(`${GM_info.script.name}: Cleared pending runTasks timeout (source: ${source})`);
        }
        return clearedIds.length;
    }

        /**
         * 防抖執行 runTasks,限制短時間內多次調用。
         * @param {string} [source='manual'] - 任務來源（用於日誌）。
         * @param {number} [delay=100] - 防抖延遲時間（毫秒）。
         */
    debounceRunTasks(source = 'manual', delay = 100) {
        if (this.runTasksTimeout) {
            clearTimeout(this.runTasksTimeout);
            console.log(`${GM_info.script.name}: Debounced previous runTasks (source: ${source})`);
        }
        this.runTasksTimeout = setTimeout(() => {
            this.runTasks(source);
            this.runTasksTimeout = null;
        }, delay);
        console.log(`${GM_info.script.name}: Scheduled debounced runTasks (source: ${source}, delay: ${delay}ms)`);
    }

        /**
         * 根據規則執行自動點擊。
         * @param {Object} rule - 點擊規則物件。
         * @param {number} ruleIndex - 規則索引。
         * @returns {boolean} - 點擊成功返回 true,失敗返回 false.
         */
    autoClick(rule, ruleIndex) {
        try {
            const urlRegex = new RegExp(rule.urlPattern);
            if (!urlRegex.test(window.location.href)) {
                return false;
            }

            const elements = this.getElements(rule.selectorType, rule.selector);
            if (elements.length === 0) {
                console.warn(`${GM_info.script.name}: No elements found for rule "${rule.ruleName}": ${rule.selector}`);
                return false;
            }

            if (rule.nthElement < 1 || rule.nthElement > elements.length) {
                console.warn(`${GM_info.script.name}: Invalid nthElement for rule "${rule.ruleName}": ${rule.nthElement}, found ${elements.length} elements`);
                return false;
            }

            const targetElement = elements[rule.nthElement - 1];
            if (targetElement) {
                console.log(`${GM_info.script.name}: Successfully clicked element for rule "${rule.ruleName}":`, targetElement);
                if (rule.ifLinkOpen && targetElement.tagName === "A" && targetElement.href) {
                    window.location.href = targetElement.href;
                } else {
                    targetElement.click();
                }
                return true;
            } else {
                console.warn(`${GM_info.script.name}: Target element not found for rule "${rule.ruleName}"`);
                return false;
            }
        } catch (e) {
            console.warn(`${GM_info.script.name}: Failed to execute rule "${rule.ruleName}": ${e.message}`);
            return false;
        }
    }

        /**
         * 根據選擇器類型獲取 DOM 元素。
         * @param {string} selectorType - 選擇器類型（css 或 xpath）。
         * @param {string} selector - 選擇器表達式。
         * @returns {Array<HTMLElement>} - 匹配的元素陣列。
         */
    getElements(selectorType, selector) {
        try {
            if (selectorType === 'xpath') {
                const nodes = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const elements = [];
                for (let i = 0; i < nodes.snapshotLength; i++) {
                    elements.push(nodes.snapshotItem(i));
                }
                return elements;
            } else if (selectorType === 'css') {
                return Array.from(document.querySelectorAll(selector));
            }
            return [];
        } catch (e) {
            console.warn(`${GM_info.script.name}: Invalid selector "${selector}": ${e.message}`);
            return [];
        }
    }
}

class ClickController {
        /**
         * 初始化控制器，創建規則和任務管理器。
         */
    constructor() {
        this.ruleManager = new RuleManager();
        this.clickTaskManager = new ClickTaskManager(this.ruleManager);
    }

        /**
         * 驗證規則的合法性。
         * @param {Object} rule - 待驗證的規則物件。
         * @param {string} rule.urlPattern - 網址正規表達式。
         * @param {string} rule.selector - 元素選擇器。
         * @param {string} rule.selectorType - 選擇器類型（css 或 xpath）。
         * @returns {Object} - 驗證結果，{ success: boolean, error: string|null }。
         */
    validateRule(rule) {
        try {
            new RegExp(rule.urlPattern);
        } catch (e) {
            return { success: false, error: `無效的正規表達式: ${rule.urlPattern}` };
        }
        if (!rule.selector || !['css', 'xpath'].includes(rule.selectorType)) {
            return { success: false, error: `無效的選擇器: ${rule.selector}` };
        }
        return { success: true };
    }

        /**
         * 添加新點擊規則，包含驗證和去重。
         * @param {Object} rule - 新規則物件，結構同 RuleManager.addRule.
         * @returns {Object} - 添加結果，{ success: boolean, error: string|null }。
         */
    addRule(rule) {
        const validation = this.validateRule(rule);
        if (!validation.success) {
            return validation;
        }
        try {
            const added = this.ruleManager.addRule({
                ruleName: rule.ruleName || `規則 ${this.ruleManager.getRules().length + 1}`,
                urlPattern: rule.urlPattern,
                selectorType: rule.selectorType,
                selector: rule.selector,
                nthElement: parseInt(rule.nthElement) || 1,
                clickDelay: parseInt(rule.clickDelay) || 1000,
                keepClicking: Boolean(rule.keepClicking),
                ifLinkOpen: Boolean(rule.ifLinkOpen)
            });
            return { success: added, error: added ? null : `規則 "${rule.ruleName}" 已存在` };
        } catch (e) {
            return { success: false, error: `添加規則失敗: ${e.message}` };
        }
    }

        /**
         * 獲取點擊規則，可按網址過濾。
         * @param {string} [filter=null] - 過濾網址，若為 null 返回所有規則。
         * @returns {Object} - 獲取結果，{ success: boolean, data: Array<Object>, error: string|null }。
         */
    getRules(filter = null) {
        try {
            const rules = this.ruleManager.getRules(filter);
            return { success: true, data: rules };
        } catch (e) {
            return { success: false, error: `獲取規則失敗: ${e.message}` };
        }
    }

        /**
         * 更新指定索引的點擊規則，並重新啟動任務。
         * @param {number} index - 規則索引。
         * @param {Object} rule - 更新後的規則物件，結構同 addRule.
         * @returns {Object} - 更新結果，{ success: boolean, error: string|null }。
         */
    updateRule(index, rule) {
        const validation = this.validateRule(rule);
        if (!validation.success) {
            return validation;
        }
        try {
            this.ruleManager.updateRule(index, {
                ruleName: rule.ruleName || `規則 ${index + 1}`,
                urlPattern: rule.urlPattern,
                selectorType: rule.selectorType,
                selector: rule.selector,
                nthElement: parseInt(rule.nthElement) || 1,
                clickDelay: parseInt(rule.clickDelay) || 1000,
                keepClicking: Boolean(rule.keepClicking),
                ifLinkOpen: Boolean(rule.ifLinkOpen)
            });
            this.clickTaskManager.clearTasks('updateRule');
            this.clickTaskManager.debounceRunTasks('updateRule');
            return { success: true };
        } catch (e) {
            return { success: false, error: `更新規則失敗: ${e.message}` };
        }
    }

        /**
         * 刪除指定索引的點擊規則，並重新啟動任務。
         * @param {number} index - 規則索引。
         * @returns {Object} - 刪除結果，{ success: boolean, error: string|null }。
         */
    deleteRule(index) {
        try {
            this.ruleManager.deleteRule(index);
            this.clickTaskManager.clearTasks('deleteRule');
            this.clickTaskManager.debounceRunTasks('deleteRule');
            return { success: true };
        } catch (e) {
            return { success: false, error: `刪除規則失敗: ${e.message}` };
        }
    }

        /**
         * 為指定規則添加點擊任務。
         * @param {number} ruleIndex - 規則索引。
         * @returns {Object} - 添加結果，{ success: boolean, taskId: number, error: string|null }。
         */
    addTask(ruleIndex) {
        try {
            const taskId = this.clickTaskManager.addTask(ruleIndex, 'addTask');
            return { success: true, taskId };
        } catch (e) {
            return { success: false, error: `添加任務失敗: ${e.message}` };
        }
    }

        /**
         * 啟動所有點擊任務，啟用防抖。
         * @returns {Object} - 執行結果，{ success: boolean, error: string|null }。
         */
    runTasks() {
        try {
            this.clickTaskManager.debounceRunTasks('runTasks');
            return { success: true };
        } catch (e) {
            return { success: false, error: `執行任務失敗: ${e.message}` };
        }
    }

        /**
         * 清除所有點擊任務。
         * @returns {Object} - 清除結果，{ success: boolean, data: { clearedCount: number }, error: string|null }。
         */
    clearTasks() {
        try {
            const clearedCount = this.clickTaskManager.clearTasks('clearTasks');
            return { success: true, data: { clearedCount } };
        } catch (e) {
            return { success: false, error: `清除任務失敗: ${e.message}` };
        }
    }
}


window.ClickItForYou = ClickController;
