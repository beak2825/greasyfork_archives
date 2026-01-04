// ==UserScript==
// @name         Time Tracker
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  Melody for 3 min
// @author       Pisarenko.B.
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @icon         https://static.thenounproject.com/png/1938582-200.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487936/Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/487936/Time%20Tracker.meta.js
// ==/UserScript==

(function() {
    var isPlayingKey = 'melodyPlaying';
    var audioElement = document.createElement('audio');
    audioElement.src = 'https://mp3bob.ru/download/muz/Masked_Wolf_-_Astronaut_In_The_Ocean_sample.mp3';
    audioElement.preload = 'auto';
    document.body.appendChild(audioElement);

    function playMelody() {
        if (localStorage.getItem(isPlayingKey) !== 'true') {
            audioElement.play().then(() => {
                localStorage.setItem(isPlayingKey, 'true');
            }).catch(e => console.error('Ошибка воспроизведения:', e));
        }
    }

    function stopMelody() {
        audioElement.pause();
        audioElement.currentTime = 0;
        localStorage.setItem(isPlayingKey, 'false');
    }

    window.addEventListener('storage', function(e) {
        if (e.key === isPlayingKey && e.newValue === 'false') {
            // Можно добавить дополнительные действия, если мелодия остановлена в другой вкладке
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'x' || event.key === 'X') {
            stopMelody();
        }
    });

    setInterval(function() {
        var countdownElement = document.getElementById('countdown');
        if (countdownElement && countdownElement.textContent.includes('Remaining')) {
            var timerText = countdownElement.textContent.trim();
            var matches = timerText.match(/Remaining (\d{2}):(\d{2}):(\d{2})/);
            if (matches) {
                var hours = parseInt(matches[1], 10);
                var minutes = parseInt(matches[2], 10);
                var seconds = parseInt(matches[3], 10);

                // Обновление заголовка вкладки только минутами и секундами
                document.title = `${matches[2]}:${matches[3]}`;

                // Проверка, что осталось меньше 3 минут и мелодия ещё не играла
                if ((hours === 0 && minutes < 3) && localStorage.getItem(isPlayingKey) !== 'true') {
                    playMelody();
                }
            }
        }
    }, 1000);

    audioElement.onended = function() {
        localStorage.setItem(isPlayingKey, 'false');
    };
})();
