// ==UserScript==
// @name         Better Hots Logs tooltips by Jerek
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Activate tooltips on mouseover, and make them imitate the in-game Heroes of the Storm style.
// @author       Jerek Dain
// @match        https://www.hotslogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28641/Better%20Hots%20Logs%20tooltips%20by%20Jerek.user.js
// @updateURL https://update.greasyfork.org/scripts/28641/Better%20Hots%20Logs%20tooltips%20by%20Jerek.meta.js
// ==/UserScript==

// jshint multistr: true

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '.rgMasterTable td > img {\
    height: 48px !important;\
    transition: 150ms;\
    width: 48px !important;\
}\
\
span.titlePopup {\
    background: rgba(30, 31, 54, .95);\
    border: 1px solid #5f6574;\
    border-radius: 0;\
    box-shadow: 0 0 10px #1e1f36, 0 0 5px #1e1f36, inset 0 0 0 1px #8bb1ff;\
    color: #8bb1ff;\
    color: #bfd4fd;\
    font-size: 16px;\
    margin: 0 0 0 69px;\
    max-width: 280px;\
    outline: 1px solid #1e1f36;\
    padding: 5px 8px;\
    pointer-events: none;\
    text-align: left;\
    white-space: normal;\
}\
\
td > span.titlePopup {\
    margin: 0 0 0 5px;\
}\
\
span.titlePopup b {\
    color: #fff;\
    display: block;\
    font-weight: bold;\
    margin: 0 0 2px 0;\
}';
    document.getElementsByTagName('head')[0].appendChild(style);

    var getTitle = function(element) {
        if (element.title) {
            element.setAttribute('data-tooltip', element.title);
            element.removeAttribute('title');
        }
        return element.getAttribute('data-tooltip');
    };

    var addTooltip = function(target, text) {
        $('> span', target).remove();
        var span = document.createElement('span');
        span.className = 'titlePopup';
        span.innerHTML = text.replace(/^([^:]+):/, '<b>$1</b>');
        $(target).after(span);
    };

    $('body')
        .delegate('.rgMasterTable tr, .rgMasterTable td img[alt]', 'mouseenter', function() {
            var title = getTitle(this);
            if (title) {
                addTooltip(this, title);
            }
        })
        .delegate('.rgMasterTable tr, .rgMasterTable td img[alt]', 'mouseleave', function() {
            $(this).siblings('span').remove();
        });
})();
