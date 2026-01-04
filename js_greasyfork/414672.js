// ==UserScript==
// @name        commands
// @namespace   https://greasyfork.org/users/399368
// @version     0.5b1
// @description chat commands
// @author      trulalilu
// @match       https://*.the-west.ru/game*
// @match       https://*.the-west.net/game*
// @include     https://*.the-west.ru/game*
// @include     https://*.the-west.net/game*
// @exclude     https://*.the-west.ru
// @exclude     https://*.the-west.ru/null
// @exclude     https://*.the-west.net
// @exclude     https://*.the-west.net/null
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/414672/commands.user.js
// @updateURL https://update.greasyfork.org/scripts/414672/commands.meta.js
// ==/UserScript==
//"use strict";

(function(fn){
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(()=>{ $(document).ready(function(){
    document.onkeyup = function(e){
        let keyCode = e.keyCode,
            active_chat_input = $('.chat_1 input.message:visible'),
            char_name = $('.fort_battle_infoarea > .recruitlist_name');
        if((char_name.length === 0) || ( char_name.text() === Character.name)){
            return;
        };
        for(let i = 0; i < $('input').length; i++){
            if(document.activeElement === $('input')[i]){
                return;
            };
        };
        switch (keyCode){
            case 16:// Shift
                active_chat_input.val('*' + char_name.text() + '* смена с ');
                active_chat_input.focus();
                break;
            case 17:// Ctrl
                active_chat_input.val(active_chat_input.val() + '*' + char_name.text() + '* ');
                active_chat_input.focus();
                break;
            case 8: { // Backspace
                let charId = char_name.html().split('(')[1].split(')')[0],
                    client = Chat.Resource.Manager.getClient('client_' + charId),
                    room = Chat.Resource.Manager.acquireRoom(client);
                room.openClick();
                active_chat_input.focus();
                break;
            };
            default:
                return;
                break;
        };
    };
})});