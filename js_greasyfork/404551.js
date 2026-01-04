// ==UserScript==
// @name         TW OnOffSwitchter ( The West )
// @version      0.1
// @description  Switch Chat State 
// @include		   http*://*.the-west.*/game.php*
// @include		   http*://*.the-west.*.*/game.php*
// @grant        none
// @namespace https://greasyfork.org/users/577570
// @downloadURL https://update.greasyfork.org/scripts/404551/TW%20OnOffSwitchter%20%28%20The%20West%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404551/TW%20OnOffSwitchter%20%28%20The%20West%20%29.meta.js
// ==/UserScript==
function getRandomNumber(){
    return Math.floor((Math.random() * 1750) + 10);
}

var online = false;
async function createOrUpdateStatusField(newStatus)
{
    if (document.getElementById('chatStatus')) {
        document.getElementById('chatStatus').innerHTML = newStatus;
    }
    else{
        var chatStatus = document.createElement('div');

        chatStatus.setAttribute('id', 'chatStatus');
        chatStatus.innerHTML = newStatus;
        chatStatus.setAttribute('style', 'position:absolute;width:36px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:20px;background:#882255 no-repeat scroll 0px -7px');
        if(online){
            chatStatus.setAttribute('style', 'position:absolute;width:36px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:20px;background:#228855 no-repeat scroll 0px -7px');
        }
        chatStatus.onclick = function()	{
            if(online){
                online = false;
                goOffline();
                document.getElementById('chatStatus').innerHTML = "Chat";
                document.getElementById('chatStatus').setAttribute('style', 'position:absolute;width:36px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:20px;background:#882255 no-repeat scroll 0px -7px');
            }
            else{
                online = true;
                goOnline();
                document.getElementById('chatStatus').innerHTML = "Chat";
                document.getElementById('chatStatus').setAttribute('style', 'position:absolute;width:36px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:20px;background:#228855 no-repeat scroll 0px -7px');
            }
        }
        document.body.appendChild(chatStatus);
    }

}
async function refreshCharInfo() {
    CharacterWindow.open();
    await new Promise(r => setTimeout(r, 5));
    try {
        document.getElementsByClassName("tw2gui_window tw2gui_win2 character empty_title active_tab_id_overview characteroverview")[0].children[15].children[3].click();
    } catch(err){
        CharacterWindow.open();
    }
}


async function goOffline()
{
    document.cookie = "ChatState=0";
    createOrUpdateStatusField("Chat");
    refreshCharInfo();
    if(!online){
        Chat.Router.disconnect();
        await new Promise(r => setTimeout(r, (1070*15*Math.floor(8 + Math.random() * 5) + getRandomNumber())));
        goOffline();
    } else {
        goOnline();
    }
}

async function goOnline()
{
    document.cookie = "ChatState=1";
    Chat.Router.connect();
    createOrUpdateStatusField("Chat");
    await new Promise(r => setTimeout(r, (1070*15*9 + getRandomNumber())));
    Chat.Router.connect();
}
async function init()
{
    try{
        online = true;
        if(document.cookie.split("ChatState=")[1].split(";")[0] == "0")
        {
            online = false;
            goOffline();
        }
        goOnline();
    } catch(err){}
    createOrUpdateStatusField("Chat");
    await new Promise(r => setTimeout(r, (1070*5 + getRandomNumber())));
}
init();