// ==UserScript==
// @name         @pegakmop Yandex Access Token Grabber Inline
// @match        https://music.yandex.ru/*
// @version      1.0.0
// @description  Автоматическое получение токена и отображение его на странице с возможностью копирования без редиректа.
// @author       @pegakmop
// @icon         https://github.com/pegakmop/pegakmop.github.io/raw/main/PiperPied.png
// @run-at       document-end
// @namespace https://greasyfork.org/users/1483936
// @downloadURL https://update.greasyfork.org/scripts/539482/%40pegakmop%20Yandex%20Access%20Token%20Grabber%20Inline.user.js
// @updateURL https://update.greasyfork.org/scripts/539482/%40pegakmop%20Yandex%20Access%20Token%20Grabber%20Inline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hash = location.hash;

    if (hash.includes("access_token=")) {
        const token = new URLSearchParams(hash.substring(1)).get("access_token");

        if (token) {
            console.log("🎟️ Yandex Access Token:", token);

            // Очистим хеш, чтобы убрать токен из URL
            history.replaceState(null, "", location.pathname + location.search);

            // Очистим body
            document.body.innerHTML = '';

            // Создаем контейнер с UI для токена и кнопкой поддержки
            const container = document.createElement('div');
            container.style.cssText = 'max-width:600px;margin:20px auto;padding:25px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);background:#fff;font-family:"Segoe UI", Tahoma, Geneva, Verdana, sans-serif;color:#222;text-align:center;';

            container.innerHTML = `
              <h2 style="color:#0066cc;">Скопировать токен можно, тапнув по скрытому тексту!</h2>
              <div id="token-container" style="position:relative; display: inline-block; width: 100%;">
                <div id="copy-hint" style="position:absolute;top:-25px;left:50%;transform:translateX(-50%);background:#00a000;color:#fff;padding:5px 10px;border-radius:4px;font-size:0.9em;white-space:nowrap;display:none;z-index:10;">Скопировано!</div>
                <div id="token-display" class="hidden-text copiable" style="
                    font-family: monospace; font-size: 1rem; word-break: break-all;
                    background:#f9f9f9; border:1px dashed #ccc; padding:10px; border-radius:5px;
                    user-select:text; cursor:pointer; color: transparent; text-shadow: 0 0 5px #aaa;
                ">••••••••••••••••••••••••••••••••</div>
              </div>
              <button id="reveal-button" style="
                margin-top:10px; background:#00a000; color:#fff; border:none; padding:10px 20px;
                border-radius:6px; cursor:pointer;
              ">👁 Показать токен</button>
              <a id="support-button" href="https://yoomoney.ru/to/410012481566554" target="_blank" rel="noopener" style="
                display: inline-block;
                margin-top: 10px;
                background: #00a000;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                user-select: none;
                transition: background-color 0.3s ease;
              ">💸 Поддержать автора</a>
            `;

            document.body.appendChild(container);

            const tokenDisplay = document.getElementById('token-display');
            const revealButton = document.getElementById('reveal-button');
            const copyHint = document.getElementById('copy-hint');

            tokenDisplay.textContent = token;

            // Автоматическая попытка копирования
            navigator.clipboard.writeText(token).then(() => {
                alert("✅ Токен скопирован в буфер обмена!");
            }).catch(() => {
                alert("⚠️ Не удалось скопировать токен автоматически. Придётся тапать вручную по скрытому тексту либо покажем токен и скопируем.");
            });

            // Кнопка показать токен (убирает скрытие)
            revealButton.addEventListener('click', () => {
                tokenDisplay.classList.remove('hidden-text');
                tokenDisplay.style.color = '#222';
                tokenDisplay.style.textShadow = 'none';
                revealButton.style.display = 'none';
            });

            // Копирование по клику на текст токена
            tokenDisplay.addEventListener('click', () => {
                navigator.clipboard.writeText(tokenDisplay.textContent.trim()).then(() => {
                    copyHint.style.display = 'block';
                    setTimeout(() => copyHint.style.display = 'none', 1500);
                }).catch(() => {
                    alert("❌ Не удалось скопировать.");
                });
            });

            // Подсветка кнопки поддержки при наведении
            const supportBtn = document.getElementById('support-button');
            supportBtn.addEventListener('mouseenter', () => supportBtn.style.backgroundColor = '#008000');
            supportBtn.addEventListener('mouseleave', () => supportBtn.style.backgroundColor = '#00a000');
        }
    }
})();
