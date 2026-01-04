// ==UserScript==
// @name         Bunpro: Hide Header
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Hides the header when reviewing.
// @author       Kumirei
// @include      *bunpro.jp*
// @match        www.bunpro.jp/study_lesson
// @match        https://bunpro.jp/study_lesson
// @match        https://www.bunpro.jp/study_lesson
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974366
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369991/Bunpro%3A%20Hide%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/369991/Bunpro%3A%20Hide%20Header.meta.js
// ==/UserScript==

;(function ($, wfs) {
    if (!$('#RemoveGuide').length)
        $('head').append('<style id="RemoveGuide">.help-info {display: none !important;}</style>')
    if (window.location.href == 'https://bunpro.jp/study_lesson') removeHeader()
    wfs.wait('#grammar-point-header', removeHeader)
    wfs.wait('#study-page', removeHeader)
    wfs.wait('#cram-page', function () {
        $('.sentence-preference > div').on('click', removeHeader)
    })

    function removeHeader() {
        $('header').attr('style', 'min-height: 0; margin: 0;')
        $('header > .container').attr('style', 'display: none;')
        var profileLink = $('#logo')[0].href
        $('.help-button:first-child').after(
            '<a class="help-button" href="' + profileLink + '" style="color: white; margin-left: 10px;">HOME</a>',
        )
        $('.help-button:first-child').remove()
        //$('.help-button:first-child').attr('onclick', "window.location.href = 'https://bunpro.jp/'");
    }
})(window.jQuery, window.wfs)
