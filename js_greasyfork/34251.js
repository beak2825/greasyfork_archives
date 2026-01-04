// ==UserScript==
// @name         PMs Begone
// @namespace    https://greasyfork.org/en/scripts/34251-pms-begone
// @version      0.2.1
// @description  Removes all traces of PMs from the WaniKani forums
// @author       Kumirei
// @match        https://community.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34251/PMs%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/34251/PMs%20Begone.meta.js
// ==/UserScript==

;(function () {
    $('.panel').bind('DOMSubtreeModified', function () {
        removeNotifications('li')
    })

    $('body').bind('DOMSubtreeModified', function () {
        removeNotifications('div.item.notification')
    })

    var css = [
        'li a[href*="messages"],' +
            '.widget-link.user-pms-link,' +
            '.widget-link.unread-private-messages,' +
            '.user-main .about .controls a {' +
            '    display: none;}' +
            '.menu-panel.slide-in {' +
            '    height: auto !important;}' +
            '.menu-panel.slide-in .panel-body {' +
            '    position: relative;}',
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

function removeNotifications(elem) {
    $('[title*="Private message"]').each((index, item) => {
        $(item).parents(elem).remove()
    })
}
