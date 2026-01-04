// ==UserScript==
// @name        commands (alternative)
// @namespace   https://greasyfork.org/users/399368
// @version     0.5b
// @description chat commands
// @author      trulalilu
// @match       https://*.the-west.*/game*
// @include     https://*.the-west.*/game*
// @exclude     https://*.the-west.*/
// @exclude     https://*.the-west.*/null
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/415550/commands%20%28alternative%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415550/commands%20%28alternative%29.meta.js
// ==/UserScript==
//"use strict";

(function(fn){
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(()=>{ $(document).ready(function(){
    document.addEventListener('keyup', function(event){
        let key = event.key,
            active_chat_input = $('.chat_1 input.message:visible'),
            char_name = $('.fort_battle_infoarea > .recruitlist_name'),
            char_name_ = char_name;
        char_name = char_name.text();
////             Этот код для тестирования. playerprofile-title-player - открытое окно профиля игрока
//             char_name = $('div.playerprofile-title-player:visible').contents().filter(function(){
//                 return this.nodeType === 3;
//             }).text().trim();
        for(let i = 0; i < $('input').length; i++){
            if(document.activeElement === $('input')[i]) return;
        };
        if((char_name.length === 0)||(char_name === Character.name)) return;

        let charId = function(){
            if('TWToolkit' in window){
                return char_name_.html().split('(')[1].split(')')[0];
            }else{// alliance
                let names = $('[class *= room_fortbattle_] [class *= chat_client_] span').map((indx, element) => $(element).text()); names = names.get();
                let ids = $('[class *= room_fortbattle_] [class *= chat_client_] :not("img")').parent().map((indx, element) => + $(element).attr('class').split('_')[2]); ids = ids.get();
                let names_ids = Object.assign(...names.map((n, i) => ({ [n]: ids[i] })));
//                 console.log(names_ids);
                return names_ids[char_name];
            };
        };
        switch (key){
            case 'Shift':
                active_chat_input.val('*' + char_name + '* смена с ');
                break;
            case 'Control':
                active_chat_input.val(active_chat_input.val() + '*' + char_name + '* ');
                break;
            case 'Backspace': {
                let client = Chat.Resource.Manager.getClient('client_' + charId()),
                    room = Chat.Resource.Manager.acquireRoom(client);
                room.openClick();
                active_chat_input.focus();
                break;
            };
            default:
                return;
                break;
        };
    });
});});