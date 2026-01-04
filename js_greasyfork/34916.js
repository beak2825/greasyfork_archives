// ==UserScript==
// @name        Homebrew Button
// @namespace   PolllyPecker
// @include     https://www.instagram.com/p/*
// @version     3.1
// @description Adds raw image button for instagram
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34916/Homebrew%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/34916/Homebrew%20Button.meta.js
// ==/UserScript==

var shift_down = false;
var new_tab_override = false;

if (window.attachEvent) {window.attachEvent('onload', doTheDew);}
else if (window.addEventListener) {window.addEventListener('load', doTheDew, false);}
else {document.addEventListener('load', doTheDew, false);}

function doTheDew()
{
    var containerDiv = document.createElement('div');
    containerDiv.style.position="absolute";
    containerDiv.style.display="block";
    containerDiv.style.width="100%";
    containerDiv.style.height="25px";
    containerDiv.style.bottom="-11px";
    containerDiv.style.zIndex="999";
    containerDiv.style.borderRadius="25px";
    document.getElementsByTagName("header")[0].appendChild(containerDiv);

    var button_0 = document.createElement('button');
    button_0.type = "button";
    button_0.onmousedown = grabberButtonPressed;
    button_0.id = "img_but0";
    button_0.style.width="35%";
    button_0.style.height="25px";
    button_0.style.backgroundColor="lightsteelblue";
    button_0.style.borderRadius="25px 0 0 25px";
    containerDiv.appendChild(button_0);

    var button_0b = document.createElement('button');
    button_0b.type = "button";
    button_0b.onmousedown = grabberButtonPressed;
    button_0b.id = "img_but1";
    button_0b.style.width="15%";
    button_0b.style.height="25px";
    button_0b.style.backgroundColor="#58739E";
    containerDiv.appendChild(button_0b);

    var button_1b = document.createElement('button');
    button_1b.type = "button";
    button_1b.onmousedown = grabberButtonPressed;
    button_1b.id = "vid_but1";
    button_1b.style.width="15%";
    button_1b.style.height="25px";
    button_1b.style.backgroundColor="darkslateblue";
    containerDiv.appendChild(button_1b);

    var button_1 = document.createElement('button');
    button_1.type = "button";
    button_1.onmousedown = grabberButtonPressed;
    button_1.id = "vid_but0";
    button_1.style.width="35%";
    button_1.style.height="25px";
    button_1.style.backgroundColor="#8673C6";
    button_1.style.borderRadius="0 25px 25px 0";
    containerDiv.appendChild(button_1);
}

function grabberButtonPressed(event)
{
    var caller_id = event.currentTarget.id;
    new_tab_override = caller_id.indexOf("1") > -1;
    if (caller_id == "img_but0" || caller_id == "img_but1")
    {
        // Get Image
        getImage();
    }
    else if (caller_id == "vid_but0" || caller_id == "vid_but1")
    {
        // Get Vid
        getVideo();
    }
    new_tab_override = false; // reset the toggle
}

document.addEventListener('keydown', checkKey, false);
document.addEventListener('keyup', checkKeyup, false);

function getImage() {
    var contain = document.getElementsByClassName("KL4Bh")[0].getElementsByTagName("img");
    var newURL = contain[0].src;
    if (!shift_down && !new_tab_override)
    {
        window.location.href = newURL;
    }
    else
    {
        window.open(newURL, '_blank');
        shift_down = false;
    }
}
function getVideo() {
    var newURL = document.getElementsByTagName("video")[0].src;
    if (!shift_down && !new_tab_override)
    {
        window.location.href = newURL;
    }
    else
    {
        window.open(newURL, '_blank');
        shift_down = false;
    }
}

function checkKeyup(event)
{
    event = event || window.event;
    if (event.keyCode=='16') shift_down = false; // [SHIFT]
}
function checkKey(event)
{
    event = event || window.event;
    if (event.keyCode=='67') getImage(); // [C]
    else if (event.keyCode=='86') getVideo(); // [V]
    else if (event.keyCode=='16') shift_down = true; // [SHIFT]
}