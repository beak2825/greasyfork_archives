// ==UserScript==
// @name         Wanikani: Skip to Quiz
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Enables the quiz button without having to go through any of the lessons.
// @author       Kumirei
// @match        https://www.wanikani.com/lesson/session
// @match        https://preview.wanikani.com/lesson/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368413/Wanikani%3A%20Skip%20to%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/368413/Wanikani%3A%20Skip%20to%20Quiz.meta.js
// ==/UserScript==

;(function ($) {
    // Run on page load
    run()

    // Also run whenever a new batch of lessons is loaded
    $.jStorage.listenKeyChange('l/quizActive', run)

    // Add hotkey
    $('body').on('keydown', (e) => {
        if (e.key === 'q' && !$.jStorage.get('l/quizActive')) {
            e.preventDefault()
            go_to_quiz()
        }
    })

    function run() {
        // Wait until button is ready
        const interval = setInterval(() => {
            if ($.jStorage.get('l/quizActive', false)) return
            const quizButton = $('#lesson > div:last-child ul > li:last-child button')
            if (!quizButton.length) return
            clearInterval(interval)
            make_button_clickable(quizButton)
        }, 100)
    }

    function make_button_clickable(quizButton) {
        // Make quiz button look clickable
        quizButton.removeAttr('disabled').addClass('animate-pulse bg-green-400 wk-shadow')

        // Go to quiz when button is clicked
        quizButton.on('click', go_to_quiz)
    }

    function go_to_quiz() {
        $.jStorage.set('l/startQuiz', true)
        $.jStorage.set('l/quizReady', false)
    }
})(window.jQuery)
