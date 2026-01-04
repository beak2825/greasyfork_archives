// ==UserScript==
// @name         JA-EN Diff
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ja-en diff pop-ups for Microsoft docs. double click "link" icons for pop-ups. click outside pop-up to close.
// @author       Austin Atwood && thank you stack overflow
// @match        https://docs.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450953/JA-EN%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/450953/JA-EN%20Diff.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function () {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    var newHTML = document.createElement('div');
    newHTML.innerHTML = '             \
<div id="jaEnDiffModal" class="ja-en-diff-modal"> \
    <!-- Modal content --> \
    <div class="ja-en-diff-modal-content"> \
      <iframe id="jaEnDiffModalContent" height="100%" width="50%"></iframe> \
    </div> \
  </div> \
';

    document.body.appendChild(newHTML);

    GM_addStyle(".ja-en-diff-modal { \
    display: none; \
    position: fixed; \
    z-index: 1; \
    left: 50vw; \
    top: 0; \
    width: 100%; \
    height: 100%; \
    overflow: auto; \
    overflow-y: none; \
    background-color: rgb(0, 0, 0); \
    background-color: rgba(0, 0, 0, 0.4);")


    GM_addStyle(".ja-en-diff-modal-content { \
    background-color: #fefefe; \
    margin: 0; \
    border: 1px solid #888; \
    width: 50%; \
    height: 100vh; \
")

    var modal = document.getElementById('jaEnDiffModal');
    var links = document.getElementsByClassName("anchor-link docon docon-link");

    for (const link of links) {
        link.addEventListener('dblclick', function (link) {
            var linkhref = ""
            if (window.location.href.toLowerCase().includes("ja-jp")) {
                linkhref = link.target.href.toLowerCase().replace("ja-jp", "en-us")
            } else if (window.location.href.toLowerCase().includes("en-us")) {
                linkhref = link.target.href.toLowerCase().replace("en-us", "ja-jp")
            }
            document.getElementsByClassName("font-size-sm right-container column is-4-desktop display-none display-block-desktop")[0].remove()
            document.getElementsByClassName("left-container is-hidden-mobile column is-one-third-tablet is-one-quarter-desktop")[0].remove()
            document.getElementById("jaEnDiffModalContent").src = linkhref;
            modal.style.display = "block";
            setTimeout(() => {
                document.getElementById("jaEnDiffModalContent").contentWindow.document.getElementById("left-container").remove();
                document.getElementById("jaEnDiffModalContent").contentWindow.document.getElementsByClassName("primary-holder column is-two-thirds-tablet is-three-quarters-desktop")[0].style.width = "90%";
            }, 1500);
        })
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})();
