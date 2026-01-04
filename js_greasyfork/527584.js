// ==UserScript==
// @name         Multitool Supervisor
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Multitool for Supervisor
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*/Admin/MyCurrentTask/Active
// @match        *://*/Admin/PrefilterPictures*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527584/Multitool%20Supervisor.user.js
// @updateURL https://update.greasyfork.org/scripts/527584/Multitool%20Supervisor.meta.js
// ==/UserScript==

(function () {
function createModal() {
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
        return;
    }

    const modal = document.createElement('div');
    modal.classList.add('custom-modal');
    Object.assign(modal.style, {
        position: 'fixed',
        top: '25%',
        left: '15%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
        padding: '25px',
        width: 'auto',
        zIndex: '1000',
        fontFamily: 'Arial, sans-serif',
        color: '#333'
    });


    const checkboxContainer = document.createElement('div');
    Object.assign(checkboxContainer.style, {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '15px'
    });

    function createCheckbox(labelText, id, tooltipText) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8f9fa',
            padding: '8px 12px',
            borderRadius: '6px',
            position: 'relative'
        });

        container.addEventListener('mouseover', () => container.style.backgroundColor = '#e9ecef');
        container.addEventListener('mouseleave', () => container.style.backgroundColor = '#f8f9fa');

        const tooltip = document.createElement('span');
        tooltip.textContent = tooltipText;
        Object.assign(tooltip.style, {
            visibility: 'hidden',
width: '200px', // Условная ширина модального окна
    height: '100px', // Условная высота модального окна
            backgroundColor: '#333',
            color: '#fff',
            textAlign: 'center',
            padding: '5px',
            borderRadius: '5px',
            position: 'absolute',
            left: '100%',
            top: '50%',
          transform: 'translateY(-50%) translateX(10px)', // Сдвигаем немного вправо
            whiteSpace: 'nowrap',
            fontSize: '12px',
            zIndex: '10'
        });

//        const infoIcon = document.createElement('span');
 //       infoIcon.textContent = 'ℹ️';
  //      Object.assign(infoIcon.style, {
  //          cursor: 'pointer',
  //          fontSize: '14px'
  //      });

  //      infoIcon.addEventListener('click', (event) => {
   //         event.stopPropagation();
  //          tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
  //      });

  //      document.addEventListener('click', (event) => {
  //          if (!infoIcon.contains(event.target)) {
   //             tooltip.style.visibility = 'hidden';
  //          }
  //      });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = localStorage.getItem(id) === 'true';
        checkbox.addEventListener('change', () => localStorage.setItem(id, checkbox.checked));

        Object.assign(checkbox.style, {
            width: '16px',
            height: '16px',
            margin: '0'
        });

        const label = document.createElement('span');
        label.textContent = labelText;
        Object.assign(label.style, {
            fontSize: '14px',
            lineHeight: '1',
            paddingLeft: '5px'
        });

        container.appendChild(checkbox);
        container.appendChild(label);
   //     container.appendChild(infoIcon);
       modal.appendChild(tooltip);
        return container;
    }

    checkboxContainer.appendChild(createCheckbox('Кроп', 'addBorder', 'Обрезка изображения по границам.'));
    checkboxContainer.appendChild(createCheckbox('Закраска', 'addClonedImage', 'Заполнение области цветом.'));
    checkboxContainer.appendChild(createCheckbox('Разметка', 'cloneSvgElement', 'Добавление разметки.'));
    checkboxContainer.appendChild(createCheckbox('AuditLog', 'auditLog', 'Логирование действий.'));
    checkboxContainer.appendChild(createCheckbox('Тег', 'tag', 'Добавление тегов.'));
    checkboxContainer.appendChild(createCheckbox('Категория', 'category', 'Фильтрация по категориям.'));
    checkboxContainer.appendChild(createCheckbox('PrefilterComments', 'PrefilterComments', 'Фильтрация комментариев.'));
    checkboxContainer.appendChild(createCheckbox('PrefilterPictures', 'PrefilterPictures', 'Фильтрация изображений.'));
    checkboxContainer.appendChild(createCheckbox('FixSize', 'fixsize', 'FixSize'));

    modal.appendChild(checkboxContainer);

    const filterContainer = document.createElement('div');
    Object.assign(filterContainer.style, { marginBottom: '15px' });

    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Префильтр';
    Object.assign(filterLabel.style, {
        fontSize: '14px',
        display: 'block',
        marginBottom: '5px',
    });
    filterContainer.appendChild(filterLabel);

    const filterInput = document.createElement('input');
    Object.assign(filterInput.style, {
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        outline: 'none',
        transition: 'border-color 0.3s'
    });
    filterInput.type = 'number';
    filterInput.id = 'prefilter';
    filterInput.min = '1';
    filterInput.max = '40';
    filterInput.value = localStorage.getItem('prefilter') || '';

    filterInput.addEventListener('focus', () => filterInput.style.borderColor = '#007BFF');
    filterInput.addEventListener('blur', () => filterInput.style.borderColor = '#ccc');
    filterInput.addEventListener('input', () => localStorage.setItem('prefilter', filterInput.value));

    filterContainer.appendChild(filterInput);
    modal.appendChild(filterContainer);

