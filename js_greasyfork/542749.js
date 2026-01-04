// ==UserScript==
// @name         SteamCuratorReview
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @description GPT_LOL
// @version 0.0.1.20250716192347
// @namespace https://greasyfork.org/users/222079
// @downloadURL https://update.greasyfork.org/scripts/542749/SteamCuratorReview.user.js
// @updateURL https://update.greasyfork.org/scripts/542749/SteamCuratorReview.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Получаем appid из URL текущей игры ===
    const url = window.location.href;
    const matchAppId = url.match(/https:\/\/store\.steampowered\.com\/app\/(\d+)/);
    if (!matchAppId || !matchAppId[1]) {
        console.error("❌ Не удалось получить appid из URL");
        return;
    }
    const appid = matchAppId[1];

    // === Путь для POST-запроса (все данные из него) ===
    const postUrl = "https://store.steampowered.com/curator/35512837/admin/ajaxcreatereview/ ";

    // Парсим clanid из postUrl
    const curatorMatch = postUrl.match(/https:\/\/store\.steampowered\.com\/curator\/(\d+)/);
    const clanid = curatorMatch ? curatorMatch[1] : '35512837'; // резервное значение

    // === Получаем sessionid из куки ===
    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const sessionid = getCookie('sessionid');
    if (!sessionid) {
        console.warn("⚠️ sessionid не найден!");
    }

    // === Иконки оценок ===
    const icons = {
        0: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_up.png ',
        1: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_dn.png ',
        2: 'https://store.fastly.steamstatic.com/public/images/v6/ico/ico_curator_info.png '
    };

    // === Создание окна формы ===
    const formBox = document.createElement('div');
    formBox.style.position = 'fixed';
    formBox.style.left = '20px';
    formBox.style.top = '100px';
    formBox.style.width = '400px';
    formBox.style.padding = '15px';
    formBox.style.backgroundColor = '#fff';
    formBox.style.border = '1px solid #ccc';
    formBox.style.borderRadius = '6px';
    formBox.style.zIndex = '9999';
    formBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    formBox.style.fontFamily = 'sans-serif';
    formBox.style.fontSize = '14px';
    formBox.style.color = '#000';
    formBox.innerHTML = `
        <strong style="margin-right: 5px;">Написать отзыв</strong>
        <a href="https://store.steampowered.com/curator/${clanid}" target="_blank" style="color: blue; text-decoration: underline;">${clanid}</a><br><br>

        <textarea id="reviewText" rows="5" style="width: 100%; padding: 8px; box-sizing: border-box;" placeholder="Введите ваш отзыв..."></textarea><br>
        <div id="charCount" style="text-align: right; margin-top: 5px;">0 / 200</div><br>

        <div style="display: flex; gap: 15px; margin-bottom: 15px;" id="ratingOptions">
            <label class="rating-label" data-value="0" style="cursor: pointer;">
                <input type="radio" name="rating" value="0" checked style="display: none;">
                <img src="${icons[0]}" style="width: 20px; height: 20px; transition: all 0.2s;">
            </label>
            <label class="rating-label" data-value="1" style="cursor: pointer;">
                <input type="radio" name="rating" value="1" style="display: none;">
                <img src="${icons[1]}" style="width: 20px; height: 20px; transition: all 0.2s;">
            </label>
            <label class="rating-label" data-value="2" style="cursor: pointer;">
                <input type="radio" name="rating" value="2" style="display: none;">
                <img src="${icons[2]}" style="width: 20px; height: 20px; transition: all 0.2s;">
            </label>
        </div>

        <button id="submitReviewBtn" style="
            margin-top: 10px;
            width: 100%;
            padding: 10px;
            background-color: #2b7bb9;
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.2s;
        ">Отправить отзыв</button>
    `;
    document.body.appendChild(formBox);

    // === Счётчик символов и подсветка ===
    const textarea = formBox.querySelector('#reviewText');
    const charCountDisplay = formBox.querySelector('#charCount');

    textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        charCountDisplay.textContent = `${count} / 200`;
        if (count > 200) {
            formBox.style.borderColor = 'red';
            formBox.style.backgroundColor = '#ffe6e6';
        } else {
            formBox.style.borderColor = '#ccc';
            formBox.style.backgroundColor = '#fff';
        }
    });

    // === Обработка клика по иконкам ===
    const labels = formBox.querySelectorAll('.rating-label');

    labels.forEach(label => {
        label.addEventListener('click', () => {
            const input = label.querySelector('input');
            if (input) {
                input.checked = true;

                // Убираем выделение у всех
                labels.forEach(l => {
                    const img = l.querySelector('img');
                    img.style.outline = 'none';
                    img.style.boxShadow = 'none';
                    img.style.transform = 'scale(1)';
                });

                // Выделяем текущую
                const img = label.querySelector('img');
                img.style.outline = '2px solid #2b7bb9';
                img.style.boxShadow = '0 0 0 2px rgba(43, 123, 185, 0.3)';
                img.style.transform = 'scale(1.1)';
            }
        });
    });

    // === Обработчик нажатия на кнопку ===
    const submitBtn = formBox.querySelector('#submitReviewBtn');
    submitBtn.addEventListener('click', () => {
        const reviewText = textarea.value.trim();
        const selected = document.querySelector('input[name="rating"]:checked');
        if (!selected) {
            alert("⚠️ Выберите тип отзыва");
            return;
        }
        const rating = parseInt(selected.value, 10);

        if (!reviewText) {
            alert("⚠️ Введите текст отзыва.");
            return;
        }

        if (reviewText.length > 200) {
            alert("⚠️ Превышено количество символов (более 200).");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("appid", appid);
        formData.append("blurb", reviewText);
        formData.append("link_url", "");
        formData.append("recommendation_state", rating);
        formData.append("sessionid", sessionid);

        // === Меняем кнопку на "Отправлено" на 2 секунды ===
        const originalText = submitBtn.textContent;
        const originalColor = submitBtn.style.backgroundColor;

        submitBtn.textContent = 'Отправлено';
        submitBtn.style.backgroundColor = '#4CAF50';
        submitBtn.style.transform = 'scale(1.02)';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = originalColor;
            submitBtn.style.transform = 'scale(1)';
            submitBtn.disabled = false;
        }, 2000);

        // === Отправка отзыва ===
        GM_xmlhttpRequest({
            method: "POST",
            url: postUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": document.cookie,
                "X-Requested-With": "XMLHttpRequest"
            },
            data: formData.toString(),
            onload: function (response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success === 1 || result.result === "OK") {
                        textarea.value = "";
                        charCountDisplay.textContent = "0 / 200";
                        formBox.style.borderColor = '#ccc';
                        formBox.style.backgroundColor = '#fff';
                    } else {
                        alert("❌ Ошибка при отправке отзыва:\n" + JSON.stringify(result));
                    }
                } catch (e) {
                    console.error("❌ Не удалось разобрать ответ:", response.responseText);
                    alert("❌ Сервер вернул некорректный ответ.");
                }
            },
            onerror: function (err) {
                console.error("❌ Ошибка сети:", err);
                alert("❌ Произошла сетевая ошибка.");
            }
        });
    });
})();