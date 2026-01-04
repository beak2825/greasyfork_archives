// ==UserScript==
// @name         CVAT NEW TOOLS
// @namespace    http://tampermonkey.net/
// @version      v3.3
// @description  A tool to help edite polygon on CVAT.AI
// @author       Nikitin
// @match        https://app.cvat.ai/tasks/*/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cvat.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508527/CVAT%20NEW%20TOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/508527/CVAT%20NEW%20TOOLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки, является ли текущий URL страницей задания
    function isTaskPage() {
        const urlParts = window.location.pathname.split('/');
        // Проверяем, что URL имеет структуру, соответствующую странице задания: /tasks/{task_id}/jobs/{job_id}
        return urlParts.length >= 5 && urlParts[1] === 'tasks' && !isNaN(urlParts[2]) && urlParts[3] === 'jobs' && !isNaN(urlParts[4]);
    }

    // Если текущий URL не является страницей задания, прекращаем выполнение скрипта
    if (!isTaskPage()) {
        return;
    }


/*--------------------------------------------
  Глобальные переменные
--------------------------------------------*/
let circleVisible = true;  // Определяем переменную, которая управляет видимостью круга
let baseRadius = 30;  // Радиус круга, используемый для захвата точек
let repelForce = 5;   // Сила отталкивания для расталкивания точек
const smoothFactorGrab = 0.5;  // Коэффициент для плавности перемещения точек

// Переменные для режимов работы
let currentMode = "Hand";  // Текущий режим работы (например, "Hand" для ручного перемещения)

// Переменные для работы с отталкиванием
let isRepelling = false;  // Флаг для отслеживания, идет ли процесс расталкивания точек
let circle = null;    // Элемент круга (инициализируется как null для последующего использования)
let currentMousePosition = { x: 0, y: 0 };  // Позиция курсора мыши, обновляется в реальном времени
let fixedCirclePosition = { x: 0, y: 0 };  // Зафиксированная позиция круга, используется для вычислений взаимодействий
let isCtrlPressed = false;  // Флаг для отслеживания нажатия клавиши Ctrl, используется для спец. операций
let isAltPressed = false;  // Флаг для отслеживания нажатия клавиши Alt, чтобы различать режимы работы

// Переменные для перемещения точек
let isDragging = false;  // Флаг, указывающий, активировано ли перемещение (drag)
let hasMoved = false;  // Флаг, указывающий, произошло ли перемещение после захвата точки
let dragStartX, dragStartY;  // Координаты начала перемещения мыши (используются для вычисления смещения)
let movedPoints = new Map();  // Карта, сохраняющая перемещенные точки и их новые координаты
let grabbedPoints = [];  // Массив захваченных точек, которые будут перемещаться вместе с курсором


let savedHandPolygon = null;  // Переменная для сохранения контура полигона "руки"
let handVisualPolygon = null;  // Переменная для визуального полигона
let lastMode = "Hand";  // Переменная для хранения последнего активного режима (по умолчанию "Hand")
let isIntersectionToolActive = false; // Флаг активации проверки пересечений



let isRightClickPressed = false;
/*--------------------------------------------
  Стили для плавающей панели и элемента круга
--------------------------------------------*/

const style = document.createElement('style');
style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');

    #floating-panel {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 8px;
        display: flex;
        gap: 20px;
        align-items: flex-start;
        z-index: 10000;
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 12px;
    }

    #floating-panel .column {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #floating-panel label {
        color: white;
    }

    #floating-panel input[type="range"] {
        width: 150px;
    }

    #floating-panel button {
        background-color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Roboto Condensed', sans-serif;
    }

    #floating-panel button.active {
        background-color: #333;
        color: white;
    }

    #custom-circle {
        border: 2px solid rgba(255, 0, 0, 1);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        display: none;
    }

    /* Стили для чекбоксов */
    #floating-panel input[type="checkbox"] {
        width: auto;
        margin-right: 5px;
    }

    /* Кнопки режима в строку */
    .mode-buttons {
        display: flex;
        gap: 10px;
    }

    /* Чекбокс под кнопками */
    #floating-panel .column div {
        display: flex;
        align-items: center;
    }
`;
document.head.appendChild(style);

/*--------------------------------------------
  Создание HTML панели и кнопок через innerHTML
--------------------------------------------*/
const floatingPanel = document.createElement('div');
floatingPanel.innerHTML = `
    <div id="floating-panel">
        <!-- Первая колонка -->
        <div class="column">
            <label for="radius-range">Радиус: <span id="radius-value">30</span></label>
            <input type="range" id="radius-range" min="5" max="100" value="30">
            <div>
                <input type="checkbox" id="show-circle" checked>
                <label for="show-circle">Показать круг</label>
            </div>
        </div>

        <!-- Вторая колонка -->
        <div class="column">
            <div class="mode-buttons">
                <button id="hand-mode" class="active">Hand Mode</button>
                <button id="polygon-mode">Polygon Mode</button>
            </div>
            <div>
                <input type="checkbox" id="check-intersection">
                <label for="check-intersection">Проверить пересечение</label>
            </div>
        </div>
    </div>
