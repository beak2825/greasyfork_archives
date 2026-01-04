// ==UserScript==
// @name         ВК Типичный Ловец бот бот
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Бот для бота вк https://vk.com/typical.radmir
// @author       Mensy
// @match        https://vk.com/im?sel=-60334988
// @icon         https://sun4-15.userapi.com/s/v1/ig2/tTtHe74jj7i-n3QEAoLDVJpIo7pZtVFf3I9Iyn-g_ucin3wWBe1TfdDs2P-9iIFKfGY3mRqUEPAheCp_9I37TGqR.jpg?size=50x50&quality=96&crop=18,0,430,430&ava=1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454631/%D0%92%D0%9A%20%D0%A2%D0%B8%D0%BF%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D0%9B%D0%BE%D0%B2%D0%B5%D1%86%20%D0%B1%D0%BE%D1%82%20%D0%B1%D0%BE%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/454631/%D0%92%D0%9A%20%D0%A2%D0%B8%D0%BF%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D0%9B%D0%BE%D0%B2%D0%B5%D1%86%20%D0%B1%D0%BE%D1%82%20%D0%B1%D0%BE%D1%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //console.log("STARTED.");
    var player = document.createElement('audio');
    player.src = "https://api.meowpad.me/v1/download/10048-415-база-ответьте";
    const f = () => {
        let rud = document.querySelector("button > span > img[alt=\"⛰\"]"),
            hud = document.querySelector("div[class=\"im-page--fixer _im_typer_c\"]"),
            kirka = document.querySelector("button > span > img[alt=\"⛏\"]");

        if (hud) {
            if (hud.innerHTML.search("Бот работает") < 0){
                hud.innerHTML += "<a class=\"left_menu_nav\" href=\"https://vk.com/m.cheats\">Бот работает</a>";
            }
        }

        if (document.querySelector("div[class=\"captcha\"]")) {player.play(); window.setTimeout(f, 3000); return;}

        if (rud) rud.click();
        if (kirka) kirka.click();
        window.setTimeout(f, 1000);
    };
    f();
})();