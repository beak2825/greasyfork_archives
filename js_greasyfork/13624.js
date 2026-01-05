// ==UserScript==
// @name         Youtube: I'm feeling lucky
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Add I'm feeling lucky button to Youtube
// @author       divide100
// @match        *://www.youtube.com/*
// @grant        GM_openInTab
// @require https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=46106
// @downloadURL https://update.greasyfork.org/scripts/13624/Youtube%3A%20I%27m%20feeling%20lucky.user.js
// @updateURL https://update.greasyfork.org/scripts/13624/Youtube%3A%20I%27m%20feeling%20lucky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var util = {
        log: function () {
            var args = [].slice.call(arguments);
            args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
            console.log.apply(console, args);
        },
        q: function(query, context) {
            return (context || document).querySelector(query);
        },
        qq: function(query, context) {
            return [].slice.call((context || document).querySelectorAll(query));
        },
        xmlReq: function(url, cb, errcb){
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'document';
            xhr.onload = cb;
            xhr.onerror = errcb;
            xhr.send();
        }
    };

    var SCRIPT_NAME = "Youtube's feeling lucky";

    util.log('Starting');

    waitForElems('#search-btn', function(searchBtn) {
        var btn = document.createElement('button');
        // copy classes
        btn.classList = searchBtn.classList;
        btn.style.paddingLeft = '10px';
        btn.style.paddingRight = '10px';
        btn.textContent = 'Feelin\' Lucky';

        var input = util.q('#masthead-search-term');

        btn.onmousedown = function(e) {
            if(e.button === 1) {
                e.preventDefault();
            }
        };
        btn.onclick = function(e) {
            e.preventDefault();
            var inputValue = input.value.trim();
            if(inputValue) {
                btn.disabled = true;
                util.xmlReq('https://www.youtube.com/results?search_query=' + encodeURIComponent(inputValue), function(xhe) {
                    var link = util.q('.yt-lockup-video .yt-uix-tile .yt-lockup-thumbnail a', xhe.target.response.body).href;
                    if(e.button === 1) {
                        GM_openInTab(link, false);
                    }
                    else {
                        window.location.href = link;
                    }
                    btn.disabled = false;
                }, function() {
                    btn.disabled = false;
                });
            }
            return false;
        };
        searchBtn.parentNode.insertBefore(btn, searchBtn);
    });
})();