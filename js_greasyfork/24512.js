// ==UserScript==
// @name         Halloween Reactions Restored for Facebook
// @namespace    http://kippykip.com/
// @version      1.4.1
// @description  On Halloween, Facebook brought new reactions. Now that Halloween is over they've been reverted back. This script brings all the Halloween reactions back!
// @author       Kippykip
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24512/Halloween%20Reactions%20Restored%20for%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/24512/Halloween%20Reactions%20Restored%20for%20Facebook.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//Original URL for historical purposes
//https://www.facebook.com/rsrc.php/v3/yV/r/SIAGSQsaHtX.png

//All the class codes, these may change in the future
var CODE_Like = '._3j7l';
var CODE_Love = '._3j7m';
var CODE_Haha = '._3j7o';
var CODE_Wow = '._3j7n';
var CODE_Sad = '._3j7r';
var CODE_Angry = '._3j7q';
var CODE_Popup = '._9-_';
var CODE_MiniReacts = '._9-y';
var CODE_Reacts = '._9--';
var CODE_LinkText = 'UFILikeLink';
var CODE_MiniColourBar = '_dsx';
var CODE_NotificationIMG = '_10cu img _8o _8r img';
var CODE_NotificationPopup = '_1x8t img _8o _8r img';
var CODE_ReactionsFullview = '_ds- _45hc';
//This just searches part of the filename, then it replaces the whole thing
var CODE_NotificationLove = 'RvGKklgAefT';
var CODE_NotificationHaha = 'McJA2ZjdJmf';
var CODE_NotificationWow = 'IfsimazVjj4';
var CODE_NotificationSad = 'jOeSrGlcPLG';
var CODE_NotificationAngry = '6K8v8Ju8kL2';
//Replacement Content
var CODE_ReactURL = 'https://i.imgur.com/jf3C3qG.png';
var CODE_NotificationLoveRURL = 'https://i.imgur.com/9hZJYkP.png';
var CODE_NotificationHahaRURL = 'https://i.imgur.com/Y3XqgNt.png';
var CODE_NotificationWowRURL = 'https://i.imgur.com/P1KHOfJ.png';
var CODE_NotificationSadRURL = 'https://i.imgur.com/mBIrzzn.png';
var CODE_NotificationAngryRURL = 'https://i.imgur.com/CNF4A5k.png';

//Replace the reaction bar images and... that's it.
//Like
//addGlobalStyle(CODE_Like + '{background-image:url(' + CODE_MiniReactURL + ') !important;background-repeat:no-repeat;background-position:0 -557px !important}');
addGlobalStyle(CODE_Popup + CODE_Like + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 -98px !important}');

//Love
addGlobalStyle(CODE_MiniReacts + CODE_Love + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-34px -438px !important}');
addGlobalStyle(CODE_Reacts + CODE_Love + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-17px -557px !important}');
addGlobalStyle(CODE_Popup + CODE_Love + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 -147px !important}');

//Haha
addGlobalStyle(CODE_MiniReacts + CODE_Haha + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-35px -325px !important}');
addGlobalStyle(CODE_Reacts + CODE_Haha + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-17px -540px !important}');
addGlobalStyle(CODE_Popup + CODE_Haha + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 -49px !important}');

//Wow
addGlobalStyle(CODE_MiniReacts + CODE_Wow + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-34px -466px !important}');
addGlobalStyle(CODE_Reacts + CODE_Wow + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-17px -574px !important}');
addGlobalStyle(CODE_Popup + CODE_Wow + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 -245px !important}');

//Sad
addGlobalStyle(CODE_MiniReacts + CODE_Sad + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-34px -452px !important}}');
addGlobalStyle(CODE_Reacts + CODE_Sad + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:0 -574px !important}}');
addGlobalStyle(CODE_Popup + CODE_Sad + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 -196px !important}');

//Angry
addGlobalStyle(CODE_MiniReacts + CODE_Angry + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:-35px -311px !important}');
addGlobalStyle(CODE_Reacts + CODE_Angry + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-position:0 -540px !important}');
addGlobalStyle(CODE_Popup + CODE_Angry + '{background-image:url(' + CODE_ReactURL + ') !important;background-repeat:no-repeat;background-size:auto;background-position:0 0 !important}');

//Changes the link colour
function SetLinkColours()
{
    for(var i = 0; i < document.getElementsByClassName(CODE_LinkText).length; i++)
    {
        var TMP_Class = document.getElementsByClassName(CODE_LinkText)[i];
        //If it contains the name of the reaction
        //Sad
        if(TMP_Class.innerHTML.indexOf("Sad") > -1)
        {
            //THEN replace it, otherwise it replaces all colours
            TMP_Class.style.color = "rgb(95,144,40)";
        }
        //Wow
        if(TMP_Class.innerHTML.indexOf("Wow") > -1)
        {
            //THEN replace it, otherwise it replaces all colours
            TMP_Class.style.color = "rgb(127,127,127)";
        }
        //Haha
        if(TMP_Class.innerHTML.indexOf("Haha") > -1)
        {
            //THEN replace it, otherwise it replaces all colours
            TMP_Class.style.color = "rgb(87,64,155)";
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
            //rgb(240, 186, 21) is the default yellow colour
            if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-label').indexOf('Haha') > -1)
            {
                if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color == 'rgb(240, 186, 21)')
                {
                    TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color = "rgb(87,64,155)";
                    TMP_Classi.style.background = "rgb(87,64,155)";
                }
            }
            if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-label').indexOf('Wow') > -1)
            {
                if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color == 'rgb(240, 186, 21)')
                {
                    TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color = "rgb(127,127,127)";
                    TMP_Classi.style.background = "rgb(127,127,127)";
                }
            }
            if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-label').indexOf('Sad') > -1)
            {
                if(TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color == 'rgb(240, 186, 21)')
                {
                    TMP_Classii[ii].childNodes[0].childNodes[0].childNodes[0].style.color = "rgb(95,144,40)";
                    TMP_Classi.style.background = "rgb(95,144,40)";
                }
            }
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
        //Like is the same in the halloween one, no need to replace
        //Love
        if(TMP_Class[i].src.indexOf(CODE_NotificationLove) > -1)
        {
            TMP_Class[i].src = CODE_NotificationLoveRURL;
        }
        //Haha
        if(TMP_Class[i].src.indexOf(CODE_NotificationHaha) > -1)
        {
            TMP_Class[i].src = CODE_NotificationHahaRURL;
        }
        //Wow
        if(TMP_Class[i].src.indexOf(CODE_NotificationWow) > -1)
        {
            TMP_Class[i].src = CODE_NotificationWowRURL;
        }
        //Sad
        if(TMP_Class[i].src.indexOf(CODE_NotificationSad) > -1)
        {
            TMP_Class[i].src = CODE_NotificationSadRURL;
        }
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
        //Like is the same in the halloween one, no need to replace
        //Love
        if(TMP_Classi[ii].src.indexOf(CODE_NotificationLove) > -1)
        {
            TMP_Classi[ii].src = CODE_NotificationLoveRURL;
        }
        //Haha
        if(TMP_Classi[ii].src.indexOf(CODE_NotificationHaha) > -1)
        {
            TMP_Classi[ii].src = CODE_NotificationHahaRURL;
        }
        //Wow
        if(TMP_Classi[ii].src.indexOf(CODE_NotificationWow) > -1)
        {
            TMP_Classi[ii].src = CODE_NotificationWowRURL;
        }
        //Sad
        if(TMP_Classi[ii].src.indexOf(CODE_NotificationSad) > -1)
        {
            TMP_Classi[ii].src = CODE_NotificationSadRURL;
        }
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