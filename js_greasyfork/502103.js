// ==UserScript==
// @name         Добавление кнопки списания
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Скрипт добавляет кнопку, которая открывает страницу списаний для каждого договора на странице. Еще немного изменяет менюшку для выбора количества договоров на странице.
// @author       HYDRA
// @match        https://svoi-ludi.ru/manager/collector-debt/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=svoi-ludi.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502103/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502103/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addButton();
    addOption();

    function addOption ()
    {
        let perPage = document.getElementsByName("per-page");

        console.log(perPage[0])

        for (let i = 0; i <= 2; i++)
        {
            perPage[0].removeChild(perPage[0].children[1]);
        }

        let tag = document.createElement("option");
        let text = document.createTextNode("50");
        tag.value = 50;
        tag.appendChild(text);
        perPage[0].appendChild(tag);

        tag = document.createElement("option");
        text = document.createTextNode("100");
        tag.value = 100;
        tag.appendChild(text);
        perPage[0].appendChild(tag);

        tag = document.createElement("option");
        text = document.createTextNode("500");
        tag.value = 500;
        tag.appendChild(text);
        perPage[0].appendChild(tag);

        tag = document.createElement("option");
        text = document.createTextNode("1000");
        tag.value = 500;
        tag.appendChild(text);
        perPage[0].appendChild(tag);
    }

    function addButton ()
    {
        let pullLeft = document.querySelector(".pull-left");

        let tag = document.createElement("a");
        let text = document.createTextNode("Открыть списания");

        tag.appendChild(text);
        tag.className += "btn btn-primary";
        tag.style.backgroundColor = "#7AB733";
        tag.style.borderColor = "#6da42e";
        tag.style.marginRight = "5px";
        tag.addEventListener("click", () => {openPage("recuring")});

        pullLeft.appendChild(tag);

        tag = document.createElement("a");
        text = document.createTextNode("Открыть договоры");

        tag.appendChild(text);
        tag.className += "btn btn-primary";
        tag.style.backgroundColor = "#7AB733";
        tag.style.borderColor = "#6da42e";
        tag.style.marginRight = "5px";
        tag.addEventListener("click", () => {openPage("loan")});

        pullLeft.appendChild(tag);
    }

    function openPage(page) {
        let table = document.querySelector(".kv-grid-table");
        let rows = table.children[1].children;
        let url = "";

        switch(page){
            case "loan":
                url = "collector-comment/view"
                break;
            case "recuring":
                url = "recurring/add"
        }

        for (let row of rows)
        {
            window.open(`https://svoi-ludi.ru/manager/${url}?id=${row.children[1].children[0].getAttribute("href").split("=")[1]}`);
        }
    }
})();