// ==UserScript==
// @name        4PDA Unbrender
// @description Removes background images and links for those whom annoyed by them.
// @namespace   lainscripts_4pda_unbrender
// @include     http://4pda.ru/*
// @include     https://4pda.ru/*
// @version     5.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/14470/4PDA%20Unbrender.user.js
// @updateURL https://update.greasyfork.org/scripts/14470/4PDA%20Unbrender.meta.js
// ==/UserScript==

/* jshint esnext: true */
(function(){
    'use strict';

    var isForum = document.location.href.search('/forum/') !== -1,
        isSafari = (/Safari/i.test(navigator.userAgent)) && (/Apple\sComputer/i.test(navigator.vendor)),
        hStyle;

    function remove(n) {
        if (n) {
            n.parentNode.removeChild(n);
        }
    }

    function afterClean() {
        hStyle.disabled = true;
        remove(hStyle);
    }

    function beforeClean() {
        // attach styles before document displayed
        hStyle = document.createElement('style');
        hStyle.id = 'ubrHider';
        hStyle.type = 'text/css';
        document.head.appendChild(hStyle);

        hStyle.sheet.insertRule('html { overflow-y: scroll }', 0);
        hStyle.sheet.insertRule('article + aside * { display: none !important }', 0);
        hStyle.sheet.insertRule('#header + div:after {'+(
            'content: "";'+
            'position: fixed;'+
            'top: 0;'+
            'left: 0;'+
            'width: 100%;'+
            'height: 100%;'+
            'background-color: #E6E7E9'
        )+'}', 0);
        // http://codepen.io/Beaugust/pen/DByiE
        hStyle.sheet.insertRule('@keyframes spin { 100% { transform: rotate(360deg) } }', 0);
        hStyle.sheet.insertRule('article + aside:after {'+(
            'content: "";'+
            'position: absolute;'+
            'width: 150px;'+
            'height: 150px;'+
            'top: 150px;'+
            'left: 50%;'+
            'margin-top: -75px;'+
            'margin-left: -75px;'+
            'box-sizing: border-box;'+
            'border-radius: 100%;'+
            'border: 10px solid rgba(0, 0, 0, 0.2);'+
            'border-top-color: rgba(0, 0, 0, 0.6);'+
            'animation: spin 2s infinite linear'
        )+'}', 0);

        // display content of a page if time to load a page is more than 2 seconds to avoid
        // blocking access to a page if it is loading for too long or stuck in a loading state
        setTimeout(2000, afterClean);
    }

    function staticFixes() {
        var st = document.createElement('style');
        st.id = 'ubrStatic';
        st.type = 'text/css';
        document.head.appendChild(st);
        st.sheet.insertRule('#nav .use-ad {display: block !important;}', 0);
        st.sheet.insertRule('article:not(.post) + article:not(#id) { display: none !important }', 0);
    }

    staticFixes();
    if (!isForum && !isSafari) {
        beforeClean();
    }

    // clean the page
    window.addEventListener('DOMContentLoaded', function(){
        var rem, si, lst, i;
        function width(){ return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0; }
        function height(){ return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0; }


        if (isForum) {
            si = document.querySelector('#logostrip');
            if (si) {
                remove(si.parentNode.nextSibling);
            }
        }

        if (document.location.href.search('/forum/dl/') !== -1) {
            lst = document.querySelectorAll('body>div');
            i = lst.length;
            document.body.setAttribute('style', (document.body.getAttribute('style')||'')+
                                       ';background-color:black!important');
            while (i--) {
                if (!lst[i].querySelector('.dw-fdwlink')) {
                    remove(lst[i]);
                }
            }
        }

        if (isForum) { // Do not continue if it's a forum
            return;
        }

        si = document.querySelector('#header');
        if (si) {
            rem = si.previousSibling;
            while (rem) {
                si = rem.previousSibling;
                remove(rem);
                rem = si;
            }
        }

        lst = document.querySelectorAll('#nav li[class]');
        i = lst.length;
        while (i--) {
            if (lst[i] && lst[i].querySelector('a[href^="/tag/"]')) {
                remove(lst[i]);
            }
        }

        lst = document.querySelectorAll('DIV');
        i = lst.length;
        var style, result;
        while (i--) {
            if (lst[i].offsetWidth > 0.95 * width() && lst[i].offsetHeight > 0.9 * height()) {
                style = window.getComputedStyle(lst[i], null);
                result = [];
                if(style.backgroundImage !== 'none') {
                    result.push('background-image:none!important');
                }
                if(style.backgroundColor !== 'transparent') {
                    result.push('background-color:transparent!important');
                }
                if (result.length) {
                    if (lst[i].getAttribute('style')) {
                        result.unshift(lst[i].getAttribute('style'));
                    }
                    lst[i].setAttribute('style', result.join(';'));
                }
            }
        }

        lst = document.querySelectorAll('ASIDE>DIV');
        i = lst.length;
        while (i--) {
            if ( ((lst[i].querySelector('script, iframe, a[href*="/ad/www/"]') ||
                   lst[i].querySelector('img[src$=".gif"]:not([height="0"]), img[height="400"]')) &&
                  !lst[i].classList.contains('post') ) || !lst[i].childNodes.length ) {
                remove(lst[i]);
            }
        }

        document.body.setAttribute('style', (document.body.getAttribute('style')||'')+';background-color:#E6E7E9!important');

        // display content of the page
        afterClean();
    });
})();