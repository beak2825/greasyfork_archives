// ==UserScript==
// @name            DungeonsOfTheWell profile page: return the `Class levels` option in the menu
// @name:ru         Возвращение ссылки на страницу "Уровни классов" на странице профиля игры "Подземелья колодца"
// @namespace       http://tampermonkey.net/
// @version         2025-08-03
// @description     Adds a link to the page with id=621 in the drop-down list of the "Journal" menu item on the profile page of the game "Dungeons of the Well"
// @description:ru  Добавляет ссылку на страницу с id=621 в выпадающем списке пункта меню "Журнал" на странице профиля игры "Подземелья колодца"
// @author          rick_headle
// @match           https://vip3well.activeusers.ru/app.php*
// @match           https://welldungeon.online/*
// @icon            none
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/526920/%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%22%D0%A3%D1%80%D0%BE%D0%B2%D0%BD%D0%B8%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BE%D0%B2%22%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20%D0%B8%D0%B3%D1%80%D1%8B%20%22%D0%9F%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%B5%D0%BB%D1%8C%D1%8F%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D1%86%D0%B0%22.user.js
// @updateURL https://update.greasyfork.org/scripts/526920/%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%22%D0%A3%D1%80%D0%BE%D0%B2%D0%BD%D0%B8%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BE%D0%B2%22%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20%D0%B8%D0%B3%D1%80%D1%8B%20%22%D0%9F%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%B5%D0%BB%D1%8C%D1%8F%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D1%86%D0%B0%22.meta.js
// ==/UserScript==

// Get the first link in the list
const existingLinkElement = document.querySelector("#m_page a");
if (existingLinkElement) {
    const existingLink = existingLinkElement.href;

    // Modify the existing link to have id=621
    const newLink = existingLink.replace(/id=\d+/, "id=621");

    // Create a new list item with the modified link and title
    const newListElement = document.createElement("li");
    newListElement.innerHTML = `
        <a href="${newLink}" title="Уровни классов" role="menuitem">
            <i class="fa fa-bars"></i>
            <span class=""> Уровни классов</span>
        </a>
    `;

    // Append the new list item to the existing list
    document.querySelector("#m_page").parentNode.appendChild(newListElement);
} else {
    console.log("No link found in the list.");
}