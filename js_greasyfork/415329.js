// ==UserScript==
// @name         GR - Mark as read all not marked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.goodreads.com/review/list/55862632-toni?order=a&ref=nav_mybooks&shelf=read&sort=date_read
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/415329/GR%20-%20Mark%20as%20read%20all%20not%20marked.user.js
// @updateURL https://update.greasyfork.org/scripts/415329/GR%20-%20Mark%20as%20read%20all%20not%20marked.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(() => {
        var els = document.querySelectorAll(".date_read .greyText");
        for(let i = 0; i < els.length; i++)
        {
            els[i].nextElementSibling.click();
            let year = els[i].parentElement.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("span")[0].textContent.split(", ")[1].trim();
            if(year != null && year.length > 0)
            {
                document.querySelector("#reviewForm .read_at select").value = ""+year+"";
                document.querySelector("#reviewForm .buttons > .gr-button").click();
            }
        }
    }, 2000);
})();