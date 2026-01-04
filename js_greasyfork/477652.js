// ==UserScript==
// @name         Count postmoderation solves
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This little script will help you count all your solved tasks by postmoderation on CodeHedgehog
// @author       DobriyCheburek
// @match        https://code.hits.university/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hits.university
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/477652/Count%20postmoderation%20solves.user.js
// @updateURL https://update.greasyfork.org/scripts/477652/Count%20postmoderation%20solves.meta.js
// ==/UserScript==

//На всех страницах ежа появятся 2 кнопки - обнуление и вывод счетчика. Он хранится локально в вашем браузере и не зависит от вкладки
//Счетчик увеличивается, только если после проверки была нажата кнопка "сохранить"

(function() {
    'use strict';
    window.addEventListener("load", function() {
        //localStorage.clear()
        if (localStorage.getItem("counter") == null) {
            //alert ("create variable")
            localStorage.setItem("counter", 0)
        }
        var testDiv = document.createElement("div")
        testDiv.innerHTML = '<button id="toZero" type="button">сбросить счетчик</button><button id="nowCounter" type="button">Вывести нынешний счетчик</button>'
        document.getElementById("content-wrapper").prepend(testDiv)
        document.getElementById ("toZero").addEventListener (
            "click", function() {
                localStorage.clear()
                localStorage.setItem("counter", 0)
                alert ("it is 0 now")
            }, false);
        document.getElementById ("nowCounter").addEventListener (
            "click", function() {
                alert(localStorage.getItem("counter"))
            }, false);
        if (document.URL.includes("/solutions/postmoderation/")) {
            const elements1 = document.querySelectorAll('input[type="submit"]');
            elements1[0].addEventListener (
            "click", function() {
                //alert ("you are going to save postmoderation!")
                var countNow = parseInt(localStorage.getItem("counter")) + 1
                localStorage.setItem("counter", countNow)
            }, false);
            console.log(elements1[0])
        }
    }, false)
})();