function createColorPicker(labelText, id) {
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'inline-block',
        marginRight: '15px',
        textAlign: 'center' // Выравнивание текста и элемента
    });

    const label = document.createElement('label');
    label.textContent = labelText;
    Object.assign(label.style, {
        fontSize: '14px',
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333'
    });
    container.appendChild(label);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = id;
    colorInput.value = localStorage.getItem(id) || '#ffffff';
    colorInput.addEventListener('input', () => {
        localStorage.setItem(id, colorInput.value);
        applyBackgroundColors(); // Если нужно сразу обновлять фон
    });

    Object.assign(colorInput.style, {
        width: '40px',
        height: '40px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '5px',
        background: 'transparent',
        outline: 'none',
        transition: 'transform 0.2s ease',
    });

    colorInput.addEventListener('mouseenter', () => {
        colorInput.style.transform = 'scale(1.1)';
    });

    colorInput.addEventListener('mouseleave', () => {
        colorInput.style.transform = 'scale(1)';
    });

    container.appendChild(colorInput);
    return container;
}

// Обернем их в общий контейнер, чтобы они были в ряд
const colorPickerContainer = document.createElement('div');
Object.assign(colorPickerContainer.style, {
    display: 'flex',
    gap: '15px', // Отступ между элементами
    alignItems: 'center' // Выравнивание элементов по центру
});

colorPickerContainer.appendChild(createColorPicker('Цвет 1', 'colorPalette1'));
colorPickerContainer.appendChild(createColorPicker('Цвет 2', 'colorPalette2'));

modal.appendChild(colorPickerContainer);
document.body.appendChild(modal);


}

// Создаем элемент кнопки
const button = document.createElement('button');
button.innerText = 'Моя кнопка';

// Создаем контейнер для SVG
const svgButton = document.createElement('div');
svgButton.style.position = 'fixed';
svgButton.style.top = '5px';
svgButton.style.left = '10px';
svgButton.style.cursor = 'pointer';
svgButton.style.zIndex = '10000';
svgButton.innerHTML = `
<svg height="35px" width="35px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495 495" xml:space="preserve" fill="#000000" transform="matrix(-1, 0, 0, -1, 0, 0)rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#005ECE;" d="M495,297.5v-110h-68.21c-3.63-11.87-8.42-23.31-14.35-34.23l45.42-45.42l-77.78-77.79l-46.05,46.06 c-11.66-6.08-23.87-10.89-36.53-14.38V0h-50v152c52.66,0,95.5,42.84,95.5,95.5S300.16,343,247.5,343v152h60v-74.82 c10.09-3.4,19.85-7.66,29.23-12.74l50.42,50.42l77.79-77.78l-51.06-51.05c5.27-10.11,9.58-20.64,12.91-31.53H495z"></path> <path style="fill:#2488FF;" d="M152,247.5c0-52.66,42.84-95.5,95.5-95.5V0h-60v64.82c-12.42,4.18-24.32,9.65-35.61,16.36 l-44.04-44.04l-77.79,77.78l47.74,47.74c-5.28,11.19-9.41,22.83-12.36,34.84H0v110h71.58c3.93,10.63,8.81,20.85,14.6,30.61 l-49.04,49.04l77.78,77.79l52.74-52.75c9.62,4.54,19.59,8.24,29.84,11.06V495h50V343C194.84,343,152,300.16,152,247.5z"></path> </g> </g></svg>`;

// Добавляем обработчик клика
svgButton.addEventListener('click', function () {
    createModal();
});

// Добавляем SVG-кнопку на страницу
document.body.appendChild(svgButton);


