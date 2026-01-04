// ==UserScript==
// @name         Atlassian Jira Auto Сhange Task Consultation to Error
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматична зміна типу завдання з "Консультація" на "Помилка"
// @author       Oleg V'yunov
// @match        https://jira.brdo.com.ua/*
// @exclude      https://jira.brdo.com.ua/secure/Dashboard.jspa
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524139/Atlassian%20Jira%20Auto%20%D0%A1hange%20Task%20Consultation%20to%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/524139/Atlassian%20Jira%20Auto%20%D0%A1hange%20Task%20Consultation%20to%20Error.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetUrl = 'https://jira.brdo.com.ua/issues/?jql=project = EES AND issuetype = Консультація AND text ~ "Проблема при Переведенні/Зарахуванні дитини" AND reporter in (currentUser())';

    function extractTargetPart(url) {
        const urlObj = new URL(url);
        const queryString = decodeURIComponent(urlObj.search.substring(1)); // Видаляємо знак питання на початку і декодуємо
        const projectIndex = queryString.indexOf('project');
        return encodeURIComponent(queryString.substring(projectIndex)); // Обрізаємо все до слова "project" і кодуємо
    }
    const targetPart = extractTargetPart(targetUrl);
  // targetPart = 'project%20%3D%20EES%20AND%20issuetype%20%3D%20Консультація%20AND%20text%20~%20"Проблема%20при%20Переведенні%2FЗарахуванні%20дитини"%20AND%20reporter%20in%20(currentUser())';

    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function checkAndRedirect() {
        if (!window.location.href.includes(targetPart)) {
            window.location.replace(targetUrl);
        }
    }

    loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', () => {
        function showAlert(message) {
            Swal.fire({
                title: message,
                timer: 2000,
                showConfirmButton: false,
                position: 'top-start'
            });
        }

        const maxMessages = 24;
        let clickCount = localStorage.getItem('clickCount') ? parseInt(localStorage.getItem('clickCount')) : 0;
        let messages = localStorage.getItem('messages') ? localStorage.getItem('messages').split('<br>') : [];
        let modal;

        function showModal() {
            if (!modal) {
                modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.bottom = '5px';
                modal.style.left = '10px';
                modal.style.width = '250px';
                modal.style.height = '505px';
                modal.style.overflowY = 'auto';
                modal.style.backgroundColor = 'white';
                modal.style.padding = '20px';
                modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                modal.style.zIndex = '1000';

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Копіювати';
                copyButton.onclick = () => {
                    const tempTextArea = document.createElement('textarea');
                    const displayedMessages = modal.querySelector('div').innerText;
                    tempTextArea.value = displayedMessages;
                    document.body.appendChild(tempTextArea);
                    tempTextArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempTextArea);
                    showAlert('Вміст вікна скопійовано в буфер обміну.');
                };
                modal.appendChild(copyButton);

                const clearButton = document.createElement('button');
                clearButton.textContent = 'Очистити';
                clearButton.onclick = () => {
                    messages = [];
                    localStorage.removeItem('messages');
                    modal.querySelector('div').innerHTML = '';
                    showAlert('Вміст вікна очищено.');
                };
                modal.appendChild(clearButton);

                document.body.appendChild(modal);
            }

            const text = modal.querySelector('div') || document.createElement('div');
            text.innerHTML = messages.join('<br>');
            if (!text.parentElement) {
                modal.appendChild(text);
            } else {
                text.innerHTML = messages.join('<br>'); // Очистка попереднього вмісту
            }
        }

        function addMessage(message) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const formattedMessage = `[${timeString}] ${message}`;
            messages.push(formattedMessage);
            if (messages.length > maxMessages) {
                messages.shift();
            }
            localStorage.setItem('messages', messages.join('<br>'));
            showModal();
        }

        function reloadPage() {
            try {
                addMessage('<<ПЕРЕЗАВАНТАЖЕННЯ>>');
                if (window.location.href !== targetUrl) {
                    window.location.replace(targetUrl);
                }
            } catch (error) {
                addMessage(`Помилка: ${error.message}`);
            }
        }

        function clickFirstElement() {
            var firstElement = document.getElementById('type-val');
            if (firstElement) {
                firstElement.click();
                addMessage('Меню знайдено');
            } else {
                addMessage('Меню не знайдено');
            }
        }

        function clickSecondElement() {
            var secondElement = document.querySelector('.aui-ss-entity-icon');
            if (secondElement) {
                secondElement.click();
                addMessage('Меню натиснуто');
            } else {
                addMessage('Меню не натиснуто');
            }
        }

        function clickThirdElement() {
            var thirdElement = document.querySelector('.aui-list-item-link.aui-iconised-link');
            if (thirdElement) {
                thirdElement.click();
                addMessage('Вибрано Помилка, Відмова ...');
            } else {
                addMessage('Помилка, Відмова не вибрано.');
            }
        }

        function clickFourthElement() {
            var fourthElement = document.querySelector('button.aui-button.submit');
            if (fourthElement) {
                fourthElement.click();
                addMessage('Підтверджено');
            } else {
                addMessage('Не підтверджено');
            }
        }

        setTimeout(clickFirstElement, 1000); // Затримка 1 сек перед першим кліком
        setTimeout(clickSecondElement, 2000); // Затримка 1 сек перед другим кліком
        setTimeout(clickThirdElement, 3000); // Затримка 1 сек перед третім кліком
        setTimeout(clickFourthElement, 4000); // Затримка 1 сек перед четвертим кліком

        window.addEventListener('load', () => {
            setInterval(() => {
                reloadPage();
            }, 10000); // Повторювати цикл кожні 10 сек
        });

        showModal();
    });

    // Перевірка та перенаправлення
    checkAndRedirect();
})();