`;
document.body.appendChild(floatingPanel);





// Получаем ссылки на кнопки
const handModeButton = document.getElementById('hand-mode');
const polygonModeButton = document.getElementById('polygon-mode');
const mirrorButton = document.getElementById('mirror-button');


/*--------------------------------------------
  Логика переключения режимов: Hand и Polygon
--------------------------------------------*/
function switchMode(newMode) {
    currentMode = newMode;  // Устанавливаем текущий режим
    lastMode = newMode;     // Сохраняем текущий режим как последний активный

    if (newMode === "Hand") {
        handModeButton.classList.add('active');
        polygonModeButton.classList.remove('active');
        toggleVisibility('hand');  // Включаем видимость объекта hand
        console.log('Hand mode enabled');

        // Удаляем визуальный полигон при возврате в режим Hand
        removeVisualPolygon();

    } else if (newMode === "Polygon") {
        polygonModeButton.classList.add('active');
        handModeButton.classList.remove('active');
        toggleVisibility('poly');  // Скрываем объект hand и показываем остальные
        console.log('Polygon mode enabled');

        // Вставляем логику для создания визуального полигона после скрытия руки
        setTimeout(() => {
            removeVisualPolygon();  // Удаляем старый полигон перед созданием нового
            addVisualPolygon();
        }, 100);  // Задержка на выполнение toggleVisibility
    }
}

handModeButton.addEventListener('click', () => switchMode("Hand"));
polygonModeButton.addEventListener('click', () => switchMode("Polygon"));

/*--------------------------------------------
  Логика переключения с клавишей Tab
--------------------------------------------*/
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();  // Предотвращаем стандартное поведение Tab
        if (currentMode === "Hand") {
            switchMode("Polygon");  // Переключаем на Polygon
        } else if (currentMode === "Polygon") {
            switchMode("Hand");  // Переключаем на Hand
        }
    }
});

/*--------------------------------------------
  Функция для управления видимостью объектов и кнопкой "pushpin"
--------------------------------------------*/
function toggleVisibility(mode) {
    const items = document.querySelectorAll('.cvat-objects-sidebar-state-item');

    items.forEach(item => {
        const labelElement = item.querySelector('.ant-select-selection-item');
        if (!labelElement) return;

        const eyeButton = item.querySelector('[aria-label="eye"], [aria-label="eye-invisible"]');
        const pushpinButton = item.querySelector('[aria-label="pushpin"]');
        if (!eyeButton) return;
        if (!pushpinButton) return;

        const objectLabel = labelElement.textContent.trim();

        // Управление видимостью через "eye"
        if (mode === 'hand') {
            if (objectLabel === 'hand' && eyeButton.getAttribute('aria-label') === 'eye-invisible') {
                eyeButton.click();  // Включаем объект hand
            } else if (objectLabel !== 'hand' && eyeButton.getAttribute('aria-label') === 'eye') {
                eyeButton.click();  // Отключаем все остальные объекты
            }
        } else if (mode === 'poly') {
            if (objectLabel === 'hand' && eyeButton.getAttribute('aria-label') === 'eye') {
                eyeButton.click();  // Скрываем hand
            } else if (objectLabel !== 'hand' && eyeButton.getAttribute('aria-label') === 'eye-invisible') {
                eyeButton.click();  // Включаем остальные объекты
            }

            // Отключаем "pushpin", если она активирована (только для объектов, кроме "hand")
            if (objectLabel !== 'hand' && pushpinButton.classList.contains('cvat-object-item-button-pinned-enabled')) {
                console.log(`Кнопка "pushpin" активна для объекта ${objectLabel}, отключаем...`);
                pushpinButton.focus(); // Фокусируем на кнопку
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                pushpinButton.dispatchEvent(clickEvent); // Эмулируем клик
                console.log('Кнопка "pushpin" отключена.');
            } else {
                console.log(`Кнопка "pushpin" уже отключена или неактивна для объекта ${objectLabel}.`);
            }
        }
    });
}






























/*--------------------------------------------
  Функция для добавления визуального полигона
--------------------------------------------*/
function addVisualPolygon() {
    // Находим скрытый полигон с количеством точек более 20
    let hiddenPolygons = document.querySelectorAll('polygon.cvat_canvas_shape[points][class*="cvat_canvas_hidden"]');
    let selectedPolygon = null;

    hiddenPolygons.forEach((polygon) => {
        let points = polygon.getAttribute('points').split(' ').filter(Boolean);  // Разделяем строку точек на массив
        if (points.length > 20) {  // Ищем полигон с более чем 20 точками
            selectedPolygon = polygon;
        }
    });

    // Если не нашли нужный полигон, выводим сообщение и выходим
    if (!selectedPolygon) {
        console.log('Скрытый полигон с более чем 20 точками не найден');
        return;
    }

    // Проверяем, существует ли уже визуальный полигон
    let existingVisualPolygon = document.getElementById('visual-polygon-unique');
    if (existingVisualPolygon) {
        console.log('Визуальный полигон уже существует');
        return;
    }

    // Создаем новый полигон на основе выбранного
    let points = selectedPolygon.getAttribute('points');
    let newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    newPolygon.setAttribute('points', points);

    newPolygon.setAttribute('stroke-width', '1');
    newPolygon.setAttribute('stroke-opacity', '1');
    newPolygon.setAttribute('id', 'visual-polygon-unique');

    let svgCanvas = document.getElementById('cvat_canvas_content');
    if (svgCanvas) {
        svgCanvas.insertBefore(newPolygon, selectedPolygon);
        console.log('Визуальный полигон создан с уникальным ID: visual-polygon-unique');
    } else {
        console.log('SVG canvas не найден');
    }

    // После добавления полигона обновляем его цвет на основе состояния чекбокса
    const checkbox = document.querySelector('.ant-checkbox-input');
    if (checkbox.checked) {
        newPolygon.setAttribute('fill', 'rgba(0, 0, 0, 0)');
        newPolygon.setAttribute('stroke', 'black');
    } else {
        newPolygon.setAttribute('fill', 'rgba(172, 168, 168, 0)');
        newPolygon.setAttribute('stroke', 'rgba(172, 168, 168, 1)');
    }
}


/*--------------------------------------------
  Функция для удаления визуального полигона
--------------------------------------------*/
function removeVisualPolygon() {
    let visualPolygon = document.getElementById('visual-polygon-unique');
    if (visualPolygon) {
        visualPolygon.remove();
        console.log('Визуальный полигон удален');
    } else {
        console.log('Визуальный полигон не найден');
    }
}


/*--------------------------------------------
  Обновления цвета при Outline borders
--------------------------------------------*/
function updatePolygonColorBasedOnCheckbox() {
    const checkbox = document.querySelector('.ant-checkbox-input'); // Выбираем чекбокс

    // Функция для обновления цвета полигона
    function updateColor() {
        let visualPolygon = document.getElementById('visual-polygon-unique'); // Ищем существующий полигон

        if (visualPolygon) {
            if (checkbox.checked) {
                // Если чекбокс включен, делаем полигон черным
                visualPolygon.setAttribute('fill', 'rgba(0, 0, 0, 0.1)');
                visualPolygon.setAttribute('stroke', 'black');
                console.log('Чекбокс включен: полигон черный.');
            } else {
                // Если чекбокс выключен, делаем полигон серым
                visualPolygon.setAttribute('fill', 'rgba(172, 168, 168, 0.1)');
                visualPolygon.setAttribute('stroke', 'rgba(172, 168, 168, 1)');
                console.log('Чекбокс выключен: полигон серый.');
            }
        } else {
            console.error('Полигон visual-polygon-unique не найден.');
        }
    }

    // Проверяем начальное состояние при загрузке
    updateColor();

    // Следим за изменением состояния чекбокса
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            updateColor(); // Обновляем цвет при изменении состояния чекбокса
        });
    } else {
        console.error('Чекбокс не найден.');
    }
}


/*--------------------------------------------
  Наблюдатель за изменениями слайдера "aria-valuenow"
--------------------------------------------*/
function observeSliderChanges() {
    const sliderElement = document.querySelector('.ant-slider-handle[role="slider"]');

    if (sliderElement) {
        let oldValue = sliderElement.getAttribute('aria-valuenow');

        const observer = new MutationObserver(() => {
            const newValue = sliderElement.getAttribute('aria-valuenow');
            if (newValue !== oldValue) {
                console.log('Значение слайдера изменилось, обновляем режим и полигон');
                oldValue = newValue;  // Обновляем значение
                removeVisualPolygon();  // Удаляем предыдущий полигон

                // Восстанавливаем последний режим на новом изображении
                if (lastMode === "Polygon") {
                    switchMode("Polygon");
                } else {
                    switchMode("Hand");
                }
            }
        });

        // Наблюдаем за изменением атрибута aria-valuenow
        observer.observe(sliderElement, {
            attributes: true,
            attributeFilter: ['aria-valuenow']
        });
    } else {
        console.log('Слайдер не найден');
    }
}


/*--------------------------------------------
  Логика создания и управления кругом
--------------------------------------------*/

function createCursorCircle() {
    // Инициализируем круг
    circle = document.createElement('div');
    circle.id = 'custom-circle';
    circle.style.display = 'none';  // Скрыт по умолчанию
    document.body.appendChild(circle);

document.addEventListener('mousemove', function(event) {
    updateCirclePosition(event);  // Обновляем позицию круга

    if (circleVisible) {
        circle.style.display = 'block';
    } else {
        circle.style.display = 'none';
    }

    // Если нажата комбинация Alt + Right Click, изменяем радиус
    if (isAltPressed && isRightClickPressed) {
        const deltaX = event.movementX;
        baseRadius = Math.max(5, Math.min(100, baseRadius + deltaX / 2));

        const radiusSlider = document.getElementById('radius-range');
        const radiusValue = document.getElementById('radius-value');

        // Проверяем, существуют ли элементы перед обновлением их значений
        if (radiusSlider && radiusValue) {
            radiusSlider.value = Math.round(baseRadius);
            radiusValue.textContent = Math.round(baseRadius);
        } else {
            console.error('Ползунок или значение радиуса не найдены на странице.');
        }

        const scale = getCurrentScale();
        updateCircleRadius(scale);  // Обновляем радиус с учётом масштаба
    }
});

    // Обновляем круг при прокрутке (zoom)
    document.addEventListener('wheel', function() {
        const scale = getCurrentScale();
        updateCircleRadius(scale);  // Обновляем радиус при изменении масштаба
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 2 && isAltPressed) {
            isRightClickPressed = true;
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            isRightClickPressed = false;
        }
    });

    // Обработчики для отслеживания нажатия клавиши Alt
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = false;
        }
    });
}

/*--------------------------------------------
  Функция обновления радиуса круга с учетом масштаба
--------------------------------------------*/

function updateCircleRadius(scale) {
    const scaledRadius = baseRadius * scale;
    circle.style.width = `${scaledRadius * 2}px`;
    circle.style.height = `${scaledRadius * 2}px`;
}

/*--------------------------------------------
  Функция получения текущего масштаба
--------------------------------------------*/

function getCurrentScale() {
    const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
    if (canvasAttachmentBoard) {
        let style = window.getComputedStyle(canvasAttachmentBoard, null);
        let transformMatrix = new WebKitCSSMatrix(style.webkitTransform);
        return transformMatrix.a || transformMatrix.m11;  // Вернём масштаб (m11 для webkit)
    }
    return 1;
}

/*--------------------------------------------
  Функция обновления позиции круга
--------------------------------------------*/

function updateCirclePosition(event) {
    const scale = getCurrentScale();
    updateCircleRadius(scale);  // Обновляем радиус с учётом масштаба
    circle.style.left = `${event.clientX - circle.offsetWidth / 2}px`;
    circle.style.top = `${event.clientY - circle.offsetHeight / 2}px`;
}

/*--------------------------------------------
  Логика для ползунка изменения радиуса
--------------------------------------------*/
function setupRadiusSlider() {
    const radiusSlider = document.getElementById('radius-range');  // Используем 'radius-range'
    const radiusValue = document.getElementById('radius-value');

    // Проверяем, существуют ли элементы
    if (radiusSlider && radiusValue) {
        radiusSlider.addEventListener('input', function() {
            baseRadius = Math.round(radiusSlider.value);
            radiusValue.textContent = baseRadius;

            const scale = getCurrentScale();
            updateCircleRadius(scale);  // Обновляем радиус круга с учетом масштаба
        });
    } else {
        console.error('Ползунок или значение радиуса не найдены на странице.');
    }
}


/*--------------------------------------------
  Функция скрытия и показа круга
--------------------------------------------*/
function toggleCircleVisibility() {
    const showCircleCheckbox = document.getElementById('show-circle');

    if (showCircleCheckbox) {
        showCircleCheckbox.addEventListener('change', function() {
            circleVisible = this.checked;  // Обновляем состояние видимости круга
            // Меняем подход: используем visibility для скрытия только визуальной части, но не функциональности
            circle.style.visibility = circleVisible ? 'visible' : 'hidden';
        });
    } else {
        console.error('Чекбокс "Показать круг" не найден.');
    }
}



/*--------------------------------------------
  Функция для проверки, пересекаются ли полигоны
--------------------------------------------*/
function isPointInsidePolygon(point, polygonPoints) {
    let [px, py] = point;
    let inside = false;

    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
        const [xi, yi] = polygonPoints[i];
        const [xj, yj] = polygonPoints[j];

        const intersect = ((yi > py) !== (yj > py)) &&
                          (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

/*--------------------------------------------
  Функция для сравнения маленьких полигонов с уникальным
--------------------------------------------*/
function checkPolygonsIntersection() {
    // Проверяем флаг активации инструмента
    if (!isIntersectionToolActive) {
        console.log('Инструмент пересечения не активен');
        return;
    }

    // Находим уникальный полигон
    let uniquePolygonElement = document.getElementById('visual-polygon-unique');
    if (!uniquePolygonElement) {
        console.log('Уникальный полигон не найден');
        return;
    }

    // Получаем точки уникального полигона
    let uniquePolygonPoints = uniquePolygonElement.getAttribute('points')
        .split(' ')
        .map(point => point.split(',').map(Number));

    // Получаем все видимые полигоны (исключаем скрытые и сам уникальный полигон)
    let visiblePolygons = document.querySelectorAll('polygon.cvat_canvas_shape:not(.cvat_canvas_hidden):not(#visual-polygon-unique)');

    visiblePolygons.forEach(polygon => {
        let polygonPoints = polygon.getAttribute('points')
            .split(' ')
            .map(point => point.split(',').map(Number));

        // Проверяем каждую точку маленького полигона
        let intersectionDetected = polygonPoints.some(point => isPointInsidePolygon(point, uniquePolygonPoints));

        if (intersectionDetected) {
            // Если обнаружено пересечение, меняем цвет маленького полигона на красный
            polygon.setAttribute('stroke', 'red');
            polygon.setAttribute('stroke-width', '0.25');
            console.log('Обнаружено пересечение! Полигон пересекает уникальный полигон и теперь красный.');
        } else {
            // Если пересечения нет, оставляем цвет полигона
            polygon.setAttribute('stroke', '#66ff66'); // Вернем первоначальный цвет, если нет пересечений
        }
    });
}

/*--------------------------------------------
  Логика для включения/отключения инструмента пересечения
--------------------------------------------*/
function toggleIntersectionTool() {
    const checkIntersectionCheckbox = document.getElementById('check-intersection');

    if (checkIntersectionCheckbox) {
        checkIntersectionCheckbox.addEventListener('change', function() {
            isIntersectionToolActive = this.checked;  // Обновляем флаг активации инструмента
            console.log('Инструмент пересечения активен:', isIntersectionToolActive);
        });
    } else {
        console.error('Чекбокс "Проверить пересечение" не найден.');
    }
}

/*--------------------------------------------
  Функция для обработки изменения масштаба (Zoom)
--------------------------------------------*/
function handleZoom() {
    window.addEventListener('wheel', function() {
        const scale = getCurrentScale();
        updateCircleRadius(scale);  // Обновляем радиус круга при изменении масштаба

        // Проверяем пересечения после изменения масштаба
        checkPolygonsIntersection();
    });
}

/*--------------------------------------------
  Функция для отслеживания пересечений в реальном времени
--------------------------------------------*/
function trackRealTimeIntersections() {
    // Отслеживаем пересечения при движении мыши
    document.addEventListener('mousemove', function() {
        checkPolygonsIntersection();
    });

    // Отслеживаем пересечения при изменении масштаба
    handleZoom();
}




// Переменная для задержки (в миллисекундах)
const delay = 10;

// Функция для эмуляции события нажатия клавиши
function simulateKeyPress(element, key) {
    const keydownEvent = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(keyupEvent);
}

    // Функция для открытия списка и выбора лейбла по индексу
    function openDropdownAndSelectLabel(index) {
        console.log('Попытка нажать на иконку для рисования полигона...');
        const polygonControlIcon = document.querySelector('.anticon.cvat-draw-polygon-control');
        if (polygonControlIcon) {
            polygonControlIcon.click();
            console.log('Иконка для рисования полигона нажата.');

            setTimeout(() => {
                console.log('Проверяем наличие формы...');
                const container = document.querySelector('.ant-popover-inner-content .cvat-draw-shape-popover-content');
                if (container) {
                    console.log('Форма найдена:', container);

                    const inputElement = container.querySelector('input.ant-select-selection-search-input');
                    if (inputElement) {
                        console.log('Input найден:', inputElement);
                        inputElement.focus();
                        inputElement.click();
                        simulateKeyPress(inputElement, 'a');
                        console.log('Эмуляция нажатия клавиши для открытия выпадающего списка выполнена.');

                        setTimeout(() => {
                            console.log('Проверяем наличие лейблов...');
                            const labels = document.querySelectorAll('.ant-select-item-option');
                            if (labels && labels.length > 0) {
                                console.log(`Найдено ${labels.length} лейблов.`);
                                if (labels[index]) {
                                    console.log(`Кликаем на лейбл с индексом ${index}:`, labels[index]);
                                    labels[index].click();

                                    setTimeout(() => {
                                        console.log('Поиск кнопки Shape...');
                                        const shapeButton = document.querySelector('.cvat-draw-polygon-shape-button');
                                        if (shapeButton) {
                                            shapeButton.click();
                                            console.log('Кнопка Shape нажата.');
                                        } else {
                                            console.log('Кнопка Shape не найдена.');
                                        }
                                    }, delay);
                                } else {
                                    console.log(`Лейбл с индексом ${index} не найден.`);
                                }
                            } else {
                                console.log('Лейблы не найдены. Возможно, выпадающий список не открылся.');
                            }
                        }, delay);
                    } else {
                        console.log('Input внутри формы не найден. Проверьте структуру DOM.');
                    }
                } else {
                    console.log('Контейнер с формой не найден.');
                }
            }, delay);
        } else {
            console.log('Иконка для рисования полигона не найдена.');
        }
    }

// Обработка нажатия клавиш NUM и блокировка их стандартного поведения
document.addEventListener('keydown', (event) => {
    if (event.code.startsWith('Numpad')) {
        const numKey = event.code.replace('Numpad', ''); // Получаем цифру из названия клавиши, например 'Numpad1' -> '1'
        const index = parseInt(numKey); // Преобразуем в число

        if (!isNaN(index) && index >= 0 && index <= 9) {
            openDropdownAndSelectLabel(index); // Вызов функции с нужным индексом
            event.preventDefault(); // Блокируем стандартное поведение NUM клавиш
            console.log(`Вызвана функция для индекса ${index}.`);
        }
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const doneButton = document.querySelector('.cvat-annotation-header-done-button');
        if (doneButton) {
            doneButton.click();
            console.log('Кнопка Done нажата.');
        } else {
            console.log('Кнопка Done не найдена.');
        }
    }
});


/*--------------------------------------------
  Обработчики клавиш для Ctrl и Alt
--------------------------------------------*/
document.addEventListener('keydown', function(event) {
    if (event.key === 'Control') {
        isCtrlPressed = true;
    } else if (event.key === 'Alt') {
        isAltPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Control') {
        isCtrlPressed = false;
    } else if (event.key === 'Alt') {
        isAltPressed = false;
    }
});


/*--------------------------------------------
  Логика для расталкивания/притягивания точек
--------------------------------------------*/
function adjustPointsAroundCursor(interactionType) {
    let points = document.querySelectorAll('circle.svg_select_points_point');

    if (points.length === 0) {
        console.error('Элементы circle не найдены.');
        return;
    }

    const scale = getCurrentScale();  // Получаем текущий масштаб
    let pointsInRadius = [];

    points.forEach(point => {
        let rect = point.getBoundingClientRect();
        let pointX = rect.left + rect.width / 2;
        let pointY = rect.top + rect.height / 2;

        let distance = Math.sqrt(Math.pow(fixedCirclePosition.x - pointX, 2) + Math.pow(fixedCirclePosition.y - pointY, 2));

        if (distance <= baseRadius * scale) {
            pointsInRadius.push(point);
        }
    });

    if (pointsInRadius.length === 0) {
        console.log('Нет точек в радиусе круга.');
        return;
    }

    // Фиксируем круг и запрещаем его перемещение во время взаимодействия
    isRepelling = true;

    pointsInRadius.forEach(point => {
        let rect = point.getBoundingClientRect();
        let pointX = rect.left + rect.width / 2;
        let pointY = rect.top + rect.height / 2;

        let angle = Math.atan2(pointY - fixedCirclePosition.y, pointX - fixedCirclePosition.x);
        let newX, newY;

        if (interactionType === 'repel') {
            newX = pointX + Math.cos(angle) * repelForce;
            newY = pointY + Math.sin(angle) * repelForce;
        } else if (interactionType === 'attract') {
            newX = pointX - Math.cos(angle) * repelForce;
            newY = pointY - Math.sin(angle) * repelForce;
        }

        let mousedownEvent = new MouseEvent('mousedown', {
            clientX: pointX,
            clientY: pointY,
            bubbles: true,
            cancelable: true,
            view: window
        });
        point.dispatchEvent(mousedownEvent);

        let mousemoveEvent = new MouseEvent('mousemove', {
            clientX: newX,
            clientY: newY,
            bubbles: true,
            cancelable: true,
            view: window
        });
        point.dispatchEvent(mousemoveEvent);

        let mouseupEvent = new MouseEvent('mouseup', {
            clientX: newX,
            clientY: newY,
            bubbles: true,
            cancelable: true,
            view: window
        });
        point.dispatchEvent(mouseupEvent);
    });

    console.log(`${interactionType === 'repel' ? 'Расталкивание' : 'Притягивание'} завершено для ${pointsInRadius.length} точек.`);

    isRepelling = false;  // Разрешаем перемещение круга снова
}


/*--------------------------------------------
  Обработчик кликов для расталкивания, притягивания
--------------------------------------------*/
document.addEventListener('click', function(event) {
    if (currentMode === "Hand" && !isRepelling) {
        // Фиксируем позицию центра круга по положению мыши
        fixedCirclePosition = { x: event.clientX, y: event.clientY };

        if (isCtrlPressed && event.button === 0) {  // Расталкивание при Ctrl + Click
            adjustPointsAroundCursor('repel');
        } else if (isAltPressed && event.button === 0) {  // Притягивание при Alt + Click
            adjustPointsAroundCursor('attract');
        }
    }
});


/*--------------------------------------------
  Логика для перетягивания точек при правом клике
--------------------------------------------*/
document.addEventListener('mousedown', function(event) {
    // Если нажата правая кнопка мыши и Alt не зажат
    if (event.button === 2 && !isAltPressed) {
        // Проверяем, что не кликаем на 'visual-polygon-unique'
        if (event.target.id === 'visual-polygon-unique') {
            console.log('Перетаскивание запрещено для visual-polygon-unique');
            return;
        }

        // Проверяем, активен ли инструмент добавления точек (элемент <polyline> или другой динамический элемент)
        const activeShapeDrawingTool = document.querySelector('polyline.cvat_canvas_shape_drawing');

        // Если активен инструмент добавления точек, не блокируем стандартное поведение правой кнопки
        if (activeShapeDrawingTool) {
            return;  // Разрешаем стандартное поведение правого клика
        }

        // Логика перетаскивания точек
        isDragging = true;
        hasMoved = false;  // Сбрасываем флаг перемещения
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        grabbedPoints = [];  // Очищаем список захваченных точек

        const scale = getCurrentScale();

        // Если круг видим, используем его размеры, иначе используем базовый радиус
        let currentRadius = circleVisible ? (circle.offsetWidth / 2 / scale) : baseRadius;

        // Получаем все полигоны на странице
        let polygons = document.querySelectorAll('polygon');

        polygons.forEach((polygon) => {
            let svgPolygon = SVG.adopt(polygon);
            let points = svgPolygon.array().value;

            // Проверяем, что полигон не является уникальным и не скрыт (класс cvat_canvas_hidden)
            if (points.length > 3 && polygon.id !== 'visual-polygon-unique' && !polygon.classList.contains('cvat_canvas_hidden')) {
                points.forEach((point, index) => {
                    const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
                    let rect = canvasAttachmentBoard.getBoundingClientRect();
                    let offsetX = (event.clientX - rect.left) / scale;
                    let offsetY = (event.clientY - rect.top) / scale;

                    // Расстояние до точки полигона
                    let distance = Math.sqrt(Math.pow(point[0] - offsetX, 2) + Math.pow(point[1] - offsetY, 2));

                    // Если расстояние до точки меньше или равно текущему радиусу
                    if (distance <= currentRadius) {
                        grabbedPoints.push({ polygon: svgPolygon, pointIndex: index });
                    }
                });
            }
        });

        // Блокируем стандартное поведение правой кнопки только для сценария перетаскивания точек
        event.preventDefault();
        event.stopPropagation();
    }
}, true);




// Обработчик для перемещения точек при движении мыши
document.addEventListener('mousemove', function(event) {
    if (isDragging && grabbedPoints.length > 0) {  // Перемещаем только если точки захвачены
        hasMoved = true;  // Устанавливаем флаг перемещения
        const scale = getCurrentScale();
        const dx = (event.clientX - dragStartX) * smoothFactorGrab / scale;
        const dy = (event.clientY - dragStartY) * smoothFactorGrab / scale;

        // Перемещаем только захваченные точки
        grabbedPoints.forEach(grabbed => {
            let points = grabbed.polygon.array().value;
            let point = points[grabbed.pointIndex];

            // Смещаем точку в направлении движения курсора с плавностью
            point[0] += dx;
            point[1] += dy;

            // Обновляем полигон
            grabbed.polygon.plot(points);
        });

        // Обновляем начальные координаты для следующего движения
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        event.preventDefault();
    }
}, true);

// Обработчик для завершения перемещения
document.addEventListener('mouseup', function(event) {
    if (isDragging) {
        isDragging = false;

        // Если не произошло перемещения, ничего не делаем
        if (hasMoved) {
            // Вызываем функцию для смещения случайной точки на 50px
            moveRandomPointWithSimulation();
        }

        event.preventDefault();
    }
}, true);

// Эмуляция событий для перемещения случайной точки
function moveRandomPointWithSimulation() {
    // Получаем все элементы circle (точки) на странице
    let points = document.querySelectorAll('circle.svg_select_points_point');

    if (points.length === 0) {
        console.error('Элементы circle не найдены.');
        return;
    }

    // Выбираем случайную точку
    let randomIndex = Math.floor(Math.random() * points.length);
    let randomPoint = points[randomIndex];

    let rect = randomPoint.getBoundingClientRect();
    let pointX = rect.left + rect.width / 2;
    let pointY = rect.top + rect.height / 2;

    console.log(`Сдвигаем случайную точку [X: ${pointX}, Y: ${pointY}] на 1px влево.`);

    // Новые координаты для смещения на 1px влево
    let newX = pointX - 1;
    let newY = pointY;

    // Эмуляция mousedown на начальной позиции
    let mousedownEvent = new MouseEvent('mousedown', {
        clientX: pointX,
        clientY: pointY,
        bubbles: true,
        cancelable: true,
        view: window
    });
    randomPoint.dispatchEvent(mousedownEvent);

    // Эмуляция mousemove на 50px влево
    let mousemoveEvent = new MouseEvent('mousemove', {
        clientX: newX,
        clientY: newY,
        bubbles: true,
        cancelable: true,
        view: window
    });
    randomPoint.dispatchEvent(mousemoveEvent);

    // Эмуляция mouseup на новой позиции
    let mouseupEvent = new MouseEvent('mouseup', {
        clientX: newX,
        clientY: newY,
        bubbles: true,
        cancelable: true,
        view: window
    });
    randomPoint.dispatchEvent(mouseupEvent);

    console.log(`Эмуляция завершена: точка перемещена с [X: ${pointX}, Y: ${pointY}] на [X: ${newX}, Y: ${newY}]`);
}


let lastMouseY = null;
let lastMouseX = null;

/*--------------------------------------------
  Логика поворота полигона
--------------------------------------------*/
let rotating = false; // Флаг для включения режима вращения
let currentRotationAngle = 0; // Накопленный угол поворота полигона
let rotationSpeed = 0.3; // Скорость вращения
let polygonsHidden = false; // Флаг для отслеживания, скрыты ли полигоны

window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyW' && !rotating) {
        rotating = true;
        lastMouseX = null; // Сбрасываем последнее положение мыши при начале вращения

        if (!polygonsHidden) {
            togglePolygonVisibility(); // Скрываем полигоны только один раз при начале вращения
            polygonsHidden = true;
        }
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'KeyW' && rotating) {
        rotating = false;

        if (polygonsHidden) {
            togglePolygonVisibility(); // Восстанавливаем полигоны после завершения вращения
            polygonsHidden = false;
        }

        moveRandomPointWithSimulation(); // Дополнительная логика после вращения
    }
});

window.addEventListener('mousemove', function (event) {
    if (rotating) {
        if (lastMouseX === null) {
            lastMouseX = event.clientX; // Фиксируем начальное положение мыши только при первом движении
        }

        let activeElement = document.querySelector('.cvat_canvas_shape_activated');
        if (activeElement !== null) {
            let polygon2 = SVG.adopt(document.querySelector(`#${activeElement.id}`));
            let points = polygon2.array().value;

            // Функция для вычисления центра полигона (центроида)
            let calculateCentroid = function (points) {
                let sumX = 0, sumY = 0;
                points.forEach(point => {
                    sumX += point[0];
                    sumY += point[1];
                });
                return [sumX / points.length, sumY / points.length];
            };

            // Получаем центроид полигона
            let centroid = calculateCentroid(points);

            // Определяем смещение мыши относительно последнего положения
            let deltaX = event.clientX - lastMouseX;

            // Если смещение по X есть
            if (Math.abs(deltaX) > 0) {
                // Вычисляем угол поворота на основе deltaX и скорости вращения
                let angle = deltaX * rotationSpeed;
                currentRotationAngle += angle; // Накопливаем угол поворота

                let rad = (Math.PI / 180) * angle; // Преобразуем угол в радианы

                // Функция для вращения точки вокруг центроида
                let rotatePoint = function (x, y, cx, cy, rad) {
                    let dx = x - cx;
                    let dy = y - cy;
                    let newX = dx * Math.cos(rad) - dy * Math.sin(rad);
                    let newY = dx * Math.sin(rad) + dy * Math.cos(rad);
                    return [newX + cx, newY + cy];
                };

                // Вращаем все точки полигона вокруг центроида
                points = points.map(point => rotatePoint(point[0], point[1], centroid[0], centroid[1], rad));

                // Обновляем полигон
                polygon2.plot(points);

                // Обновляем последнее положение мыши
                lastMouseX = event.clientX;
            }
        }
    }
});

