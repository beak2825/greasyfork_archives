// ==UserScript==
// @name         自由設定快捷鍵
// @name:zh-TW   自由設定快捷鍵
// @name:ja      自由にショートカットを設定
// @name:en      Freely Set Shortcuts
// @name:de      Frei wählbare Tastenkombinationen
// @name:es      Configuración Libre de Atajos
// @description  允許使用者定義單個或雙個修飾鍵的快捷鍵組合以點選符合網址的指定元素。
// @description:zh-TW 允許使用者定義單個或雙個修飾鍵的快捷鍵組合以點選符合網址的指定元素。
// @description:ja ユーザーが単一または2つの修飾キーを使ったカスタムショートカットを定義して、URLに一致する指定要素をクリックできます。
// @description:en Allows users to define custom keyboard shortcuts with single or double modifiers to click specific elements on matching URLs.
// @description:de Ermöglicht Benutzern, benutzerdefinierte Tastenkombinationen mit einfachen oder doppelten Modifikatoren zu definieren, um bestimmte Elemente auf passenden URLs anzuklicken。
// @description:es Permite a los usuarios definir atajos de teclado personalizados con modificadores simples o dobles para hacer clic en elementos específicos en URLs coincidentes。

// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @version      1.1.1

// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/542829/%E8%87%AA%E7%94%B1%E8%A8%AD%E5%AE%9A%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/542829/%E8%87%AA%E7%94%B1%E8%A8%AD%E5%AE%9A%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==

class RuleManager {
    constructor() {
        this.clickRules = this.sanitizeRules(GM_getValue('clickRules', { rules: [] }));
    }

    // 新增規則到規則集
    // 輸入參數: newRule (object) - 新規則物件
    // 返回值: void
    addRule(newRule) {
        this.clickRules.rules.push(newRule);
        this.updateRules();
    }

    // 更新指定索引的規則
    // 輸入參數: index (number) - 規則索引
    //          updatedRule (object) - 更新後的規則物件
    // 返回值: void
    updateRule(index, updatedRule) {
        this.clickRules.rules[index] = updatedRule;
        this.updateRules();
    }

    // 刪除指定索引的規則
    // 輸入參數: index (number) - 規則索引
    // 返回值: void
    deleteRule(index) {
        this.clickRules.rules.splice(index, 1);
        this.updateRules();
    }

    // 將規則集儲存到 GM_setValue
    // 輸入參數: 無
    // 返回值: void
    updateRules() {
        GM_setValue('clickRules', this.clickRules);
    }

    // 清理並驗證規則，確保規則格式正確
    // 輸入參數: clickRules (object) - 包含規則陣列的物件
    // 返回值: object - 清理後的規則物件
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

    // 驗證快捷鍵格式是否有效
    // 輸入參數: shortcut (string) - 快捷鍵字串，例如 "Control+A"
    // 返回值: boolean - 是否為有效快捷鍵
    isValidShortcut(shortcut) {
        const validModifiers = ['Control', 'Alt', 'Shift', 'CapsLock', 'NumLock'];
        if (!shortcut || typeof shortcut !== 'string') return false;
        const parts = shortcut.split('+');
        if (parts.length < 2 || parts.length > 3) return false;
        const mainKey = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);
        return modifiers.every(mod => validModifiers.includes(mod)) && mainKey.length === 1 || /^F[1-9]|F1[0-2]|Esc|Home|End|PageUp|PageDown|Insert|Delete|Tab|Enter|Eliminate|Backspace|ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(mainKey);
    }

    // 檢查新規則是否與現有規則衝突
    // 輸入參數: newRule (object) - 新規則物件
    //          currentUrl (string) - 當前網址
    //          excludeIndex (number) - 排除檢查的規則索引（用於更新時）
    // 返回值: array - 包含衝突資訊的陣列
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

// 快捷鍵處理類，負責監聽鍵盤事件並執行點擊動作
class ShortcutHandler {
    constructor(ruleManager) {
        // 初始化：設定規則管理器並綁定鍵盤事件監聽器
        this.ruleManager = ruleManager;
        this.keydownHandler = (event) => this.handleKeydown(event);
        window.addEventListener('keydown', this.keydownHandler);
    }

