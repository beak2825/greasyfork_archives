// ==UserScript==
// @name         UserScript crm
// @namespace    http://crm.red-promo.ru/
// @version      1.6
// @description  для зачеркивания выполненых задач
// @author       none
// @match        http://crm.red-promo.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423117/UserScript%20crm.user.js
// @updateURL https://update.greasyfork.org/scripts/423117/UserScript%20crm.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("start");

    const getItems = () => JSON.parse(window.localStorage.getItem("task")) ?? [];

    function lineThrough() {
        if (document.getSelection().baseNode && !document.getSelection().baseOffset) {
            const elem = document.getSelection().baseNode.parentElement;
            if (elem && elem.closest("tr").textContent.includes("Контент") && elem.closest("td")) {
                elem.classList.add("line");
                document.getSelection().removeAllRanges();
                updateStorage();
            }
        }
    }

    function addslashes(str) {
        return (str + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
    }

    function updateStorage() {
        let res = getItems();
        document.querySelectorAll(".line").forEach((item) => {
            if (!res.includes(item.textContent)) {
                res.push(item.textContent);
            }
        });
        window.localStorage.setItem("task", JSON.stringify(res));
    }

    window.clearStorageTask = function () {
        window.localStorage.clear();
        window.location.reload();
    };

    function start() {
        getItems().forEach((item) => $('p:contains("' + addslashes(item) + '")').addClass("line"));
        $(document.head).append("<style>.line{text-decoration:line-through}</style>");
        $(".nav.navbar-nav").first().append('<li><a href="#" onclick="clearStorageTask()">Очистить</a></li>');
        document.addEventListener("selectionchange", lineThrough);
    }

    window.onload = start;
    console.log("end");
})();
