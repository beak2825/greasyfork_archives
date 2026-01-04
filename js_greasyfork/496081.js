// ==UserScript==
// @name         Передогляд емодзі в social.net.ua (тимчасво)
// @namespace    http://tampermonkey.net/
// @license      GPLv2
// @version      4
// @description  Робить окремий елемент справа вгорі для перегляду емодзі в адекватному розмірі, щоб було хоч щось зрозуміло, що там зображено
// @author       SergoZar
// @match        https://social.net.ua/*
// @icon         https://social.net.ua/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496081/%D0%9F%D0%B5%D1%80%D0%B5%D0%B4%D0%BE%D0%B3%D0%BB%D1%8F%D0%B4%20%D0%B5%D0%BC%D0%BE%D0%B4%D0%B7%D1%96%20%D0%B2%20socialnetua%20%28%D1%82%D0%B8%D0%BC%D1%87%D0%B0%D1%81%D0%B2%D0%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496081/%D0%9F%D0%B5%D1%80%D0%B5%D0%B4%D0%BE%D0%B3%D0%BB%D1%8F%D0%B4%20%D0%B5%D0%BC%D0%BE%D0%B4%D0%B7%D1%96%20%D0%B2%20socialnetua%20%28%D1%82%D0%B8%D0%BC%D1%87%D0%B0%D1%81%D0%B2%D0%BE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prev= document.createElement("div");
        prev.id = "emoji_preview";
        prev.addEventListener("clicked", function (){prev.style.display = "none";});

    history.pushState({ page: 1 }, "", "");

    window.addEventListener("popstate", function(event) {
        prev.style.display = "none";
    });

    var img = document.createElement("img");
        prev.appendChild(img);

    var style =document.createElement("style");

    var width = 200, height = 200;

    style.innerHTML = `
    #emoji_preview{
        position:fixed;
        width: ${width}px;
        height: ${height}px;
        right: 20px;
        top: 20px;
        border: solid 1px white;
        background:black;
        z-index: 9999;
        text-align:center;
        padding: 5px;
        display:none;
    }

    #emoji_preview > img{
        width: calc(100% - 5px);
        max-width: ${width}px;
        max-height: ${height}px;
    }
    `;

    document.body.prepend(style);
    document.body.prepend(prev);

    function handleMouseOver (event){
        if (event.target.tagName == "IMG"
            &&
            (event.target.parentNode.parentNode.classList.contains('emoji-item')
             || event.target.parentNode.className == "still-image emoji img")
             || event.target.parentNode.className == "still-image animated emoji img"
             || event.target.className == "reaction-emoji-content"
            ) {
                    prev.style.display = "block";
                    img.src = event.target.src;
                    setEvent(event.target);
        }
    };

    function setEvent(element){
        if (element.getAttribute("setout") == 1) return;
        element.setAttribute("setout", 1);
        element.addEventListener('mouseout', function(){prev.style.display = "none";});
    }

    document.body.addEventListener('mouseover', handleMouseOver);


})();