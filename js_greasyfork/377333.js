// ==UserScript==
// @name         GitLab Local Time
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Show local time in tooltips instead UTC
// @author       Vyacheslav Shimarulin
// @match        https://gitlab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377333/GitLab%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/377333/GitLab%20Local%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gitlabTime() {
        const timeElementList = Array.from(document.getElementsByTagName('time'));
        timeElementList.forEach(function(elem) {
            const time = new Date(elem.getAttribute('datetime'))
            .toLocaleString();

            elem.setAttribute('data-original-title', time)
        });
    }

    setTimeout(() => {
        gitlabTime();
    }, 2000)
})();