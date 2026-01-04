// ==UserScript==
// @name       Tapatalk DozensOnline doHTML Whitespace Cleanup
// @namespace  https://greasyfork.org/en/users/18614-kodegadulo
// @version    1.1
// @description  Gets rid of spurious br nodes in doHTML
// @include    https://www.tapatalk.com/groups/dozensonline/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39078/Tapatalk%20DozensOnline%20doHTML%20Whitespace%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/39078/Tapatalk%20DozensOnline%20doHTML%20Whitespace%20Cleanup.meta.js
// ==/UserScript==

(function() {
    console.log("Tapatalk DozensOnline doHTML Whitespace Cleanup");
    var iframes = document.querySelectorAll('.postbody iframe[sandbox]')
    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var contentDocument = iframe.contentDocument;
        if (!contentDocument) continue;
        var bodyNode = contentDocument.body;
        if (!bodyNode) continue;
        var breaklines = bodyNode.querySelectorAll('br');
        for (var j = 0; j < breaklines.length; j++) {
            var breakline = breaklines[j];
            var parent = breakline.parentElement;
            parent.removeChild(breakline);
        }
        iframe.style.height = ($(bodyNode).height()) + "px";
        iframe.setAttribute("scrolling", "true");
    }
    console.log("Tapatalk DozensOnline doHTML Whitespace Cleanup Done");
})();