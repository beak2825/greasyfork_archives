// ==UserScript==
// @name         LZT_Garland
// @namespace    .....
// @version      1.2
// @description  описание
// @author       llimonix/HashBrute
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519927/LZT_Garland.user.js
// @updateURL https://update.greasyfork.org/scripts/519927/LZT_Garland.meta.js
// ==/UserScript==

function injectGarland(header) {
    let garland_state = GM_getValue('garland_state', false);
    console.log(garland_state);

    const ong = "https://i.imgur.com/LLJVxfR.png"; // Включенная гирлянда
    const offg = "https://i.imgur.com/wbD7tMe.png"; // Выключенная гирлянда
    const buttong = "https://i.imgur.com/iMoeHiJ.png"; // Кнопка вкл / выкл

    // Создаем div для гирлянды
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('garland');
    imageContainer.style.marginTop = '-10px';
    imageContainer.style.position = 'sticky';
    imageContainer.style.width = '100%';
    imageContainer.style.height = '50px';
    imageContainer.style.backgroundImage = `url("${garland_state ? ong : offg}")`;
    imageContainer.style.backgroundSize = 'contain';
    imageContainer.style.backgroundRepeat = 'repeat-x';
    imageContainer.style.pointerEvents = 'none';

    // Создаем кнопку
    const toggleButton = document.createElement('div');
    toggleButton.classList.add('garland-toggle');
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '-100px';
    toggleButton.style.right = '0';
    toggleButton.style.width = '15%';
    toggleButton.style.height = '300px';
    toggleButton.style.backgroundImage = `url("${buttong}")`;
    toggleButton.style.backgroundSize = 'contain';
    toggleButton.style.backgroundRepeat = 'no-repeat';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transform = 'translateY(-20px)'; // Сдвиг вверх

    // Логика переключения гирлянды
    toggleButton.addEventListener('click', () => {
        garland_state = !garland_state;
        GM_setValue('garland_state', garland_state);

        // Анимация нажатия (эффект "потянул за веревку")
        toggleButton.style.transition = 'transform 0.3s ease-out';
        toggleButton.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            toggleButton.style.transition = 'none';
            toggleButton.style.transform = 'translateY(-20px)';
        }, 300);

        imageContainer.style.backgroundImage = `url("${garland_state ? ong : offg}")`;
    });

    // Вставляем div с гирляндой в header
    header.insertAdjacentElement('afterend', imageContainer);

    // Вставляем кнопку в header
    header.insertAdjacentElement('afterend', toggleButton);
}

const observer = new MutationObserver((mutations, obs) => {
    const header = document.querySelector('#navigation');
    if (header) {
        injectGarland(header);
        obs.disconnect();
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});