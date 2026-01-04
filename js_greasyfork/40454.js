// ==UserScript==
// @name         Gitlab Internal Links
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Decorate README links that point to other places in Gitlab.
// @author       @iv_njonas
// @match        http://gitlab.com/*
// @match        http://unchar.bootcampcontent.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40454/Gitlab%20Internal%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/40454/Gitlab%20Internal%20Links.meta.js
// ==/UserScript==
/* jshint asi: true, multistr: true */

(function() {
    var headChildren = document.head.children
    var iconLink

    for (var i = 0; i < headChildren.length; i++) {
        var el = headChildren[i]
        if (el.rel === 'shortcut icon') {
            iconLink = el.href
            break;
        }
    }

    if (!iconLink) return

    var pathParts = window.location.pathname.split('/')
    if (pathParts.length < 3) return
    var repoRoot = pathParts[1] + '/' + pathParts[2]

    var style = '\
.file-content a[href*="/'+repoRoot+'/"]:after {\
    content: "";\
    width: 17px;\
    height: 17px;\
    display: inline-block;\
    background-image: url('+iconLink+');\
    background-size: contain;\
    margin-left: 7px;\
}'
    GM_addStyle(style)
})();