// Ключ для локального хранилища
    const STORAGE_KEY = 'cropScriptEnabled';

    // Ищем кнопку по селектору
    const oldButton = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(3)');

    if (oldButton) {
        // Создаём новую кнопку, чтобы убрать старый функционал
        const newButton = oldButton.cloneNode(true);
        oldButton.replaceWith(newButton);

        // Загружаем состояние кнопки из локального хранилища
        const savedState = localStorage.getItem(STORAGE_KEY) === 'true';

        // Иконка для состояния "включено"
        const enabledIcon = document.createElement('img');
        enabledIcon.src = 'https://img.icons8.com/officel/80/crop.png';
        enabledIcon.alt = 'Crop Enabled';
        enabledIcon.style.width = '27px';
        enabledIcon.style.height = '27px';
        enabledIcon.title = 'Остановить Crop';
        enabledIcon.style.margin = 'auto';

        // Иконка для состояния "выключено"
        const disabledIcon = document.createElement('img');
        disabledIcon.src = 'https://img.icons8.com/office/40/unchecked-checkbox.png';
        disabledIcon.alt = 'Crop Disabled';
        disabledIcon.style.width = '27px';
        disabledIcon.style.height = '27px';
        disabledIcon.title = 'Посмотреть Crop';
        disabledIcon.style.margin = 'auto';

        // Удаляем текущие элементы внутри кнопки
        newButton.innerHTML = '';
        newButton.appendChild(savedState ? enabledIcon : disabledIcon);



// Обработчик клика по кнопке
newButton.addEventListener('click', (event) => {
    // Проверяем, зажат ли Alt
    if (event.altKey) {
        // Отменяем стандартное поведение кнопки
        event.preventDefault();

        // Создаём или закрываем модальное окно
        createModal();
    }
});


        // Основной код с управлением
        let intervalId = null;

       const addBorder = () => {
    const addBorderFromStorage = localStorage.getItem('addBorder');

    const svg = document.querySelector('#canvas > svg');
    const image = document.querySelector('#canvas > svg > image');

    if (svg && image) {
        let borderRect = svg.querySelector('rect.border-rect');

        // Если прямоугольник ещё не создан, создаём его
        if (!borderRect) {
            const x = parseFloat(image.getAttribute('x')) || 0;
            const y = parseFloat(image.getAttribute('y')) || 0;
            const width = parseFloat(image.getAttribute('width')) || 0;
            const height = parseFloat(image.getAttribute('height')) || 0;

            borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            borderRect.setAttribute('x', x);
            borderRect.setAttribute('y', y);
            borderRect.setAttribute('width', width);
            borderRect.setAttribute('height', height);
            borderRect.setAttribute('stroke', 'black');
            borderRect.setAttribute('stroke-width', '1');
            borderRect.setAttribute('fill', 'none');
            borderRect.classList.add('border-rect');

            svg.insertBefore(borderRect, image);
        }

        // Управляем видимостью элемента в зависимости от параметра в локальном хранилище
        if (addBorderFromStorage === 'true') {
            borderRect.style.display = 'block'; // Показываем
        } else {
            borderRect.style.display = 'none'; // Скрываем
        }
    }
};


      const addClonedImage = () => {
    const addClonedImageFromStorage = localStorage.getItem('addClonedImage');

    const svg = document.querySelector('#canvas > svg');
    const image = document.querySelector('#canvas > svg > image');
    const textureInput = document.querySelector('#Textures_Front__BgMaskImageUrl');
    const statusSelect = document.querySelector('#StatusId');

    // Проверяем, есть ли необходимые элементы
    if (svg && image && textureInput && statusSelect) {
        // Проверяем, выбрано ли значение "12" или "2" в статусе
        const selectedOption = statusSelect.querySelector('option[selected="selected"]');
        const isValidStatus = selectedOption && (selectedOption.value === "12" || selectedOption.value === "2");

        if (isValidStatus) {
            const newHref = textureInput.value; // Получить значение из input

            if (newHref) {
                let clonedImage = svg.querySelector('image.cloned-image');

                // Если клонированного элемента ещё нет, создаём его
                if (!clonedImage) {
                    clonedImage = image.cloneNode(true);
                    clonedImage.classList.add('cloned-image');
                    clonedImage.setAttribute('opacity', '0.50');

                    // Вставить клонированный элемент после оригинального
                    image.insertAdjacentElement('afterend', clonedImage);
                }

                // Заменяем href на новое значение
                clonedImage.setAttribute('href', newHref);

                // Показываем или скрываем элемент в зависимости от значения в хранилище
                if (addClonedImageFromStorage === 'true') {
                    clonedImage.style.display = 'block'; // Показываем
                } else {
                    clonedImage.style.display = 'none'; // Скрываем
                }
            }
        }
    }
};

    const cloneSvgElement = () => {
    const cloneSvgElementFromStorage = localStorage.getItem('cloneSvgElement');

    const svgElement = document.querySelector('#background-rectangle-editor > svg');
    const canvas = document.querySelector('#canvas');
    const statusSelect = document.querySelector('#StatusId');

    if (svgElement && canvas && statusSelect) {
        // Проверяем, выбрано ли значение "12" или "2" в статусе
        const selectedOption = statusSelect.querySelector('option[selected="selected"]');
        const isValidStatus = selectedOption && (selectedOption.value === "12" || selectedOption.value === "2");

        if (isValidStatus) {
            // Проверяем, был ли уже добавлен клонированный элемент
            let clonedSvg = document.querySelector('.cloned-svg');
            if (!clonedSvg) {
                // Клонируем SVG элемент
                clonedSvg = svgElement.cloneNode(true);
                clonedSvg.classList.add('cloned-svg'); // Добавляем класс для клонированного SVG

                // Удаляем стиль cursor: move; у всех <ellipse> внутри клонированного SVG
                const ellipses = clonedSvg.querySelectorAll('ellipse');
                ellipses.forEach((ellipse) => {
                    ellipse.style.cursor = ''; // Удаляем стиль через style
                    ellipse.removeAttribute('style'); // Полностью удаляем атрибут style
                });

                // Проверяем, куда вставить клонированный SVG
                const lastClonedImage = document.querySelector('image.cloned-image:last-of-type');
                if (lastClonedImage) {
                    lastClonedImage.insertAdjacentElement('afterend', clonedSvg);
                } else {
                    const borderRect = document.querySelector('rect.border-rect');
                    if (borderRect) {
                        const firstImageAfterBorderRect = borderRect.nextElementSibling?.tagName === 'image'
                            ? borderRect.nextElementSibling
                            : borderRect.nextElementSibling?.querySelector('image');
                        if (firstImageAfterBorderRect) {
                            firstImageAfterBorderRect.insertAdjacentElement('afterend', clonedSvg);
                        } else {
                            canvas.appendChild(clonedSvg); // Вставка в canvas, если других элементов нет
                        }
                    } else {
                        canvas.appendChild(clonedSvg);
                    }
                }
            }

            // Управляем видимостью клонированного SVG в зависимости от значения в хранилище
            if (cloneSvgElementFromStorage === 'true') {
                clonedSvg.style.display = 'block'; // Показываем
            } else {
                clonedSvg.style.display = 'none'; // Скрываем
            }
        }
    }
};




        const startScript = () => {
            intervalId = setInterval(() => {
                // Проверяем, есть ли класс у #tng-product-ruler и включен ли скрипт
                const tngProductRuler = document.querySelector('#tng-product-ruler');
                if (tngProductRuler && tngProductRuler.classList.contains('switch-editor-button') && tngProductRuler.classList.contains('btn') && tngProductRuler.classList.contains('pull-left') && tngProductRuler.classList.contains('active')) {
                    addBorder();
                    addClonedImage();
                    cloneSvgElement(); // Клонируем SVG
                }
            }, 250); // Проверяем каждую секунду
        };

        const stopScript = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            // Удаляем все элементы с классом 'border-rect' и 'cloned-image'
            document.querySelectorAll('.border-rect, .cloned-image, .cloned-svg').forEach(el => el.remove());
        };

        // Применяем сохранённое состояние
        if (savedState) {
            startScript();
        }

        newButton.addEventListener('click', (event) => {
    // Проверяем, зажата ли клавиша Alt
    if (event.altKey) {
        return; // Если Alt зажат, не выполняем дальнейшую логику
    }

    const isRunning = intervalId !== null;

    if (isRunning) {
        stopScript();
        newButton.replaceChild(disabledIcon, newButton.firstChild);
        localStorage.setItem(STORAGE_KEY, 'false');
    } else {
        startScript();
        newButton.replaceChild(enabledIcon, newButton.firstChild);
        localStorage.setItem(STORAGE_KEY, 'true');
    }
});


        // Добавляем MutationObserver для отслеживания изменений в классе #tng-product-ruler
        const tngProductRuler = document.querySelector('#tng-product-ruler');
        if (tngProductRuler) {
            const observer = new MutationObserver(() => {
                // Проверяем состояние cropScriptEnabled из локального хранилища
                const isCropEnabled = localStorage.getItem(STORAGE_KEY) === 'true';

                // Отслеживаем изменения в классе только если cropScriptEnabled === true
                if (isCropEnabled) {
                    const hasClass = tngProductRuler.classList.contains('switch-editor-button') &&
                        tngProductRuler.classList.contains('btn') &&
                        tngProductRuler.classList.contains('pull-left') &&
                        tngProductRuler.classList.contains('active');

                    if (hasClass) {
                        startScript();
                    } else {
                        stopScript();
                    }
                }
            });

            observer.observe(tngProductRuler, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        // Добавляем действия при наведении мыши
        newButton.addEventListener('mouseenter', () => {
            // Проверяем класс перед добавлением элементов
            const tngProductRuler = document.querySelector('#tng-product-ruler');
            if (tngProductRuler && tngProductRuler.classList.contains('switch-editor-button') && tngProductRuler.classList.contains('btn') && tngProductRuler.classList.contains('pull-left') && tngProductRuler.classList.contains('active')) {
                addBorder();
                addClonedImage();
                cloneSvgElement(); // Клонируем SVG при наведении
            }
        });

        newButton.addEventListener('mouseleave', () => {
            if (!intervalId) {
                // Удаляем только временные рамки и клонированные изображения, добавленные при наведении
                document.querySelectorAll('.border-rect:not(.persistent), .cloned-image:not(.persistent), .cloned-svg').forEach(el => el.remove());
            }
        });
    }

})();

