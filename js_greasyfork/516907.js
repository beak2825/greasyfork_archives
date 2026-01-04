// ==UserScript==
// @name         ReYohoho for Shikimori
// @version      0.5
// @description  Open ReYohoho directly from shikimori.one
// @author       UvelirAlmaz
// @match        *://shikimori.one/animes/*
// @grant        none
// @connect      shikimori.one
// @grant        GM_addStyle
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/UvelirAlmaz/reyohoho-chrome-ff-ext/master/player.css
// @run-at       document-end
// @namespace https://greasyfork.org/users/1248073
// @downloadURL https://update.greasyfork.org/scripts/516907/ReYohoho%20for%20Shikimori.user.js
// @updateURL https://update.greasyfork.org/scripts/516907/ReYohoho%20for%20Shikimori.meta.js
// ==/UserScript==

let lastUrl = location.href; // Переменная для хранения последнего URL
const playerTailId = 'watch-shikimori-player-tail'; // ID для кнопки
const tailImage = `<svg width="100%" height="100%" viewBox="0 0 128 512"><path id="Banner" d="M128,0L0,0L0,512L64,480L128,512L128,0Z" style="fill:url(#_Linear1);"/><g transform="matrix(6.57572e-17,1.0739,-1.08204,6.62559e-17,327.734,298.698)"><path d="M78.752,202.827L99.504,239.449L120.551,275.899L78.752,275.727L36.953,275.899L58.001,239.449L78.752,202.827Z" style="fill:url(#_Linear2);"/></g><defs><linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:rgb(00,00,00);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(00,00,00);stop-opacity:1"/></linearGradient><linearGradient id="_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:rgb(255,255,255);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,255,255);stop-opacity:1"/></linearGradient></defs></svg>`;

// Функция для извлечения ID аниме из URL
function extractAnimeId() {
    const pathname = window.location.pathname;
    const regex = /^\/animes\/[a-z]*(\d+)-/; // Регулярное выражение для извлечения ID с учётом префиксов
    const match = pathname.match(regex);
    return match ? match[1] : null;
}

// Функция для открытия плеера с указанным ID аниме
function mountPlayer(animeId) {
    window.open("https://reyohoho.github.io/reyohoho/#shiki" + animeId, '_blank');
}

// Функция для создания кнопки плеера
function mountPlayerTail(animeId) {
    // Если кнопка уже существует, не создаём её заново
    if (document.getElementById(playerTailId)) return;

    const playerTile = document.createElement('div'); // Создаём элемент кнопки
    playerTile.id = playerTailId; // Устанавливаем ID кнопки
    playerTile.innerHTML = tailImage; // Добавляем изображение в кнопку
    playerTile.addEventListener('click', () => mountPlayer(animeId)); // При клике открываем плеер
    playerTile.addEventListener('mouseover', () => { playerTile.style.top = '0px' }); // При наведении показываем кнопку
    playerTile.addEventListener('mouseout', () => { playerTile.style.top = '-32px' }); // При уходе скрываем кнопку

    setTimeout(() => {
        playerTile.style.top = '-32px'; // Изначальное положение кнопки
    }, 100);

    document.body.appendChild(playerTile); // Добавляем кнопку на страницу
}

// Функция для удаления элемента по ID
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.remove();
}

// Основная функция для обработки страницы Shikimori
function shikimoriPageHandler() {
    const animeId = extractAnimeId(); // Извлекаем ID аниме
    if (animeId) {
        mountPlayerTail(animeId); // Если ID найден, создаём кнопку
    } else {
        removeElement(playerTailId); // Если ID не найден, удаляем кнопку
    }
}

// Наблюдатель за изменениями на странице
const observer = new MutationObserver(() => {
    const url = location.href;
    // Если URL изменился, обновляем состояние
    if (url !== lastUrl) {
        lastUrl = url;
        shikimoriPageHandler();
    }

    // Если кнопка не существует, пробуем создать её
    if (!document.getElementById(playerTailId)) {
        const animeId = extractAnimeId();
        if (animeId) {
            mountPlayerTail(animeId);
        }
    }
});

// Настройка наблюдателя за изменениями в DOM
observer.observe(document, { subtree: true, childList: true });
window.addEventListener('load', shikimoriPageHandler);

// Функция для добавления стилей
if (typeof GM_addStyle === 'undefined') {
    GM_addStyle = (aCss) => {
        const head = document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

// Стили для кнопки плеера
const my_css = `#watch-shikimori-player-tail {
    width: 32px;
    height: 128px;
    top: -128px;
    left: 8px;
    outline: none;
    cursor: pointer;
    position: fixed;
    z-index: 8888;
    transition: top 0.2s ease;
}`;
GM_addStyle(my_css);
