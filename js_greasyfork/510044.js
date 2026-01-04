    // ==UserScript==
    // @name         Wanikani Forums: Queso Cheesifier
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  Whenever you write queso, it will make it queso cheese
    // @author       latepatate
    // @include      https://community.wanikani.com/*
    // @grant        GM.xmlHttpRequest
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510044/Wanikani%20Forums%3A%20Queso%20Cheesifier.user.js
// @updateURL https://update.greasyfork.org/scripts/510044/Wanikani%20Forums%3A%20Queso%20Cheesifier.meta.js
    // ==/UserScript==
    // Just write queso

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
                composer.value = await replace_queso(composer.value)
                composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
                old_save.call(this, t) // Call regular save function
            }
            unsafeWindow.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
        }
        // Grabs the text then returns the POLL
        async function replace_queso(text) {
            return text.replace(/queso(?! cheese)/gm, 'queso cheese')
        }
    })()

