// ==UserScript==
// @name         Wanikani Forums: Quote Whole Post
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Adds a button to quote the whole post
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373349/Wanikani%20Forums%3A%20Quote%20Whole%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/373349/Wanikani%20Forums%3A%20Quote%20Whole%20Post.meta.js
// ==/UserScript==

;(function ($, wfs) {
    wfs.wait('.topic-post > article',(e)=>{
        let E = $(e)
        var btn = document.createElement('button')
        btn.className = 'widget-button btn-flat no-text btn-icon quote-whole-post'
        btn.title = 'Click to quote whole post'
        btn.innerHTML =
            '<svg class="fa d-icon d-icon-comment-o svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#far-comment"></use></svg>'
        btn.onclick = function () {
            E.find('.widget-button.reply')[0].click()
            var interval = setInterval(function () {
                if ($('button.quote').length) {
                    $('button.quote').click()
                    clearInterval(interval)
                }
            }, 100)
        }
        var oldBtn = E.find('button[title="Click to quote whole post"]')
        if (oldBtn.length) oldBtn.remove()
        E.find('.post-controls').append(btn)
    })
    $('head').append(
        '<style id="QuoteWholePostCSS">' +
            '.quote-whole-post {order: 0; padding: 8px 10px; margin: 1px 0;}' +
            '.quote-whole-post.d-hover {background-color: rgba(122, 122, 122, 0.17);}' +
            '.post-controls {justify-content: flex-end !important;}' +
            '.post-controls .actions {margin: 0 !important; order: 99;}' +
            '.post-controls .show-replies {position: absolute; left: 0; margin-left: 0px !important;}' +
            '</style>',
    )

})(window.jQuery, window.wfs)
