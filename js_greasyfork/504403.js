// ==UserScript==
// @name         CVAT AI Helper
// @namespace    http://tampermonkey.net/
// @version      v1.25
// @description  A tool to help edite polygon on CVAT.AI
// @author       Nikitin
// @match        https://app.cvat.ai/tasks/*/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cvat.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504403/CVAT%20AI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/504403/CVAT%20AI%20Helper.meta.js
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

    let baseRadius = 30;
    let circleVisible = true;
    let isAltPressed = false;
    let isCtrlPressed = false;
    let isShiftPressed = false;
    let isRightClickPressed = false;

    // Вставляем CSS стили через блок style
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400&display=swap');

    #custom-circle {
        border: 2px solid rgba(255,0,0,0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        display: none;
    }

    #radius-control {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 16px;
        border-radius: 12px;
        color: white;
        z-index: 10001;
        font-family: 'Roboto Condensed', sans-serif;
        text-transform: uppercase;
        font-size: 12px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
    }

    .first-column {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 190px;
    }

    .button {
        background-color: white;
        border: 2px solid #DEE2E6;
        font-size: 12px;
        text-transform: uppercase;
        box-shadow: 0 4px 0 #DEE2E6;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 5px;
        cursor: pointer;
        text-align: center;
        border-radius: 6px;
        color: #3F444A;
    }

    .button.alt, .button.ctrl, .button.shift {
        height: 24px;
        width: 60px;
    }

    .button.left-click, .button.right-click {
        display: flex;
        justify-content: start;
        padding-left: 10px;
        height: 24px;
        width: 110px;
    }

    .instructions {
        font-size: 12px;
        display: flex;
        align-items: center;
    }

    .instructions .plus {
        font-size: 16px;
        margin: 0 5px;
    }

    .instructions-text {
        margin-left: 15px;
    }

    .button-icon {
        margin-right: 4px;
        vertical-align: middle;
    }

    #numpad-control {
        position: absolute;
        bottom: 20px;
        left: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 16px;
        border-radius: 12px;
        color: white;
        z-index: 10001;
        font-family: 'Roboto Condensed', sans-serif;
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Сетка из 3 колонок */
        gap: 10px; /* Отступы между строками и колонками одинаковые */
    }

    .numpad-button {
        background-color: white;
        border: 2px solid #DEE2E6;
        font-size: 12px;
        text-transform: uppercase;
        box-shadow: 0 4px 0 #DEE2E6;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        border-radius: 6px;
        color: #3F444A;
        cursor: pointer;
        width: 100%; /* Кнопки занимают всю ширину ячейки грида */
    }

    .numpad-button.numpad-zero {
        grid-column: span 3; /* Кнопка NUM 0 на всю ширину трех колонок */
    }

    .numpad-icon {
        margin-right: 4px;
        vertical-align: middle;
    }

    .active {
        background-color: #8FEA98;
        border-color: #72C67B;
        box-shadow: 0 4px 0 #72C67B;
        color: #344235;
    }

    .selected {
        stroke: red;
        stroke-width: 2px;
    }
