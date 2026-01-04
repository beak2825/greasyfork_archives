// ==UserScript==
// @name         Penny-Arcade Forums Delete Draft Button
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.2
// @description  Add a Delete Draft button to forum threads.
// @match        https://forums.penny-arcade.com/discussion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37964/Penny-Arcade%20Forums%20Delete%20Draft%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/37964/Penny-Arcade%20Forums%20Delete%20Draft%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('<a href="#" id="delmain_deletedraft" class="Button">Delete Draft</a>').insertBefore('#Form_Comment .Buttons .Button.DraftButton');
        $('#delmain_deletedraft').click(function() {
            var draftID = $('#Form_DraftID').val();
            var transientKey = $('#Form_TransientKey').val();
            if(draftID && transientKey) {
                var deleteURL = '/vanilla/drafts/delete/' + draftID + '/' + transientKey;
                $.get(deleteURL)
                    .done(function() {
                        $('#Form_Body').val('');
                        gdn.informMessage('Draft deleted!');
                    })
                    .fail(function(j, s, e) {
                        if(e === 'Not Found') {
                            gdn.informMessage('No draft to delete!');
                        }
                        else
                        {
                            gdn.informMessage('Error encountered in deleting draft.');
                        }
                    })
                    .always(function() {
                        $('#Form_Body').focus();
                    });
            }
            else
            {
                gdn.informMessage('No draft to delete!');
            }
        });
    });
})();