(function () {
    window.onload = function () {
        // Функция для имитации клика по элементу
        function clickElement(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
            } else {
                console.log(`Элемент с селектором "${selector}" не найден.`);
            }
        }

        // Функция проверки наличия атрибута selected хотя бы у одного <option>
        function isAnyOptionSelected() {
            const statusElement = document.querySelector('#StatusId');
            if (!statusElement) return false; // Если #StatusId не найден, возвращаем false

            const optionValue12 = statusElement.querySelector('option[value="12"]');
            const optionValue2 = statusElement.querySelector('option[value="2"]');

            // Проверяем, что хотя бы один из <option> существует и имеет selected="selected"
            const isValue12Selected = optionValue12 && optionValue12.getAttribute('selected') === 'selected';
            const isValue2Selected = optionValue2 && optionValue2.getAttribute('selected') === 'selected';

            return isValue12Selected || isValue2Selected;
        }

        // Основная логика, проверяем условия и выполняем действия
        function checkConditionsAndClick() {
            // Проверяем наличие элемента с классом disabled
            const isDisabled = document.querySelector(
                '#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a.switch-editor-button.btn.pull-left.disabled'
            );

            // Проверяем наличие класса "editorMode btn btn-default btn-primary" у селектора #btn-use-custom-editor
            const customEditorButton = document.querySelector('#btn-use-custom-editor');
            const hasRequiredClass =
                customEditorButton && customEditorButton.classList.contains('editorMode') &&
                customEditorButton.classList.contains('btn') &&
                customEditorButton.classList.contains('btn-default') &&
                customEditorButton.classList.contains('btn-primary');

            if (!isDisabled && isAnyOptionSelected() && hasRequiredClass) {
                // Кликаем по первому элементу
                clickElement('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(5)');

                // Ждём немного, чтобы клик успел сработать, и затем кликаем по второму элементу
                setTimeout(() => {
                    clickElement('#tng-product-ruler');
                }, 250); // Задержка (можно настроить по необходимости)

                // Останавливаем проверку, так как условия выполнены
                clearInterval(checkInterval);
            }
        }

        // Периодическая проверка условий
        const checkInterval = setInterval(checkConditionsAndClick, 250); // Проверяем каждые 200 мс
    };


        function createDraggableWindow(windowName) {
        const storedPosition = JSON.parse(localStorage.getItem(windowName)) || { top: 50, left: 50, width: 300, height: 200 };

        const windowDiv = document.createElement('div');
       windowDiv.id = windowName; // Добавляем id для каждого окна
        Object.assign(windowDiv.style, {
            position: 'absolute', // Элемент будет привязан к своему положению на странице

            top: `${storedPosition.top}px`,
            left: `${storedPosition.left}px`,
            width: `${storedPosition.width}px`,
            height: `${storedPosition.height}px`,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            border: '0.5px solid rgba(0, 0, 0, 0.3)',
            paddingTop: '0px',
            zIndex: '0',
            overflow: 'auto',
            minWidth: '200px',
            minHeight: '33px',
            boxSizing: 'border-box',
            textAlign: 'left',
            fontFamily: 'Arial, sans-serif',
            resize: 'both',
            display: 'none',
            zIndex: '1' // Слой окна
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            width: '100%',
            height: '100%',
           // backgroundColor: '#ccc',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            cursor: 'move',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '-1' // Хедер будет за содержимым

        });
        windowDiv.appendChild(header);

        const contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        contentDiv.style.pointerEvents = 'auto';
        windowDiv.appendChild(contentDiv);

        document.body.appendChild(windowDiv);

        let offsetX, offsetY, isDragging = false;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowDiv.offsetLeft;
            offsetY = e.clientY - windowDiv.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowDiv.style.left = `${e.clientX - offsetX}px`;
                windowDiv.style.top = `${e.clientY - offsetY}px`;
                savePosition();
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        windowDiv.addEventListener('mouseup', savePosition);
        windowDiv.addEventListener('resize', savePosition);

        function savePosition() {
            localStorage.setItem(windowName, JSON.stringify({
                top: windowDiv.offsetTop,
                left: windowDiv.offsetLeft,
                width: windowDiv.offsetWidth,
                height: windowDiv.offsetHeight
            }));
        }

        return contentDiv;
    }

    const contentDiv = createDraggableWindow('firstWindow'); // Первое окно для уникальных значений


// Функция для добавления проверки видимости окон
function checkWindowVisibility() {
    // Проверяем, содержит ли текущий URL нужную строку
    const isEditBagPage = window.location.href.includes('Admin/CompareBag/EditBag');

    // Если страница не содержит 'Admin/CompareBag/EditBag', не показываем окна
    if (!isEditBagPage) {
        return;
    }

    // Проверяем значение для auditLog, tag и category в локальном хранилище
    const auditLogVisibility = JSON.parse(localStorage.getItem('auditLog')) ?? true;
    const tagVisibility = JSON.parse(localStorage.getItem('tag')) ?? true;
    const categoryVisibility = JSON.parse(localStorage.getItem('category')) ?? true;

    // Получаем окна по их id
    const firstWindow = document.querySelector('#firstWindow');
    const tagWindow = document.querySelector('#tagWindow');
    const categoryWindow = document.querySelector('#categoryWindow');

    // Если окно не существует, не меняем его стиль
    if (firstWindow) {
        firstWindow.style.display = auditLogVisibility ? 'block' : 'none';
    }
    if (tagWindow) {
        tagWindow.style.display = tagVisibility ? 'block' : 'none';
    }
    if (categoryWindow) {
        categoryWindow.style.display = categoryVisibility ? 'block' : 'none';
    }
}

// Запускаем проверку видимости окон каждую секунду
setInterval(checkWindowVisibility, 250);


function addUniqueDivsForColumns() {
        const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));
        const uniqueValues = new Set();

        for (let i = rows.length - 1; i >= 1; i--) {
            const tds = rows[i].querySelectorAll('td');
            if (tds.length >= 4) {
                const firstTdContent = tds[2].textContent.trim();
                const textContent = tds[3].textContent.trim();
                if (!uniqueValues.has(firstTdContent)) {
                    uniqueValues.add(firstTdContent);
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <span style="color: red; font-size: 13px; font-weight: bold;">${firstTdContent}</span>:
                        <span style="color: blue; font-size: 13px; font-weight: bold;">${textContent}</span>
                    `;
                    div.style.padding = '4px';
                    div.style.margin = '5px';
                    div.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.3)';
                    div.style.cursor = 'pointer';
                    div.addEventListener('click', (event) => {
                        if (event.ctrlKey) {
                            const releaseHandler = (releaseEvent) => {
                                if (!releaseEvent.ctrlKey) {
                                    handleClick(firstTdContent, textContent);
                                    document.removeEventListener('keyup', releaseHandler);
                                }
                            };
                            document.addEventListener('keyup', releaseHandler);
                        } else {
                            handleClick(firstTdContent, textContent);
                        }
                    });
                    contentDiv.appendChild(div);
                }
            }
        }
    }

    function handleClick(firstTdText, searchText) {
        const button = document.querySelector('#form-save > div.bag-details-wrapper.left-col > div.buttons > div:nth-child(6) > button.btn.btn-danger');
        if (button) {
            button.click();
            const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));
            for (const row of rows) {
                const tds = row.querySelectorAll('td');
                if (Array.from(tds).some(td => td.textContent.trim() === firstTdText)) {
                    const containsSearchText = Array.from(tds).some(td => td.textContent.trim() === searchText);
                    if (containsSearchText) {
                        const input = row.querySelector('td input');
                        if (input) {
                            input.click();
                            const seventhTdInput = row.querySelectorAll('td')[6].querySelector('input');
                            if (seventhTdInput) {
                                seventhTdInput.focus();
                            }
                        }
                    }
                }
            }
        }
    }

    addUniqueDivsForColumns();

    // Функция для добавления новых окон для тегов и категорий
    function addInfoWindows() {
        const tagWindow = createDraggableWindow('tagWindow'); // Окно для тегов
        const categoryWindow = createDraggableWindow('categoryWindow'); // Окно для категорий

        // Добавление стилей для текста
        const tagTextStyle = {
            color: 'red',
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '5px',
            padding: '0px',
 zIndex: '-2', // Хедер будет за содержимым
position: 'absolute'
          //  borderBottom: '2px solid #d9534f'
        };

        const categoryTextStyle = {
            color: 'red',
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '5px',
            padding: '0px',
 zIndex: '-2', // Хедер будет за содержимым
position: 'absolute'

           // borderBottom: '2px solid #5bc0de'
        };

        // Загружаем информацию
        const currentUrl = window.location.href;
        const id = currentUrl.split('/').pop();
        const newUrl = `https://tngadmin.triplenext.net/Admin/Audit/Product/${id}`;

        // Запрос на страницу
        fetch(newUrl)
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const allText = doc.body.innerHTML;

                // Регулярные выражения для поиска тегов и категории
                const regexTagChanged = /Tag changed from(.*?)<br>/m;
                const regexAddedTag = /Added Tag:(.*?)<br>/m;
                const regexRemovedTag = / Removed Tag:(.*?)<br>/m;
                const regexCategory = /Category:(.*?)<br>/m;

                const matchTagChanged = allText.match(regexTagChanged);
                const matchAddedTag = allText.match(regexAddedTag);
                const matchRemovedTag = allText.match(regexRemovedTag);
                const matchCategory = allText.match(regexCategory);

                // Проверяем и выводим данные в tagWindow
                const tagDiv = document.createElement('div');
                if (matchRemovedTag) {
                    tagDiv.textContent = `Тег ${matchRemovedTag[1].replace(/<[^>]*>/g, '').trim()} удален`;
                } else if (matchTagChanged) {
                    tagDiv.textContent = matchTagChanged[1].replace(/<[^>]*>/g, '').trim().replace(/to/g, ' на ');
                } else if (matchAddedTag) {
                   // tagDiv.textContent = `Добавлен тег: <span style="color: green;">${matchAddedTag[1].replace(/<[^>]*>/g, '').trim()}`;
 tagDiv.innerHTML = `Добавлен тег: <span style="color: blue;">${matchAddedTag[1].replace(/<[^>]*>/g, '').trim()}</span>`;
                } else {
                    tagDiv.textContent = "Зашло с этим тегом";
                }
                Object.assign(tagDiv.style, tagTextStyle);
                tagWindow.appendChild(tagDiv);

                // Проверяем и выводим данные в categoryWindow
                const categoryDiv = document.createElement('div');
                if (matchCategory) {
                    categoryDiv.textContent = matchCategory[1].replace(/<[^>]*>/g, '').trim().replace(/-&gt;/g, 'на').replace(/&amp;/g, '&');
                } else {
                    categoryDiv.textContent = "Категорию не меняли";
                }
                Object.assign(categoryDiv.style, categoryTextStyle);
                categoryWindow.appendChild(categoryDiv);
            });
    }

    addInfoWindows();