window.addEventListener('mousedown', function (event) {
    // Сбрасываем начальное положение мыши при нажатии кнопки мыши
    lastMouseX = null;
});


/*--------------------------------------------
  Логика мастабирования полигона
--------------------------------------------*/
let scaling = false; // Флаг для масштабирования
let scaleSpeed = 0.03; // Скорость масштабирования
let scaleSensitivity = 1; // Чувствительность масштабирования (можно изменить для более сильного или слабого эффекта)

window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyS' && !scaling) {
        scaling = true;
        console.log('Масштабирование начато');

        // Включаем режим скрытия неактивных полигонов через "eye"
        togglePolygonVisibility();
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'KeyS' && scaling) {
        scaling = false;
        console.log('Масштабирование остановлено');

        // Возвращаем видимость всех полигонов через "eye"
        togglePolygonVisibility();

        // Дополнительная логика после масштабирования
        moveRandomPointWithSimulation();
    }
});

window.addEventListener('mousemove', function (event) {
    if (scaling) {
        let activeElement = document.querySelector('.cvat_canvas_shape_activated');
        if (activeElement !== null) {
            let polygon2 = SVG.adopt(document.querySelector(`#${activeElement.id}`));
            let points = polygon2.array().value;

            // Функция для вычисления центра полигона (центроида)
            let calculateCentroid = function (points) {
                let sumX = 0, sumY = 0;
                points.forEach(point => {
                    sumX += point[0];
                    sumY += point[1];
                });
                return [sumX / points.length, sumY / points.length];
            };

            // Определяем центроид полигона
            let centroid = calculateCentroid(points);

            // Вычисляем, насколько мышь смещается по X и Y
            let deltaX = event.clientX - lastMouseX;
            let deltaY = event.clientY - lastMouseY;

            // Если есть смещение по X или Y
            if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {

                // Масштабируем по горизонтали
                if (Math.abs(deltaX) > 0) {
                    points = points.map(point => {
                        let dx = point[0] - centroid[0];
                        let scaleX = 1 + (deltaX > 0 ? scaleSpeed : -scaleSpeed) * scaleSensitivity;
                        return [centroid[0] + dx * scaleX, point[1]];
                    });
                }

                // Масштабируем по вертикали
                if (Math.abs(deltaY) > 0) {
                    points = points.map(point => {
                        let dy = point[1] - centroid[1];
                        let scaleY = 1 + (deltaY < 0 ? scaleSpeed : -scaleSpeed) * scaleSensitivity;
                        return [point[0], centroid[1] + dy * scaleY];
                    });
                }

                // Обновляем полигон
                polygon2.plot(points);

                // Сохраняем текущее положение мыши для следующего события
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        }
    }
});

window.addEventListener('mousedown', function (event) {
    lastMouseX = event.clientX;
    console.log('Мышь нажата. Начальная координата:', lastMouseX, lastMouseY);
});


/*--------------------------------------------
  Функция для управления видимостью объектов через "eye"
--------------------------------------------*/
let visibilityFilterActive = false; // Флаг для управления видимостью полигонов
let hiddenPolygons = []; // Массив для хранения скрытых полигонов

function togglePolygonVisibility() {
    const items = document.querySelectorAll('.cvat-objects-sidebar-state-item');
    const activePolygon = document.querySelector('polygon.cvat_canvas_shape_activated'); // Активный полигон

    if (!activePolygon) {
        console.log('Нет активного полигона');
        return;
    }

    const activePolygonID = activePolygon.getAttribute('clientID'); // Получаем ID активного полигона

    if (visibilityFilterActive) {
        // Восстанавливаем видимость всех объектов
        hiddenPolygons.forEach(item => {
            const eyeButton = item.querySelector('[aria-label="eye-invisible"]');
            if (eyeButton) {
                eyeButton.click(); // Восстанавливаем видимость объектов
            }
        });
        hiddenPolygons = []; // Очищаем массив после восстановления
        console.log('Все полигоны снова видны');
    } else {
        // Скрываем все объекты, кроме активного
        items.forEach(item => {
            const idElement = item.querySelector('.ant-typography:first-child'); // Получаем первый span с ID
            const eyeButton = item.querySelector('[aria-label="eye"], [aria-label="eye-invisible"]');
            if (!idElement || !eyeButton) return;

            const objectID = idElement.textContent.trim(); // Получаем ID объекта

            if (objectID !== activePolygonID && eyeButton.getAttribute('aria-label') === 'eye') {
                hiddenPolygons.push(item); // Сохраняем скрытые объекты в массив
                eyeButton.click(); // Скрываем объекты, кроме активного
            }
        });
        console.log('Все неактивные полигоны скрыты');
    }

    // Переключаем флаг видимости
    visibilityFilterActive = !visibilityFilterActive;
}


/*--------------------------------------------
  Логика подгонки полигона
--------------------------------------------*/
window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyA') {
        adjustPolygonToLowerPolygon();
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'KeyA') {
        moveRandomPointWithSimulation();
    }
});

