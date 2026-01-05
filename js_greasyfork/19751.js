// ==UserScript==
// @name         Thread Post Drafts
// @namespace    pxgamer
// @version      0.2
// @description  Save drafts of posts
// @author       pxgamer
// @include      *kat.cr/community/update/*/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/19751/Thread%20Post%20Drafts.user.js
// @updateURL https://update.greasyfork.org/scripts/19751/Thread%20Post%20Drafts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var threadId    = window.location.href.split('/')[5];
    var fieldArea   = $('#bbcode');
    var dataPreview = $('span.ka.ka-preview.bbedit-preview');

    $('.bbedit-toolbar').css('width', '500px');

    dataPreview.after(' <span title="Save Draft" class="ka saveDraftPX"><img src="https://pximg.xyz/images/b0d12ae13df1b376ac6557c488fb50f4.png" style="padding: 0 0 0px 2px; height: 18px; width: 18px;" /></span> <span title="Open Draft" class="ka openDraftPX"><img src="https://pximg.xyz/images/cd7c008c14979811583db3afc7b83fed.png" style="padding: 0 0 0px 2px; height: 18px; width: 18px;" /></span>');

    $('.saveDraftPX').on('click', function() {
        GM_setValue('thread_' + threadId, fieldArea.val());
    });

    $('.openDraftPX').on('click', function() {
        var saved = GM_getValue('thread_' + threadId, '');
        if (saved === '') {
            alert('No Drafts Saved for this Thread');
        }
        else {
            fieldArea.val(saved);
        }
    });
})();
