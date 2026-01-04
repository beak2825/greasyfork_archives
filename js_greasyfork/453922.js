// ==UserScript==
// @name         QS - Guardian Pusher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       you
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.queslar.com/*
// @license      MIT
// @grant        none
// @description  lolol
// @downloadURL https://update.greasyfork.org/scripts/453922/QS%20-%20Guardian%20Pusher.user.js
// @updateURL https://update.greasyfork.org/scripts/453922/QS%20-%20Guardian%20Pusher.meta.js
// ==/UserScript==

window.onload = () => {
    const checker = setInterval(() => {
        if($("app-catacombs-guardian").length != 0){
            $("app-catacombs-guardian").find("button").each(function () {
                if($(this)[0].innerText === "Challenge" || $(this)[0].innerText === "Return to overview"){
                    $(this)[0].click()
                }
            })
        }

    },Math.floor(Math.random() * 1250));
}