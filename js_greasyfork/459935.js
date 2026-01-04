// ==UserScript==
// @name         Отслеживание тележек
// @namespace    virtonomica
// @version      0.1
// @description  Отслеживание розничных телег.
// @author       VaryaUsoyanComp
// @match        https://virtonomica.ru/*/main/user/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtonomica.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459935/%D0%9E%D1%82%D1%81%D0%BB%D0%B5%D0%B6%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BB%D0%B5%D0%B6%D0%B5%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/459935/%D0%9E%D1%82%D1%81%D0%BB%D0%B5%D0%B6%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BB%D0%B5%D0%B6%D0%B5%D0%BA.meta.js
// ==/UserScript==

var run = function() {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    var savedCountryElements = [];
    let currentCountryElement = [];

    $('.metro_header').append(`
  <button id="btnTelega" style="
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 12px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  ">
   Сохранить текущие тележки
  </button>
`);

    $('.metro_header').append(`
  <button id="btnTelega2" style="
    background-color: #2196F3;
    border: none;
    color: white;
    padding: 12px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  ">
   Сравнить с предыдущим сохранением
  </button>
`);
    $('.metro_header').append("<div id='text-display'></div>");
    $("#text-display").text("Добавились ....  Убавились ...");

    $('#btnTelega').click(function () {
        savedCountryElements =[];
        $('span.font-grey-mint').each(function () {
            if ($(this).text().startsWith('Топ-5 по выручке в розничном секторе')) {
                savedCountryElements.push($(this).text().replace(/Топ-5 по выручке в розничном секторе /g, ""));
            }
        });
        localStorage.setItem("savedCountryElements", JSON.stringify(savedCountryElements));
        console.log(savedCountryElements);
    });

    $('#btnTelega2').click(function () {
        var storageSavedCountryElements = JSON.parse(localStorage.getItem("savedCountryElements"));
        $('span.font-grey-mint').each(function () {
            if ($(this).text().startsWith('Топ-5 по выручке в розничном секторе')) {
                currentCountryElement.push($(this).text().replace(/Топ-5 по выручке в розничном секторе /g, ""));
            }
        });
        console.log(storageSavedCountryElements);
        console.log(currentCountryElement);

        var missingInArr1 = currentCountryElement.filter(function(element) {
            return storageSavedCountryElements.indexOf(element) === -1;
        });

        var missingInArr2 = storageSavedCountryElements.filter(function(element) {
            return currentCountryElement.indexOf(element) === -1;
        });

        $("#text-display").text("Добавились -  "+ missingInArr1+" |  Пропали -  " + missingInArr2 );
        //console.log("Добавились: " + missingInArr1);
        //console.log("Убавились: " + missingInArr2);
        currentCountryElement = [];
    });


}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}