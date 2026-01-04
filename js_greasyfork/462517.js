// ==UserScript==
// @name         Discord Redirect To Web App
// @name:ru      Discord сайт сразу в Web App
// @namespace    DiscordRedirectToWebApp
// @version      1.0
// @license      MIT
// @supportURL   https://mjkey.ru/
// @homepageURL  https://mjkey.ru/#donate
// @description  Small script • Discord Home Page redirect to Web App
// @description:ru Маленький скрипт, для тех кто пользуются веб версией дискорда. Перенаправляет с главной страницы сайта Дискорда на веб приложение.
// @author       MjKey
// @match        https://discord.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462517/Discord%20Redirect%20To%20Web%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/462517/Discord%20Redirect%20To%20Web%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace("https://discord.com/app")
})();