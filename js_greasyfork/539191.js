// ==UserScript==
// @name         click it for you
// @name:zh-TW   為你自動點選
// @name:ja      あなたのためにクリック
// @name:en      click it for you
// @name:de      Für dich klicken
// @name:es      Clic automático para ti
// @description  在符合正則表達式的網址上自動點選指定的元素。
// @description:zh-TW 在符合正則表達式的網址上自動點選指定的元素。
// @description:ja 正規表現に一致するURLで指定された要素を自動的にクリックします。
// @description:en Automatically clicks specified elements on URLs matching a regular expression.
// @description:de Klickt automatisch auf angegebene Elemente auf URLs, die mit einem regulären Ausdruck übereinstimmen.
// @description:es Hace clic automáticamente en elementos especificados en URLs que coinciden con una expresión regular.

// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @version      1.0.7

// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/539191/click%20it%20for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/539191/click%20it%20for%20you.meta.js
// ==/UserScript==

class RuleManager {
    clickRules;

    constructor() {
        this.clickRules = GM_getValue('clickRules', { rules: [] });
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

    updateRules() {
        GM_setValue('clickRules', this.clickRules);
    }
}

class WebElementHandler {
    ruleManager;
    clickTaskManager;
    i18n = {
        'zh-TW': {
            title: '自動點選設定',
            matchingRules: '符合的規則',
            noMatchingRules: '當前網頁無符合的規則。',
            addRuleSection: '新增規則',
            ruleName: '規則名稱：',
            urlPattern: '網址正則表達式：',
            selectorType: '選擇器類型：',
            selector: '選擇器：',
            nthElement: '第幾個元素（從 1 開始）：',
            clickDelay: '點選延遲（毫秒）：',
            keepClicking: '持續點選元素：',
            ifLinkOpen: '若為連結則開啟（否則維持預設）：',
            addRule: '新增規則',
            save: '儲存',
            delete: '刪除',
            ruleNamePlaceholder: '例如：我的規則',
            urlPatternPlaceholder: '例如：https://example.com/.*',
            selectorPlaceholder: '例如：button.submit 或 //button[@class="submit"]',
            invalidRegex: '無效的正則表達式',
            invalidSelector: '無效的選擇器'
        } ,
        'en': {
            title: 'Auto Click 配置',
            matchingRules: 'Matching Rules',
            noMatchingRules: 'No rules match the current URL.',
            addRuleSection: 'Add New Rule',
            ruleName: 'Rule Name:',
            urlPattern: 'URL Pattern (Regex):',
            selectorType: 'Selector Type',
            selector: 'Selector:',
            nthElement: 'Nth Element (1-based)',
            clickDelay: 'Click Delay (ms):',
            keepClicking: 'Keep Clicking Element:',
            ifLinkOpen: 'If it is a link(Otherwise keep the default):',
            addRule: 'Add Rule',
            save: 'Save',
            delete: 'Delete',
            ruleNamePlaceholder: 'e.g., My Rule',
            urlPatternPlaceholder: 'e.g., https://example\\.com/.*',
            selectorPlaceholder: 'e.g., button.submit or //button[@class="submit"]',
            invalidRegex: 'Invalid regular expression',
            invalidSelector: 'Invalid selector'
        },
        'ja': {
            title: '自動クリック設定',
            matchingRules: '一致するルール',
            noMatchingRules: '現在のURLに一致するルールはありません。',
            addRuleSection: '新しいルールを追加',
            ruleName: 'ルール名：',
            urlPattern: 'URLパターン（正規表現）：',
            selectorType: 'セレクタタイプ：',
            selector: 'セレクタ：',
            nthElement: '何番目の要素（1から）：',
            clickDelay: 'クリック遅延（ミリ秒）：',
            keepClicking: '要素を継続的にクリック：',
            ifLinkOpen: 'リンクの場合（それ以外の場合はデフォルトを維持）：',
            addRule: 'ルールを追加',
            save: '保存',
            delete: '削除',
            ruleNamePlaceholder: '例：マイルール',
            urlPatternPlaceholder: '例：https://example\\.com/.*',
            selectorPlaceholder: '例：button.submit または //button[@class="submit"]',
            invalidRegex: '無効な正規表現',
            invalidSelector: '無効なセレクター'
        },
        'de': {
            title: 'Automatische Klick-Einstellungen',
            matchingRules: 'Passende Regeln',
            noMatchingRules: 'Keine Regeln passen zur aktuellen URL.',
            addRuleSection: 'Neue Regel hinzufügen',
            ruleName: 'Regelname:',
            urlPattern: 'URL-Muster (Regulärer Ausdruck):',
            selectorType: 'Selektortyp:',
            selector: 'Selektor:',
            nthElement: 'N-tes Element (ab 1):',
            clickDelay: 'Klickverzögerung (ms):',
            keepClicking: 'Element weiter klicken:',
            ifLinkOpen: 'Wenn es ein Link ist(Andernfalls Standard beibehalten): ',
            addRule: 'Regel hinzufügen',
            save: 'Speichern',
            delete: 'Löschen',
            ruleNamePlaceholder: 'Beispiel: Meine Regel',
            urlPatternPlaceholder: 'Beispiel: https://example\\.com/.*',
            selectorPlaceholder: 'Beispiel: button.submit oder //button[@class="submit"]',
            invalidRegex: 'Ungültiger regulärer Ausdruck',
            invalidSelector: 'Ungültiger Selektor'
        },
        'es': {
            title: 'Configuración de Clic Automático',
            matchingRules: 'Reglas Coincidentes',
            noMatchingRules: 'No hay reglas que coincidan con la URL actual.',
            addRuleSection: 'Agregar Nueva Regla',
            ruleName: 'Nombre de la Regla:',
            urlPattern: 'Patrón de URL (Regex):',
            selectorType: 'Tipo de Selector:',
            selector: 'Selector:',
            nthElement: 'N-ésimo Elemento (desde 1):',
            clickDelay: 'Retraso de Clic (ms):',
            keepClicking: 'Seguir haciendo clic en el Elemento:',
            ifLinkOpen: 'Si es un enlace(De lo contrario, mantener la configuración predeterminada):',
            addRule: 'Agregar Regla',
            save: 'Guardar',
            delete: 'Eliminar',
            ruleNamePlaceholder: 'Ejemplo: Mi Regla',
            urlPatternPlaceholder: 'Ejemplo: https://example\\.com/.*',
            selectorPlaceholder: 'Ejemplo: button.submit o //button[@class="submit"]',
            invalidRegex: 'Expresión regular inválida',
            invalidSelector: 'Selector inválido'
        }
    };

