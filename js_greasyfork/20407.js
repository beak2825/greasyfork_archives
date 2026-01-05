// ==UserScript==
// @name         NewVoiceMedia ContactPad Keyboard Shortcuts
// @namespace    https://www.newvoicemedia.com
// @version      0.1
// @description  ContactPad State Change Keyboard Shortcuts. Use the number keys on the top row to change state. Use shift to add 10 to the key pressed.
// @author       Jack Tench, NewVoiceMedia
// @match        https://*.contact-world.net/CallCentre/ServiceCloud/AgentInterface*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20407/NewVoiceMedia%20ContactPad%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/20407/NewVoiceMedia%20ContactPad%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var stateButtons = $("[id^=stateButton]");
    $("#agentStateDropDown").click(function() {
        if($("[id^=stateButton]")[0].text.startsWith('1')) {
            return;
        }
        var count = 0;
        $("[id^=stateButton]").each(function() {
            count ++;
            $(this).prepend(count + ' ');
        });
    });
    $(window).keydown (function keyboardHandler (event) {
        if ($(':focus').is("input")) {
            return;
        }
        if(event.which < 49 || event.which > 57) {
            return;
        }
        var keyNum = event.which - 48;
        if (event.shiftKey) {
            keyNum += 10;
        }
        console.log('Shortcut pressed ' + keyNum);
        $("[id^=stateButton]")[keyNum - 1].click();
    });
})();