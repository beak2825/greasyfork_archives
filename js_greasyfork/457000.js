// ==UserScript==
// @name         Discipulus+
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhances Discipulus
// @author       Juan Paolo B.
// @license      GNU GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://discipulusv2.amasystem.net/
// @match        https://discipulusv2.amasystem.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457000/Discipulus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/457000/Discipulus%2B.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function () {
        setTimeout(start, 500);
    });

    function start() {
        if (window.location.href.match("https://discipulusv2.amasystem.net/StudentPortal/CurriculumChecklist/CurriculumChecklist.*")) {
            var h_parent = document.querySelector("body > div.render-this.p-3 > div:nth-child(2) > div.card-body > div.row > div:nth-child(11)");

            let convert_btn = document.createElement("button");
            let text = document.createTextNode("Convert Grades");
            convert_btn.appendChild(text);
            convert_btn.classList.add("btn", "btn-danger", "btn-block", "browser-default");
            convert_btn.addEventListener('click', function() {
                convert();
            }, false);

            h_parent.appendChild(convert_btn);
        };

        if (window.location.href.match("https://discipulusv2.amasystem.net/StudentPortal/HomePage/Home.*")) {
            var cards = document.querySelector("body > div.render-this.p-3 > div.container-fluid > div > div.col-lg-8 > div.card.p-3 > div").querySelectorAll('[class="col-lg-2 my-2"]');
            cards.forEach(function(card) {
                card.className = "col-sm-2 my-2";
            });
        }

        if (window.location.href.match("https://discipulusv2.amasystem.net/.*")) {
            var home = document.querySelector("body > div.admin_container_desktop > div.render-body > div.container-fluid.pt-5.px-5 > div:nth-child(2) > div.col-lg-7 > div").querySelectorAll('[class="col-lg-6"]');
            home.forEach(function(card) {
                card.className = "col-sm-6";
            });
        };
    };

    function convert() {
        var table = document.querySelector("body > div.render-this.p-3 > div:nth-child(2) > div.card-body > div.row > div:nth-child(13) > table");

        const grades = {
            "A+": 1.00, "A": 1.25, "A-": 1.50,
            "B+": 1.75, "B": 2.00, "B-": 2.25,
            "C+": 2.50, "C": 2.75, "C-": 3.00,
        };

        for (var i = 0, row; row = table.rows[i]; i++) {
            if (row.hasAttribute("bgcolor")) {
                var grade = row.cells[4];
                if (grade.innerHTML == "IP") {
                    continue;
                }
                else if (!grade.innerHTML == "") {
                    grade.innerHTML = grades[grade.innerHTML].toFixed(2) + " | " + grade.innerHTML;
                };
            };
        };
    };
})();