function projectPointOnLine(point, linePoint1, linePoint2) {
    let dx = linePoint2[0] - linePoint1[0];
    let dy = linePoint2[1] - linePoint1[1];
    let t = ((point[0] - linePoint1[0]) * dx + (point[1] - linePoint1[1]) * dy) / (dx * dx + dy * dy);
    let projectedPoint = [linePoint1[0] + t * dx, linePoint1[1] + t * dy];
    return projectedPoint;
}

function distance(point1, point2) {
    let dx = point2[0] - point1[0];
    let dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function pointOnSegment(point, segmentPoint1, segmentPoint2) {
    return Math.min(segmentPoint1[0], segmentPoint2[0]) <= point[0] && point[0] <= Math.max(segmentPoint1[0], segmentPoint2[0]) &&
        Math.min(segmentPoint1[1], segmentPoint2[1]) <= point[1] && point[1] <= Math.max(segmentPoint1[1], segmentPoint2[1]);
}

function simulateUserInteraction(element, startX, startY, endX, endY) {
    let mouseDownEvent = new MouseEvent('mousedown', { clientX: startX, clientY: startY, bubbles: true });
    let mouseMoveEvent = new MouseEvent('mousemove', { clientX: endX, clientY: endY, bubbles: true });
    let mouseUpEvent = new MouseEvent('mouseup', { clientX: endX, clientY: endY, bubbles: true });

    requestAnimationFrame(() => {
        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseMoveEvent);
        element.dispatchEvent(mouseUpEvent);
    });
}

