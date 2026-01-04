// ==UserScript==
// @name         TMS Case Per-Case Smart Filter
// @namespace    http://tampermonkey.net/
// @version      1.9.7
// @description  Фильтр кейсов с индивидуальным выбором сочетаний параметров для каждого кейса, поиском, названиями и перетаскиваемой кнопкой
// @match        https://ingr.firetms.ru/p/*/runs/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540928/TMS%20Case%20Per-Case%20Smart%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/540928/TMS%20Case%20Per-Case%20Smart%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Drag & Drop для кнопки ---
    function makeDraggable(btn, storageKey = 'tms-case-filter-btn-pos') {
        let offsetX, offsetY, isDragging = false, moved = false;

        // Восстановить позицию
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const {left, top} = JSON.parse(saved);
            btn.style.left = left;
            btn.style.top = top;
            btn.style.right = '';
            btn.style.bottom = '';
        } else {
            btn.style.right = '24px';
            btn.style.bottom = '24px';
        }

        btn.style.position = 'fixed';
        btn.style.userSelect = 'none';
        btn.style.width = '180px';
        btn.style.height = '40px';
        btn.style.fontSize = '16px';
        btn.style.background = '#1976d2';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        btn.style.cursor = 'pointer';
        btn.style.whiteSpace = 'nowrap';
        btn.style.textAlign = 'center';
        btn.style.lineHeight = '40px';
        btn.style.padding = '0';
        btn.style.resize = 'none';
        btn.style.display = 'block';
        btn.style.zIndex = '2147483647';

        function clampToViewport() {
            const vw = window.innerWidth || document.documentElement.clientWidth || 1920;
            const vh = window.innerHeight || document.documentElement.clientHeight || 1080;
            const btnWidth = btn.offsetWidth || 180;
            const btnHeight = btn.offsetHeight || 40;
            // Клэмпим только если используются left/top
            if (btn.style.left) {
                let l = parseFloat(btn.style.left);
                if (isFinite(l)) {
                    l = Math.max(0, Math.min(l, vw - btnWidth));
                    btn.style.left = l + 'px';
                }
            }
            if (btn.style.top) {
                let t = parseFloat(btn.style.top);
                if (isFinite(t)) {
                    t = Math.max(0, Math.min(t, vh - btnHeight));
                    btn.style.top = t + 'px';
                }
            }
            // Если после клэмпа кнопка всё ещё практически вне видимой области, сбрасываем в правый нижний угол
            const rect = btn.getBoundingClientRect();
            const isOffscreen = rect.right < 16 || rect.bottom < 16 || rect.left > vw - 16 || rect.top > vh - 16;
            if (isOffscreen) {
                btn.style.left = '';
                btn.style.top = '';
                btn.style.right = '24px';
                btn.style.bottom = '24px';
            }
        }

        // Клэмп сразу после применения стилей
        try { clampToViewport(); } catch (e) {}

        btn.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Только ЛКМ
            isDragging = true;
            moved = false;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            moved = true;
            btn.style.left = (e.clientX - offsetX) + 'px';
            btn.style.top = (e.clientY - offsetY) + 'px';
            btn.style.right = '';
            btn.style.bottom = '';
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                try { clampToViewport(); } catch (e) {}
                localStorage.setItem(storageKey, JSON.stringify({
                    left: btn.style.left,
                    top: btn.style.top
                }));
            }
        });

        // Адаптация при ресайзе окна
        window.addEventListener('resize', function() {
            try { clampToViewport(); } catch (e) {}
        });

        // Возвращаем функцию, чтобы узнать был ли drag, и функцию сброса moved
        return {
            wasMoved: () => moved,
            resetMoved: () => { moved = false; }
        };
    }

    // --- Сбор кейсов ---
    function getCases() {
        const allItems = document.querySelectorAll('.run-case__item');
        console.log('Всего кейсов найдено:', allItems.length);
        
        return Array.from(allItems).map((item, idx) => {
            const checkbox = item.querySelector('input[type="checkbox"].form-check-input.checkbox-title');
            if (!checkbox) return null;
            const paramsDiv = item.querySelector('.run-case__params');
            const paramsText = paramsDiv ? paramsDiv.textContent.trim().replace(/^Параметры:\s*/i, '') : '';
            const link = item.querySelector('a[href]');
            const name = link ? link.textContent.trim() : `Кейс #${idx+1}`;

            // Новый способ: ищем название в .run-case__title-text > .section-visible-tooltip-toggler:first-child > div
            let title = '';
            const titleBlock = item.querySelector('.run-case__title-text .section-visible-tooltip-toggler');
            if (titleBlock && titleBlock.getAttribute('data-tooltip-text')) {
                title = titleBlock.getAttribute('data-tooltip-text').trim();
            } else if (titleBlock) {
                // fallback: текст внутри div
                const innerDiv = titleBlock.querySelector('div');
                if (innerDiv) title = innerDiv.textContent.trim();
            }

            // Если не нашли, title остаётся пустым!

            const paramsObj = {};
            paramsText.split(';').forEach(pair => {
                const [k, v] = pair.split(':').map(s => s && s.trim());
                if (k && v) paramsObj[k] = v;
            });
            
            const caseId = getCaseId({name, link: link ? link.href : ''});
            const cachedVariations = globalCaseParamCache.get(caseId)?.size || 0;
            
            console.log(`Кейс ${idx}:`, {
                visible: item.offsetParent !== null,
                hasParamsDiv: !!paramsDiv,
                paramsText: paramsDiv ? paramsDiv.textContent : 'НЕТ',
                paramsCount: Object.keys(paramsObj).length,
                caseId: caseId,
                cachedVariations: cachedVariations
            });
            
            return {item, paramsText, paramsObj, name, title, link: link ? link.href : '', checkbox};
        }).filter(Boolean);
    }

    // --- Поиск скроллируемого контейнера для виртуализованных списков ---
    function getScrollableContainer() {
        const firstItem = document.querySelector('.run-case__item');
        let node = firstItem ? firstItem.parentElement : null;
        while (node) {
            try {
                const style = getComputedStyle(node);
                const overflowY = style ? style.overflowY : '';
                const isScrollable = /(auto|scroll)/i.test(overflowY) && node.scrollHeight > node.clientHeight + 8;
                if (isScrollable) return node;
            } catch (e) {}
            node = node.parentElement;
        }
        // Фолбэк: основной документ
        return document.scrollingElement || document.documentElement;
    }

    // --- Поиск внутренних прокручиваемых контейнеров внутри конкретного кейса ---
    function getInnerScrollablesWithinCase(caseItem) {
        if (!caseItem) return [];
        const result = [];
        
        // Ищем все потенциально прокручиваемые элементы
        const potentialScrollables = caseItem.querySelectorAll('*');
        
        for (const el of potentialScrollables) {
            try {
                // Проверяем computed styles
                const style = getComputedStyle(el);
                if (!style) continue;
                
                const overflowY = style.overflowY;
                const overflowX = style.overflowX;
                
                // Проверяем различные условия прокручиваемости
                let isScrollable = false;
                
                // 1. Явно заданный overflow-y: auto/scroll
                if (/(auto|scroll)/i.test(overflowY) && el.scrollHeight > el.clientHeight + 8) {
                    isScrollable = true;
                }
                
                // 2. Проверяем элементы с классом .run-case__params (где могут быть параметры)
                if (el.classList.contains('run-case__params') && el.scrollHeight > el.clientHeight + 8) {
                    isScrollable = true;
                }
                
                // 3. Проверяем элементы с data-attributes, указывающими на прокручиваемость
                if (el.hasAttribute('data-scrollable') || el.hasAttribute('data-virtualized')) {
                    isScrollable = true;
                }
                
                // 4. Проверяем элементы с определенными классами, которые обычно прокручиваются
                const scrollableClasses = ['scrollable', 'scroll', 'virtual-list', 'virtualized', 'params-list'];
                if (scrollableClasses.some(cls => el.classList.contains(cls))) {
                    isScrollable = true;
                }
                
                // 5. Проверяем элементы, которые имеют scrollHeight > clientHeight (даже без overflow)
                if (el.scrollHeight > el.clientHeight + 8 && el.scrollHeight > 0) {
                    // Дополнительная проверка: элемент должен быть видимым и иметь размеры
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        isScrollable = true;
                    }
                }
                
                if (isScrollable) {
                    console.log('Найден прокручиваемый элемент:', {
                        tagName: el.tagName,
                        className: el.className,
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight,
                        overflowY: overflowY,
                        overflowX: overflowX
                    });
                    result.push(el);
                }
            } catch (e) {
                console.warn('Ошибка при проверке элемента на прокручиваемость:', e);
            }
        }
        
        return result;
    }

    // --- Построить объект кейса по DOM-элементу кейса ---
    function buildCaseFromItem(item, idx = 0) {
        if (!item) return null;
        const checkbox = item.querySelector('input[type="checkbox"].form-check-input.checkbox-title');
        const paramsDiv = item.querySelector('.run-case__params');
        const paramsText = paramsDiv ? paramsDiv.textContent.trim().replace(/^Параметры:\s*/i, '') : '';
        const link = item.querySelector('a[href]');
        const name = link ? link.textContent.trim() : `Кейс #${idx+1}`;
        let title = '';
        const titleBlock = item.querySelector('.run-case__title-text .section-visible-tooltip-toggler');
        if (titleBlock && titleBlock.getAttribute('data-tooltip-text')) {
            title = titleBlock.getAttribute('data-tooltip-text').trim();
        } else if (titleBlock) {
            const innerDiv = titleBlock.querySelector('div');
            if (innerDiv) title = innerDiv.textContent.trim();
        }
        const paramsObj = {};
        paramsText.split(';').forEach(pair => {
            const [k, v] = pair.split(':').map(s => s && s.trim());
            if (k && v) paramsObj[k] = v;
        });
        return { item, paramsText, paramsObj, name, title, link: link ? link.href : '', checkbox };
    }

    // --- ID кейса (стабилен между разными состояниями params) ---
    function getCaseId(c) {
        return (c && (c.link || c.name)) || '';
    }

    // --- Прокрутка элемента целиком (вниз) с шагами ---
    async function scrollElementFully(el, stepPx = 200, waitMs = 120, maxSteps = 200) {
        if (!el) return;
        
        try { 
            el.scrollTop = 0; 
            await new Promise(r => setTimeout(r, waitMs));
        } catch (e) {
            console.warn('Не удалось установить scrollTop = 0:', e);
        }
        
        let steps = 0;
        let lastScrollTop = -1;
        let noChangeCount = 0;
        
        while (steps++ < maxSteps) {
            try {
                const top = el.scrollTop;
                const height = el.clientHeight || 0;
                const scrollHeight = el.scrollHeight || 0;
                
                // Проверяем, достигли ли мы конца
                const atBottom = top + height >= scrollHeight - 4;
                if (atBottom) {
                    console.log('Достигнут конец прокрутки элемента:', {
                        steps,
                        finalTop: top,
                        height,
                        scrollHeight
                    });
                    break;
                }
                
                // Проверяем, не застряли ли мы
                if (top === lastScrollTop) {
                    noChangeCount++;
                    if (noChangeCount > 3) {
                        console.log('Прокрутка застряла, пробуем принудительно:', {
                            steps,
                            currentTop: top,
                            noChangeCount
                        });
                        // Пробуем принудительно прокрутить дальше
                        el.scrollTop = top + Math.max(100, stepPx);
                        await new Promise(r => setTimeout(r, waitMs * 2));
                        if (el.scrollTop === top) {
                            console.log('Принудительная прокрутка не помогла, выходим');
                            break;
                        }
                        noChangeCount = 0;
                    }
                } else {
                    noChangeCount = 0;
                }
                
                lastScrollTop = top;
                
                // Прокручиваем на шаг
                const newTop = top + Math.max(60, stepPx);
                el.scrollTop = newTop;
                
                // Ждем загрузки контента
                await new Promise(r => setTimeout(r, waitMs));
                
                // Дополнительная проверка: если scrollHeight изменился, значит загрузился новый контент
                const newScrollHeight = el.scrollHeight || 0;
                if (newScrollHeight > scrollHeight) {
                    console.log('Обнаружен новый контент, ждем дольше:', {
                        oldScrollHeight: scrollHeight,
                        newScrollHeight: newScrollHeight
                    });
                    await new Promise(r => setTimeout(r, waitMs * 2));
                }
                
            } catch (e) {
                console.warn('Ошибка при прокрутке элемента:', e);
                break;
            }
        }
        
        console.log('Завершена прокрутка элемента:', {
            totalSteps: steps,
            finalScrollTop: el.scrollTop,
            finalScrollHeight: el.scrollHeight
        });
    }

    // --- Сбор всех состояний конкретного кейса путём прокрутки его внутренних скроллов ---
    async function harvestCaseByInnerScroll(caseItem, processedKeys, collected) {
        const caseId = getCaseId(buildCaseFromItem(caseItem) || {});
        console.log('Начинаем сбор параметров кейса через внутренние скроллы:', {
            caseName: caseItem.querySelector('a[href]')?.textContent?.trim() || 'Unknown',
            caseElement: caseItem,
            caseId: caseId
        });
        
        // Стартовый снимок
        try {
            const snap = buildCaseFromItem(caseItem);
            if (snap) {
                const key = computeCaseKey(snap);
                if (!processedKeys.has(key)) {
                    processedKeys.add(key);
                    collected.set(key, snap);
                    // Добавляем в глобальный кэш
                    updateCaseParamCache(caseId, snap.paramsObj);
                    console.log('Добавлен стартовый снимок кейса:', {
                        key,
                        params: snap.paramsObj,
                        paramsText: snap.paramsText
                    });
                }
            }
        } catch (e) {
            console.warn('Ошибка при создании стартового снимка:', e);
        }

        const innerScrolls = getInnerScrollablesWithinCase(caseItem);
        console.log('Найдено внутренних прокручиваемых элементов:', innerScrolls.length);
        
        // Если есть прокручиваемые элементы, работаем с ними
        if (innerScrolls.length > 0) {
            for (let i = 0; i < innerScrolls.length; i++) {
                const sc = innerScrolls[i];
                console.log(`Прокручиваем внутренний элемент ${i + 1}/${innerScrolls.length}:`, {
                    element: sc,
                    className: sc.className,
                    scrollHeight: sc.scrollHeight,
                    clientHeight: sc.clientHeight
                });
                
                // Прокручиваем элемент полностью
                await scrollElementFully(sc, 240, 120, 120);
                
                // Делаем несколько снимков во время прокрутки для лучшего покрытия
                const scrollSteps = [0.25, 0.5, 0.75, 1.0];
                for (const stepRatio of scrollSteps) {
                    try {
                        const targetScrollTop = Math.floor(sc.scrollHeight * stepRatio);
                        sc.scrollTop = targetScrollTop;
                        await new Promise(r => setTimeout(r, 150));
                        
                        const snap = buildCaseFromItem(caseItem);
                        if (snap) {
                            const key = computeCaseKey(snap);
                            if (!processedKeys.has(key)) {
                                processedKeys.add(key);
                                collected.set(key, snap);
                                // Добавляем в глобальный кэш
                                updateCaseParamCache(caseId, snap.paramsObj);
                                console.log('Добавлен промежуточный снимок кейса:', {
                                    stepRatio,
                                    key,
                                    params: snap.paramsObj,
                                    paramsText: snap.paramsText
                                });
                            }
                        }
                    } catch (e) {
                        console.warn('Ошибка при создании промежуточного снимка:', e);
                    }
                }
                
                // Финальный снимок после прокрутки
                try {
                    const snap2 = buildCaseFromItem(caseItem);
                    if (snap2) {
                        const key2 = computeCaseKey(snap2);
                        if (!processedKeys.has(key2)) {
                            processedKeys.add(key2);
                            collected.set(key2, snap2);
                            // Добавляем в глобальный кэш
                            updateCaseParamCache(caseId, snap2.paramsObj);
                            console.log('Добавлен финальный снимок кейса после прокрутки:', {
                                key: key2,
                                params: snap2.paramsObj,
                                paramsText: snap2.paramsText
                            });
                        }
                    }
                } catch (e) {
                    console.warn('Ошибка при создании финального снимка:', e);
                }
            }
        } else {
            // Если прокручиваемых элементов нет, пробуем раскрывающиеся списки
            console.log('Прокручиваемых элементов не найдено, пробуем раскрывающиеся списки');
            await handleExpandableCaseContent(caseItem, processedKeys, collected);
            
            // Если и это не помогло, пробуем TMS-специфичную обработку
            if (collected.size <= 1) {
                console.log('Раскрывающиеся списки не помогли, пробуем TMS-специфичную обработку');
                await handleTMSSpecificCaseStructure(caseItem, processedKeys, collected);
            }
        }
        
        console.log('Завершен сбор параметров кейса через внутренние скроллы. Всего уникальных комбинаций:', collected.size);
        console.log('В глобальном кэше для кейса', caseId, ':', globalCaseParamCache.get(caseId)?.size || 0, 'вариантов');
    }

    // --- Специальная обработка для кейсов с раскрывающимися списками параметров ---
    async function handleExpandableCaseContent(caseItem, processedKeys, collected) {
        console.log('Проверяем кейс на наличие раскрывающихся элементов:', {
            caseName: caseItem.querySelector('a[href]')?.textContent?.trim() || 'Unknown'
        });
        
        // Ищем элементы, которые могут раскрываться
        const expandableSelectors = [
            '.run-case__params[data-expanded]',
            '.run-case__params[aria-expanded]',
            '.run-case__params .expandable',
            '.run-case__params .collapsible',
            '.run-case__params .toggle-content',
            '.run-case__params[style*="max-height"]',
            '.run-case__params[style*="overflow: hidden"]'
        ];
        
        let foundExpandable = false;
        
        for (const selector of expandableSelectors) {
            const elements = caseItem.querySelectorAll(selector);
            if (elements.length > 0) {
                foundExpandable = true;
                console.log('Найдены потенциально раскрывающиеся элементы:', {
                    selector,
                    count: elements.length
                });
                
                for (const el of elements) {
                    // Пробуем различные способы раскрытия
                    await tryExpandElement(el, caseItem, processedKeys, collected);
                }
            }
        }
        
        // Если не нашли стандартные раскрывающиеся элементы, ищем по структуре
        if (!foundExpandable) {
            const paramsDiv = caseItem.querySelector('.run-case__params');
            if (paramsDiv) {
                // Проверяем, есть ли скрытый контент
                const allParams = paramsDiv.querySelectorAll('*');
                let hasHiddenContent = false;
                
                for (const param of allParams) {
                    try {
                        const style = getComputedStyle(param);
                        if (style.display === 'none' || style.visibility === 'hidden' || 
                            style.maxHeight === '0px' || style.height === '0px') {
                            hasHiddenContent = true;
                            break;
                        }
                    } catch (e) {}
                }
                
                if (hasHiddenContent) {
                    console.log('Обнаружен скрытый контент в параметрах, пробуем раскрыть');
                    await tryExpandElement(paramsDiv, caseItem, processedKeys, collected);
                }
            }
        }
        
        return foundExpandable;
    }
    
    // --- Попытка раскрыть элемент различными способами ---
    async function tryExpandElement(element, caseItem, processedKeys, collected) {
        console.log('Пробуем раскрыть элемент:', {
            element,
            className: element.className,
            attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`)
        });
        
        // Способ 1: клик по элементу
        try {
            element.click();
            await new Promise(r => setTimeout(r, 200));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после клика');
        } catch (e) {
            console.warn('Клик по элементу не удался:', e);
        }
        
        // Способ 2: поиск кнопок раскрытия
        const expandButtons = element.querySelectorAll('button, .btn, .expand, .toggle, [aria-expanded]');
        for (const btn of expandButtons) {
            try {
                btn.click();
                await new Promise(r => setTimeout(r, 200));
                await captureCaseSnapshot(caseItem, processedKeys, collected, 'после клика по кнопке');
            } catch (e) {
                console.warn('Клик по кнопке раскрытия не удался:', e);
            }
        }
        
        // Способ 3: программное изменение стилей
        try {
            const originalStyle = element.style.cssText;
            element.style.maxHeight = 'none';
            element.style.overflow = 'visible';
            element.style.height = 'auto';
            await new Promise(r => setTimeout(r, 200));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после изменения стилей');
            element.style.cssText = originalStyle; // восстанавливаем
        } catch (e) {
            console.warn('Изменение стилей не удалось:', e);
        }
        
        // Способ 4: поиск и активация событий
        try {
            element.dispatchEvent(new Event('click', { bubbles: true }));
            element.dispatchEvent(new Event('mouseenter', { bubbles: true }));
            element.dispatchEvent(new Event('focus', { bubbles: true }));
            await new Promise(r => setTimeout(r, 200));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после событий');
        } catch (e) {
            console.warn('Отправка событий не удалась:', e);
        }
    }
    
    // --- Захват снимка кейса ---
    async function captureCaseSnapshot(caseItem, processedKeys, collected, context = '') {
        try {
            const snap = buildCaseFromItem(caseItem);
            if (snap) {
                const key = computeCaseKey(snap);
                if (!processedKeys.has(key)) {
                    processedKeys.add(key);
                    collected.set(key, snap);
                    // Добавляем в глобальный кэш
                    const caseId = getCaseId(snap);
                    updateCaseParamCache(caseId, snap.paramsObj);
                    console.log(`Добавлен снимок кейса ${context}:`, {
                        key,
                        params: snap.paramsObj,
                        paramsText: snap.paramsText
                    });
                }
            }
        } catch (e) {
            console.warn(`Ошибка при создании снимка кейса ${context}:`, e);
        }
    }

    // --- Проверка матчинга кейса по всем его внутренним состояниям (прокручивая внутренние скроллы) ---
    async function anyMatchAcrossInnerScroll(caseItem, combinationsForCase) {
        console.log('Проверяем матчинг кейса по внутренним скроллам:', {
            caseName: caseItem.querySelector('a[href]')?.textContent?.trim() || 'Unknown',
            combinationsCount: combinationsForCase.length
        });
        
        // Проверяем текущее состояние
        try {
            const base = buildCaseFromItem(caseItem);
            if (base) {
                const isMatch = combinationsForCase.some(comb =>
                    Object.entries(comb).every(([k, v]) => !v || base.paramsObj[k] === v)
                );
                if (isMatch) {
                    console.log('Найден матч в текущем состоянии кейса:', {
                        params: base.paramsObj,
                        matchingCombination: combinationsForCase.find(comb =>
                            Object.entries(comb).every(([k, v]) => !v || base.paramsObj[k] === v)
                        )
                    });
                    return true;
                }
            }
        } catch (e) {
            console.warn('Ошибка при проверке текущего состояния кейса:', e);
        }

        const innerScrolls = getInnerScrollablesWithinCase(caseItem);
        console.log('Проверяем матчинг по внутренним скроллам:', innerScrolls.length);
        
        // Если есть прокручиваемые элементы, проверяем их
        if (innerScrolls.length > 0) {
            for (let i = 0; i < innerScrolls.length; i++) {
                const sc = innerScrolls[i];
                console.log(`Проверяем матчинг в скролле ${i + 1}/${innerScrolls.length}`);
                
                // Прокручиваем элемент полностью
                await scrollElementFully(sc, 240, 120, 120);
                
                // Проверяем матчинг в нескольких позициях прокрутки
                const checkPositions = [0.25, 0.5, 0.75, 1.0];
                for (const posRatio of checkPositions) {
                    try {
                        const targetScrollTop = Math.floor(sc.scrollHeight * posRatio);
                        sc.scrollTop = targetScrollTop;
                        await new Promise(r => setTimeout(r, 150));
                        
                        const snap = buildCaseFromItem(caseItem);
                        if (snap) {
                            const isMatch = combinationsForCase.some(comb =>
                                Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                            );
                            if (isMatch) {
                                console.log('Найден матч в промежуточной позиции прокрутки:', {
                                    position: posRatio,
                                    params: snap.paramsObj,
                                    matchingCombination: combinationsForCase.find(comb =>
                                        Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                                    )
                                });
                                return true;
                            }
                        }
                    } catch (e) {
                        console.warn('Ошибка при проверке матчинга в промежуточной позиции:', e);
                    }
                }
                
                // Финальная проверка после полной прокрутки
                try {
                    const snap = buildCaseFromItem(caseItem);
                    if (snap) {
                        const isMatch = combinationsForCase.some(comb =>
                            Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                        );
                        if (isMatch) {
                            console.log('Найден матч после полной прокрутки скролла:', {
                                params: snap.paramsObj,
                                matchingCombination: combinationsForCase.find(comb =>
                                    Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                                )
                            });
                            return true;
                        }
                    }
                } catch (e) {
                    console.warn('Ошибка при финальной проверке матчинга:', e);
                }
            }
        } else {
            // Если прокручиваемых элементов нет, пробуем раскрывающиеся списки
            console.log('Прокручиваемых элементов не найдено, пробуем раскрывающиеся списки для матчинга');
            const tempProcessedKeys = new Set();
            const tempCollected = new Map();
            await handleExpandableCaseContent(caseItem, tempProcessedKeys, tempCollected);
            
            // Проверяем все собранные состояния на матчинг
            for (const [key, snap] of tempCollected) {
                const isMatch = combinationsForCase.some(comb =>
                    Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                );
                if (isMatch) {
                    console.log('Найден матч в раскрывающемся контенте:', {
                        params: snap.paramsObj,
                        matchingCombination: combinationsForCase.find(comb =>
                            Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                        )
                    });
                    return true;
                }
            }
            
            // Если и это не помогло, пробуем TMS-специфичную обработку
            if (tempCollected.size <= 1) {
                console.log('Раскрывающиеся списки не помогли, пробуем TMS-специфичную обработку для матчинга');
                const tmsTempProcessedKeys = new Set();
                const tmsTempCollected = new Map();
                await handleTMSSpecificCaseStructure(caseItem, tmsTempProcessedKeys, tmsTempCollected);
                
                // Проверяем все собранные состояния на матчинг
                for (const [key, snap] of tmsTempCollected) {
                    const isMatch = combinationsForCase.some(comb =>
                        Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                    );
                    if (isMatch) {
                        console.log('Найден матч в TMS-специфичном контенте:', {
                            params: snap.paramsObj,
                            matchingCombination: combinationsForCase.find(comb =>
                                Object.entries(comb).every(([k, v]) => !v || snap.paramsObj[k] === v)
                            )
                        });
                        return true;
                    }
                }
            }
        }
        
        console.log('Матчинг не найден ни в одном состоянии кейса');
        return false;
    }

    // --- Ключ для уникальной идентификации кейса на странице ---
    function computeCaseKey(c) {
        const linkPart = c.link || c.name || '';
        return linkPart + '|' + (c.paramsText || '');
    }

    // --- Полный сбор кейсов с автопрокруткой (для получения всех вариантов параметров) ---
    async function collectAllCasesAcrossVirtualizedList() {
        const scrollContainer = getScrollableContainer();
        const originalTop = scrollContainer.scrollTop;
        const processedKeys = new Set();
        const collected = new Map();
        const processedCaseIds = new Set();

        // Стартуем с начала списка
        scrollContainer.scrollTop = 0;
        await new Promise(r => setTimeout(r, 200));

        let safetyCounter = 0;
        while (safetyCounter++ < 1000) {
            const visibleCases = getCases();
            for (const c of visibleCases) {
                const key = computeCaseKey(c);
                if (!processedKeys.has(key)) {
                    processedKeys.add(key);
                    collected.set(key, c);
                }
                const caseId = getCaseId(c);
                if (!processedCaseIds.has(caseId)) {
                    processedCaseIds.add(caseId);
                    await harvestCaseByInnerScroll(c.item, processedKeys, collected);
                }
            }

            const el = scrollContainer;
            const top = el.scrollTop;
            const height = el.clientHeight || window.innerHeight;
            const scrollHeight = el.scrollHeight || document.body.scrollHeight;
            const atBottom = top + height >= scrollHeight - 4;
            if (atBottom) {
                await new Promise(r => setTimeout(r, 200));
                const afterWaitCases = getCases();
                const newFound = afterWaitCases.some(c => !processedKeys.has(computeCaseKey(c)));
                if (!newFound) break;
            }

            const step = Math.max(100, Math.floor(height * 0.85));
            el.scrollTop = top + step;
            await new Promise(r => setTimeout(r, 200));
        }

        // Вернём скролл пользователя
        try { scrollContainer.scrollTop = originalTop; } catch (e) {}

        return Array.from(collected.values());
    }

    // --- Применение фильтра ко всем кейсам с автопрокруткой ---
    async function applyFilterAcrossVirtualizedList(caseCombinations) {
        const processedCaseIds = new Set();
        const scrollContainer = getScrollableContainer();

        function getViewportState() {
            const el = scrollContainer;
            const top = el.scrollTop;
            const height = el.clientHeight || window.innerHeight;
            const scrollHeight = el.scrollHeight || document.body.scrollHeight;
            return { el, top, height, scrollHeight };
        }

        let safetyCounter = 0;
        while (safetyCounter++ < 1000) {
            const visibleCases = getCases();
            for (const c of visibleCases) {
                const caseId = getCaseId(c);
                if (processedCaseIds.has(caseId)) continue;
                processedCaseIds.add(caseId);

                // Убеждаемся, что кейс полностью готов к взаимодействию
                if (c.item) {
                    await waitForElementReadiness(c.item, 2000);
                }

                const combs = caseCombinations[c.name] || [];
                if (!combs.length) {
                    c.item.style.background = '';
                    if (c.checkbox && c.checkbox.checked) await safeCheckboxClick(c.checkbox);
                    continue;
                }

                // Сначала пробуем проверить по кэшу (быстрее)
                let isMatchSomewhere = checkCaseMatchUsingCache(caseId, combs);
                
                // Если в кэше нет данных или матчинг не найден, пробуем динамическую проверку
                if (!isMatchSomewhere) {
                    console.log('Матчинг не найден в кэше, пробуем динамическую проверку для кейса:', caseId);
                    
                    // Если в кэше вообще нет данных для этого кейса, принудительно обновляем
                    if (!globalCaseParamCache.has(caseId)) {
                        console.log('В кэше нет данных для кейса, принудительно обновляем:', caseId);
                        await forceRefreshCaseParams(c.item);
                        // Проверяем снова по обновленному кэшу
                        isMatchSomewhere = checkCaseMatchUsingCache(caseId, combs);
                    }
                    
                    // Если все еще нет матчинга, пробуем динамическую проверку
                    if (!isMatchSomewhere) {
                        isMatchSomewhere = await anyMatchAcrossInnerScroll(c.item, combs);
                    }
                }

                // Применяем фильтр
                if (!isMatchSomewhere && c.checkbox && !c.checkbox.checked) {
                    console.log('Снимаем галочку с кейса (не подходит под фильтр):', caseId);
                    await safeCheckboxClick(c.checkbox);
                }
                if (isMatchSomewhere && c.checkbox && c.checkbox.checked) {
                    console.log('Ставим галочку на кейс (подходит под фильтр):', caseId);
                    await safeCheckboxClick(c.checkbox);
                }
                
                console.log('Результат фильтрации для кейса:', {
                    caseId,
                    caseName: c.name,
                    isMatch: isMatchSomewhere,
                    checkboxChecked: c.checkbox?.checked,
                    combinations: combs,
                    cachedVariations: globalCaseParamCache.get(caseId)?.size || 0
                });
                
                c.item.style.background = !isMatchSomewhere ? '#ffe0e0' : '';
            }

            const { el, top, height, scrollHeight } = getViewportState();
            const atBottom = top + height >= scrollHeight - 4;
            if (atBottom) {
                // Небольшая пауза, чтобы догрузились элементы (если есть)
                await new Promise(r => setTimeout(r, 200));
                // Если новых кейсов не появилось, выходим
                const afterWait = getCases();
                const unseen = afterWait.some(c => !processedCaseIds.has(getCaseId(c)));
                if (!unseen) break;
            }

            const step = Math.max(100, Math.floor(height * 0.85));
            el.scrollTop = top + step;
            await new Promise(r => setTimeout(r, 250));
            
            // Дополнительное ожидание для загрузки контента
            await new Promise(r => setTimeout(r, 100));
            
            // Проверяем, изменился ли scrollHeight (значит загрузился новый контент)
            const newScrollHeight = el.scrollHeight || 0;
            if (newScrollHeight > scrollHeight) {
                console.log('Обнаружен новый контент, ждем дольше:', {
                    oldScrollHeight: scrollHeight,
                    newScrollHeight: newScrollHeight
                });
                await new Promise(r => setTimeout(r, 300));
            }
        }

        // Вернуться в начало
        try { scrollContainer.scrollTop = 0; } catch (e) {}
        
        // Показываем финальную статистику
        console.log('=== ФИНАЛЬНАЯ СТАТИСТИКА ПРИМЕНЕНИЯ ФИЛЬТРА ===');
        showCacheStats();
        console.log('================================================');
    }

    // --- Уникальные параметры и значения для каждого кейса ---
    function getCaseParamValues(cases) {
        const caseParams = {};
        cases.forEach(c => {
            if (!caseParams[c.name]) caseParams[c.name] = {};
            Object.entries(c.paramsObj).forEach(([k, v]) => {
                if (!caseParams[c.name][k]) caseParams[c.name][k] = new Set();
                caseParams[c.name][k].add(v);
            });
        });
        // Преобразуем Set в массив
        Object.keys(caseParams).forEach(caseName => {
            Object.keys(caseParams[caseName]).forEach(k => {
                caseParams[caseName][k] = Array.from(caseParams[caseName][k]);
            });
        });
        return caseParams;
    }

    // --- UI: Overlay с индивидуальным выбором сочетаний для каждого кейса ---
    function showOverlay(cases, caseParamValues, caseCombinations, onSave, caseTitles) {
        // Стили
        const style = document.createElement('style');
        style.textContent = `
        #tms-case-filter-modal {
            background: #fff; padding: 24px; border-radius: 8px; min-width: 60vw; max-width: 60vw; max-height: 80vh; overflow: hidden;
            box-shadow: 0 2px 16px rgba(0,0,0,0.2); margin: 40px auto 0 auto; position: relative;
            display: flex; flex-direction: column; align-items: stretch;
        }
        #tms-case-filter-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); z-index: 99999; display: flex; align-items: flex-start; justify-content: center;
        }
        #tms-case-filter-close {
            position: absolute; top: 8px; right: 12px; font-size: 32px; color: #888; cursor: pointer; font-weight: bold; background: none; border: none;
            line-height: 1;
        }
        #tms-case-filter-close:hover { color: #d33; }
        #tms-case-filter-cases-scroll {
            flex: 1 1 auto;
            overflow-y: auto;
            max-height: 60vh;
            margin-bottom: 16px;
        }
        .case-block { border: 1px solid #eee; border-radius: 6px; margin-bottom: 16px; padding: 10px; }
        .case-title { font-weight: bold; margin-bottom: 6px; }
        .comb-block { border: 1px solid #f0f0f0; border-radius: 6px; margin-bottom: 8px; padding: 8px; position: relative; }
        .comb-params-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            position: relative;
        }
        .comb-param-select {
            flex: 0 1 auto;
            min-width: 180px;
            margin-bottom: 4px;
        }
        .select-default {
            background: #ffeaea !important;
            color: #b22222 !important;
        }
        .comb-remove-btn {
            font-size: 20px !important;
            font-weight: bold;
            padding: 0 6px;
            line-height: 1;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            margin-left: auto;
            align-self: center;
            position: relative;
            z-index: 1;
        }
        .comb-remove-btn:hover { color: #d33; }
        .add-comb-btn { margin-bottom: 8px; }
        #tms-case-filter-apply { margin-top: 12px; }
        #tms-case-filter-search {
            width: 60%;
            font-size: 16px;
            padding: 6px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 16px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        `;
        document.head.appendChild(style);

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'tms-case-filter-overlay';

        // Модалка
        const modal = document.createElement('div');
        modal.id = 'tms-case-filter-modal';

        // Крестик для закрытия
        const closeBtn = document.createElement('button');
        closeBtn.id = 'tms-case-filter-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            overlay.remove();
            style.remove();
            onSave(caseCombinations); // Сохраняем при закрытии
        };
        modal.appendChild(closeBtn);

        // Закрытие по клику вне модалки
        overlay.addEventListener('mousedown', function(e) {
            if (!modal.contains(e.target)) {
                overlay.remove();
                style.remove();
                onSave(caseCombinations);
            }
        });

        // Поиск
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'tms-case-filter-search';
        searchInput.placeholder = 'Поиск по коду или названию кейса...';
        modal.appendChild(searchInput);

        // Контейнер для всех кейсов с прокруткой
        const allCasesDivScroll = document.createElement('div');
        allCasesDivScroll.id = 'tms-case-filter-cases-scroll';
        modal.appendChild(allCasesDivScroll);

        // Список уникальных кейсов
        const uniqueCases = Object.keys(caseParamValues);

        // Функция создания пустого сочетания
        function createEmptyCombination(caseName) {
            const comb = {};
            Object.keys(caseParamValues[caseName]).forEach(param => {
                comb[param] = '';
            });
            return comb;
        }

        // Рендер блоков для каждого кейса
        function renderAllCases() {
            allCasesDivScroll.innerHTML = '';
            const filter = searchInput.value.trim().toLowerCase();
            uniqueCases.forEach(caseName => {
                const title = caseTitles && caseTitles[caseName] ? caseTitles[caseName] : '';
                if (
                    !filter ||
                    caseName.toLowerCase().includes(filter) ||
                    title.toLowerCase().includes(filter)
                ) {
                    const block = document.createElement('div');
                    block.className = 'case-block';
                    block.innerHTML = `<div class="case-title">${caseName}${(title && title !== caseName) ? ' — ' + title : ''}</div>`;
                    const combsContainer = document.createElement('div');
                    // Рендер сочетаний
                    (caseCombinations[caseName] || []).forEach((comb, idx) => {
                        const combBlock = document.createElement('div');
                        combBlock.className = 'comb-block';
                        const paramRow = document.createElement('div');
                        paramRow.className = 'comb-params-row';
                        Object.keys(caseParamValues[caseName]).forEach(param => {
                            const sel = document.createElement('select');
                            sel.className = 'comb-param-select';
                            sel.innerHTML = `<option value="">${param}</option>` +
                                caseParamValues[caseName][param].map(v => `<option value="${v}">${v}</option>`).join('');
                            sel.value = comb[param] || '';
                            // Подсветка дефолта
                            function updateSelectStyle() {
                                if (sel.value === '') sel.classList.add('select-default');
                                else sel.classList.remove('select-default');
                            }
                            sel.onchange = () => {
                                comb[param] = sel.value;
                                updateSelectStyle();
                            };
                            updateSelectStyle();
                            paramRow.appendChild(sel);
                        });
                        // Крестик всегда справа
                        const removeBtn = document.createElement('button');
                        removeBtn.className = 'comb-remove-btn';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.title = 'Удалить сочетание';
                        removeBtn.onclick = () => {
                            caseCombinations[caseName].splice(idx, 1);
                            renderAllCases();
                        };
                        paramRow.appendChild(removeBtn);

                        combBlock.appendChild(paramRow);
                        combsContainer.appendChild(combBlock);
                    });
                    if (Object.keys(caseParamValues[caseName]).length === 0) {
                        // Нет параметров — показываем некликабельную кнопку
                        const noParamsBtn = document.createElement('button');
                        noParamsBtn.className = 'add-comb-btn';
                        noParamsBtn.textContent = 'Нет параметров';
                        noParamsBtn.disabled = true;
                        noParamsBtn.style.opacity = '0.6';
                        block.appendChild(combsContainer);
                        block.appendChild(noParamsBtn);
                    } else {
                        // Обычная кнопка "Добавить сочетание"
                        const addCombBtn = document.createElement('button');
                        addCombBtn.className = 'add-comb-btn';
                        addCombBtn.textContent = 'Добавить сочетание';
                        addCombBtn.onclick = function() {
                            caseCombinations[caseName].push(createEmptyCombination(caseName));
                            renderAllCases();
                        };
                        block.appendChild(combsContainer);
                        block.appendChild(addCombBtn);
                    }
                    allCasesDivScroll.appendChild(block);
                }
            });
        }

        renderAllCases();
        searchInput.addEventListener('input', renderAllCases);

        // Кнопка применить
        const applyBtn = document.createElement('button');
        applyBtn.id = 'tms-case-filter-apply';
        applyBtn.textContent = 'Применить';
        applyBtn.onclick = async function() {
            overlay.remove();
            style.remove();
            onSave(caseCombinations); // Сохраняем при применении
            await applyFilterAcrossVirtualizedList(caseCombinations);
        };
        modal.appendChild(applyBtn);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // --- Подготовка и показ фильтра по требованию ---
    async function openFilter() {
        // Очищаем кэш параметров для свежего сбора
        clearCaseParamCache();
        
        // Собираем ВСЕ кейсы, чтобы в селектах были все варианты параметров
        const allCases = await collectAllCasesAcrossVirtualizedList();
        const caseParamValues = getCaseParamValues(allCases);
        const runKey = 'tms-case-filter-combs-' + location.pathname;
        let saved = localStorage.getItem(runKey);
        let caseCombinations = {};
        if (saved) {
            try { caseCombinations = JSON.parse(saved); } catch (e) {}
        }
        Object.keys(caseParamValues).forEach(name => {
            if (!caseCombinations[name]) caseCombinations[name] = [];
        });
        const caseTitles = {};
        allCases.forEach(c => { caseTitles[c.name] = c.title; });
        
        console.log('Собрано кейсов:', allCases.length);
        console.log('Размер глобального кэша параметров:', globalCaseParamCache.size);
        showCacheStats();
        
        showOverlay(allCases, caseParamValues, caseCombinations, (newCombs) => {
            caseCombinations = newCombs;
            localStorage.setItem(runKey, JSON.stringify(caseCombinations));
        }, caseTitles);
    }

    // --- Гарантированная вставка кнопки и самовосстановление ---
    function ensureFilterButton() {
        if (document.getElementById('tms-case-filter-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'tms-case-filter-btn';
        btn.textContent = 'Фильтр кейсов';
        const dragState = makeDraggable(btn, 'tms-case-filter-btn-pos-' + location.pathname);
        btn.addEventListener('click', function() {
            if (!dragState.wasMoved()) openFilter();
            dragState.resetMoved();
        });
        document.body.appendChild(btn);
    }

    // --- Инициализация без ожидания кейсов + keep-alive ---
    ensureFilterButton();
    if (!window.__tmsCaseFilterBtnInterval) {
        window.__tmsCaseFilterBtnInterval = setInterval(() => {
            try { ensureFilterButton(); } catch (e) {}
        }, 1000);
    }

    // --- Отслеживание смены маршрута (SPA) и пересоздание кнопки под новый run ---
    (function setupRouteChangeWatchers() {
        let lastPath = location.pathname;
        function onRouteChanged() {
            if (lastPath === location.pathname) return;
            lastPath = location.pathname;
            
            // Очищаем кэш параметров при смене страницы
            clearCaseParamCache();
            
            // Пересоздаём кнопку, чтобы использовать корректный storageKey для позиции
            try {
                const old = document.getElementById('tms-case-filter-btn');
                if (old) old.remove();
            } catch (e) {}
            // Немного отложим, чтобы DOM успел стабилизироваться после навигации
            setTimeout(() => { try { ensureFilterButton(); } catch (e) {} }, 0);
        }

        try {
            const origPush = history.pushState;
            history.pushState = function() {
                const r = origPush.apply(this, arguments);
                window.dispatchEvent(new Event('tms-routechange'));
                return r;
            };
        } catch (e) {}
        try {
            const origReplace = history.replaceState;
            history.replaceState = function() {
                const r = origReplace.apply(this, arguments);
                window.dispatchEvent(new Event('tms-routechange'));
                return r;
            };
        } catch (e) {}

        window.addEventListener('popstate', () => window.dispatchEvent(new Event('tms-routechange')));
        window.addEventListener('hashchange', () => window.dispatchEvent(new Event('tms-routechange')));
        window.addEventListener('tms-routechange', onRouteChanged);
    })();

    // --- Проверка и ожидание готовности чекбокса к клику ---
    async function ensureCheckboxReady(checkbox, maxWaitMs = 2000) {
        if (!checkbox) return false;
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitMs) {
            try {
                // Проверяем, что чекбокс видим и доступен
                if (checkbox.offsetParent !== null && 
                    !checkbox.disabled && 
                    checkbox.style.display !== 'none' &&
                    checkbox.style.visibility !== 'hidden') {
                    
                    // Проверяем, что чекбокс находится в DOM
                    if (document.contains(checkbox)) {
                        // Пробуем получить computed styles
                        const style = getComputedStyle(checkbox);
                        if (style && style.pointerEvents !== 'none') {
                            console.log('Чекбокс готов к клику:', {
                                checked: checkbox.checked,
                                disabled: checkbox.disabled,
                                visible: checkbox.offsetParent !== null
                            });
                            return true;
                        }
                    }
                }
                
                // Ждем немного и проверяем снова
                await new Promise(r => setTimeout(r, 100));
                
            } catch (e) {
                console.warn('Ошибка при проверке готовности чекбокса:', e);
                await new Promise(r => setTimeout(r, 100));
            }
        }
        
        console.warn('Чекбокс не готов к клику после ожидания:', {
            maxWaitMs,
            checkbox: checkbox
        });
        return false;
    }

    // --- Безопасный клик по чекбоксу ---
    async function safeCheckboxClick(checkbox) {
        if (!checkbox) return false;
        
        try {
            // Убеждаемся, что чекбокс готов
            if (!(await ensureCheckboxReady(checkbox))) {
                return false;
            }
            
            // Сохраняем текущее состояние
            const wasChecked = checkbox.checked;
            
            // Пробуем кликнуть
            checkbox.click();
            
            // Ждем изменения состояния
            await new Promise(r => setTimeout(r, 100));
            
            // Проверяем, что состояние изменилось
            if (checkbox.checked !== wasChecked) {
                console.log('Чекбокс успешно изменен:', {
                    wasChecked,
                    nowChecked: checkbox.checked
                });
                return true;
            } else {
                // Если состояние не изменилось, пробуем альтернативные способы
                console.log('Обычный клик не сработал, пробуем альтернативные способы');
                
                // Способ 1: программное изменение
                checkbox.checked = !wasChecked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Способ 2: если есть label, кликаем по нему
                const label = checkbox.closest('label') || document.querySelector(`label[for="${checkbox.id}"]`);
                if (label) {
                    label.click();
                }
                
                await new Promise(r => setTimeout(r, 100));
                
                if (checkbox.checked !== wasChecked) {
                    console.log('Чекбокс изменен альтернативным способом');
                    return true;
                }
            }
            
            return false;
            
        } catch (e) {
            console.error('Ошибка при клике по чекбоксу:', e);
            return false;
        }
    }

    // --- Специальная обработка для конкретной структуры TMS кейсов ---
    async function handleTMSSpecificCaseStructure(caseItem, processedKeys, collected) {
        console.log('Проверяем TMS-специфичную структуру кейса:', {
            caseName: caseItem.querySelector('a[href]')?.textContent?.trim() || 'Unknown'
        });
        
        // Ищем специфичные элементы TMS
        const tmsSpecificSelectors = [
            '.run-case__params .section-visible-tooltip-toggler',
            '.run-case__params .tooltip-content',
            '.run-case__params .expanded-content',
            '.run-case__params .collapsed-content',
            '.run-case__params[data-state]',
            '.run-case__params[data-expanded]'
        ];
        
        let foundTMSStructure = false;
        
        for (const selector of tmsSpecificSelectors) {
            const elements = caseItem.querySelectorAll(selector);
            if (elements.length > 0) {
                foundTMSStructure = true;
                console.log('Найдены TMS-специфичные элементы:', {
                    selector,
                    count: elements.length
                });
                
                for (const el of elements) {
                    await tryExpandTMSElement(el, caseItem, processedKeys, collected);
                }
            }
        }
        
        // Если не нашли специфичные элементы, пробуем общие подходы
        if (!foundTMSStructure) {
            console.log('TMS-специфичные элементы не найдены, пробуем общие подходы');
            
            // Пробуем найти все скрытые параметры
            const allParams = caseItem.querySelectorAll('.run-case__params *');
            for (const param of allParams) {
                try {
                    const style = getComputedStyle(param);
                    const isHidden = style.display === 'none' || 
                                   style.visibility === 'hidden' || 
                                   style.opacity === '0' ||
                                   style.maxHeight === '0px' ||
                                   style.height === '0px' ||
                                   style.width === '0px';
                    
                    if (isHidden) {
                        console.log('Найден скрытый параметр, пробуем показать:', param);
                        await tryShowHiddenElement(param, caseItem, processedKeys, collected);
                    }
                } catch (e) {
                    console.warn('Ошибка при проверке параметра:', e);
                }
            }
        }
        
        return foundTMSStructure;
    }
    
    // --- Попытка раскрыть TMS-специфичный элемент ---
    async function tryExpandTMSElement(element, caseItem, processedKeys, collected) {
        console.log('Пробуем раскрыть TMS-элемент:', {
            element,
            className: element.className,
            tagName: element.tagName
        });
        
        // Способ 1: клик по элементу
        try {
            element.click();
            await new Promise(r => setTimeout(r, 300));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после клика по TMS-элементу');
        } catch (e) {
            console.warn('Клик по TMS-элементу не удался:', e);
        }
        
        // Способ 2: поиск и активация событий
        try {
            element.dispatchEvent(new Event('click', { bubbles: true }));
            element.dispatchEvent(new Event('mouseenter', { bubbles: true }));
            element.dispatchEvent(new Event('focus', { bubbles: true }));
            element.dispatchEvent(new Event('mousedown', { bubbles: true }));
            element.dispatchEvent(new Event('mouseup', { bubbles: true }));
            await new Promise(r => setTimeout(r, 300));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после событий TMS-элемента');
        } catch (e) {
            console.warn('Отправка событий TMS-элемента не удалась:', e);
        }
        
        // Способ 3: изменение атрибутов
        try {
            if (element.hasAttribute('data-expanded')) {
                element.setAttribute('data-expanded', 'true');
            }
            if (element.hasAttribute('aria-expanded')) {
                element.setAttribute('aria-expanded', 'true');
            }
            if (element.hasAttribute('data-state')) {
                element.setAttribute('data-state', 'expanded');
            }
            await new Promise(r => setTimeout(r, 200));
            await captureCaseSnapshot(caseItem, processedKeys, collected, 'после изменения атрибутов TMS-элемента');
        } catch (e) {
            console.warn('Изменение атрибутов TMS-элемента не удалось:', e);
        }
    }
    
    // --- Попытка показать скрытый элемент ---
    async function tryShowHiddenElement(element, caseItem, processedKeys, collected) {
        console.log('Пробуем показать скрытый элемент:', {
            element,
            className: element.className,
            tagName: element.tagName
        });
        
        try {
            const originalStyle = element.style.cssText;
            
            // Пробуем различные комбинации стилей для показа
            const styleCombinations = [
                { display: 'block', visibility: 'visible', opacity: '1', maxHeight: 'none', height: 'auto' },
                { display: 'inline', visibility: 'visible', opacity: '1' },
                { display: 'flex', visibility: 'visible', opacity: '1' },
                { display: 'grid', visibility: 'visible', opacity: '1' }
            ];
            
            for (const styleCombo of styleCombinations) {
                try {
                    Object.assign(element.style, styleCombo);
                    await new Promise(r => setTimeout(r, 200));
                    await captureCaseSnapshot(caseItem, processedKeys, collected, `после применения стилей ${JSON.stringify(styleCombo)}`);
                } catch (e) {
                    console.warn('Применение стилей не удалось:', e);
                }
            }
            
            // Восстанавливаем оригинальные стили
            element.style.cssText = originalStyle;
            
        } catch (e) {
            console.warn('Изменение стилей скрытого элемента не удалось:', e);
        }
    }

    // --- Ожидание полной готовности элемента после прокрутки ---
    async function waitForElementReadiness(element, maxWaitMs = 3000) {
        if (!element) return false;
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitMs) {
            try {
                // Проверяем, что элемент полностью готов
                if (element.offsetParent !== null && 
                    !element.disabled && 
                    element.style.display !== 'none' &&
                    element.style.visibility !== 'hidden' &&
                    element.style.opacity !== '0') {
                    
                    // Проверяем, что элемент находится в DOM и имеет размеры
                    if (document.contains(element)) {
                        const rect = element.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            // Проверяем computed styles
                            const style = getComputedStyle(element);
                            if (style && style.pointerEvents !== 'none') {
                                console.log('Элемент полностью готов:', {
                                    element,
                                    rect: rect,
                                    pointerEvents: style.pointerEvents
                                });
                                return true;
                            }
                        }
                    }
                }
                
                // Ждем немного и проверяем снова
                await new Promise(r => setTimeout(r, 100));
                
            } catch (e) {
                console.warn('Ошибка при проверке готовности элемента:', e);
                await new Promise(r => setTimeout(r, 100));
            }
        }
        
        console.warn('Элемент не готов после ожидания:', {
            maxWaitMs,
            element: element
        });
        return false;
    }

    // --- Глобальный кэш всех вариантов параметров для каждого кейса ---
    let globalCaseParamCache = new Map(); // caseId -> Set of parameter combinations
    
    // --- Обновление кэша параметров для конкретного кейса ---
    function updateCaseParamCache(caseId, paramsObj) {
        if (!globalCaseParamCache.has(caseId)) {
            globalCaseParamCache.set(caseId, new Set());
        }
        const cache = globalCaseParamCache.get(caseId);
        const paramKey = JSON.stringify(paramsObj);
        cache.add(paramKey);
    }
    
    // --- Получение всех вариантов параметров для кейса из кэша ---
    function getCaseParamVariations(caseId) {
        const cache = globalCaseParamCache.get(caseId);
        if (!cache) return [];
        
        return Array.from(cache).map(paramKey => {
            try {
                return JSON.parse(paramKey);
            } catch (e) {
                console.warn('Ошибка при парсинге параметров из кэша:', e);
                return {};
            }
        });
    }
    
    // --- Очистка кэша при смене страницы ---
    function clearCaseParamCache() {
        globalCaseParamCache.clear();
        console.log('Кэш параметров кейсов очищен');
    }

    // --- Принудительное обновление кэша параметров для конкретного кейса ---
    async function forceRefreshCaseParams(caseItem) {
        const caseId = getCaseId(buildCaseFromItem(caseItem) || {});
        if (!caseId) return;
        
        console.log('Принудительно обновляем кэш параметров для кейса:', caseId);
        
        // Очищаем существующий кэш для этого кейса
        globalCaseParamCache.delete(caseId);
        
        // Собираем параметры заново
        const tempProcessedKeys = new Set();
        const tempCollected = new Map();
        await harvestCaseByInnerScroll(caseItem, tempProcessedKeys, tempCollected);
        
        console.log('Кэш обновлен для кейса', caseId, ':', globalCaseParamCache.get(caseId)?.size || 0, 'вариантов');
    }

    // --- Проверка матчинга кейса по всем его вариантам параметров из кэша ---
    function checkCaseMatchUsingCache(caseId, combinationsForCase) {
        if (!caseId || !combinationsForCase || combinationsForCase.length === 0) {
            return false;
        }
        
        const paramVariations = getCaseParamVariations(caseId);
        console.log('Проверяем матчинг кейса по кэшу:', {
            caseId,
            combinationsCount: combinationsForCase.length,
            cachedVariationsCount: paramVariations.length
        });
        
        if (paramVariations.length === 0) {
            console.log('В кэше нет вариантов параметров для кейса:', caseId);
            return false;
        }
        
        // Проверяем каждую комбинацию фильтра против всех вариантов параметров из кэша
        for (const comb of combinationsForCase) {
            for (const params of paramVariations) {
                const isMatch = Object.entries(comb).every(([k, v]) => !v || params[k] === v);
                if (isMatch) {
                    console.log('Найден матч в кэше:', {
                        caseId,
                        matchingCombination: comb,
                        matchingParams: params
                    });
                    return true;
                }
            }
        }
        
        console.log('Матчинг не найден в кэше для кейса:', caseId);
        return false;
    }

    // --- Отображение статистики кэша параметров ---
    function showCacheStats() {
        console.log('=== СТАТИСТИКА КЭША ПАРАМЕТРОВ ===');
        console.log('Общее количество кейсов в кэше:', globalCaseParamCache.size);
        
        let totalVariations = 0;
        for (const [caseId, variations] of globalCaseParamCache) {
            totalVariations += variations.size;
            console.log(`Кейс ${caseId}: ${variations.size} вариантов параметров`);
        }
        
        console.log('Общее количество вариантов параметров:', totalVariations);
        console.log('=====================================');
    }
})();