`;
    document.head.appendChild(style);

    // Иконки
    const leftClickIcon = `
    <svg class="button-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m11.1553 3.19043 1.2542-.00018v7.06155l-5.94652.0464-.13925-3.15908.46447-1.81183 1.02188-1.25435 1.34747-.74332 1.99775-.13919Z" fill="#3F444A"/><path d="M6.40771 7.09863c0-1.06086.42143-2.07828 1.17158-2.82842.75014-.75015 1.76756-1.17158 2.82841-1.17158h4c1.0609 0 2.0783.42143 2.8284 1.17158.7502.75014 1.1716 1.76756 1.1716 2.82842v9.99997c0 1.0609-.4214 2.0783-1.1716 2.8285-.7501.7501-1.7675 1.1715-2.8284 1.1715h-4c-1.06085 0-2.07827-.4214-2.82841-1.1715-.75015-.7502-1.17158-1.7676-1.17158-2.8285V7.09863ZM12.4077 3.09863v6.99997M6.40771 10.0986H18.4077" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    const rightClickIcon = `
    <svg class="button-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m13.4238 3.19043-1.2542-.00018v7.06155l5.9465.0464.1393-3.15908-.4645-1.81183-1.0219-1.25435-1.3474-.74332-1.9978-.13919Z" fill="#3F444A"/><path d="M6.16943 7.09863c0-1.06086.42143-2.07828 1.17158-2.82842.75014-.75015 1.76756-1.17158 2.82839-1.17158h4c1.0609 0 2.0783.42143 2.8285 1.17158.7501.75014 1.1715 1.76756 1.1715 2.82842v9.99997c0 1.0609-.4214 2.0783-1.1715 2.8285-.7502.7501-1.7676 1.1715-2.8285 1.1715h-4c-1.06083 0-2.07825-.4214-2.82839-1.1715-.75015-.7502-1.17158-1.7676-1.17158-2.8285V7.09863ZM12.1694 3.09863v6.99997M6.16943 10.0986H18.1694" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    const numpadIcon1 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.7751 15.4903c.394-.9783.5914-2.0247.581-3.0793-.0105-1.0547-.2285-2.0969-.6417-3.0673-.4133-.97037-1.0136-1.84985-1.7667-2.58822-.7531-.73838-1.6443-1.32119-2.6226-1.71515-1.9759-.79565-4.1869-.7738-6.14663.06073-1.95975.83454-3.50772 2.41341-4.30337 4.38927m4.45 0h-5v-5M17.165 18.8604h-.01M4.38525 13.4902h-.01M5.95508 17.3301h-.01M9.2251 19.8604h-.01M13.3252 20.4302h-.01" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon2 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m14.4639 7.49023 3 2.99997 3-2.99996M14.4639 17.4902l3-3 3 3M8.46387 4.49023c.53043 0 1.03914.21072 1.41421.58579.37512.37507.58582.88378.58582 1.41421V18.4902c0 .5305-.2107 1.0392-.58582 1.4142-.37507.3751-.88378.5858-1.41421.5858h-2c-.53044 0-1.03914-.2107-1.41422-.5858-.37507-.375-.58578-.8837-.58578-1.4142V6.49023c0-.53043.21071-1.03914.58578-1.41421.37508-.37507.88378-.58579 1.41422-.58579h2ZM17.4639 3.49023v6.99997M17.4639 14.4902v7" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon3 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.07939 15.4903c-.39396-.9783-.59137-2.0247-.58095-3.0793.01042-1.0547.22846-2.0969.64169-3.0673.41322-.97037 1.01352-1.84985 1.76663-2.58822.75311-.73838 1.64428-1.32118 2.62263-1.71515 1.97591-.79565 4.18691-.7738 6.14661.06073 1.9598.83454 3.5077 2.41341 4.3034 4.38927m-4.45 0h5v-5M7.68945 18.8604h.01M20.4692 13.4902h.01M18.8994 17.3301h.01M15.6294 19.8604h.01M11.5293 20.4302h.01" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon4 = `<svg class="numpad-icon" width="25" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m6.38965 3.99023-3 3 3 3M18.3896 3.99023l3 3-3 3M4.38965 15.9902c0-.5304.21071-1.0391.58578-1.4142.37508-.3751.88379-.5858 1.41422-.5858H18.3896c.5305 0 1.0392.2107 1.4143.5858.375.3751.5857.8838.5857 1.4142v2c0 .5305-.2107 1.0392-.5857 1.4142-.3751.3751-.8838.5858-1.4143.5858H6.38965c-.53043 0-1.03914-.2107-1.41422-.5858-.37507-.375-.58578-.8837-.58578-1.4142v-2ZM10.3896 6.99023H3.38965M21.3896 6.99023h-7" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon5 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5293 5.49023c0 .53044.2107 1.03915.5858 1.41422s.8838.58578 1.4142.58578c.5304 0 1.0391-.21071 1.4142-.58578.3751-.37507.5858-.88378.5858-1.41422 0-.53043-.2107-1.03914-.5858-1.41421s-.8838-.58579-1.4142-.58579c-.5304 0-1.0391.21072-1.4142.58579s-.5858.88378-.5858 1.41421ZM17.5293 8.49023c0 .53044.2107 1.03914.5858 1.41422.3751.37505.8838.58575 1.4142.58575.5304 0 1.0391-.2107 1.4142-.58575.3751-.37508.5858-.88378.5858-1.41422 0-.53043-.2107-1.03914-.5858-1.41421s-.8838-.58579-1.4142-.58579c-.5304 0-1.0391.21072-1.4142.58579s-.5858.88378-.5858 1.41421ZM3.5293 11.4902c0 .5305.21071 1.0392.58578 1.4142.37508.3751.88378.5858 1.41422.5858.53043 0 1.03914-.2107 1.41421-.5858.37507-.375.58579-.8837.58579-1.4142 0-.5304-.21072-1.0391-.58579-1.4142-.37507-.37505-.88378-.58577-1.41421-.58577-.53044 0-1.03914.21072-1.41422.58577-.37507.3751-.58578.8838-.58578 1.4142ZM13.5293 19.4902c0 .5305.2107 1.0392.5858 1.4142.3751.3751.8838.5858 1.4142.5858.5304 0 1.0391-.2107 1.4142-.5858.3751-.375.5858-.8837.5858-1.4142 0-.5304-.2107-1.0391-.5858-1.4142s-.8838-.5858-1.4142-.5858c-.5304 0-1.0391.2107-1.4142.5858s-.5858.8838-.5858 1.4142ZM7.0293 9.99023l3.5-3M14.5293 5.99023l3 1.5M19.0293 10.4902l-2.5 7M14.0293 17.9902l-7-5" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon6 = `<svg class="numpad-icon" width="25" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m7.46387 9.99023 3.00003-3-3.00003-3M17.4639 9.99023l-3-3 3-3M4.46387 15.9902c0-.5304.21071-1.0391.58578-1.4142.37508-.3751.88378-.5858 1.41422-.5858H18.4639c.5304 0 1.0391.2107 1.4142.5858s.5858.8838.5858 1.4142v2c0 .5305-.2107 1.0392-.5858 1.4142-.3751.3751-.8838.5858-1.4142.5858H6.46387c-.53044 0-1.03914-.2107-1.41422-.5858-.37507-.375-.58578-.8837-.58578-1.4142v-2ZM3.46387 6.99023h7.00003M14.4639 6.99023h7" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon7 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.8252 4.49023h-4v4M10.8252 10.4902l-6-5.99997M16.8252 20.4902h4v-4M20.8252 20.4902l-6-6" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon8 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m20.3896 6.49023-3-3-3 3M20.3896 18.4902l-3 3-3-3M8.38965 4.49023c.53043 0 1.03914.21072 1.41421.58579.37504.37507.58574.88378.58574 1.41421V18.4902c0 .5305-.2107 1.0392-.58574 1.4142-.37507.3751-.88378.5858-1.41421.5858h-2c-.53044 0-1.03914-.2107-1.41422-.5858-.37507-.375-.58578-.8837-.58578-1.4142V6.49023c0-.53043.21071-1.03914.58579-1.41421.37507-.37507.88378-.58579 1.41421-.58579h2ZM17.3896 10.4902V3.49023M17.3896 21.4902v-7" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon9 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5137 4.49023h4v4M14.5137 10.4902l6-5.99997M8.51367 20.4902h-4v-4M4.51367 20.4902l6.00003-6" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numpadIcon0 = `<svg class="numpad-icon" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0293 3.49023V21.4902M16.0293 7.49023v9.99997h5l-5-9.99997ZM8.0293 7.49023v9.99997h-5l5-9.99997Z" stroke="#3F444A" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // Создаем элемент круга
    const circle = document.createElement('div');
    circle.id = 'custom-circle';
    document.body.appendChild(circle);

    // Создаем плавающий блок с параметрами
    const radiusControl = document.createElement('div');
    radiusControl.id = 'radius-control';
    radiusControl.innerHTML = `
    <!-- Первая колонка -->
    <div class="first-column">
        <label>Радиус: <span id="radius-value">${baseRadius}</span>px</label>
        <input type="range" id="radius-slider" min="10" max="100" value="${baseRadius}">
        <label><input type="checkbox" id="toggle-circle" checked> Показывать круг</label>
        <label><input type="checkbox" id="toggle-numpad" checked> Показать NUMPAD</label>
    </div>
    <!-- Вторая колонка с кнопками -->
    <div class="second-column">
        <div class="instructions">
            <div class="button ctrl" id="ctrl-button">CTRL</div>
            <div class="plus">+</div>
            <div class="button left-click" id="left-click-button-1">${leftClickIcon}LEFT CLICK</div>
            <div class="instructions-text">Рассталкивание точек (рука)</div>
        </div>
        <div class="instructions">
            <div class="button alt" id="alt-button">ALT</div>
            <div class="plus">+</div>
            <div class="button left-click" id="left-click-button-2">${leftClickIcon}LEFT CLICK</div>
            <div class="instructions-text">Притягивание точек (рука)</div>
        </div>
        <div class="instructions">
            <div class="button alt" id="alt-button-2">ALT</div>
            <div class="plus">+</div>
            <div class="button right-click" id="right-click-button">${rightClickIcon}RIGHT CLICK</div>
            <div class="instructions-text">Изменить радиус круга</div>
        </div>
        <div class="instructions">
            <div class="button shift" id="shift-button">SHIFT</div>
            <div class="plus">+</div>
            <div class="button right-click" id="right-click-button-2">${leftClickIcon}RIGHT CLICK</div>
            <div class="instructions-text">Схватить точку полигона</div>
        </div>
    </div>
`;
    document.body.appendChild(radiusControl);

    // Создаем новый блок для NUMPAD
    const numpadControl = document.createElement('div');
    numpadControl.id = 'numpad-control';
    numpadControl.innerHTML = `
    <div class="numpad-button" id="numpad-7" title="Наклон полигона влево">${numpadIcon7}NUM 7</div>
    <div class="numpad-button" id="numpad-8" title="Растягивание по вертикали">${numpadIcon8}NUM 8</div>
    <div class="numpad-button" id="numpad-9" title="Наклон полигона вправо">${numpadIcon9}NUM 9</div>
    <div class="numpad-button" id="numpad-4" title="Растягивание по горизонтали">${numpadIcon4}NUM 4</div>
    <div class="numpad-button" id="numpad-5" title="Распределить точки по силуэту руки">${numpadIcon5}NUM 5</div>
    <div class="numpad-button" id="numpad-6" title="Сжатие по горизонтали">${numpadIcon6}NUM 6</div>
    <div class="numpad-button" id="numpad-1" title="Поворот против часовой стрелки">${numpadIcon1}NUM 1</div>
    <div class="numpad-button" id="numpad-2" title="Сжатие по вертикали">${numpadIcon2}NUM 2</div>
    <div class="numpad-button" id="numpad-3" title="Поворот по часовой стрелки">${numpadIcon3}NUM 3</div>
    <div class="numpad-button numpad-zero" id="numpad-0" title="Перемещение 0">${numpadIcon0}NUM 0</div>
`;
    document.body.appendChild(numpadControl);

    // Обработчик для показа/скрытия подсказок NUMPAD
    if (document.getElementById('toggle-numpad').checked) {
        numpadControl.style.display = 'grid';
    } else {
        numpadControl.style.display = 'none';
    }

    // Добавляем обработчик для изменения видимости NUMPAD
    document.getElementById('toggle-numpad').addEventListener('change', function(event) {
        numpadControl.style.display = event.target.checked ? 'grid' : 'none';
    });


    // Обработчик изменения состояния кнопок
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = true;
            document.getElementById('alt-button').classList.add('active');
            document.getElementById('alt-button-2').classList.add('active'); // Для второй кнопки ALT
        }
        if (event.key === 'Control') {
            isCtrlPressed = true;
            document.getElementById('ctrl-button').classList.add('active');
        }
        if (event.key === 'Shift') {
            document.getElementById('shift-button').classList.add('active'); // Подсветка кнопки SHIFT
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = false;
            document.getElementById('alt-button').classList.remove('active');
            document.getElementById('alt-button-2').classList.remove('active'); // Снятие стиля для второй кнопки ALT
        }
        if (event.key === 'Control') {
            isCtrlPressed = false;
            document.getElementById('ctrl-button').classList.remove('active');
        }
        if (event.key === 'Shift') {
            document.getElementById('shift-button').classList.remove('active'); // Снятие стиля для кнопки SHIFT
            document.getElementById('right-click-button-2').classList.remove('active'); // Снятие стиля для SHIFT + RIGHT CLICK
        }
    });

    // Обработчик для нажатия и отпускания кнопки мыши с использованием event.shiftKey и capture phase
    document.addEventListener('mousedown', function(event) {
        console.log('Mousedown event:', event.button, 'Shift pressed:', event.shiftKey);
        if (event.button === 0 && isCtrlPressed) {
            document.getElementById('left-click-button-1').classList.add('active'); // Эффект нажатия для первой LEFT CLICK
        } else if (event.button === 0 && isAltPressed) {
            document.getElementById('left-click-button-2').classList.add('active'); // Эффект нажатия для второй LEFT CLICK
        } else if (event.button === 2 && event.shiftKey) {  // Используем event.shiftKey для SHIFT + RIGHT CLICK
            event.preventDefault(); // Отключаем дефолтное действие Shift + Right Click
            document.getElementById('right-click-button-2').classList.add('active'); // Эффект нажатия для SHIFT + RIGHT CLICK
        } else if (event.button === 2 && isAltPressed) {
            document.getElementById('right-click-button').classList.add('active'); // Эффект нажатия для RIGHT CLICK
        }
    }, true);  // Используем capture phase

    document.addEventListener('mouseup', function(event) {
        console.log('Mouseup event:', event.button);
        if (event.button === 0) {
            document.getElementById('left-click-button-1').classList.remove('active'); // Возврат к обычному состоянию для первой LEFT CLICK
            document.getElementById('left-click-button-2').classList.remove('active'); // Возврат к обычному состоянию для второй LEFT CLICK
        }
        if (event.button === 2) {
            document.getElementById('right-click-button').classList.remove('active'); // Возврат к обычному состоянию для RIGHT CLICK
            document.getElementById('right-click-button-2').classList.remove('active');   // Возврат к обычному состоянию для SHIFT + RIGHT CLICK
        }
    }, true);  // Используем capture phase



    // Обработчики нажатий для NUMPAD кнопок
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad1') {
            document.getElementById('numpad-1').classList.add('active');
        }
        if (event.code === 'Numpad2') {
            document.getElementById('numpad-2').classList.add('active');
        }
        if (event.code === 'Numpad3') {
            document.getElementById('numpad-3').classList.add('active');
        }
        if (event.code === 'Numpad4') {
            document.getElementById('numpad-4').classList.add('active');
        }
        if (event.code === 'Numpad5') {
            document.getElementById('numpad-5').classList.add('active');
        }
        if (event.code === 'Numpad6') {
            document.getElementById('numpad-6').classList.add('active');
        }
        if (event.code === 'Numpad7') {
            document.getElementById('numpad-7').classList.add('active');
        }
        if (event.code === 'Numpad8') {
            document.getElementById('numpad-8').classList.add('active');
        }
        if (event.code === 'Numpad9') {
            document.getElementById('numpad-9').classList.add('active');
        }
        if (event.code === 'Numpad0') {
            document.getElementById('numpad-0').classList.add('active');
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.code === 'Numpad1') {
            document.getElementById('numpad-1').classList.remove('active');
        }
        if (event.code === 'Numpad2') {
            document.getElementById('numpad-2').classList.remove('active');
        }
        if (event.code === 'Numpad3') {
            document.getElementById('numpad-3').classList.remove('active');
        }
        if (event.code === 'Numpad4') {
            document.getElementById('numpad-4').classList.remove('active');
        }
        if (event.code === 'Numpad5') {
            document.getElementById('numpad-5').classList.remove('active');
        }
        if (event.code === 'Numpad6') {
            document.getElementById('numpad-6').classList.remove('active');
        }
        if (event.code === 'Numpad7') {
            document.getElementById('numpad-7').classList.remove('active');
        }
        if (event.code === 'Numpad8') {
            document.getElementById('numpad-8').classList.remove('active');
        }
        if (event.code === 'Numpad9') {
            document.getElementById('numpad-9').classList.remove('active');
        }
        if (event.code === 'Numpad0') {
            document.getElementById('numpad-0').classList.remove('active');
        }
    });

    // Функция обновления радиуса круга с учетом масштаба
    function updateCircleRadius(scale) {
        const scaledRadius = baseRadius * scale;
        circle.style.width = `${scaledRadius * 2}px`;
        circle.style.height = `${scaledRadius * 2}px`;
    }

    // Функция получения текущего масштаба
    function getCurrentScale() {
        const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
        let style = window.getComputedStyle(canvasAttachmentBoard, null);
        let transformMatrix = new WebKitCSSMatrix(style.webkitTransform);
        return transformMatrix.a || transformMatrix.m11;
    }

    // Функция обновления позиции круга
    function updateCirclePosition(event) {
        circle.style.left = `${event.clientX - circle.offsetWidth / 2}px`;
        circle.style.top = `${event.clientY - circle.offsetHeight / 2}px`;
    }

    // Обновляем круг при движении мыши
    document.addEventListener('mousemove', function(event) {
        updateCirclePosition(event);

        if (circleVisible) {
            circle.style.display = 'block';
        } else {
            circle.style.display = 'none';
        }

        // Если нажата комбинация Alt + Right Click, изменяем радиус
        if (isAltPressed && isRightClickPressed) {
            const deltaX = event.movementX;

            baseRadius = Math.max(10, Math.min(100, baseRadius + deltaX / 2));

            document.getElementById('radius-slider').value = Math.round(baseRadius);
            document.getElementById('radius-value').textContent = Math.round(baseRadius);

            const scale = getCurrentScale();
            updateCircleRadius(scale);
        }
    });

    // Обновляем круг при прокрутке (zoom)
    document.addEventListener('wheel', function() {
        const scale = getCurrentScale();
        updateCircleRadius(scale);
    });

    // Обрабатываем нажатие клавиш и мыши для рассталкивания и притягивания точек
    document.addEventListener('mousedown', function(event) {
        if (isCtrlPressed && event.button === 0) {
            triggerRepulsion(event.clientX, event.clientY);
        } else if (isAltPressed && event.button === 0) {
            triggerAttraction(event.clientX, event.clientY);
        } else if (isAltPressed && event.button === 2) {
            isRightClickPressed = true;
            event.preventDefault();
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            isRightClickPressed = false;
        }
    });

    // Блокировка действий при двойном клике левой кнопкой мыши
    document.addEventListener('dblclick', function(event) {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = true;
        }
        if (event.key === 'Control') {
            isCtrlPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Alt') {
            isAltPressed = false;
        }
        if (event.key === 'Control') {
            isCtrlPressed = false;
        }
    });

    // Обработчик изменения радиуса через ползунок
    document.getElementById('radius-slider').addEventListener('input', function(event) {
        baseRadius = parseInt(event.target.value, 10);
        document.getElementById('radius-value').textContent = baseRadius;

        const scale = getCurrentScale();
        updateCircleRadius(scale);
    });

    // Обработчик для показа/скрытия круга
    document.getElementById('toggle-circle').addEventListener('change', function(event) {
        circleVisible = event.target.checked;
        circle.style.display = circleVisible ? 'block' : 'none';
    });

    // Функция рассталкивания точек
    function triggerRepulsion(clientX, clientY) {
        const scale = getCurrentScale();
        updateCircleRadius(scale);

        const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
        let style = window.getComputedStyle(canvasAttachmentBoard, null);
        let transformMatrix = new WebKitCSSMatrix(style.webkitTransform);

        let rect = canvasAttachmentBoard.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        let offsetY = clientY - rect.top;

        let trueX = (offsetX - transformMatrix.e || transformMatrix.m41) / scale;
        let trueY = (offsetY - transformMatrix.f || transformMatrix.m42) / scale;

        let polygons = document.querySelectorAll('polygon');
        let polygon1;
        polygons.forEach((polygon) => {
            let points = polygon.getAttribute('points').split(' ').map(pair => pair.split(',').map(Number));
            if (points.length > 20) {
                let poliId = polygon.getAttribute('id');
                polygon1 = SVG.adopt(document.querySelector(`#${poliId}`));
            }
        });

        if (polygon1) {
            let polygon1Points = polygon1.array().value;
            let operation = '+';

            polygon1Points.forEach((point, index) => {
                let distance = Math.sqrt(Math.pow(point[0] - trueX, 2) + Math.pow(point[1] - trueY, 2));
                if (distance <= baseRadius) {
                    let directionX = (point[0] - trueX) / distance;
                    let directionY = (point[1] - trueY) / distance;
                    polygon1Points[index][0] = eval(`polygon1Points[index][0] ${operation} directionX * 2`);
                    polygon1Points[index][1] = eval(`polygon1Points[index][1] ${operation} directionY * 2`);
                }
            });

            polygon1.plot(polygon1Points);
        }
    }

    // Функция притягивания точек
    function triggerAttraction(clientX, clientY) {
        const scale = getCurrentScale();
        updateCircleRadius(scale);

        const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
        let style = window.getComputedStyle(canvasAttachmentBoard, null);
        let transformMatrix = new WebKitCSSMatrix(style.webkitTransform);

        let rect = canvasAttachmentBoard.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        let offsetY = clientY - rect.top;

        let trueX = (offsetX - transformMatrix.e || transformMatrix.m41) / scale;
        let trueY = (offsetY - transformMatrix.f || transformMatrix.m42) / scale;

        let polygons = document.querySelectorAll('polygon');
        let polygon1;
        polygons.forEach((polygon) => {
            let points = polygon.getAttribute('points').split(' ').map(pair => pair.split(',').map(Number));
            if (points.length > 20) {
                let poliId = polygon.getAttribute('id');
                polygon1 = SVG.adopt(document.querySelector(`#${poliId}`));
            }
        });

        if (polygon1) {
            let polygon1Points = polygon1.array().value;
            let operation = '-';

            polygon1Points.forEach((point, index) => {
                let distance = Math.sqrt(Math.pow(point[0] - trueX, 2) + Math.pow(point[1] - trueY, 2));
                if (distance <= baseRadius) {
                    let directionX = (point[0] - trueX) / distance;
                    let directionY = (point[1] - trueY) / distance;
                    polygon1Points[index][0] = eval(`polygon1Points[index][0] ${operation} directionX * 2`);
                    polygon1Points[index][1] = eval(`polygon1Points[index][1] ${operation} directionY * 2`);
                }
            });

            polygon1.plot(polygon1Points);
        }
    }






    let isDragging = false;
    let dragStartX, dragStartY;

    // Блокировка действия PAN при Shift + Left Click
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2 && event.shiftKey) {  // Shift + Left Click
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    // Обработчик для начала перемещения точек при Shift + Click
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2 && event.shiftKey) {  // Shift + Left Click
            isDragging = true;
            dragStartX = event.clientX;
            dragStartY = event.clientY;
            event.preventDefault();  // Отменяем дефолтное действие PAN
            event.stopPropagation(); // Останавливаем дальнейшее распространение события
        }
    }, true);

    // Обработчик для перемещения точек при движении мыши
    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const scale = getCurrentScale();
            const dx = (event.clientX - dragStartX) / scale;
            const dy = (event.clientY - dragStartY) / scale;

            // Вычисляем текущий радиус круга с учетом масштаба
            const currentRadius = circle.offsetWidth / 2 / scale;

            // Получаем все полигоны на странице
            let polygons = document.querySelectorAll('polygon');

            polygons.forEach((polygon) => {
                let svgPolygon = SVG.adopt(polygon);
                let points = svgPolygon.array().value;

                if (points.length < 20) {  // Только полигоны с количеством точек меньше 20
                    points.forEach((point, index) => {
                        // Получаем текущие координаты курсора и учитываем масштаб
                        const canvasAttachmentBoard = document.getElementById('cvat_canvas_attachment_board');
                        let rect = canvasAttachmentBoard.getBoundingClientRect();
                        let offsetX = (event.clientX - rect.left) / scale;
                        let offsetY = (event.clientY - rect.top) / scale;

                        // Рассчитываем расстояние от точки до текущих координат курсора
                        let distance = Math.sqrt(Math.pow(point[0] - offsetX, 2) + Math.pow(point[1] - offsetY, 2));

                        // Проверяем, попадает ли точка в радиус действия (используем currentRadius)
                        if (distance <= currentRadius) {
                            // Смещаем точку в направлении движения курсора
                            points[index][0] += dx;
                            points[index][1] += dy;
                        }
                    });

                    svgPolygon.plot(points);
                }
            });

            // Обновляем начальные координаты для следующего движения
            dragStartX = event.clientX;
            dragStartY = event.clientY;

            event.preventDefault();  // Предотвращаем дефолтное действие
        }
    }, true);

    // Обработчик для завершения перемещения
    document.addEventListener('mouseup', function(event) {
        if (isDragging) {
            isDragging = false;
            event.preventDefault();  // Предотвращаем дефолтное действие
        }
    }, true);

    // Отключение контекстного меню при нажатии правой кнопки мыши на холсте
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        event.stopPropagation();
    }, true);


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

        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseMoveEvent);
        element.dispatchEvent(mouseUpEvent);
    }

    window.addEventListener('keydown', function (event) {
        if (["Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "Numpad5"].includes(event.code)) {
            let activeElement = document.querySelector('.cvat_canvas_shape_activated');
            if (activeElement !== null) {
                let polygon2 = SVG.adopt(document.querySelector(`#${activeElement.id}`));
                let box = polygon2.bbox();
                let points = polygon2.array().value;
                let tolerance = 30;

                let adjustPolygonVertical = function (point) {
                    if (point[1] <= box.cy) {
                        point[1] -= (event.code == "Numpad8" ? 3 : -3);
                    } else {
                        point[1] += (event.code == "Numpad8" ? 3 : -3);
                    }
                };

                let adjustPolygonHorizontal = function (point) {
                    if (point[0] <= box.cx) {
                        point[0] -= (event.code == "Numpad4" ? 3 : -3);
                    } else {
                        point[0] += (event.code == "Numpad4" ? 3 : -3);
                    }
                };

                let adjustPolygonTilt = function (point) {
                    if (point[1] <= box.cy) {
                        point[0] -= (event.code == "Numpad7" ? 3 : -3);
                    } else {
                        point[0] += (event.code == "Numpad7" ? 3 : -3);
                    }
                };

                let rotatePolygonClockwise = function (point) {
                    let angle = 4;
                    let x = point[0] - box.cx;
                    let y = point[1] - box.cy;
                    let rad = (Math.PI / 180) * angle;

                    let newX = x * Math.cos(rad) + y * Math.sin(rad);
                    let newY = -x * Math.sin(rad) + y * Math.cos(rad);

                    point[0] = newX + box.cx;
                    point[1] = newY + box.cy;
                };

                let rotatePolygonCounterClockwise = function (point) {
                    let angle = 4;
                    let x = point[0] - box.cx;
                    let y = point[1] - box.cy;
                    let rad = (Math.PI / 180) * angle;

                    let newX = x * Math.cos(rad) - y * Math.sin(rad);
                    let newY = x * Math.sin(rad) + y * Math.cos(rad);

                    point[0] = newX + box.cx;
                    point[1] = newY + box.cy;
                };

                let reflectPolygonHorizontal = function (point) {
                    point[1] = 2 * box.cy - point[1];
                };

                if (event.code == "Numpad8" || event.code == "Numpad2") {
                    points.forEach(adjustPolygonVertical);
                } else if (event.code == "Numpad4" || event.code == "Numpad6") {
                    points.forEach(adjustPolygonHorizontal);
                } else if (event.code == "Numpad7" || event.code == "Numpad9") {
                    points.forEach(adjustPolygonTilt);
                } else if (event.code == "Numpad0") {
                    points.forEach(reflectPolygonHorizontal);
                } else if (event.code == "Numpad1") {
                    points.forEach(point => rotatePolygonClockwise(point));
                } else if (event.code == "Numpad3") {
                    points.forEach(point => rotatePolygonCounterClockwise(point));
                } else if (event.code == "Numpad5") {
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

                        // Новый массив для хранения обновленных точек polygon2
                        let newPolygon2Points = [];

                        for (let point2 of polygon2Points) {
                            let minDist = Infinity;
                            let closestSegment = null;
                            let projectedPointOnClosestSegment = null;

                            for (let i = 0; i < polygon1Points.length; i++) {
                                let point1a = polygon1Points[i];
                                let point1b = polygon1Points[(i + 1) % polygon1Points.length];  // Assume the polygon is closed
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
                                newPolygon2Points.push(point2);  // No suitable segment found, or the required shift is too large. Keep the current coordinates.
                            } else {
                                newPolygon2Points.push(projectedPointOnClosestSegment);
                            }
                        }

                        // Обновляем points для использования с plot
                        points = newPolygon2Points;
                    }
                }

                polygon2.plot(points);
                let point = polygon2.point(0);  // Выбираем первую точку полигона
                let startPoint = { x: point.x, y: point.y };
                let endPoint = { x: point.x + 1, y: point.y + 1 };  // Смещаем точку на 1 пиксель по X и Y

                simulateUserInteraction(polygon2.node, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            }
        }
    });

})();