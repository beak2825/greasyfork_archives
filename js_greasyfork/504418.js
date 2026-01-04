// ==UserScript==
// @name         Предпросмотр retro-archive.ru
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  Этот скрипт написан для комфортного поиска музыки на сайте audio.retro-archive.ru, поскольку там не имеется возможности слушать
// @author       https://lolz.live/kubokot/
// @match        audio.retro-archive.ru/record/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=retro-archive.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504418/%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20retro-archiveru.user.js
// @updateURL https://update.greasyfork.org/scripts/504418/%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20retro-archiveru.meta.js
// ==/UserScript==

(async () => {
    // Функция для поиска элемента по XPath
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // XPath к ссылке на загрузку аудио
    const downloadLinkXPath = '/html/body/main/div/div[5]/div/div/table/tbody/tr[3]/td/div/a[2]';
    const downloadLinkElement = getElementByXPath(downloadLinkXPath);

    // XPath к основной части названия файла
    const fileNamePrimaryXPath = '/html/body/main/div/div[2]/div/div[2]/table/tbody/tr[2]/td';
    const fileNamePrimaryElement = getElementByXPath(fileNamePrimaryXPath);

    // XPath к дополнительной части названия файла
    const fileNameSecondaryXPath = '/html/body/main/div/div[2]/div/div[2]/table/tbody/tr[1]/td';
    const fileNameSecondaryElement = getElementByXPath(fileNameSecondaryXPath);

    // XPath к ссылке на изображение
    const imageLinkXPath = '/html/body/main/div/div[5]/div/div/table/tbody/tr[3]/td/div/a[1]';
    const imageLinkElement = getElementByXPath(imageLinkXPath);

    if (downloadLinkElement && fileNamePrimaryElement && fileNameSecondaryElement && imageLinkElement) {
        // Получаем URL аудиофайла, части названия для файла и URL изображения
        const audioUrl = downloadLinkElement.href;
        const fileNamePrimary = fileNamePrimaryElement.textContent.trim();
        const fileNameSecondary = fileNameSecondaryElement.textContent.trim();
        const fileName = `${fileNamePrimary} ${fileNameSecondary}`;
        const imageUrl = imageLinkElement.href;

        try {
            // Загружаем аудиофайл и кэшируем его
            const audioResponse = await fetch(audioUrl);
            const audioBlob = await audioResponse.blob();
            const audioUrlCached = URL.createObjectURL(audioBlob);

            // Загружаем изображение и кэшируем его
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();
            const imageUrlCached = URL.createObjectURL(imageBlob);

            // Создаем аудиоплеер, кнопку загрузки трека и кнопку загрузки изображения
            const audioPlayerHTML = `
                <tr>
                    <th class="col-3">
                        <audio controls>
                            <source src="${audioUrlCached}" type="${audioBlob.type}">
                            Your browser does not support the audio element.
                        </audio>
                        <br>
                        <a href="${audioUrlCached}" download="${fileName}.${audioBlob.type.split('/')[1]}" class="download-button">
                            Скачать трек
                        </a>
                        <br>
                        <a href="${imageUrlCached}" download="${fileName}.${imageBlob.type.split('/')[1]}" class="download-button">
                            Скачать изображение
                        </a>
                    </th>
                </tr>
            `;

            // XPath к таблице, в которую нужно вставить плеер и кнопки
            const targetTableXPath = '/html/body/main/div/div[2]/div/div[2]/table/tbody';
            const targetTableElement = getElementByXPath(targetTableXPath);

            if (targetTableElement) {
                // Вставляем плеер и кнопки в начало таблицы
                targetTableElement.insertAdjacentHTML('afterbegin', audioPlayerHTML);
            } else {
                console.error('Не удалось найти таблицу для вставки аудиоплеера и кнопок загрузки.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке или кешировании файлов:', error);
        }
    } else {
        console.error('Не удалось найти один или несколько элементов: ссылка на аудио, части названия файла или ссылка на изображение.');
    }
})();