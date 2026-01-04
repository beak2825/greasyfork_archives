// ==UserScript==
// @name         Change Likes to Heart UPD
// @namespace    http://tampermonkey.net/
// @version      0.001001
// @description  Изменение иконки лайка на иконку симпатии НОВЫЙ
// @author       molihan
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @match        https://lolz.live/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512005/Change%20Likes%20to%20Heart%20UPD.user.js
// @updateURL https://update.greasyfork.org/scripts/512005/Change%20Likes%20to%20Heart%20UPD.meta.js
// ==/UserScript==

(function() {
    const users = document.querySelectorAll(".userText");

    let html = document.createElement("div");

    users.forEach(user => {
        let link = user.querySelector("span a.username");

        fetch(`https://lolz.live/${link.getAttribute("href")}`).then(resul => resul.text().then(htmlText => {
            let noReaction = 0;

            html.innerHTML = htmlText;

            let reaction = Number(html.querySelector(".count").textContent.replace(" ", ""));

            fetch(`https://lolz.live/${link.getAttribute("href")}likes?type=gotten&content_type=post&stats=1`).then(resul => {
                resul.text().then(htmlText => {
                    html.innerHTML = htmlText;

                    let allReaction = html.querySelectorAll(".node");
                    allReaction.forEach(el => {
                        if (el.querySelector(".muted").textContent.toLowerCase().indexOf("розыгрыш") !== -1) {
                            noReaction += Number(el.querySelector(".counter").textContent.replace(" ", ""));
                        }
                    });

                    const adjustedCount = reaction - noReaction;
                    const element = `<i class="userCounterIcon fas fa-heart"></i>${reaction}`;
                    if (user.querySelector(".userCounters span")) {
                        user.querySelector(".userCounters span").innerHTML = element;
                    } else {
                        user.insertAdjacentHTML("beforeend", `<span class="userCounter item muted">${element}</span>`);
                    }
                });
            });
        }));
    });
})();