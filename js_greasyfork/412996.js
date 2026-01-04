// ==UserScript==
// @name        Domino Chinese Flashcard Customization
// @namespace   https://eriknewhard.com/
// @description Autoplay audio on flashcard reveal. Spaces the flashcard so top and bottom don't shift on reveal.
// @author      everruler12
// @version     2.5.1
// @icon        https://www.dominochinese.com/wp-content/uploads/2020/12/cropped-WechatIMG145-192x192.png
// @match       https://www.dominochinese.com/*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412996/Domino%20Chinese%20Flashcard%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/412996/Domino%20Chinese%20Flashcard%20Customization.meta.js
// ==/UserScript==

var settings = {
    flashcard_spacer: true,
    autoplay_audio: true
}



var observer = new MutationObserver(mutations => {
    if (isFlashcards()) {
        mutations.forEach(check_mutation)
    }
})

var target = document.getElementById('root')

var config = {
    childList: true,
    subtree: true
}

observer.observe(target, config)

console.log('DominoChinese Flashcard Audio Autoplay started')



function check_mutation(mutation) {
    // console.log(mutation)
    const added = mutation.addedNodes[0]

    autoplay_audio(added)
    flashcard_spacer(added)
}

function isFlashcards() {
    return window.location.href.match('https://www.dominochinese.com/flashcards')
}


function autoplay_audio(added) {
    if (!settings.autoplay_audio) return

    // back side of flashcard revealed
    if (added && added.classList && added.classList.contains('audio-player')) {
        added.click()
    }
}


function flashcard_spacer(added) {
    if (!settings.flashcard_spacer) return

    console.log(added)

    const spacer_id = 'flashcard_spacer'

    let spacer = $(`#${spacer_id}`)

    if (spacer.length)
        toggleSpacer()
    else
        appendSpacer()

    function appendSpacer() {
        let spacer_html = /*html*/ `<div id=${spacer_id} style='visibility: hidden; height: 199px'></div>`
        let flashcard_container = $('.mb-6.mt-12.text-center.flex.flex-col.items-center.justify-center')
        if (flashcard_container.length) flashcard_container.append($(spacer_html))
    }

    function toggleSpacer() {
        const reveal_button_selector = 'span.text-xs:contains(Reveal)'

        if (added && $(added).find(reveal_button_selector).length) {
            showSpacer()
            $(reveal_button_selector).parent().click(hideSpacer)
        }


        function showSpacer() {
            $(spacer).show()
        }

        function hideSpacer() {
            $(spacer).hide()
        }
    }
}