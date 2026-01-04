// ==UserScript==
// @name        WebAdRule Extra Script
// @version     1.1.1
// @namespace   http://tampermonkey.net/
// @match       *://*.51cto.com/*
// @match       *://*.segmentfault.com/*
// @match       *://juejin.cn/*
// @grant       GM_addStyle
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @author      xndeye
// @description This script is an extension of the Web Ad Rule to fix something that easylist can't handle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501836/WebAdRule%20Extra%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/501836/WebAdRule%20Extra%20Script.meta.js
// ==/UserScript==
(function () {
    'use strict';
})();


let domain = null;
function getdomain() {
    if (!domain) {
        domain = document.location.hostname.split('.').slice(-2).join('.')
        console.log('<WebAdRule Extra Script> : ' + domain)
    }
    return domain ? domain : ''
}

/**
 * Inject on document-start
 */
switch (getdomain()) {
    default:
        break;
}

/**
 * Execute after page load
 */
window.onload = function () {
    switch (getdomain()) {
        case '51cto.com':
            setTimeout(function () {
                $(".copy_btn").each(function () {
                    $(this).text('复制');
                    this.setAttribute('class', 'copy-r');
                    this.onclick = function () {
                        var item = $(this.getAttribute('data-clipboard-target'));
                        if (item[0].tagName === 'CODE') {
                            navigator.clipboard.writeText(item.text())
                        } else {
                            navigator.clipboard.writeText(item.siblings().text());
                        }
                    }
                });
            }, 1000);
            break;

        case 'juejin.cn':
            document.oncopy = event => event.clipboardData.setData('text', window.getSelection(0).toString());
            $('a[href]').each(function () {
                console.log($(this).html());
                let link = $(this).attr('href').replace('https://link.juejin.cn?target=', '');
                if (typeof link !== 'undefined') {
                    $(this).attr('href', decodeURIComponent(link));
                }
            })
            break;

        case 'segmentfault.com':
            $('.article a[href]').each(function () {
                if ($(this).attr('href').startsWith('https://link.segmentfault.com')) {
                    $(this).attr('href', $(this).text());
                }
            })
            break;

        default:
            break;
    }
}