    // 處理鍵盤按下事件，檢查是否符合快捷鍵並執行動作
    // 輸入參數: event (KeyboardEvent) - 鍵盤事件物件
    // 返回值: void
    handleKeydown(event) {
        console.log(event);
        const currentUrl = window.location.href;
        [...this.ruleManager.clickRules.rules].reverse().some((rule, index) => {
            try {
                if (!rule.isEnabled || !new RegExp(rule.urlPattern).test(currentUrl)) return false;

                const shortcutParts = rule.shortcut.split('+');
                const mainKey = shortcutParts[shortcutParts.length - 1];
                const modifiers = shortcutParts.slice(0, -1);

                const allModifiersPressed = modifiers.every(mod => event.getModifierState(mod));
                const mainKeyPressed = event.code.replace(/^Key/, '').replace(/^Numpad/, '').toUpperCase() === mainKey.toUpperCase();

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

    // 根據選擇器類型獲取元素
    // 輸入參數: selectorType (string) - 選擇器類型 ('css' 或 'xpath')
    //          selector (string) - 選擇器字串
    // 返回值: array - 符合的元素陣列
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

    // 執行點選指定元素的動作
    // 輸入參數: rule (object) - 規則物件
    //          ruleIndex (number) - 規則索引
    // 返回值: boolean - 是否成功點選元素
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

// 選單管理類，負責建立和管理用戶界面
class MenuManager {
    constructor(ruleManager) {
        // 初始化：設定規則管理器、快捷鍵處理器和修飾鍵組合
        this.ruleManager = ruleManager;
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
                elementConflict: '指向相同的目標元素'
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
                elementConflict: 'Targets the same element'
            },
            'ja': {
                titleAdd: '新しいショートカットルールを追加',
                titleManage: 'ショートカットルールを管理',
                matchingRules: '一致するルール',
                noMatchingRules: '現在のURLに一致するルールはありません。',
                addRuleSection: '新しいルールを追加',
                ruleName: 'ルール名：',
                urlPattern: 'URLパターン（正規表現）：',
                selectorType: 'セレクタタイプ：',
                selector: 'セレクタ：',
                nthElement: '何番目の要素（正数は最初から、負数は最後から）：',
                shortcutModifiers: 'ショートカット修飾キー組み合わせ：',
                shortcutMainKey: 'ショートカットメインキー：',
                ifLinkOpen: 'リンクの場合、開く（それ以外の場合はデフォルトを維持）：',
                isEnabled: 'ルールを有効にする：',
                addRule: 'ルールを追加',
                save: '儲存',
                delete: '削除',
                ruleNamePlaceholder: '例：マイルール',
                urlPatternPlaceholder: '例：https://example\\.com/.*',
                selectorPlaceholder: '例：button.submit または //button[@class="submit"]',
                nthElementPlaceholder: '例：1 または -1（最後の要素）',
                mainKeyPlaceholder: '例：A',
                invalidRegex: '無効な正規表現',
                invalidSelector: '無効なセレクター',
                invalidMainKey: '無効なメインキー（1文字の文字またはキーである必要があります、例：AまたはF1）',
                conflictingRules: '競合するルール',
                shortcutConflict: '同じショートカットキーの組み合わせを使用',
                elementConflict: '同じ要素を対象とする'
            },
            'de': {
                titleAdd: 'Neue Tastenkombination hinzufügen',
                titleManage: 'Tastenkombinationen verwalten',
                matchingRules: 'Passende Regeln',
                noMatchingRules: 'Keine Regeln passen zur aktuellen URL.',
                addRuleSection: 'Neue Regel hinzufügen',
                ruleName: 'Regelname:',
                urlPattern: 'URL-Muster (Regex):',
                selectorType: 'Selektortyp:',
                selector: 'Selektor:',
                nthElement: 'N-tes Element (positiv von Anfang, negativ von Ende):',
                shortcutModifiers: 'Tastenkombination Modifikator:',
                shortcutMainKey: 'Haupttaste der Tastenkombination:',
                ifLinkOpen: 'Wenn es ein Link ist, öffnen (sonst Standard beibehalten):',
                isEnabled: 'Regel aktivieren:',
                addRule: 'Regel hinzufügen',
                save: 'Speichern',
                delete: 'Löschen',
                ruleNamePlaceholder: 'z. B. Meine Regel',
                urlPatternPlaceholder: 'z. B. https://example\\.com/.*',
                selectorPlaceholder: 'z. B. button.submit oder //button[@class="submit"]',
                nthElementPlaceholder: 'z. B. 1 oder -1 (letztes Element)',
                mainKeyPlaceholder: 'z. B. A',
                invalidRegex: 'Ungültiger regulärer Ausdruck',
                invalidSelector: 'Ungültiger Selektor',
                invalidMainKey: 'Ungültige Haupttaste (muss ein einzelnes Zeichen oder eine Taste sein, z. B. A oder F1)',
                conflictingRules: 'Konfliktierende Regeln',
                shortcutConflict: 'Verwendet dieselbe Tastenkombination',
                elementConflict: 'Zielt auf dasselbe Element'
            },
            'es': {
                titleAdd: 'Agregar Nueva Regla de Atajo',
                titleManage: 'Gestionar Reglas de Atajos',
                matchingRules: 'Reglas Coincidentes',
                noMatchingRules: 'No hay reglas que coincidan con la URL actual.',
                addRuleSection: 'Agregar Nueva Regla',
                ruleName: 'Nombre de la Regla:',
                urlPattern: 'Patrón de URL (Regex):',
                selectorType: 'Tipo de Selector:',
                selector: 'Selector:',
                nthElement: 'N-ésimo Elemento (positivo desde el inicio, negativo desde el final):',
                shortcutModifiers: 'Combinación de Modificadores de Atajo:',
                shortcutMainKey: 'Tecla Principal del Atajo:',
                ifLinkOpen: 'Si es un enlace, abrirlo (de lo contrario, mantener el valor predeterminado):',
                isEnabled: 'Habilitar Regla:',
                addRule: 'Agregar Regla',
                save: 'Guardar',
                delete: 'Eliminar',
                ruleNamePlaceholder: 'Ejemplo: Mi Regla',
                urlPatternPlaceholder: 'Ejemplo: https://example\\.com/.*',
                selectorPlaceholder: 'Ejemplo: button.submit o //button[@class="submit"]',
                nthElementPlaceholder: 'Ejemplo: 1 o -1 (último elemento)',
                mainKeyPlaceholder: 'Ejemplo: A',
                invalidRegex: 'Expresión regular inválida',
                invalidSelector: 'Selector inválido',
                invalidMainKey: 'Tecla principal inválida (debe ser un solo carácter o tecla, ejemplo: A o F1)',
                conflictingRules: 'Reglas en Conflicto',
                shortcutConflict: 'Usa la misma combinación de teclas de atajo',
                elementConflict: 'Apunta al mismo elemento'
            }
        };
        this.initMenus();
    }

    // 初始化選單，註冊 GM 選單命令
    // 輸入參數: 無
    // 返回值: void
    initMenus() {
        const i18n = this.i18n[this.getLanguage()];
        GM_registerMenuCommand(i18n.titleAdd, () => this.createAddRuleMenu());
        GM_registerMenuCommand(i18n.titleManage, () => this.createManageRulesMenu());
    }

    // 獲取當前語言，預設為 zh-TW 或根據瀏覽器語言選擇
    // 輸入參數: 無
    // 返回值: string - 語言代碼
    getLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('zh')) return 'zh-TW';
        if (lang.startsWith('ja')) return 'ja';
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('es')) return 'es';
        return 'en';
    }

