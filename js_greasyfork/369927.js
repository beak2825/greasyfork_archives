// ==UserScript==
// @name         Bunpro: Jisho Button
// @namespace    http://tampermonkey.net/
// @version      0.5.11
// @description  Searches the sentence on Jisho.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @require      https://greasyfork.org/scripts/370219-bunpro-buttons-bar/code/Bunpro:%20Buttons%20Bar.js?version=1043642
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369927/Bunpro%3A%20Jisho%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/369927/Bunpro%3A%20Jisho%20Button.meta.js
// ==/UserScript==

;(function () {
    //Wait until we're on the study page and can add the button
    $('HTML')[0].addEventListener('quiz-page', function () {
        //add button
        if (!$('#JishoButton').length)
            buttonsBar.addButton('JishoButton', 'Jisho', () =>
                window.open(`https://www.jisho.org/search/${parseSentence($('.study-question-japanese > div')[0])}`),
            )

        //Bind J to the Jisho button
        $('#study-answer-input').on('keyup', function (e) {
            if (e.which == 74 && $('#submit-study-answer').attr('value') == 'Next') {
                $('#JishoButton').click()
            }
        })
    })

    //Extracts the sentence from the sentence elements
    function parseSentence(sentenceElem) {
        var sentence = ''

        var list = sentenceElem.childNodes

        list.forEach(function (currentValue, currentIndex, listObj) {
            var elem = currentValue
            var name = currentValue.tagName
            var className = currentValue.className

            if (name == 'SPAN') {
                if (['study-area-input'].includes(className)) {
                    sentence += '____'
                } else if (['vocab-popout', 'gp-popout'].includes(className)) {
                    const items = elem.childNodes
                    items.forEach(function (item) {
                        if (item.tagName == 'RUBY') {
                            sentence += item.childNodes[0].data
                        } else {
                            sentence += item.textContent
                        }
                    })
                }
            } else if (name == 'RUBY') {
                sentence += elem.childNodes[0].data
            } else {
                if (elem instanceof HTMLElement) {
                    sentence += elem.textContent
                } else if (elem instanceof Text) {
                    sentence += elem.textContent
                }
            }
        })

        return sentence
    }
})()