// ВСТАВКА КОЛИЧЕСТВО ПРОДУКТОВ НА ПФ
// Находим элемент по селектору
let element = document.querySelector('#open-task-count');

// Проверяем, существует ли элемент
if (element) {
    // Получаем значение из локального хранилища
    let prefilterValue = localStorage.getItem('prefilter');

    // Проверяем, что значение существует и устанавливаем его
    if (prefilterValue) {
        element.value = prefilterValue;
        console.log('Значение value изменено на ' + prefilterValue);
    } else {
        console.log('Значение prefilter не найдено в локальном хранилище.');
    }
} else {
    console.log('Элемент с селектором #open-task-count не найден.');
}




    // Флаг для отслеживания изменений
    let scriptActive = false;
    let elementsCreated = false;

    function checkConditions() {
        const urlMatches = window.location.href.includes("PrefilterPictures");
        const storageEnabled = localStorage.getItem("PrefilterComments") === "true";

        const shouldActivate = urlMatches && storageEnabled;

        if (shouldActivate && !scriptActive) {
            scriptActive = true;
            initializeScript();
        } else if (!shouldActivate && scriptActive) {
            scriptActive = false;
            removeElements();
        }
    }

    function initializeScript() {
        if (elementsCreated) return; // Предотвращаем повторное создание элементов
        elementsCreated = true;

        /////////////////////////////////////////////////// Создание кнопки
        function createButton(text, id, top, comment, selectId) {
            let button = document.createElement('button');
            Object.assign(button, {
                textContent: text,
                id: id,
                type: 'button',
                className: 'created-by-script',
                style: `
                    position: fixed;
                    top: ${top};
                    right: 10px;
                    z-index: 9999;
                    width: 130px;
                    height: 25px;
                    text-align: center;
                    border: none;
                    border-radius: 5px;
                    background-color: transparent;
                    color: black;
                    padding: 1px 0;
                    font-size: 10px;
                    cursor: pointer;
                `,
                onmouseover: () => button.style.backgroundColor = 'rgba(200, 200, 200, 0.5)',
                onmouseout: () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)',
                ondblclick: function() {
                    let selectComments = $("#" + selectId);
                    if (selectComments.length) {
                        selectComments.empty();
                        selectComments.append(new Option(comment, comment, false, true)).trigger('chosen:updated');
                    }

                    let btn = document.getElementById("btnBadDimensions");
                    if (btn) btn.click();
                }
            });

            document.body.appendChild(button);
        }

        /////////////////////////////////////////////////// Создание квадратов
        let heights = [75, 25, 50, 75];
        let offsets = heights.map((_, i) => heights.slice(0, i).reduce((a, b) => a + b + 5, 69));

        offsets.forEach((top, i) => {
            let div = document.createElement('div');
            div.className = 'created-element created-by-script';
            Object.assign(div.style, {
                position: 'fixed',
                top: `${top}px`,
                right: '8px',
                width: '132px',
                height: `${heights[i]}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid #33a6e8',
                borderRadius: '5px'
            });

            document.body.appendChild(div);
        });

        /////////////////////////////////////////////////// Комментарии
        $(document).ready(function() {
            $("#SelectedComments").chosen();

            const buttonsData = [
                ['Inappropriate Resolution', 'lowResolutionButton', '70px', 'Bad Image (inappropriate resolution and inability to remove the background)'],
                ['Unusable Angle', 'unusableAngleButton', '95px', 'Bad Image (Unusable Angle and Pieces of products)'],
                ['No Image on PDP', 'noImageOnPDPButton', '120px', 'No Image on PDP'],
                ['Several Products (Set)', 'severalProductsButton', '150px', 'Several Products (Set)'],
                ['No Dimensions on PDP', 'noDimensionsOnPDPButton', '180px', 'No Dimensions on PDP'],
                ['Incorrect Dimensions', 'incorrectDimensionsButton', '205px', 'Incorrect Dimensions'],
                ['(URL) not available', 'errorButton', '235px', 'Product detail page (URL) not available'],
                ['Category not supported', 'wrongCategoryButton1', '260px', 'Category not supported'],
                ['Not Supported', 'notSupportedButton1', '285px', 'Product Not Supported by Tangiblee']
            ];

            buttonsData.forEach(buttonData => createButton(...buttonData, 'SelectedComments'));
        });
    }

    function removeElements() {
        if (!elementsCreated) return;
        elementsCreated = false;

        // Удаляем созданные элементы
        document.querySelectorAll('.created-by-script').forEach(el => el.remove());
    }

    // Запуск проверки каждые 250 мс
    setInterval(checkConditions, 250);





function shouldActivateScript() {
    return location.href.includes("PrefilterPictures") && localStorage.getItem("PrefilterPictures") === "true";
}

function setupScript() {
    if (!shouldActivateScript()) return;
// Контейнер для изображений
const imageContainer = document.createElement('div');
imageContainer.style.position = 'fixed';
imageContainer.style.top = '0';
imageContainer.style.left = '0';
imageContainer.style.width = '100vw';
imageContainer.style.height = '100vh';
imageContainer.style.zIndex = '10000';
imageContainer.style.pointerEvents = 'none'; // Позволяет кликать сквозь контейнер
document.body.appendChild(imageContainer);

// Переменная для управления z-index
let highestZIndex = 10000;

// Функция обработки клика по изображению
function handleImageClick(event, img) {
    if (!img) return;
    event.stopPropagation();

    let imageUrl = img.getAttribute('baseurl') || img.src;

    if (imageUrl.includes('ResizeImage')) {
        const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
        imageUrl = decodeURIComponent(urlParams.get('sourceUrl'));
    }

    // Создаём контейнер для изображения
  // Получаем цвета из локального хранилища
const colorPalette1 = localStorage.getItem('colorPalette1') || '#666';
const colorPalette2 = localStorage.getItem('colorPalette2') || 'black';

// Создаём контейнер для изображения
const imgWrapper = document.createElement('div');
Object.assign(imgWrapper.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
    borderRadius: '0px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    backgroundImage: `
        linear-gradient(45deg, ${colorPalette1} 25%, transparent 25%, transparent 75%, ${colorPalette1} 75%, ${colorPalette1}),
        linear-gradient(45deg, ${colorPalette1} 25%, ${colorPalette2} 25%, ${colorPalette2} 75%, ${colorPalette1} 75%, ${colorPalette1})
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    zIndex: highestZIndex++,
    cursor: 'pointer',
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s',
});


    // Крестик закрытия
    const closeButton = document.createElement('div');
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '25px',
        height: '25px',
        backgroundColor: '#42ace9',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: 'pointer',
    });
    closeButton.innerText = '×';
    closeButton.addEventListener('click', () => imgWrapper.remove());

    // Создаём изображение
    const imgTag = document.createElement('img');
    imgTag.src = imageUrl;
    Object.assign(imgTag.style, {
        maxWidth: '90vw',
        maxHeight: '90vh',
        borderRadius: '0px',
        cursor: 'grab',
    });
