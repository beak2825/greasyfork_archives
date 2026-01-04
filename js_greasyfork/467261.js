// ==UserScript==
// @name         Advanced Chat
// @namespace    zero.advchat.torn
// @version      0.1
// @description  Chat direct
// @author       -zero [2669774]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467261/Advanced%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/467261/Advanced%20Chat.meta.js
// ==/UserScript==

var userId= '1778676';

const wsURL = 'wss://ws-chat.torn.com/chat/ws' + '?uid=' + userId + "&secret=" + $('script[secret]').attr("secret");
let socket  = new WebSocket(wsURL);

function insert(){


    if ($('.user-info-list-wrap > li').length > 1) {
        $('.user-info-list-wrap > li').each(function(){
            var item = $(this);
            console.log($('.user-info-list-wrap > li'));
            if (item.hasClass('tt-hidden')) {
                return;
            }
            var id = $('.user.name', item).attr('href').split('?XID=')[1];
            id = id.trim();
            if (id){
                var button = `<button id="${id}zerochat" class="torn-btn" style="float:right;">Chat</button>`;
                if ($(`#${id}zerochat`).length == 0){
                    $('.expander', item).append(button);
                    $(`#${id}zerochat`).on('click',function(){
                        console.log('Sending');
                        var data = `{"proc":"rooms/create","data":{"user":["${id}"]},"v":4}`;
                        socket.send(data);

                    });

                }


            }

        });
    }
    else{
        setTimeout(insert, 500);
    }
}

socket.onopen = function(e) {
    console.log("[open] Connection established");
    insert();
};

$(window).on('hashchange', function(e){
    insert();

});


