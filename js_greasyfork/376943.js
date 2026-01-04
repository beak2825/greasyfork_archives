// ==UserScript==
// @name         Keyboard navigator
// @version      1.8
// @description  Keyboard navigation
// @author       badook
// @include      http*://*
// @grant        GM_openInTab
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace    https://greasyfork.org/users/240988
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376943/Keyboard%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/376943/Keyboard%20navigator.meta.js
// ==/UserScript==

'use strict';

var jq = $.noConflict();

//var bgcolor = "#EBF2FF";
var bgcolor = 'rgba(0, 50, 0, 0.5)';

var util = {
    q: function (query, context) {
        return (context || document).querySelector(query);
    },
    qq: function (query, context) {
        return [].slice.call((context || document).querySelectorAll(query));
    }
};

var i = 0;
var results = [];

var isGoogleSearch = /^(http|https):\/\/(www.)?google.(com|co.uk|it)\/search\?/.test(location.href);

if (isGoogleSearch) {
    console.log("It's a google search page");
    var searchBox = jq('input[name="q"]').first();
    var prevPage = document.getElementById("pnprev");
    var nextPage = document.getElementById("pnnext");
    results = util.qq('#rso div.g', document.body);
    //results = [].slice.call(jq('#rso div.g ', document.body).not(jq(this), ':has(a))'));

    if (results.length) {
        results[i].style.backgroundColor = bgcolor;

        jq(results).click(function () {
            results[i].style.backgroundColor = "transparent";
            i = results.indexOf(jq(this).get(0));
            jq(this).get(0).style.backgroundColor = bgcolor;
        });
    }
}


document.onkeypress = function (e) {
    console.log(e.keyCode);

    if (!shouldScroll(e)) {
        return;
    }

    switch (e.keyCode) {
        case 97:        // a
            if (isGoogleSearch && searchBox !== undefined) {
                setTimeout(function () {                    // Dont put current letter in input
                    searchBox.focus();
                    searchBox.value = searchBox.value;      // Cursor to end
                }, 0);
            }
            return;
        case 13:        // enter
        case 100:       // d
            var url = jq('a', jq(results[i])).attr('href');
            if (isGoogleSearch && url !== undefined) {
                console.log(url);
                GM_openInTab(url, true);
            }
            return;
        case 68:        // D
            GM_openInTab(util.q('a', results[i]).href, false);
            return;
        case 113:       // q
            if (isGoogleSearch && prevPage !== undefined) {
                prevPage.click();
            }
            return;
        case 101:       // e
            if (isGoogleSearch && nextPage !== undefined) {
                nextPage.click();
            }
            return;
        case 87:        // W
            window.scrollBy(0, -100);
            return;
        case 83:        // S
            console.log("scroll")
            window.scrollBy(0, 100);
            return;
        case 119:       // w
            if (isGoogleSearch && i > 0) {
                results[i--].style.backgroundColor = "transparent";
            }
            break;
        case 115:       // s
            if (isGoogleSearch && i < results.length - 1) {
                results[i++].style.backgroundColor = "transparent";
            }
            break;
        default:
            return;
    }
    if (results !== undefined && results[i] !== undefined) {
        results[i].style.backgroundColor = bgcolor;
        scrollToElement(results[i]);
    }
};


function scrollToElement(el) {
    var elOffset = jq(el).offset().top;
    var elHeight = jq(el).height();
    var windowHeight = jq(window).height();
    var offset;
    if (elHeight < windowHeight)
        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    else
        offset = elOffset;
    jq('html, body').animate({ scrollTop: offset }, 0);
}


function shouldScroll(event, direction) {
    if (event.target.isContentEditable) {
        return false;
    }
    if (event.target.type === 'application/x-shockwave-flash') {
        return false;
    }
    if (event.defaultPrevented) {
        return false;
    }
    if (/button|input|textarea|select|embed|object/i.test(event.target.nodeName)) {
        return false;
    }
    if (event.metaKey === true) {
        return false;
    }
    if (!document.hasFocus()) {
        return false;
    }
    if (document.domain === 'mail.google.com') {
        if (window.location.hash.indexOf('/') === -1) {
            return false;
        } else if (!(event.keyCode in keyMaps.arrows)) {
            return false;
        }
    }
    /*
        if (!window.scrollTargetY) {
            findScrollTargets(event, 'y');
            if (!window.scrollTargetY) {
                return false;
            }
        }
    */
    if (!scrollable(window.scrollTargetY, 'y')) {
        return false;
    }
    return true;
};


findScrollTargets = function (event, axis) {
    var scrollableParentX, scrollableParentY, target;
    if (event == null) {
        event = null;
    }
    if (axis == null) {
        axis = 'both';
    }
    if (!event || document.activeElement === !document.body) {
        target = document.activeElement;
    } else {
        target = event.target || event.srcElement;
        target = target.nodeType === 1 ? target : target.parentNode;
    }
    if (axis === 'y' || axis === 'both') {
        scrollableParentY = findScrollableParent(target, 'y');
        if (scrollableParentY) {
            window.scrollTargetY = scrollableParentY;
        }
    }
    if (axis === 'x' || axis === 'both') {
        scrollableParentX = findScrollableParent(target, 'x');
        if (scrollableParentX) {
            return window.scrollTargetX = scrollableParentX;
        }
    }
};


findScrollableParent = function (element, axis) {
    while (true) {
        if (scrollable(element, axis)) {
            return element;
        } else {
            element = element.parentElement;
        }
    }
};


scrollable = function (element, axis) {
    var initialPosition, scrollAxis, scrollVariation;
    scrollAxis = axis === 'y' ? 'scrollTop' : 'scrollLeft';
    if (!element) {
        return true;
    } else if (/button|input|textarea|select|embed|object/i.test(element.nodeName)) {
        return false;
    } else if (element[scrollAxis] > 10) {
        return true;
    } else {
        initialPosition = element[scrollAxis];
        element[scrollAxis] = 10;
        scrollVariation = element[scrollAxis];
        element[scrollAxis] = initialPosition;
        if (scrollVariation >= 10) {
            return true;
        }
    }
    return false;
};
