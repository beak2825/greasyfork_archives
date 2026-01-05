// ==UserScript==
// @name       twitchPlaysDarkFilterChat
// @namespace   twitchPlaysDarkFilterChat
// @include     *.twitch.tv/twitchplaysdark
// @include     *.twitch.tv/twitchplaysdark/chat?popout=
// @version     0.95
// @description A script to filter out the chat commands in Twitch Plays Dark Souls
// @downloadURL https://update.greasyfork.org/scripts/11704/twitchPlaysDarkFilterChat.user.js
// @updateURL https://update.greasyfork.org/scripts/11704/twitchPlaysDarkFilterChat.meta.js
// ==/UserScript==
//
var filterActive = false;
var toBeFiltered= [
    "arl",
    "ar",
    "al",
    "d",
    "ard",
    "aru",
    "arr",
    "m",
    "e", 
    "bs",
    // hold
    "hold",
    "holdx2",
    "holdx3",
    "thold",
    "tholdx2",
    "tholdx3",
    // running
    "run",
    "runt",
    // flong
    "tflong",
    "tflongx2",
    "tflongx3",
    "tfshort",
    "tfshortx2",
    "tfshortx3",
    "flong",
    "flongx2",
    "flongx3",
    "fshort",
    "fshortx2",
    "fshortx3",
    // walking movement
    "tfx3",
    "tfrx3",
    "tflx3",
    "tbx3",
    "tbrx3",
    "tblx3",
    "tlx3",
    "trx3",
    "tfx2",
    "tfrx2",
    "tflx2",
    "tbx2",
    "tbrx2",
    "tblx2",
    "tlx2",
    "trx2",
    "tf",
    "tfr",
    "tfl",
    "tb",
    "tbr",
    "tbl",
    "tl",
    "tr",
    "fx3",
    "frx3",
    "flx3",
    "bx3",
    "brx3",
    "blx3",
    "lx3",
    "rx3",
    "fx2",
    "frx2",
    "flx2",
    "bx2",
    "brx2",
    "blx2",
    "lx2",
    "rx2",
    "f",
    "fr",
    "fl",
    "b",
    "br",
    "bl",
    "l",
    "r",
    // rolling movement
    "rf",
    "rb",
    "rl",
    "rr",
    "rfx2",
    "rbx2",
    "rlx2",
    "rrx2",
    "rfx3",
    "rbx3",
    "rlx3",
    "rrx3",
    "trf",
    "trb",
    "trl",
    "trr",
    "trfx2",
    "trbx2",
    "trlx2",
    "trrx2",
    "trfx3",
    "trbx3",
    "trlx3",
    "trrx3",
    // face buttons
    "u",
    "tu",
    "g",
    "d",
    "a",
    "ax2",
    "ax3",
    "ta",
    "tax2",
    "tax3",
    // D-pad
    "du",
    "dd",
    "dl",
    "dr",
    "lr",
    // kicks
    "kick",
    "k",
    "kx2",
    "kx3",
    "tk",
    "tkx2",
    "tkx3",
    // jump attacks
    "jumpattack",
    "ja",
    "jax2",
    "jax3",
    "tja",
    "tjax2",
    "tjax3",
    // shoulder buttons
    "tr1t",
    "tr2t",
    "tr1x2t",
    "tr1x3t",
    "tr2x2t",
    "tr2x3t",
    "r1t",
    "r2t",
    "r1x2t",
    "r2x2t",
    "r1x3t",
    "r2x3t",
    "tl1t",
    "tl2t",
    "tl1x2t",
    "tl1x3t",
    "tl2x2t",
    "tl2x3t",
    "l1t",
    "l2t",
    "l1x2t",
    "l2x2t",
    "l1x3t",
    "l2x3t",
    "tr1",
    "tr2",
    "tr1x2",
    "tr1x3",
    "tr2x2",
    "tr2x3",
    "r1",
    "r2",
    "r1x2",
    "r2x2",
    "r1x3",
    "r2x3",
    "tl1",
    "tl2",
    "tl1x2",
    "tl1x3",
    "tl2x2",
    "tl2x3",
    "l1",
    "l2",
    "l1x2",
    "l2x2",
    "l1x3",
    "l2x3",
    //
    "left",
    "right",
    "fwd",
    "back",
    "democracy",
    "order",
    "demo",
    "anarchy",
    "menubutton",
    "banmenu",
    "unbanmenu",
    "banm",
    "chaos",
    "unbanm",
    "delaydn",
    "delayup"
];
var chatParent = document.getElementsByClassName("chat-lines")[0];
var interval;

function filterChat(event){
    if(event.target.children == undefined)
    {
        return;
    }
    var message = event.target.children[0].children[5].innerHTML;
    message = message.toUpperCase().replace(/\s+/g, '');
    var compare;
    for(x=0;x<toBeFiltered.length;x++)
    {
        compare = toBeFiltered[x].toUpperCase().replace(/\s+/g, '').substr(0,message.length);
        
        if(message === compare){
            chatParent.removeChild(event.target);
            break;
        }
    }
}

function checkIfLoaded()
{	
	chatParent = document.getElementsByClassName("chat-lines")[0];
	try{chatParent.children}
	catch(err)
	{
	return;
	}
chatParent.addEventListener("DOMNodeInserted",filterChat);
window.clearInterval(interval);
}

interval = window.setInterval(checkIfLoaded,20);