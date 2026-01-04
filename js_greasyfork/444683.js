// ==UserScript==
// @name         Question clicker
// @version      0.1
// @description  A bot that presses the button corrosponding to the number you press
// @author       Matthew Rolland
// @match        https://funtech.co.uk/student/course_homework_questions/play
// @icon         https://www.google.com/s2/favicons?domain=funtech.co.uk
// @grant        none
// @namespace https://greasyfork.org/users/901345
// @downloadURL https://update.greasyfork.org/scripts/444683/Question%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/444683/Question%20clicker.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            var submitbutton = $(".question.visible div.text-right .submit input")
            if (submitbutton.length === 1) {
                submitbutton[0].click()
            } else {
                $(".question.visible div.text-right a")[0].click()
            }

        } else {
            var buttony = $(".question.visible div label input")
            if (e.keyCode === 49) {
                buttony[0].click()
            } else {
                if (e.keyCode === 50) {
                    buttony[1].click()
                } else {
                    buttony[2].click()
                }
            }


        }
    });
})();