    constructor(ruleManager, clickTaskManager) {
        this.ruleManager = ruleManager;
        this.clickTaskManager = clickTaskManager;
        this.setupUrlChangeListener();
    }

    // 獲取選單標題（用於 registerMenu）
    getMenuTitle() {
        return this.i18n[this.getLanguage()].title;
    }

    // 獲取當前語言
    getLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('zh')) return 'zh-TW';
        if (lang.startsWith('ja')) return 'ja';
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('es')) return 'es';
        return 'en';
    }

    // 驗證規則輸入
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
        return true;
    }

    // 創建規則元素，以提供規則RUD
    createRuleElement(rule, ruleIndex) {
        const i18n = this.i18n[this.getLanguage()];
        const ruleDiv = document.createElement('div');
        ruleDiv.innerHTML = `
                <div class="ruleHeader" id="ruleHeader${ruleIndex}">
                    <strong>${rule.ruleName || `規則 ${ruleIndex + 1}`}</strong>
                </div>
                <div class="readRule" id="readRule${ruleIndex}" style="display: none;">
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
                    <input type="number" id="updateNthElement${ruleIndex}" min="1" value="${rule.nthElement}">
                    <label>${i18n.clickDelay}</label>
                    <input type="number" id="updateClickDelay${ruleIndex}" min="100" value="${rule.clickDelay || 200}">
                    <div class="checkbox-container">
                    <label>${i18n.keepClicking}</label>
                    <input type="checkbox" id="updateKeepSearching${ruleIndex}" ${rule.keepClicking ? 'checked' : ''}>
                </div>
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="updateIfLink${ruleIndex}" ${rule.ifLinkOpen ? 'checked' : ''}>
                </div>

                    <button id="updateRule${ruleIndex}">${i18n.save}</button>
                    <button id="deleteRule${ruleIndex}">${i18n.delete}</button>
                </div>
            `;
        return ruleDiv;
    }

    // 建立設定選單
    createMenuElement() {
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
                #autoClickMenu {
                    overflow-y: auto;
                    max-height: 80vh;
                }
                #autoClickMenu input:not([type="checkbox"]), #autoClickMenu select, #autoClickMenu button {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 5px 0;
                    padding: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }
                #autoClickMenu input[type="checkbox"] {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 0 5px 0 0;
                    padding: 5px;
                    width: auto;
                    vertical-align: middle;
                }
                #autoClickMenu button {
                    cursor: pointer;
                }
                #autoClickMenu button:hover {
                    background: rgb(70, 70, 70);
                }
                #autoClickMenu label {
                    margin-top: 5px;
                    display: block;
                }
                #autoClickMenu .checkbox-container {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
                #autoClickMenu .ruleHeader {
                    cursor: pointer;
                    background: rgb(50, 50, 50);
                    padding: 5px;
                    margin: 5px 0;
                    border-radius: 3px;
                }
                #autoClickMenu .readRule {
                    padding: 5px;
                    border: 1px solid rgb(80, 80, 80);
                    border-radius: 3px;
                    margin-bottom: 5px;
                }
                #autoClickMenu .headerContainer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #autoClickMenu .closeButton {
                    width: auto;
                    padding: 5px 10px;
                    margin: 0;
                }
            </style>
                <div id="autoClickMenu">
                    <div class="headerContainer">
                        <h3>${i18n.title}</h3>
                        <button id="closeMenu" class="closeButton">✕</button>
                    </div>
                    <div id="rulesList"></div>
                    <h4>${i18n.addRuleSection}</h4>
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
                    <input type="number" id="nthElement" min="1" value="1">
                    <label>${i18n.clickDelay}</label>
                    <input type="number" id="clickDelay" min="50" value="1000">
                    <div class="checkbox-container">
                    <label>${i18n.keepClicking}</label>
                    <input type="checkbox" id="keepClicking">
                </div>
                <div class="checkbox-container">
                    <label>${i18n.ifLinkOpen}</label>
                    <input type="checkbox" id="ifLinkOpen">
                </div>

                    <button id="addRule" style="margin-top: 10px;">${i18n.addRule}</button>
                </div>
            `;
        document.body.appendChild(menu);

        this.updateRulesElement();

        document.getElementById('addRule').addEventListener('click', () => {
            const newRule = {
                ruleName: document.getElementById('ruleName').value || `規則 ${this.ruleManager.clickRules.rules.length + 1}`,
                urlPattern: document.getElementById('urlPattern').value,
                selectorType: document.getElementById('selectorType').value,
                selector: document.getElementById('selector').value,
                nthElement: parseInt(document.getElementById('nthElement').value) || 1,
                clickDelay: parseInt(document.getElementById('clickDelay').value) || 200,
                keepClicking: document.getElementById('keepClicking').checked || false,
                ifLinkOpen:Boolean(document.getElementById('ifLinkOpen').value) || false
            };
            if (!this.validateRule(newRule)) return;
            this.ruleManager.addRule(newRule);
            this.updateRulesElement();
            this.clickTaskManager.clearAutoClicks();
            this.clickTaskManager.runAutoClicks();
            document.getElementById('ruleName').value = '';
            document.getElementById('urlPattern').value = '';
            document.getElementById('selector').value = '';
            document.getElementById('nthElement').value = '1';
            document.getElementById('clickDelay').value = '200';
            document.getElementById('keepClicking').checked = false;
            document.getElementById('ifLinkOpen').value = "false"
        });

        document.getElementById('closeMenu').addEventListener('click', () => {
            menu.remove();
        });
    }

    // 更新規則列表（僅顯示當前網址符合的規則）
    updateRulesElement() {
        const rulesList = document.getElementById('rulesList');
        const i18n = this.i18n[this.getLanguage()];
        rulesList.innerHTML = `<h4>${i18n.matchingRules}</h4>`;
        const currentUrl = window.location.href;
        const matchingRules = this.ruleManager.clickRules.rules.filter(rule => {
            try {
                return new RegExp(rule.urlPattern).test(currentUrl);
            } catch (e) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的正則表達式無效：`, rule.urlPattern);
                return false;
            }
        });

        if (matchingRules.length === 0) {
            rulesList.innerHTML += `<p>${i18n.noMatchingRules}</p>`;
            return;
        }

        matchingRules.forEach((rule) => {
            const ruleIndex = this.ruleManager.clickRules.rules.indexOf(rule);
            const ruleDiv = this.createRuleElement(rule, ruleIndex);
            rulesList.appendChild(ruleDiv);

            document.getElementById(`ruleHeader${ruleIndex}`).addEventListener('click', () => {
                const details = document.getElementById(`readRule${ruleIndex}`);
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById(`updateRule${ruleIndex}`).addEventListener('click', () => {
                console.log("document.getElementById(`updateKeepSearching${ruleIndex}`).checked",document.getElementById(`updateKeepSearching${ruleIndex}`).checked)
                console.log("Boolean(document.getElementById(`updateIfLink${ruleIndex}`).value)",Boolean(document.getElementById(`updateIfLink${ruleIndex}`).value))

                const updatedRule = {
                    ruleName: document.getElementById(`updateRuleName${ruleIndex}`).value || `規則 ${ruleIndex + 1}`,
                    urlPattern: document.getElementById(`updateUrlPattern${ruleIndex}`).value,
                    selectorType: document.getElementById(`updateSelectorType${ruleIndex}`).value,
                    selector: document.getElementById(`updateSelector${ruleIndex}`).value,
                    nthElement: parseInt(document.getElementById(`updateNthElement${ruleIndex}`).value) || 1,
                    clickDelay: parseInt(document.getElementById(`updateClickDelay${ruleIndex}`).value) || 1000,
                    keepClicking: document.getElementById(`updateKeepSearching${ruleIndex}`).checked || false,
                    ifLinkOpen: Boolean(document.getElementById(`updateIfLink${ruleIndex}`).value) || false
                };
                console.log("updatedRule2",updatedRule)
                if (!this.validateRule(updatedRule)) return;
                this.ruleManager.updateRule(ruleIndex, updatedRule);
                this.updateRulesElement();
                this.clickTaskManager.clearAutoClicks();
                this.clickTaskManager.runAutoClicks();
            });


            document.getElementById(`deleteRule${ruleIndex}`).addEventListener('click', () => {
                this.ruleManager.deleteRule(ruleIndex);
                this.updateRulesElement();
                this.clickTaskManager.clearAutoClicks();
                this.clickTaskManager.runAutoClicks();
            });
        });
    }

    // 設置 URL 變更監聽器
    setupUrlChangeListener() {
        const oldPushState = history.pushState;
        history.pushState = function pushState() {
            const result = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        const oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            const result = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            this.clickTaskManager.clearAutoClicks();
            this.clickTaskManager.runAutoClicks();
        });
    }
}

