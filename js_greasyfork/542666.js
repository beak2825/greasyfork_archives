// ==UserScript==
// @name         Steam Curator Recommendations + Удаление
// @match        https://store.steampowered.com/curator/*/admin/reviews_manage*
// @description  Рекомендации кураторов Steam с возможностью удаления отзывов
// @grant        GM_xmlhttpRequest
// @version      3
// @namespace    https://greasyfork.org/users/222079
// @downloadURL https://update.greasyfork.org/scripts/542666/Steam%20Curator%20Recommendations%20%2B%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/542666/Steam%20Curator%20Recommendations%20%2B%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Блок для вывода результата ===
    const resultBox = document.createElement('div');
    resultBox.style.position = 'fixed';
    resultBox.style.left = '20px';
    resultBox.style.top = '60px';
    resultBox.style.width = '700px';
    resultBox.style.maxHeight = '80vh';
    resultBox.style.overflowY = 'hidden';
    resultBox.style.zIndex = '9998';
    resultBox.style.backgroundColor = '#fff';
    resultBox.style.border = '1px solid #ccc';
    resultBox.style.borderRadius = '6px';
    resultBox.style.padding = '10px';
    resultBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    resultBox.style.fontFamily = 'sans-serif';
    resultBox.style.fontSize = '13px';
    resultBox.style.display = 'flex';
    resultBox.style.flexDirection = 'column';
    resultBox.style.justifyContent = 'flex-start';
    resultBox.style.alignItems = 'stretch';
    resultBox.style.height = '80vh';
    resultBox.style.color = 'black';
    document.body.appendChild(resultBox);

    // === Верхняя панель с кнопками ===
    const headerBar = document.createElement('div');
    headerBar.style.display = 'flex';
    headerBar.style.alignItems = 'center';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.marginBottom = '10px';
    headerBar.style.padding = '5px 0';
    headerBar.style.borderBottom = '1px solid #ccc';

    const titleLabel = document.createElement('strong');
    titleLabel.textContent = 'Рекомендации:';
    headerBar.appendChild(titleLabel);

    const toggleResultsBtn = document.createElement('button');
    toggleResultsBtn.textContent = 'Скрыть';
    toggleResultsBtn.style.fontSize = '12px';
    toggleResultsBtn.style.padding = '4px 8px';
    toggleResultsBtn.style.backgroundColor = '#f0f0f0';
    toggleResultsBtn.style.border = 'none';
    toggleResultsBtn.style.borderRadius = '4px';
    toggleResultsBtn.style.cursor = 'pointer';
    toggleResultsBtn.style.marginLeft = '10px';
    toggleResultsBtn.addEventListener('click', () => {
        const isVisible = resultsContainer.style.display !== 'none';
        resultsContainer.style.display = isVisible ? 'none' : 'block';
        resultBox.style.height = isVisible ? 'auto' : '80vh';
        toggleResultsBtn.textContent = isVisible ? 'Показать' : 'Скрыть';
    });
    headerBar.appendChild(toggleResultsBtn);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Загрузить рекомендации';
    loadButton.style.fontSize = '12px';
    loadButton.style.padding = '4px 8px';
    loadButton.style.backgroundColor = '#2b7bb9';
    loadButton.style.color = 'white';
    loadButton.style.border = 'none';
    loadButton.style.borderRadius = '4px';
    loadButton.style.cursor = 'pointer';
    loadButton.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
    headerBar.appendChild(loadButton);
    resultBox.appendChild(headerBar);

    // === Фиксированная панель с кнопкой Раскрыть/Скрыть описания ===
    const fixedHeader = document.createElement('div');
    fixedHeader.style.position = 'sticky';
    fixedHeader.style.top = '0';
    fixedHeader.style.backgroundColor = '#fff';
    fixedHeader.style.zIndex = '9997';
    fixedHeader.style.padding = '5px 0';
    fixedHeader.style.borderBottom = '1px solid #ccc';

    const toggleBlurbBtn = document.createElement('button');
    toggleBlurbBtn.id = 'toggleBlurbBtn';
    toggleBlurbBtn.textContent = 'Раскрыть описания';
    toggleBlurbBtn.style.marginLeft = '0';
    toggleBlurbBtn.style.fontSize = '12px';
    toggleBlurbBtn.style.padding = '4px 8px';
    toggleBlurbBtn.style.backgroundColor = '#f0f0f0';
    toggleBlurbBtn.style.border = 'none';
    toggleBlurbBtn.style.borderRadius = '4px';
    toggleBlurbBtn.style.cursor = 'pointer';
    fixedHeader.appendChild(document.createTextNode('Описание: '));
    fixedHeader.appendChild(toggleBlurbBtn);
    resultBox.appendChild(fixedHeader);

    // === Контейнер для результатов с прокруткой ===
    const resultsContainer = document.createElement('div');
    resultsContainer.style.flexGrow = '1';
    resultsContainer.style.overflowY = 'auto';
    resultsContainer.style.marginTop = '10px';
    resultBox.appendChild(resultsContainer);

    // === Преобразование Unix-времени в dd.mm.yyyy ===
    function unixToDate(unixTime) {
        const date = new Date(unixTime * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц начинается с 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // === Иконки оценок ===
    const icons = {
        0: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_up.png ',
        1: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_dn.png ',
        2: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_info.png '
    };

    // === Получаем sessionid и g_sessionID из глобальных переменных ===
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    const sessionid = getCookie("sessionid");
    const g_sessionID = window.g_sessionID;

    // === URL для удаления отзыва ===
    function buildDeleteURL(clanid) {
        return `https://store.steampowered.com/curator/${clanid}/admin/ajaxdeletereview/`;
    }

    // === Добавляем кнопку удаления ===
    function createDeleteButton(appid, row, clanid) {
        const deleteIcon = document.createElement('button');
        deleteIcon.innerHTML = '🗑️';
        deleteIcon.title = 'Удалить отзыв';
        deleteIcon.style.marginRight = '8px';
        deleteIcon.style.background = 'none';
        deleteIcon.style.border = 'none';
        deleteIcon.style.fontSize = '14px';
        deleteIcon.style.cursor = 'pointer';

        deleteIcon.addEventListener('click', () => {
            if (!confirm(`Удалить отзыв для appid ${appid}?`)) return;

            const url = buildDeleteURL(clanid);
            const formData = new URLSearchParams();
            formData.append("appid", appid);
            formData.append("sessionid", sessionid);
            if (g_sessionID) formData.append("g_sessionID", g_sessionID);

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': document.cookie
                },
                body: formData.toString(),
                credentials: 'include'
            })
            .then(async response => {
                const textResponse = await response.text();
                try {
                    const jsonResponse = JSON.parse(textResponse);
                    if (jsonResponse.success === 1 || jsonResponse.result === "OK") {
                        row.style.textDecoration = 'line-through';
                        row.style.color = '#aaa';
                        alert("✅ Отзыв удален!");
                    } else if (jsonResponse.success === 42) {
                        alert("⛔ Нет прав на удаление.");
                    } else {
                        alert("⚠️ Неизвестный результат:\n" + JSON.stringify(jsonResponse));
                    }
                } catch (e) {
                    console.error("❌ Не удалось разобрать JSON", textResponse);
                    alert("❌ Сервер вернул некорректный ответ.\nПроверь консоль.");
                }
            })
            .catch(error => {
                console.error("❌ Ошибка сети или запроса:", error);
                alert("Ошибка при удалении отзыва.\nПроверь консоль.");
            });
        });

        return deleteIcon;
    }

    // === Вывод результатов в интерфейс ===
    function showResults(recs, clanid) {
        resultBox.style.width = '700px'; // ширина по умолчанию
        let showBlurb = false;

        function render() {
            resultsContainer.innerHTML = '';
            const end = Math.min(2000, recs.length);
            for (let i = 0; i < end; i++) {
                const rec = recs[i];
                const link = `https://store.steampowered.com/app/${rec.appid}`;
                const appLink = `<a href="${link}" target="_blank" style="color: blue;">${rec.appid}</a>`;
                const state = rec.recommendation.recommendation_state;
                const icon = icons[state] ? `<img src="${icons[state]}" style="vertical-align: middle;" title="State: ${state}">` : '';
                const reviewDate = rec.recommendation.time_recommended ? unixToDate(rec.recommendation.time_recommended) : '—';
                const shortBlurb = rec.recommendation.blurb
                    ? rec.recommendation.blurb.substring(0, 250) + (rec.recommendation.blurb.length > 250 ? '...' : '')
                    : '';

                const row = document.createElement('div');
                row.style.marginBottom = '4px';
                row.style.fontSize = '13px';
                row.style.whiteSpace = 'nowrap';
                row.style.overflow = 'hidden';
                row.style.textOverflow = 'ellipsis';

                // Добавляем кнопку удаления
                const deleteBtn = createDeleteButton(rec.appid, row, clanid);

                if (showBlurb && shortBlurb) {
                    row.innerHTML = `
                        <strong>${i + 1}.</strong>
                        ${reviewDate}
                        ${icon}
                        ${appLink} — ${rec.app_name}
                        <span style="margin-left: 10px; color: #555; font-style: italic;">(${shortBlurb})</span>
                    `;
                } else {
                    row.innerHTML = `
                        <strong>${i + 1}.</strong>
                        ${reviewDate}
                        ${icon}
                        ${appLink} — ${rec.app_name}
                    `;
                }

                // Вставляем кнопку перед номером
                const strong = row.querySelector('strong');
                if (strong) {
                    row.insertBefore(deleteBtn, strong.nextSibling);
                } else {
                    row.prepend(deleteBtn);
                }

                resultsContainer.appendChild(row);
            }
            if (!recs.length) {
                resultsContainer.innerHTML = '<br>Нет данных для отображения.';
            }
        }

        toggleBlurbBtn.addEventListener('click', () => {
            showBlurb = !showBlurb;
            toggleBlurbBtn.textContent = showBlurb ? 'Скрыть описания' : 'Раскрыть описания';
            resultBox.style.width = showBlurb ? '1700px' : '700px';
            render();
        });

        render();
    }

    // === Основная логика загрузки данных ===
    function fetchTwoBatches(clanid, callback) {
        const batchSize = 1000;
        let allRecs = [];
        let currentPage = 0;

        function fetchPage() {
            const start = currentPage * batchSize;
            const apiURL = `https://store.steampowered.com/curator/${clanid}/admin/ajaxgetrecommendations/?query&start=${start}&count=${batchSize}`;

            if (!sessionid) {
                resultsContainer.innerHTML = '<span style="color: red;">sessionid не найден в cookie</span>';
                return;
            }

            toggleBlurbBtn.textContent = 'Загрузка...';
            GM_xmlhttpRequest({
                method: "GET",
                url: apiURL,
                headers: {
                    "Cookie": `sessionid=${sessionid};`,
                    "Referer": window.location.href
                },
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const recs = data.recommendations || [];
                            allRecs = [...allRecs, ...recs];
                            currentPage++;
                            if (currentPage < 2) {
                                setTimeout(fetchPage, 200); // пауза между запросами
                            } else {
                                toggleBlurbBtn.textContent = 'Раскрыть описания';
                                showResults(allRecs, clanid);
                                callback(allRecs);
                            }
                        } catch (e) {
                            console.error("Ошибка парсинга JSON", e);
                            resultsContainer.innerHTML += '<br><span style="color: red;">Ошибка парсинга JSON</span>';
                        }
                    } else {
                        console.error("Ошибка запроса:", response.status, response.statusText);
                        resultsContainer.innerHTML += '<br><span style="color: red;">Ошибка HTTP</span>';
                    }
                },
                onerror: function (err) {
                    console.error("Ошибка сети:", err);
                    resultsContainer.innerHTML += '<br><span style="color: red;">Ошибка сети</span>';
                }
            });
        }
        fetchPage();
    }

    // === Обработчик клика по кнопке ===
    loadButton.addEventListener('click', () => {
        resultsContainer.innerHTML = 'Инициализация...';
        const url = window.location.href;
        const match = url.match(/https:\/\/store\.steampowered\.com\/curator\/(\d+)-[^\/]+\/admin\/reviews_manage/);
        if (!match || !match[1]) {
            resultsContainer.innerHTML = '<span style="color: red;">Не удалось извлечь clanid из URL</span>';
            return;
        }
        const clanid = match[1];
        fetchTwoBatches(clanid, (allRecommendations) => {
            console.log("Все рекомендации:", allRecommendations);
        });
    });
})();