// ==UserScript==
// @name         Wanikani Forums: Double click Secret
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  CTRL+Double-click to open up a reply and quote whole post
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37548/Wanikani%20Forums%3A%20Double%20click%20Secret.user.js
// @updateURL https://update.greasyfork.org/scripts/37548/Wanikani%20Forums%3A%20Double%20click%20Secret.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    var ctrlDown = false
    window.onkeyup = function (e) {
        if (e.keyCode == 17) {
            ctrlDown = false
        }
    }
    window.onkeydown = function (e) {
        if (e.keyCode == 17) {
            ctrlDown = true
        }
    }

    waitForKeyElements('#topic', function () {
        $('.post-stream').on('dblclick', '.topic-post', function () {
            try {
                if (ctrlDown) {
                    $(this).find('.widget-button.reply')[0].click()
                    setTimeout(function () {
                        $('textarea.d-editor-input')[0].value = ''
                        $('button.quote').click()
                        setTimeout(function () {
                            var text = $('textarea.d-editor-input').val()
                            if (text.includes('<sup><sup><sup>')) {
                                text = text.slice(text.lastIndexOf('<sup><sup><sup>') + 16, text.length - 11)
                                text = text.replace(/`/g, '')
                                $('textarea.d-editor-input').val(text)
                                $('textarea.d-editor-input').blur()
                            }
                        }, 500)
                    }, 100)
                }
            } catch (TypeError) {
                console.log("I can't believe you've done this")
            }
        })
    })
})()
