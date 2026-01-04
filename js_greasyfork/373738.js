// ==UserScript==
// @name         short gitlab diff filename
// @namespace    http://gitlab.mafengwo.net/
// @version      0.1
// @description  shorten gitlab diff filename by remove middle path
// @author       You
// @include      https://gitlab.mfwdev.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373738/short%20gitlab%20diff%20filename.user.js
// @updateURL https://update.greasyfork.org/scripts/373738/short%20gitlab%20diff%20filename.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function modifyDiffFileFunc() {
        const es = document.getElementsByClassName("diff-file-changes-path append-right-5");
        for (var i = 0; i < es.length; i++) {
            const pathComponents = es[i].textContent.split("/");
            es[i].textContent = pathComponents.length > 1 ? pathComponents[0]+ "/" + pathComponents[pathComponents.length - 1] : pathComponents[0];
        }
    }

    function onDOMChanged(e) {
        if (e.target.nodeName == "DIV" && e.target.className == "commit-stat-summary dropdown") {
            modifyDiffFileFunc();
        }
    }

    const url = window.location.href;
    if (url.includes('merge')) {
        document.querySelector("#diff-notes-app").addEventListener("DOMSubtreeModified", onDOMChanged);
    }

})();