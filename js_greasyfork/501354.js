// ==UserScript==
// @name         ParaTranz Enhanced
// @namespace    https://paratranz.cn/users/44232
// @version      0.13.0
// @description  添加了很多小功能，希望以后官方能添加
// @author       ooo
// @match        http*://paratranz.cn/*
// @icon         https://paratranz.cn/favicon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/medium-zoom/1.1.0/medium-zoom.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501354/ParaTranz%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/501354/ParaTranz%20Enhanced.meta.js
// ==/UserScript==
/* global Mark mediumZoom GM_addStyle GM_getValue GM_setValue GM_registerMenuCommand GM_unregisterMenuCommand */
(async function () {
    'use strict';
    GM_addStyle(/* css */`
        .strings .string :is(.original, .translation) {
            text-overflow: ellipsis ellipsis !important;
        }
        #PZSoverlay {
            position: absolute !important;
            pointer-events: none !important;
            background: transparent !important;
            -webkit-text-fill-color: transparent !important;
            overflow-y: hidden !important;
            resize: none !important;
        }
        #PZSoverlay mark {
            mix-blend-mode: multiply;
        }
        .pz-expandable {
            cursor: pointer;
            background: linear-gradient(to right, transparent, #aaf6, transparent);
            borderRadius: 2px;
        }
        .add-clickable {
            cursor: pointer;
        }
    `);

    // #region 主要功能函数

    // #region 自动跳过空白页 shouldSkip
    function shouldSkip() {
        if (document.querySelector('.string-list .empty-sign') &&
            location.search.match(/(\?|&)page=\d+/g)) {
            document.querySelector('.pagination button')?.click();
            return true;
        }
    }
    // #endregion

    // #region 添加快捷键 addHotkeys
    function addHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                mockInput(document.querySelector('.editor-core .original')?.textContent);
            }
        });
    }
    // #endregion

    // #region 更多搜索高亮 initDropMark markSearchParams initMarkJS watchContextBtn
    let markSearchParams = () => { }, markSearchParamsInList = () => { };
    const mergeObjects = (obj1, obj2) => {
        const merged = {};
        for (const key of Object.keys(obj1)) {
            merged[key] = [...obj1[key], ...obj2[key]];
        }
        return merged;
    };
    function updMark() {
        const params = new URLSearchParams(location.search);
        const getParams = (type) => {
            return {
                contains: [...params.getAll(type)],
                startsWith: [...params.getAll(`${type}^`)],
                endsWith: [...params.getAll(`${type}$`)],
                match: [...params.getAll(`${type}~`)]
            };
        };
        const texts = getParams('text');
        const originals = getParams('original');
        const translations = getParams('translation');
        const contexts = getParams('context');

        const originKeywords = mergeObjects(texts, originals);
        const translationKeywords = mergeObjects(texts, translations);
        const contextKeywords = contexts;

        markSearchParams = () => {
            markOrigin(originKeywords);
            markContext(contextKeywords);
        };
        markSearchParamsInList = () => {
            markListOriginal(originKeywords);
            markListTranslation(translationKeywords);
        };

        if (Object.values(translationKeywords).filter(v => v).length) {
            const dropMark = markEditing(translationKeywords);
            return dropMark;
        }
    }
    let dropLastTextareaMark;
    const initDropMark = () => dropLastTextareaMark = updMark();

    let originMark, contextMark, listOriginalMark, listTranslationMark;

    function initMarkJS() {
        const original = document.querySelector('.editor-core .original');
        originMark = new Mark(original);

        original.addEventListener('click', (e) => {
            if (e.target.tagName === 'MARK') {
                const originalElement = e.target.parentElement;
                originalElement.click();
            }
        });

        const context = document.querySelector('.context');
        if (context) contextMark = new Mark(context);

        const getUnmark = m => document.querySelectorAll(`.string-list .${m}:not(:has( mark:not([data-markjs])))`);
        listOriginalMark = new Mark(getUnmark('original'));
        listTranslationMark = new Mark(getUnmark('translation'));
        markSearchParamsInList();
        ensureListMarkInView();
    }

    function watchContextBtn() {
        const btn = document.querySelector('.float-right a');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const context = document.querySelector('.context');
            if (!context) return;
            removeContextTags();

            const original = document.querySelector('.editor-core .original').textContent;
            contextMark = new Mark(context);
            markContext(original);
        });
    }

    function ensureListMarkInView() {
        document.querySelectorAll(`.string-list :is(.original, .translation) mark:first-of-type`).forEach(mark => {
            const container = mark.parentElement;
            const containerRect = container.getBoundingClientRect();
            const markRect = mark.getBoundingClientRect();
            const markLeft = markRect.left - containerRect.left;

            const containerWidth = container.clientWidth;
            const containerCenter = containerWidth / 2;

            if (markLeft >= 0 && markLeft <= containerCenter) return;

            const targetScrollLeft = markLeft - containerCenter + (markRect.width / 2);
            container.scrollLeft = targetScrollLeft;
        });
    }

    function mark(target, keywords, options, caseSensitive) {
        if (!target) return;
        target.unmark();

        caseSensitive ??= !document.querySelector('.sidebar .custom-checkbox')?.__vue__.$data.localChecked;
        const flags = caseSensitive ? 'g' : 'ig';

        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        let patterns;
        if (typeof keywords === 'string') {
            patterns = escapeRegExp(keywords);
        } else {
            const { contains, startsWith, endsWith, match } = keywords;

            patterns = [
                ...contains.map(keyword => `(${escapeRegExp(keyword)})`),
                ...startsWith.map(keyword => `^(${escapeRegExp(keyword)})`),
                ...endsWith.map(keyword => `(${escapeRegExp(keyword)})$`),
                match
            ].filter(p => p.length).join('|');
        }

        if (patterns) {
            const regex = new RegExp(patterns, flags);
            target.markRegExp(regex, {
                acrossElements: true,
                separateWordSearch: false,
                ...options
            });
        }
    }

    function markOrigin(keywords) {
        mark(originMark, keywords);
    }

    function markList(markObject, keywords) {
        mark(markObject, keywords, { acrossElements: false });
    }
    function markListOriginal(keywords) {
        markList(listOriginalMark, keywords);
    }
    function markListTranslation(keywords) {
        markList(listTranslationMark, keywords);
    }

    function markContext(originTxt) {
        mark(contextMark, originTxt, { className: 'mark' });
    }

    function markEditing(keywords) {
        let textarea = document.querySelector('textarea.translation');
        if (!textarea) return;
        const lastOverlay = document.getElementById('PZSoverlay');
        if (lastOverlay) return;

        const overlay = document.createElement('div');
        overlay.id = 'PZSoverlay';
        overlay.className = textarea.className;
        const textareaStyle = window.getComputedStyle(textarea);
        for (let i = 0; i < textareaStyle.length; i++) {
            const property = textareaStyle[i];
            overlay.style[property] = textareaStyle.getPropertyValue(property);
        }

        textarea.parentNode.appendChild(overlay);

        const updOverlay = () => {
            overlay.innerText = textarea.value;
            mark(new Mark(overlay), keywords);
            overlay.style.top = textarea.offsetTop + 'px';
            overlay.style.left = textarea.offsetLeft + 'px';
            overlay.style.width = textarea.offsetWidth + 'px';
            overlay.style.height = textarea.offsetHeight + 'px';
        };

        updOverlay();

        textarea.addEventListener('input', updOverlay);

        const observer = new MutationObserver(updOverlay);
        observer.observe(textarea, { attributes: true });

        const resizeObserver = new ResizeObserver(updOverlay);
        resizeObserver.observe(textarea);

        const cancelOverlay = () => {
            observer.disconnect();
            textarea.removeEventListener('input', updOverlay);
            resizeObserver.disconnect();
            overlay.remove();
        }
        return cancelOverlay;
    }
    // #endregion

    // #region 修复原文排版崩坏和<<>> fixOrigin(originElem)
    // function fixOriginTwins(originElem) {
    //     fixOriginTerms(originElem);
    //     originElem.innerHTML = originElem.innerHTML
    //     .replaceAll(/<var data-type="(\d)">(&lt;&lt;[^<]*?&gt;)<\/var>&gt;/g, '<var data-type="$1">$2&gt;</var>');
    // }
    // function fixOriginTerms(originElem) {
    //     originElem.innerHTML = originElem.innerHTML
    //     .replaceAll('<abbr title="noun.>" data-value=">">&gt;</abbr>', '&gt;')
    //     .replaceAll('<abbr="" title="noun.>" data-value=">">&gt;\n&gt;', '>\n</var>')
    //     .replaceAll('<var class="<abbr" title="noun.“”" data-value="“”">"line-break<abbr title="noun.“”" data-value="“”">"</abbr>&gt;\n</var>', '<var class="line-break">\n</var>')
    //     .replaceAll('<i class="<abbr" title="noun.“”" data-value="“”">"lf<abbr title="noun.“”" data-value="“”">"</abbr>&gt;&gt;', '')
    //     .replaceAll('<i class="<abbr" title="noun.“”" data-value="“”">"lf<abbr title="noun.“”" data-value="“”">"</abbr>&gt;', '');
    // }
    // #endregion

    // #region 还原上下文HTML源码 removeContextTags
    function removeContextTags() {
        const context = document.querySelector('.context .well');
        if (!context) return;
        // eslint-disable-next-line no-self-assign
        context.textContent = context.textContent;
    }
    // #endregion

    // #region 修复 Ctrl 唤起菜单的<<>> fixTagSelect
    // const insertTag = debounce(async (tag) => {
    //     const textarea = document.querySelector('textarea.translation');
    //     const startPos = textarea.selectionStart;
    //     const endPos = textarea.selectionEnd;
    //     const currentText = textarea.value;

    //     const before = currentText.slice(0, startPos);
    //     const after = currentText.slice(endPos);

    //     await mockInput(before.slice(0, Math.max(before.length - tag.length + 1, 0)) + tag + after.slice(0, -2)); // -2 去除\n

    //     textarea.selectionStart = startPos + 1;
    //     textarea.selectionEnd = endPos + 1;
    // })

    // let activeTag = null;
    // let modifiedTags = [];
    // const tagSelectController = new AbortController();
    // const { tagSelectSignal } = tagSelectController;

    // function tagSelectHandler(e) {
    //     if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
    //         activeTag &&= document.querySelector('.list-group-item.tag.active');
    //     }
    //     if (e.key === 'Enter') {
    //         if (!activeTag) return;
    //         if (!modifiedTags.includes(activeTag)) return;
    //         e.preventDefault();
    //         insertTag(activeTag?.textContent);
    //         activeTag = null;
    //     }
    // }

    // function updFixedTags() {

    //     const tags = document.querySelectorAll('.list-group-item.tag');
    //     activeTag = document.querySelector('.list-group-item.tag.active');
    //     modifiedTags = [];

    //     for (const tag of tags) {
    //         tag.innerHTML = tag.innerHTML.trim();
    //         if (tag.innerHTML.startsWith('&lt;&lt;') && !tag.innerHTML.endsWith('&gt;&gt;')) {
    //             tag.innerHTML += '&gt;';
    //             modifiedTags.push(tag);
    //         }
    //     }

    //     document.addEventListener('keyup', tagSelectHandler, { tagSelectSignal });

    // }
    // #endregion

    // #region 将填充原文移到右边，增加填充原文并保存 tweakButtons
    function tweakButtons() {
        const copyButton = document.querySelector('button.btn-secondary:has(.fa-clone)');
        const rightButtons = document.querySelector('.right .btn-group');

        if (rightButtons) {
            if (copyButton) {
                rightButtons.insertBefore(copyButton, rightButtons.firstChild);
            }
            if (document.querySelector('#PZpaste')) return;
            const pasteSave = document.createElement('button');
            rightButtons.appendChild(pasteSave);
            pasteSave.id = 'PZpaste';
            pasteSave.type = 'button';
            pasteSave.classList.add('btn', 'btn-secondary');
            pasteSave.title = '填充原文并保存';
            pasteSave.innerHTML = '<i aria-hidden="true" class="far fa-save"></i>';
            pasteSave.addEventListener('click', async () => {
                await mockInput(document.querySelector('.editor-core .original')?.textContent);
                document.querySelector('.right .btn-primary')?.click();
            });
        }
    }
    // #endregion

    // #region 缩略对比差异中过长无差异文本 extractDiff extractText
    function extractDiff() {
        document.querySelectorAll('.diff-wrapper:not(.extracted-diff)').forEach(wrapper => {
            [...wrapper.childNodes].filter(node => node.length >= 200).forEach(node => extractText(node));
            wrapper.classList.add('extracted-diff');
        });
    }

    function extractHist() {
        extractDiff();
        const nonDiff = [...document.querySelectorAll(':is(.original, .translation):not(.extracted-diff)')];
        nonDiff.forEach(node => {
            if (node.textContent.length >= 200) {
                // eslint-disable-next-line no-self-assign
                node.textContent = node.textContent;
                extractText(node.firstChild, true);
            }
            node.classList.add('extracted-diff');
        });
    }

    function extractText(node, dual = false) {
        const text = node.cloneNode();
        const expand = document.createElement('span');
        expand.classList.add('pz-expandable');
        expand.textContent = `${node.textContent.slice(0, 100)} ... ${node.textContent.slice(-100)}`;

        let time = 0;
        let isMoving = false;
        expand.expandEvent = () => expand.replaceWith(text);

        const start = () => {
            time = Date.now()
            isMoving = false;
        }
        const end = () => {
            if (isMoving || Date.now() - time > 500) return;
            if (dual) {
                const wrapper = expand.parentElement;
                const counter = wrapper.previousElementSibling || wrapper.nextElementSibling;
                counter.firstElementChild?.expandEvent?.();
            }
            expand.expandEvent();
        }

        expand.addEventListener('mousedown', start);
        expand.addEventListener('mouseup', end);
        expand.addEventListener('mouseleave', () => time = 0);

        expand.addEventListener('touchstart', start);
        expand.addEventListener('touchend', end);
        expand.addEventListener('touchcancel', () => time = 0);
        expand.addEventListener('touchmove', () => isMoving = true);

        node.replaceWith(expand);
    }
    // #endregion

    // #region 点击对比差异绿色文字粘贴其中文本 initDiffClick
    function initDiffClick() {
        const addeds = document.querySelectorAll('.diff.added:not(.add-clickable)');
        for (const added of addeds) {
            added.classList.add('add-clickable');
            const text = added.textContent.replaceAll('\\n', '\n').replaceAll('↵', '\n');
            added.addEventListener('click', () => {
                mockInsert(text);
            });
        }
    }
    // #endregion

    // #region 快速搜索原文 addCopySearchBtn
    async function addCopySearchBtn() {
        if (document.querySelector('#PZsch')) return;
        const originSch = document.querySelector('.btn-sm');
        if (!originSch) return;
        originSch.insertAdjacentHTML('beforebegin', '<button id="PZsch" type="button" class="btn btn-secondary btn-sm"><i aria-hidden="true" class="far fa-paste"></i></button>');
        const newSch = document.querySelector('#PZsch');
        newSch.addEventListener('click', async () => {
            const original = document.querySelector('.editor-core .original')?.textContent;
            let input = document.querySelector('.search-form input[type=search]');
            if (!input) {
                await (() => new Promise(resolve => resolve(originSch.click())))();
                input = document.querySelector('.search-form input[type=search]');
            }
            const submit = document.querySelector('.search-form button');
            await (() => new Promise(resolve => {
                input.value = original;
                input.dispatchEvent(new Event('input', {
                    bubbles: true,
                    cancelable: true,
                }));
                resolve();
            }))();
            submit.click();
        });
    }
    // #endregion

    // #region 进入下一条时关闭搜索结果 cancelSearchResult
    function cancelSearchResult() {
        const input = document.querySelector('.search-form input[type=search]');
        if (input) document.querySelectorAll('.btn-sm')[1]?.click();
    }
    // #endregion

    // #region 页内搜索结果高亮 renderSearchResult(originTxt)
    let inPageKeyword = '';
    let resultMark;
    function renderSearchResult() {
        const results = document.querySelectorAll('.string-item :is(.original, .translation)');
        resultMark = new Mark(results);
        mark(resultMark, inPageKeyword, {
            separateWordSearch: true,
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
        }, false);
    }
    // #endregion

    // #region 建议对比差异选择模式 newDiff unDiffAll
    let unDiffAll = () => { };
    function newDiff(originTxt) {
        unDiffAll();
        document.querySelectorAll('.original.mb-1 span + a, .pz-diff-cog').forEach(a => a.remove());
        const strings = document.querySelectorAll('.original.mb-1 span');

        const { $diff } = document.querySelector('main').__vue__;

        for (const string of strings) {
            string.oriHTML = string.innerHTML;
            const strText = string.textContent;
            const showDiff = document.createElement('a');
            showDiff.title = '查看差异';
            showDiff.href = '#';
            showDiff.target = '_self';
            showDiff.classList.add('small');
            showDiff.innerHTML = '<i aria-hidden="true" class="far fa-right-left-large"></i>';

            const diffCog = makeDiffCog(() => {
                string.innerHTML = diffByMode();
                string.isShown = true;
            });

            string.after(' ', showDiff, ' ', diffCog);
            showDiff.addEventListener('click', function (e) {
                e.preventDefault();
                string.innerHTML = string.isShown ? string.oriHTML : diffByMode();
                string.isShown = !string.isShown;
            });

            function diffByMode() {
                return $diff(strText, originTxt, { mode: localStorage.getItem('pzdiffmode') || 'auto' });
            }
        }
        unDiffAll = () => {
            [...strings].filter(string => string.isShown).forEach(string => string.innerHTML = string.oriHTML);
        };
    }

    function makeDiffCog(onDiffModeChange) {
        const button = document.createElement('a');
        button.href = '#';
        button.className = 'hover mr-1 pz-diff-cog';
        button.innerHTML = '<i aria-hidden="true" class="far fa-cog"></i>';

        // 从 localStorage 获取配置
        const savedMode = localStorage.getItem('pzdiffmode') || 'auto';

        // 定义选项配置
        const modeOptions = [
            { value: 'auto', label: '自动' },
            { value: 'chars', label: '按字' },
            { value: 'words', label: '按词' },
            { value: 'sentences', label: '按句' }
        ];

        // 生成单选按钮组 HTML
        const radioButtons = modeOptions.map(option => `
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input"
                    value="${option.value}"
                    id="diff${option.value.charAt(0).toUpperCase() + option.value.slice(1)}"
                    name="diffMode"
                    ${savedMode === option.value ? 'checked' : ''}>
                <label class="custom-control-label"
                    for="diff${option.value.charAt(0).toUpperCase() + option.value.slice(1)}">
                    ${option.label}
                </label>
            </div>
        `).join('');

        // 创建菜单元素
        const menu = document.createElement('div');
        menu.className = 'popover b-popover bs-popover-bottom';
        menu.style.cssText = 'position: absolute; will-change: transform;';
        menu.innerHTML = /* html */`
            <div class="arrow"></div>
            <div class="popover-body">
                <fieldset class="form-group" id="diffModeGroup">
                    <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0">差分模式</legend>
                    <div>
                        <div role="radiogroup" tabindex="-1" class="bv-no-focus-ring">
                            ${radioButtons}
                        </div>
                    </div>
                </fieldset>
            </div>
        `;

        // 菜单位置计算
        function positionMenu() {
            const buttonRect = button.getBoundingClientRect();
            const menuWidth = menu.offsetWidth;
            const buttonCenterX = buttonRect.left + buttonRect.width / 2 + window.scrollX;

            menu.style.top = `${buttonRect.bottom + window.scrollY}px`;
            menu.style.left = `${buttonCenterX - menuWidth / 2}px`;

            const arrow = menu.querySelector('.arrow');
            const arrowWidth = arrow.offsetWidth;
            arrow.style.left = `${(menu.offsetWidth - arrowWidth) / 2}px`;
        }

        // 状态管理
        let isMenuVisible = false;
        let isMenuLocked = false;
        let menuTimer = null;

        // 显示菜单
        function showMenu() {
            if (!document.body.contains(menu)) {
                document.body.appendChild(menu);
            }
            positionMenu();
            isMenuVisible = true;
            button.classList.add('active');
        }

        // 隐藏菜单
        function hideMenu() {
            if (document.body.contains(menu)) {
                menu.remove();
                isMenuVisible = false;
                isMenuLocked = false;
                button.classList.remove('active');
            }
        }

        // 悬浮事件 - 修改这里
        button.addEventListener('mouseenter', () => {
            if (!isMenuLocked) {
                showMenu();
            }
            clearTimeout(menuTimer);
        });

        // 修改这里：当鼠标离开按钮时，如果菜单可见且没有被锁定，则设置延迟隐藏
        button.addEventListener('mouseleave', () => {
            if (!isMenuLocked && isMenuVisible) {
                menuTimer = setTimeout(hideMenu, 500);
            }
        });

        // 菜单的鼠标进入事件 - 新增
        menu.addEventListener('mouseenter', () => {
            if (isMenuVisible) {
                clearTimeout(menuTimer); // 清除延迟隐藏的计时器
            }
        });

        // 菜单的鼠标离开事件 - 新增
        menu.addEventListener('mouseleave', () => {
            if (isMenuVisible && !isMenuLocked) {
                menuTimer = setTimeout(hideMenu, 500); // 设置延迟隐藏
            }
        });

        // 点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isMenuLocked = !isMenuLocked;

            if (isMenuLocked) {
                showMenu();
            } else {
                hideMenu();
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (isMenuVisible && !button.contains(e.target) && !menu.contains(e.target)) {
                hideMenu();
            }
        });

        // 滚动更新位置
        window.addEventListener('scroll', () => {
            if (isMenuVisible) {
                positionMenu();
            }
        }, true);

        // 模式变更处理
        menu.querySelectorAll('input[name="diffMode"]').forEach(input => {
            input.addEventListener('change', () => {
                localStorage.setItem('pzdiffmode', input.value);
                onDiffModeChange();
            });
        });

        return button;
    }

    // #region 自动保存全部相同词条 autoSaveAll
    const autoSave = localStorage.getItem('pzdiffautosave');
    function autoSaveAll() {
        const button = document.querySelector('.modal-dialog .btn-primary');
        if (autoSave && button.textContent === '保存全部') button.click();
    }
    // #endregion

    // #region 自动填充100%相似译文 autoFill100(suggests, originTxt)
    let menuId;
    const updateMenu = () => {
        const isOn = GM_getValue('auto100');
        if (menuId) GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand(
            `${isOn ? '关闭' : '开启'}自动填充`,
            () => {
                GM_setValue('auto100', !isOn);
                updateMenu();
            }
        );
    };
    updateMenu();
    function autoFill100(suggests, originTxt) {
        if (!GM_getValue('auto100') || !suggests[0]) return;
        const getSim = (suggest) => +suggest.querySelector('header span')?.textContent.split('\n')?.[2]?.trim().slice(0, -1);
        const getTranslation = (suggest) => suggest.querySelector('.translation').firstChild.textContent;
        for (const suggest of suggests) {
            const sim = getSim(suggest);
            const equalOrigin = [100, 101].includes(sim) || isEqualWithOneCharDifference(originTxt, getOriginalFromSuggest(suggest));
            if (equalOrigin) {
                mockInput(getTranslation(suggest));
                break;
            }
        }
    }

    function isEqualWithOneCharDifference(str1, str2) {
        if (str1 === str2) return true;

        if (Math.abs(str1.length - str2.length) > 1) return false;

        let differences = 0;
        const len1 = str1.length;
        const len2 = str2.length;
        let i = 0, j = 0;

        while (i < len1 && j < len2) {
            if (str1[i] !== str2[j]) {
                differences++;
                if (differences > 1) return false;

                if (len1 > len2) i++;
                else if (len2 > len1) j++;
                else {
                    i++;
                    j++;
                }
            } else {
                i++;
                j++;
            }
        }

        if (i < len1 || j < len2) differences++;

        return differences <= 1;
    }
    // #endregion

    // #region 重新排序历史词条 findTextWithin(suggests, originTxt) getDefaultSorted addReSortBtn
    function findTextWithin(suggests, originTxt, searching = false) {
        if (!suggests[0]) return;
        originTxt = normalizeString(originTxt);
        const getHeaderSpanIfNotSame = searching ? (header, original) => {
            const headerSpan = document.createElement('span');
            header.prepend(headerSpan);
            if (original === originTxt) {
                headerSpan.textContent = '匹配率 100%';
                return null;
            }
            return headerSpan;
        } : (header) => {
            return header.querySelector('span');
        };
        for (const suggest of suggests) {
            const suggestOri = getOriginalFromSuggest(suggest);
            const header = suggest.querySelector('header');
            let headerSpan;
            if (!(headerSpan = getHeaderSpanIfNotSame(header, suggestOri))) continue;

            if (suggestOri.includes(originTxt)) {
                suggest.parentNode.prepend(suggest);
                if (headerSpan.textContent.includes('100%') || headerSpan.textContent.includes('101%')) return;
                headerSpan.textContent = '文本在中';
            }
        }
    }

    const reSortSuggests = (compareFn) => (suggests) => {
        if (!suggests[0]) return;
        const sorted = [...suggests].sort(compareFn);
        const parent = suggests[0].parentNode;
        const frag = document.createDocumentFragment();
        frag.append(...sorted);
        parent.innerHTML = '';
        parent.appendChild(frag);
    };

    const reSortSuggestsBySim = reSortSuggests((a, b) => {
        const getSim = (suggest) => {
            const simContainer = suggest.querySelector('header span');
            if (!simContainer) return 102;
            const sim = +simContainer.textContent.split('\n')?.[2]?.trim().slice(0, -1);
            if (!sim) return 99.999; // 在文本中
            return sim;
        }
        return getSim(b) - getSim(a);
    });

    const reSortSuggestsByTime = reSortSuggests((a, b) => {
        const getTimestamp = (suggest) => {
            const time = suggest.querySelector('time')?.dateTime;
            if (!time) return Infinity;
            return +new Date(time);
        }
        return getTimestamp(b) - getTimestamp(a);
    });

    const reSortSuggestsByMem = (suggests) => {
        const sortType = localStorage.getItem('pzdiffsort') || 'sim';
        if (sortType === 'sim') {
            reSortSuggestsBySim(suggests);
        } else if (sortType === 'time') {
            reSortSuggestsByTime(suggests);
        }
    };

    let defaultSortedSuggests = [];
    const getDefaultSorted = (suggests, searching = false) => {
        defaultSortedSuggests[+searching] = suggests;
    };
    function recoverDefaultSort() {
        const parent = document.querySelector('.translation-memory .list:not(.mt-list)');
        if (!parent) return;
        const searching = !!document.querySelector('.search-form');
        parent.append(...defaultSortedSuggests[+searching]);
    }

    function addReSortBtn() {
        if (document.querySelector('.pzdiffsort')) return;
        const btn = document.createElement('a');
        btn.href = 'javascript:';
        btn.className = 'pzdiffsort';
        const icon = type => {
            const icon = document.createElement('i');
            icon.classList.add('far', `fa-${type}`);
            icon.ariaHidden = true;
            return icon;
        }

        const simBtn = btn.cloneNode();
        simBtn.title = '按相似度排序';
        simBtn.append(icon('percentage'));
        simBtn.addEventListener('click', () => {
            const suggests = document.querySelectorAll('.string-item');
            reSortSuggestsByTime(suggests);
            localStorage.setItem('pzdiffsort', 'time');
            simBtn.replaceWith(timeBtn);
        });

        const timeBtn = btn.cloneNode();
        timeBtn.title = '按时间排序';
        timeBtn.append(icon('history'));
        timeBtn.addEventListener('click', () => {
            recoverDefaultSort();
            localStorage.setItem('pzdiffsort', 'default');
            timeBtn.replaceWith(defaultBtn);
        });

        const defaultBtn = btn.cloneNode();
        defaultBtn.title = '默认排序';
        defaultBtn.append(icon('sort-amount-down'));
        defaultBtn.addEventListener('click', () => {
            const suggests = document.querySelectorAll('.string-item');
            reSortSuggestsBySim(suggests);
            localStorage.setItem('pzdiffsort', 'sim');
            defaultBtn.replaceWith(simBtn);
        });

        const sortType = localStorage.getItem('pzdiffsort') || 'sim';
        const initBtn = {
            sim: simBtn,
            time: timeBtn,
            default: defaultBtn,
        };
        document.querySelector('.translation-memory .col-auto').after(initBtn[sortType]);
    }
    // #endregion

    // #region 修改历史词条按钮 tweakHist
    function tweakHist() {
        addCopySearchBtn();
        addReSortBtn();
    }
    // #endregion

    // #region 修正 popover 定位 positionPopover
    function positionPopover(popover) {
        const hovered = document.querySelector(`[aria-describedby="${popover.id}"]`);
        const direction = popover.classList.contains('bs-popover-bottom') ? 'bottom' :
            popover.classList.contains('bs-popover-right') ? 'right' : null;
        if (!hovered || !direction) return;

        const hoveredRect = hovered.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        if (direction === 'bottom') {
            const top = hoveredRect.bottom + scrollY;
            let left = hoveredRect.left + (hoveredRect.width / 2) + scrollX - (popover.offsetWidth / 2);
            left = Math.max(5 + scrollX, Math.min(left, document.documentElement.clientWidth - popover.offsetWidth - 5 + scrollX));
            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;
        } else if (direction === 'right') {
            let top = hoveredRect.top + scrollY;
            top = Math.max(5 + scrollY, Math.min(top, document.documentElement.clientHeight - popover.offsetHeight - 5 + scrollY));
            const left = hoveredRect.right + scrollX;
            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;
        }
    }


    // #region 初始化自动编辑 initAuto
    async function initAuto() {
        const avatars = await waitForElems('.nav-item.user-info');
        avatars.forEach(async (avatar) => {
            let harvesting = false;
            let translationPattern, skipPattern, userTime;
            avatar.insertAdjacentHTML('afterend', `<li class="nav-item"><a href="javascript:;" target="_self" class="PZpp nav-link" role="button">PP收割机</a></li>`);
            document.querySelectorAll('.PZpp').forEach(btn => btn.addEventListener('click', async (e) => {
                if (location.pathname.split('/')[3] !== 'strings') return;
                harvesting = !harvesting;
                if (harvesting) {
                    e.target.style.color = '#dc3545';
                    translationPattern = prompt(`请确认译文模板代码，字符串用'包裹；常用代码：
    original（原文）
    oldTrans（现有译文）
    suggest（第1条翻译建议）
    suggestSim（上者匹配度，最大100）`, 'original');
                    if (translationPattern === null) return cancel();
                    skipPattern = prompt(`请确认跳过条件代码，多个条件用逻辑运算符相连；常用代码：
    original.match(/^(\s|\n|<<.*?>>|<.*?>)*/gm)[0] !== original（跳过并非只包含标签）
    oldTrans（现有译文）
    suggest（第1条翻译建议）
    suggestSim（上者匹配度，最大100）
    context（上下文内容）`, '');
                    if (skipPattern === null) return cancel();
                    if (skipPattern === '') skipPattern = 'false';
                    userTime = prompt('请确认生成译文后等待时间（单位：ms）', '500');
                    if (userTime === null) return cancel();
                    function cancel() {
                        harvesting = false;
                        e.target.style.color = '';
                    }
                } else {
                    e.target.style.color = '';
                    return;
                }

                const hideAlert = document.createElement('style');
                document.head.appendChild(hideAlert);
                hideAlert.innerHTML = '.alert-success.alert-global{display:none}';

                const checkboxs = [...document.querySelectorAll('.right .custom-checkbox')].slice(0, 2);
                const checkboxValues = checkboxs.map(e => e.__vue__.$data.localChecked);
                checkboxs.forEach(e => e.__vue__.$data.localChecked = true);

                const print = {
                    waiting: () => console.log('%cWAITING...', 'background: #007BFF; color: #282828; font-weight: 900; padding: 0 5px; font-size: 12px; border-radius: 2px'),
                    skip: () => console.log('%cSKIP', 'background: #FFC107; color: #282828; font-weight: 900; padding: 0 5px; font-size: 12px; border-radius: 2px'),
                    click: () => console.log('%cCLICK', 'background: #20C997; color: #282828; font-weight: 900; padding: 0 5px; font-size: 12px; border-radius: 2px'),
                    end: () => console.log('%cTHE END', 'background: #DE065B; color: white; font-weight: 900; padding: 0 5px; font-size: 12px; border-radius: 2px'),
                }

                const INTERVAL = 100;
                let interval = INTERVAL;
                let lastInfo = null;

                function prepareWait() {
                    print.waiting();
                    interval = INTERVAL;
                    lastInfo = null;
                    return true;
                }

                function skipOrFin(originElem, nextButton) {
                    if (nextString(nextButton)) return false;
                    print.skip();
                    interval = 50;
                    lastInfo = [
                        originElem,
                        location.search.match(/(?<=(\?|&)page=)\d+/g)?.[0] ?? 1
                    ];
                    return true;
                }

                function nextString(button) {
                    if (button.disabled) {
                        print.end();
                        harvesting = false;
                        e.target.style.color = '';
                        return true;
                    }
                    button.click();
                    return false;
                }

                try {
                    while (true) {
                        await sleep(interval);

                        if (lastInfo) {
                            const [lastOrigin, lastPage] = lastInfo;
                            // 已点击翻页，但原文未发生改变
                            const skipWaiting = (location.search.match(/(?<=(\?|&)page=)\d+/g)?.[0] ?? 1) !== lastPage
                                && document.querySelector('.editor-core .original') === lastOrigin;
                            if (skipWaiting && prepareWait()) continue;
                        }

                        const originElem = document.querySelector('.editor-core .original');
                        if (!originElem && prepareWait()) continue;
                        const nextButton = document.querySelectorAll('.navigation .btn-secondary')[1];
                        if (!nextButton && prepareWait()) continue;

                        // eslint-disable-next-line no-unused-vars
                        const original = originElem.textContent;
                        // eslint-disable-next-line no-unused-vars
                        const oldTrans = document.querySelector('textarea.translation').value;
                        let suggest = null, suggestSim = 0;
                        if (translationPattern.includes('suggest') || skipPattern.includes('suggest')) {
                            const suggestEle = (await waitForElems('.translation-memory .string-item .translation, .empty-sign'))[0];
                            if (suggestEle.classList.contains('empty-sign')) {
                                if (skipOrFin(originElem, nextButton)) continue; else break;
                            }
                            // eslint-disable-next-line no-unused-vars
                            suggest = suggestEle.textContent;
                            suggestSim = +suggestEle.querySelector('header span')?.textContent.split('\n')?.[2]?.trim().slice(0, -1);
                            if ((translationPattern.includes('suggestSim') || skipPattern.includes('suggestSim')) && isNaN(suggestSim)) {
                                if (skipOrFin(originElem, nextButton)) continue; else break;
                            }
                        }
                        // eslint-disable-next-line no-unused-vars
                        const context = document.querySelector('.context')?.textContent;

                        if (eval(skipPattern)) {
                            if (skipOrFin(originElem, nextButton)) continue; else break;
                        }

                        const translation = eval(translationPattern);
                        if (!translation && prepareWait()) continue;

                        await mockInput(translation);
                        await sleep(userTime);
                        if (!harvesting) break; // 放在等待后，以便在等待间隔点击取消

                        const translateButton = document.querySelector('.right .btn-primary');
                        if (!translateButton) {
                            if (skipOrFin(originElem, nextButton)) continue; else break;
                        } else {
                            translateButton.click();
                            print.click();
                            interval = INTERVAL;
                            lastInfo = null;
                            continue;
                        }
                    }
                } catch (e) {
                    console.error(e);
                    alert('出错了！');
                } finally {
                    hideAlert.remove();
                    checkboxs.forEach((e, i) => { e.__vue__.$data.localChecked = checkboxValues[i] });
                }

            }));
        });
    }
    // #endregion

    // #endregion

    // #region 函数调用逻辑

    addHotkeys();
    initAuto();

    let stringPageTurned = true;
    async function actByPath(path) {
        if (path.split('/').pop() === 'strings') {

            let originalEle;
            let lastOriginHTML = '';
            let toObserve = document.body;

            const observer = new MutationObserver((mutations) => {

                if (shouldSkip()) return;

                originalEle = document.querySelector('.editor-core .original');
                if (!originalEle) return;
                const originUpded = originalEle.innerHTML !== lastOriginHTML;
                lastOriginHTML = originalEle.innerHTML;

                observer.disconnect();
                initDiffClick();
                extractDiff();

                const markAll = () => {
                    // fixOriginTwins(original);
                    removeContextTags();
                    markSearchParams();
                    markContext(originalEle.textContent);
                };

                if (stringPageTurned) {
                    if (!originUpded) {
                        connectObserve();
                        return;
                    }
                    console.debug('framework loaded');
                    initDropMark();
                    initMarkJS();
                    tweakHist();
                    watchContextBtn();
                    markAll();
                    tweakButtons();
                    stringPageTurned = false;
                    connectObserve();
                    return;
                }

                if (originUpded) {
                    console.debug('origin upded');
                    cancelSearchResult();
                    markAll();
                    if (!document.getElementById('PZpaste')) tweakButtons(); // 防止他人占用按钮消失
                }

                mutations = mutations.filter(({ addedNodes, removedNodes }) => !(
                    [addedNodes[0]?.nodeName, removedNodes[0]?.nodeName].includes('#comment') ||
                    (addedNodes.length === 1 && (addedNodes[0].classList?.contains('square-image') ||
                        addedNodes[0].classList?.contains('fa-copy') ||
                        addedNodes[0].href === 'javascript:'))
                    || (removedNodes.length === 1 && removedNodes[0].classList?.contains('fa-copy'))
                ));
                for (const mutation of mutations) {
                    const { addedNodes, removedNodes } = mutation;
                    // console.debug({ addedNodes, removedNodes });
                    if (addedNodes.length === 1) {
                        const node = addedNodes[0];
                        // if (node.matches?.('.list-group.tags')) {
                        //     updFixedTags();
                        //     continue;
                        // }
                        if (node.matches?.('.string-item a.small')) {
                            node.remove();
                            continue;
                        }
                        if (node.matches?.('.modal-backdrop')) {
                            autoSaveAll();
                            continue;
                        }
                        if (node.classList?.contains('search-form')) {
                            console.debug('search expanded');
                            renderSearchResult(originalEle.textContent);
                            newDiff(originalEle.textContent);
                            continue;
                        }
                        if (node.classList?.contains('translation-memory')) {
                            console.debug('suggests layout switched');
                            tweakHist();
                            continue;
                        }
                        if (node.classList?.contains('b-popover')) {
                            positionPopover(node);
                        }
                        // if (node.classList?.contains('results')) {
                        //     console.debug('terms loaded');
                        //     fixOriginTerms(original);
                        // }
                        // if (node.classList?.contains('ghost-textarea')) {
                        //     fixOriginTwins(node);
                        //     continue;
                        // }
                    } else if (removedNodes.length === 1) {
                        const node = removedNodes[0];
                        if (mutation.target.classList?.contains('translation-memory')
                            && node.classList?.contains('loading')) {
                            console.debug('suggests loaded');
                            const suggests = document.querySelectorAll('.string-item');

                            const searchInput = document.querySelector('.search-form input');
                            if (searchInput) {
                                inPageKeyword = searchInput.value;
                                console.debug('search loaded: ', inPageKeyword);
                                renderSearchResult(originalEle.textContent);
                            }

                            findTextWithin(suggests, originalEle.textContent, !!searchInput);
                            getDefaultSorted(suggests, !!searchInput);
                            autoFill100(suggests, originalEle.textContent);
                            reSortSuggestsByMem(suggests);
                            newDiff(originalEle.textContent);

                            continue;
                        } else if (node.classList?.contains('search-form')) {
                            console.debug('search collapsed');
                            const suggests = document.querySelectorAll('.string-item');
                            resultMark?.unmark?.();
                            findTextWithin(suggests, originalEle.textContent);
                            reSortSuggestsByMem(suggests);
                            newDiff(originalEle.textContent);
                        }
                        // if (node.matches?.('.list-group.tags')) {
                        //     tagSelectController.abort();
                        //     continue;
                        // }
                    }
                    // if (addedNodes[0]?.parentElement?.classList.contains('ghost-textarea')) {
                    //     fixOriginTwins(document.querySelector('.ghost-textarea'));
                    // }
                }

                connectObserve();
            });

            connectObserve();
            function connectObserve() {
                observer.observe(toObserve, {
                    childList: true,
                    subtree: true,
                });
            }

            return observer;

        } else if (path.split('/').at(-2) === 'issues') {
            waitForElems('.text-content p img').then((imgs) => imgs.forEach(mediumZoom));
        } else if (path.split('/').pop() === 'history') {

            let observer = new MutationObserver(() => {
                observer.disconnect();
                extractHist();
                connectObserve();
            });

            connectObserve();
            function connectObserve() {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }

            return observer;

        }
    }
    let cancelAct = await actByPath(location.pathname);
    (await waitForElems('main'))[0].__vue__.$router.afterHooks.push(async (to, from) => {
        dropLastTextareaMark?.();
        if (JSON.stringify(to.query) !== JSON.stringify(from.query)) {
            console.debug('query changed');
            if (to.path.split('/').pop() === 'strings') {
                stringPageTurned = true;
            }
        }
        if (to.path === from.path) return;
        // tagSelectController.abort();
        cancelAct?.disconnect();
        console.debug('path changed');
        cancelAct = await actByPath(to.path);
    });

    // #endregion

    // #region 通用工具函数
    function waitForElems(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelectorAll(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelectorAll(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    function mockInput(text) {
        return new Promise((resolve) => {
            const textarea = document.querySelector('textarea.translation');
            if (!textarea) return;
            textarea.value = text;
            textarea.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true,
            }));
            return resolve(0);
        })
    }

    function mockInsert(text) {
        const textarea = document.querySelector('textarea.translation');
        if (!textarea) return;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const currentText = textarea.value;

        const before = currentText.slice(0, startPos);
        const after = currentText.slice(endPos);

        mockInput(before + text + after);

        textarea.selectionStart = startPos + text.length;
        textarea.selectionEnd = endPos + text.length;
        textarea.focus();
    }

    function normalizeString(str) {
        if (!str) return '';
        return str
            .replace(/[,.;'"-]/g, '')
            .replace(/\s+/g, '')
            .toLowerCase();
    }

    function getOriginalFromSuggest(suggest) {
        return normalizeString(suggest.querySelector('.original')?.firstChild.textContent);
    }
    // #endregion

})();
