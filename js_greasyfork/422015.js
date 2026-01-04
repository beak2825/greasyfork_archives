// ==UserScript==
// @name         Crunchyroll Manga Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Basic keyboard controls for Crunchyroll's HTML5 manga reader.
// @author       You
// @match        https://www.crunchyroll.com/manga/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422015/Crunchyroll%20Manga%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/422015/Crunchyroll%20Manga%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function() {
    $(document).on("keydown", function(e) {
        switch (e.key) {
            case "ArrowLeft":
                $("a.pagination-link.type-next.js-next-link")[0].click();
                break;
            case "ArrowRight":
                $("a.pagination-link.type-prev.js-prev-link")[0].click();
                break;
            case "f":
                $("button.fullscreen-toggle").first().trigger("click");
                break;
            case "i":
                $(".info-button.js-info-button").first().trigger("click");
                break;
        }
    });
})();