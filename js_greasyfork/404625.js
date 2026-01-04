// ==UserScript==
// @name         גלאי קריטיים
// @namespace    http://fxp.co.il
// @version      0.11
// @description  מדגיש אשכולות שעלולים להיות קריטיים בצבע אדום
// @author       MR.Art
// @match        https://www.fxp.co.il/forumdisplay.php?f=359*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404625/%D7%92%D7%9C%D7%90%D7%99%20%D7%A7%D7%A8%D7%99%D7%98%D7%99%D7%99%D7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/404625/%D7%92%D7%9C%D7%90%D7%99%20%D7%A7%D7%A8%D7%99%D7%98%D7%99%D7%99%D7%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regex = /למות|כוח|לחיים|לחתוך|לחיות|להתאבד|אונס|סמים|לסיים|נמאס|ורידים|להרוג|עצמי|התעללות|מתעללים|מרביצים/,
          titles = document.getElementsByClassName("title");

    for (let title of titles) {
        if (regex.test(title.innerText)) {
            title = title.parentElement;
            title.querySelector('.prefix > span').style.color = "gold";
            title.offsetParent.style = "background-color: red; font-family: Open Sans Hebrew";
        }
    }

    document.getElementById("footer_copyright").innerHTML += "<div id='GKN'><div>גלאי קריטיים @ 0.10</div></div>";
    window.onload = () => document.querySelector('.ob-smartfeed-wrapper').remove();
})();