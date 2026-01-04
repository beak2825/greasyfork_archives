// ==UserScript==

// @name         Themes for Mangalib
// @name:ru      Темы для Mangalib
// @namespace    http://tampermonkey.net/

// @version      2.0

// @description      This script will add new topics to Mangalib. Five whole new themes!
// @description:ru   Этот скрипт добавит новые темы на Mangalib. Целых 5 новых тем!

// @author       TheTime

// @match        https://mangalib.me/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangalib.me
// @grant           GM_info
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @run-at          document-body
// @license         MIT

// @downloadURL https://update.greasyfork.org/scripts/477161/Themes%20for%20Mangalib.user.js
// @updateURL https://update.greasyfork.org/scripts/477161/Themes%20for%20Mangalib.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(`

.theme-switcher {
  position: fixed;
  top: 5px;
  right: 535px;
  z-index: 1000;
}

#theme-selector {
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: var(--background-header);
  cursor: pointer;
  color: #fff;
}

#theme-selector option {
  background-color: var(--background-header);
  color: #fff;
}


`)

const themeSelectorContainer = document.createElement("div");
themeSelectorContainer.classList.add("theme-switcher");

const themeSelector = document.createElement("select");
themeSelector.id = "theme-selector";

themeSelector.innerHTML = `
  <option value="standart">Стандартная тема</option>
  <option value="fiol">Фиолетовая Тема</option>
  <option value="red">Красная тема</option>
  <option value="blue">Синяя тема</option>
  <option value="green">Зеленая тема</option>
  <option value="pink">Розовая тема</option>
