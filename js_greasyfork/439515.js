// ==UserScript==
// @name         scroll_to_top
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  scroll to top for PC and mobile
// @author       amormaid
// @run-at       document-end
// @match        http(s)?://*/*
// @include      http://*
// @include      https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439515/scroll_to_top.user.js
// @updateURL https://update.greasyfork.org/scripts/439515/scroll_to_top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sttClassName = 'scroll-to-top';
    let timeoutID;

    function scroll_or_touchmove_handler() {
        clearTimeout(timeoutID);
        const btn = (document.getElementsByClassName(sttClassName) || [])[0];
        if (btn && btn.style.cssText !== 'opacity: 1;') {
            btn.style.cssText = 'opacity: 1;';
        }
        timeoutID = setTimeout(() => {
            btn.style.cssText = 'opacity: .1;';
            timeoutID = null;
        }, 5000);
    }

    function addCSSStyle() {
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        cssStyle.textContent = [
            '.' + sttClassName + ' {',
            '	width: 10vw;',
            '	height: 10vw;',
            '	line-height: 10vw;',
            '	text-align: center;',
            '	background: whiteSmoke;',
            '	font-weight: bold;',
            '	font-size: 6vw;',
            '	color: #444;',
            '	text-decoration: none;',
            '	position: fixed;',
            '	bottom: 0;',
            '	left: 0;',
            '	display: block;',
            '	border: 1px solid grey;',
            '	border-top-right-radius: 5vw;',
            '	box-shadow: 0 0 3px grey;',
            '	transition: opacity 250ms ease-out;',
            '	z-index: 1000;',
            '	cursor: pointer;',
            '}'
        ].join('\n');
        if(document.head) {
            document.head.appendChild(cssStyle);
        }
    }

    (() => {
        if ('ontouchstart' in window) {
            window.ontouchmove = scroll_or_touchmove_handler;
        } else {
            window.onscroll = scroll_or_touchmove_handler;
            window.onwheel = function() {
                if(typeof timeoutID != 'number') {
                    return;
                }
                clearTimeout(timeoutID);
                timeoutID = null;
            };

        }
        addCSSStyle();
        var div = document.createElement('div');
        div.className = sttClassName;
        div.textContent = '⇧';
        div.style.cssText = 'opacity: .1;';
        div.onclick = () => window.scrollTo(0, 0);
        document.body.appendChild(div);


    })();

})();