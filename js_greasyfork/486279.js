// ==UserScript==
// @name        My Script
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Load content from another site
// @author      You
// @license     MIT
// @match        https://www.autodoc.ru/*
// @match        https://www.mail.ru/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486279/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486279/My%20Script.meta.js
// ==/UserScript==

(function() {
    // Create a new div element
    var div = document.createElement('div');
    div.id = 'myDiv';
    div.style.position = 'fixed';
    div.style.bottom = '5px';
    div.style.left = '5px';
    div.style.zIndex = '9999';
    div.style.width = '1000px'; // Установка ширины
    div.style.height = '500px'; // Установка высоты
    div.style.overflow = 'auto'; // Добавлено для прокрутки

    // Append the div to the body
    document.body.appendChild(div);




    // Load content from another site
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.google.com/search?q=%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8&udm",
        onload: function(response) {
            div.innerHTML = response.responseText;

            // Parse the loaded HTML
            var parser = new DOMParser();
            var doc = parser.parseFromString(div.innerHTML, "text/html");

            // Get the first five elements with class '.dx-nowrap.f14b.dxeBase_ZZapAqua'
            var elements = Array.from(doc.querySelectorAll('.dx-nowrap.f14b.dxeBase_ZZapAqua')).slice(0, 5);

            // Loop through all elements and alert their text content
            elements.forEach(function(element) {
                alert(element.textContent);
            });
        }
    });
})();




function displayImage(picUrl) {
    // Создаем новый элемент img
    let imgElement = document.createElement("img");

    // Устанавливаем src для imgElement равным picUrl
    imgElement.src = picUrl;

    // Добавляем imgElement в div
    div.appendChild(imgElement);
}

// Используем функцию
displayImage("https://example.com/path/to/image.jpg");




