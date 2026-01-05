// ==UserScript==
// @name           ZeroCruft
// @version        2017.01.17
// @namespace      1bae28cfed0eddb302b3ac9b578412a3
// @author         Dan Garthwaite <dan@garthwaite.org>
// @description    Removes the cruft from the new zerohedge
// @include        https://*zerohedge.com/*
// @run-at         document-end
// @require        https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/21334/ZeroCruft.user.js
// @updateURL https://update.greasyfork.org/scripts/21334/ZeroCruft.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('sidebar-left-wrapper')[0].remove();
    document.getElementsByClassName('sidebar-right-wrapper')[0].remove();
    var articles = document.querySelectorAll('#block-zerohedge-content .view-articles .views-row');

    // Delete all '.custom-flex' nodes even if added dynamically
    document.body.addEventListener('DOMSubtreeModified', function(event) {
        var elements = document.getElementsByClassName('ad-mobile-frontpage');
        while (elements.length > 0) elements[0].remove();
        elements = document.getElementsByClassName('custom-flex');
        while (elements.length > 0) elements[0].remove();
        articles = document.querySelectorAll('#block-zerohedge-content .view-articles .views-row');
    });

    /* Do jk navigation */
    document.querySelector('head').innerHTML += '<style>.jk-current {outline: 1px solid navy;}</style>';

    const jk = function(inc) {
        if (!articles.length) { return;}
        for (var i = 0, len = articles.length; i <= len; i++) {
            if (articles[i].classList.contains('jk-current')) {
                var next = (i + inc) % len;
                next = (next > 0) ? next : 0;
                articles[i].classList.toggle('jk-current');
                articles[next].classList.toggle('jk-current');
                break;
            }
        }
    };

    var foundSticky = false;
    for (var i=0, len=articles.length; i<len; i++) {
        var article = articles[i];
        if (!foundSticky && article.firstElementChild.classList.contains('node--sticky')) {
            article.className += ' jk-current';
            jk(i);
            foundSticky = true;
            break;
        }
    }

    if (!foundSticky) {
        articles[0].className += ' jk-current';
        jk(0);
    }

    var open_article = function() {
        $(".jk-current").find('a')[0].click();
    };

    const keyDownTextField = function (event) {
        // empty article list or keypresses in input fields
        if (document.activeElement.tagName == 'INPUT' || articles.length === 0) {
            return;
        }

        let key = String.fromCharCode(event.which).toUpperCase();
        if (event.which == "13")
            key = "13";

        switch (key) {
            case "J":
            case " ":
                jk(1);
                break;
            case "K":
                jk(-1);
                break;
            case "O":
            case "13":
                open_article();
                break;
        }

        //scroll .jk-current to top of window
        var current = $(".jk-current");
        if (current) {
            $('html, body').animate({
                scrollTop: $(".jk-current").offset().top - 100
            }, 200);
        } else {
            console.log('No jk-current found');
        }
    };
    document.addEventListener("keydown", keyDownTextField, false);
})();