// ==UserScript==
// @name         Wanikani Forums: Easy @Omuns
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Mention @Omun with the click of a button!
// @author       Kumirei
// @include      *community.wanikani.com*
// @include      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391261/Wanikani%20Forums%3A%20Easy%20%40Omuns.user.js
// @updateURL https://update.greasyfork.org/scripts/391261/Wanikani%20Forums%3A%20Easy%20%40Omuns.meta.js
// ==/UserScript==

;(function () {
    waitForKeyElements('.post-controls .double-button', function (e) {
        var btn = document.createElement('button')
        btn.class = 'widget-button btn-flat no-text btn-icon omun-button'
        btn.title = 'Click to mention @Omun'
        btn.style = 'float: right'
        btn.innerHTML = '^^'
        btn.onclick = function () {
            if (!$('#reply-control .reply-area').length) $('.btn-primary.create').click()
            var interval = setInterval(function () {
                if ($('button.quote').length) {
                    $('.d-editor-input')[0].value += '@Omun '
                    $('.d-editor-input').blur()
                    $('.d-editor-input').focus()
                    clearInterval(interval)
                }
            }, 100)
        }
        var E = e.closest('article')
        var oldBtn = E.find('button[title="Click to mention @Omun"]')
        if (oldBtn.length) oldBtn.remove()
        e.closest('.actions').after(btn)
    })
})()
