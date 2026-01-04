// ==UserScript==
// @name     GameFAQs Daily Poll Radio Buttons
// @description Changes GameFAQs Poll to use radio button display
// @version  1.2
// @grant    none
// @include https://gamefaqs.gamespot.com/
// @namespace https://greasyfork.org/users/5885
// @downloadURL https://update.greasyfork.org/scripts/380985/GameFAQs%20Daily%20Poll%20Radio%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/380985/GameFAQs%20Daily%20Poll%20Radio%20Buttons.meta.js
// ==/UserScript==
function potd_radio_buttons() {
    var po_blocks = document.getElementsByClassName('po_block');
    var selected = false;
    var disable_buttons = false;
    var disabled = document.getElementsByClassName('po_disabled');
    if (disabled.length > 0) {
        disable_buttons = true;
    }
    for (var i = 0; i < po_blocks.length; i++) {
        if (!disable_buttons) {
            po_blocks[i].addEventListener("click", potd_radio_buttons);
        }
        var po_box = po_blocks[i].getElementsByClassName('po_box')[0];
        if (po_box.textContent == '☒' || po_box.textContent == '☑') {
            selected = true;
        } else {
            selected = false;
        }
        po_box.textContent = '';
        var input = document.createElement('input');
        input.setAttribute("type", "radio");
        input.setAttribute("name", "gfaqs_poll");
        if (disable_buttons) {
            input.setAttribute("disabled", "disabled");
        }
        if (selected) {
            input.setAttribute("checked", "checked");
        }
        po_box.appendChild(input);
    }
}
potd_radio_buttons();