function adjustPolygonToLowerPolygon() {
    let activeElement = document.querySelector('.cvat_canvas_shape_activated');
    if (activeElement !== null) {
        let polygon2 = SVG.adopt(document.querySelector(`#${activeElement.id}`));
        let polygons = document.querySelectorAll('polygon');

        let polygon1;
        polygons.forEach((polygon, index) => {
            let points = polygon.getAttribute('points').split(' ').map(pair => pair.split(',').map(Number));
            if (points.length > 20) {
                let poliId = polygon.getAttribute('id');
                polygon1 = SVG.adopt(document.querySelector(`#${poliId}`));
            }
        });

        if (polygon1 !== undefined) {
            // Получаем точки каждого полигона
            let polygon1Points = polygon1.array().value;
            let polygon2Points = polygon2.array().value;
            let tolerance = 30;
            let offset = 2;  // Зазор в пикселях

            // Новый массив для хранения обновленных точек polygon2
            let newPolygon2Points = [];

            for (let point2 of polygon2Points) {
                let minDist = Infinity;
                let closestSegment = null;
                let projectedPointOnClosestSegment = null;

                for (let i = 0; i < polygon1Points.length; i++) {
                    let point1a = polygon1Points[i];
                    let point1b = polygon1Points[(i + 1) % polygon1Points.length];  // Предполагаем, что полигон замкнут
                    let projectedPoint = projectPointOnLine(point2, point1a, point1b);

                    if (!pointOnSegment(projectedPoint, point1a, point1b)) {
                        continue;
                    }

                    let dist = distance(point2, projectedPoint);
                    if (dist < minDist) {
                        minDist = dist;
                        closestSegment = [point1a, point1b];
                        projectedPointOnClosestSegment = projectedPoint;
                    }
                }

                if (closestSegment === null || minDist > tolerance) {
                    newPolygon2Points.push(point2);  // Если подходящий сегмент не найден, сохраняем текущие координаты
                } else {
                    // Вычисляем нормаль к сегменту
                    let normal = [
                        -(closestSegment[1][1] - closestSegment[0][1]),  // -dy
                        closestSegment[1][0] - closestSegment[0][0]     // dx
                    ];
                    // Нормализуем нормаль
                    let normalLength = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
                    normal[0] /= normalLength;
                    normal[1] /= normalLength;

                    // Смещаем точку проекции вдоль нормали на offset пикселей
                    projectedPointOnClosestSegment[0] += normal[0] * offset;
                    projectedPointOnClosestSegment[1] += normal[1] * offset;

                    newPolygon2Points.push(projectedPointOnClosestSegment);  // Сохраняем смещенную точку
                }
            }

            // Обновляем точки для использования с plot
            polygon2.plot(newPolygon2Points);
            console.log('Полигоны подогнаны друг под друга с зазором.');
        }
    }
}













