// ==UserScript==
// @name         VG prev / next
// @namespace    http://vipergirls.to/
// @version      0.4
// @description  Use ctrl-left / ctrl-right to move between forum pages, ctrl-shift-left / ctrl-shift-right to jump to the first and last page. On Mac, use Cmd-Ctrl and Shift-Cmd-Ctrl.
// @author       tylenoesa
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vipergirls.to
// @match        *://vipergirls.to/forums/*
// @match        *://vipergirls.to/forumdisplay.php*
// @match        *://vipergirls.to/search.php*
// @match        *://vipergirls.to/threads/*
// @match        *://planetviper.club/forums/*
// @match        *://planetviper.club/forumdisplay.php*
// @match        *://planetviper.club/search.php*
// @match        *://planetviper.club/threads/*
// @match        *://viper.to/forums/*
// @match        *://viper.to/forumdisplay.php*
// @match        *://viper.to/search.php*
// @match        *://viper.to/threads/*
// @match        *://viperbb.rocks/forums/*
// @match        *://viperbb.rocks/forumdisplay.php*
// @match        *://viperbb.rocks/search.php*
// @match        *://viperbb.rocks/threads/*
// @match        *://viperkats.eu/forums/*
// @match        *://viperkats.eu/forumdisplay.php*
// @match        *://viperkats.eu/search.php*
// @match        *://viperkats.eu/threads/*
// @match        *://viperohilia.art/forums/*
// @match        *://viperohilia.art/forumdisplay.php*
// @match        *://viperohilia.art/search.php*
// @match        *://viperohilia.art/threads/*
// @match        *://viperproxy.org/forums/*
// @match        *://viperproxy.org/forumdisplay.php*
// @match        *://viperproxy.org/search.php*
// @match        *://viperproxy.org/threads/*
// @match        *://vipervault.link/forums/*
// @match        *://vipervault.link/forumdisplay.php*
// @match        *://vipervault.link/search.php*
// @match        *://vipervault.link/threads/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/479756/VG%20prev%20%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/479756/VG%20prev%20%20next.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMac = window.navigator.platform.toLowerCase().startsWith('mac')
    const dispatch = {
        false: { // no shift
            'ArrowLeft': '.prev_next  a[rel="prev"]',
            'ArrowRight': '.prev_next  a[rel="next"]',
        },
        true: { // with shift
            'ArrowLeft': '.first_last a[rel="start"]',
            'ArrowRight': '.first_last a:not([rel])', // last page element has no 'rel' attribute :-/
        },
    }
    function debounce(func, timeout = 300){ // leading debounce, cancels repeated calls in the timeout window
       var timer = null
       return (...args) => {
           if (timer === null) func.apply(this, args)
           clearTimeout(timer)
           timer = setTimeout(() => {timer = null}, timeout)
       }
    }
    const handler = (e) => {
        if (e.ctrlKey && (!isMac || e.metaKey)) {
            var selector = dispatch[e.shiftKey][e.key]
            var elem = selector && document.querySelector(selector)
            elem && elem.click()
        }
    }
    window.addEventListener('keydown', debounce(handler))
})()