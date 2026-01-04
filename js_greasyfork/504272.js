// ==UserScript==
// @name:ru      Комфортное Мыло (Mail cloud) 
// @name         Comfort video player Mail
// @license MIT
// @description  for video player Mail
// @description:ru Для видео плеер Mail 
// @version      0.2
// @author       Malysh <malyshtipe3019@gmail.com>
// @match        http://cloud.mail.ru/*
// @match        https://cloud.mail.ru/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1354506
// @downloadURL https://update.greasyfork.org/scripts/504272/Comfort%20video%20player%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/504272/Comfort%20video%20player%20Mail.meta.js
// ==/UserScript==

//время для перематывания
let skeepTime = 5;
//для установки качество
let qualityVideo = '1080'; // 240, 480, 720, 1080

//увеличение интервала для перемотки
document.addEventListener('keydown', function(event) {
    
if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            event.stopImmediatePropagation()
            event.preventDefault();

            if(skeepTime <= 30){
             skeepTime += 5;
            }
            else{ skeepTime = 30;}
        }
        else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            event.stopImmediatePropagation()
            event.preventDefault();
            if(skeepTime != 5){
             skeepTime -= 5;
            }
            else{ skeepTime = 5;}

        }
    else if (event.code === 'KeyR') {
             skeepTime = 5;

        }
},true);


// перемотка видео
document.addEventListener('keydown', function(event) {
    // Получаем элемент видео на странице
     let videos = document.querySelectorAll('video');

    // Проверяем, что видео найдено
    let currentVideo = null;
        videos.forEach(video => {
            if (video.offsetParent !== null) {
                currentVideo = video;
            }
        });

    if (currentVideo) {
        // Если нажата клавиша стрелки влево

        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            event.stopImmediatePropagation()
            event.preventDefault();

            // Перематываем видео на 5 секунд назад
            currentVideo.currentTime -= skeepTime;
        }
        // Если нажата клавиша стрелки вправо
        else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            event.stopImmediatePropagation()
            event.preventDefault();
            // Перематываем видео на 5 секунд вперед
            currentVideo.currentTime += skeepTime;
        }
    }},true);

// пауза на Space
document.addEventListener('keydown', function(event) {
    // Проверяем, что нажата клавиша 'Space'
    if (event.code === 'Space') {
        event.stopImmediatePropagation();
        event.preventDefault();

        // Находим все элементы видео на странице
     let videos = document.querySelectorAll('video');


        // Ищем активное (видимое) видео
        let currentVideo = null;
        videos.forEach(video => {
            if (video.offsetParent !== null) {
                currentVideo = video;
            }
        });

        // Если найдено активное видео, управляем его воспроизведением
        if (currentVideo) {
            if (currentVideo.paused) {
                currentVideo.play();
            } else {
                currentVideo.pause();
            }
        }
    }
}, true);


// Функция для установки качества видео


function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const interval = 100;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                resolve(element);
            }
        }, interval);
        setTimeout(() => {
            clearInterval(checkExist);
            reject(new Error('Элемент не найден: ' + selector));
        }, timeout);
    });
}

async function setQuality(quality) {
    try {
        // Ожидаем загрузки кнопки настроек
        const settingsButton = await waitForElement('button[class*="vjs-menu-button vjs-menu-button-popup vjs-button"]');
        settingsButton.click();

        // Ожидаем появления меню выбора качества
        const qualityMenuItem = await waitForElement('.vjs-menu .vjs-menu-content');
        [...document.querySelectorAll('.vjs-menu-title')].find(item => item.textContent.includes('Качество') || item.textContent.includes('Quality')).click();

        // Ожидаем меню с выбором качества и устанавливаем выбранное качество
        const qualityOption = await waitForElement('.vjs-menu-item');
        [...document.querySelectorAll('.vjs-menu-item-text')].find(item => item.textContent.includes(quality)).click();

        console.log(`Качество установлено на ${quality}.`);
    } catch (error) {
        console.log('Ошибка: ' + error.message);
    }
}

// Запуск скрипта после загрузки страницы с заданным качеством
window.addEventListener('load', function() {
    setTimeout(() => setQuality(qualityVideo), 1000); // Установите здесь нужное качество, например, '240p'
});
