// ==UserScript==
// @name         Stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добовляет статистику вашей статистики на экран
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481226/Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/481226/Stats.meta.js
// ==/UserScript==

// Set your token here
const TOKEN = " СЮда свой токен ";

function applyUserStatsStyles() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${TOKEN}`
        }
    };

    fetch('https://api.zelenka.guru/users/me', options)
        .then(response => response.json())
        .then(data => {

            if (data && data.user && data.user.user_like_count !== undefined && data.user.user_message_count !== undefined) {
                const userLikeCount = data.user.user_like_count;
                const userMessageCount = data.user.user_message_count;


                const statsElement = document.createElement('span');
                statsElement.classList.add('user-stats');
                statsElement.textContent = `❤ Симпатии ${userLikeCount} | ✉ Сообщения ${userMessageCount}`;


                const navigationElement = document.getElementById('navigation');
                if (navigationElement) {

                    const existingStatsElement = document.querySelector('.user-stats');
                    if (existingStatsElement) {
                        existingStatsElement.remove();
                    }

                    navigationElement.appendChild(statsElement);
                } else {
                    console.error('Ошибка: Элемент с id="navigation" не найден');
                }
            } else {
                console.error('Ошибка: Некорректный формат ответа от API');
                alert('Ошибка при получении данных. Проверьте консоль для дополнительной информации.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Произошла ошибка. Проверьте консоль для дополнительной информации.');
        });
}


GM_addStyle(`
    #navigation {
        position: relative;
    }

    .user-stats {
        position: absolute;
        right: 10px; /* Optional right margin */
        top: 50%;
        transform: translateY(-50%);
        color: #8C8C8C; /* Optional text color */
        margin-right: 5px; /* Optional margin between text and screen edge */
    }
`);


window.addEventListener('load', applyUserStatsStyles);
setInterval(applyUserStatsStyles, 500000);
