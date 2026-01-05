// ==UserScript==
// @name         Copy github file to clipboard
// @description  Add copy github file text to clipboard
// @namespace    org.adong
// @version      0.1
// @author       adong
// @homepageURL  https://github.com/ldong/github-copy-text
// @supportURL   https://github.com/ldong/github-copy-text/README.md
// @match        *://github.com/*
// @match        *://www.github.com/*
// @include      /^https?://git\.corp.*/.*$/
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28623/Copy%20github%20file%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/28623/Copy%20github%20file%20to%20clipboard.meta.js
// ==/UserScript==

(function() {
    // copied from http://stackoverflow.com/a/36640126/2305243
    function CopyToClipboard(node) {
        var range;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select().createTextRange();
            document.execCommand("Copy");

        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(node);
            window.getSelection().addRange(range);
            document.execCommand("Copy");
            alert("text copied");
        }
    }


    var copyButton = document.createElement('button');
    copyButton.classList = 'btn btn-sm BtnGroup-item copy-file-another';
    copyButton.textContent = 'Copy Text';

    copyButton.addEventListener('click', function(e) {
        e.preventDefault();
        var copyContentNode = document.querySelector(".file > .file-header").nextElementSibling;
        CopyToClipboard(copyContentNode);
    });


    var targetButtonGroupClass = '.BtnGroup.float-right';
    var targetButtonGroup = document.querySelector(targetButtonGroupClass);
    if (targetButtonGroup) {
        targetButtonGroup.appendChild(copyButton);
    } else {
        console.error('Please file a bug, or make a PR. ');
    }

})();