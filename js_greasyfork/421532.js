// ==UserScript==
// @name         MouseHunt - Show Adventure Book
// @author       Yigit "drocan" Sever
// @namespace    https://greasyfork.org/en/users/223891-yi%C4%9Fit-sever
// @version      0.2
// @description  Adds a button to show adventure book under kingdom dropdown
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/421532/MouseHunt%20-%20Show%20Adventure%20Book.user.js
// @updateURL https://update.greasyfork.org/scripts/421532/MouseHunt%20-%20Show%20Adventure%20Book.meta.js
// ==/UserScript==


function addButton() {

    const target = document.querySelector("li .forum");
    if (target) {

        const li = document.createElement("li");
        li.className = "show_adv_book";
        const button = document.createElement("a");
        button.href = "#";
        button.innerText = "Adventure Book";
        button.onclick = function () {
            hg.views.AdventureBookView.show();
        };
        const icon = document.createElement("div");
        icon.className = "icon";
        icon.style.backgroundImage="url(/images/teams/sigil/book/_11.png)"
        button.appendChild(icon);
        li.appendChild(button);
        target.insertAdjacentElement("afterend", li);
    }
}

$(document).ready(function() {
    //If current page is main camp or journal
    var pageTitle = document.title;
    if (pageTitle.includes("Hunter's Camp") || pageTitle.includes("Journal Page")) {
        addButton();
    }
});
