// ==UserScript==
// @name         Фавиконы Google
// @description  Добавляет фавиконы в поиск Google.
// @include      https://www.google.ru/*
// @include      https://www.google.ru/*/*
// @include      https://www.google.com/*
// @include      https://www.google.com/*/*
// @run-at       document-start
// @version      2.7
// @licence      Apache 2.0
// @icon         http://nv.github.com/faviconize-google.js/chrome/icon_48.png
// @grant          GM_addStyle
// @namespace http://userscripts.ru/js/faviconize-google/
// @downloadURL https://update.greasyfork.org/scripts/36576/%D0%A4%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BD%D1%8B%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/36576/%D0%A4%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BD%D1%8B%20Google.meta.js
// ==/UserScript==


(function(){

    (typeof GM_addStyle != 'undefined' ? GM_addStyle : function addStyle(css) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    })(".favicon {\
    padding-right: 4px;\
    vertical-align: middle;\
    border: none;\
}\
#res .favicon {\
    left: -20px;\
    position: absolute;\
    top: 2px;\
    z-index: 9;\
}\
div.vsc {\
    position: relative;\
}\
div.vsc img.favicon {\
    position: absolute !important;\
    top: 0;\
    left: -20px !important;\
}\
");

    var FAVICON_GRABBER = 'https://www.google.com/s2/favicons?domain='; // 'http://favicon.yandex.net/favicon/'
    var QUERY = '#ires .g h3 a:not([id]), #res .g a:not([id])';

/**
 * @param {NodeList} links
 */
function add_favicons_to(links) {
    for (var i=0; i<links.length; i++) {
        if (links[i].firstChild.className != 'favicon') {
            var host = links[i].href.replace(/.*https?:\/\//, '').replace(/\/.*$/,'');
            var img = document.createElement('IMG');
            img.src = FAVICON_GRABBER + host;
            img.width = '16';
            img.height = '16';
            img.className = 'favicon';
            links[i].insertBefore(img, links[i].firstChild);
        }
    }
}

add_favicons_to(document.querySelectorAll(QUERY));

/**
 * Debounce function from http://code.google.com/p/jquery-debounce/
 */
function debounce(fn, timeout, invokeAsap, context) {
    if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
        context = invokeAsap;
        invokeAsap = false;
    }
    var timer;
    return function() {
        var args = arguments;
        if(invokeAsap && !timer) {
            fn.apply(context, args);
        }
        clearTimeout(timer);
        timer = setTimeout(function() {
            if(!invokeAsap) {
                fn.apply(context, args);
            }
            timer = null;
        }, timeout);
    };
}

document.addEventListener('DOMNodeInserted', debounce(function handleNewFavicons(event){
        if (event.target.className != 'favicon') {
            add_favicons_to(document.querySelectorAll(QUERY));
        }
    }, 500)
, false);

})();


