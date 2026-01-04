// ==UserScript==
// @name         media panel
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  media panel in the catlife online
// @author       me
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543701/media%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/543701/media%20panel.meta.js
// ==/UserScript==

(function() {
    // Проверяем, существует ли уже панель, чтобы избежать дублирования
    if (document.getElementById('media-viewer-panel')) {
        console.log('Панель просмотра медиа уже существует.');
        return;
    }

    // --- 1. Создание структуры панели ---
    const panel = document.createElement('div');
    panel.id = 'media-viewer-panel';

    const header = document.createElement('div');
    header.id = 'media-viewer-header';
    header.innerHTML = 'Медиа-просмотрщик <span id="toggle-btn" style="cursor: pointer;">[ - ]</span>';

    const contentArea = document.createElement('div');
    contentArea.id = 'media-viewer-content';
    contentArea.innerHTML = '<p style="text-align: center; color: #aaa;">Перетащите сюда видео, GIF или фото</p>';

    panel.appendChild(header);
    panel.appendChild(contentArea);
    document.body.appendChild(panel);

    // --- 2. Стилизация и позиционирование (инлайн-стили для простоты в консоли) ---
    panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 300px; /* Начальная ширина */
        height: 300px; /* Начальная высота для видимости содержимого */
        max-height: 80vh; /* Максимальная высота относительно окна просмотра */
        min-height: 30px; /* Минимальная высота в свернутом виде (только заголовок) */
        background-color: #222;
        border: 1px solid #444;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Скрыть контент при свертывании */
        color: #eee;
        font-family: Arial, sans-serif;
        font-size: 14px;
        resize: both; /* Позволяет изменять размер панели */
        min-width: 150px;
        max-width: 80vw; /* Максимальная ширина относительно окна просмотра */
        transition: width 0.2s ease, height 0.2s ease; /* Плавное изменение размера */
    `;

    header.style.cssText = `
        background-color: #333;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #444;
        user-select: none; /* Запрещает выделение текста в заголовке */
    `;

    contentArea.style.cssText = `
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto; /* Прокрутка для содержимого */
        display: flex;
        flex-direction: column;
        gap: 10px; /* Промежуток между элементами */
        justify-content: flex-start; /* Элементы начинаются сверху */
        align-items: center; /* Центрирование медиа по горизонтали */
        min-width: 100px; /* Минимальная ширина контентной области */
        min-height: 50px; /* Минимальная высота контентной области */
    `;

    // --- 3. Функциональность свертывания/развертывания панели ---
    const toggleBtn = document.getElementById('toggle-btn');
    let isCollapsed = false;toggleBtn.onclick = function() {
        if (isCollapsed) {
            contentArea.style.display = 'flex';
            panel.style.height = '300px'; // Возвращаем к начальной высоте
            panel.style.maxHeight = '80vh'; // Возвращаем максимальную высоту
            toggleBtn.textContent = '[ - ]';
        } else {
            contentArea.style.display = 'none';
            panel.style.height = '30px'; // Сворачиваем до высоты заголовка
            panel.style.maxHeight = '30px'; // Ограничиваем максимальную высоту
            toggleBtn.textContent = '[ + ]';
        }
        isCollapsed = !isCollapsed;
    };

    // --- 4. Функциональность Drag and Drop ---
    contentArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Разрешаем drop
        contentArea.style.backgroundColor = 'rgba(68, 68, 68, 0.3)'; // Визуальная обратная связь
    });

    contentArea.addEventListener('dragleave', (e) => {
        contentArea.style.backgroundColor = 'transparent'; // Убираем обратную связь
    });

    contentArea.addEventListener('drop', (e) => {
        e.preventDefault();
        contentArea.style.backgroundColor = 'transparent'; // Убираем обратную связь

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Удаляем начальное сообщение "Перетащите сюда..."
            if (contentArea.querySelector('p')) {
                contentArea.innerHTML = '';
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Проверяем тип файла: изображение или видео
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    // Создаем обертку для медиа и кнопки удаления
                    const mediaWrapper = document.createElement('div');
                    mediaWrapper.style.cssText = `
                        position: relative;
                        border: 1px solid #555;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-bottom: 5px; /* Отступ между элементами */
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        width: 100%; /* Обертка занимает всю доступную ширину */
                        display: flex; /* Для центрирования медиа внутри обертки */
                        justify-content: center;
                        align-items: center;
                        min-height: 50px; /* Минимальная высота для маленьких файлов */
                    `;

                    let mediaElement;
                    let objectURL; // Переменная для хранения URL, чтобы потом его отозвать

                    if (file.type.startsWith('image/')) {
                        mediaElement = document.createElement('img');
                        mediaElement.alt = file.name;
                        objectURL = URL.createObjectURL(file);
                        mediaElement.src = objectURL;
                    } else if (file.type.startsWith('video/')) {
                        mediaElement = document.createElement('video');
                        mediaElement.controls = true; // Добавляем элементы управления видео
                        mediaElement.autoplay = false; // Не автовоспроизводить по умолчанию
                        mediaElement.loop = true; // Зацикливать видео
                        mediaElement.muted = true; // Отключаем звук по умолчанию

                        objectURL = URL.createObjectURL(file);
                        mediaElement.src = objectURL;// *** Обработка ошибок для видео ***
                        mediaElement.onerror = function(e) {
                            console.error(`Ошибка загрузки или воспроизведения медиа: ${file.name}.`, e);
                            const errorDiv = document.createElement('div');
                            errorDiv.style.cssText = `
                                color: red;
                                padding: 10px;
                                text-align: center;
                                background-color: #333;
                                border-top: 1px solid #555;
                                width: 100%;
                            `;
                            errorDiv.textContent = `Ошибка: Не удалось загрузить или воспроизвести "${file.name}"`;

                            mediaWrapper.innerHTML = ''; // Очищаем обертку
                            mediaWrapper.appendChild(errorDiv);
                            mediaWrapper.appendChild(closeButton); // Важно: заново добавить кнопку закрытия

                            // Отозвать URL, если ошибка произошла после его создания
                            if (objectURL) {
                                URL.revokeObjectURL(objectURL);
                                objectURL = null; // Обнуляем, чтобы не пытаться отозвать дважды
                            }
                        };
                    }

                    mediaElement.style.maxWidth = '100%'; // Масштабирование по ширине панели
                    mediaElement.style.height = 'auto'; // Сохранение пропорций
                    mediaElement.style.display = 'block';
                    mediaElement.style.borderRadius = '3px'; // Небольшое скругление углов медиа

                    // Добавляем кнопку удаления
                    const closeButton = document.createElement('span');
                    closeButton.classList.add('close-button'); // Добавляем класс для идентификации
                    closeButton.innerHTML = '&times;'; // Символ "крестик"
                    closeButton.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background-color: rgba(0, 0, 0, 0.6);
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 1; /* Для лучшего выравнивания символа */
                        padding-bottom: 2px;
                        transition: background-color 0.2s ease;
                        z-index: 1; /* Убедимся, что кнопка поверх медиа */
                    `;
                    closeButton.title = 'Удалить файл';
                    // Эффект при наведении
                    closeButton.onmouseover = () => closeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
                    closeButton.onmouseout = () => closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

                    closeButton.onclick = () => {
                        mediaWrapper.remove(); // Удаляем всю обертку с медиа
                        // Очень важно: отзываем URL, чтобы освободить память
                        if (objectURL) {
                            URL.revokeObjectURL(objectURL);
                            console.log(`URL отозван: ${objectURL}`);
                        }
                        // Если больше нет медиа, показываем подсказку снова
                        if (contentArea.children.length === 0) {
                            contentArea.innerHTML = '<p style="text-align: center; color: #aaa;">Перетащите сюда видео, GIF или фото</p>';
                        }
                    };mediaWrapper.appendChild(mediaElement);
                    mediaWrapper.appendChild(closeButton);
                    contentArea.appendChild(mediaWrapper);
                    // Прокручиваем к низу, чтобы показать новый контент
                    contentArea.scrollTop = contentArea.scrollHeight;
                } else {
                    console.warn(`Медиа-просмотрщик: Неподдерживаемый тип файла: ${file.name} (${file.type})`);
                }
            }
        }
    });

    console.log('Медиа-просмотрщик активирован. Панель в левом нижнем углу.');
    console.log('Панель неперемещаема, но ее можно изменять по размеру, потянув за края.');
    console.warn('Внимание: Запуск скриптов из консоли может быть небезопасным. Используйте этот скрипт только на надежных сайтах и понимая, что он делает.');

})();