// ==UserScript==
// @name         Instant building
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  Taking over the world!
// @author       LZ
// @match        https://*.divokekmeny.cz/game.php*screen=main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502200/Instant%20building.user.js
// @updateURL https://update.greasyfork.org/scripts/502200/Instant%20building.meta.js
// ==/UserScript==

(function() {
    function checkAndClickButton() {
        const timeSpan = document.querySelector('span[data-endtime]');
        const freeButton = document.querySelector('.order_feature.btn.btn-btr.btn-instant-free');

        if (!timeSpan || !freeButton) {
            console.log('Required elements not found.');
            return;
        }

        const timeInSeconds = getTimeInSeconds(timeSpan.textContent);

        if (timeInSeconds < 179 && freeButton) {
            freeButton.click();
            setTimeout(() => {
                console.log('Reloading after instant free button click');
                window.location.reload();
            }, 1000);
        }
    }

    function getTimeInSeconds(timeText) {
        const [hours, minutes, seconds] = timeText.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    setInterval(checkAndClickButton, 1000);
})();