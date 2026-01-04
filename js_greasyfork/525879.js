// ==UserScript==
// @name         Neopets Neomail Manager
// @version      1.0
// @description  Adds a checkbox to mark "spammy" neomail messages for deletion (you still need to click "Go" to confirm the action).
// @author       darknstormy
// @match        https://www.neopets.com/neomessages.phtml*folder=Inbox
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1328929
// @downloadURL https://update.greasyfork.org/scripts/525879/Neopets%20Neomail%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/525879/Neopets%20Neomail%20Manager.meta.js
// ==/UserScript==

addSpamCheckbox()

function checkSpamMessages(markForDeletion) {
    var spamMessagesFound = false

    $('form[name="messages"] table tr td:nth-child(4) a').each(function() {
        var messageSubject = $(this).prop("innerText") // remove the <b> tags for comparing our subjects to the spam filter

        if (SPAM_SUBJECT_LINES.find((element) => messageSubject === element)) {
            $(this).parent().parent().find("td:nth-child(1) input").prop('checked', markForDeletion);
            spamMessagesFound = true
        }
    });

    if (!spamMessagesFound) {
        return
    }

    if (markForDeletion) {
        $('select[name="action"]').val("Delete Messages").change()
    } else {
        $('select[name="action"]').val('').change()
    }
}

function addSpamCheckbox() {
    $('form[name="messages"] table tr:last td:last').attr('colspan',2);
    $('form[name="messages"] table tr:last td:first').after('<td colspan="1" bgcolor="#DEDEDE" align="left" valign="middle"><input type="checkbox" name="check_spam"> Check Spam</td>')
    $('input[name="check_spam"]').on('click', function () {
        checkSpamMessages($(this).is(":checked"))
    })
}

const SPAM_SUBJECT_LINES = [
    "Special Reward Unlocked!",
    "Faerie Fragments Reward Unlocked!",
    "Hi"
]

