// ==UserScript==
// @name         Replace Facebook 'Angry' with 'Dislike'
// @namespace    http://kippykip.com/
// @version      1.2.1
// @description  Makes it feel more like a dislike button!
// @author       Kippykip
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17378/Replace%20Facebook%20%27Angry%27%20with%20%27Dislike%27.user.js
// @updateURL https://update.greasyfork.org/scripts/17378/Replace%20Facebook%20%27Angry%27%20with%20%27Dislike%27.meta.js
// ==/UserScript==

//The majority of this code is just a modified version of my "Halloween Reactions Restored for Facebook" script
//It's totally R A D I C A L ironically
//You should totally get it.
//https://greasyfork.org/en/scripts/24512-halloween-reactions-restored-for-facebook

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//All the class codes, these may change in the future
var CODE_Angry = '._3j7q';
var CODE_Popup = '._9-_';
var CODE_LinkText = 'UFILikeLink';
var CODE_MiniColourBar = '_dsx';
var CODE_NotificationIMG = '_10cu img _8o _8r img';
var CODE_NotificationPopup = '_1x8t img _8o _8r img';
var CODE_ReactionsFullview = '_ds- _45hc';
var CODE_ReactionsBar = '_4sm1';
var CODE_ReactionText = '_1vea';
//This just searches part of the filename, then it replaces the whole thing
var CODE_NotificationAngry = '6K8v8Ju8kL2';
//Replacement Content
var CODE_MiniReactURL = 'https://i.imgur.com/nsOLVfB.png';
var CODE_PopupReactURL = 'https://i.imgur.com/ppM9qhP.png';
var CODE_NotificationAngryRURL = 'https://i.imgur.com/pTD0eop.png';

//Replace the reaction bar images and... that's it.
//Angry
addGlobalStyle(CODE_Angry + '{background-image:url(' + CODE_MiniReactURL + ') !important;background-repeat:no-repeat}');
addGlobalStyle(CODE_Popup + CODE_Angry + '{background-image:url(' + CODE_PopupReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 0}');

//Changes the link colour
function SetLinkColours()
{
    TMP_Class = document.getElementsByClassName(CODE_LinkText);
    for(var i = 0; i < TMP_Class.length; i++)
    {
        //If it contains the name of the reaction
        //Angry
        if(TMP_Class[i].childNodes[2] !== undefined)
        {
            if(TMP_Class[i].childNodes[2].nodeValue == "Angry")
            {
                //THEN replace it, otherwise it replaces all colours
                TMP_Class[i].childNodes[2].nodeValue = "Dislike";
                TMP_Class[i].style.color = "rgb(242,82,104)";
            }
        }
    }

    //View reactions fullscreen thingy
    //Mini bar underneath
    var TMP_Classi = document.getElementsByClassName(CODE_MiniColourBar)[0];
    //Text
    var TMP_Classii = document.getElementsByClassName(CODE_ReactionsFullview);
    for(var ii = 0; ii < TMP_Classii.length; ii++)
    {
        if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0] !== undefined)
        {
            if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-label').indexOf('Angry') > -1)
            {
                if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color == 'rgb(247, 113, 75)')
                {
                    TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color = "rgb(242,82,104)";
                    TMP_Classi.style.background = "rgb(242,82,104)";
                }
            }
        }
    }
    //Reaction Bar Text
    var TMP_Classiii = document.getElementsByClassName(CODE_ReactionsBar);
    for(var iii = 0; iii < TMP_Classiii.length; iii++)
    {
        if(TMP_Classiii[iii].innerHTML == "Angry")
        {
            TMP_Classiii[iii].innerHTML = "Dislike";
        }
    }
    //Reaction Text
    var TMP_Classiiii = document.getElementsByClassName(CODE_ReactionText);
    for(var iiii = 0; iiii < TMP_Classiiii.length; iiii++)
    {
        if(TMP_Classiiii[iiii].innerHTML == "Angry")
        {
            TMP_Classiiii[iiii].innerHTML = "Dislike";
        }
    }
}

//Replace the images in notifications too
function SetN_IMGS()
{
    //Replace the ones from the notifications button
    var TMP_Class = document.getElementsByClassName(CODE_NotificationIMG);
    for(var i = 0; i < TMP_Class.length; i++)
    {
        //Angry
        if(TMP_Class[i].src.indexOf(CODE_NotificationAngry) > -1)
        {
            TMP_Class[i].src = CODE_NotificationAngryRURL;
        }
    }
    //This is for the notifications that popup on the left side!
    var TMP_Classi = document.getElementsByClassName(CODE_NotificationPopup);
    for(var ii = 0; ii < TMP_Classi.length; ii++)
    {
        //Angry
        if(TMP_Classi[ii].src.indexOf(CODE_NotificationAngry) > -1)
        {
            TMP_Classi[ii].src = CODE_NotificationAngryRURL;
        }
    }
}

//Add event listeners
//Run the colour set function
document.addEventListener("DOMNodeInserted", SetLinkColours, false);
//Replace notification images
document.addEventListener("DOMNodeInserted", SetN_IMGS, false);