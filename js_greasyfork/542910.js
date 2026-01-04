/**
name => ShortcutLibrary
description => 根據網址(正規表達式)聆聽按鍵事件點選指定元素的函式庫，提供點選規則與快捷鍵的 CRUD 操作。
version => 1.2.0
author => Max
namespace => https://github.com/Max46656
license => MPL2.0
本程式具有以下依賴，須添加在你使用的腳本中
@grant        GM_getValue
@grant        GM_setValue
@grant        GM_info
@grant        GM_registerMenuCommand
呼叫方式
shortcutLib = new ShortcutLibrary({
            RuleC: false,
            RuleR: true,
            RuleU: ['shortcut']
        });
*/

class RuleManager {
    constructor() {
        this.clickRules = this.sanitizeRules(GM_getValue('clickRules', { rules: [] }));
    }

    addRule(newRule) {
        this.clickRules.rules.push(newRule);
        this.updateRules();
    }

    updateRule(index, updatedRule) {
        this.clickRules.rules[index] = updatedRule;
        this.updateRules();
    }

    deleteRule(index) {
        this.clickRules.rules.splice(index, 1);
        this.updateRules();
    }

    addRuleFromJSON(jsonString) {
        try {
            const rule = JSON.parse(jsonString);
            if (this.validateRule(rule)) {
                this.addRule(rule);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return false;
        }
    }

    validateRule(rule) {
        const requiredFields = ['ruleName', 'urlPattern', 'selectorType', 'selector', 'nthElement', 'shortcut', 'ifLinkOpen', 'isEnabled'];
        return requiredFields.every(field => field in rule) &&
            typeof rule.ruleName === 'string' &&
            typeof rule.urlPattern === 'string' &&
            ['css', 'xpath'].includes(rule.selectorType) &&
            typeof rule.selector === 'string' &&
            Number.isInteger(rule.nthElement) &&
            typeof rule.shortcut === 'string' &&
            typeof rule.ifLinkOpen === 'boolean' &&
            typeof rule.isEnabled === 'boolean' &&
            this.isValidShortcut(rule.shortcut);
    }

    updateRules() {
        GM_setValue('clickRules', this.clickRules);
    }

    sanitizeRules(clickRules) {
        const defaultRule = {
            ruleName: '',
            urlPattern: '.*',
            selectorType: 'css',
            selector: '',
            nthElement: 1,
            shortcut: 'Control+A',
            ifLinkOpen: false,
            isEnabled: true
        };
        const validRules = clickRules.rules.filter(rule => {
            return rule && typeof rule === 'object' && rule.shortcut && this.isValidShortcut(rule.shortcut);
        }).map(rule => ({
            ...defaultRule,
            ...rule,
            ruleName: rule.ruleName || `規則 ${clickRules.rules.indexOf(rule) + 1}`,
            isEnabled: rule.isEnabled !== undefined ? rule.isEnabled : true
        }));
        return { rules: validRules };
    }

    isValidShortcut(shortcut) {
        const validModifiers = ['Control', 'Alt', 'Shift', 'CapsLock', 'NumLock'];
        if (!shortcut || typeof shortcut !== 'string') return false;
        const parts = shortcut.split('+');
        if (parts.length < 2 || parts.length > 3) return false;
        const mainKey = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);
        return modifiers.every(mod => validModifiers.includes(mod)) &&
            (mainKey.length === 1 || /^F[1-9]|F1[0-2]|Esc|Home|End|PageUp|PageDown|Insert|Delete|Tab|Enter|Eliminate|Backspace|ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(mainKey));
    }

