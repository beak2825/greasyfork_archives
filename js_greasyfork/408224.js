// ==UserScript==
// @name         Zhihu Auto Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically toggle hidden built-in dark mode on zhihu.com
// @author       Nathaniel Wu
// @include      *.zhihu.com/*
// @exclude      *link.zhihu.com/*
// @exclude      *www.zhihu.com/question/*/log
// @exclude      *www.zhihu.com/people/*/logs
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/b2e6490f5ac7c35dc0cd902fda851b36
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408224/Zhihu%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/408224/Zhihu%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const setDarkMode = on => {
        let alreadyOn = document.querySelector('html').getAttribute('data-theme') == 'dark';
        if ((alreadyOn && (!on)) || ((!alreadyOn) && on)) {
            let keyword, keyword_replacement;
            if (on) {
                keyword = 'theme=light';
                keyword_replacement = 'theme=dark';
            } else {
                keyword = 'theme=dark';
                keyword_replacement = 'theme=light';
            }
            if (window.location.href.match(/theme=(dark|light)/))
                window.location.href = window.location.href.replace(keyword, keyword_replacement);
            else {
                if (window.location.href.match(/\?[^=]+=/))
                    window.location.href = window.location.href + `&${keyword_replacement}`;
                else
                    window.location.href = window.location.href + `?${keyword_replacement}`;
            }
        }
    }
    const in_iframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (!in_iframe()) {
        if (window.matchMedia) {// if the browser/os supports system-level color scheme
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkMode(e.matches));
        } else {// otherwise use local time to decide
            let hour = (new Date()).getHours();
            setDarkMode(hour > 18 || hour < 8);
        }
    }
})();