// ==UserScript==
// @name       Tapatalk DozensOnline Whitespace Cleanup
// @namespace  https://greasyfork.org/en/users/18614-kodegadulo
// @version    1.0
// @description  Gets rid of spurious br nodes in doHTML
// @include    https://www.tapatalk.com/groups/dozensonline/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39062/Tapatalk%20DozensOnline%20Whitespace%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/39062/Tapatalk%20DozensOnline%20Whitespace%20Cleanup.meta.js
// ==/UserScript==

(function() {
  	console.log("Tapatalk DozensOnline Whitespace Cleanup");
    var iframes = document.querySelectorAll('iframe[sandbox]')
    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var bodyNode = iframe.contentDocument.body;
        var breaklines = bodyNode.querySelectorAll('br');
        for (var j = 0; j < breaklines.length; j++) {
            var breakline = breaklines[j];
            var parent = breakline.parentElement;
            if (parent.nodeName == "BODY" || parent.nodeName == "P") {
	            parent.removeChild(breakline);
            }
        }
      	iframe.style.height = ($(bodyNode).height()+100) + "px";
    }
})();