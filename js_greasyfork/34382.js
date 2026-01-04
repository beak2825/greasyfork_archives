// ==UserScript==
// @name         chezmax blossom
// @version      0.1.
// @description  Replaces chezmax's level flair with a cherry blossom
// @author       Kumirei
// @match        https://community.wanikani.com/*
// @grant        none
// @namespace https://greasyfork.org/users/105717
// @downloadURL https://update.greasyfork.org/scripts/34382/chezmax%20blossom.user.js
// @updateURL https://update.greasyfork.org/scripts/34382/chezmax%20blossom.meta.js
// ==/UserScript==

;(function () {
    $('body').bind('DOMSubtreeModified', function () {
        $('.trigger-user-card[data-user-card="' + name + '"]')
            .parents('.topic-avatar')
            .children('.avatar-flair')
            .remove()
    })

    var css = [
        '.poster.trigger-user-card[title="chezmax"]::after,' +
            '.trigger-user-card.main-avatar[data-user-card="chezmax"]::after {' +
            'background-size: cover;' +
            'background-image: url(https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/96/cherry-blossom_1f338.png);' +
            'display: flex;' +
            'content: "";' +
            'align-items: center;' +
            'justify-content: center;' +
            'position: absolute;}' +
            '' +
            '.trigger-user-card.main-avatar[data-user-card="chezmax"]::after {' +
            'border-radius: 12px;' +
            'width: 24px;' +
            'height: 24px;' +
            'bottom: -10px;' +
            'right: -8px;}' +
            '' +
            '.poster.trigger-user-card[title="chezmax"]::after {' +
            'border-radius: 8px;' +
            'width: 16px;' +
            'height: 16px;' +
            'bottom: -2px;' +
            'right: 0;' +
            'font-size: 0.6em;}' +
            '' +
            '.poster.trigger-user-card[title="chezmax"] .avatar-flair {' +
            'display: none;}',
    ].join('\n')
    if (typeof GM_addStyle != 'undefined') {
        GM_addStyle(css)
    } else if (typeof PRO_addStyle != 'undefined') {
        PRO_addStyle(css)
    } else if (typeof addStyle != 'undefined') {
        addStyle(css)
    } else {
        var node = document.createElement('style')
        node.type = 'text/css'
        node.appendChild(document.createTextNode(css))
        var heads = document.getElementsByTagName('head')
        if (heads.length > 0) {
            heads[0].appendChild(node)
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node)
        }
    }
})()
