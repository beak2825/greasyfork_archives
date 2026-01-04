// ==UserScript==
// @name         Wanikani Forums: 10chars
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Inserts invisible text into any post not meeting the 10 character requirement
// @author       Kumirei
// @include      https://community.wanikani.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397711/Wanikani%20Forums%3A%2010chars.user.js
// @updateURL https://update.greasyfork.org/scripts/397711/Wanikani%20Forums%3A%2010chars.meta.js
// ==/UserScript==

;(function () {
    // Wait until the save function is defined
    const i = setInterval(tryInject, 100)

    // Inject if the save function is defined
    function tryInject() {
        const old_save = window.require('discourse/controllers/composer').default.prototype.save
        if (old_save) {
            clearInterval(i)
            inject(old_save)
        }
    }

    // Wrape the save function with our own function which fills out the post
    function inject(old_save) {
        const new_save = function (t) {
            let composer = document.querySelector('textarea.d-editor-input') // Reply box
            if (this.model.missingReplyCharacters > 0) {
                composer.value += ' <Lorem Ipsum>' // Modify message
                composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
            }
            old_save.call(this, t) // Call regular save function
        }
        window.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
    }
})()
