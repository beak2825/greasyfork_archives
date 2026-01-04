// ==UserScript==
// @name         AOJ-ICPC AOJ-2.0 Redirector
// @namespace    https://southball.cc
// @version      0.1
// @description  Change all the URLS to the beta 2.0 version of Aizu Online Judge.
// @author       You
// @match        http://aoj-icpc.ichyo.jp/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398696/AOJ-ICPC%20AOJ-20%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/398696/AOJ-ICPC%20AOJ-20%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elements = [...unsafeWindow.document.querySelectorAll('a')];
    const generateNewURL = (url) => {
        if (!url.startsWith('http://judge.u-aizu.ac.jp/onlinejudge/description.jsp')) {
            return url;
        }

        const id = new URL(url).searchParams.get('id');
        return `https://onlinejudge.u-aizu.ac.jp/problems/${id}`;
    };

    elements.forEach((element) => {
        element.href = generateNewURL(element.href);
    });
})();