    // 驗證規則是否有效
    // 輸入參數: rule (object) - 規則物件
    // 返回值: boolean - 是否為有效規則
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

    // 驗證快捷鍵格式是否有效
    // 輸入參數: shortcut (string) - 快捷鍵字串
    // 返回值: boolean - 是否為有效快捷鍵
    validateShortcut(shortcut) {
        const validModifiers = ['Control', 'Alt', 'Shift', 'CapsLock', 'NumLock'];
        if (!shortcut) return false;
        const parts = shortcut.split('+');
        if (parts.length < 2 || parts.length > 3) return false;
        const mainKey = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);
        return modifiers.every(mod => validModifiers.includes(mod)) && mainKey.length === 1 || /^F[1-9]|F1[0-2]|Esc|Home|End|PageUp|PageDown|Insert|Delete|Tab|Enter|Eliminate|Backspace|ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(mainKey);
    }

    // 生成有效的修飾鍵組合
    // 輸入參數: 無
    // 返回值: array - 包含所有修飾鍵組合的字串陣列
    generateModifierCombos() {
        const modifiers = ['CapsLock', 'NumLock','Control', 'Alt', 'Shift', ];
        const combos = [...modifiers];
        for (let i = 0; i < modifiers.length; i++) {
            for (let j = i + 1; j < modifiers.length; j++) {
                combos.push(`${modifiers[i]}+${modifiers[j]}`);
            }
        }
        return combos;
    }

    // 創建規則的 HTML 元素
    // 輸入參數: rule (object) - 規則物件
    //           ruleIndex (number) - 規則索引
    // 返回值: HTMLElement - 規則的 HTML 元素
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
                    <input type="checkbox" id="updateIsEnabled${ruleIndex}" ${rule.isEnabled ? 'checked' : ''}>
                </div>
                <label>${i18n.ruleName}</label>
                <input type="text" id="updateRuleName${ruleIndex}" value="${rule.ruleName || ''}">
                <label>${i18n.urlPattern}</label>
                <input type="text" id="updateUrlPattern${ruleIndex}" value="${rule.urlPattern}">
                <label>${i18n.selectorType}</label>
                <select id="updateSelectorType${ruleIndex}">
                    <option value="css" ${rule.selectorType === 'css' ? 'selected' : ''}>CSS</option>
                    <option value="xpath" ${rule.selectorType === 'xpath' ? 'selected' : ''}>XPath</option>
                </select>
                <label>${i18n.selector}</label>
                <input type="text" id="updateSelector${ruleIndex}" value="${rule.selector}">
                <label>${i18n.nthElement}</label>
                <input type="number" id="updateNthElement${ruleIndex}" value="${rule.nthElement}" placeholder="${i18n.nthElementPlaceholder}">
                <label>${i18n.shortcutModifiers}</label>
                <select id="updateModifierCombo${ruleIndex}">
                    ${this.validModifierCombos.map(combo => `
                        <option value="${combo}" ${combo === modifierCombo ? 'selected' : ''}>${combo}</option>
                    `).join('')}
                </select>
                <label>${i18n.shortcutMainKey}</label>
                <input type="text" id="updateMainKey${ruleIndex}" value="${mainKey}" placeholder="${i18n.mainKeyPlaceholder}">
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="updateIfLink${ruleIndex}" ${rule.ifLinkOpen ? 'checked' : ''}>
                </div>
                <button id="updateRule${ruleIndex}">${i18n.save}</button>
                <button id="deleteRule${ruleIndex}">${i18n.delete}</button>
                ${conflictHtml}
            </div>
        `;
        return ruleDiv;
    }

    // 創建新增規則選單
    // 輸入參數: 無
    // 返回值: void
    createAddRuleMenu() {
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
                h1 {
                    font-size: 2rem;
                }
                h2 {
                    font-size: 1.5rem;
                }
                #shortcutMenu {
                    overflow-y: auto;
                    max-height: 80vh;
                }
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
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 0 5px 0 0;
                    padding: 5px;
                    width: auto;
                    vertical-align: middle;
                }
                #shortcutMenu button {
                    cursor: pointer;
                }
                #shortcutMenu button:hover {
                    background: rgb(70, 70, 70);
                }
                #shortcutMenu label {
                    margin-top: 5px;
                    display: block;
                }
                #shortcutMenu .checkbox-container {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
                #shortcutMenu .headerContainer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #shortcutMenu .closeButton {
                    width: auto;
                    padding: 5px 10px;
                    margin: 0;
                }
            </style>
            <div id="shortcutMenu">
                <div class="headerContainer">
                    <h1>${GM_info.script.name}</h1>
                    <button id="closeMenu" class="closeButton">✕</button>
                </div>
                <h2>${i18n.titleAdd}</h2>
                <div class="checkbox-container">
                    <label>${i18n.isEnabled}</label>
                    <input type="checkbox" id="isEnabled" checked>
                </div>
                <label>${i18n.ruleName}</label>
                <input type="text" id="ruleName" placeholder="${i18n.ruleNamePlaceholder}">
                <label>${i18n.urlPattern}</label>
                <input type="text" id="urlPattern" value="${window.location.href}">
                <label>${i18n.selectorType}</label>
                <select id="selectorType">
                    <option value="css">CSS</option>
                    <option value="xpath">XPath</option>
                </select>
                <label>${i18n.selector}</label>
                <input type="text" id="selector" placeholder="${i18n.selectorPlaceholder}">
                <label>${i18n.nthElement}</label>
                <input type="number" id="nthElement" value="1" placeholder="${i18n.nthElementPlaceholder}">
                <label>${i18n.shortcutModifiers}</label>
                <select id="modifierCombo">
                    ${this.validModifierCombos.map(combo => `
                        <option value="${combo}">${combo}</option>
                    `).join('')}
                </select>
                <label>${i18n.shortcutMainKey}</label>
                <input type="text" id="mainKey" placeholder="${i18n.mainKeyPlaceholder}">
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="ifLinkOpen">
                </div>
                <button id="addRule" style="margin-top: 10px;">${i18n.addRule}</button>
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

        document.getElementById('closeMenu').addEventListener('click', () => {
            menu.remove();
        });
    }

    // 創建管理規則選單
    // 輸入參數: 無
    // 返回值: void
    createManageRulesMenu() {
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
                h1 {
                    font-size: 2rem;
                }
                h2 {
                    font-size: 1.5rem;
                }
                #shortcutMenu {
                    overflow-y: auto;
                    max-height: 80vh;
                }
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
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 0 5px 0 0;
                    padding: 5px;
                    width: auto;
                    vertical-align: middle;
                }
                #shortcutMenu button {
                    cursor: pointer;
                }
                #shortcutMenu button:hover {
                    background: rgb(70, 70, 70);
                }
                #shortcutMenu label {
                    margin-top: 5px;
                    display: block;
                }
                #shortcutMenu .checkbox-container {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
                #shortcutMenu .ruleHeader, #shortcutMenu .conflictHeader {
                    cursor: pointer;
                    background: rgb(50, 50, 50);
                    padding: 5px;
                    margin: 5px 0;
                    border-radius: 3px;
                }
                #shortcutMenu .readRule, #shortcutMenu .conflictDetails {
                    padding: 5px;
                    border: 1px solid rgb(80, 80, 80);
                    border-radius: 3px;
                    margin-bottom: 5px;
                }
                #shortcutMenu .headerContainer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #shortcutMenu .closeButton {
                    width: auto;
                    padding: 5px 10px;
                    margin: 0;
                }
            </style>
            <h1>${GM_info.script.name}</h1>
            <div id="shortcutMenu">
                <div class="headerContainer">
                    <h2>${i18n.titleManage}</h2>
                    <button id="closeMenu" class="closeButton">✕</button>
                </div>
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

    // 更新規則列表的顯示
    // 輸入參數: 無
    // 返回值: void
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

            document.getElementById(`deleteRule${ruleIndex}`).addEventListener('click', () => {
                this.ruleManager.deleteRule(ruleIndex);
                this.updateRulesElement();
            });
        });
    }

    // 收起所有規則詳情
    // 輸入參數: 無
    // 返回值: void
    collapseAllRules() {
        if (this.currentExpandedRule !== null) {
            const ruleDetails = document.getElementById(`readRule${this.currentExpandedRule}`);
            if (ruleDetails) ruleDetails.style.display = 'none';
            this.currentExpandedRule = null;
        }
    }

    // 收起所有衝突詳情
    // 輸入參數: 無
    // 返回值: void
    collapseAllConflicts() {
        if (this.currentExpandedConflict !== null) {
            const conflictDetails = document.getElementById(`conflictDetails${this.currentExpandedConflict}`);
            if (conflictDetails) conflictDetails.style.display = 'none';
            this.currentExpandedConflict = null;
        }
    }
}

const rick = new RuleManager();
const earthBeth = new ShortcutHandler(rick);
const spaceBeth = new MenuManager(rick);
