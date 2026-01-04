// ==UserScript==
// @name         JointoReveal
// @namespace    bountyreveal.zero.torn
// @version      0.1
// @description  Filters bounty and adds quick chat
// @author       -zero [2669774]
// @match        https://www.torn.com/bounties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471527/JointoReveal.user.js
// @updateURL https://update.greasyfork.org/scripts/471527/JointoReveal.meta.js
// ==/UserScript==

const api = "3nTeRYoURAp1K3Y";
const pastedText = "Hi, I see you have a high value anonymous bounty on you, ... if you need I'm here to try to reveal the bounty placer for you. It cost 4m or 4xanax";

const userId= '2877210';

const wsURL = 'wss://ws-chat.torn.com/chat/ws' + '?uid=' + userId + "&secret=" + $('script[secret]').attr("secret");
let socket  = new WebSocket(wsURL);


async function hide() {
    if ($(".bounties-list > li").length < 5) {
        setTimeout(hide, 300);
        return;
    }

    $(".bounties-list > li").each(async function () {
        const slot = $(this);
        const listed = $(".listed > a", $(this));

        // console.log($(slot));
        if (listed.length > 0) {
            $(slot).hide();

        }
        else {
            if ($(".target > a", $(this)).length > 0) {
                const targetid = $(".target > a", $(this)).attr("href").split("XID=")[1];
                const online = await checkOnline(targetid);
                if (!online) {
                    $(slot).hide();
                }
                else{
                    $(".level", $(slot)).wrap(`<a id=${targetid}-chat></a>`);
                    $(`#${targetid}-chat`).on("click", function(){
                        console.log('sending');
                        var data = `{"proc":"rooms/create","data":{"user":["${targetid}"]},"v":4}`;
                        socket.send(data);

                    });

                }

            }
        }

    });

}

function paste(){

    $("textarea").each(function(){
        $(this).off("click");
        $(this).on("click",function(){
            const body = $(this);
            body.val(pastedText);

        })
    });
}

setInterval(paste,400);

async function checkOnline(targetid) {
    const data = await $.getJSON(`https://api.torn.com/user/${targetid}?selections=&key=${api}`);
    if (data.last_action.status == "Online") {
        return true;
    }
    return false;
}

setTimeout(hide, 1000);
$(window).on('hashchange', function(e){
    setTimeout(hide, 1000);

});
