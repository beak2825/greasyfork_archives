// ==UserScript==
// @name         DeleteAllWeibo
// @namespace    http://www.n0tyet.com/
// @version      0.2
// @description  DeleteAllWeibo.
// @author       n0tyet
// @match        https://weibo.com/p/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405054/DeleteAllWeibo.user.js
// @updateURL https://update.greasyfork.org/scripts/405054/DeleteAllWeibo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let autoDelete = 1;
    window.setTimeout(function(){
        let hInterval = null;
        let deletedCount = 0;
        function updateDeletingText() {
            button.text('Deleting...[' + deletedCount.toString() + ']');
        }
        function setWaitForDeleteText(){
            button.text('Delete[' + deletedCount.toString() + ']');
        }
        function doDelete(){
            updateDeletingText();
            hInterval = window.setInterval(function() {
                if ($('a[action-type="feed_list_delete"]').length === 0) {
                    setWaitForDeleteText();
                    window.clearInterval(hInterval);
                } else {
                    deletedCount++;
                    updateDeletingText();
                    $('a[action-type="feed_list_delete"]')[0].click();
                    $('a[action-type="ok"]')[0].click();
                    if (autoDelete) {
                        $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
                    }
                }
            }, 700);
        }
        let button = $('<button>Delete</button>')
        .attr('type', 'button')
        .click(doDelete)
        .appendTo('div.gn_header');
        if (autoDelete) {
            doDelete();
        }
    }, 500);
})();

