// ==UserScript==
// @name         Remove Apple Daily Protect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        https://*.appledaily.com/*
// @match        https://*.appledaily.com.hk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390737/Remove%20Apple%20Daily%20Protect.user.js
// @updateURL https://update.greasyfork.org/scripts/390737/Remove%20Apple%20Daily%20Protect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    for(let i = 0; i < document.head.children.length; i++) {
        let curEle = document.head.children[i];
        if (curEle.localName == "script") {
            curEle.outerHTML = curEle.outerHTML.replace("function uReadDisplayMsgBox", "function uReadDisplayMsgBoxA");
            window.uReadDisplayMsgBox = function(param) {return};
        };
    };
    window.addEventListener('load', () => {
        var divscroller = document.querySelector("#fusion-app > div.desktop > div.scroller.scroller-truncate");
        if (divscroller != null) {
            divscroller.classList = null;
        }
        var articleOmo = document.querySelector("#articleOmo");
        if (articleOmo != null) {
            articleOmo.remove();
        }
        var articleBody = document.querySelector("#articleBody");
        if (articleBody != null) {
            articleBody.style.maxHeight = null;
            articleBody.style.overflow = null;
        }

        var intervalCount = 0;
        var intervalID = setInterval( () => {
            intervalCount++;
            if (intervalCount > 100) {
                clearInterval(intervalID);
            }
            var divomoblocking = document.querySelector("#app > div.full_width.header > div.omo-blocking");
            if (divomoblocking != null) {
                clearInterval(intervalID);
                divomoblocking.remove();
                var _html = document.getElementsByTagName("HTML")[0];
                if (_html != null) {
                    _html.style.overflow=null;
                }
            }
        }, 100);
    });
    var intervalCount = 0;
    var intervalID = setInterval( () => {
        intervalCount++;
        if (intervalCount > 1000) {
            clearInterval(intervalID);
        }
        var divomoblocking = document.querySelector("#app > div.full_width.header > div.omo-blocking");
        if (divomoblocking != null) {
            clearInterval(intervalID);
            divomoblocking.remove();
            var _html = document.getElementsByTagName("HTML")[0];
            if (_html != null) {
                _html.style.overflow=null;
            }
        }
    }, 100);
})();