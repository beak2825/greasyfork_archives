// ==UserScript==
// @name         cock
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  cock cock cock
// @author       S30N1K
// @match        https://dota2.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429891/cock.user.js
// @updateURL https://update.greasyfork.org/scripts/429891/cock.meta.js
// ==/UserScript==

(() => {

    const img = "https://i.ibb.co/XZTNdRN/482968.gif"

    if (/\/forum\/threads\//.test(window.location.pathname)){
        for (const j of $(".forum-theme__list > li")) {
            $(j).find(".forum-theme__item-left-mob > a").html("cock")
        }
    }

    for (const e of $(".forum-theme__list img")){
        $(e).attr("src", img)
    }

})()