// ==UserScript==
// @name         SchalkerMap bypass
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ты больше не армянин
// @author       erxson
// @match        https://secretlink.schalker.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=schalker.ru
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/483466/SchalkerMap%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/483466/SchalkerMap%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создание карты

    var mapContainer = document.createElement("main");
    mapContainer.id = "app";
    mapContainer.setAttribute("aria-hidden", "true");
    document.body.appendChild(mapContainer);

    var indexjs = document.createElement("script");
    indexjs.setAttribute("type", "module");
    indexjs.setAttribute("src", "./live-atlas/assets/index.a82d2095.js");
    document.body.appendChild(indexjs);

    var vendorjs = document.createElement("link");
    vendorjs.setAttribute("rel", "modulepreload");
    vendorjs.setAttribute("href", "./live-atlas/assets/vendor.d0ab50b1.js");
    document.body.appendChild(vendorjs);

    var css = document.createElement("style");
    css.innerText = "html { font-size: 62.5%; } ";
    document.body.appendChild(css);

    // Удаление логин формы

    const leafletLink = document.querySelector('link[href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"]');
    if (leafletLink) leafletLink.parentNode.removeChild(leafletLink);

    const leafletScript = document.querySelector('script[src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"]');
    if (leafletScript) leafletScript.parentNode.removeChild(leafletScript);

    const flowbiteLink = document.querySelector('link[href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"]');
    if (flowbiteLink) flowbiteLink.parentNode.removeChild(flowbiteLink);

    const tailwindScript = document.querySelector('script[src="tailwind.js"]');
    if (tailwindScript) tailwindScript.parentNode.removeChild(tailwindScript);

    const tailwindStyle = document.getElementById('tailwind');
    if (tailwindStyle) tailwindStyle.disabled = true;

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.parentNode.removeChild(loginForm);

})();