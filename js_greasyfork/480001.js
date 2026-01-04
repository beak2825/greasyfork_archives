// ==UserScript==
// @name         Lolzteam Автоучастие (Просто помощник)
// @version      0.0.1
// @description  Помогает меньше нажимать на кнопку участия, можно не ждать загрузки страницы - она дождется и нажмет все сама (если не CF забагал придется обновлять страницу - f5 = fast update)
// @author       не скажу кто написал, а то бан за такое
// @match        https://zelenka.guru/*
// @match        https://challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @namespace    http://tampermonkey.net/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480001/Lolzteam%20%D0%90%D0%B2%D1%82%D0%BE%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%B8%D0%B5%20%28%D0%9F%D1%80%D0%BE%D1%81%D1%82%D0%BE%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480001/Lolzteam%20%D0%90%D0%B2%D1%82%D0%BE%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%B8%D0%B5%20%28%D0%9F%D1%80%D0%BE%D1%81%D1%82%D0%BE%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%29.meta.js
// ==/UserScript==

(async function (window, undefined) {
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    //if (w.self != w.top) {
    //return;
    //}
    //alert("#post-${var pathArray = window.location.pathname.split('/')[1]} > div.messageInfo > div.messageContent > article > div > a");
    //waitForKeyElements("#post-${var pathArray = window.location.pathname.split('/')[1]} > div.messageInfo > div.messageContent > article > div > a", actionFunction);
    if (/zelenka\.guru/.test(document.location.href)) //Main page
    {
        var btn;
        var element_awaiter = setInterval(function() {
            var elements = document.getElementsByClassName("LztContest--Participate button mn-15-0-0 primary");
            if (elements.length < 1) {
                window.close();
            }
            if (elements.length < 1) return;
            if (elements[0].className == "disabled LztContest--Participate button mn-15-0-0 primary") return;
            btn = elements[0];
            clearInterval(element_awaiter);
        }, 1000);

        while (btn == null){
            await sleep(1000);
        }

        btn.scrollIntoView();
        await sleep(2000);
        btn.click();
        await sleep(2000);
        window.close();
    }
    else //iFrame
    {
    }
})(window);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}