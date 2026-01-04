// ==UserScript==
// @name         Ninova Class Names
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows class names on below Course Codes credit goes to fatihbucak https://github.com/fatihbucak/CourseLabelChromeExtension
// @author       fatihbucak, keepdying
// @match        https://ninova.itu.edu.tr/Kampus1, http://ninova.itu.edu.tr/Kampus1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397048/Ninova%20Class%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/397048/Ninova%20Class%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';
            var leftSide = document.getElementsByClassName("menuErisimAgaci");
            if (leftSide.length > 0) {
                var scripts = leftSide[0].getElementsByTagName("script");
                var courses = leftSide[0].getElementsByTagName("span");
                for (var i = 0; i < courses.length; i++) {
                    if (scripts[i].innerText.includes("var title")) {
                        var parts = scripts[i].innerText.split(";\">");
                        var courseName = parts[1].split("</span>")[0];
                        if (courseName.length > 25) {
                            courseName = courseName.substring(0, 25)
                        }
                        courses[i].innerHTML = courseName;
                    }
                }
            }
    return document.body.innerHTML;
})();