// ==UserScript==
// @name         AntiPublicForum
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AntiPublic Forum
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475056/AntiPublicForum.user.js
// @updateURL https://update.greasyfork.org/scripts/475056/AntiPublicForum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #antiPublicMenu, #consoleOutput {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background-color: #2c2f33;
            border: 1px solid #2BAD72;
            border-radius: 5px;
            padding: 10px;
            color: #ffffff;
            z-index: 9999;
            width: 400px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        #antiPublicMenu div, #consoleOutput div {
            margin-bottom: 10px;
        }
        #antiPublicMenu label {
            display: block;
            margin-bottom: 5px;
        }
        #antiPublicMenu input {
            width: 100%;
            padding: 1px;
            border: 1px solid #2BAD72;
            border-radius: 3px;
            background-color: #23272a;
            color: #ffffff;
        }
        #antiPublicMenu button, #consoleOutput button {
            width: 100%;
            background-color: #2BAD72;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        #antiPublicMenu button:hover, #consoleOutput button:hover {
            background-color: #45a049;
        }
        #consoleOutput {
            display: none;
            max-height: 300px;
            overflow-y: scroll;
        }
    `);

    const BASE_URL = 'https://antipublic.one';

    function makeRequest(apiKey, email) {
        const url = `${BASE_URL}/api/v2/emailSearch`;
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const params = new URLSearchParams({
            'key': apiKey,
            'email': email
        });

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        })
        .then(response => response.json())
        .then(data => {
            let formattedResults = data.results.join('\n');
            let formattedResponse = `
Доступные запросы: ${data.availableQueries}
Количество результатов: ${data.resultCount}
Результаты:
${formattedResults}
`;
            document.getElementById('consoleOutput').innerHTML = `
<pre>${formattedResponse}</pre>
<button id="returnToMail">Вернуться к почте</button>
`;
            document.getElementById('consoleOutput').style.display = 'block';

            
            document.getElementById('returnToMail').style.backgroundColor = 'transparent';
            document.getElementById('returnToMail').style.border = '1px solid #2BAD72';
            document.getElementById('returnToMail').style.color = '#2BAD72';
            document.getElementById('returnToMail').style.padding = '5px 10px';
            document.getElementById('returnToMail').style.borderRadius = '3px';
            document.getElementById('returnToMail').style.fontWeight = 'bold';
            document.getElementById('returnToMail').style.cursor = 'pointer';
            document.getElementById('returnToMail').addEventListener('click', function() {
                document.getElementById('consoleOutput').style.display = 'none';
            });
        })
        .catch(error => {
            alert('Ошибка при отправке запроса: ' + error.message);
        });
    }

    let bindKey = localStorage.getItem('bindKey') || 'Insert';

    let menu = document.createElement('div');
    menu.id = 'antiPublicMenu';
    menu.innerHTML = `
        <div><strong>AntiPublic API</strong></div>
        <div>
            <label for="apiKey">API ключ:</label>
            <input type="password" id="apiKey" value="${localStorage.getItem('apiKey') || ''}">
        </div>
        <div>
            <label for="email">Почта:</label>
            <input type="text" id="email">
        </div>
        <div>
            <label for="bindKey">Клавиша для открытия меню:</label>
            <input type="text" id="bindKeyInput" value="${bindKey}">
        </div>
        <button id="sendRequest">Отправить запрос</button>
    `;
    menu.style.display = 'none';

    let consoleOutput = document.createElement('div');
    consoleOutput.id = 'consoleOutput';
    consoleOutput.innerHTML = '<button id="closeConsole">Закрыть</button>';

    document.body.appendChild(menu);
    document.body.appendChild(consoleOutput);

    document.getElementById('sendRequest').addEventListener('click', function() {
        let apiKey = document.getElementById('apiKey').value;
        let email = document.getElementById('email').value;

        if (apiKey && email) {
            localStorage.setItem('apiKey', apiKey);
            makeRequest(apiKey, email);
        } else {
            alert('Пожалуйста, заполните все поля!');
        }
    });

    document.getElementById('closeConsole').addEventListener('click', function() {
        document.getElementById('consoleOutput').style.display = 'none';
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === bindKey) {
            let menu = document.getElementById('antiPublicMenu');
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
                document.getElementById('consoleOutput').style.display = 'none';
            }
        }
    });

    document.getElementById('bindKeyInput').addEventListener('input', function(event) {
        bindKey = event.target.value;
        localStorage.setItem('bindKey', bindKey);
    });

})();
