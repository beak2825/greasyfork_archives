// ==UserScript==
// @name         Point Settings Popup
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Point Settings Popup for Context Moodes
// @author       You
// @match        *://tngadmin.triplenext.net/Admin/ContextModes/Edit/*
// @match        *://tngadmin.triplenext.net/Admin/MultiContextModes/Edit/*
// @match        *://yruleradmin.triplenext.net/Admin/ContextModes/Edit/*
// @match        *://yruleradmin.triplenext.net/Admin/MultiContextModes/Edit/*
// @match        *://yrulermgr.triplenext.net/Admin/ContextModes/Edit/*
// @match        *://yrulermgr.triplenext.net/Admin/MultiContextModes/Edit/*
// @match        *://tngadmin-dev.triplenext.net/Admin/ContextModes/Edit/*
// @match        *://tngadmin-dev.triplenext.net/Admin/MultiContextModes/Edit/*
// @match        *://tngtest.westus.cloudapp.azure.com/Admin/ContextModes/Edit/*
// @match        *://tngtest.westus.cloudapp.azure.com/Admin/MultiContextModes/Edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530264/Point%20Settings%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/530264/Point%20Settings%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let activeElement = null;
    const popup = document.createElement('div');

    // **Стили popup**
    popup.style.position = 'absolute';
    popup.style.padding = '10px';
    popup.style.background = 'white';
    popup.style.border = '1px solid black';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.display = 'none';
    popup.style.width = '224px';
    popup.style.zIndex = '1000';
    popup.style.opacity = '0.3';
    popup.style.transition = 'opacity 0.2s ease-in-out';

    // **Эффект прозрачности при наведении**
    popup.addEventListener('mouseenter', () => {
        popup.style.opacity = '1';
    });
    popup.addEventListener('mouseleave', () => {
        popup.style.opacity = '0.3';
    });

    document.body.appendChild(popup);

    // **Группы инпутов**
    const pointInputs = [
        '#input_rotate_wrapper',
        '#input_scale_wrapper',
        '#input_position_index_wrapper',
        '#input_default_position_wrapper',
        '#input_sticky_point_type_wrapper'
    ];
    const lineInputs = ['#input_restriction_rotate_wrapper'];

    // **Кнопка удаления точки**
    let deleteButton = document.querySelector('#btnDeleteActiveStickyPoints');
    let deleteButtonParent = deleteButton ? deleteButton.parentNode : null;
    let deleteButtonNextSibling = deleteButton ? deleteButton.nextSibling : null;

    // **Фильтр нужных точек**
    function isTargetPoint(element) {
        if (
            element.tagName.toLowerCase() !== 'circle' ||
            element.getAttribute('r') !== '5' ||
            !element.getAttribute('fill') ||
            !element.getAttribute('stroke')
        ) {
            return false;
        }

        // Проверяем, привязана ли точка к линии
        const parent = element.closest('svg');
        if (parent) {
            const relatedPaths = Array.from(parent.querySelectorAll('path[d]')).filter(path =>
                                                                                       path.getAttribute('d').includes(`${element.getAttribute('cx')},${element.getAttribute('cy')}`)
                                                                                      );
            if (relatedPaths.length > 0) {
                console.log(`❌ Точка ${element.getAttribute('cx')},${element.getAttribute('cy')} - это манипулятор линии, пропускаем`);
                return false;
            }
        }

        console.log(`✅ Найдена точка: cx=${element.getAttribute('cx')}, cy=${element.getAttribute('cy')}`);
        return true;
    }

    // Фильтр нужных линий (только черные!)
    function isTargetLine(element) {
        if (element.tagName.toLowerCase() !== 'path') {
            console.log(`❌ Линия пропущена: это не path`);
            return false;
        }

        const stroke = element.getAttribute('stroke');

        // 💥 Исключаем сразу цветные
        if (stroke !== '#000000') {
            console.log(`❌ Линия пропущена: цветная (stroke=${stroke})`);
            return false;
        }

        const parent = element.parentNode;
        if (!parent) return false;

        // Получаем все path внутри родителя
        const siblingPaths = Array.from(parent.children).filter(el => el.tagName.toLowerCase() === 'path');

        console.log(`🔍 Проверяем черную линию: ${element.getAttribute('d')} (stroke=${stroke})`);

        let hasRedOrBlue = false;
        let hasOtherBlack = false;

        // Получаем индекс текущей линии в массиве
        const index = siblingPaths.indexOf(element);

        // Проверяем **только соседние** (предыдущую и следующую)
        const checkNeighbors = (neighbor) => {
            if (!neighbor) return;
            const neighborStroke = neighbor.getAttribute('stroke');
            console.log(`➡ Соседняя линия: d=${neighbor.getAttribute('d')} stroke=${neighborStroke}`);

            if (neighborStroke === '#fc1303' || neighborStroke === '#032cfc') {
                hasRedOrBlue = true;
            }
            if (neighborStroke === '#000000' && neighbor !== element) {
                hasOtherBlack = true;
            }
        };

        // Проверяем только **ближайших** соседей (а не все)
        checkNeighbors(siblingPaths[index - 1]); // Предыдущая линия
        checkNeighbors(siblingPaths[index + 1]); // Следующая линия

        // ❌ Если есть **только цветные**, без других черных → запрещаем
        if (hasRedOrBlue && !hasOtherBlack) {
            console.log(`❌ Линия ${element.getAttribute('d')} пропущена: рядом только красные/синие`);
            return false;
        }

        console.log(`✅ Черная линия ${element.getAttribute('d')} - оставляем!`);
        return true;
    }

    // **Функция обновления позиции popup**
    function updatePopupPosition(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        popup.style.left = `${window.scrollX + rect.right + 20}px`;
        popup.style.top = `${window.scrollY + rect.top - 50}px`;
        popup.style.display = 'block';
    }

    // **Функция очистки ненужных кнопок**
    function cleanUpInputs() {
        document.querySelectorAll('a[title="+90"], a[title="+180"]').forEach(button => button.remove());
    }

    // **Фикс стилей**
    function fixInputStyles() {
        const stickyPointTypeWrapper = document.querySelector('#input_sticky_point_type_wrapper');
        if (stickyPointTypeWrapper) stickyPointTypeWrapper.style.marginLeft = '0px';

        const defaultPositionWrapper = document.querySelector('#input_default_position_wrapper');
        if (defaultPositionWrapper) defaultPositionWrapper.style.marginBottom = '15px';

        const inputPositionIndexWrapper = document.querySelector('#input_position_index_wrapper');
        if (inputPositionIndexWrapper) inputPositionIndexWrapper.style.marginBottom = '5px';
    }

    // **Функция возврата инпутов в DOM**
    function restoreInputs() {
        [...pointInputs, ...lineInputs].forEach(selector => {
            const inputBlock = document.querySelector(selector);
            if (inputBlock && !document.body.contains(inputBlock)) {
                document.body.appendChild(inputBlock);
            }
        });

        if (deleteButton && deleteButtonParent) {
            if (deleteButtonNextSibling) {
                deleteButtonParent.insertBefore(deleteButton, deleteButtonNextSibling);
            } else {
                deleteButtonParent.appendChild(deleteButton);
            }
        }
    }

    // **Функция скрытия popup**
    function hidePopup() {
        console.log(`🔻 Popup скрыт`);
        popup.style.display = 'none';
        restoreInputs();
    }

    // **Функция перемещения инпутов в popup**
    function moveInputsToPopup(isPoint) {
        restoreInputs();

        const inputs = isPoint ? pointInputs : lineInputs;
        inputs.forEach(selector => {
            const inputBlock = document.querySelector(selector);
            if (inputBlock) {
                popup.appendChild(inputBlock);
            }
        });

        if (isPoint && deleteButton) {
            popup.appendChild(deleteButton);
            deleteButton.onclick = () => setTimeout(hidePopup, 100);
        }

        cleanUpInputs();
        fixInputStyles();
    }


    // 1️⃣ Удаление активной точки по клавише Delete
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Delete' && activeElement && activeElement.tagName.toLowerCase() === 'circle') {
            console.log(`🗑 Удаляем активную точку: ${activeElement.getAttribute('cx')}, ${activeElement.getAttribute('cy')}`);
            const deleteButton = document.querySelector('#btnDeleteActiveStickyPoints');
            if (deleteButton) {
                deleteButton.click(); // Эмулируем нажатие кнопки удаления
            }
        }
    });

    // 2️⃣ Добавление новой точки по Ctrl + Правая кнопка мыши
    document.addEventListener('contextmenu', function (event) {
        if (event.ctrlKey) {
            event.preventDefault(); // Отключаем стандартное контекстное меню
            console.log(`➕ Добавляем новую точку (Ctrl + Правая кнопка мыши) в координаты ${event.clientX}, ${event.clientY}`);

            const addPointButton = document.querySelector('#btnAddOneMoreStickyPoint');

            if (addPointButton) {
                addPointButton.click(); // Эмулируем клик по кнопке добавления точки

                // Ждём, пока точка добавится
                setTimeout(() => {
                    const svg = document.querySelector('svg'); // Ищем SVG
                    if (!svg) {
                        console.warn(`⚠ SVG не найден!`);
                        return;
                    }

                    // Ищем последнюю добавленную точку (она в конце списка)
                    const lastPoint = svg.querySelector('circle:last-of-type');
                    if (!lastPoint) {
                        console.warn(`⚠ Последняя добавленная точка не найдена!`);
                        return;
                    }

                    // Переводим координаты мыши из окна в координаты SVG
                    const svgRect = svg.getBoundingClientRect();
                    const svgX = event.clientX - svgRect.left;
                    const svgY = event.clientY - svgRect.top;

                    // Устанавливаем новые координаты точки
                    lastPoint.setAttribute('cx', svgX);
                    lastPoint.setAttribute('cy', svgY);

                    console.log(`✅ Точка перемещена в ${svgX}, ${svgY}`);
                }, 100); // Небольшая задержка, чтобы точка успела добавиться
            } else {
                console.warn(`⚠ Кнопка #btnAddOneMoreStickyPoint не найдена!`);
            }
        }
    });


    // **Обработчик клика (определение типа элемента)**
    document.addEventListener('click', function (event) {
        popup.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        const target = event.target;

        console.log(`🔹 Клик по элементу: ${target.tagName} (class="${target.className}")`);

        if (isTargetPoint(target)) {
            activeElement = target;
            moveInputsToPopup(true);
            updatePopupPosition(activeElement);
        } else if (isTargetLine(target)) {
            activeElement = target;
            moveInputsToPopup(false);
            updatePopupPosition(activeElement);
        } else {
            hidePopup();
        }
    });

    // **Обработчик начала перетаскивания**
    document.addEventListener('mousedown', function (event) {
        if (isTargetPoint(event.target) || isTargetLine(event.target)) {
            activeElement = event.target;
        }
    });

    // **Обработчик движения мыши (динамическое перемещение окна)**
    document.addEventListener('mousemove', function () {
        if (activeElement) {
            updatePopupPosition(activeElement);
        }
    });

    // **Обработчик окончания перетаскивания**
    document.addEventListener('mouseup', function (event) {
        if (popup.contains(event.target)) {
            // Клик мышью внутри popup — не сбрасываем!
            return;
        }
        activeElement = null;
    });

    // ----------------------
    // 📌 COPY/PASTE POINT кнопки
    // ----------------------

    // Глобально объявляем
    const copyPointBtn = document.createElement('button');
    copyPointBtn.type = 'button';
    copyPointBtn.textContent = 'COPY POINT';
    copyPointBtn.style.padding = '6px 16px';
    copyPointBtn.style.fontSize = '12px';
    copyPointBtn.style.lineHeight = '1.2';
    copyPointBtn.style.marginRight = '6px';
    copyPointBtn.style.backgroundColor = '#007BFF'; // синий
    copyPointBtn.style.color = 'white';
    copyPointBtn.style.border = 'none';
    copyPointBtn.style.borderRadius = '3px';
    copyPointBtn.style.cursor = 'pointer';

    const pastePointBtn = document.createElement('button');
    pastePointBtn.type = 'button';
    pastePointBtn.textContent = 'PASTE POINT';
    pastePointBtn.style.padding = '6px 16px';
    pastePointBtn.style.fontSize = '12px';
    pastePointBtn.style.lineHeight = '1.2';
    pastePointBtn.style.backgroundColor = '#28A745'; // зелёный
    pastePointBtn.style.color = 'white';
    pastePointBtn.style.border = 'none';
    pastePointBtn.style.borderRadius = '3px';
    pastePointBtn.style.cursor = 'pointer';

    // ✅ Обработчики с защитой
    copyPointBtn.onclick = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (activeElement && activeElement.tagName.toLowerCase() === 'circle') {
            // Считаем все нужные значения
            const cx = activeElement.getAttribute('cx');
            const cy = activeElement.getAttribute('cy');
            const rotate = document.querySelector('#input_rotate')?.value || '';
            const scale = document.querySelector('#input_scale')?.value || '';
            const index = document.querySelector('#input_position_index')?.value || '';
            const defaultPos = document.querySelector('#input_default_position')?.checked || false;
            const type = document.querySelector('#sticky-points-type')?.value || '';

            const payload = {
                cx,
                cy,
                rotate,
                scale,
                index,
                defaultPos,
                type
            };

            await navigator.clipboard.writeText(JSON.stringify(payload));
            console.log('✅ Copied point data:', payload);
            flashButton(copyPointBtn, '#17a2b8');
        } else {
            alert('❌ No active circle!');
        }
    };

    pastePointBtn.onclick = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (activeElement && activeElement.tagName.toLowerCase() === 'circle') {
            const text = await navigator.clipboard.readText();
            let payload;
            try {
                payload = JSON.parse(text);
            } catch {
                alert('❌ Clipboard does not contain valid point data!');
                return;
            }

            // 1️⃣ Перемещаем координаты через fake drag
            if (!isNaN(payload.cx) && !isNaN(payload.cy)) {
                emulateFakeStrongDrag(activeElement, Number(payload.cx), Number(payload.cy));
            }

            // 2️⃣ Все поля с эмуляцией событий
            if ('rotate' in payload) {
                const el = document.querySelector('#input_rotate');
                if (el) setInputValue(el, payload.rotate);
            }
            if ('scale' in payload) {
                const el = document.querySelector('#input_scale');
                if (el) setInputValue(el, payload.scale);
            }
            if ('index' in payload) {
                const el = document.querySelector('#input_position_index');
                if (el) setInputValue(el, payload.index);
            }
            if ('defaultPos' in payload) {
                const el = document.querySelector('#input_default_position');
                if (el) setCheckboxValue(el, payload.defaultPos);
            }
            if ('type' in payload) {
                const el = document.querySelector('#sticky-points-type');
                if (el) setSelectValue(el, payload.type);
            }

            console.log('✅ Pasted point data with events:', payload);
            flashButton(pastePointBtn, '#218838');
        } else {
            alert('❌ No active circle!');
        }
    };

    // ✅ Контейнер для выравнивания в ряд
    const pointBtnContainer = document.createElement('div');
    pointBtnContainer.style.display = 'flex';
    pointBtnContainer.style.marginBottom = '10px';

    pointBtnContainer.appendChild(copyPointBtn);
    pointBtnContainer.appendChild(pastePointBtn);

    // ✅ Добавляем контейнер в начало popup
    popup.insertBefore(pointBtnContainer, popup.firstChild);


    function flashButton(button, flashColor) {
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = flashColor;
        setTimeout(() => {
            button.style.backgroundColor = originalColor;
        }, 400); // мигание 200 мс
    }

    function setInputValue(el, value) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function setCheckboxValue(el, checked) {
        el.checked = checked;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function setSelectValue(selectEl, value) {
        selectEl.value = value;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));

        const chosenContainer = document.querySelector('#sticky_points_type_chosen');
        if (chosenContainer) {
            const selectedOption = selectEl.querySelector(`option[value="${value}"]`);
            const text = selectedOption ? selectedOption.textContent : value;
            const span = chosenContainer.querySelector('.chosen-single span');
            if (span) span.textContent = text || 'Select an Option';
        }
    }


    // ----------------------
    // 📌 fake strong drag
    // ----------------------

    async function emulateFakeStrongDrag(circle, targetCX, targetCY) {
        const svg = circle.ownerSVGElement;

        // Сохраним старые координаты для лога
        const oldCX = parseFloat(circle.getAttribute('cx'));
        const oldCY = parseFloat(circle.getAttribute('cy'));

        // Прямо задаём новые cx/cy
        circle.setAttribute('cx', targetCX);
        circle.setAttribute('cy', targetCY);

        // Преобразуем в clientX/Y с учётом viewBox
        const rect = svg.getBoundingClientRect();
        const vb = svg.viewBox.baseVal;
        const scaleX = vb && vb.width ? rect.width / vb.width : 1;
        const scaleY = vb && vb.height ? rect.height / vb.height : 1;

        const client = {
            x: rect.left + targetCX * scaleX,
            y: rect.top + targetCY * scaleY
        };

        const dispatch = (type, x, y) => {
            circle.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                clientX: x,
                clientY: y,
                buttons: 1
            }));
        };

        dispatch('mousedown', client.x, client.y);
        dispatch('mousemove', client.x + 5, client.y + 5);
        await new Promise(r => setTimeout(r, 20));
        dispatch('mousemove', client.x, client.y);
        await new Promise(r => setTimeout(r, 20));
        dispatch('mouseup', client.x, client.y);

        console.log(`✅ Fake STRONG drag done:
    CX/CY: (${oldCX}, ${oldCY}) → (${targetCX}, ${targetCY})
    Client: (${client.x}, ${client.y})`);
    }

})();