// ==UserScript==
// @name         BlogsMarks - Add to BlogsMarks (Userscript)
// @namespace    https://blogmarks.net
// @version      0.3
// @description  Add a new Mark to BlogMarks.net by Selecting a piece of text and clicking the BlogMarks's icon which appear after the selection
// @author       Decembre
// @icon         https://icons.iconarchive.com/icons/sicons/basic-round-social/48/blogmarks-icon.png
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531137/BlogsMarks%20-%20Add%20to%20BlogsMarks%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531137/BlogsMarks%20-%20Add%20to%20BlogsMarks%20%28Userscript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var selectionIcon = null;

    document.addEventListener('selectionchange', function() {
        if (selectionIcon) {
            selectionIcon.remove();
            selectionIcon = null;
        }

        var selection = window.getSelection();
        if (selection.toString() !== '') {
            var range = selection.getRangeAt(0);
            var rect = range.getBoundingClientRect();
            selectionIcon = document.createElement('img');
            selectionIcon.src = 'https://icons.iconarchive.com/icons/sicons/basic-round-social/48/blogmarks-icon.png';
            selectionIcon.style.position = 'absolute';
            selectionIcon.style.top = (rect.top + window.scrollY) + 'px';
            selectionIcon.style.left = (rect.left + window.scrollX + rect.width) + 'px';
            selectionIcon.style.width = '32px';
            selectionIcon.style.height = '32px';
            selectionIcon.style.cursor = 'pointer';
            selectionIcon.style.zIndex = '1000';
            document.body.appendChild(selectionIcon);

            selectionIcon.addEventListener('click', function() {
                var q = selection.toString();
                var r = document.referrer;
                void(open('http://blogmarks.net/my/marks,new?mini=1' +
                    '&title=' + encodeURIComponent(document.title) +
                    '&url=' + encodeURIComponent(location.href) +
                    '&summary=' + encodeURIComponent(q) +
                    '&via=' + encodeURIComponent(r),
                    'blogmarks', 'location=no,toolbar=no,scrollbars=yes,width=350,height=450,status=no'));
            });
        }
    });
})();