class ClickTaskManager {
    ruleManager;
    intervalIds = {};

    constructor(ruleManager) {
        this.ruleManager = ruleManager;
        this.runAutoClicks();
    }

    // 清除所有自動點選任務
    clearAutoClicks() {
        Object.keys(this.intervalIds).forEach(index => {
            clearInterval(this.intervalIds[index]);
            delete this.intervalIds[index];
        });
    }

    // 執行所有符合規則的自動點選
    runAutoClicks() {
        this.ruleManager.clickRules.rules.forEach((rule, index) => {
            if (rule.urlPattern && rule.selector && !this.intervalIds[index]) {
                const intervalId = setInterval(() => {
                    const clicked = this.autoClick(rule, index);
                    if (clicked && !rule.keepClicking) {
                        clearInterval(this.intervalIds[index]);
                        delete this.intervalIds[index];
                    }
                }, rule.clickDelay || 200);
                this.intervalIds[index] = intervalId;
            } else if (!rule.urlPattern || !rule.selector) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 無效（索引 ${index}）：缺少 urlPattern 或 selector`);
            }
        });
    }

    // 執行單條規則的自動點選，並返回是否成功
    autoClick(rule, ruleIndex) {
        try {
            const urlRegex = new RegExp(rule.urlPattern);
            if (!urlRegex.test(window.location.href)) {
                return false;
            }

            const elements = this.getElements(rule.selectorType, rule.selector);
            if (elements.length === 0) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 未找到符合元素：`, rule.selector);
                return false;
            }

            if (rule.nthElement < 1 || rule.nthElement > elements.length) {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 的 nthElement 無效：${rule.nthElement}，找到 ${elements.length} 個元素`);
                return false;
            }

            const targetElement = elements[rule.nthElement - 1];
            if (targetElement) {
                console.log(`${GM_info.script.name}: 規則 "${rule.ruleName}" 成功點選元素：`, targetElement);
                if (rule.ifLinkOpen && targetElement.tagName === "A" && targetElement.href) {
                    window.location.href = targetElement.href;
                }else{
                    targetElement.click();
                }
                return true;
            } else {
                console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 未找到目標元素`);
                return false;
            }
        } catch (e) {
            console.warn(`${GM_info.script.name}: 規則 "${rule.ruleName}" 執行失敗：`, e);
            return false;
        }
    }

    // 根據選擇器類型獲取元素
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
            console.warn(`${GM_info.script.name}: 選擇器 "${selector}" 無效：`, e);
            return [];
        }
    }
}

const Shirisaku = new RuleManager();
const Yubisaku = new ClickTaskManager(Shirisaku);
const Mika = new WebElementHandler(Shirisaku, Yubisaku);
GM_registerMenuCommand(Mika.getMenuTitle(), () => Mika.createMenuElement());
