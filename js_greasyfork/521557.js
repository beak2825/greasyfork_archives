// ==UserScript==
// @name         Игра с динозавриком
// @version      2.1
// @description  Простая игра с динозавриком, который прыгает через кактусы и уклоняется от птичек
// @author       миниш
// @namespace    dino.simplegame
// @match        drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521557/%D0%98%D0%B3%D1%80%D0%B0%20%D1%81%20%D0%B4%D0%B8%D0%BD%D0%BE%D0%B7%D0%B0%D0%B2%D1%80%D0%B8%D0%BA%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/521557/%D0%98%D0%B3%D1%80%D0%B0%20%D1%81%20%D0%B4%D0%B8%D0%BD%D0%BE%D0%B7%D0%B0%D0%B2%D1%80%D0%B8%D0%BA%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем холст для игры
    const canvas = document.createElement('canvas');
    canvas.style.background = 'white';
    canvas.width = 600;
    canvas.height = 200;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Загружаем текстуры
    const dinoImage = new Image();
    dinoImage.src = 'https://avatars.mds.yandex.net/i?id=187b69c130f35b00ae98552a5a84c335e7d00a36-9748111-images-thumbs&n=13'; // Текстура динозавра

    const cactusImage = new Image();
    cactusImage.src = 'https://avatars.mds.yandex.net/i?id=38cf032899c732ef9298c37168092d452602bdab-9140040-images-thumbs&n=13'; // Текстура кактуса

    const birdImage = new Image();
    birdImage.src = 'https://avatars.mds.yandex.net/i?id=a6b170ddea470f70a7653d880c270445b28ed32d-7451251-images-thumbs&n=13'; // Текстура птички

    // Переменные игры
    let dinoX = 50;
    let dinoY = canvas.height - 40; // Уровень земли
    let dinoJumping = false;
    let jumpHeight = 0;
    const maxJumpHeight = 50; // Максимальная высота прыжка
    const jumpSpeed = 5; // Скорость подъема
    const fallSpeed = 2; // Скорость падения (уменьшена для более плавного приземления)
    let cactusX = canvas.width;
    let birdX = canvas.width + 100; // Начальная позиция птички
    let score = 0;
    let gameRunning = false;

    // Функция для сброса игры
    function resetGame() {
        dinoX = 50;
        dinoY = canvas.height - 40;
        dinoJumping = false;
        jumpHeight = 0;
        cactusX = canvas.width;
        birdX = canvas.width + 100;
        score = 0;
        gameRunning = true;
        gameLoop();
    }

    // Основной игровой цикл
    function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем динозавра
        ctx.drawImage(dinoImage, dinoX, dinoY - jumpHeight, 30, 30);

        // Рисуем кактус
        ctx.drawImage(cactusImage, cactusX, canvas.height - 40, 20, 40);

        // Рисуем птичку на более высоком уровне
        ctx.drawImage(birdImage, birdX, canvas.height - 80, 30, 30); // Птичка выше кактуса

        // Двигаем кактус и птичку
        cactusX -= 5;
        birdX -= 3;

        // Проверка на столкновение с кактусом
        if (cactusX < dinoX + 30 && cactusX + 20 > dinoX && dinoY - jumpHeight >= canvas.height - 40) {
            gameRunning = false;
            alert('Игра окончена! Ваш счёт: ' + score + '. Нажмите левой кнопкой мыши, чтобы начать заново.');
            return;
        }

        // Проверка на столкновение с птичкой
        if (birdX < dinoX + 30 && birdX + 30 > dinoX && dinoY - jumpHeight <= canvas.height - 80) {
            gameRunning = false;
            alert('Игра окончена! Ваш счёт: ' + score + '. Нажмите левой кнопкой мыши, чтобы начать заново.');
            return;
        }

        // Сброс кактуса и увеличение счёта
        if (cactusX < -20) {
            cactusX = canvas.width + Math.random() * 100;
            score++;
        }

        // Сброс птички
        if (birdX < -30) {
            birdX = canvas.width + Math.random() * 100;
        }

        // Рисуем счёт
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Счёт: ' + score, 10, 20);

        // Обработка прыжка и падения
        if (dinoJumping) {
            if (jumpHeight < maxJumpHeight) {
                jumpHeight += jumpSpeed; // Поднимаемся
            } else {
                dinoJumping = false; // Начинаем падение
            }
        } else if (jumpHeight > 0) {
            jumpHeight -= fallSpeed; // Падаем (используем более медленную скорость падения)
        } else {
            jumpHeight = 0; // Убедитесь, что высота прыжка не отрицательная
        }

        requestAnimationFrame(gameLoop);
    }

    // Управление левой кнопкой мыши
    canvas.addEventListener('click', function() {
        if (!gameRunning) {
            resetGame(); // Сброс игры
        } else if (!dinoJumping && jumpHeight === 0) {
            dinoJumping = true; // Начинаем прыжок
            jumpHeight = maxJumpHeight; // Устанавливаем высоту прыжка сразу
        }
    });

    // Убедитесь, что текстуры загружены перед началом игры
    dinoImage.onload = () => {
        cactusImage.onload = () => {
            birdImage.onload = () => {
                resetGame(); // Начинаем игру после загрузки всех изображений
            };
        };
    };
})();
