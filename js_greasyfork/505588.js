// ==UserScript==
// @name         salesdrive
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  скрипт для salesdrive з відкладеним виконанням
// @author       LanNet
// @match        https://e-oboi.salesdrive.me/ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesdrive.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505588/salesdrive.user.js
// @updateURL https://update.greasyfork.org/scripts/505588/salesdrive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false; // Прапорець для уникнення рекурсії
    let isTextareaInitialized = false; // Прапорець для ініціалізації textarea

    // Функція для перевірки URL
    function ensureAbsoluteUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    }

    // Функція для заміни посилань на зображення
    function replaceLinks(element) {
        const textContent = element.textContent.trim();
        const urls = textContent.split(/[\n,]+/).map(url => url.trim()).filter(url => url.match(/\.(jpeg|jpg|gif|png)$/i));

        if (urls.length > 0) {
            element.innerHTML = '';
            urls.forEach(url => {
                if (url) {
                    const absoluteUrl = ensureAbsoluteUrl(url);
                    const link = document.createElement('a');
                    link.href = absoluteUrl;
                    link.classList.add('lightbox-link');
                    const img = document.createElement('img');
                    img.src = absoluteUrl;
                    img.alt = 'Image';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.margin = '5px 0';
                    img.loading = 'lazy';
                    link.appendChild(img);
                    element.appendChild(link);
                }
            });
            addLightboxFunctionality();
        }
    }

    // Функція для лайтбокса
    function addLightboxFunctionality() {
        if (!document.querySelector('.lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">×</button>
                    <img src="" alt="Lightbox Image" />
                </div>
            `;
            document.body.appendChild(lightbox);

            const closeButton = lightbox.querySelector('.lightbox-close');
            closeButton.addEventListener('click', () => lightbox.style.display = 'none');
            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) lightbox.style.display = 'none';
            });
        }

        const links = document.querySelectorAll('.lightbox-link');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const lightbox = document.querySelector('.lightbox');
                const lightboxImage = lightbox.querySelector('img');
                lightboxImage.src = link.href;
                lightbox.style.display = 'flex';
            });
        });
    }

    // Функція для обробки textarea
    function processTextarea() {
        if (isProcessing) return; // Уникаємо рекурсії
        isProcessing = true;

        const textarea = document.querySelector('.form-group.task-tinymce textarea');
        if (!textarea) {
            console.log('Textarea not found');
            isProcessing = false;
            return;
        }

        console.log('Processing textarea content:', textarea.value);

        let imageContainer = textarea.nextElementSibling;
        if (!imageContainer || !imageContainer.classList.contains('image-container')) {
            imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            textarea.parentNode.insertBefore(imageContainer, textarea.nextSibling);
        }

        const urls = textarea.value
            .split(/[\n,]+/)
            .map(url => url.trim())
            .filter(url => url.match(/\.(jpeg|jpg|gif|png)$/i));
        imageContainer.innerHTML = '';

        urls.forEach(url => {
            if (url) {
                const absoluteUrl = ensureAbsoluteUrl(url);
                const link = document.createElement('a');
                link.href = absoluteUrl;
                link.classList.add('lightbox-link');
                const img = document.createElement('img');
                img.src = absoluteUrl;
                img.alt = 'Image';
                img.style.maxWidth = '100px';
                img.style.height = 'auto';
                img.style.margin = '5px';
                img.loading = 'lazy';
                link.appendChild(img);
                imageContainer.appendChild(link);
            }
        });

        addLightboxFunctionality();
        isProcessing = false;
    }

    // Ініціалізація обробки textarea
    function initTextareaProcessing() {
        if (isTextareaInitialized) return; // Уникаємо повторної ініціалізації
        const textarea = document.querySelector('.form-group.task-tinymce textarea');
        if (textarea) {
            console.log('Textarea found, initializing');
            isTextareaInitialized = true;
            processTextarea();
            textarea.addEventListener('input', () => {
                processTextarea();
            });
        } else {
            console.log('Textarea not found during initialization');
        }
    }

    // Спостерігач для появи textarea
    function observeTextarea() {
        const observer = new MutationObserver((mutations, obs) => {
            if (isProcessing || isTextareaInitialized) return;
            const textarea = document.querySelector('.form-group.task-tinymce textarea');
            if (textarea) {
                initTextareaProcessing();
                obs.disconnect(); // Зупиняємо спостерігач
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Функція для додавання Viber-посилання
    function addViberLink() {
        const phoneLinks = document.querySelectorAll('a.ng-binding.ng-scope[ng-if="task.contact.id"]:not([data-viber-processed])');
        console.log('Found phone links:', phoneLinks.length);
        phoneLinks.forEach(link => {
            const phoneNumber = link.textContent.trim();
            console.log('Checking phone number:', phoneNumber);
            if (phoneNumber.match(/^\+\d{10,}$/)) {
                console.log('Adding Viber link for:', phoneNumber);
                link.setAttribute('data-viber-processed', 'true');
                const viberLink = document.createElement('a');
                viberLink.href = `viber://chat?number=${encodeURIComponent(phoneNumber)}`;
                viberLink.innerHTML = '<i class="fab fa-viber icon-16 m-right5"></i>';
                viberLink.style.marginRight = '5px';
                link.insertBefore(viberLink, link.firstChild);
            } else {
                console.log('Not a valid phone number:', phoneNumber);
            }
        });
    }

    // Спостерігач для видимих елементів
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                replaceLinks(entry.target);
                obs.unobserve(entry.target);
            }
        });
    });

    // Ініціалізація спостерігача
    function initObserver() {
        document.querySelectorAll('div.click-editable pre').forEach(element => observer.observe(element));
        if (!isTextareaInitialized) observeTextarea();
        addViberLink(); // Викликаємо для обробки номерів телефону
    }

    // Запуск при завантаженні
    initObserver();

    // Спостерігач за змінами в DOM
    const mutationObserver = new MutationObserver((mutations) => {
    if (isProcessing) return;
    isProcessing = true;
    let shouldReinitialize = false;
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1 && (node.matches('div.click-editable pre') || node.querySelector('div.click-editable pre'))) {
                    shouldReinitialize = true;
                }
                if (node.nodeType === 1 && (node.matches('.form-group.task-tinymce textarea') || node.querySelector('.form-group.task-tinymce textarea'))) {
                    isTextareaInitialized = false; // Скидаємо ініціалізацію
                    shouldReinitialize = true;
                }
                if (node.nodeType === 1 && (node.matches('a.ng-binding.ng-scope') || node.querySelector('a.ng-binding.ng-scope'))) {
                    shouldReinitialize = true;
                }
            }
        }
    });
    if (shouldReinitialize) initObserver();
    isProcessing = false;
});

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Додаємо CSS стилі після завантаження сторінки
    function addCustomCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @import url(https://fonts.googleapis.com/css2?family=Droid+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap);

            div.ng-binding {
                color: #ff9900;
            }
            .tether-popup {
                width: 500px !important;
            }
            tbody tr td {
                text-align: center;
            }
            div.products-inner {
                text-align: center;
            }
            input.form-control.input-listener.editing-show.ng-pristine.ng-valid.ng-not-empty.ng-touched.ng-scope.ng-valid-pattern {
                font-size: 14px;
                line-height: 30px;
                width: 56px !important;
            }
            td.t-head-amount.font-weight-bolder.ng-binding.ng-scope {
                font-weight: 700;
                font-style: normal;
            }
            span.column-sorting {
                text-transform: capitalize;
                border-style: none;
            }
            td.td-amount.ng-scope {
                width: 7% !important;
            }
            div.inputWidth.advanced-field {
                font-weight: 600;
                font-style: normal;
                color: #000000;
                font-size: 12px;
            }
            tr td div {
                font-weight: 600;
                font-style: normal;
                color: #000000;
            }
            td.td-amount.ng-binding.ng-scope {
                font-weight: 600;
                font-style: normal;
            }
            td.column-editable {
                font-weight: 600;
                font-style: normal;
                color: #000000;
            }
            div.nova-poshta-container {
                font-weight: 500;
                font-style: normal;
            }
            div.stylized-select {
                color: #000000;
            }
            div div div {
                color: #000000;
            }
            .select2-container .select2-results .select2-results__options .select2-results__option {
                font-weight: 700;
            }
            a.link-name-field {
                text-decoration: none;
                color: #000000;
                height: 0px;
                padding-right: 0px;
                border-right-width: 0px;
                margin-right: 0px;
            }
            .form-group-phone > div {
                float: left;
                font-size: 12px;
            }
            div[attr-field-name="payedAmount"] {
                background-color: #b3ffb4;
                color: rgb(0, 0, 0);
            }
            .click-phone-edit {
                display: block;
            }
            .status-badge:contains("Готуємо") {
                background-color: red !important;
                color: #fff !important;
            }
            /* Стилі для лайтбокса */
            .lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 99999999;
                justify-content: center;
                align-items: center;
            }
            .lightbox-content {
                max-width: 90%;
                max-height: 90%;
            }
            .lightbox-content img {
                max-width: 900px;
                max-height: 600px;
                display: block;
                margin: auto;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
            }
            .lightbox-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #fff;
                border: none;
                font-size: 30px;
                line-height: 30px;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            .lightbox-content img {
                opacity: 0;
                animation: fadeIn 0.5s ease-in-out forwards;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .table i.cell-close-content, .table i.cell-open-content {
                background-color: #d2d2d2;
                line-height: 1em;
                padding-top: 4px;
            }
            .fa {
                font-size: 19px;
            }
            .dblclick-commentdate-init {
                margin-bottom: 10px;
            }
            img {
                max-height: 100px;
                max-width: 100px;
                object-fit: cover;
            }
            /* Стилі для Viber */
            .m-right5 {
                margin-right: 5px;
            }
            .icon-16 {
                font-size: 16px;
            }
            .fab.fa-viber {
                color: #665CAC;
            }
        `;
        document.head.appendChild(style);
    }

    addCustomCSS();
})();

// Функція телефону та кабінету
(function() {
    'use strict';

    // Функція для створення та показу лайтбоксу
    function createPhoneLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'phone-lightbox';
        lightbox.style.display = 'none';
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        lightbox.style.zIndex = '1000';
        lightbox.style.justifyContent = 'center';
        lightbox.style.alignItems = 'center';

        lightbox.innerHTML = `
            <div class="phone-lightbox-content" style="width: 40%; height: 90%; background-color: white; padding: 10px; position: relative;">
                <button class="phone-lightbox-close" style="position: absolute; top: 10px; right: 10px; font-size: 20px; cursor: pointer;">×</button>
                <iframe src="" frameborder="0" style="width: 100%; height: 100%;"></iframe>
            </div>
        `;
        document.body.appendChild(lightbox);

        const closeButton = lightbox.querySelector('.phone-lightbox-close');
        closeButton.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        return lightbox;
    }

    // Функція для відкриття лайтбокса з вмістом
    function openPhoneLightbox(url) {
        const lightbox = document.querySelector('.phone-lightbox');
        const iframe = lightbox.querySelector('iframe');
        iframe.src = url;
        lightbox.style.display = 'flex';
    }

    // Функція для перевірки чи є Фотокартина в замовленні
    function hasPhotoPaintingInOrder(element) {
        // Шукаємо батьківський рядок таблиці
        const row = element.closest('tr');
        if (!row) return false;

        // Шукаємо елемент з товарами в цьому рядку
        const productsElement = row.querySelector('.products-inner');
        if (!productsElement) return false;

        // Перевіряємо текст товарів
        const productsText = productsElement.textContent || '';
        return /Фотокартина/i.test(productsText);
    }

    // Функція для обробки телефонних номерів
    function processPhoneNumbers() {
        const phoneSelectors = [
            '#blk-contacts-to-order>div>div>div.panel-collapse.in.collapse>div>div.ng-pristine.ng-untouched.ng-valid.ng-scope.ng-not-empty>div>div>div.form-group.form-group-phone>label',
            'td.column-editable.form-group-phone span.click-phone-edit'
        ];

        phoneSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                let phoneNumber;

                if (selector === '#blk-contacts-to-order>div>div>div.panel-collapse.in.collapse>div>div.ng-pristine.ng-untouched.ng-valid.ng-scope.ng-not-empty>div>div>div.form-group.form-group-phone>label') {
                    const phoneElement = element.nextElementSibling?.querySelector('span.click-phone-edit');
                    if (phoneElement) {
                        phoneNumber = phoneElement.textContent.trim();
                    }
                } else if (selector === 'td.column-editable.form-group-phone span.click-phone-edit') {
                    phoneNumber = element.textContent.trim();
                }

                if (!phoneNumber) return;

                const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
                const formattedLink = `https://e-oboi.com/status-zamovlennya/?phone=${encodeURIComponent(cleanNumber)}`;
                
                // Перевіряємо чи є Фотокартина в замовленні
                const hasPhotoPainting = hasPhotoPaintingInOrder(element);
                
                // Формуємо текст з урахуванням наявності Фотокартини
                let customText;
                if (hasPhotoPainting) {
                    customText = `Це Ваш кабінет, тут актуальна інформація про замовлення та деталі:\n\n🔹Оплату\n🔹Статус\n🔹Виготовлення\n🔹Доставку\n\n${formattedLink}\n\nПісля оплати обов'язково надішліть квитанцію про оплату.`;
                } else {
                    customText = `Це Ваш кабінет, тут актуальна інформація про замовлення та деталі:\n\n🔹Оплату\n🔹Статус\n🔹Поклейку\n🔹Виготовлення\n🔹Доставку\n\n${formattedLink}\n\nПісля оплати обов'язково надішліть квитанцію про оплату.`;
                }

                if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('copy-container')) {
                    const container = document.createElement('div');
                    container.className = 'copy-container';

                    if (selector === '#blk-contacts-to-order>div>div>div.panel-collapse.in.collapse>div>div.ng-pristine.ng-untouched.ng-valid.ng-scope.ng-not-empty>div>div>div.form-group.form-group-phone>label') {
                        container.style.display = 'inline-block';
                        container.style.position = 'absolute';
                        container.style.margin = '-3px 0px 0px 45px';
                    } else if (selector === 'td.column-editable.form-group-phone span.click-phone-edit') {
                        container.style.display = 'inline-block';
                        container.style.position = 'relative';
                        container.style.marginLeft = '10px';
                    }

                    const copyButton = document.createElement('button');
                    copyButton.textContent = '📋';
                    copyButton.className = 'copy-text-button';
                    copyButton.style.cursor = 'pointer';
                    copyButton.style.border = 'none';
                    copyButton.style.backgroundColor = 'transparent';

                    const tooltip = document.createElement('span');
                    tooltip.className = 'tooltiptext';
                    tooltip.textContent = 'Копіювати текст';
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.backgroundColor = '#555';
                    tooltip.style.color = '#fff';
                    tooltip.style.textAlign = 'center';
                    tooltip.style.borderRadius = '5px';
                    tooltip.style.padding = '5px';
                    tooltip.style.position = 'absolute';
                    tooltip.style.zIndex = '1';
                    tooltip.style.bottom = '100%';
                    tooltip.style.left = '50%';
                    tooltip.style.marginLeft = '-60px';
                    tooltip.style.opacity = '0';
                    tooltip.style.transition = 'opacity 0.3s';

                    copyButton.appendChild(tooltip);

                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(customText)
                            .then(() => {
                                tooltip.textContent = 'Скопійовано!';
                                tooltip.style.visibility = 'visible';
                                tooltip.style.opacity = '1';
                                setTimeout(() => {
                                    tooltip.style.visibility = 'hidden';
                                    tooltip.style.opacity = '0';
                                    tooltip.textContent = 'Копіювати текст';
                                }, 1500);
                            })
                            .catch(err => console.error('Помилка копіювання: ', err));
                    });

                    container.appendChild(copyButton);

                    const cabinetLink = document.createElement('a');
                    cabinetLink.href = formattedLink;
                    cabinetLink.textContent = 'Кабінет';
                    cabinetLink.style.marginLeft = '5px';
                    cabinetLink.style.color = '#007bff';
                    cabinetLink.style.textDecoration = 'none';

                    cabinetLink.addEventListener('click', event => {
                        event.preventDefault();
                        openPhoneLightbox(cabinetLink.href);
                    });

                    container.appendChild(cabinetLink);

                    element.parentNode.insertBefore(container, element.nextSibling);
                }
            });
        });
    }

    createPhoneLightbox();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.type === 'childList') {
                processPhoneNumbers();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    processPhoneNumbers();
})();

