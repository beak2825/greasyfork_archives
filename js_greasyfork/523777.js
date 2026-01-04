// ==UserScript==
// @name         Atlassian Jira Auto Ticket Assigner
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically assigns tickets on Jira with enhanced features
// @author       Oleg V'yunov
// @match        https://jira.brdo.com.ua/*
// @exclude      https://jira.brdo.com.ua/secure/Dashboard.jspa
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523777/Atlassian%20Jira%20Auto%20Ticket%20Assigner.user.js
// @updateURL https://update.greasyfork.org/scripts/523777/Atlassian%20Jira%20Auto%20Ticket%20Assigner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функція для динамічного завантаження бібліотеки
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Виклик функції для завантаження SweetAlert
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

        const selector = '#assign-to-me.issueaction-assign-to-me';
        const targetUrl = 'https://jira.brdo.com.ua/issues/?jql=project%20%3D%20EES%20AND%20status%20in%20(%22%D0%92%20%D1%80%D0%BE%D0%B1%D0%BE%D1%82%D1%96%22%2C%20%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D1%96%D0%B4%D1%87%D0%B8%D0%BD%D0%B5%D0%BD%D0%BE%2C%20%22%D0%9D%D0%BE%D0%B2%D0%B5%20%D0%B7%D0%B2%D0%B5%D1%80%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%22)%20AND%20assignee%20%3D%20EMPTY%20AND%20status%20%3D%20%22%D0%9D%D0%BE%D0%B2%D0%B5%20%D0%B7%D0%B2%D0%B5%D1%80%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%22';

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

                const resetButton = document.createElement('button');
                resetButton.textContent = 'Обнулити';
                resetButton.onclick = () => {
                    clickCount = 0;
                    localStorage.setItem('clickCount', clickCount);
                    showAlert('Значення тікетів скинуто до 0.');
                };
                modal.appendChild(resetButton);

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
            text.innerHTML = messages.join('<br>').replace(/(\w+)\s(\w+)/g, '$1');
            if (!text.parentElement) {
                modal.appendChild(text);
            } else {
                text.innerHTML = messages.join('<br>').replace(/(\w+)\s(\w+)/g, '$1'); // Очистка попереднього вмісту
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

        function checkForLink() {
            const link = document.querySelector(selector);
            const assigneeElement = document.querySelector('#assignee-val');
            const assignee = assigneeElement ? assigneeElement.innerText.trim().split(' ')[0] : 'відсутній';
            const reporterElement = document.querySelector('#reporter-val');
            const reporter = reporterElement ? reporterElement.innerText.trim().split(' ')[0] : 'відсутній';

            if (link) {
                addMessage('Посилання знайдено');

                if (reporter === 'Відділ' && assignee === 'Не') {
                    let attempts = 0;
                    const maxAttempts = 20; // максимальна кількість спроб
					clickCount++;
                    localStorage.setItem('clickCount', clickCount);
					
					// зміна виконавця
                    const clickInterval = setInterval(() => {
                        const assigneeName = assigneeElement.innerText.trim().split(' ')[0];
                        if (assigneeName !== 'Vyunova') {
                            link.click();
                            addMessage('Клікаєм');
                        } else {
                            clearInterval(clickInterval);
                        }
                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(clickInterval);
                            addMessage('Максимальна кількість спроб досягнута');
                        }
                    }, 500);

                    // розгортання меню та натискання на елемент "В роботі"
                    var dropdown = document.querySelector('#opsbar-transitions_more');
                    if (dropdown) {
                        dropdown.click();
                        setTimeout(function() {
                            var element = document.querySelector('.jira-issue-status-lozenge-inprogress');
                            if (element) {
                                element.click();
                                setTimeout(function() { }, 2000); //затримка після кліку на елемент "В роботі"
                            }
                        }, 5000); //затримка на рогортання меню
                    }
                }
            } else {
                addMessage('Посилання не знайдено');
            }
        }

        function reloadPage() {
            const assigneeElement = document.querySelector('#assignee-val');
            const assignee = assigneeElement ? assigneeElement.innerText.trim().split(' ')[0] : 'відсутній';
            const reporterElement = document.querySelector('#reporter-val');
            const reporter = reporterElement ? reporterElement.innerText.trim().split(' ')[0] : 'відсутній';

            const intervalId = setInterval(() => {
                if (window.location.href !== targetUrl) {
                    window.location.replace(targetUrl);
                    addMessage('Повертаємося');
                }
            }, 500);

            if (clickCount < 9) {
                try {
                    addMessage('Автор: ' + reporter);
                    addMessage('Виконавець: ' + assignee);
                    setTimeout(() => {
                        location.reload();
                        addMessage('<<ПЕРЕЗАВАНТАЖЕННЯ>>');
                    }, 1000); // Затримка в 1 секунду перед перезавантаженням
                } catch (error) {
                    addMessage('Помилка при перезавантаженні сторінки: ' + error);
                }
            }
        }

        const intervalId = setInterval(() => {
            checkForLink();
            setTimeout(reloadPage, 7000);
        }, 2000);
        addMessage('Кількість тікетів: ' + clickCount);

        showModal();
    });
})();