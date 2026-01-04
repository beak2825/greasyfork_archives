// ==UserScript==
// @name         Todayhumor WS hotkey fix
// @version      0.1
// @description  try to take over the world!
// @author       Mango
// @include      *todayhumor.co.kr*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/154938
// @downloadURL https://update.greasyfork.org/scripts/33740/Todayhumor%20WS%20hotkey%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/33740/Todayhumor%20WS%20hotkey%20fix.meta.js
// ==/UserScript==

function scrollSmooth(total,step,direction)
{
    window.scrollBy(0, direction*step);
    if (total - step > 0)
        setTimeout(function() {
            scrollSmooth(total - step,step,direction);
        }, 10);
}

document.body.onkeyup = function(e){
    if(e.keyCode == 87){
        //Up
        scrollSmooth(window.innerHeight*0.7,40,-1);
    }
    if(e.keyCode == 83){
        //Down
        scrollSmooth(window.innerHeight*0.7,40,1);
    }
};