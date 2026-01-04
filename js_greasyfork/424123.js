// ==UserScript==
// @name                Free Copy
// @name:CN:zh          自由复制
// @namespace           https://github.com/GuoChen-thlg
// @version             0.1.1
// @description         支持复制受限网站的文本内容
// @author              THLG
// @supportURL          gc.thlg@gmail.com
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CK755FJ9PSBZ8
// @contributionAmount  1
// @match               *://wenku.baidu.com/*
// @match               *://*.360doc.com/*
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/424123/Free%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/424123/Free%20Copy.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function rejectOtherHandlers (e) {
        e.stopPropagation()
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation()
        }
    }
    ['cut',
        'copy',
        'keydown',
        'keyup',
    ].forEach((event) => {
        document.documentElement.addEventListener(event, rejectOtherHandlers, {
            capture: true,
        })
    })
    var style = [
        "*::before",
        "*",
        "*::after",
    ].join(',') + "{ user-select: initial !important;\n -webkit-user-select: initial !important; }"
    var n_style = document.createElement('style')
    n_style.innerHTML = style
    document.getElementsByTagName('head')[0].appendChild(n_style)
})();