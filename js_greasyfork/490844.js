// ==UserScript==
// @name         HotKey
// @namespace    http://tampermonkey.net/
// @version      1
// @description  HotKey для Admin
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*//Admin/MyCurrentTask/ChooseImage
// @match        *://*/Admin/MyCurrentTask/ChooseImage
// @match        *://*/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490844/HotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/490844/HotKey.meta.js
// ==/UserScript==

(function() {
    'use strict';
const messages = {
        admin: 'Ссылки на Admin скопированы',
        url: 'Ссылки на URL скопированы',
        widget: 'Ссылки на WIDGET скопированы.',
        all: 'Все данные скопированы',
        sku: 'Скопированы SKU',
        id: 'РАЗМЕРЫ ВЗЯТЫ С ВАРИЦИИ ПРОВЕРТИ ВЕРНЫЕ ЛИ ОНИ',
    };
const alertStyles = {
    position: 'fixed',
    zIndex: '10000',
    top: '5%',
    left: '0.51%',
   // transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    padding: '10px',
    border: '1px solid #000000',
    width: '285px', // Пример размера окна
    fontFamily: 'Arial, sans-serif', // Пример шрифта
    color: '#333333', // Пример цвета текста
    fontSize: '25px', // Пример размера текста
    backgroundColor: '#f0f0f0', // Пример цвета фона
};

function createNotification(message) {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = message;
        Object.assign(alertDiv.style, alertStyles);
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Создание модального окна
    var modal = document.createElement("div");
    modal.id = "modal";
    modal.style.display = "none"; // Изначально скрываем модальное окно
    modal.style.position = "fixed";
    modal.style.bottom = "64px";
    modal.style.right = "0%";
    modal.style.backgroundColor = "white";
    modal.style.padding = "10px";
    modal.style.border = "3px solid #49afea";
    modal.style.borderRadius = "5px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    modal.style.zIndex = "9999";
    document.body.appendChild(modal);
    // Установка размеров и положения модального окна
    modal.style.width = "50%"; // Ширина модального окна
    modal.style.height = "90%"; // Максимальная высота модального окна
    modal.style.overflow = "auto"; // Включение прокрутки, если содержимое не помещается
    modal.style.maxWidth = "450px"; // Максимальная ширина модального окна
    modal.style.maxHeight = "850px"; // Максимальная высота модального окна
    modal.style.marginTop = "-" + modal.offsetHeight / 2 + "px"; // Положение модального окна по вертикали
    modal.style.marginLeft = "-" + modal.offsetWidth / 2 + "px"; // Положение модального окна по горизонтали

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Создание заголовка модального окна
    var modalTitle = document.createElement("h2");
    modalTitle.innerHTML = "Горячие клавиши";
    modal.appendChild(modalTitle);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Предопределенные значения для подсказок и названий
    var names = ["SIMPLE=>CASTOM=POISON", "ОТКРЫТЬ PDP", "WIDGET","SAVE AND NEXT","SAVE AND PREVIEW","AUDITLOG","ОТКРЫТЬ/ЗАКРЫТЬ IST","ОТКРЫТЬ/ЗАКРЫТЬ DEFECT","ОТКРЫТЬ ОКНО РАЗМЕТКИ","Стрелки по умолчанию","Удалить ширину","Удалить высоту","Удалить глубину","Удалить 0й","Удалить красную","Удалить все стрелки","ОТКРЫТЬ ОКНО ЗАКРАСКИ","•","●","⊙","◯","Полная закраска","Удалить закраску","ОТКРЫТЬ ОКНО ПОВОРОТА","Отразить по горизонтали","Отразить по вертикали","Повернуть на 90º","Повернуть на 180º","Сохранить","ОТКРЫТЬ РАЗМЕТКУ КОМНАТЫ","Добавить разметку","Удалить разметку",
"Is gravity available","Is lifestyle available","Is human mode available","Exclude AR","Exclude WFI","Exclude RoomView","Exclude On Model","Ready for 3D", "FEMALE", "MALE", "UNISEX", "INFANT","ОТКРЫТИЕ/ЗАКРЫТИ DETAILS","ЗАГРУЗИТЬ КАРТИНКУ","ДОБАВИТЬ КАРТИНКУ","5.4","6.4","4.9","1.732","1.735","1.976","1.984","РАЗМЕРЫ С ВАРИАЦИИ","КАРТИНКУ С ВАРИАЦИИ","КАРТИНКУ И РАЗМЕР","180+","СМ⇒IN    IN⇒СМ","SAVE","TO COMPLEX","TO DOUBTFUL","РАЗМЕРЫ С АДМИНА","Crop Mode Enabled","Crop Frame Locked","Crop","Auto Crop","COMING SOON","COMING SOON","COMING SOON","COMING SOON",
"COMING SOON","COMING SOON", "Low Resolution", "Unusable Angle", "Wrong Image", "No Image on PDP", "Not Front View", "Image not Whole", "Pieces of products", "Cannot remove background", "Several Products (Set)", "No Dimensions on PDP", "Incorrect Dimensions", "Scaled by width", "Scaled by height", "Only one dimension", "No length on the PDP", "No depth on the PDP", "Duplicate", "Do not have the goods", "Error", "Redirects to homepage", "Redirects to category page", "Wrong Category", "Not Supported","ToModeration","Original image open all link","Pre-processed image open all link","Скачать оригинальные изображения","GrownBrilliance"];
// var placeholders = names ;
//63-72
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Создание полей для ввода
    var inputFields = [];
    var hotkeys = {}; // Объект для проверки уникальности горячих клавиш
    for (var i = 0; i < 101; i++) {
    var input = document.createElement("input");
    input.type = "text";
// input.placeholder = placeholders[i] || "Подсказка";
    input.name = names[i] || "Название";
    input.style.marginBottom = "5px"; // Уменьшаем отступ до 5px
    input.style.width = "200px"; // Устанавливаем фиксированную ширину поля ввода
    input.style.fontWeight = "bold"; // Делаем текст жирным
    input.addEventListener('input', function(event) {
    var value = event.target.value;
    console.log("Значение поля ввода:", value);
    });
    inputFields.push(input);
    // Создаем контейнер div для группировки полей ввода
    var inputContainer = document.createElement("div");
    inputContainer.style.marginBottom = "10px"; // Отступ между группами полей ввода
    inputContainer.style.display = "flex"; // Устанавливаем расположение элементов в строку
    inputContainer.style.justifyContent = "space-between";
    inputContainer.style.alignItems = "center";
    inputContainer.appendChild(document.createTextNode(input.name + ":    "));
    inputContainer.appendChild(input);

    modal.appendChild(inputContainer);


 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Добавляем заголовок после восьмого поля
  var titles = [
  "ОКНО РАЗМЕТКИ",
  "ОКНО ЗАКРАСКИ",
  "ОКНО ПОВОРОТА",
  "РАЗМЕТКА ПО КОМНАТЕ",
  "ADDITIONAL PROPERTIES",
  "ТЕГИ",
  "ДРУГOЕ",
  "КОМЕНТАРИИ БП",
  "ТАКС ФОТОШОПА"
];
for (var j = 0; j < titles.length; j++) {
  if (i === [7, 15, 22, 28, 31, 39, 43, 72, 96][j]) {
    var titleAfterEighthInput = document.createElement("div");
    titleAfterEighthInput.textContent = titles[j];
    titleAfterEighthInput.style.display = "flex"; // Устанавливаем расположение элементов в строку
    titleAfterEighthInput.style.marginTop = "15px"; // Отступ сверху после восьмого поля
    titleAfterEighthInput.style.marginBottom = "10px";
    titleAfterEighthInput.style.fontSize = "18px"; // Размер текста
    titleAfterEighthInput.style.fontWeight = "bold";
    titleAfterEighthInput.style.color = "#317eac"; // Цвет текста
    modal.appendChild(titleAfterEighthInput);
    break;
  }
} }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////Создание изображения вместо кнопки очистки данных
    var clearButton = document.createElement("img");
    clearButton.src = "https://i.imgur.com/cUTfpPA.png"; // Укажите путь к вашему изображению
    clearButton.alt = "Очистить данные";
    clearButton.onclick = clearData;
    clearButton.style.width = "35px"; // Устанавливаем ширину изображения
    clearButton.style.height = "35px"; // Устанавливаем высоту изображения
    clearButton.style.cursor = "pointer"; // Устанавливаем курсор при наведении на изображение
    modal.appendChild(clearButton);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////Создание изображения для кнопки скачивания данных
    var downloadButtonImg = document.createElement("img");
    downloadButtonImg.src = "https://i.imgur.com/tH3khiT.png"; // Укажите путь к вашей иконке
    downloadButtonImg.alt = "Скачать данные";
    downloadButtonImg.style.width = "35px"; // Устанавливаем ширину изображения
    downloadButtonImg.style.height = "35px"; // Устанавливаем высоту изображения
    downloadButtonImg.style.cursor = "pointer"; // Устанавливаем курсор при наведении на изображение
    modal.appendChild(downloadButtonImg);
// Добавление обработчика события клика на кнопку скачивания данных
    downloadButtonImg.onclick = downloadData;
// Функция для скачивания данных в формате JSON
function downloadData() {
    var data = localStorage.getItem("hotkeys"); // Получаем данные из локального хранилища
    if (data) {
        // Создаем объект Blob для данных в формате JSON
        var blob = new Blob([data], { type: "application/json" });
        // Создаем ссылку для скачивания
        var url = URL.createObjectURL(blob);
        // Создаем элемент 'a' для скачивания
        var link = document.createElement("a");
        link.href = url;
        link.download = "hotkeys.json"; // Имя файла для скачивания
        // Автоматически эмулируем клик для скачивания файла
        link.click();
        // Освобождаем объект URL, чтобы предотвратить утечки памяти
        URL.revokeObjectURL(url);
    } else {
        alert("Нет данных для скачивания!");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Создание изображения для кнопки импорта данных
    var importButtonImg = document.createElement("img");
    importButtonImg.src = "https://i.imgur.com/lvJRNkb.png"; // Укажите путь к вашей иконке
    importButtonImg.alt = "Импортировать данные";
    importButtonImg.style.width = "35px"; // Устанавливаем ширину изображения
    importButtonImg.style.height = "35px"; // Устанавливаем высоту изображения
    importButtonImg.style.cursor = "pointer"; // Устанавливаем курсор при наведении на изображение
    modal.appendChild(importButtonImg);
    // Добавление обработчика события клика на кнопку импорта данных
    importButtonImg.onclick = function() {
    // Создаем элемент input для загрузки файла
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; // Принимаем только файлы с расширением .json
    // Обработчик события изменения выбранного файла
    input.onchange = function(event) {
        var file = event.target.files[0]; // Получаем выбранный файл
        var reader = new FileReader();
        // Обработчик события загрузки файла
        reader.onload = function(event) {
            var jsonData = event.target.result; // Получаем данные файла в формате JSON
            try {
                var parsedData = JSON.parse(jsonData); // Парсим JSON данные
                localStorage.setItem("hotkeys", JSON.stringify(parsedData)); // Сохраняем данные в локальное хранилище
                alert("Данные успешно импортированы и сохранены!");
                closeModal();
                location.reload(); // Перезагрузка страницы
            } catch (error) {
                alert("Ошибка при разборе JSON файла: " + error.message);
            }
        };
        // Читаем содержимое выбранного файла в формате текста
        reader.readAsText(file);
    };
    // Автоматически эмулируем клик для открытия диалога выбора файла
    input.click();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Создание изображения вместо кнопки сохранения данных
    var saveButton = document.createElement("img");
    saveButton.src = "https://i.imgur.com/9UtBf8v.png"; // Укажите путь к вашему изображению
    saveButton.alt = "Сохранить данные";
    saveButton.onclick = function() {
    saveData();
    //closeModal(); // Закрытие модального окна после сохранения данных
    };
    saveButton.style.width = "35px"; // Устанавливаем ширину изображения
    saveButton.style.height = "35px"; // Устанавливаем высоту изображения
    saveButton.style.cursor = "pointer"; // Устанавливаем курсор при наведении на изображение
    modal.appendChild(saveButton);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Создание div контейнера для кнопок
    var buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex"; // Используем flexbox
    buttonsContainer.style.justifyContent = "space-between"; // Равномерно распределяем кнопки

    // Добавление кнопки очистки данных в контейнер
    buttonsContainer.appendChild(clearButton);
    // Добавление кнопки скачивания данных в контейнер
    buttonsContainer.appendChild(downloadButtonImg);
    // Добавление кнопки импорта данных в контейнер
    buttonsContainer.appendChild(importButtonImg);
    // Добавление кнопки сохранения данных в контейнер
    buttonsContainer.appendChild(saveButton);
    // Добавление контейнера с кнопками в модальное окно
    modal.appendChild(buttonsContainer);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Создание div контейнера для подписей
    var labelsContainer = document.createElement("div");
    // Пример стилей для контейнера с подписями
    labelsContainer.style.display = "flex"; // Используем flexbox
    labelsContainer.style.justifyContent = "space-between"; // Равномерно распределяем подписи
    // Создаем и добавляем названия
    var labelNames = ["CLEAR", "EXPORT", "IMPORT", "SAVE"];
    var labelStyles = {
    fontSize: "12px", // Размер шрифта
    color: "blue", // Цвет шрифта
    fontWeight: "bold", // Жирный шрифт
    //margin: "10 10px" // Внешний отступ слева и справа
};
    // Создаем и добавляем метки
    labelNames.forEach(function(name) {
    var label = document.createElement("div");
    label.textContent = name;
    Object.keys(labelStyles).forEach(function(style) {
        label.style[style] = labelStyles[style];
    });
    labelsContainer.appendChild(label);
});
    // Теперь вы можете добавить этот контейнер на страницу, например:
    modal.appendChild(labelsContainer);

/////////////////////////////////////////////////////////////////////////////////////////////////// Создание кнопки для открытия/закрытия модального окна
    var openButton = document.createElement("button");
    openButton.style.position = "fixed";
    openButton.style.bottom = "10px";
    openButton.style.right = "10px";
    // Создание изображения для кнопки
    var openButtonImg = document.createElement("img");
    openButtonImg.src = "https://i.imgur.com/cP2nDCj.png"; // Укажите путь к вашей иконке
    openButtonImg.alt = "Горячие клавиши";
    openButtonImg.style.width = "40px"; // Устанавливаем ширину изображения
    openButtonImg.style.height = "40px"; // Устанавливаем высоту изображения
    openButton.appendChild(openButtonImg);
    document.body.appendChild(openButton);
    // Обработчик события для открытия/закрытия модального окна
    document.body.addEventListener("click", function(event) {
    // Если кликнули на кнопку или на изображение внутри кнопки
    if (event.target === openButton || event.target === openButtonImg) {
        toggleModal();
    }
    // Проверка: если кликнули вне модального окна (не является его потомком)
    else if (!modal.contains(event.target)) {
        // Закрытие модального окна
        closeModal();
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////// Функция для открытия и закрытия модального окна
function toggleModal() {
    if (modal.style.display === "none") {
        modal.style.display = "block"; // Показать модальное окно
    } else {
        modal.style.display = "none"; // Скрыть модальное окно
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = "none";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Функция для сохранения данных
function saveData() {
    var data = [];
    var hotkeys = {};
    var hasDuplicate = false;
    // Заполняем массив data, чтобы сохранить порядок значений в соответствии с индексами полей ввода
    inputFields.forEach(function(input, index) {
        var hotkey = input.value.trim();
        if (!hotkey) hotkey = " "// Если поле ввода пустое, добавляем пустую строку в массив data
        data[index] = hotkey; // Заполняем массив data в соответствии с индексами полей ввода
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Проверяем наличие дубликатов и выделяем их
    inputFields.forEach(function(input) {
        var hotkey = input.value.trim();
        if (hotkey && hotkeys[hotkey]) {
            input.style.backgroundColor = "red"; // Выделяем дубликаты красным цветом
            if (!hasDuplicate) {
                alert("Горячая клавиша '" + hotkey + "' уже существует. Пожалуйста, используйте уникальные горячие клавиши.");
                hasDuplicate = true;
            }
        } else {
            input.style.backgroundColor = ""; // Возвращаем обычный цвет фона, если не дубликат
            hotkeys[hotkey] = true;
        }
    });
    // Если нет дубликатов, сохраняем данные
    if (!hasDuplicate) {
        localStorage.setItem("hotkeys", JSON.stringify(data));
        alert("Данные успешно сохранены!");
        closeModal();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Функция для очистки данных
    function clearData() {
        localStorage.removeItem("hotkeys");
        inputFields.forEach(function(input) {
            input.value = "";
        });
        alert("Данные успешно очищены!");
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Восстановление данных из локального хранилища при загрузке страницы
    window.addEventListener("load", function() {
        var savedData = localStorage.getItem("hotkeys");
        if (savedData) {
            var parsedData = JSON.parse(savedData);
            inputFields.forEach(function(input, index) {
                input.value = parsedData[index] || ""; // Проверяем, есть ли сохраненные данные для данного индекса
                hotkeys[input.value] = true; // Заполнение объекта для проверки уникальности горячих клавиш
            });
        }
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Обработчик события нажатия клавиши в модальном окне
    modal.addEventListener("keydown", function(event) {
    event.stopPropagation(); // Остановка всплытия события, чтобы предотвратить вызов обработчика события нажатия клавиши в окне window
    event.preventDefault(); // Предотвращаем стандартное поведение
    var focusedInput = document.querySelector(":focus");
    if (focusedInput && inputFields.includes(focusedInput)) {
        if (event.key === "Delete") {
            focusedInput.value = "";
            return;
        }
        var combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        if (event.metaKey) combination += "Command +";
        combination += event.code; // Формируем строку комбинации клавиш
        focusedInput.value = combination; // Записываем комбинацию клавиш
    }

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.addEventListener('keydown', function(event) {
    // Проверяем, если фокус находится в текстовом поле, то не обрабатываем горячие клавиши
   if (document.activeElement.tagName === 'INPUT' || document.activeElement.type === 'text') {
        return;
    }
    // Получаем сохраненные горячие клавиши из localStorage
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    // Проверяем, есть ли сохраненные горячие клавиши
    if (hotkeys && hotkeys.length > 0) {
        // Формируем строку комбинации клавиш
       var combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        combination += event.code; // Формируем строку комбинации клавиш
        // Проверяем, если комбинация клавиш соответствует одной из сохраненных
        if (hotkeys.includes(combination)) {
            // Предотвращаем стандартное действие браузера
            event.preventDefault();

            // Здесь вы можете выполнить свои действия вместо стандартного действия браузера
            console.log('Выполнено действие для горячей клавиши:', combination);
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SIMPLE=>CASTOP=POISON:
// Добавляем обработчик события нажатия клавиш
var currentIndex = 0; // Глобальная переменная для хранения индекса текущей кнопки
function handleHotkeys(event) {// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    if (hotkeys && hotkeys.length >= 1) { // Проверяем, существует ли hotkeys и есть ли хотя бы два элемента
        var combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        if (event.metaKey) combination += "Command +";
        combination += event.code; // Формируем строку комбинации клавиш
        if (hotkeys[0] === combination) { // Проверяем первое значение

            var buttonSelectors = [
                '#btn-use-simple-editor',
                '#btn-use-custom-editor',
                '#btn-use-position-editor'
            ];
            var button = document.querySelector(buttonSelectors[currentIndex]);
            // Проверяем, существует ли кнопка
            if (button) {
                // Имитируем клик по кнопке
                button.click();
                // Увеличиваем индекс для следующего нажатия
                currentIndex = (currentIndex + 1) % buttonSelectors.length;
            }
        }
    }
}
    // Добавляем обработчик события нажатия клавиш
    document.addEventListener("keydown", handleHotkeys);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////WIDGET
    // Функция для обработки нажатия горячих клавиш
function handleHotkeyswidget(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 3 && hotkeys[2] === combination) { // Проверяем второе значение
        // Проверяем наличие селектора body > div.ui-widget-overlay.ui-front
        var widgetOverlay = document.querySelector('body > div.ui-widget-overlay.ui-front');
        if (!widgetOverlay) { // Если селектор отсутствует
            // Кликаем по первому селектору
            var btnWidget = document.querySelector('#btn-widget');
            if (btnWidget) {
                btnWidget.click();
            }
        } else { // Если селектор присутствует
            // Кликаем по второму селектору
            var dialogButton = document.querySelector('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
            if (dialogButton) {
                dialogButton.click();

            }
        }
    }
}
document.addEventListener("keydown", handleHotkeyswidget);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SAVE AND PR
    // Функция для обработки нажатия горячих клавиш
function handleHotkeyssap(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 5 && hotkeys[4] === combination) { // Проверяем второе значение
        // Проверяем наличие селектора body > div.ui-widget-overlay.ui-front
        var widgetOverlay = document.querySelector('body > div.ui-widget-overlay.ui-front');
        if (!widgetOverlay) { // Если селектор отсутствует
            // Кликаем по первому селектору
            var btnWidget = document.querySelector('#btn-save-and-preview');
            if (btnWidget) {
                btnWidget.click();
            }
        } else { // Если селектор присутствует
            // Кликаем по второму селектору
            var dialogButton = document.querySelector('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
            if (dialogButton) {
                dialogButton.click();
            }
        }
    }
}
document.addEventListener("keydown", handleHotkeyssap);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ОСНОВНЫЕ ЭЛЕМЕНТЫ
function handleHotkeysall(event, index, selector) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";

    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command+";
    combination += event.code;

    if (hotkeys.length >= index && hotkeys[index] === combination) {
        var element = document.querySelector(selector);
        if (element) {
            if (index === 1) {
                // Специальный случай для индекса 1: отправляем события мыши
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                element.dispatchEvent(mouseDownEvent);
                element.dispatchEvent(clickEvent);
                element.dispatchEvent(mouseUpEvent);
            } else {
                // Обычный случай: просто клик
                element.click();
            }
        } else {
            console.log("Элемент не найден");
        }
    }
}

var hotkeyBindings = [
    { index: 1, selector: "#form-save > div.bag-details-wrapper.left-col > div.Link > a" },
    { index: 3, selector: "#btn-save-and-next" },
    // { index: 4, selector: "#btn-save-and-preview" },
    { index: 5, selector: "#form-save > div.bag-details-wrapper.left-col > div.buttons > div.sRowBtn > div.auditLink > a" },
    // { index: 8, selector: "#tng-product-ruler" },
    { index: 9, selector: "#drawDefaultLengthHeightArrowsBtn" },
    { index: 10, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox1 > a:nth-child(9)" },
    { index: 11, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox1 > a:nth-child(8)" },
    { index: 12, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox1 > a:nth-child(7)" },
    { index: 13, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox1 > a:nth-child(6)" },
    { index: 14, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox1 > a:nth-child(5)" },
    { index: 15, selector: "#clearAll" },
    // { index: 16, selector: "#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(2)" },
    { index: 17, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox2 > a:nth-child(3)" },
    { index: 18, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox2 > a:nth-child(5)" },
    { index: 19, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox2 > a:nth-child(6)" },
    { index: 20, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox2 > a:nth-child(7)" },
    { index: 21, selector: "#fillCanvasButton" },
    { index: 22, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox2 > a.tng-erase-all-icon.btn.pull-right" },
    // { index: 23, selector: "#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(4)" },
    { index: 24, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.flip-img-btn.tng-flip-horizontal-icon.btn.pull-left" },
    { index: 25, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.flip-img-btn.tng-flip-vertical-icon.btn.pull-left" },
    { index: 26, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.tng-rotate-image-icon-90.btn.pull-left" },
    { index: 27, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.tng-rotate-image-icon-180.btn.pull-left" },
    { index: 28, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.save-img-btn.tng-save-img-icon.btn.pull-right" },
    // { index: 29, selector: "#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(5)" },
    { index: 30, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox4 > a.add-rectangle-btn.tng-add-rectangle-icon.btn.pull-left" },
    { index: 31, selector: "#svgRed_Content > div.red_footer.clearfix > div.toolbox4 > a.erase-all-btn.tng-erase-all-icon.btn.pull-right" },
    { index: 44, selector: "#hideDescription" },
    { index: 54, selector: "#similar-products > ul > li > img" },
    { index: 59, selector: "#btn-save" },
    { index: 60, selector: "#btn-to-complex" },
    { index: 61, selector: "#btn-to-doubtful" },
    { index: 63, selector: "#btn-crop" },
    { index: 64, selector: "#btn-locked" },
    { index: 65, selector: "#btn-crop-product-image" },
    { index: 66, selector: "#btn-trim-product-image" },
    { index: 97, selector: "#open-original-button" },
    { index: 98, selector: "#open-preprocessed-button" },
    //АПРУВ { index: 60, selector: "body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2) > span" },
];

hotkeyBindings.forEach(function(binding) {
    document.addEventListener("keydown", function(event) {
        handleHotkeysall(event, binding.index, binding.selector);
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ОКНА РАЗМЕТКИ, ПОВОРОТА, ЗАКРАСКИ, КОМНАТЫ
function handleHotkeys20(event, index, firstSelector, secondSelector) {
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code;
    if (hotkeys.length >= index && hotkeys[index - 1] === combination) {
        var btnWidget = document.querySelector('#btn-use-custom-editor');
        if (btnWidget) {
            btnWidget.click();
            setTimeout(function() {
                var secondElement = document.querySelector(secondSelector);
                if (secondElement) {
                    secondElement.click();
                }
            }, 50);
        }
    }
}

document.addEventListener("keydown", function(event) {
    handleHotkeys20(event, 9, '#btn-use-custom-editor', '#tng-product-ruler'); // ОКНО РАЗМЕТКИ
});

document.addEventListener("keydown", function(event) {
    handleHotkeys20(event, 17, '#btn-use-custom-editor', '#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(2)'); // ОКНО Закраски
});

document.addEventListener("keydown", function(event) {
    handleHotkeys20(event, 24, '#btn-use-custom-editor', '#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(4)'); // ОКНО ПОВОРОТА
});

document.addEventListener("keydown", function(event) {
    handleHotkeys20(event, 30, '#btn-use-custom-editor', '#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(5)'); // ОКНО ПО КОМНАТЕ
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Additional Properties
function handleHotkeysCheckbox(event, index, selector, notificationCallback) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш

    if (hotkeys.length >= index + 1 && hotkeys[index] === combination) {
        var element = document.querySelector(selector);
        // Проверяем, существует ли элемент
        if (element) {
            // Вызываем функцию оповещения
            notificationCallback(element);
            element.click();
        }
    }
}
// Функции оповещения для каждого чекбокса
function gravityNotification(element) {
    if (element.checked) {
        alert("Гравитация отключена");
    } else {
        alert("Гравитация включена");
    }
}

function lifestyleNotification(element) {
    if (element.checked) {
        alert("Lifestyle отключена");
    } else {
        alert("Lifestyle включена");
    }
}

function humanModeNotification(element) {
    if (element.checked) {
        alert("HumanMode отключена");
    } else {
        alert("HumanMode включена");
    }
}

function excludeARNotification(element) {
    if (element.checked) {
        alert("AR включен");
    } else {
        alert("AR отключен");
    }
}

function excludeWFINotification(element) {
    if (element.checked) {
        alert("WFI включен");
    } else {
        alert("WFI отключен");
    }
}

function excludeRoomViewNotification(element) {
    if (element.checked) {
        alert("RoomView включен");
    } else {
        alert("RoomView отключен");
    }
}

function excludeOnModeNotification(element) {
    if (element.checked) {
        alert("OnMode включен");
    } else {
        alert("OnMode отключен");
    }
}

function threeDReadyNotification(element) {
    if (element.checked) {
        alert("Ready for 3D отключена");
    } else {
        alert("Ready for 3D включена");
    }
}

// Добавляем обработчик события нажатия клавиш
document.addEventListener("keydown", function(event) {
    handleHotkeysCheckbox(event, 32, '#IsGravityAvailable', gravityNotification);
    handleHotkeysCheckbox(event, 33, '#IsLifestyleAvailable', lifestyleNotification);
    handleHotkeysCheckbox(event, 34, '#IsHumanModeAvailable', humanModeNotification);
    handleHotkeysCheckbox(event, 35, '#ExcludeAR', excludeARNotification);
    handleHotkeysCheckbox(event, 36, '#ExcludeWFI', excludeWFINotification);
    handleHotkeysCheckbox(event, 37, '#ExcludeRoomView', excludeRoomViewNotification);
    handleHotkeysCheckbox(event, 38, '#ExcludeOnModel', excludeOnModeNotification);
    handleHotkeysCheckbox(event, 39, '#ThreeDReady', threeDReadyNotification);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////IST
var selectorsist = ['#btn-use-ist', '#close-button']; // Массив селекторов
var currentIndexist = 0; // Индекс текущего селектора
function handleHotkeysist(event) {// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys && hotkeys.length >= 7 && hotkeys[6] === combination) { // Проверяем наличие hotkeys и второго значения
        var currentSelector = selectorsist[currentIndexist]; // Получаем текущий селектор
        // Открываем ссылку с указанным текущим селектором
        var element = document.querySelector(currentSelector);
        // Проверяем, существует ли элемент
        if (element) {
            // Имитируем клик по элементу
            element.click();
        } else {
            console.log("Элемент не найден.");
        }
        // Переключаемся на следующий селектор
        currentIndexist = (currentIndexist + 1) % selectorsist.length;
    }
}
document.addEventListener("keydown", handleHotkeysist);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////DEFECT
var selectorsDEFECT = ['#form-save > div.bag-details-wrapper.left-col > div.buttons > div:nth-child(6) > button.btn.btn-danger', '#cancelRejection']; // Массив селекторов
var currentIndexDEFECT = 0; // Индекс текущего селектора
function handleHotkeysDEFECT(event) {
// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys && hotkeys.length >= 8 && hotkeys[7] === combination) { // Проверяем наличие hotkeys и второго значения
        var currentSelector = selectorsDEFECT[currentIndexDEFECT]; // Получаем текущий селектор
        // Открываем ссылку с указанным текущим селектором
        var element = document.querySelector(currentSelector);
        // Проверяем, существует ли элемент
        if (element) {
            // Имитируем клик по элементу
            element.click();
        } else {
            console.log("Элемент не найден.");
        }
        // Переключаемся на следующий селектор
        currentIndexDEFECT = (currentIndexDEFECT + 1) % selectorsDEFECT.length;
    }
}
document.addEventListener("keydown", handleHotkeysDEFECT);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////TAGS
function handleHotkeysTags(index, trIndex) {
    return function(event) {
        // Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Forming the key combination string
    if (hotkeys && hotkeys.length >= index + 2 && hotkeys[index] === combination) {
      var editTags = document.querySelector('#editTagsBtn');
      if (editTags) {
        editTags.click();
        setTimeout(function() {
          var editTags = document.querySelector('#editTagsDialog > div.modal-body > table > tbody > tr:nth-child(' + trIndex + ') > td > input');
          if (editTags) {
            editTags.click();
            setTimeout(function() {
              var editTags = document.querySelector('#editTagsDialog > div.modal-header > button');
              if (editTags) {
                editTags.click();
              }
            }, 0);
          }
        }, 0);
      }
    }
  };
}
document.addEventListener('keydown', handleHotkeysTags(40, 4)); // FEMALE
document.addEventListener('keydown', handleHotkeysTags(41, 7)); // MALE
document.addEventListener('keydown', handleHotkeysTags(42, 8)); // UNISEX
document.addEventListener('keydown', handleHotkeysTags(43, 6)); // INFANT

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UPLOAD
function handleHotkeysUPLOAD(event) {
// Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys && hotkeys.length >= 46 && hotkeys[45] === combination) { // Проверяем наличие hotkeys и второго значения
        // Находим элемент input по атрибуту name="qqfile"
var inputFileElement = document.querySelector('input[name="qqfile"]');
// Проверяем, существует ли такой элемент
if (inputFileElement) {
    // Создаем событие клика
    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    // Диспатчим (испускаем) событие клика на элемент
    inputFileElement.dispatchEvent(clickEvent);
} else {
    console.log('Элемент input с именем "qqfile" не найден.');
}
    }
    };
document.addEventListener("keydown", handleHotkeysUPLOAD);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADD
function handleHotkeysadd(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys && hotkeys.length >= 47 && hotkeys[46] === combination) { // Проверяем наличие hotkeys и второго значения
        // Находим элемент input по атрибуту name="qqfile"
        var inputFileElement = document.querySelector('#uploadImageToProduct');
        // Проверяем, существует ли такой элемент
        if (inputFileElement) {
            // Создаем событие клика
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });

            // Диспатчим (испускаем) событие клика на элемент
            inputFileElement.dispatchEvent(clickEvent);

            // Показываем уведомление о загрузке картинки через 1 секунду
            setTimeout(function() {
                alert("Картинка загружается, дождитесь обновления страницы");
            }, 300);
        } else {
            console.log('Элемент input с именем "qqfile" не найден.');
        }
    }
}

document.addEventListener("keydown", handleHotkeysadd);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////РАЗМЕРЫ
function handleHotkeyssize(event, widthValue) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    // Проверяем, имеет ли указанный селектор класс "pending-val"
    var pendingElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(7) > span > input.combo-text.validatebox-text.pending-val');
    if (pendingElement) {
        return; // Если элемент с классом "pending-val" найден, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш

    var index;
    switch (widthValue) {
        case '5.4':
            index = 47;
            break;
        case '6.4':
            index = 48;
            break;
        case '4.9':
            index = 49;
            break;
        case '1.732':
            index = 50;
            break;
        case '1.735':
            index = 51;
            break;
        case '1.976':
            index = 52;
            break;
        case '1.984':
            index = 53;
            break;
        default:
            return;
    }
    if (hotkeys.length >= index + 1 && hotkeys[index] === combination) {
        function updateAndConvert(parameterName, value) {
            let hiddenInputElement = document.querySelector('.cm-inputs .combo-value[name="' + parameterName + '"]');
            let visibleInputElement = document.querySelector('.cm-inputs .combo-text');

            if (hiddenInputElement && visibleInputElement) {
                hiddenInputElement.value = value;
                visibleInputElement.value = value;
                visibleInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                let convertButton = document.querySelector('.convert-numbers-to-measure-btn');

                if (convertButton) {
                    convertButton.click();
                }
            } else {
                console.log("StatusId is hidden.");
            }
        }
        updateAndConvert('CurrentDepth', '0');
        updateAndConvert('CurrentWidth', widthValue);
        updateAndConvert('CurrentHeight', '0');
    }
}

document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '5.4');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '6.4');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '4.9');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '1.732');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '1.735');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '1.976');
});
document.addEventListener("keydown", function(event) {
    handleHotkeyssize(event, '1.984');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////КАРТИНКУ С ВАРИАЦИИ:
// Функция для обработки нажатия горячих клавиш
    function handleHotkeyvar(event) {// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 56 && hotkeys[55] === combination) { // Проверяем второе значение
        function simulateDoubleClick(selector) {
    var element = document.querySelector(selector);
    if (element) {
        var event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    } else {
        console.error('Элемент не найден:', selector);
    }
}
simulateDoubleClick('#similar-products > ul > li > img');
  }
}
document.addEventListener("keydown", handleHotkeyvar);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////КАРТИНКУ И РАЗМЕР:
// Функция для обработки нажатия горячих клавишКАРТИНКУ И РАЗМЕР:
    function handleHotkeyvar2(event) {// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 57 && hotkeys[56] === combination) { // Проверяем второе значение
        // Функция для имитации одиночного клика с задержкой
function simulateSingleClick(selector) {
    var element = document.querySelector(selector);
    if (element) {
        setTimeout(function() {
            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        }, 50); // Задержка в 1 секунду
    } else {
        console.error('Элемент не найден:', selector);
    }
}

// Функция для имитации двойного клика
function simulateDoubleClick(selector) {
    var element = document.querySelector(selector);
    if (element) {
        var event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
        // Добавляем одиночный клик с задержкой
        simulateSingleClick(selector);
    } else {
        console.error('Элемент не найден:', selector);
    }
}

// Использование функции с указанным селектором
simulateDoubleClick('#similar-products > ul > li > img');
  }
}
document.addEventListener("keydown", handleHotkeyvar2);

// Функция для обработки нажатия горячих клавиш Поворот
function handleHotkeys180(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";

    // Формируем строку комбинации клавиш
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code;

    // Проверяем комбинацию клавиш
    if (hotkeys.length >= 58 && hotkeys[57] === combination) {
        // Открываем ссылки с указанными селекторами с задержкой

        // Первый клик
        var btnUseCustomEditor = document.querySelector('#btn-use-custom-editor');
        if (btnUseCustomEditor) {
            setTimeout(function() {
                btnUseCustomEditor.click();
            }, 0);
        }

        // Второй клик
        setTimeout(function() {
            var secondLink = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(4)');
            if (secondLink) {
                secondLink.click();
            }
        }, 50);

        // Третий клик
        setTimeout(function() {
            var thirdLink = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.tng-rotate-image-icon-180.btn.pull-left');
            if (thirdLink) {
                thirdLink.click();
            }
        }, 100);

        // Четвертый клик
        setTimeout(function() {
            var fourthLink = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.toolbox3 > a.save-img-btn.tng-save-img-icon.btn.pull-right');
            if (fourthLink) {
                fourthLink.click();
            }

            // Пятый клик
            setTimeout(function() {
                var fifthLink = document.querySelector('#tng-product-ruler');
                if (fifthLink) {
                    fifthLink.click();
                }

                // Добавляем обработчик для события закрытия окна оповещения
                setTimeout(function() {
                    // Выполняем дополнительный клик после закрытия окна оповещения
                    var btnUseCustomEditorAfterNotification = document.querySelector('#btn-use-custom-editor');
                    if (btnUseCustomEditorAfterNotification) {
                        btnUseCustomEditorAfterNotification.click();
                    }
                }, 500); // Предполагаемая задержка перед появлением окна оповещения
            }, 200); // Предполагаемая задержка перед выполнением пятого клика
        }, 150); // Предполагаемая задержка перед выполнением четвертого клика
    }
}

document.addEventListener("keydown", handleHotkeys180);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////СМ
   function handleHotkeyssm(event) {
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code;

    if (hotkeys.length >= 59 && hotkeys[58] === combination) {
        // Проверяем селекторы на наличие класса
        var selectors = [
            '#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5) > a',
            '#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(5) > a'
        ];

        var btnWidget = null;
        // Проверяем каждый селектор на наличие класса
        selectors.forEach(selector => {
            var element = document.querySelector(selector);
            if (element && element.classList.contains('convert-numbers-to-measure-btn-active')) {
                btnWidget = element;
            }
        });

        // Если нашли элемент с классом, кликаем по нему
        if (btnWidget) {
            btnWidget.click();
        }
    }
}

document.addEventListener("keydown", handleHotkeyssm);

function createHotkeyHandler(buttonId, hotkeyIndex) {
    var lastClickTime = 0; // Переменная для отслеживания времени последнего клика

    return function(event) {
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

        var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
        var combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        if (event.metaKey) combination += "Command +";
        combination += event.code;

        if (hotkeys.length >= hotkeyIndex && hotkeys[hotkeyIndex] === combination) {
            var currentTime = new Date().getTime();
            // Проверяем, прошло ли менее 2 секунд с момента последнего клика
            if (currentTime - lastClickTime <= 2000) {
                // Если прошло менее 500 миллисекунд с момента последнего клика, считаем это двойным кликом
                if (currentTime - lastClickTime <= 500) {
                    // Открываем ссылку с указанным селектором
                    var btnWidget = document.querySelector(buttonId);
                    if (btnWidget) {
                        // Создаем событие dblclick
                        var dblClickEvent = new MouseEvent('dblclick', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        // Диспатчим событие
                        btnWidget.dispatchEvent(dblClickEvent);
                    }
                }
                // Сбрасываем время последнего клика
                lastClickTime = 0;
            } else {
                // Если прошло более 2 секунд с момента последнего клика, обновляем время
                lastClickTime = currentTime;

                // Открываем ссылку с указанным селектором
                var btnWidget1 = document.querySelector(buttonId);
                if (btnWidget1) {
                    // Имитируем клик по элементу
                    btnWidget1.click();
                }
            }
        }
    };
}
document.addEventListener("keydown", createHotkeyHandler('#lowResolutionButton', 73));
document.addEventListener("keydown", createHotkeyHandler('#unusableAngleButton', 74));
document.addEventListener("keydown", createHotkeyHandler('#wrongImageButton', 75));
document.addEventListener("keydown", createHotkeyHandler('#noImageOnPDPButton', 76));
document.addEventListener("keydown", createHotkeyHandler('#notFrontViewButton', 77));
document.addEventListener("keydown", createHotkeyHandler('#imageNotWholeButton', 78));
document.addEventListener("keydown", createHotkeyHandler('#piecesOfProductsButton', 79));
document.addEventListener("keydown", createHotkeyHandler('#cannotRemoveBackgroundButton', 80));
document.addEventListener("keydown", createHotkeyHandler('#severalProductsButton', 81));
document.addEventListener("keydown", createHotkeyHandler('#noDimensionsOnPDPButton', 82));
document.addEventListener("keydown", createHotkeyHandler('#incorrectDimensionsButton', 83));
document.addEventListener("keydown", createHotkeyHandler('#scaledByWidthButton', 84));
document.addEventListener("keydown", createHotkeyHandler('#scaledByHeightButton', 85));
document.addEventListener("keydown", createHotkeyHandler('#oneDimensionButton', 86));
document.addEventListener("keydown", createHotkeyHandler('#noLengthOnThePDPButton', 87));
document.addEventListener("keydown", createHotkeyHandler('#noDepthOnThePDPButton', 88));
document.addEventListener("keydown", createHotkeyHandler('#duplicateButton', 89));
document.addEventListener("keydown", createHotkeyHandler('#doNotHaveTheGoodsButton', 90));
document.addEventListener("keydown", createHotkeyHandler('#errorButton', 91));
document.addEventListener("keydown", createHotkeyHandler('#redirectsToHomepageButton', 92));
document.addEventListener("keydown", createHotkeyHandler('#redirectsToCategoryPageButton', 93));
document.addEventListener("keydown", createHotkeyHandler('#wrongCategoryButton', 94));
document.addEventListener("keydown", createHotkeyHandler('#notSupportedButton', 95));
document.addEventListener("keydown", createHotkeyHandler('#ModerationBtn', 96));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ПРЕДЛОЖЕНЫЕ РАЗМЕРЫ
// Функция для обработки нажатия горячих клавиш
function handleHotkeys50(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
 // Проверяем, имеет ли указанный селектор класс "pending-val"
    var pendingElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(7) > span > input.combo-text.validatebox-text.pending-val');
    if (pendingElement) {
        return; // Если элемент с классом "pending-val" найден, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 63 && hotkeys[62] === combination) { // Проверяем второе значение

    // Получаем значения селекторов #Width, #Depth и #Height и удаляем пробелы в начале и в конце строки
    let widthElement = document.getElementById('Width');
    let widthValue = widthElement ? widthElement.textContent.trim() : '';

    let depthElement = document.getElementById('Depth');
    let depthValue = depthElement ? depthElement.textContent.trim() : '';

    let heightElement = document.getElementById('Height');
    let heightValue = heightElement ? heightElement.textContent.trim() : '';

    function updateAndConvert(parameterName, value) {
        let hiddenInputElement = document.querySelector('.cm-inputs .combo-value[name="' + parameterName + '"]');
        let visibleInputElement = document.querySelector('.cm-inputs .combo-text');

        if (hiddenInputElement && visibleInputElement) {
            hiddenInputElement.value = value;
            visibleInputElement.value = value;
            visibleInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            let convertButton = document.querySelector('.convert-numbers-to-measure-btn');

            if (convertButton) {
                convertButton.click();
            }
        } else {
            console.log("StatusId is hidden.");
        }
    }

    updateAndConvert('CurrentDepth', depthValue);
    updateAndConvert('CurrentWidth', widthValue);
    updateAndConvert('CurrentHeight', heightValue);
}

}
document.addEventListener("keydown", handleHotkeys50);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Скачаь гроу брилианс
// Функция для обработки нажатия горячих клавиш
function handleHotkeys51(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }
 // Проверяем, имеет ли указанный селектор класс "pending-val"
    var pendingElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(7) > span > input.combo-text.validatebox-text.pending-val');
    if (pendingElement) {
        return; // Если элемент с классом "pending-val" найден, прерываем выполнение скрипта
    }
    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 101 && hotkeys[100] === combination) { // Проверяем второе значение
// Массив селекторов
var selectors = [
    '#bgRemoveTable > tbody > tr:nth-child(1) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
    '#bgRemoveTable > tbody > tr:nth-child(2) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
    '#bgRemoveTable > tbody > tr:nth-child(3) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
    '#bgRemoveTable > tbody > tr:nth-child(4) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
    '#bgRemoveTable > tbody > tr:nth-child(5) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)'
];

// Перебираем каждый селектор
selectors.forEach(function(selector) {
    // Получаем элемент по селектору
    var linkElement = document.querySelector(selector);

    // Проверяем, был ли найден элемент
    if (linkElement) {
        // Получаем значение атрибута href (ссылку) из элемента
        var link = linkElement.href;

        // Заменяем "0" на "1" перед ".jpeg"
        var modifiedLink = link.replace(/0(?=\.jpeg)/, "1");

        // Создаем запрос fetch для загрузки файла
                fetch(modifiedLink)
                    .then(response => response.blob())
                    .then(blob => {
                        // Создаем ссылку для скачивания файла
                        var a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);

                        // Извлекаем имя файла из URL
                        var fileName = modifiedLink.substring(modifiedLink.lastIndexOf('/') + 1);

                        // Устанавливаем оригинальное имя файла
                        a.download = fileName;

                        // Программно кликаем по ссылке для скачивания файла
                        a.click();
                    });

        // Выводим измененную ссылку в консоль
        console.log("Измененная ссылка:", modifiedLink);
    } else {
        console.log("Элемент по селектору", selector, "не найден.");
    }
});

    }

}
document.addEventListener("keydown", handleHotkeys51);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Скачаь все картинка
function handleHotkeys52(event) {
    // Проверяем, находится ли фокус в текстовом поле
    if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    // Проверяем, имеет ли указанный селектор класс "pending-val"
    var pendingElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(7) > span > input.combo-text.validatebox-text.pending-val');
    if (pendingElement) {
        return; // Если элемент с классом "pending-val" найден, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    var combination = "";
    if (event.ctrlKey) combination += "Ctrl+";
    if (event.shiftKey) combination += "Shift+";
    if (event.altKey) combination += "Alt+";
    if (event.metaKey) combination += "Command +";
    combination += event.code; // Формируем строку комбинации клавиш
    if (hotkeys.length >= 100 && hotkeys[99] === combination) { // Проверяем второе значение
        // Массив селекторов
        var selectors = [
            '#bgRemoveTable > tbody > tr:nth-child(1) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
            '#bgRemoveTable > tbody > tr:nth-child(2) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
            '#bgRemoveTable > tbody > tr:nth-child(3) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
            '#bgRemoveTable > tbody > tr:nth-child(4) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)',
            '#bgRemoveTable > tbody > tr:nth-child(5) > td:nth-child(4) > div > div.multilink-cell > a:nth-child(1)'
        ];

        // Перебираем каждый селектор
        selectors.forEach(function(selector) {
            // Получаем элемент по селектору
            var linkElement = document.querySelector(selector);

            // Проверяем, был ли найден элемент
            if (linkElement) {
                // Получаем значение атрибута href (ссылку) из элемента
                var link = linkElement.href;

                // Создаем запрос fetch для загрузки файла
                fetch(link)
                    .then(response => response.blob())
                    .then(blob => {
                        // Создаем ссылку для скачивания файла
                        var a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);

                        // Извлекаем имя файла из URL
                        var fileName = link.substring(link.lastIndexOf('/') + 1);

                        // Устанавливаем оригинальное имя файла
                        a.download = fileName;

                        // Программно кликаем по ссылке для скачивания файла
                        a.click();
                    });

                // Выводим ссылку в консоль
                console.log("Ссылка для скачивания:", link);
            } else {
                console.log("Элемент по селектору", selector, "не найден.");
            }
        });
    }
}

document.addEventListener("keydown", handleHotkeys52);




})
();