// Добавляем обработчик двойного клика для закрытия изображения
        imgTag.addEventListener('dblclick', () => imgWrapper.remove());
    // Перетаскивание контейнера
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    imgWrapper.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - imgWrapper.offsetLeft;
        offsetY = e.clientY - imgWrapper.offsetTop;
        imgWrapper.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        imgWrapper.style.left = `${e.clientX - offsetX}px`;
        imgWrapper.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        imgWrapper.style.cursor = 'pointer';
    });

    // Переключение z-index по клику
    imgWrapper.addEventListener('mousedown', () => {
        imgWrapper.style.zIndex = highestZIndex++;
    });

    // ЗУМИРОВАНИЕ ВСЕГО КОНТЕЙНЕРА
    let scale = 1;
    imgWrapper.addEventListener('wheel', (event) => {
        event.preventDefault();
        scale += event.deltaY * -0.0015;
        scale = Math.min(Math.max(0.5, scale), 3); // Ограничиваем зум от 50% до 300%
        imgWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });

    // Добавляем элементы в контейнер
    imgWrapper.appendChild(imgTag);
    imgWrapper.appendChild(closeButton);
    imageContainer.appendChild(imgWrapper);
}

// Обработчик кликов для <img>
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', function (event) {
        handleImageClick(event, img);
    });
});