    checkConflicts(newRule, currentUrl, excludeIndex = -1) {
        const conflicts = [];
        this.clickRules.rules.forEach((rule, index) => {
            if (index === excludeIndex) return;
            try {
                if (new RegExp(rule.urlPattern).test(currentUrl)) {
                    if (rule.shortcut.toLowerCase() === newRule.shortcut.toLowerCase()) {
                        conflicts.push({ type: 'shortcut', rule, index });
                    } else if (rule.selector === newRule.selector && rule.nthElement === newRule.nthElement) {
                        conflicts.push({ type: 'element', rule, index });
                    }
                }
            } catch (e) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的正規表達式無效: ${rule.urlPattern}`);
            }
        });
        return conflicts;
    }
}

class ShortcutHandler {
    constructor(ruleManager) {
        this.ruleManager = ruleManager;
        this.keydownHandler = (event) => this.handleKeydown(event);
        window.addEventListener('keydown', this.keydownHandler);
    }

    handleKeydown(event) {
        //console.log(event);
        const currentUrl = window.location.href;
        [...this.ruleManager.clickRules.rules].reverse().some((rule, index) => {
            try {
                if (!rule.isEnabled || !new RegExp(rule.urlPattern).test(currentUrl)) return false;

                const shortcutParts = rule.shortcut.split('+');
                const mainKey = shortcutParts[shortcutParts.length - 1];
                const modifiers = shortcutParts.slice(0, -1);

                const allModifiersPressed = modifiers.every(mod => event.getModifierState(mod));
                const mainKeyPressed = event.key.toUpperCase() === mainKey.toUpperCase();

                if (allModifiersPressed && mainKeyPressed) {
                    event.preventDefault();
                    const originalIndex = this.ruleManager.clickRules.rules.length - 1 - index;
                    this.clickElement(rule, originalIndex);
                    return true;
                }
                return false;
            } catch (e) {
                console.warn(`${GM_info.script.name}: 處理規則 "${rule.ruleName}" 時發生錯誤: ${e}`);
                return false;
            }
        });
        //console.log(this.ruleManager.clickRules.rules);
    }

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
            console.warn(`${GM_info.script.name}: 選擇器 "${selector}" 無效: ${e}`);
            return [];
        }
    }

    clickElement(rule, ruleIndex) {
        try {
            const elements = this.getElements(rule.selectorType, rule.selector);
            if (elements.length === 0) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 未找到符合元素: ${rule.selector}`);
                return false;
            }

            let targetIndex;
            if (rule.nthElement > 0) {
                targetIndex = rule.nthElement - 1;
            } else if (rule.nthElement < 0) {
                targetIndex = elements.length + rule.nthElement;
            } else {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的 nthElement 無效: 0 不允許`);
                return false;
            }

            if (targetIndex < 0 || targetIndex >= elements.length) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的 nthElement 無效: ${rule.nthElement}, 找到 ${elements.length} 個元素`);
                return false;
            }

            const targetElement = elements[targetIndex];
            if (targetElement) {
                console.log(`${GM_info.script.name}: 規則 "${rule.ruleName}" 成功點選元素:`, targetElement);
                if (rule.ifLinkOpen && targetElement.tagName === "A" && targetElement.href) {
                    window.location.href = targetElement.href;
                } else {
                    targetElement.click();
                }
                return true;
            } else {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的目標元素未找到`);
                return false;
            }
        } catch (e) {
            console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 執行失敗: ${e}`);
            return false;
        }
    }
}