/*--------------------------------------------
  Инициализация
--------------------------------------------*/
// Подключение SVG.js
if (typeof SVG === 'undefined') {
    const svgScript = document.createElement('script');
    svgScript.src = 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js';
    document.head.appendChild(svgScript);
    svgScript.onload = initialize;
} else {
    initialize();
}

function initialize() {
    createCursorCircle();  // Инициализируем круг
    handleZoom();          // Настраиваем масштабирование
    setupRadiusSlider();   // Настраиваем ползунок
    toggleCircleVisibility();  // Настраиваем логику для показа и скрытия круга
}

/*--------------------------------------------
  Предотвращение снятия выделения, кроме правого клика
--------------------------------------------*/
document.addEventListener('mousedown', function(event) {
    const canvasWrapper = document.getElementById('cvat_canvas_wrapper');

    // Если клик не внутри cvat_canvas_wrapper или нет активного полигона, выходим
    if (!canvasWrapper.contains(event.target) || !document.querySelector('polygon.cvat_canvas_shape_activated')) {
        return;
    }

    // Если это правая кнопка мыши, разрешаем её использование и выходим
    if (event.button === 2) {
        return;
    }

    // Если клик средней кнопкой мыши, выходим
    if (event.button === 1) {
        return;
    }

    // Разрешаем клики на кнопки с ID "button-rotate" и "button-scale"
    if (event.target.id === 'button-rotate' || event.target.id === 'button-scale') {
        return;
    }

    // Если клик не на полигоне или его точке, предотвращаем деактивацию
    if (event.target.tagName !== 'polygon' && !event.target.classList.contains('svg_select_points_point')) {
        event.preventDefault();
        event.stopPropagation();

        // Восстанавливаем выделение полигона
        const activePolygon = document.querySelector('polygon.cvat_canvas_shape_activated');
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: event.clientX, clientY: event.clientY });
        const mouseupEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: event.clientX, clientY: event.clientY });

        activePolygon.dispatchEvent(mousedownEvent);
        activePolygon.dispatchEvent(mouseupEvent);
    }
}, true);


