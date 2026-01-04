// ==UserScript==
// @name         Bunpro: Helpful Events
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @author       Kumirei
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=990207
// @include      *bunpro.jp*
// @exclude      *community.bunpro.jp*
// ==/UserScript==

;(function (wfs) {
    // Add a custom event for when BP creates a new body
    var newBody = new Event('new-body')
    wfs.wait('body > header', function (e) {
        fireEvent(newBody)
    })

    // Add a custom event for when you get a new item in reviews
    var newReviewItem = new Event('new-review-item')
    wfs.wait('.level_lesson_info a', function (e) {
        fireEvent(newReviewItem)
    })

    // Add a custom event when you go to study or cram page
    var quizPage = new Event('quiz-page')
    wfs.wait('#show-grammar', function (e) {
        fireEvent(quizPage)
    })

    // Add a custom event when you go to study page
    var studyPage = new Event('study-page')
    wfs.wait('#study-page #show-grammar', function (e) {
        fireEvent(studyPage)
    })

    // Add a custom event when you go to cram page
    var cramPage = new Event('cram-page')
    wfs.wait('#cram-page #show-grammar', function (e) {
        fireEvent(cramPage)
    })

    // Fires the given event on the HTML element
    function fireEvent(event) {
        var retryInterval = setInterval(function () {
            if (document.readyState == 'complete') {
                $('HTML')[0].dispatchEvent(event)
                clearInterval(retryInterval)
            }
        }, 100)
    }
})(window.wfs)
