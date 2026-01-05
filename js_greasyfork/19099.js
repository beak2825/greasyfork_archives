// ==UserScript==
// @name         YouTube Intro Skipper
// @namespace    http://www.diamonddownload.weebly.com
// @version      0.1
// @description  Skip youtubers long intros with set-up rules (coded)
// @author       R.F Geraci
// @include      *youtube.*/watch?v=*
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?71631
// @grant        none
// @runat        document-body
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/19099/YouTube%20Intro%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/19099/YouTube%20Intro%20Skipper.meta.js
// ==/UserScript==

var EXS = 'YouTube Intro Skipper: ';
var HOTKEY = '\\';

var video = document.getElementsByTagName('video')[0];
var user = document.getElementsByClassName('yt-user-info')[0].children[0].innerText;
//YoutuberName, IntroLength (in seconds)
var IntroLengths =  ["NIkkiandJohnVLOG", 16,
                     "HouseholdHacker", 4,
                     "CrazyRussianHacker", 4,
                    ];


if (video !== undefined || user !== ''){
    Mousetrap.bind(HOTKEY, function() { skip(); });
    //  alert("You Pressed " + HOTKEY);
}else{
    console.error(EXS + 'Could not find video or username element in the HTML');  
}

function skip(){

    var user_lwr = user.toLowerCase();
    for(var i=0;i<IntroLengths.length;i++){
        if (typeof IntroLengths[i] == 'string' || IntroLengths[i] instanceof String){
            var ItrLen_lwr = IntroLengths[i].toLowerCase();
            if (ItrLen_lwr == user_lwr){
                video.currentTime += IntroLengths[i+1];
            }
        }
    }
}