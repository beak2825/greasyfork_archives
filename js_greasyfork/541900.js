// ==UserScript==
// @name         Новый ClaimLitoshi Auto-Claim полуавтомат
// @namespace    http://tampermonkey.net/
// @version      2025-08-11
// @description  упрощает работу на кране
// @author       Danik Odze
// @match        https://claimlitoshi.top/*
// @match        https://claimlitoshi.top/faucet/*
// @match        https://claimlitoshi.top/firewall
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimlitoshi.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541900/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20ClaimLitoshi%20Auto-Claim%20%D0%BF%D0%BE%D0%BB%D1%83%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/541900/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20ClaimLitoshi%20Auto-Claim%20%D0%BF%D0%BE%D0%BB%D1%83%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() { //убирает ads pop-up
        const interval = setInterval(() => {
            if (document.querySelector("body > div.loader")) {
                document.querySelector("body > div.loader").remove();
                clearInterval(interval);
            }
        }, 1000);
    });
    setTimeout(() => { //общая задержка
        if (document.querySelectorAll("h3.mb-1")[0].textContent !== 'Ready' && document.querySelectorAll("h3.mb-1")[3].textContent.split("/")[0] !== '0') {
            redirectToNextUrl();
        } else {}

        function redirectToNextUrl() { //меняет кран
            const currentUrl = window.location.href;
            if (currentUrl === "https://claimlitoshi.top/dashboard") {
                window.location.href = "https://claimlitoshi.top/faucet/1";
                return;
            }
            if (currentUrl === "https://claimlitoshi.top/faucet/1") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/2";
                }, 1000);
            } else if (currentUrl === "https://claimlitoshi.top/faucet/2") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/3";
                }, 1000);
            } else if (currentUrl === "https://claimlitoshi.top/faucet/3") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/4";
                }, 1000);
            } else if (currentUrl === "https://claimlitoshi.top/faucet/4") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/5";
                }, 1000);
            } else if (currentUrl === "https://claimlitoshi.top/faucet/5") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/6";
                }, 1000);
            } else if (currentUrl === "https://claimlitoshi.top/faucet/6") {
                setTimeout(function() {
                    window.location.href = "https://claimlitoshi.top/faucet/1";
                }, 1000);
            }
        }
        if (document.querySelectorAll('div[style^="position:"]')[1]) document.querySelectorAll('div[style^="position:"]')[1].remove() //убирает мешающую рекламу
        if (document.querySelectorAll('div[style^="position:"]')[1]) document.querySelectorAll('div[style^="position:"]')[1].remove()

        function realClick(bx, by) { //нажать лев. кнопку мышки по координатам х у
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancellable: true,
                clientX: bx,
                clientY: by,
            })

            element.dispatchEvent(clickEvent)
        }
        var element = document.querySelector("div.captcha-show"); //картинка капчи
        element.style.position = "absolute"; //переносим в нужное место

        element.style.top = "0px";

        element.style.left = "0px";
        for (var i = 0; i < 8; i++) { //тыкаем по капче, пока не угадаем
            for (var j = 0; j < 8; j++) {
                if (document.querySelector('button[type="submit"]').disabled && document.querySelector('button[type="submit"]').textContent == ' Collect your reward ') {
                    realClick(i * 40, j * 40)
                } else {
                    document.querySelector('button[type="submit"]').click(); //если угали, нажимаем кнопки
                    break;
                }
            }
        }


        //window.scroll(0, document.body.scrollHeight); //scroll page down
        if (document.getElementById("captcha_check")) { //обход первой защиты от ботов
            document.getElementById("captcha_check").click();
            // $("div.captcha-show").scrollIntoView();//scroll page down to image
        }
        $("div.captcha-show").on("click", function(event) {
            setTimeout(() => { // задержка нажатия кнопки
                if (!document.querySelector('button[type="submit"]').disabled) {
                    console.log("click")
                    document.querySelector('button[type="submit"]').click();
                }
            }, 5000)
        });
    }, 3000);
})();