class MenuManager {
    constructor(ruleManager, config) {
        this.ruleManager = ruleManager;
        this.config = config;
        this.validModifierCombos = this.generateModifierCombos();
        this.currentExpandedRule = null;
        this.currentExpandedConflict = null;
        this.i18n = {
            'zh-TW': {
                titleAdd: '新增快捷鍵規則',
                titleManage: '管理快捷鍵規則',
                matchingRules: '符合的規則',
                noMatchingRules: '當前網頁無符合的規則。',
                addRuleSection: '新增規則',
                ruleName: '規則名稱：',
                urlPattern: '網址正規表達式：',
                selectorType: '選擇器類型：',
                selector: '選擇器：',
                nthElement: '第幾個元素（正數從頭計，負數從尾計）：',
                shortcutModifiers: '快捷鍵修飾鍵組合：',
                shortcutMainKey: '快捷鍵主鍵：',
                ifLinkOpen: '若為連結則開啟（否則維持預設）：',
                isEnabled: '啟用規則：',
                addRule: '新增規則',
                save: '儲存',
                delete: '刪除',
                ruleNamePlaceholder: '例如：我的規則',
                urlPatternPlaceholder: '例如：https://example.com/.*',
                selectorPlaceholder: '例如：button.submit 或 //button[@class="submit"]',
                nthElementPlaceholder: '例如：1 或 -1（最後一個）',
                mainKeyPlaceholder: '例如：A',
                invalidRegex: '無效的正規表達式',
                invalidSelector: '無效的選擇器',
                invalidMainKey: '無效的主鍵（需為單一字母或數字，例如：A 或 1）',
                conflictingRules: '衝突的規則',
                shortcutConflict: '使用相同的快捷鍵組合',
                elementConflict: '指向相同的目標元素',
                importJSON: '從 JSON 匯入規則'
            },
            'en': {
                titleAdd: 'Add New Shortcut Rule',
                titleManage: 'Manage Shortcut Rules',
                matchingRules: 'Matching Rules',
                noMatchingRules: 'No rules match the current URL.',
                addRuleSection: 'Add New Rule',
                ruleName: 'Rule Name:',
                urlPattern: 'URL Pattern (Regex):',
                selectorType: 'Selector Type:',
                selector: 'Selector:',
                nthElement: 'Nth Element (positive from start, negative from end):',
                shortcutModifiers: 'Shortcut Modifier Combination:',
                shortcutMainKey: 'Shortcut Main Key:',
                ifLinkOpen: 'If it is a link, open it (otherwise keep default):',
                isEnabled: 'Enable Rule:',
                addRule: 'Add Rule',
                save: 'Save',
                delete: 'Delete',
                ruleNamePlaceholder: 'e.g., My Rule',
                urlPatternPlaceholder: 'e.g., https://example\\.com/.*',
                selectorPlaceholder: 'e.g., button.submit or //button[@class="submit"]',
                nthElementPlaceholder: 'e.g., 1 or -1 (last element)',
                mainKeyPlaceholder: 'e.g., A',
                invalidRegex: 'Invalid regular expression',
                invalidSelector: 'Invalid selector',
                invalidMainKey: 'Invalid main key (must be a single character or key, e.g., A or F1)',
                conflictingRules: 'Conflicting Rules',
                shortcutConflict: 'Uses the same shortcut key combination',
                elementConflict: 'Targets the same element',
                importJSON: 'Import Rule from JSON'
            }
        };
    }

    getLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('zh')) return 'zh-TW';
        return 'en';
    }

    validateRule(rule) {
        const i18n = this.i18n[this.getLanguage()];
        try {
            new RegExp(rule.urlPattern);
        } catch (e) {
            alert(`${i18n.invalidRegex}: ${rule.urlPattern}`);
            return false;
        }
        if (!rule.selector || !['css', 'xpath'].includes(rule.selectorType)) {
            alert(`${i18n.invalidSelector}: ${rule.selector}`);
            return false;
        }
        if (!this.validateShortcut(rule.shortcut)) {
            alert(`${i18n.invalidMainKey}: ${rule.shortcut}`);
            return false;
        }
        return true;
    }

    validateShortcut(shortcut) {
        const validModifiers = ['Control', 'Alt', 'Shift', 'CapsLock', 'NumLock'];
        if (!shortcut) return false;
        const parts = shortcut.split('+');
        if (parts.length < 2 || parts.length > 3) return false;
        const mainKey = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);
        return modifiers.every(mod => validModifiers.includes(mod)) &&
            (mainKey.length === 1 || /^F[1-9]|F1[0-2]|Esc|Home|End|PageUp|PageDown|Insert|Delete|Tab|Enter|Eliminate|Backspace|ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(mainKey));
    }

    generateModifierCombos() {
        const modifiers = ['CapsLock', 'NumLock', 'Control', 'Alt', 'Shift'];
        const combos = [];
        for (let i = 0; i < modifiers.length; i++) {
            combos.push(modifiers[i]);
            for (let j = i + 1; j < modifiers.length; j++) {
                combos.push(`${modifiers[i]}-${modifiers[j]}`);
            }
        }
        return combos;
    }

    createRuleElement(rule, ruleIndex) {
        const i18n = this.i18n[this.getLanguage()];
        const modifierCombo = rule.shortcut && this.validateShortcut(rule.shortcut)
        ? rule.shortcut.split('+').slice(0, -1).join('+') || rule.shortcut.split('+')[0]
        : 'Control';
        const mainKey = rule.shortcut && this.validateShortcut(rule.shortcut)
        ? rule.shortcut.split('+').pop()
        : 'A';
        const currentUrl = window.location.href;
        const conflicts = this.ruleManager.checkConflicts(rule, currentUrl, ruleIndex);
        const conflictHtml = conflicts.length > 0 ? `
            <div class="conflictHeader" id="conflictHeader${ruleIndex}">
                <strong>${i18n.conflictingRules}</strong>
            </div>
            <div class="conflictDetails" id="conflictDetails${ruleIndex}" style="display: none;">
                ${conflicts.map(conflict => `
                    <p>${conflict.type === 'shortcut' ? i18n.shortcutConflict : i18n.elementConflict}:
                    ${conflict.rule.ruleName} (快捷鍵: ${conflict.rule.shortcut}, 選擇器: ${conflict.rule.selector}, 第幾個元素: ${conflict.rule.nthElement})</p>
                `).join('')}
            </div>
        ` : '';

        const ruleDiv = document.createElement('div');
        ruleDiv.innerHTML = `
            <div class="ruleHeader" id="ruleHeader${ruleIndex}">
                <strong>${rule.ruleName || `規則 ${ruleIndex + 1}`}</strong>
            </div>
            <div class="readRule" id="readRule${ruleIndex}" style="display: none;">
                <div class="checkbox-container">
                    <label>${i18n.isEnabled}</label>
                    <input type="checkbox" id="updateIsEnabled${ruleIndex}" ${rule.isEnabled ? 'checked' : ''} ${this.config.RuleU.includes('isEnabled') ? '' : 'disabled'}>
                </div>
                <label>${i18n.ruleName}</label>
                <input type="text" id="updateRuleName${ruleIndex}" value="${rule.ruleName || ''}" ${this.config.RuleU.includes('ruleName') ? '' : 'readonly'}>
                <label>${i18n.urlPattern}</label>
                <input type="text" id="updateUrlPattern${ruleIndex}" value="${rule.urlPattern}" ${this.config.RuleU.includes('urlPattern') ? '' : 'readonly'}>
                <label>${i18n.selectorType}</label>
                <select id="updateSelectorType${ruleIndex}" ${this.config.RuleU.includes('selectorType') ? '' : 'disabled'}>
                    <option value="css" ${rule.selectorType === 'css' ? 'selected' : ''}>CSS</option>
                    <option value="xpath" ${rule.selectorType === 'xpath' ? 'selected' : ''}>XPath</option>
                </select>
                <label>${i18n.selector}</label>
                <input type="text" id="updateSelector${ruleIndex}" value="${rule.selector}" ${this.config.RuleU.includes('selector') ? '' : 'readonly'}>
                <label>${i18n.nthElement}</label>
                <input type="number" id="updateNthElement${ruleIndex}" value="${rule.nthElement}" ${this.config.RuleU.includes('nthElement') ? '' : 'readonly'} placeholder="${i18n.nthElementPlaceholder}">
                <label>${i18n.shortcutModifiers}</label>
                <select id="updateModifierCombo${ruleIndex}" ${this.config.RuleU.includes('shortcut') ? '' : 'disabled'}>
                    ${this.validModifierCombos.map(combo => `
                        <option value="${combo}" ${combo === modifierCombo ? 'selected' : ''}>${combo}</option>
                    `).join('')}
                </select>
                <label>${i18n.shortcutMainKey}</label>
                <input type="text" id="updateMainKey${ruleIndex}" value="${mainKey}" ${this.config.RuleU.includes('shortcut') ? '' : 'readonly'} placeholder="${i18n.mainKeyPlaceholder}">
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="updateIfLink${ruleIndex}" ${rule.ifLinkOpen ? 'checked' : ''} ${this.config.RuleU.includes('ifLinkOpen') ? '' : 'disabled'}>
                </div>
                <button id="updateRule${ruleIndex}">${i18n.save}</button>
                ${this.config.RuleD ? `<button id="deleteRule${ruleIndex}">${i18n.delete}</button>` : ''}
                ${conflictHtml}
            </div>
        `;
        return ruleDiv;
    }

    initAddRuleMenu() {
        const i18n = this.i18n[this.getLanguage()];
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.background = 'rgb(36, 36, 36)';
        menu.style.color = 'rgb(204, 204, 204)';
        menu.style.border = '1px solid rgb(80, 80, 80)';
        menu.style.padding = '10px';
        menu.style.zIndex = '10000';
        menu.style.maxWidth = '400px';
        menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        menu.innerHTML = `
            <style>
                h1 { font-size: 2rem; }
                h2 { font-size: 1.5rem; }
                #shortcutMenu { overflow-y: auto; max-height: 80vh; }
                #shortcutMenu input:not([type="checkbox"]), #shortcutMenu select, #shortcutMenu button, #shortcutMenu textarea {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 5px 0;
                    padding: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }
                #shortcutMenu input[type="checkbox"] {
                    margin: 0 5px 0 0;
                    width: auto;
                    vertical-align: middle;
                }
                #shortcutMenu button { cursor: pointer; }
                #shortcutMenu button:hover { background: rgb(70, 70, 70); }
                #shortcutMenu label { margin-top: 5px; display: block; }
                #shortcutMenu .checkbox-container { display: flex; align-items: center; margin-top: 5px; }
                #shortcutMenu .headerContainer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                #shortcutMenu .closeButton { width: auto; padding: 5px 10px; margin: 0; }
            </style>
            <div id="shortcutMenu">
                <div class="headerContainer">
                    <h1>${GM_info.script.name}</h1>
                    <button id="closeMenu" class="closeButton">✕</button>
                </div>
                <h2>${i18n.titleAdd}</h2>
                <div class="checkbox-container">
                    <label>${i18n.isEnabled}</label>
                    <input type="checkbox" id="isEnabled" checked ${this.config.RuleU.includes('isEnabled') ? '' : 'disabled'}>
                </div>
                <label>${i18n.ruleName}</label>
                <input type="text" id="ruleName" placeholder="${i18n.ruleNamePlaceholder}" ${this.config.RuleU.includes('ruleName') ? '' : 'readonly'}>
                <label>${i18n.urlPattern}</label>
                <input type="text" id="urlPattern" value="${window.location.href}" ${this.config.RuleU.includes('urlPattern') ? '' : 'readonly'}>
                <label>${i18n.selectorType}</label>
                <select id="selectorType" ${this.config.RuleU.includes('selectorType') ? '' : 'disabled'}>
                    <option value="css">CSS</option>
                    <option value="xpath">XPath</option>
                </select>
                <label>${i18n.selector}</label>
                <input type="text" id="selector" placeholder="${i18n.selectorPlaceholder}" ${this.config.RuleU.includes('selector') ? '' : 'readonly'}>
                <label>${i18n.nthElement}</label>
                <input type="number" id="nthElement" value="1" placeholder="${i18n.nthElementPlaceholder}" ${this.config.RuleU.includes('nthElement') ? '' : 'readonly'}>
                <label>${i18n.shortcutModifiers}</label>
                <select id="modifierCombo" ${this.config.RuleU.includes('shortcut') ? '' : 'disabled'}>
                    ${this.validModifierCombos.map(combo => `<option value="${combo}">${combo}</option>`).join('')}
                </select>
                <label>${i18n.shortcutMainKey}</label>
                <input type="text" id="mainKey" placeholder="${i18n.mainKeyPlaceholder}" ${this.config.RuleU.includes('shortcut') ? '' : 'readonly'}>
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="ifLinkOpen" ${this.config.RuleU.includes('ifLinkOpen') ? '' : 'disabled'}>
                </div>
                <button id="addRule" style="margin-top: 10px;">${i18n.addRule}</button>
                <h3>${i18n.importJSON}</h3>
                <textarea id="jsonInput" rows="5" placeholder="Paste JSON here (e.g., {\"ruleName\":\"Example\",\"urlPattern\":\".*\",\"selectorType\":\"css\",\"selector\":\".btn\",\"nthElement\":1,\"shortcut\":\"Control+B\",\"ifLinkOpen\":false,\"isEnabled\":true})"></textarea>
                <button id="importRule">${i18n.importJSON}</button>
            </div>
        `;
        document.body.appendChild(menu);

        document.getElementById('addRule').addEventListener('click', () => {
            const modifierCombo = document.getElementById('modifierCombo').value;
            const mainKey = document.getElementById('mainKey').value;
            const selector = document.getElementById('selector').value.replace(/"/g, "'");
            const newRule = {
                ruleName: document.getElementById('ruleName').value || `規則 ${this.ruleManager.clickRules.rules.length + 1}`,
                urlPattern: document.getElementById('urlPattern').value,
                selectorType: document.getElementById('selectorType').value,
                selector: selector,
                nthElement: parseInt(document.getElementById('nthElement').value) || 1,
                shortcut: `${modifierCombo}+${mainKey}`,
                ifLinkOpen: document.getElementById('ifLinkOpen').checked,
                isEnabled: document.getElementById('isEnabled').checked
            };
            if (!this.validateRule(newRule)) return;

            const conflicts = this.ruleManager.checkConflicts(newRule, window.location.href);
            conflicts.forEach(conflict => {
                console.warn(`${GM_info.script.name}: 新規則 "${newRule.ruleName}" 檢測到${conflict.type === 'shortcut' ? '相同的快捷鍵組合' : '相同的目標元素'}: 與規則 "${conflict.rule.ruleName}" 衝突 (快捷鍵: ${conflict.rule.shortcut}, 選擇器: ${conflict.rule.selector}, 第幾個元素: ${conflict.rule.nthElement})`);
            });

            this.ruleManager.addRule(newRule);
            document.getElementById('ruleName').value = '';
            document.getElementById('urlPattern').value = '';
            document.getElementById('selector').value = '';
            document.getElementById('nthElement').value = '1';
            document.getElementById('mainKey').value = '';
            document.getElementById('ifLinkOpen').checked = false;
            document.getElementById('isEnabled').checked = true;
            menu.remove();
        });

        document.getElementById('importRule').addEventListener('click', () => {
            const jsonString = document.getElementById('jsonInput').value;
            if (this.ruleManager.addRuleFromJSON(jsonString)) {
                alert('Rule added successfully');
                document.getElementById('jsonInput').value = '';
            } else {
                alert('Invalid JSON or rule format');
            }
        });

        document.getElementById('closeMenu').addEventListener('click', () => {
            menu.remove();
        });
    }

    initManageRulesMenu() {
        const i18n = this.i18n[this.getLanguage()];
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.background = 'rgb(36, 36, 36)';
        menu.style.color = 'rgb(204, 204, 204)';
        menu.style.border = '1px solid rgb(80, 80, 80)';
        menu.style.padding = '10px';
        menu.style.zIndex = '10000';
        menu.style.maxWidth = '400px';
        menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        menu.innerHTML = `
            <style>
                h1 { font-size: 2rem; }
                h2 { font-size: 1.5rem; }
                #shortcutMenu { overflow-y: auto; max-height: 80vh; }
                #shortcutMenu input:not([type="checkbox"]), #shortcutMenu select, #shortcutMenu button {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 5px 0;
                    padding: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }
                #shortcutMenu input[type="checkbox"] {
                    margin: 0 5px 0 0;
                    width: auto;
                    vertical-align: middle;
                }
                #shortcutMenu button { cursor: pointer; }
                #shortcutMenu button:hover { background: rgb(70, 70, 70); }
                #shortcutMenu label { margin-top: 5px; display: block; }
                #shortcutMenu .checkbox-container { display: flex; align-items: center; margin-top: 5px; }
                #shortcutMenu .ruleHeader, #shortcutMenu .conflictHeader { cursor: pointer; background: rgb(50, 50, 50); padding: 5px; margin: 5px 0; border-radius: 3px; }
                #shortcutMenu .readRule, #shortcutMenu .conflictDetails { padding: 5px; border: 1px solid rgb(80, 80, 80); border-radius: 3px; margin-bottom: 5px; }
                #shortcutMenu .headerContainer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                #shortcutMenu .closeButton { width: auto; padding: 5px 10px; margin: 0; }
            </style>
            <div id="shortcutMenu">
                <div class="headerContainer">
                    <h1>${GM_info.script.name}</h1>
                    <button id="closeMenu" class="closeButton">✕</button>
                </div>
                <h2>${i18n.titleManage}</h2>
                <div id="rulesList"></div>
            </div>
        `;
        document.body.appendChild(menu);

        this.updateRulesElement();

        document.getElementById('closeMenu').addEventListener('click', () => {
            this.collapseAllRules();
            this.collapseAllConflicts();
            menu.remove();
        });
    }

    updateRulesElement() {
        const rulesList = document.getElementById('rulesList');
        const i18n = this.i18n[this.getLanguage()];
        rulesList.innerHTML = `<h4>${i18n.matchingRules}</h4>`;
        const currentUrl = window.location.href;
        const matchingRules = this.ruleManager.clickRules.rules.filter(rule => {
            try {
                return new RegExp(rule.urlPattern).test(currentUrl);
            } catch (e) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的正規表達式無效: ${rule.urlPattern}`);
                return false;
            }
        });

        if (matchingRules.length === 0) {
            rulesList.innerHTML += `<p>${i18n.noMatchingRules}</p>`;
            return;
        }

        matchingRules.forEach((rule, index) => {
            const ruleIndex = this.ruleManager.clickRules.rules.indexOf(rule);
            const ruleDiv = this.createRuleElement(rule, ruleIndex);
            rulesList.appendChild(ruleDiv);

            document.getElementById(`ruleHeader${ruleIndex}`).addEventListener('click', () => {
                if (this.currentExpandedRule === ruleIndex) {
                    this.collapseAllRules();
                    this.collapseAllConflicts();
                } else {
                    this.collapseAllRules();
                    this.collapseAllConflicts();
                    const details = document.getElementById(`readRule${ruleIndex}`);
                    details.style.display = 'block';
                    this.currentExpandedRule = ruleIndex;
                }
            });

            const conflictHeader = document.getElementById(`conflictHeader${ruleIndex}`);
            if (conflictHeader) {
                conflictHeader.addEventListener('click', () => {
                    const conflictDetails = document.getElementById(`conflictDetails${ruleIndex}`);
                    if (this.currentExpandedConflict === ruleIndex) {
                        conflictDetails.style.display = 'none';
                        this.currentExpandedConflict = null;
                    } else {
                        this.collapseAllConflicts();
                        conflictDetails.style.display = 'block';
                        this.currentExpandedConflict = ruleIndex;
                    }
                });
            }

            document.getElementById(`updateRule${ruleIndex}`).addEventListener('click', () => {
                const modifierCombo = document.getElementById(`updateModifierCombo${ruleIndex}`).value;
                const mainKey = document.getElementById(`updateMainKey${ruleIndex}`).value;
                const selector = document.getElementById(`updateSelector${ruleIndex}`).value.replace(/"/g, "'");
                const updatedRule = {
                    ruleName: document.getElementById(`updateRuleName${ruleIndex}`).value || `規則 ${ruleIndex + 1}`,
                    urlPattern: document.getElementById(`updateUrlPattern${ruleIndex}`).value,
                    selectorType: document.getElementById(`updateSelectorType${ruleIndex}`).value,
                    selector: selector,
                    nthElement: parseInt(document.getElementById(`updateNthElement${ruleIndex}`).value) || 1,
                    shortcut: `${modifierCombo}+${mainKey}`,
                    ifLinkOpen: document.getElementById(`updateIfLink${ruleIndex}`).checked,
                    isEnabled: document.getElementById(`updateIsEnabled${ruleIndex}`).checked
                };
                if (!this.validateRule(updatedRule)) return;

                const conflicts = this.ruleManager.checkConflicts(updatedRule, window.location.href, ruleIndex);
                conflicts.forEach(conflict => {
                    console.warn(`${GM_info.script.name}: 更新規則 "${updatedRule.ruleName}" 檢測到${conflict.type === 'shortcut' ? '相同的快捷鍵組合' : '相同的目標元素'}: 與規則 "${conflict.rule.ruleName}" 衝突 (快捷鍵: ${conflict.rule.shortcut}, 選擇器: ${conflict.rule.selector}, 第幾個元素: ${conflict.rule.nthElement})`);
                });

                this.ruleManager.updateRule(ruleIndex, updatedRule);
                this.updateRulesElement();
            });

            const deleteButton = document.getElementById(`deleteRule${ruleIndex}`);
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    this.ruleManager.deleteRule(ruleIndex);
                    this.updateRulesElement();
                });
            }
        });
    }

    collapseAllRules() {
        if (this.currentExpandedRule !== null) {
            const ruleDetails = document.getElementById(`readRule${this.currentExpandedRule}`);
            if (ruleDetails) ruleDetails.style.display = 'none';
            this.currentExpandedRule = null;
        }
    }

    collapseAllConflicts() {
        if (this.currentExpandedConflict !== null) {
            const conflictDetails = document.getElementById(`conflictDetails${this.currentExpandedConflict}`);
            if (conflictDetails) conflictDetails.style.display = 'none';
            this.currentExpandedConflict = null;
        }
    }
}

class ShortcutAPI {
    constructor(config = {}) {
        this.config = {
            RuleC: true,
            RuleR: true,
            RuleU: ['ruleName', 'urlPattern', 'selectorType', 'selector', 'nthElement', 'shortcut', 'ifLinkOpen', 'isEnabled'],
            RuleD: true,
            ...config
        };
        this.ruleManager = new RuleManager();
        this.shortcutHandler = new ShortcutHandler(this.ruleManager);
        this.menuManager = null;
        if (this.config.RuleC || this.config.RuleR) {
            this.menuManager = new MenuManager(this.ruleManager, this.config);
            this.initMenus();
        }
    }

    initMenus() {
        const i18n = this.menuManager.i18n[this.menuManager.getLanguage()];
        if (this.config.RuleC) {
            GM_registerMenuCommand(i18n.titleAdd, () => this.menuManager.initAddRuleMenu());
        }
        if (this.config.RuleR) {
            GM_registerMenuCommand(i18n.titleManage, () => this.menuManager.initManageRulesMenu());
        }
    }

    addRule(rule) {
        this.ruleManager.addRule(rule);
    }

    getRules() {
        return this.ruleManager.clickRules.rules;
    }

    updateRule(index, updatedRule) {
        this.ruleManager.updateRule(index, updatedRule);
    }

    deleteRule(index) {
        this.ruleManager.deleteRule(index);
    }

    addRuleFromJSON(jsonString) {
        return this.ruleManager.addRuleFromJSON(jsonString);
    }

    initAddRuleMenu() {
        if (!this.menuManager) {
            this.menuManager = new MenuManager(this.ruleManager, this.config);
        }
        this.menuManager.initAddRuleMenu();
    }

    initManageRulesMenu() {
        if (!this.menuManager) {
            this.menuManager = new MenuManager(this.ruleManager, this.config);
        }
        this.menuManager.initManageRulesMenu();
    }
}

window.ShortcutLibrary = ShortcutAPI;