`;

themeSelectorContainer.appendChild(themeSelector);

const headerMenu = document.querySelector('.header__menu'); // Находим элемент с классом "header__menu"
headerMenu.appendChild(themeSelectorContainer);

const savedTheme = localStorage.getItem("selectedTheme");

if (savedTheme) {
    themeSelector.value = savedTheme;
    applyTheme(savedTheme);
}

themeSelector.addEventListener("change", function() {
    const selectedTheme = themeSelector.value;
    applyTheme(selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
});

function applyTheme(theme) {
  if (document.documentElement.getAttribute('data-mode') === 'dark') {
    if (theme === "standart") {
        document.body.style.setProperty('--button-primary-bg', '#ffa332');
        document.body.style.setProperty('--button-primary-bg-hover', '#ff8c00');
        document.body.style.setProperty('--button-primary-bg-active', '#f28500');
        document.body.style.setProperty('--text-link', '#f29766');
        document.body.style.setProperty('--primary', '#ff8c00');
        document.body.style.setProperty('--primary-lighten', '#ffa332');
        document.body.style.setProperty('--primary-darken', '#ffa332');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    } else if (theme === "fiol") {
        document.body.style.setProperty('--button-primary-bg', '#7a506f');
        document.body.style.setProperty('--button-primary-bg-hover', '#a87ca0');
        document.body.style.setProperty('--button-primary-bg-active', '#1c1c1e');
        document.body.style.setProperty('--text-link', '#a87ca0');
        document.body.style.setProperty('--primary', '#7a506f');
        document.body.style.setProperty('--primary-lighten', '#7a506f');
        document.body.style.setProperty('--primary-darken', '#7a506f');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    } else if (theme === "red") {
        document.body.style.setProperty('--button-primary-bg', '#d9534f');
        document.body.style.setProperty('--button-primary-bg-hover', '#ec6965');
        document.body.style.setProperty('--button-primary-bg-active', '#d9534f');
        document.body.style.setProperty('--text-link', '#ec6965');
        document.body.style.setProperty('--primary', '#d9534f');
        document.body.style.setProperty('--primary-lighten', '#d9534f');
        document.body.style.setProperty('--primary-darken', '#d9534f');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    } else if (theme === "blue") {
        document.body.style.setProperty('--button-primary-bg', '#5bc0de');
        document.body.style.setProperty('--button-primary-bg-hover', '#87d3f2');
        document.body.style.setProperty('--button-primary-bg-active', '#5bc0de');
        document.body.style.setProperty('--text-link', '#87d3f2');
        document.body.style.setProperty('--primary', '#5bc0de');
        document.body.style.setProperty('--primary-lighten', '#5bc0de');
        document.body.style.setProperty('--primary-darken', '#5bc0de');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    } else if (theme === "pink") {
        document.body.style.setProperty('--button-primary-bg', '#ff69b4');
        document.body.style.setProperty('--button-primary-bg-hover', '#ff8eb1');
        document.body.style.setProperty('--button-primary-bg-active', '#ff69b4');
        document.body.style.setProperty('--text-link', '#ff8eb1');
        document.body.style.setProperty('--primary', '#ff69b4');
        document.body.style.setProperty('--primary-lighten', '#ff69b4');
        document.body.style.setProperty('--primary-darken', '#ff69b4');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    } else if (theme === "green") {
        document.body.style.setProperty('--button-primary-bg', '#00ff00');
        document.body.style.setProperty('--button-primary-bg-hover', '#00cc00');
        document.body.style.setProperty('--button-primary-bg-active', '#009900');
        document.body.style.setProperty('--text-link', '#00cc00');
        document.body.style.setProperty('--primary', '#00ff00');
        document.body.style.setProperty('--primary-lighten', '#33ff33');
        document.body.style.setProperty('--primary-darken', '#009900');
        document.body.style.setProperty('--background-header', '#1c1c1e');
    }
  } else if (document.documentElement.getAttribute('data-mode') === 'light'){
    if (theme === "standart") {
        document.body.style.setProperty('--button-primary-bg', '#ffa332');
        document.body.style.setProperty('--button-primary-bg-hover', '#ff8c00');
        document.body.style.setProperty('--button-primary-bg-active', '#f28500');
        document.body.style.setProperty('--text-link', '#f29766');
        document.body.style.setProperty('--primary', '#ff8c00');
        document.body.style.setProperty('--primary-lighten', '#ffa332');
        document.body.style.setProperty('--primary-darken', '#ffa332');
        document.body.style.setProperty('--background-header', '#e48f13');
    } else if (theme === "fiol") {
        document.body.style.setProperty('--button-primary-bg', '#7a506f');
        document.body.style.setProperty('--button-primary-bg-hover', '#a87ca0');
        document.body.style.setProperty('--button-primary-bg-active', '#7a506f');
        document.body.style.setProperty('--text-link', '#a87ca0');
        document.body.style.setProperty('--primary', '#7a506f');
        document.body.style.setProperty('--primary-lighten', '#7a506f');
        document.body.style.setProperty('--primary-darken', '#7a506f');
        document.body.style.setProperty('--background-header', '#7a506f');
    } else if (theme === "red") {
        document.body.style.setProperty('--button-primary-bg', '#d9534f');
        document.body.style.setProperty('--button-primary-bg-hover', '#ec6965');
        document.body.style.setProperty('--button-primary-bg-active', '#d9534f');
        document.body.style.setProperty('--text-link', '#ec6965');
        document.body.style.setProperty('--primary', '#d9534f');
        document.body.style.setProperty('--primary-lighten', '#d9534f');
        document.body.style.setProperty('--primary-darken', '#d9534f');
        document.body.style.setProperty('--background-header', '#d9534f');
    } else if (theme === "blue") {
        document.body.style.setProperty('--button-primary-bg', '#5bc0de');
        document.body.style.setProperty('--button-primary-bg-hover', '#87d3f2');
        document.body.style.setProperty('--button-primary-bg-active', '#5bc0de');
        document.body.style.setProperty('--text-link', '#87d3f2');
        document.body.style.setProperty('--primary', '#5bc0de');
        document.body.style.setProperty('--primary-lighten', '#5bc0de');
        document.body.style.setProperty('--primary-darken', '#5bc0de');
        document.body.style.setProperty('--background-header', '#5bc0de');
    } else if (theme === "pink") {
        document.body.style.setProperty('--button-primary-bg', '#ff69b4');
        document.body.style.setProperty('--button-primary-bg-hover', '#ff8eb1');
        document.body.style.setProperty('--button-primary-bg-active', '#ff69b4');
        document.body.style.setProperty('--text-link', '#ff8eb1');
        document.body.style.setProperty('--primary', '#ff69b4');
        document.body.style.setProperty('--primary-lighten', '#ff69b4');
        document.body.style.setProperty('--primary-darken', '#ff69b4');
        document.body.style.setProperty('--background-header', '#ff69b4');
    } else if (theme === "green") {
        document.body.style.setProperty('--button-primary-bg', '#00ff00');
        document.body.style.setProperty('--button-primary-bg-hover', '#00cc00');
        document.body.style.setProperty('--button-primary-bg-active', '#009900');
        document.body.style.setProperty('--text-link', '#00cc00');
        document.body.style.setProperty('--primary', '#00ff00');
        document.body.style.setProperty('--primary-lighten', '#33ff33');
        document.body.style.setProperty('--primary-darken', '#009900');
        document.body.style.setProperty('--background-header', '#005700');
    }
  }
}

})();