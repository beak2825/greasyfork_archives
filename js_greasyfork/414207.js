// ==UserScript==
// @name          Tumblr Highlight Tags
// @namespace     https://greasyfork.org/users/697165
// @description	  Highlights tags when the filter "Show tags added in Reblogs" is enabled. Also adds a button for viewing tagged reblogs only.
// @author        Bam
// @include       *tumblr.com/blog/*/activity
// @require       https://cdnjs.cloudflare.com/ajax/libs/eqcss/1.9.2/EQCSS.min.js
// @run-at        document-start
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/414207/Tumblr%20Highlight%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/414207/Tumblr%20Highlight%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
    button#tagged-reblogs {
        padding: 5px 8px;
        border-radius: 5px;
        font-weight: 700;
    }

    .tagged-rb-button {
        background: gray;
        color: rgb(255,255,255,.7);
    }

    .on {
        background: #00b8ff;
        color: rgb(255,255,255,1);
    }

    span.gAr-2:not([title]) {
        font-weight: 700;
        background: #00b8ff;
        color: white;
        display: inline-block;
        padding: 2px 5px;
        margin: 0 3px 6px 0;
        border-radius: 5px
    }

    @element "._8n5Bm" {
        eval('document.getElementById("tagged-reblogs").classList.contains("on") && ":self"') {
            display: none
        }

        eval('document.getElementById("tagged-reblogs").classList.contains("on") && querySelector("span.gAr-2:not([title])") && ":self"') {
            display: flex
        }
    }
    `;

    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else {
        var newStylesheet = document.createElement("style");
        newStylesheet.type = "text/css";
        newStylesheet.appendChild(document.createTextNode(css));
        var headElements = document.getElementsByTagName("head");

        if (headElements.length > 0) {
            headElements[0].appendChild(newStylesheet);
        } else {
            document.documentElement.appendChild(newStylesheet);
        }
    }

    var newButton = document.createElement('button');
    newButton.id = 'tagged-reblogs';
    newButton.innerText = 'Tagged Reblogs Only';
    newButton.classList.add('tagged-rb-button');

    document.onreadystatechange = function() {
        if (document.readyState === 'complete') {
            var filterButton = document.querySelector('button[aria-label="Filter activity notifications"]');
            filterButton.parentNode.insertBefore(newButton, filterButton);

            newButton.onclick = function(e) {
                newButton.classList.toggle('on');
                EQCSS.apply();
            }
        }
    }
})();