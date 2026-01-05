// ==UserScript==
// @name         Gist Delete Button
// @namespace    http://ostrow.tech
// @version      0.1
// @description  Adds Delete buttons to the list page of gist.com
// @author       Stephen Ostrow <stephen@ostrow.tech>
// @match        https://gist.github.com/isleshocky77
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25312/Gist%20Delete%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/25312/Gist%20Delete%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
        console.log(head, style);
    }

    addGlobalStyle('.creator form { display: inline; }');

    var gists = document.getElementsByClassName('gist-snippet');
    for (var i = 0; i< gists.length; i++) {
        (function(gist) {
            var viewLink = gist.getElementsByClassName('link-overlay')[0].getAttribute('href');

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(xhr.responseText,"text/html");
                    var deleteForm = htmlDoc.getElementsByClassName('pagehead-actions')[0].getElementsByTagName('form')[0];

                    var creatorDiv = gist.getElementsByClassName('creator')[0];
                    creatorDiv.appendChild(deleteForm);
                }
            };
            xhr.open('GET', viewLink, true);
            xhr.send(null);
        })(gists[i]);
    }
})();