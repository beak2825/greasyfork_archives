// ==UserScript==
// @name         Wanikani Forums: Logograin emote
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds logograin emote to the WaniKani forum
// @author       latepotato
// @include      https://community.wanikani.com/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/474424/Wanikani%20Forums%3A%20Logograin%20emote.user.js
// @updateURL https://update.greasyfork.org/scripts/474424/Wanikani%20Forums%3A%20Logograin%20emote.meta.js
// ==/UserScript==
// Just write :logograin:

;(function () {
    let rng_timestamp
    // Wait until the save function is defined
    const i = setInterval(tryInject, 100)

    // Inject if the save function is defined
    function tryInject() {
        const old_save = unsafeWindow.require('discourse/controllers/composer').default.prototype.save
        if (old_save) {
            clearInterval(i)
            inject(old_save)
        }
    }

    // Wrap the save function with our own function
    function inject(old_save) {
        const new_save = async function (t) {
            const composer = document.querySelector('textarea.d-editor-input') // Reply box
            composer.value = await replace_logograin_emotes(composer.value)
            composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
            old_save.call(this, t) // Call regular save function
        }
        unsafeWindow.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
    }
    // Grabs the text then returns the POLL
    async function replace_logograin_emotes(text) {
        return text.replace(/\:logograin\:/gis, ':ear_of_rice: :ship: :smiling_face_with_three_hearts:')
    }
})()