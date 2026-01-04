// ==UserScript==
// @name         Winston Error Buddy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns Oh noes! into Winston
// @author       Jayson
// @match        https://www.khanacademy.org/computer-programming/*/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392331/Winston%20Error%20Buddy.user.js
// @updateURL https://update.greasyfork.org/scripts/392331/Winston%20Error%20Buddy.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        $(".error-buddy-happy img").attr("src", "https://i.imgur.com/2MNadJv.png");
        $(".error-buddy-thinking img").attr("src", "https://cdn.kastatic.org/images/avatars/svg/cs-winston.svg");
        setInterval(function() {
            if ($(".error-buddy").length) {
                $(".error-buddy").css("background-image", "url(https://i.imgur.com/MVMdiKl.png)").css("background-size", "120px").css("background-repeat", "no-repeat");
            }
        }, 100);
    }, 2000);
})();