// ==UserScript==
// @name         Cambridge Methods Solutions Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables solutions button on online textbook
// @author       Noah McMahon
// @match        *://seniormaths.cambridge.edu.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38522/Cambridge%20Methods%20Solutions%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/38522/Cambridge%20Methods%20Solutions%20Button.meta.js
// ==/UserScript==
(function() {
    var checkPageLoaded = setInterval(function() {
        if ($('.js-answers').length) {
            $(".js-answers").after("<a title='solutions' class='answers-icon nm-solutions' style='background:url(https://cdn.edjin.com/static/users/branding/seniormaths/img/solutions-icon-e1dcf62c660c8b3d724497b35328af8d.png)'></a>");
            $('.nm-solutions').click(function() {
                $.get('/lessonSection/loadTutorial.action', {
                    tutorialType: 'EXERCISE_SOLUTION',
                    conceptId: currentConceptId
                }, function(html) {
                    $('.js-exercise-solutions-dialog').html(html);
                    loadDialog('.js-exercise-solutions-dialog');
                    $('.js-exercise-solutions-dialog').reloadMathJax();
                });
            });
            clearInterval(checkPageLoaded);
        }
    }, 100);
})();