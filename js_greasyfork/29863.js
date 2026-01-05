// ==UserScript==
// @name           GiCon
// @version        0.1.9
// @description    Add favicons on google search page.
// @description:ru Добавляет иконки сайтов в поисковый ответ.
// @author         gvvad
// @run-at         document-end
// @include        http*://google.*/*
// @include        http*://www.google.*/*
// @include        http*://google.*.*/*
// @include        http*://www.google.*.*/*
// @noframes
// @grant          none
// @license        MIT; https://opensource.org/licenses/MIT
// @copyright      2022, gvvad
// @namespace      https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/29863/GiCon.user.js
// @updateURL https://update.greasyfork.org/scripts/29863/GiCon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const PROVIDER = "https://www.google.com/s2/favicons?domain=";
    const REG_DOMAIN = /:\/\/(.+?)(?:\/|$)/;

    //custom css rule for icon
    try {
        let styl = document.createElement("style");
        document.head.append(styl);
        styl.sheet.insertRule(".gicofav{position:absolute; top:0.2em; left:-1.8em;}");
    } catch(e) {
        console.error("GiCon:css rule error!");
        return;
    }

    //schedule on page load event
    document.documentElement.addEventListener("load", function() {
        try {
            let lst = document.querySelectorAll("#rcnt .g") || [];
            if (!lst.length) return;

            let nimg = document.createElement("img");
            nimg.classList.add("gicofav");

            for (let item of lst) {
                try {
                    if (item.querySelector(".gicofav")) {
                        continue;
                    }
                    let a = item.querySelector("a");

                    let nhref = REG_DOMAIN.exec(a.href)[1];
                    nimg.setAttribute("src", `${PROVIDER}${nhref}`);

                    item.style.position = "relative";
                    item.insertBefore(nimg, item.firstElementChild);
                } catch(e) {
                    console.warn(e);
                    continue;
                }
            }
        } catch(e) {
            console.error("GiCon:unexpected error!");
        }
    }, true);
})();