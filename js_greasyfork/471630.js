// ==UserScript==
// @name         X To Twitter Replace
// @namespace    OshidaScript
// @version      1.2
// @description  Replace the stupid X logo by old twitter logo on top left corner of main page and for favorite icons
// @author       Oshida_BCF
// @match        https://twitter.com/*
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471630/X%20To%20Twitter%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/471630/X%20To%20Twitter%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // This is for the logo that appear when the website load
    // It's better to use µBlock Origin to hide it by default, this take a slight delay to detect it and change it.
    // You can simple add this line to Your Filters on µBlock and it will remove the logo
    // twitter.com##.r-1blnp2b.r-lrvibr.r-ipm5af.r-1plcrui.r-zchlnj.r-u8s1d.r-dnmrzs.r-ywje51.r-1d2f490.r-wy61xf.r-yyyyoo.r-4qtqp9.r-cbkdnj.r-1p0dtai
    waitForElm("#placeholder > svg > g > path").then((elm) => {
        elm.setAttribute("d", 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z');
    });

    document.querySelectorAll('[rel="shortcut icon"]')[0].href = "//abs.twimg.com/favicons/twitter.2.ico";

    waitForElm("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > header > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-dnmrzs.r-1vvnge1 > h1 > a > div > svg > g > path").then((elm) => {
        elm.setAttribute("d", 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z');
    });

    function titleModified(titleEl, prevText) {
        setTimeout(() => {
            var title = titleEl.text;
            if(title != prevText)
            {
                title = title.replace('/ X', '/ Twitter');
                titleEl.text = title
            }
            return prevText
        }, 250);
    }

    waitForElm("head > title").then((elm) => {
        var titleEl = elm;
        var docEl = document.documentElement;
        var prevText = "";
        if (docEl && docEl.addEventListener) {
            docEl.addEventListener("DOMSubtreeModified", function(evt) {
                var t = evt.target;
                // If the script is somehow using your bandwith a lot
                // Decomment this if
                /*if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
                    prevText = titleModified(titleEl, prevText);
                }*/
                // And comment this line, this will limit how much the function is called, but it will not work if twitter is loadout in the background
                prevText = titleModified(titleEl, prevText);
            }, false);
        } else {
            document.onpropertychange = function() {
                if (window.event.propertyName == "title") {
                    prevText = titleModified(titleEl, prevText);
                }
            };
        }
    });
})();