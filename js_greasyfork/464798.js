// ==UserScript==
// @name         SteamDB Auto Activate
// @version      2.5
// @description  Автоматически активировать пакеты на сайте https://steamdb.info/freepackages/ и выводить отчет времени в консоли браузера.
// @match        https://steamdb.info/freepackages/*
// @namespace    Role_Play
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464798/SteamDB%20Auto%20Activate.user.js
// @updateURL https://update.greasyfork.org/scripts/464798/SteamDB%20Auto%20Activate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var countdownInterval;

    function activatePackages() {
        clearInterval(countdownInterval);
        var activateButton = document.getElementById('js-activate-now');
        if (activateButton && activateButton.offsetParent !== null && !activateButton.classList.contains('btn-progress')) {
            activateButton.click();
        }
    }

    function hideDemosAndLegacyMedia() {
        var hideButton = document.getElementById('js-hide-demos');
        if (hideButton && hideButton.offsetParent !== null && !hideButton.classList.contains('btn-progress')) {
            hideButton.click();
            setTimeout(hideDemosAndLegacyMedia, 1000);
        }
    }

    function displayTimeReport() {
        var countdown = 30;
        var stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style.position = 'fixed';
        stopButton.style.bottom = '10px';
        stopButton.style.right = '10px';
        stopButton.style.zIndex = '9999';
        stopButton.style.padding = '10px';
        stopButton.style.backgroundColor = '#3498db';
        stopButton.style.color = '#fff';
        stopButton.style.border = 'none';
        stopButton.style.cursor = 'pointer';
        document.body.appendChild(stopButton);

        function updateReport() {
            console.log('%c Активация продуктов через: ' + countdown + ' сек.', 'color: #c0392b; font-size: 18px; font-weight: bold;');
        }

        countdownInterval = setInterval(function() {
            countdown--;
            updateReport();

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                updateReport();
                activatePackages();
                stopButton.style.display = 'none';
            }
        }, 1000);

        stopButton.addEventListener('click', function() {
            clearInterval(countdownInterval);
            console.log('%c Отчет времени остановлен.', 'color: #c0392b; font-size: 18px; font-weight: bold;');
            stopButton.style.display = 'none';
        });

        window.addEventListener('keydown', function(event) {
            if (event.key.toLowerCase() === 's' && event.ctrlKey && !event.altKey && !event.shiftKey) {
                clearInterval(countdownInterval);
                stopButton.style.display = 'none';
            }
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    delay(2000).then(() => {
        hideDemosAndLegacyMedia();
    });

    displayTimeReport();
})();