/*--------------------------------------------
  Определение загрузки страницы и активация режима "Hand"
--------------------------------------------*/
function initSpinnerObserver() {
    const targetNode = document.querySelector('main');

    if (!targetNode) {
        setTimeout(initSpinnerObserver, 500); // Повторяем попытку через 1 секунду, если элемент не найден
        return;
    }

    const observer = new MutationObserver(() => {
        const spinnerVisible = document.querySelector('.ant-spin.ant-spin-spinning');

        if (!spinnerVisible) {
            console.log('Spinner is hidden - Page loaded');
            switchMode("Hand");  // Устанавливаем Hand режим как дефолтный после загрузки страницы
            observeSliderChanges();
            trackRealTimeIntersections();
            updatePolygonColorBasedOnCheckbox();
            toggleIntersectionTool();
            observer.disconnect();  // Отключаем наблюдатель, так как страница полностью загружена
        } else {
            console.log('Spinner is visible');
        }
    });

    // Начинаем наблюдение
    observer.observe(targetNode, { childList: true, subtree: true });

    // Проверяем спиннер при инициализации
    console.log(document.querySelector('.ant-spin.ant-spin-spinning') ? 'Spinner is visible' : 'Spinner is hidden');
}
initSpinnerObserver();


/*--------------------------------------------
  Блокировка действий при двойном клике левой кнопкой мыши
--------------------------------------------*/
    document.addEventListener('dblclick', function(event) {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);


/*--------------------------------------------
  Отключение контекстного меню при нажатии правой кнопки мыши
--------------------------------------------*/
document.addEventListener('contextmenu', function(event) {
    // Проверяем, был ли инструмент активирован (проверяем наличие класса)
    const isShapeDrawingToolActive = event.target.classList.contains('cvat_canvas_shape_drawing') ||
                                     event.target.closest('.cvat_canvas_shape_drawing');

    // Если активен инструмент для добавления точек (полилиния), контекстное меню не блокируем
    if (!isShapeDrawingToolActive) {
        event.preventDefault();  // Блокируем контекстное меню в других случаях
        event.stopPropagation(); // Останавливаем дальнейшую обработку
    }
}, true);



})();