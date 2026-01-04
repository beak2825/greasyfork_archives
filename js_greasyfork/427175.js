// ==UserScript==
// @name         VK Concentrate
// @namespace    http://tampermonkey.net/
// @description  Нажмите Alt+A на любой странице ВКонтакте и сконцентрируйтесь на важном
// @version      1.5.4
// @author       snowlue
// @match        https://*.vk.com/*
// @copyright    2025, snowlue (https://vk.com/snowlue)
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427175/VK%20Concentrate.user.js
// @updateURL https://update.greasyfork.org/scripts/427175/VK%20Concentrate.meta.js
// ==/UserScript==


window.addEventListener("keydown", function(e){
    // Проверяем Alt+A
    if (!e.altKey || e.code !== "KeyA") return;
    // Проверяем, не находимся ли мы на VK Видео
    if (document.location.href.indexOf("vk.com/video") + 1) return;

    let style_elem;
    // Проверяем, включен ли аддон
    if (!is_enabled) {
        // Если отключён, создаём CSS-стили и включаем переключатель
        style_elem = document.createElement("style");
        style_elem.className = "content_fullscreen";
        document.head.appendChild(style_elem).innerHTML = style;

        is_enabled = true;
        console.log("VK Concentrate is enabled.");
    }
    else {
        // Если включён, разрушаем тег CSS-стилей и отключаем переключатель
        style_elem = document.head.getElementsByClassName("content_fullscreen")[0];
        style_elem.parentNode.removeChild(style_elem);

        is_enabled = false;
        console.log("VK Concentrate is disabled.");
    }
});

let is_enabled = false; // Переключатель состояния аддона

let style =
    // Скрываем сайдбар с мини-чатом и сдвигаем основной блок контента на центр
    ".side_bar {display: none;}" +
    ".FCPanel {display: none;}" +
    "[dir] #page_body {padding-right: 82px;}" +

    // Скрываем из хедера поиск, колокольчик, кнопку экосистемы (по возможности) и лишние подписи
    "[dir=ltr] .HeaderNav__item--gap {display: none;}" +
    ".top_notify_btn {display: none;}" +
    ".TopNavBtn__ecosystemMenuLink {display: none;}" +
    ".TopNavBtn__profileArrow {display: none;}" +
    ".TopNavBtn__profileName {display: none;}" +
    "[dir] .HeaderNav__item:first-child {padding: 3px;}" +
    "[dir=ltr] .TopNavBtn__profileLink {padding-left: 0px;}" +

    // В плеере ставим центровку
    ".eltt_bottom {left: -338px !important;}" +
    ".TopNavBtn__audio {margin-right: auto;}" +
    ".TopHomeLink {width: auto;}" +
    ".HeaderNav__btns {margin-left: auto;}" + // Для VK Next
    ".HeaderNav__audio {flex-grow: 0; margin-right: auto;}" + // Для VK Next
    "[dir=ltr] .top_audio_player.top_audio_player_enabled {margin-right: auto;}";

// Проверяем, не находимся ли мы на vk.com/bugs или vk.com/bug123
if (document.location.href.indexOf("vk.com/bug") + 1) {
    // Если находимся, то подключаем спец.стили для баг-трекера
    style = style + "[dir] #page_body {padding-right: 123px;}" +
                    ".narrow_column_wrap {display: none;}"
}
