// ==UserScript==
// @name         Crop 2.0
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520935/Crop%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/520935/Crop%2020.meta.js
// ==/UserScript==

(function () {

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

// Создаём модальное окно с чекбоксами
function createModal() {
    // Проверяем, существует ли уже модальное окно
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        // Если модальное окно уже открыто, закрываем его
        existingModal.remove();
        return;
    }

    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.classList.add('custom-modal');  // Добавляем класс для модального окна
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0px 5px 20px rgba(0, 0, 0, 0.1)';
    modal.style.padding = '30px 40px';
    modal.style.maxWidth = '150px';
    modal.style.width = '100%';
    modal.style.zIndex = '1000';
    modal.style.fontFamily = '"Arial", sans-serif';
    modal.style.color = '#333';

    // Создаём заголовок модального окна
    //const header = document.createElement('h2');
   // header.textContent = 'Выберите параметры';
  //  header.style.fontSize = '18px';
  //  header.style.marginBottom = '20px';
  //  modal.appendChild(header);

    // Функция для создания чекбокса
    function createCheckbox(labelText, id) {
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.style.marginRight = '10px';

        // Загружаем состояние чекбокса из локального хранилища
        const savedState = localStorage.getItem(id) === 'true';
        checkbox.checked = savedState;

        // Обработчик для сохранения состояния чекбокса
        checkbox.addEventListener('change', () => {
            localStorage.setItem(id, checkbox.checked);
        });

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = labelText;
        label.style.fontSize = '16px';

        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    // Добавляем чекбоксы
    modal.appendChild(createCheckbox('Кроп', 'addBorder'));
    modal.appendChild(createCheckbox('Закраска', 'addClonedImage'));
    modal.appendChild(createCheckbox('Разметка', 'cloneSvgElement'));

    // Кнопка закрытия модального окна
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.style.backgroundColor = '#007BFF';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '20px';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
    modal.appendChild(closeButton);

    // Добавляем модальное окно на страницу
    document.body.appendChild(modal);
}

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
})();



