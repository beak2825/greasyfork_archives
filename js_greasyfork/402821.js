// ==UserScript==
// @name         Webtoons navigator
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Naver_Line_Webtoon_logo.png/128px-Naver_Line_Webtoon_logo.png
// @version      0.2
// @description  Function for navigating chapters in webtoon reader using left and right arrow button and hearting the chapter using the 'h' (for Heart) button.
// @author       Mr. M
// @match        https://www.webtoons.com/en/*/*/*/*
// @grant        none
// @namespace    https://greasyfork.org/users/553660
// @downloadURL https://update.greasyfork.org/scripts/402821/Webtoons%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/402821/Webtoons%20navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '37') {
            var x = document.getElementsByClassName("_prevEpisode");
            window.location = x[0].getAttribute("href");
        }
        else if (e.keyCode == '39') {
            var y = document.getElementsByClassName("_nextEpisode");
            window.location = y[0].getAttribute("href");
        }
        else if (e.keyCode == '72') {
            document.getElementById("likeItButton").click();
        }

}
})();