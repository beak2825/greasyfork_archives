// ==UserScript==
// @name         Яндекс Диск Авто Следующее Видео c Автовоспроизведением и Скоростью Воспроизведения
// @name:en      Yandex Disk Auto Next Video c with Auto Play and Playback Rate
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Автоматическое переключение на следующее видео на Яндекс.Диске и запуск его воспроизведения с сохранением скорости
// @description:en Automatically switch to the next video on Yandex.Disk and start its playback while maintaining the speed
// @author       azag_net + ChatGPT 4o
// @match        https://disk.yandex.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530323/%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%94%D0%B8%D1%81%D0%BA%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%A1%D0%BB%D0%B5%D0%B4%D1%83%D1%8E%D1%89%D0%B5%D0%B5%20%D0%92%D0%B8%D0%B4%D0%B5%D0%BE%20c%20%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%D1%8E%20%D0%92%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/530323/%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%94%D0%B8%D1%81%D0%BA%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%A1%D0%BB%D0%B5%D0%B4%D1%83%D1%8E%D1%89%D0%B5%D0%B5%20%D0%92%D0%B8%D0%B4%D0%B5%D0%BE%20c%20%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%D1%8E%20%D0%92%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var retry_ms = 500;
    var videoElement = null;
    var currentVideoPlaybackRateOld = 1;
    var currentVideoPlaybackRateManual = 1;

    // Функция для переключения на следующее видео
    function switchToNextVideo(currentVideoPlaybackRate) {
        console.log('Видео завершилось, ищем следующее видео');

        // Ищем кнопку для переключения на следующее видео
        var nextButton = document.querySelector('button[aria-label="Следующий файл"]');
        videoElement = null;

        if (nextButton) {
            nextButton.click();
            console.log('Переход к следующему видео');

            // После перехода к следующему видео, пробуем запустить его
            setTimeout(function() {
                videoElement = document.querySelectorAll('video')[1]; // Второе видео
                if (videoElement) {
                    console.log('Следующее видео найдено, пытаемся воспроизвести');

                    // Применяем скорость воспроизведения с предыдущего видео
                    videoElement.playbackRate = currentVideoPlaybackRate;

                    // Программно запускаем воспроизведение
                    videoElement.play()
                        .then(() => {
                            console.log('Видео успешно запустилось');
                            setupVideoListener();
                        })
                        .catch((error) => {
                            console.log('Ошибка при запуске видео:', error);
                        });
                } else {
                    console.log('Следующее видео не найдено');
                }
            }, 1000); // Подождем 1 секунду для загрузки следующего видео
        } else {
            console.log('Кнопка "Следующее видео" не найдена');
        }
    }

    // Устанавливаем слушатель события "ended" на второй видео элемент
    function setupVideoListener() {
        videoElement = document.querySelectorAll('video')[1]; // Выбираем второй видео элемент

        if (videoElement) {
            //console.log('Второе видео найдено');


            // Сохраняем текущую скорость воспроизведения
            currentVideoPlaybackRateOld = videoElement.playbackRate;
            console.log(`Скорость текущего видео: ${currentVideoPlaybackRateOld}`);

            // Применяем скорость воспроизведения текущего видео
            //videoElement.playbackRate = currentVideoPlaybackRateOld;

            // Добавляем обработчик для события 'ended' (когда видео заканчивается)
            videoElement.onended = function() {
                console.log('Событие ended сработало!');
                currentVideoPlaybackRateOld = this.playbackRate;
                // Переключаем на следующее видео
                switchToNextVideo(currentVideoPlaybackRateOld);
            };

            // Дополнительный слушатель для события 'timeupdate', чтобы отслеживать, где находимся в видео
            var lastTime = 0;
            videoElement.ontimeupdate = function() {
                if (!videoElement.paused && !videoElement.ended) {
                    // Выводим информацию только при существенном изменении времени
                    if (Math.abs(videoElement.currentTime - lastTime) >= 1) {
                        console.log(`Текущее время: ${videoElement.currentTime.toFixed(2)}, Длительность видео: ${videoElement.duration.toFixed(2)}`);
                        lastTime = videoElement.currentTime;                        
                    }
                }
                else {
                    console.log('Видео на паузе или завершилось');
                }
            };
        } else {
            console.log('Второе видео не найдено на странице. Повторная попытка через '+retry_ms+'мс.');
            setTimeout(setupVideoListener, retry_ms);
        }
    }

    // Настроим слушатель событий сразу после загрузки страницы

    setInterval(setupVideoListener_interval, retry_ms);


     // Обработчики событий для кнопок "Следующее видео" и "Предыдущее видео"
    function handleManualVideoChange() {
        console.log('Пользователь переключил видео вручную');

        // Сохраняем скорость воспроизведения перед переключением
        currentVideoPlaybackRateManual = videoElement.playbackRate;
        console.log(`Скорость текущего видео при переключении: ${currentVideoPlaybackRateManual}`);


        // Применяем сохраненную скорость воспроизведения к новому видео
        setTimeout(function() {
            var nextVideoElement = document.querySelectorAll('video')[1];
            if (nextVideoElement) {
                console.log('Применяем скорость к новому видео');
                nextVideoElement.playbackRate = currentVideoPlaybackRateManual; // Применяем сохраненную скорость
            }
        }, retry_ms);

        setTimeout(setupVideoListener, retry_ms); // Возвращаем слушатель событий
    }

    // Функция для привязки событий к кнопкам
    function addManualVideoChangeListeners() {
        let nextButton = document.querySelector('button[aria-label="Следующий файл"]');
        let prevButton = document.querySelector('button[aria-label="Предыдущий файл"]');

        if (nextButton && !nextButton.hasAttribute('listener')) {
            nextButton.addEventListener('click', handleManualVideoChange);
            nextButton.setAttribute('listener', 'true');
            console.log('Обработчик для кнопки "Следующий файл" добавлен');
        }

        if (prevButton && !prevButton.hasAttribute('listener')) {
            prevButton.addEventListener('click', handleManualVideoChange);
            prevButton.setAttribute('listener', 'true');
            console.log('Обработчик для кнопки "Предыдущий файл" добавлен');
        }
    }

    // Проверяем кнопки вручную каждые 500 миллисекунд
    setInterval(addManualVideoChangeListeners, 500);


    function setupVideoListener_interval(){
        var videoElement = document.querySelectorAll('video')[1];
        if(videoElement){
            //videoElement.playbackRate = currentVideoPlaybackRateOld;
            setTimeout(setupVideoListener, retry_ms);
        }
    }

})();
