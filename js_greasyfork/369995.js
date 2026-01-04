// ==UserScript==
// @name         Bunpro: Copy Sentences
// @namespace    http://tampermonkey.net/
// @version      0.4.14
// @description  Adds buttons to copy the Japanese and English sentences in review.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @require      https://greasyfork.org/scripts/370219-bunpro-buttons-bar/code/Bunpro:%20Buttons%20Bar.js?version=1044000
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369995/Bunpro%3A%20Copy%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/369995/Bunpro%3A%20Copy%20Sentences.meta.js
// ==/UserScript==

;(function () {
    //add buttons
    $('HTML')[0].addEventListener('quiz-page', function () {
        if (!$('#copyJP').length)
            buttonsBar.addButton('copyJP', 'Copy JP', () =>
                copyText(parseSentence($('.study-question-japanese > div')[0])),
            )
        if (!$('#copyEN').length)
            buttonsBar.addButton('copyEN', 'Copy EN', () =>
                copyText($('.study-question-english-hint > span')[0].textContent),
            )
    })

    //Extracts the sentence from the sentence element
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

    //copies the text
    copyText = function (text) {
        navigator.clipboard.writeText(text)
    }
})()
