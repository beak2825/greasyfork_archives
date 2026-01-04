// ==UserScript==
// @name         AniGift
// @namespace    http://tampermonkey.net/
// @version      1
// @author       UltraISO & Fenion
// @description  AniGift...
// @match        https://anichat.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anichat.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463887/AniGift.user.js
// @updateURL https://update.greasyfork.org/scripts/463887/AniGift.meta.js
// ==/UserScript==
let proMenuOpened = false;

const makeAGift = (targetUsername) => {
    const clientUserId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("bc_userid="))
        ?.split("=")[1];
    $.post(
        "system/box/profile.php",
        {
            get_profile: clientUserId,
            cp: curPage,
            token: utk,
        },
        function (response) {
            const doc = new DOMParser().parseFromString(response, "text/html");
            let clientUsername = doc
                .getElementsByClassName("pro_name")[0]
                .innerText.trim();
            window.processChatPost(
                clientUsername +
                    " дарит " +
                    targetUsername +
                    " загадочный подарок! https://i.ibb.co/2ZYX7mN/pixel-art-christmas-or-birthday-gift-red-and-gold-box-8bit-game-item-on-white-background-vector-Phot.png"
            );
        }
    );
};

const addGiftButton = () => {
    const origin = window.loadProMenu;
    window.loadProMenu = (...args) => {
        origin.apply(this, args);

        if (proMenuOpened) {
            document.getElementById("giftItem").remove();
            proMenuOpened = false;
        } else {
            const target = document.body.querySelector("#pro_menu");

            const item = document.createElement("div");
            const iconDiv = document.createElement("div");
            const icon = document.createElement("i");
            const text = document.createElement("div");

            const targetUsername = document
                .getElementsByClassName("pro_name")[0]
                .innerText.trim();

            item.className = "fmenu_item";
            item.id = "giftItem";
            item.onclick = () => makeAGift(targetUsername);
            iconDiv.className = "fmenu_icon";
            icon.className = "fa fa-gift";
            icon.style = "color: deeppink";
            text.className = "fmenu_text";
            text.innerText = "Подарок";

            iconDiv.append(icon);
            item.append(iconDiv, text);
            target.append(item);
            proMenuOpened = true;
        }
    };
};

(function () {
    "use strict";

    addGiftButton();
})();
