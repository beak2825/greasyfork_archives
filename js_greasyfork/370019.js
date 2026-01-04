// ==UserScript==
// @name         Bunpro: Auto-show Info
// @namespace    http://tampermonkey.net/
// @version      0.2.10
// @description  Automatically expands the full grammar info when you get a review wrong.
// @author       Kumirei
// @include      *bunpro.jp/study*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=990207
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=990211
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370019/Bunpro%3A%20Auto-show%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/370019/Bunpro%3A%20Auto-show%20Info.meta.js
// ==/UserScript==

;(function () {
    //wait until we're reviewing
    $('HTML')[0].addEventListener('quiz-page', function () {
        //do stuff when we press enter and get the answer wrong
        $('#study-answer-input').on('keydown', function (event) {
            if (event.which == 13) {
                openIfWrong()
            }
        })
        //do stuff when we click submit and get the answer wrong
        $('#submit-study-answer').on('click', function () {
            openIfWrong()
        })
    })

    //opens the info if you get the item wrong
    function openIfWrong() {
        if ($('.oops-button')[0].style.display == 'block' || $('#learn-new-grammar-page').length) {
            $('.show-grammar-text').click()
        }
    }
})()
