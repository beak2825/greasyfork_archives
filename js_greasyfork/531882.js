// ==UserScript==
// @name          获取CSS选择器
// @description   JS实现获取CSS选择器，方便开发者使用
// @version      1.2
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include        **
// @noframes
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/531882/%E8%8E%B7%E5%8F%96CSS%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531882/%E8%8E%B7%E5%8F%96CSS%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ancestor;
    const state = {
        active: false,
        elementA: null,
        elementB: null,
        masks: [],
        mousePos: { x: -1, y: -1 }
    };

    function init() {
        injectStyles();
        createMasks();
        setupEventListeners();
    }

    function setupEventListeners() {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('click', handleActivationClick, true);
    }

    function handleMouseMove(e) {
        state.mousePos = { x: e.clientX, y: e.clientY };
        if (state.active) updateMasks();
    }

    function handleKeyPress(e) {
        if (parseKeyCombo(e) === 'C-A-s') {
            if (!state.active) {
                startSelection();
            } else {
                completeSelectionWithCurrent();
            }
            e.preventDefault();
        }
    }

    function handleActivationClick(e) {
        if (state.active) {
            e.preventDefault();
            e.stopImmediatePropagation();
            completeSelectionWithCurrent();
        }
    }
    function generateSelector(elem, iss = 0) {
        const { tagName, id, className, parentNode } = elem;

        if (tagName === 'HTML') return 'html';

        let str = tagName.toLowerCase();

        const isDescendant = (!ancestor) || (!ancestor.contains(elem)) || ancestor==elem;
        if (id) {
            if (iss == 0) {
                str += `#${id}`;
                return str;
            } else if (iss == 1 && isDescendant) {
                str += `#${id}`;
                return str;
            }
        }

        if (className) {
            // 转义类名中的特殊字符
            const escapeClassName = (cls) => {
                return cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
            };

            const classes = className.split(/\s+/).filter(c => c && !c.includes(':'));
            if (classes.length > 0) {
                // 初始包含所有类名（已转义）
                str += classes.map(c => `.${escapeClassName(c)}`).join('');

                // 尝试精简类名
                let canOptimize = true;
                while (canOptimize) {
                    canOptimize = false;
                    // 遍历每个现有类名
                    for (let i = 0; i < classes.length; i++) {
                        if (!classes[i]) continue; // 跳过已删除项

                        // 构建测试选择器（移除当前类）
                        const testSelector = `${tagName.toLowerCase()}${classes
                        .filter((_, idx) => idx != i)
                        .map(c => `.${escapeClassName(c)}`)
                        .join('')}`;

                        // 检查唯一性
                        let matchCount = 0;
                        try {
                            for (const child of parentNode.children) {
                                if (child.matches(testSelector)) matchCount++;
                            }
                        } catch (e) {
                            continue; // 如果选择器无效，跳过这个类
                        }

                        // 如果移除后仍唯一
                        if (matchCount == 1) {
                            classes.splice(i, 1);   // 永久删除该类
                            str = testSelector;     // 更新当前选择器
                            canOptimize = true;     // 允许继续优化
                            break;                  // 重新遍历修改后的列表
                        }
                    }
                }
            }
        }

        // 检查处理后的选择器在父元素下的匹配数量
        let matchCount = 0;
        try {
            for (const child of parentNode.children) {
                if (child.matches(str)) {
                    matchCount++;
                }
            }
        } catch (e) {
            // 如果选择器无效，回退到简单标签选择器
            str = tagName.toLowerCase();
            matchCount = Array.from(parentNode.children).filter(el => el.tagName.toLowerCase() === str).length;
        }

        // 如果仍然多个匹配，添加:nth-child
        if (matchCount > 1) {
            // 去除多余class
            const classes = str.match(/\.[^\\]*(?:\\.[^\\]*)*/g); // 匹配转义后的类名
            if (classes) {
                let canRemove = true;
                while (canRemove) {
                    canRemove = false;
                    for (let i = 0; i < classes.length; i++) {
                        const testSelector = str.replace(classes[i], '');
                        let newMatchCount = 0;
                        try {
                            for (const child of parentNode.children) {
                                if (child.matches(testSelector)) {
                                    newMatchCount++;
                                }
                            }
                        } catch (e) {
                            continue; // 如果选择器无效，跳过这个类
                        }
                        if (newMatchCount <= matchCount) {
                            str = testSelector;
                            matchCount = newMatchCount;
                            classes.splice(i, 1);
                            canRemove = true;
                            break;
                        }
                    }
                }
            }
            let childIndex = 1;
            for (let e = elem; e.previousElementSibling; e = e.previousElementSibling) {
                childIndex++;
            }
            str += `:nth-child(${childIndex})`;
        }

        return `${generateSelector(parentNode,iss)} > ${str}`;
    }

    function startSelection() {
        const initialElement = getCurrentElement();
        if (initialElement) {
            state.active = true;
            state.elementA = initialElement;
            showMasks();
        }
    }

    function completeSelectionWithCurrent() {
        const currentElement = getCurrentElement();
        if (currentElement) {
            if (!state.elementA) {
                state.elementA = currentElement;
                log('设置元素A:', currentElement);
            } else {
                state.elementB = currentElement;
                processResult();
                cleanup();
            }
        }
    }

    function createMasks() {
        state.masks = Array(2).fill().map((_, i) => {
            const mask = document.createElement('div');
            mask.className = `ancestor-mask ${i ? 'active' : ''}`;
            document.body.appendChild(mask);
            return mask;
        });
    }

    function updateMasks() {
        state.masks.forEach((mask, i) => {
            const target = i === 0 ? state.elementA : getCurrentElement();
            updateMask(mask, target);
        });
    }

    function updateMask(mask, element) {
        if (!element || element === document.body) {
            mask.style.display = 'none';
            return;
        }

        const rect = getVisibleRect(element);
        Object.assign(mask.style, {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            display: 'block'
        });
    }

    function getCurrentElement() {
        let element;
        try {
            element = document.elementFromPoint(
                state.mousePos.x,
                state.mousePos.y
            );
            while (element && element.classList.contains('ancestor-mask')) {
                element = document.elementFromPoint(
                    state.mousePos.x,
                    state.mousePos.y
                );
            }
        } catch (e) {
            return null;
        }
        return element && element !== document.body ? element : null;
    }

    function processResult() {
        ancestor = findCommonAncestor(state.elementA, state.elementB);
        if (!ancestor || ancestor === document.body) {
            log('错误：未找到有效公共祖先');
            return;
        }

        //const selector = generateSelector(ancestor);
        const selectorA = generateSelector(state.elementA, 1);
        const selectorB = generateSelector(state.elementB, 1);

        const [diffA, diffB,selector] = compareSelectors(selectorA, selectorB);
        const validation = validateSelector(selector, ancestor);
        const now = new Date();
        const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        console.group(`🔍 选择器获取结果 ${timeString}`);
        log(
            '元素:\nＡ: %o\nＡ选择器: %c%s%c\nＢ: %o\nＢ选择器: %c%s%c',
            state.elementA || '<未定义>',
            'color: orange', selectorA || '<无差异>', 'color: inherit',
            state.elementB || '<未定义>',
            'color: orange', selectorB || '<无差异>', 'color: inherit'
        );
        log(
            '公共祖先: %o\n祖: %c%s%c\nＡ: %c%s%c\nＢ: %c%s%c',
            ancestor || '<未定义>',
            'color: orange', selector || '<无相同>', 'color: inherit',
            'color: orange', diffA || '<无差异>', 'color: inherit',
            'color: orange', diffB || '<无差异>', 'color: inherit'
        );
        const diffLines = [];
        if (selector.includes('\\')) {
            diffLines.push(`祖: %c${selector.replace(/\\/g, '\\\\')}%c`);
        }
        if (selectorA.includes('\\')) {
            diffLines.push(`Ａ: %c${selectorA.replace(/\\/g, '\\\\')}%c`);
        }
        if (selectorB.includes('\\')) {
            diffLines.push(`Ｂ: %c${selectorB.replace(/\\/g, '\\\\')}%c`);
        }
        if (diffLines.length > 0) {
            // 合并 diffLines 到一个 console.log
            log(
                '选择器 (转义后):\n' + diffLines.map(line =>
                                               line.split('%c')[0] + '%c' + line.split('%c')[1] + '%c'
                                              ).join('\n'),
                ...diffLines.flatMap(() => ['color: orange', 'color: inherit'])
            );
        }
        log('验证结果:', validation.message);
        if (validation.success) {
            GM_setClipboard(selector, { type: 'text', mimetype: 'text/plain' });
        }
        console.groupEnd();
    }

    function findCommonAncestor(a, b) {
        const getPath = el => {
            const path = [];
            while (el && el !== document.body) {
                path.push(el);
                el = el.parentElement;
            }
            return path;
        };

        const pathA = getPath(a);
        return pathA.find(node => node.contains(b)) || document.body;
    }
    function compareSelectors(selectorA, selectorB) {
        const partsA = selectorA.split('>').map(p => p.trim());
        const partsB = selectorB.split('>').map(p => p.trim());

        let maxCommonLength = 0;
        const minLength = Math.min(partsA.length, partsB.length);

        // 计算最大公共前缀长度
        while (maxCommonLength < minLength && partsA[maxCommonLength] === partsB[maxCommonLength]) {
            maxCommonLength++;
        }

        // 特殊处理完全匹配的多级选择器
        if (maxCommonLength === partsA.length && maxCommonLength === partsB.length && maxCommonLength > 0) {
            maxCommonLength--;
        }

        // 提取公共部分和差异部分
        const commonPart = partsA.slice(0, maxCommonLength).join(' > ');
        const splitIndex = maxCommonLength;

        const getDiff = (arr) => {
            return splitIndex < arr.length ? arr.slice(splitIndex).join(' > ') : '';
        };

        const diffA = getDiff(partsA);
        const diffB = getDiff(partsB);

        // 特殊处理单级完全匹配
        if (partsA.length === 1 && partsB.length === 1 && diffA === diffB) {
            return [diffA, diffB, ''];
        }

        return [diffA, diffB, commonPart];
    }

    function validateSelector(selector, expected) {
        try {
            const found = document.querySelector(selector);
            return {
                success: found === expected,
                element: found,
                message: found === expected ?
                '✅ 选择器验证通过' :
                `❌ 匹配到其他元素: ${found?.outerHTML?.slice(0, 100)}...`
            };
        } catch (e) {
            return {
                success: false,
                message: `❌ 无效选择器: ${e.message}`
            };
        }
    }

    function getVisibleRect(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ancestor-mask {
                position: fixed;
                pointer-events: none;
                background: rgba(110, 180, 255, 0.2);
                border: 2px solid #1a73e8;
                z-index: 2147483647;
                transition: all 0.15s ease-out;
                display: none;
                box-shadow: 0 0 8px rgba(0,0,0,0.1);
            }
            .ancestor-mask.active {
                background: rgba(255, 80, 80, 0.2);
                border-color: #e53935;
            }
            .ancestor-mask.visible {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }

    function parseKeyCombo(e) {
        return [
            e.ctrlKey ? 'C-' : '',
            e.altKey ? 'A-' : '',
            e.shiftKey ? 'S-' : '',
            e.key.toLowerCase()
        ].join('');
    }

    function showMasks() {
        state.masks.forEach(mask => mask.classList.add('visible'));
        updateMasks();
    }

    function cleanup() {
        state.active = false;
        state.elementA = null;
        state.elementB = null;
        hideMasks();
    }

    function hideMasks() {
        state.masks.forEach(mask => {
            mask.style.display = 'none';
            mask.classList.remove('visible');
        });
    }

    function log(...args) {
        if (true) console.log(...args);
    }

    init();
})();