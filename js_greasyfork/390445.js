// ==UserScript==
// @name        Wanikani: Hotkey for other voice actor
// @description Binds the I key to play the audio from the other voice actor
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @version     1.2.0
// @author      Kumirei
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @namespace https://greasyfork.org/users/105717
// @downloadURL https://update.greasyfork.org/scripts/390445/Wanikani%3A%20Hotkey%20for%20other%20voice%20actor.user.js
// @updateURL https://update.greasyfork.org/scripts/390445/Wanikani%3A%20Hotkey%20for%20other%20voice%20actor.meta.js
// ==/UserScript==

;(async function (wkof) {
    // You can change this key to something else
    const key = 'i'

    // Script info
    const script_id = 'hotkey_for_other_va'
    const script_name = 'Hotkey For Other VA'

    // Init
    await confirm_wkof()
    wkof.include('ItemData')
    await wkof.ready('ItemData')
    let vocab // WKOF vocab items
    init()

    function confirm_wkof() {
        if (!wkof) {
            let response = confirm(
                `${script_name} requires WaniKani Open Framework.\nClick "OK" to be forwarded to installation instructions.`,
            )
            if (response) {
                window.location.href =
                    'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
            }
        }
    }

    async function init() {
        vocab = await wkof.ItemData.get_items({ wk_items: { filters: { item_type: 'voc' } } })
        window.addEventListener('keydown', onKeydown)
    }

    function onKeydown(event) {
        if (event.key !== key) return

        // Check if it's a quiz page
        const audio_elem = document.querySelector('.additional-content__item--audio')
        if (!audio_elem) return

        // Check if audio is ready to play
        let audio_disabled = !!audio_elem.classList.contains('additional-content__item--disabled')
        if (audio_disabled) return

        play_other_voice()
    }

    function play_other_voice() {
        // Get URL of current VA (if any)
        const defaultAudio = document.querySelector('audio.quiz-audio__audio source:first-child')?.src
        if (!defaultAudio) return // Do nothing if no audio

        const quizItem = document.querySelector('.character-header__characters')?.textContent
        if (!quizItem) return // Do nothing if no item

        const item = vocab.find((item) => item.data.characters === quizItem)
        if (!item) return // Do nothing if no wkof item

        const pronunciations = item.data.pronunciation_audios
        const defaultPronunciation = pronunciations.find((pronunciation) => pronunciation.url === defaultAudio)
        const defaultVA = defaultPronunciation?.metadata?.voice_actor_id

        pronunciations.sort((a, b) => {
            if (a.url === defaultAudio) return 1 // Send default audio to the back
            if (a.metadata.voice_actor_id === defaultVA && b.url !== defaultAudio) return 1 // Send default voice actor to the back
            return -1
        })

        const alternatePronunciation = pronunciations[0]
        const audio = new Audio(alternatePronunciation.url)
        audio.play()
    }
})(window.wkof)
