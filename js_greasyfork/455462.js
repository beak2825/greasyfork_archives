// ==UserScript==
// @name         Another Turd in the Wall
// @version      0.1.3a
// @description  Tiens tes 2€
// @author       SETHGREEN
// @namespace    https://jeuxvideo.com
// @run-at       document-start
// @match        https://www.jeuxvideo.com/*
// @match        http://www.jeuxvideo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455462/Another%20Turd%20in%20the%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/455462/Another%20Turd%20in%20the%20Wall.meta.js
// ==/UserScript==

/* global $ */
const style = $('<style>#didomi-host { display: none !important; visibility: hidden !important; opacity: 0 !important; }</style>');
$('html > head').append(style);

let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var attributeValue = $(mutation.target).prop(mutation.attributeName)
    $('body').removeAttr('class')
  })
})

$(function() {
    $('#didomi-host').remove()
    $('body').removeAttr('class')

    observer.observe($('body')[0], {
        attributes: true,
        attributeFilter: ['class']
    })
})