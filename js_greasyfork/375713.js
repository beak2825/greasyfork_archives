// ==UserScript==
// @name         Jira board presentation mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add presentation mode for the JIRA rapid board for use of casting to TV through a phone. Work in progress.
// @author       Wesley van Beelen
// @match        *.atlassian.net/secure/RapidBoard.jspa*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375713/Jira%20board%20presentation%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/375713/Jira%20board%20presentation%20mode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function hideAllExcept(id) {
        var el = document.getElementById(id);
        while (el && el != document.body) {
            // go one level up
            var parent = el.parentNode;
            // get siblings of our ancesotr
            var siblings = parent.childNodes;
            // loop through the siblings of our ancestor, but skip out actual ancestor
            for (var i = 0, len = siblings.length; i < len; i++) {
                var node = siblings[i];
                if (node != el) {
                    if (node.nodeType == 1) {
                        // only operate on element nodes
                        node.style.display = "none";
                    } else if (node.nodeType == 3) {
                        // wrap text node in span object so we can hide it
                        var span = document.createElement("span");
                        span.style.display = "none";
                        span.className = "xwrap";
                        node.parentNode.insertBefore(span, node);
                        // Be wary of the dynamic siblings nodeList changing
                        // when we add nodes.
                        // It actually works here because we add one
                        // and remove one so the nodeList stays constant.
                        span.appendChild(node);
                    }
                }
            }
            el = parent;
        }
    }
    hideAllExcept("ghx-pool");

    addButton('UP', function(){$(GH.Shortcut.previousIssue('k'))}, {position: 'absolute', top: '1%', left:'10%', height:'5%', width:'15%', 'z-index': 3})
    addButton('DOWN', function(){$(GH.Shortcut.nextIssue('j'))}, {position: 'absolute', top: '1%', left:'34%', height:'5%', width:'15%', 'z-index': 3})
    addButton('<', function(){AJS.$(GH.Shortcut.previousBox('p'))}, {position: 'absolute', top: '1%', left:'58%', height:'5%', width:'15%', 'z-index': 3})
    addButton('>', function(){AJS.$(GH.Shortcut.nextBox('n'))}, {position: 'absolute', top: '1%', left:'82%', height:'5%', width:'15%', 'z-index': 3})

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {width: '100px', height:'100px'}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

})();