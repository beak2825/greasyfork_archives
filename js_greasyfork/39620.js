// ==UserScript==
// @name         Manuel Hemosilla - Categorization
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.0
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *mturkcontent*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39620/Manuel%20Hemosilla%20-%20Categorization.user.js
// @updateURL https://update.greasyfork.org/scripts/39620/Manuel%20Hemosilla%20-%20Categorization.meta.js
// ==/UserScript==

if (document.querySelector('p[class="ng-scope"]').textContent.includes('Select the alternative that best describes the skin color of the person shown in the picture')) {
    var ratings = document.querySelectorAll('[class="choice-button btn ng-binding choice"]');
    for (var i = 0; i < ratings.length; i++) {
        ratings[i].addEventListener("click", function() {
            document.getElementById("submit_button").click();
        });
    }
    document.querySelector('img[class="question_image"]').style.maxWidth = '50%';
}