// Скрипт Автоматичного обрахування розміру пакування
(function() {
    'use strict';

    let currentOrderId = null;
    let currentOrderDimensions = null;
    let isModalActive = false;

    const observer = new MutationObserver(() => {
        const modal = document.querySelector('.modal-dialog.modal-discount');
        if (modal && !isModalActive) {
            isModalActive = true;
            if (currentOrderDimensions) {
                fillPackageParametersInModal();
            }
        } else if (!modal && isModalActive) {
            isModalActive = false;
            observer.disconnect();
        }
    });

    function getDimensions(descriptionText) {
        const regexPatterns = [
            /[(ш)]\s*(\d+)\s*х\s*[(в)]\s*(\d+)/i,
            /(\d+)\s*[xх]\s*(\d+)/i,
            /ширина\s*(\d+)\s*х\s*(\d+)\s*висота/i
        ];

        for (const pattern of regexPatterns) {
            const match = descriptionText.match(pattern);
            if (match) {
                return {
                    width: parseFloat(match[1]),
                    height: parseFloat(match[2])
                };
            }
        }

        return null;
    }

    function isSeamlessProduct(descriptionText) {
        return /безшовні/i.test(descriptionText);
    }

    function isRollProduct(descriptionText) {
        return /(Класік|Пісок|Холст|Живопис|Самоклеючі)/i.test(descriptionText);
    }

    function isPhotoPainting(descriptionText) {
        return /Фотокартина/i.test(descriptionText);
    }

   function getAllProductDimensions(orderId) {
    const excludedItems = [
        "Обробка Фотографії",
        "Дизайнерська робота над макетом",
        "Захисний лак",
        "Подарункова Упаковка"
    ];

    const productElements = document.querySelectorAll(`.products-inner[data-context="${orderId}"] div[style*="display: contents;"]`);
    let dimensions = [];
    let isRollProductDetected = false;

    productElements.forEach(productElement => {
        const descriptionText = productElement.textContent || '';

        // 🔹 Якщо опис містить будь-який із виключених типів — пропускаємо
        if (excludedItems.some(item => descriptionText.includes(item))) {
            return;
        }

        if (isSeamlessProduct(descriptionText)) {
            const productDimensions = getDimensions(descriptionText);
            if (productDimensions) {
                dimensions.push(Math.min(productDimensions.width, productDimensions.height));
            }
        } else if (isRollProduct(descriptionText)) {
            isRollProductDetected = true;
        } else if (isPhotoPainting(descriptionText)) {
            const match = descriptionText.match(/Фотокартина\s+(\d+)\/(\d+)/);
            if (match) {
                dimensions.push({
                    width: parseFloat(match[1]),
                    height: parseFloat(match[2]),
                    depth: 2,
                    weight: 2
                });
            }
        }
    });

    if (isRollProductDetected) {
        return { roll: true, length: 110, width: 13, height: 13, weight: 4 };
    }

    if (dimensions.length > 0) {
        return dimensions.find(d => typeof d === 'object') || { roll: false, size: Math.max(...dimensions) + 15 };
    }

    return null;
}

    function fillPackageParametersInModal() {
        const modal = document.querySelector('.modal-dialog.modal-discount');
        if (modal) {
            const lengthInput = modal.querySelector('input[ng-model="item.length"]');
            const widthInput = modal.querySelector('input[ng-model="item.width"]');
            const heightInput = modal.querySelector('input[ng-model="item.height"]');
            const weightInput = modal.querySelector('input[ng-model="item.mass"]');

            if (lengthInput && widthInput && heightInput && weightInput) {
                if (currentOrderDimensions.roll) {
                    lengthInput.value = currentOrderDimensions.length;
                    widthInput.value = currentOrderDimensions.width;
                    heightInput.value = currentOrderDimensions.height;
                    weightInput.value = currentOrderDimensions.weight;
                } else if (currentOrderDimensions.size) {
                    lengthInput.value = currentOrderDimensions.size;
                    widthInput.value = 20;
                    heightInput.value = 20;
                    weightInput.value = 6;
                } else if (currentOrderDimensions.width && currentOrderDimensions.height) {
                    lengthInput.value = currentOrderDimensions.width;
                    widthInput.value = currentOrderDimensions.height;
                    heightInput.value = currentOrderDimensions.depth;
                    weightInput.value = currentOrderDimensions.weight;
                }

                const event = new Event('input', { bubbles: true });
                lengthInput.dispatchEvent(event);
                widthInput.dispatchEvent(event);
                heightInput.dispatchEvent(event);
                weightInput.dispatchEvent(event);
            }
        }
    }

// 🔹 Очищення опису при кожному відкритті модального вікна
(function() {
    'use strict';

    const excludedPhrases = [
        "Обробка Фотографії",
        "Дизайнерська робота над макетом",
        "Захисний лак",
        "Подарункова Упаковка"
    ];

    function cleanDescription() {
        const textarea = document.querySelector('#descriptionNovaPoshta');
        if (!textarea) return;

        let text = textarea.value;

        excludedPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            text = text.replace(regex, '').trim();
        });

        // прибираємо зайві коми, крапки, пробіли
        text = text
            .replace(/[,.\s]+$/, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

        if (textarea.value !== text) {
            textarea.value = text;
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        }
    }

    function attachCleaner() {
        const textarea = document.querySelector('#descriptionNovaPoshta');
        if (!textarea) return;

        // очищення при відкритті
        cleanDescription();

        // додатково — при будь-якому редагуванні
        textarea.addEventListener('input', cleanDescription);
        textarea.addEventListener('change', cleanDescription);
    }

    // 🔸 Спостерігач за появою модального вікна
    const modalObserver = new MutationObserver(() => {
        const textarea = document.querySelector('#descriptionNovaPoshta');
        if (textarea) attachCleaner();
    });

    modalObserver.observe(document.body, { childList: true, subtree: true });
})();


    function handleEditIconClick(event) {
        const target = event.target.closest('.glyphicon-edit');
        if (target) {
            const contextElement = target.closest('td').querySelector('.novaposhta-inner');
            if (contextElement) {
                currentOrderId = contextElement.getAttribute('data-context');
                currentOrderDimensions = getAllProductDimensions(currentOrderId);
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }
    }

    function setupEventListeners() {
        document.body.addEventListener('click', (event) => {
            handleEditIconClick(event);

            const target = event.target;

            if (target.matches('button[ng-click="viewModel.openModalEachPlace()"]')) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    window.addEventListener('load', () => {
        setupEventListeners();
    });
})();