document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', function (event) {
        // Проверяем, был ли клик на <div>, <a> с классом или <button> с классом
        const div = li.querySelector('div');
        const a = li.querySelectorAll('a');
        const button = li.querySelectorAll('button');

        // Проверяем, был ли клик на элементе <div>, <a> или <button>
        if (
            (div && div.contains(event.target)) ||  // Клик внутри <div>
            [...a].some(anchor => anchor.contains(event.target)) ||  // Клик внутри <a>
            [...button].some(btn => btn.contains(event.target)) // Клик внутри <button>
        ) {
            return; // Если клик был на этих элементах, не открываем изображение
        }

        // Если клик не был внутри <div>, <a> или <button>, ищем картинку и вызываем handleImageClick
        const img = li.querySelector('img');
        if (img) {
            handleImageClick(event, img);
        }

    });
});
}

let previousState = shouldActivateScript();
setupScript();

setInterval(() => {
    const currentState = shouldActivateScript();
    if (currentState !== previousState) {
        location.reload();
    }
    previousState = currentState;
}, 250);

//////////FIXSIZE


(function () {
    let initialCheckCompleted = false;
    let observer = null;

    console.log("Скрипт запущен!");

    function checkFixsizeEnabled() {
        const fixsize = localStorage.getItem("fixsize");
        if (fixsize === "true") {
            console.log("Параметр fixsize включен, продолжаем выполнение скрипта.");
            checkInitialFixedSize();
        } else {
            console.log("Параметр fixsize отключен, скрипт не выполняется.");
        }
    }

    // Проверка на включение параметра fixsize
    function checkInitialFixedSize() {
        if (initialCheckCompleted) return;

        console.log("Проверяем наличие текста 'Fixed size:'...");

        const canvasElement = document.querySelector("#canvas");
        const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");
if (canvasElement && canvasElement.textContent.includes("Fixed size:")) {
    console.log("Текст 'Fixed size:' найден");

    if (inputElement) {
        console.log(`Текущее значение: ${inputElement.value}`);

        if (inputElement.value === "0.1") {
            console.log("Значение 0.1 — скрипт останавливается");
            initialCheckCompleted = true;
            return;
        }

        console.log("Значение НЕ 0.1 — изменяем стиль элемента");

        setTimeout(() => {
            const targetElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(10) > p");

            if (targetElement) {
                targetElement.style.backgroundColor = "red";
                targetElement.style.color = "white";
                console.log("Стиль успешно изменён");
            } else {
                console.log("Элемент не найден");
            }

            updateValueAndClick(inputElement);
            initialCheckCompleted = true;
        }, 100);
    }
} else {
    console.log("Текст 'Fixed size:' НЕ найден, включаем наблюдатель");
    startObserver();
}

    }

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(() => {
            console.log("Обнаружено изменение в DOM, проверяем заново...");
            const canvasElement = document.querySelector("#canvas");
            const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");

            if (canvasElement && canvasElement.textContent.includes("Fixed size:") && inputElement) {
                console.log("Текст 'Fixed size:' появился!");

                console.log(`Текущее значение: ${inputElement.value}`);
                if (inputElement.value !== "0.1") {
                    console.log("Значение НЕ 0.1 — обновляем и кликаем");
                    updateValueAndClick(inputElement);
                } else {
                    console.log("Значение уже 0.1 — ничего не делаем");
                }

                console.log("Останавливаем наблюдатель");
                observer.disconnect();
                initialCheckCompleted = true;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log("Наблюдатель запущен...");
    }

    function updateValueAndClick(inputElement) {
        console.log("Меняем значение на 0.1...");

        // Обновляем скрытое поле value
        inputElement.value = "0.1";
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));

        // Находим визуальное отображение значения и обновляем его
        const visualInputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-text.validatebox-text");
        if (visualInputElement) {
            console.log("Обновляем визуальное отображение...");
            visualInputElement.value = "0.1";
            visualInputElement.dispatchEvent(new Event("input", { bubbles: true }));
            visualInputElement.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function waitForCanvas() {
        console.log("Ждём появления #canvas...");

        const interval = setInterval(() => {
            if (document.querySelector("#canvas")) {
                console.log("#canvas найден, запускаем проверку!");
                clearInterval(interval);
                checkFixsizeEnabled();
            }
        }, 500);
    }

    function waitForButtonAndClick() {
        const buttonSelector = "#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5) > a";
        const button = document.querySelector(buttonSelector);

        if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
            console.log("Класс активен, кликаем по кнопке...");
            button.click();
        } else {
            console.log("Ожидаем появления нужного класса на кнопке...");
            const buttonObserver = new MutationObserver(() => {
                if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
                    console.log("Класс стал активным, кликаем по кнопке...");
                    button.click();
                    buttonObserver.disconnect(); // Останавливаем наблюдатель
                }
            });

            buttonObserver.observe(button, { attributes: true, attributeFilter: ["class"] });
        }
    }

    waitForCanvas();
    waitForButtonAndClick();
})();

})();
