// ==UserScript==
// @name        Twitch.tv - Hide left bar / enlarge chat output / resize video player
// @namespace   Twitch.tv
// @description Adds the crapz: 
//              - Hide the Channel and friends bar to the left (Press KEY F1).
//              - Enlarge the chat output by hiding the input box / channel select / pinned cheers (Press KEY F2) 
//              - Resize the player, as a space for additional chat tools (Press KEY F4 for a percentage input or F8/F9 for a decrease/increase by 1%)
// @include     https://www.twitch.tv/*
// @grant       all
// @run-at	    document-end
// @version 0.0.1.20190114012148
// @downloadURL https://update.greasyfork.org/scripts/376511/Twitchtv%20-%20Hide%20left%20bar%20%20enlarge%20chat%20output%20%20resize%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/376511/Twitchtv%20-%20Hide%20left%20bar%20%20enlarge%20chat%20output%20%20resize%20video%20player.meta.js
// ==/UserScript==
// HELP SOURCES :
//   - https://stackoverflow.com/questions/24028225/addeventlistener-keypress-wont-work
//   - https://developer.mozilla.org/en-US/docs/Web/Events/keydown
//   - https://www.w3schools.com/jsref/met_win_prompt.asp
//   - https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
//   - https://stackoverflow.com/questions/462537/overriding-important-style/1577204#1577204

var videoenlargestatus = false;
window.addEventListener("keydown", leftbar, false);


function leftbar (Taste)
{
    switch (Taste.code) 
    {
        case "F1":
                if (videoenlargestatus == false)
                {
                var videoplayerenlargevar = document.getElementsByClassName("channel-root")[0];
                videoplayerenlargevar.setAttribute('style','padding: 2px!important');
                videoenlargestatus = true;  
                }
            
            var leftbarvar = document.getElementsByClassName("side-nav")[0];
                
                if (leftbarvar.style.display == "none")
                {
                leftbarvar.style.display = "block";
                }
                else
                {
                leftbarvar.style.display = "none";
                }
            break;
        case "F4":
            var persistentplayervar = document.getElementsByClassName("persistent-player")[0];
            var persistentplayervarsize = persistentplayervar.style.width.replace('%','');

            var promptvar = prompt("Player size in percent (Press cancel for default size)", persistentplayervarsize);

                if (promptvar != null)
                {
                promptvar = promptvar.replace("%","");

                    if (promptvar > 100 || promptvar < 1)
                    {
                    alert("Size must be between 1 and 100");
                    }
                    else
                    {
                    persistentplayervar.style.width = promptvar + "%";
                    }
                }
                else
                {
                persistentplayervar.style.width = "100%";
                }
            break;
        case "F8":
            var persistentplayervar = document.getElementsByClassName("persistent-player")[0];
            var persistentplayervarsize = persistentplayervar.style.width.replace('%','');

                if (persistentplayervarsize > 1)
                {
                var temp = Number(persistentplayervarsize) - 1;
                persistentplayervar.style.width = temp + "%";
                }
            break;
        case "F9":
            var persistentplayervar = document.getElementsByClassName("persistent-player")[0];
            var persistentplayervarsize = persistentplayervar.style.width.replace('%','');

                if (persistentplayervarsize < 100)
                {
                var temp = Number(persistentplayervarsize) + 1;
                persistentplayervar.style.width = temp + "%";
                }
            break;
        case "F2":
            var chatroomselect2var = document.getElementsByClassName("video-chat__header")[0];

                if (chatroomselect2var != null)
                {
                var chatinput2var = document.getElementsByClassName("video-chat__input")[0];

                    if (chatroomselect2var.getAttribute('style','display') == "display: none!important")
                    {
                    chatroomselect2var.setAttribute('style', 'display: block!important');
                    chatinput2var.setAttribute('style', 'display: block!important');
                    }
                    else
                    {
                    chatroomselect2var.setAttribute('style', 'display: none!important');
                    chatinput2var.setAttribute('style', 'display: none!important');
                    }    
                }
                else
                {
                var chatinputvar = document.getElementsByClassName("chat-input")[0];         
                var chatroomselectvar = document.getElementsByClassName("room-selector__header")[0];
                var chatpinnedcheervar = document.getElementsByClassName("pinned-cheer-v2")[0];

                    if (chatinputvar.getAttribute('style','display') == "display: none!important")
                    {
                    chatinputvar.setAttribute('style', 'display: block!important');
                    chatroomselectvar.setAttribute('style', 'display: block!important');
                    chatpinnedcheervar.setAttribute('style', 'display: block!important');
                    }
                    else
                    {
                    chatinputvar.setAttribute('style', 'display: none!important');
                    chatroomselectvar.setAttribute('style', 'display: none!important');
                    chatpinnedcheervar.setAttribute('style', 'display: none!important');
                    }
                }
    }
}