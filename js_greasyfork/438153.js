// ==UserScript==
// @name         Lisenced in English
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inform right away if title in Baka-Updates is lisenced in English.
// @author       Santeri Hetekivi
// @match        https://www.mangaupdates.com/series.html?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438153/Lisenced%20in%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/438153/Lisenced%20in%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Get Licensed (in English) value text.
    const in_english_text = $("b:contains('Licensed (in English)')").parent().next().text().trim();
    // Change title color.
    $(".releasestitle").css(
        'color',
        (
            // Not lisenced in English => Red
            in_english_text === "No" ?
                "red" :
                (
                    // Lisenced in English => Green
                    in_english_text === "Yes" ?
                        "green":
                        // Unexpected value => Yellow
                        "yellow"
                )
        )
    );
})();